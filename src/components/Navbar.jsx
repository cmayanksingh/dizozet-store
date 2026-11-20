import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { 
  ShoppingBag, 
  Search, 
  User, 
  Menu, 
  X, 
  Tv, 
  Film, 
  Download, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function Navbar() {
  const { cartCount, setIsCartOpen, setIsSearchOpen, storeConfig } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Subscriptions', path: '/subscriptions', icon: Tv },
    { name: 'Reels Bundles', path: '/reels-bundles', icon: Film },
    { name: 'Digital Products', path: '/digital-products', icon: Download },
  ];

  const showBanner = storeConfig?.isBannerActive !== false && storeConfig?.announcementText;

  return (
    <div className="sticky top-0 z-40">
      {/* Dynamic Announcement Bar */}
      {showBanner && (
        <div className="bg-slate-900 text-white text-[11px] sm:text-xs font-bold py-1.5 px-4 text-center border-b border-slate-800 flex items-center justify-center gap-2">
          <span>{storeConfig.announcementText}</span>
          <a
            href={`https://wa.me/91${(storeConfig.whatsappNumber || '7895768118').replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#a1e3d8] hover:underline hidden sm:inline ml-2"
          >
            WhatsApp Support: +91 {storeConfig.whatsappNumber || '7895768118'}
          </a>
        </div>
      )}

      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-20">
          
          {/* Logo: Dizozet */}
          <Link to="/" className="flex items-center gap-2 sm:gap-2.5 group">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-slate-900 border border-slate-800 p-0.5 sm:p-1 flex items-center justify-center shadow-xs sm:shadow-sm group-hover:scale-105 transition-transform overflow-hidden">
              <img src="/images/dizozet-logo.png" alt="Dizozet Logo" className="w-full h-full object-contain" onError={(e) => { e.target.src = '/images/dizozet-logo.jpg'; }} />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-2xl font-black tracking-tight text-slate-900 group-hover:text-teal-700 transition-colors">
                Dizo<span className="text-teal-600">zet</span>
              </span>
              <span className="text-[8px] sm:text-[10px] tracking-wider uppercase font-semibold text-slate-400 -mt-0.5 sm:-mt-1">
                Digital Store
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                    isActive
                      ? 'text-teal-900 bg-[#a1e3d8]/30 font-bold border border-[#a1e3d8]/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Search Trigger (Just the search logo, no Ctrl+K) */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg sm:rounded-xl transition-all"
              title="Search products"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* My Orders / Account */}
            <Link
              to="/orders"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all text-sm font-medium"
              title="My Orders & Downloads"
            >
              <User className="w-4 h-4" />
              <span>My Orders</span>
            </Link>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-slate-100 hover:bg-[#a1e3d8]/30 text-slate-800 rounded-lg sm:rounded-xl transition-all border border-slate-200 active:scale-95"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 sm:-top-1.5 sm:-right-1.5 bg-[#a1e3d8] text-slate-900 text-[9px] sm:text-[11px] font-extrabold w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow-xs sm:shadow-md border border-white">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 shadow-xl px-4 pt-2 pb-6 animate-fadeIn">
          <div className="flex flex-col gap-1.5">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between ${
                    isActive
                      ? 'text-teal-900 bg-[#a1e3d8]/30 font-bold border border-[#a1e3d8]/50'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`
                }
              >
                <span className="flex items-center gap-3">
                  {link.icon && <link.icon className="w-5 h-5 text-teal-600" />}
                  {link.name}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </NavLink>
            ))}

            <div className="border-t border-slate-100 my-2 pt-2 flex flex-col gap-2">
              <Link
                to="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-between"
              >
                <span className="flex items-center gap-3">
                  <User className="w-5 h-5 text-slate-400" />
                  My Orders & Downloads
                </span>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
    </div>
  );
}
