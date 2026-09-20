/**
 * src/data/indiaTransport.js
 * Shared by frontend display AND API functions (api/ imports from ../src/data/)
 *
 * Distances in km between major Indian city pairs.
 * Transport pricing: approximate INR, per person.
 * Hotel pricing: INR per room per night.
 */

// ── City metadata ─────────────────────────────────────────────
export const INDIA_CITIES = [
  // Metros
  { name:"Mumbai",      state:"Maharashtra", tier:"metro",    lat:19.0760, lng:72.8777, tags:["beach","urban","film"] },
  { name:"Delhi",       state:"Delhi",       tier:"metro",    lat:28.6139, lng:77.2090, tags:["heritage","urban","food"] },
  { name:"Bangalore",   state:"Karnataka",   tier:"metro",    lat:12.9716, lng:77.5946, tags:["urban","tech","garden"] },
  { name:"Chennai",     state:"Tamil Nadu",  tier:"metro",    lat:13.0827, lng:80.2707, tags:["beach","temple","urban"] },
  { name:"Kolkata",     state:"West Bengal", tier:"metro",    lat:22.5726, lng:88.3639, tags:["heritage","culture","food"] },
  { name:"Hyderabad",   state:"Telangana",   tier:"metro",    lat:17.3850, lng:78.4867, tags:["heritage","food","urban"] },
  // Tier-1
  { name:"Pune",        state:"Maharashtra", tier:"tier1",    lat:18.5204, lng:73.8567, tags:["urban","history","hills"] },
  { name:"Jaipur",      state:"Rajasthan",   tier:"tier1",    lat:26.9124, lng:75.7873, tags:["heritage","desert","palaces"] },
  { name:"Ahmedabad",   state:"Gujarat",     tier:"tier1",    lat:23.0225, lng:72.5714, tags:["heritage","food","urban"] },
  { name:"Surat",       state:"Gujarat",     tier:"tier1",    lat:21.1702, lng:72.8311, tags:["food","urban","diamond"] },
  { name:"Lucknow",     state:"UP",          tier:"tier1",    lat:26.8467, lng:80.9462, tags:["heritage","food","nawabi"] },
  { name:"Kochi",       state:"Kerala",      tier:"tier1",    lat:9.9312,  lng:76.2673, tags:["backwaters","beach","spice"] },
  // Tier-2 / Heritage
  { name:"Agra",        state:"UP",          tier:"tier2",    lat:27.1767, lng:78.0081, tags:["taj","heritage","mughal"] },
  { name:"Varanasi",    state:"UP",          tier:"tier2",    lat:25.3176, lng:82.9739, tags:["spiritual","ghats","culture"] },
  { name:"Amritsar",    state:"Punjab",      tier:"tier2",    lat:31.6340, lng:74.8723, tags:["spiritual","heritage","food"] },
  { name:"Mysore",      state:"Karnataka",   tier:"tier2",    lat:12.2958, lng:76.6394, tags:["palace","heritage","silk"] },
  { name:"Udaipur",     state:"Rajasthan",   tier:"tier2",    lat:24.5854, lng:73.7125, tags:["lakes","palace","romantic"] },
  { name:"Jodhpur",     state:"Rajasthan",   tier:"tier2",    lat:26.2389, lng:73.0243, tags:["blue city","forts","desert"] },
  { name:"Goa",         state:"Goa",         tier:"tier2",    lat:15.2993, lng:74.1240, tags:["beach","nightlife","portuguese"] },
  { name:"Rishikesh",   state:"Uttarakhand", tier:"tier2",    lat:30.0869, lng:78.2676, tags:["yoga","adventure","river"] },
  { name:"Haridwar",    state:"Uttarakhand", tier:"tier2",    lat:29.9457, lng:78.1642, tags:["spiritual","ghats","pilgrimage"] },
  // Hill Stations
  { name:"Shimla",      state:"HP",          tier:"hill",     lat:31.1048, lng:77.1734, tags:["hills","colonial","snow"] },
  { name:"Manali",      state:"HP",          tier:"hill",     lat:32.2432, lng:77.1892, tags:["mountains","snow","adventure"] },
  { name:"Mussoorie",   state:"Uttarakhand", tier:"hill",     lat:30.4598, lng:78.0664, tags:["hills","colonial","mall road"] },
  { name:"Ooty",        state:"Tamil Nadu",  tier:"hill",     lat:11.4064, lng:76.6932, tags:["tea","hills","colonial"] },
  { name:"Darjeeling",  state:"West Bengal", tier:"hill",     lat:27.0360, lng:88.2627, tags:["tea","himalaya","toy train"] },
  { name:"Coorg",       state:"Karnataka",   tier:"hill",     lat:12.3375, lng:75.8069, tags:["coffee","hills","forests"] },
  { name:"Munnar",      state:"Kerala",      tier:"hill",     lat:10.0889, lng:77.0595, tags:["tea","hills","backwaters"] },
  // Unique destinations
  { name:"Leh Ladakh",  state:"Ladakh",      tier:"remote",   lat:34.1526, lng:77.5771, tags:["himalaya","monks","adventure"] },
  { name:"Spiti Valley",state:"HP",          tier:"remote",   lat:32.2460, lng:78.0414, tags:["desert","monks","remote"] },
  { name:"Rann of Kutch",state:"Gujarat",    tier:"unique",   lat:23.7337, lng:69.8597, tags:["salt desert","festival","unique"] },
  { name:"Hampi",       state:"Karnataka",   tier:"heritage", lat:15.3350, lng:76.4600, tags:["ruins","boulders","history"] },
  { name:"Khajuraho",   state:"MP",          tier:"heritage", lat:24.8318, lng:79.9199, tags:["temples","sculpture","history"] },
  { name:"Mahabalipuram",state:"Tamil Nadu", tier:"heritage", lat:12.6269, lng:80.1927, tags:["temples","beach","shore"] },
  { name:"Aurangabad",  state:"Maharashtra", tier:"heritage", lat:19.8762, lng:75.3433, tags:["ajanta","ellora","mughal"] },
  { name:"Puri",        state:"Odisha",      tier:"spiritual",lat:19.8135, lng:85.8312, tags:["temple","beach","jagannath"] },
  { name:"Madurai",     state:"Tamil Nadu",  tier:"spiritual",lat:9.9252,  lng:78.1198, tags:["meenakshi","temple","heritage"] },
  { name:"Tirupati",    state:"AP",          tier:"spiritual",lat:13.6288, lng:79.4192, tags:["balaji","pilgrimage","temple"] },
  { name:"Alleppey",    state:"Kerala",      tier:"backwater",lat:9.4981,  lng:76.3388, tags:["houseboats","backwaters","canals"] },
  { name:"Andaman",     state:"A&N Islands", tier:"island",   lat:11.7401, lng:92.6586, tags:["beach","snorkel","island"] },
  { name:"Pondicherry", state:"Puducherry",  tier:"unique",   lat:11.9416, lng:79.8083, tags:["french","beach","yoga","cafe"] },
  { name:"McLeod Ganj", state:"HP",          tier:"unique",   lat:32.2396, lng:76.3219, tags:["dalai lama","tibetan","mountains"] },
  { name:"Kaziranga",   state:"Assam",       tier:"wildlife", lat:26.5775, lng:93.1711, tags:["rhino","jungle","national park"] },
  { name:"Jim Corbett", state:"Uttarakhand", tier:"wildlife", lat:29.5300, lng:78.7747, tags:["tiger","jungle","national park"] },
  { name:"Chandigarh",  state:"Punjab",      tier:"tier1",    lat:30.7333, lng:76.7794, tags:["planned city","rose garden","modern"] },
  { name:"Bhopal",      state:"MP",          tier:"tier2",    lat:23.2599, lng:77.4126, tags:["lakes","heritage","bhimbetka"] },
  { name:"Nashik",      state:"Maharashtra", tier:"tier2",    lat:19.9975, lng:73.7898, tags:["wine","kumbh","vineyards"] },
  { name:"Pushkar",     state:"Rajasthan",   tier:"spiritual",lat:26.4898, lng:74.5511, tags:["camel fair","lake","brahma"] },
  { name:"Jaisalmer",   state:"Rajasthan",   tier:"unique",   lat:26.9157, lng:70.9083, tags:["desert","fort","camel safari"] },
];

// ── City distances (km) ───────────────────────────────────────
// Format: "CityA|CityB": km  (add both directions)
export const CITY_DISTANCES = {
  "Mumbai|Pune": 149,        "Mumbai|Goa": 587,
  "Mumbai|Delhi": 1447,      "Mumbai|Jaipur": 1158,
  "Mumbai|Ahmedabad": 524,   "Mumbai|Aurangabad": 335,
  "Mumbai|Nashik": 167,      "Mumbai|Hyderabad": 710,
  "Mumbai|Bangalore": 981,   "Mumbai|Chennai": 1330,
  "Mumbai|Kochi": 1208,      "Mumbai|Kolkata": 1996,
  "Delhi|Jaipur": 281,       "Delhi|Agra": 233,
  "Delhi|Chandigarh": 248,   "Delhi|Amritsar": 452,
  "Delhi|Shimla": 344,       "Delhi|Manali": 538,
  "Delhi|Rishikesh": 238,    "Delhi|Haridwar": 210,
  "Delhi|Lucknow": 555,      "Delhi|Varanasi": 820,
  "Delhi|Kolkata": 1473,     "Delhi|Hyderabad": 1568,
  "Delhi|Bangalore": 2150,   "Delhi|Chennai": 2188,
  "Delhi|Mumbai": 1447,      "Delhi|Udaipur": 663,
  "Delhi|Jodhpur": 604,      "Delhi|Jaisalmer": 801,
  "Delhi|McLeod Ganj": 475,
  "Jaipur|Agra": 232,        "Jaipur|Udaipur": 393,
  "Jaipur|Jodhpur": 335,     "Jaipur|Jaisalmer": 567,
  "Jaipur|Pushkar": 145,
  "Bangalore|Chennai": 346,  "Bangalore|Mysore": 150,
  "Bangalore|Coorg": 269,    "Bangalore|Hampi": 340,
  "Bangalore|Ooty": 258,     "Bangalore|Hyderabad": 570,
  "Chennai|Mahabalipuram": 58,"Chennai|Pondicherry": 151,
  "Chennai|Madurai": 463,    "Chennai|Ooty": 535,
  "Chennai|Tirupati": 137,
  "Kolkata|Darjeeling": 595, "Kolkata|Kaziranga": 778,
  "Kolkata|Puri": 499,
  "Kochi|Alleppey": 63,      "Kochi|Munnar": 130,
  "Kochi|Pondicherry": 657,
  "Pune|Goa": 454,           "Pune|Nashik": 212,
  "Hyderabad|Khajuraho": 832,"Hyderabad|Tirupati": 555,
  "Varanasi|Khajuraho": 250, "Varanasi|Allahabad": 121,
  "Amritsar|McLeod Ganj": 202,
  "Shimla|Manali": 258,      "Shimla|Spiti Valley": 424,
  "Manali|Leh Ladakh": 474,  "Mussoorie|Rishikesh": 77,
};

export function getCityDistance(from, to) {
  const key1 = `${from}|${to}`;
  const key2 = `${to}|${from}`;
  const dist = CITY_DISTANCES[key1] || CITY_DISTANCES[key2];
  if (dist) return dist;
  // Fallback: estimate from lat/lng
  const c1 = INDIA_CITIES.find(c => c.name === from);
  const c2 = INDIA_CITIES.find(c => c.name === to);
  if (!c1 || !c2) return 500; // default
  const R = 6371;
  const dLat = (c2.lat - c1.lat) * Math.PI / 180;
  const dLng = (c2.lng - c1.lng) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(c1.lat*Math.PI/180)*Math.cos(c2.lat*Math.PI/180)*Math.sin(dLng/2)**2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)) * 1.3); // road factor
}

// ── Transport pricing ─────────────────────────────────────────
export function calculateTransport(from, to, groupSize = 1) {
  const km = getCityDistance(from, to);
  const g  = Math.max(1, groupSize);

  // Train fares (per person)
  const train = {
    sleeper:    Math.round(km * 0.55),
    "3AC":      Math.round(km * 1.3),
    "2AC":      Math.round(km * 2.0),
    "1AC":      Math.round(km * 3.5),
  };

  // Bus fares (per person)
  const bus = {
    ordinary:   Math.round(km * 0.5),
    "semi-deluxe": Math.round(km * 0.9),
    "volvo-AC": Math.round(km * 1.6),
    "sleeper-AC": Math.round(km * 2.2),
  };

  // Car — total (split by group size)
  const fuelCostTotal = Math.round(km * 9); // ₹9/km avg fuel+wear
  const tollEstimate  = Math.round(km * 1.5);
  const carTotal      = fuelCostTotal + tollEstimate;

  // Flight estimate (per person) — tier-based
  const c1 = INDIA_CITIES.find(c => c.name === from);
  const c2 = INDIA_CITIES.find(c => c.name === to);
  const isMM = ["metro"].includes(c1?.tier) && ["metro"].includes(c2?.tier);
  const flight = km > 300
    ? { economy: isMM ? Math.round(4000 + km*2.5) : Math.round(3000 + km*2.2) }
    : null; // No flight for short distances

  return {
    km,
    train,
    bus,
    car: {
      total: carTotal,
      perPerson: Math.ceil(carTotal / g),
      fuel: fuelCostTotal,
      toll: tollEstimate,
    },
    flight,
    groupSize: g,
  };
}

// ── Hotel pricing (per room per night, INR) ──────────────────
const HOTEL_RATES = {
  metro:    { 1: [600,1200],  2:[1200,2500],  3:[2500,5000],  4:[5000,12000], 5:[12000,40000] },
  tier1:    { 1: [500,1000],  2:[1000,2000],  3:[2000,4500],  4:[4500,10000], 5:[10000,30000] },
  tier2:    { 1: [400,800],   2:[800,1500],   3:[1500,3500],  4:[3500,8000],  5:[8000,25000]  },
  hill:     { 1: [500,1000],  2:[1000,2000],  3:[2000,4500],  4:[4000,9000],  5:[9000,30000]  },
  heritage: { 1: [600,1200],  2:[1200,2500],  3:[2500,6000],  4:[5000,15000], 5:[12000,50000] },
  backwater:{ 1: [700,1400],  2:[1400,3000],  3:[3000,7000],  4:[6000,18000], 5:[15000,50000] },
  island:   { 1: [800,1600],  2:[1600,3500],  3:[3500,9000],  4:[8000,20000], 5:[18000,60000] },
  remote:   { 1: [400,900],   2:[800,1800],   3:[1500,4000],  4:[3500,9000],  5:[8000,25000]  },
  unique:   { 1: [500,1000],  2:[1000,2000],  3:[2000,5000],  4:[4500,12000], 5:[10000,35000] },
  spiritual:{ 1: [300,700],   2:[700,1500],   3:[1500,3500],  4:[3500,8000],  5:[8000,25000]  },
  wildlife: { 1: [500,1000],  2:[1000,2500],  3:[2500,6000],  4:[5000,15000], 5:[12000,40000] },
};

const HOTEL_AMENITIES = {
  1: "Basic room, shared or private bath, fan/AC, no breakfast",
  2: "Clean room with AC, attached bath, Wi-Fi, basic amenities",
  3: "Comfortable room, breakfast included, pool/gym possible, good service",
  4: "Superior room, all meals possible, pool, gym, concierge, branded hotel",
  5: "Luxury suite/heritage property, butler, spa, gourmet dining, iconic views",
};

const HOTEL_SUGGESTIONS = {
  Mumbai: {
    2: [
      { name: "Hotel Suba International", area: "Andheri East", note: "Convenient for the airport and western suburbs" },
      { name: "The Sahil Hotel", area: "Mumbai Central", note: "Central location with easy city access" },
    ],
    3: [
      { name: "Novotel Mumbai Juhu Beach", area: "Juhu", note: "Beachfront stay near Juhu restaurants" },
      { name: "Ramada Plaza by Wyndham Palm Grove", area: "Juhu", note: "A practical base for the western suburbs" },
    ],
    4: [
      { name: "Taj Santacruz", area: "Santacruz East", note: "Upscale airport-side stay" },
      { name: "Trident Bandra Kurla", area: "Bandra Kurla Complex", note: "Modern business district location" },
    ],
    5: [
      { name: "The Taj Mahal Palace", area: "Colaba", note: "Iconic harbourfront stay near Gateway of India" },
      { name: "The Oberoi Mumbai", area: "Nariman Point", note: "Luxury stay on Marine Drive" },
    ],
  },
  Delhi: {
    3: [{ name: "The Metropolitan Hotel & Spa", area: "Connaught Place", note: "Central base for New Delhi sights" }],
    4: [{ name: "The Imperial New Delhi", area: "Connaught Place", note: "Historic luxury near central landmarks" }],
    5: [{ name: "The Leela Palace New Delhi", area: "Chanakyapuri", note: "Luxury stay in the diplomatic enclave" }],
  },
  Goa: {
    3: [{ name: "The Tamarind Hotel", area: "Anjuna", note: "Relaxed base near North Goa beaches" }],
    4: [{ name: "Taj Cidade de Goa Horizon", area: "Dona Paula", note: "Resort stay overlooking the bay" }],
    5: [{ name: "Taj Exotica Resort & Spa", area: "Benaulim", note: "South Goa beachfront resort" }],
  },
  Jaipur: {
    3: [{ name: "Alsisar Haveli", area: "Bani Park", note: "Heritage-style stay near the old city" }],
    4: [{ name: "ITC Rajputana", area: "Gopalpura", note: "Full-service hotel with strong city access" }],
    5: [{ name: "Rambagh Palace", area: "Bhawani Singh Road", note: "Palace hotel and Jaipur landmark" }],
  },
};

export function getHotelOptions(destination, nights = 1, rooms = 1) {
  const city = INDIA_CITIES.find(c => c.name.toLowerCase() === String(destination).trim().toLowerCase());
  const tier = city?.tier || "tier2";
  const rates = HOTEL_RATES[tier] || HOTEL_RATES.tier2;
  const citySuggestions = HOTEL_SUGGESTIONS[city?.name] || {};
  const cityName = city?.name || String(destination).trim() || "your destination";

  return [1, 2, 3, 4, 5].map(stars => {
    const [min, max] = rates[stars];
    const midNight   = Math.round((min + max) / 2);
    return {
      stars,
      label:       "★".repeat(stars),
      perNight:    { min, max },
      midNight,
      total:       midNight * nights * rooms,
      amenities:   HOTEL_AMENITIES[stars],
      suggestions: citySuggestions[stars] || [{
        name: `Search ${stars}-star stays in ${cityName}`,
        area: cityName,
        note: "Compare current availability and guest reviews before booking",
      }],
    };
  });
}