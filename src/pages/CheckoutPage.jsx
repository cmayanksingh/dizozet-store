import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  CreditCard, 
  Zap, 
  ArrowLeft, 
  Check, 
  AlertCircle,
  Tag,
  Trash2
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import confetti from 'canvas-confetti';

export default function CheckoutPage() {
  const { 
    cart, 
    cartSubtotal, 
    storeConfig, 
    placeOrder,
    appliedCoupon, 
    applyCoupon, 
    removeCoupon, 
    discountAmount, 
    finalTotal,
    removeFromCart
  } = useStore();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    city: ''
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [formError, setFormError] = useState('');
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponMsg, setCouponMsg] = useState('');

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-black text-slate-800">Your Cart is Empty</h2>
        <p className="text-sm text-slate-500">Please add items to your cart before proceeding to checkout.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" /> Go to Store
        </Link>
      </div>
    );
  }

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!customer.name.trim() || !customer.email.trim() || !customer.phone.trim()) {
      setFormError('Please fill in your Name, Email, and WhatsApp phone number.');
      return;
    }

    if (!customer.email.includes('@') || !customer.email.includes('.')) {
      setFormError('Please enter a valid email address for instant digital delivery.');
      return;
    }

    setIsProcessing(true);

    try {
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: finalTotal,
          name: customer.name,
          email: customer.email,
          phone: customer.phone
        })
      });
      const data = await res.json();

      if (!data.success || !data.payment_session_id) {
        throw new Error(data.error || 'Failed to initialize payment gateway session.');
      }

      // Save pending order so OrderConfirmationPage can finalize it on redirect!
      const pendingOrderData = {
        cashfreeOrderId: data.order_id,
        customer,
        items: cart,
        subtotal: cartSubtotal,
        discount: discountAmount,
        couponCode: appliedCoupon ? appliedCoupon.code : null,
        total: finalTotal,
        paymentMethod: 'Cashfree Gateway (Auto-Verified)',
        date: new Date().toISOString()
      };
      try {
        localStorage.setItem('dizozet_pending_order_' + data.order_id, JSON.stringify(pendingOrderData));
        localStorage.setItem('dizozet_last_pending_order', JSON.stringify(pendingOrderData));
      } catch (e) {}

      if (typeof window !== 'undefined' && window.Cashfree) {
        const cashfree = window.Cashfree({ mode: "production" });
        cashfree.checkout({
          paymentSessionId: data.payment_session_id,
          redirectTarget: "_modal"
        }).then((result) => {
          setIsProcessing(false);
          if (result.error) {
            console.warn("Cashfree checkout error:", result.error);
            setFormError(result.error.message || 'Payment was cancelled or interrupted.');
          }
          if (result.paymentDetails) {
            try { confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } }); } catch (e) {}
            const order = placeOrder({
              customer,
              items: cart,
              subtotal: cartSubtotal,
              discount: discountAmount,
              couponCode: appliedCoupon ? appliedCoupon.code : null,
              total: finalTotal,
              paymentMethod: 'Cashfree Gateway (Auto-Verified)',
              paymentDetails: {
                txnId: data.order_id || 'CF-' + Date.now(),
                method: 'cashfree'
              }
            });
            try {
              localStorage.removeItem('dizozet_pending_order_' + data.order_id);
              localStorage.removeItem('dizozet_last_pending_order');
            } catch (e) {}
            navigate(`/order-confirmation/${order.orderId}`, { state: { order } });
          }
        });
      } else {
        // Fallback direct payment URL if modal SDK is blocked
        window.location.href = `https://api.cashfree.com/pg/orders/${data.order_id}`;
      }
    } catch (err) {
      setIsProcessing(false);
      setFormError('Payment Notice: ' + err.message + '. Please try again or reach our WhatsApp support.');
    }
  };

  const cleanPhoneDigits = (customer.phone || '').replace(/\D/g, '').replace(/^91/, '').slice(0, 10);

  return (
    <div className="pb-28 lg:pb-16 pt-4 sm:pt-8 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-4 sm:space-y-8">
      
      {/* Header */}
      <div>
        <Link to="/cart" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-teal-700 mb-1.5 sm:mb-2 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Cart
        </Link>
        <h1 className="text-xl sm:text-3xl font-black text-slate-900">
          Secure Checkout & Instant Delivery
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Enter your delivery details to receive your instant Google Drive download links.
        </p>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-start">
        
        {/* Left Column: Delivery Information Form */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-6">
          
          <div className="bg-white rounded-3xl p-5 sm:p-8 border border-[#a1e3d8]/80 shadow-xs sm:shadow-sm space-y-4">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-full bg-[#a1e3d8] text-slate-950 font-black text-xs flex items-center justify-center">
                  1
                </span>
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  Delivery Information
                </h2>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">
                Strict Verification Active
              </span>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div className="space-y-4">
              
              {/* Field 1: Your Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Your Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter your real full name"
                  value={customer.name}
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                  className="w-full px-4 py-3 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-[#a1e3d8] transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Field 2: Email Address */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">
                    Email Address (For Instant Bundle Delivery) <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[10px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100">
                    Instant Delivery
                  </span>
                </div>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={customer.email}
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                  className="w-full px-4 py-3 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-[#a1e3d8] transition-all placeholder:text-slate-400"
                />
                <p className="text-[11px] text-slate-400">
                  Google Drive bundle link & order details will be sent immediately to this email.
                </p>
              </div>

              {/* Field 3: WhatsApp / Phone Number */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">
                    WhatsApp / Phone Number (10 Digits) <span className="text-red-500">*</span>
                  </label>
                  <span className={`text-[10px] font-semibold ${cleanPhoneDigits.length === 10 ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {cleanPhoneDigits.length}/10 Digits
                  </span>
                </div>
                <div className="flex rounded-xl border border-slate-200 overflow-hidden focus-within:border-teal-500 focus-within:ring-1 focus-within:ring-[#a1e3d8] transition-all bg-white">
                  <span className="inline-flex items-center px-3.5 bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm border-r border-slate-200 select-none">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="9876543210 (10 digits only)"
                    value={cleanPhoneDigits}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setCustomer({ ...customer, phone: val ? '+91 ' + val : '' });
                    }}
                    className="flex-1 px-4 py-3 text-xs sm:text-sm bg-white focus:outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Pay Button Directly Under Form */}
              <div className="pt-2 space-y-2.5">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-4 px-6 bg-[#a1e3d8] hover:bg-[#88dacd] text-slate-950 font-black text-sm sm:text-base rounded-2xl shadow-md shadow-[#a1e3d8]/40 border border-[#88dacd] transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                      Connecting Cashfree Gateway...
                    </span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-slate-950" />
                      <span>Pay {storeConfig.currencySymbol}{Number(finalTotal).toFixed(2)} via Cashfree (Instant Access)</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 font-medium text-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Instant Google Drive Delivery</span>
                  <span>•</span>
                  <span>256-bit SSL Security</span>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-lg font-black text-slate-900">
              Order Summary ({cart.length} item{cart.length > 1 ? 's' : ''})
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">
              Click 🗑️ to remove
            </span>
          </div>

          {/* Cart Items List */}
          <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3 group">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-12 h-12 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-200"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=100&q=80';
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-slate-800 truncate" title={item.title}>
                      {item.title}
                    </h4>
                    {item.planName && (
                      <span className="inline-block mt-0.5 px-2 py-0.5 text-[10px] font-bold text-teal-800 bg-[#a1e3d8]/20 border border-[#a1e3d8] rounded-md">
                        {item.planName}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <span className="text-xs font-black text-slate-900">
                    {storeConfig.currencySymbol}{Number(item.price * (item.quantity || 1)).toFixed(2)}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Promo / Discount Code Section */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <Tag className="w-3.5 h-3.5 text-teal-600" />
              <span>Promo / Discount Code</span>
            </div>
            {appliedCoupon ? (
              <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
                <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                  <span>Coupon: <strong>{appliedCoupon.code}</strong> ({appliedCoupon.discountPercent}% OFF)</span>
                </div>
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="text-red-500 font-bold hover:underline text-[11px]"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="ENTER COUPON CODE"
                  value={couponCodeInput}
                  onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                  className="flex-1 px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold uppercase focus:outline-none focus:border-teal-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!couponCodeInput.trim()) return;
                    const res = applyCoupon(couponCodeInput);
                    setCouponMsg(res.message);
                    if (res.success) setCouponCodeInput('');
                  }}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </div>
            )}
            {couponMsg && (
              <p className="text-[11px] font-semibold text-teal-700">{couponMsg}</p>
            )}
          </div>

          {/* Pricing Totals */}
          <div className="space-y-2 pt-3 border-t border-slate-100 text-xs sm:text-sm text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-slate-900">
                {storeConfig.currencySymbol}{Number(cartSubtotal).toFixed(2)}
              </span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Discount ({appliedCoupon?.code})</span>
                <span>-{storeConfig.currencySymbol}{Number(discountAmount).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-base sm:text-lg font-black pt-2 border-t border-slate-200">
              <span className="text-slate-900">Final Total</span>
              <span className="text-slate-900">
                {storeConfig.currencySymbol}{Number(finalTotal).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Desktop Right Column Pay Button */}
          <button
            type="submit"
            disabled={isProcessing}
            className="hidden lg:flex w-full py-4 px-6 bg-[#a1e3d8] hover:bg-[#88dacd] text-slate-950 font-black text-base rounded-2xl shadow-md shadow-[#a1e3d8]/40 border border-[#88dacd] transition-all items-center justify-center gap-2 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                Connecting Cashfree Gateway...
              </span>
            ) : (
              <>
                <Lock className="w-4 h-4 text-slate-950" />
                <span>Pay {storeConfig.currencySymbol}{Number(finalTotal).toFixed(2)} via Cashfree (Instant Access)</span>
              </>
            )}
          </button>
        </div>

        {/* Mobile Fixed Bottom Pay Bar (Always Fixed at Phone Bottom) */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-3 shadow-[0_-8px_30px_rgba(0,0,0,0.15)]">
          <div className="max-w-md mx-auto space-y-1.5">
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 px-4 bg-[#a1e3d8] hover:bg-[#88dacd] text-slate-950 font-black text-sm sm:text-base rounded-2xl shadow-lg shadow-teal-500/20 border border-[#88dacd] transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                  Connecting Gateway...
                </span>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-slate-950" />
                  <span>Pay {storeConfig.currencySymbol}{Number(finalTotal).toFixed(2)} via Cashfree (Instant Access)</span>
                </>
              )}
            </button>
            <div className="flex items-center justify-center gap-1.5 text-[10.5px] text-slate-500 font-semibold text-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Instant Google Drive Delivery • 256-bit SSL Security</span>
            </div>
          </div>
        </div>

      </form>

    </div>
  );
}
