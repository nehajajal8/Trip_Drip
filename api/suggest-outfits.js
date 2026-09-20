/**
 * api/suggest-outfits.js
 *
 * For each day: LangChain writes an ideal outfit description
 * → embed with same model used at upload time
 * → cosine similarity against wardrobe embeddings in pgvector
 * → return matched items + uncovered categories (missing)
 */

import { createClient }       from "@supabase/supabase-js";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const CATEGORY_LABELS = {
  short_sleeve_top:"Short-Sleeve Top", long_sleeve_top:"Long-Sleeve Top",
  short_sleeve_outwear:"Short-Sleeve Jacket", long_sleeve_outwear:"Coat/Jacket",
  vest:"Vest", sling:"Cami/Sling", shorts:"Shorts", trousers:"Trousers",
  skirt:"Skirt", short_sleeve_dress:"Short-Sleeve Dress",
  long_sleeve_dress:"Long-Sleeve Dress", vest_dress:"Vest Dress",
  sling_dress:"Sling Dress", shoes:"Shoes", bag:"Bag", hat:"Hat", accessories:"Accessories",
};

function supabaseAdmin() {
  return createClient(
    process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY
  );
}

function cosineSimilarity(a, b) {
  if (!a || !b || a.length !== b.length) return 0;
  let dot = 0, magA = 0, magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot  += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  return dot / (Math.sqrt(magA) * Math.sqrt(magB) || 1);
}

async function embed(text) {
  if (process.env.OPENAI_API_KEY) {
    const { default: OpenAI } = await import("openai");
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const r = await client.embeddings.create({ model: "text-embedding-3-small", input: text });
    return r.data[0].embedding;
  }
  if (process.env.HUGGINGFACE_API_KEY) {
    const { HfInference } = await import("@huggingface/inference");
    const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
    const r = await hf.featureExtraction({ model: "openai/clip-vit-base-patch32", inputs: text });
    const v = Array.isArray(r) ? r : Array.from(r);
    return [...v, ...new Array(1536 - v.length).fill(0)];
  }
  return null;
}

// Build outfit description for a day using LangChain
const OUTFIT_PROMPT = ChatPromptTemplate.fromTemplate(`
You are a fashion stylist. Describe the IDEAL outfit for this day of travel.
Be specific about garment types, fabric weights, and formality. 2-3 sentences max.

Destination: {destination}
Trip style:  {tripStyle}
Day:         {dayNum}
Date:        {date}
Activities:  {activities}
Weather:     {weather}

Ideal outfit description:`);

async function generateOutfitDescription(vars) {
  if (!process.env.OPENAI_API_KEY) {
    return `A comfortable, practical outfit suitable for ${vars.tripStyle.toLowerCase()} travel in ${vars.weather}. Choose breathable fabrics and layers.`;
  }
  const { ChatOpenAI } = await import("@langchain/openai");
  const model = new ChatOpenAI({ model: "gpt-4o-mini", temperature: 0.5, openAIApiKey: process.env.OPENAI_API_KEY });
  const chain = OUTFIT_PROMPT.pipe(model).pipe(new StringOutputParser());
  return chain.invoke(vars);
}

// Required categories for a complete outfit
const OUTFIT_MUST_HAVE = ["short_sleeve_top","long_sleeve_top","sling","vest","short_sleeve_dress","long_sleeve_dress","vest_dress","sling_dress"]; // at least one top/dress
const OUTFIT_BOTTOM    = ["shorts","trousers","skirt"];
const OUTFIT_SHOES     = ["shoes"];

function findMissing(matched, allItems) {
  const cats = matched.map(m => m.category);
  const missing = [];

  const hasTop   = OUTFIT_MUST_HAVE.some(c => cats.includes(c));
  const hasBottom = OUTFIT_BOTTOM.some(c => cats.includes(c));
  const hasShoes  = OUTFIT_SHOES.some(c => cats.includes(c));
  const ownedCats = allItems.map(i => i.category);

  if (!hasTop)    missing.push({ category: "top",    label: "A top or dress",    reason: "No suitable top in your wardrobe matched this day's weather and activities." });
  if (!hasBottom && !OUTFIT_MUST_HAVE.filter(c=>["short_sleeve_dress","long_sleeve_dress","vest_dress","sling_dress"].includes(c)).some(c=>cats.includes(c)))
    missing.push({ category: "bottom", label: "Bottoms",              reason: "No matching trousers, shorts, or skirt found for this trip style." });
  if (!hasShoes)  missing.push({ category: "shoes",  label: "Suitable footwear", reason: "No footwear in your wardrobe was scored for this trip." });

  return missing;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { tripId, userId, trip } = req.body || {};
  if (!tripId || !userId) return res.status(400).json({ error: "tripId and userId required" });

  const supabase   = supabaseAdmin();
  const itinerary  = trip?.itinerary_json || [];
  const weather    = trip?.weather_json   || {};
  const destination = trip?.destination   || "destination";
  const tripStyle  = trip?.trip_style     || "Mixed";

  // ── 1. Load wardrobe ──────────────────────────────────────────
  const { data: wardrobe } = await supabase.from("wardrobe_items")
    .select("id, category, color, description, embedding, image_url, suitability_score")
    .eq("user_id", userId);

  if (!wardrobe?.length) {
    return res.status(200).json({ days: itinerary.map(d => ({ ...d, matched: [], missing: [], outfitDescription: "" })) });
  }

  // Parse stored embeddings
  const wardrobeWithVecs = wardrobe.map(item => ({
    ...item,
    vec: item.embedding ? (typeof item.embedding === "string" ? JSON.parse(item.embedding) : item.embedding) : null,
  }));

  // ── 2. For each day: generate outfit desc → embed → match ─────
  const dayResults = await Promise.all(itinerary.map(async (day, idx) => {
    const dayWeather  = weather.daily?.[idx];
    const weatherDesc = dayWeather
      ? `${Math.round(dayWeather.temperature_2m_max)}°C high, ${Math.round(dayWeather.temperature_2m_min)}°C low, ${dayWeather.precipitation_sum > 1 ? "rain likely" : "dry"}`
      : `${Math.round(weather.avgTemp || 22)}°C avg`;

    const outfitDescription = await generateOutfitDescription({
      destination, tripStyle,
      dayNum:     day.day,
      date:       day.date || `Day ${day.day}`,
      activities: (day.activities || []).join(", "),
      weather:    weatherDesc,
    });

    const queryVec = await embed(outfitDescription).catch(() => null);

    let matched = [];
    if (queryVec) {
      // Score each wardrobe item by cosine similarity
      const scored = wardrobeWithVecs
        .filter(i => i.vec)
        .map(i => ({ ...i, score: cosineSimilarity(queryVec, i.vec) }))
        .sort((a, b) => b.score - a.score);

      // Pick top 1 per category (max 4 items)
      const seen = new Set();
      matched = scored.filter(i => {
        if (seen.has(i.category)) return false;
        seen.add(i.category);
        return i.score > 0.2;
      }).slice(0, 4).map(i => ({
        id: i.id, category: i.category, color: i.color,
        image_url: i.image_url, matchScore: Math.round(i.score * 100),
        suitability_score: i.suitability_score,
        categoryLabel: CATEGORY_LABELS[i.category] || i.category,
      }));
    } else {
      // No embeddings: return top scored items by suitability
      matched = wardrobeWithVecs.slice(0, 3).map(i => ({
        id: i.id, category: i.category, color: i.color,
        image_url: i.image_url, matchScore: null,
        suitability_score: i.suitability_score,
        categoryLabel: CATEGORY_LABELS[i.category] || i.category,
      }));
    }

    const missing = findMissing(matched, wardrobe);

    return { day: day.day, date: day.date, outfitDescription, matched, missing };
  }));

  return res.status(200).json({ days: dayResults });
}