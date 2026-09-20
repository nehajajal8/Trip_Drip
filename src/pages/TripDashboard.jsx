import React, { useEffect, useState, useCallback, Fragment } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Cloud, Sun, CloudRain, CloudSnow, Cloudy, Wind,
  Thermometer, Droplets, Shirt, BookOpen, DollarSign, MapPin,
  Train, Bus, Car, Plane, Star, ChevronDown, ChevronUp,
  IndianRupee, Users, Hotel, Map, Loader2, RefreshCw,
  CheckSquare, Square, ChevronRight, ShoppingBag, Share2, Sparkles, AlertCircle,
  Coffee, QrCode, Trash2, AlertTriangle, X, Printer
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../contexts/AuthContext";
import { useCurrency } from "../contexts/CurrencyContext";
import AppShell from "../components/layout/AppShell";
import TripMap from "../components/maps/TripMap";
import BrandComparisonModal from "../components/shop/BrandComparisonModal";
import ShoppingCartDrawer from "../components/shop/ShoppingCartDrawer";
import PackingChecklist from "../components/checklist/PackingChecklist";
import GroupCollaborationModal from "../components/trip/GroupCollaborationModal";
import GroupMissingItems from "../components/trip/GroupMissingItems";
import HisaabKitaabModal from "../components/expenses/HisaabKitaabModal";
import ChaiStationRadarModal from "../components/food/ChaiStationRadarModal";
import {
  cacheTripOffline, getCachedTrip,
  cacheCartOffline, getCachedCart,
  cacheSquadOffline, getCachedSquad,
  cacheExpensesOffline, getCachedExpenses,
  deleteCachedTrip
} from "../services/offlineStorage";
import ItineraryMatrix from "../components/itinerary/ItineraryMatrix";
import DayWardrobeCard from "../components/itinerary/DayWardrobeCard";
import { buildTemplateItinerary, isDuplicateOrInvalidItinerary } from "../data/indiaItineraries";
import { INDIA_CITIES } from "../data/indiaTransport";

function resolveCoordinates(destination, weatherDest = {}) {
  if (weatherDest.lat && weatherDest.lng) {
    return { lat: parseFloat(weatherDest.lat), lng: parseFloat(weatherDest.lng) };
  }
  if (!destination) return { lat: 23.7337, lng: 69.8597 };
  const d = destination.toLowerCase().trim();
  const matched = INDIA_CITIES.find(c =>
    d.includes(c.name.toLowerCase()) || c.name.toLowerCase().includes(d)
  );
  if (matched) return { lat: matched.lat, lng: matched.lng };
  if (d.includes("kutch") || d.includes("rann") || d.includes("bhuj") || d.includes("dhordo")) {
    return { lat: 23.7337, lng: 69.8597 };
  }
  if (d.includes("lonavala") || d.includes("lonavla") || d.includes("khandala")) {
    return { lat: 18.7557, lng: 73.4091 };
  }
  if (d.includes("mumbai") || d.includes("bombay")) {
    return { lat: 18.9220, lng: 72.8347 };
  }
  return { lat: 23.7337, lng: 69.8597 }; // Default fallback
}

function WeatherIcon({ code, size = 20, className = "" }) {
  if (code === 0) return <Sun size={size} className={`${className} text-saffron`} />;
  if (code <= 3) return <Cloudy size={size} className={`${className} text-slate/40`} />;
  if (code >= 51 && code <= 67) return <CloudRain size={size} className={`${className} text-teal`} />;
  if (code >= 71 && code <= 77) return <CloudSnow size={size} className={`${className} text-teal/60`} />;
  if (code >= 80 && code <= 82) return <CloudRain size={size} className={`${className} text-teal`} />;
  if (code >= 95) return <Wind size={size} className={`${className} text-crimson`} />;
  return <Cloud size={size} className={`${className} text-slate/40`} />;
}

function safeFormatDate(dateStr, options, fallback = "—") {
  if (!dateStr) return fallback;
  try {
    const d = new Date(dateStr.includes("T") ? dateStr : dateStr + "T12:00:00");
    if (isNaN(d.getTime())) return fallback;
    return d.toLocaleDateString("en-IN", options);
  } catch {
    return fallback;
  }
}

// ── Transport comparison table ────────────────────────────────
function TransportTable({ transport, groupSize, format }) {
  const [open, setOpen] = useState(false);
  if (!transport) return null;
  const g = groupSize || 1;

  const rows = [
    {
      mode: "Train",
      icon: Train,
      color: "text-teal",
      items: [
        { cls: "Sleeper", pp: transport.train.sleeper, total: transport.train.sleeper * g },
        { cls: "3AC", pp: transport.train["3AC"], total: transport.train["3AC"] * g },
        { cls: "2AC", pp: transport.train["2AC"], total: transport.train["2AC"] * g },
      ],
    },
    {
      mode: "Bus",
      icon: Bus,
      color: "text-forest",
      items: [
        { cls: "State Bus", pp: transport.bus.ordinary, total: transport.bus.ordinary * g },
        { cls: "Volvo AC", pp: transport.bus["volvo-AC"], total: transport.bus["volvo-AC"] * g },
        { cls: "Sleeper AC", pp: transport.bus["sleeper-AC"], total: transport.bus["sleeper-AC"] * g },
      ],
    },
    {
      mode: "Car",
      icon: Car,
      color: "text-saffron",
      items: [
        { cls: `${g} people shared`, pp: transport.car.perPerson, total: transport.car.total },
      ],
    },
    ...(transport.flight
      ? [
          {
            mode: "Flight",
            icon: Plane,
            color: "text-crimson",
            items: [{ cls: "Economy", pp: transport.flight.economy, total: transport.flight.economy * g }],
          },
        ]
      : []),
  ];

  return (
    <div className="bg-white border border-mist">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-ivory transition-colors"
      >
        <div className="flex items-center gap-2">
          <Train size={15} className="text-teal" />
          <span className="font-sans font-semibold text-sm text-slate">
            Transport Options — {transport.km} km
          </span>
        </div>
        {open ? <ChevronUp size={14} className="text-slate/40" /> : <ChevronDown size={14} className="text-slate/40" />}
      </button>
      {open && (
        <div className="border-t border-mist overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-mist">
                <th className="font-mono text-xs text-slate/40 text-left px-5 py-3">Mode / Class</th>
                <th className="font-mono text-xs text-slate/40 text-right px-3 py-3">Per person</th>
                <th className="font-mono text-xs text-slate/40 text-right px-5 py-3">Total ({g} pax)</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ mode, color, items }) =>
                items.map((item, i) => (
                  <tr key={`${mode}-${i}`} className="border-b border-mist/50 hover:bg-ivory/50">
                    <td className="px-5 py-3">
                      {i === 0 && <span className={`font-mono text-xs ${color} mr-2`}>{mode}</span>}
                      {i > 0 && <span className="text-slate/30 text-xs mr-2">↳</span>}
                      <span className="font-sans text-xs text-slate/70">{item.cls}</span>
                    </td>
                    <td className="font-mono text-xs text-right px-3 py-3 text-slate">{format(item.pp)}</td>
                    <td className="font-mono text-xs font-semibold text-right px-5 py-3 text-slate">{format(item.total)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Hotel star comparison ─────────────────────────────────────
function HotelComparison({ hotels, nights, rooms, format }) {
  const [open, setOpen] = useState(false);
  if (!hotels?.length) return null;
  return (
    <div className="bg-white border border-mist">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-ivory transition-colors"
      >
        <div className="flex items-center gap-2">
          <Hotel size={15} className="text-saffron" />
          <span className="font-sans font-semibold text-sm text-slate">
            Hotel Options — {nights} nights, {rooms} room{rooms > 1 ? "s" : ""}
          </span>
        </div>
        {open ? <ChevronUp size={14} className="text-slate/40" /> : <ChevronDown size={14} className="text-slate/40" />}
      </button>
      {open && (
        <div className="border-t border-mist divide-y divide-mist/50">
          {hotels.map((h) => (
            <div key={h.stars} className="flex items-start justify-between px-5 py-4 hover:bg-ivory/50">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-saffron text-xs">{h.label}</span>
                  <span className="font-sans text-sm font-medium text-slate">{h.stars}★</span>
                </div>
                <p className="font-sans text-xs text-slate/40 leading-snug max-w-xs">{h.amenities}</p>
                {h.suggestions?.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="font-mono text-[0.6rem] uppercase tracking-widest text-slate/30">Example stays</p>
                    {h.suggestions.map((suggestion) => (
                      <a
                        key={`${h.stars}-${suggestion.name}`}
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${suggestion.name}, ${suggestion.area}`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="block text-xs text-slate hover:text-saffron transition-colors"
                      >
                        <span className="font-medium underline underline-offset-2">{suggestion.name}</span>
                        <span className="text-slate/40"> · {suggestion.area}</span>
                        <span className="block text-slate/40 mt-0.5">{suggestion.note}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
              <div className="text-right ml-4 flex-shrink-0">
                <p className="font-mono text-xs text-slate/40">
                  {format(h.perNight.min)}–{format(h.perNight.max)}/night
                </p>
                <p className="font-mono text-sm font-semibold text-slate">{format(h.total)} total</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Budget ring ───────────────────────────────────────────────
function BudgetRing({ total, spent, remaining, perPersonDaily, groupSize, format }) {
  const r = 52, circ = 2 * Math.PI * r;
  const pct = total > 0 ? Math.min(spent / total, 1) : 0;
  return (
    <div>
      <div className="flex items-center gap-6 mb-4">
        <div className="relative flex-shrink-0" style={{ width: 120, height: 120 }}>
          <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
            <circle cx="60" cy="60" r={r} fill="none" stroke="#D9CFC3" strokeWidth="10" />
            <circle
              cx="60"
              cy="60"
              r={r}
              fill="none"
              stroke="#E8610A"
              strokeWidth="10"
              strokeDasharray={`${pct * circ} ${circ}`}
              strokeLinecap="butt"
              style={{ transition: "stroke-dasharray 0.8s cubic-bezier(0.4,0,0.2,1)" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-[0.55rem] text-slate/35 uppercase tracking-widest">remaining</span>
            <span className="font-display font-bold text-slate leading-tight" style={{ fontSize: "1.1rem" }}>
              {format(remaining)}
            </span>
          </div>
        </div>
        <div className="flex-1 space-y-2.5">
          {[
            { label: "Total Budget", val: total, color: "bg-slate" },
            { label: "Travel + Hotel", val: spent, color: "bg-saffron" },
            { label: "Remaining", val: remaining, color: "bg-teal" },
          ].map(({ label, val, color }) => (
            <div key={label}>
              <div className="flex justify-between mb-0.5">
                <p className="font-mono text-[0.6rem] text-slate/40 uppercase tracking-widest">{label}</p>
                <p className="font-mono text-xs font-semibold text-slate">{format(val)}</p>
              </div>
              <div className="h-0.5 bg-mist">
                <div
                  className={`h-full ${color} transition-all duration-700`}
                  style={{ width: `${total > 0 ? Math.min((val || 0) / total, 1) * 100 : 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-sand/30 px-4 py-3 flex items-center justify-between">
        <p className="font-sans text-xs text-slate/50">Per person · per day</p>
        <p className="font-mono text-sm font-semibold text-slate">{format(perPersonDaily)}</p>
      </div>
      {groupSize > 1 && (
        <div className="bg-teal/5 px-4 py-2 flex items-center justify-between border-t border-mist/50">
          <p className="font-sans text-xs text-slate/50 flex items-center gap-1.5">
            <Users size={12} /> Group of {groupSize}
          </p>
          <p className="font-mono text-xs text-slate/50">{format(remaining)} remaining total</p>
        </div>
      )}
    </div>
  );
}

const SUB_PAGES = (id) => [
  { to: `/trips/${id}/wardrobe`, label: "Wardrobe", icon: Shirt },
  { to: `/trips/${id}/shop`,     label: "Shop & Compare", icon: ShoppingBag },
  { to: `/trips/${id}/journal`,  label: "Journal",  icon: BookOpen },
  { to: `/trips/${id}/expenses`, label: "Expenses", icon: DollarSign },
];

function TripPrintDocument({ trip, itinerary, transport, hotels, budget, total, format, startFmt, endFmt, nights }) {
  const wardrobeText = (advice) => {
    if (!advice) return "";
    if (typeof advice === "string") return advice;
    return [advice.outfit, advice.layer, advice.footwear, advice.styleVibe]
      .filter(Boolean)
      .join(" · ");
  };
  const groupSize = trip.group_size || 1;
  const places = itinerary.flatMap(day => day.places || []).filter(Boolean);
  const notes = itinerary.flatMap(day => [
    ...(day.activities || []).map(activity => typeof activity === "string" ? activity : activity?.name),
    day.route,
    wardrobeText(day.wardrobeAdvice),
  ]).filter(Boolean);
  const transportRows = transport ? [
    ["Train 3AC", transport.train?.["3AC"] ? `${format(transport.train["3AC"])} / person` : "—"],
    ["Bus Volvo AC", transport.bus?.["volvo-AC"] ? `${format(transport.bus["volvo-AC"])} / person` : "—"],
    ["Car", transport.car?.perPerson ? `${format(transport.car.perPerson)} / person` : "—"],
    ["Flight economy", transport.flight?.economy ? `${format(transport.flight.economy)} / person` : "Not estimated"],
  ] : [];

  return (
    <div className="print-only trip-print-document">
      <header className="trip-print-header">
        <p className="trip-print-kicker">TRIP DRIP · PERSONAL TRAVEL PLAN</p>
        <h1>{trip.destination}</h1>
        <p>{startFmt} — {endFmt} · {nights} nights · {groupSize} traveler{groupSize > 1 ? "s" : ""}</p>
      </header>

      <section>
        <h2>1. Trip Summary</h2>
        <div className="trip-print-grid">
          <p><strong>From:</strong> {trip.from_city || "Not specified"}</p>
          <p><strong>Travel style:</strong> {trip.trip_style || "Mixed"}</p>
          <p><strong>Budget:</strong> {format(total)}</p>
          <p><strong>Transport preference:</strong> {trip.preferred_transport || "Not specified"}</p>
        </div>
      </section>

      <section>
        <h2>2. Day-by-Day Itinerary</h2>
        {itinerary.map((day, index) => (
          <article className="trip-print-day" key={`${day.date || "day"}-${index}`}>
            <h3>Day {index + 1} · {day.date || "Flexible date"}{day.theme ? ` · ${day.theme}` : ""}</h3>
            <p><strong>Places:</strong> {(day.places || []).join(", ") || "Explore local highlights"}</p>
            {day.route && <p><strong>Route:</strong> {day.route}</p>}
            {day.activities?.length > 0 && <p><strong>Activities:</strong> {day.activities.map(activity => typeof activity === "string" ? activity : activity?.name).filter(Boolean).join(", ")}</p>}
            {day.foodType && <p><strong>Food:</strong> {day.foodType}</p>}
            {wardrobeText(day.wardrobeAdvice) && <p><strong>What to wear:</strong> {wardrobeText(day.wardrobeAdvice)}</p>}
          </article>
        ))}
      </section>

      <section>
        <h2>3. Transport Options</h2>
        {transportRows.length > 0 ? (
          <table><tbody>{transportRows.map(([mode, price]) => <tr key={mode}><td>{mode}</td><td>{price}</td></tr>)}</tbody></table>
        ) : <p>No transport comparison was saved for this trip.</p>}
      </section>

      <section>
        <h2>4. Hotel Suggestions</h2>
        {hotels.length > 0 ? hotels.filter(h => h.isRecommended || h.stars >= 4).map(h => (
          <div className="trip-print-hotel" key={h.stars}>
            <p><strong>{h.stars}★ {h.isRecommended ? "Recommended" : "Option"}</strong> · {format(h.total)} total · {format(h.perNight.min)}–{format(h.perNight.max)} per night</p>
            <p>{h.amenities}</p>
            {h.suggestions?.[0] && <p><strong>Example:</strong> {h.suggestions[0].name} · {h.suggestions[0].area}</p>}
          </div>
        )) : <p>No hotel suggestions were saved for this trip.</p>}
      </section>

      <section>
        <h2>8. Budget Summary</h2>
        <div className="trip-print-grid">
          <p><strong>Travel + hotel:</strong> {format(budget.travelAndHotel || 0)}</p>
          <p><strong>Remaining budget:</strong> {format(budget.remainingBudget || Math.max(0, total - (budget.travelAndHotel || 0)))}</p>
          <p><strong>Daily per person:</strong> {format(budget.perPersonDailySpend || 0)}</p>
          <p><strong>Budget tip:</strong> {budget.budgetTip || "Review prices before booking."}</p>
        </div>
      </section>

      <section>
        <h2>9. Places & Notes</h2>
        <p><strong>Places to visit:</strong> {[...new Set(places)].join(", ") || "No places saved yet."}</p>
        <p><strong>Trip notes:</strong> {[...new Set(notes)].slice(0, 12).join(" · ") || "No additional notes saved."}</p>
      </section>

      <section>
        <h2>10. Useful Information</h2>
        <div className="trip-print-grid">
          <p><strong>Emergency:</strong> 112</p>
          <p><strong>Police:</strong> 100</p>
          <p><strong>Ambulance:</strong> 108</p>
          <p><strong>Women’s helpline:</strong> 181</p>
          <p><strong>Travel reminder:</strong> Carry ID, medicines, chargers, and booking confirmations.</p>
          <p><strong>Generated:</strong> {new Date().toLocaleDateString("en-IN")}</p>
        </div>
      </section>

      <footer>Generated by Trip Drip · Verify live weather, hotel availability, transport timings, and local advisories before departure.</footer>
    </div>
  );
}

export default function TripDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { format } = useCurrency();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wardrobe, setWardrobe] = useState([]);
  const [cart, setCart] = useState([]);
  const [collaborators, setCollaborators] = useState([]);
  const [expenses, setExpenses] = useState([]);

  // Modals & Drawers
  const [cartOpen, setCartOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [hisaabOpen, setHisaabOpen] = useState(false);
  const [radarOpen, setRadarOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [compareModal, setCompareModal] = useState({
    open: false,
    category: "short_sleeve_top",
    categoryLabel: "Tops & Shirts",
    reason: "",
  });

  // Load trip, wardrobe, cart, squad, expenses
  useEffect(() => {
    async function loadData() {
      // 1. Trip
      const { data: tripData } = await supabase.from("trips").select("*").eq("id", id).single();
      if (tripData) {
        setTrip(tripData);
        cacheTripOffline(tripData);
      } else {
        const cached = await getCachedTrip(id);
        if (cached) setTrip(cached);
      }

      // 2. Wardrobe items
      if (user) {
        const { data: wData } = await supabase.from("wardrobe_items").select("*").eq("user_id", user.id);
        if (wData) setWardrobe(wData);
      }

      // 3. Cart items
      const cachedCart = await getCachedCart(id);
      if (cachedCart) setCart(cachedCart);

      // 4. Squad members
      const cachedSquad = await getCachedSquad(id);
      if (cachedSquad) setCollaborators(cachedSquad);

      // 5. Expenses for Hisaab-Kitaab
      const { data: expData } = await supabase.from("expenses").select("*").eq("trip_id", id).order("created_at", { ascending: false });
      if (expData && expData.length > 0) {
        setExpenses(expData);
      } else {
        const cachedExp = await getCachedExpenses(id);
        if (cachedExp && cachedExp.length > 0) {
          setExpenses(cachedExp);
        } else {
          const starterExp = [
            { id: "e1", trip_id: id, label: "Welcome Chai & Aram Vada Pav", amount: 240, category: "Food", paid_by: "You", created_at: new Date().toISOString() },
            { id: "e2", trip_id: id, label: "Private SUV Desert / City Transfer", amount: 2200, category: "Transport", paid_by: "Aarav", created_at: new Date().toISOString() },
            { id: "e3", trip_id: id, label: "Bhirandiyara Mawa & Kutchi Thali", amount: 1150, category: "Food", paid_by: "Sneha", created_at: new Date().toISOString() }
          ];
          setExpenses(starterExp);
          cacheExpensesOffline(id, starterExp);
        }
      }

      setLoading(false);
    }
    loadData();

    // Listen to custom events from chatbot or other tabs
    const onCartUpdated = (e) => setCart(e.detail || []);
    const onSquadUpdated = (e) => setCollaborators(e.detail || []);
    const onExpensesUpdated = (e) => setExpenses(e.detail || []);
    const onOpenRadar = () => setRadarOpen(true);
    const onOpenHisaab = () => setHisaabOpen(true);

    window.addEventListener("trip_cart_updated", onCartUpdated);
    window.addEventListener("trip_squad_updated", onSquadUpdated);
    window.addEventListener("trip_expenses_updated", onExpensesUpdated);
    window.addEventListener("open_chai_radar", onOpenRadar);
    window.addEventListener("open_hisaab_kitaab", onOpenHisaab);

    return () => {
      window.removeEventListener("trip_cart_updated", onCartUpdated);
      window.removeEventListener("trip_squad_updated", onSquadUpdated);
      window.removeEventListener("trip_expenses_updated", onExpensesUpdated);
      window.removeEventListener("open_chai_radar", onOpenRadar);
      window.removeEventListener("open_hisaab_kitaab", onOpenHisaab);
    };
  }, [id, user]);

  const handleAddExpense = async (newExp) => {
    const updated = [newExp, ...expenses];
    setExpenses(updated);
    await cacheExpensesOffline(id, updated);
    await supabase.from("expenses").insert(newExp).catch(() => {});
    window.dispatchEvent(new CustomEvent("trip_expenses_updated", { detail: updated }));
  };

  // Cart operations
  const handleAddToCart = (product) => {
    const existing = cart.find((i) => i.id === product.id);
    let updated;
    if (existing) {
      updated = cart.map((i) => (i.id === product.id ? { ...i, quantity: (i.quantity || 1) + 1 } : i));
    } else {
      updated = [...cart, { ...product, quantity: 1 }];
    }
    setCart(updated);
    cacheCartOffline(id, updated);
  };

  const handleUpdateCartQty = (itemId, qty) => {
    const updated = cart.map((i) => (i.id === itemId ? { ...i, quantity: qty } : i));
    setCart(updated);
    cacheCartOffline(id, updated);
  };

  const handleRemoveCartItem = (itemId) => {
    const updated = cart.filter((i) => i.id !== itemId);
    setCart(updated);
    cacheCartOffline(id, updated);
  };

  const handleClearCart = () => {
    setCart([]);
    cacheCartOffline(id, []);
  };

  const handleAddCollaborator = (member) => {
    const updated = [...collaborators, member];
    setCollaborators(updated);
    cacheSquadOffline(id, updated);
  };

  const openCompareModal = (category, label, reason) => {
    setCompareModal({
      open: true,
      category: category || "short_sleeve_top",
      categoryLabel: label || "Garment Category",
      reason: reason || "",
    });
  };

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-64 gap-3 text-slate/30 font-mono text-sm">
          <div className="w-4 h-4 border border-slate/20 border-t-saffron rounded-full animate-spin" />
          Loading your yatra…
        </div>
      </AppShell>
    );
  }

  if (!trip) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <MapPin size={32} className="text-mist" />
          <p className="font-display font-bold text-2xl text-slate">Trip not found.</p>
          <Link to="/trips" className="font-sans text-sm text-saffron underline">
            Back to trips
          </Link>
        </div>
      </AppShell>
    );
  }

  const rawItin = trip.itinerary_json || [];
  let itinerary = Array.isArray(rawItin) ? rawItin : (rawItin.days || []);

  if (isDuplicateOrInvalidItinerary(itinerary)) {
    const templateItin = buildTemplateItinerary(
      trip.destination,
      trip.start_date,
      trip.end_date,
      trip.total_budget,
      trip.group_size,
      trip.trip_style
    );
    itinerary = templateItin;

    // Permanently persist the repaired non-duplicate itinerary to offline storage and DB
    cacheTripOffline({ ...trip, itinerary_json: templateItin });
    supabase.from("trips").update({ itinerary_json: templateItin }).eq("id", id).catch(() => {});
  }
  const weather = trip.weather_json || {};
  const budget = weather.budget || {};
  const transport = weather.transport || null;
  const hotels = weather.hotels || [];
  const total = parseFloat(trip.total_budget) || 0;
  const spent = parseFloat(budget.travelAndHotel) || parseFloat(budget.estimatedFlightsLodging) || 0;
  const remaining = Math.max(0, total - spent);
  const rawNights = (trip.start_date && trip.end_date)
    ? Math.round((new Date(trip.end_date) - new Date(trip.start_date)) / 86400000)
    : 1;
  const nights = Math.max(1, isNaN(rawNights) ? 1 : rawNights);
  const rooms = Math.ceil((trip.group_size || 2) / 2);
  const perPersonDaily =
    (trip.group_size || 1) > 0 ? Math.round(remaining / (trip.group_size || 1) / Math.max(1, nights)) : 0;
  const destInfo = weather.destination || {};
  const coords = resolveCoordinates(trip.destination, destInfo);
  const mapLat = coords.lat;
  const mapLng = coords.lng;
  const subPages = SUB_PAGES(id);
  const startFmt = safeFormatDate(trip.start_date, { day: "numeric", month: "long" }, "Start Date");
  const endFmt = safeFormatDate(trip.end_date, { day: "numeric", month: "long", year: "numeric" }, "End Date");

  const remainingShoppingBudget = budget.remainingShoppingBudget || budget.remainingBudget || Math.round(total * 0.35) || 5000;
  const cartTotal = cart.reduce((sum, i) => sum + i.price * (i.quantity || 1), 0);
  const remainingLiveShopping = remainingShoppingBudget - cartTotal;

  // Mock or derived missing items for the trip
  const missingItems = [
    {
      category: "short_sleeve_top",
      label: "Breathable Resort Linen Shirt",
      reason: `High humidity expected (${Math.round(weather.avgHumidity || 65)}%) for ${trip.destination}. Pure linen or AIRism recommended.`,
    },
    {
      category: "shoes",
      label: "Comfort Temple & Walking Footwear",
      reason: `Slip-on canvas or cushioned loafers needed for walking through historical gates and temple steps.`,
    },
    {
      category: "long_sleeve_outwear",
      label: "UV Protection / Light Windbreaker",
      reason: `Sunny afternoons and evening breezes in ${trip.destination} benefit from packable UPF outwear.`,
    },
  ];

  return (
    <>
      <TripPrintDocument
        trip={trip}
        itinerary={itinerary}
        transport={transport}
        hotels={hotels}
        budget={budget}
        total={total}
        format={format}
        startFmt={startFmt}
        endFmt={endFmt}
        nights={nights}
      />
      <div className="screen-only">
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
        <div className="relative max-w-content mx-auto px-6 md:px-12 py-10 animate-enter">
          <Link
            to="/trips"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-sand/50 hover:text-sand mb-8 transition-colors"
          >
            <ArrowLeft size={13} /> All Trips
          </Link>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              {trip.from_city && (
                <p className="font-mono text-xs text-sand/35 mb-1 tracking-widest">{trip.from_city} →</p>
              )}
              <p className="font-mono text-xs tracking-[0.25em] uppercase text-sand/45 mb-2">
                {trip.trip_style} · {nights} nights
                {trip.group_size > 1 ? ` · Group of ${trip.group_size}` : ""}
              </p>
              <h1 className="font-display font-bold text-sand leading-none" style={{ fontSize: "clamp(2.8rem,7vw,6rem)" }}>
                {trip.destination}
              </h1>
              <p className="font-mono text-sm text-sand/40 mt-3">
                {startFmt} — {endFmt}
              </p>
            </div>

            {/* Quick Actions / Subpages */}
            <div className="flex gap-2 flex-wrap items-center">
              {subPages.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className="inline-flex items-center gap-2 px-3.5 py-2 border border-sand/20 text-sand/70 hover:border-sand hover:text-sand font-sans text-xs transition-colors"
                >
                  <Icon size={13} />
                  {label}
                </Link>
              ))}

              {/* Chai & Station Radar Button */}
              <button
                onClick={() => setRadarOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white/15 hover:bg-white/25 text-sand border border-sand/30 font-sans text-xs font-semibold transition-colors shadow-sm"
              >
                <Coffee size={13} className="text-saffron" />
                <span>Chai & Station Radar</span>
              </button>

              {/* Hisaab-Kitaab Group Split Button */}
              <button
                onClick={() => setHisaabOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-forest text-white font-sans text-xs font-semibold hover:bg-forest/90 transition-colors shadow-sm"
              >
                <IndianRupee size={13} />
                <span>Hisaab-Kitaab (UPI)</span>
              </button>

              {/* Share Squad Button */}
              <button
                onClick={() => setShareOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-saffron text-white font-sans text-xs font-semibold hover:bg-saffron/90 transition-colors shadow-sm"
              >
                <Share2 size={13} />
                <span>Share Squad Link</span>
              </button>

              {/* Print / PDF Action */}
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-sand text-slate font-sans text-xs font-semibold hover:bg-white transition-colors shadow-sm"
                title="Download this trip as a PDF"
              >
                <Printer size={13} />
                <span>Download Trip PDF</span>
              </button>

              {/* Shopping Cart Pill */}
              <button
                onClick={() => setCartOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate text-sand font-sans text-xs font-semibold hover:bg-slate/90 transition-colors shadow-sm"
              >
                <ShoppingBag size={13} />
                <span>Cart ({cart.reduce((c, i) => c + (i.quantity || 1), 0)})</span>
              </button>

              {/* Delete Trip Action Button */}
              <button
                onClick={() => setDeleteOpen(true)}
                title="Delete this trip"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-crimson/20 hover:bg-crimson text-sand hover:text-white border border-crimson/40 font-sans text-xs font-semibold transition-colors shadow-sm"
              >
                <Trash2 size={13} />
                <span>Delete Trip</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── BODY ──────────────────────────────────────────────── */}
      <div className="max-w-content mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-mist">
          {/* LEFT 60% — Itinerary, Missing Items, Packing Checklist */}
          <div className="lg:col-span-3 px-6 md:px-10 py-10 space-y-10">
            {/* 1. Missing Items Inline Comparison Panel */}
            <div className="bg-white border-2 border-saffron/80 p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-saffron/10 flex items-center justify-center">
                    <Sparkles size={16} className="text-saffron" />
                  </div>
                  <div>
                    <span className="font-mono text-[0.65rem] uppercase tracking-wider text-slate/40">
                      Smart Wardrobe Matching
                    </span>
                    <h3 className="font-display font-bold text-lg text-slate leading-none">
                      Missing Items & Cross-Brand Comparison
                    </h3>
                  </div>
                </div>

                <Link
                  to={`/trips/${id}/shop`}
                  className="font-mono text-xs text-saffron font-semibold hover:underline hidden sm:inline"
                >
                  Full Store Catalog →
                </Link>
              </div>

              <p className="font-sans text-xs text-slate/60 leading-relaxed">
                Based on weather ({Math.round(weather.avgTemp || 24)}°C) and your itinerary activities, we identified missing options. Compare Zara, H&M, Uniqlo, and Westside side-by-side to fit your budget.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {missingItems.map((m) => (
                  <div
                    key={m.category}
                    className="p-3.5 bg-ivory border border-mist hover:border-saffron transition-all flex flex-col justify-between"
                  >
                    <div>
                      <span className="font-mono text-[0.6rem] uppercase tracking-wider text-saffron font-semibold">
                        Missing Item
                      </span>
                      <h4 className="font-display font-semibold text-xs text-slate mt-0.5 leading-snug">
                        {m.label}
                      </h4>
                      <p className="font-sans text-[0.65rem] text-slate/50 line-clamp-2 mt-1">
                        {m.reason}
                      </p>
                    </div>
                    <button
                      onClick={() => openCompareModal(m.category, m.label, m.reason)}
                      className="mt-3 w-full py-1.5 px-2 bg-slate text-sand font-mono text-[0.65rem] font-medium hover:bg-saffron hover:text-white transition-colors text-center"
                    >
                      Compare 4 Brands
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Packing Checklist Section */}
            <div>
              <PackingChecklist
                tripId={id}
                wardrobeItems={wardrobe}
                cartItems={cart}
                destination={trip.destination}
              />
            </div>

            {/* 3. Group Collaboration Missing Gear Section (if group > 1 or squad joined) */}
            {(trip.group_size > 1 || collaborators.length > 0) && (
              <div>
                <GroupMissingItems
                  tripId={id}
                  collaborators={collaborators}
                  missingItems={missingItems}
                  onOpenCompare={openCompareModal}
                />
              </div>
            )}

            {/* 4. Executive Itinerary Matrix & Day-by-Day Yatra */}
            <div>
              {/* Executive Summary Matrix Table */}
              <ItineraryMatrix days={itinerary} trip={trip} format={format} />

              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="font-mono text-xs tracking-[0.2em] uppercase text-slate/40">Day-by-Day Yatra & AI Styling</p>
                  <h3 className="font-display font-bold text-xl text-slate">Detailed Itinerary & Wardrobe Guide</h3>
                </div>
                <span className="font-mono text-xs text-saffron font-semibold bg-saffron/10 px-3 py-1 border border-saffron/30">
                  {itinerary.length} Days Detailed
                </span>
              </div>

              {itinerary.length === 0 ? (
                <p className="font-sans text-sm text-slate/40">No itinerary yet.</p>
              ) : (
                itinerary.map((day, idx) => {
                  const dw = weather.daily?.[idx];
                  const dateLabel = safeFormatDate(
                    day.date,
                    { weekday: "long", month: "short", day: "numeric" },
                    `Day ${day.day || idx + 1}`
                  );
                  const dayTitle = day.theme || day.dayLabel || `Day ${day.day || idx + 1}`;
                  const routeStr = String(day.route || (day.places ? day.places.join(" → ") : ""));

                  return (
                    <div key={idx} className="group relative flex gap-4 sm:gap-6 mb-8 bg-white border border-mist/80 p-5 sm:p-6 shadow-xs hover:border-saffron/50 transition-all">
                      {/* Left Day Badge */}
                      <div className="flex flex-col items-center flex-shrink-0">
                        <div className="w-10 h-10 bg-saffron text-white font-mono text-xs flex items-center justify-center font-bold flex-shrink-0 shadow-xs">
                          {String(day.day || idx + 1).padStart(2, "0")}
                        </div>
                        {idx < itinerary.length - 1 && (
                          <div className="w-px flex-1 bg-mist/70 my-2 min-h-6" />
                        )}
                      </div>

                      {/* Main Day Content */}
                      <div className="flex-1 space-y-3 min-w-0">
                        {/* Header: Date + Theme + Weather */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-mist/50">
                          <div>
                            <span className="font-mono text-[0.65rem] text-slate/40 uppercase tracking-widest block">
                              {dateLabel}
                            </span>
                            <h4 className="font-display font-bold text-base sm:text-lg text-slate leading-tight mt-0.5">
                              {day.dayLabel ? `${day.dayLabel}: ` : ""}{dayTitle}
                            </h4>
                          </div>

                          <div className="flex items-center gap-3">
                            {day.groupBudget && (
                              <span className="font-mono text-xs bg-ivory border border-mist px-2.5 py-1 text-slate font-semibold">
                                ₹{day.groupBudget.toLocaleString("en-IN")} group
                                {day.perPersonBudget && ` · ₹${day.perPersonBudget}/pp`}
                              </span>
                            )}
                            {dw && (
                              <div className="flex items-center gap-1 font-mono text-xs text-slate/45 bg-sand/20 px-2 py-1">
                                <WeatherIcon code={dw.weather_code} size={13} />
                                <span>{Math.round(dw.temperature_2m_max)}°/{Math.round(dw.temperature_2m_min)}°C</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Route Ribbon */}
                        {routeStr && (
                          <div className="py-1">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="font-mono text-[0.65rem] uppercase tracking-wider text-slate/40 mr-1">
                                Route:
                              </span>
                              {routeStr.split("→").map((seg, sIdx, arr) => (
                                <Fragment key={sIdx}>
                                  <span className="bg-sand/30 border border-sand px-2 py-0.5 text-xs font-sans text-slate/80 font-medium">
                                    {seg.trim()}
                                  </span>
                                  {sIdx < arr.length - 1 && (
                                    <span className="text-saffron font-bold text-xs">→</span>
                                  )}
                                </Fragment>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Transport & Food Tags */}
                        {(day.transport || day.foodType) && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-ivory/50 p-2.5 border border-mist/40">
                            {day.transport && (
                              <p className="text-slate/70 font-sans">
                                <strong className="font-mono font-normal text-slate/45 uppercase text-[0.65rem] mr-1">🚆 Transit:</strong>
                                {day.transport}
                              </p>
                            )}
                            {day.foodType && (
                              <p className="text-slate/70 font-sans">
                                <strong className="font-mono font-normal text-slate/45 uppercase text-[0.65rem] mr-1">🍴 Eats:</strong>
                                {day.foodType}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Activities List */}
                        <div className="space-y-2 pt-1">
                          {(day.activities || []).map((act, ai) => (
                            <div key={ai} className="flex gap-2.5 text-slate/75 text-sm leading-relaxed">
                              <div className="w-1.5 h-1.5 rounded-full bg-saffron mt-2 flex-shrink-0" />
                              <p className="font-sans">{act}</p>
                            </div>
                          ))}
                        </div>

                        {/* AI Generative Wardrobe Advice */}
                        <DayWardrobeCard
                          wardrobeAdvice={day.wardrobeAdvice}
                          weatherInfo={dw}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* RIGHT 40% — Weather, Budget, Transport, Hotels, Map, Quick Links */}
          <div className="lg:col-span-2 px-6 md:px-8 py-10 space-y-8">
            {/* Weather */}
            {weather.avgTemp !== undefined && (
              <div>
                <p className="font-mono text-xs tracking-[0.2em] uppercase text-slate/30 mb-4">Weather</p>
                <div className="bg-white border border-mist p-5 flex items-center gap-4">
                  <WeatherIcon code={weather.dominantCode ?? 0} size={32} />
                  <div>
                    <p className="font-display font-bold text-slate" style={{ fontSize: "2rem", lineHeight: 1 }}>
                      {Math.round(weather.avgTemp)}°C
                    </p>
                    <p className="font-mono text-xs text-slate/40 mt-1">
                      {Math.round(weather.minTemp ?? weather.avgTemp - 4)}°–
                      {Math.round(weather.maxTemp ?? weather.avgTemp + 4)}°C
                      {weather.avgHumidity ? ` · ${Math.round(weather.avgHumidity)}% humid` : ""}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Mandala divider */}
            <div className="mandala-divider">
              <span>❁</span>
            </div>

            {/* Budget */}
            {total > 0 && (
              <div>
                <p className="font-mono text-xs tracking-[0.2em] uppercase text-slate/30 mb-4">Budget Overview</p>
                <BudgetRing
                  total={total}
                  spent={spent}
                  remaining={remaining}
                  perPersonDaily={perPersonDaily}
                  groupSize={trip.group_size || 1}
                  format={format}
                />
                {budget.budgetTip && (
                  <p className="font-mono text-[0.65rem] text-slate/30 mt-3 leading-relaxed">{budget.budgetTip}</p>
                )}
              </div>
            )}

            {/* Transport comparison */}
            {transport && (
              <>
                <div className="mandala-divider">
                  <span>❁</span>
                </div>
                <div>
                  <p className="font-mono text-xs tracking-[0.2em] uppercase text-slate/30 mb-4">Transport Comparison</p>
                  <TransportTable transport={transport} groupSize={trip.group_size || 1} format={format} />
                </div>
              </>
            )}

            {/* Hotel comparison */}
            {hotels.length > 0 && (
              <>
                <div className="mandala-divider">
                  <span>❁</span>
                </div>
                <div>
                  <p className="font-mono text-xs tracking-[0.2em] uppercase text-slate/30 mb-4">Hotel Comparison</p>
                  <HotelComparison hotels={hotels} nights={nights} rooms={rooms} format={format} />
                </div>
              </>
            )}

            {/* Map */}
            <div className="mandala-divider">
              <span>❁</span>
            </div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="font-mono text-xs tracking-[0.2em] uppercase text-slate/30">Interactive Map</p>
                <span className="font-mono text-[0.6rem] text-slate/25">OpenStreetMap · offline cached</span>
              </div>
              <TripMap
                destination={trip.destination}
                lat={mapLat}
                lng={mapLng}
                itinerary={itinerary}
                className="w-full h-56"
              />
            </div>

            {/* Transit Intelligence Features */}
            <div className="mandala-divider">
              <span>❁</span>
            </div>
            <div className="space-y-3">
              <p className="font-mono text-xs tracking-[0.2em] uppercase text-slate/30">Transit Intelligence</p>
              
              {/* Chai & Station Radar Card */}
              <div
                onClick={() => setRadarOpen(true)}
                className="cursor-pointer group p-4 bg-gradient-to-br from-amber-50 to-orange-50/40 border border-saffron/30 hover:border-saffron transition-all shadow-xs"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-[0.62rem] font-bold text-saffron uppercase tracking-widest flex items-center gap-1.5">
                    <Coffee size={12} />
                    Chai & Station Radar
                  </span>
                  <span className="text-[0.65rem] font-mono text-slate/40 group-hover:text-saffron transition-colors">
                    Explore →
                  </span>
                </div>
                <h5 className="font-display font-semibold text-sm text-slate group-hover:text-saffron transition-colors">
                  Highway Dhabas & Railway Bites
                </h5>
                <p className="font-sans text-xs text-slate/60 mt-1 leading-relaxed">
                  Iconic station food, authentic cutting/kulhad chai, and verified hygiene halts for {trip.destination}.
                </p>
              </div>

              {/* Hisaab-Kitaab Card */}
              <div
                onClick={() => setHisaabOpen(true)}
                className="cursor-pointer group p-4 bg-gradient-to-br from-emerald-50 to-teal-50/40 border border-forest/30 hover:border-forest transition-all shadow-xs"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-[0.62rem] font-bold text-forest uppercase tracking-widest flex items-center gap-1.5">
                    <IndianRupee size={12} />
                    Hisaab-Kitaab
                  </span>
                  <span className="text-[0.65rem] font-mono text-slate/40 group-hover:text-forest transition-colors">
                    Settle →
                  </span>
                </div>
                <h5 className="font-display font-semibold text-sm text-slate group-hover:text-forest transition-colors">
                  Squad Ledger & Instant UPI
                </h5>
                <p className="font-sans text-xs text-slate/60 mt-1 leading-relaxed">
                  Minimum-transaction debt solver with GPay/PhonePe QR codes and 1-tap WhatsApp summary share.
                </p>
              </div>
            </div>

            {/* Quick Subpages Navigation */}
            <div className="mandala-divider">
              <span>❁</span>
            </div>
            <div className="space-y-1.5">
              {subPages.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className="group flex items-center justify-between px-4 py-3 border border-mist hover:border-saffron font-sans text-sm text-slate/60 hover:text-saffron transition-colors bg-white"
                >
                  <div className="flex items-center gap-3">
                    <Icon size={15} />
                    <span>{label}</span>
                  </div>
                  <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform text-slate/30" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Brand Comparison Modal */}
      <BrandComparisonModal
        open={compareModal.open}
        onClose={() => setCompareModal((prev) => ({ ...prev, open: false }))}
        category={compareModal.category}
        categoryLabel={compareModal.categoryLabel}
        reason={compareModal.reason}
        remainingShoppingBudget={remainingLiveShopping}
        onAddToCart={handleAddToCart}
        cart={cart}
      />

      {/* Shopping Cart Drawer */}
      <ShoppingCartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        shoppingBudget={remainingShoppingBudget}
      />

      {/* Squad Collaboration Modal */}
      <GroupCollaborationModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        trip={trip}
        collaborators={collaborators}
        onAddCollaborator={handleAddCollaborator}
      />

      {/* Hisaab-Kitaab Modal */}
      <HisaabKitaabModal
        isOpen={hisaabOpen}
        onClose={() => setHisaabOpen(false)}
        tripDestination={trip.destination}
        groupSize={trip.group_size || 5}
        expenses={expenses}
        onAddExpense={handleAddExpense}
      />

      {/* Chai & Station Radar Modal */}
      <ChaiStationRadarModal
        isOpen={radarOpen}
        onClose={() => setRadarOpen(false)}
        destination={trip.destination}
      />

      {/* Delete Trip Confirmation Modal */}
      {deleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-enter">
          <div className="bg-white border-2 border-crimson max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setDeleteOpen(false)}
              className="absolute top-4 right-4 text-slate/40 hover:text-slate transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 text-crimson mb-3">
              <div className="w-10 h-10 bg-crimson/10 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={20} className="text-crimson" />
              </div>
              <h3 className="font-display font-bold text-lg text-slate">
                Delete Yatra to {trip?.destination}?
              </h3>
            </div>

            <p className="font-sans text-xs text-slate/70 leading-relaxed mb-6">
              This action cannot be undone. It will permanently remove this trip, its executive itinerary, wardrobe suggestions, expenses, and diary memories from both your device and cloud storage.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-mist">
              <button
                type="button"
                onClick={() => setDeleteOpen(false)}
                disabled={deleting}
                className="px-4 py-2 border border-mist text-slate font-sans text-xs font-semibold hover:bg-ivory transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  setDeleting(true);
                  try {
                    await deleteCachedTrip(id);
                    await Promise.allSettled([
                      supabase.from("trips").delete().eq("id", id),
                      supabase.from("expenses").delete().eq("trip_id", id),
                      supabase.from("journal_entries").delete().eq("trip_id", id),
                      supabase.from("chat_messages").delete().eq("trip_id", id),
                    ]);
                    navigate("/trips");
                  } catch (err) {
                    console.error("Failed to delete trip:", err);
                    navigate("/trips");
                  }
                }}
                disabled={deleting}
                className="px-4 py-2 bg-crimson text-white font-sans text-xs font-semibold hover:bg-crimson/90 transition-colors flex items-center gap-2 shadow-sm"
              >
                {deleting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Deleting…</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={13} />
                    <span>Yes, Delete Trip</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      </AppShell>
      </div>
    </>
  );
}