import { useState } from "react";
import { X, Trash2, ShoppingBag, AlertTriangle, CheckCircle2, ArrowRight, Plus, Minus } from "lucide-react";
import { useCurrency } from "../../contexts/CurrencyContext";

const BRAND_COLORS = {
  Zara: "bg-slate text-sand",
  "H&M": "bg-crimson text-white",
  Uniqlo: "bg-crimson text-white",
  Westside: "bg-teal text-sand",
};

export default function ShoppingCartDrawer({
  open,
  onClose,
  cart = [],
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  shoppingBudget = 0,
}) {
  const { format } = useCurrency();
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  const remainingBudget = shoppingBudget - cartTotal;
  const isOverBudget = remainingBudget < 0;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-ivory border-l border-mist shadow-2xl flex flex-col">
          {/* Header */}
          <div className="bg-teal p-6 text-sand flex items-center justify-between border-b-2 border-saffron flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-sand/20 flex items-center justify-center">
                <ShoppingBag size={18} className="text-sand" />
              </div>
              <div>
                <p className="font-mono text-[0.65rem] tracking-[0.2em] uppercase text-sand/60">Trip Drip Shop</p>
                <h2 className="font-display font-bold text-xl text-sand leading-none">Your Trip Cart</h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-sand/60 hover:text-sand p-1 transition-colors"
              aria-label="Close cart"
            >
              <X size={20} />
            </button>
          </div>

          {/* Budget Live Deduction Bar */}
          <div className={`p-4 border-b transition-colors flex-shrink-0 ${isOverBudget ? "bg-crimson/10 border-crimson/30 text-crimson" : "bg-sand/30 border-mist text-slate"}`}>
            <div className="flex justify-between items-center mb-1">
              <span className="font-mono text-xs uppercase tracking-wider">
                {isOverBudget ? "⚠️ Over Shopping Budget" : "Remaining Shopping Budget"}
              </span>
              <span className={`font-mono text-sm font-bold ${isOverBudget ? "text-crimson" : "text-forest"}`}>
                {isOverBudget ? `-${format(Math.abs(remainingBudget))}` : format(remainingBudget)}
              </span>
            </div>
            <div className="w-full h-1.5 bg-mist overflow-hidden rounded-full mt-2">
              <div
                className={`h-full transition-all duration-500 ${isOverBudget ? "bg-crimson" : "bg-teal"}`}
                style={{ width: `${Math.min(100, shoppingBudget > 0 ? (cartTotal / shoppingBudget) * 100 : 100)}%` }}
              />
            </div>
            {isOverBudget && (
              <p className="font-sans text-[0.7rem] text-crimson mt-2 flex items-center gap-1.5 leading-snug">
                <AlertTriangle size={12} className="flex-shrink-0" />
                Your cart exceeds the calculated shopping budget. Consider alternative options from Westside or H&M.
              </p>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {cart.length === 0 ? (
              <div className="py-16 text-center">
                <div className="w-14 h-14 bg-mist/40 flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag size={24} className="text-slate/30" />
                </div>
                <p className="font-display font-semibold text-xl text-slate mb-1">Cart is empty</p>
                <p className="font-sans text-xs text-slate/40 max-w-xs mx-auto mb-4">
                  Add missing garments and essentials from the clothing comparison engine to pack for your journey.
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="bg-white border border-mist p-3.5 flex gap-3 group relative">
                  {/* Thumbnail */}
                  <div className="w-20 h-24 bg-paper flex-shrink-0 overflow-hidden border border-mist">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className={`font-mono text-[0.6rem] px-1.5 py-0.5 uppercase tracking-wider font-semibold ${BRAND_COLORS[item.brand] || "bg-slate text-white"}`}>
                          {item.brand}
                        </span>
                        <span className="font-mono text-[0.6rem] text-slate/40">
                          {item.sizeRange || "Standard"}
                        </span>
                      </div>
                      <h4 className="font-sans font-semibold text-xs text-slate line-clamp-1 leading-snug">
                        {item.name}
                      </h4>
                      <p className="font-sans text-[0.7rem] text-slate/40 line-clamp-1 mt-0.5">
                        {item.material}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-mist/40">
                      <div className="flex items-center border border-mist">
                        <button
                          onClick={() => onUpdateQuantity(item.id, Math.max(1, (item.quantity || 1) - 1))}
                          className="px-2 py-0.5 text-slate/60 hover:bg-mist/30 text-xs"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={10} />
                        </button>
                        <span className="font-mono text-xs px-2 py-0.5 text-slate font-medium">
                          {item.quantity || 1}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, (item.quantity || 1) + 1)}
                          className="px-2 py-0.5 text-slate/60 hover:bg-mist/30 text-xs"
                          aria-label="Increase quantity"
                        >
                          <Plus size={10} />
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold text-slate">
                          {format(item.price * (item.quantity || 1))}
                        </span>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-slate/30 hover:text-crimson p-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Actions */}
          {cart.length > 0 && (
            <div className="bg-white border-t border-mist p-5 flex-shrink-0 space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-sans text-slate/60">
                  <span>Items in Cart ({cart.reduce((c, i) => c + (i.quantity || 1), 0)})</span>
                  <span className="font-mono font-medium text-slate">{format(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-xs font-sans text-slate/60">
                  <span>Shopping Budget Allocation</span>
                  <span className="font-mono font-medium text-slate">{format(shoppingBudget)}</span>
                </div>
                <div className="flex justify-between font-mono text-sm pt-2 border-t border-mist/60">
                  <span className="font-bold text-slate">Total Cart Spend</span>
                  <span className="font-bold text-saffron">{format(cartTotal)}</span>
                </div>
              </div>

              {checkoutSuccess ? (
                <div className="bg-forest/10 border border-forest/30 text-forest p-3 font-sans text-xs flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  <span>Items marked for packing! Merged with your trip checklist.</span>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setCheckoutSuccess(true);
                      setTimeout(() => {
                        setCheckoutSuccess(false);
                        onClose();
                      }, 1600);
                    }}
                    className="w-full bg-saffron text-white font-display font-bold py-3.5 px-4 text-base hover:bg-saffron/90 transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span>Confirm & Sync to Packing List</span>
                    <ArrowRight size={16} />
                  </button>
                  <button
                    onClick={onClearCart}
                    className="w-full text-center font-mono text-[0.65rem] uppercase tracking-widest text-slate/40 hover:text-crimson transition-colors py-1"
                  >
                    Clear All Cart Items
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
