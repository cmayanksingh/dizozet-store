import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, 
  ShoppingBag, 
  Zap, 
  ShieldCheck, 
  Check, 
  Clock, 
  ChevronRight, 
  Film, 
  Tv, 
  Download, 
  Share2, 
  Copy,
  ChevronDown,
  Sparkles,
  ArrowLeft,
  MessageCircle,
  ExternalLink
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';

export default function ProductDetailPage() {
  const { type, id } = useParams();
  const { subscriptions, reelsBundles, digitalProducts, addToCart, storeConfig } = useStore();
  const navigate = useNavigate();

  const [copiedLink, setCopiedLink] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // Find product by id or slug
  const product = useMemo(() => {
    if (type === 'subscription') {
      return subscriptions.find(s => s.id === id || s.slug === id);
    } else if (type === 'reels-bundle') {
      return reelsBundles.find(r => r.id === id || r.slug === id);
    } else {
      return digitalProducts.find(d => d.id === id || d.slug === id);
    }
  }, [type, id, subscriptions, reelsBundles, digitalProducts]);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-black text-slate-800">Product Not Found</h2>
        <p className="text-sm text-slate-500">The product you are looking for does not exist or has been moved.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Store
        </Link>
      </div>
    );
  }

  // State for Subscriptions
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(() => {
    const popularIdx = product.plans?.findIndex(p => p.isPopular);
    return popularIdx !== -1 && popularIdx !== undefined ? popularIdx : 0;
  });
  const [selectedVariationIndex, setSelectedVariationIndex] = useState(0);

  // State for Reels Bundles (Personal vs Reseller)
  const [selectedLicense, setSelectedLicense] = useState('personal'); // 'personal' or 'reseller'

  // Pricing calculations
  let currentPrice = 99;
  let currentPlanName = '';

  if (type === 'subscription' && product.plans && product.plans.length > 0) {
    const plan = product.plans[selectedPlanIndex] || product.plans[0];
    const variation = product.variations?.[selectedVariationIndex];
    currentPrice = plan.price + (variation?.extraPrice || 0);
    currentPlanName = `${plan.name} (${variation ? variation.name : 'Standard'})`;
  } else if (type === 'reels-bundle') {
    if (selectedLicense === 'reseller') {
      currentPrice = product.resellerPrice || 199;
      currentPlanName = 'Reseller Commercial License';
    } else {
      currentPrice = product.personalPrice || 99;
      currentPlanName = 'Personal Usage License';
    }
  } else {
    currentPrice = product.price || 99;
    currentPlanName = product.format || 'Digital Download';
  }

  // Dynamic WhatsApp message URL for Subscriptions
  const whatsappOrderText = encodeURIComponent(`Hi, I want to order subscription: ${product.title}\nPlan: ${currentPlanName}\nPrice: ${storeConfig.currencySymbol}${currentPrice}\nPlease share activation and payment steps.`);
  const whatsappOrderUrl = `https://wa.me/917895768118?text=${whatsappOrderText}`;

  // Add to cart handler (For Reels & Digital products)
  const handleAddToCart = () => {
    addToCart({
      id: `${product.id}-${type === 'subscription' ? selectedPlanIndex : selectedLicense}`,
      productId: product.id,
      type: type,
      title: product.title,
      planName: currentPlanName,
      price: currentPrice,
      thumbnail: product.thumbnail,
      googleDriveLink: product.googleDriveLink,
      downloadUrl: product.downloadUrl,
      deliveryInfo: product.deliveryInfo
    }, true);
  };

  // Buy now handler
  const handleBuyNow = () => {
    if (type === 'subscription') {
      // Subscriptions go directly to WhatsApp!
      window.open(whatsappOrderUrl, '_blank');
      return;
    }
    addToCart({
      id: `${product.id}-${selectedLicense}`,
      productId: product.id,
      type: type,
      title: product.title,
      planName: currentPlanName,
      price: currentPrice,
      thumbnail: product.thumbnail,
      googleDriveLink: product.googleDriveLink,
      downloadUrl: product.downloadUrl,
      deliveryInfo: product.deliveryInfo
    }, false);
    navigate('/checkout');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Related products
  const relatedProducts = (type === 'subscription' 
    ? subscriptions.filter(s => s.id !== product.id).slice(0, 4)
    : type === 'reels-bundle' 
    ? reelsBundles.filter(r => r.id !== product.id && (r.category === product.category || r.category === 'Trending Reels')).slice(0, 4)
    : digitalProducts.filter(d => d.id !== product.id).slice(0, 4)
  );

  return (
    <div className="pb-12 sm:pb-20 pt-4 sm:pt-6 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6 sm:space-y-12">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold text-slate-500">
        <Link to="/" className="hover:text-teal-700">Home</Link>
        <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400" />
        <Link 
          to={type === 'subscription' ? '/subscriptions' : type === 'reels-bundle' ? '/reels-bundles' : '/digital-products'}
          className="hover:text-teal-700 capitalize"
        >
          {type === 'subscription' ? 'Subscriptions' : type === 'reels-bundle' ? 'Reels Bundles' : 'Digital Products'}
        </Link>
        <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400" />
        <span className="text-slate-800 truncate max-w-xs">{product.title}</span>
      </nav>

      {/* Main Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-start">
        
        {/* Left Column: Authentic Brand Photo / Visuals */}
        <div className="lg:col-span-6 space-y-3 sm:space-y-4">
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-900 border border-slate-200 shadow-sm aspect-video sm:aspect-square max-h-[320px] sm:max-h-[500px]">
            <img
              src={product.thumbnail}
              alt={product.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&q=80';
              }}
            />
            {/* Top badges */}
            <div className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 flex items-center gap-1.5 sm:gap-2">
              <span className="bg-[#a1e3d8] text-slate-900 text-[10px] sm:text-xs font-extrabold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-xs border border-white">
                {product.badge || 'Verified'}
              </span>
              {product.reelCount && (
                <span className="bg-black/70 backdrop-blur-md text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 sm:px-3 sm:py-1 rounded-full">
                  🎬 {product.reelCount}+ Videos
                </span>
              )}
            </div>

            <button
              onClick={handleShare}
              className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white p-2 sm:p-2.5 rounded-full transition-all"
              title="Share link"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            </button>
          </div>

          {/* Guarantees Box */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 pt-1">
            <div className="bg-white p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border border-slate-200 text-center space-y-0.5 sm:space-y-1">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600 mx-auto" />
              <div className="text-[11px] sm:text-xs font-bold text-slate-800">Fast Activation</div>
              <div className="text-[9px] sm:text-[10px] text-slate-400">Within minutes</div>
            </div>
            <div className="bg-white p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border border-slate-200 text-center space-y-0.5 sm:space-y-1">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 mx-auto" />
              <div className="text-[11px] sm:text-xs font-bold text-slate-800">100% Genuine</div>
              <div className="text-[9px] sm:text-[10px] text-slate-400">Full Warranty</div>
            </div>
            <div className="bg-white p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border border-slate-200 text-center space-y-0.5 sm:space-y-1 col-span-2 sm:col-span-1">
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 mx-auto" />
              <div className="text-[11px] sm:text-xs font-bold text-slate-800">WhatsApp Support</div>
              <div className="text-[9px] sm:text-[10px] text-slate-400">7895768118</div>
            </div>
          </div>
        </div>

        {/* Right Column: Details & Plan Pickers */}
        <div className="lg:col-span-6 space-y-4 sm:space-y-6">
          
          {/* Header & Title */}
          <div>
            <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-teal-900 bg-[#a1e3d8]/40 px-2 sm:px-2.5 py-0.5 rounded-full border border-[#a1e3d8]/60">
                {product.category}
              </span>
              <div className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-slate-600">
                <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 fill-amber-400" />
                <span>{product.rating || 4.9}</span>
                <span className="text-slate-400">({product.reviewCount || 120} reviews)</span>
              </div>
            </div>

            <h1 className="text-xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-2 sm:mb-3">
              {product.title}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              {product.shortDescription}
            </p>
          </div>

          {/* Pricing Box (Clean honest price, no discount gimmick) */}
          <div className="p-3.5 sm:p-5 bg-slate-50 rounded-xl sm:rounded-2xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] sm:text-xs text-slate-500 block">Price:</span>
              <div className="flex items-baseline gap-1.5 sm:gap-2">
                <span className="text-2xl sm:text-4xl font-black text-slate-900">
                  {storeConfig.currencySymbol}{currentPrice}
                </span>
                <span className="text-xs sm:text-sm text-slate-500 font-semibold">/ {currentPlanName}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] sm:text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg sm:rounded-xl inline-block">
                ✓ Active Plan
              </span>
            </div>
          </div>

          {/* 1. If Subscription: Plan Duration Selector */}
          {type === 'subscription' && product.plans && (
            <div className="space-y-3">
              <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block">
                Select Subscription Plan Duration:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {product.plans.map((p, idx) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPlanIndex(idx)}
                    className={`p-3 rounded-2xl text-left border transition-all relative ${
                      selectedPlanIndex === idx
                        ? 'border-slate-900 bg-[#a1e3d8]/25 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-[#a1e3d8]'
                    }`}
                  >
                    {p.isPopular && (
                      <span className="absolute -top-2 right-2 text-[9px] bg-slate-900 text-white font-extrabold px-1.5 py-0.2 rounded-full">
                        Popular
                      </span>
                    )}
                    <div className="text-xs font-bold text-slate-800">{p.name}</div>
                    <div className="text-base font-black text-slate-900 mt-1">
                      {storeConfig.currencySymbol}{p.price}
                    </div>
                  </button>
                ))}
              </div>

              {/* Variations */}
              {product.variations && product.variations.length > 1 && (
                <div className="pt-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Account Access Type:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {product.variations.map((v, idx) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariationIndex(idx)}
                        className={`p-3 rounded-xl text-left text-xs font-bold border transition-all flex items-center justify-between ${
                          selectedVariationIndex === idx
                            ? 'border-slate-900 bg-[#a1e3d8]/20 text-slate-900'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <span>{v.name}</span>
                        {v.extraPrice > 0 && <span>+{storeConfig.currencySymbol}{v.extraPrice}</span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 2. If Reels Bundle: License Selector (Personal vs Reseller) */}
          {type === 'reels-bundle' && (
            <div className="space-y-3">
              <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block">
                Choose Your Usage License:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => setSelectedLicense('personal')}
                  className={`p-4 rounded-2xl text-left border transition-all ${
                    selectedLicense === 'personal'
                      ? 'border-slate-900 bg-[#a1e3d8]/25 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-[#a1e3d8]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-slate-800">Personal License</span>
                    <span className="text-sm font-extrabold text-slate-900">
                      {storeConfig.currencySymbol}{product.personalPrice || 99}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Use on your own Instagram, YouTube, and Facebook accounts without watermark.
                  </p>
                </button>

                <button
                  onClick={() => setSelectedLicense('reseller')}
                  className={`p-4 rounded-2xl text-left border transition-all ${
                    selectedLicense === 'reseller'
                      ? 'border-slate-900 bg-[#a1e3d8]/25 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-[#a1e3d8]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                      Reseller Commercial Rights
                    </span>
                    <span className="text-sm font-extrabold text-slate-900">
                      {storeConfig.currencySymbol}{product.resellerPrice || 199}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Full commercial rights to resell to clients, repackage, and keep 100% of profits.
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* Action CTAs */}
          {type === 'subscription' ? (
            /* Subscriptions: Direct WhatsApp Order button */
            <div className="space-y-3 pt-2">
              <a
                href={whatsappOrderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 px-6 rounded-2xl font-black text-sm sm:text-base text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                <span>Buy Now</span>
              </a>
              <p className="text-[11px] text-slate-500 text-center">
                💬 Opens WhatsApp with your selected plan pre-filled for <strong>7895768118</strong>.
              </p>
            </div>
          ) : (
            /* Reels Bundles & Digital Products: Add to Cart and Buy Now */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <button
                onClick={handleAddToCart}
                className="py-4 px-6 rounded-2xl font-bold text-sm sm:text-base text-slate-800 bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-slate-300 shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <ShoppingBag className="w-5 h-5 text-teal-600" />
                <span>Add to Cart</span>
              </button>
              <button
                onClick={handleBuyNow}
                className="py-4 px-6 rounded-2xl font-extrabold text-sm sm:text-base text-slate-900 bg-[#a1e3d8] hover:bg-[#7be0d2] shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Zap className="w-5 h-5 fill-slate-900" />
                <span>Buy Now (Instant Access)</span>
              </button>
            </div>
          )}

          {/* Key Features List */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-3">
              Included With This Purchase:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
              {product.features?.map((f, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Description & Overview */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
        <h3 className="text-xl font-black text-slate-900 border-b border-slate-100 pb-4">
          Product Overview & Description
        </h3>
        <div className="prose prose-slate max-w-none text-sm sm:text-base text-slate-600 leading-relaxed whitespace-pre-line">
          {product.description || product.shortDescription}
        </div>
      </div>

      {/* Product Specific FAQs */}
      {product.faqs && product.faqs.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-xl font-black text-slate-900 border-b border-slate-100 pb-4">
            Frequently Asked Questions
          </h3>
          <div className="space-y-3">
            {product.faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                    className="w-full p-4 text-left font-bold text-slate-800 text-sm flex items-center justify-between gap-4 hover:text-teal-700 transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-teal-600' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="p-4 pt-0 text-xs sm:text-sm text-slate-600 border-t border-slate-100 bg-slate-50/50">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              You May Also Like
            </h3>
            <Link
              to={type === 'subscription' ? '/subscriptions' : type === 'reels-bundle' ? '/reels-bundles' : '/digital-products'}
              className="text-xs font-bold text-teal-800 hover:underline"
            >
              Explore Category →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} type={type} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
