import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft, DollarSign, Plus, Trash2, PieChart, TrendingUp,
  CreditCard, Users, MessageSquare, AlertTriangle, CheckCircle2,
  Train, Hotel, Utensils, ShoppingBag, Compass, HelpCircle, X
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import AppShell from "../components/layout/AppShell";
import { useCurrency } from "../contexts/CurrencyContext";
import { cacheExpensesOffline, getCachedExpenses, cacheTripOffline, getCachedTrip } from "../services/offlineStorage";

const EXPENSE_CATEGORIES = [
  { id: "Transport", label: "Transport (Train/Bus/Flight/Cab)", icon: Train, color: "#006E6D" }, // Teal
  { id: "Lodging", label: "Lodging (Hotel/Homestay)", icon: Hotel, color: "#E8610A" }, // Saffron
  { id: "Food", label: "Food & Dining (Chai/Dhabas/Restos)", icon: Utensils, color: "#2D6A2F" }, // Forest
  { id: "Shopping", label: "Shopping & Garments", icon: ShoppingBag, color: "#B5281C" }, // Crimson
  { id: "Sightseeing", label: "Sightseeing & Monuments", icon: Compass, color: "#E8D5A8" }, // Sand
  { id: "Misc", label: "Miscellaneous & Tips", icon: HelpCircle, color: "#1C1C1C" }, // Slate
];

export default function Expenses() {
  const { id: tripId } = useParams();
  const { format } = useCurrency();

  const [trip, setTrip] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add form state
  const [showForm, setShowForm] = useState(false);
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [paidBy, setPaidBy] = useState("Me");
  const [saving, setSaving] = useState(false);

  // Load trip & expenses
  useEffect(() => {
    async function load() {
      // 1. Trip
      const { data: tripData } = await supabase.from("trips").select("*").eq("id", tripId).single();
      if (tripData) {
        setTrip(tripData);
        cacheTripOffline(tripData);
      } else {
        const cachedT = await getCachedTrip(tripId);
        if (cachedT) setTrip(cachedT);
      }

      // 2. Expenses
      const { data: expData } = await supabase
        .from("expenses")
        .select("*")
        .eq("trip_id", tripId)
        .order("created_at", { ascending: false });

      if (expData && expData.length > 0) {
        setExpenses(expData);
        cacheExpensesOffline(tripId, expData);
      } else {
        const cachedE = await getCachedExpenses(tripId);
        if (cachedE) setExpenses(cachedE);
      }

      setLoading(false);
    }
    load();
  }, [tripId]);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!label.trim() || isNaN(parsedAmount) || parsedAmount <= 0) return;
    setSaving(true);

    const payload = {
      trip_id: tripId,
      label: label.trim(),
      amount: parsedAmount,
      currency: "INR",
      category,
      paid_by: paidBy || "Me",
      created_at: new Date().toISOString(),
    };

    const tempItem = { ...payload, id: `exp-${Date.now()}` };
    const updated = [tempItem, ...expenses];
    setExpenses(updated);
    cacheExpensesOffline(tripId, updated);

    const { data } = await supabase.from("expenses").insert(payload).select().single().catch(() => ({ data: null }));
    if (data) {
      setExpenses((prev) => prev.map((item) => (item.id === tempItem.id ? data : item)));
    }

    setLabel("");
    setAmount("");
    setShowForm(false);
    setSaving(false);
  };

  const handleDeleteExpense = async (expId) => {
    const updated = expenses.filter((e) => e.id !== expId);
    setExpenses(updated);
    cacheExpensesOffline(tripId, updated);
    await supabase.from("expenses").delete().eq("id", expId).catch(() => {});
  };

  // Budget calculations
  const totalBudget = parseFloat(trip?.total_budget) || 0;
  const totalSpent = expenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
  const remaining = totalBudget - totalSpent;
  const isOverBudget = remaining < 0;
  const groupSize = Math.max(1, trip?.group_size || 1);
  const nights = Math.max(1, trip ? Math.round((new Date(trip.end_date) - new Date(trip.start_date)) / 86400000) : 3);
  const perPersonDailySpend = Math.round(totalSpent / groupSize / nights);

  // Group by category for SVG chart
  const categoryTotals = EXPENSE_CATEGORIES.map((cat) => {
    const sum = expenses
      .filter((e) => (e.category || "Misc") === cat.id)
      .reduce((s, e) => s + (parseFloat(e.amount) || 0), 0);
    return {
      ...cat,
      total: sum,
      pct: totalSpent > 0 ? (sum / totalSpent) * 100 : 0,
    };
  }).filter((c) => c.total > 0);

  // WhatsApp Squad Split Message
  const handleShareSplitWhatsApp = () => {
    const perPerson = Math.round(totalSpent / groupSize);
    const text = `📊 Squad Expense Split for ${trip?.destination || "Trip"}:\nTotal Spent: ₹${totalSpent.toLocaleString("en-IN")}\nGroup Size: ${groupSize} pax\nSplit Per Person: ₹${perPerson.toLocaleString("en-IN")}\n\nTracked on Trip Drip India ❁`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  // Compute SVG Donut paths
  let cumulativePct = 0;
  const donutSegments = categoryTotals.map((cat) => {
    const startPct = cumulativePct;
    cumulativePct += cat.pct;
    const endPct = cumulativePct;

    // Circumference for r=40 is 2 * PI * 40 = 251.3
    const circ = 2 * Math.PI * 40;
    const dashLength = (cat.pct / 100) * circ;
    const dashOffset = -((startPct / 100) * circ);

    return {
      ...cat,
      dashArray: `${dashLength} ${circ - dashLength}`,
      dashOffset,
    };
  });

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
                Real-Time Expense Tracker & Budget Split
              </p>
              <h1
                className="font-display font-bold text-sand leading-none"
                style={{ fontSize: "clamp(2.8rem,6vw,5.5rem)" }}
              >
                Yatra Expenses
              </h1>
              <p className="font-sans text-sm text-sand/60 mt-3 max-w-xl">
                Log spends in INR with instant currency conversion, visual category charts, and 1-click WhatsApp squad split generator.
              </p>
            </div>

            <button
              onClick={() => setShowForm((o) => !o)}
              className="bg-saffron text-white font-sans text-sm font-semibold px-6 py-3.5 flex items-center gap-2 hover:bg-saffron/90 transition-colors shadow-sm self-start lg:self-auto"
            >
              {showForm ? <X size={16} /> : <Plus size={16} />}
              <span>{showForm ? "Cancel" : "Add Expense"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── METRICS SUMMARY CARDS ─────────────────────────────── */}
      <div className="bg-sand/20 border-b border-mist">
        <div className="max-w-content mx-auto px-6 md:px-12 py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border border-mist p-4">
            <p className="font-mono text-[0.65rem] uppercase tracking-wider text-slate/45">Total Budget</p>
            <p className="font-display font-bold text-2xl text-slate mt-1">{format(totalBudget)}</p>
          </div>
          <div className="bg-white border border-mist p-4">
            <p className="font-mono text-[0.65rem] uppercase tracking-wider text-slate/45">Total Spent</p>
            <p className="font-display font-bold text-2xl text-saffron mt-1">{format(totalSpent)}</p>
          </div>
          <div className="bg-white border border-mist p-4">
            <p className="font-mono text-[0.65rem] uppercase tracking-wider text-slate/45">
              {isOverBudget ? "Over Budget" : "Remaining Balance"}
            </p>
            <p className={`font-display font-bold text-2xl mt-1 ${isOverBudget ? "text-crimson" : "text-forest"}`}>
              {isOverBudget ? `-${format(Math.abs(remaining))}` : format(remaining)}
            </p>
          </div>
          <div className="bg-white border border-mist p-4">
            <p className="font-mono text-[0.65rem] uppercase tracking-wider text-slate/45">Per Person / Day</p>
            <p className="font-display font-bold text-2xl text-slate mt-1">{format(perPersonDailySpend)}</p>
          </div>
        </div>
      </div>

      {/* ── BODY ──────────────────────────────────────────────── */}
      <div className="max-w-content mx-auto px-6 md:px-12 py-10 space-y-8">
        {/* Add Expense Form */}
        {showForm && (
          <form
            onSubmit={handleAddExpense}
            className="bg-white border-2 border-saffron p-6 md:p-8 space-y-6 shadow-md animate-enter"
          >
            <div className="flex items-center justify-between border-b border-mist pb-3">
              <h3 className="font-display font-bold text-xl text-slate">Log a New Spend</h3>
              <span className="font-mono text-xs text-saffron font-semibold">Expense Tracker</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block font-mono text-xs uppercase tracking-widest text-slate/50 mb-2">
                  Expense Description *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tapri Chai & Snacks, Fort Entry"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  className="w-full px-4 py-2.5 bg-ivory border border-mist font-sans text-sm text-slate focus:outline-none focus:border-saffron"
                />
              </div>

              <div>
                <label className="block font-mono text-xs uppercase tracking-widest text-slate/50 mb-2">
                  Amount in INR (₹) *
                </label>
                <input
                  type="number"
                  required
                  step="any"
                  placeholder="e.g. 450"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-2.5 bg-ivory border border-mist font-sans text-sm text-slate focus:outline-none focus:border-saffron"
                />
              </div>

              <div>
                <label className="block font-mono text-xs uppercase tracking-widest text-slate/50 mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-ivory border border-mist font-sans text-sm text-slate focus:outline-none focus:border-saffron"
                >
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-mono text-xs uppercase tracking-widest text-slate/50 mb-2">
                  Paid By
                </label>
                <input
                  type="text"
                  placeholder="e.g. Me, Ujjwal, Shared"
                  value={paidBy}
                  onChange={(e) => setPaidBy(e.target.value)}
                  className="w-full px-4 py-2.5 bg-ivory border border-mist font-sans text-sm text-slate focus:outline-none focus:border-saffron"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving || !label.trim() || !amount}
                className="px-6 py-3 bg-saffron text-white font-sans text-sm font-semibold hover:bg-saffron/90 disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                <Plus size={15} />
                <span>{saving ? "Logging…" : "Record Expense"}</span>
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-3 border border-mist font-sans text-sm text-slate/60 hover:text-slate transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* ── CATEGORY CHART & BREAKDOWN ──────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left 40%: SVG Donut Chart */}
          <div className="lg:col-span-2 bg-white border border-mist p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-lg text-slate">Category Spend Breakdown</h3>
                <PieChart size={18} className="text-slate/40" />
              </div>

              {categoryTotals.length === 0 ? (
                <div className="h-48 flex items-center justify-center text-center text-slate/40 font-sans text-xs">
                  Log your first expense to see the visual breakdown chart.
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-4">
                  {/* SVG Donut */}
                  <div className="relative w-36 h-36 flex-shrink-0">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#D9CFC3" strokeWidth="16" />
                      {donutSegments.map((seg) => (
                        <circle
                          key={seg.id}
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke={seg.color}
                          strokeWidth="16"
                          strokeDasharray={seg.dashArray}
                          strokeDashoffset={seg.dashOffset}
                          style={{ transition: "stroke-dasharray 0.6s ease" }}
                        />
                      ))}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="font-mono text-[0.6rem] uppercase tracking-widest text-slate/40">Total</span>
                      <span className="font-mono font-bold text-xs text-slate">{format(totalSpent)}</span>
                    </div>
                  </div>

                  {/* Legend list */}
                  <div className="flex-1 space-y-2 w-full">
                    {categoryTotals.map((cat) => (
                      <div key={cat.id} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                          <span className="font-sans text-slate">{cat.id}</span>
                        </div>
                        <span className="font-mono font-semibold text-slate">{Math.round(cat.pct)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Squad Split Button */}
            <div className="pt-4 border-t border-mist/60 mt-4">
              <button
                onClick={handleShareSplitWhatsApp}
                className="w-full bg-[#25D366] text-white font-sans text-xs font-semibold py-3 px-4 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                <MessageSquare size={15} />
                <span>Share WhatsApp Squad Split ({groupSize} pax)</span>
              </button>
            </div>
          </div>

          {/* Right 60%: Expense Log Table */}
          <div className="lg:col-span-3 bg-white border border-mist p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-lg text-slate">
                All Recorded Spends ({expenses.length})
              </h3>
              <span className="font-mono text-xs text-slate/40">Sorted by Most Recent</span>
            </div>

            {expenses.length === 0 ? (
              <div className="py-16 text-center text-slate/40 font-sans text-xs border border-dashed border-mist">
                No expenses logged yet. Tap "Add Expense" to track train tickets, hotel bills, dhabas, and shopping.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead>
                    <tr className="border-b border-mist text-slate/40 font-mono">
                      <th className="pb-3 font-medium">Category / Item</th>
                      <th className="pb-3 font-medium">Paid By</th>
                      <th className="pb-3 font-medium text-right">Amount</th>
                      <th className="pb-3 text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-mist/50">
                    {expenses.map((exp) => {
                      const catInfo = EXPENSE_CATEGORIES.find((c) => c.id === exp.category) || EXPENSE_CATEGORIES[5];
                      const Icon = catInfo.icon;
                      return (
                        <tr key={exp.id} className="hover:bg-ivory/50 transition-colors group">
                          <td className="py-3 pr-3">
                            <div className="flex items-center gap-2.5">
                              <div
                                className="w-7 h-7 rounded-sm flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: `${catInfo.color}18`, color: catInfo.color }}
                              >
                                <Icon size={14} />
                              </div>
                              <div>
                                <p className="font-medium text-slate leading-snug">{exp.label}</p>
                                <p className="font-mono text-[0.65rem] text-slate/40">{exp.category || "General"}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-2 font-mono text-[0.7rem] text-slate/60">
                            {exp.paid_by || "Me"}
                          </td>
                          <td className="py-3 px-2 text-right font-mono font-bold text-slate">
                            {format(exp.amount)}
                          </td>
                          <td className="py-3 pl-2 text-right">
                            <button
                              onClick={() => handleDeleteExpense(exp.id)}
                              className="text-slate/25 hover:text-crimson p-1 transition-colors opacity-0 group-hover:opacity-100"
                              title="Delete expense"
                            >
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
