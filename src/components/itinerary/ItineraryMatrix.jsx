import React from "react";
import { Train, Utensils, Hotel, ShieldCheck, MapPin, Sparkles, Compass } from "lucide-react";

export default function ItineraryMatrix({ days = [], trip = {}, format }) {
  if (!days || days.length === 0) return null;

  const groupSize = trip.group_size || 1;
  const totalBudget = parseFloat(trip.total_budget) || 0;

  // Derive or extract summary data
  const summary = days.summary || {};
  const bufferAmount = summary.bufferAmount || (totalBudget > 0 ? Math.round(totalBudget * 0.10) : 1000);
  
  // Calculate total of day budgets
  const sumOfDaysGroup = days.reduce((acc, d) => acc + (d.groupBudget || 0), 0);
  const grandTotalGroup = summary.totalGroupBudget || (sumOfDaysGroup + bufferAmount);
  const grandTotalPerPerson = summary.perPersonTotal || Math.round(grandTotalGroup / groupSize);

  const travelNote = summary.travelNote || "Mostly local train + Metro + bus + walking";
  const foodNote = summary.foodNote || "Budget street food & iconic local eateries / dhabas";
  const accommodationNote = summary.accommodationNote || `Not included in ₹${grandTotalGroup.toLocaleString("en-IN")}`;

  return (
    <div className="bg-white border-2 border-saffron shadow-sm overflow-hidden mb-10 animate-enter">
      {/* Header Banner */}
      <div className="bg-teal p-5 md:p-6 text-sand flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Compass size={16} className="text-saffron" />
            <span className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-sand/60">
              Executive Yatra Matrix · Hyper-Local Planning
            </span>
          </div>
          <h2 className="font-display font-bold text-xl md:text-2xl text-sand flex items-center gap-2">
            <span>🌆</span>
            <span>
              {trip.destination} {days.length}-Day Itinerary — {groupSize} People | ₹{grandTotalGroup.toLocaleString("en-IN")}
            </span>
          </h2>
        </div>

        <div className="text-left sm:text-right bg-black/20 px-4 py-2.5 border border-sand/20">
          <p className="font-mono text-[0.65rem] uppercase tracking-wider text-sand/50">Per Person Cost</p>
          <p className="font-display font-bold text-lg md:text-xl text-saffron">
            ~₹{grandTotalPerPerson.toLocaleString("en-IN")} <span className="font-sans text-xs font-normal text-sand/70">for {days.length} days</span>
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-ivory border-b border-mist text-slate/70 font-mono text-[0.7rem] uppercase tracking-wider">
              <th className="py-3 px-4 sm:px-6 w-28">Day</th>
              <th className="py-3 px-4">Places & Sequenced Route</th>
              <th className="py-3 px-4 text-right w-36 sm:w-44">Approx. Group Budget</th>
              <th className="py-3 px-4 text-right w-28 sm:w-36 hidden sm:table-cell">Per Person</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-mist/70 font-sans text-sm">
            {days.map((day, idx) => {
              const dayLabel = day.dayLabel || `Day ${day.day || idx + 1}`;
              const placesStr = String(day.route || (day.places ? day.places.join(" → ") : `Explore ${trip.destination || "India"}`));
              const dayBudget = day.groupBudget || Math.round((grandTotalGroup - bufferAmount) / (days.length || 1));
              const perPerson = day.perPersonBudget || Math.round(dayBudget / groupSize);

              return (
                <tr key={idx} className="hover:bg-sand/10 transition-colors">
                  <td className="py-3.5 px-4 sm:px-6 font-display font-bold text-slate whitespace-nowrap">
                    {dayLabel}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {placesStr.split("→").map((seg, sIdx, arr) => (
                        <React.Fragment key={sIdx}>
                          <span className="bg-ivory border border-mist/80 px-2 py-0.5 rounded-xs text-xs font-medium text-slate">
                            {seg.trim()}
                          </span>
                          {sIdx < arr.length - 1 && (
                            <span className="text-saffron font-bold text-xs">→</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-xs font-bold text-slate">
                    ₹{dayBudget.toLocaleString("en-IN")}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-xs text-slate/60 hidden sm:table-cell">
                    ~₹{perPerson.toLocaleString("en-IN")}
                  </td>
                </tr>
              );
            })}

            {/* Buffer Row */}
            <tr className="bg-sand/15 font-sans font-medium text-slate">
              <td className="py-3 px-4 sm:px-6 font-display font-bold text-saffron whitespace-nowrap">
                Buffer 💰
              </td>
              <td className="py-3 px-4 text-slate/70 text-xs italic">
                Emergency, local tips, extra chai/snacks & miscellaneous
              </td>
              <td className="py-3 px-4 text-right font-mono text-xs font-bold text-saffron">
                ₹{bufferAmount.toLocaleString("en-IN")}
              </td>
              <td className="py-3 px-4 text-right font-mono text-xs text-saffron/80 hidden sm:table-cell">
                ~₹{Math.round(bufferAmount / groupSize).toLocaleString("en-IN")}
              </td>
            </tr>

            {/* Total Row */}
            <tr className="bg-slate text-sand font-display font-bold text-sm">
              <td className="py-3.5 px-4 sm:px-6 uppercase tracking-wider font-mono text-xs">
                Total
              </td>
              <td className="py-3.5 px-4 font-sans font-normal text-xs text-sand/80">
                {groupSize} people / {days.length} days
              </td>
              <td className="py-3.5 px-4 text-right font-mono text-sm text-saffron">
                ₹{grandTotalGroup.toLocaleString("en-IN")}
              </td>
              <td className="py-3.5 px-4 text-right font-mono text-xs text-sand/80 hidden sm:table-cell">
                ~₹{grandTotalPerPerson.toLocaleString("en-IN")} / person
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Footer Badges & Notes */}
      <div className="bg-ivory/80 p-4 md:p-5 border-t border-mist/80 grid grid-cols-1 sm:grid-cols-3 gap-3 font-sans text-xs">
        <div className="flex items-start gap-2.5 p-2.5 bg-white border border-mist/60 shadow-2xs">
          <Train size={16} className="text-teal flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-mono text-[0.6rem] uppercase tracking-wider text-slate/50 block font-semibold">
              🚆 Travel
            </span>
            <p className="text-slate/80 leading-snug">{travelNote}</p>
          </div>
        </div>

        <div className="flex items-start gap-2.5 p-2.5 bg-white border border-mist/60 shadow-2xs">
          <Utensils size={16} className="text-saffron flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-mono text-[0.6rem] uppercase tracking-wider text-slate/50 block font-semibold">
              🍴 Food
            </span>
            <p className="text-slate/80 leading-snug">{foodNote}</p>
          </div>
        </div>

        <div className="flex items-start gap-2.5 p-2.5 bg-white border border-mist/60 shadow-2xs">
          <Hotel size={16} className="text-forest flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-mono text-[0.6rem] uppercase tracking-wider text-slate/50 block font-semibold">
              🏨 Accommodation
            </span>
            <p className="text-slate/80 leading-snug">{accommodationNote}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
