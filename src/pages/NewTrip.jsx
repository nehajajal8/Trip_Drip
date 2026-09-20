import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin, Calendar, IndianRupee, Users, Train, Bus, Car, Plane,
  ChevronDown, Search, Compass, Sparkles, CheckCircle2, TrendingUp, Info, ArrowRight
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabaseClient";
import AppShell from "../components/layout/AppShell";
import { INDIA_CITIES, calculateTransport } from "../data/indiaTransport";
import { buildTemplateItinerary, isDuplicateOrInvalidItinerary } from "../data/indiaItineraries";

const TRIP_STYLES = [
  { value:"Heritage",   label:"Heritage",    desc:"Forts, temples, history",   icon:"🏛" },
  { value:"Beach",      label:"Beach",       desc:"Coastal, water, sunsets",   icon:"🏖" },
  { value:"Mountains",  label:"Mountains",   desc:"Treks, peaks, snowfall",    icon:"⛰" },
  { value:"Spiritual",  label:"Spiritual",   desc:"Temples, ashrams, ghats",   icon:"🪔" },
  { value:"Wildlife",   label:"Wildlife",    desc:"Safaris, jungles, birds",   icon:"🌿" },
  { value:"Mixed",      label:"Mixed",       desc:"A bit of everything",       icon:"🗺" },
];

const OFFBEAT_OPTIONS = [
  { value:"mix",     label:"Mix of Both",        desc:"Iconic sights blended with local neighborhood gems", badge:"Recommended", icon:"🔀" },
  { value:"offbeat", label:"Prioritize Offbeat",  desc:"Quiet villages, hidden lagoons & non-touristy trails", badge:"Hidden Gems", icon:"🧭" },
  { value:"popular", label:"Popular Only",        desc:"Quintessential must-see landmarks & famous spots", badge:"Top Hits", icon:"🏛️" },
];

const TRANSPORT_OPTIONS = [
  { value:"train", label:"Train", icon:Train, color:"text-teal" },
  { value:"bus",   label:"Bus",   icon:Bus,   color:"text-forest" },
  { value:"car",   label:"Car",   icon:Car,   color:"text-saffron" },
  { value:"flight",label:"Flight",icon:Plane, color:"text-crimson" },
];

function CitySearch({ label, value, onChange }) {
  const [query, setQuery]   = useState(value);
  const [open,  setOpen]    = useState(false);
  const filtered = INDIA_CITIES.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.state.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 8);

  return (
    <div className="relative">
      <label className="block font-mono text-xs uppercase tracking-widest text-slate/50 mb-2">{label}</label>
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate/30" />
        <input
          value={query}
          onChange={e => { setQuery(e.target.value); onChange(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Search Indian city…"
          className="w-full pl-9 pr-4 py-3 bg-white border border-mist font-sans text-sm text-slate
                     focus:outline-none focus:border-saffron transition-colors"
        />
      </div>
      {open && filtered.length > 0 && (
        <div className="absolute z-30 top-full left-0 right-0 bg-white border border-mist shadow-lg max-h-52 overflow-y-auto">
          {filtered.map(city => (
            <button key={city.name} type="button"
              onMouseDown={() => { setQuery(city.name); onChange(city.name); setOpen(false); }}
              className="w-full text-left px-4 py-3 hover:bg-ivory font-sans text-sm flex items-center justify-between border-b border-mist/50 last:border-0">
              <div>
                <span className="font-medium text-slate">{city.name}</span>
                <span className="text-slate/40 text-xs ml-2">{city.state}</span>
              </div>
              <div className="flex gap-1 flex-wrap justify-end max-w-[60%]">
                {city.tags.slice(0,2).map(t => (
                  <span key={t} className="font-mono text-[0.6rem] bg-sand/50 px-1.5 py-0.5 text-slate/50">{t}</span>
                ))}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function NewTrip() {
  const { user }     = useAuth();
  const navigate     = useNavigate();
  const [form, setForm] = useState({
    fromCity:"", destination:"", startDate:"", endDate:"",
    totalBudget:"", groupSize:"2", tripStyle:"Mixed",
    preferredTransport:"train",
    offbeatPreference:"mix",
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const nightCount = form.startDate && form.endDate
    ? Math.max(0, Math.round((new Date(form.endDate) - new Date(form.startDate)) / 86400000))
    : 0;

  const group = Math.max(1, parseInt(form.groupSize) || 1);
  const budget = parseFloat(form.totalBudget) || 0;

  // Live transport calculation before commitment
  const liveTransport = form.fromCity && form.destination
    ? calculateTransport(form.fromCity, form.destination, group)
    : null;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.destination || !form.startDate || !form.endDate) {
      setError("Please fill destination and dates."); return;
    }
    setLoading(true); setError("");

    try {
      // Fetch itinerary + weather + budget in parallel
      const [itinRes, weatherRes, budgetRes] = await Promise.allSettled([
        fetch("/api/generate-itinerary", {
          method:"POST", headers:{"Content-Type":"application/json"},
          body: JSON.stringify({
            destination: form.destination,
            startDate: form.startDate,
            endDate: form.endDate,
            tripStyle: form.tripStyle,
            groupSize: group,
            totalBudget: budget,
            offbeatPreference: form.offbeatPreference || "mix",
          }),
        }).then(r=>r.json()).catch(()=>null),
        fetch("/api/get-weather", {
          method:"POST", headers:{"Content-Type":"application/json"},
          body: JSON.stringify({ destination:form.destination, startDate:form.startDate, endDate:form.endDate }),
        }).then(r=>r.json()).catch(()=>null),
        fetch("/api/calculate-budget", {
          method:"POST", headers:{"Content-Type":"application/json"},
          body: JSON.stringify({
            from:form.fromCity,
            destination:form.destination,
            totalBudget:budget,
            tripStyle:form.tripStyle,
            durationDays:nightCount+1,
            groupSize:group
          }),
        }).then(r=>r.json()).catch(()=>null),
      ]);

      const itinData   = itinRes.status   === "fulfilled" ? itinRes.value   : null;
      const weatherData= weatherRes.status=== "fulfilled" ? weatherRes.value: null;
      const budgetData = budgetRes.status === "fulfilled" ? budgetRes.value : null;

      const rawItinerary = itinData?.itinerary;
      const itinerary = (!rawItinerary || isDuplicateOrInvalidItinerary(rawItinerary))
        ? buildTemplateItinerary(form.destination, form.startDate, form.endDate, budget, group, form.tripStyle, form.offbeatPreference || "mix")
        : rawItinerary;

      const tripPayload = {
        user_id:         user.id,
        destination:     form.destination,
        from_city:       form.fromCity || null,
        start_date:      form.startDate,
        end_date:        form.endDate,
        total_budget:    budget,
        trip_style:      form.tripStyle,
        group_size:      group,
        preferred_transport: form.preferredTransport,
        offbeat_preference: form.offbeatPreference || "mix",
        itinerary_json:  itinerary,
        weather_json:    {
          ...weatherData,
          budget: budgetData?.summary,
          transport: budgetData?.transport || liveTransport,
          hotels: budgetData?.hotels
        },
      };

      const { data: trip, error: dbErr } = await supabase.from("trips").insert(tripPayload).select().single();
      if (dbErr) throw new Error(dbErr.message);
      navigate(`/trips/${trip.id}`);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="bg-teal geo-border-top relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage:"radial-gradient(circle at 50% 50%,#E8D5A8 1px,transparent 1px)", backgroundSize:"24px 24px" }} />
        <div className="relative max-w-content mx-auto px-6 md:px-12 py-12 animate-enter">
          <p className="font-mono text-xs tracking-[0.25em] uppercase text-sand/50 mb-2">— Plan Your Yatra —</p>
          <h1 className="font-display text-sand leading-none" style={{ fontSize:"clamp(2.5rem,6vw,5rem)" }}>
            {form.destination ? form.destination : "Where to?"}
          </h1>
          {form.destination && (
            <p className="font-mono text-sm text-sand/40 mt-2">
              {nightCount > 0 ? `${nightCount} nights · ` : ""}
              Group of {form.groupSize}
              {form.totalBudget ? ` · ₹${parseInt(form.totalBudget).toLocaleString("en-IN")}` : ""}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-content mx-auto px-6 md:px-12 py-10">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* LEFT: Main fields */}
          <div className="lg:col-span-3 space-y-7">
            <CitySearch label="From (your city)" value={form.fromCity} onChange={v => set("fromCity", v)} />
            <CitySearch label="Destination *"    value={form.destination} onChange={v => set("destination", v)} />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-xs uppercase tracking-widest text-slate/50 mb-2">From date *</label>
                <input type="date" value={form.startDate} onChange={e=>set("startDate",e.target.value)} required
                  className="w-full px-4 py-3 bg-white border border-mist font-sans text-sm text-slate focus:outline-none focus:border-saffron" />
              </div>
              <div>
                <label className="block font-mono text-xs uppercase tracking-widest text-slate/50 mb-2">To date *</label>
                <input type="date" value={form.endDate} onChange={e=>set("endDate",e.target.value)} required
                  className="w-full px-4 py-3 bg-white border border-mist font-sans text-sm text-slate focus:outline-none focus:border-saffron" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-xs uppercase tracking-widest text-slate/50 mb-2">Total budget (₹)</label>
                <div className="relative">
                  <IndianRupee size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate/40" />
                  <input type="number" value={form.totalBudget} onChange={e=>set("totalBudget",e.target.value)}
                    placeholder="e.g. 15000" min="0"
                    className="w-full pl-9 pr-4 py-3 bg-white border border-mist font-sans text-sm text-slate focus:outline-none focus:border-saffron" />
                </div>
              </div>
              <div>
                <label className="block font-mono text-xs uppercase tracking-widest text-slate/50 mb-2">Group size</label>
                <div className="relative">
                  <Users size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate/40" />
                  <input type="number" value={form.groupSize} onChange={e=>set("groupSize",e.target.value)}
                    placeholder="2" min="1" max="30"
                    className="w-full pl-9 pr-4 py-3 bg-white border border-mist font-sans text-sm text-slate focus:outline-none focus:border-saffron" />
                </div>
              </div>
            </div>

            {/* Offbeat Exploration Preference */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block font-mono text-xs uppercase tracking-widest text-slate/50">
                  Exploration Style & Vibe
                </label>
                <span className="font-mono text-[0.65rem] text-forest font-semibold uppercase tracking-wider bg-forest/10 px-2 py-0.5 rounded">
                  Offbeat Engine Active
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {OFFBEAT_OPTIONS.map(({ value, label, desc, badge, icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => set("offbeatPreference", value)}
                    className={[
                      "p-3 border-2 text-left transition-all font-sans relative",
                      form.offbeatPreference === value
                        ? "border-saffron bg-saffron/5 shadow-sm"
                        : "border-mist hover:border-slate/30 bg-white"
                    ].join(" ")}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-base">{icon}</span>
                      <span className={`font-mono text-[0.6rem] px-1.5 py-0.5 uppercase tracking-wider ${
                        form.offbeatPreference === value ? "bg-saffron text-white" : "bg-sand/60 text-slate/60"
                      }`}>
                        {badge}
                      </span>
                    </div>
                    <p className={`font-medium text-xs ${form.offbeatPreference === value ? "text-saffron" : "text-slate"}`}>
                      {label}
                    </p>
                    <p className="text-[0.7rem] text-slate/50 leading-tight mt-0.5">{desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* LIVE PRE-COMMIT TRANSPORT COMPARISON PANEL */}
            {liveTransport ? (
              <div className="bg-ivory/80 border border-mist p-4 sm:p-5 rounded-none space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-mist pb-3">
                  <div>
                    <span className="font-mono text-[0.65rem] tracking-[0.2em] uppercase text-slate/40 block">
                      Live Pre-Commit Comparison
                    </span>
                    <h3 className="font-sans font-bold text-sm text-slate flex items-center gap-2">
                      <Train size={15} className="text-teal" />
                      {form.fromCity} → {form.destination} ({liveTransport.km} km)
                    </h3>
                  </div>
                  <span className="font-mono text-xs text-forest bg-forest/10 px-2 py-1 self-start sm:self-auto">
                    {group} Traveler{group > 1 ? "s" : ""} · ₹{budget > 0 ? budget.toLocaleString("en-IN") : "0"} Total
                  </span>
                </div>

                {/* 4 Transport Modes Comparison Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* TRAIN OPTION */}
                  <div
                    onClick={() => set("preferredTransport", "train")}
                    className={[
                      "p-3.5 border-2 cursor-pointer transition-all relative flex flex-col justify-between",
                      form.preferredTransport === "train"
                        ? "border-teal bg-teal/5 shadow-sm"
                        : "border-mist bg-white hover:border-teal/40"
                    ].join(" ")}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Train size={16} className="text-teal" />
                        <span className="font-sans font-bold text-xs text-slate">Train (3AC / Sleeper)</span>
                      </div>
                      <span className="font-mono text-[0.6rem] bg-teal/15 text-teal px-1.5 py-0.5 uppercase font-semibold">
                        Best Value
                      </span>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between font-mono">
                        <span className="text-slate/50">3AC Class:</span>
                        <span className="font-semibold text-slate">₹{liveTransport.train["3AC"].toLocaleString("en-IN")} pp</span>
                      </div>
                      <div className="flex justify-between font-mono">
                        <span className="text-slate/50">Sleeper Class:</span>
                        <span className="text-slate/70">₹{liveTransport.train.sleeper.toLocaleString("en-IN")} pp</span>
                      </div>
                      <div className="flex justify-between font-mono pt-1 border-t border-mist/40 text-teal font-medium">
                        <span>Group Total (3AC):</span>
                        <span>₹{(liveTransport.train["3AC"] * group).toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                    {budget > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-mist/50 font-mono text-[0.7rem] text-forest flex items-center justify-between">
                        <span>Leaves for stay & food:</span>
                        <span className="font-bold">
                          ₹{Math.max(0, budget - (liveTransport.train["3AC"] * group)).toLocaleString("en-IN")}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* BUS OPTION */}
                  <div
                    onClick={() => set("preferredTransport", "bus")}
                    className={[
                      "p-3.5 border-2 cursor-pointer transition-all relative flex flex-col justify-between",
                      form.preferredTransport === "bus"
                        ? "border-forest bg-forest/5 shadow-sm"
                        : "border-mist bg-white hover:border-forest/40"
                    ].join(" ")}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Bus size={16} className="text-forest" />
                        <span className="font-sans font-bold text-xs text-slate">Bus (Volvo AC)</span>
                      </div>
                      <span className="font-mono text-[0.6rem] bg-forest/15 text-forest px-1.5 py-0.5 uppercase font-semibold">
                        Overnight
                      </span>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between font-mono">
                        <span className="text-slate/50">Volvo AC:</span>
                        <span className="font-semibold text-slate">₹{liveTransport.bus["volvo-AC"].toLocaleString("en-IN")} pp</span>
                      </div>
                      <div className="flex justify-between font-mono">
                        <span className="text-slate/50">Semi-Deluxe:</span>
                        <span className="text-slate/70">₹{liveTransport.bus["semi-deluxe"].toLocaleString("en-IN")} pp</span>
                      </div>
                      <div className="flex justify-between font-mono pt-1 border-t border-mist/40 text-forest font-medium">
                        <span>Group Total:</span>
                        <span>₹{(liveTransport.bus["volvo-AC"] * group).toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                    {budget > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-mist/50 font-mono text-[0.7rem] text-forest flex items-center justify-between">
                        <span>Leaves for stay & food:</span>
                        <span className="font-bold">
                          ₹{Math.max(0, budget - (liveTransport.bus["volvo-AC"] * group)).toLocaleString("en-IN")}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* CAR OPTION */}
                  <div
                    onClick={() => set("preferredTransport", "car")}
                    className={[
                      "p-3.5 border-2 cursor-pointer transition-all relative flex flex-col justify-between",
                      form.preferredTransport === "car"
                        ? "border-saffron bg-saffron/5 shadow-sm"
                        : "border-mist bg-white hover:border-saffron/40"
                    ].join(" ")}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Car size={16} className="text-saffron" />
                        <span className="font-sans font-bold text-xs text-slate">Road Trip / Car</span>
                      </div>
                      <span className="font-mono text-[0.6rem] bg-saffron/15 text-saffron px-1.5 py-0.5 uppercase font-semibold">
                        Self-Drive / Taxi
                      </span>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between font-mono">
                        <span className="text-slate/50">Fuel + Toll:</span>
                        <span className="text-slate/70">₹{liveTransport.car.fuel} + ₹{liveTransport.car.toll}</span>
                      </div>
                      <div className="flex justify-between font-mono">
                        <span className="text-slate/50">Split pp:</span>
                        <span className="font-semibold text-slate">₹{liveTransport.car.perPerson.toLocaleString("en-IN")} pp</span>
                      </div>
                      <div className="flex justify-between font-mono pt-1 border-t border-mist/40 text-saffron font-medium">
                        <span>Group Total:</span>
                        <span>₹{liveTransport.car.total.toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                    {budget > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-mist/50 font-mono text-[0.7rem] text-forest flex items-center justify-between">
                        <span>Leaves for stay & food:</span>
                        <span className="font-bold">
                          ₹{Math.max(0, budget - liveTransport.car.total).toLocaleString("en-IN")}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* FLIGHT OPTION */}
                  <div
                    onClick={() => liveTransport.flight && set("preferredTransport", "flight")}
                    className={[
                      "p-3.5 border-2 transition-all relative flex flex-col justify-between",
                      liveTransport.flight ? "cursor-pointer" : "opacity-60 cursor-not-allowed",
                      form.preferredTransport === "flight"
                        ? "border-crimson bg-crimson/5 shadow-sm"
                        : "border-mist bg-white hover:border-crimson/40"
                    ].join(" ")}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Plane size={16} className="text-crimson" />
                        <span className="font-sans font-bold text-xs text-slate">Flight</span>
                      </div>
                      <span className="font-mono text-[0.6rem] bg-crimson/15 text-crimson px-1.5 py-0.5 uppercase font-semibold">
                        {liveTransport.flight ? "Fastest" : "N/A (<300km)"}
                      </span>
                    </div>
                    {liveTransport.flight ? (
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between font-mono">
                          <span className="text-slate/50">Economy:</span>
                          <span className="font-semibold text-slate">₹{liveTransport.flight.economy.toLocaleString("en-IN")} pp</span>
                        </div>
                        <div className="flex justify-between font-mono pt-1 border-t border-mist/40 text-crimson font-medium">
                          <span>Group Total:</span>
                          <span>₹{(liveTransport.flight.economy * group).toLocaleString("en-IN")}</span>
                        </div>
                        {budget > 0 && (
                          <div className="mt-2.5 pt-2 border-t border-mist/50 font-mono text-[0.7rem] flex items-center justify-between">
                            <span className="text-slate/50">Leaves for stay:</span>
                            <span className={budget - (liveTransport.flight.economy * group) < 0 ? "text-crimson font-bold" : "text-forest font-bold"}>
                              ₹{Math.max(0, budget - (liveTransport.flight.economy * group)).toLocaleString("en-IN")}
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-[0.7rem] text-slate/40 leading-relaxed italic mt-1">
                        Short corridor under 300 km — scenic rail or road trip is significantly faster and greener.
                      </p>
                    )}
                  </div>
                </div>

                {/* Insight banner comparing car vs train vs budget */}
                {budget > 0 && (
                  <div className="bg-sand/30 border-l-2 border-teal p-3 text-xs font-sans text-slate/80 leading-relaxed flex items-start gap-2">
                    <Sparkles size={14} className="text-teal flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-teal block mb-0.5">Budget Trade-off Analysis:</span>
                      {liveTransport.car.total > (liveTransport.train["3AC"] * group) ? (
                        <span>
                          Choosing <strong>Train 3AC</strong> (₹{(liveTransport.train["3AC"] * group).toLocaleString("en-IN")}) saves you <strong>₹{(liveTransport.car.total - (liveTransport.train["3AC"] * group)).toLocaleString("en-IN")}</strong> compared to Car (₹{liveTransport.car.total.toLocaleString("en-IN")})—leaving more cash for heritage palace hotels, beach shacks, and shopping!
                        </span>
                      ) : (
                        <span>
                          Car/Road trip (₹{liveTransport.car.total.toLocaleString("en-IN")}) is economical for your squad of {group}, costing only ₹{liveTransport.car.perPerson.toLocaleString("en-IN")} per person.
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-sand/20 border border-dashed border-mist p-4 text-center">
                <p className="font-sans text-xs text-slate/50">
                  Select your <strong>From</strong> and <strong>Destination</strong> cities above to unlock the live cost comparison across Train, Bus, Car, and Flight!
                </p>
              </div>
            )}

            {/* Quick Transport selector pills */}
            <div>
              <label className="block font-mono text-xs uppercase tracking-widest text-slate/50 mb-3">
                Selected Mode: <span className="text-saffron font-bold capitalize">{form.preferredTransport}</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {TRANSPORT_OPTIONS.map(({ value, label, icon:Icon, color }) => (
                  <button key={value} type="button"
                    onClick={() => set("preferredTransport", value)}
                    className={[
                      "flex flex-col items-center gap-2 py-3 border-2 transition-all duration-150 font-sans text-xs font-medium",
                      form.preferredTransport === value
                        ? "border-saffron bg-saffron/5 text-saffron"
                        : "border-mist text-slate/50 hover:border-slate/30 bg-white",
                    ].join(" ")}>
                    <Icon size={16} className={form.preferredTransport===value ? "text-saffron" : color} />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Trip style */}
          <div className="lg:col-span-2 space-y-4">
            <p className="font-mono text-xs uppercase tracking-widest text-slate/50">Trip style</p>
            {TRIP_STYLES.map(({ value, label, desc, icon }) => (
              <button key={value} type="button"
                onClick={() => set("tripStyle", value)}
                className={[
                  "w-full flex items-center gap-4 px-5 py-4 border-2 text-left transition-all duration-150",
                  form.tripStyle === value
                    ? "border-saffron bg-saffron/5"
                    : "border-mist hover:border-slate/30 bg-white",
                ].join(" ")}>
                <span className="text-2xl leading-none">{icon}</span>
                <div>
                  <p className={`font-sans font-semibold text-sm ${form.tripStyle===value ? "text-saffron" : "text-slate"}`}>{label}</p>
                  <p className="font-sans text-xs text-slate/40">{desc}</p>
                </div>
              </button>
            ))}

            {error && (
              <div className="bg-crimson/8 border-l-2 border-crimson px-4 py-3 font-sans text-sm text-crimson mt-4">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-saffron text-white font-display font-bold text-xl py-5 mt-4
                         hover:bg-saffron/90 disabled:opacity-50 transition-colors duration-150
                         flex items-center justify-center gap-3">
              {loading ? (
                <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Building your yatra…</>
              ) : "Plan My Yatra →"}
            </button>
            <p className="font-mono text-xs text-slate/30 text-center">
              Itinerary generates in seconds — no OpenAI key needed
            </p>
          </div>
        </form>
      </div>
    </AppShell>
  );
}