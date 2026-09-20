/**
 * api/calculate-budget.js — India Edition
 * Returns full transport comparison (train/bus/car/flight) + hotel tiers in INR
 */
import { calculateTransport, getHotelOptions, INDIA_CITIES } from "../src/data/indiaTransport.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const {
    from = "", destination = "", totalBudget = 0,
    tripStyle = "Mixed", durationDays = 3, groupSize = 1
  } = req.body || {};

  const budget  = parseFloat(totalBudget)  || 0;
  const nights  = Math.max(1, parseInt(durationDays) - 1);
  const group   = Math.max(1, parseInt(groupSize));
  const rooms   = Math.ceil(group / 2); // assume 2 per room default

  // ── Transport comparison ──────────────────────────────────
  const transport = from ? calculateTransport(from, destination, group) : null;

  // ── Hotel options ─────────────────────────────────────────
  // ── Hotel options & Natural-Language Reasoning Engine ─────
  const hotels = getHotelOptions(destination, nights, rooms);

  // Determine Recommended Sweet Spot Tier
  // We want a tier that leaves adequate daily budget (> ₹800 pp/day) and doesn't eat > 50% of total budget
  let recommendedTier = 3;
  if (budget > 0) {
    if (budget < 15000) {
      recommendedTier = 2;
    } else if (budget < 35000) {
      recommendedTier = 3;
    } else if (budget < 70000) {
      recommendedTier = group <= 2 ? 4 : 3;
    } else {
      recommendedTier = 4;
    }
  }

  // Ensure recommendedTier exists in hotels
  const recommendedHotel = hotels.find(h => h.stars === recommendedTier) || hotels[1] || hotels[0];
  const higherHotel = hotels.find(h => h.stars === recommendedTier + 1);

  // Construct ChatGPT-style natural-language reasoning
  const remainingAfterRec = Math.max(0, budget - (recommendedHotel?.total || 0));
  const higherPct = (higherHotel && budget > 0) ? Math.round((higherHotel.total / budget) * 100) : null;

  let naturalLanguageReasoning = "";
  if (budget > 0) {
    naturalLanguageReasoning = `For ${group} traveler${group > 1 ? "s" : ""} on a ₹${budget.toLocaleString("en-IN")} budget in ${destination} for ${durationDays} days, ${recommendedTier}★ ${recommendedHotel?.label || "Comfort"} stays strike the best balance at ~₹${Math.round((recommendedHotel?.total || 3000) / nights).toLocaleString("en-IN")}/night (₹${(recommendedHotel?.total || 3000).toLocaleString("en-IN")} total for ${rooms} room${rooms > 1 ? "s" : ""}). This preserves ₹${remainingAfterRec.toLocaleString("en-IN")} for local cabs, authentic dhabas, watersports, and shopping.${higherHotel ? ` Stepping up to ${higherHotel.stars}★ would consume ${higherPct}% of your total budget, severely restricting your daily activities.` : ""}`;
  } else {
    naturalLanguageReasoning = `For a trip to ${destination} with ${group} person${group > 1 ? "s" : ""} across ${nights} night${nights > 1 ? "s" : ""}, ${recommendedTier}★ ${recommendedHotel?.label || "Comfort"} hotels offer the optimal sweet spot between clean modern AC amenities and value.`;
  }

  // Mark isRecommended flag on hotel tiers
  const hotelsWithRecommendations = hotels.map(h => ({
    ...h,
    isRecommended: h.stars === recommendedTier,
  }));

  // ── Budget breakdown (using recommended hotel + train 3AC as baseline) ──
  const baseTrainPP   = transport?.train["3AC"] || 0;
  const baseTrainTotal = baseTrainPP * group;
  const baseHotelTotal = recommendedHotel?.total || (hotels.find(h=>h.stars===3)?.total) || 0;
  const travelAndHotel = baseTrainTotal + baseHotelTotal;
  const remaining      = Math.max(0, budget - travelAndHotel);
  const perPersonDaily = group > 0 ? Math.round(remaining / group / Math.max(1,durationDays)) : 0;

  // ── City info ────────────────────────────────────────────
  const cityInfo = INDIA_CITIES.find(c =>
    c.name.toLowerCase() === destination.toLowerCase()
  );

  return res.status(200).json({
    currency:      "INR",
    groupSize:     group,
    nights,
    rooms,
    transport,
    hotels:        hotelsWithRecommendations,
    recommendedTier,
    naturalLanguageReasoning,
    summary: {
      baselineTrainTotal:  baseTrainTotal,
      baselineTrainPP:     baseTrainPP,
      baseline3StarTotal:  baseHotelTotal,
      travelAndHotel,
      remainingBudget:     remaining,
      perPersonDailySpend: perPersonDaily,
      naturalLanguageReasoning,
      recommendedTier,
      budgetTip:           perPersonDaily < 500
        ? "Budget is tight — consider 1★ accommodation and state bus transport."
        : perPersonDaily < 1500
        ? "Comfortable trip possible with 2–3★ hotels and train 3AC class."
        : "Good budget — you can opt for 3–4★ hotels with AC train travel.",
    },
    destination: {
      name: destination,
      tier: cityInfo?.tier || "tier2",
      tags: cityInfo?.tags || [],
      lat:  cityInfo?.lat,
      lng:  cityInfo?.lng,
    },
  });
}