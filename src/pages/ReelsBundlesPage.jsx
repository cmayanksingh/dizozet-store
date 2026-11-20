import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Film, 
  Search, 
  SlidersHorizontal, 
  Check, 
  Sparkles, 
  Zap, 
  Layers
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';

export default function ReelsBundlesPage() {
  const { reelsBundles } = useStore();
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  useEffect(() => {
    document.title = "Viral Reels Bundles (1080P FHD, No Watermark) | Dizozet Store";
  }, []);

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [visibleCount, setVisibleCount] = useState(16);

  // Extract all distinct categories from the 132 bundles
  const allCategories = useMemo(() => {
    const set = new Set();
    reelsBundles.forEach(b => {
      if (b.category) set.add(b.category);
      if (b.categories) b.categories.forEach(c => set.add(c));
    });
    const priority = [
      'All',
      'Trending Reels',
      'AI Reels',
      'Devotional & Spiritual',
      'Fitness & Sports',
      'Cars & Vehicles',
      'Anime Reels',
      'Comedy Reels',
      'Horror Reels',
      'Gaming Reels',
      'Kids & Baby Reels',
      'Story Reels',
      'Motivation & Mindset',
      'Health Reels',
      'Entertainment Reels'
    ];
    Array.from(set).forEach(c => {
      if (!priority.includes(c) && c !== 'pdf') {
        priority.push(c);
      }
    });
    return priority;
  }, [reelsBundles]);

  // Filtered and sorted bundles
  const filteredBundles = useMemo(() => {
    return reelsBundles.filter(item => {
      const matchCat = selectedCategory === 'All' || 
        item.category === selectedCategory ||
        (item.categories && item.categories.includes(selectedCategory));
      
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || 
        item.title.toLowerCase().includes(q) ||
        item.category?.toLowerCase().includes(q) ||
        item.shortDescription?.toLowerCase().includes(q);

      return matchCat && matchSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return (a.personalPrice || 99) - (b.personalPrice || 99);
      if (sortBy === 'price-high') return (b.personalPrice || 99) - (a.personalPrice || 99);
      if (sortBy === 'reels-count') return (b.reelCount || 1000) - (a.reelCount || 1000);
      return 0; // default popular
    });
  }, [reelsBundles, selectedCategory, searchQuery, sortBy]);

  const displayedBundles = filteredBundles.slice(0, visibleCount);
  const hasMore = visibleCount < filteredBundles.length;

  const handleLoadMore = () => {
    setVisibleCount(prev => Math.min(prev + 16, filteredBundles.length));
  };

  return (
    <div className="pb-12 sm:pb-20 pt-4 sm:pt-8 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-4 sm:space-y-8">
      
      {/* Header Banner */}
      <div className="relative rounded-2xl sm:rounded-3xl bg-slate-900 p-5 sm:p-8 md:p-12 text-white shadow-xl overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#a1e3d8]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-[#a1e3d8]/20 text-[#a1e3d8] px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider border border-[#a1e3d8]/30">
            <Film className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Complete 130+ Viral Reels Catalogue
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight">
            Viral Reels Bundles Hub
          </h1>
          <p className="text-xs sm:text-base text-slate-300 font-normal leading-relaxed">
            Ready-to-upload 1080p vertical videos with no watermark, background music synced, and Google Drive instant download links. Available in Personal and Commercial Reseller Rights licenses.
          </p>

          <div className="pt-1 sm:pt-2 flex flex-wrap gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-bold">
            <span className="bg-white/10 backdrop-blur-sm px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-md sm:rounded-lg">✨ Zero Watermark</span>
            <span className="bg-white/10 backdrop-blur-sm px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-md sm:rounded-lg">🚀 1080P Full HD (9:16)</span>
            <span className="bg-white/10 backdrop-blur-sm px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-md sm:rounded-lg">⚡ Instant Google Drive Link</span>
            <span className="bg-white/10 backdrop-blur-sm px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-md sm:rounded-lg">💼 Reseller Rights Ready</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-200 shadow-xs sm:shadow-sm space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 items-center justify-between">
          
          {/* Search box */}
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search 130+ bundles (e.g. AI, Cartoon, Fitness, Anime)..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisibleCount(16);
              }}
              className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 font-medium"
            />
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <SlidersHorizontal className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs sm:text-sm font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-2.5 sm:px-3 py-2 sm:py-2.5 outline-none focus:border-teal-500 w-full sm:w-auto"
            >
              <option value="popular">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="reels-count">Highest Reel Count</option>
            </select>
          </div>

        </div>

        {/* Categories scrollable pill list */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar">
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setVisibleCount(16);
              }}
              className={`px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-sm font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Meta Stats Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3 text-xs text-slate-500">
        <p className="font-semibold text-slate-700">
          Showing <span className="text-teal-800 font-bold">{displayedBundles.length}</span> of <span className="font-bold">{filteredBundles.length}</span> total bundles
        </p>
        <div className="flex items-center gap-3">
          <span className="bg-[#a1e3d8]/40 text-teal-900 px-2 py-0.5 rounded font-bold text-[10px] sm:text-xs">
            All 132 Vaultzet Bundles Included
          </span>
        </div>
      </div>

      {/* Grid of Reels Bundles (2 cols on mobile, 4 on desktop) */}
      {displayedBundles.length === 0 ? (
        <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center border border-slate-200 space-y-3">
          <Film className="w-10 h-10 sm:w-12 sm:h-12 text-slate-300 mx-auto" />
          <h3 className="text-base sm:text-lg font-bold text-slate-800">No reels bundles found</h3>
          <p className="text-xs sm:text-sm text-slate-500">Try searching for other keywords like "Cartoon", "AI", "Anime", or "Cars".</p>
          <button
            onClick={() => { setSelectedCategory('All'); setSearchQuery(''); setVisibleCount(16); }}
            className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-6">
          {displayedBundles.map((product) => (
            <ProductCard key={product.id} product={product} type="reels-bundle" />
          ))}
        </div>
      )}

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center pt-6">
          <button
            onClick={handleLoadMore}
            className="px-8 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-sm rounded-2xl border-2 border-slate-200 hover:border-[#a1e3d8] shadow-sm transition-all inline-flex items-center gap-2 group"
          >
            <Layers className="w-4 h-4 text-teal-600" />
            <span>Load More Bundles ({filteredBundles.length - displayedBundles.length} Remaining)</span>
          </button>
        </div>
      )}

    </div>
  );
}
