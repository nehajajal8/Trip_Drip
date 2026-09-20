import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft, ShoppingBag, Filter, Search, Star, Layers,
  Truck, Tag, Plus, Check, CheckCircle2, ChevronRight, SlidersHorizontal
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import AppShell from "../components/layout/AppShell";
import ComparisonGrid from "../components/shop/ComparisonGrid";
import ShoppingCartDrawer from "../components/shop/ShoppingCartDrawer";
import { PRODUCT_CATALOG, BRANDS, getBrandComparison } from "../data/productCatalog";
import { useCurrency } from "../contexts/CurrencyContext";
import { cacheCartOffline, getCachedCart, cacheTripOffline, getCachedTrip } from "../services/offlineStorage";

const CATEGORIES = [
  { id: "all", label: "All Items" },
  { id: "short_sleeve_top", label: "Tops & Tees" },
  { id: "long_sleeve_top", label: "Shirts & Overshirts" },
  { id: "trousers", label: "Pants & Trousers" },
  { id: "shorts", label: "Shorts" },
  { id: "shoes", label: "Footwear" },
  { id: "long_sleeve_outwear", label: "Jackets & Outwear" },
  { id: "short_sleeve_dress", label: "Dresses" },
  { id: "accessories", label: "Accessories & Bags" },
];

export default function Shop() {
  const { id: tripId } = useParams();
  const { format } = useCurrency();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([]);

  // Filters
  const [activeBrand, setActiveBrand] = useState("all");
  const [activeCategory, setActiveCategory] = useState("all");
  const [onlyInBudget, setOnlyInBudget] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recommended");
  const [activeTab, setActiveTab] = useState("catalog"); // 'catalog' | 'comparison'

  // Load trip & cart
  useEffect(() => {
    async function load() {
      // 1. Try Supabase
      const { data } = await supabase.from("trips").select("*").eq("id", tripId).single();
      if (data) {
        setTrip(data);
        cacheTripOffline(data);
      } else {
        const cached = await getCachedTrip(tripId);
        if (cached) setTrip(cached);
      }

      // 2. Load Cart
      const cachedCart = await getCachedCart(tripId);
      if (cachedCart) setCart(cachedCart);

      setLoading(false);
    }
    load();
  }, [tripId]);

  // Cart operations
  const handleAddToCart = (product) => {
    const existing = cart.find((i) => i.id === product.id);
    let updated;
    if (existing) {
      updated = cart.map((i) =>
        i.id === product.id ? { ...i, quantity: (i.quantity || 1) + 1 } : i
      );
    } else {
      updated = [...cart, { ...product, quantity: 1 }];
    }
    setCart(updated);
    cacheCartOffline(tripId, updated);
  };

  const handleUpdateQuantity = (itemId, qty) => {
    const updated = cart.map((i) => (i.id === itemId ? { ...i, quantity: qty } : i));
    setCart(updated);
    cacheCartOffline(tripId, updated);
  };

  const handleRemoveItem = (itemId) => {
    const updated = cart.filter((i) => i.id !== itemId);
    setCart(updated);
    cacheCartOffline(tripId, updated);
  };

  const handleClearCart = () => {
    setCart([]);
    cacheCartOffline(tripId, []);
  };

  // Budget calculations
  const totalBudget = parseFloat(trip?.total_budget) || 0;
  const weatherBudget = trip?.weather_json?.budget || {};
  const remainingShoppingBudget = weatherBudget.remainingShoppingBudget || weatherBudget.remainingBudget || Math.round(totalBudget * 0.35) || 5000;
  const cartTotal = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  const remainingLiveBudget = remainingShoppingBudget - cartTotal;

  // Filter Catalog
  const filteredProducts = PRODUCT_CATALOG.filter((product) => {
    if (activeBrand !== "all" && product.brand.toLowerCase() !== activeBrand.toLowerCase()) return false;
    if (activeCategory !== "all") {
      if (activeCategory === "short_sleeve_top" && product.category !== "short_sleeve_top") return false;
      if (activeCategory === "long_sleeve_top" && product.category !== "long_sleeve_top") return false;
      if (activeCategory === "trousers" && product.category !== "trousers") return false;
      if (activeCategory === "shorts" && product.category !== "shorts") return false;
      if (activeCategory === "shoes" && product.category !== "shoes") return false;
      if (activeCategory === "long_sleeve_outwear" && !product.category.includes("outwear")) return false;
      if (activeCategory === "short_sleeve_dress" && !product.category.includes("dress")) return false;
      if (activeCategory === "accessories" && product.category !== "accessories" && product.category !== "hat" && product.category !== "bag") return false;
    }
    if (onlyInBudget && product.price > remainingLiveBudget) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        product.name.toLowerCase().includes(q) ||
        product.brand.toLowerCase().includes(q) ||
        product.material.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  // Sort Catalog
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return 0;
  });

  // Comparison Matrix for active category
  const comparisonMatrix = getBrandComparison(
    activeCategory === "all" ? "short_sleeve_top" : activeCategory,
    remainingLiveBudget
  );

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
                Zara · H&M · Uniqlo · Westside Catalog
              </p>
              <h1
                className="font-display font-bold text-sand leading-none"
                style={{ fontSize: "clamp(2.8rem,6vw,5.5rem)" }}
              >
                Yatra Clothing Store
              </h1>
              <p className="font-sans text-sm text-sand/60 mt-3 max-w-xl">
                Compare side-by-side materials, size ranges, shipping times, and real Indian pricing tailored to your shopping budget.
              </p>
            </div>

            {/* Shopping Budget Ring / Pill */}
            <div className="flex items-center gap-4 bg-white/10 border border-sand/30 px-5 py-3">
              <div>
                <p className="font-mono text-[0.65rem] uppercase tracking-wider text-sand/60">
                  Remaining Shopping Budget
                </p>
                <p className="font-mono text-xl font-bold text-sand">
                  {format(remainingLiveBudget)}
                </p>
              </div>
              <button
                onClick={() => setCartOpen(true)}
                className="bg-saffron text-white font-sans text-xs font-semibold px-4 py-2.5 flex items-center gap-2 hover:bg-saffron/90 transition-colors shadow-sm"
              >
                <ShoppingBag size={15} />
                <span>Cart ({cart.reduce((c, i) => c + (i.quantity || 1), 0)})</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── SUBNAV TABS ───────────────────────────────────────── */}
      <div className="bg-sand/20 border-b border-mist">
        <div className="max-w-content mx-auto px-6 md:px-12 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("catalog")}
              className={`py-3.5 px-4 font-mono text-xs uppercase tracking-wider font-semibold border-b-2 transition-colors ${
                activeTab === "catalog"
                  ? "border-saffron text-slate bg-white/50"
                  : "border-transparent text-slate/50 hover:text-slate"
              }`}
            >
              Full Brand Catalog ({PRODUCT_CATALOG.length})
            </button>
            <button
              onClick={() => setActiveTab("comparison")}
              className={`py-3.5 px-4 font-mono text-xs uppercase tracking-wider font-semibold border-b-2 transition-colors ${
                activeTab === "comparison"
                  ? "border-saffron text-slate bg-white/50"
                  : "border-transparent text-slate/50 hover:text-slate"
              }`}
            >
              Cross-Brand Comparison Grid
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-slate/40">
            <span>Static Local Catalog · Instant Currency FX</span>
          </div>
        </div>
      </div>

      {/* ── BODY ──────────────────────────────────────────────── */}
      <div className="max-w-content mx-auto px-6 md:px-12 py-10 space-y-8">
        {/* Controls / Filter Bar */}
        <div className="bg-white border border-mist p-5 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate/40" />
              <input
                type="text"
                placeholder="Search linen shirts, AIRism tees, cargo pants, shoes…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-ivory border border-mist font-sans text-sm text-slate focus:outline-none focus:border-saffron"
              />
            </div>

            {/* Budget Checkbox & Sort */}
            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer font-sans text-xs text-slate select-none">
                <input
                  type="checkbox"
                  checked={onlyInBudget}
                  onChange={(e) => setOnlyInBudget(e.target.checked)}
                  className="accent-saffron w-4 h-4 cursor-pointer"
                />
                <span className="font-medium">In Shopping Budget Only</span>
              </label>

              <div className="flex items-center gap-2 text-xs font-mono text-slate">
                <span className="text-slate/40">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-ivory border border-mist px-3 py-2 font-sans text-xs text-slate focus:outline-none focus:border-saffron"
                >
                  <option value="recommended">Recommended</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Brand & Category Pills */}
          <div className="flex flex-col gap-3 pt-3 border-t border-mist/50">
            {/* Brands */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[0.65rem] uppercase tracking-widest text-slate/40 mr-1">Brand:</span>
              <button
                onClick={() => setActiveBrand("all")}
                className={`font-mono text-xs px-3 py-1 border transition-colors ${
                  activeBrand === "all" ? "bg-slate text-sand border-slate font-bold" : "bg-white text-slate/60 border-mist hover:border-slate/40"
                }`}
              >
                All Brands
              </button>
              {BRANDS.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setActiveBrand(b.id)}
                  className={`font-mono text-xs px-3 py-1 border transition-colors ${
                    activeBrand === b.id ? "bg-saffron text-white border-saffron font-bold" : "bg-white text-slate/60 border-mist hover:border-slate/40"
                  }`}
                >
                  {b.name}
                </button>
              ))}
            </div>

            {/* Categories */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[0.65rem] uppercase tracking-widest text-slate/40 mr-1">Category:</span>
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveCategory(c.id)}
                  className={`font-mono text-xs px-3 py-1 border transition-colors ${
                    activeCategory === c.id ? "bg-teal text-sand border-teal font-bold" : "bg-white text-slate/60 border-mist hover:border-slate/40"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── VIEW: CROSS-BRAND COMPARISON ── */}
        {activeTab === "comparison" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-2xl text-slate">
                  Side-by-Side Brand Comparison
                </h3>
                <p className="font-sans text-xs text-slate/50 mt-0.5">
                  Category: {CATEGORIES.find((c) => c.id === activeCategory)?.label || "Tops & Tees"}
                </p>
              </div>
              <span className="font-mono text-xs text-slate/40">Zara vs H&M vs Uniqlo vs Westside</span>
            </div>

            <ComparisonGrid
              comparisonItems={comparisonMatrix}
              remainingShoppingBudget={remainingLiveBudget}
              onAddToCart={handleAddToCart}
              cart={cart}
            />
          </div>
        )}

        {/* ── VIEW: FULL CATALOG GRID ── */}
        {activeTab === "catalog" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="font-mono text-xs uppercase tracking-widest text-slate/40">
                Showing {sortedProducts.length} Garment{sortedProducts.length !== 1 ? "s" : ""}
              </p>
              {remainingLiveBudget < 0 && (
                <span className="font-mono text-xs text-crimson font-semibold">
                  ⚠️ Cart is over shopping budget
                </span>
              )}
            </div>

            {sortedProducts.length === 0 ? (
              <div className="py-20 text-center border border-dashed border-mist bg-white">
                <p className="font-display font-semibold text-2xl text-slate mb-2">No matching garments</p>
                <p className="font-sans text-xs text-slate/40 max-w-sm mx-auto mb-4">
                  Try adjusting your search terms, brand filters, or uncheck "In Shopping Budget Only".
                </p>
                <button
                  onClick={() => {
                    setActiveBrand("all");
                    setActiveCategory("all");
                    setOnlyInBudget(false);
                    setSearchQuery("");
                  }}
                  className="px-4 py-2 bg-slate text-sand font-mono text-xs hover:bg-saffron hover:text-white transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {sortedProducts.map((product) => {
                  const inCart = cart.some((c) => c.id === product.id);
                  const inBudget = product.price <= remainingLiveBudget;

                  return (
                    <div
                      key={product.id}
                      className="bg-white border border-mist hover:border-saffron transition-all flex flex-col justify-between group shadow-xs"
                    >
                      <div>
                        {/* Image & Badges */}
                        <div className="relative aspect-[4/3] bg-paper overflow-hidden border-b border-mist">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                          <div className="absolute top-2 left-2">
                            <span className="font-mono text-[0.6rem] bg-slate text-sand px-2 py-0.5 font-bold uppercase tracking-wider">
                              {product.brand}
                            </span>
                          </div>
                          <div className="absolute top-2 right-2">
                            {inBudget ? (
                              <span className="font-mono text-[0.55rem] bg-forest text-white px-2 py-0.5 font-semibold uppercase">
                                In Budget
                              </span>
                            ) : (
                              <span className="font-mono text-[0.55rem] bg-crimson/90 text-white px-2 py-0.5 font-semibold uppercase">
                                Over Budget
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[0.65rem] uppercase tracking-wider text-slate/40">
                              {product.categoryLabel}
                            </span>
                            <div className="flex items-center gap-1 font-mono text-xs text-saffron">
                              <Star size={12} className="fill-current" />
                              <span>{product.rating}</span>
                            </div>
                          </div>

                          <h4 className="font-display font-semibold text-base text-slate leading-snug line-clamp-1">
                            {product.name}
                          </h4>

                          <p className="font-mono text-base font-bold text-slate">
                            {format(product.price)}
                          </p>

                          <p className="font-sans text-xs text-slate/50 line-clamp-2 leading-relaxed">
                            {product.description}
                          </p>

                          {/* Quick spec pills */}
                          <div className="pt-2 border-t border-mist/50 space-y-1 font-mono text-[0.65rem] text-slate/50">
                            <p className="truncate">🧵 {product.material}</p>
                            <p className="truncate">📏 Sizes: {product.sizeRange}</p>
                            <p className="truncate">🚚 {product.shippingTime}</p>
                          </div>
                        </div>
                      </div>

                      {/* Add Button */}
                      <div className="p-4 pt-0">
                        <button
                          onClick={() => handleAddToCart(product)}
                          className={`w-full py-2.5 px-3 font-sans text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                            inCart
                              ? "bg-sand text-slate hover:bg-saffron hover:text-white"
                              : "bg-slate text-sand hover:bg-saffron hover:text-white"
                          }`}
                        >
                          {inCart ? <Check size={14} /> : <Plus size={14} />}
                          <span>{inCart ? "In Cart (+1)" : "Add to Trip Cart"}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Shopping Cart Drawer */}
      <ShoppingCartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        shoppingBudget={remainingShoppingBudget}
      />
    </AppShell>
  );
}
