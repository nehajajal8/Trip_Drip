/**
 * src/data/indiaTravelKnowledge.js
 * Comprehensive Indian Travel Intelligence Engine.
 * Provides hyper-local knowledge for food, sights, wardrobe styling, transit,
 * and culture across Indian destinations, powering the AI Travel Butler.
 */

export const INDIA_TRAVEL_KNOWLEDGE = {
  "rann of kutch": {
    region: "Kutch, Gujarat",
    famousFoods: [
      { name: "Kutchi Dabeli", desc: "Invented in Mandvi, spiced potato mash stuffed in pav with roasted peanuts, pomegranate pearls, sev, and sweet-spicy chutneys." },
      { name: "Kutchi Khichdi & Kadhi", desc: "A hearty comforting staple of bajra or rice khichdi served with ghee and sweet-sour Gujarati kadhi." },
      { name: "Bajra no Rotlo with Ringna no Olo", desc: "Thick hand-patted pearl millet flatbread served with roasted spiced eggplant mash, fresh white butter (makhan), and pungent garlic chutney." },
      { name: "Gulab Pak & Mesuk", desc: "Legendary royal Kutchi sweets made from pure mawa, rose petals, and gram flour, best from Khavda and Bhuj sweet shops." },
      { name: "Kutchi Chaas (Buttermilk)", desc: "Light spiced buttermilk seasoned with roasted cumin and mint, essential for digestion in the desert." }
    ],
    topPlaces: [
      "White Desert (Dhordo) — endless expanse of sparkling white salt flats, ethereal at sunset and full moon.",
      "Kala Dungar (Black Hill) — highest point in Kutch (462m) with panoramic views of the Great Rann and the jackal feeding ritual at Dattatreya Temple.",
      "Bhujodi Craft Village — hub of Vankar weavers creating exquisite shawls, carpets, and Rabari mirror-work.",
      "Aina Mahal & Prag Mahal (Bhuj) — Venetian gothic palace with mirror halls and bell tower.",
      "Mandvi Beach & Vijay Vilas Palace — serene Arabian sea shoreline and royal Rajput summer retreat.",
      "Nirona Village — only place on earth where 400-year-old Persian Rogan Art (castor oil painting) is practiced, alongside bell-makers and lacquer work."
    ],
    wardrobeAdvice: {
      daytime: "Lightweight, breathable cottons or linen kurtis/shirts. Essential: UV-blocking sunglasses to combat the blinding glare of the white salt desert.",
      nighttime: "Heavy warm fleece jacket, wool sweater, or thick Kutchi embroidered shawl (temperatures drop drastically after sunset to 10°C–14°C).",
      footwear: "Comfortable closed sneakers or trail shoes. The dried salt crust can be sharp and rough on bare skin."
    },
    localTips: [
      "Permits are mandatory for the White Rann (Dhordo); acquire them online or at the Bhirandiyara checkpoint (carry Aadhaar/ID).",
      "Best time to step onto the salt flats is 4:30 PM to catch the sunset and twilight moonrise.",
      "Try Khavda Mesuk sweet at Bhuj bazaar near Jubilee Ground."
    ]
  },

  "mumbai": {
    region: "Maharashtra",
    famousFoods: [
      { name: "Vada Pav", desc: "Crispy spiced potato dumpling in a pillowy pav with spicy dry garlic chutney. Best at Aram Milk Bar (CSMT) or Ashok Vada Pav (Kirti College)." },
      { name: "Pav Bhaji", desc: "Mashed spiced vegetable curry swimming in butter with toasted pav. Best at Sardar (Tardeo) or Amar Juice Centre (Juhu)." },
      { name: "Bombay Bhel Puri & Sev Puri", desc: "Puffed rice tossed with tangy tamarind, mint chutney, onions, and raw mango on Marine Drive and Chowpatty." },
      { name: "Bun Maska & Irani Chai", desc: "Warm crusty bun slathered with salted butter dipped in cardamom-infused milk tea at Kyani & Co or Café Excelsior." },
      { name: "Coastal Seafood Thali", desc: "Fresh bombil fry, surmai curry, and tisrya (clams) at Highway Gomantak or Gajalee." }
    ],
    topPlaces: [
      "Gateway of India & Colaba Causeway",
      "Marine Drive (Queen's Necklace) sunset walk",
      "CSMT & Fort Victorian Heritage District",
      "Elephanta Caves UNESCO rock temples",
      "Bandra Bandstand & Carter Road seaside promenades",
      "Sanjay Gandhi National Park & Kanheri Caves"
    ],
    wardrobeAdvice: {
      daytime: "Breathable linen shirt, relaxed shorts or chinos, cushioned walking sneakers.",
      nighttime: "Light cotton overshirt or windcheater for evening sea breezes along the waterfront.",
      footwear: "Cushioned sneakers for long heritage pavement walks."
    },
    localTips: [
      "Avoid local trains during peak rush hours (8:30-11 AM towards CSMT/Churchgate and 6-9 PM northwards).",
      "Download UTS app to buy local train and Metro tickets without waiting in queue."
    ]
  },

  "lonavala": {
    region: "Western Ghats, Maharashtra",
    famousFoods: [
      { name: "Maganlal Chikki", desc: "Iconic peanut, crushed cashew, sesame, and chocolate brittle made with jaggery." },
      { name: "Roadside Piping Hot Maggi", desc: "Spicy soupy noodles prepared with ginger, chilies, and onions at misty cliff viewpoints." },
      { name: "Kanda Bhaji (Onion Pakoda)", desc: "Crunchy double-fried onion fritters served with green chilies and hot cutting chai." },
      { name: "Maharashtrian Misal Pav", desc: "Fiery sprouted moth bean curry topped with farsan, onions, and lemon." }
    ],
    topPlaces: [
      "Bhushi Dam waterfalls and cascading water steps",
      "Tiger's Leap (Waghdari) sheer vertical drop viewpoint",
      "Lions Point misty valley view",
      "Karla & Bhaja 2,200-year-old rock-cut Buddhist caves",
      "Lohagad Fort summit trek overlooking Pawna Dam"
    ],
    wardrobeAdvice: {
      daytime: "Quick-dry athletic shorts or trek pants + moisture-wicking tank top or breathable tee.",
      nighttime: "Lightweight waterproof windcheater/jacket (essential for mountain mist, sudden rains, and waterfall spray).",
      footwear: "Anti-slip water shoes or rugged grip trekking sandals for wet granite dam steps."
    },
    localTips: [
      "Visit Bhushi Dam early morning (around 9 AM) before weekend crowds arrive.",
      "Carry a zip-lock waterproof pouch for phones and wallets near waterfalls."
    ]
  },

  "goa": {
    region: "Goa",
    famousFoods: [
      { name: "Goan Fish Curry Thali", desc: "Rice served with kokum-coconut fish curry, fried kingfish/prawns, kismoor, and sol kadhi." },
      { name: "Poi with Pork Vindaloo / Cafreal", desc: "Crusty traditional Goan leavened bread with fiery vinegar-infused curry or coriander-rich green cafreal." },
      { name: "Bebinca", desc: "Traditional 7-layer Indo-Portuguese spiced coconut milk cake." },
      { name: "Feni & Kokum Soda", desc: "Distilled cashew or coconut spirit mixed with Limca, salt, and chili, or refreshing sweet-tangy kokum juice." }
    ],
    topPlaces: [
      "Fontainhas Portuguese Latin Quarter in Panaji",
      "UNESCO Basilica of Bom Jesus & Se Cathedral (Old Goa)",
      "Fort Aguada & Chapora Fort cliff ramparts",
      "Quiet South Goa beaches: Palolem, Agonda, and Butterfly Beach",
      "Dudhsagar Waterfalls jeep safari"
    ],
    wardrobeAdvice: {
      daytime: "Breezy printed resort linen shirts, swim shorts, cotton sundresses, sunglasses, and sun hat.",
      nighttime: "Light cotton shirt and chinos for beach clubs or restaurants.",
      footwear: "Waterproof sandals or slip-on espadrilles; easy-off shoes for sandy shores."
    },
    localTips: [
      "Rent a scooter (₹300–400/day) for maximum freedom; always wear a helmet.",
      "Cover shoulders and knees when visiting Old Goa churches and Hindu temples."
    ]
  },

  "jaipur": {
    region: "Rajasthan",
    famousFoods: [
      { name: "Dal Baati Churma", desc: "Baked wheat balls drowned in desi ghee, served with 5-lentil spicy dal and sweet crushed churma." },
      { name: "Rawat Pyaaz Kachori", desc: "Flaky deep-fried pastry stuffed with spiced onion filling, served with sweet and tangy chutneys." },
      { name: "Lassiwala Kulhad Lassi", desc: "Thick creamy curd lassi served with a layer of malai in earthen clay cups on MI Road." },
      { name: "Ghewar & Mawa Kachori", desc: "Disc-shaped honeycomb sweet soaked in saffron sugar syrup from LMB in Johari Bazaar." }
    ],
    topPlaces: [
      "Amer (Amber) Fort & glittering Sheesh Mahal",
      "Hawa Mahal (Palace of Winds) facade",
      "City Palace & Peacock Gate courtyards",
      "Jantar Mantar UNESCO stone astronomical observatory",
      "Nahargarh Fort sunset view over Pink City",
      "Panna Meena Kund geometric stepwell"
    ],
    wardrobeAdvice: {
      daytime: "Breathable cotton kurtis or shirts + loose pants/shorts; sun hat and sunglasses for courtyard glare.",
      nighttime: "Light jacket or wrap for hilltop breezes at Nahargarh Fort after dusk.",
      footwear: "Cushioned walking sneakers for steep cobblestone inclines at Amer Fort."
    },
    localTips: [
      "Composite ticket covers Amber Fort, Albert Hall, Hawa Mahal, and Jantar Mantar at a discount.",
      "Head to Nahargarh Fort around 5 PM for the best sunset view of the entire city."
    ]
  },

  "delhi": {
    region: "National Capital Region",
    famousFoods: [
      { name: "Chole Bhature", desc: "Fluffy puffed fried bread served with spicy chickpea curry, pickled carrots, and green chilies (Sita Ram Diwan Chand)." },
      { name: "Old Delhi Mughlai Korma & Kebabs", desc: "Slow-cooked mutton korma and seekh kebabs at Karim's and Al Jawahar near Jama Masjid." },
      { name: "Paranthe Wali Gali", desc: "Deep-fried parathas stuffed with paneer, rabdi, papad, or cauliflower with pumpkin subzi." },
      { name: "Dilli Chaat & Golgappe", desc: "Crispy puris filled with spicy hing water, potato, and sweet saunth chutney at Chandni Chowk." }
    ],
    topPlaces: [
      "Red Fort & Chandni Chowk spice markets",
      "Humayun's Tomb & Sunder Nursery gardens",
      "Qutub Minar & Mehrauli Archaeological Park",
      "India Gate & Kartavya Path power corridor",
      "Dilli Haat INA multi-state handicrafts and food stalls"
    ],
    wardrobeAdvice: {
      daytime: "Modest cotton garments covering shoulders and knees; easy-to-slip-off footwear for mosques/temples.",
      nighttime: "Light jacket or shawl depending on season.",
      footwear: "Comfortable walking shoes with socks."
    },
    localTips: [
      "Use Delhi Metro for fast, air-conditioned, traffic-free travel across all attractions.",
      "Carry a scarf to cover head and shoulders when visiting Jama Masjid or Gurudwara Bangla Sahib."
    ]
  }
};

/**
 * Intelligent matcher to retrieve localized knowledge for any Indian destination.
 */
export function getDestinationKnowledge(destName = "") {
  const q = destName.toLowerCase().trim();
  for (const [key, data] of Object.entries(INDIA_TRAVEL_KNOWLEDGE)) {
    if (q.includes(key) || key.includes(q)) {
      return { destination: key, ...data };
    }
  }
  if (q.includes("kutch") || q.includes("bhuj") || q.includes("dhordo") || q.includes("gujarat")) {
    return { destination: "rann of kutch", ...INDIA_TRAVEL_KNOWLEDGE["rann of kutch"] };
  }
  if (q.includes("bombay") || q.includes("mumbai")) {
    return { destination: "mumbai", ...INDIA_TRAVEL_KNOWLEDGE["mumbai"] };
  }
  if (q.includes("lonavla") || q.includes("khandala")) {
    return { destination: "lonavala", ...INDIA_TRAVEL_KNOWLEDGE["lonavala"] };
  }
  if (q.includes("panaji") || q.includes("goa")) {
    return { destination: "goa", ...INDIA_TRAVEL_KNOWLEDGE["goa"] };
  }
  if (q.includes("jaipur") || q.includes("rajasthan")) {
    return { destination: "jaipur", ...INDIA_TRAVEL_KNOWLEDGE["jaipur"] };
  }
  if (q.includes("delhi")) {
    return { destination: "delhi", ...INDIA_TRAVEL_KNOWLEDGE["delhi"] };
  }

  // Generic fallback for any Indian destination
  return {
    destination: destName,
    region: destName,
    famousFoods: [
      { name: "Regional Traditional Thali", desc: `Authentic local preparations with fresh seasonal vegetables, lentils, bread, and regional sweets of ${destName}.` },
      { name: "Street Snacks & Chaat", desc: `Popular local street stalls, freshly fried savories, and cutting masala chai across the bazaars of ${destName}.` },
      { name: "Iconic Local Sweets & Breakfast", desc: `Local specialty morning breakfast (poha, kachori, or idli) paired with hot traditional tea.` }
    ],
    topPlaces: [
      `Historic Old City & Heritage Bazaars of ${destName}`,
      `Central Monument & Iconic Cultural Landmark`,
      `Scenic Sunset Viewpoint & Waterfront Promenade`,
      `Local Craft Villages & Handloom Markets`
    ],
    wardrobeAdvice: {
      daytime: `Comfortable, breathable cotton or linen apparel suitable for exploring ${destName}.`,
      nighttime: `Light layering piece (jacket or shawl) for evening breezes.`,
      footwear: `Cushioned walking sneakers or slip-on sandals for monument exploration.`
    },
    localTips: [
      `Carry a reusable water bottle and cash for smaller street vendors.`,
      `Dress modestly with covered shoulders when visiting local temples or sacred spots.`
    ]
  };
}
