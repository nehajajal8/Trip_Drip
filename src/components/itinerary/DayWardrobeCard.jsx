import React from "react";
import { Sparkles, Shirt, ShieldCheck, Compass } from "lucide-react";

export default function DayWardrobeCard({ wardrobeAdvice, weatherInfo }) {
  if (!wardrobeAdvice) return null;

  const outfit = typeof wardrobeAdvice === "string" ? wardrobeAdvice : wardrobeAdvice.outfit;
  const layer = typeof wardrobeAdvice === "object" ? wardrobeAdvice.layer : null;
  const footwear = typeof wardrobeAdvice === "object" ? wardrobeAdvice.footwear : null;
  const styleVibe = typeof wardrobeAdvice === "object" ? wardrobeAdvice.styleVibe : "Travel Style";
  const reason = typeof wardrobeAdvice === "object" ? wardrobeAdvice.reason : null;

  return (
    <div className="bg-sand/15 border border-saffron/40 p-4 mt-3 rounded-xs space-y-2.5">
      {/* Badge header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-saffron/20 flex items-center justify-center text-saffron">
            <Sparkles size={12} />
          </div>
          <span className="font-mono text-[0.65rem] uppercase tracking-wider text-saffron font-bold">
            AI Wardrobe & Outfit Recommendation
          </span>
        </div>

        {styleVibe && (
          <span className="font-mono text-[0.6rem] bg-white/80 border border-saffron/30 px-2 py-0.5 text-slate/70">
            {styleVibe}
          </span>
        )}
      </div>

      {/* Recommended Outfit Box */}
      <div className="p-3 bg-white border border-mist/80 rounded-xs shadow-2xs space-y-2">
        <div className="flex items-start gap-2.5">
          <Shirt size={16} className="text-teal flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-sans text-xs font-semibold text-slate leading-snug">
              {outfit}
            </p>
            {layer && (
              <p className="font-sans text-[0.7rem] text-slate/60 mt-1">
                <strong className="font-mono font-normal text-slate/40 uppercase text-[0.6rem] tracking-wider">Layering: </strong>
                {layer}
              </p>
            )}
            {footwear && (
              <p className="font-sans text-[0.7rem] text-slate/60 mt-0.5">
                <strong className="font-mono font-normal text-slate/40 uppercase text-[0.6rem] tracking-wider">Footwear: </strong>
                {footwear}
              </p>
            )}
          </div>
        </div>

        {reason && (
          <div className="pt-2 border-t border-mist/50">
            <p className="font-sans text-[0.68rem] text-slate/55 leading-relaxed italic">
              <span className="font-mono not-italic font-semibold text-saffron uppercase text-[0.6rem] mr-1">
                Context:
              </span>
              {reason}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
