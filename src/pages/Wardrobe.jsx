import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft, Upload, X, Trash2, Star, Palette,
  Filter, AlertCircle, CheckCircle2, Loader2, RefreshCw,
  Sparkles, Shirt, Compass
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../contexts/AuthContext";
import AppShell from "../components/layout/AppShell";
import DayWardrobeCard from "../components/itinerary/DayWardrobeCard";
import { buildTemplateItinerary, isDuplicateOrInvalidItinerary } from "../data/indiaItineraries";
import { getCachedTrip } from "../services/offlineStorage";

const DF2_CATEGORIES = {
  short_sleeve_top:"Short-Sleeve Top", long_sleeve_top:"Long-Sleeve Top",
  short_sleeve_outwear:"Short-Sleeve Jacket", long_sleeve_outwear:"Coat / Jacket",
  vest:"Vest", sling:"Cami / Sling", shorts:"Shorts", trousers:"Trousers",
  skirt:"Skirt", short_sleeve_dress:"Short-Sleeve Dress", long_sleeve_dress:"Long-Sleeve Dress",
  vest_dress:"Vest Dress", sling_dress:"Sling Dress",
  shoes:"Shoes", bag:"Bag", hat:"Hat", accessories:"Accessories",
};

const FILTERS = ["all", ...Object.keys(DF2_CATEGORIES)];

function ScoreRing({ score }) {
  if (score == null) return null;
  const r   = 14, c = 2 * Math.PI * r;
  const pct = score / 10;
  const color = score >= 7 ? "#006E6D" : score >= 4 ? "#E8610A" : "#B5281C";
  return (
    <div className="relative w-10 h-10 flex-shrink-0">
      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
        <circle cx="18" cy="18" r={r} fill="none" stroke="#D9CFC3" strokeWidth="3" />
        <circle cx="18" cy="18" r={r} fill="none" stroke={color} strokeWidth="3"
          strokeDasharray={`${pct*c} ${c}`} strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-mono text-[0.6rem] font-bold text-slate">{score}</span>
      </div>
    </div>
  );
}

function GarmentCard({ item, onDelete, onScore, onColorMatch, tripId }) {
  const [showNote, setShowNote]   = useState(false);
  const [scoring, setScoring]     = useState(false);
  const [matching, setMatching]   = useState(false);
  const [matches, setMatches]     = useState(null);

  async function handleScore() {
    setScoring(true);
    try {
      const tripRes = await supabase.from("trips").select("*").eq("id", tripId).single();
      const r = await fetch("/api/suitability-score", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: item.id, userId: item.user_id, trip: tripRes.data }),
      });
      const d = await r.json();
      onScore(item.id, d.score, d.note);
    } catch (e) { console.error(e); }
    setScoring(false);
  }

  async function handleColorMatch() {
    setMatching(true);
    try {
      const r = await fetch("/api/color-match", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: item.id, userId: item.user_id }),
      });
      const d = await r.json();
      setMatches(d.matches || []);
    } catch { setMatches([]); }
    setMatching(false);
  }

  return (
    <div className="group bg-white border border-mist flex flex-col hover:border-saffron transition-colors">
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-ivory">
        <img src={item.image_url} alt={DF2_CATEGORIES[item.category] || item.category}
          className="w-full h-full object-cover" loading="lazy" />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-slate/30 transition-opacity duration-200 flex items-end justify-end p-2 gap-1.5 opacity-0 group-hover:opacity-100">
          <button onClick={handleScore} disabled={scoring} title="Score for this trip"
            className="w-7 h-7 bg-white flex items-center justify-center hover:bg-saffron hover:text-white transition-colors shadow-xs">
            {scoring ? <Loader2 size={12} className="animate-spin text-slate" /> : <Star size={12} className="text-slate" />}
          </button>
          <button onClick={handleColorMatch} disabled={matching} title="Find color matches"
            className="w-7 h-7 bg-white flex items-center justify-center hover:bg-teal hover:text-white transition-colors shadow-xs">
            {matching ? <Loader2 size={12} className="animate-spin text-slate" /> : <Palette size={12} className="text-slate" />}
          </button>
          <button onClick={() => onDelete(item.id)} title="Delete"
            className="w-7 h-7 bg-white flex items-center justify-center hover:bg-crimson hover:text-white transition-colors shadow-xs">
            <Trash2 size={12} className="text-crimson" />
          </button>
        </div>

        {/* Score badge */}
        {item.suitability_score != null && (
          <div className="absolute top-2 left-2"
            onMouseEnter={() => setShowNote(true)} onMouseLeave={() => setShowNote(false)}>
            <ScoreRing score={item.suitability_score} />
            {showNote && item.suitability_note && (
              <div className="absolute left-12 top-0 w-48 bg-slate text-sand font-sans text-xs p-2.5 leading-snug z-10 shadow-lg border border-sand/30">
                {item.suitability_note}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="px-3 py-2.5">
        <p className="font-mono text-[0.65rem] uppercase tracking-wider text-slate/40 mb-0.5">
          {DF2_CATEGORIES[item.category] || item.category}
        </p>
        <p className="font-sans text-sm font-semibold text-slate capitalize leading-tight">{item.color || "—"}</p>
      </div>

      {/* Color matches */}
      {matches !== null && (
        <div className="border-t border-mist px-3 py-2 bg-sand/10">
          {matches.length === 0
            ? <p className="font-mono text-[0.65rem] text-slate/40">No matches in wardrobe yet.</p>
            : (
              <>
                <p className="font-mono text-[0.6rem] uppercase tracking-wider text-slate/40 mb-1.5">Pairs with</p>
                <div className="flex gap-1.5">
                  {matches.slice(0,3).map(m => (
                    <div key={m.id} title={m.rationale} className="w-10 h-10 overflow-hidden border border-mist">
                      <img src={m.image_url} alt={m.category} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </>
            )
          }
        </div>
      )}
    </div>
  );
}

// ── Upload drop zone ──────────────────────────────────────────────
function UploadZone({ onUpload, uploading }) {
  const inputRef  = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [preview,  setPreview]  = useState(null);
  const [pending,  setPending]  = useState(null);
  const [category, setCategory] = useState("");

  function handleFile(file) {
    if (!file || !file.type.startsWith("image/")) return;
    setPending(file);
    const reader = new FileReader();
    reader.onload = e => setPreview(e.target.result);
    reader.readAsDataURL(file);
  }

  async function confirmUpload() {
    if (!pending) return;
    const reader = new FileReader();
    reader.onload = async e => {
      const base64 = e.target.result.split(",")[1];
      await onUpload(base64, pending.type, category || undefined);
      setPreview(null); setPending(null); setCategory("");
    };
    reader.readAsDataURL(pending);
  }

  function cancel() { setPreview(null); setPending(null); setCategory(""); }

  const onDrop = useCallback(e => {
    e.preventDefault(); setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }, []);

  if (preview) {
    return (
      <div className="border-2 border-saffron bg-white p-6 flex flex-col sm:flex-row gap-6 items-start animate-enter shadow-md">
        <div className="w-32 h-40 overflow-hidden border border-mist flex-shrink-0">
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 space-y-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-slate/40 mb-1.5">Category Override (optional)</p>
            <p className="font-sans text-xs text-slate/40 mb-2">Leave blank for AI auto-detection.</p>
            <select value={category} onChange={e => setCategory(e.target.value)}
              className="w-full border border-mist bg-ivory px-3 py-2.5 font-sans text-sm text-slate focus:outline-none focus:border-saffron">
              <option value="">Auto-detect category</option>
              {Object.entries(DF2_CATEGORIES).map(([k,v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3">
            <button onClick={confirmUpload} disabled={uploading}
              className="flex items-center gap-2 bg-saffron text-white px-6 py-2.5 font-sans font-semibold text-sm hover:bg-saffron/90 transition-colors disabled:opacity-50 shadow-sm">
              {uploading ? <><Loader2 size={16} className="animate-spin" /> Uploading…</> : <>Upload Garment</>}
            </button>
            <button onClick={cancel}
              className="flex items-center gap-2 border border-mist px-6 py-2.5 font-sans text-sm text-slate/60 hover:text-slate">
              <X size={14} /> Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
      className={[
        "border-2 border-dashed cursor-pointer transition-colors duration-150 py-16 flex flex-col items-center gap-4 bg-white",
        dragging ? "border-saffron bg-saffron/5" : "border-mist hover:border-saffron/50",
      ].join(" ")}
    >
      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={e => handleFile(e.target.files[0])} />
      <div className="w-12 h-12 bg-saffron/10 border border-saffron/20 flex items-center justify-center">
        <Upload size={22} className="text-saffron" />
      </div>
      <div className="text-center">
        <p className="font-display font-semibold text-2xl text-slate mb-1">Drop a garment photo</p>
        <p className="font-sans text-sm text-slate/40">or click to browse · JPG, PNG, WEBP</p>
        <p className="font-mono text-xs text-slate/30 mt-2 tracking-wide">
          AI detects category, color, fabric, and scores suitability
        </p>
      </div>
    </div>
  );
}

// ── Main Wardrobe page ────────────────────────────────────────────
export default function Wardrobe() {
  const { id: tripId } = useParams();
  const { user }       = useAuth();

  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [uploading, setUploading] = useState(false);
  const [filter, setFilter]     = useState("all");
  const [uploadMsg, setUploadMsg] = useState(null); // {type:"success"|"error", text}
  const [trip, setTrip]         = useState(null);

  useEffect(() => {
    supabase.from("wardrobe_items")
      .select("*").eq("user_id", user.id).order("created_at", { ascending: false })
      .then(({ data }) => { setItems(data || []); setLoading(false); });

    if (tripId) {
      supabase.from("trips").select("*").eq("id", tripId).single().then(({ data }) => {
        if (data) setTrip(data);
        else getCachedTrip(tripId).then(ct => { if (ct) setTrip(ct); });
      });
    }
  }, [user, tripId]);

  async function handleUpload(base64, mimeType, category) {
    setUploading(true); setUploadMsg(null);
    try {
      const r = await fetch("/api/upload-garment", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64, mimeType, userId: user.id, category }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Upload failed");
      setItems(prev => [d.item, ...prev]);
      setUploadMsg({ type: "success", text: `Uploaded: ${d.categoryLabel}${d.needsKeyForDetection ? " (add OPENAI_API_KEY for auto-detection)" : ""}` });
    } catch (e) {
      setUploadMsg({ type: "error", text: e.message });
    } finally { setUploading(false); }
  }

  async function handleDelete(id) {
    await supabase.from("wardrobe_items").delete().eq("id", id);
    setItems(prev => prev.filter(i => i.id !== id));
  }

  function handleScore(id, score, note) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, suitability_score: score, suitability_note: note } : i));
  }

  const filtered = filter === "all" ? items : items.filter(i => i.category === filter);
  const catCounts = items.reduce((acc, i) => { acc[i.category] = (acc[i.category]||0)+1; return acc; }, {});

  const rawItin = trip?.itinerary_json || [];
  let tripItineraryDays = Array.isArray(rawItin) ? rawItin : (rawItin.days || []);
  if (trip && isDuplicateOrInvalidItinerary(tripItineraryDays)) {
    const templ = buildTemplateItinerary(
      trip.destination,
      trip.start_date,
      trip.end_date,
      trip.total_budget,
      trip.group_size,
      trip.trip_style
    );
    tripItineraryDays = templ;
  }

  return (
    <AppShell>
      {/* ── Hero ─────────────────────────────────────────── */}
      <div className="bg-teal geo-border-top relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage:"radial-gradient(circle at 50% 50%,#E8D5A8 1px,transparent 1px)", backgroundSize:"24px 24px" }} />
        <div className="relative max-w-content mx-auto px-6 md:px-12 py-10 animate-enter">
          <Link to={`/trips/${tripId}`}
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-sand/50 hover:text-sand mb-8 transition-colors">
            <ArrowLeft size={13} /> Trip Dashboard
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs tracking-[0.25em] uppercase text-sand/45 mb-2">
                Wardrobe — {items.length} items
              </p>
              <h1 className="font-display font-bold text-sand leading-none"
                style={{ fontSize: "clamp(3rem,7vw,6rem)" }}>
                Your Wardrobe
              </h1>
            </div>
            <p className="font-sans text-sm text-sand/60 max-w-xs text-right">
              Upload garments. AI scores each piece for this trip's weather and itinerary activities.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-content mx-auto px-6 md:px-12 py-10 space-y-8">

        {/* AI Generative Styling Guide for the Trip */}
        {trip && tripItineraryDays.length > 0 && (
          <div className="bg-white border-2 border-saffron/70 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-saffron/10 flex items-center justify-center text-saffron">
                  <Sparkles size={16} />
                </div>
                <div>
                  <span className="font-mono text-[0.65rem] uppercase tracking-wider text-slate/40">
                    Trip Stylist · AI Outfits
                  </span>
                  <h3 className="font-display font-bold text-lg text-slate leading-none">
                    Daily Outfit & Layering Guide for {trip.destination}
                  </h3>
                </div>
              </div>
              <Link
                to={`/trips/${tripId}`}
                className="font-mono text-xs text-saffron hover:underline hidden sm:inline font-semibold"
              >
                View Itinerary Matrix →
              </Link>
            </div>

            <p className="font-sans text-xs text-slate/60 leading-relaxed">
              AI-generated outfit recommendations tailored specifically for {trip.destination}'s climate, humidity, and sequenced daily activities. Match or upload corresponding pieces in your wardrobe below.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
              {tripItineraryDays.map((day, dIdx) => (
                <div key={dIdx} className="bg-ivory/70 border border-mist/80 p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-1.5 border-b border-mist/50 mb-2">
                      <span className="font-display font-bold text-sm text-slate">
                        {day.dayLabel || `Day ${day.day || dIdx + 1}`}
                      </span>
                      <span className="font-mono text-[0.65rem] text-slate/50 truncate max-w-[50%]">
                        {day.theme || "Sightseeing"}
                      </span>
                    </div>
                    {day.route && (
                      <p className="font-mono text-[0.65rem] text-saffron/90 mb-2 line-clamp-1">
                        {day.route}
                      </p>
                    )}
                    <DayWardrobeCard wardrobeAdvice={day.wardrobeAdvice} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload zone */}
        <UploadZone onUpload={handleUpload} uploading={uploading} />

        {/* Upload feedback */}
        {uploadMsg && (
          <div className={[
            "flex items-center gap-3 px-5 py-3 font-sans text-sm animate-enter",
            uploadMsg.type === "success" ? "bg-forest/10 border border-forest/20 text-forest" : "bg-crimson/10 border border-crimson/20 text-crimson"
          ].join(" ")}>
            {uploadMsg.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{uploadMsg.text}</span>
            <button onClick={() => setUploadMsg(null)} className="ml-auto"><X size={14} /></button>
          </div>
        )}

        {/* Category filter */}
        {items.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`font-mono text-xs px-3 py-1.5 border transition-colors ${filter==="all" ? "bg-slate text-sand border-slate font-bold" : "bg-white border-mist text-slate/60 hover:border-slate/30"}`}>
              All ({items.length})
            </button>
            {Object.entries(catCounts).map(([cat, count]) => (
              <button key={cat} onClick={() => setFilter(cat)}
                className={`font-mono text-xs px-3 py-1.5 border transition-colors ${filter===cat ? "bg-teal text-sand border-teal font-bold" : "bg-white border-mist text-slate/60 hover:border-slate/30"}`}>
                {DF2_CATEGORIES[cat] || cat} ({count})
              </button>
            ))}
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="flex items-center gap-3 text-slate/40 font-mono text-sm py-16">
            <div className="w-4 h-4 border border-slate/20 border-t-saffron rounded-full animate-spin" />
            Loading wardrobe…
          </div>
        ) : items.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-mist bg-white">
            <p className="font-display font-semibold text-3xl text-slate mb-2">Empty wardrobe</p>
            <p className="font-sans text-sm text-slate/40">Upload your first garment above to get started.</p>
          </div>
        ) : filtered.length === 0 ? (
          <p className="font-sans text-sm text-slate/40 py-8">No items in this category.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filtered.map(item => (
              <GarmentCard key={item.id} item={item} tripId={tripId}
                onDelete={handleDelete} onScore={handleScore} onColorMatch={() => {}} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}