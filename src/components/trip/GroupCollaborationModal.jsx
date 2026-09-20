import { useState } from "react";
import { X, Copy, Check, Share2, Users, Send, MessageSquare, Plus, UserCheck } from "lucide-react";
import { useCurrency } from "../../contexts/CurrencyContext";

export default function GroupCollaborationModal({
  open,
  onClose,
  trip,
  collaborators = [],
  onAddCollaborator,
}) {
  const { format } = useCurrency();
  const [copied, setCopied] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberBudget, setNewMemberBudget] = useState("");
  const [newMemberItems, setNewMemberItems] = useState("");

  if (!open || !trip) return null;

  const shareToken = trip.share_token || trip.id;
  const origin = typeof window !== "undefined" ? window.location.origin : "https://tripdrip.app";
  const shareLink = `${origin}/join/${shareToken}`;

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareWhatsApp = () => {
    const text = `Join my Indian Yatra to ${trip.destination} on Trip Drip! Plan outfits, split budget & compare shopping options: ${shareLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleManualAdd = (e) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;
    const newMember = {
      id: `member-${Date.now()}`,
      name: newMemberName.trim(),
      budget: parseFloat(newMemberBudget) || 0,
      bringingItems: newMemberItems
        ? newMemberItems.split(",").map((s) => s.trim()).filter(Boolean)
        : ["Power Bank", "First Aid Kit"],
      joinedAt: new Date().toISOString(),
    };
    onAddCollaborator(newMember);
    setNewMemberName("");
    setNewMemberBudget("");
    setNewMemberItems("");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
      <div className="fixed inset-0 bg-slate/75 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="relative bg-ivory border-2 border-saffron shadow-2xl max-w-xl w-full z-10 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-teal p-6 text-sand flex items-center justify-between border-b-2 border-saffron flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sand/20 flex items-center justify-center">
              <Users size={20} className="text-sand" />
            </div>
            <div>
              <p className="font-mono text-[0.65rem] tracking-[0.2em] uppercase text-sand/60">
                Squad Collaboration
              </p>
              <h3 className="font-display font-bold text-2xl text-sand leading-tight">
                Invite Squad to {trip.destination}
              </h3>
            </div>
          </div>
          <button onClick={onClose} className="text-sand/60 hover:text-sand p-2 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {/* Share Link Card */}
          <div className="bg-white border border-mist p-4 space-y-3">
            <p className="font-mono text-xs uppercase tracking-widest text-slate/50">
              Trip Invite Link
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareLink}
                className="flex-1 bg-ivory border border-mist px-3 py-2 font-mono text-xs text-slate select-all focus:outline-none"
              />
              <button
                onClick={copyLink}
                className={`px-4 py-2 font-mono text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  copied ? "bg-forest text-white" : "bg-slate text-sand hover:bg-saffron hover:text-white"
                }`}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? "Copied!" : "Copy Link"}
              </button>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={shareWhatsApp}
                className="w-full bg-[#25D366] text-white font-sans text-xs font-semibold py-2.5 px-4 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                <MessageSquare size={15} />
                <span>Share on WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Current Collaborators Squad List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-display font-semibold text-base text-slate">
                Squad Members ({collaborators.length + 1})
              </h4>
              <span className="font-mono text-xs text-slate/40">
                Group of {trip.group_size || collaborators.length + 1}
              </span>
            </div>

            <div className="space-y-2">
              {/* Trip Creator */}
              <div className="bg-white border border-saffron/40 p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-saffron text-white font-display font-bold text-xs flex items-center justify-center">
                    YOU
                  </div>
                  <div>
                    <p className="font-sans font-semibold text-xs text-slate">Trip Leader (You)</p>
                    <p className="font-mono text-[0.65rem] text-slate/40">Owner · Wardrobe & Budget Synced</p>
                  </div>
                </div>
                <span className="font-mono text-xs font-semibold text-forest">
                  {format(trip.total_budget)}
                </span>
              </div>

              {/* Joined squad members */}
              {collaborators.map((c) => (
                <div key={c.id} className="bg-white border border-mist p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-teal text-sand font-display font-bold text-xs flex items-center justify-center uppercase">
                      {c.name.slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-sans font-semibold text-xs text-slate">{c.name}</p>
                      <p className="font-sans text-[0.65rem] text-slate/40">
                        Bringing: {(c.bringingItems || []).slice(0, 2).join(", ")}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-medium text-slate">
                    {c.budget ? format(c.budget) : "₹0 contribution"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Add Squad Member Manually */}
          <div className="border-t border-mist pt-4 space-y-3">
            <p className="font-mono text-xs uppercase tracking-widest text-slate/50">
              Add Squad Mate Manually
            </p>
            <form onSubmit={handleManualAdd} className="space-y-2.5">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Friend's Name *"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="px-3 py-2 bg-white border border-mist font-sans text-xs text-slate focus:outline-none focus:border-saffron"
                />
                <input
                  type="number"
                  placeholder="Budget share (₹)"
                  value={newMemberBudget}
                  onChange={(e) => setNewMemberBudget(e.target.value)}
                  className="px-3 py-2 bg-white border border-mist font-sans text-xs text-slate focus:outline-none focus:border-saffron"
                />
              </div>
              <input
                type="text"
                placeholder="Items they are bringing (e.g. Umbrella, Trekking Shoes)"
                value={newMemberItems}
                onChange={(e) => setNewMemberItems(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-mist font-sans text-xs text-slate focus:outline-none focus:border-saffron"
              />
              <button
                type="submit"
                disabled={!newMemberName.trim()}
                className="w-full py-2 bg-teal text-sand font-sans text-xs font-semibold hover:bg-slate disabled:opacity-40 transition-colors flex items-center justify-center gap-1.5"
              >
                <Plus size={14} /> Add Squad Member
              </button>
            </form>
          </div>
        </div>

        <div className="bg-sand/20 border-t border-mist p-4 flex justify-end flex-shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate text-sand font-sans text-xs font-semibold hover:bg-saffron hover:text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
