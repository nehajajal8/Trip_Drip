import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, MapPin, Calendar, Users, Train, Bus, Car, Plane, ArrowRight, Trash2, AlertTriangle, X } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { useAuth }  from "../contexts/AuthContext";
import AppShell     from "../components/layout/AppShell";
import { deleteCachedTrip, getAllCachedTrips } from "../services/offlineStorage";

const STYLE_COLORS = {
  Heritage: "bg-saffron",
  Beach: "bg-teal",
  Mountains: "bg-slate",
  Spiritual: "bg-forest",
  Wildlife: "bg-forest",
  Mixed: "bg-slate/70",
};

const TRANSPORT_ICON = { train: Train, bus: Bus, car: Car, flight: Plane };

function INR(n) {
  return n ? `₹${Math.round(n).toLocaleString("en-IN")}` : null;
}

export default function Trips() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ open: false, trip: null, deleting: false });

  useEffect(() => {
    async function fetchTrips() {
      setLoading(true);
      try {
        let list = [];
        if (user?.id) {
          const { data } = await supabase
            .from("trips")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });
          if (data && data.length > 0) list = data;
        }

        // Fallback to offline cached trips if DB is empty or user has local trips
        if (list.length === 0) {
          const cached = await getAllCachedTrips();
          if (cached && cached.length > 0) {
            list = cached.sort((a, b) => (b.created_at || 0) > (a.created_at || 0) ? 1 : -1);
          }
        }
        setTrips(list);
      } catch {
        const cached = await getAllCachedTrips();
        setTrips(cached || []);
      } finally {
        setLoading(false);
      }
    }
    fetchTrips();
  }, [user]);

  const nights = (t) =>
    Math.max(1, Math.round((new Date(t.end_date) - new Date(t.start_date)) / 86400000));

  const handleDeleteClick = (e, trip) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteModal({ open: true, trip, deleting: false });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.trip) return;
    const tripId = deleteModal.trip.id;
    setDeleteModal((prev) => ({ ...prev, deleting: true }));

    try {
      // 1. Remove from offline storage (trips, cart, checklist, expenses, journal, squad)
      await deleteCachedTrip(tripId);

      // 2. Remove from Supabase if connected
      await Promise.allSettled([
        supabase.from("trips").delete().eq("id", tripId),
        supabase.from("expenses").delete().eq("trip_id", tripId),
        supabase.from("journal_entries").delete().eq("trip_id", tripId),
        supabase.from("chat_messages").delete().eq("trip_id", tripId),
      ]);

      // 3. Update local state
      setTrips((prev) => prev.filter((t) => t.id !== tripId));
      setDeleteModal({ open: false, trip: null, deleting: false });
    } catch (err) {
      console.error("Delete trip failed:", err);
      setDeleteModal({ open: false, trip: null, deleting: false });
    }
  };

  return (
    <AppShell>
      {/* Header */}
      <div className="bg-teal geo-border-top relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "radial-gradient(circle at 50%,#E8D5A8 1px,transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative max-w-content mx-auto px-6 md:px-12 py-10 flex items-end justify-between animate-enter">
          <div>
            <p className="font-mono text-xs tracking-[0.25em] uppercase text-sand/45 mb-2">— My Journeys —</p>
            <h1 className="font-display font-bold text-sand leading-none" style={{ fontSize: "clamp(2.5rem,6vw,5rem)" }}>
              Your Yatras
            </h1>
          </div>
          <Link
            to="/trips/new"
            className="flex items-center gap-2 bg-saffron text-white font-display font-bold px-5 py-3 text-lg hover:bg-saffron/90 transition-colors shadow-sm"
          >
            <Plus size={18} /> New Trip
          </Link>
        </div>
      </div>

      <div className="max-w-content mx-auto px-6 md:px-12 py-10">
        {loading ? (
          <div className="flex items-center gap-3 text-slate/30 font-mono text-sm py-16">
            <div className="w-4 h-4 border border-slate/20 border-t-saffron rounded-full animate-spin" />
            Loading your trips…
          </div>
        ) : trips.length === 0 ? (
          <div className="border-2 border-dashed border-mist py-24 text-center">
            <div className="w-16 h-16 bg-saffron/10 flex items-center justify-center mx-auto mb-5">
              <MapPin size={28} className="text-saffron" />
            </div>
            <p className="font-display font-bold text-3xl text-slate mb-2">No trips yet</p>
            <p className="font-sans text-sm text-slate/40 mb-6">Plan your first Indian yatra — it only takes 30 seconds.</p>
            <Link
              to="/trips/new"
              className="inline-flex items-center gap-2 bg-saffron text-white font-display font-bold px-7 py-3 text-lg hover:bg-saffron/90 transition-colors"
            >
              Plan My First Yatra <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <>
            {/* Featured card — most recent */}
            {trips[0] && (
              <div className="relative mb-8 group">
                <Link to={`/trips/${trips[0].id}`} className="block">
                  <div
                    className={`${STYLE_COLORS[trips[0].trip_style] || "bg-slate"} p-8 md:p-12 relative overflow-hidden min-h-48 shadow-sm hover:shadow-md transition-shadow`}
                  >
                    <div
                      className="absolute inset-0 opacity-[0.04]"
                      style={{
                        backgroundImage: "radial-gradient(circle at 50%,#FFF8EF 1px,transparent 1px)",
                        backgroundSize: "20px 20px",
                      }}
                    />
                    <div className="relative flex items-end justify-between h-full">
                      <div>
                        <p className="font-mono text-xs tracking-[0.2em] uppercase text-white/40 mb-3">
                          Most Recent · {trips[0].trip_style}
                          {trips[0].group_size > 1 ? ` · Group of ${trips[0].group_size}` : ""}
                        </p>
                        <h2 className="font-display font-bold text-white mb-2" style={{ fontSize: "clamp(2rem,5vw,4rem)", lineHeight: 1 }}>
                          {trips[0].destination}
                        </h2>
                        <p className="font-mono text-sm text-white/40">
                          {nights(trips[0])} nights
                          {trips[0].total_budget ? ` · ${INR(trips[0].total_budget)}` : ""}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 mt-auto">
                        <ArrowRight size={28} className="text-white/40 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Delete button on featured card */}
                <button
                  onClick={(e) => handleDeleteClick(e, trips[0])}
                  title="Delete Trip"
                  className="absolute top-4 right-4 z-10 p-2.5 bg-black/40 hover:bg-crimson text-white/70 hover:text-white rounded-full backdrop-blur-xs transition-all opacity-80 hover:opacity-100 shadow-sm"
                  aria-label="Delete this trip"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}

            {/* Rest of trips */}
            <div className="space-y-2">
              {trips.slice(1).map((trip) => {
                const TransIcon = TRANSPORT_ICON[trip.preferred_transport] || Train;
                return (
                  <div
                    key={trip.id}
                    className="group flex items-center justify-between bg-white border border-mist hover:border-saffron transition-all relative shadow-xs"
                  >
                    <Link to={`/trips/${trip.id}`} className="flex-1 flex items-center justify-between px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className={`w-1 self-stretch ${STYLE_COLORS[trip.trip_style] || "bg-slate"}`} />
                        <div>
                          <p className="font-display font-semibold text-slate text-lg leading-tight">{trip.destination}</p>
                          <p className="font-mono text-xs text-slate/40 mt-0.5">
                            {nights(trip)} nights
                            {trip.from_city ? ` from ${trip.from_city}` : ""}
                            {trip.group_size > 1 ? ` · ${trip.group_size} people` : ""}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {trip.total_budget > 0 && (
                          <p className="font-mono text-sm text-slate/50">{INR(trip.total_budget)}</p>
                        )}
                        <TransIcon size={14} className="text-slate/25" />
                        <ArrowRight size={14} className="text-slate/25 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </Link>

                    {/* Delete action button */}
                    <div className="pr-4 pl-1">
                      <button
                        onClick={(e) => handleDeleteClick(e, trip)}
                        title="Delete Trip"
                        className="p-2 text-slate/30 hover:text-crimson hover:bg-crimson/10 rounded transition-all"
                        aria-label={`Delete trip to ${trip.destination}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.open && deleteModal.trip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-enter">
          <div className="bg-white border-2 border-crimson max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setDeleteModal({ open: false, trip: null, deleting: false })}
              className="absolute top-4 right-4 text-slate/40 hover:text-slate transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 text-crimson mb-3">
              <div className="w-10 h-10 bg-crimson/10 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={20} className="text-crimson" />
              </div>
              <h3 className="font-display font-bold text-lg text-slate">
                Delete Yatra to {deleteModal.trip.destination}?
              </h3>
            </div>

            <p className="font-sans text-xs text-slate/70 leading-relaxed mb-6">
              This action cannot be undone. It will permanently remove this trip, its 5-day itinerary, packing checklist, shopping cart, expenses, and diary memories from both your device and cloud storage.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-mist">
              <button
                type="button"
                onClick={() => setDeleteModal({ open: false, trip: null, deleting: false })}
                disabled={deleteModal.deleting}
                className="px-4 py-2 border border-mist text-slate font-sans text-xs font-semibold hover:bg-ivory transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleteModal.deleting}
                className="px-4 py-2 bg-crimson text-white font-sans text-xs font-semibold hover:bg-crimson/90 transition-colors flex items-center gap-2 shadow-sm"
              >
                {deleteModal.deleting ? (
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
  );
}