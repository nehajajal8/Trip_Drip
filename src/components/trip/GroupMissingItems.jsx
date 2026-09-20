import { useState } from "react";
import { Users, CheckCircle, AlertCircle, ShoppingBag, ShieldAlert, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function GroupMissingItems({
  tripId,
  collaborators = [],
  missingItems = [],
  onOpenCompare,
}) {
  const groupSize = collaborators.length + 1;

  // Flatten items brought by collaborators
  const broughtItems = [
    { member: "You (Trip Lead)", item: "Primary Wardrobe & First Aid" },
    ...collaborators.flatMap((c) =>
      (c.bringingItems || []).map((item) => ({ member: c.name, item }))
    ),
  ];

  return (
    <div className="bg-white border border-mist">
      {/* Header */}
      <div className="bg-teal p-5 text-sand flex items-center justify-between border-b-2 border-sand/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sand/20 flex items-center justify-center">
            <Users size={20} className="text-sand" />
          </div>
          <div>
            <p className="font-mono text-[0.65rem] tracking-[0.2em] uppercase text-sand/60">
              Squad Gear Check · {groupSize} Travellers
            </p>
            <h3 className="font-display font-bold text-xl text-sand leading-none">
              Group Missing Items & Gear
            </h3>
          </div>
        </div>

        <span className="font-mono text-xs bg-saffron text-white px-3 py-1 font-semibold">
          {missingItems.length} Missing for Squad
        </span>
      </div>

      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: What the Squad is Bringing */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle size={15} className="text-forest" />
            <h4 className="font-mono text-xs uppercase tracking-wider text-slate/60 font-semibold">
              Covered by Squad Members
            </h4>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {broughtItems.map((b, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 bg-ivory border border-mist/60 text-xs">
                <span className="font-sans font-medium text-slate">{b.item}</span>
                <span className="font-mono text-[0.65rem] text-teal font-semibold bg-teal/10 px-2 py-0.5">
                  {b.member}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: What the Squad is Still Missing */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <AlertCircle size={15} className="text-saffron" />
            <h4 className="font-mono text-xs uppercase tracking-wider text-slate/60 font-semibold">
              Still Missing for the Group
            </h4>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {missingItems.length === 0 ? (
              <div className="p-4 bg-forest/5 border border-forest/20 text-forest text-xs font-sans text-center">
                All essential group gear and outfits are covered!
              </div>
            ) : (
              missingItems.map((m, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 bg-crimson/5 border border-crimson/20 text-xs">
                  <div>
                    <span className="font-sans font-medium text-slate block">{m.label || m.category}</span>
                    <span className="font-sans text-[0.65rem] text-slate/50 line-clamp-1">{m.reason}</span>
                  </div>
                  <button
                    onClick={() => onOpenCompare(m.category, m.label, m.reason)}
                    className="flex-shrink-0 ml-2 px-2.5 py-1 bg-slate text-sand font-mono text-[0.65rem] hover:bg-saffron hover:text-white transition-colors"
                  >
                    Compare
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Footer Shop Link */}
      <div className="bg-sand/20 px-5 py-3 border-t border-mist flex items-center justify-between">
        <span className="font-sans text-xs text-slate/60">
          Compare Zara, H&M, Uniqlo & Westside for squad missing gear
        </span>
        <Link
          to={`/trips/${tripId}/shop`}
          className="inline-flex items-center gap-1 font-mono text-xs text-saffron font-bold hover:underline"
        >
          <span>Open Full Store</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}
