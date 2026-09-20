/**
 * api/suitability-score.js
 * Score a wardrobe item 0-10 for a specific trip (weather + style)
 * with a one-line justification. Persists score back to DB.
 */
import { createClient } from "@supabase/supabase-js";

function supabaseAdmin() {
  return createClient(
    process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY
  );
}

const SCORE_PROMPT = `You are a travel packing expert. Score this clothing item for the trip.
Return ONLY JSON: {"score": <0-10 number>, "note": "<one sentence justification>"}

Item: {description}
Trip style: {tripStyle}
Destination: {destination}
Avg temperature: {avgTemp}°C
Conditions: {conditions}

Consider: fabric weight vs weather, wrinkle resistance for travel, drying speed, formality match.`;

function mockScore(description, avgTemp) {
  const score = avgTemp > 28 ? (description.includes("long") ? 5 : 8) : (description.includes("long") ? 8 : 5);
  return { score, note: "Estimated based on item type and destination temperature." };
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { itemId, userId, trip } = req.body || {};
  if (!itemId || !userId) return res.status(400).json({ error: "itemId and userId required" });

  const supabase = supabaseAdmin();
  const { data: item, error } = await supabase.from("wardrobe_items")
    .select("description, category, color")
    .eq("id", itemId).eq("user_id", userId).single();

  if (error || !item) return res.status(404).json({ error: "Item not found" });

  const weather    = trip?.weather_json || {};
  const avgTemp    = weather.avgTemp    || 22;
  const conditions = weather.conditions || "mixed";
  const tripStyle  = trip?.trip_style   || "Mixed";
  const destination = trip?.destination || "your destination";

  let result;
  try {
    if (!process.env.OPENAI_API_KEY) throw new Error("no key");
    const { default: OpenAI } = await import("openai");
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const filled = SCORE_PROMPT
      .replace("{description}", item.description || `${item.color} ${item.category}`)
      .replace("{tripStyle}", tripStyle)
      .replace("{destination}", destination)
      .replace("{avgTemp}", Math.round(avgTemp))
      .replace("{conditions}", conditions);

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: filled }],
      max_tokens: 120,
    });
    const text = response.choices[0].message.content.trim().replace(/```json\n?|\n?```/g, "");
    result = JSON.parse(text);
  } catch {
    result = mockScore(item.description || item.category, avgTemp);
  }

  // Persist score back to wardrobe_items
  await supabase.from("wardrobe_items")
    .update({ suitability_score: result.score, suitability_note: result.note })
    .eq("id", itemId);

  return res.status(200).json({ score: result.score, note: result.note, itemId });
}