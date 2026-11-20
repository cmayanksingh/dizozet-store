import React, { useState, useMemo } from 'react';
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
  MessageCircle,
  Lock,
  Key,
  Eye,
  EyeOff,
  Tag,
  Star,
  Award,
  ExternalLink,
  FileSpreadsheet,
  ArrowUpDown,
  ChevronRight,
  User,
  AlertTriangle,
  UploadCloud,
  Copy,
  Layers,
  CheckCircle2,
  Clock,
  LogOut
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
    coupons,
    addCoupon,
    updateCoupon,
    deleteCoupon,
    reviews,
    addReview,
    updateReview,
    deleteReview,
    adminPassword,
    isAdminAuthenticated,
    loginAdmin,
    logoutAdmin,
    changeAdminPassword,
    addProduct, 
    updateProduct, 
    deleteProduct,
    updateOrderStatus,
    deleteOrder,
    addManualOrder,
    exportStoreBackup,
    importStoreBackup,
    resetAllDataToDefault
  } = useStore();

  // Login Gate State
  const [loginPasswordInput, setLoginPasswordInput] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Main Dashboard Tab
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'subscriptions', 'reels', 'digital', 'reviews', 'coupons', 'settings', 'security'
  const [searchTerm, setSearchTerm] = useState('');
  const [successToast, setSuccessToast] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [orderDateRange, setOrderDateRange] = useState('all'); // 'all', 'today', 'week', 'month'

  // Modals
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // { type, data }
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [isAddReviewModalOpen, setIsAddReviewModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [isAddCouponModalOpen, setIsAddCouponModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [isManualOrderModalOpen, setIsManualOrderModalOpen] = useState(false);

  // Password Change Form State
  const [pwdForm, setPwdForm] = useState({ current: '', newPwd: '', confirm: '' });
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [pwdError, setPwdError] = useState('');

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState({ ...storeConfig });

  // Announcement Banner Form
  const [bannerForm, setBannerForm] = useState({
    announcementText: storeConfig.announcementText || '⚡ FLASH SALE: FLAT 85% OFF TODAY | USE CODE: DIZO85',
    isBannerActive: storeConfig.isBannerActive !== false
  });

  // New Product Template State
  const [productForm, setProductForm] = useState({
    type: 'subscription',
    title: '',
    category: 'AI & Productivity',
    badge: 'Popular',
    rating: 5.0,
    reviewCount: 150,
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
    brandLogo: '',
    shortDescription: '',
    description: '',
    plans: [
      { id: 'p-1', name: '1 Year Plan', price: 999, regularPrice: 1999, duration: '365 Days', isPopular: true },
      { id: 'p-2', name: '6 Months Plan', price: 599, regularPrice: 1199, duration: '180 Days', isPopular: false }
    ],
    features: [
      'Full Official Warranty & Support',
      'Instant WhatsApp Activation: 7895768118'
    ],
    // Reels fields
    reelCount: 1000,
    personalPrice: 99,
    resellerPrice: 199,
    googleDriveLink: 'https://drive.google.com',
    // Digital fields
    price: 99,
    regularPrice: 499,
    format: 'MP4 / 1080P Full HD (9:16)',
    downloadUrl: 'https://drive.google.com',
    deliveryInfo: 'Instant WhatsApp Activation & Google Drive Link'
  });

  // Review Form State
  const [reviewForm, setReviewForm] = useState({
    name: '',
    role: 'Content Creator, Delhi',
    rating: 5,
    title: 'Super fast delivery and amazing quality!',
    comment: 'Activated within minutes and customer support is extremely polite and fast.',
    purchasedItem: 'AI & Entertainment Subscription',
    verified: true
  });

  // Coupon Form State
  const [couponForm, setCouponForm] = useState({
    code: '',
    discountPercent: 50,
    minAmount: 99,
    description: 'Special Discount Offer',
    isActive: true
  });

  // Manual Order Form
  const [manualOrderForm, setManualOrderForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '+91 ',
    customerCity: '',
    itemTitle: '',
    itemType: 'subscription',
    itemPrice: 199,
    paymentMethod: 'UPI / WhatsApp Pay',
    paymentStatus: 'Paid',
    orderStatus: 'Delivered'
  });

  const showNotification = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3500);
  };

  // ----------------------------------------------------
  // LOGIN SUBMIT
  // ----------------------------------------------------
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');
    const res = loginAdmin(loginPasswordInput);
    if (!res.success) {
      setLoginError(res.message);
    } else {
      setLoginPasswordInput('');
      showNotification('Welcome to Admin Portal!');
    }
  };

  // ----------------------------------------------------
  // SALES REPORTS CALCULATIONS & FILTERING
  // ----------------------------------------------------
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      // Search
      const q = searchTerm.toLowerCase();
      const matchSearch = 
        !searchTerm || 
        o.orderId.toLowerCase().includes(q) ||
        (o.customer?.name || '').toLowerCase().includes(q) ||
        (o.customer?.email || '').toLowerCase().includes(q) ||
        (o.customer?.phone || '').toLowerCase().includes(q);

      // Status
      const matchStatus = orderStatusFilter === 'All' || o.orderStatus === orderStatusFilter;

      // Date Range
      let matchDate = true;
      if (orderDateRange !== 'all') {
        const orderDate = new Date(o.date).getTime();
        const now = Date.now();
        if (orderDateRange === 'today') {
          matchDate = (now - orderDate) <= 86400000;
        } else if (orderDateRange === 'week') {
          matchDate = (now - orderDate) <= 7 * 86400000;
        } else if (orderDateRange === 'month') {
          matchDate = (now - orderDate) <= 30 * 86400000;
        }
      }

      return matchSearch && matchStatus && matchDate;
    });
  }, [orders, searchTerm, orderStatusFilter, orderDateRange]);

  const totalSalesRevenue = filteredOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrdersCount = filteredOrders.length;
  const avgOrderValue = totalOrdersCount > 0 ? Math.round(totalSalesRevenue / totalOrdersCount) : 0;
  const deliveredOrdersCount = filteredOrders.filter(o => o.orderStatus === 'Delivered').length;

  // Breakdown by product type
  const subscriptionsRevenue = filteredOrders.reduce((sum, o) => {
    const subItems = (o.items || []).filter(i => i.type === 'subscription');
    return sum + subItems.reduce((s, it) => s + (it.price * (it.quantity || 1)), 0);
  }, 0);

  const reelsRevenue = filteredOrders.reduce((sum, o) => {
    const reelItems = (o.items || []).filter(i => i.type === 'reels-bundle');
    return sum + reelItems.reduce((s, it) => s + (it.price * (it.quantity || 1)), 0);
  }, 0);

  const digitalRevenue = filteredOrders.reduce((sum, o) => {
    const digiItems = (o.items || []).filter(i => i.type === 'digital-product' || !i.type);
    return sum + digiItems.reduce((s, it) => s + (it.price * (it.quantity || 1)), 0);
  }, 0);

  // Export Sales CSV
  const handleExportSalesCSV = () => {
    const headers = ['Order ID', 'Date', 'Customer Name', 'Phone', 'Email', 'City', 'Items', 'Subtotal', 'Discount', 'Total', 'Payment Method', 'Payment Status', 'Order Status', 'Transaction ID'];
    const rows = filteredOrders.map(o => [
      `"${o.orderId}"`,
      `"${new Date(o.date).toLocaleString()}"`,
      `"${(o.customer?.name || '').replace(/"/g, '""')}"`,
      `"${(o.customer?.phone || '').replace(/"/g, '""')}"`,
      `"${(o.customer?.email || '').replace(/"/g, '""')}"`,
      `"${(o.customer?.city || '').replace(/"/g, '""')}"`,
      `"${(o.items || []).map(i => i.title).join(' | ').replace(/"/g, '""')}"`,
      o.subtotal || o.total || 0,
      o.discount || 0,
      o.total || 0,
      `"${o.paymentMethod || 'UPI'}"`,
      `"${o.paymentStatus || 'Paid'}"`,
      `"${o.orderStatus || 'Delivered'}"`,
      `"${o.transactionId || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Dizo_Pulse_Sales_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('Sales Report CSV downloaded!');
  };

  // ----------------------------------------------------
  // BACKUP & RESTORE JSON
  // ----------------------------------------------------
  const handleDownloadBackup = () => {
    const jsonStr = exportStoreBackup();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Dizo_Pulse_Full_Store_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showNotification('Full store backup JSON downloaded!');
  };

  const handleUploadBackup = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const res = importStoreBackup(event.target.result);
      if (res.success) {
        showNotification('Store data restored successfully from backup!');
      } else {
        alert(res.message);
      }
    };
    reader.readAsText(file);
  };

  // ----------------------------------------------------
  // PASSWORD CHANGE
  // ----------------------------------------------------
  const handleChangePasswordSubmit = (e) => {
    e.preventDefault();
    setPwdError('');
    if (pwdForm.newPwd !== pwdForm.confirm) {
      setPwdError('New password and confirm password do not match.');
      return;
    }
    const res = changeAdminPassword(pwdForm.current, pwdForm.newPwd);
    if (!res.success) {
      setPwdError(res.message);
    } else {
      setPwdForm({ current: '', newPwd: '', confirm: '' });
      showNotification('Admin password updated successfully!');
    }
  };

  // ----------------------------------------------------
  // PRODUCT ADD / EDIT / DELETE HANDLERS
  // ----------------------------------------------------
  const handleOpenAddProduct = (type) => {
    const defaultCategory = type === 'subscription' ? 'AI & Productivity' : type === 'reels-bundle' ? 'Trending Reels' : 'E-books & Guides';
    setProductForm({
      type,
      title: '',
      category: defaultCategory,
      badge: 'Popular',
      rating: 5.0,
      reviewCount: 150,
      thumbnail: type === 'reels-bundle' 
        ? 'https://media-cdn.cosmofeed.com/chat/Neon-4000--Cartoon-Video-Bundle-2026-10-10-03-03-49.png?w=1200&q=75' 
        : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
      brandLogo: '',
      shortDescription: '',
      description: '',
      plans: [
        { id: 'p-1', name: '1 Year Plan', price: 999, regularPrice: 1999, duration: '365 Days', isPopular: true },
        { id: 'p-2', name: '6 Months Plan', price: 599, regularPrice: 1199, duration: '180 Days', isPopular: false }
      ],
      features: [
        'Full Official Warranty & Support',
        'Instant WhatsApp Activation: 7895768118'
      ],
      reelCount: 1000,
      personalPrice: 99,
      resellerPrice: 199,
      googleDriveLink: 'https://drive.google.com',
      price: 99,
      regularPrice: 499,
      format: 'MP4 / 1080P Full HD (9:16)',
      downloadUrl: 'https://drive.google.com',
      deliveryInfo: 'Instant WhatsApp Activation & Google Drive Link'
    });
    setIsAddProductModalOpen(true);
  };

  const handleSaveAddProduct = (e) => {
    e.preventDefault();
    const id = `${productForm.type === 'subscription' ? 'sub' : productForm.type === 'reels-bundle' ? 'rb' : 'digi'}-${Date.now()}`;
    const slug = productForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const newProd = {
      ...productForm,
      id,
      slug,
      rating: Number(productForm.rating) || 5.0,
      reviewCount: Number(productForm.reviewCount) || 10,
      reelCount: Number(productForm.reelCount) || 1000,
      personalPrice: Number(productForm.personalPrice) || 99,
      resellerPrice: Number(productForm.resellerPrice) || 199,
      price: Number(productForm.price) || 99,
      regularPrice: Number(productForm.regularPrice) || 499
    };

    addProduct(productForm.type, newProd);
    showNotification(`New ${productForm.type} created successfully!`);
    setIsAddProductModalOpen(false);
  };

  const handleSaveEditProduct = (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    const { type, data } = editingProduct;
    updateProduct(type, data.id, {
      ...data,
      rating: Number(data.rating) || 5.0,
      reviewCount: Number(data.reviewCount) || 10,
      reelCount: Number(data.reelCount) || 1000,
      personalPrice: Number(data.personalPrice) || 99,
      resellerPrice: Number(data.resellerPrice) || 199,
      price: Number(data.price) || 99,
      regularPrice: Number(data.regularPrice) || 499
    });
    showNotification('Product details updated successfully!');
    setEditingProduct(null);
  };

  const handleDeleteProduct = (type, id, title) => {
    if (window.confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      deleteProduct(type, id);
      showNotification('Product removed from store.');
    }
  };

  // ----------------------------------------------------
  // REVIEWS HANDLERS
  // ----------------------------------------------------
  const handleSaveAddReview = (e) => {
    e.preventDefault();
    addReview(reviewForm);
    showNotification('Customer review added successfully!');
    setIsAddReviewModalOpen(false);
    setReviewForm({
      name: '',
      role: 'Content Creator, Delhi',
      rating: 5,
      title: 'Amazing quality and fast delivery!',
      comment: '',
      purchasedItem: 'AI & Entertainment Subscription',
      verified: true
    });
  };

  const handleSaveEditReview = (e) => {
    e.preventDefault();
    if (!editingReview) return;
    updateReview(editingReview.id, editingReview);
    showNotification('Customer review updated!');
    setEditingReview(null);
  };

  // ----------------------------------------------------
  // COUPONS HANDLERS
  // ----------------------------------------------------
  const handleSaveAddCoupon = (e) => {
    e.preventDefault();
    if (!couponForm.code.trim()) return;
    addCoupon({
      ...couponForm,
      discountPercent: Number(couponForm.discountPercent) || 10,
      minAmount: Number(couponForm.minAmount) || 0
    });
    showNotification(`Coupon ${couponForm.code.toUpperCase()} created!`);
    setIsAddCouponModalOpen(false);
    setCouponForm({
      code: '',
      discountPercent: 50,
      minAmount: 99,
      description: 'Special Discount Offer',
      isActive: true
    });
  };

  const handleSaveEditCoupon = (e) => {
    e.preventDefault();
    if (!editingCoupon) return;
    updateCoupon(editingCoupon.id, editingCoupon);
    showNotification('Coupon updated successfully!');
    setEditingCoupon(null);
  };

  // ----------------------------------------------------
  // SETTINGS & BANNER SAVE
  // ----------------------------------------------------
  const handleSaveStoreSettings = (e) => {
    e.preventDefault();
    setStoreConfig(prev => ({
      ...prev,
      ...settingsForm,
      announcementText: bannerForm.announcementText,
      isBannerActive: bannerForm.isBannerActive
    }));
    showNotification('Store settings and announcement banner saved!');
  };

  // ----------------------------------------------------
  // CREATE MANUAL ORDER
  // ----------------------------------------------------
  const handleSaveManualOrder = (e) => {
    e.preventDefault();
    const newOrd = {
      orderId: 'ORD-' + Math.floor(10000 + Math.random() * 90000),
      date: new Date().toISOString(),
      customer: {
        name: manualOrderForm.customerName || 'Customer',
        email: manualOrderForm.customerEmail || 'customer@gmail.com',
        phone: manualOrderForm.customerPhone || '+91 78957 68118',
        city: manualOrderForm.customerCity || 'India'
      },
      items: [
        {
          id: `item-${Date.now()}`,
          title: manualOrderForm.itemTitle || 'Custom Service / Subscription',
          type: manualOrderForm.itemType,
          price: Number(manualOrderForm.itemPrice) || 199,
          quantity: 1,
          thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
          deliveryInfo: 'WhatsApp Activation: 7895768118'
        }
      ],
      subtotal: Number(manualOrderForm.itemPrice) || 199,
      discount: 0,
      total: Number(manualOrderForm.itemPrice) || 199,
      paymentMethod: manualOrderForm.paymentMethod,
      paymentStatus: manualOrderForm.paymentStatus,
      orderStatus: manualOrderForm.orderStatus,
      transactionId: 'MANUAL-' + Date.now().toString(36).toUpperCase()
    };

    addManualOrder(newOrd);
    showNotification(`Manual order ${newOrd.orderId} created!`);
    setIsManualOrderModalOpen(false);
  };

  // ====================================================
  // 1. RENDER: LOGIN GATE SCREEN IF NOT AUTHENTICATED
  // ====================================================
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-slate-900/5">
        <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/80 shadow-2xl p-8 sm:p-10 space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-slate-900 text-[#a1e3d8] rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-teal-500/10">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {storeConfig.storeName} Admin Portal
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Enter your master password to access sales reports, full product editing, ratings, and store settings.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold uppercase text-slate-700 mb-1.5">
                Admin Password / PIN
              </label>
              <div className="relative">
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  value={loginPasswordInput}
                  onChange={(e) => setLoginPasswordInput(e.target.value)}
                  placeholder="Enter admin password..."
                  required
                  autoFocus
                  className="w-full pl-4 pr-11 py-3 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-teal-500 focus:bg-white transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-700"
                >
                  {showLoginPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {loginError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-sm rounded-2xl shadow-lg shadow-slate-900/20 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Key className="w-4 h-4 text-[#a1e3d8]" />
              <span>Unlock Admin Panel</span>
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center">
            <span className="text-[11px] text-slate-400">
              Default password: <strong className="text-slate-600 font-mono">admin123</strong> (You can change this inside Security tab).
            </span>
          </div>

        </div>
      </div>
    );
  }

  // ====================================================
  // 2. RENDER: FULL ADMIN CONTROL DASHBOARD
  // ====================================================
  return (
    <div className="pb-24 pt-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Toast Alert */}
      {successToast && (
        <div className="fixed top-24 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-fadeIn">
          <Check className="w-4 h-4" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Top Banner & Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider text-[#a1e3d8]">
              Master Admin Control Center
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            {storeConfig.storeName} Management Portal
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            WhatsApp Order Helpline: <strong className="text-white">7895768118</strong> | Full Control Over Sales, Products, Ratings & Password.
          </p>
        </div>

        {/* Global Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/10 transition-all flex items-center gap-1.5"
            title="Open Live Store in New Tab"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#a1e3d8]" />
            <span>Live Store</span>
          </a>

          <button
            onClick={handleExportSalesCSV}
            className="px-3.5 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold rounded-xl border border-emerald-500/30 transition-all flex items-center gap-1.5"
            title="Download Excel / CSV Sales Report"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Sales CSV</span>
          </button>

          <button
            onClick={handleDownloadBackup}
            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/10 transition-all flex items-center gap-1.5"
            title="Download Store JSON Backup"
          >
            <Download className="w-3.5 h-3.5 text-[#a1e3d8]" />
            <span>Backup</span>
          </button>

          <button
            onClick={logoutAdmin}
            className="px-3.5 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-bold rounded-xl border border-red-500/30 transition-all flex items-center gap-1.5"
            title="Logout from Admin Panel"
          >
            <LogOut className="w-3.5 h-3.5 text-red-400" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-b border-slate-200">
        {[
          { id: 'orders', label: `Sales Reports (${orders.length})`, icon: TrendingUp },
          { id: 'subscriptions', label: `Subscriptions (${subscriptions.length})`, icon: Tv },
          { id: 'reels', label: `Reels Bundles (${reelsBundles.length})`, icon: Film },
          { id: 'digital', label: `Digital Products (${digitalProducts.length})`, icon: Download },
          { id: 'reviews', label: `Ratings & Reviews (${reviews.length})`, icon: Star },
          { id: 'coupons', label: `Coupons & Offers (${coupons.length})`, icon: Tag },
          { id: 'settings', label: 'Store & WhatsApp Settings', icon: Settings },
          { id: 'security', label: 'Password & Security', icon: Key },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSearchTerm(''); }}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#a1e3d8]' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ==================================================== */}
      {/* TAB 1: SALES REPORTS & ORDERS MANAGEMENT             */}
      {/* ==================================================== */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase">Total Revenue</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">
                {storeConfig.currencySymbol}{totalSalesRevenue.toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-400">From {totalOrdersCount} processed orders</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase">Total Orders</span>
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">
                {totalOrdersCount}
              </div>
              <p className="text-[11px] text-slate-400">{deliveredOrdersCount} marked as Delivered</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase">Avg Order Value (AOV)</span>
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">
                {storeConfig.currencySymbol}{avgOrderValue}
              </div>
              <p className="text-[11px] text-slate-400">Average ticket per customer</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase">Delivery Success</span>
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-600">
                {totalOrdersCount > 0 ? Math.round((deliveredOrdersCount / totalOrdersCount) * 100) : 100}%
              </div>
              <p className="text-[11px] text-slate-400">Instant WhatsApp & Drive Delivery</p>
            </div>

          </div>

          {/* Sales Breakdown by Category Strip */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs font-medium text-slate-700">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900">Category Revenue:</span>
            </div>
            <div className="flex flex-wrap items-center gap-6">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                Subscriptions: <strong className="text-slate-900">{storeConfig.currencySymbol}{subscriptionsRevenue}</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                Reels Bundles: <strong className="text-slate-900">{storeConfig.currencySymbol}{reelsRevenue}</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                Digital Products: <strong className="text-slate-900">{storeConfig.currencySymbol}{digitalRevenue}</strong>
              </span>
            </div>
          </div>

          {/* Controls: Search, Filters, CSV Export & Add Manual Order */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {/* Search */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search customer, phone, order ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 font-medium"
                />
              </div>

              {/* Status Filter */}
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Delivered">Delivered</option>
                <option value="Processing">Processing</option>
                <option value="Pending">Pending</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              {/* Date Filter */}
              <select
                value={orderDateRange}
                onChange={(e) => setOrderDateRange(e.target.value)}
                className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <button
                onClick={handleExportSalesCSV}
                className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={() => setIsManualOrderModalOpen(true)}
                className="px-3.5 py-2 bg-slate-900 text-white text-xs font-black rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4 text-[#a1e3d8]" />
                <span>+ Create Order</span>
              </button>
            </div>

          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-black uppercase border-b border-slate-200">
                  <tr>
                    <th className="p-4">Order ID & Date</th>
                    <th className="p-4">Customer Details</th>
                    <th className="p-4">Items Purchased</th>
                    <th className="p-4">Total Amount</th>
                    <th className="p-4">Payment</th>
                    <th className="p-4">Order Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-12 text-center text-slate-400 font-medium">
                        No orders found matching the filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((ord) => (
                      <tr key={ord.orderId} className="hover:bg-slate-50/80 transition-colors">
                        
                        {/* ID & Date */}
                        <td className="p-4 whitespace-nowrap">
                          <div className="font-mono font-black text-slate-900">{ord.orderId}</div>
                          <div className="text-[11px] text-slate-400">
                            {new Date(ord.date).toLocaleDateString()} {new Date(ord.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>

                        {/* Customer */}
                        <td className="p-4">
                          <div className="font-bold text-slate-900">{ord.customer?.name || 'Customer'}</div>
                          <div className="text-[11px] text-slate-500 font-mono">{ord.customer?.phone}</div>
                          <div className="text-[10px] text-slate-400">{ord.customer?.email}</div>
                        </td>

                        {/* Items */}
                        <td className="p-4 max-w-xs">
                          <div className="font-semibold text-slate-800 line-clamp-2">
                            {(ord.items || []).map(i => `${i.title} (${i.planName || 'x' + (i.quantity || 1)})`).join(', ')}
                          </div>
                          <div className="text-[10px] text-teal-700 font-bold mt-0.5">
                            {ord.items?.length || 1} product(s)
                          </div>
                        </td>

                        {/* Total */}
                        <td className="p-4 whitespace-nowrap">
                          <div className="font-black text-slate-900 text-sm">
                            {storeConfig.currencySymbol}{ord.total}
                          </div>
                          {ord.discount > 0 && (
                            <span className="text-[10px] text-emerald-600 font-bold">
                              Saved {storeConfig.currencySymbol}{ord.discount}
                            </span>
                          )}
                        </td>

                        {/* Payment */}
                        <td className="p-4 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold border border-emerald-200">
                            {ord.paymentStatus || 'Paid'}
                          </span>
                          <div className="text-[10px] text-slate-400 mt-1">{ord.paymentMethod}</div>
                        </td>

                        {/* Status Dropdown */}
                        <td className="p-4 whitespace-nowrap">
                          <select
                            value={ord.orderStatus || 'Delivered'}
                            onChange={(e) => updateOrderStatus(ord.orderId, e.target.value)}
                            className={`px-2.5 py-1 text-[11px] font-black rounded-lg border focus:outline-none ${
                              ord.orderStatus === 'Delivered'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : ord.orderStatus === 'Processing'
                                ? 'bg-blue-50 text-blue-800 border-blue-200'
                                : ord.orderStatus === 'Pending'
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : 'bg-red-50 text-red-800 border-red-200'
                            }`}
                          >
                            <option value="Delivered">Delivered</option>
                            <option value="Processing">Processing</option>
                            <option value="Pending">Pending</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>

                        {/* Actions */}
                        <td className="p-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* WhatsApp Customer */}
                            {ord.customer?.phone && (
                              <a
                                href={`https://wa.me/${ord.customer.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(ord.customer.name || '')}%2C%20regarding%20your%20order%20${ord.orderId}%20from%20${encodeURIComponent(storeConfig.storeName)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition-colors"
                                title="Chat with customer on WhatsApp"
                              >
                                <MessageCircle className="w-4 h-4" />
                              </a>
                            )}

                            {/* View Modal */}
                            <button
                              onClick={() => setSelectedOrderDetails(ord)}
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors"
                              title="View Order Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {/* Delete Order */}
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete order ${ord.orderId}?`)) {
                                  deleteOrder(ord.orderId);
                                  showNotification('Order deleted.');
                                }
                              }}
                              className="p-1.5 bg-slate-100 hover:bg-red-50 hover:text-red-600 rounded-lg text-slate-600 transition-colors"
                              title="Delete Order"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 2: SUBSCRIPTIONS & SERVICES                      */}
      {/* ==================================================== */}
      {activeTab === 'subscriptions' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search subscriptions & services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 font-medium"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="text-xs text-slate-500 font-semibold">
                Total: <strong>{subscriptions.length} Subscriptions</strong>
              </span>
              <button
                onClick={() => handleOpenAddProduct('subscription')}
                className="px-4 py-2.5 bg-slate-900 text-white font-black text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4 text-[#a1e3d8]" /> + Add Subscription
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-black uppercase border-b border-slate-200">
                  <tr>
                    <th className="p-4">Subscription Service</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Plans / Pricing</th>
                    <th className="p-4">Rating & Reviews</th>
                    <th className="p-4">Badge</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {subscriptions.filter(s => s.title.toLowerCase().includes(searchTerm.toLowerCase()) || (s.category || '').toLowerCase().includes(searchTerm.toLowerCase())).map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50">
                      
                      <td className="p-4 flex items-center gap-3">
                        <img
                          src={sub.thumbnail}
                          alt={sub.title}
                          className="w-12 h-12 rounded-xl object-cover bg-slate-900 border border-slate-200 shrink-0"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&q=80';
                          }}
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 text-sm truncate max-w-xs">{sub.title}</div>
                          <div className="text-[11px] text-slate-400 line-clamp-1">{sub.shortDescription}</div>
                        </div>
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        <span className="bg-[#a1e3d8]/40 text-teal-900 px-2.5 py-0.5 rounded-full font-bold text-[11px]">
                          {sub.category}
                        </span>
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        <div className="font-black text-slate-900 text-sm">
                          {storeConfig.currencySymbol}{sub.plans?.[0]?.price || 149}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {sub.plans?.length || 1} duration tier(s)
                        </div>
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        <div className="font-bold text-slate-800 flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{sub.rating || 5.0}</span>
                          <span className="text-slate-400 text-[10px]">({sub.reviewCount || 100})</span>
                        </div>
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        {sub.badge ? (
                          <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded-full">
                            {sub.badge}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[10px]">—</span>
                        )}
                      </td>

                      <td className="p-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setEditingProduct({ type: 'subscription', data: { ...sub } })}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors"
                            title="Edit Subscription"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct('subscription', sub.id, sub.title)}
                            className="p-1.5 bg-slate-100 hover:bg-red-50 hover:text-red-600 rounded-lg text-slate-600 transition-colors"
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
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 3: REELS BUNDLES (130+)                          */}
      {/* ==================================================== */}
      {activeTab === 'reels' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search reels bundles by title, category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 font-medium"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="text-xs text-slate-500 font-semibold">
                Total: <strong>{reelsBundles.length} Reels Bundles</strong>
              </span>
              <button
                onClick={() => handleOpenAddProduct('reels-bundle')}
                className="px-4 py-2.5 bg-slate-900 text-white font-black text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4 text-[#a1e3d8]" /> + Add Reels Bundle
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="max-h-[650px] overflow-y-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-black uppercase sticky top-0 border-b border-slate-200 z-10">
                  <tr>
                    <th className="p-4">Reels Bundle</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Reels Count</th>
                    <th className="p-4">Personal / Reseller</th>
                    <th className="p-4">Google Drive Link</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reelsBundles.filter(r => r.title.toLowerCase().includes(searchTerm.toLowerCase()) || (r.category || '').toLowerCase().includes(searchTerm.toLowerCase())).map((reel) => (
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
                          <div className="text-[10px] text-slate-400 font-mono">ID: {reel.id}</div>
                        </div>
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        <span className="bg-[#a1e3d8]/40 text-teal-900 px-2 py-0.5 rounded font-bold text-[11px]">
                          {reel.category}
                        </span>
                      </td>

                      <td className="p-4 font-bold text-slate-800 whitespace-nowrap">
                        🎬 {reel.reelCount || 1000}+ Reels
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        <div className="font-black text-slate-900">
                          Personal: {storeConfig.currencySymbol}{reel.personalPrice || 99}
                        </div>
                        <div className="text-slate-500 font-semibold text-[11px]">
                          Reseller: {storeConfig.currencySymbol}{reel.resellerPrice || 199}
                        </div>
                      </td>

                      <td className="p-4 truncate max-w-xs font-mono text-[11px] text-slate-500">
                        {reel.googleDriveLink ? (
                          <a href={reel.googleDriveLink} target="_blank" rel="noopener noreferrer" className="text-teal-700 hover:underline flex items-center gap-1">
                            <span>Open Drive</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : 'Drive Link Ready'}
                      </td>

                      <td className="p-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setEditingProduct({ type: 'reels-bundle', data: { ...reel } })}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors"
                            title="Edit Bundle"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct('reels-bundle', reel.id, reel.title)}
                            className="p-1.5 bg-slate-100 hover:bg-red-50 hover:text-red-600 rounded-lg text-slate-600 transition-colors"
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

      {/* ==================================================== */}
      {/* TAB 4: DIGITAL PRODUCTS & TOOLKITS                   */}
      {/* ==================================================== */}
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

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="text-xs text-slate-500 font-semibold">
                Total: <strong>{digitalProducts.length} Products</strong>
              </span>
              <button
                onClick={() => handleOpenAddProduct('digital-product')}
                className="px-4 py-2.5 bg-slate-900 text-white font-black text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4 text-[#a1e3d8]" /> + Add Digital Product
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-black uppercase border-b border-slate-200">
                  <tr>
                    <th className="p-4">Product Name</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Format</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Rating</th>
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
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 text-sm truncate max-w-xs">{item.title}</div>
                          <div className="text-[11px] text-slate-400 line-clamp-1">{item.shortDescription}</div>
                        </div>
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        <span className="bg-[#a1e3d8]/40 text-teal-900 px-2 py-0.5 rounded font-bold text-[11px]">
                          {item.category}
                        </span>
                      </td>

                      <td className="p-4 font-semibold text-slate-700 whitespace-nowrap">
                        {item.format || 'Digital Download'}
                      </td>

                      <td className="p-4 font-black text-slate-900 text-sm whitespace-nowrap">
                        {storeConfig.currencySymbol}{item.price}
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        ★ {item.rating || 4.9} ({item.reviewCount || 20})
                      </td>

                      <td className="p-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setEditingProduct({ type: 'digital-product', data: { ...item } })}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors"
                            title="Edit Product"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct('digital-product', item.id, item.title)}
                            className="p-1.5 bg-slate-100 hover:bg-red-50 hover:text-red-600 rounded-lg text-slate-600 transition-colors"
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
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 5: RATINGS & CUSTOMER REVIEWS                    */}
      {/* ==================================================== */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">Customer Ratings & Testimonials</h2>
              <p className="text-xs text-slate-500">
                Manage, add, edit, or delete customer reviews displayed on the website homepage and products.
              </p>
            </div>

            <button
              onClick={() => setIsAddReviewModalOpen(true)}
              className="px-4 py-2.5 bg-slate-900 text-white font-black text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4 text-[#a1e3d8]" /> + Add Customer Review
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:border-[#a1e3d8] transition-all"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#a1e3d8] text-teal-950 font-black text-sm flex items-center justify-center border border-teal-300">
                        {rev.name ? rev.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1">
                          {rev.name}
                          {rev.verified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                        </h4>
                        <p className="text-[11px] text-slate-400">{rev.role}</p>
                      </div>
                    </div>

                    <div className="flex text-amber-400">
                      {[...Array(Number(rev.rating) || 5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                  </div>

                  <h5 className="font-extrabold text-slate-900 text-xs">
                    "{rev.title}"
                  </h5>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {rev.comment}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-teal-800 bg-[#f0fdfa] px-2 py-0.5 rounded font-bold">
                    {rev.purchasedItem || 'Verified Order'}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingReview({ ...rev })}
                      className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors"
                      title="Edit Review"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete review from "${rev.name}"?`)) {
                          deleteReview(rev.id);
                          showNotification('Review deleted.');
                        }
                      }}
                      className="p-1.5 bg-slate-100 hover:bg-red-50 hover:text-red-600 rounded-lg text-slate-600 transition-colors"
                      title="Delete Review"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 6: OFFERS & COUPONS                              */}
      {/* ==================================================== */}
      {activeTab === 'coupons' && (
        <div className="space-y-8">
          
          {/* 1. Announcement Banner Offer Editor */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="font-black text-slate-900 text-base">Top Announcement Banner & Store Offer</h3>
                <p className="text-xs text-slate-500">
                  Displays at the very top of your website to attract buyers with flash sale announcements.
                </p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-black ${bannerForm.isBannerActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                {bannerForm.isBannerActive ? 'Active' : 'Disabled'}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-700 mb-1">
                  Banner Text
                </label>
                <input
                  type="text"
                  value={bannerForm.announcementText}
                  onChange={(e) => setBannerForm(prev => ({ ...prev, announcementText: e.target.value }))}
                  placeholder="⚡ FLASH SALE: FLAT 85% OFF TODAY | USE CODE: DIZO85"
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={bannerForm.isBannerActive}
                    onChange={(e) => setBannerForm(prev => ({ ...prev, isBannerActive: e.target.checked }))}
                    className="w-4 h-4 text-teal-600 rounded"
                  />
                  <span>Show Announcement Banner on Store Header</span>
                </label>
              </div>

              <button
                type="button"
                onClick={handleSaveStoreSettings}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl shadow-sm transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4 text-[#a1e3d8]" />
                <span>Save Banner Offer</span>
              </button>
            </div>
          </div>

          {/* 2. Coupons Manager */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-black text-slate-900 text-base">Discount Coupons Manager</h3>
                <p className="text-xs text-slate-500">
                  Create coupon codes for customers to apply in cart or checkout for instant discounts.
                </p>
              </div>

              <button
                onClick={() => setIsAddCouponModalOpen(true)}
                className="px-4 py-2.5 bg-slate-900 text-white font-black text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4 text-[#a1e3d8]" /> + Create New Coupon
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-700 font-black uppercase border-b border-slate-200">
                    <tr>
                      <th className="p-4">Coupon Code</th>
                      <th className="p-4">Discount %</th>
                      <th className="p-4">Min Spend</th>
                      <th className="p-4">Description</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {coupons.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50">
                        <td className="p-4 whitespace-nowrap">
                          <span className="font-mono font-black text-sm text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                            {c.code}
                          </span>
                        </td>
                        <td className="p-4 font-black text-emerald-600 text-sm whitespace-nowrap">
                          {c.discountPercent}% OFF
                        </td>
                        <td className="p-4 font-bold text-slate-800 whitespace-nowrap">
                          {storeConfig.currencySymbol}{c.minAmount || 0}
                        </td>
                        <td className="p-4 text-slate-500">
                          {c.description || 'Special Discount'}
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${c.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                            {c.isActive ? 'Active' : 'Disabled'}
                          </span>
                        </td>
                        <td className="p-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setEditingCoupon({ ...c })}
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors"
                              title="Edit Coupon"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete coupon "${c.code}"?`)) {
                                  deleteCoupon(c.id);
                                  showNotification('Coupon deleted.');
                                }
                              }}
                              className="p-1.5 bg-slate-100 hover:bg-red-50 hover:text-red-600 rounded-lg text-slate-600 transition-colors"
                              title="Delete Coupon"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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

        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 7: STORE & WHATSAPP SETTINGS                     */}
      {/* ==================================================== */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveStoreSettings} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-lg font-black text-slate-900">Store Branding, WhatsApp & Payment Settings</h2>
            <p className="text-xs text-slate-500">
              Customize WhatsApp activation helpline number, store name, UPI ID, and payment gateways.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            
            <div>
              <label className="block text-xs font-extrabold uppercase text-slate-700 mb-1">
                Store Name
              </label>
              <input
                type="text"
                value={settingsForm.storeName}
                onChange={(e) => setSettingsForm(prev => ({ ...prev, storeName: e.target.value }))}
                className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase text-slate-700 mb-1">
                Store Tagline
              </label>
              <input
                type="text"
                value={settingsForm.storeTagline}
                onChange={(e) => setSettingsForm(prev => ({ ...prev, storeTagline: e.target.value }))}
                className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase text-slate-700 mb-1">
                WhatsApp Support Number (For Direct Orders)
              </label>
              <input
                type="text"
                value={settingsForm.whatsappNumber || '7895768118'}
                onChange={(e) => setSettingsForm(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-teal-500 font-mono"
              />
              <span className="text-[10px] text-slate-400">10-digit Indian mobile number (e.g. 7895768118)</span>
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase text-slate-700 mb-1">
                Support Email
              </label>
              <input
                type="email"
                value={settingsForm.supportEmail}
                onChange={(e) => setSettingsForm(prev => ({ ...prev, supportEmail: e.target.value }))}
                className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase text-slate-700 mb-1">
                Store UPI ID
              </label>
              <input
                type="text"
                value={settingsForm.upiId}
                onChange={(e) => setSettingsForm(prev => ({ ...prev, upiId: e.target.value }))}
                className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-teal-500 font-mono"
              />
              <span className="text-[10px] text-slate-400">Used for QR Code checkout (e.g. dizopulse@upi)</span>
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase text-slate-700 mb-1">
                Currency Symbol
              </label>
              <input
                type="text"
                value={settingsForm.currencySymbol}
                onChange={(e) => setSettingsForm(prev => ({ ...prev, currencySymbol: e.target.value }))}
                className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-teal-500"
              />
            </div>

          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase text-slate-700 mb-1">
              Store Guarantee & Replacement Policy Text
            </label>
            <textarea
              rows={2}
              value={settingsForm.guaranteeText}
              onChange={(e) => setSettingsForm(prev => ({ ...prev, guaranteeText: e.target.value }))}
              className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4 text-[#a1e3d8]" />
              <span>Save Store Configuration</span>
            </button>
          </div>
        </form>
      )}

      {/* ==================================================== */}
      {/* TAB 8: SECURITY & ADMIN PASSWORD                     */}
      {/* ==================================================== */}
      {activeTab === 'security' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Card 1: Change Admin Password */}
          <form onSubmit={handleChangePasswordSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="pb-3 border-b border-slate-100 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-[#a1e3d8] flex items-center justify-center">
                <Key className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-base">Change Admin Password</h3>
                <p className="text-[11px] text-slate-400">Update your PIN / master password to lock unauthorized access.</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase text-slate-700 mb-1">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPwd ? 'text' : 'password'}
                  required
                  value={pwdForm.current}
                  onChange={(e) => setPwdForm(prev => ({ ...prev, current: e.target.value }))}
                  placeholder="Enter current password..."
                  className="w-full pl-4 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-teal-500"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPwd(!showCurrentPwd)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700"
                >
                  {showCurrentPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase text-slate-700 mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPwd ? 'text' : 'password'}
                  required
                  value={pwdForm.newPwd}
                  onChange={(e) => setPwdForm(prev => ({ ...prev, newPwd: e.target.value }))}
                  placeholder="Enter new strong password..."
                  className="w-full pl-4 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-teal-500"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPwd(!showNewPwd)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700"
                >
                  {showNewPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase text-slate-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={pwdForm.confirm}
                onChange={(e) => setPwdForm(prev => ({ ...prev, confirm: e.target.value }))}
                placeholder="Re-type new password..."
                className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-teal-500"
              />
            </div>

            {pwdError && (
              <div className="p-3 bg-red-50 text-red-700 text-xs font-bold rounded-xl flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{pwdError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Key className="w-4 h-4 text-[#a1e3d8]" />
              <span>Update Password</span>
            </button>
          </form>

          {/* Card 2: Backup, Restore & Reset */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <div className="pb-3 border-b border-slate-100 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-base">Store Data Backup & Factory Reset</h3>
                <p className="text-[11px] text-slate-400">Download your full store data or restore anytime.</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="font-black text-slate-900 text-xs">Export Store Backup (JSON)</h4>
                  <p className="text-[10px] text-slate-500">Includes all subscriptions, reels, orders, reviews, and coupons.</p>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadBackup}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-[#a1e3d8]" />
                  <span>Download</span>
                </button>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="font-black text-slate-900 text-xs">Restore Store from Backup</h4>
                  <p className="text-[10px] text-slate-500">Upload a previously exported .json backup file.</p>
                </div>
                <label className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl cursor-pointer transition-all flex items-center gap-1.5">
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Upload</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleUploadBackup}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="p-4 bg-red-50/50 rounded-2xl border border-red-200 flex items-center justify-between">
                <div>
                  <h4 className="font-black text-red-900 text-xs">Reset All Data to Factory Default</h4>
                  <p className="text-[10px] text-red-500">Resets subscriptions, reels, reviews, and password back to default.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('WARNING: Are you absolutely sure you want to reset all store data to factory default?')) {
                      resetAllDataToDefault();
                      showNotification('All store data reset to default.');
                    }
                  }}
                  className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all"
                >
                  Reset All
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL: ADD PRODUCT / SUBSCRIPTION / REELS            */}
      {/* ==================================================== */}
      {isAddProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-5 animate-fadeIn">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-lg">
                + Add New {productForm.type === 'subscription' ? 'Subscription / Service' : productForm.type === 'reels-bundle' ? 'Reels Bundle' : 'Digital Product'}
              </h3>
              <button
                onClick={() => setIsAddProductModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAddProduct} className="space-y-4 text-xs">
              
              <div>
                <label className="block font-extrabold uppercase text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={productForm.title}
                  onChange={(e) => setProductForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Canva Pro Lifetime + Gemini AI"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-extrabold uppercase text-slate-700 mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={productForm.category}
                    onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block font-extrabold uppercase text-slate-700 mb-1">Badge (Optional)</label>
                  <input
                    type="text"
                    value={productForm.badge}
                    onChange={(e) => setProductForm(prev => ({ ...prev, badge: e.target.value }))}
                    placeholder="e.g. Official Plan, HOT, 85% OFF"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-extrabold uppercase text-slate-700 mb-1">Rating (★)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={productForm.rating}
                    onChange={(e) => setProductForm(prev => ({ ...prev, rating: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block font-extrabold uppercase text-slate-700 mb-1">Reviews Count</label>
                  <input
                    type="number"
                    value={productForm.reviewCount}
                    onChange={(e) => setProductForm(prev => ({ ...prev, reviewCount: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Specific fields for Reels Bundles */}
              {productForm.type === 'reels-bundle' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div>
                    <label className="block font-extrabold uppercase text-slate-700 mb-1">Reels Count</label>
                    <input
                      type="number"
                      value={productForm.reelCount}
                      onChange={(e) => setProductForm(prev => ({ ...prev, reelCount: e.target.value }))}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-extrabold uppercase text-slate-700 mb-1">Personal Price (₹)</label>
                    <input
                      type="number"
                      value={productForm.personalPrice}
                      onChange={(e) => setProductForm(prev => ({ ...prev, personalPrice: e.target.value }))}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-extrabold uppercase text-slate-700 mb-1">Reseller Price (₹)</label>
                    <input
                      type="number"
                      value={productForm.resellerPrice}
                      onChange={(e) => setProductForm(prev => ({ ...prev, resellerPrice: e.target.value }))}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold"
                    />
                  </div>
                </div>
              )}

              {/* Specific fields for Subscriptions (Plans) */}
              {productForm.type === 'subscription' && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-extrabold uppercase text-slate-800">Subscription Duration Plans</label>
                    <button
                      type="button"
                      onClick={() => setProductForm(prev => ({
                        ...prev,
                        plans: [...prev.plans, { id: `p-${Date.now()}`, name: '3 Months Plan', price: 399, regularPrice: 799, duration: '90 Days', isPopular: false }]
                      }))}
                      className="text-teal-700 font-extrabold text-[11px] hover:underline"
                    >
                      + Add Plan
                    </button>
                  </div>

                  {productForm.plans.map((p, idx) => (
                    <div key={p.id || idx} className="grid grid-cols-4 gap-2 items-center bg-white p-2.5 rounded-xl border border-slate-200">
                      <input
                        type="text"
                        placeholder="Plan Name (e.g. 1 Year)"
                        value={p.name}
                        onChange={(e) => {
                          const updated = [...productForm.plans];
                          updated[idx].name = e.target.value;
                          setProductForm(prev => ({ ...prev, plans: updated }));
                        }}
                        className="px-2 py-1 text-xs border border-slate-200 rounded font-bold"
                      />
                      <input
                        type="number"
                        placeholder="Sale Price ₹"
                        value={p.price}
                        onChange={(e) => {
                          const updated = [...productForm.plans];
                          updated[idx].price = Number(e.target.value);
                          setProductForm(prev => ({ ...prev, plans: updated }));
                        }}
                        className="px-2 py-1 text-xs border border-slate-200 rounded font-bold"
                      />
                      <input
                        type="text"
                        placeholder="Duration (e.g. 365 Days)"
                        value={p.duration}
                        onChange={(e) => {
                          const updated = [...productForm.plans];
                          updated[idx].duration = e.target.value;
                          setProductForm(prev => ({ ...prev, plans: updated }));
                        }}
                        className="px-2 py-1 text-xs border border-slate-200 rounded"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (productForm.plans.length > 1) {
                            setProductForm(prev => ({
                              ...prev,
                              plans: prev.plans.filter((_, i) => i !== idx)
                            }));
                          }
                        }}
                        className="text-red-500 font-bold hover:underline text-[11px] text-right pr-2"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Specific fields for Digital Products */}
              {productForm.type === 'digital-product' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div>
                    <label className="block font-extrabold uppercase text-slate-700 mb-1">Price (₹)</label>
                    <input
                      type="number"
                      value={productForm.price}
                      onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-extrabold uppercase text-slate-700 mb-1">Format</label>
                    <input
                      type="text"
                      value={productForm.format}
                      onChange={(e) => setProductForm(prev => ({ ...prev, format: e.target.value }))}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block font-extrabold uppercase text-slate-700 mb-1">Thumbnail Image URL</label>
                <input
                  type="url"
                  required
                  value={productForm.thumbnail}
                  onChange={(e) => setProductForm(prev => ({ ...prev, thumbnail: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-teal-500 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-extrabold uppercase text-slate-700 mb-1">
                  {productForm.type === 'reels-bundle' ? 'Google Drive Link (Instant Download)' : 'Download / Delivery URL'}
                </label>
                <input
                  type="url"
                  value={productForm.type === 'reels-bundle' ? productForm.googleDriveLink : productForm.downloadUrl}
                  onChange={(e) => setProductForm(prev => ({
                    ...prev,
                    googleDriveLink: e.target.value,
                    downloadUrl: e.target.value
                  }))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-teal-500 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-extrabold uppercase text-slate-700 mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={productForm.shortDescription}
                  onChange={(e) => setProductForm(prev => ({ ...prev, shortDescription: e.target.value }))}
                  placeholder="Summary of product features & delivery..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddProductModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-xl shadow-md"
                >
                  Save & Publish Product
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL: EDIT PRODUCT DETAILS                          */}
      {/* ==================================================== */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-5 animate-fadeIn">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-lg">
                Edit: {editingProduct.data.title}
              </h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditProduct} className="space-y-4 text-xs">
              
              <div>
                <label className="block font-extrabold uppercase text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editingProduct.data.title || ''}
                  onChange={(e) => setEditingProduct(prev => ({
                    ...prev,
                    data: { ...prev.data, title: e.target.value }
                  }))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-extrabold uppercase text-slate-700 mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.data.category || ''}
                    onChange={(e) => setEditingProduct(prev => ({
                      ...prev,
                      data: { ...prev.data, category: e.target.value }
                    }))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block font-extrabold uppercase text-slate-700 mb-1">Badge</label>
                  <input
                    type="text"
                    value={editingProduct.data.badge || ''}
                    onChange={(e) => setEditingProduct(prev => ({
                      ...prev,
                      data: { ...prev.data, badge: e.target.value }
                    }))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-extrabold uppercase text-slate-700 mb-1">Rating (★)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={editingProduct.data.rating || 5.0}
                    onChange={(e) => setEditingProduct(prev => ({
                      ...prev,
                      data: { ...prev.data, rating: e.target.value }
                    }))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block font-extrabold uppercase text-slate-700 mb-1">Reviews Count</label>
                  <input
                    type="number"
                    value={editingProduct.data.reviewCount || 100}
                    onChange={(e) => setEditingProduct(prev => ({
                      ...prev,
                      data: { ...prev.data, reviewCount: e.target.value }
                    }))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Reels specifics */}
              {editingProduct.type === 'reels-bundle' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div>
                    <label className="block font-extrabold uppercase text-slate-700 mb-1">Reels Count</label>
                    <input
                      type="number"
                      value={editingProduct.data.reelCount || 1000}
                      onChange={(e) => setEditingProduct(prev => ({
                        ...prev,
                        data: { ...prev.data, reelCount: e.target.value }
                      }))}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-extrabold uppercase text-slate-700 mb-1">Personal Price (₹)</label>
                    <input
                      type="number"
                      value={editingProduct.data.personalPrice || 99}
                      onChange={(e) => setEditingProduct(prev => ({
                        ...prev,
                        data: { ...prev.data, personalPrice: e.target.value }
                      }))}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-extrabold uppercase text-slate-700 mb-1">Reseller Price (₹)</label>
                    <input
                      type="number"
                      value={editingProduct.data.resellerPrice || 199}
                      onChange={(e) => setEditingProduct(prev => ({
                        ...prev,
                        data: { ...prev.data, resellerPrice: e.target.value }
                      }))}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold"
                    />
                  </div>
                </div>
              )}

              {/* Subscriptions Plans editor */}
              {editingProduct.type === 'subscription' && editingProduct.data.plans && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-extrabold uppercase text-slate-800">Duration Pricing Plans</label>
                    <button
                      type="button"
                      onClick={() => setEditingProduct(prev => ({
                        ...prev,
                        data: {
                          ...prev.data,
                          plans: [...(prev.data.plans || []), { id: `p-${Date.now()}`, name: '3 Months Plan', price: 399, regularPrice: 799, duration: '90 Days', isPopular: false }]
                        }
                      }))}
                      className="text-teal-700 font-extrabold text-[11px] hover:underline"
                    >
                      + Add Plan
                    </button>
                  </div>

                  {editingProduct.data.plans.map((p, idx) => (
                    <div key={p.id || idx} className="grid grid-cols-4 gap-2 items-center bg-white p-2.5 rounded-xl border border-slate-200">
                      <input
                        type="text"
                        placeholder="Plan Name"
                        value={p.name}
                        onChange={(e) => {
                          const updated = [...editingProduct.data.plans];
                          updated[idx].name = e.target.value;
                          setEditingProduct(prev => ({
                            ...prev,
                            data: { ...prev.data, plans: updated }
                          }));
                        }}
                        className="px-2 py-1 text-xs border border-slate-200 rounded font-bold"
                      />
                      <input
                        type="number"
                        placeholder="Price ₹"
                        value={p.price}
                        onChange={(e) => {
                          const updated = [...editingProduct.data.plans];
                          updated[idx].price = Number(e.target.value);
                          setEditingProduct(prev => ({
                            ...prev,
                            data: { ...prev.data, plans: updated }
                          }));
                        }}
                        className="px-2 py-1 text-xs border border-slate-200 rounded font-bold"
                      />
                      <input
                        type="text"
                        placeholder="Duration"
                        value={p.duration}
                        onChange={(e) => {
                          const updated = [...editingProduct.data.plans];
                          updated[idx].duration = e.target.value;
                          setEditingProduct(prev => ({
                            ...prev,
                            data: { ...prev.data, plans: updated }
                          }));
                        }}
                        className="px-2 py-1 text-xs border border-slate-200 rounded"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (editingProduct.data.plans.length > 1) {
                            setEditingProduct(prev => ({
                              ...prev,
                              data: {
                                ...prev.data,
                                plans: prev.data.plans.filter((_, i) => i !== idx)
                              }
                            }));
                          }
                        }}
                        className="text-red-500 font-bold hover:underline text-[11px] text-right pr-2"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Digital Product specifics */}
              {editingProduct.type === 'digital-product' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div>
                    <label className="block font-extrabold uppercase text-slate-700 mb-1">Price (₹)</label>
                    <input
                      type="number"
                      value={editingProduct.data.price || 99}
                      onChange={(e) => setEditingProduct(prev => ({
                        ...prev,
                        data: { ...prev.data, price: e.target.value }
                      }))}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-extrabold uppercase text-slate-700 mb-1">Format</label>
                    <input
                      type="text"
                      value={editingProduct.data.format || ''}
                      onChange={(e) => setEditingProduct(prev => ({
                        ...prev,
                        data: { ...prev.data, format: e.target.value }
                      }))}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block font-extrabold uppercase text-slate-700 mb-1">Thumbnail Image URL</label>
                <input
                  type="url"
                  required
                  value={editingProduct.data.thumbnail || ''}
                  onChange={(e) => setEditingProduct(prev => ({
                    ...prev,
                    data: { ...prev.data, thumbnail: e.target.value }
                  }))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-teal-500 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-extrabold uppercase text-slate-700 mb-1">
                  {editingProduct.type === 'reels-bundle' ? 'Google Drive Link (Instant Access)' : 'Download / Drive URL'}
                </label>
                <input
                  type="url"
                  value={editingProduct.data.googleDriveLink || editingProduct.data.downloadUrl || ''}
                  onChange={(e) => setEditingProduct(prev => ({
                    ...prev,
                    data: {
                      ...prev.data,
                      googleDriveLink: e.target.value,
                      downloadUrl: e.target.value
                    }
                  }))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-teal-500 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-extrabold uppercase text-slate-700 mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={editingProduct.data.shortDescription || ''}
                  onChange={(e) => setEditingProduct(prev => ({
                    ...prev,
                    data: { ...prev.data, shortDescription: e.target.value }
                  }))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-xl shadow-md"
                >
                  Save Changes
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL: VIEW ORDER DETAILS                            */}
      {/* ==================================================== */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-5 animate-fadeIn text-xs">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-black text-slate-900 text-base">
                  Order Details: {selectedOrderDetails.orderId}
                </h3>
                <span className="text-[11px] text-slate-400">
                  {new Date(selectedOrderDetails.date).toLocaleString()}
                </span>
              </div>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <h4 className="font-black text-slate-900 text-xs uppercase">Customer Information</h4>
              <div className="grid grid-cols-2 gap-2 text-slate-700 font-medium">
                <div>Name: <strong className="text-slate-900">{selectedOrderDetails.customer?.name}</strong></div>
                <div>Phone: <strong className="text-slate-900">{selectedOrderDetails.customer?.phone}</strong></div>
                <div className="col-span-2">Email: <strong className="text-slate-900">{selectedOrderDetails.customer?.email}</strong></div>
                <div className="col-span-2">City/State: <strong className="text-slate-900">{selectedOrderDetails.customer?.city || 'India'}</strong></div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-black text-slate-900 text-xs uppercase">Purchased Items</h4>
              <div className="space-y-2">
                {(selectedOrderDetails.items || []).map((it, idx) => (
                  <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                    <img
                      src={it.thumbnail}
                      alt={it.title}
                      className="w-12 h-12 rounded-lg object-cover bg-slate-900 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="font-bold text-slate-900 truncate">{it.title}</h5>
                      <p className="text-[10px] text-slate-500">{it.planName || 'Digital Delivery'}</p>
                      {it.googleDriveLink && (
                        <a href={it.googleDriveLink} target="_blank" rel="noopener noreferrer" className="text-teal-700 font-bold hover:underline text-[10px]">
                          Open Drive Folder →
                        </a>
                      )}
                    </div>
                    <div className="text-right font-black text-slate-900">
                      {storeConfig.currencySymbol}{it.price}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between font-black text-emerald-900 text-sm">
              <span>Total Paid</span>
              <span>{storeConfig.currencySymbol}{selectedOrderDetails.total}</span>
            </div>

            <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
              {selectedOrderDetails.customer?.phone && (
                <a
                  href={`https://wa.me/${selectedOrderDetails.customer.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(selectedOrderDetails.customer.name || '')}%2C%20your%20order%20${selectedOrderDetails.orderId}%20is%20ready!`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-center rounded-xl transition-all"
                >
                  WhatsApp Customer
                </a>
              )}
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="px-5 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL: ADD / EDIT REVIEW                             */}
      {/* ==================================================== */}
      {(isAddReviewModalOpen || editingReview) && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-4 animate-fadeIn text-xs">
            
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base">
                {editingReview ? 'Edit Customer Review' : '+ Add Customer Review'}
              </h3>
              <button
                onClick={() => { setIsAddReviewModalOpen(false); setEditingReview(null); }}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={editingReview ? handleSaveEditReview : handleSaveAddReview} className="space-y-3">
              <div>
                <label className="block font-extrabold uppercase text-slate-700 mb-1">Customer Name</label>
                <input
                  type="text"
                  required
                  value={editingReview ? editingReview.name : reviewForm.name}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (editingReview) setEditingReview(prev => ({ ...prev, name: val }));
                    else setReviewForm(prev => ({ ...prev, name: val }));
                  }}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-extrabold uppercase text-slate-700 mb-1">Role / City</label>
                  <input
                    type="text"
                    value={editingReview ? editingReview.role : reviewForm.role}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (editingReview) setEditingReview(prev => ({ ...prev, role: val }));
                      else setReviewForm(prev => ({ ...prev, role: val }));
                    }}
                    placeholder="e.g. Video Creator, Mumbai"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-extrabold uppercase text-slate-700 mb-1">Rating (1 to 5 Stars)</label>
                  <select
                    value={editingReview ? editingReview.rating : reviewForm.rating}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (editingReview) setEditingReview(prev => ({ ...prev, rating: val }));
                      else setReviewForm(prev => ({ ...prev, rating: val }));
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value={5}>5 Stars ★★★★★</option>
                    <option value={4}>4 Stars ★★★★</option>
                    <option value={3}>3 Stars ★★★</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-extrabold uppercase text-slate-700 mb-1">Review Headline</label>
                <input
                  type="text"
                  required
                  value={editingReview ? editingReview.title : reviewForm.title}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (editingReview) setEditingReview(prev => ({ ...prev, title: val }));
                    else setReviewForm(prev => ({ ...prev, title: val }));
                  }}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-extrabold uppercase text-slate-700 mb-1">Review Comment / Testimonial</label>
                <textarea
                  rows={3}
                  required
                  value={editingReview ? editingReview.comment : reviewForm.comment}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (editingReview) setEditingReview(prev => ({ ...prev, comment: val }));
                    else setReviewForm(prev => ({ ...prev, comment: val }));
                  }}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-extrabold uppercase text-slate-700 mb-1">Product Purchased</label>
                <input
                  type="text"
                  value={editingReview ? editingReview.purchasedItem : reviewForm.purchasedItem}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (editingReview) setEditingReview(prev => ({ ...prev, purchasedItem: val }));
                    else setReviewForm(prev => ({ ...prev, purchasedItem: val }));
                  }}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { setIsAddReviewModalOpen(false); setEditingReview(null); }}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 text-white font-black rounded-xl shadow-md"
                >
                  Save Review
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL: ADD / EDIT COUPON                             */}
      {/* ==================================================== */}
      {(isAddCouponModalOpen || editingCoupon) && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-4 animate-fadeIn text-xs">
            
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base">
                {editingCoupon ? 'Edit Discount Coupon' : '+ Create New Coupon'}
              </h3>
              <button
                onClick={() => { setIsAddCouponModalOpen(false); setEditingCoupon(null); }}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={editingCoupon ? handleSaveEditCoupon : handleSaveAddCoupon} className="space-y-3">
              <div>
                <label className="block font-extrabold uppercase text-slate-700 mb-1">Coupon Code (Uppercase)</label>
                <input
                  type="text"
                  required
                  value={editingCoupon ? editingCoupon.code : couponForm.code}
                  onChange={(e) => {
                    const val = e.target.value.toUpperCase();
                    if (editingCoupon) setEditingCoupon(prev => ({ ...prev, code: val }));
                    else setCouponForm(prev => ({ ...prev, code: val }));
                  }}
                  placeholder="e.g. DIZO85"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-black text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-extrabold uppercase text-slate-700 mb-1">Discount (%)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={editingCoupon ? editingCoupon.discountPercent : couponForm.discountPercent}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (editingCoupon) setEditingCoupon(prev => ({ ...prev, discountPercent: val }));
                      else setCouponForm(prev => ({ ...prev, discountPercent: val }));
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block font-extrabold uppercase text-slate-700 mb-1">Min Spend (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={editingCoupon ? editingCoupon.minAmount : couponForm.minAmount}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (editingCoupon) setEditingCoupon(prev => ({ ...prev, minAmount: val }));
                      else setCouponForm(prev => ({ ...prev, minAmount: val }));
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-extrabold uppercase text-slate-700 mb-1">Description / Label</label>
                <input
                  type="text"
                  value={editingCoupon ? editingCoupon.description : couponForm.description}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (editingCoupon) setEditingCoupon(prev => ({ ...prev, description: val }));
                    else setCouponForm(prev => ({ ...prev, description: val }));
                  }}
                  placeholder="e.g. Flat 85% Flash Discount"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={editingCoupon ? editingCoupon.isActive : couponForm.isActive}
                    onChange={(e) => {
                      const val = e.target.checked;
                      if (editingCoupon) setEditingCoupon(prev => ({ ...prev, isActive: val }));
                      else setCouponForm(prev => ({ ...prev, isActive: val }));
                    }}
                    className="w-4 h-4 text-teal-600 rounded"
                  />
                  <span>Active & Usable at Checkout</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { setIsAddCouponModalOpen(false); setEditingCoupon(null); }}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 text-white font-black rounded-xl shadow-md"
                >
                  Save Coupon
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL: CREATE MANUAL ORDER                           */}
      {/* ==================================================== */}
      {isManualOrderModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-4 animate-fadeIn text-xs">
            
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base">
                + Create Manual Customer Order
              </h3>
              <button
                onClick={() => setIsManualOrderModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveManualOrder} className="space-y-3">
              <div>
                <label className="block font-extrabold uppercase text-slate-700 mb-1">Customer Name</label>
                <input
                  type="text"
                  required
                  value={manualOrderForm.customerName}
                  onChange={(e) => setManualOrderForm(prev => ({ ...prev, customerName: e.target.value }))}
                  placeholder="e.g. Vikramaditya"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-extrabold uppercase text-slate-700 mb-1">Phone / WhatsApp</label>
                  <input
                    type="text"
                    required
                    value={manualOrderForm.customerPhone}
                    onChange={(e) => setManualOrderForm(prev => ({ ...prev, customerPhone: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-extrabold uppercase text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={manualOrderForm.customerCity}
                    onChange={(e) => setManualOrderForm(prev => ({ ...prev, customerCity: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-extrabold uppercase text-slate-700 mb-1">Customer Email</label>
                <input
                  type="email"
                  value={manualOrderForm.customerEmail}
                  onChange={(e) => setManualOrderForm(prev => ({ ...prev, customerEmail: e.target.value }))}
                  placeholder="name@gmail.com"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-extrabold uppercase text-slate-700 mb-1">Product / Plan Ordered</label>
                <input
                  type="text"
                  required
                  value={manualOrderForm.itemTitle}
                  onChange={(e) => setManualOrderForm(prev => ({ ...prev, itemTitle: e.target.value }))}
                  placeholder="e.g. Google Gemini Advanced 1-Year"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-extrabold uppercase text-slate-700 mb-1">Price Paid (₹)</label>
                  <input
                    type="number"
                    required
                    value={manualOrderForm.itemPrice}
                    onChange={(e) => setManualOrderForm(prev => ({ ...prev, itemPrice: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-black text-sm"
                  />
                </div>
                <div>
                  <label className="block font-extrabold uppercase text-slate-700 mb-1">Status</label>
                  <select
                    value={manualOrderForm.orderStatus}
                    onChange={(e) => setManualOrderForm(prev => ({ ...prev, orderStatus: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="Delivered">Delivered</option>
                    <option value="Processing">Processing</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsManualOrderModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 text-white font-black rounded-xl shadow-md"
                >
                  Create Order
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
