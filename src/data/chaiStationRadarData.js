/**
 * src/data/chaiStationRadarData.js
 * Chai & Station Radar: Highway Dhabas, Railway Junction Food Legends, and Chai Varieties
 * Across Indian Transit Corridors.
 */

export const CHAI_STATION_RADAR = [
  // ── Mumbai & Western Ghats Corridor ──
  {
    id: "csmt-mumbai",
    name: "CSMT & Fort Railway Heritage Hub",
    city: "Mumbai",
    type: "Railway Station",
    location: "Opposite CSMT Station & Fort Area",
    route: "Central & Western Railway Gateway",
    famousFoods: [
      { name: "Aram Vada Pav", desc: "Golden spiced potato vada inside fresh pav with pungent dry garlic chutney, served hot right outside CSMT entrance.", price: "₹25" },
      { name: "Cannon Pav Bhaji", desc: "Thick vegetable mash drenched in Amul butter with soft pan-roasted buttered pav.", price: "₹140" },
      { name: "Bun Maska & Irani Chai", desc: "Crusty pav slathered with salty butter dipped in sweet cardamom-infused Irani milk tea at Kyani & Co.", price: "₹70" }
    ],
    chaiSpecialty: {
      name: "Cutting Masala Chai",
      desc: "Half-glass of strongly brewed Assam CTC tea with smashed ginger and green cardamom, served in traditional flared glass.",
      style: "Cutting Chai",
      price: "₹15"
    },
    hygieneTip: "Look for freshly fried batches of vada pav during morning and evening rush hours. Buy sealed Rail Neer inside the main concourse.",
    cleanWashrooms: true,
    mineralWaterVerified: true,
    tags: ["Station Legend", "Chai Spot", "Street Snack"]
  },
  {
    id: "lonavala-ghats",
    name: "Lonavala Ghats & Mumbai-Pune Expressway",
    city: "Lonavala",
    type: "Highway Dhaba",
    location: "Tiger Point, Amrutanjan Bridge & Expressway Food Plazas",
    route: "Mumbai – Pune Expressway / NH 48",
    famousFoods: [
      { name: "Maganlal Golden Chikki", desc: "Crispy brittle packed with crushed peanuts, roasted sesame, and pure jaggery (gur).", price: "₹120 / box" },
      { name: "Cliffside Steaming Maggi", desc: "Spiced soupy instant noodles simmered with fresh green chilies, onions, and garam masala at foggy cliff viewpoints.", price: "₹70" },
      { name: "Crispy Kanda & Corn Bhajji", desc: "Golden batter-fried onion fritters and sweet corn pakodas, served with tangy mint chutney in the monsoon fog.", price: "₹60" }
    ],
    chaiSpecialty: {
      name: "Kulhad Adrak-Gud Chai",
      desc: "Clay cup tea brewed with crushed mountain ginger, jaggery, and crushed black peppercorns.",
      style: "Kulhad Chai",
      price: "₹30"
    },
    hygieneTip: "Expressway food mall halts at Khalapur and Talegaon have verified clean restroom facilities and branded food courts.",
    cleanWashrooms: true,
    mineralWaterVerified: true,
    tags: ["Highway Dhaba", "Chai Spot", "Viewpoint Bite"]
  },

  // ── Gujarat & Kutch Desert Corridor ──
  {
    id: "kutch-bhuj-hub",
    name: "Bhuj & Central Kutch Transit Junction",
    city: "Rann of Kutch",
    type: "Transit Junction",
    location: "Bhuj Station & Jubilee Ground Bazaar",
    route: "Bhuj – Dhordo – Mandvi Highway (SH 45)",
    famousFoods: [
      { name: "Authentic Kutchi Dabeli", desc: "The original Mandvi recipe: spiced mashed potato stuffing, roasted peanuts, pomegranate pearls, and sweet tamarind dates chutney inside soft pav.", price: "₹30" },
      { name: "Khavda Mesuk & Gulab Pak", desc: "Pure royal mawa confection flavored with rose essence and dry fruits, made fresh by hereditary halwais.", price: "₹180 / 250g" },
      { name: "Bajra Rotlo with Ringna no Olo", desc: "Charcoal-roasted eggplant mash cooked with garlic and tomatoes, served with hand-patted millet flatbread and fresh white butter.", price: "₹160" }
    ],
    chaiSpecialty: {
      name: "Kutchi Masala Chai & Spiced Chaas",
      desc: "Cardamom & nutmeg infused sweet morning tea, followed by chilled cumin buttermilk (chaas) to beat the desert heat.",
      style: "Desi Masala Chai",
      price: "₹20"
    },
    hygieneTip: "Carry packaged mineral water when traveling north of Bhirandiyara checkpoint into the Banni grasslands and White Rann.",
    cleanWashrooms: true,
    mineralWaterVerified: true,
    tags: ["Station Legend", "Regional Specialty", "Chai Spot"]
  },

  // ── Western Railway Main Line ──
  {
    id: "ratlam-junction",
    name: "Ratlam Junction (Western Railway Hub)",
    city: "Ratlam",
    type: "Railway Station",
    location: "Platforms 1, 2 & 4, Ratlam Junction",
    route: "Delhi – Mumbai Main Rajdhani / Golden Temple Trunk Route",
    famousFoods: [
      { name: "Legendary Ratlam Laung Sev", desc: "Spicy gram flour vermicelli flavored with cloves (laung) and black pepper, famous across India since the 1800s.", price: "₹90 / pack" },
      { name: "Station Poha-Jalebi", desc: "Steamed flattened rice tempered with mustard, fennel seeds, pomegranate, topped with crispy sev and paired with hot coiled jalebis.", price: "₹45" }
    ],
    chaiSpecialty: {
      name: "Railway Special Kulhad Chai",
      desc: "Boiled thick buffalo milk tea poured into unglazed earthen kulhads with a thick malai layer.",
      style: "Kulhad Chai",
      price: "₹20"
    },
    hygieneTip: "IRCTC food plaza on Platform 1 has authorized packaged sweets and guaranteed fresh batches of Ratlam Sev.",
    cleanWashrooms: true,
    mineralWaterVerified: true,
    tags: ["Station Legend", "Train Food", "Chai Spot"]
  },

  // ── Rajasthan Royal Corridor ──
  {
    id: "jaipur-junction-nh48",
    name: "Jaipur Junction & NH 48 Highway Dhaba Trail",
    city: "Jaipur",
    type: "Railway Station & Highway",
    location: "Station Road, Sindhi Camp & NH 48 Delhi-Jaipur Highway",
    route: "Delhi – Jaipur – Udaipur National Corridor",
    famousFoods: [
      { name: "Rawat Pyaaz Kachori", desc: "Crisp flaky pastry stuffed with aromatic spiced onion and potato mash, deep-fried to golden perfection.", price: "₹50" },
      { name: "Dal Baati Churma Thali", desc: "Baked wheat balls dipped in pure desi ghee, served with 5-lentil dal and sweet crushed wheat churma.", price: "₹220" },
      { name: "Lassiwala Clay Pot Lassi", desc: "Rich curd lassi served in large earthen glasses topped with a thick dollop of fresh cream (malai).", price: "₹80" }
    ],
    chaiSpecialty: {
      name: "Rajasthani Kadak Kulhad Chai",
      desc: "Slow-boiled milk tea heavily infused with green cardamom pods and crushed ginger, poured from a brass kettle.",
      style: "Royal Kulhad Chai",
      price: "₹25"
    },
    hygieneTip: "NH 48 midway motels at Behror and Kotputli offer sanitized family washrooms and clean RO water stations.",
    cleanWashrooms: true,
    mineralWaterVerified: true,
    tags: ["Highway Dhaba", "Station Legend", "Chai Spot"]
  },

  // ── North India Heritage Corridor ──
  {
    id: "old-delhi-ndls",
    name: "New Delhi & Old Delhi Railway Food Trail",
    city: "Delhi",
    type: "Railway Station",
    location: "Pahar Ganj & Chandni Chowk / Old Delhi Station",
    route: "Northern Railway Trunk Terminal",
    famousFoods: [
      { name: "Paranthe Wali Gali", desc: "Shallow-fried flatbreads stuffed with paneer, aloo, rabri, or mixed vegetables, served with sweet pumpkin and mint chutney.", price: "₹90" },
      { name: "Chole Bhature", desc: "Fluffy balloon-fried bread with spicy chickpea curry, pickled amla, and raw onion rings at Sita Ram Diwan Chand.", price: "₹110" },
      { name: "Giani Rabri Falooda", desc: "Rich condensed milk rabri poured over vermicelli and rose syrup in tall glasses.", price: "₹120" }
    ],
    chaiSpecialty: {
      name: "Purani Dilli Zafrani Chai",
      desc: "Cardamom tea finished with a pinch of Kashmiri saffron threads (zafran) and crushed pistachios.",
      style: "Zafrani Chai",
      price: "₹35"
    },
    hygieneTip: "Always confirm bottled water is sealed with the IRCTC Rail Neer hologram cap at Delhi railway stations.",
    cleanWashrooms: true,
    mineralWaterVerified: true,
    tags: ["Station Legend", "Street Snack", "Chai Spot"]
  },

  // ── Coastal Konkan Corridor ──
  {
    id: "madgaon-konkan",
    name: "Madgaon Junction (Konkan Railway Coastal Gateway)",
    city: "Goa",
    type: "Railway Station",
    location: "Madgaon Station Platform 1 & Margao Market",
    route: "Konkan Railway (Mumbai – Goa – Mangalore)",
    famousFoods: [
      { name: "Station Ros Omelette", desc: "Goan street classic: fluffy masala omelette submerged in rich spicy chicken xacuti gravy, served with fresh poi bread.", price: "₹80" },
      { name: "Warm Crusty Poi", desc: "Traditional Goan fermented wheat bread baked in wood-fired ovens, with a soft hollow pocket.", price: "₹15" },
      { name: "Refreshing Sol Kadhi", desc: "Pink digestive drink made with fresh coconut milk, kokum extract, garlic, and fresh green chilies.", price: "₹40" }
    ],
    chaiSpecialty: {
      name: "Konkan Lemon-Mint Tea & Filter Kapi",
      desc: "Light black tea brewed with fresh crushed lemongrass and mint leaves, or South Indian drip filter coffee.",
      style: "Lemongrass Herbal Chai",
      price: "₹25"
    },
    hygieneTip: "Konkan Railway trains have reliable pantry car food; opt for pre-packaged thalis or coconut water at platforms.",
    cleanWashrooms: true,
    mineralWaterVerified: true,
    tags: ["Station Legend", "Coastal Bites", "Chai Spot"]
  }
];

export function getRadarStopsForDestination(destination = "") {
  if (!destination) return CHAI_STATION_RADAR;
  const d = destination.toLowerCase().trim();

  const filtered = CHAI_STATION_RADAR.filter(s =>
    d.includes(s.city.toLowerCase()) || s.city.toLowerCase().includes(d)
  );

  return filtered.length > 0 ? filtered : CHAI_STATION_RADAR;
}
