import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCurrency } from "../contexts/CurrencyContext";
import AppShell from "../components/layout/AppShell";
import { CheckCircle2, Globe, RefreshCw } from "lucide-react";

export default function Settings() {
  const { user, signOut } = useAuth();
  const { currency, setCurrency, currencies, format, rates } = useCurrency();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);

  async function handleSignOut() {
    await signOut();
    navigate("/");
  }

  const handleCurrencyChange = (newCode) => {
    setCurrency(newCode);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <AppShell>
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="bg-teal geo-border-top relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "radial-gradient(circle at 50% 50%,#E8D5A8 1px,transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="max-w-content mx-auto px-6 md:px-12 py-10 animate-enter">
          <p className="font-mono text-xs tracking-[0.25em] uppercase text-sand/45 mb-2">Account & Preferences</p>
          <h1 className="font-display font-bold text-sand leading-none" style={{ fontSize: "clamp(2.5rem,5vw,4rem)" }}>
            Settings
          </h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 py-12 space-y-8">
        {/* Account Email */}
        <div className="bg-white border border-mist p-6">
          <p className="font-mono text-xs uppercase tracking-widest text-slate/40 mb-1">Account email</p>
          <p className="font-sans text-slate font-medium">{user?.email || "Signed In Traveller"}</p>
        </div>

        {/* Currency Selector */}
        <div className="bg-white border border-mist p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-slate/40 mb-1">Display Currency</p>
              <p className="font-sans text-xs text-slate/60">
                All prices, hotel tiers, shopping carts, and expenses convert automatically.
              </p>
            </div>
            <Globe size={18} className="text-teal" />
          </div>

          <select
            value={currency}
            onChange={(e) => handleCurrencyChange(e.target.value)}
            className="w-full bg-ivory border border-mist p-3 font-sans text-sm text-slate focus:outline-none focus:border-saffron font-medium"
          >
            {Object.values(currencies).map((c) => (
              <option key={c.code} value={c.code}>
                {c.symbol} {c.code} — {c.name}
              </option>
            ))}
          </select>

          {/* Live Preview of Conversion */}
          <div className="bg-sand/30 p-3.5 border border-mist/60 text-xs font-mono space-y-1">
            <div className="flex justify-between text-slate/60">
              <span>Sample Rate:</span>
              <span>₹1,000 INR = {format(1000)}</span>
            </div>
            <div className="flex justify-between text-slate/60">
              <span>Live FX Source:</span>
              <span className="text-forest font-semibold">open.er-api · Auto-cached</span>
            </div>
          </div>
        </div>

        {/* Saved Success Notification */}
        {saved && (
          <div className="flex items-center gap-2 bg-forest/10 border border-forest/30 text-forest px-4 py-3 font-sans text-sm animate-enter">
            <CheckCircle2 size={16} /> Currency preference saved.
          </div>
        )}

        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          className="w-full border-2 border-crimson text-crimson font-sans font-semibold py-3 hover:bg-crimson hover:text-white transition-colors"
        >
          Sign Out
        </button>
      </div>
    </AppShell>
  );
}