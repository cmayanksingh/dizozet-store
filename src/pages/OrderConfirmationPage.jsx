import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  Download, 
  ExternalLink, 
  Copy, 
  Check, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  MessageCircle, 
  Printer, 
  Home, 
  User,
  Tv,
  Film
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import confetti from 'canvas-confetti';

export default function OrderConfirmationPage() {
  const { orderId } = useParams();
  const location = useLocation();
  const { orders, storeConfig } = useStore();

  const [copiedIndex, setCopiedIndex] = useState(-1);

  // Find order from state or context
  const order = location.state?.order || orders.find(o => o.orderId === orderId) || orders[0];

  useEffect(() => {
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 }
      });
    } catch {
      // ignore
    }
  }, []);

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-black text-slate-800">Order Not Found</h2>
        <p className="text-sm text-slate-500">We could not retrieve details for this order ID.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-orange-500 text-white font-bold rounded-xl shadow-glow"
        >
          <Home className="w-4 h-4" /> Go to Home
        </Link>
      </div>
    );
  }

  const handleCopyCredentials = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(-1), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="pb-20 pt-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 print:p-0">
      
      {/* Top Success Card */}
      <div className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 rounded-3xl p-8 sm:p-10 text-white shadow-xl text-center space-y-3 relative overflow-hidden print:bg-none print:text-black print:border">
        <div className="w-16 h-16 rounded-full bg-white text-green-600 flex items-center justify-center mx-auto shadow-lg">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <span className="inline-block bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          ⚡ Payment Successful • Instant Delivery Ready
        </span>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
          Thank You, {order.customer?.name || 'Customer'}!
        </h1>
        <p className="text-sm sm:text-base text-green-50 max-w-xl mx-auto leading-relaxed">
          Your order has been verified and processed. Your digital access links and credentials are ready below and have also been dispatched to <strong className="underline">{order.customer?.email}</strong>.
        </p>

        <div className="pt-2 flex items-center justify-center gap-3 text-xs">
          <span className="bg-black/20 backdrop-blur-sm px-3 py-1 rounded-lg font-mono">
            Order ID: <strong>{order.orderId}</strong>
          </span>
          <span className="bg-black/20 backdrop-blur-sm px-3 py-1 rounded-lg">
            Status: <strong>Delivered</strong>
          </span>
        </div>
      </div>

      {/* INSTANT DIGITAL DELIVERY BOX */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-orange-200/90 shadow-xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-glow shrink-0">
              <Sparkles className="w-6 h-6 fill-white/20" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Your Digital Access & Downloads
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Click the direct Google Drive buttons or copy your access credentials below:
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 print:hidden"
            >
              <Printer className="w-4 h-4" /> Print Receipt
            </button>
          </div>
        </div>

        {/* List of Delivered Items */}
        <div className="space-y-4">
          {order.items.map((item, idx) => {
            const driveLink = item.googleDriveLink || item.downloadUrl || 'https://drive.google.com';
            const isSub = item.type === 'subscription';

            return (
              <div 
                key={idx}
                className="bg-orange-50/50 border border-orange-200 rounded-2xl p-5 sm:p-6 space-y-4 transition-all hover:border-orange-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-16 h-16 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=120&q=80';
                      }}
                    />
                    <div>
                      <span className="text-[10px] uppercase font-extrabold text-orange-600 bg-orange-100 px-2 py-0.5 rounded">
                        {isSub ? 'Subscription Access' : 'Downloadable Asset'}
                      </span>
                      <h3 className="font-extrabold text-slate-900 text-base mt-1">
                        {item.title}
                      </h3>
                      {item.planName && (
                        <p className="text-xs font-semibold text-slate-500">
                          Option: <span className="text-orange-600">{item.planName}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions for this item */}
                  <div className="flex items-center gap-2 shrink-0">
                    {!isSub && (
                      <a
                        href={driveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-glow transition-all flex items-center gap-1.5"
                      >
                        <Download className="w-4 h-4" />
                        <span>Open Google Drive</span>
                        <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Delivery details / Credentials Display */}
                {isSub ? (
                  <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                        <Tv className="w-4 h-4 text-orange-500" />
                        Login Credentials & Activation Details:
                      </span>
                      <button
                        onClick={() => handleCopyCredentials(item.deliveryInfo, idx)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-orange-50 hover:text-orange-600 text-slate-700 text-xs font-bold rounded-lg transition-all flex items-center gap-1"
                      >
                        {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedIndex === idx ? 'Copied!' : 'Copy Info'}
                      </button>
                    </div>
                    <pre className="text-xs font-mono bg-slate-50 p-3 rounded-lg text-slate-800 whitespace-pre-wrap leading-relaxed border border-slate-100">
                      {item.deliveryInfo}
                    </pre>
                    <p className="text-[11px] text-slate-500">
                      💡 Follow these credentials to log in. In case of any profile lock or password sync, our WhatsApp team is ready to assist instantly.
                    </p>
                  </div>
                ) : (
                  <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-slate-700 font-mono truncate max-w-md">
                      <span className="font-bold text-slate-500">Link:</span>
                      <span className="text-orange-600 truncate">{driveLink}</span>
                    </div>
                    <button
                      onClick={() => handleCopyCredentials(driveLink, idx)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-orange-50 hover:text-orange-600 text-slate-700 text-xs font-bold rounded-lg transition-all flex items-center gap-1 shrink-0"
                    >
                      {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedIndex === idx ? 'Copied' : 'Copy Link'}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Assistance strip */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-800">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <MessageCircle className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold block text-sm">Need Help Activating or Downloading?</span>
              <span>Our support engineers are available on WhatsApp 24/7 to help you step-by-step.</span>
            </div>
          </div>
          <a
            href={`https://wa.me/919876543210?text=Hi%2C%20I%20just%20placed%20order%20${order.orderId}%20and%20need%20quick%20help.`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-sm transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            WhatsApp Support
          </a>
        </div>

      </div>

      {/* Invoice Breakdown Details */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4 text-xs sm:text-sm">
        <h3 className="font-black text-slate-900 text-base border-b border-slate-100 pb-3">
          Order Summary & Payment Receipt
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-slate-600 py-2">
          <div>
            <div className="text-slate-400 text-xs">Customer Name</div>
            <div className="font-bold text-slate-900 mt-0.5">{order.customer?.name}</div>
          </div>
          <div>
            <div className="text-slate-400 text-xs">Delivery Email</div>
            <div className="font-bold text-slate-900 mt-0.5">{order.customer?.email}</div>
          </div>
          <div>
            <div className="text-slate-400 text-xs">Payment Method</div>
            <div className="font-bold text-slate-900 mt-0.5">{order.paymentMethod}</div>
          </div>
          <div>
            <div className="text-slate-400 text-xs">Order Date</div>
            <div className="font-bold text-slate-900 mt-0.5">{new Date(order.date).toLocaleDateString()}</div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 space-y-2">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal</span>
            <span>{storeConfig.currencySymbol}{order.subtotal}</span>
          </div>
          {order.discountAmount > 0 && (
            <div className="flex justify-between text-green-600 font-bold">
              <span>Coupon Discount</span>
              <span>-{storeConfig.currencySymbol}{order.discountAmount}</span>
            </div>
          )}
          <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
            <span>Total Paid</span>
            <span className="text-orange-600">{storeConfig.currencySymbol}{order.total}</span>
          </div>
        </div>
      </div>

      {/* Bottom Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 print:hidden">
        <Link
          to="/orders"
          className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2"
        >
          <User className="w-4 h-4" /> View in My Orders
        </Link>
        <Link
          to="/"
          className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-orange-50 text-slate-800 hover:text-orange-600 font-bold text-xs sm:text-sm rounded-xl border border-slate-200 hover:border-orange-200 transition-all flex items-center justify-center gap-2"
        >
          <Home className="w-4 h-4" /> Continue Shopping
        </Link>
      </div>

    </div>
  );
}
