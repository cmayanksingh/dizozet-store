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
  ExternalLink,
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
      <div className="group bg-white rounded-2xl border border-slate-200 hover:border-[#a1e3d8] shadow-sm hover:shadow-card-hover transition-all duration-300 flex flex-col overflow-hidden relative">
        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
          <span className="bg-[#a1e3d8] text-slate-900 text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1 border border-white">
            <Tv className="w-3.5 h-3.5" />
            {product.badge || 'Subscription'}
          </span>
          <span className="bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            {product.rating || 4.9}
          </span>
        </div>

        {/* Thumbnail Image */}
        <Link to={`/product/subscription/${product.id}`} className="relative h-48 overflow-hidden bg-slate-900 block">
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
          <div className="absolute bottom-2.5 left-3 right-3 text-white">
            <span className="text-[11px] uppercase tracking-wider font-bold text-[#a1e3d8]">
              {product.category}
            </span>
          </div>
        </Link>

        {/* Card Body */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <Link to={`/product/subscription/${product.id}`}>
              <h3 className="font-bold text-slate-900 group-hover:text-teal-700 transition-colors text-base line-clamp-1 mb-1">
                {product.title}
              </h3>
            </Link>
            <p className="text-xs text-slate-500 line-clamp-2 mb-3">
              {product.shortDescription}
            </p>

            {/* Plans Mini Badges */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {product.plans?.slice(0, 3).map((p) => (
                <span
                  key={p.id}
                  className={`text-[10px] px-2 py-0.5 rounded-md font-semibold border ${
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
            <div className="flex items-baseline justify-between mb-3.5 pt-2 border-t border-slate-100">
              <div>
                <span className="text-[11px] text-slate-400 block -mb-0.5">Price</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-black text-slate-900">
                    {storeConfig.currencySymbol}{defaultPlan.price}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">/ {defaultPlan.name}</span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1 border border-emerald-200">
                <ShieldCheck className="w-3 h-3 text-emerald-600" /> Genuine
              </span>
            </div>

            {/* Subscription Action: DIRECT WHATSAPP ORDER */}
            <div className="grid grid-cols-2 gap-2">
              <Link
                to={`/product/subscription/${product.id}`}
                className="w-full py-2 px-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all flex items-center justify-center gap-1 active:scale-95"
              >
                View Plans
              </Link>
              
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-2 rounded-xl text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all flex items-center justify-center gap-1.5 active:scale-95"
                title="Direct WhatsApp Order"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-white" />
                <span>Buy Now</span>
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
    const price = product.personalPrice || 99;

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
      <div className="group bg-white rounded-2xl border border-slate-200 hover:border-[#a1e3d8] shadow-sm hover:shadow-card-hover transition-all duration-300 flex flex-col overflow-hidden relative">
        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
          <span className="bg-[#a1e3d8] text-slate-900 text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1 border border-white">
            <Film className="w-3 h-3" />
            {reelCount}+ Reels
          </span>
          <span className="bg-slate-900/80 backdrop-blur-md text-[#a1e3d8] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#a1e3d8]/40">
            1080p HD
          </span>
        </div>

        {/* Thumbnail Image */}
        <Link to={`/product/reels-bundle/${product.id}`} className="relative h-48 overflow-hidden bg-slate-900 block">
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
          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white">
            <span className="text-[11px] font-semibold text-[#a1e3d8]">
              {product.category}
            </span>
            <span className="text-[10px] text-slate-300">No Watermark</span>
          </div>
        </Link>

        {/* Card Content */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <Link to={`/product/reels-bundle/${product.id}`}>
              <h3 className="font-bold text-slate-900 group-hover:text-teal-700 transition-colors text-sm sm:text-base line-clamp-2 mb-1.5 leading-snug">
                {product.title}
              </h3>
            </Link>
            <p className="text-xs text-slate-500 line-clamp-2 mb-3">
              {product.shortDescription || 'High engagement viral vertical video format ready to post with trending audio.'}
            </p>

            <div className="flex items-center gap-3 text-[11px] text-slate-600 mb-3 bg-slate-50 p-2 rounded-xl">
              <span className="flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-teal-600 font-bold" /> Instant Drive Access
              </span>
              <span className="flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-teal-600 font-bold" /> 9:16 Vertical
              </span>
            </div>
          </div>

          <div>
            {/* Price Strip */}
            <div className="flex items-baseline justify-between mb-3.5 pt-2 border-t border-slate-100">
              <div>
                <span className="text-[11px] text-slate-400 block -mb-0.5">Bundle Price</span>
                <span className="text-2xl font-black text-slate-900">
                  {storeConfig.currencySymbol}{price}
                </span>
              </div>
              <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                Personal License
              </span>
            </div>

            {/* Buttons for Reels */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleAddToCart}
                className="w-full py-2 px-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all flex items-center justify-center gap-1.5 active:scale-95"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="w-full py-2 px-2 rounded-xl text-xs font-extrabold text-slate-900 bg-[#a1e3d8] hover:bg-[#7be0d2] shadow-sm transition-all flex items-center justify-center gap-1.5 active:scale-95"
              >
                <Zap className="w-3.5 h-3.5 fill-slate-900" />
                Buy Now
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
    <div className="group bg-white rounded-2xl border border-slate-200 hover:border-[#a1e3d8] shadow-sm hover:shadow-card-hover transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* Top Badges */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <span className="bg-[#a1e3d8] text-slate-900 text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1 border border-white">
          <Download className="w-3 h-3" />
          {product.badge || 'Digital'}
        </span>
        <span className="bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
          {product.rating || 4.9}
        </span>
      </div>

      {/* Thumbnail */}
      <Link to={`/product/digital-product/${product.id}`} className="relative h-48 overflow-hidden bg-slate-100 block">
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
        <div className="absolute bottom-2.5 left-3 right-3 text-white">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-[#a1e3d8]">
            {product.category}
          </span>
        </div>
      </Link>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <Link to={`/product/digital-product/${product.id}`}>
            <h3 className="font-bold text-slate-900 group-hover:text-teal-700 transition-colors text-base line-clamp-2 mb-1.5 leading-snug">
              {product.title}
            </h3>
          </Link>
          <p className="text-xs text-slate-500 line-clamp-2 mb-3">
            {product.shortDescription}
          </p>

          <div className="text-[11px] font-medium text-slate-600 bg-slate-50 border border-slate-200 p-2 rounded-xl mb-3 flex items-center justify-between">
            <span>Format: {product.format || 'Instant Download'}</span>
            <span className="text-teal-700 font-bold">Lifetime Access</span>
          </div>
        </div>

        <div>
          {/* Price Strip */}
          <div className="flex items-baseline justify-between mb-3.5 pt-2 border-t border-slate-100">
            <div>
              <span className="text-[11px] text-slate-400 block -mb-0.5">Instant Access</span>
              <span className="text-2xl font-black text-slate-900">
                {storeConfig.currencySymbol}{price}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleAddToCart}
              className="w-full py-2 px-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all flex items-center justify-center gap-1.5 active:scale-95"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="w-full py-2 px-2 rounded-xl text-xs font-extrabold text-slate-900 bg-[#a1e3d8] hover:bg-[#7be0d2] shadow-sm transition-all flex items-center justify-center gap-1.5 active:scale-95"
            >
              <Zap className="w-3.5 h-3.5 fill-slate-900" />
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
