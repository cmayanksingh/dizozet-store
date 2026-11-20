import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  Tv, 
  Film, 
  Download, 
  ShieldCheck, 
  Zap, 
  Star, 
  CheckCircle2, 
  Clock, 
  ChevronDown,
  MessageCircle,
  Clock4
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';
import { whyChooseUsFeatures, customerReviews, generalFaqs } from '../data/storeContent';

export default function HomePage() {
  const { subscriptions, reelsBundles, reviews } = useStore();

  useEffect(() => {
    document.title = "Dizozet - Buy 222,000+ Viral Reels Bundles & Premium Subscriptions in India";
  }, []);

  // Subscriptions: 4 main and popular
  const featuredSubscriptions = subscriptions.slice(0, 4);
  
  // Reels Bundles: Featured Trending Bundles (#1 is GTA 6 Viral Reels)
  const featuredReelsBundles = useMemo(() => {
    const gtaBundle = reelsBundles.find(b => b.id === 'rb-2000-gta-6-viral-reels' || b.title.toLowerCase().includes('gta 6'));
    const others = reelsBundles.filter(b => b.id !== gtaBundle?.id);
    return gtaBundle ? [gtaBundle, ...others.slice(0, 3)] : reelsBundles.slice(0, 4);
  }, [reelsBundles]);

  const [faqOpenIndex, setFaqOpenIndex] = useState(0);

  return (
    <div className="space-y-10 sm:space-y-16 lg:space-y-20 pb-12 sm:pb-20">
      
      {/* 1. HERO SECTION (Simple, Clean, Impactful) */}
      <section className="relative pt-6 pb-8 sm:pt-16 sm:pb-20 lg:pt-24 lg:pb-28 overflow-hidden bg-gradient-to-b from-[#f0fdfa]/50 via-white to-[#FAFAFA]">
        <div className="absolute top-0 inset-x-0 h-96 hero-glow pointer-events-none" />
        <div className="absolute inset-0 bg-grid-pattern opacity-25 pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4 sm:space-y-7">
          
          {/* Top Pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-[#a1e3d8]/40 border border-[#a1e3d8] text-teal-900 text-[11px] sm:text-xs font-bold tracking-wide shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-teal-700" />
            <span>Dizozet • Premium Digital Store</span>
          </div>

          {/* Headline */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight sm:leading-[1.12]">
            Premium Subscriptions & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600">
              Viral Reels Bundles
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Get instant activation on genuine OTT & AI subscriptions via WhatsApp, and download 130+ viral watermark-free reels bundles with commercial reseller rights.
          </p>

          {/* CTAs */}
          <div className="pt-1 sm:pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-4">
            <Link
              to="/subscriptions"
              className="w-full sm:w-auto px-5 py-3 sm:px-8 sm:py-4 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs sm:text-base rounded-xl sm:rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 group active:scale-95"
            >
              <Tv className="w-4 h-4 sm:w-5 sm:h-5 text-[#a1e3d8]" />
              <span>Explore Subscriptions</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#a1e3d8] group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/reels-bundles"
              className="w-full sm:w-auto px-5 py-3 sm:px-8 sm:py-4 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-base rounded-xl sm:rounded-2xl border-2 border-slate-200 hover:border-[#a1e3d8] shadow-xs sm:shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <Film className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600" />
              <span>Browse Reels Bundles</span>
            </Link>
          </div>

          {/* Stats Strip with 30+ Subscriptions */}
          <div className="pt-4 sm:pt-10 grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-6 border-t border-slate-200/80 max-w-4xl mx-auto text-center">
            <div className="p-2 sm:p-3">
              <div className="text-lg sm:text-3xl md:text-4xl font-black text-slate-900">30+</div>
              <div className="text-[10px] sm:text-xs text-slate-500 font-semibold mt-0.5 sm:mt-1">Subscriptions</div>
            </div>
            <div className="p-2 sm:p-3">
              <div className="text-lg sm:text-3xl md:text-4xl font-black text-slate-900">130+</div>
              <div className="text-[10px] sm:text-xs text-slate-500 font-semibold mt-0.5 sm:mt-1">Reels Bundles</div>
            </div>
            <div className="p-2 sm:p-3">
              <div className="text-lg sm:text-3xl md:text-4xl font-black text-slate-900">15K+</div>
              <div className="text-[10px] sm:text-xs text-slate-500 font-semibold mt-0.5 sm:mt-1">Happy Creators</div>
            </div>
            <div className="p-2 sm:p-3">
              <div className="text-lg sm:text-3xl md:text-4xl font-black text-teal-700">Instant</div>
              <div className="text-[10px] sm:text-xs text-slate-500 font-semibold mt-0.5 sm:mt-1">WhatsApp Delivery</div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. CATEGORY QUICK JUMP PILLS */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4">
          
          <Link
            to="/subscriptions"
            className="group p-3 sm:p-5 bg-white rounded-xl sm:rounded-2xl border border-slate-200 hover:border-[#a1e3d8] shadow-xs sm:shadow-sm hover:shadow-card-hover transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#f0fdfa] text-teal-700 group-hover:bg-[#a1e3d8] transition-colors flex items-center justify-center shrink-0 border border-[#a1e3d8]/40">
                <Tv className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 group-hover:text-teal-800 transition-colors text-sm sm:text-base">
                  Subscriptions
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-500">Gemini, Netflix, Canva, ChatGPT</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-300 group-hover:text-teal-700 group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            to="/reels-bundles"
            className="group p-3 sm:p-5 bg-white rounded-xl sm:rounded-2xl border border-slate-200 hover:border-[#a1e3d8] shadow-xs sm:shadow-sm hover:shadow-card-hover transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#f0fdfa] text-teal-700 group-hover:bg-[#a1e3d8] transition-colors flex items-center justify-center shrink-0 border border-[#a1e3d8]/40">
                <Film className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 group-hover:text-teal-800 transition-colors text-sm sm:text-base">
                  Reels Bundles
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-500">130+ Viral Categories & Formats</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-300 group-hover:text-teal-700 group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            to="/digital-products"
            className="group p-3 sm:p-5 bg-white rounded-xl sm:rounded-2xl border border-slate-200 hover:border-[#a1e3d8] shadow-xs sm:shadow-sm hover:shadow-card-hover transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#f0fdfa] text-teal-700 group-hover:bg-[#a1e3d8] transition-colors flex items-center justify-center shrink-0 border border-[#a1e3d8]/40">
                <Download className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 group-hover:text-teal-800 transition-colors text-sm sm:text-base">
                  Digital Products
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-500">Coming Soon</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-300 group-hover:text-teal-700 group-hover:translate-x-1 transition-all" />
          </Link>

        </div>
      </section>

      {/* 3. SUBSCRIPTIONS SECTION */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-4 sm:mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-teal-800 font-extrabold text-[10px] sm:text-xs uppercase tracking-wider mb-1 bg-[#a1e3d8]/30 px-2 sm:px-2.5 py-0.5 rounded-full">
              <Tv className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-teal-700" /> Subscriptions
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-slate-900">
              Popular Subscriptions
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 sm:mt-1">
              Order directly on WhatsApp (7895768118) for instant activation on your email.
            </p>
          </div>
          
          <Link
            to="/subscriptions"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-teal-900 hover:text-teal-950 bg-[#a1e3d8] hover:bg-[#7be0d2] px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl transition-all self-start sm:self-auto shrink-0 shadow-xs"
          >
            <span>View All Subscriptions</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Link>
        </div>

        {/* 4 Cards (2 cols on mobile, 4 on desktop) */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
          {featuredSubscriptions.map((product) => (
            <ProductCard key={product.id} product={product} type="subscription" />
          ))}
        </div>
      </section>

      {/* 4. REELS BUNDLES SECTION */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-4 sm:mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-teal-800 font-extrabold text-[10px] sm:text-xs uppercase tracking-wider mb-1 bg-[#a1e3d8]/30 px-2 sm:px-2.5 py-0.5 rounded-full">
              <Film className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-teal-700" /> 130+ Viral Reels
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-slate-900">
              Viral Reels Bundles
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 sm:mt-1">
              1080p Full HD vertical videos, zero watermark, pre-synced trending audio & Google Drive access.
            </p>
          </div>
          
          <Link
            to="/reels-bundles"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-teal-900 hover:text-teal-950 bg-[#a1e3d8] hover:bg-[#7be0d2] px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl transition-all self-start sm:self-auto shrink-0 shadow-xs"
          >
            <span>View More Bundles</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Link>
        </div>

        {/* 4 Cards (2 cols on mobile, 4 on desktop) */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
          {featuredReelsBundles.map((product) => (
            <ProductCard key={product.id} product={product} type="reels-bundle" />
          ))}
        </div>
      </section>

      {/* 5. DIGITAL PRODUCTS SECTION (COMING SOON) */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-4 sm:mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-teal-800 font-extrabold text-[10px] sm:text-xs uppercase tracking-wider mb-1 bg-[#a1e3d8]/30 px-2 sm:px-2.5 py-0.5 rounded-full">
              <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-teal-700" /> Digital Library
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-slate-900">
              Featured Digital Products & Templates
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 sm:mt-1">
              E-books, Notion creator workspaces, Canva packs, and AI prompt databases.
            </p>
          </div>
        </div>

        {/* Coming Soon Showcase Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-14 text-white text-center shadow-lg border border-slate-800 relative overflow-hidden">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-[#a1e3d8]/20 text-[#a1e3d8] flex items-center justify-center mx-auto mb-3 sm:mb-4 border border-[#a1e3d8]/30">
            <Clock4 className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <span className="inline-block bg-[#a1e3d8] text-slate-900 font-black text-[10px] sm:text-xs uppercase px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full mb-2 sm:mb-3">
            Coming Soon
          </span>
          <h3 className="text-lg sm:text-2xl md:text-3xl font-black text-white mb-1.5 sm:mb-2">
            Creator Toolkits & Templates Dropping Soon!
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed mb-4 sm:mb-6">
            We are curating high-impact Notion templates, Canva carousels, and viral video editing presets. Stay tuned!
          </p>
          <a
            href="https://wa.me/917895768118?text=Hi%2C%20I%20want%20to%20know%20about%20upcoming%20digital%20products"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-[#a1e3d8] hover:bg-[#7be0d2] text-slate-900 font-extrabold text-[11px] sm:text-xs rounded-xl shadow-xs transition-all"
          >
            <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Notify Me on WhatsApp
          </a>
        </div>
      </section>

      {/* 6. WHY CHOOSE US */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-12">
          <span className="text-[10px] sm:text-xs font-extrabold text-teal-900 uppercase tracking-wider bg-[#a1e3d8] px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full">
            Why Dizozet?
          </span>
          <h2 className="text-xl sm:text-3xl font-black text-slate-900 mt-2 sm:mt-3">
            Built for Modern Creators & Professionals
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 sm:mt-2">
            Direct activations, transparent pricing, and instant automated deliveries.
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

      {/* 7. CUSTOMER REVIEWS (Indian Names, Avatar Initials, No Photo) */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-12">
          <span className="text-[10px] sm:text-xs font-extrabold text-teal-900 uppercase tracking-wider bg-[#a1e3d8] px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full">
            Real Reviews
          </span>
          <h2 className="text-xl sm:text-3xl font-black text-slate-900 mt-2 sm:mt-3">
            Loved by 15,000+ Creators Across India
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 sm:mt-2">
            Read authentic reviews from Indian creators using our subscriptions and reels daily.
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
                      {/* Avatar with First Letter of Name (NO PHOTO) */}
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

      {/* 8. FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-10">
          <span className="text-[10px] sm:text-xs font-extrabold text-teal-900 uppercase tracking-wider bg-[#a1e3d8] px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full">
            Got Questions?
          </span>
          <h2 className="text-xl sm:text-3xl font-black text-slate-900 mt-2 sm:mt-3">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Learn more about WhatsApp orders, Google Drive deliveries, and warranties.
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
