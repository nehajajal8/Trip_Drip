/**
 * api/chat-concierge.js
 *
 * LangChain conversational chain scoped to one trip.
 * Upgraded in Part 3 with ACTION-TAKING CAPABILITIES:
 * - ADD_TO_CART: adds items from brand catalog to the trip's shopping cart
 * - MARK_PACKED: marks items as packed in the packing checklist
 * - ADD_EXPENSE: logs an expense against the trip budget
 * - ADD_JOURNAL: creates a travel diary memory
 */
import { createClient }          from "@supabase/supabase-js";
import { ChatPromptTemplate,
         MessagesPlaceholder }   from "@langchain/core/prompts";
import { StringOutputParser }    from "@langchain/core/output_parsers";
import { HumanMessage,
         AIMessage,
         SystemMessage }         from "@langchain/core/messages";
import { PRODUCT_CATALOG }       from "../src/data/productCatalog.js";
import { getDestinationKnowledge } from "../src/data/indiaTravelKnowledge.js";
import { CHAI_STATION_RADAR }      from "../src/data/chaiStationRadarData.js";

function supabaseAdmin() {
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  try {
    return createClient(url, key);
  } catch {
    return null;
  }
}

function parseIntentFallback(message) {
  const msg = message.toLowerCase();
  const actions = [];

  // 1. ADD TO CART INTENT
  if (msg.includes("cart") || msg.includes("buy") || msg.includes("purchase")) {
    let matchedProduct = null;
    for (const p of PRODUCT_CATALOG) {
      const nameParts = p.name.toLowerCase().split(" ");
      const brand = p.brand.toLowerCase();
      if (msg.includes(brand) && nameParts.some(part => part.length > 3 && msg.includes(part))) {
        matchedProduct = p;
        break;
      }
    }
    if (!matchedProduct) {
      if (msg.includes("linen")) matchedProduct = PRODUCT_CATALOG.find(p => p.name.includes("Linen"));
      else if (msg.includes("airism") || msg.includes("tee")) matchedProduct = PRODUCT_CATALOG.find(p => p.name.includes("AIRism"));
      else if (msg.includes("pant") || msg.includes("trouser") || msg.includes("cargo")) matchedProduct = PRODUCT_CATALOG.find(p => p.category === "trousers");
      else if (msg.includes("shoe") || msg.includes("sneaker")) matchedProduct = PRODUCT_CATALOG.find(p => p.category === "shoes");
      else if (msg.includes("jacket") || msg.includes("windbreaker")) matchedProduct = PRODUCT_CATALOG.find(p => p.category.includes("outwear"));
      else if (msg.includes("umbrella") || msg.includes("bag") || msg.includes("hat")) matchedProduct = PRODUCT_CATALOG.find(p => p.category === "bag" || p.category === "hat");
    }

    if (matchedProduct) {
      actions.push({
        type: "ADD_TO_CART",
        payload: {
          id: matchedProduct.id,
          name: matchedProduct.name,
          brand: matchedProduct.brand,
          price: matchedProduct.price,
          category: matchedProduct.category,
          image: matchedProduct.image,
          material: matchedProduct.material,
          sizeRange: matchedProduct.sizeRange,
        }
      });
    }
  }

  // 2. MARK PACKED INTENT
  if (msg.includes("pack") || msg.includes("packed") || msg.includes("check off")) {
    let itemName = "Travel Essential";
    if (msg.includes("umbrella")) itemName = "Compact Travel Umbrella / Rain Poncho";
    else if (msg.includes("sunscreen")) itemName = "Sunscreen SPF 50+ & Lip Balm";
    else if (msg.includes("power bank") || msg.includes("charger")) itemName = "Fast Charging Power Bank & Cables";
    else if (msg.includes("id") || msg.includes("passport") || msg.includes("aadhaar")) itemName = "Government ID / Passport / Aadhaar";
    else if (msg.includes("water bottle")) itemName = "Reusable Insulated Water Bottle";
    else if (msg.includes("first aid") || msg.includes("medicine")) itemName = "Emergency First-Aid & ORS / Hydration";
    else {
      const match = message.match(/mark (the )?([a-zA-Z\s]+)( as)? packed/i);
      if (match && match[2]) itemName = match[2].trim();
    }

    actions.push({
      type: "MARK_PACKED",
      payload: { name: itemName }
    });
  }

  // 3. ADD EXPENSE INTENT
  if ((msg.includes("spent") || msg.includes("paid") || msg.includes("log expense") || msg.includes("add expense") || (msg.includes("expense") && /\d+/.test(msg))) && !msg.includes("split") && !msg.includes("hisaab")) {
    const numMatch = message.match(/(\d+[\d,]*)/);
    const amount = numMatch ? parseFloat(numMatch[1].replace(/,/g, "")) : 250;
    let label = "Travel Spend";
    let cat = "Food";

    if (msg.includes("chai") || msg.includes("tea") || msg.includes("food") || msg.includes("dhaba") || msg.includes("dinner") || msg.includes("lunch")) {
      label = "Food / Chai & Refreshments";
      cat = "Food";
    } else if (msg.includes("train") || msg.includes("ticket") || msg.includes("cab") || msg.includes("auto") || msg.includes("taxi")) {
      label = "Local Transport / Ride";
      cat = "Transport";
    } else if (msg.includes("hotel") || msg.includes("room") || msg.includes("stay")) {
      label = "Hotel Accommodation";
      cat = "Lodging";
    } else if (msg.includes("ticket") || msg.includes("entry") || msg.includes("fort") || msg.includes("monument")) {
      label = "Monument Entry Fee";
      cat = "Sightseeing";
    } else if (msg.includes("shop") || msg.includes("bought") || msg.includes("shirt")) {
      label = "Shopping Purchase";
      cat = "Shopping";
    }

    actions.push({
      type: "ADD_EXPENSE",
      payload: { label, amount, category: cat, paid_by: "Me" }
    });
  }

  // 4. ADD JOURNAL INTENT
  if (msg.includes("journal") || msg.includes("diary") || msg.includes("memory") || msg.includes("record note")) {
    actions.push({
      type: "ADD_JOURNAL",
      payload: {
        title: "Concierge Note",
        text: message.replace(/^(record|write|add to journal|add journal entry):?/i, "").trim(),
        mood: "Wonder",
      }
    });
  }

  // 5. OPEN CHAI & STATION RADAR INTENT
  if (
    msg.includes("chai radar") ||
    msg.includes("station radar") ||
    msg.includes("dhaba") ||
    msg.includes("highway food") ||
    msg.includes("station snack") ||
    msg.includes("railway food") ||
    msg.includes("cutting chai") ||
    msg.includes("kulhad chai")
  ) {
    actions.push({
      type: "OPEN_CHAI_RADAR",
      payload: { query: message }
    });
  }

  // 6. OPEN HISAAB-KITAAB SETTLEMENT INTENT
  if (
    msg.includes("hisaab") ||
    msg.includes("kitaab") ||
    msg.includes("split expense") ||
    msg.includes("who owes") ||
    msg.includes("settle up") ||
    msg.includes("settle expense") ||
    msg.includes("upi qr") ||
    msg.includes("debt")
  ) {
    actions.push({
      type: "OPEN_HISAAB_KITAAB",
      payload: { query: message }
    });
  }

  return actions;
}

function buildSystemPrompt(trip, wardrobe) {
  const destination = trip?.destination || "India";
  const knowledge = getDestinationKnowledge(destination);

  const itinerary = (trip?.itinerary_json || [])
    .map(d => `Day ${d.day} (${d.date}): ${(d.activities||[]).join(", ")}`)
    .join("\n");

  const weather = trip?.weather_json || {};
  const budget  = weather.budget    || {};

  const wardrobeSummary = wardrobe?.length
    ? wardrobe.map(i => `${i.color || ""} ${i.category} (score: ${i.suitability_score ?? "unscored"})`).join(", ")
    : "No wardrobe items uploaded yet.";

  return `You are the Trip Drip travel concierge — an intelligent, stylish, culturally knowledgeable AI assistant for this specific trip in India.
You have full access to this trip's details and you CAN TAKE REAL ACTIONS on the user's trip!

TRIP: ${destination}
REGION: ${knowledge.region}
STYLE: ${trip?.trip_style || "Mixed"}
DATES: ${trip?.start_date || "2026-10-01"} to ${trip?.end_date || "2026-10-05"}

AUTHENTIC REGIONAL TRAVEL INTELLIGENCE:
- FAMOUS FOODS: ${knowledge.famousFoods.map(f => `${f.name} (${f.desc})`).join("; ")}
- TOP SIGHTS: ${knowledge.topPlaces.join("; ")}
- WARDROBE RECOMMENDATIONS: Daytime: ${knowledge.wardrobeAdvice.daytime} | Evening: ${knowledge.wardrobeAdvice.nighttime} | Footwear: ${knowledge.wardrobeAdvice.footwear}
- LOCAL TRAVEL TIPS: ${(knowledge.localTips || []).join("; ")}

ITINERARY:
${itinerary || "Standard curated 5-day route active."}

WEATHER: Avg ${Math.round(weather.avgTemp||22)}°C, ${weather.conditions||"clear conditions"}, range ${Math.round(weather.minTemp||18)}–${Math.round(weather.maxTemp||28)}°C

BUDGET: Total ₹${trip?.total_budget || 25000}, travel & hotel ₹${budget.travelAndHotel||0}, shopping budget ₹${budget.remainingShoppingBudget||budget.remainingBudget||5000}

WARDROBE: ${wardrobeSummary}

ACTION ABILITIES:
You can take actions on the trip whenever the user asks:
1. "Add item to cart" (e.g. Zara Linen Shirt, Uniqlo AIRism Tee, etc.) -> Confirm with brand, price, and remaining shopping budget.
2. "Mark item as packed" (e.g. umbrella, sunscreen, power bank) -> Confirm the item is packed.
3. "Add expense" (e.g. ₹450 for chai, train tickets) -> Confirm the spend has been logged against the budget.
4. "Write/record in journal" -> Confirm the memory has been added to their Yatra Diary.
5. "Open Chai Radar / show chai spots / highway dhabas" -> Launches the live Chai & Station Radar with verified highway dhabas and station delicacies.
6. "Open Hisaab-Kitaab / split expenses / settle UPI" -> Launches the group debt settlement engine with live UPI QR codes and WhatsApp sharing.

Guidelines:
- Answer food, wardrobe, sights, and tip questions with rich, authentic local knowledge.
- If an action was taken, clearly state what was updated.
- Keep answers stylish, helpful, and culturally attuned to Indian travel.`;
}

function generateIntelligentReply(message, destination, actions, trip, wardrobe) {
  // If actions detected, return confirmation with contextual advice
  if (actions && actions.length > 0) {
    const act = actions[0];
    if (act.type === "ADD_TO_CART") {
      return `🛍️ I've added the **${act.payload.name}** (${act.payload.brand} · ₹${act.payload.price.toLocaleString("en-IN")}) to your trip shopping cart! Your remaining live shopping budget will update in real-time.`;
    } else if (act.type === "MARK_PACKED") {
      return `✅ Marked "**${act.payload.name}**" as packed in your Smart Packing Checklist! You're one step closer to being 100% prepared for ${destination}.`;
    } else if (act.type === "ADD_EXPENSE") {
      return `💰 Recorded an expense of **₹${act.payload.amount.toLocaleString("en-IN")}** for "${act.payload.label}" (${act.payload.category}). Your category spend breakdown and remaining budget are now updated.`;
    } else if (act.type === "ADD_JOURNAL") {
      return `📖 Saved your travel memory to your **Yatra Diary** for ${destination}! You can review, edit, and add photos to it on the Journal page.`;
    } else if (act.type === "OPEN_CHAI_RADAR") {
      const topSpots = CHAI_STATION_RADAR.slice(0, 3).map(s => `☕ **${s.name}** (${s.city}): *${s.chaiSpecialty?.name}* (${s.chaiSpecialty?.price}) & *${s.famousFoods?.[0]?.name}*`).join("\n");
      return `☕ **Chai & Station Radar Activated!**\n\nI've launched your live radar with verified highway dhabas, station food legends, and regional tea varieties:\n\n${topSpots}\n\n✨ *The full interactive radar modal is now open on your dashboard with hygiene tips and WhatsApp food guide sharing!*`;
    } else if (act.type === "OPEN_HISAAB_KITAAB") {
      return `💸 **Hisaab-Kitaab Settle-Up Engine Launched!**\n\nI've calculated your squad's minimal-transaction debt matrix and generated instant UPI QR codes + deep links for Google Pay, PhonePe, and Paytm.\n\n✨ *The settlement modal is open on your dashboard with 1-tap WhatsApp settlement summaries!*`;
    }
  }

  const msg = (message || "").toLowerCase();
  let targetDest = destination;
  for (const known of ["rann of kutch", "kutch", "dhordo", "bhuj", "mumbai", "lonavala", "delhi", "goa", "jaipur"]) {
    if (msg.includes(known)) {
      targetDest = known;
      break;
    }
  }
  const knowledge = getDestinationKnowledge(targetDest);
  const destTitle = knowledge.region || targetDest || destination || "your destination";

  // 1. CHAI & HIGHWAY DHABAS / STATION RADAR
  if (
    msg.includes("chai") || msg.includes("tea") || msg.includes("dhaba") ||
    msg.includes("station") || msg.includes("railway food") || msg.includes("vada pav") ||
    msg.includes("irani") || msg.includes("kulhad") || msg.includes("highway")
  ) {
    const match = CHAI_STATION_RADAR.find(s =>
      destTitle.toLowerCase().includes(s.city.toLowerCase()) ||
      s.city.toLowerCase().includes(destTitle.toLowerCase())
    ) || CHAI_STATION_RADAR[0];

    const snacks = match.famousFoods.map(f => `• **${f.name}** (${f.price}): ${f.desc}`).join("\n");
    return `☕ **Chai & Station Transit Radar for ${match.city} (${match.name})**:\n\n` +
      `🫖 **Signature Brew:** ${match.chaiSpecialty.name} (${match.chaiSpecialty.style} · ${match.chaiSpecialty.price})\n*${match.chaiSpecialty.desc}*\n\n` +
      `🚂 **Iconic Platform & Dhaba Bites:**\n${snacks}\n\n` +
      `💧 **Hygiene & Rail Neer Tip:** ${match.hygieneTip}\n\n` +
      `💡 *Pro-Tip:* Click **"☕ Chai & Station Radar"** at the top of your dashboard to view the full nationwide corridor radar!`;
  }

  // 2. HISAAB-KITAAB / GROUP EXPENSE SPLIT / WHO OWES WHOM
  if (
    msg.includes("hisaab") || msg.includes("split") || msg.includes("owe") ||
    msg.includes("settle") || msg.includes("upi") || msg.includes("share cost")
  ) {
    return `💸 **Hisaab-Kitaab: Zero-Friction Group Expense Settlement**:\n\n` +
      `• **Minimal Cashflow Algorithm:** We condense multiple group debts into the fewest possible direct transfers.\n` +
      `• **Live UPI QR Codes:** Auto-generates scannable Bharat QR codes pre-filled with payee VPA and amount for GPay, PhonePe, and Paytm.\n` +
      `• **WhatsApp Group Sync:** 1-tap summary formatted with emojis and settlement instructions ready to blast to your travel group.\n\n` +
      `💡 *Click the **"💸 Hisaab-Kitaab (UPI)"** button in your dashboard header to settle up right now!*`;
  }

  // 3. FOOD / CUISINE / WHAT TO EAT / FAMOUS DISHES
  if (
    msg.includes("food") || msg.includes("eat") || msg.includes("dish") || msg.includes("cuisine") ||
    msg.includes("specialty") || msg.includes("specialties") || msg.includes("snack") ||
    msg.includes("breakfast") || msg.includes("dinner") || msg.includes("lunch") ||
    msg.includes("dabeli") || msg.includes("chaat") || msg.includes("thali") || msg.includes("restaurant")
  ) {
    const foodsList = knowledge.famousFoods.map(f => `• **${f.name}**: ${f.desc}`).join("\n");
    return `🍴 **Famous Foods & Culinary Specialties of ${destTitle} (${knowledge.region})**:\n\n${foodsList}\n\n💡 *Concierge Tip:* ${knowledge.localTips ? knowledge.localTips[0] : "Ask for local buttermilk (chaas) or fresh tea to pair with your meals!"}`;
  }

  // 4. WARDROBE / OUTFIT / WHAT TO WEAR / PACKING
  if (
    msg.includes("wear") || msg.includes("outfit") || msg.includes("wardrobe") || msg.includes("cloth") ||
    msg.includes("pack") || msg.includes("dress") || msg.includes("shoe") || msg.includes("jacket") ||
    msg.includes("sunglass") || msg.includes("cotton") || msg.includes("linen")
  ) {
    const w = knowledge.wardrobeAdvice;
    return `👗 **Wardrobe & Styling Guide for ${destTitle}**:\n\n` +
      `☀️ **Daytime Style:** ${w.daytime}\n\n` +
      `🌙 **Evening / Nighttime:** ${w.nighttime}\n\n` +
      `👟 **Recommended Footwear:** ${w.footwear}\n\n` +
      `💡 *Trip Drip Styling Tip:* You can ask me *"Add linen shirt to cart"* or browse curated outfits in the Wardrobe tab.`;
  }

  // 5. PLACES / SIGHTSEEING / TOP SIGHTS / WHAT TO SEE / ATTRACTIONS
  if (
    msg.includes("place") || msg.includes("sight") || msg.includes("visit") || msg.includes("see") ||
    msg.includes("attraction") || msg.includes("explore") || msg.includes("viewpoint") ||
    msg.includes("monument") || msg.includes("temple") || msg.includes("beach") || msg.includes("desert")
  ) {
    const placesList = knowledge.topPlaces.map((p, i) => `${i + 1}. **${p}**`).join("\n");
    return `📍 **Top Places & Sights to Experience in ${destTitle}**:\n\n${placesList}\n\n💡 *Concierge Recommendation:* Check out your 5-Day Itinerary Matrix on the Dashboard for time-stamped routes and daily budget allocations!`;
  }

  // 6. LOCAL TIPS / PERMITS / WEATHER / TRANSIT
  if (
    msg.includes("tip") || msg.includes("permit") || msg.includes("transit") || msg.includes("train") ||
    msg.includes("cab") || msg.includes("auto") || msg.includes("taxi") || msg.includes("best time") ||
    msg.includes("timing") || msg.includes("weather")
  ) {
    const tipsList = (knowledge.localTips || []).map(t => `• ${t}`).join("\n");
    return `🧭 **Essential Travel Intelligence for ${destTitle}**:\n\n${tipsList || "• Carry government ID (Aadhaar/Passport) for local checkpoints and monument entries."}\n\n🚗 *Transit Insight:* Hired private taxis or shared autos offer the most flexibility for local sightseeing.`;
  }

  // 7. BUDGET / SPEND / SHOPPING
  if (
    msg.includes("budget") || msg.includes("cost") || msg.includes("price") || msg.includes("money") ||
    msg.includes("rupee") || msg.includes("shopping")
  ) {
    const totalB = trip?.total_budget ? `₹${Number(trip.total_budget).toLocaleString("en-IN")}` : "your target budget";
    return `💰 **Budget & Expense Overview for ${destTitle}**:\n\n` +
      `• **Total Allocated:** ${totalB} for ${trip?.group_size || 1} traveler(s).\n` +
      `• **Group Split:** Daily recommended allocation is detailed in your Executive Itinerary Matrix.\n` +
      `• **Live Logging:** Say *"Record ₹350 for auto ride"* or *"Spent ₹600 on lunch"* to instantly log it in your Expense Tracker!`;
  }

  // 8. GREETINGS OR GENERAL INTRO
  return `Namaste! 🙏 I'm your **Trip Drip AI Travel Concierge** for **${destTitle}**.\n\n` +
    `I can help you with:\n` +
    `• ☕ **Chai & Station Radar** (say *"Chai radar"* or *"Highway dhabas"*)\n` +
    `• 💸 **Hisaab-Kitaab UPI Split** (say *"Settle hisaab"* or *"Who owes whom"*)\n` +
    `• 🍲 **Famous Foods & Iconic Eateries** (e.g. *"What are the famous food of ${destTitle}?"*)\n` +
    `• 👗 **Wardrobe & Weather Styling** (e.g. *"What should I wear?"*)\n` +
    `• 📍 **Top Places & Secret Viewpoints** (e.g. *"What are the best places to visit?"*)\n` +
    `• 🛒 **Real-Time Actions:** Say *"Add linen shirt to cart"*, *"Mark sunscreen as packed"*, or *"Record ₹400 for lunch"*!`;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { tripId, userId, message, history = [] } = req.body || {};
  if (!tripId || !userId || !message) return res.status(400).json({ error: "tripId, userId, and message are required" });

  const supabase = supabaseAdmin();

  // ── Load trip + wardrobe ──────────────────────────────────────
  let trip = null;
  let wardrobe = [];

  if (supabase) {
    try {
      const [{ data: t }, { data: w }] = await Promise.all([
        supabase.from("trips").select("*").eq("id", tripId).single(),
        supabase.from("wardrobe_items")
          .select("category, color, suitability_score")
          .eq("user_id", userId),
      ]);
      trip = t;
      wardrobe = w || [];
    } catch {}
  }

  // Fallback mock trip if db record is absent in test
  if (!trip) {
    trip = {
      id: tripId,
      destination: "Goa",
      trip_style: "Beach",
      total_budget: 30000,
      start_date: "2026-10-01",
      end_date: "2026-10-05",
      weather_json: { avgTemp: 28, budget: { remainingShoppingBudget: 7500 } }
    };
  }

  // Detect actions from message
  const detectedActions = parseIntentFallback(message);

  let replyContent;

  if (!process.env.OPENAI_API_KEY) {
    replyContent = generateIntelligentReply(message, trip.destination, detectedActions, trip, wardrobe);
  } else {
    try {
      const { ChatOpenAI } = await import("@langchain/openai");
      const model = new ChatOpenAI({
        model: "gpt-4o-mini",
        temperature: 0.7,
        openAIApiKey: process.env.OPENAI_API_KEY,
        maxRetries: 0,
        timeout: 3000,
      });

      const historyMessages = history.slice(-12).map(m =>
        m.role === "user" ? new HumanMessage(m.content) : new AIMessage(m.content)
      );

      const prompt = ChatPromptTemplate.fromMessages([
        ["system", buildSystemPrompt(trip, wardrobe)],
        new MessagesPlaceholder("history"),
        ["human", "{input}"],
      ]);

      const chain = prompt.pipe(model).pipe(new StringOutputParser());
      replyContent = await chain.invoke({ history: historyMessages, input: message });
    } catch (err) {
      replyContent = generateIntelligentReply(message, trip.destination, detectedActions, trip, wardrobe);
    }
  }

  // Persist messages to chat_messages if db available
  if (supabase) {
    try {
      await supabase.from("chat_messages").insert([
        { trip_id: tripId, role: "user",      content: message,      created_at: new Date().toISOString() },
        { trip_id: tripId, role: "assistant", content: replyContent, created_at: new Date(Date.now()+10).toISOString() },
      ]);
    } catch {}
  }

  return res.status(200).json({
    reply: replyContent,
    actions: detectedActions,
  });
}