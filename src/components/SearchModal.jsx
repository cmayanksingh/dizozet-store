import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Film, Tv, Download, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function SearchModal() {
  const { isSearchOpen, setIsSearchOpen, subscriptions, reelsBundles, digitalProducts, storeConfig } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearchTerm('');
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const query = searchTerm.toLowerCase().trim();

  // Filter Subscriptions
  const matchedSubscriptions = query
    ? subscriptions.filter(s => 
        s.title.toLowerCase().includes(query) || 
        s.category.toLowerCase().includes(query) ||
        s.shortDescription?.toLowerCase().includes(query)
      ).map(s => ({ ...s, productType: 'subscription' }))
    : subscriptions.slice(0, 4).map(s => ({ ...s, productType: 'subscription' }));

  // Filter Reels Bundles
  const matchedReels = query
    ? reelsBundles.filter(r =>
        r.title.toLowerCase().includes(query) ||
        r.category?.toLowerCase().includes(query) ||
        (r.categories && r.categories.some(c => c.toLowerCase().includes(query)))
      ).slice(0, 15).map(r => ({ ...r, productType: 'reels-bundle' }))
    : reelsBundles.slice(0, 4).map(r => ({ ...r, productType: 'reels-bundle' }));

  // Filter Digital Products
  const matchedDigital = query
    ? digitalProducts.filter(d =>
        d.title.toLowerCase().includes(query) ||
        d.category?.toLowerCase().includes(query) ||
        d.shortDescription?.toLowerCase().includes(query)
      ).map(d => ({ ...d, productType: 'digital-product' }))
    : digitalProducts.slice(0, 4).map(d => ({ ...d, productType: 'digital-product' }));

  const allResults = [
    ...(selectedTab === 'all' || selectedTab === 'subscriptions' ? matchedSubscriptions : []),
    ...(selectedTab === 'all' || selectedTab === 'reels' ? matchedReels : []),
    ...(selectedTab === 'all' || selectedTab === 'digital' ? matchedDigital : []),
  ];

  const handleSelectProduct = (product) => {
    setIsSearchOpen(false);
    navigate(`/product/${product.productType}/${product.id}`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20 flex justify-center items-start">
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsSearchOpen(false)}
      />

      <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-100 z-10 animate-scaleUp">
        
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-teal-600 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search subscriptions, 130+ reels bundles, templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 text-slate-800 placeholder-slate-400 font-medium text-base outline-none bg-transparent"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            ESC
          </kbd>
        </div>

        {/* Category Tabs */}
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center gap-2 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setSelectedTab('all')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              selectedTab === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            All Results
          </button>
          <button
            onClick={() => setSelectedTab('subscriptions')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              selectedTab === 'subscriptions'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <Tv className="w-3.5 h-3.5" /> Subscriptions ({matchedSubscriptions.length})
          </button>
          <button
            onClick={() => setSelectedTab('reels')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              selectedTab === 'reels'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <Film className="w-3.5 h-3.5" /> Reels Bundles ({matchedReels.length})
          </button>
          <button
            onClick={() => setSelectedTab('digital')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              selectedTab === 'digital'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <Download className="w-3.5 h-3.5" /> Digital Products ({matchedDigital.length})
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 divide-y divide-slate-100">
          {allResults.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <p className="font-semibold text-slate-700">No products found matching "{searchTerm}"</p>
              <p className="text-xs text-slate-400 mt-1">Try keywords like 'Gemini', 'Cartoon', 'Netflix', 'Notion', or 'Canva'</p>
            </div>
          ) : (
            allResults.map((product) => {
              const price = product.productType === 'subscription' 
                ? product.plans?.[0]?.price || 149 
                : product.personalPrice || product.price || 99;
              
              return (
                <div
                  key={`${product.productType}-${product.id}`}
                  onClick={() => handleSelectProduct(product)}
                  className="py-3 px-3 hover:bg-slate-50 rounded-2xl cursor-pointer flex items-center justify-between gap-3 group transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="w-12 h-12 rounded-xl object-cover shrink-0 bg-slate-100 border border-slate-200"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=120&q=80';
                      }}
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold text-teal-900 bg-[#a1e3d8]/40 px-1.5 py-0.5 rounded">
                          {product.productType === 'subscription' ? 'Subscription' : product.productType === 'reels-bundle' ? 'Reels Bundle' : 'Digital Product'}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {product.category}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-800 truncate group-hover:text-teal-700 transition-colors">
                        {product.title}
                      </h4>
                    </div>
                  </div>

                  <div className="text-right shrink-0 flex items-center gap-3">
                    <div>
                      <span className="text-sm font-black text-slate-900">
                        {storeConfig.currencySymbol}{price}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between px-5">
          <span>Search 130+ viral bundles and subscriptions</span>
          <span className="text-teal-800 font-semibold">DigiVault Fast Search</span>
        </div>

      </div>
    </div>
  );
}
