import { useState } from "react";
import { X, Coffee, Train, ShieldCheck, Droplets, MapPin, Search, Check, Sparkles, ExternalLink, Share2 } from "lucide-react";
import { CHAI_STATION_RADAR, getRadarStopsForDestination } from "../../data/chaiStationRadarData";

export default function ChaiStationRadarModal({ isOpen, onClose, destination = "India" }) {
  const [filterTag, setFilterTag] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  if (!isOpen) return null;

  const destinationStops = getRadarStopsForDestination(destination);

  const filteredStops = destinationStops.filter(stop => {
    const matchesTag = filterTag === "All" || stop.tags.includes(filterTag);
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q ||
      stop.name.toLowerCase().includes(q) ||
      stop.city.toLowerCase().includes(q) ||
      stop.famousFoods.some(f => f.name.toLowerCase().includes(q) || f.desc.toLowerCase().includes(q)) ||
      stop.chaiSpecialty.name.toLowerCase().includes(q);
    return matchesTag && matchesSearch;
  });

  const handleCopyGuide = (stop) => {
    const text = `🚆 *${stop.name} (${stop.city})*\n` +
      `📍 Route: ${stop.route}\n` +
      `☕ Chai Specialty: ${stop.chaiSpecialty.name} (${stop.chaiSpecialty.price}) — ${stop.chaiSpecialty.desc}\n` +
      `🍴 Must-Eats:\n` +
      stop.famousFoods.map(f => `  • ${f.name} (${f.price}) - ${f.desc}`).join("\n") + "\n" +
      `🛡️ Hygiene Tip: ${stop.hygieneTip}\n` +
      `Shared via Trip Drip Chai & Station Radar`;

    navigator.clipboard.writeText(text);
    setCopiedId(stop.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-slate/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-ivory border border-mist shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header with Indian Railway Aesthetic */}
        <div className="bg-slate text-sand px-6 py-4 flex items-center justify-between border-b border-mist/30 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-saffron text-white rounded-none flex items-center justify-center font-display font-bold text-sm shadow-sm">
              <Coffee size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[0.65rem] tracking-[0.22em] uppercase text-saffron font-bold">
                  Transit Food Intelligence
                </span>
                <span className="px-1.5 py-0.2 bg-teal/20 text-teal text-[0.6rem] font-mono border border-teal/40">
                  IRCTC & Highway
                </span>
              </div>
              <h3 className="font-display font-semibold text-lg text-sand tracking-wide">
                Chai & Station Radar · {destination}
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

        {/* Filter Bar & Search */}
        <div className="bg-sand/30 border-b border-mist px-6 py-3 flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {["All", "Chai Spot", "Station Legend", "Highway Dhaba"].map(tag => (
              <button
                key={tag}
                onClick={() => setFilterTag(tag)}
                className={`px-3 py-1 font-sans text-xs transition-colors whitespace-nowrap border ${
                  filterTag === tag
                    ? "bg-saffron text-white border-saffron font-medium shadow-xs"
                    : "bg-white text-slate/70 border-mist hover:border-saffron/60"
                }`}
              >
                {tag === "All" ? "All Halts" : tag}
              </button>
            ))}
          </div>

          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate/40" />
            <input
              type="text"
              placeholder="Search station, chai, or dish…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-mist pl-8 pr-3 py-1.5 font-sans text-xs text-slate placeholder:text-slate/40 focus:border-saffron outline-none transition-colors"
            />
          </div>
        </div>

        {/* Stops List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {filteredStops.length === 0 ? (
            <div className="text-center py-12">
              <Coffee size={32} className="mx-auto text-slate/30 mb-2" />
              <p className="font-display font-medium text-slate/60 text-sm">No transit food halts found</p>
              <p className="font-mono text-xs text-slate/40 mt-1">Try clearing your search query or selecting All Halts.</p>
            </div>
          ) : (
            filteredStops.map(stop => (
              <div
                key={stop.id}
                className="bg-white border border-mist p-5 hover:border-saffron/60 transition-all shadow-xs space-y-4 group"
              >
                {/* Station Title & Tags */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[0.65rem] text-teal font-semibold flex items-center gap-1">
                        <Train size={11} />
                        {stop.type} · {stop.city}
                      </span>
                      <span className="text-slate/20">•</span>
                      <span className="font-mono text-[0.65rem] text-slate/40">
                        {stop.route}
                      </span>
                    </div>
                    <h4 className="font-display font-semibold text-base text-slate group-hover:text-saffron transition-colors">
                      {stop.name}
                    </h4>
                  </div>

                  <button
                    onClick={() => handleCopyGuide(stop)}
                    className="flex items-center gap-1 px-2.5 py-1 text-[0.65rem] font-mono border border-mist hover:border-saffron text-slate/60 hover:text-saffron transition-colors bg-sand/20"
                    title="Copy full food guide for WhatsApp"
                  >
                    {copiedId === stop.id ? (
                      <>
                        <Check size={11} className="text-forest" />
                        <span className="text-forest">Copied Guide!</span>
                      </>
                    ) : (
                      <>
                        <Share2 size={11} />
                        <span>Share Guide</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Signature Chai Special Highlight */}
                <div className="bg-sand/30 border border-mist/60 p-3.5 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-saffron/10 text-saffron flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">
                    ☕
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-sans font-semibold text-xs text-slate">
                        Signature Brew: {stop.chaiSpecialty.name}
                      </span>
                      <span className="font-mono text-[0.65rem] font-bold text-saffron bg-white px-2 py-0.5 border border-mist">
                        {stop.chaiSpecialty.price}
                      </span>
                    </div>
                    <p className="font-sans text-xs text-slate/70 mt-0.5 leading-relaxed">
                      {stop.chaiSpecialty.desc}
                    </p>
                  </div>
                </div>

                {/* Famous Foods Grid */}
                <div>
                  <p className="font-mono text-[0.65rem] tracking-wider uppercase text-slate/40 mb-2.5">
                    Must-Try Station Specialties
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                    {stop.famousFoods.map((f, i) => (
                      <div key={i} className="p-3 bg-sand/10 border border-mist/50 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="font-sans font-medium text-xs text-slate line-clamp-1">{f.name}</span>
                            <span className="font-mono text-[0.6rem] font-semibold text-forest flex-shrink-0">{f.price}</span>
                          </div>
                          <p className="font-sans text-[0.68rem] text-slate/60 leading-relaxed line-clamp-3">
                            {f.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hygiene & Verified Facilities Badges */}
                <div className="pt-3 border-t border-mist/40 flex flex-wrap items-center justify-between gap-2 text-[0.65rem] font-mono">
                  <div className="flex items-center gap-3">
                    {stop.cleanWashrooms && (
                      <span className="flex items-center gap-1 text-forest">
                        <ShieldCheck size={12} />
                        Clean Restrooms Verified
                      </span>
                    )}
                    {stop.mineralWaterVerified && (
                      <span className="flex items-center gap-1 text-teal">
                        <Droplets size={12} />
                        Rail Neer / Mineral Water Authorized
                      </span>
                    )}
                  </div>
                  <span className="text-slate/50 italic text-[0.6rem] max-w-sm text-right">
                    Tip: {stop.hygieneTip}
                  </span>
                </div>

              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="bg-sand/20 border-t border-mist px-6 py-2.5 flex items-center justify-between text-[0.65rem] font-mono text-slate/50 flex-shrink-0">
          <span>Curated for Indian Railways & National Highways</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-slate text-sand font-sans text-xs hover:bg-slate/90 transition-colors"
          >
            Close Radar
          </button>
        </div>
      </div>
    </div>
  );
}
