import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Tv, 
  Search, 
  SlidersHorizontal, 
  ShieldCheck, 
  Sparkles, 
  MessageCircle, 
  Zap
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';

export default function SubscriptionsPage() {
  const { subscriptions } = useStore();
  const [searchParams] = useSearchParams();
  const initialCat = searchParams.get('category') || 'All';

  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  const categories = [
    'All',
    'OTT & Entertainment',
    'AI & Productivity',
    'Design & Editing',
    'VPN & Security'
  ];

  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter(item => {
      const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
      const matchSearch = !searchQuery.trim() || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.shortDescription?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    }).sort((a, b) => {
      const priceA = a.plans?.[0]?.price || 0;
      const priceB = b.plans?.[0]?.price || 0;
      if (sortBy === 'price-low') return priceA - priceB;
      if (sortBy === 'price-high') return priceB - priceA;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return 0; // featured
    });
  }, [subscriptions, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="pb-20 pt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-slate-900 p-8 sm:p-12 text-white shadow-xl overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#a1e3d8]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-[#a1e3d8]/20 text-[#a1e3d8] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-[#a1e3d8]/30">
            <Tv className="w-3.5 h-3.5" /> 100% Genuine Accounts & Direct Invites
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Premium Subscriptions
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
            Order subscriptions for Google Gemini Advanced, Netflix 4K UHD, ChatGPT Plus, Canva Pro, YouTube Premium, Adobe Creative Cloud, and CapCut Pro directly via WhatsApp (7895768118).
          </p>
          <div className="pt-2">
            <a
              href="https://wa.me/917895768118?text=Hi%2C%20I%20want%20to%20inquire%20about%20subscription%20plans"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold shadow-sm transition-all"
            >
              <MessageCircle className="w-4 h-4" /> Order Directly on WhatsApp: 7895768118
            </a>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          
          {/* Search box */}
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search subscriptions (e.g. Gemini, Netflix, Canva, ChatGPT)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 font-medium"
            />
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs sm:text-sm font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-teal-500"
            >
              <option value="featured">Featured (Recommended)</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count & Guarantee Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <p className="font-semibold text-slate-700">
          Showing <span className="text-teal-800 font-bold">{filteredSubscriptions.length}</span> subscriptions
        </p>
        <div className="flex items-center gap-4 text-slate-600">
          <span className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Full Replacement Warranty
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <MessageCircle className="w-4 h-4 text-emerald-600" /> WhatsApp Orders: 7895768118
          </span>
        </div>
      </div>

      {/* Products Grid */}
      {filteredSubscriptions.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <Tv className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No subscriptions found</h3>
          <p className="text-sm text-slate-500">Try adjusting your search terms or category filter.</p>
          <button
            onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
            className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredSubscriptions.map((product) => (
            <ProductCard key={product.id} product={product} type="subscription" />
          ))}
        </div>
      )}

      {/* How WhatsApp Ordering Works */}
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8">
        <h3 className="font-extrabold text-slate-900 text-lg mb-4 text-center sm:text-left">
          How to Order Subscriptions via WhatsApp (7895768118)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm text-slate-600">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1.5">
            <div className="font-bold text-teal-800 flex items-center gap-1.5">
              <span className="w-6 h-6 rounded-full bg-[#a1e3d8] text-slate-900 font-extrabold flex items-center justify-center text-xs">1</span>
              Click 'Buy Now'
            </div>
            <p className="text-slate-500">
              Select your desired subscription and click the Buy Now button. It directly opens WhatsApp with the plan details pre-filled.
            </p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1.5">
            <div className="font-bold text-teal-800 flex items-center gap-1.5">
              <span className="w-6 h-6 rounded-full bg-[#a1e3d8] text-slate-900 font-extrabold flex items-center justify-center text-xs">2</span>
              Confirm on WhatsApp
            </div>
            <p className="text-slate-500">
              Our support team on WhatsApp (+91 78957 68118) verifies your email and confirms your payment method (UPI / QR).
            </p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1.5">
            <div className="font-bold text-teal-800 flex items-center gap-1.5">
              <span className="w-6 h-6 rounded-full bg-[#a1e3d8] text-slate-900 font-extrabold flex items-center justify-center text-xs">3</span>
              Instant Activation
            </div>
            <p className="text-slate-500">
              Your personal profile credentials or official email invite link are dispatched to you on WhatsApp within minutes.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
