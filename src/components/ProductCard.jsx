import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Zap, 
  Star, 
  Film, 
  Tv, 
  Download, 
  Check, 
  MessageCircle, 
  ShieldCheck
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function ProductCard({ product, type }) {
  const { addToCart, storeConfig } = useStore();
  const navigate = useNavigate();

  // 1. Subscription Card
  if (type === 'subscription' || product.type === 'subscription') {
    const defaultPlan = (product.plans && product.plans[0]) || { price: 149, name: '1 Month' };
    const whatsappText = encodeURIComponent(`Hi, I want to order the subscription for ${product.title} (${defaultPlan.name}) for ${storeConfig.currencySymbol}${defaultPlan.price}. Please provide activation details.`);
    const whatsappUrl = `https://wa.me/917895768118?text=${whatsappText}`;

    return (
      <div className="group bg-white rounded-xl sm:rounded-2xl border border-slate-200 hover:border-[#a1e3d8] shadow-xs sm:shadow-sm hover:shadow-card-hover transition-all duration-300 flex flex-col overflow-hidden relative">
        {/* Top Badges */}
        <div className="absolute top-2 left-2 right-2 sm:top-3 sm:left-3 sm:right-3 z-10 flex items-center justify-between pointer-events-none">
          <span className="bg-[#a1e3d8] text-slate-900 text-[9px] sm:text-[11px] font-extrabold px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-xs flex items-center gap-1 border border-white">
            <Tv className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
            <span className="truncate max-w-[80px] sm:max-w-none">{product.badge || 'Subscription'}</span>
          </span>
          <span className="bg-slate-900/80 backdrop-blur-md text-white text-[9px] sm:text-[11px] font-semibold px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-full flex items-center gap-1">
            <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400 fill-amber-400" />
            {product.rating || 4.9}
          </span>
        </div>

        {/* Thumbnail Image */}
        <Link to={`/product/subscription/${product.id}`} className="relative h-32 sm:h-44 md:h-48 overflow-hidden bg-slate-900 block">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-90" />
          <div className="absolute bottom-1.5 sm:bottom-2.5 left-2 sm:left-3 right-2 sm:right-3 text-white">
            <span className="text-[9px] sm:text-[11px] uppercase tracking-wider font-bold text-[#a1e3d8] truncate block">
              {product.category}
            </span>
          </div>
        </Link>

        {/* Card Body */}
        <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between">
          <div>
            <Link to={`/product/subscription/${product.id}`}>
              <h3 className="font-bold text-slate-900 group-hover:text-teal-700 transition-colors text-xs sm:text-base line-clamp-1 mb-1 leading-snug">
                {product.title}
              </h3>
            </Link>
            <p className="hidden sm:block text-xs text-slate-500 line-clamp-2 mb-2">
              {product.shortDescription}
            </p>

            {/* Plans Mini Badges */}
            <div className="flex flex-wrap gap-1 mb-2 sm:mb-3">
              {product.plans?.slice(0, 2).map((p) => (
                <span
                  key={p.id}
                  className={`text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-md font-semibold border ${
                    p.isPopular
                      ? 'bg-teal-50 border-teal-200 text-teal-800'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  {p.name}
                </span>
              ))}
            </div>
          </div>

          <div>
            {/* Price section (clean, honest price) */}
            <div className="flex items-baseline justify-between mb-2 sm:mb-3 pt-1.5 sm:pt-2 border-t border-slate-100">
              <div>
                <span className="text-[9px] sm:text-[11px] text-slate-400 block -mb-0.5">Price</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-base sm:text-xl font-black text-slate-900">
                    {storeConfig.currencySymbol}{defaultPlan.price}
                  </span>
                  <span className="text-[10px] sm:text-xs text-slate-500 font-medium">/ {defaultPlan.name}</span>
                </div>
              </div>
              <span className="hidden sm:flex text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded items-center gap-1 border border-emerald-200">
                <ShieldCheck className="w-3 h-3 text-emerald-600" /> Genuine
              </span>
            </div>

            {/* Subscription Action: DIRECT WHATSAPP ORDER */}
            <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
              <Link
                to={`/product/subscription/${product.id}`}
                className="w-full py-1.5 sm:py-2 px-1 sm:px-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all flex items-center justify-center gap-1 active:scale-95"
              >
                Plans
              </Link>
              
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-1.5 sm:py-2 px-1 sm:px-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition-all flex items-center justify-center gap-1 active:scale-95"
                title="Direct WhatsApp Order"
              >
                <MessageCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-white shrink-0" />
                <span>Buy</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Reels Bundle Card (Reels Bundle Specific Flow)
  if (type === 'reels-bundle' || product.type === 'reels-bundle') {
    const reelCount = product.reelCount || 1000;
    const price = product.personalPrice || product.price || 99;

    const handleBuyNow = (e) => {
      e.preventDefault();
      e.stopPropagation();
      addToCart({
        id: `reel-${product.id}-personal`,
        productId: product.id,
        type: 'reels-bundle',
        title: product.title,
        planName: 'Personal License',
        price: price,
        thumbnail: product.thumbnail,
        googleDriveLink: product.googleDriveLink
      }, false);
      navigate('/checkout');
    };

    const handleAddToCart = (e) => {
      e.preventDefault();
      e.stopPropagation();
      addToCart({
        id: `reel-${product.id}-personal`,
        productId: product.id,
        type: 'reels-bundle',
        title: product.title,
        planName: 'Personal License',
        price: price,
        thumbnail: product.thumbnail,
        googleDriveLink: product.googleDriveLink
      }, true);
    };

    return (
      <div className="group bg-white rounded-xl sm:rounded-2xl border border-slate-200 hover:border-[#a1e3d8] shadow-xs sm:shadow-sm hover:shadow-card-hover transition-all duration-300 flex flex-col overflow-hidden relative">
        {/* Top Badges */}
        <div className="absolute top-2 left-2 right-2 sm:top-3 sm:left-3 sm:right-3 z-10 flex items-center justify-between pointer-events-none">
          <span className="bg-[#a1e3d8] text-slate-900 text-[9px] sm:text-[11px] font-extrabold px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-xs flex items-center gap-1 border border-white">
            <Film className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            <span>{reelCount}+ Reels</span>
          </span>
          <span className="bg-slate-900/80 backdrop-blur-md text-[#a1e3d8] text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-[#a1e3d8]/40">
            1080p
          </span>
        </div>

        {/* Thumbnail Image */}
        <Link to={`/product/reels-bundle/${product.id}`} className="relative h-32 sm:h-44 md:h-48 overflow-hidden bg-slate-900 block">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              e.target.src = 'https://media-cdn.cosmofeed.com/chat/Neon-4000--Cartoon-Video-Bundle-2026-10-10-03-03-49.png?w=1200&q=75';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-90" />
          <div className="absolute bottom-1.5 sm:bottom-2.5 left-2 sm:left-3 right-2 sm:right-3 flex items-center justify-between text-white">
            <span className="text-[9px] sm:text-[11px] font-semibold text-[#a1e3d8] truncate max-w-[100px] sm:max-w-none">
              {product.category}
            </span>
            <span className="hidden sm:inline text-[10px] text-slate-300">No Watermark</span>
          </div>
        </Link>

        {/* Card Content */}
        <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between">
          <div>
            <Link to={`/product/reels-bundle/${product.id}`}>
              <h3 className="font-bold text-slate-900 group-hover:text-teal-700 transition-colors text-xs sm:text-sm md:text-base line-clamp-2 mb-1 leading-snug">
                {product.title}
              </h3>
            </Link>
            <p className="hidden sm:block text-xs text-slate-500 line-clamp-2 mb-2">
              {product.shortDescription || 'High engagement viral vertical video format ready to post with trending audio.'}
            </p>

            <div className="hidden sm:flex items-center gap-3 text-[11px] text-slate-600 mb-2.5 bg-slate-50 p-2 rounded-xl">
              <span className="flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-teal-600 font-bold" /> Drive Access
              </span>
              <span className="flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-teal-600 font-bold" /> 9:16 Vertical
              </span>
            </div>
          </div>

          <div>
            {/* Price Strip */}
            <div className="flex items-baseline justify-between mb-2 sm:mb-3 pt-1.5 sm:pt-2 border-t border-slate-100">
              <div>
                <span className="text-[9px] sm:text-[11px] text-slate-400 block -mb-0.5">Bundle Price</span>
                <span className="text-base sm:text-2xl font-black text-slate-900">
                  {storeConfig.currencySymbol}{price}
                </span>
              </div>
              <span className="text-[9px] sm:text-[11px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                Personal
              </span>
            </div>

            {/* Buttons for Reels */}
            <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
              <button
                onClick={handleAddToCart}
                className="w-full py-1.5 sm:py-2 px-1 sm:px-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all flex items-center justify-center gap-1 active:scale-95"
              >
                <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                <span className="truncate">Cart</span>
              </button>
              <button
                onClick={handleBuyNow}
                className="w-full py-1.5 sm:py-2 px-1 sm:px-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-extrabold text-slate-900 bg-[#a1e3d8] hover:bg-[#7be0d2] shadow-xs transition-all flex items-center justify-center gap-1 active:scale-95"
              >
                <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-slate-900 shrink-0" />
                <span className="truncate">Buy Now</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. Digital Product Card
  const price = product.price || 99;

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: `dp-${product.id}`,
      productId: product.id,
      type: 'digital-product',
      title: product.title,
      price: price,
      thumbnail: product.thumbnail,
      downloadUrl: product.downloadUrl,
      deliveryInfo: product.deliveryInfo
    }, false);
    navigate('/checkout');
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: `dp-${product.id}`,
      productId: product.id,
      type: 'digital-product',
      title: product.title,
      price: price,
      thumbnail: product.thumbnail,
      downloadUrl: product.downloadUrl,
      deliveryInfo: product.deliveryInfo
    }, true);
  };

  return (
    <div className="group bg-white rounded-xl sm:rounded-2xl border border-slate-200 hover:border-[#a1e3d8] shadow-xs sm:shadow-sm hover:shadow-card-hover transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* Top Badges */}
      <div className="absolute top-2 left-2 right-2 sm:top-3 sm:left-3 sm:right-3 z-10 flex items-center justify-between pointer-events-none">
        <span className="bg-[#a1e3d8] text-slate-900 text-[9px] sm:text-[11px] font-extrabold px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-xs flex items-center gap-1 border border-white">
          <Download className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
          <span>{product.badge || 'Digital'}</span>
        </span>
        <span className="bg-slate-900/80 backdrop-blur-md text-white text-[9px] sm:text-[11px] font-semibold px-1.5 py-0.5 rounded-full flex items-center gap-1">
          <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400 fill-amber-400" />
          {product.rating || 4.9}
        </span>
      </div>

      {/* Thumbnail */}
      <Link to={`/product/digital-product/${product.id}`} className="relative h-32 sm:h-44 md:h-48 overflow-hidden bg-slate-100 block">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
        <div className="absolute bottom-1.5 sm:bottom-2.5 left-2 sm:left-3 right-2 sm:right-3 text-white">
          <span className="text-[9px] sm:text-[11px] uppercase tracking-wider font-semibold text-[#a1e3d8] truncate block">
            {product.category}
          </span>
        </div>
      </Link>

      {/* Card Content */}
      <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          <Link to={`/product/digital-product/${product.id}`}>
            <h3 className="font-bold text-slate-900 group-hover:text-teal-700 transition-colors text-xs sm:text-base line-clamp-2 mb-1 leading-snug">
              {product.title}
            </h3>
          </Link>
          <p className="hidden sm:block text-xs text-slate-500 line-clamp-2 mb-2">
            {product.shortDescription}
          </p>

          <div className="text-[10px] sm:text-[11px] font-medium text-slate-600 bg-slate-50 border border-slate-200 p-1.5 sm:p-2 rounded-xl mb-2 sm:mb-3 flex items-center justify-between">
            <span className="truncate">Format: {product.format || 'Download'}</span>
            <span className="text-teal-700 font-bold shrink-0">Lifetime</span>
          </div>
        </div>

        <div>
          {/* Price Strip */}
          <div className="flex items-baseline justify-between mb-2 sm:mb-3 pt-1.5 sm:pt-2 border-t border-slate-100">
            <div>
              <span className="text-[9px] sm:text-[11px] text-slate-400 block -mb-0.5">Instant Access</span>
              <span className="text-base sm:text-2xl font-black text-slate-900">
                {storeConfig.currencySymbol}{price}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
            <button
              onClick={handleAddToCart}
              className="w-full py-1.5 sm:py-2 px-1 sm:px-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all flex items-center justify-center gap-1 active:scale-95"
            >
              <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              <span className="truncate">Cart</span>
            </button>
            <button
              onClick={handleBuyNow}
              className="w-full py-1.5 sm:py-2 px-1 sm:px-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-extrabold text-slate-900 bg-[#a1e3d8] hover:bg-[#7be0d2] shadow-xs transition-all flex items-center justify-center gap-1 active:scale-95"
            >
              <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-slate-900 shrink-0" />
              <span className="truncate">Buy Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}