import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Users, MapPin, Calendar, ArrowRight, CheckCircle2, Shield, Shirt, Sparkles } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import AppShell from "../components/layout/AppShell";
import { useCurrency } from "../contexts/CurrencyContext";
import { cacheTripOffline, cacheSquadOffline, getCachedSquad } from "../services/offlineStorage";

export default function JoinTrip() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { format } = useCurrency();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [budgetShare, setBudgetShare] = useState("");
  const [bringingGear, setBringingGear] = useState("");
  const [joined, setJoined] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadTripByToken() {
      // Look up trip by share_token or id
      const { data } = await supabase
        .from("trips")
        .select("*")
        .or(`share_token.eq.${token},id.eq.${token}`)
        .single();

      if (data) {
        setTrip(data);
        cacheTripOffline(data);
      }
      setLoading(false);
    }
    loadTripByToken();
  }, [token]);

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!name.trim() || !trip) return;
    setSubmitting(true);

    const newMember = {
      id: `member-${Date.now()}`,
      name: name.trim(),
      budget: parseFloat(budgetShare) || 0,
      bringingItems: bringingGear
        ? bringingGear.split(",").map((s) => s.trim()).filter(Boolean)
        : ["Power Bank", "First Aid Kit", "Sunglasses"],
      joinedAt: new Date().toISOString(),
    };

    // Cache squad member in IndexedDB
    const existing = (await getCachedSquad(trip.id)) || [];
    const updated = [...existing, newMember];
    await cacheSquadOffline(trip.id, updated);

    setJoined(true);
    setTimeout(() => {
      navigate(`/trips/${trip.id}`);
    }, 1800);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center font-mono text-sm text-slate/40">
        Loading Yatra invite details…
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-ivory flex flex-col items-center justify-center p-6 text-center">
        <MapPin size={36} className="text-saffron mb-4" />
        <h2 className="font-display font-bold text-3xl text-slate mb-2">Trip Not Found</h2>
        <p className="font-sans text-sm text-slate/40 max-w-sm mb-6">
          This invite link may have expired or is invalid. Ask the trip organizer for a fresh link.
        </p>
        <Link
          to="/"
          className="px-6 py-3 bg-slate text-sand font-display font-semibold text-sm hover:bg-saffron hover:text-white transition-colors"
        >
          Go to Trip Drip Home
        </Link>
      </div>
    );
  }

  const startFmt = new Date(trip.start_date + "T12:00:00").toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
  const endFmt = new Date(trip.end_date + "T12:00:00").toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-ivory flex flex-col justify-between" style={{ fontFamily: "Poppins, sans-serif" }}>
      {/* Top Strip */}
      <div
        className="h-1.5"
        style={{
          background:
            "repeating-linear-gradient(90deg,#E8610A 0,#E8610A 20px,#006E6D 20px,#006E6D 40px,#E8D5A8 40px,#E8D5A8 60px)",
        }}
      />

      <div className="max-w-lg mx-auto w-full px-6 py-12 flex-1 flex flex-col justify-center">
        <div className="bg-white border-2 border-saffron shadow-xl p-8 space-y-6">
          {/* Trip Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-saffron/10 flex items-center justify-center mx-auto mb-3">
              <Users size={24} className="text-saffron" />
            </div>
            <p className="font-mono text-xs uppercase tracking-widest text-slate/40">
              Squad Trip Invitation
            </p>
            <h1 className="font-display font-bold text-3xl text-slate leading-tight">
              Join Yatra to {trip.destination}
            </h1>
            <p className="font-mono text-xs text-saffron font-semibold">
              {startFmt} — {endFmt} · {trip.trip_style} Style
            </p>
          </div>

          {/* Trip Snapshot Pill */}
          <div className="bg-ivory border border-mist p-4 flex justify-between items-center text-xs font-mono">
            <div>
              <span className="text-slate/40 block uppercase text-[0.6rem]">Group Budget</span>
              <span className="font-bold text-slate text-sm">{format(trip.total_budget)}</span>
            </div>
            <div>
              <span className="text-slate/40 block uppercase text-[0.6rem]">Squad Size</span>
              <span className="font-bold text-slate text-sm">{trip.group_size || 2} Travellers</span>
            </div>
          </div>

          {joined ? (
            <div className="bg-forest/10 border border-forest/30 p-6 text-center space-y-2 animate-enter">
              <CheckCircle2 size={32} className="text-forest mx-auto" />
              <p className="font-display font-bold text-xl text-forest">You've Joined the Squad!</p>
              <p className="font-sans text-xs text-slate/60">
                Syncing wardrobe and opening your shared trip dashboard…
              </p>
            </div>
          ) : (
            <form onSubmit={handleJoin} className="space-y-4">
              <div>
                <label className="block font-mono text-xs uppercase tracking-widest text-slate/50 mb-1.5">
                  Your Display Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aryan, Priya, Rahul"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-ivory border border-mist font-sans text-sm text-slate focus:outline-none focus:border-saffron"
                />
              </div>

              <div>
                <label className="block font-mono text-xs uppercase tracking-widest text-slate/50 mb-1.5">
                  Your Budget Contribution in INR (₹)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 5000"
                  value={budgetShare}
                  onChange={(e) => setBudgetShare(e.target.value)}
                  className="w-full px-4 py-2.5 bg-ivory border border-mist font-sans text-sm text-slate focus:outline-none focus:border-saffron"
                />
              </div>

              <div>
                <label className="block font-mono text-xs uppercase tracking-widest text-slate/50 mb-1.5">
                  Gear or Clothing You're Bringing (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sunscreen SPF 50, Umbrella, Power Bank"
                  value={bringingGear}
                  onChange={(e) => setBringingGear(e.target.value)}
                  className="w-full px-4 py-2.5 bg-ivory border border-mist font-sans text-sm text-slate focus:outline-none focus:border-saffron"
                />
              </div>

              <button
                type="submit"
                disabled={submitting || !name.trim()}
                className="w-full bg-saffron text-white font-display font-bold text-lg py-4 hover:bg-saffron/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <span>{submitting ? "Joining…" : "Join This Yatra Squad →"}</span>
              </button>
            </form>
          )}
        </div>
      </div>

      <footer className="bg-slate text-sand/40 text-center py-4 font-mono text-xs">
        TRIP DRIP · SQUAD COLLABORATION · BHARAT EDITION ❁
      </footer>
    </div>
  );
}
