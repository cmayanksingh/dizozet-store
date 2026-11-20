import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Zap, ShieldCheck, Flame, Download, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function Gta6PromoModal() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { reelsBundles, addToCart, storeConfig } = useStore();

  const gtaBundle = reelsBundles.find(
    (b) => b.id === 'rb-2000-gta-6-viral-reels' || b.title.toLowerCase().includes('gta 6')
  );

  useEffect(() => {
    try {
      const dismissed = sessionStorage.getItem('dizozet_gta6_promo_dismissed');
      if (dismissed === 'true') return;
    } catch (e) {}

    // Open gently 1.5 seconds after page loads
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (!isOpen) return null;

  const handleClose = () => {
    setIsOpen(false);
    try {
      sessionStorage.setItem('dizozet_gta6_promo_dismissed', 'true');
    } catch (e) {}
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const bundleToAdd = gtaBundle || {
      id: 'rb-2000-gta-6-viral-reels',
      title: '2000+ GTA 6 Viral Reels Bundle – Ready to Upload 4K No Watermark Videos',
      personalPrice: 99,
      thumbnail: '/images/gta6-bundle-cover.jpg',
      googleDriveLink: 'https://drive.google.com/drive/folders/1sr2POBi408SvcrkDbbuCnEskLFwz4HuK'
    };

    addToCart({
      id: `reel-${bundleToAdd.id}-personal`,
      productId: bundleToAdd.id,
      type: 'reels-bundle',
      title: bundleToAdd.title,
      planName: 'Personal License',
      price: bundleToAdd.personalPrice || 99,
      thumbnail: bundleToAdd.thumbnail || '/images/gta6-bundle-cover.jpg',
      googleDriveLink: bundleToAdd.googleDriveLink || 'https://drive.google.com/drive/folders/1sr2POBi408SvcrkDbbuCnEskLFwz4HuK'
    }, false);

    handleClose();
    navigate('/checkout');
  };

  const price = gtaBundle?.personalPrice || 99;
  const originalPrice = gtaBundle?.personalOriginalPrice || 999;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      
      {/* Background click to dismiss */}
      <div className="absolute inset-0" onClick={handleClose} />

      {/* Compact Pop-up Card */}
      <div 
        className="relative w-full max-w-sm sm:max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200/90 z-10 transform transition-all duration-300 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top-Right Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-slate-900/80 hover:bg-red-600 text-white flex items-center justify-center transition-all shadow-md group cursor-pointer"
          title="Close"
        >
          <X className="w-4 h-4 transition-transform group-hover:rotate-90" />
        </button>

        {/* Visual Header / Cover Image */}
        <div className="relative h-44 sm:h-48 overflow-hidden bg-slate-900">
          <img
            src={gtaBundle?.thumbnail || '/images/gta6-bundle-cover.jpg'}
            alt="GTA 6 Viral Reels Bundle"
            className="w-full h-full object-cover brightness-95 transform hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.src = '/images/mafia-cars-reels-bundle-4-2-1.jpg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          
          {/* Top Floating Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-600 text-white shadow-md animate-pulse">
              <Flame className="w-3 h-3 fill-white" /> Trending #1
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-500 text-slate-950 shadow-sm">
              4K Ultra HD
            </span>
          </div>

          {/* Title on Gradient */}
          <div className="absolute bottom-3 left-4 right-4 text-white">
            <h3 className="text-base sm:text-lg font-black leading-tight drop-shadow-md">
              2000+ GTA 6 Viral Reels Bundle
            </h3>
            <p className="text-xs text-teal-300 font-semibold flex items-center gap-1 mt-0.5">
              <Sparkles className="w-3.5 h-3.5" /> Ready to Upload • No Watermark
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">
          
          {/* Feature Highlights */}
          <div className="grid grid-cols-2 gap-2 text-[11px] font-bold text-slate-700">
            <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-teal-600">✓</span> 2,000+ Vertical 9:16 Clips
            </div>
            <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-teal-600">✓</span> Trending Background Audio
            </div>
            <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-teal-600">✓</span> Commercial Resale Rights
            </div>
            <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-teal-600">✓</span> 1-Click Direct Google Drive
            </div>
          </div>

          {/* Pricing Strip */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200/80">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-500 block -mb-0.5">
                Special Launch Price
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-slate-900">
                  {storeConfig?.currencySymbol || '₹'}{price}
                </span>
                <span className="text-xs text-slate-400 line-through font-semibold">
                  {storeConfig?.currencySymbol || '₹'}{originalPrice}
                </span>
                <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                  90% OFF
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-extrabold text-teal-800 bg-teal-200/60 px-2 py-0.5 rounded-full block">
                Instant Delivery
              </span>
              <span className="text-[10px] text-slate-500 font-medium mt-0.5 block">
                Google Drive Link
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              onClick={handleBuyNow}
              className="w-full py-3.5 px-5 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-slate-950 font-black text-sm rounded-2xl shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>Buy Now – {storeConfig?.currencySymbol || '₹'}{price}</span>
            </button>

            <button
              onClick={handleClose}
              className="w-full py-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors text-center"
            >
              Continue Browsing Store
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
