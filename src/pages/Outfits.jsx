import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles, Shirt, Search, ExternalLink, ArrowRight, CheckCircle2,
  Tag, ShieldCheck, Sun, CloudRain, Mountain, Wind, Heart, ChevronRight, X, Filter
} from "lucide-react";
import AppShell from "../components/layout/AppShell";
import { useCurrency } from "../contexts/CurrencyContext";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../contexts/AuthContext";

const MARKETPLACE_LINKS = [
  { name: "Myntra", url: (query) => `https://www.myntra.com/${encodeURIComponent(query)}` },
  { name: "Zara", url: (query) => `https://www.zara.com/in/en/search?searchTerm=${encodeURIComponent(query)}` },
  { name: "H&M", url: (query) => `https://www2.hm.com/en_in/search-results.html?q=${encodeURIComponent(query)}` },
  { name: "Savana", url: (query) => `https://www.google.com/search?q=${encodeURIComponent(`Savana ${query}`)}` },
  { name: "Meesho", url: (query) => `https://www.google.com/search?q=${encodeURIComponent(`Meesho ${query}`)}` },
];

const TRAVELER_TYPES = [
  { id: "all", label: "Everyone" },
  { id: "men", label: "Men" },
  { id: "women", label: "Women" },
  { id: "couples", label: "Couples" },
  { id: "kids", label: "Kids" },
];

export const CURATED_OUTFIT_COLLECTIONS = [
  {
    id: "goa-beach-linen",
    title: "Goa Coastal & Sunset Linen",
    region: "Goa & Konkan Coast",
    climateType: "Coastal / Tropical",
    tempRange: "28°C – 34°C · High Humidity",
    weatherIcon: Sun,
    vibe: "Bohemian Coastal · Relaxed Luxury",
    description: "Ultra-breathable open flax linen weaves designed to wick away seaside moisture while keeping you effortless at sunset shacks.",
    coverImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
    pieces: [
      {
        id: "goa-p1",
        category: "short_sleeve_top",
        categoryLabel: "Top",
        name: "Cuban Camp-Collar Pure Linen Shirt",
        fabric: "100% French Flax Linen",
        color: "Off-White / Sand",
        climateNote: "Maximum air circulation across humid afternoons; open collar dries in coastal breeze.",
        image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80",
        estimatedPrice: 2490,
      },
      {
        id: "goa-p2",
        category: "shorts",
        categoryLabel: "Bottom",
        name: "Drawstring Linen-Blend Leisure Shorts",
        fabric: "Linen-Viscose Blend",
        color: "Terracotta / Olive",
        climateNote: "Elasticated drawstring waistband with quick drainage, safe for ankle-deep beach walks.",
        image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=600&q=80",
        estimatedPrice: 1690,
      },
      {
        id: "goa-p3",
        category: "shoes",
        categoryLabel: "Footwear",
        name: "Water-Resistant Dual-Strap Cork Slides",
        fabric: "EVA / Waterproof Synthetic",
        color: "Espresso Brown",
        climateNote: "Easy slip-off for shack lounging and beach sand, water-tolerant footbed.",
        image: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=600&q=80",
        estimatedPrice: 1990,
      },
      {
        id: "goa-p4",
        category: "hat",
        categoryLabel: "Accessory",
        name: "Crushable Paper Straw Fedora / Sun Hat",
        fabric: "Woven Natural Straw",
        color: "Tan",
        climateNote: "Broad brim shields scalp and forehead from intense midday Arabian Sea UV index.",
        image: "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=600&q=80",
        estimatedPrice: 799,
      }
    ]
  },
  {
    id: "jaipur-royal-heritage",
    title: "Jaipur Royal Heritage & Breathable Cottons",
    region: "Rajasthan & Central India",
    climateType: "Arid / Fort Exploration",
    tempRange: "26°C – 37°C · Dry Sun",
    weatherIcon: Sun,
    vibe: "Imperial Classic · Artisan Prints",
    description: "Lightweight long-staple cottons that shield skin from harsh desert glare across sprawling stone courtyards and amber ramparts.",
    coverImage: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1000&q=80",
    pieces: [
      {
        id: "jpr-p1",
        category: "long_sleeve_top",
        categoryLabel: "Top",
        name: "Hand-Block Print Cotton Short Kurta / Bandhgala Shirt",
        fabric: "100% Mulmul Cotton",
        color: "Indigo / Indigo Floral",
        climateNote: "Protects arms from harsh desert UV; naturally cooling mulmul breathes effortlessly.",
        image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80",
        estimatedPrice: 1499,
      },
      {
        id: "jpr-p2",
        category: "trousers",
        categoryLabel: "Bottom",
        name: "Pleated Tapered Linen-Cotton Trousers",
        fabric: "60% Linen, 40% Cotton",
        color: "Desert Khaki",
        climateNote: "Modest and culturally respectful for palace and temple grounds without trapping heat.",
        image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=600&q=80",
        estimatedPrice: 2290,
      },
      {
        id: "jpr-p3",
        category: "shoes",
        categoryLabel: "Footwear",
        name: "Cushioned Leather Mojari or Slip-On Loafers",
        fabric: "Supple Leather / Soft Insole",
        color: "Camel / Tan",
        climateNote: "Easy off-and-on for heritage sanctums, smooth sole across paved fort stone.",
        image: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=600&q=80",
        estimatedPrice: 2499,
      },
      {
        id: "jpr-p4",
        category: "bag",
        categoryLabel: "Accessory",
        name: "Compact Crossbody Travel Pouch",
        fabric: "Water-Repellent Canvas",
        color: "Desert Beige",
        climateNote: "Hands-free photography through palace gates; keeps hydration spray and glasses safe.",
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80",
        estimatedPrice: 990,
      }
    ]
  },
  {
    id: "lonavala-monsoon-trail",
    title: "Western Ghats Monsoon & Quick-Dry Trail",
    region: "Lonavala, Mahabaleshwar & Coorg",
    climateType: "Monsoon Mist & Waterfalls",
    tempRange: "20°C – 25°C · Heavy Rains",
    weatherIcon: CloudRain,
    vibe: "Highland Trekker · Weatherproof",
    description: "Hydrophobic synthetic blends that shed sudden monsoon downpours, dry within 40 minutes, and prevent waterfall chafing.",
    coverImage: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1000&q=80",
    pieces: [
      {
        id: "lon-p1",
        category: "short_sleeve_top",
        categoryLabel: "Top",
        name: "AIRism Anti-Chafe Moisture-Wicking Performance Tee",
        fabric: "Hydrophobic Micro-Polyester",
        color: "Forest Olive / Charcoal",
        climateNote: "Dries rapidly after waterfall spray; antimicrobially treated to prevent mildew odors.",
        image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80",
        estimatedPrice: 1290,
      },
      {
        id: "lon-p2",
        category: "shorts",
        categoryLabel: "Bottom",
        name: "Ripstop Cargo Trail Shorts with Drainage Eyelets",
        fabric: "100% Quick-Dry Ripstop Nylon",
        color: "Matte Black",
        climateNote: "Resists snagging on damp bushes; water drains immediately after river crossings.",
        image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=600&q=80",
        estimatedPrice: 1790,
      },
      {
        id: "lon-p3",
        category: "long_sleeve_outwear",
        categoryLabel: "Layer",
        name: "Packable 2.5L Wind & Torrent Rain Shell",
        fabric: "Waterproof Breathable Membrane",
        color: "Deep Teal",
        climateNote: "Packs into its own pocket; shields from sudden cliffside squalls and cool mist.",
        image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=600&q=80",
        estimatedPrice: 2990,
      },
      {
        id: "lon-p4",
        category: "shoes",
        categoryLabel: "Footwear",
        name: "Hydro-Trek Amphibious Hiking Sandals",
        fabric: "High-Traction Vibram / Lugged Rubber",
        color: "Black / Grey",
        climateNote: "Extreme grip on wet mossy basalt rocks; drains completely without waterlogging.",
        image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=600&q=80",
        estimatedPrice: 2190,
      }
    ]
  },
  {
    id: "mountain-layering-himalayas",
    title: "Himalayan Ridge & High-Altitude Layering",
    region: "Himachal, Ladakh & Uttarakhand",
    climateType: "Alpine Cold & Mountain Wind",
    tempRange: "4°C – 18°C · Crisp Sun & Cold Wind",
    weatherIcon: Mountain,
    vibe: "Expedition Minimal · Thermal Warmth",
    description: "Smart 3-layer system: thermal moisture base, fleece core warmth, and wind-blocking outer barrier against high-altitude gusts.",
    coverImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80",
    pieces: [
      {
        id: "mt-p1",
        category: "long_sleeve_top",
        categoryLabel: "Base Layer",
        name: "HEATTECH Extra Warm Long-Sleeve Thermal Top",
        fabric: "Rayon-Acrylic Bio-Warming Knit",
        color: "Heather Charcoal",
        climateNote: "Traps body heat while keeping perspiration moving away from skin at altitude.",
        image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=600&q=80",
        estimatedPrice: 1990,
      },
      {
        id: "mt-p2",
        category: "long_sleeve_outwear",
        categoryLabel: "Insulation",
        name: "Ultra Light Down Water-Repellent Puffer Jacket",
        fabric: "750+ Fill Power Down",
        color: "Navy Blue",
        climateNote: "Featherlight warmth for chilly mountain sunrises, compresses into a mini pouch.",
        image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=600&q=80",
        estimatedPrice: 4990,
      },
      {
        id: "mt-p3",
        category: "trousers",
        categoryLabel: "Bottom",
        name: "Fleece-Lined Weatherproof Trekking Pants",
        fabric: "Stretch Nylon with Microfleece Backing",
        color: "Slate Grey",
        climateNote: "Blocks piercing pass winds while allowing 4-way freedom of movement.",
        image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=600&q=80",
        estimatedPrice: 2490,
      },
      {
        id: "mt-p4",
        category: "shoes",
        categoryLabel: "Footwear",
        name: "Mid-Cut Ankle Support All-Weather Trail Boots",
        fabric: "Waterproof Suede & Rubber Lug Sole",
        color: "Earth Brown",
        climateNote: "Crucial ankle stability on loose scree, gravel switchbacks, and frosty ground.",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
        estimatedPrice: 3490,
      }
    ]
  },
  {
    id: "spiritual-modest-ghats",
    title: "Varanasi Ghats & Spiritual Modest Linen",
    region: "Varanasi, Rishikesh & Amritsar",
    climateType: "Riverbank & Sacred Temples",
    tempRange: "22°C – 32°C · Mild & Reverent",
    weatherIcon: Wind,
    vibe: "Sacred Serenity · Pure Breathability",
    description: "Modest, graceful shoulder-and-knee covering silhouettes in serene neutral tones tailored for sacred sanctums and evening aarti ghats.",
    coverImage: "https://images.unsplash.com/photo-1561361066-608a0d0a7cb2?auto=format&fit=crop&w=1000&q=80",
    pieces: [
      {
        id: "spi-p1",
        category: "long_sleeve_top",
        categoryLabel: "Top",
        name: "Relaxed Mandarin-Collar Linen Long Kurta",
        fabric: "Pure Khadi / Slub Cotton",
        color: "Pristine White / Saffron Tint",
        climateNote: "Full shoulder and chest coverage aligned with holy temple entry mandates; completely cooling.",
        image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80",
        estimatedPrice: 1790,
      },
      {
        id: "spi-p2",
        category: "trousers",
        categoryLabel: "Bottom",
        name: "Relaxed Fit Cotton Drawstring Pajama Trousers",
        fabric: "100% Breathable Weave Cotton",
        color: "Ivory / Sand",
        climateNote: "Easy for sitting cross-legged during temple rituals and evening musical aarti on ghat steps.",
        image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=600&q=80",
        estimatedPrice: 1290,
      },
      {
        id: "spi-p3",
        category: "shoes",
        categoryLabel: "Footwear",
        name: "Slip-On Minimalist Vegan Leather Sandals",
        fabric: "Synthetic Leather",
        color: "Natural Tan",
        climateNote: "Requires no buckle adjustments when entering and leaving barefoot sacred precincts.",
        image: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=600&q=80",
        estimatedPrice: 1299,
      },
      {
        id: "spi-p4",
        category: "bag",
        categoryLabel: "Accessory",
        name: "Lightweight Cotton Dupatta / Stole Scarf",
        fabric: "Pure Mulmul Cotton",
        color: "Ochre / Sand",
        climateNote: "Mandatory head covering for gurudwaras and temple inner sanctums; sun shelter by day.",
        image: "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=600&q=80",
        estimatedPrice: 499,
      }
    ]
  }
];

export default function Outfits() {
  const { format } = useCurrency();
  const { user } = useAuth();

  const [activeFilter, setActiveFilter] = useState("all");
  const [travelerType, setTravelerType] = useState("all");
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [similarItems, setSimilarItems] = useState([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(null);

  // Filter collections
  const filteredCollections = CURATED_OUTFIT_COLLECTIONS.filter(c => {
    if (activeFilter === "all") return true;
    if (activeFilter === "coastal") return c.id.includes("goa");
    if (activeFilter === "heritage") return c.id.includes("jaipur");
    if (activeFilter === "monsoon") return c.id.includes("lonavala");
    if (activeFilter === "mountain") return c.id.includes("mountain");
    if (activeFilter === "spiritual") return c.id.includes("spiritual");
    return true;
  });

  // Handle Find Similar / Visual Reverse Search
  async function handleFindSimilar(piece, collection) {
    setSelectedPiece({ ...piece, collectionTitle: collection.title });
    setLoadingSimilar(true);
    setSimilarItems([]);

    try {
      const res = await fetch("/api/find-similar-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: piece.category,
          name: piece.name,
          style: collection.vibe,
          color: piece.color,
          fabric: piece.fabric,
          maxBudget: piece.estimatedPrice * 1.5,
          limit: 6
        })
      });

      if (res.ok) {
        const data = await res.json();
        setSimilarItems(data.items || []);
      }
    } catch (err) {
      console.warn("Visual search error:", err);
    } finally {
      setLoadingSimilar(false);
    }
  }

  // Handle adding an item to user wardrobe
  async function handleAddToWardrobe(item) {
    if (!user) {
      alert("Please sign in to save garments to your travel wardrobe!");
      return;
    }

    try {
      const payload = {
        user_id: user.id,
        category: item.category,
        color: item.colors?.[0] || item.color || "Neutral",
        suitability_score: Math.min(10, Math.round((item.similarityScore || 90) / 10)),
        image_url: item.image,
        notes: `Matched via Visual Search (${item.brand} - ₹${item.price})`,
      };

      await supabase.from("wardrobe_items").insert(payload);
      setAddedSuccess(item.id);
      setTimeout(() => setAddedSuccess(null), 3000);
    } catch (err) {
      console.warn("Error adding to wardrobe:", err);
    }
  }

  return (
    <AppShell>
      {/* ── HERO ──────────────────────────────────────────────── */}
      <div className="bg-teal geo-border-top relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "radial-gradient(circle at 50% 50%,#E8D5A8 1px,transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative max-w-content mx-auto px-6 md:px-12 py-12 animate-enter">
          <p className="font-mono text-xs tracking-[0.25em] uppercase text-sand/50 mb-2">
            — Curated Indian Travel Styles —
          </p>
          <h1
            className="font-display font-bold text-sand leading-none"
            style={{ fontSize: "clamp(2.8rem,6vw,5rem)" }}
          >
            Outfit Inspiration & Visual Search
          </h1>
          <p className="font-sans text-sm text-sand/70 mt-3 max-w-2xl leading-relaxed">
            Curated styling systems engineered for Indian microclimates—from humid Konkan shores to high Himalayan passes. Click <strong>"Find Similar Clothes"</strong> on any piece to instantly reverse-search matching pieces across <strong>Zara, H&M, Uniqlo, and Westside</strong> with direct store links.
          </p>

          <div className="mt-7">
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-sand/50 mb-2">Style this trip for</p>
            <div className="flex flex-wrap gap-2">
              {TRAVELER_TYPES.map(type => (
                <button
                  key={type.id}
                  onClick={() => setTravelerType(type.id)}
                  className={`font-sans text-xs px-4 py-2 border transition-colors ${
                    travelerType === type.id
                      ? "bg-sand text-teal border-sand font-semibold"
                      : "border-sand/25 text-sand/75 hover:border-sand hover:text-sand"
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
            <p className="font-sans text-xs text-sand/50 mt-2">
              Showing breathable, trip-ready looks for {TRAVELER_TYPES.find(type => type.id === travelerType)?.label.toLowerCase()}.
            </p>
          </div>

          {/* Quick Filter Pills */}
          <div className="flex flex-wrap gap-2 mt-8">
            {[
              { id: "all", label: "All Climates" },
              { id: "coastal", label: "🏖️ Goa Coastal Linen" },
              { id: "heritage", label: "🏛️ Jaipur Royal Heritage" },
              { id: "monsoon", label: "🌧️ Ghats Monsoon Quick-Dry" },
              { id: "mountain", label: "⛰️ Himalayan Layering" },
              { id: "spiritual", label: "🪔 Spiritual Modest" },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={[
                  "font-mono text-xs px-3.5 py-2 transition-all cursor-pointer",
                  activeFilter === f.id
                    ? "bg-saffron text-white font-bold shadow-xs"
                    : "bg-white/10 text-sand hover:bg-white/20 border border-sand/20"
                ].join(" ")}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── BODY: OUTFIT COLLECTIONS ─────────────────────────── */}
      <div className="max-w-content mx-auto px-6 md:px-12 py-12 space-y-16">
        {filteredCollections.map(collection => {
          const WeatherIcon = collection.weatherIcon;

          return (
            <div
              key={collection.id}
              className="bg-white border border-mist shadow-xs overflow-hidden"
            >
              {/* Collection Header Banner */}
              <div className="relative border-b border-mist bg-slate text-sand p-6 md:p-8 flex flex-col md:flex-row md:items-end justify-between gap-6 overflow-hidden">
                <div
                  className="absolute inset-0 opacity-20 bg-cover bg-center mix-blend-luminosity"
                  style={{ backgroundImage: `url(${collection.coverImage})` }}
                />
                <div className="relative z-10 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-[0.65rem] bg-saffron text-white px-2 py-0.5 uppercase tracking-wider font-semibold">
                      {collection.climateType}
                    </span>
                    <span className="font-mono text-[0.65rem] bg-sand/20 text-sand px-2 py-0.5 font-medium">
                      {collection.region}
                    </span>
                  </div>
                  <h2 className="font-display font-bold text-2xl md:text-3xl text-sand">
                    {collection.title}
                  </h2>
                  <p className="font-sans text-xs md:text-sm text-sand/75 max-w-2xl leading-relaxed">
                    {collection.description}
                  </p>
                </div>

                <div className="relative z-10 bg-slate-900/80 backdrop-blur-xs border border-white/10 p-3 self-start md:self-auto flex items-center gap-3">
                  <WeatherIcon size={22} className="text-saffron flex-shrink-0" />
                  <div>
                    <p className="font-mono text-[0.65rem] text-sand/50 uppercase">Microclimate</p>
                    <p className="font-mono text-xs text-sand font-bold">{collection.tempRange}</p>
                  </div>
                </div>
              </div>

              {/* Pieces Grid */}
              <div className="p-6 md:p-8">
                <p className="font-mono text-xs uppercase tracking-widest text-slate/40 mb-4">
                  Decomposed Outfit Pieces ({collection.pieces.length} Essential Items)
                </p>

                <div className="columns-1 sm:columns-2 lg:columns-4 gap-6">
                  {collection.pieces.map(piece => (
                    <div
                      key={piece.id}
                      className="bg-ivory border border-mist hover:border-saffron transition-all flex flex-col justify-between group break-inside-avoid mb-6"
                    >
                      <div>
                        {/* Image Preview */}
                        <div className={`${piece.id.endsWith("p1") ? "h-56" : "h-44"} overflow-hidden bg-mist/20 relative`}>
                          <img
                            src={piece.image}
                            alt={piece.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                          <span className="absolute top-2 left-2 bg-slate/90 text-sand font-mono text-[0.6rem] px-1.5 py-0.5 uppercase">
                            {piece.categoryLabel}
                          </span>
                        </div>

                        {/* Details */}
                        <div className="p-4 space-y-2">
                          <h3 className="font-display font-bold text-sm text-slate leading-snug">
                            {piece.name}
                          </h3>
                          <div className="space-y-1 text-xs">
                            <p className="font-mono text-[0.65rem] text-slate/50">
                              Fabric: <span className="text-slate font-medium">{piece.fabric}</span>
                            </p>
                            <p className="font-mono text-[0.65rem] text-slate/50">
                              Shade: <span className="text-slate font-medium">{piece.color}</span>
                            </p>
                            <p className="font-sans text-[0.7rem] text-slate/60 leading-relaxed pt-1 border-t border-mist/60">
                              {piece.climateNote}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Reverse Search CTA */}
                      <div className="p-4 pt-0">
                        <button
                          onClick={() => handleFindSimilar(piece, collection)}
                          className="w-full py-2 px-3 bg-slate text-sand font-mono text-xs font-semibold hover:bg-saffron hover:text-white transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <Search size={13} />
                          <span>Find Similar Clothes</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── VISUAL SIMILARITY DRAWER / MODAL ─────────────────── */}
      {selectedPiece && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-xl h-full shadow-2xl flex flex-col animate-enter overflow-hidden">
            {/* Drawer Header */}
            <div className="p-5 border-b border-mist bg-ivory flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-saffron/15 text-saffron flex items-center justify-center">
                  <Sparkles size={16} />
                </div>
                <div>
                  <span className="font-mono text-[0.6rem] uppercase tracking-wider text-saffron font-bold">
                    Visual Reverse Search (Option d)
                  </span>
                  <h3 className="font-display font-bold text-base text-slate">
                    Matching Brands Catalog
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedPiece(null)}
                className="text-slate/40 hover:text-slate p-1"
              >
                <X size={18} />
              </button>
            </div>

            {/* Queried Item Summary Bar */}
            <div className="p-4 bg-sand/20 border-b border-mist flex items-center gap-4">
              <img
                src={selectedPiece.image}
                alt={selectedPiece.name}
                className="w-14 h-14 object-cover border border-mist flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <span className="font-mono text-[0.6rem] text-slate/50 uppercase">Searching for similar</span>
                <h4 className="font-display font-semibold text-xs text-slate truncate">
                  {selectedPiece.name}
                </h4>
                <p className="font-mono text-[0.65rem] text-slate/50">
                  {selectedPiece.fabric} · Est. ~{format(selectedPiece.estimatedPrice)}
                </p>
              </div>
            </div>

            {/* Results Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div className="flex items-center justify-between">
                <p className="font-mono text-xs uppercase tracking-widest text-slate/50">
                  Matches Across Zara, H&M, Uniqlo & Westside
                </p>
                <span className="font-mono text-[0.65rem] text-forest bg-forest/10 px-2 py-0.5">
                  Direct Store Links
                </span>
              </div>

              {loadingSimilar ? (
                <div className="py-20 text-center space-y-3">
                  <div className="w-8 h-8 border-2 border-saffron border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="font-mono text-xs text-slate/40">
                    Scanning multi-brand catalog & scoring visual attributes…
                  </p>
                </div>
              ) : similarItems.length === 0 ? (
                <div className="py-12 text-center text-slate/40 font-sans text-sm">
                  No direct matches found. Try broadening the search.
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="border border-saffron/30 bg-sand/20 p-3">
                    <p className="font-mono text-[0.6rem] uppercase tracking-widest text-slate/50 mb-2">Compare this piece across stores</p>
                    <div className="flex flex-wrap gap-2">
                      {MARKETPLACE_LINKS.map(marketplace => (
                        <a
                          key={marketplace.name}
                          href={marketplace.url(selectedPiece.name)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-[0.65rem] px-2.5 py-1.5 bg-white border border-mist text-slate hover:border-saffron hover:text-saffron transition-colors"
                        >
                          {marketplace.name}
                        </a>
                      ))}
                    </div>
                  </div>
                  {similarItems.map(item => (
                    <div
                      key={item.id}
                      className="border border-mist p-4 hover:border-slate/40 transition-all flex gap-4 items-center bg-white"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-24 object-cover border border-mist flex-shrink-0 bg-mist/20"
                      />
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-[0.65rem] font-bold px-1.5 py-0.5 bg-slate text-sand">
                            {item.brand}
                          </span>
                          <span className="font-mono text-xs text-forest font-bold bg-forest/10 px-1.5 py-0.5">
                            {item.similarityScore}% Match
                          </span>
                        </div>

                        <h4 className="font-display font-semibold text-xs text-slate truncate">
                          {item.name}
                        </h4>

                        <p className="font-mono text-xs font-bold text-slate">
                          {format(item.price)}
                        </p>

                        <p className="font-sans text-[0.65rem] text-slate/50 line-clamp-1">
                          {item.material} · {item.fit || "Standard Fit"}
                        </p>

                        {/* Actions */}
                        <div className="flex items-center gap-2 pt-2">
                          <a
                            href={item.outboundUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 font-mono text-[0.65rem] text-saffron font-bold hover:underline"
                          >
                            <span>Buy on {item.brand}</span>
                            <ExternalLink size={10} />
                          </a>

                          <span className="text-slate/20">·</span>

                          <button
                            onClick={() => handleAddToWardrobe(item)}
                            className="font-mono text-[0.65rem] text-slate/60 hover:text-slate flex items-center gap-1"
                          >
                            {addedSuccess === item.id ? (
                              <span className="text-forest font-bold flex items-center gap-1">
                                <CheckCircle2 size={11} /> Saved to Wardrobe!
                              </span>
                            ) : (
                              <span>Add to Wardrobe</span>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-mist bg-ivory text-center">
              <p className="font-mono text-[0.65rem] text-slate/50">
                Zero-cost visual comparison powered by brand product matching.
              </p>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
