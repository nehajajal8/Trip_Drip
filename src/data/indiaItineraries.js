/**
 * src/data/indiaItineraries.js — India Edition with hyper-local routes,
 * group/per-person budget breakdowns, and contextual AI wardrobe recommendations.
 */

export const INDIA_ITINERARY_TEMPLATES = {
  "Mumbai": {
    travelNote: "Mostly local train (Western & Central Lines) + Metro Line 3/2A + BEST AC buses + walking",
    foodNote: "Budget street food (Vada Pav, Pav Bhaji, Bhel Puri) & iconic Irani cafés / local dhabas",
    accommodationNote: "Accommodation not included in budget; best areas: Colaba, Fort, Bandra, or Dadar",
    defaultBuffer: 1000,
    days: [
      {
        dayLabel: "Day 1 🏛️",
        theme: "Heritage South Bombay & Sunset Promenade",
        places: ["CSMT", "Fort Heritage District", "Gateway of India", "Colaba Causeway", "Marine Drive"],
        route: "CSMT → Fort → Gateway of India → Colaba Causeway → Marine Drive",
        baseGroupBudget: 1700,
        groupBudgetPct: 0.18,
        transport: "Local train to CSMT + Heritage walking + short Kaali-Peeli taxi",
        foodType: "Aram Vada Pav at CSMT, keema pav at Café Mondegar, Leopold Café snacks",
        wardrobeAdvice: {
          outfit: "Breathable cotton/linen short-sleeve shirt or tee + relaxed cotton shorts or chinos",
          layer: "Light cotton overshirt or windcheater for evening sea breeze",
          footwear: "Cushioned walking sneakers (lots of pavement and cobblestone walking in Fort)",
          styleVibe: "Urban Colonial Explorer · Casual Cool",
          reason: "High coastal humidity during the day; dusty heritage streets in Fort; breezy Marine Drive promenade at sunset.",
        },
        highlights: "Colonial Victorian Gothic architecture, vibrant Colaba street shopping, panoramic Queen's Necklace twilight views",
        activities: [
          "09:00 AM: Marvel at Victorian Gothic arches and stained glass of UNESCO World Heritage CSMT station.",
          "11:00 AM: Heritage architecture walk through Fort, Flora Fountain, and Asiatic Library steps.",
          "01:30 PM: Lunch at an iconic South Bombay spot (Café Mondegar / Leopold Café / Britannia).",
          "03:00 PM: Photo-op at Gateway of India & street shopping along bustling Colaba Causeway.",
          "06:00 PM: Grab roasted bhutta or cutting chai and watch the sunset along Marine Drive sea-face promenade."
        ]
      },
      {
        dayLabel: "Day 2 🚢",
        theme: "Harbour Cruise, Ancient Rock Caves & Kala Ghoda Art",
        places: ["Gateway of India", "Elephanta Caves", "Colaba", "Kala Ghoda Art Walk", "Marine Drive"],
        route: "Gateway of India → Elephanta Caves → Colaba → Marine Drive",
        baseGroupBudget: 2200,
        groupBudgetPct: 0.24,
        transport: "Return harbour ferry (approx ₹200-260 pp) + toy train at Elephanta jetty + walking",
        foodType: "Bademiya seekh rolls, fresh coconut water at Elephanta, street stalls near Regal Cinema",
        wardrobeAdvice: {
          outfit: "UV-protective breathable polo or linen top + durable shorts or roll-up lightweight trousers",
          layer: "Wide-brim sun hat or baseball cap + UV sunglasses",
          footwear: "Sturdy non-slip walking shoes or trail sandals (uneven stone steps and wet boat decks)",
          styleVibe: "Maritime Adventure · Heritage Trek",
          reason: "Open sea ferry ride with intense midday sun reflection, followed by 120+ rocky stairs up to the 6th-century caves.",
        },
        highlights: "Arabian sea boat ride, 6th-century rock-cut Shiva Trimurti sculpture, Kala Ghoda art district",
        activities: [
          "08:30 AM: Board the morning ferry from Gateway of India across Mumbai Harbour to Elephanta Island.",
          "10:00 AM: Explore Cave 1's monumental Trimurti sculpture and ancient basalt pillars.",
          "01:30 PM: Return ferry to Gateway; refuel with seekh kebab rolls or coastal thali in Colaba.",
          "03:30 PM: Leisurely walk through Kala Ghoda art district, Jehangir Art Gallery, and antique bookstalls.",
          "06:30 PM: Evening breeze & chai at Nariman Point."
        ]
      },
      {
        dayLabel: "Day 3 🌿",
        theme: "Ancient Wilderness & Rock-Cut Buddhist Monasteries",
        places: ["Sanjay Gandhi National Park", "Kanheri Caves", "Borivali Market"],
        route: "Sanjay Gandhi National Park → Kanheri Caves → Borivali",
        baseGroupBudget: 1600,
        groupBudgetPct: 0.17,
        transport: "Fast local train to Borivali station + SGNP internal shuttle / electric bus (₹40 pp)",
        foodType: "Picnic from Borivali station snacks (kachori, samosa, fruit) + dhabas near park gate",
        wardrobeAdvice: {
          outfit: "Moisture-wicking athletic tank top or breathable sports tee + lightweight trekking shorts or quick-dry cargo shorts",
          layer: "Light packable windbreaker or zip-up jacket (forest canopy can feel cool and damp in mornings)",
          footwear: "Aggressive grip trail runners or trekking sneakers (wet, slippery rock surfaces at Kanheri)",
          styleVibe: "Forest Trekker · Outdoor Activewear",
          reason: "High humidity jungle trek inside Sanjay Gandhi National Park with steep volcanic rock staircases; insect and brush protection.",
        },
        highlights: "109 rock-cut Buddhist prayer halls carved into basalt hills dating back to 1st century BCE, lush green forest within city limits",
        activities: [
          "07:30 AM: Catch the morning fast local train to Borivali; enter SGNP before peak crowds.",
          "09:00 AM: Electric shuttle through forest canopy up to the base of Kanheri Caves.",
          "10:00 AM: Hike between prayer halls, stupas, and ancient stone water harvesting channels.",
          "01:30 PM: Picnic lunch under forest trees; optional safari or cycling along the main road.",
          "04:30 PM: Explore Borivali street markets for budget apparel and snacks before taking the train back."
        ]
      },
      {
        dayLabel: "Day 4 🏖️",
        theme: "Queen of Suburbs, Sea Promenades & Juhu Beach Sunset",
        places: ["Bandra Fort", "Bandstand Promenade", "Carter Road", "Juhu Beach", "Sunset Point"],
        route: "Bandra Fort → Bandstand → Carter Road → Juhu Beach → Sunset",
        baseGroupBudget: 1500,
        groupBudgetPct: 0.16,
        transport: "Local train to Bandra (W) + auto-rickshaw sharing + coastal walking",
        foodType: "Juhu Chowpatty Sev Puri, Pani Puri, Pav Bhaji at Amar Juice Centre, fresh fruit juices",
        wardrobeAdvice: {
          outfit: "Relaxed resort shorts or denim cut-offs + casual tank top or graphic tee",
          layer: "Light unbuttoned linen overshirt or light summer jacket for evening coastal breeze",
          footwear: "Slip-on water-resistant sandals or easy-off canvas shoes (ready to step onto beach sand)",
          styleVibe: "Bohemian Bandra · Sunset Coastal Casual",
          reason: "Chic café culture in Bandra, breezy sea promenades at Bandstand, and soft beach sand at Juhu.",
        },
        highlights: "Sea Link panoramic view from 1640 Portuguese fort, celebrity homes along Bandstand, chaotic joy of Juhu beach food stalls at dusk",
        activities: [
          "10:00 AM: Explore historic Castella de Aguada (Bandra Fort) overlooking the Bandra-Worli Sea Link.",
          "12:00 PM: Stroll along Bandstand past Bollywood landmarks, chilling at quaint Pali Hill bakeries.",
          "02:30 PM: Leisurely walk and coffee along the Carter Road coastal boardwalk.",
          "04:30 PM: Auto-rickshaw to Juhu Beach; walk bare feet on the shoreline as the sky turns orange.",
          "07:00 PM: Feast on buttery Pav Bhaji and ice-cold Kala Khatta gola at Juhu Chowpatty stalls."
        ]
      },
      {
        dayLabel: "Day 5 🎉",
        theme: "Historic Promenades, Hill Gardens & Free Shopping",
        places: ["Girgaon Chowpatty", "Hanging Gardens", "Worli Sea Face", "Shopping / Free Time"],
        route: "Girgaon Chowpatty → Hanging Gardens → Worli Sea Face → Shopping/Free time",
        baseGroupBudget: 1500,
        groupBudgetPct: 0.16,
        transport: "Metro Line 3 / BEST AC buses + shared auto / walking",
        foodType: "Parsi dairy kulfi, Bachelorr's strawberry cream, Girgaon Chowpatty bhel, Dadar market snacks",
        wardrobeAdvice: {
          outfit: "Smart casual cotton tee or casual button-down + comfortable tailored shorts or linen pants",
          layer: "Light blazer or casual jacket if visiting upscale South Mumbai rooftop lounges",
          footwear: "Comfortable cushioned slip-on loafers or clean lifestyle sneakers",
          styleVibe: "City Chic · Sunset Farewell",
          reason: "Relaxed day balancing hillside garden paths, breezy promenade bench seating, and shopping in city markets.",
        },
        highlights: "Bird's eye view of Marine Drive from Malabar Hill, Old Woman's Boot at Kamla Nehru Park, sunset waves splashing Worli Sea Face",
        activities: [
          "09:30 AM: Morning stroll at Girgaon Chowpatty beach and iconic breakfast in Grant Road / Charni Road.",
          "11:30 AM: Climb up to Malabar Hill to visit Hanging Gardens and panoramic viewpoints over the bay.",
          "02:00 PM: Free time for souvenir shopping (Crawford Market spices, Colaba trinkets, or Dadar handlooms).",
          "05:00 PM: Catch sunset breeze along Worli Sea Face watching the Sea Link traffic light up.",
          "08:00 PM: Celebratory group dinner with authentic coastal seafood or Bombay street feast."
        ]
      }
    ]
  },

  "Lonavala": {
    travelNote: "Pune/Mumbai local train to Lonavala station + shared local taxis & autos + walking trails",
    foodNote: "Authentic hot roadside Maggi, fresh corn on the cob (bhutta), piping hot masala chai, famous Maganlal Chikki",
    accommodationNote: "Accommodation not included in budget; best near town center, Tungarli, or Pawna camping",
    defaultBuffer: 800,
    days: [
      {
        dayLabel: "Day 1 🌊",
        theme: "Gushing Waterfalls & Misty Cliff Panoramas",
        places: ["Bhushi Dam", "Tiger's Leap Viewpoint", "Lions Point"],
        route: "Bhushi Dam → Tiger's Leap → Lions Point",
        baseGroupBudget: 1800,
        groupBudgetPct: 0.35,
        transport: "Shared local cab or auto from Lonavala market (₹600-800 for group round-trip)",
        foodType: "Hot onion pakodas (kanda bhaji), roadside Maggi, roasted sweet corn with lime and masala",
        wardrobeAdvice: {
          outfit: "Quick-dry shorts or athletic shorts + moisture-wicking tank top or breathable tee",
          layer: "Lightweight waterproof windcheater / rain jacket (essential for sudden mountain mist and waterfall spray)",
          footwear: "Anti-slip water shoes or rugged grip trekking sandals (granite dam steps get very slippery with flowing water)",
          styleVibe: "Monsoon Adventure · Waterproof Trail",
          reason: "Bhushi Dam steps feature constant flowing water that you sit and wade in; viewpoints are windy, chilly, and misty.",
        },
        highlights: "Wading in cascading waterfall steps at Bhushi Dam, 650m vertical drop cliff at Tiger's Leap, dramatic clouds rolling into the valley",
        activities: [
          "09:00 AM: Arrive in Lonavala; head directly to Bhushi Dam before the afternoon rush.",
          "10:00 AM: Wade into the overflowing water steps and natural waterfalls.",
          "01:00 PM: Snack on hot kanda bhaji, masala sweet corn, and cutting chai at viewpoint stalls.",
          "03:00 PM: Stand at Tiger's Leap to witness the sheer cliff drop into the Sahyadri valley.",
          "05:30 PM: Sunset at Lions Point as clouds envelop the rolling Western Ghats."
        ]
      },
      {
        dayLabel: "Day 2 🏰",
        theme: "Ancient Buddhist Shrines & Historic Fortress Trek",
        places: ["Karla Caves", "Bhaja Caves", "Lohagad Fort Trek"],
        route: "Karla Caves → Bhaja Caves → Lohagad Fort Trek",
        baseGroupBudget: 1900,
        groupBudgetPct: 0.38,
        transport: "Shared taxi for Karla-Bhaja circuit (₹700) + trek walk up to Lohagad",
        foodType: "Local Maharashtrian misal pav, pithla bhakri at the base village, packed dry snacks",
        wardrobeAdvice: {
          outfit: "Comfortable athletic trek shorts or cargo trousers + breathable tank top or cotton sports tee",
          layer: "Light windbreaker jacket or hoodie (it gets windy at the summit of Lohagad Fort at 1,033m elevation)",
          footwear: "Sturdy hiking sneakers with deep lugged rubber tread for steep rock-cut steps",
          styleVibe: "Sahyadri Fort Hiker · Rugged Explorer",
          reason: "Over 350 stone steps up to Karla Caves and a 4-km uphill climb to Lohagad's Vinchukata (Scorpion's Tail).",
        },
        highlights: "2,200-year-old wooden-roofed Chaitya hall at Karla, scenic waterfalls along Bhaja steps, 360° fort vistas",
        activities: [
          "08:30 AM: Climb the ancient rock-cut stairs to Karla Caves to see the Great Chaitya Hall.",
          "11:30 AM: Short drive to Bhaja Caves with its tranquil stupa cluster and monsoon streams.",
          "01:00 PM: Traditional lunch of spicy Misal Pav and Pithla Bhakri in Malavli village.",
          "02:30 PM: Ascend Lohagad Fort through the four grand defensive gates.",
          "05:00 PM: Walk along the famous Vinchu Kata fortification ridge overlooking Pawna Dam."
        ]
      },
      {
        dayLabel: "Day 3 🏕️",
        theme: "Lakeside Serenity, Heritage Chikki & Sunset Reflections",
        places: ["Rajmachi Point", "Lonavala Chikki Bazaar", "Pawna Lake"],
        route: "Rajmachi Point → Lonavala Chikki Bazaar → Pawna Lake",
        baseGroupBudget: 1500,
        groupBudgetPct: 0.27,
        transport: "Auto-rickshaw to Rajmachi viewpoint + cab to Pawna lakeside",
        foodType: "Maganlal chikki tasting, fudge at Cooper's, lakeside barbecue & dhaba dinner",
        wardrobeAdvice: {
          outfit: "Casual cotton shorts or joggers + relaxed tank top or graphic tee",
          layer: "Cozy fleece jacket, light denim jacket, or hoodie (temperatures drop significantly near Pawna Lake at night)",
          footwear: "Comfortable lifestyle sneakers or slip-on espadrilles",
          styleVibe: "Lakeside Camp · Casual Weekend Chill",
          reason: "Relaxed sightseeing in town followed by cool breezes and campfires along the water at Pawna.",
        },
        highlights: "Distant view of Rajmachi Fort peaks, shopping for walnut & crushed peanut chikki, mirror-like lake waters at sunset",
        activities: [
          "09:30 AM: Panoramic morning vistas of Shivaji's Rajmachi Fort and valley from Rajmachi Point.",
          "11:30 AM: Walk through Lonavala town bazaar; sample authentic crushed peanut, dry fruit, and chocolate chikki.",
          "02:30 PM: Drive down the scenic winding road to Pawna Lake.",
          "04:30 PM: Lakeside walk, boating, and watching the sunset glow reflect across the water.",
          "07:30 PM: Bonfire dinner and acoustic stargazing by the lake."
        ]
      },
      {
        dayLabel: "Day 4 ⛰️",
        theme: "Duke's Nose Ridge Trek & Misty Khandala Ghats",
        places: ["Duke's Nose (Nagphani)", "Amrutanjan Point", "Khandala Sunset Point", "Bazaar Street"],
        route: "Duke's Nose Trail → Amrutanjan Point → Khandala Ghat → Sunset View",
        baseGroupBudget: 1600,
        groupBudgetPct: 0.18,
        transport: "Local auto to Kurvande village base + scenic hill walk",
        foodType: "Steaming tea, roasted sweet corn, cliffside Maggi, and Cooper's chocolate walnut fudge",
        wardrobeAdvice: {
          outfit: "Lightweight cargo shorts or trek pants + breathable athletic tee",
          layer: "Packable windcheater jacket for strong ridge gusts",
          footwear: "High-traction trail shoes or hiking sneakers",
          styleVibe: "Ridge Trekker · Sahyadri Trail",
          reason: "Steep granite cliff ridge with intense monsoon winds and rocky trail ascent.",
        },
        highlights: "Nagphani cliff shaped like Duke of Wellington's nose, valley drop into Konkan plains, misty expressway viewpoints",
        activities: [
          "08:00 AM: Morning scenic trek along Kurvande ridge to Duke's Nose cliff edge.",
          "11:30 AM: Panoramic views of Mumbai-Pune expressway from historic Amrutanjan Point.",
          "02:00 PM: Cooper's legendary walnut fudge tasting in town center.",
          "05:00 PM: Golden hour watching mist roll through the Khandala Ghats."
        ]
      },
      {
        dayLabel: "Day 5 🏰",
        theme: "Visapur Fort Monsoon Cascades & Heritage Farewell",
        places: ["Visapur Fort Waterfall Steps", "Wax Museum", "Tungarli Lake", "Departure"],
        route: "Visapur Waterfall Trail → Wax Museum → Tungarli Lake → Lonavala Station",
        baseGroupBudget: 1500,
        groupBudgetPct: 0.17,
        transport: "Shared taxi to Patan village + return auto to Lonavala station",
        foodType: "Pithla Bhakri with thecha, hot samosas, farewell chai and boxed Maganlal chikki",
        wardrobeAdvice: {
          outfit: "Quick-dry shorts or synthetic activewear + lightweight dri-fit tee",
          layer: "Dry change of clothes in waterproof pouch",
          footwear: "Grippy water sandals or trail shoes that can get completely soaked",
          styleVibe: "Waterfall Hiker · Adventure Farewell",
          reason: "Walking up continuous waterfall cascades on stone steps inside Visapur Fort.",
        },
        highlights: "Climbing ancient stone steps with natural waterfall gushing over your feet, panoramic twin fort views of Lohagad",
        activities: [
          "08:30 AM: Trek up the waterfall-drenched stone staircase of Visapur Fort.",
          "01:00 PM: Hearty rustic Maharashtrian lunch of Pithla Bhakri at base village.",
          "03:30 PM: Pick up boxed peanut and dry-fruit chikkis and fudge for family.",
          "05:30 PM: Transfer to Lonavala Railway Station / Expressway for departure."
        ]
      }
    ]
  },

  "Delhi": {
    travelNote: "Delhi Metro (Yellow/Violet/Blue Lines) + e-rickshaws + walking",
    foodNote: "Legendary Old Delhi Mughlai & street chaat, Paranthe Wali Gali, Khan Market cafés",
    accommodationNote: "Accommodation not included in budget; best near CP, Paharganj, or South Delhi",
    defaultBuffer: 1000,
    days: [
      {
        dayLabel: "Day 1 🏛️",
        theme: "Mughal Grandeur & Old Delhi Food Odyssey",
        places: ["Red Fort", "Chandni Chowk", "Jama Masjid", "Paranthe Wali Gali", "India Gate"],
        route: "Red Fort → Chandni Chowk → Jama Masjid → Paranthe Wali Gali → India Gate",
        baseGroupBudget: 1800,
        groupBudgetPct: 0.22,
        transport: "Metro Yellow Line to Chandni Chowk + cycle-rickshaw + evening Metro to Central Secretariat",
        foodType: "Pt. Kanhaiyalal Durgaprasad parathas, Karim's mutton korma/seekh, Jalebi Wala rabdi-jalebi",
        wardrobeAdvice: {
          outfit: "Breathable loose cotton kurta or t-shirt + comfortable linen trousers or modest cotton pants",
          layer: "Cotton scarf or dupatta (essential for wrapping around shoulders/head to enter Jama Masjid)",
          footwear: "Comfortable slip-off shoes or loafers (shoes must be removed at the mosque entrance)",
          styleVibe: "Heritage Modest · Old City Cultural",
          reason: "Crowded narrow lanes in Chandni Chowk; religious dress code at Jama Masjid; warm afternoon sun at Red Fort.",
        },
        highlights: "UNESCO Red Fort ramparts, Asia's largest spice market, evening illumination at India Gate",
        activities: [
          "09:00 AM: Tour the red sandstone ramparts and Diwan-i-Khas of UNESCO Red Fort.",
          "11:30 AM: Cycle-rickshaw through the spice aromas of Khari Baoli to Jama Masjid.",
          "01:30 PM: Feast at Paranthe Wali Gali and Karim's near Jama Masjid gate 1.",
          "03:30 PM: Explore Dariba Kalan silver market and Kinari Bazaar.",
          "06:30 PM: Evening stroll down Kartavya Path to view illuminated India Gate war memorial."
        ]
      },
      {
        dayLabel: "Day 2 🌿",
        theme: "Pre-Mughal Tombs, Sufi Music & Heritage Gardens",
        places: ["Humayun's Tomb", "Sunder Nursery", "Nizamuddin Dargah", "Lodhi Art District"],
        route: "Humayun's Tomb → Sunder Nursery → Nizamuddin Dargah → Lodhi Art District",
        baseGroupBudget: 1600,
        groupBudgetPct: 0.20,
        transport: "Metro to JLN Stadium + auto-rickshaws + walking",
        foodType: "Café Lotus at Sunder Nursery, street kebabs at Ghalib Kebab Corner in Nizamuddin Basti",
        wardrobeAdvice: {
          outfit: "Relaxed cotton shirt or kurti + breathable chinos or linen culottes",
          layer: "Light scarf or pashmina shawl for the Dargah; light cardigan for evening",
          footwear: "Easy-to-remove walking flats or loafers",
          styleVibe: "Art District Bohemian · Garden Casual",
          reason: "Expansive garden walks at Sunder Nursery and open courtyards at Humayun's Tomb.",
        },
        highlights: "Charbagh garden tomb that inspired the Taj Mahal, vibrant open-air street art murals in Lodhi Colony",
        activities: [
          "09:00 AM: Photograph the geometric perfection and red sandstone dome of Humayun's Tomb.",
          "11:30 AM: Walk through Sunder Nursery's botanical gardens, marble fountains, and artisan market.",
          "02:00 PM: Authentic kebabs and biryani in historic Nizamuddin Basti.",
          "04:00 PM: Walking tour of Lodhi Art District's world-famous street art murals."
        ]
      },
      {
        dayLabel: "Day 3 🏺",
        theme: "Ancient Minarets, Urban Village Cafés & Crafts",
        places: ["Qutub Minar", "Mehrauli Archaeological Park", "Hauz Khas Village", "Dilli Haat INA"],
        route: "Qutub Minar → Mehrauli Archaeological Park → Hauz Khas Village → Dilli Haat",
        baseGroupBudget: 1700,
        groupBudgetPct: 0.21,
        transport: "Yellow Line Metro to Qutub Minar station + auto to HKV + Metro to INA",
        foodType: "Social or Coast Café at Hauz Khas, state food stalls at Dilli Haat (Momos, Kashmiri Wazwan)",
        wardrobeAdvice: {
          outfit: "Trendy casual tee or sleeveless top + stylish shorts or cotton chinos",
          layer: "Sunglasses + light summer jacket for air-conditioned café lounging",
          footwear: "Comfortable cushioned sneakers for walking the ruins and Dilli Haat stalls",
          styleVibe: "Urban Chic · Fusion Vintage",
          reason: "Mix of sunny outdoor archaeological ruins and trendy upscale boutique cafés in Hauz Khas.",
        },
        highlights: "73m-tall 12th-century victory minaret, medieval reservoir ruins, multi-state culinary feast at Dilli Haat",
        activities: [
          "09:00 AM: Stand beneath the 1,600-year-old rust-resistant iron pillar at Qutub Minar complex.",
          "11:30 AM: Stroll the shaded forested ruins of Jamali Kamali in Mehrauli Park.",
          "01:30 PM: Lakeside lunch overlooking Hauz Khas medieval madrasa and lake.",
          "04:30 PM: Handicraft shopping and dinner hopping across 20 state food stalls at Dilli Haat INA."
        ]
      },
      {
        dayLabel: "Day 4 🏛️",
        theme: "Lutyens' Imperial Grandeur, National Treasures & CP Nightlife",
        places: ["Rashtrapati Bhavan", "National Museum", "Agrasen ki Baoli", "Connaught Place"],
        route: "Kartavya Path → National Museum → Agrasen ki Baoli → Connaught Place",
        baseGroupBudget: 1700,
        groupBudgetPct: 0.18,
        transport: "Delhi Metro Blue/Yellow Lines + walking colonnades",
        foodType: "Wenger's Deli patties and shrikhand, Keventers thick milkshakes, Saravana Bhavan in CP",
        wardrobeAdvice: {
          outfit: "Smart-casual linen shirt or stylish kurti + tailored chinos or linen trousers",
          layer: "Light blazer or cardigan for air-conditioned museum galleries",
          footwear: "Comfortable cushioned walking loafers or clean white sneakers",
          styleVibe: "Diplomatic Enclave Chic · Metropolitan",
          reason: "Broad open avenues in Central Vista combined with marble floor museum galleries and CP heritage corridors.",
        },
        highlights: "Lutyens' stately colonial architecture, Harappan Indus Valley artifacts at National Museum, 14th-century stepwell",
        activities: [
          "09:30 AM: Stroll past North and South Blocks along Kartavya Path.",
          "11:00 AM: View Dancing Girl bronze and Harappan relics at National Museum.",
          "02:00 PM: Lunch and bakery run at historic Wenger's in CP.",
          "04:30 PM: Descend into the dramatic arches of Agrasen ki Baoli.",
          "07:00 PM: Experience CP's lively central park and heritage colonnade nightlife."
        ]
      },
      {
        dayLabel: "Day 5 🪔",
        theme: "Modern Spiritual Marvels, Lotus Blossom & Farewell Bazaar",
        places: ["Akshardham Temple", "Lotus Temple", "Waste to Wonder Park", "Departure"],
        route: "Akshardham Temple Complex → Lotus Temple → Waste to Wonder → NDLS / IGI Airport",
        baseGroupBudget: 1600,
        groupBudgetPct: 0.17,
        transport: "Blue Line / Violet Line Metro + pre-booked cab for departure",
        foodType: "Pure sattvic dining at Premvati Food Court (Akshardham), Gulab Jamuns, packed travel snacks",
        wardrobeAdvice: {
          outfit: "Modest breathable cotton attire (shoulders and knees strictly covered)",
          layer: "Light cotton scarf or stole",
          footwear: "Slip-on sandals (must be deposited at temple security cloakrooms)",
          styleVibe: "Spiritual Reverence · Pure Linen",
          reason: "Strict religious security guidelines at Akshardham and quiet contemplation hall at Lotus Temple.",
        },
        highlights: "Intricately hand-carved pink sandstone temple mandir, boat ride through 10,000 years of Indian civilization, lotus petal architecture",
        activities: [
          "09:00 AM: Explore the monumental hand-carved sandstone and marble pavilions of Akshardham.",
          "12:30 PM: Cultural exhibition boat ride and vegetarian lunch at Premvati.",
          "03:00 PM: Meditative silence inside the Baháʼí Lotus Temple.",
          "06:00 PM: Transfer to railway station or airport with sweet memories."
        ]
      }
    ]
  },

  "Goa": {
    travelNote: "Rented scooters/bikes (₹350/day) or shared self-drive hatchback + walking",
    foodNote: "Authentic Goan fish curry thali, freshly caught kingfish, beach shack cocktails/kokum feni, poi bread",
    accommodationNote: "Accommodation not included in budget; best in Anjuna, Vagator, Panaji, or Palolem",
    defaultBuffer: 1000,
    days: [
      {
        dayLabel: "Day 1 🏖️",
        theme: "North Coast Cliffs, Sea Breezes & Sunset Vibe",
        places: ["Aguada Fort", "Sinquerim Beach", "Anjuna Cliff Walk", "Vagator Sunset Point"],
        route: "Aguada Fort → Sinquerim Beach → Anjuna Cliff Walk → Vagator Sunset Point",
        baseGroupBudget: 1800,
        groupBudgetPct: 0.25,
        transport: "Rented scooters or shared taxi (₹350 per scooter / fuel ₹200)",
        foodType: "Beach shack prawn thali, Sol Kadhi, cold tenders, freshly grilled squid",
        wardrobeAdvice: {
          outfit: "Printed resort linen shirt or breezy tank top + quick-dry swim shorts or casual denim shorts",
          layer: "UV-blocking sunglasses + sun hat + light cotton overshirt",
          footwear: "Waterproof flip-flops or water sandals (easy to slip off on sandy beaches)",
          styleVibe: "Tropical Resort · Bohemian Coastal",
          reason: "Hot beach sunshine, sea spray at forts, and relaxed evening beach shack lounges.",
        },
        highlights: "17th-century lighthouse overlooking the Arabian sea, panoramic clifftop sunset at Chapora Fort",
        activities: [
          "09:30 AM: Explore Fort Aguada's Portuguese bastions and historic freshwater spring.",
          "12:00 PM: Relax at Sinquerim beach with fresh coconut water and light beach snacks.",
          "02:30 PM: Ride north to Anjuna; explore flea markets and clifftop beach bars.",
          "05:30 PM: Climb to Chapora Fort (Dil Chahta Hai point) for an unforgettable golden hour sunset."
        ]
      },
      {
        dayLabel: "Day 2 🏛️",
        theme: "Portuguese Heritage, Colorful Latin Quarter & River Cruise",
        places: ["Fontainhas Latin Quarter", "Old Goa Basilica of Bom Jesus", "Se Cathedral", "Mandovi River Promenade"],
        route: "Fontainhas → Old Goa Basilica → Se Cathedral → Mandovi River Promenade",
        baseGroupBudget: 1900,
        groupBudgetPct: 0.26,
        transport: "Scooter or local bus to Panaji + walking through heritage streets",
        foodType: "Ritz Classic Panaji for fish thali, almond croissants at Confeitaria 31 De Janeiro",
        wardrobeAdvice: {
          outfit: "Chic linen shirt or floral summer dress + tailored shorts or chinos",
          layer: "Light cotton shrug or scarf (required when entering Basilica of Bom Jesus)",
          footwear: "Comfortable stylish walking espadrilles or leather sandals",
          styleVibe: "Portuguese Colonial Vintage · Pastel Street Chic",
          reason: "Cobblestone streets of Fontainhas are ultra-photogenic; churches require covered shoulders and knees.",
        },
        highlights: "Vibrant yellow, blue, and terracotta Portuguese villas, UNESCO World Heritage 400-year-old churches",
        activities: [
          "09:00 AM: Morning photo walk through the vivid streets of Fontainhas Latin Quarter in Panaji.",
          "11:00 AM: Fresh pastries and Goan coffee at a century-old Portuguese bakery.",
          "01:00 PM: Famous Goan fish curry thali at Ritz Classic.",
          "03:00 PM: Visit UNESCO Basilica of Bom Jesus housing the sacred relics of St. Francis Xavier.",
          "06:30 PM: Sunset riverfront stroll along Mandovi River with live Goan music."
        ]
      },
      {
        dayLabel: "Day 3 🌴",
        theme: "Peaceful South Coast Bays & Hidden Sea Forts",
        places: ["Cabo de Rama Fort", "Agonda Beach", "Palolem Crescent Bay"],
        route: "Cabo de Rama Fort → Agonda Beach → Palolem Crescent Bay",
        baseGroupBudget: 2000,
        groupBudgetPct: 0.28,
        transport: "Scenic coastal ride south along NH66",
        foodType: "Fresh catch of the day at beach huts, garlic butter calamari, fresh mango lassi",
        wardrobeAdvice: {
          outfit: "Light tank top or swimsuit with linen cover-up + linen beach shorts",
          layer: "Light windbreaker jacket for breezy scooter ride; sun protection hat",
          footwear: "Easy slip-on sandals or barefoot on the sand",
          styleVibe: "Quiet Cove · Pure Laidback",
          reason: "Dramatic sea cliff fortress with strong winds, followed by pristine white sands at Palolem.",
        },
        highlights: "Ancient cliff fortress overlooking virgin turquoise waters, dolphin spotting in Palolem bay",
        activities: [
          "10:00 AM: Stand on the ancient ramparts of Cabo de Rama Fort with sweeping 270° sea views.",
          "01:00 PM: Fresh seafood lunch at an Agonda beach hut directly on the quiet sand.",
          "03:30 PM: Relax at Palolem's gentle crescent bay; optional kayak ride out into the calm cove.",
          "06:30 PM: Candlelit beach dinner with feet in the sand under the stars."
        ]
      },
      {
        dayLabel: "Day 4 🐬",
        theme: "Island Marine Safari, Coral Snorkeling & Watersports",
        places: ["Grand Island Boat Pier", "Bat Island Snorkel Cove", "Calangute Watersports Point"],
        route: "Grand Island Cruise → Coral Reef Snorkeling → Dolphin Bay → Calangute Beach",
        baseGroupBudget: 2200,
        groupBudgetPct: 0.22,
        transport: "Boat jetty transfer + island ferry cruise + walking",
        foodType: "Freshly grilled island fish barbecue, cold beer/nimbu soda, Goan choris pav in Calangute",
        wardrobeAdvice: {
          outfit: "Quick-dry swim trunks / boardshorts + UV rashguard or breathable linen top",
          layer: "Waterproof dry bag for phone/wallet + polarized sunglasses + sun visor",
          footwear: "Aqua shoes or waterproof sandals",
          styleVibe: "Ocean Explorer · Island Tropical",
          reason: "Full day in open saltwater, boat decks, reef snorkeling, and beach sand.",
        },
        highlights: "Pods of wild Indo-Pacific humpback dolphins jumping alongside boat, snorkeling over Arabian sea coral reefs",
        activities: [
          "08:00 AM: Board catamaran/boat towards Grand Island; watch wild dolphins en route.",
          "10:30 AM: Guided snorkeling among shallow reef fish near Bat Island.",
          "01:00 PM: Island beach barbecue lunch and music.",
          "04:30 PM: Parasailing or jet-ski session along Calangute shoreline.",
          "07:30 PM: Sunset cocktails at a lively beach shack."
        ]
      },
      {
        dayLabel: "Day 5 🌿",
        theme: "Western Ghats Waterfall Wonder, Spice Heritage & Farewell Feast",
        places: ["Dudhsagar Waterfalls", "Sahakari Spice Farm", "Panaji Municipal Market", "Departure"],
        route: "Dudhsagar Jeep Safari → Spice Plantation Lunch → Panaji Market → Dabolim / MOPA Airport",
        baseGroupBudget: 2100,
        groupBudgetPct: 0.21,
        transport: "4x4 Jeep safari through jungle streams + private taxi transfer to airport/station",
        foodType: "Traditional Goan Saraswat buffet served on banana leaves, fresh feni tasting, cashew sweets",
        wardrobeAdvice: {
          outfit: "Comfortable trek shorts or quick-dry active pants + breathable moisture-wicking tee",
          layer: "Life jacket (provided at falls) + light change of dry clothes in waterproof bag",
          footwear: "Sturdy non-slip trail runners or strapped trekking sandals",
          styleVibe: "Jungle Safari · Spice Trail",
          reason: "Rugged 4x4 off-road jungle drive through river crossings, followed by steep wet rocks at Dudhsagar natural pool.",
        },
        highlights: "Four-tiered majestic white cascade dropping 310 meters through emerald Ghats, aromatic vanilla and cardamom plantations",
        activities: [
          "07:30 AM: Off-road 4x4 jungle jeep safari through Bhagwan Mahavir Wildlife Sanctuary to Dudhsagar.",
          "10:00 AM: Swim in the refreshing natural rock pool beneath the mighty waterfalls.",
          "01:00 PM: Aromatic spice tour with traditional Goan lunch on banana leaves at Sahakari Spice Farm.",
          "04:00 PM: Stroll through local spice gardens and taste organic cardamom and vanilla tea."
        ]
      },
      {
        dayLabel: "Day 6 🛶",
        theme: "Backwater Ferry Crossing, Mangrove Kayaks & Island Villages",
        isOffbeat: true,
        places: ["Ribandar Ferry Pier", "Divar Island", "Piedade Church Hilltop", "Chorao Bird Sanctuary"],
        route: "Ribandar Ferry → Divar Island Village → Piedade Hilltop → Chorao Mangrove Safari",
        baseGroupBudget: 1700,
        groupBudgetPct: 0.18,
        transport: "Free river ferry across Mandovi + hired bicycles/scooters on the island",
        foodType: "Local island taverna fish curry with fresh poi bread, crab xec xec, kokum sherbet",
        wardrobeAdvice: {
          outfit: "Breezy linen shorts or cotton bermudas + lightweight breathable camp collar shirt",
          layer: "Wide-brim sun hat + polarized sunglasses for mangrove glare",
          footwear: "Waterproof slip-on sandals or deck shoes (stepping onto ferry ramps and mud trails)",
          styleVibe: "Slow Island Living · River Wanderer",
          reason: "Peaceful quiet island with zero tourist traffic; sun-dappled mangrove kayak trails and heritage church hilltop.",
        },
        highlights: "Ferry cruise through tranquil Mandovi backwaters, panoramic view of river estuaries from Piedade church, spot kingfishers and otters in mangroves",
        activities: [
          "08:30 AM: Board the charming local river ferry from Ribandar to peaceful Divar Island.",
          "10:00 AM: Cycle through quiet sleepy Indo-Portuguese villages and climb to Our Lady of Piety Church atop the island hill.",
          "01:00 PM: Traditional Goan Catholic lunch at a local village taverna savoring authentic crab xec xec and fresh poi.",
          "03:30 PM: Take short river hop to Chorao Island; guided silent kayak safari through Dr. Salim Ali Bird Sanctuary mangroves.",
          "06:30 PM: Sunset river breeze along the ferry jetty with freshly fried local fish snacks."
        ]
      },
      {
        dayLabel: "Day 7 🌊",
        theme: "Secret Freshwater Lagoon, Hidden Sea Coves & Turtle Sanctuary",
        isOffbeat: true,
        places: ["Cola Beach Hidden Lagoon", "Khola Cliffs", "Galgibaga Olive Ridley Turtle Beach", "Talpona Estuary"],
        route: "Cola Beach Lagoon → Blue Lagoon Kayaking → Khola Cliffs → Galgibaga Turtle Sanctuary",
        baseGroupBudget: 1900,
        groupBudgetPct: 0.20,
        transport: "Scenic coastal ride south along interior village roads",
        foodType: "Off-grid bamboo beach shack fried pomfret, Goan prawn balchão, tender coconut water",
        wardrobeAdvice: {
          outfit: "Quick-dry swimwear under cotton cover-up or linen shorts + light relaxed tank",
          layer: "UV rashguard for freshwater kayak paddling; waterproof pouch for essentials",
          footwear: "Trail sandals with water drainage (rugged dirt path down to Cola lagoon)",
          styleVibe: "Wild Coastal Solitude · Secret Lagoon",
          reason: "Hidden lagoon separated from rough ocean surf by a narrow sandbar; secluded nature reserve with minimal commercialization.",
        },
        highlights: "Emerald freshwater lagoon meeting Arabian sea waves, untouched silver sands at Galgibaga turtle reserve",
        activities: [
          "09:00 AM: Walk the hidden red-earth trail down the cliffs to reach the secret Cola Beach Lagoon.",
          "10:30 AM: Rent a kayak to glide across the still emerald freshwater lagoon surrounded by leaning coconut palms.",
          "01:30 PM: Fresh seafood cooked on order at a rustic cliffside bamboo hut.",
          "03:45 PM: Ride further south to pristine Galgibaga Beach, famous for protected Olive Ridley turtle nesting grounds and complete quietude.",
          "06:30 PM: Golden hour sunset walk along empty sands with only the sound of rolling waves."
        ]
      },
      {
        dayLabel: "Day 8 🛕",
        theme: "12th-Century Kadamba Rainforest Temple & Natural Rock Pools",
        isOffbeat: true,
        places: ["Tambdi Surla Mahadev Temple", "Bhagwan Mahaveer Rainforest", "Surla Rock Pool", "Nature Trail"],
        route: "Rainforest Trail → Tambdi Surla Basalt Temple → Natural Rock Pool → Jungle Stream",
        baseGroupBudget: 1600,
        groupBudgetPct: 0.17,
        transport: "Private cab into the foothills of the Western Ghats (Anmod Ghat route)",
        foodType: "Rustic Saraswat village thali (tambdi bhaji, varan bhaat, kismoor, sol kadhi)",
        wardrobeAdvice: {
          outfit: "Modest breathable cotton tee or shirt + lightweight quick-dry trekking pants covering knees",
          layer: "Light rainproof jacket or windcheater (dense canopy mist and unexpected hill showers)",
          footwear: "High-traction trail shoes or hiking sneakers with good wet rock grip",
          styleVibe: "Ancient Rainforest Trekker · Sacred Ghats",
          reason: "Sacred 12th-century stone temple requires respectful attire; forest trails around the river can be damp and mossy.",
        },
        highlights: "Goa's oldest surviving basalt stone temple with intricate ceiling carvings, serene jungle streams and butterflies",
        activities: [
          "08:30 AM: Drive into the lush emerald foothills of the Western Ghats to Bhagwan Mahaveer Wildlife Sanctuary.",
          "10:00 AM: Marvel at the 12th-century Kadamba-Yadava black basalt craftsmanship of Tambdi Surla Mahadev Temple.",
          "12:30 PM: Guided botanical walk along the forest stream spotting giant Malabar squirrels and hornbills.",
          "02:00 PM: Authentic rustic village lunch prepared by local forest community families.",
          "04:00 PM: Dip your feet in the cool crystal-clear natural mountain rock pools before heading back."
        ]
      },
      {
        dayLabel: "Day 9 🌿",
        theme: "Quiet Northern Dunes, Sweet Water Lake & Banyan Tree Grove",
        isOffbeat: true,
        places: ["Morjim Turtle Coast", "Ashwem Pine Palms", "Arambol Sweet Water Lagoon", "Sacred Banyan Tree"],
        route: "Morjim Beach → Ashwem Quiet Sands → Arambol Sweet Water Lake → Jungle Banyan Tree",
        baseGroupBudget: 1800,
        groupBudgetPct: 0.19,
        transport: "Scooter or coastal taxi along northern coastal backroads",
        foodType: "Organic smoothie bowls, fresh woodfired poi pizza, kombucha, kokum ginger cooler",
        wardrobeAdvice: {
          outfit: "Relaxed linen resort shirt + flowy lightweight pants or drawstring beach shorts",
          layer: "Cotton scarf or bandana + UV sunglasses",
          footwear: "Water-friendly slip-ons or barefoot walking on clean sands",
          styleVibe: "Bohemian Coastal Chill · Eco Sanctuary",
          reason: "Relaxed eco-conscious beach stretch followed by a mild hillside stroll to the sweet water lake.",
        },
        highlights: "Peaceful sand dunes at Morjim, freshwater lake nestled behind ocean cliffs at Arambol, meditative banyan grove",
        activities: [
          "09:00 AM: Morning walk along the wide quiet sands of Morjim and Ashwem, admiring the natural sand dune preservation zone.",
          "11:30 AM: Brunch at a serene garden café surrounded by frangipani and coconut palms.",
          "02:30 PM: Walk around the Arambol cliff path to discover the secluded Sweet Water Lagoon tucked beneath green hills.",
          "04:30 PM: Short gentle jungle trail to the ancient Banyan Tree grove in the quiet valley.",
          "06:30 PM: Enjoy acoustic drum circle and sunset contemplation on the northern sands."
        ]
      },
      {
        dayLabel: "Day 10 🫧",
        theme: "Mysterious Bubbling Stepwell, Forest Waterfalls & Organic Spice Groves",
        isOffbeat: true,
        places: ["Netravali Bubble Lake (Budbudit Tali)", "Savari Waterfall Trail", "Tanshikar Organic Spice Farm"],
        route: "Netravali Mystery Bubbling Lake → Savari Waterfall → Organic Spice Farm Lunch",
        baseGroupBudget: 1900,
        groupBudgetPct: 0.19,
        transport: "Hired vehicle to Netravali Wildlife Sanctuary region in South Goa",
        foodType: "Pure farm-to-table organic vegetarian lunch with freshly ground spices and wild honey",
        wardrobeAdvice: {
          outfit: "Durable activewear tee + breathable cargo shorts or moisture-wicking leggings",
          layer: "Extra dry cotton shirt + small towel in daypack",
          footwear: "Aggressive grip trail sandals or waterproof walking sneakers",
          styleVibe: "Deep Hinterland Naturalist · Botanical Wonder",
          reason: "Forest trek to waterfalls and ancient stone tank with unique volcanic/methane bubble acoustics.",
        },
        highlights: "Sacred 400-year-old stone tank where water bubbles rise to the surface in response to hand claps, uncommercialized rainforest cascade",
        activities: [
          "08:30 AM: Scenic morning drive into the deep southern hinterlands of Netravali.",
          "10:30 AM: Witness the fascinating natural phenomenon of Budbudit Tali (Bubbling Lake)—clap hands to trigger continuous water bubbles.",
          "12:00 PM: Nature trek through dense secondary rainforest to Savari Waterfall for a pristine swim.",
          "02:00 PM: Tour the family-owned Tanshikar Organic Spice Farm; learn about black pepper, vanilla, and betel nut cultivation.",
          "05:00 PM: Savor homemade botanical tea and purchase farm-fresh whole spices."
        ]
      },
      {
        dayLabel: "Day 11 🏰",
        theme: "Island Fortresses, Village Bakers & Inland River Life",
        isOffbeat: true,
        places: ["Aldona Cable Bridge", "Corjuem Yellow Basalt Fort", "Moira Heritage Village", "Mapusa Old Market"],
        route: "Aldona Village → Corjuem Fort → Moira Artisan Village → Mapusa Heritage Alleys",
        baseGroupBudget: 1600,
        groupBudgetPct: 0.16,
        transport: "Rented scooter or shared auto through inland bridge crossings",
        foodType: "Authentic Choris Pao from village wood-fired bakery, Goan Bebinca, Solkadhi",
        wardrobeAdvice: {
          outfit: "Classic cotton polo or relaxed short-sleeve button-down + comfortable khaki shorts or chinos",
          layer: "Light summer cotton jacket or linen overshirt",
          footwear: "Comfortable cushioned sneakers for walking village alleys and fort ramparts",
          styleVibe: "Indo-Portuguese Heritage · Village Flâneur",
          reason: "Inland Goa village tour through shaded riverside lanes, historic stone fortresses, and local markets.",
        },
        highlights: "One of only two surviving inland forts in Goa made of dark yellow laterite, picturesque cable-stayed Aldona bridge",
        activities: [
          "09:00 AM: Cross the scenic Aldona cable bridge and walk through the tranquil lanes of one of Goa's most beautiful villages.",
          "10:30 AM: Explore historic 1705 Corjuem Fort on an isolated island in the Mapusa River with 360-degree views of river bends.",
          "01:00 PM: Visit a generations-old village baker's traditional woodfired oven for warm crusty poi and pão.",
          "03:00 PM: Walk through Moira village, famed for its heritage mansions, banana groves, and local pottery.",
          "05:30 PM: Experience the authentic local bustle of Mapusa market for pottery, dried spices, and local sweets."
        ]
      },
      {
        dayLabel: "Day 12 🦋",
        theme: "Secret Butterfly Cove, Cliff Panoramas & Sunset Kayaking",
        isOffbeat: true,
        places: ["Palolem South Cliffs", "Butterfly Beach Hidden Cove", "Honeymoon Island", "Sadolxem Bridge"],
        route: "South Cliff Trail → Butterfly Beach Cove → Kayak to Honeymoon Island → Sadolxem",
        baseGroupBudget: 2100,
        groupBudgetPct: 0.22,
        transport: "Local wooden boat or cliffside foot trail from Leopard Valley",
        foodType: "Fresh grilled butter garlic tiger prawns, poi fish cutlet, fresh tender coconut water",
        wardrobeAdvice: {
          outfit: "Swimwear + lightweight quick-dry sun-protective long sleeve tee + boardshorts",
          layer: "Dry-bag backpack for cameras/phones + baseball cap",
          footwear: "Sturdy water sandals with heel strap (scrambling over rocks and landing on beach)",
          styleVibe: "Hidden Cove Marine · Tropical Explorer",
          reason: "Secluded semicircular beach accessible primarily by boat or cliff scramble; zero road access.",
        },
        highlights: "Hidden amphitheater cove swarming with colorful coastal butterflies, playful dolphins just off the shore, pristine secluded sand",
        activities: [
          "09:00 AM: Catch a traditional boat or hike the coastal forest trail to the secret Butterfly Beach cove.",
          "10:30 AM: Relax on the untouched horseshoe sands surrounded by dense green cliffs and fluttering butterflies.",
          "01:00 PM: Picnic lunch on the sand accompanied by fresh local fruit and cold drinks.",
          "03:30 PM: Kayak around Honeymoon Island exploring sea caves and rock formations.",
          "06:00 PM: Scenic return ride across the historic single-lane bailey bridge at Sadolxem."
        ]
      },
      {
        dayLabel: "Day 13 ⚓",
        theme: "Lighthouse Promontory, River Estuary & Deep Southern Coasts",
        isOffbeat: true,
        places: ["Betul Lighthouse", "Betul Fort Ruins", "Mobor Sal River Estuary", "Cavelossim Coast"],
        route: "Betul Lighthouse Promontory → Betul Fort → Sal River Jetty → Cavelossim Driftwood Walk",
        baseGroupBudget: 1700,
        groupBudgetPct: 0.17,
        transport: "Scenic ride along South Goa's coastal backwaters",
        foodType: "Dockside fishermen's fried mud crabs, authentic Goan fish curry rice, tender coconut",
        wardrobeAdvice: {
          outfit: "Lightweight linen shirt or polo + casual drawstring cotton shorts",
          layer: "Windbreaker or light overshirt for coastal hilltop gusts at the lighthouse",
          footwear: "Easy-to-clean canvas shoes or leather sandals",
          styleVibe: "Nautical Heritage · Estuary Breeze",
          reason: "Elevated headland lighthouse with brisk Arabian sea winds, followed by tranquil river estuary walks.",
        },
        highlights: "Striking red-and-white striped lighthouse perched on hill with dramatic views of Sal River meeting the Arabian Sea",
        activities: [
          "09:30 AM: Climb the scenic headland to Betul Lighthouse for breathtaking panoramas of the fishing harbor and river mouth.",
          "11:30 AM: Explore the weathered ramparts of historic Shivaji-era Betul Fort overlooking the estuary.",
          "01:30 PM: Dine at a legendary local fisherfolk restaurant right by the Betul jetty savoring the freshest catch of the day.",
          "04:00 PM: Watch traditional wooden trawlers and fishing dhows cruise past the sandspit at Mobor estuary.",
          "06:30 PM: Sunset walk along the serene driftwood-lined shore of Cavelossim."
        ]
      },
      {
        dayLabel: "Day 14 🌅",
        theme: "Reis Magos Citadel, Artisan Souvenirs & Sunset Farewell Cruise",
        isOffbeat: false,
        places: ["Reis Magos Fort", "Miramar Beach Promenade", "Fontainhas Artisan Shops", "Farewell Dinner"],
        route: "Reis Magos Fort → Miramar Beach → Fontainhas Souvenirs → Sunset Farewell Cruise → Departure",
        baseGroupBudget: 2200,
        groupBudgetPct: 0.22,
        transport: "Cab for full-day luggage transit and airport/railway transfer",
        foodType: "Grand farewell Goan banquet: kingfish rawa fry, chicken cafreal, serradura, artisanal feni truffles",
        wardrobeAdvice: {
          outfit: "Comfortable smart-casual linen top or button-down + relaxed travel trousers",
          layer: "Cozy travel cardigan or zip jacket for air-conditioned flights or trains",
          footwear: "Slip-on sneakers or airport loafers",
          styleVibe: "Coastal Farewell Chic · Travel Ready",
          reason: "Transitioning from sightseeing to afternoon souvenir shopping and evening departure transit.",
        },
        highlights: "Restored 1551 fortress with views of the entire Mandovi bay, picking up authentic roasted cashews, spices, and azulejos tiles",
        activities: [
          "09:30 AM: Walk the pristine stone ramparts of Reis Magos Fort overlooking the mouth of the Mandovi River.",
          "11:30 AM: Stroll the palm-lined path at Miramar Beach and gaze out towards the open Arabian Sea.",
          "01:30 PM: Celebratory farewell feast enjoying Goa's signature Cafreal and seafood delicacies.",
          "03:30 PM: Pick up keepsake hand-painted Portuguese Azulejos tiles, Feni truffles, and roasted cashews.",
          "06:30 PM: Transfer to MOPA / Dabolim Airport or Madgaon Station with unforgettable memories."
        ]
      }
    ]
  },

  "Jaipur": {
    travelNote: "Auto-rickshaw / e-rickshaw for city + cab for Amer/Nahargarh + walking",
    foodNote: "Lassiwala curd lassi, Rawat Pyaaz Kachori, spicy Dal Baati Churma, Ghewar sweets",
    accommodationNote: "Accommodation not included in budget; best near MI Road, C-Scheme, or Bani Park",
    defaultBuffer: 1000,
    days: [
      {
        dayLabel: "Day 1 🏛️",
        theme: "Pink City Forts, Royal Palaces & Bazars",
        places: ["Hawa Mahal", "City Palace", "Jantar Mantar", "Johari Bazaar"],
        route: "Hawa Mahal → City Palace → Jantar Mantar → Johari Bazaar",
        baseGroupBudget: 1700,
        groupBudgetPct: 0.24,
        transport: "Auto-rickshaw (₹150 shared) + walking inside the walled pink city",
        foodType: "Lassiwala curd lassi in clay kulhads, Rawat Mishtan Bhandar onion kachori",
        wardrobeAdvice: {
          outfit: "Breathable cotton kurti or light collared shirt + cotton shorts or relaxed trousers",
          layer: "Sunglasses + sun hat + light cotton scarf for desert sun protection",
          footwear: "Comfortable cushioned sneakers or juttis for palace courtyards",
          styleVibe: "Royal Heritage · Desert Cotton",
          reason: "Dry desert heat during mid-day; lots of open stone courtyards in City Palace and Jantar Mantar.",
        },
        highlights: "953 latticework honeycomb windows of Hawa Mahal, world's largest stone sundial at Jantar Mantar",
        activities: [
          "08:30 AM: Morning light photos of Hawa Mahal facade across the street from Wind View Café.",
          "10:00 AM: Explore City Palace museum, Peacock Gate courtyard, and royal armory.",
          "01:00 PM: Taste authentic Pyaaz Kachori at Rawat Mishtan Bhandar.",
          "02:30 PM: Marvel at the astronomical instruments at UNESCO Jantar Mantar.",
          "05:00 PM: Vibrant street shopping in Johari Bazaar and Bapu Bazaar for textiles and mojris."
        ]
      },
      {
        dayLabel: "Day 2 🏰",
        theme: "Hilltop Strongholds, Stepwells & Sunset Fortress",
        places: ["Amber (Amer) Fort", "Panna Meena Kund", "Jal Mahal", "Nahargarh Fort"],
        route: "Amber Fort → Panna Meena Kund → Jal Mahal → Nahargarh Fort",
        baseGroupBudget: 2200,
        groupBudgetPct: 0.25,
        transport: "Hired auto or taxi for Amer-Nahargarh hill circuit (₹700-900 shared)",
        foodType: "Rajasthani Dal Baati Churma, roadside Masala chai at Jal Mahal, Padao restaurant snacks at Nahargarh",
        wardrobeAdvice: {
          outfit: "Breathable polo or athletic tee + sturdy cargo shorts or lightweight trek pants",
          layer: "Light jacket or hoodie (Nahargarh hilltop gets windy and chilly as soon as the sun sets)",
          footwear: "High-traction walking sneakers (steep cobblestone ramp up to Amer Fort)",
          styleVibe: "Fort Trekker · Rajput Splendor",
          reason: "Climbing extensive fort courtyards, subterranean passages, and hilltop walls with sharp elevation changes.",
        },
        highlights: "Mirror mosaic palace (Sheesh Mahal), 16th-century geometric stepwell, golden hour sunset over entire Jaipur from Nahargarh",
        activities: [
          "09:00 AM: Climb the cobblestone ramp into Amber Fort; explore the glittering Sheesh Mahal.",
          "12:30 PM: Visit the dramatic symmetrical staircases of Panna Meena Kund stepwell.",
          "02:00 PM: Photo stop along the lake promenade facing the submerged palace Jal Mahal.",
          "04:30 PM: Drive up the winding Aravalli ridge to Nahargarh Fort.",
          "06:00 PM: Watch the sunset over the entire Pink City skyline from Padao open-air ramparts."
        ]
      },
      {
        dayLabel: "Day 3 🏺",
        theme: "Royal Gardens, Sacred Springs & Folk Heritage Night",
        places: ["Albert Hall Museum", "Sisodia Rani Bagh", "Galtaji Monkey Temple", "Chokhi Dhani"],
        route: "Albert Hall Museum → Sisodia Rani Bagh → Galtaji Temple → Chokhi Dhani Folk Village",
        baseGroupBudget: 2100,
        groupBudgetPct: 0.23,
        transport: "Local cab or auto-rickshaw circuit",
        foodType: "Authentic Rajasthani thali at Chokhi Dhani (Gatte ki Sabzi, Ker Sangri, Bajra Roti with Ghee)",
        wardrobeAdvice: {
          outfit: "Breathable cotton linen shirt or printed Rajasthani kurti + comfortable cotton pants",
          layer: "Light cotton dupatta or stole for temple respect; light jacket for evening outdoor village",
          footwear: "Comfortable slip-on flats or walking sneakers",
          styleVibe: "Rajasthani Folklore · Heritage Chic",
          reason: "Climbing stone paths at Galtaji natural spring gorge and walking open-air sand courtyards at Chokhi Dhani.",
        },
        highlights: "Indo-Saracenic architecture of Albert Hall, natural holy freshwater springs at Galtaji, live puppet shows, Kalbeliya dance, and camel rides",
        activities: [
          "09:30 AM: Admire Persian carpets, royal costumes, and miniature paintings at Albert Hall Museum.",
          "12:00 PM: Peaceful walk through stepped fountains of Sisodia Rani Bagh.",
          "02:30 PM: Explore the sacred pink stone shrines and natural kunds of Galtaji in the Aravalli gorge.",
          "06:00 PM: Immerse in traditional puppet shows, fire acrobatics, and royal thali dinner at Chokhi Dhani."
        ]
      },
      {
        dayLabel: "Day 4 🛡️",
        theme: "Invincible Strongholds, Giant Cannons & Textile Bazaars",
        places: ["Jaigarh Fort", "Amer Sagar", "Chand Baori Stepwell", "Bapu Bazaar"],
        route: "Jaigarh Fort → Amer Sagar → Chand Baori Stepwell → Bapu Bazaar",
        baseGroupBudget: 1900,
        groupBudgetPct: 0.21,
        transport: "Hired cab for hill fort + walking bazaar lanes",
        foodType: "Gulab Ji Chai Wale bun maska & kadak chai, spicy Mirchi Vadas, Pandit Kulfi at Sirsi Road",
        wardrobeAdvice: {
          outfit: "Relaxed polo or durable cotton tee + breathable denim shorts or lightweight chinos",
          layer: "Sun visor or baseball cap + UV sunglasses",
          footwear: "Comfortable cushioned walking sneakers with good rubber grip",
          styleVibe: "Fortress Rampart Trek · Urban Street",
          reason: "Extensive rampart walks at Jaigarh (Cheel ka Teela) and busy textile shopping lanes.",
        },
        highlights: "World's largest cannon on wheels 'Jaivana' (50-ton barrel), hidden underground tunnels connecting to Amer, authentic block-printed Sanganeri bedsheets",
        activities: [
          "09:00 AM: Walk the high battlements of Jaigarh Fort and examine the legendary Jaivana cannon.",
          "11:30 AM: Walk through the historic water catchment works and secret subterranean tunnels.",
          "01:30 PM: Lunch of hot Mirchi Vadas and lassi in the old city.",
          "03:30 PM: Hand-block printing demonstration and textile shopping in Bapu Bazaar.",
          "06:30 PM: Kulfi falooda tasting near Link Road."
        ]
      },
      {
        dayLabel: "Day 5 🌸",
        theme: "Instagram Icon Patrika Gate, Street Food Hub & Farewell Sunset",
        places: ["Patrika Gate (Jawahar Circle)", "Central Park & MASALA CHOWK", "Departure"],
        route: "Patrika Gate → Jawahar Kala Kendra → Masala Chowk Food Hub → Jaipur Airport / Railway Station",
        baseGroupBudget: 1500,
        groupBudgetPct: 0.17,
        transport: "City auto / cab with luggage",
        foodType: "Masala Chowk open-air food park feast: Samrat Samosas, Sethi Tikka, Bhagat Tarachand chaat",
        wardrobeAdvice: {
          outfit: "Vibrant photogenic outfit (bright linen shirt, pastel dress or kurti) + comfortable travel trousers",
          layer: "Light travel hoodie or cardigan for evening transit",
          footwear: "Slip-on sneakers for easy travel departure",
          styleVibe: "Photogenic Farewell · Pastel Regal",
          reason: "Iconic photo backdrop at Patrika Gate's hand-painted archways, followed by comfortable departure travel.",
        },
        highlights: "Nine rainbow-painted arches depicting the history of Rajasthan at Patrika Gate, 21 legendary street food vendors united at Masala Chowk",
        activities: [
          "09:00 AM: Photography session in the morning golden light under the hand-painted arches of Patrika Gate.",
          "11:30 AM: Browse art exhibits and modern Rajasthani architecture at Jawahar Kala Kendra.",
          "01:30 PM: Multi-vendor street food lunch at Masala Chowk next to Ram Niwas Garden.",
          "03:30 PM: Final souvenir pickup of famous Jaipur Ghewar sweets at LMB.",
          "05:30 PM: Departure from Jaipur International Airport / Railway Station."
        ]
      }
    ]
  },
  "Rann of Kutch": {
    travelNote: "Private SUV/cab (essential for desert distances) + shared autos in Bhuj city",
    foodNote: "Authentic Kutchi Dabeli, Bajra no Rotlo with Ringna no Olo & white butter, Gulab Pak, Khichdi-Kadhi",
    accommodationNote: "Accommodation not included; options: Heritage homestays in Bhuj, Traditional Bhungas in Dhordo Tent City",
    defaultBuffer: 1500,
    days: [
      {
        dayLabel: "Day 1 🏰",
        theme: "Bhuj Heritage, Venetian Palaces & Artisan Weavers",
        places: ["Prag Mahal", "Aina Mahal", "Kutch Museum", "Hamirsar Lake", "Bhujodi Craft Village"],
        route: "Bhuj Arrival → Aina Mahal → Prag Mahal → Hamirsar Lake → Bhujodi",
        baseGroupBudget: 1800,
        groupBudgetPct: 0.19,
        transport: "Auto-rickshaws in Bhuj + short cab to Bhujodi village (8 km)",
        foodType: "Authentic Kutchi Dabeli at Jubilee Ground & traditional Gujarati thali",
        wardrobeAdvice: {
          outfit: "Breathable cotton kurti or linen shirt + relaxed cotton trousers",
          layer: "Light stole or scarf (palace modesty + dust protection)",
          footwear: "Slip-on cushioned loafers or walking sandals",
          styleVibe: "Heritage Cultural · Earthy Cotton",
          reason: "Mild to warm daytime exploring stone courtyards, narrow heritage lanes, and artisan workshops."
        },
        highlights: "Intricate mirror-work in Aina Mahal, clock tower views from Prag Mahal, handloom weaving in Bhujodi",
        activities: [
          "09:30 AM: Explore 18th-century Venetian glass & mirror halls of Aina Mahal.",
          "11:30 AM: Climb Prag Mahal Gothic bell tower for 360° views across Bhuj city.",
          "01:30 PM: Authentic Kutchi thali lunch with fresh buttermilk (chaas).",
          "03:30 PM: Visit Bhujodi weaver village; watch master Vankar artisans weave Rabari shawls on pit looms.",
          "06:30 PM: Sunset stroll around Hamirsar Lake with hot steaming tea and dabeli."
        ]
      },
      {
        dayLabel: "Day 2 🌅",
        theme: "Endless White Desert, Salt Sunset & Moonlight Magic",
        places: ["Bhirandiyara Checkpoint", "Dhordo Village", "White Desert (Great Rann)", "Sunset Point"],
        route: "Bhuj → Bhirandiyara Permit Post → Dhordo → White Rann Salt Flats",
        baseGroupBudget: 2400,
        groupBudgetPct: 0.25,
        transport: "Private cab / SUV north through Banni grasslands (approx 80 km)",
        foodType: "Fresh Mawa at Bhirandiyara, Kutchi Khichdi-Kadhi & Bajra Rotlo dinner in Dhordo",
        wardrobeAdvice: {
          outfit: "Crisp white or vibrant saffron/red cotton shirt/dress (striking contrast against white salt)",
          layer: "Heavy fleece jacket or Kutchi embroidered wool shawl (temperatures plunge to 10°C at night)",
          footwear: "Sturdy closed sneakers (dried salt crystals are rough and sharp)",
          styleVibe: "Desert Nomad · High-Contrast Chic",
          reason: "Blinding white desert glare requires 100% UV sunglasses; radical night temperature drop requires warm thermal layers."
        },
        highlights: "Infinite glittering white salt crust, breathtaking desert twilight, jackal calls & stargazing",
        activities: [
          "11:00 AM: Drive north to Bhirandiyara checkpoint; secure Rann permit and taste legendary fresh mawa.",
          "02:00 PM: Check into traditional mud Bhungas in Dhordo; freshen up and hydrate.",
          "04:30 PM: Walk or take camel cart out onto the Great Rann of Kutch as the salt flats begin to glow.",
          "06:00 PM: Witness the unforgettable crimson-to-purple desert sunset over the infinite white horizon.",
          "08:30 PM: Traditional Kutchi dinner by bonfire with live folk music and full-moon desert walk."
        ]
      },
      {
        dayLabel: "Day 3 🏔️",
        theme: "Highest Point in Kutch & Jackal Feeding Ritual",
        places: ["Kala Dungar (Black Hill)", "Dattatreya Temple", "India Bridge", "Khadir Bet"],
        route: "Dhordo → Kala Dungar (462m) → Dattatreya Temple → India Bridge Viewpoint",
        baseGroupBudget: 1900,
        groupBudgetPct: 0.20,
        transport: "Private SUV across steep winding desert roads and northern border checkpoint",
        foodType: "Temple prasad, local roadside tea dhabas, Ringna no Olo (roasted eggplant mash)",
        wardrobeAdvice: {
          outfit: "Moisture-wicking active polo or durable cotton cargo trousers/shorts",
          layer: "Windproof lightweight jacket (high desert hilltop winds)",
          footwear: "Grip-heavy trail sneakers (rough hillside steps and rocky paths)",
          styleVibe: "Summit Explorer · Windproof Desert Trek",
          reason: "High hill winds at 462m altitude and intense sun exposure along the northern cliffline."
        },
        highlights: "Panoramic 360° views where white desert meets blue sky, 400-year jackal feeding ritual, border views",
        activities: [
          "08:30 AM: Scenic morning drive winding up to Kala Dungar, the highest peak in Kutch.",
          "11:00 AM: Stand at the summit viewpoint overlooking the endless white salt horizon.",
          "12:00 PM: Witness the sacred noon jackal-feeding ritual at the historic Lord Dattatreya temple.",
          "02:30 PM: Drive towards India Bridge, the last civilian-accessible border point towards Pakistan.",
          "05:30 PM: Return towards Khavda; sample authentic Khavda Mesuk sweet from local confectioners."
        ]
      },
      {
        dayLabel: "Day 4 🧵",
        theme: "Artisan Living Heritage: Rogan Art & Bell Makers",
        places: ["Nirona Village", "Rogan Art Workshop", "Copper Bell Artisans", "Lacquer Woodcraft"],
        route: "Dhordo/Bhuj → Nirona Artisan Village → Nakhtrana → Traditional Crafts Workshop",
        baseGroupBudget: 1600,
        groupBudgetPct: 0.17,
        transport: "Private cab / taxi through central Kutch craft belt",
        foodType: "Home-style Kutchi village meal with fresh churned white butter (makhan) and jaggery",
        wardrobeAdvice: {
          outfit: "Comfortable relaxed linen kurti or button-down tee with breathable chinos",
          layer: "Light cotton bandana or sunhat for village walking",
          footwear: "Easy slip-on canvas shoes or trail sandals (frequent shoe removal in home workshops)",
          styleVibe: "Artisan Connoisseur · Earth Tone Casual",
          reason: "Walking between artisan village homes in Nirona; dusty village pathways and sitting on floor mats."
        },
        highlights: "Meeting Khatri family practicing the world's only castor oil Rogan art, ringing melodic Kutchi bells",
        activities: [
          "09:30 AM: Arrive at Nirona village; private demonstration of 400-year-old Rogan Art using metal stylus.",
          "12:00 PM: Visit Luhar copper bell makers; learn how scrap iron is turned into tuned acoustic desert bells.",
          "02:00 PM: Village lunch of bajra rotlo, spicy garlic chutney, and fresh buttermilk.",
          "03:30 PM: Watch lacquer wood artisans make brightly colored kitchen utensils using natural vegetable dyes.",
          "06:30 PM: Return to Bhuj; relax at a quiet café in the evening."
        ]
      },
      {
        dayLabel: "Day 5 🌊",
        theme: "Royal Rajput Coast & 400-Year Shipyards of Mandvi",
        places: ["Mandvi Port", "Vijay Vilas Palace", "Mandvi Beach", "Wooden Shipbuilding Yard"],
        route: "Bhuj → Mandvi Shipyard → Vijay Vilas Palace → Mandvi Beach Sunset",
        baseGroupBudget: 1800,
        groupBudgetPct: 0.19,
        transport: "Cab / state bus south to Mandvi coastal town (60 km)",
        foodType: "Original Mandvi Dabeli (at the birthplace of dabeli), coastal coconut water, fresh fruit kulfi",
        wardrobeAdvice: {
          outfit: "Lightweight resort-style shirt or tank + easy roll-up shorts or linen trousers",
          layer: "Lightweight overshirt for evening coastal sea breeze",
          footwear: "Water-resistant slip-on sandals or slides (sand & wooden shipyard walkways)",
          styleVibe: "Coastal Maritime · Breezy Heritage",
          reason: "Sea breeze, beach sand, and touring the sprawling red sandstone Rajput royal summer estate."
        },
        highlights: "Grand Vijay Vilas palace gardens & beach, massive handcrafted wooden dhows under construction, sunset camel ride",
        activities: [
          "09:30 AM: Tour the Rukmavati riverbank shipyard where craftsmen hand-build giant 1,000-ton wooden ships.",
          "12:00 PM: Explore Vijay Vilas Palace, royal summer residence of Jadeja rulers with Rajput architecture.",
          "02:00 PM: Savor the original world-famous Mandvi Dabeli from legendary local street stalls.",
          "04:30 PM: Head to Mandvi Windmill Beach; camel ride along the Arabian Sea waves.",
          "06:30 PM: Catch the golden sunset dipping into the Arabian Sea with fresh coconut water."
        ]
      }
    ]
  }
};

export function findItineraryTemplate(destination) {
  if (!destination) return null;
  const dest = destination.toLowerCase().trim();

  if (dest.includes("kutch") || dest.includes("rann") || dest.includes("bhuj") || dest.includes("dhordo")) {
    return INDIA_ITINERARY_TEMPLATES["Rann of Kutch"];
  }
  if (dest.includes("mumbai") || dest.includes("bombay")) return INDIA_ITINERARY_TEMPLATES["Mumbai"];
  if (dest.includes("lonavala") || dest.includes("lonavla") || dest.includes("khandala")) return INDIA_ITINERARY_TEMPLATES["Lonavala"];
  if (dest.includes("delhi") || dest.includes("new delhi")) return INDIA_ITINERARY_TEMPLATES["Delhi"];
  if (dest.includes("goa") || dest.includes("panaji") || dest.includes("north goa") || dest.includes("south goa")) return INDIA_ITINERARY_TEMPLATES["Goa"];
  if (dest.includes("jaipur") || dest.includes("pink city")) return INDIA_ITINERARY_TEMPLATES["Jaipur"];

  for (const key of Object.keys(INDIA_ITINERARY_TEMPLATES)) {
    if (dest.includes(key.toLowerCase()) || key.toLowerCase().includes(dest)) {
      return INDIA_ITINERARY_TEMPLATES[key];
    }
  }

  return null;
}

/**
 * Builds a hyper-specific, realistic Indian itinerary with daily routes,
 * budgets, and tailored AI wardrobe suggestions.
 */
export function buildTemplateItinerary(destination = "India", startDate, endDate, totalBudget = 0, groupSize = 1, tripStyle = "Mixed", offbeatPreference = "mix") {
  const templateObj = findItineraryTemplate(destination);

  let start = new Date();
  if (startDate) {
    const s = new Date(startDate.includes("T") ? startDate : startDate + "T12:00:00");
    if (!isNaN(s.getTime())) start = s;
  }

  let end = new Date(start);
  end.setDate(end.getDate() + 4);
  if (endDate) {
    const e = new Date(endDate.includes("T") ? endDate : endDate + "T12:00:00");
    if (!isNaN(e.getTime())) end = e;
  }

  const g = Math.max(1, parseInt(groupSize) || 1);
  const userBudget = parseFloat(totalBudget) || 0;

  // Diverse 7-day progressive rotation so no two days ever duplicate
  const fallbackProgression = [
    {
      emoji: "🏛️",
      theme: `Arrival, Historic Center & Welcome Promenade in ${destination}`,
      places: ["Old Heritage District", "Central Town Square", "Waterfront Promenade"],
      route: "Arrival → Old Heritage District → Central Town Square → Evening Promenade",
      baseGroupBudget: 1600,
      groupBudgetPct: 0.18,
      transport: "Local auto-rickshaw + city transit + walking",
      foodType: "Authentic welcome street snacks & regional dinner thali",
      wardrobeAdvice: {
        outfit: "Breathable cotton tee or kurti + comfortable relaxed trousers",
        layer: "Light cotton overshirt for twilight breeze",
        footwear: "Cushioned walking sneakers for street exploring",
        styleVibe: "Smart Urban Explorer",
        reason: "Active daytime street walking; mild evening transition by the promenade."
      },
      highlights: `Historic orientation walk, vibrant local market streets, and sunset views in ${destination}`,
      activities: [
        "10:00 AM: Check in, unpack, and head to the historic town center.",
        "01:00 PM: Enjoy local specialties at an authentic traditional eatery.",
        "03:30 PM: Stroll through old heritage quarter and artisan spice bazaars.",
        "06:30 PM: Sunset viewpoint and evening tea with city skyline views."
      ]
    },
    {
      emoji: "🏰",
      theme: `Ancient Forts, Royal Architecture & Cultural Heritage`,
      places: ["Heritage Fort / Palace", "Royal Gardens", "Craft District"],
      route: "Heritage Fort → Palace Museum → Royal Gardens → Local Craft Bazaar",
      baseGroupBudget: 1900,
      groupBudgetPct: 0.20,
      transport: "Local shared cab / auto-rickshaws",
      foodType: "Heritage café lunch, royal sweet specialties, and local lassi/chai",
      wardrobeAdvice: {
        outfit: "Lightweight linen shirt or breathable kurti + durable chinos or modest midi skirt",
        layer: "Light sun scarf or stole (palace/monument dress guidelines)",
        footwear: "Supportive walking shoes with good tread for stone steps and courtyards",
        styleVibe: "Heritage Adventurer",
        reason: "Sunny courtyards, cobblestones, and cultural dress code at historic monuments."
      },
      highlights: "Centuries-old stone architecture, panoramic rampart vistas, and living royal history",
      activities: [
        "09:00 AM: Guided walk across ancient ramparts and royal state apartments.",
        "12:30 PM: Traditional lunch at a heritage café near the palace gates.",
        "02:30 PM: Explore royal museum galleries, weapons, and historic manuscripts.",
        "05:30 PM: Photography session during golden hour along palace courtyards."
      ]
    },
    {
      emoji: "🌿",
      theme: `Scenic Nature Excursion, Lakes & Elevated Viewpoints`,
      places: ["Scenic Lake / Forest Reserve", "Mountain Viewpoint", "Nature Trail"],
      route: "Valley Trail → Hillside Viewpoint → Lakeside Promenade → Sunset Café",
      baseGroupBudget: 1700,
      groupBudgetPct: 0.18,
      transport: "Shared tourist cab or electric shuttle",
      foodType: "Fresh picnic snacks, lakeside tea, and roasted seasonal corn",
      wardrobeAdvice: {
        outfit: "Moisture-wicking athletic tee or linen top + lightweight trekking shorts/cargos",
        layer: "Packable windbreaker jacket for breezy ridge viewpoints",
        footwear: "High-traction trail sneakers",
        styleVibe: "Outdoor Activewear",
        reason: "Uneven natural terrain, shifting hillside breezes, and bright outdoor sunlight."
      },
      highlights: "Lush green vistas, panoramic valley horizons, and peaceful waterfront strolls",
      activities: [
        "08:30 AM: Scenic trail walk through nature reserve and forest canopy.",
        "11:30 AM: Elevated viewpoint photo stop overlooking the surrounding valley.",
        "01:30 PM: Lakeside picnic lunch or café with open-air terrace.",
        "05:00 PM: Watch the sun sink behind the mountain ridges with piping hot chai."
      ]
    },
    {
      emoji: "🎨",
      theme: `Living Traditions, Artisan Guilds & Street Food Safari`,
      places: ["Craft Village", "Textile Guilds", "Famous Food Street"],
      route: "Artisan Workshops → Pottery & Textile Quarter → Iconic Street Food Bazaar",
      baseGroupBudget: 1800,
      groupBudgetPct: 0.19,
      transport: "Walking + short cycle-rickshaw / e-rickshaw hops",
      foodType: "Legendary chaat, crispy kachoris, signature desserts, and fresh juices",
      wardrobeAdvice: {
        outfit: "Casual cotton polo or relaxed breezy tee + dark denim or cargo pants",
        layer: "Lightweight zip-up hoodie for evening market strolls",
        footwear: "Comfortable slip-on sneakers (ready for busy market lanes)",
        styleVibe: "Culinary Explorer · Casual Street",
        reason: "Dense bustling market streets, frequent food tasting stops, and craft studio visits."
      },
      highlights: "Meeting master craftsmen, observing handlooms, and tasting world-renowned local recipes",
      activities: [
        "10:00 AM: Hands-on visit to traditional artisan workshops and handcraft studios.",
        "01:00 PM: Authentic thali or biryani lunch at a celebrated local culinary institution.",
        "03:30 PM: Textile and handicraft shopping in the bustling central market.",
        "06:30 PM: Famous night food trail; sampling 4-5 signature local savory and sweet treats."
      ]
    },
    {
      emoji: "🌅",
      theme: `High Ridge Sunset, Twilight Skyline & Rooftop Dining`,
      places: ["Panoramic Hill Fort", "Skyline Viewpoint", "Rooftop Restaurant"],
      route: "Historic Gateway → Hilltop Viewpoint → Sunset Terraces → Night Bazaar",
      baseGroupBudget: 2100,
      groupBudgetPct: 0.22,
      transport: "Local taxi / auto-rickshaw",
      foodType: "Sunset mocktails, roasted tandoori delicacies, and regional dessert specialties",
      wardrobeAdvice: {
        outfit: "Smart-casual button-down or stylish fusion tunic + tailored trousers or linen pants",
        layer: "Structured blazer or premium knit sweater for cool rooftop night breezes",
        footwear: "Polished dress sneakers or stylish loafers",
        styleVibe: "Golden Hour Chic",
        reason: "Upscale sunset viewpoint followed by fine regional rooftop dining."
      },
      highlights: "Dramatic sunset colors over the city skyline, illuminated monuments, and live music",
      activities: [
        "02:00 PM: Relaxed afternoon exploring boutique galleries and souvenir shops.",
        "04:30 PM: Ascend to the highest scenic viewpoint for golden hour photography.",
        "06:00 PM: Watch the city illuminate as twilight falls across the horizon.",
        "08:00 PM: Rooftop celebratory dinner featuring regional culinary masterworks."
      ]
    },
    {
      emoji: "🪔",
      theme: `Spiritual Sanctuaries, Hidden Alleys & Traditional Music`,
      places: ["Ancient Temple / Shrine", "Heritage Stepwell", "Cultural Amphitheatre"],
      route: "Sanctuary Gates → Heritage Stepwell → Ancient Alleys → Folk Music Performance",
      baseGroupBudget: 1500,
      groupBudgetPct: 0.16,
      transport: "Electric rickshaw + heritage walking",
      foodType: "Traditional sattvic breakfast, temple prasad sweets, and spiced buttermilk",
      wardrobeAdvice: {
        outfit: "Modest cotton kurta/kurti or loose trousers covering shoulders and knees",
        layer: "Light cotton scarf or dupatta",
        footwear: "Easy slip-off sandals or loafers for shrine entries",
        styleVibe: "Traditional Respectful · Pure Linen",
        reason: "Sacred grounds requiring modest dress guidelines and frequent barefoot entries."
      },
      highlights: "Intricate temple stone carvings, acoustic stepwells, and mesmerizing folk melodies",
      activities: [
        "08:00 AM: Morning serenity visit to ancient stone temples and carved water stepwells.",
        "11:00 AM: Photography walk through timeless narrow neighborhood alleys.",
        "01:00 PM: Traditional sattvic lunch at a centuries-old community dining hall.",
        "05:30 PM: Attend an evening devotional Aarti or regional classical music recital."
      ]
    },
    {
      emoji: "🛍️",
      theme: `Souvenir Keepsakes, Signature Flavors & Farewell Sunset`,
      places: ["Grand Bazaar", "Specialty Food Purveyors", "Farewell Viewpoint"],
      route: "Bazaar Quarter → Spice & Tea Merchants → Farewell Café → Departure",
      baseGroupBudget: 1400,
      groupBudgetPct: 0.15,
      transport: "City auto / cab to transport hub",
      foodType: "Farewell breakfast feast, packed travel snacks, and artisanal teas",
      wardrobeAdvice: {
        outfit: "Ultra-comfortable travel joggers/trousers + breathable soft jersey tee",
        layer: "Cozy travel jacket or zip fleece for transit",
        footwear: "Slip-on airport/station sneakers",
        styleVibe: "Comfortable Departure Chic",
        reason: "Easy movement for luggage handling, last-minute shopping, and travel transit."
      },
      highlights: "Picking up regional spices, handcrafted souvenirs, and sweet memories",
      activities: [
        "09:30 AM: Final shopping sprint for authentic regional spices, sweets, and textiles.",
        "12:30 PM: Farewell group lunch savoring your favorite dishes of the trip.",
        "03:00 PM: Final photo-ops and packing souvenirs safely.",
        "05:00 PM: Transfer to airport or railway station with unforgettable memories."
      ]
    },
    {
      emoji: "🛶",
      theme: "Quiet Riverside Backwaters, Mangroves & Local Ferry Crossing",
      isOffbeat: true,
      places: ["Riverside Jetty", "Mangrove Nature Trail", "Island Pottery Village", "Sunset Ghat"],
      route: "Ferry Crossing → Mangrove Estuary → Artisan Village → Riverside Sunset Ghat",
      baseGroupBudget: 1500,
      groupBudgetPct: 0.16,
      transport: "Local country boat / ferry + shared auto-rickshaw",
      foodType: "Traditional river thali, fried river fish, fresh coconut water and local sweets",
      wardrobeAdvice: {
        outfit: "Breathable linen shirt or cotton top + quick-dry shorts or roll-up trousers",
        layer: "UV sun hat + polarized sunglasses",
        footwear: "Water-friendly sandals with heel strap",
        styleVibe: "Riverside Wanderer · Slow Travel",
        reason: "Navigating boat jetties, muddy estuary banks, and shaded island paths."
      },
      highlights: "Peaceful boat ride away from all city traffic, spotting rare migratory kingfishers and waterbirds",
      activities: [
        "09:00 AM: Catch a traditional country ferry across the river to tranquil outer islands.",
        "11:00 AM: Guided walk through mangrove boardwalks observing unique coastal flora.",
        "01:30 PM: Homestyle lunch at an island family-run tavern with local delicacies.",
        "04:00 PM: Observe local artisans hand-crafting pottery and clay vessels.",
        "06:30 PM: Peaceful sunset over river waters with hot chai and fresh fritters."
      ]
    },
    {
      emoji: "🛕",
      theme: "Ancient Stepwells, Carved Water Temples & Subterranean Echoes",
      isOffbeat: true,
      places: ["Historic Stepwell (Baoli)", "Hidden Sun Shrine", "Community Heritage Tank"],
      route: "Ancient Stepwell Descent → Carved Pavilions → Heritage Shrine → Shade Courtyards",
      baseGroupBudget: 1400,
      groupBudgetPct: 0.15,
      transport: "Auto-rickshaw or bicycle tour",
      foodType: "Heritage sweet shops, kachoris, cold buttermilk (chaas), and roasted snacks",
      wardrobeAdvice: {
        outfit: "Modest breathable cotton kurti or light collared shirt + comfortable chinos",
        layer: "Cotton scarf or dupatta for sun protection and temple courtyards",
        footwear: "Slip-off comfortable loafers or cushioned walking sneakers",
        styleVibe: "Heritage Archaeological · Earthy Elegance",
        reason: "Climbing multi-tiered stone stepwell staircases and visiting active shrine pavilions."
      },
      highlights: "Intricate geometric subterranean staircases, historic acoustic water pavilions, and quiet shrines",
      activities: [
        "08:30 AM: Descend the ancient geometric stone tiers of the historic subterranean stepwell.",
        "11:00 AM: Photography of intricate stone carvings and light rays penetrating underground galleries.",
        "01:00 PM: Refresh with authentic regional thali at a generations-old courtyard eatery.",
        "03:30 PM: Explore surrounding medieval water storage channels and shaded courtyards.",
        "05:30 PM: Evening tranquil stroll around the ancient stone tank as lamps are lit."
      ]
    },
    {
      emoji: "🌿",
      theme: "Forest Canopy Trail, Hidden Cascades & Rock Pools",
      isOffbeat: true,
      places: ["Forest Reserve Gates", "Hidden Cascade Trail", "Natural Rock Bathing Pool"],
      route: "Forest Reserve Entry → Foothill Waterfall Trail → Mountain Rock Pool → Valley View",
      baseGroupBudget: 1600,
      groupBudgetPct: 0.17,
      transport: "Hired vehicle to forest reserve foothills",
      foodType: "Forest dhaba meal (dal, seasonal wild vegetables, bajra bhakri with white butter)",
      wardrobeAdvice: {
        outfit: "Moisture-wicking athletic tee + quick-dry lightweight hiking pants",
        layer: "Light packable windbreaker or waterproof jacket",
        footwear: "High-traction trail shoes that can grip wet rocks",
        styleVibe: "Canopy Trekker · Forest Adventure",
        reason: "Lush shaded forest trek with damp earth, slippery boulders, and refreshing mountain streams."
      },
      highlights: "Uncommercialized natural waterfall nestled inside dense forest canopy, natural rock pools",
      activities: [
        "08:00 AM: Early morning nature walk into the protected forest reserve before day visitors arrive.",
        "10:30 AM: Hike along the murmuring stream to discover the secluded mountain cascade.",
        "01:00 PM: Relax in natural rock pools with crystal clear cool spring water.",
        "02:30 PM: Hearty rustic dhaba lunch prepared over woodfire by forest edge villagers.",
        "05:00 PM: Panoramic evening view of green valleys from the foothill lookout."
      ]
    },
    {
      emoji: "🏛️",
      theme: "Colonial Enclaves, Heritage Bungalows & Vintage Tea Salons",
      isOffbeat: true,
      places: ["Heritage Cantonment / Civil Lines", "Botanical Conservatory", "Century-Old Tea Salon"],
      route: "Colonial Promenade → Botanical Glasshouse → Heritage Library → Vintage High Tea",
      baseGroupBudget: 1800,
      groupBudgetPct: 0.19,
      transport: "Walking + short electric cab / auto hops",
      foodType: "Artisanal bakery pastries, high tea with single-origin teas, cucumber sandwiches, club rolls",
      wardrobeAdvice: {
        outfit: "Smart-casual linen button-down or stylish summer midi dress + comfortable trousers",
        layer: "Light knit cardigan or casual blazer for air-conditioned colonial libraries/tea rooms",
        footwear: "Polished leather sandals or smart clean lifestyle sneakers",
        styleVibe: "Vintage Colonial Chic · Garden Afternoon",
        reason: "Paved leafy avenues, historic wooden libraries, and upscale colonial club dining."
      },
      highlights: "Tree-shaded 19th-century colonial bungalows, Victorian glass conservatory, peaceful vintage library",
      activities: [
        "09:30 AM: Walking tour of quiet, leafy colonial quarters admiring historic bungalow architecture.",
        "11:30 AM: Visit the historic botanical gardens and centuries-old glass conservatory.",
        "01:30 PM: Enjoy a relaxed light lunch at a heritage café housed inside a restored mansion.",
        "03:30 PM: Browse antique books, lithographs, and maps at the historic public library.",
        "05:30 PM: Authentic high tea experience savoring Darjeeling and Nilgiri reserve blends."
      ]
    },
    {
      emoji: "🌾",
      theme: "Organic Farming Belt, Village Potter Guilds & Rustic Feasts",
      isOffbeat: true,
      places: ["Organic Village Farm", "Pottery & Terracotta Workshops", "Highway Dhaba"],
      route: "Village Outskirts → Organic Orchard Tour → Potter's Wheel Session → Highway Dhaba Feast",
      baseGroupBudget: 1500,
      groupBudgetPct: 0.16,
      transport: "Scenic rural drive / private cab through countryside lanes",
      foodType: "Charcoal-cooked farm meals, fresh cane juice, roasted corn, jaggery sweets",
      wardrobeAdvice: {
        outfit: "Durable comfortable cotton tee or kurta + breathable cargo pants",
        layer: "Sun hat or cap for open farm fields",
        footwear: "Easy-to-clean walking shoes or strap sandals",
        styleVibe: "Rustic Countryside · Earthy Craft",
        reason: "Hands-on pottery workshop with clay splatter, open farm trails, and rural dusty paths."
      },
      highlights: "Hands-on pottery lesson with master village artisans, plucking fresh fruit in organic orchards",
      activities: [
        "09:00 AM: Drive through scenic rural farmlands to a welcoming community organic farm.",
        "10:30 AM: Farm tour learning about seasonal indigenous crops, sugarcane, and spice cultivation.",
        "01:00 PM: Traditional rustic farm meal cooked on traditional clay chulhas.",
        "03:00 PM: Try your hand at the potter's wheel under the guidance of 4th-generation potters.",
        "06:00 PM: Authentic highway dhaba dinner on traditional charpoys under the stars."
      ]
    },
    {
      emoji: "🎨",
      theme: "Independent Street Art Quarters, Indie Cafés & Sunset Skyline",
      isOffbeat: true,
      places: ["Street Art District", "Indie Zine / Book Café", "Rooftop Sunset Lounge"],
      route: "Mural Alleys → Artisan Coffee Roaster → Indie Art Space → Sunset Skyline",
      baseGroupBudget: 1900,
      groupBudgetPct: 0.20,
      transport: "Walking + short city metro or cab",
      foodType: "Specialty pourover coffee, artisanal sourdough toasts, regional fusion tapas",
      wardrobeAdvice: {
        outfit: "Creative casual streetwear: graphic tee or relaxed linen shirt + stylish wide-leg trousers",
        layer: "Trendy light jacket or denim overshirt",
        footwear: "Trendy comfortable street sneakers",
        styleVibe: "Contemporary Creative · Urban Indie",
        reason: "Photogenic urban murals, independent gallery spaces, and hip evening rooftop venues."
      },
      highlights: "World-class street art murals transforming historic neighborhoods, vibrant community art spaces",
      activities: [
        "10:00 AM: Curated walking tour through open-air street art alleys and vibrant wall murals.",
        "12:30 PM: Specialty coffee tasting and light lunch at an independent community roastery.",
        "03:00 PM: Explore indie craft stores, local zine libraries, and design studios.",
        "05:30 PM: Head to a hidden sunset viewpoint overlooking both the historic and modern city horizons.",
        "08:00 PM: Relaxing group dinner with live acoustic indie music."
      ]
    },
    {
      emoji: "🌅",
      theme: "Grand Heritage Finale, Sunset Overlook & Celebratory Banquet",
      isOffbeat: false,
      places: ["Panoramic Farewell Viewpoint", "Master Artisan Emporium", "Iconic Farewell Banquet"],
      route: "Morning Golden Hour Viewpoint → Master Handloom Guild → Farewell Banquet → Departure",
      baseGroupBudget: 2100,
      groupBudgetPct: 0.22,
      transport: "Private cab with full luggage transit to station/airport",
      foodType: "Celebratory multi-course grand thali or royal banquet, artisanal boxed sweets for family",
      wardrobeAdvice: {
        outfit: "Smart comfortable travel attire: relaxed cotton button-down + travel joggers or linen pants",
        layer: "Cozy travel jacket or wrap for air-conditioned train/plane transit",
        footwear: "Slip-on sneakers or airport loafers",
        styleVibe: "Grand Farewell Chic · Departure Ready",
        reason: "Smooth transition from final sightseeing and keepsake shopping to departure travel."
      },
      highlights: "Unforgettable last views of the destination skyline, collecting master handcrafted memories",
      activities: [
        "09:00 AM: Morning golden hour visit to the city's most breathtaking panoramic viewpoint.",
        "11:30 AM: Final curated keepsake shopping directly supporting certified master artisans.",
        "01:30 PM: Grand celebratory farewell banquet enjoying all the signature regional culinary favorites.",
        "04:00 PM: Packing souvenirs and boxed regional sweets safely.",
        "06:30 PM: Transfer to airport or railway station with memories of a lifetime."
      ]
    }
  ];

  // Organize days pool according to user's offbeat preference:
  // "offbeat" = prioritize offbeat hidden gems first
  // "popular" = prioritize popular attractions first
  // "mix" (default) = interleave popular and offbeat days seamlessly
  let pool = [];
  const baseDays = (templateObj?.days && templateObj.days.length > 0) ? templateObj.days : fallbackProgression;
  const pop = baseDays.filter(d => !d.isOffbeat);
  const off = baseDays.filter(d => d.isOffbeat);

  if (offbeatPreference === "offbeat") {
    pool = [...off, ...pop];
  } else if (offbeatPreference === "popular") {
    pool = [...pop, ...off];
  } else {
    // "mix": interleave popular and offbeat days
    pool = [];
    const maxLen = Math.max(pop.length, off.length);
    for (let k = 0; k < maxLen; k++) {
      if (k < pop.length) pool.push(pop[k]);
      if (k < off.length) pool.push(off[k]);
    }
  }

  // Calculate day count reliably (up to 14 days)
  const diffDays = Math.round((end.getTime() - start.getTime()) / 86400000) + 1;
  const dayCount = Math.max(1, Math.min(14, isNaN(diffDays) ? 5 : diffDays));

  // If candidate pool is shorter than dayCount, seamlessly fill with non-duplicate days from fallback
  if (pool.length < dayCount) {
    for (const fb of fallbackProgression) {
      if (!pool.some(p => p.theme === fb.theme || p.route === fb.route)) {
        pool.push(fb);
      }
      if (pool.length >= dayCount) break;
    }
  }

  const days = [];
  let current = new Date(start);
  let dayNum = 1;

  // Determine realistic group budget
  let runningTotalGroupBudget = 0;
  const bufferAmount = templateObj?.defaultBuffer || (userBudget > 0 ? Math.round(userBudget * 0.10) : 1000);

  for (let i = 0; i < dayCount; i++) {
    let t;
    if (i < pool.length) {
      t = pool[i];
    } else {
      // If trip is even longer than pool (e.g. 15+ days), generate non-verbatim algorithmic variation
      const baseIdx = i % pool.length;
      const baseDay = pool[baseIdx];
      t = {
        ...baseDay,
        theme: `${baseDay.theme} — Extended Trail`,
        route: `${baseDay.route} (Alternate Scenic Loop)`,
        activities: (baseDay.activities || []).map(a => a.replace("09:00 AM", "09:30 AM").replace("01:00 PM", "01:30 PM"))
      };
    }

    // Budget calibration:
    let dayGroupBudget;
    if (userBudget > 0) {
      const usableBudget = Math.max(0, userBudget - bufferAmount);
      dayGroupBudget = Math.round((usableBudget * (t.groupBudgetPct || (1 / dayCount))));
    } else {
      const scaleFactor = g <= 2 ? 0.7 : g <= 5 ? 1.0 : 1 + (g - 5) * 0.15;
      dayGroupBudget = Math.round(t.baseGroupBudget * scaleFactor);
    }

    const perPersonDay = Math.max(50, Math.round(dayGroupBudget / g));
    runningTotalGroupBudget += dayGroupBudget;

    // Ensure dayLabel ALWAYS counts sequentially: Day 1, Day 2, Day 3...
    const formattedDayLabel = t.dayLabel
      ? t.dayLabel.replace(/^Day \d+/, `Day ${dayNum}`)
      : `Day ${dayNum} ${t.emoji || "🏛️"}`;

    days.push({
      day: dayNum,
      dayLabel: formattedDayLabel,
      date: current.toISOString().split("T")[0],
      theme: t.theme,
      places: t.places,
      route: t.route || (t.places ? t.places.join(" → ") : `Explore ${destination}`),
      groupBudget: dayGroupBudget,
      perPersonBudget: perPersonDay,
      transport: t.transport,
      foodType: t.foodType,
      isOffbeat: !!t.isOffbeat,
      wardrobeAdvice: t.wardrobeAdvice || {
        outfit: "Breathable tank top or cotton tee + relaxed shorts or lightweight pants",
        layer: "Light windbreaker jacket for breezes",
        footwear: "Comfortable cushioned sneakers",
        styleVibe: "Casual Comfort",
        reason: "Flexible outfit suitable for city exploration and mild temperature fluctuations."
      },
      highlights: t.highlights || "",
      activities: t.activities || t.places || [],
    });

    current.setDate(current.getDate() + 1);
    dayNum++;
  }

  const grandTotalGroup = runningTotalGroupBudget + bufferAmount;
  const grandTotalPerPerson = Math.round(grandTotalGroup / g);

  const summary = {
    destination,
    groupSize: g,
    totalDays: dayCount,
    totalGroupBudget: grandTotalGroup,
    perPersonTotal: grandTotalPerPerson,
    bufferAmount,
    travelNote: templateObj?.travelNote || "Local transit + autos + walking",
    foodNote: templateObj?.foodNote || "Budget street food and iconic local restaurants",
    accommodationNote: templateObj?.accommodationNote || `Accommodation not included in ₹${grandTotalGroup.toLocaleString("en-IN")}`,
  };

  // Attach summary property directly to array for dual compatibility
  days.summary = summary;
  return days;
}

/**
 * Detects if an itinerary array is empty, has placeholder terms, or contains duplicate days
 * across ANY day pair (e.g. Day 1 and Day 6 having the same route, theme, or activities).
 */
export function isDuplicateOrInvalidItinerary(itin) {
  if (!itin || !Array.isArray(itin) || itin.length === 0) return true;
  if (!itin[0]?.route || !itin[0]?.wardrobeAdvice) return true;

  // Check ALL pairs (i, j) with i < j to guarantee 100% uniqueness
  for (let i = 0; i < itin.length; i++) {
    for (let j = i + 1; j < itin.length; j++) {
      const a = itin[i];
      const b = itin[j];

      // Same dayLabel: e.g. "Day 1" and "Day 1"
      if (a.dayLabel && b.dayLabel && a.dayLabel.trim() === b.dayLabel.trim()) return true;

      // Same route: e.g. Day 1 route == Day 6 route
      if (a.route && b.route && a.route.trim().toLowerCase() === b.route.trim().toLowerCase()) return true;

      // Same theme: e.g. Day 1 theme == Day 6 theme
      if (a.theme && b.theme && a.theme.trim().toLowerCase() === b.theme.trim().toLowerCase()) return true;

      // Same places array
      if (Array.isArray(a.places) && Array.isArray(b.places) && a.places.length > 0 && a.places.join(",") === b.places.join(",")) return true;

      // Same activities array
      if (Array.isArray(a.activities) && Array.isArray(b.activities) && a.activities.length > 0 && a.activities.join("|") === b.activities.join("|")) return true;
    }
  }

  // Check if any day has central placeholder terms
  if (itin.some(d => d.route?.includes("Central Landmark") || d.theme?.includes("Iconic Sights of"))) {
    return true;
  }

  return false;
}
