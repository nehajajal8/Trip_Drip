/**
 * api/color-match.js
 * Given one item, return 2-3 complementary owned pieces
 * via embedding cosine similarity + LangChain prompt for styling rationale.
 */
import { createClient } from "@supabase/supabase-js";

function supabaseAdmin() {
  return createClient(
    process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY
  );
}
function cosineSimilarity(a, b) {
  if (!a || !b || a.length !== b.length) return 0;
  let dot = 0, magA = 0, magB = 0;
  for (let i = 0; i < a.length; i++) { dot += a[i]*b[i]; magA += a[i]*a[i]; magB += b[i]*b[i]; }
  return dot / (Math.sqrt(magA) * Math.sqrt(magB) || 1);
}
async function embed(text) {
  if (process.env.OPENAI_API_KEY) {
    const { default: OpenAI } = await import("openai");
    const r = await new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
      .embeddings.create({ model: "text-embedding-3-small", input: text });
    return r.data[0].embedding;
  }
  return null;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { itemId, userId } = req.body || {};
  if (!itemId || !userId) return res.status(400).json({ error: "itemId and userId required" });

  const supabase = supabaseAdmin();
  const { data: anchor } = await supabase.from("wardrobe_items")
    .select("id, category, color, description, embedding, image_url")
    .eq("id", itemId).single();
  if (!anchor) return res.status(404).json({ error: "Item not found" });

  const { data: wardrobe } = await supabase.from("wardrobe_items")
    .select("id, category, color, description, embedding, image_url")
    .eq("user_id", userId).neq("id", itemId);

  if (!wardrobe?.length) return res.status(200).json({ matches: [], noMatchReason: "Your wardrobe only has one item. Add more to see color matches." });

  let matches = [];
  const anchorVec = anchor.embedding
    ? (typeof anchor.embedding === "string" ? JSON.parse(anchor.embedding) : anchor.embedding)
    : await embed(`complement this: ${anchor.description}`);

  if (anchorVec) {
    const scored = wardrobe.map(item => {
      const vec = item.embedding ? (typeof item.embedding === "string" ? JSON.parse(item.embedding) : item.embedding) : null;
      // Invert similarity slightly — complementary items are DIFFERENT but not too different
      const rawSim = vec ? cosineSimilarity(anchorVec, vec) : 0;
      const score  = rawSim * (1 - Math.abs(rawSim - 0.6)); // sweet spot ~0.6 similarity
      return { ...item, score };
    }).sort((a, b) => b.score - a.score).slice(0, 3);
    matches = scored;
  } else {
    // No embeddings: pick different categories
    const seenCats = new Set([anchor.category]);
    matches = wardrobe.filter(i => !seenCats.has(i.category) && seenCats.add(i.category)).slice(0, 3);
  }

  // LangChain styling rationale
  let rationales = [];
  try {
    if (process.env.OPENAI_API_KEY && matches.length) {
      const { default: OpenAI } = await import("openai");
      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const pairList = matches.map((m,i) => `${i+1}. ${m.color} ${m.category}`).join("\n");
      const r = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content:
          `A ${anchor.color} ${anchor.category}. These items are suggested as color-coordinated pairs:\n${pairList}\nFor each, give a 1-sentence styling rationale. Return JSON array of strings.`
        }],
        max_tokens: 200,
      });
      const text = r.choices[0].message.content.trim().replace(/```json\n?|\n?```/g,"");
      rationales = JSON.parse(text);
    }
  } catch { rationales = matches.map(() => "Complements the color palette and formality level."); }

  return res.status(200).json({
    anchor: { id: anchor.id, category: anchor.category, color: anchor.color, image_url: anchor.image_url },
    matches: matches.map((m, i) => ({
      id: m.id, category: m.category, color: m.color, image_url: m.image_url,
      rationale: rationales[i] || "Good color pairing.",
    })),
  });
}