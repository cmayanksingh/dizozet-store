import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  CreditCard, 
  QrCode, 
  Zap, 
  ArrowLeft, 
  Check, 
  Copy, 
  Smartphone,
  AlertCircle
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import confetti from 'canvas-confetti';

export default function CheckoutPage() {
  const { cart, cartSubtotal, storeConfig, placeOrder } = useStore();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    state: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('upi-qr'); // 'upi-qr', 'razorpay', 'stripe'
  const [utrNumber, setUtrNumber] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formError, setFormError] = useState('');

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

  const finalTotal = cartSubtotal;

  // Dynamic UPI URL & QR
  const upiPayUrl = `upi://pay?pa=${encodeURIComponent(storeConfig.upiId)}&pn=${encodeURIComponent(storeConfig.storeName)}&am=${finalTotal}&cu=INR&tn=${encodeURIComponent('DigiVault Order')}`;
  const qrImageSrc = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiPayUrl)}`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(storeConfig.upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    setFormError('');

    if (!customer.name.trim() || !customer.email.trim() || !customer.phone.trim()) {
      setFormError('Please fill in your Name, Email, and Phone / WhatsApp number.');
      return;
    }

    if (!customer.email.includes('@') || !customer.email.includes('.')) {
      setFormError('Please enter a valid email address for digital delivery.');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // ignore
      }

      const order = placeOrder({
        customer,
        paymentMethod: paymentMethod === 'upi-qr' ? 'UPI QR Code / Apps' : paymentMethod === 'razorpay' ? 'Razorpay (Cards/NetBanking)' : 'Stripe / International Cards',
        paymentDetails: {
          txnId: utrNumber || 'TXN-' + Math.floor(10000000 + Math.random() * 90000000),
          method: paymentMethod
        }
      });

      setIsProcessing(false);
      navigate(`/order-confirmation/${order.orderId}`, { state: { order } });
    }, 1500);
  };

  return (
    <div className="pb-20 pt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header */}
      <div>
        <Link to="/cart" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-teal-700 mb-2">
          <ArrowLeft className="w-4 h-4" /> Back to Cart
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          Secure Checkout & Instant Delivery
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Complete your purchase to receive your instant Google Drive links & digital delivery.
        </p>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Customer Details & Payment Options */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Step 1: Customer Info */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <span className="w-7 h-7 rounded-full bg-[#a1e3d8] text-slate-900 font-black text-sm flex items-center justify-center">
                1
              </span>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                Customer & Delivery Information
              </h2>
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
                  Email Address (For Instant Delivery) <span className="text-red-500">*</span>
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

          {/* Step 2: Payment Method */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-full bg-[#a1e3d8] text-slate-900 font-black text-sm flex items-center justify-center">
                  2
                </span>
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  Select Payment Method
                </h2>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                <Lock className="w-3 h-3" /> 256-Bit SSL
              </span>
            </div>

            {/* Methods Tabs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi-qr')}
                className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  paymentMethod === 'upi-qr'
                    ? 'border-slate-900 bg-[#a1e3d8]/25 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <QrCode className="w-5 h-5 text-teal-700" />
                  <span className="text-[10px] bg-slate-900 text-white font-extrabold px-1.5 py-0.5 rounded">
                    Instant 0% Fee
                  </span>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">UPI QR / GPay</div>
                  <div className="text-[10px] text-slate-500">PhonePe, Paytm, BHIM</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('razorpay')}
                className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  paymentMethod === 'razorpay'
                    ? 'border-slate-900 bg-[#a1e3d8]/25 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <CreditCard className="w-5 h-5 text-slate-700" />
                  <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-1.5 py-0.5 rounded">
                    Cards & NetBanking
                  </span>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Razorpay Gateway</div>
                  <div className="text-[10px] text-slate-500">Debit/Credit cards</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('stripe')}
                className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  paymentMethod === 'stripe'
                    ? 'border-slate-900 bg-[#a1e3d8]/25 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Smartphone className="w-5 h-5 text-slate-700" />
                  <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-1.5 py-0.5 rounded">
                    International
                  </span>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Stripe / Global</div>
                  <div className="text-[10px] text-slate-500">USD & Global Cards</div>
                </div>
              </button>
            </div>

            {/* Content for UPI QR */}
            {paymentMethod === 'upi-qr' && (
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* QR Code Container */}
                  <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm shrink-0">
                    <img
                      src={qrImageSrc}
                      alt="UPI Payment QR Code"
                      className="w-40 h-40 object-contain mx-auto"
                    />
                    <div className="text-[10px] font-bold text-center text-slate-500 mt-1">
                      Scan with any UPI App
                    </div>
                  </div>

                  <div className="space-y-3 flex-1 text-xs text-slate-600">
                    <h4 className="text-sm font-extrabold text-slate-900">
                      Scan QR & Pay {storeConfig.currencySymbol}{finalTotal}
                    </h4>
                    <p className="leading-relaxed">
                      1. Open Google Pay, PhonePe, Paytm, or BHIM.<br />
                      2. Scan this QR code or pay directly to the UPI ID below.<br />
                      3. Click <strong>Verify & Complete Order</strong> below.
                    </p>

                    <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-2.5 max-w-sm">
                      <span className="font-mono font-bold text-teal-800">{storeConfig.upiId}</span>
                      <button
                        type="button"
                        onClick={handleCopyUpi}
                        className="px-2.5 py-1 bg-slate-900 text-white text-[11px] font-bold rounded-lg hover:bg-slate-800 flex items-center gap-1"
                      >
                        {copiedUpi ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        {copiedUpi ? 'Copied' : 'Copy UPI'}
                      </button>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        UTR / Transaction Ref No. (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 412984029102"
                        value={utrNumber}
                        onChange={(e) => setUtrNumber(e.target.value)}
                        className="w-full max-w-sm px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl outline-none focus:border-teal-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Content for Razorpay */}
            {paymentMethod === 'razorpay' && (
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 text-xs text-slate-600">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                  <CreditCard className="w-4 h-4 text-teal-600" />
                  <span>Razorpay Seamless Checkout</span>
                </div>
                <p>
                  Pay via Debit Card, Credit Card, Net Banking (SBI, HDFC, ICICI, Axis), or Wallet.
                </p>
                <div className="p-2.5 bg-white border border-slate-200 rounded-xl text-[11px] flex items-center justify-between text-slate-500">
                  <span>Merchant Key Configured: <code>{storeConfig.razorpayKeyId}</code></span>
                  <span className="text-emerald-600 font-bold">Ready</span>
                </div>
              </div>
            )}

            {/* Content for Stripe */}
            {paymentMethod === 'stripe' && (
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 text-xs text-slate-600">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                  <Smartphone className="w-4 h-4 text-teal-600" />
                  <span>Stripe Global Payments</span>
                </div>
                <p>
                  Supports Visa, MasterCard, American Express, and Apple Pay for international customers.
                </p>
              </div>
            )}

          </div>

        </div>

        {/* Right Column: Order Items & Pay Button */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">
            Review Items ({cart.length})
          </h3>

          <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-12 h-12 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-200"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=100&q=80';
                    }}
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 truncate">
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

                <div className="text-right shrink-0">
                  <span className="text-xs font-black text-slate-900">
                    {storeConfig.currencySymbol}{item.price * (item.quantity || 1)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Totals */}
          <div className="space-y-2 pt-3 border-t border-slate-100 text-xs sm:text-sm text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-slate-900">
                {storeConfig.currencySymbol}{cartSubtotal}
              </span>
            </div>
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
            className="w-full py-4 px-6 bg-[#a1e3d8] hover:bg-[#7be0d2] text-slate-900 font-black text-base rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                Verifying & Generating Links...
              </span>
            ) : (
              <>
                <Zap className="w-5 h-5 fill-slate-900" />
                <span>Verify & Complete Order ({storeConfig.currencySymbol}{finalTotal})</span>
              </>
            )}
          </button>

          {/* Security & Warranty Notice */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5 text-[11px] text-slate-500 text-center">
            <div className="font-bold text-slate-700 flex items-center justify-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Instant Delivery & Replacement Warranty
            </div>
            <p>
              Your Google Drive links will be generated on screen immediately after payment verification.
            </p>
          </div>

        </div>

      </form>

    </div>
  );
}
