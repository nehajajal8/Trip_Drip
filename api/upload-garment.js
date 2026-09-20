/**
 * api/upload-garment.js
 *
 * Pipeline:
 * 1. Receive base64 image + userId + optional tripId
 * 2. Upload to Supabase Storage (wardrobe/{userId}/{uuid}.jpg)
 * 3. Detect garment category via:
 *    a. GPT-4o-mini vision (if OPENAI_API_KEY set) — rich detection
 *    b. CLIP zero-shot via HuggingFace API (if HF_API_KEY set)
 *    c. Fallback: return categories for user to pick
 * 4. Generate text embedding of rich item description (OpenAI text-embedding-3-small)
 *    or HuggingFace CLIP text embedding if no OpenAI key
 * 5. INSERT into wardrobe_items, return the new row
 */

import { createClient } from "@supabase/supabase-js";

// DeepFashion2 category list
const DF2_CATEGORIES = [
  "short_sleeve_top","long_sleeve_top","short_sleeve_outwear","long_sleeve_outwear",
  "vest","sling","shorts","trousers","skirt",
  "short_sleeve_dress","long_sleeve_dress","vest_dress","sling_dress",
  "shoes","bag","hat","accessories",
];

const CATEGORY_LABELS = {
  short_sleeve_top:      "Short-Sleeve Top",
  long_sleeve_top:       "Long-Sleeve Top",
  short_sleeve_outwear:  "Short-Sleeve Jacket",
  long_sleeve_outwear:   "Long-Sleeve Jacket / Coat",
  vest:                  "Vest",
  sling:                 "Sling / Cami",
  shorts:                "Shorts",
  trousers:              "Trousers / Pants",
  skirt:                 "Skirt",
  short_sleeve_dress:    "Short-Sleeve Dress",
  long_sleeve_dress:     "Long-Sleeve Dress",
  vest_dress:            "Vest Dress",
  sling_dress:           "Sling Dress",
  shoes:                 "Shoes / Footwear",
  bag:                   "Bag",
  hat:                   "Hat",
  accessories:           "Accessories",
};

function supabaseAdmin() {
  return createClient(
    process.env.VITE_SUPABASE_URL   || process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY
  );
}

// ── GPT-4o-mini vision analysis ──────────────────────────────────
async function analyzeWithVision(imageBase64, mimeType) {
  const { default: OpenAI } = await import("openai");
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const categoryList = DF2_CATEGORIES.join(", ");

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{
      role: "user",
      content: [
        {
          type: "text",
          text: `Analyze this clothing item. Return ONLY valid JSON (no markdown):
{
  "category": "<one of: ${categoryList}>",
  "color": "<primary color name>",
  "color_tags": ["<color1>", "<color2>"],
  "fabric": "<fabric type if visible, else 'unknown'>",
  "description": "<2-sentence description for outfit matching: mention color, style, formality, occasion>",
  "weight": "<light|medium|heavy>",
  "formality": "<casual|smart-casual|formal>"
}`
        },
        {
          type: "image_url",
          image_url: { url: `data:${mimeType};base64,${imageBase64}`, detail: "low" }
        }
      ]
    }],
    max_tokens: 300,
  });

  const text = response.choices[0].message.content.trim();
  const clean = text.replace(/```json\n?|\n?```/g, "").trim();
  return JSON.parse(clean);
}

// ── CLIP zero-shot via HuggingFace API ───────────────────────────
async function analyzeWithCLIP(imageBase64) {
  const { HfInference } = await import("@huggingface/inference");
  const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

  // Use CLIP feature extraction (ViT-B/32) + zero-shot classification
  const imageBlob = Buffer.from(imageBase64, "base64");
  const labels    = DF2_CATEGORIES.map(c => `a photo of ${CATEGORY_LABELS[c]}`);

  const result = await hf.zeroShotImageClassification({
    model: "openai/clip-vit-base-patch32",
    inputs: { image: imageBlob },
    parameters: { candidate_labels: labels },
  });

  const top     = result[0];
  const catIdx  = labels.indexOf(top.label);
  const category = DF2_CATEGORIES[catIdx] || "accessories";

  return {
    category,
    color: "unknown",
    color_tags: [],
    fabric: "unknown",
    description: `A ${CATEGORY_LABELS[category]} garment detected via CLIP.`,
    weight: "medium",
    formality: "casual",
  };
}

// ── Generate text embedding (OpenAI or HuggingFace CLIP text) ────
async function generateEmbedding(description) {
  if (process.env.OPENAI_API_KEY) {
    const { default: OpenAI } = await import("openai");
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const resp   = await client.embeddings.create({
      model: "text-embedding-3-small",
      input: description,
    });
    return resp.data[0].embedding; // 1536-dim
  }

  if (process.env.HUGGINGFACE_API_KEY) {
    const { HfInference } = await import("@huggingface/inference");
    const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
    // CLIP text encoder returns 512-dim; pad to 1536 for pgvector compat
    const result = await hf.featureExtraction({
      model: "openai/clip-vit-base-patch32",
      inputs: description,
    });
    const vec512 = Array.isArray(result) ? result : Array.from(result);
    return [...vec512, ...new Array(1536 - vec512.length).fill(0)];
  }

  return null; // no embedding without a key
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { imageBase64, mimeType = "image/jpeg", userId, category: userCategory } = req.body || {};
  if (!imageBase64 || !userId) return res.status(400).json({ error: "imageBase64 and userId are required" });

  const supabase = supabaseAdmin();

  // ── 1. Upload image to Supabase Storage ──────────────────────
  const filename  = `${userId}/${Date.now()}.jpg`;
  const imageBuffer = Buffer.from(imageBase64, "base64");

  const { data: storageData, error: storageErr } = await supabase.storage
    .from("wardrobe")
    .upload(filename, imageBuffer, {
      contentType: mimeType,
      upsert: false,
    });

  if (storageErr) {
    console.error("Storage upload error:", storageErr.message);
    return res.status(500).json({ error: `Storage upload failed: ${storageErr.message}` });
  }

  const { data: { publicUrl } } = supabase.storage.from("wardrobe").getPublicUrl(filename);

  // ── 2. Detect garment ─────────────────────────────────────────
  let analysis = { category: userCategory || "accessories", color: "unknown", color_tags: [], fabric: "unknown", description: "A clothing item.", weight: "medium", formality: "casual" };

  try {
    if (process.env.OPENAI_API_KEY) {
      analysis = await analyzeWithVision(imageBase64, mimeType);
    } else if (process.env.HUGGINGFACE_API_KEY) {
      analysis = await analyzeWithCLIP(imageBase64);
    }
    // Override category if user specified one
    if (userCategory) analysis.category = userCategory;
  } catch (err) {
    console.warn("Analysis failed, using defaults:", err.message);
  }

  // ── 3. Generate embedding ─────────────────────────────────────
  const richDescription = `${CATEGORY_LABELS[analysis.category] || analysis.category}, ${analysis.color}, ${analysis.fabric} fabric, ${analysis.weight} weight, ${analysis.formality}. ${analysis.description}`;
  const embedding = await generateEmbedding(richDescription).catch(() => null);

  // ── 4. Save to database ───────────────────────────────────────
  const { data: item, error: dbErr } = await supabase.from("wardrobe_items").insert({
    user_id:    userId,
    image_url:  publicUrl,
    category:   analysis.category,
    color:      analysis.color,
    color_tags: analysis.color_tags,
    description: richDescription,
    embedding:  embedding ? JSON.stringify(embedding) : null,
    suitability_score: null, // computed separately
  }).select().single();

  if (dbErr) {
    console.error("DB insert error:", dbErr.message);
    return res.status(500).json({ error: dbErr.message });
  }

  return res.status(200).json({
    item,
    analysis,
    categoryLabel: CATEGORY_LABELS[analysis.category] || analysis.category,
    needsKeyForDetection: !process.env.OPENAI_API_KEY && !process.env.HUGGINGFACE_API_KEY,
  });
}