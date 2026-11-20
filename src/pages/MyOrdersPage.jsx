import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Search, 
  ExternalLink, 
  Download, 
  Clock, 
  CheckCircle2, 
  Copy, 
  Check, 
  ChevronRight,
  ShieldCheck,
  User,
  ArrowRight
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function MyOrdersPage() {
  const { orders, storeConfig } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState('');

  const filteredOrders = orders.filter(o => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      o.orderId.toLowerCase().includes(term) ||
      o.customer?.email?.toLowerCase().includes(term) ||
      o.customer?.name?.toLowerCase().includes(term) ||
      o.items?.some(i => i.title.toLowerCase().includes(term))
    );
  });

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(''), 2000);
  };

  return (
    <div className="pb-20 pt-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            My Orders & Digital Downloads
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Access your purchased reels bundles, subscription logins, and digital downloads anytime.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by Order ID, Email or Product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 font-medium"
          />
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-400 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No orders found</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            {searchTerm ? `No orders matched "${searchTerm}".` : "You haven't placed any orders yet. Browse our collections and start creating!"}
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-orange-500 text-white font-bold text-xs rounded-xl shadow-glow"
          >
            Explore Store
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div 
              key={order.orderId}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden hover:border-orange-300 transition-all"
            >
              {/* Order Header Bar */}
              <div className="p-5 sm:p-6 bg-slate-50/70 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono font-black text-slate-900 text-sm">
                    {order.orderId}
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-500 font-medium">
                    {new Date(order.date).toLocaleDateString()} at {new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs font-bold text-green-700 bg-green-100/80 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-green-600" />
                    {order.orderStatus || 'Delivered'}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-xs text-slate-500">
                    Total: <strong className="text-orange-600 font-black text-sm">{storeConfig.currencySymbol}{order.total}</strong>
                  </span>
                  <Link
                    to={`/order-confirmation/${order.orderId}`}
                    state={{ order }}
                    className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
                  >
                    View Invoice <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-5 sm:p-6 divide-y divide-slate-100">
                {order.items?.map((item, idx) => {
                  const driveLink = item.googleDriveLink || item.downloadUrl || 'https://drive.google.com';
                  const isSub = item.type === 'subscription';

                  return (
                    <div key={idx} className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-14 h-14 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=120&q=80';
                          }}
                        />
                        <div>
                          <span className="text-[10px] font-bold uppercase text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                            {isSub ? 'Subscription' : 'Downloadable'}
                          </span>
                          <h4 className="font-bold text-slate-900 text-sm mt-0.5">
                            {item.title}
                          </h4>
                          {item.planName && (
                            <p className="text-xs text-slate-500 font-medium">
                              Plan: {item.planName}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Download or Credentials button */}
                      <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                        {isSub ? (
                          <button
                            onClick={() => handleCopy(item.deliveryInfo, `${order.orderId}-${idx}`)}
                            className="px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
                          >
                            {copiedId === `${order.orderId}-${idx}` ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                            {copiedId === `${order.orderId}-${idx}` ? 'Copied Credentials' : 'Copy Credentials'}
                          </button>
                        ) : (
                          <a
                            href={driveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download Files</span>
                            <ExternalLink className="w-3 h-3 ml-0.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Delivery recipient info */}
              <div className="px-5 py-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Dispatched to: <strong>{order.customer?.email}</strong></span>
                <span>Payment: <strong>{order.paymentMethod}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
