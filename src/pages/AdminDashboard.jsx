import React, { useState } from 'react';
import { 
  Tv, 
  Film, 
  Download, 
  ShoppingBag, 
  Settings, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  Check, 
  X, 
  DollarSign, 
  TrendingUp, 
  ShieldCheck, 
  RefreshCw,
  Save,
  MessageCircle
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function AdminDashboard() {
  const { 
    subscriptions, 
    reelsBundles, 
    digitalProducts, 
    orders, 
    storeConfig, 
    setStoreConfig,
    addProduct, 
    updateProduct, 
    deleteProduct,
    updateOrderStatus,
    resetAllDataToDefault
  } = useStore();

  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [successToast, setSuccessToast] = useState('');

  // Modals & Forms
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Generic new product state
  const [newProduct, setNewProduct] = useState({
    title: '',
    category: 'Trending Reels',
    price: 99,
    reelCount: 1000,
    personalPrice: 99,
    resellerPrice: 199,
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
    googleDriveLink: 'https://drive.google.com',
    downloadUrl: 'https://drive.google.com',
    shortDescription: '',
    format: 'MP4 / 1080P Full HD (9:16)',
    plansText: '1 Month:149, 3 Months:399, 12 Months:1199',
    deliveryInfo: 'WhatsApp Order activation: 7895768118.'
  });

  const [settingsForm, setSettingsForm] = useState({ ...storeConfig });

  const showNotification = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3000);
  };

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrders = orders.length;

  // Handle Add Product
  const handleCreateProduct = (e) => {
    e.preventDefault();
    const id = `item-${Date.now()}`;
    const slug = newProduct.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (activeTab === 'subscriptions') {
      const parsedPlans = newProduct.plansText.split(',').map((pStr, idx) => {
        const parts = pStr.trim().split(':');
        return {
          id: `plan-${idx}`,
          name: parts[0] || '1 Month',
          price: Number(parts[1]) || 149,
          duration: parts[0] || '30 Days',
          isPopular: idx === 0
        };
      });

      const productObj = {
        id,
        slug,
        type: 'subscription',
        title: newProduct.title,
        category: newProduct.category || 'OTT & Entertainment',
        rating: 4.9,
        reviewCount: 10,
        thumbnail: newProduct.thumbnail,
        shortDescription: newProduct.shortDescription || 'Official subscription with instant WhatsApp activation.',
        plans: parsedPlans.length ? parsedPlans : [{ id: '1-m', name: '1 Month', price: newProduct.price }],
        deliveryInfo: newProduct.deliveryInfo
      };
      addProduct('subscription', productObj);
      showNotification('Subscription product created successfully!');
    } else if (activeTab === 'reels') {
      const productObj = {
        id,
        slug,
        type: 'reels-bundle',
        title: newProduct.title,
        category: newProduct.category || 'Trending Reels',
        reelCount: Number(newProduct.reelCount) || 1000,
        personalPrice: Number(newProduct.personalPrice) || 99,
        resellerPrice: Number(newProduct.resellerPrice) || 199,
        thumbnail: newProduct.thumbnail,
        googleDriveLink: newProduct.googleDriveLink || 'https://drive.google.com',
        shortDescription: newProduct.shortDescription || '1080P vertical videos with trending audio.',
        rating: 4.9,
        reviewCount: 15
      };
      addProduct('reels-bundle', productObj);
      showNotification('Reels Bundle created successfully!');
    } else {
      const productObj = {
        id,
        slug,
        type: 'digital-product',
        title: newProduct.title,
        category: newProduct.category || 'E-books & Guides',
        price: Number(newProduct.price) || 99,
        format: newProduct.format || 'Digital Download',
        thumbnail: newProduct.thumbnail,
        downloadUrl: newProduct.downloadUrl || 'https://drive.google.com',
        shortDescription: newProduct.shortDescription || 'Comprehensive digital asset.',
        rating: 4.9,
        reviewCount: 12
      };
      addProduct('digital-product', productObj);
      showNotification('Digital Product created successfully!');
    }

    setIsAddModalOpen(false);
  };

  // Handle Edit Save
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    const { categoryType, data } = editingProduct;
    updateProduct(categoryType, data.id, data);
    showNotification('Product details updated successfully!');
    setEditingProduct(null);
  };

  // Handle Delete
  const handleDeleteProduct = (categoryType, id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteProduct(categoryType, id);
      showNotification('Product deleted.');
    }
  };

  // Handle Save Settings
  const handleSaveSettings = (e) => {
    e.preventDefault();
    setStoreConfig(settingsForm);
    showNotification('Store & Payment settings saved successfully!');
  };

  return (
    <div className="pb-24 pt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#a1e3d8]">
              Admin Control Panel
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            {storeConfig.storeName} Management Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            WhatsApp Order Helpline: <strong className="text-white">7895768118</strong> | Subscriptions, Reels Bundles & Digital Products.
          </p>
        </div>

        {/* Global stats pills */}
        <div className="flex items-center gap-3">
          <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl text-center border border-white/10">
            <div className="text-xs text-slate-400 font-semibold">Total Revenue</div>
            <div className="text-lg font-black text-[#a1e3d8]">{storeConfig.currencySymbol}{totalRevenue}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl text-center border border-white/10">
            <div className="text-xs text-slate-400 font-semibold">Total Orders</div>
            <div className="text-lg font-black text-white">{totalOrders}</div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-fadeIn">
          <Check className="w-4 h-4" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-slate-200">
        <button
          onClick={() => { setActiveTab('overview'); setSearchTerm(''); }}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-[#a1e3d8]" />
          Overview & Stats
        </button>

        <button
          onClick={() => { setActiveTab('subscriptions'); setSearchTerm(''); }}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'subscriptions'
              ? 'bg-[#a1e3d8] text-slate-900 shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Tv className="w-4 h-4" />
          Subscriptions ({subscriptions.length})
        </button>

        <button
          onClick={() => { setActiveTab('reels'); setSearchTerm(''); }}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'reels'
              ? 'bg-[#a1e3d8] text-slate-900 shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Film className="w-4 h-4" />
          Reels Bundles ({reelsBundles.length})
        </button>

        <button
          onClick={() => { setActiveTab('digital'); setSearchTerm(''); }}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'digital'
              ? 'bg-[#a1e3d8] text-slate-900 shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Download className="w-4 h-4" />
          Digital Products ({digitalProducts.length})
        </button>

        <button
          onClick={() => { setActiveTab('orders'); setSearchTerm(''); }}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'orders'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShoppingBag className="w-4 h-4 text-[#a1e3d8]" />
          Orders ({orders.length})
        </button>

        <button
          onClick={() => { setActiveTab('settings'); setSearchTerm(''); }}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'settings'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Settings className="w-4 h-4 text-[#a1e3d8]" />
          Store & WhatsApp Settings
        </button>
      </div>

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-bold uppercase">Total Revenue</span>
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-black text-slate-900">
                {storeConfig.currencySymbol}{totalRevenue}
              </div>
              <div className="text-xs text-emerald-600 font-bold">
                ✓ Live sales revenue
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-bold uppercase">Total Orders</span>
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-black text-slate-900">
                {totalOrders}
              </div>
              <div className="text-xs text-slate-500">
                Direct & WhatsApp orders
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-bold uppercase">Reels Bundles</span>
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center">
                  <Film className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-black text-slate-900">
                {reelsBundles.length}
              </div>
              <div className="text-xs text-slate-500">
                132 Vaultzet Bundles
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-bold uppercase">WhatsApp Orders</span>
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-black text-slate-900">
                7895768118
              </div>
              <div className="text-xs text-emerald-600 font-semibold">
                Direct WhatsApp Helpline
              </div>
            </div>
          </div>

          {/* Recent Orders Overview */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900">Recent Customer Orders</h3>
              <button
                onClick={() => setActiveTab('orders')}
                className="text-xs font-bold text-teal-800 hover:underline"
              >
                View All Orders →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-bold uppercase">
                  <tr>
                    <th className="p-3 rounded-l-xl">Order ID</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Items</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Payment</th>
                    <th className="p-3 rounded-r-xl">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.slice(0, 5).map((o) => (
                    <tr key={o.orderId} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-slate-800">{o.orderId}</td>
                      <td className="p-3">
                        <div className="font-bold text-slate-800">{o.customer?.name}</div>
                        <div className="text-[11px] text-slate-400">{o.customer?.email}</div>
                      </td>
                      <td className="p-3">
                        {o.items?.map(i => i.title).join(', ').slice(0, 45)}...
                      </td>
                      <td className="p-3 font-black text-slate-900">
                        {storeConfig.currencySymbol}{o.total}
                      </td>
                      <td className="p-3">{o.paymentMethod}</td>
                      <td className="p-3">
                        <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full text-[10px]">
                          {o.orderStatus || 'Delivered'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. SUBSCRIPTIONS MANAGEMENT */}
      {activeTab === 'subscriptions' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search subscriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 font-medium"
              />
            </div>

            <button
              onClick={() => {
                setNewProduct({
                  title: '',
                  category: 'AI & Productivity',
                  price: 999,
                  thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
                  plansText: '1 Year Plan:999, 6 Months:599',
                  shortDescription: 'Official subscription with direct WhatsApp activation on 7895768118.',
                  deliveryInfo: 'WhatsApp Activation: 7895768118.'
                });
                setIsAddModalOpen(true);
              }}
              className="w-full sm:w-auto px-4 py-2.5 bg-slate-900 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-[#a1e3d8]" /> Add New Subscription
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase border-b border-slate-200">
                <tr>
                  <th className="p-4">Subscription</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Plans / Pricing</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subscriptions.filter(s => s.title.toLowerCase().includes(searchTerm.toLowerCase())).map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50">
                    <td className="p-4 flex items-center gap-3">
                      <img
                        src={sub.thumbnail}
                        alt={sub.title}
                        className="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                      />
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{sub.title}</div>
                        <div className="text-[11px] text-slate-400 line-clamp-1">{sub.shortDescription}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="bg-[#a1e3d8]/40 text-teal-900 px-2 py-0.5 rounded font-bold text-[11px]">
                        {sub.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="font-extrabold text-slate-900">
                        {storeConfig.currencySymbol}{sub.plans?.[0]?.price || 149}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {sub.plans?.length || 1} duration plans configured
                      </div>
                    </td>
                    <td className="p-4 font-bold text-slate-700">
                      ★ {sub.rating || 4.9} ({sub.reviewCount || 100})
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingProduct({ categoryType: 'subscription', data: { ...sub } })}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-all"
                          title="Edit Subscription"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct('subscription', sub.id, sub.title)}
                          className="p-1.5 bg-slate-100 hover:bg-red-50 hover:text-red-600 rounded-lg text-slate-600 transition-all"
                          title="Delete Subscription"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. REELS BUNDLES MANAGEMENT */}
      {activeTab === 'reels' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search 130+ reels bundles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 font-medium"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="text-xs text-slate-500 font-semibold">
                Total: <strong>{reelsBundles.length} Bundles</strong>
              </span>
              <button
                onClick={() => {
                  setNewProduct({
                    title: '',
                    category: 'Trending Reels',
                    reelCount: 1000,
                    personalPrice: 99,
                    resellerPrice: 199,
                    thumbnail: 'https://media-cdn.cosmofeed.com/chat/Neon-4000--Cartoon-Video-Bundle-2026-10-10-03-03-49.png?w=1200&q=75',
                    googleDriveLink: 'https://drive.google.com',
                    shortDescription: '1080P Full HD viral vertical video bundle ready to post.'
                  });
                  setIsAddModalOpen(true);
                }}
                className="px-4 py-2.5 bg-slate-900 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4 text-[#a1e3d8]" /> Add Reels Bundle
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="max-h-[600px] overflow-y-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-bold uppercase sticky top-0 border-b border-slate-200 z-10">
                  <tr>
                    <th className="p-4">Reels Bundle</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Reel Count</th>
                    <th className="p-4">Personal / Reseller</th>
                    <th className="p-4">Google Drive Link</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reelsBundles.filter(r => r.title.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 50).map((reel) => (
                    <tr key={reel.id} className="hover:bg-slate-50">
                      <td className="p-4 flex items-center gap-3">
                        <img
                          src={reel.thumbnail}
                          alt={reel.title}
                          className="w-12 h-12 rounded-xl object-cover bg-slate-900 border border-slate-200 shrink-0"
                          onError={(e) => {
                            e.target.src = 'https://media-cdn.cosmofeed.com/chat/Neon-4000--Cartoon-Video-Bundle-2026-10-10-03-03-49.png?w=1200&q=75';
                          }}
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 text-sm truncate max-w-xs">{reel.title}</div>
                          <div className="text-[10px] text-slate-400">ID: {reel.id}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="bg-[#a1e3d8]/40 text-teal-900 px-2 py-0.5 rounded font-bold text-[11px]">
                          {reel.category}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-slate-800">
                        🎬 {reel.reelCount || 1000}+ Reels
                      </td>
                      <td className="p-4">
                        <div className="font-extrabold text-slate-900">
                          Personal: {storeConfig.currencySymbol}{reel.personalPrice || 99}
                        </div>
                        <div className="text-slate-500 font-semibold text-[11px]">
                          Reseller: {storeConfig.currencySymbol}{reel.resellerPrice || 199}
                        </div>
                      </td>
                      <td className="p-4 truncate max-w-xs font-mono text-[11px] text-slate-500">
                        {reel.googleDriveLink || 'Drive Link Ready'}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditingProduct({ categoryType: 'reels-bundle', data: { ...reel } })}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-all"
                            title="Edit Bundle"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct('reels-bundle', reel.id, reel.title)}
                            className="p-1.5 bg-slate-100 hover:bg-red-50 hover:text-red-600 rounded-lg text-slate-600 transition-all"
                            title="Delete Bundle"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. DIGITAL PRODUCTS MANAGEMENT */}
      {activeTab === 'digital' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search digital products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 font-medium"
              />
            </div>

            <button
              onClick={() => {
                setNewProduct({
                  title: '',
                  category: 'E-books & Guides',
                  price: 99,
                  format: 'PDF E-Book (120+ Pages)',
                  thumbnail: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80',
                  downloadUrl: 'https://drive.google.com',
                  shortDescription: 'High-impact digital product.'
                });
                setIsAddModalOpen(true);
              }}
              className="w-full sm:w-auto px-4 py-2.5 bg-slate-900 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-[#a1e3d8]" /> Add Digital Product
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase border-b border-slate-200">
                <tr>
                  <th className="p-4">Product Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Format</th>
                  <th className="p-4">Price</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {digitalProducts.filter(d => d.title.toLowerCase().includes(searchTerm.toLowerCase())).map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="p-4 flex items-center gap-3">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                      />
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{item.title}</div>
                        <div className="text-[11px] text-slate-400 line-clamp-1">{item.shortDescription}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="bg-[#a1e3d8]/40 text-teal-900 px-2 py-0.5 rounded font-bold text-[11px]">
                        {item.category}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-slate-700">
                      {item.format || 'Digital Download'}
                    </td>
                    <td className="p-4 font-black text-slate-900 text-sm">
                      {storeConfig.currencySymbol}{item.price}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingProduct({ categoryType: 'digital-product', data: { ...item } })}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-all"
                          title="Edit Product"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct('digital-product', item.id, item.title)}
                          className="p-1.5 bg-slate-100 hover:bg-red-50 hover:text-red-600 rounded-lg text-slate-600 transition-all"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-900">
              Customer Orders History ({orders.length})
            </h3>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase border-b border-slate-200">
                <tr>
                  <th className="p-4">Order ID & Date</th>
                  <th className="p-4">Customer Details</th>
                  <th className="p-4">Items Ordered</th>
                  <th className="p-4">Total Amount</th>
                  <th className="p-4">Payment Method</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((o) => (
                  <tr key={o.orderId} className="hover:bg-slate-50">
                    <td className="p-4">
                      <div className="font-mono font-black text-slate-900">{o.orderId}</div>
                      <div className="text-[11px] text-slate-400">{new Date(o.date).toLocaleDateString()}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{o.customer?.name}</div>
                      <div className="text-slate-500">{o.customer?.email}</div>
                      <div className="text-[10px] text-slate-400">{o.customer?.phone}</div>
                    </td>
                    <td className="p-4">
                      {o.items?.map((it, i) => (
                        <div key={i} className="text-slate-800 font-medium">
                          • {it.title} ({it.planName || 'Standard'})
                        </div>
                      ))}
                    </td>
                    <td className="p-4 font-black text-slate-900 text-sm">
                      {storeConfig.currencySymbol}{o.total}
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-slate-700">{o.paymentMethod}</div>
                      <div className="text-[10px] font-mono text-slate-400">{o.transactionId}</div>
                    </td>
                    <td className="p-4">
                      <select
                        value={o.orderStatus || 'Delivered'}
                        onChange={(e) => {
                          updateOrderStatus(o.orderId, e.target.value);
                          showNotification(`Order ${o.orderId} status set to ${e.target.value}`);
                        }}
                        className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 outline-none focus:border-teal-500"
                      >
                        <option value="Delivered">Delivered</option>
                        <option value="Paid">Paid</option>
                        <option value="Pending">Pending</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. SETTINGS TAB */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-xl font-black text-slate-900">
              Payment Gateway, WhatsApp & Store Settings
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Configure your WhatsApp number (7895768118), UPI ID, Razorpay Key, and branding.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Store Name
              </label>
              <input
                type="text"
                value={settingsForm.storeName}
                onChange={(e) => setSettingsForm({ ...settingsForm, storeName: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                WhatsApp Order Number (Subscriptions)
              </label>
              <input
                type="text"
                value={settingsForm.supportWhatsApp}
                onChange={(e) => setSettingsForm({ ...settingsForm, supportWhatsApp: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                UPI ID (For QR Code & Direct UPI Payments)
              </label>
              <input
                type="text"
                value={settingsForm.upiId}
                onChange={(e) => setSettingsForm({ ...settingsForm, upiId: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Razorpay Key ID
              </label>
              <input
                type="text"
                value={settingsForm.razorpayKeyId}
                onChange={(e) => setSettingsForm({ ...settingsForm, razorpayKeyId: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Top Announcement Bar Text
              </label>
              <input
                type="text"
                value={settingsForm.announcementText}
                onChange={(e) => setSettingsForm({ ...settingsForm, announcementText: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="submit"
              className="px-8 py-3 bg-[#a1e3d8] hover:bg-[#7be0d2] text-slate-900 font-black text-sm rounded-xl shadow-sm transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Save Configuration
            </button>

            <button
              type="button"
              onClick={() => {
                if (window.confirm('Reset all catalogues and settings back to original defaults?')) {
                  resetAllDataToDefault();
                  showNotification('Store data reset to default successfully.');
                }
              }}
              className="text-xs text-red-500 hover:underline flex items-center gap-1 font-semibold"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset All Products to Factory Default
            </button>
          </div>
        </form>
      )}

      {/* MODAL: ADD PRODUCT */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex justify-center items-center">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)} />
          <div className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-slate-200 shadow-2xl z-10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-lg text-slate-900 capitalize">
                Add New {activeTab === 'subscriptions' ? 'Subscription' : activeTab === 'reels' ? 'Reels Bundle' : 'Digital Product'}
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Google Gemini Advanced 1 Year"
                  value={newProduct.title}
                  onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Category</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI & Productivity, Trending Reels"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal-500"
                />
              </div>

              {activeTab === 'reels' ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Personal Price (₹)</label>
                    <input
                      type="number"
                      required
                      value={newProduct.personalPrice}
                      onChange={(e) => setNewProduct({ ...newProduct, personalPrice: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Reseller Price (₹)</label>
                    <input
                      type="number"
                      required
                      value={newProduct.resellerPrice}
                      onChange={(e) => setNewProduct({ ...newProduct, resellerPrice: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Reels Count</label>
                    <input
                      type="number"
                      value={newProduct.reelCount}
                      onChange={(e) => setNewProduct({ ...newProduct, reelCount: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Google Drive Link</label>
                    <input
                      type="url"
                      required
                      value={newProduct.googleDriveLink}
                      onChange={(e) => setNewProduct({ ...newProduct, googleDriveLink: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal-500"
                    />
                  </div>
                </div>
              ) : activeTab === 'subscriptions' ? (
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Plans Config (Format: Name:Price comma separated)
                  </label>
                  <input
                    type="text"
                    required
                    value={newProduct.plansText}
                    onChange={(e) => setNewProduct({ ...newProduct, plansText: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal-500 font-mono"
                  />
                  <span className="text-[10px] text-slate-400">e.g. 1 Year Plan:999, 6 Months:599</span>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Price (₹)</label>
                    <input
                      type="number"
                      required
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal-500"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="font-bold text-slate-700 block mb-1">Download URL</label>
                    <input
                      type="url"
                      required
                      value={newProduct.downloadUrl}
                      onChange={(e) => setNewProduct({ ...newProduct, downloadUrl: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="font-bold text-slate-700 block mb-1">Thumbnail Image URL</label>
                <input
                  type="url"
                  required
                  value={newProduct.thumbnail}
                  onChange={(e) => setNewProduct({ ...newProduct, thumbnail: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={newProduct.shortDescription}
                  onChange={(e) => setNewProduct({ ...newProduct, shortDescription: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#a1e3d8] text-slate-900 font-black rounded-xl shadow-sm"
                >
                  Create Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT PRODUCT */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex justify-center items-center">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setEditingProduct(null)} />
          <div className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-slate-200 shadow-2xl z-10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-lg text-slate-900">
                Edit Product: {editingProduct.data.title}
              </h3>
              <button onClick={() => setEditingProduct(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={editingProduct.data.title}
                  onChange={(e) => setEditingProduct({
                    ...editingProduct,
                    data: { ...editingProduct.data, title: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Category</label>
                <input
                  type="text"
                  required
                  value={editingProduct.data.category || ''}
                  onChange={(e) => setEditingProduct({
                    ...editingProduct,
                    data: { ...editingProduct.data, category: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal-500"
                />
              </div>

              {editingProduct.categoryType === 'reels-bundle' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Personal Price (₹)</label>
                    <input
                      type="number"
                      value={editingProduct.data.personalPrice || 99}
                      onChange={(e) => setEditingProduct({
                        ...editingProduct,
                        data: { ...editingProduct.data, personalPrice: Number(e.target.value) }
                      })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Reseller Price (₹)</label>
                    <input
                      type="number"
                      value={editingProduct.data.resellerPrice || 199}
                      onChange={(e) => setEditingProduct({
                        ...editingProduct,
                        data: { ...editingProduct.data, resellerPrice: Number(e.target.value) }
                      })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>
              )}

              {editingProduct.categoryType === 'digital-product' && (
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    value={editingProduct.data.price || 99}
                    onChange={(e) => setEditingProduct({
                      ...editingProduct,
                      data: { ...editingProduct.data, price: Number(e.target.value) }
                    })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              )}

              <div>
                <label className="font-bold text-slate-700 block mb-1">Thumbnail Image URL</label>
                <input
                  type="url"
                  value={editingProduct.data.thumbnail}
                  onChange={(e) => setEditingProduct({
                    ...editingProduct,
                    data: { ...editingProduct.data, thumbnail: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#a1e3d8] text-slate-900 font-black rounded-xl shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
