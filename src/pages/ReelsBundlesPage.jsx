import React, { useState, useMemo } from 'react';
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
    <div className="pb-20 pt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-slate-900 p-8 sm:p-12 text-white shadow-xl overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#a1e3d8]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-[#a1e3d8]/20 text-[#a1e3d8] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-[#a1e3d8]/30">
            <Film className="w-3.5 h-3.5" /> Complete 130+ Viral Reels Catalogue
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Viral Reels Bundles Hub
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
            Ready-to-upload 1080p vertical videos with no watermark, background music synced, and Google Drive instant download links. Available in Personal and Commercial Reseller Rights licenses.
          </p>

          <div className="pt-2 flex flex-wrap gap-2 text-xs font-bold">
            <span className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-lg">✨ Zero Watermark</span>
            <span className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-lg">🚀 1080P Full HD (9:16)</span>
            <span className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-lg">⚡ Instant Google Drive Link</span>
            <span className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-lg">💼 Reseller Rights Ready</span>
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
              placeholder="Search 130+ bundles (e.g. AI, Cartoon, Fitness, Anime)..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisibleCount(16);
              }}
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
              <option value="popular">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="reels-count">Highest Reel Count</option>
            </select>
          </div>

        </div>

        {/* Categories scrollable pill list */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar">
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setVisibleCount(16);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
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

      {/* Meta Stats Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <p className="font-semibold text-slate-700">
          Showing <span className="text-teal-800 font-bold">{displayedBundles.length}</span> of <span className="font-bold">{filteredBundles.length}</span> total bundles
        </p>
        <div className="flex items-center gap-3">
          <span className="bg-[#a1e3d8]/40 text-teal-900 px-2 py-0.5 rounded font-bold">
            All 132 Vaultzet Bundles Included
          </span>
        </div>
      </div>

      {/* Grid of Reels Bundles */}
      {displayedBundles.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <Film className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No reels bundles found</h3>
          <p className="text-sm text-slate-500">Try searching for other keywords like "Cartoon", "AI", "Anime", or "Cars".</p>
          <button
            onClick={() => { setSelectedCategory('All'); setSearchQuery(''); setVisibleCount(16); }}
            className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
