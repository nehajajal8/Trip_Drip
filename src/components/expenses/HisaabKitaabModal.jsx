import { useState, useMemo } from "react";
import { X, IndianRupee, QrCode, ArrowRight, Share2, Check, Plus, UserCheck, ShieldAlert, Sparkles, PieChart, Users, CheckCircle2 } from "lucide-react";
import { useCurrency } from "../../contexts/CurrencyContext";

const DEFAULT_MEMBERS = ["You", "Aarav", "Sneha", "Rohan", "Priya"];

export default function HisaabKitaabModal({
  isOpen,
  onClose,
  tripDestination = "India",
  groupSize = 5,
  expenses = [],
  onAddExpense
}) {
  const { format } = useCurrency();
  const [members, setMembers] = useState(() => {
    const count = Math.max(2, parseInt(groupSize) || 4);
    const names = DEFAULT_MEMBERS.slice(0, count);
    while (names.length < count) {
      names.push(`Traveler ${names.length + 1}`);
    }
    return names.map(name => ({
      name,
      upiId: name === "You" ? "myupi@okhdfcbank" : `${name.toLowerCase().replace(/\s+/g, "")}@oksbi`,
    }));
  });

  const [activeUpiPayment, setActiveUpiPayment] = useState(null);
  const [settledMap, setSettledMap] = useState({});
  const [copiedShare, setCopiedShare] = useState(false);

  // New expense inline state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newPaidBy, setNewPaidBy] = useState("You");
  const [newCategory, setNewCategory] = useState("Food");

  // Calculate totals and balances
  const { totalSpend, perPersonFairShare, balances, settlements, categoryTotals } = useMemo(() => {
    const total = expenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
    const mCount = Math.max(1, members.length);
    const fairShare = Math.round(total / mCount);

    // Track how much each member has paid
    const paidByMember = {};
    members.forEach(m => { paidByMember[m.name] = 0; });

    const cats = { Food: 0, Transport: 0, Stay: 0, Sightseeing: 0, Shopping: 0 };

    expenses.forEach(e => {
      const amt = parseFloat(e.amount) || 0;
      const payer = members.find(m => m.name.toLowerCase() === (e.paid_by || "You").toLowerCase())?.name || "You";
      paidByMember[payer] = (paidByMember[payer] || 0) + amt;

      const c = e.category || "Food";
      if (cats[c] !== undefined) cats[c] += amt;
      else cats["Food"] += amt;
    });

    // Net balance = Paid - FairShare
    // Positive means they are owed money; Negative means they owe money
    const bal = members.map(m => {
      const paid = paidByMember[m.name] || 0;
      const net = paid - fairShare;
      return {
        ...m,
        paid,
        net,
      };
    });

    // Optimal settlement algorithm (min-cashflow greedy pairing)
    const debtors = bal.filter(b => b.net < -1).map(b => ({ ...b, net: Math.abs(b.net) }));
    const creditors = bal.filter(b => b.net > 1).map(b => ({ ...b, net: b.net }));

    const plan = [];
    let dIdx = 0;
    let cIdx = 0;

    while (dIdx < debtors.length && cIdx < creditors.length) {
      const debtor = debtors[dIdx];
      const creditor = creditors[cIdx];
      const transferAmount = Math.min(debtor.net, creditor.net);

      if (transferAmount >= 1) {
        plan.push({
          id: `${debtor.name}-${creditor.name}-${Math.round(transferAmount)}`,
          from: debtor.name,
          to: creditor.name,
          amount: Math.round(transferAmount),
          upiId: creditor.upiId || `${creditor.name.toLowerCase()}@okhdfcbank`,
        });
      }

      debtor.net -= transferAmount;
      creditor.net -= transferAmount;

      if (debtor.net < 1) dIdx++;
      if (creditor.net < 1) cIdx++;
    }

    return {
      totalSpend: total,
      perPersonFairShare: fairShare,
      balances: bal,
      settlements: plan,
      categoryTotals: cats,
    };
  }, [expenses, members]);

  if (!isOpen) return null;

  const handleAddExpenseSubmit = (e) => {
    e.preventDefault();
    if (!newLabel.trim() || !newAmount) return;

    if (onAddExpense) {
      onAddExpense({
        id: `exp-${Date.now()}`,
        label: newLabel.trim(),
        amount: parseFloat(newAmount),
        category: newCategory,
        paid_by: newPaidBy,
        created_at: new Date().toISOString(),
      });
    }

    setNewLabel("");
    setNewAmount("");
    setShowAddForm(false);
  };

  const handleShareWhatsApp = () => {
    const text = `💸 *Hisaab-Kitaab: ${tripDestination} Yatra*\n` +
      `Total Spend: ${format(totalSpend)} across ${members.length} friends (${format(perPersonFairShare)} / person)\n\n` +
      `⚖️ *Optimal Settlement Plan:*\n` +
      (settlements.length === 0
        ? `• All expenses are settled up evenly! ✨\n`
        : settlements.map(s => `• ${s.from} pays ${s.to} ${format(s.amount)} (UPI: ${s.upiId})`).join("\n")) +
      `\n\nShared via Trip Drip Hisaab-Kitaab`;

    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  const generateUpiUrl = (item) => {
    const payeeVpa = encodeURIComponent(item.upiId || "traveler@okhdfcbank");
    const payeeName = encodeURIComponent(item.to || "Trip Drip Friend");
    const note = encodeURIComponent(`Trip Drip ${tripDestination} Settlement`);
    return `upi://pay?pa=${payeeVpa}&pn=${payeeName}&am=${item.amount}&cu=INR&tn=${note}`;
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-slate/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-ivory border border-mist shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate text-sand px-6 py-4 flex items-center justify-between border-b border-mist/30 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-forest text-white rounded-none flex items-center justify-center font-display font-bold text-sm shadow-sm">
              ₹
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[0.65rem] tracking-[0.22em] uppercase text-forest font-bold">
                  Squad Ledger
                </span>
                <span className="px-1.5 py-0.2 bg-white/10 text-sand text-[0.6rem] font-mono border border-sand/30">
                  Zero Cashflow Waste
                </span>
              </div>
              <h3 className="font-display font-semibold text-lg text-sand tracking-wide">
                Hisaab-Kitaab · {tripDestination}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-sand/60 hover:text-sand transition-colors p-1.5 hover:bg-sand/10 rounded-sm"
          >
            <X size={18} />
          </button>
        </div>

        {/* Top Summary Banner */}
        <div className="bg-sand/40 border-b border-mist px-6 py-3.5 grid grid-cols-3 gap-2 text-center flex-shrink-0">
          <div>
            <p className="font-mono text-[0.6rem] uppercase tracking-widest text-slate/50">Total Spent</p>
            <p className="font-display font-bold text-base text-slate">{format(totalSpend)}</p>
          </div>
          <div className="border-x border-mist/60">
            <p className="font-mono text-[0.6rem] uppercase tracking-widest text-slate/50">Fair Share / Person</p>
            <p className="font-display font-bold text-base text-forest">{format(perPersonFairShare)}</p>
          </div>
          <div>
            <p className="font-mono text-[0.6rem] uppercase tracking-widest text-slate/50">Settlements Needed</p>
            <p className="font-display font-bold text-base text-saffron">{settlements.length} transfers</p>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Optimal UPI Settlement Plan */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-display font-semibold text-sm text-slate flex items-center gap-1.5">
                <Sparkles size={14} className="text-saffron" />
                Optimal Debt Settlement Plan (Who Pays Whom)
              </h4>
              <span className="font-mono text-[0.65rem] text-slate/40">Minimal Transactions</span>
            </div>

            {settlements.length === 0 ? (
              <div className="bg-white border border-mist p-5 text-center">
                <CheckCircle2 size={24} className="mx-auto text-forest mb-1.5" />
                <p className="font-sans font-medium text-xs text-slate">All caught up! Everyone is even.</p>
                <p className="font-mono text-[0.65rem] text-slate/40 mt-0.5">No pending settlements needed for this trip.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {settlements.map((item) => {
                  const isSettled = settledMap[item.id];
                  const upiLink = generateUpiUrl(item);

                  return (
                    <div
                      key={item.id}
                      className={`p-3.5 border transition-all flex items-center justify-between gap-3 ${
                        isSettled
                          ? "bg-forest/5 border-forest/30 opacity-70"
                          : "bg-white border-mist hover:border-saffron/60 shadow-xs"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-bold ${
                          isSettled ? "bg-forest/20 text-forest" : "bg-saffron/10 text-saffron"
                        }`}>
                          {isSettled ? <Check size={14} /> : "₹"}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 text-xs font-sans font-medium text-slate">
                            <span className="font-bold">{item.from}</span>
                            <ArrowRight size={12} className="text-slate/40" />
                            <span className="font-bold text-forest">{item.to}</span>
                          </div>
                          <p className="font-mono text-[0.62rem] text-slate/50">
                            UPI ID: <span className="text-slate/70">{item.upiId}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-sm text-slate">
                          {format(item.amount)}
                        </span>

                        {!isSettled ? (
                          <>
                            <button
                              onClick={() => setActiveUpiPayment(item)}
                              className="flex items-center gap-1 px-2.5 py-1 text-[0.68rem] font-sans font-semibold bg-forest text-white hover:bg-forest/90 transition-colors shadow-xs"
                            >
                              <QrCode size={12} />
                              Pay UPI
                            </button>
                            <button
                              onClick={() => setSettledMap(prev => ({ ...prev, [item.id]: true }))}
                              className="px-2 py-1 text-[0.65rem] font-mono border border-mist hover:border-forest text-slate/60 hover:text-forest transition-colors bg-sand/10"
                              title="Mark as already paid"
                            >
                              Settled ✓
                            </button>
                          </>
                        ) : (
                          <span className="font-mono text-[0.65rem] font-semibold text-forest flex items-center gap-1">
                            <Check size={12} /> Paid
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Active UPI QR Modal / Drawer Overlay */}
          {activeUpiPayment && (
            <div className="bg-sand/30 border border-saffron/40 p-4 relative animate-in fade-in">
              <button
                onClick={() => setActiveUpiPayment(null)}
                className="absolute top-2 right-2 text-slate/40 hover:text-slate p-1"
              >
                <X size={15} />
              </button>
              <div className="text-center space-y-3">
                <p className="font-mono text-[0.65rem] tracking-widest uppercase text-saffron font-bold">
                  Scan & Pay via GPay / PhonePe / Paytm
                </p>
                <h5 className="font-display font-bold text-sm text-slate">
                  {activeUpiPayment.from} paying {activeUpiPayment.to} · {format(activeUpiPayment.amount)}
                </h5>

                {/* Scannable UPI QR Code */}
                <div className="inline-block p-3 bg-white border border-mist shadow-sm">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(generateUpiUrl(activeUpiPayment))}`}
                    alt="UPI Payment QR Code"
                    className="w-40 h-40 object-contain mx-auto"
                  />
                </div>

                <p className="font-mono text-[0.65rem] text-slate/60">
                  Receiver UPI ID: <strong className="text-slate">{activeUpiPayment.upiId}</strong>
                </p>

                <div className="flex items-center justify-center gap-2 pt-1">
                  <a
                    href={generateUpiUrl(activeUpiPayment)}
                    className="px-4 py-1.5 bg-forest text-white font-sans text-xs font-semibold hover:bg-forest/90 transition-colors shadow-xs"
                  >
                    Open UPI App (Mobile)
                  </a>
                  <button
                    onClick={() => {
                      setSettledMap(prev => ({ ...prev, [activeUpiPayment.id]: true }));
                      setActiveUpiPayment(null);
                    }}
                    className="px-3 py-1.5 bg-white border border-forest text-forest font-sans text-xs hover:bg-forest/10 transition-colors"
                  >
                    Mark as Paid ✓
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Member Balance Breakdown */}
          <div className="space-y-3">
            <h4 className="font-display font-semibold text-sm text-slate">
              Squad Balances ({members.length} Travelers)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {balances.map(b => (
                <div key={b.name} className="p-3 bg-white border border-mist flex items-center justify-between">
                  <div>
                    <p className="font-sans font-semibold text-xs text-slate">{b.name}</p>
                    <p className="font-mono text-[0.62rem] text-slate/50">
                      Paid: {format(b.paid)} · UPI: {b.upiId}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`font-mono text-xs font-bold ${
                      b.net > 0 ? "text-forest" : b.net < 0 ? "text-crimson" : "text-slate/40"
                    }`}>
                      {b.net > 0 ? `+${format(b.net)}` : b.net < 0 ? `-${format(Math.abs(b.net))}` : "Even"}
                    </span>
                    <p className="font-mono text-[0.58rem] text-slate/40">
                      {b.net > 0 ? "Gets back" : b.net < 0 ? "Owes squad" : "Settled"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Expense Add Form */}
          <div className="pt-2 border-t border-mist/40">
            {!showAddForm ? (
              <button
                onClick={() => setShowAddForm(true)}
                className="w-full py-2.5 border border-dashed border-saffron/60 text-saffron hover:bg-saffron/5 font-sans text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus size={14} />
                Add Shared Expense to Hisaab
              </button>
            ) : (
              <form onSubmit={handleAddExpenseSubmit} className="bg-white border border-mist p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="font-sans font-semibold text-xs text-slate">Add New Squad Expense</p>
                  <button type="button" onClick={() => setShowAddForm(false)} className="text-slate/40 hover:text-slate">
                    <X size={14} />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Expense title (e.g. Chai & Samosa)"
                    value={newLabel}
                    onChange={e => setNewLabel(e.target.value)}
                    required
                    className="px-3 py-1.5 border border-mist font-sans text-xs focus:border-saffron outline-none"
                  />
                  <input
                    type="number"
                    placeholder="Amount in ₹"
                    value={newAmount}
                    onChange={e => setNewAmount(e.target.value)}
                    required
                    className="px-3 py-1.5 border border-mist font-sans text-xs focus:border-saffron outline-none"
                  />
                  <select
                    value={newPaidBy}
                    onChange={e => setNewPaidBy(e.target.value)}
                    className="px-2 py-1.5 border border-mist font-sans text-xs focus:border-saffron outline-none bg-white"
                  >
                    {members.map(m => (
                      <option key={m.name} value={m.name}>Paid by: {m.name}</option>
                    ))}
                  </select>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    className="px-2 py-1.5 border border-mist font-sans text-xs focus:border-saffron outline-none bg-white"
                  >
                    <option value="Food">Category: Chai & Food</option>
                    <option value="Transport">Category: Transit / Taxi</option>
                    <option value="Stay">Category: Lodging</option>
                    <option value="Sightseeing">Category: Monuments / Tickets</option>
                    <option value="Shopping">Category: Bazaar Shopping</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full py-1.5 bg-forest text-white font-sans text-xs font-semibold hover:bg-forest/90 transition-colors shadow-xs"
                >
                  Save & Split Evenly
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Footer Actions */}
        <div className="bg-sand/20 border-t border-mist px-6 py-3 flex items-center justify-between flex-shrink-0">
          <button
            onClick={handleShareWhatsApp}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366] text-white font-sans text-xs font-medium hover:bg-[#20bd5a] transition-colors shadow-xs"
          >
            <Share2 size={13} />
            {copiedShare ? "Copied to WhatsApp!" : "Share Hisaab on WhatsApp"}
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate text-sand font-sans text-xs hover:bg-slate/90 transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
