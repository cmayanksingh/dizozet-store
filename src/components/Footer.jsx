import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  MessageCircle, 
  Lock, 
  Mail, 
  ChevronRight 
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function Footer() {
  const { storeConfig } = useStore();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-10 pb-8 sm:pt-16 sm:pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Trust Badges Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 pb-6 sm:pb-12 border-b border-slate-800 text-slate-300">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/5 text-[#a1e3d8] flex items-center justify-center shrink-0 border border-white/10">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">Instant Delivery</h4>
              <p className="text-[10px] sm:text-xs text-slate-400">Direct links & invites</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/5 text-emerald-400 flex items-center justify-center shrink-0 border border-white/10">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">Warranty</h4>
              <p className="text-[10px] sm:text-xs text-slate-400">100% genuine guarantees</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/5 text-emerald-400 flex items-center justify-center shrink-0 border border-white/10">
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">WhatsApp Orders</h4>
              <p className="text-[10px] sm:text-xs text-slate-400">7895768118</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/5 text-[#a1e3d8] flex items-center justify-center shrink-0 border border-white/10">
              <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">Encrypted Pay</h4>
              <p className="text-[10px] sm:text-xs text-slate-400">UPI, QR & Cards</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10 py-6 sm:py-12">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            <Link to="/" className="flex items-center gap-2 sm:gap-2.5">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-slate-800 border border-slate-700 p-0.5 sm:p-1 flex items-center justify-center shadow-xs overflow-hidden">
                <img src="/images/dizozet-logo.png" alt="Dizozet Logo" className="w-full h-full object-contain" onError={(e) => { e.target.src = '/images/dizozet-logo.jpg'; }} />
              </div>
              <span className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Dizo<span className="text-[#a1e3d8]">zet</span>
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed pr-2 sm:pr-4">
              Your trusted platform for subscriptions, 130+ viral reels bundles with commercial reseller rights, and creator tools.
            </p>
            <div className="pt-1 sm:pt-2 flex flex-col gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#a1e3d8]" />
                <span>{storeConfig.supportEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                <a 
                  href="https://wa.me/917895768118" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline font-bold text-emerald-400"
                >
                  WhatsApp: +91 78957 68118
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white tracking-wider uppercase mb-2 sm:mb-4">
              Explore Store
            </h4>
            <ul className="space-y-2 sm:space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/" className="hover:text-[#a1e3d8] transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-600" /> Home
                </Link>
              </li>
              <li>
                <Link to="/subscriptions" className="hover:text-[#a1e3d8] transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-600" /> Subscriptions
                </Link>
              </li>
              <li>
                <Link to="/reels-bundles" className="hover:text-[#a1e3d8] transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-600" /> Reels Bundles
                </Link>
              </li>
              <li>
                <Link to="/digital-products" className="hover:text-[#a1e3d8] transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-600" /> Digital Products
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-[#a1e3d8] transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-600" /> Shopping Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer & WhatsApp */}
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white tracking-wider uppercase mb-2 sm:mb-4">
              Customer Support
            </h4>
            <ul className="space-y-2 sm:space-y-2.5 text-xs sm:text-sm text-slate-400">
              <li>
                <Link to="/orders" className="hover:text-[#a1e3d8] transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-600" /> My Orders & Downloads
                </Link>
              </li>
              <li>
                <a
                  href="https://wa.me/917895768118"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-500" /> Order on WhatsApp: 7895768118
                </a>
              </li>
              <li className="pt-1 sm:pt-2 text-[11px] sm:text-xs text-slate-500">
                100% Verified Accounts • Instant Activation Support
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 sm:pt-8 mt-2 sm:mt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-[11px] sm:text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} Dizozet. All rights reserved.
          </p>
          <div className="flex items-center gap-3 sm:gap-4">
            <span>Accepted: UPI • PhonePe • Google Pay • Paytm • Cards</span>
          </div>
        </div>

      </div>
    </footer>
  );
}