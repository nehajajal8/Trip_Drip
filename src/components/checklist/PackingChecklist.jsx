import { useState, useEffect } from "react";
import { CheckSquare, Square, Plus, Trash2, CheckCircle2, ShieldCheck, ShoppingBag, Shirt, Sparkles, Filter } from "lucide-react";
import { cacheChecklistOffline, getCachedChecklist } from "../../services/offlineStorage";
import { supabase } from "../../lib/supabaseClient";

const DEFAULT_ESSENTIALS = [
  { id: "ess-1", name: "Government ID / Passport / Aadhaar", category: "Documents", packed: false, source: "essential" },
  { id: "ess-2", name: "Fast Charging Power Bank & Cables", category: "Electronics", packed: false, source: "essential" },
  { id: "ess-3", name: "Sunscreen SPF 50+ & Lip Balm", category: "Toiletries", packed: false, source: "essential" },
  { id: "ess-4", name: "Emergency First-Aid & ORS / Hydration", category: "Health", packed: false, source: "essential" },
  { id: "ess-5", name: "Reusable Insulated Water Bottle", category: "Gear", packed: false, source: "essential" },
  { id: "ess-6", name: "Compact Travel Umbrella / Rain Poncho", category: "Weather Gear", packed: false, source: "essential" },
];

export default function PackingChecklist({
  tripId,
  wardrobeItems = [],
  cartItems = [],
  destination = "",
  weather = {},
}) {
  const [items, setItems] = useState([]);
  const [newItemText, setNewItemText] = useState("");
  const [filter, setFilter] = useState("all"); // 'all' | 'unpacked' | 'packed'
  const [loaded, setLoaded] = useState(false);

  // Load and merge items on mount
  useEffect(() => {
    if (!tripId) return;

    async function load() {
      // 1. Try cached checklist
      const cached = await getCachedChecklist(tripId);

      // Build wardrobe checklist entries
      const wardrobeEntries = (wardrobeItems || []).map((w) => ({
        id: `wardrobe-${w.id}`,
        name: `${w.color ? w.color + " " : ""}${w.category || "Garment"}`,
        detail: w.suitability_score ? `Score: ${w.suitability_score}/10` : "Owned Wardrobe",
        category: "Wardrobe Garments",
        packed: false,
        source: "wardrobe",
      }));

      // Build cart checklist entries
      const cartEntries = (cartItems || []).map((c) => ({
        id: `cart-${c.id}`,
        name: `${c.name} (${c.brand})`,
        detail: `Purchased item · ₹${c.price}`,
        category: "Shopping Cart Purchases",
        packed: false,
        source: "cart",
      }));

      if (cached && cached.length > 0) {
        // Merge with existing packed states
        const stateMap = {};
        cached.forEach((c) => {
          stateMap[c.id] = c.packed;
        });

        // Keep custom items from cached
        const customItems = cached.filter((c) => c.source === "custom");

        const merged = [
          ...wardrobeEntries.map((w) => ({ ...w, packed: !!stateMap[w.id] })),
          ...cartEntries.map((c) => ({ ...c, packed: !!stateMap[c.id] })),
          ...DEFAULT_ESSENTIALS.map((e) => ({ ...e, packed: !!stateMap[e.id] })),
          ...customItems,
        ];

        // Deduplicate
        const unique = [];
        const seen = new Set();
        merged.forEach((item) => {
          if (!seen.has(item.id)) {
            seen.add(item.id);
            unique.push(item);
          }
        });

        setItems(unique);
      } else {
        const initial = [...wardrobeEntries, ...cartEntries, ...DEFAULT_ESSENTIALS];
        setItems(initial);
        cacheChecklistOffline(tripId, initial);
      }
      setLoaded(true);
    }

    load();
  }, [tripId, wardrobeItems.length, cartItems.length]);

  // Persist changes to IDB & Supabase
  const persist = (updated) => {
    setItems(updated);
    cacheChecklistOffline(tripId, updated);

    // Optional background sync to trip record
    if (tripId) {
      supabase.from("trips").update({
        weather_json: { checklist: updated }
      }).eq("id", tripId).then(() => {}).catch(() => {});
    }
  };

  const togglePacked = (id) => {
    const updated = items.map((i) => (i.id === id ? { ...i, packed: !i.packed } : i));
    persist(updated);
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    const newItem = {
      id: `custom-${Date.now()}`,
      name: newItemText.trim(),
      category: "Personal Gear",
      packed: false,
      source: "custom",
    };
    persist([...items, newItem]);
    setNewItemText("");
  };

  const handleDeleteItem = (id) => {
    const updated = items.filter((i) => i.id !== id);
    persist(updated);
  };

  // Weather-driven smart packing checklist generator
  const generateWeatherPackingItems = () => {
    const avgTemp = weather?.avgTemp || 26;
    const avgHumidity = weather?.avgHumidity || 60;
    const daily = weather?.daily || [];
    const hasRain = daily.some(d =>
      (d.condition || "").toLowerCase().includes("rain") ||
      (d.condition || "").toLowerCase().includes("shower") ||
      (d.condition || "").toLowerCase().includes("monsoon")
    ) || avgHumidity > 75;

    const weatherItems = [];

    // Monsoon / Rain essentials
    if (hasRain || avgHumidity > 75) {
      weatherItems.push(
        { id: `wth-rain-1`, name: "Windproof Travel Umbrella / Poncho", category: "Weather Gear", packed: false, source: "weather", detail: "Heavy rains or waterfall mist" },
        { id: `wth-rain-2`, name: "Quick-Dry Ripstop Shorts / Chinos", category: "Weather Gear", packed: false, source: "weather", detail: "Dries fast without chafing" },
        { id: `wth-rain-3`, name: "IPX8 Waterproof Phone Pouch", category: "Weather Gear", packed: false, source: "weather", detail: "Protects device in rain" },
        { id: `wth-rain-4`, name: "Odomos Mosquito Repellent Spray", category: "Health", packed: false, source: "weather", detail: "Monsoon insect protection" },
        { id: `wth-rain-5`, name: "Anti-Fungal Dusting Powder", category: "Health", packed: false, source: "weather", detail: "Prevents footwear humidity rash" },
      );
    }

    // Hot / Sunny essentials
    if (avgTemp >= 28 || !hasRain) {
      weatherItems.push(
        { id: `wth-sun-1`, name: "Broad Spectrum Sunscreen SPF 50+ PA++++", category: "Toiletries", packed: false, source: "weather", detail: `High UV index at ${avgTemp}°C` },
        { id: `wth-sun-2`, name: "Breathable Pure Linen / Cotton Shirt", category: "Weather Gear", packed: false, source: "weather", detail: "Maximum airflow in heat" },
        { id: `wth-sun-3`, name: "Polarized UV400 Sunglasses", category: "Weather Gear", packed: false, source: "weather", detail: "Cuts fort and beach glare" },
        { id: `wth-sun-4`, name: "ORS Electrolyte Hydration Sachets", category: "Health", packed: false, source: "weather", detail: "Heat exhaustion prevention" },
        { id: `wth-sun-5`, name: "Wide-Brim Sun Hat / Cotton Stole", category: "Weather Gear", packed: false, source: "weather", detail: "Shields scalp and neck" },
      );
    }

    // Mountain / Cold essentials
    if (avgTemp < 20) {
      weatherItems.push(
        { id: `wth-cold-1`, name: "Thermal Base Layer Top & Bottom", category: "Weather Gear", packed: false, source: "weather", detail: `Cold conditions (${avgTemp}°C)` },
        { id: `wth-cold-2`, name: "Wind-Blocking Fleece / Light Down Jacket", category: "Weather Gear", packed: false, source: "weather", detail: "Body heat insulation" },
        { id: `wth-cold-3`, name: "Woolen Socks & Windproof Gloves", category: "Weather Gear", packed: false, source: "weather", detail: "Nighttime warmth" },
        { id: `wth-cold-4`, name: "Intense Moisturizing Cold Cream & Lip Balm", category: "Toiletries", packed: false, source: "weather", detail: "Prevents chapping" },
      );
    }

    const existingNames = new Set(items.map((i) => i.name.toLowerCase()));
    const newItems = weatherItems.filter((w) => !existingNames.has(w.name.toLowerCase()));
    if (newItems.length > 0) {
      const updated = [...items, ...newItems];
      persist(updated);
    }
  };

  const packedCount = items.filter((i) => i.packed).length;
  const totalCount = items.length;
  const pct = totalCount > 0 ? Math.round((packedCount / totalCount) * 100) : 0;

  const filteredItems = items.filter((i) => {
    if (filter === "packed") return i.packed;
    if (filter === "unpacked") return !i.packed;
    return true;
  });

  // Group by category
  const categories = Array.from(new Set(filteredItems.map((i) => i.category || "General")));

  return (
    <div className="bg-white border border-mist">
      {/* Header */}
      <div className="bg-teal p-5 text-sand flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-saffron">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sand/20 flex items-center justify-center">
            <CheckSquare size={20} className="text-sand" />
          </div>
          <div>
            <p className="font-mono text-[0.65rem] tracking-[0.2em] uppercase text-sand/60">
              Trip Drip Checklist
            </p>
            <h3 className="font-display font-bold text-xl text-sand leading-none">
              Smart Packing List
            </h3>
          </div>
        </div>

        {/* Progress pill */}
        <div className="flex items-center gap-3 bg-teal/60 border border-sand/20 px-4 py-2">
          <div className="text-right">
            <span className="font-mono text-xs font-bold text-sand block leading-tight">
              {packedCount} / {totalCount} Packed
            </span>
            <span className="font-mono text-[0.6rem] text-sand/60">
              {pct}% Ready for {destination || "Trip"}
            </span>
          </div>
          <div className="w-9 h-9 relative flex-shrink-0">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <circle cx="18" cy="18" r="14" fill="none" stroke="#D9CFC3" strokeWidth="3" opacity="0.3" />
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke="#E8610A"
                strokeWidth="3"
                strokeDasharray={`${(pct / 100) * 88} 88`}
                strokeLinecap="round"
                style={{ transition: "stroke-dasharray 0.5s ease" }}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center font-mono text-[0.65rem] text-sand font-bold">
              {pct}%
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Add Input */}
      <div className="p-4 bg-sand/15 border-b border-mist flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="flex gap-1.5 flex-wrap items-center">
          {[
            { id: "all", label: `All (${totalCount})` },
            { id: "unpacked", label: `To Pack (${totalCount - packedCount})` },
            { id: "packed", label: `Packed (${packedCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`font-mono text-xs px-3 py-1.5 border transition-colors ${
                filter === tab.id
                  ? "bg-slate text-sand border-slate font-semibold"
                  : "bg-white text-slate/60 border-mist hover:border-slate/30"
              }`}
            >
              {tab.label}
            </button>
          ))}

          {/* Auto-Generate Weather Checklist Button */}
          <button
            type="button"
            onClick={generateWeatherPackingItems}
            className="font-mono text-xs px-3 py-1.5 bg-saffron text-white hover:bg-saffron/90 flex items-center gap-1.5 transition-colors font-semibold shadow-xs cursor-pointer sm:ml-1"
            title="Auto-generate items based on weather forecast & climate"
          >
            <Sparkles size={12} />
            <span>Weather Pack</span>
          </button>
        </div>

        {/* Quick Add Custom Item */}
        <form onSubmit={handleAddItem} className="flex gap-2 max-w-sm w-full">
          <input
            type="text"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            placeholder="Add custom packing item…"
            className="flex-1 px-3 py-1.5 bg-white border border-mist font-sans text-xs text-slate focus:outline-none focus:border-saffron"
          />
          <button
            type="submit"
            disabled={!newItemText.trim()}
            className="px-3 py-1.5 bg-saffron text-white font-sans text-xs font-semibold hover:bg-saffron/90 disabled:opacity-40 transition-colors flex items-center gap-1"
          >
            <Plus size={13} /> Add
          </button>
        </form>
      </div>

      {/* Checklist Grouped View */}
      <div className="p-5 space-y-6 max-h-96 overflow-y-auto">
        {filteredItems.length === 0 ? (
          <div className="py-8 text-center text-slate/40 font-sans text-xs">
            No items in this view.
          </div>
        ) : (
          categories.map((cat) => {
            const catItems = filteredItems.filter((i) => (i.category || "General") === cat);
            if (catItems.length === 0) return null;

            return (
              <div key={cat} className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[0.65rem] uppercase tracking-widest text-slate/45 font-semibold">
                    {cat}
                  </span>
                  <div className="flex-1 h-px bg-mist/60" />
                  <span className="font-mono text-[0.6rem] text-slate/35">
                    {catItems.filter((i) => i.packed).length}/{catItems.length}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {catItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => togglePacked(item.id)}
                      className={`flex items-start justify-between p-3 border transition-all cursor-pointer select-none group ${
                        item.packed
                          ? "bg-forest/5 border-forest/20 text-slate/60"
                          : "bg-white border-mist hover:border-saffron/60 text-slate"
                      }`}
                    >
                      <div className="flex items-start gap-3 flex-1 min-w-0 pr-2">
                        <button
                          type="button"
                          className="mt-0.5 text-slate/40 group-hover:text-saffron transition-colors flex-shrink-0"
                        >
                          {item.packed ? (
                            <CheckSquare size={16} className="text-forest" />
                          ) : (
                            <Square size={16} />
                          )}
                        </button>
                        <div className="min-w-0">
                          <p
                            className={`font-sans text-xs font-medium leading-snug truncate ${
                              item.packed ? "line-through text-slate/40" : "text-slate"
                            }`}
                          >
                            {item.name}
                          </p>
                          {item.detail && (
                            <p className="font-sans text-[0.65rem] text-slate/40 truncate mt-0.5">
                              {item.detail}
                            </p>
                          )}
                        </div>
                      </div>

                      {item.source === "custom" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteItem(item.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 text-slate/30 hover:text-crimson p-1 transition-opacity"
                          title="Delete"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer info note */}
      <div className="bg-sand/20 px-5 py-3 border-t border-mist flex items-center justify-between font-mono text-[0.65rem] text-slate/45">
        <span>Auto-synced: Matched Wardrobe + Shopping Cart + Travel Essentials</span>
        <span className="text-forest font-semibold">Offline Ready</span>
      </div>
    </div>
  );
}
