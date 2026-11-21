import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Download, 
  Search, 
  SlidersHorizontal, 
  Sparkles, 
  Zap, 
  ArrowLeft,
  CheckCircle2,
  Layers
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';

export default function DigitalProductsPage() {
  const { digitalProducts } = useStore();
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  useEffect(() => {
    document.title = "Digital Toolkits, Canva Templates & Creator Assets | Dizozet Store";
  }, []);

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');

  const categories = useMemo(() => {
    const set = new Set();
    digitalProducts.forEach(p => {
      if (p.category) set.add(p.category);
    });
    return ['All', ...Array.from(set)];
  }, [digitalProducts]);

  const filteredProducts = useMemo(() => {
    return digitalProducts.filter(p => {
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query || 
        p.title.toLowerCase().includes(query) ||
        p.category?.toLowerCase().includes(query) ||
        p.shortDescription?.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return (a.price || 0) - (b.price || 0);
      if (sortBy === 'price-high') return (b.price || 0) - (a.price || 0);
      return (b.rating || 5) - (a.rating || 5);
    });
  }, [digitalProducts, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="space-y-6 sm:space-y-10 pb-12 sm:pb-20">
      
      {/* 1. HERO HEADER */}
      <section className="bg-gradient-to-b from-[#f0fdfa] via-white to-[#FAFAFA] border-b border-slate-200/80 pt-6 pb-8 sm:pt-12 sm:pb-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3 sm:space-y-4 text-center">
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#a1e3d8]/40 border border-[#a1e3d8] text-teal-900 text-[11px] sm:text-xs font-bold tracking-wide shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-teal-700" />
            <span>Digital Library • Instant Automated Download</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Creator Toolkits & Digital Products
          </h1>

          <p className="text-xs sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            High-converting Canva templates, Notion creator workspaces, viral algorithm playbooks, and video editing asset packs with commercial rights.
          </p>

          {/* Quick Stats Pill */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 sm:gap-6 text-xs text-slate-600 font-semibold">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 100% Instant Delivery
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Lifetime Cloud Access
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Commercial Use Allowed
            </span>
          </div>

        </div>
      </section>

      {/* 2. SEARCH & FILTER CONTROLS */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-xs space-y-3">
          
          {/* Search bar & Sort */}
          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-4 items-center justify-between">
            <div className="relative w-full sm:flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search templates, guides, toolkits..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 sm:py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-slate-50/50"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-between sm:justify-end">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5" /> Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs sm:text-sm py-2 px-3 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:border-teal-500"
              >
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none text-xs font-bold">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* 3. PRODUCT GRID */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-14 text-center space-y-3">
            <Download className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base sm:text-lg font-bold text-slate-800">No products found</h3>
            <p className="text-xs sm:text-sm text-slate-500">Try adjusting your search query or selected category.</p>
            <button
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
              className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
            {filteredProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} type="digital-product" />
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
