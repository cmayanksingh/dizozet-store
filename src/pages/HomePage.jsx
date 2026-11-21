import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  Film, 
  Download, 
  ShieldCheck, 
  Zap, 
  Star, 
  CheckCircle2, 
  Clock, 
  ChevronDown,
  MessageCircle,
  FolderDown,
  Layers
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';
import { whyChooseUsFeatures, customerReviews, generalFaqs } from '../data/storeContent';

export default function HomePage() {
  const { reelsBundles, digitalProducts, reviews } = useStore();

  useEffect(() => {
    document.title = "Dizozet - Buy 222,000+ Viral Reels Bundles & Digital Products in India";
  }, []);

  // Top 8 Trending Reels Bundles (#1 is GTA 6, then others)
  const featuredReelsBundles = useMemo(() => {
    const gtaBundle = reelsBundles.find(b => b.id === 'rb-2000-gta-6-viral-reels' || b.title.toLowerCase().includes('gta 6'));
    const others = reelsBundles.filter(b => b.id !== gtaBundle?.id);
    return gtaBundle ? [gtaBundle, ...others.slice(0, 7)] : reelsBundles.slice(0, 8);
  }, [reelsBundles]);

  // Featured Digital Products (top 4)
  const featuredDigitalProducts = useMemo(() => {
    return digitalProducts.slice(0, 4);
  }, [digitalProducts]);

  const [faqOpenIndex, setFaqOpenIndex] = useState(0);

  return (
    <div className="space-y-10 sm:space-y-16 lg:space-y-20 pb-12 sm:pb-20">
      
      {/* 1. HERO SECTION (Reels & Digital Focused) */}
      <section className="relative pt-6 pb-8 sm:pt-16 sm:pb-20 lg:pt-24 lg:pb-28 overflow-hidden bg-gradient-to-b from-[#f0fdfa]/50 via-white to-[#FAFAFA]">
        <div className="absolute top-0 inset-x-0 h-96 hero-glow pointer-events-none" />
        <div className="absolute inset-0 bg-grid-pattern opacity-25 pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4 sm:space-y-7">
          
          {/* Top Pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-[#a1e3d8]/40 border border-[#a1e3d8] text-teal-900 text-[11px] sm:text-xs font-bold tracking-wide shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-teal-700" />
            <span>Dizozet • India's #1 Reels & Digital Store</span>
          </div>

          {/* Headline */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight sm:leading-[1.12]">
            222,000+ Viral Reels Bundles & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600">
              Digital Creator Products
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Instant Google Drive download with 100% watermark-free FHD reels, Canva editable templates, and digital creator toolkits with lifetime commercial rights.
          </p>

          {/* CTAs */}
          <div className="pt-1 sm:pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-4">
            <Link
              to="/reels-bundles"
              className="w-full sm:w-auto px-5 py-3 sm:px-8 sm:py-4 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs sm:text-base rounded-xl sm:rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 group active:scale-95"
            >
              <Film className="w-4 h-4 sm:w-5 sm:h-5 text-[#a1e3d8]" />
              <span>Browse 160+ Reels Bundles</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#a1e3d8] group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/digital-products"
              className="w-full sm:w-auto px-5 py-3 sm:px-8 sm:py-4 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-base rounded-xl sm:rounded-2xl border-2 border-slate-200 hover:border-[#a1e3d8] shadow-xs sm:shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600" />
              <span>Explore Digital Products</span>
            </Link>
          </div>

          {/* Stats Strip */}
          <div className="pt-4 sm:pt-10 grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-6 border-t border-slate-200/80 max-w-4xl mx-auto text-center">
            <div className="p-2 sm:p-3">
              <div className="text-lg sm:text-3xl md:text-4xl font-black text-slate-900">222K+</div>
              <div className="text-[10px] sm:text-xs text-slate-500 font-semibold mt-0.5 sm:mt-1">Vertical Videos</div>
            </div>
            <div className="p-2 sm:p-3">
              <div className="text-lg sm:text-3xl md:text-4xl font-black text-slate-900">160+</div>
              <div className="text-[10px] sm:text-xs text-slate-500 font-semibold mt-0.5 sm:mt-1">Reels Bundles</div>
            </div>
            <div className="p-2 sm:p-3">
              <div className="text-lg sm:text-3xl md:text-4xl font-black text-slate-900">15K+</div>
              <div className="text-[10px] sm:text-xs text-slate-500 font-semibold mt-0.5 sm:mt-1">Happy Creators</div>
            </div>
            <div className="p-2 sm:p-3">
              <div className="text-lg sm:text-3xl md:text-4xl font-black text-teal-700">Instant</div>
              <div className="text-[10px] sm:text-xs text-slate-500 font-semibold mt-0.5 sm:mt-1">Google Drive Link</div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. CATEGORY QUICK JUMP PILLS (Clean 2-Column Grid) */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
          
          <Link
            to="/reels-bundles"
            className="group p-4 sm:p-6 bg-white rounded-2xl border border-slate-200 hover:border-[#a1e3d8] shadow-xs sm:shadow-sm hover:shadow-card-hover transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#f0fdfa] text-teal-700 group-hover:bg-[#a1e3d8] transition-colors flex items-center justify-center shrink-0 border border-[#a1e3d8]/40">
                <Film className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 group-hover:text-teal-800 transition-colors text-base sm:text-lg">
                  Reels Bundles
                </h3>
                <p className="text-xs sm:text-sm text-slate-500">160+ Trending Formats • 1080P FHD • Zero Watermark</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-teal-700 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
          </Link>

          <Link
            to="/digital-products"
            className="group p-4 sm:p-6 bg-white rounded-2xl border border-slate-200 hover:border-[#a1e3d8] shadow-xs sm:shadow-sm hover:shadow-card-hover transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#f0fdfa] text-teal-700 group-hover:bg-[#a1e3d8] transition-colors flex items-center justify-center shrink-0 border border-[#a1e3d8]/40">
                <Download className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 group-hover:text-teal-800 transition-colors text-base sm:text-lg">
                  Digital Products & Templates
                </h3>
                <p className="text-xs sm:text-sm text-slate-500">Canva Packs • Creator Notion OS • E-books & Guides</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-teal-700 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
          </Link>

        </div>
      </section>

      {/* 3. TRENDING REELS BUNDLES SECTION (8 Top Products) */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-4 sm:mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-teal-800 font-extrabold text-[10px] sm:text-xs uppercase tracking-wider mb-1 bg-[#a1e3d8]/30 px-2 sm:px-2.5 py-0.5 rounded-full">
              <Film className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-teal-700" /> 160+ Trending Categories
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-slate-900">
              Trending Viral Reels Bundles
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 sm:mt-1">
              1080p Full HD vertical videos, zero watermark, pre-synced trending audio & instant Google Drive download.
            </p>
          </div>
          
          <Link
            to="/reels-bundles"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-teal-900 hover:text-teal-950 bg-[#a1e3d8] hover:bg-[#7be0d2] px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-xl transition-all self-start sm:self-auto shrink-0 shadow-xs"
          >
            <span>View All 160+ Bundles</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 8 Cards (2 cols on mobile, 4 on desktop) */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
          {featuredReelsBundles.map((product) => (
            <ProductCard key={product.id} product={product} type="reels-bundle" />
          ))}
        </div>
      </section>

      {/* 4. DIGITAL PRODUCTS & CREATOR TOOLKITS */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-4 sm:mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-teal-800 font-extrabold text-[10px] sm:text-xs uppercase tracking-wider mb-1 bg-[#a1e3d8]/30 px-2 sm:px-2.5 py-0.5 rounded-full">
              <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-teal-700" /> Creator Toolkit
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-slate-900">
              Featured Digital Products & Templates
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 sm:mt-1">
              Ready-to-use Notion workspaces, Canva viral post packs, and social media growth playbooks.
            </p>
          </div>
          
          <Link
            to="/digital-products"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-teal-900 hover:text-teal-950 bg-[#a1e3d8] hover:bg-[#7be0d2] px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-xl transition-all self-start sm:self-auto shrink-0 shadow-xs"
          >
            <span>View All Digital Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 4 Digital Product Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
          {featuredDigitalProducts.map((product) => (
            <ProductCard key={product.id} product={product} type="digital-product" />
          ))}
        </div>
      </section>

      {/* 5. WHY CHOOSE US */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-12">
          <span className="text-[10px] sm:text-xs font-extrabold text-teal-900 uppercase tracking-wider bg-[#a1e3d8] px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full">
            Why Dizozet?
          </span>
          <h2 className="text-xl sm:text-3xl font-black text-slate-900 mt-2 sm:mt-3">
            Built for Modern Video Creators & Agencies
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 sm:mt-2">
            Instant automated deliveries, transparent pricing, and 100% watermark-free content.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {whyChooseUsFeatures.map((feat, idx) => (
            <div
              key={idx}
              className="p-4 sm:p-6 bg-white rounded-xl sm:rounded-2xl border border-slate-200 hover:border-[#a1e3d8] shadow-xs sm:shadow-sm hover:shadow-card transition-all group"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#f0fdfa] text-teal-700 group-hover:bg-[#a1e3d8] transition-colors flex items-center justify-center mb-3 sm:mb-4 border border-[#a1e3d8]/40">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg mb-1 sm:mb-2 group-hover:text-teal-800 transition-colors">
                {feat.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                {feat.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. CUSTOMER REVIEWS */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-12">
          <span className="text-[10px] sm:text-xs font-extrabold text-teal-900 uppercase tracking-wider bg-[#a1e3d8] px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full">
            Real Reviews
          </span>
          <h2 className="text-xl sm:text-3xl font-black text-slate-900 mt-2 sm:mt-3">
            Loved by 15,000+ Creators Across India
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 sm:mt-2">
            Read authentic reviews from Indian creators using our reels bundles and digital toolkits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
          {(reviews || customerReviews).map((rev) => {
            const initialLetter = rev.name ? rev.name.charAt(0).toUpperCase() : 'U';

            return (
              <div
                key={rev.id}
                className="p-4 sm:p-6 bg-white rounded-xl sm:rounded-2xl border border-slate-200 hover:border-[#a1e3d8] shadow-xs sm:shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#a1e3d8] text-teal-950 font-black text-sm sm:text-base flex items-center justify-center border border-teal-300 shrink-0">
                        {initialLetter}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                          {rev.name}
                          {rev.verified && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                        </h4>
                        <p className="text-[10px] sm:text-xs text-slate-400">{rev.role}</p>
                      </div>
                    </div>
                    <div className="flex text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                  </div>

                  <h5 className="font-bold text-slate-800 text-xs sm:text-sm mb-1 sm:mb-2">
                    "{rev.title}"
                  </h5>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {rev.comment}
                  </p>
                </div>

                <div className="pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-slate-100 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-500">
                  <span className="font-semibold text-teal-800 bg-[#f0fdfa] border border-[#a1e3d8]/50 px-1.5 sm:px-2 py-0.5 rounded truncate max-w-[200px]">
                    Purchased: {rev.purchasedItem}
                  </span>
                  <span className="shrink-0">{rev.date}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-10">
          <span className="text-[10px] sm:text-xs font-extrabold text-teal-900 uppercase tracking-wider bg-[#a1e3d8] px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full">
            Got Questions?
          </span>
          <h2 className="text-xl sm:text-3xl font-black text-slate-900 mt-2 sm:mt-3">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Everything you need to know about Google Drive instant delivery, copyright, and payment security.
          </p>
        </div>

        <div className="space-y-2 sm:space-y-3">
          {generalFaqs.map((faq, idx) => {
            const isOpen = faqOpenIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 overflow-hidden shadow-xs transition-all"
              >
                <button
                  onClick={() => setFaqOpenIndex(isOpen ? -1 : idx)}
                  className="w-full p-3.5 sm:p-5 text-left font-bold text-slate-800 flex items-center justify-between gap-3 hover:text-teal-700 transition-colors"
                >
                  <span className="text-xs sm:text-base">{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 sm:w-5 sm:h-5 text-slate-400 transition-transform duration-300 shrink-0 ${
                      isOpen ? 'rotate-180 text-teal-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-3.5 pb-3.5 pt-1 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
