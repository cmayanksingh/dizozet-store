import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  ArrowLeft
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function CartPage() {
  const { cart, removeFromCart, updateCartQuantity, cartSubtotal, storeConfig } = useStore();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-20 h-20 rounded-3xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-800">Your Cart is Currently Empty</h2>
        <p className="text-sm text-slate-500 max-w-sm mx-auto">
          Discover 130+ viral reels bundles and creator toolkits with instant automated delivery.
        </p>
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold text-sm rounded-xl transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-12 sm:pb-20 pt-4 sm:pt-8 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-4 sm:space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-3xl font-black text-slate-900">
          Shopping Cart ({cart.length} {cart.length === 1 ? 'item' : 'items'})
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5 sm:mt-1">
          Review your items before proceeding to instant digital delivery.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-start">
        
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-8 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-slate-200 shadow-xs sm:shadow-sm divide-y divide-slate-100">
          {cart.map((item) => (
            <div key={item.id} className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-20 h-20 rounded-2xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=200&q=80';
                  }}
                />
                <div>
                  <span className="text-[10px] uppercase font-bold text-teal-900 bg-[#a1e3d8]/40 px-2 py-0.5 rounded">
                    {item.type === 'subscription' ? 'Subscription' : item.type === 'reels-bundle' ? 'Reels Bundle' : 'Digital Product'}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base mt-1">
                    {item.title}
                  </h3>
                  {item.planName && (
                    <p className="text-xs font-semibold text-slate-500 mt-0.5">
                      Plan / License: <span className="text-teal-800">{item.planName}</span>
                    </p>
                  )}
                  <div className="text-xs font-extrabold text-slate-900 mt-1 sm:hidden">
                    {storeConfig.currencySymbol}{item.price * (item.quantity || 1)}
                  </div>
                </div>
              </div>

              {/* Quantity and Actions */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50">
                  <button
                    onClick={() => updateCartQuantity(item.id, (item.quantity || 1) - 1)}
                    className="p-1.5 hover:bg-slate-200 text-slate-600 rounded-l-xl"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-extrabold text-slate-800">
                    {item.quantity || 1}
                  </span>
                  <button
                    onClick={() => updateCartQuantity(item.id, (item.quantity || 1) + 1)}
                    className="p-1.5 hover:bg-slate-200 text-slate-600 rounded-r-xl"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right hidden sm:block min-w-[80px]">
                  <div className="text-base font-black text-slate-900">
                    {storeConfig.currencySymbol}{item.price * (item.quantity || 1)}
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">
            Order Summary
          </h3>

          {/* Pricing Calculation (Clean & transparent) */}
          <div className="space-y-2.5 text-xs sm:text-sm text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-slate-900">
                {storeConfig.currencySymbol}{cartSubtotal}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charges</span>
              <span className="text-emerald-700 font-bold">FREE (Instant Automated)</span>
            </div>
            <div className="flex justify-between text-base sm:text-lg font-black text-slate-900 pt-3 border-t border-slate-200">
              <span>Total Payable</span>
              <span className="text-slate-900">
                {storeConfig.currencySymbol}{cartSubtotal}
              </span>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-4 px-6 bg-[#a1e3d8] hover:bg-[#7be0d2] text-slate-900 font-black text-sm sm:text-base rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Trust Guarantees */}
          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Genuine Replacement Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-600" />
              <span>Instant Digital Delivery</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
