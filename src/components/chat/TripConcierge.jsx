import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { MessageCircle, X, Send, Loader2, BellRing, Sparkles, ShoppingBag, CheckSquare, DollarSign, BookOpen, Check } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../contexts/AuthContext";
import { useCurrency } from "../../contexts/CurrencyContext";
import { cacheCartOffline, getCachedCart, cacheChecklistOffline, getCachedChecklist, cacheExpensesOffline, getCachedExpenses, cacheJournalOffline, getCachedJournal } from "../../services/offlineStorage";

export default function TripConcierge() {
  const { id: tripId }        = useParams();
  const { user }              = useAuth();
  const { format }            = useCurrency();
  const [open, setOpen]       = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput]     = useState("");
  const [loading, setLoading] = useState(false);
  const [tripName, setTripName] = useState("");
  const [histLoaded, setHistLoaded] = useState(false);
  const bottomRef             = useRef(null);
  const inputRef              = useRef(null);

  // Load trip name + chat history on mount / tripId change
  useEffect(() => {
    if (!tripId || !user) return;
    setMessages([]);
    setHistLoaded(false);

    async function load() {
      const [{ data: trip }, { data: hist }] = await Promise.all([
        supabase.from("trips").select("destination").eq("id", tripId).single(),
        supabase.from("chat_messages")
          .select("role, content, created_at")
          .eq("trip_id", tripId)
          .order("created_at", { ascending: true })
          .limit(50),
      ]);
      if (trip) setTripName(trip.destination);
      if (hist?.length) {
        setMessages(hist.map(m => ({ role: m.role, content: m.content })));
      } else {
        setMessages([{
          role: "assistant",
          content: `Namaste! I'm your AI concierge for ${trip?.destination || "this yatra"}. Ask me about outfits, brand options, or say "add the linen shirt to my cart" or "mark umbrella as packed"!`,
        }]);
      }
      setHistLoaded(true);
    }
    load();
  }, [tripId, user]);

  // Auto-scroll
  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  // Focus input on open
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  // Execute actions returned from API
  async function executeClientActions(actions = []) {
    if (!actions?.length || !tripId) return;

    for (const act of actions) {
      if (act.type === "ADD_TO_CART") {
        const cart = (await getCachedCart(tripId)) || [];
        const item = act.payload;
        const exists = cart.find(c => c.id === item.id);
        const updated = exists
          ? cart.map(c => c.id === item.id ? { ...c, quantity: (c.quantity||1) + 1 } : c)
          : [...cart, { ...item, quantity: 1 }];
        await cacheCartOffline(tripId, updated);
        window.dispatchEvent(new CustomEvent("trip_cart_updated", { detail: updated }));
      } else if (act.type === "MARK_PACKED") {
        const checklist = (await getCachedChecklist(tripId)) || [];
        const targetName = (act.payload.name || "").toLowerCase();
        const updated = checklist.map(c => {
          if (c.name.toLowerCase().includes(targetName) || targetName.includes(c.name.toLowerCase())) {
            return { ...c, packed: true };
          }
          return c;
        });
        await cacheChecklistOffline(tripId, updated);
        window.dispatchEvent(new CustomEvent("trip_checklist_updated", { detail: updated }));
      } else if (act.type === "ADD_EXPENSE") {
        const expenses = (await getCachedExpenses(tripId)) || [];
        const newExp = {
          id: `exp-ai-${Date.now()}`,
          trip_id: tripId,
          label: act.payload.label || "Concierge Logged Spend",
          amount: parseFloat(act.payload.amount) || 250,
          category: act.payload.category || "Food",
          paid_by: act.payload.paid_by || "Me",
          created_at: new Date().toISOString(),
        };
        const updated = [newExp, ...expenses];
        await cacheExpensesOffline(tripId, updated);
        await supabase.from("expenses").insert(newExp).catch(() => {});
        window.dispatchEvent(new CustomEvent("trip_expenses_updated", { detail: updated }));
      } else if (act.type === "ADD_JOURNAL") {
        const entries = (await getCachedJournal(tripId)) || [];
        const newEntry = {
          id: `journal-ai-${Date.now()}`,
          trip_id: tripId,
          date: new Date().toISOString().split("T")[0],
          title: act.payload.title || "Concierge Travel Note",
          text: act.payload.text || "",
          location: tripName || "Yatra Stop",
          mood: act.payload.mood || "Wonder",
          created_at: new Date().toISOString(),
        };
        const updated = [newEntry, ...entries];
        await cacheJournalOffline(tripId, updated);
        await supabase.from("journal_entries").insert(newEntry).catch(() => {});
        window.dispatchEvent(new CustomEvent("trip_journal_updated", { detail: updated }));
      } else if (act.type === "OPEN_CHAI_RADAR") {
        window.dispatchEvent(new CustomEvent("open_chai_radar"));
      } else if (act.type === "OPEN_HISAAB_KITAAB") {
        window.dispatchEvent(new CustomEvent("open_hisaab_kitaab"));
      }
    }
  }

  async function send(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    setInput("");

    const userMsg = { role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const history = messages.filter(m => m.role !== "system").slice(-12);
      const res = await fetch("/api/chat-concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tripId, userId: user.id, message: text, history }),
      });
      const data = await res.json();

      // Execute structured actions if any
      if (data.actions && data.actions.length > 0) {
        await executeClientActions(data.actions);
      }

      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: data.reply || "I couldn't get a response. Please try again.",
          actions: data.actions || [],
        },
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "Connection error. Is the API server running?" },
      ]);
    } finally {
      setLoading(false);
    }
  }

  if (!tripId) return null;

  return (
    <>
      {/* ── Floating trigger button ───────────────────────── */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Open concierge"
        className={[
          "fixed bottom-6 right-6 z-50 w-14 h-14 flex items-center justify-center rounded-full",
          "bg-saffron text-white shadow-xl transition-all duration-200 hover:scale-105",
          "focus-visible:outline-2 focus-visible:outline-offset-2 border-2 border-sand",
          open ? "scale-90 opacity-0 pointer-events-none" : "scale-100 opacity-100",
        ].join(" ")}
      >
        <MessageCircle size={24} />
        {histLoaded && messages.length <= 1 && (
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-teal rounded-full border-2 border-sand animate-pulse" />
        )}
      </button>

      {/* ── Concierge panel ───────────────────────────────── */}
      <div
        className={[
          "fixed bottom-0 right-0 z-50 flex flex-col",
          "w-full sm:w-[26rem] sm:bottom-6 sm:right-6",
          "bg-ivory border-2 border-saffron shadow-2xl",
          "transition-all duration-300 ease-out",
          open
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none",
        ].join(" ")}
        style={{ height: "min(34rem, 90vh)" }}
      >
        {/* Panel header */}
        <div className="bg-teal text-sand px-5 py-4 flex items-center justify-between flex-shrink-0 border-b-2 border-saffron">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-saffron text-white font-display font-bold text-xs flex items-center justify-center">
              TD
            </div>
            <div>
              <p className="font-mono text-[0.6rem] tracking-[0.22em] uppercase text-sand/60">
                Action Concierge · {tripName || "Trip Drip"}
              </p>
              <h3 className="font-display font-semibold text-lg text-sand leading-none">
                AI Travel Butler
              </h3>
            </div>
          </div>
          <button onClick={() => setOpen(false)}
            className="text-sand/60 hover:text-sand transition-colors p-1"
            aria-label="Close concierge">
            <X size={18} />
          </button>
        </div>

        {/* Action Tips Strip */}
        <div className="bg-sand/30 px-4 py-2 border-b border-mist flex items-center justify-between text-[0.65rem] font-mono text-slate/60 flex-shrink-0">
          <span>Try: "Add linen shirt to cart" or "Mark umbrella packed"</span>
          <span className="text-saffron font-bold">⚡ Real Actions</span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0 bg-ivory">
          {messages.map((m, i) => (
            <div key={i} className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}>
              <div className="flex items-start max-w-[85%]">
                {m.role === "assistant" && (
                  <div className="w-6 h-6 bg-teal text-sand flex items-center justify-center flex-shrink-0 mr-2 mt-0.5 text-xs font-mono font-bold">
                    TD
                  </div>
                )}
                <div className={[
                  "px-4 py-3 font-sans text-xs leading-relaxed shadow-xs whitespace-pre-line",
                  m.role === "user"
                    ? "bg-slate text-sand font-medium"
                    : "bg-white border border-mist text-slate",
                ].join(" ")}>
                  <div>{m.content}</div>

                  {/* Action receipt badges */}
                  {m.actions && m.actions.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-mist/50 space-y-1">
                      {m.actions.map((act, ai) => (
                        <div key={ai} className="flex items-center gap-1.5 font-mono text-[0.65rem] text-forest font-semibold bg-forest/10 px-2 py-1">
                          <Check size={12} className="text-forest" />
                          <span>
                            {act.type === "ADD_TO_CART" && `Action Confirmed: Added ${act.payload.name} (${format(act.payload.price)}) to Cart`}
                            {act.type === "MARK_PACKED" && `Action Confirmed: Marked "${act.payload.name}" as Packed`}
                            {act.type === "ADD_EXPENSE" && `Action Confirmed: Logged ${format(act.payload.amount)} Expense (${act.payload.label})`}
                            {act.type === "ADD_JOURNAL" && `Action Confirmed: Saved Memory to Diary`}
                            {act.type === "OPEN_CHAI_RADAR" && `Action Confirmed: Launched Chai & Station Radar`}
                            {act.type === "OPEN_HISAAB_KITAAB" && `Action Confirmed: Launched Hisaab-Kitaab Settle-Up`}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="w-6 h-6 bg-teal text-sand flex items-center justify-center flex-shrink-0 mr-2 mt-0.5 text-xs font-mono font-bold">TD</div>
              <div className="bg-white border border-mist px-4 py-3 flex items-center gap-2">
                <Loader2 size={13} className="text-saffron animate-spin" />
                <span className="font-sans text-xs text-slate/50">Taking action…</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-3 py-1.5 bg-sand/20 border-t border-mist/40 flex items-center gap-1.5 overflow-x-auto no-scrollbar flex-shrink-0">
          {[
            { label: "☕ Chai Radar", prompt: "Show me Chai & Station Radar highway recommendations" },
            { label: "💸 Settle Hisaab", prompt: "How do we settle group expenses via Hisaab-Kitaab?" },
            { label: "🍲 Famous Foods", prompt: `What are the famous food of ${tripName || "this trip"}?` },
            { label: "👗 What to Wear", prompt: `What should I wear in ${tripName || "this destination"}?` },
            { label: "📍 Top Sights", prompt: `What are the best places to visit in ${tripName || "this trip"}?` },
            { label: "🛒 Add Linen Shirt", prompt: "Add Zara Linen Shirt to cart" },
            { label: "💰 Log ₹250 Chai", prompt: "Spent ₹250 on tea and snacks" },
            { label: "✅ Mark Umbrella Packed", prompt: "Mark umbrella as packed" },
          ].map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setInput(chip.prompt);
                setTimeout(() => inputRef.current?.focus(), 50);
              }}
              className="text-[0.65rem] font-sans font-medium bg-white hover:bg-saffron hover:text-white text-slate/70 px-2.5 py-1 border border-mist hover:border-saffron transition-all whitespace-nowrap flex-shrink-0 shadow-xs"
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Input */}
        <form onSubmit={send} className="flex items-center gap-2 px-4 py-3 flex-shrink-0 bg-white border-t border-mist">
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask anything or command an action…"
            disabled={loading}
            className="flex-1 bg-transparent font-sans text-xs text-slate placeholder:text-slate/40
                       outline-none border-b border-mist focus:border-saffron pb-1
                       transition-colors disabled:opacity-50"
          />
          <button type="submit" disabled={loading || !input.trim()}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center
                       bg-saffron text-white disabled:opacity-30 hover:bg-saffron/90
                       transition-colors">
            <Send size={13} />
          </button>
        </form>

        {/* Bottom mono label */}
        <div className="bg-sand/20 text-center py-1.5 flex-shrink-0 border-t border-mist/40">
          <p className="font-mono text-[0.55rem] text-slate/40 tracking-widest uppercase">
            Trip Drip AI Concierge · Connected to {tripName}
          </p>
        </div>
      </div>
    </>
  );
}