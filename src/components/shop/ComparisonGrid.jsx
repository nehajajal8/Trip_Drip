import { useState } from "react";
import { Check, ShoppingBag, Truck, Tag, Layers, Star, Plus, CheckCircle2, AlertCircle } from "lucide-react";
import { useCurrency } from "../../contexts/CurrencyContext";

const BRAND_THEMES = {
  Zara: {
    bg: "bg-slate",
    text: "text-sand",
    border: "border-slate",
    accent: "text-sand",
  },
  "H&M": {
    bg: "bg-crimson",
    text: "text-white",
    border: "border-crimson",
    accent: "text-white",
  },
  Uniqlo: {
    bg: "bg-crimson",
    text: "text-white",
    border: "border-crimson",
    accent: "text-white",
  },
  Westside: {
    bg: "bg-teal",
    text: "text-sand",
    border: "border-teal",
    accent: "text-sand",
  },
};

export default function ComparisonGrid({
  comparisonItems = [],
  remainingShoppingBudget = Infinity,
  onAddToCart,
  cart = [],
}) {
  const { format } = useCurrency();
  const [addedMap, setAddedMap] = useState({});

  const handleAdd = (item) => {
    if (!item) return;
    onAddToCart(item);
    setAddedMap((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [item.id]: false }));
    }, 2000);
  };

  const isInCart = (itemId) => cart.some((c) => c.id === itemId);

  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="min-w-[720px] grid grid-cols-4 gap-4">
        {comparisonItems.map(({ brand, item, inBudget, alternatives }) => {
          const theme = BRAND_THEMES[brand] || BRAND_THEMES.Zara;
          if (!item) {
            return (
              <div key={brand} className="bg-white border border-dashed border-mist p-5 flex flex-col items-center justify-center text-center h-80">
                <span className={`font-mono text-xs px-2.5 py-1 ${theme.bg} ${theme.text} mb-3 font-semibold`}>
                  {brand}
                </span>
                <p className="font-sans text-xs text-slate/40">No exact match for this category</p>
              </div>
            );
          }

          const alreadyInCart = isInCart(item.id);
          const justAdded = addedMap[item.id];
          const fitsBudget = item.price <= remainingShoppingBudget;

          return (
            <div
              key={brand}
              className={`bg-white border transition-all flex flex-col justify-between group ${
                fitsBudget ? "border-mist hover:border-saffron shadow-xs" : "border-mist/60 opacity-90"
              }`}
            >
              {/* Brand Top Ribbon */}
              <div>
                <div className={`${theme.bg} ${theme.text} px-4 py-2.5 flex items-center justify-between`}>
                  <span className="font-display font-bold text-sm tracking-wide">{brand}</span>
                  <div className="flex items-center gap-1 font-mono text-[0.65rem]">
                    <Star size={11} className="fill-current text-saffron" />
                    <span>{item.rating}</span>
                  </div>
                </div>

                {/* Product Image */}
                <div className="relative aspect-[4/3] bg-paper overflow-hidden border-b border-mist">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  {/* Budget Fit Badge */}
                  <div className="absolute top-2 right-2">
                    {fitsBudget ? (
                      <span className="bg-forest text-white font-mono text-[0.6rem] px-2 py-0.5 font-semibold tracking-wider uppercase shadow-xs">
                        In Budget
                      </span>
                    ) : (
                      <span className="bg-crimson/90 text-white font-mono text-[0.6rem] px-2 py-0.5 font-semibold tracking-wider uppercase shadow-xs">
                        Over Budget
                      </span>
                    )}
                  </div>
                </div>

                {/* Product Specs Matrix */}
                <div className="p-4 space-y-3">
                  <div>
                    <h4 className="font-display font-semibold text-sm text-slate leading-tight mb-1 line-clamp-2">
                      {item.name}
                    </h4>
                    <p className="font-mono text-base font-bold text-slate">
                      {format(item.price)}
                    </p>
                  </div>

                  {/* Comparison Rows */}
                  <div className="space-y-2 pt-2 border-t border-mist/50 text-xs font-sans">
                    {/* Material */}
                    <div className="flex items-start gap-2 text-slate/70">
                      <Layers size={13} className="text-saffron flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-mono text-[0.6rem] uppercase tracking-wider text-slate/40 block">Material</span>
                        <span className="leading-tight text-[0.75rem] font-medium text-slate">{item.material}</span>
                      </div>
                    </div>

                    {/* Size Range */}
                    <div className="flex items-start gap-2 text-slate/70">
                      <Tag size={13} className="text-teal flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-mono text-[0.6rem] uppercase tracking-wider text-slate/40 block">Size Range</span>
                        <span className="leading-tight text-[0.75rem] font-mono text-slate">{item.sizeRange}</span>
                      </div>
                    </div>

                    {/* Shipping Time */}
                    <div className="flex items-start gap-2 text-slate/70">
                      <Truck size={13} className="text-forest flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-mono text-[0.6rem] uppercase tracking-wider text-slate/40 block">Shipping Time</span>
                        <span className="leading-tight text-[0.75rem] text-slate">{item.shippingTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-4 pt-0">
                <button
                  onClick={() => handleAdd(item)}
                  disabled={justAdded}
                  className={`w-full py-2.5 px-3 font-sans text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                    justAdded
                      ? "bg-forest text-white"
                      : alreadyInCart
                      ? "bg-sand text-slate hover:bg-saffron hover:text-white"
                      : "bg-slate text-sand hover:bg-saffron hover:text-white"
                  }`}
                >
                  {justAdded ? (
                    <>
                      <CheckCircle2 size={14} /> Added to Cart!
                    </>
                  ) : alreadyInCart ? (
                    <>
                      <Check size={14} /> In Cart (+1)
                    </>
                  ) : (
                    <>
                      <Plus size={14} /> Add to Trip Cart
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
