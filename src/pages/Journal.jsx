import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft, BookOpen, Plus, Calendar, MapPin, Smile,
  Trash2, Edit3, X, Check, Save, Sparkles, Sun, CloudRain, Clock,
  Camera, Image as ImageIcon, Maximize2
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import AppShell from "../components/layout/AppShell";
import { cacheJournalOffline, getCachedJournal, cacheTripOffline, getCachedTrip } from "../services/offlineStorage";
import PhotoUploader from "../components/journal/PhotoUploader";
import PhotoLightbox from "../components/journal/PhotoLightbox";

const MOODS = [
  { label: "Wonder", emoji: "✨" },
  { label: "Peaceful", emoji: "🌅" },
  { label: "Adventurous", emoji: "⚡" },
  { label: "Relaxed", emoji: "☕" },
  { label: "Blissful", emoji: "🪔" },
  { label: "Exhausted & Happy", emoji: "🥾" },
];

function getPhotoList(entry) {
  if (Array.isArray(entry.photos) && entry.photos.length > 0) {
    return entry.photos.map((p, idx) =>
      typeof p === "string" ? { id: `p-${idx}`, url: p, caption: "" } : p
    );
  }
  if (entry.photo_url) {
    return [{ id: "p-legacy", url: entry.photo_url, caption: "" }];
  }
  return [];
}

export default function Journal() {
  const { id: tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formDate, setFormDate] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formText, setFormText] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formMood, setFormMood] = useState("Wonder");
  const [formPhotos, setFormPhotos] = useState([]);
  const [saving, setSaving] = useState(false);

  // Lightbox modal states
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxPhotos, setLightboxPhotos] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (photos, index = 0) => {
    setLightboxPhotos(photos);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  // Load trip & journal entries
  useEffect(() => {
    async function load() {
      // 1. Trip details
      const { data: tripData } = await supabase.from("trips").select("*").eq("id", tripId).single();
      if (tripData) {
        setTrip(tripData);
        cacheTripOffline(tripData);
        if (!formDate) setFormDate(tripData.start_date || new Date().toISOString().split("T")[0]);
      } else {
        const cachedT = await getCachedTrip(tripId);
        if (cachedT) {
          setTrip(cachedT);
          if (!formDate) setFormDate(cachedT.start_date || new Date().toISOString().split("T")[0]);
        }
      }

      // 2. Journal entries
      const { data: journalData } = await supabase
        .from("journal_entries")
        .select("*")
        .eq("trip_id", tripId)
        .order("date", { ascending: false });

      if (journalData && journalData.length > 0) {
        setEntries(journalData);
        cacheJournalOffline(tripId, journalData);
      } else {
        const cachedJ = await getCachedJournal(tripId);
        if (cachedJ) setEntries(cachedJ);
      }

      setLoading(false);
    }
    load();

    const handleJournalUpdate = (e) => {
      if (e.detail) setEntries(e.detail);
    };
    window.addEventListener("trip_journal_updated", handleJournalUpdate);
    return () => window.removeEventListener("trip_journal_updated", handleJournalUpdate);
  }, [tripId]);

  const resetForm = () => {
    setFormTitle("");
    setFormText("");
    setFormLocation("");
    setFormMood("Wonder");
    setFormPhotos([]);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (entry) => {
    setEditingId(entry.id);
    setFormDate(entry.date);
    setFormTitle(entry.title || "");
    setFormText(entry.text || "");
    setFormLocation(entry.location || "");
    setFormMood(entry.mood || "Wonder");
    setFormPhotos(getPhotoList(entry));
    setShowForm(true);
  };

  const handleDelete = async (entryId) => {
    const updated = entries.filter((e) => e.id !== entryId);
    setEntries(updated);
    cacheJournalOffline(tripId, updated);
    await supabase.from("journal_entries").delete().eq("id", entryId).catch(() => {});
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formText.trim()) return;
    setSaving(true);

    const payload = {
      trip_id: tripId,
      date: formDate,
      title: formTitle.trim() || `Memories of ${formDate}`,
      text: formText.trim(),
      location: formLocation.trim() || trip?.destination || "Yatra Stop",
      mood: formMood,
      photos: formPhotos,
    };

    if (editingId) {
      // Update
      const updated = entries.map((item) =>
        item.id === editingId ? { ...item, ...payload, id: editingId } : item
      );
      setEntries(updated);
      cacheJournalOffline(tripId, updated);
      await supabase.from("journal_entries").update(payload).eq("id", editingId).catch(() => {});
    } else {
      // Insert
      const newEntry = {
        ...payload,
        id: `journal-${Date.now()}`,
        created_at: new Date().toISOString(),
      };
      const updated = [newEntry, ...entries];
      setEntries(updated);
      cacheJournalOffline(tripId, updated);

      const { data } = await supabase.from("journal_entries").insert(payload).select().single().catch(() => ({ data: null }));
      if (data) {
        // replace temp ID with real DB id
        setEntries((prev) => prev.map((item) => (item.id === newEntry.id ? { ...newEntry, ...data } : item)));
      }
    }

    setSaving(false);
    resetForm();
  };

  const totalPhotosCount = entries.reduce((acc, entry) => acc + getPhotoList(entry).length, 0);

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
        <div className="relative max-w-content mx-auto px-6 md:px-12 py-10 animate-enter">
          <Link
            to={`/trips/${tripId}`}
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-sand/50 hover:text-sand mb-8 transition-colors"
          >
            <ArrowLeft size={13} /> Trip Dashboard
          </Link>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <p className="font-mono text-xs tracking-[0.25em] uppercase text-sand/45 mb-2">
                Travel Memories · {entries.length} Entries Recorded
                {totalPhotosCount > 0 && ` · ${totalPhotosCount} Photos Saved`}
              </p>
              <h1
                className="font-display font-bold text-sand leading-none"
                style={{ fontSize: "clamp(2.8rem,6vw,5.5rem)" }}
              >
                Yatra Diary
              </h1>
              <p className="font-sans text-sm text-sand/60 mt-3 max-w-xl">
                Capture the smells, street chai conversations, temple chants, and secret spots across {trip?.destination || "your journey"}.
              </p>
            </div>

            <button
              onClick={() => {
                if (showForm) resetForm();
                else setShowForm(true);
              }}
              className="bg-saffron text-white font-sans text-sm font-semibold px-6 py-3.5 flex items-center gap-2 hover:bg-saffron/90 transition-colors shadow-sm self-start lg:self-auto"
            >
              {showForm ? <X size={16} /> : <Plus size={16} />}
              <span>{showForm ? "Cancel" : "Record Memory"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── BODY ──────────────────────────────────────────────── */}
      <div className="max-w-content mx-auto px-6 md:px-12 py-10 space-y-8">
        {/* Create / Edit Entry Form */}
        {showForm && (
          <form
            onSubmit={handleSave}
            className="bg-white border-2 border-saffron p-6 md:p-8 space-y-6 shadow-md animate-enter"
          >
            <div className="flex items-center justify-between border-b border-mist pb-4">
              <h3 className="font-display font-bold text-xl text-slate">
                {editingId ? "Edit Travel Memory" : "New Travel Diary Entry"}
              </h3>
              <span className="font-mono text-xs text-saffron font-semibold">
                Bharat Travel Log
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Date */}
              <div>
                <label className="block font-mono text-xs uppercase tracking-widest text-slate/50 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  required
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-ivory border border-mist font-sans text-sm text-slate focus:outline-none focus:border-saffron"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block font-mono text-xs uppercase tracking-widest text-slate/50 mb-2">
                  Location / Monument
                </label>
                <div className="relative">
                  <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate/40" />
                  <input
                    type="text"
                    placeholder="e.g. Amber Fort, Hawa Mahal"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-ivory border border-mist font-sans text-sm text-slate focus:outline-none focus:border-saffron"
                  />
                </div>
              </div>

              {/* Mood */}
              <div>
                <label className="block font-mono text-xs uppercase tracking-widest text-slate/50 mb-2">
                  Trip Vibe / Mood
                </label>
                <select
                  value={formMood}
                  onChange={(e) => setFormMood(e.target.value)}
                  className="w-full px-4 py-2.5 bg-ivory border border-mist font-sans text-sm text-slate focus:outline-none focus:border-saffron"
                >
                  {MOODS.map((m) => (
                    <option key={m.label} value={m.label}>
                      {m.emoji} {m.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block font-mono text-xs uppercase tracking-widest text-slate/50 mb-2">
                Entry Title
              </label>
              <input
                type="text"
                placeholder="e.g. Dawn boat ride on the sacred Ganges"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="w-full px-4 py-2.5 bg-ivory border border-mist font-display font-semibold text-lg text-slate focus:outline-none focus:border-saffron"
              />
            </div>

            {/* Content text */}
            <div>
              <label className="block font-mono text-xs uppercase tracking-widest text-slate/50 mb-2">
                Journal Notes & Reflections *
              </label>
              <textarea
                required
                rows={5}
                placeholder="Write down what you saw, what you ate, the conversations you had, the sounds of the temple bells or ocean waves…"
                value={formText}
                onChange={(e) => setFormText(e.target.value)}
                className="w-full p-4 bg-ivory border border-mist font-sans text-sm text-slate leading-relaxed focus:outline-none focus:border-saffron resize-y"
              />
            </div>

            {/* Photos Upload Section */}
            <div className="pt-2 border-t border-mist/80">
              <PhotoUploader
                photos={formPhotos}
                onChange={setFormPhotos}
                maxPhotos={8}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving || !formText.trim()}
                className="px-6 py-3 bg-saffron text-white font-sans text-sm font-semibold hover:bg-saffron/90 disabled:opacity-50 transition-colors flex items-center gap-2 shadow-xs"
              >
                <Save size={15} />
                <span>{saving ? "Saving…" : editingId ? "Update Memory" : "Save to Diary"}</span>
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 border border-mist font-sans text-sm text-slate/60 hover:text-slate transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Entries Timeline / Cards */}
        {loading ? (
          <div className="py-16 text-center text-slate/30 font-mono text-sm">
            Loading your diary entries…
          </div>
        ) : entries.length === 0 ? (
          <div className="border-2 border-dashed border-mist bg-white py-20 px-6 text-center space-y-4">
            <div className="w-16 h-16 bg-saffron/10 flex items-center justify-center mx-auto">
              <BookOpen size={28} className="text-saffron" />
            </div>
            <h3 className="font-display font-bold text-3xl text-slate">
              Your Yatra Diary is Waiting
            </h3>
            <p className="font-sans text-sm text-slate/45 max-w-md mx-auto leading-relaxed">
              Every yatra has moments you never want to forget — from sunrise tea stalls to hidden bazaar alleyways. Record your first memory above.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-saffron text-white font-sans text-xs font-semibold px-6 py-3 hover:bg-saffron/90 transition-colors"
            >
              <Plus size={14} /> Write Day 1 Memory
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {entries.map((entry) => {
              const entryDate = entry.date
                ? new Date(entry.date + "T12:00:00").toLocaleDateString("en-IN", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Travel Day";

              const moodObj = MOODS.find((m) => m.label === entry.mood) || MOODS[0];
              const entryPhotos = getPhotoList(entry);

              return (
                <div
                  key={entry.id}
                  className="bg-white border border-mist hover:border-saffron/50 transition-all p-6 md:p-8 relative group shadow-xs"
                >
                  {/* Parchment top date strip */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-mist/60">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-sand/40 border border-sand flex items-center justify-center font-mono text-xs font-bold text-slate">
                        {entry.date ? entry.date.split("-")[2] : "❁"}
                      </div>
                      <div>
                        <p className="font-sans text-xs font-semibold text-slate/70 uppercase tracking-wider">
                          {entryDate}
                        </p>
                        {entry.location && (
                          <p className="font-sans text-xs text-saffron flex items-center gap-1 mt-0.5">
                            <MapPin size={11} />
                            <span>{entry.location}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs bg-ivory border border-mist px-2.5 py-1 text-slate">
                        {moodObj.emoji} {entry.mood || "Wonder"}
                      </span>

                      {/* Action buttons */}
                      <button
                        onClick={() => handleEdit(entry)}
                        className="text-slate/30 hover:text-teal p-1 transition-colors"
                        title="Edit entry"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="text-slate/30 hover:text-crimson p-1 transition-colors"
                        title="Delete entry"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="pt-5 space-y-4">
                    <h3 className="font-display font-bold text-2xl text-slate leading-tight">
                      {entry.title || "Travel Reflections"}
                    </h3>
                    <p className="font-sans text-sm text-slate/75 leading-relaxed whitespace-pre-line">
                      {entry.text}
                    </p>

                    {/* Photo Scrapbook Display */}
                    {entryPhotos.length > 0 && (
                      <div className="pt-3">
                        {entryPhotos.length === 1 ? (
                          // Single Photo Featured Layout
                          <div
                            onClick={() => openLightbox(entryPhotos, 0)}
                            className="relative group/photo cursor-pointer overflow-hidden border border-mist/80 bg-sand/10 max-w-2xl"
                          >
                            <div className="max-h-96 overflow-hidden">
                              <img
                                src={entryPhotos[0].url}
                                alt={entryPhotos[0].caption || "Travel photo"}
                                className="w-full h-auto object-cover group-hover/photo:scale-102 transition-transform duration-300"
                              />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-end justify-between p-3 text-white">
                              <span className="font-sans text-xs">
                                {entryPhotos[0].caption || "Click to enlarge photo"}
                              </span>
                              <span className="p-1.5 bg-white/20 backdrop-blur-sm rounded-full">
                                <Maximize2 size={14} />
                              </span>
                            </div>
                            {entryPhotos[0].caption && (
                              <div className="p-2.5 bg-ivory border-t border-mist/50">
                                <p className="font-sans text-xs italic text-slate/70">
                                  {entryPhotos[0].caption}
                                </p>
                              </div>
                            )}
                          </div>
                        ) : entryPhotos.length === 2 ? (
                          // Two Photos Side-by-side
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {entryPhotos.map((photo, pIdx) => (
                              <div
                                key={photo.id || pIdx}
                                onClick={() => openLightbox(entryPhotos, pIdx)}
                                className="relative group/photo cursor-pointer overflow-hidden border border-mist/80 bg-sand/10"
                              >
                                <div className="aspect-[4/3] overflow-hidden">
                                  <img
                                    src={photo.url}
                                    alt={photo.caption || `Travel photo ${pIdx + 1}`}
                                    className="w-full h-full object-cover group-hover/photo:scale-105 transition-transform duration-300"
                                  />
                                </div>
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center text-white">
                                  <span className="p-2 bg-slate/70 rounded-full backdrop-blur-sm">
                                    <Maximize2 size={16} />
                                  </span>
                                </div>
                                {photo.caption && (
                                  <div className="p-2 bg-ivory border-t border-mist/50">
                                    <p className="font-sans text-xs text-slate/70 truncate">
                                      {photo.caption}
                                    </p>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          // 3+ Photos Collage / Grid
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {entryPhotos.map((photo, pIdx) => (
                              <div
                                key={photo.id || pIdx}
                                onClick={() => openLightbox(entryPhotos, pIdx)}
                                className="relative group/photo cursor-pointer overflow-hidden border border-mist/80 bg-sand/10 shadow-xs"
                              >
                                <div className="aspect-square overflow-hidden">
                                  <img
                                    src={photo.url}
                                    alt={photo.caption || `Travel photo ${pIdx + 1}`}
                                    className="w-full h-full object-cover group-hover/photo:scale-105 transition-transform duration-300"
                                  />
                                </div>
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center text-white">
                                  <span className="p-1.5 bg-slate/70 rounded-full backdrop-blur-sm">
                                    <Maximize2 size={14} />
                                  </span>
                                </div>
                                {photo.caption && (
                                  <div className="p-1.5 bg-ivory border-t border-mist/50">
                                    <p className="font-sans text-[11px] text-slate/70 truncate">
                                      {photo.caption}
                                    </p>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Fullscreen Photo Lightbox Modal */}
      <PhotoLightbox
        isOpen={lightboxOpen}
        photos={lightboxPhotos}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
        onChangeIndex={setLightboxIndex}
      />
    </AppShell>
  );
}
