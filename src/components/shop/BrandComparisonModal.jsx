import { useState } from "react";
import { X, ArrowRight, ShoppingBag } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import ComparisonGrid from "./ComparisonGrid";
import { getBrandComparison } from "../../data/productCatalog";
import { useCurrency } from "../../contexts/CurrencyContext";

export default function BrandComparisonModal({
  open,
  onClose,
  category = "short_sleeve_top",
  categoryLabel = "Garment Option",
  reason = "",
  remainingShoppingBudget = 10000,
  onAddToCart,
  cart = [],
}) {
  const { id: tripId } = useParams();
  const { format } = useCurrency();
  const [selectedSort, setSelectedSort] = useState("recommended");

  if (!open) return null;

  const comparison = getBrandComparison(category, remainingShoppingBudget);

  // Sorting
  const sortedComparison = [...comparison].sort((a, b) => {
    if (!a.item) return 1;
    if (!b.item) return -1;
    if (selectedSort === "price-asc") return a.item.price - b.item.price;
    if (selectedSort === "price-desc") return b.item.price - a.item.price;
    if (selectedSort === "rating") return b.item.rating - a.item.rating;
    return 0;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 md:p-10">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate/75 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-ivory border-2 border-saffron shadow-2xl max-w-5xl w-full z-10 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-teal p-6 text-sand flex items-center justify-between border-b-2 border-sand/30 flex-shrink-0">
          <div>
            <p className="font-mono text-[0.65rem] tracking-[0.25em] uppercase text-sand/60">
              Cross-Brand Comparison Engine
            </p>
            <h3 className="font-display font-bold text-2xl text-sand leading-tight">
              Compare {categoryLabel}: Zara vs H&M vs Uniqlo vs Westside
            </h3>
            {reason && (
              <p className="font-sans text-xs text-sand/80 mt-1 max-w-xl">
                {reason}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-sand/60 hover:text-sand p-2 transition-colors"
            aria-label="Close"
          >
            <X size={22} />
          </button>
        </div>

        {/* Controls bar */}
        <div className="bg-sand/30 px-6 py-3 border-b border-mist flex flex-wrap items-center justify-between gap-4 flex-shrink-0 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-slate/50 uppercase">Remaining Shopping Budget:</span>
            <span className="font-bold text-slate">{format(remainingShoppingBudget)}</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-slate/50">Sort:</span>
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="bg-white border border-mist px-2.5 py-1 text-slate font-sans focus:outline-none focus:border-saffron text-xs"
              >
                <option value="recommended">Recommended</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            <Link
              to={`/trips/${tripId}/shop`}
              onClick={onClose}
              className="inline-flex items-center gap-1 text-saffron hover:underline font-semibold"
            >
              <span>Full Catalog</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* Modal Body Comparison Grid */}
        <div className="p-6 overflow-y-auto flex-1">
          <ComparisonGrid
            comparisonItems={sortedComparison}
            remainingShoppingBudget={remainingShoppingBudget}
            onAddToCart={onAddToCart}
            cart={cart}
          />
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-mist px-6 py-4 flex items-center justify-between flex-shrink-0">
          <p className="font-mono text-[0.65rem] text-slate/40 tracking-wider">
            Static local JSON catalog · No live scraping · Instant budget updates
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate text-sand font-sans text-xs font-semibold hover:bg-saffron hover:text-white transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
