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

  return (
    <div className="pb-12 sm:pb-20 pt-4 sm:pt-8 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-4 sm:space-y-8">
      
      {/* Header */}
      <div>
        <Link to="/cart" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-teal-700 mb-1.5 sm:mb-2">
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
        
        {/* Left Column: Customer Details & Gateway Security */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-6">
          
          {/* Customer Info Card */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-slate-200 shadow-xs sm:shadow-sm space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 sm:gap-2.5">
                <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#a1e3d8] text-slate-900 font-black text-xs sm:text-sm flex items-center justify-center">
                  1
                </span>
                <h2 className="text-sm sm:text-lg font-black text-slate-900">
                  Customer & Delivery Information
                </h2>
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                <Lock className="w-3 h-3" /> 256-Bit SSL
              </span>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={customer.name}
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Email Address (For Drive Delivery) <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. rahul@gmail.com"
                  value={customer.email}
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  WhatsApp / Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 78957 68118"
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  City / State (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mumbai, Maharashtra"
                  value={customer.city}
                  onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              🔒 Your details are strictly confidential and used only to deliver your digital access links.
            </p>
          </div>

          {/* Clean Payment Gateway Assurance Box */}
          <div className="bg-gradient-to-r from-teal-50/80 via-emerald-50/50 to-teal-50/80 rounded-3xl p-6 border border-teal-200/80 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-teal-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-800 flex items-center justify-center font-bold">
                  <CreditCard className="w-4 h-4 text-teal-700" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900">
                    Auto-Verified Instant Payment Gateway
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Google Pay • PhonePe • Paytm UPI • Cards • NetBanking
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-600" /> Verified
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Click <strong>"Pay Securely"</strong> to complete payment via official Cashfree Gateway. No manual screenshot or UTR number required — instant automated access to Google Drive folders right after payment.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-bold text-slate-700">
              <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs flex items-center gap-1">
                📱 Google Pay
              </span>
              <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs flex items-center gap-1">
                📱 PhonePe
              </span>
              <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs flex items-center gap-1">
                📱 Paytm UPI
              </span>
              <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs flex items-center gap-1">
                💳 All Cards & NetBanking
              </span>
            </div>
          </div>

        </div>

        {/* Right Column: Order Items & Pay Button */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-lg font-black text-slate-900">
              Review Items ({cart.length})
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">
              Click 🗑️ to remove
            </span>
          </div>

          {/* Cart Items List with Cut / Remove Button */}
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
                      <span className="text-[10px] text-teal-800 font-semibold block">
                        {item.planName}
                      </span>
                    )}
                    <span className="text-[11px] text-slate-400">
                      Qty: {item.quantity || 1}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <span className="text-xs font-black text-slate-900">
                    {storeConfig.currencySymbol}{item.price * (item.quantity || 1)}
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

          {/* Coupon Code Section */}
          <div className="pt-2 border-t border-slate-100">
            {appliedCoupon ? (
              <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
                <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                  <Tag className="w-3.5 h-3.5 text-emerald-600" />
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
                  placeholder="Coupon code (e.g. DIZO85)"
                  value={couponCodeInput}
                  onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                  className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold uppercase focus:outline-none focus:border-teal-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!couponCodeInput.trim()) return;
                    const res = applyCoupon(couponCodeInput);
                    setCouponMsg(res.message);
                    if (res.success) setCouponCodeInput('');
                  }}
                  className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors"
                >
                  Apply
                </button>
              </div>
            )}
            {couponMsg && (
              <p className="text-[11px] font-semibold text-teal-700 mt-1">{couponMsg}</p>
            )}
          </div>

          {/* Pricing Totals */}
          <div className="space-y-2 pt-3 border-t border-slate-100 text-xs sm:text-sm text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-slate-900">
                {storeConfig.currencySymbol}{cartSubtotal}
              </span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Discount ({appliedCoupon?.code})</span>
                <span>-{storeConfig.currencySymbol}{discountAmount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Digital Automated Delivery</span>
              <span className="text-emerald-700 font-bold">FREE (Instant)</span>
            </div>
            <div className="flex justify-between text-base sm:text-lg font-black text-slate-900 pt-2 border-t border-slate-200">
              <span>Total Payable</span>
              <span className="text-slate-900">
                {storeConfig.currencySymbol}{finalTotal}
              </span>
            </div>
          </div>

          {/* Pay Button */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-4 px-6 bg-[#a1e3d8] hover:bg-[#7be0d2] text-slate-900 font-black text-base rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                Connecting Secure Gateway...
              </span>
            ) : (
              <>
                <Zap className="w-5 h-5 fill-slate-900" />
                <span>Pay {storeConfig.currencySymbol}{finalTotal} Securely (UPI / Cards)</span>
              </>
            )}
          </button>

          {/* Security & Support Notice */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5 text-[11px] text-slate-500 text-center">
            <div className="font-bold text-slate-700 flex items-center justify-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Instant Drive Delivery & Replacement Warranty
            </div>
            <p>
              Need help? Email: <a href="mailto:dizozet.org@gmail.com" className="text-teal-700 font-bold hover:underline">dizozet.org@gmail.com</a> • WhatsApp: +91 78957 68118
            </p>
          </div>

        </div>

      </form>

    </div>
  );
}
