/**
 * api/generate-itinerary.js — India Edition
 * Priority: GPT-4o-mini with hyper-local India prompt + rich wardrobe generative advice
 * Fallback: pre-built templates from src/data/indiaItineraries.js
 */
import { buildTemplateItinerary, isDuplicateOrInvalidItinerary } from "../src/data/indiaItineraries.js";

const INDIA_SYSTEM_PROMPT = `You are an expert Indian travel stylist and local guide who knows every lane, dhaba, monument, viewpoint, weather pattern, and local cultural dress code in India.
Generate a hyper-specific, realistic, day-by-day itinerary with an executive route, daily group budget, and contextual AI generative wardrobe styling advice for each day.

CRITICAL RULES:
1. Use REAL, SPECIFIC places and sequenced routes connected with arrows: e.g. "CSMT → Fort → Gateway of India → Colaba Causeway → Marine Drive".
2. Include specific local food spots with must-order dishes (e.g. "Aram Vada Pav at CSMT", "Café Mondegar keema pav", "Bademiya seekh kabab").
3. Note realistic group and per-person INR daily budget for transport + food + tickets. Group size is {groupSize} people, total target trip budget is ₹{totalBudget}.
4. Provide HYPER-SPECIFIC AI GENERATIVE WARDROBE ADVICE for EACH day:
   - Specific garments (e.g. for Lonavala: "Breathable tank top + quick-dry shorts + lightweight waterproof windcheater/jacket"; for temples: "Modest cotton kurta with covered shoulders and linen pants").
   - Specific footwear (e.g. anti-slip water sandals for waterfalls, cushioned slip-offs for temples, trail runners for hill forts).
   - Clear reason linking the outfit to that day's weather, humidity, terrain, and cultural appropriateness.
5. Mention local transit (e.g. "Local train + Metro Line 3 + BEST bus + walking").

Return ONLY a valid JSON object with:
{
  "summary": {
    "destination": "string",
    "groupSize": number,
    "totalDays": number,
    "totalGroupBudget": number,
    "perPersonTotal": number,
    "bufferAmount": number,
    "travelNote": "string",
    "foodNote": "string",
    "accommodationNote": "string"
  },
  "days": [
    {
      "day": 1,
      "dayLabel": "Day 1 🏛️",
      "date": "YYYY-MM-DD",
      "theme": "Theme title",
      "places": ["Place 1", "Place 2", "Place 3"],
      "route": "Place 1 → Place 2 → Place 3",
      "groupBudget": 1700,
      "perPersonBudget": 340,
      "transport": "Transit mode and tips",
      "foodType": "Specific food and dhabas",
      "wardrobeAdvice": {
        "outfit": "Specific pieces (e.g. tank top, shorts, jacket)",
        "layer": "Layering recommendations",
        "footwear": "Specific shoes/sandals",
        "styleVibe": "Short vibe phrase",
        "reason": "Why this outfit matches the weather and terrain"
      },
      "activities": [
        "09:00 AM: Specific activity and place",
        "01:00 PM: Lunch at specific spot",
        "05:00 PM: Evening experience and sunset"
      ]
    }
  ]
}`;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const {
    destination,
    startDate,
    endDate,
    tripStyle = "Mixed",
    groupSize = 1,
    totalBudget = 0,
    offbeatPreference = "mix",
  } = req.body || {};

  if (!destination || !startDate || !endDate) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const g = Math.max(1, parseInt(groupSize) || 1);
  const budget = parseFloat(totalBudget) || 0;

  // ── 1. Try GPT-4o-mini with rich localized prompt ────────────
  if (process.env.OPENAI_API_KEY) {
    try {
      const { default: OpenAI } = await import("openai");
      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      const offbeatNote = offbeatPreference === "offbeat"
        ? "PRIORITIZE OFFBEAT SPOTS: The traveler specifically requested lesser-known neighborhoods, quiet villages, non-touristy beaches, and hidden cultural spots rather than crowded tourist hubs."
        : offbeatPreference === "popular"
        ? "FOCUS ON POPULAR SIGHTS: Prioritize the top quintessential iconic monuments, viewpoints, and famous spots."
        : "MIXED EXPLORATION: Seamlessly blend top iconic highlights with charming local offbeat gems and neighborhood discoveries.";

      const filledPrompt = INDIA_SYSTEM_PROMPT
        .replace("{tripStyle}", tripStyle)
        .replace(/{groupSize}/g, String(g))
        .replace(/{totalBudget}/g, budget > 0 ? String(budget) : "10000") +
        `\n\nOFFBEAT PREFERENCE: ${offbeatNote}\nRULE: NEVER repeat any day's route, theme, or activity plan across the entire trip length. Every single day must be completely unique.`;

      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: filledPrompt },
          {
            role: "user",
            content: `Destination: ${destination}, India\nFrom: ${startDate} to ${endDate}\nTrip style: ${tripStyle}\nPreference: ${offbeatPreference}\nGroup size: ${g} people\nTotal budget: ₹${budget || 10000}\n\nGenerate the complete itinerary JSON:`,
          },
        ],
        max_tokens: 3500,
        temperature: 0.65,
      });

      let text = response.choices[0].message.content.trim();
      text = text.replace(/```json\n?|\n?```/g, "").trim();
      const parsed = JSON.parse(text);

      let days = [];
      let summary = null;

      if (Array.isArray(parsed)) {
        days = parsed;
      } else if (parsed && Array.isArray(parsed.days)) {
        days = parsed.days;
        summary = parsed.summary;
      }

      if (days.length > 0 && !isDuplicateOrInvalidItinerary(days)) {
        if (summary) days.summary = summary;
        return res.status(200).json({
          itinerary: days,
          summary: summary || days.summary,
          source: "ai",
        });
      }
    } catch (err) {
      console.warn("[generate-itinerary] AI generation error:", err.message, "— falling back to template");
    }
  }

  // ── 2. Fallback: hyper-local curated template ───────────────
  const itinerary = buildTemplateItinerary(destination, startDate, endDate, budget, g, tripStyle, offbeatPreference);
  return res.status(200).json({
    itinerary,
    summary: itinerary.summary,
    source: "template",
  });
}