import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard,
  ShoppingCart,
  Tv, 
  Film, 
  Download, 
  Star, 
  Tag, 
  Palette,
  Settings, 
  ShieldCheck, 
  Sun, 
  Moon, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Send,
  Bot,
  DollarSign, 
  TrendingUp, 
  RefreshCw,
  Save,
  MessageCircle,
  Lock,
  Key,
  Eye,
  EyeOff,
  ExternalLink,
  FileSpreadsheet,
  ChevronRight,
  User,
  AlertTriangle,
  UploadCloud,
  Copy,
  Layers,
  CheckCircle2,
  Clock,
  LogOut,
  Menu,
  ArrowRight,
  Sparkles,
  Filter,
  BarChart3,
  Sliders,
  Smartphone,
  QrCode,
  Zap,
  Award
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

  // Theme State: 'dark' or 'light'
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('digivault_admin_theme') || 'dark';
    } catch {
      return 'dark';
    }
  });

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('digivault_admin_theme', nextTheme);
  };

  // Sidebar Open State on Mobile
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState('overview'); 
  // 'overview', 'orders', 'subscriptions', 'reels', 'digital', 'reviews', 'coupons', 'banner', 'appearance', 'settings', 'security'

  // Global & Tab States
  const [searchTerm, setSearchTerm] = useState('');
  const [successToast, setSuccessToast] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [orderDateRange, setOrderDateRange] = useState('all');

  // Login Gate State
  const [loginPasswordInput, setLoginPasswordInput] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Modals
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [productModalType, setProductModalType] = useState('subscription');
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [isAddReviewModalOpen, setIsAddReviewModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [isAddCouponModalOpen, setIsAddCouponModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [isManualOrderModalOpen, setIsManualOrderModalOpen] = useState(false);

  // Password Change State
  const [pwdForm, setPwdForm] = useState({ current: '', newPwd: '', confirm: '' });
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [pwdError, setPwdError] = useState('');

  // Settings & Appearance Forms
  const [settingsForm, setSettingsForm] = useState({ ...storeConfig });
  const [testingTelegram, setTestingTelegram] = useState(false);
  const [telegramTestStatus, setTelegramTestStatus] = useState('');

  const handleTestTelegramNotification = async () => {
    if (!settingsForm.telegramBotToken || !settingsForm.telegramChatId) {
      setTelegramTestStatus('⚠️ Please enter both Telegram Bot Token and Chat ID first.');
      return;
    }
    setTestingTelegram(true);
    setTelegramTestStatus('⏳ Sending test message to your Telegram...');
    try {
      const res = await fetch('/api/notify-telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isTest: true,
          botToken: settingsForm.telegramBotToken.trim(),
          chatId: String(settingsForm.telegramChatId).trim()
        })
      });
      const data = await res.json();
      if (data.success) {
        setTelegramTestStatus('✅ Success: Test message received on Telegram! Check your app.');
        const updated = {
          ...storeConfig,
          ...settingsForm,
          telegramBotToken: settingsForm.telegramBotToken.trim(),
          telegramChatId: String(settingsForm.telegramChatId).trim(),
          isTelegramNotificationActive: settingsForm.isTelegramNotificationActive !== false
        };
        setStoreConfig(updated);
        localStorage.setItem('digivault_telegram_bot_token', updated.telegramBotToken);
        localStorage.setItem('digivault_telegram_chat_id', updated.telegramChatId);
        syncSettingsToFirestore(updated);
      } else {
        setTelegramTestStatus(`❌ Error: ${data.error || 'Failed to send message.'}`);
      }
    } catch (err) {
      setTelegramTestStatus(`❌ Network error: ${err.message}`);
    } finally {
      setTestingTelegram(false);
    }
  };
  const [appearanceForm, setAppearanceForm] = useState({
    storeName: storeConfig.storeName || 'Dizozet',
    storeTagline: storeConfig.storeTagline || 'Premium Subscriptions & Viral Reels Bundles',
    primaryColor: storeConfig.primaryColor || '#a1e3d8',
    logoUrl: storeConfig.logoUrl || 'images/dizozet-logo.png'
  });

  // Announcement Banner Form
  const [bannerForm, setBannerForm] = useState({
    announcementText: storeConfig.announcementText || '⚡ FLASH SALE: FLAT 85% OFF TODAY | USE CODE: DIZO85',
    isBannerActive: storeConfig.isBannerActive !== false,
    bannerBg: storeConfig.bannerBg || '#0f172a',
    bannerTextCol: storeConfig.bannerTextCol || '#ffffff'
  });

  // Product Form (Multi-purpose)
  const [productForm, setProductForm] = useState({
    title: '',
    category: 'AI & Productivity',
    badge: 'Popular',
    rating: 5.0,
    reviewCount: 150,
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
    shortDescription: '',
    description: '',
    plans: [
      { id: 'p-1', name: '1 Year Plan', price: 999, regularPrice: 1999, duration: '365 Days', isPopular: true },
      { id: 'p-2', name: '6 Months Plan', price: 599, regularPrice: 1199, duration: '180 Days', isPopular: false }
    ],
    features: [
      'Full Official Replacement Warranty',
      'Instant WhatsApp Activation: 7895768118'
    ],
    reelCount: 1000,
    personalPrice: 99,
    resellerPrice: 199,
    googleDriveLink: 'https://drive.google.com',
    price: 99,
    regularPrice: 499,
    format: 'MP4 / 1080P Full HD (9:16)',
    downloadUrl: 'https://drive.google.com'
  });

  // Review Form
  const [reviewForm, setReviewForm] = useState({
    name: '',
    role: 'Content Creator, Delhi',
    rating: 5,
    title: 'Super fast delivery and top quality!',
    comment: 'Activated within minutes and WhatsApp team is very responsive.',
    purchasedItem: 'AI & Entertainment Subscription',
    verified: true
  });

  // Coupon Form
  const [couponForm, setCouponForm] = useState({
    code: '',
    discountPercent: 50,
    minAmount: 99,
    description: 'Special Flash Discount',
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
    setTimeout(() => setSuccessToast(''), 3000);
  };

  // ----------------------------------------------------
  // LOGIN SUBMIT
  // ----------------------------------------------------
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    const res = await loginAdmin(loginPasswordInput);
    if (!res.success) {
      setLoginError(res.message);
    } else {
      setLoginPasswordInput('');
      showNotification('Unlocked Master Admin Panel!');
    }
  };

  // ----------------------------------------------------
  // ANALYTICS & SALES REPORT CALCULATIONS
  // ----------------------------------------------------
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const q = searchTerm.toLowerCase();
      const matchSearch = 
        !searchTerm || 
        o.orderId.toLowerCase().includes(q) ||
        (o.customer?.name || '').toLowerCase().includes(q) ||
        (o.customer?.email || '').toLowerCase().includes(q) ||
        (o.customer?.phone || '').toLowerCase().includes(q);

      const matchStatus = orderStatusFilter === 'All' || o.orderStatus === orderStatusFilter;

      let matchDate = true;
      if (orderDateRange !== 'all') {
        const orderDate = new Date(o.date).getTime();
        const now = Date.now();
        if (orderDateRange === 'today') matchDate = (now - orderDate) <= 86400000;
        else if (orderDateRange === 'week') matchDate = (now - orderDate) <= 7 * 86400000;
        else if (orderDateRange === 'month') matchDate = (now - orderDate) <= 30 * 86400000;
      }

      return matchSearch && matchStatus && matchDate;
    });
  }, [orders, searchTerm, orderStatusFilter, orderDateRange]);

  const totalSalesRevenue = filteredOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrdersCount = filteredOrders.length;
  const avgOrderValue = totalOrdersCount > 0 ? Math.round(totalSalesRevenue / totalOrdersCount) : 0;
  const deliveredOrdersCount = filteredOrders.filter(o => o.orderStatus === 'Delivered').length;

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

  // Export Sales Report CSV
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
    link.setAttribute('download', `Dizozet_Sales_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('Sales CSV Report generated & downloaded!');
  };

  // Full Store JSON Backup
  const handleDownloadBackup = () => {
    const jsonStr = exportStoreBackup();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Dizozet_Store_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showNotification('Complete store backup JSON downloaded!');
  };

  const handleUploadBackup = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const res = importStoreBackup(event.target.result);
      if (res.success) {
        showNotification('Store restored successfully from backup!');
      } else {
        alert(res.message);
      }
    };
    reader.readAsText(file);
  };

  // Change Password
  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    setPwdError('');
    if (pwdForm.newPwd !== pwdForm.confirm) {
      setPwdError('New password and confirm password do not match.');
      return;
    }
    const res = await changeAdminPassword(pwdForm.current, pwdForm.newPwd);
    if (!res.success) {
      setPwdError(res.message);
    } else {
      setPwdForm({ current: '', newPwd: '', confirm: '' });
      showNotification('Admin master password updated successfully across all devices!');
    }
  };

  // Product Add / Edit
  const handleOpenAddProduct = (type) => {
    setProductModalType(type);
    setProductForm({
      title: '',
      category: type === 'subscription' ? 'AI & Productivity' : type === 'reels-bundle' ? 'Trending Reels' : 'E-books & Guides',
      badge: 'Popular',
      rating: 5.0,
      reviewCount: 120,
      thumbnail: type === 'reels-bundle' 
        ? 'https://media-cdn.cosmofeed.com/chat/Neon-4000--Cartoon-Video-Bundle-2026-10-10-03-03-49.png?w=1200&q=75'
        : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
      shortDescription: '',
      description: '',
      plans: [
        { id: 'p-1', name: '1 Year Plan', price: 999, regularPrice: 1999, duration: '365 Days', isPopular: true },
        { id: 'p-2', name: '6 Months Plan', price: 599, regularPrice: 1199, duration: '180 Days', isPopular: false }
      ],
      features: [
        'Official Account & Replacement Guarantee',
        'Direct WhatsApp Activation: 7895768118'
      ],
      reelCount: 1000,
      personalPrice: 99,
      resellerPrice: 199,
      googleDriveLink: 'https://drive.google.com',
      price: 99,
      regularPrice: 499,
      format: 'MP4 / 1080P Full HD (9:16)',
      downloadUrl: 'https://drive.google.com'
    });
    setIsAddProductModalOpen(true);
  };

  const handleSaveAddProduct = (e) => {
    e.preventDefault();
    const id = `${productModalType === 'subscription' ? 'sub' : productModalType === 'reels-bundle' ? 'rb' : 'digi'}-${Date.now()}`;
    const slug = productForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const newProd = {
      ...productForm,
      id,
      slug,
      type: productModalType,
      rating: Number(productForm.rating) || 5.0,
      reviewCount: Number(productForm.reviewCount) || 10,
      reelCount: Number(productForm.reelCount) || 1000,
      personalPrice: Number(productForm.personalPrice) || 99,
      resellerPrice: Number(productForm.resellerPrice) || 199,
      price: Number(productForm.price) || 99,
      regularPrice: Number(productForm.regularPrice) || 499
    };

    addProduct(productModalType, newProd);
    showNotification(`New ${productModalType} published to store!`);
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
      personalPrice: Number(data.personalPrice) || Number(data.price) || 99,
      resellerPrice: Number(data.resellerPrice) || 199,
      price: Number(data.personalPrice) || Number(data.price) || 99,
      regularPrice: Number(data.regularPrice) || 499
    });
    showNotification('Product details saved successfully!');
    setEditingProduct(null);
  };

  const handleDeleteProduct = (type, id, title) => {
    if (window.confirm(`Delete "${title}" from your store?`)) {
      deleteProduct(type, id);
      showNotification('Product deleted.');
    }
  };

  // Review Handlers
  const handleSaveAddReview = (e) => {
    e.preventDefault();
    addReview(reviewForm);
    showNotification('Customer review published to homepage!');
    setIsAddReviewModalOpen(false);
    setReviewForm({
      name: '',
      role: 'Content Creator, Delhi',
      rating: 5,
      title: 'Top quality and instant delivery!',
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

  // Coupon Handlers
  const handleSaveAddCoupon = (e) => {
    e.preventDefault();
    if (!couponForm.code.trim()) return;
    addCoupon({
      ...couponForm,
      discountPercent: Number(couponForm.discountPercent) || 10,
      minAmount: Number(couponForm.minAmount) || 0
    });
    showNotification(`Coupon ${couponForm.code.toUpperCase()} activated!`);
    setIsAddCouponModalOpen(false);
    setCouponForm({
      code: '',
      discountPercent: 50,
      minAmount: 99,
      description: 'Special Flash Discount',
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

  // Save Settings & Appearance
  const handleSaveAllSettings = (e) => {
    e?.preventDefault();
    const cleanBotToken = settingsForm.telegramBotToken ? settingsForm.telegramBotToken.trim() : (storeConfig.telegramBotToken || '');
    const cleanChatId = settingsForm.telegramChatId ? String(settingsForm.telegramChatId).trim() : (storeConfig.telegramChatId || '');
    const currentAdminPass = (adminPassword || storeConfig.adminPass || 'dizozet2448').trim();
    const updated = {
      ...storeConfig,
      ...settingsForm,
      telegramBotToken: cleanBotToken,
      telegramChatId: cleanChatId,
      ...appearanceForm,
      announcementText: bannerForm.announcementText,
      isBannerActive: bannerForm.isBannerActive,
      bannerBg: bannerForm.bannerBg,
      bannerTextCol: bannerForm.bannerTextCol,
      adminPass: currentAdminPass
    };
    if (cleanBotToken) localStorage.setItem('digivault_telegram_bot_token', cleanBotToken);
    if (cleanChatId) localStorage.setItem('digivault_telegram_chat_id', cleanChatId);
    setStoreConfig(updated);
    syncSettingsToFirestore(updated);
    showNotification('Store branding, settings & banner saved successfully!');
  };

  // Manual Order Save
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
          title: manualOrderForm.itemTitle || 'Custom Service Order',
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

  // Helper classes for dark vs light
  const isDark = theme === 'dark';
  const bgMain = isDark ? 'bg-[#080d1a] text-slate-100' : 'bg-slate-50 text-slate-900';
  const bgCard = isDark ? 'bg-[#111827] border-slate-800/80 text-slate-200' : 'bg-white border-slate-200 text-slate-800';
  const bgSidebar = isDark ? 'bg-[#0b1020] border-slate-800/80' : 'bg-white border-slate-200';
  const bgTopbar = isDark ? 'bg-[#0b1020]/95 border-slate-800/80' : 'bg-white/95 border-slate-200';
  const textMuted = isDark ? 'text-slate-400' : 'text-slate-500';
  const inputBg = isDark ? 'bg-[#080d1a] border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900';
  const hoverRow = isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50';

  // ====================================================
  // 1. RENDER: LOGIN GATE SCREEN IF NOT AUTHENTICATED
  // ====================================================
  if (!isAdminAuthenticated) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${isDark ? 'bg-[#080d1a]' : 'bg-slate-100'}`}>
        <div className={`w-full max-w-md rounded-3xl border p-8 sm:p-10 shadow-2xl space-y-6 ${bgCard}`}>
          
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-wider text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-full border border-teal-500/20">
              Admin OS v3.0
            </span>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-700/50 hover:bg-slate-700/30 transition-all text-slate-400 hover:text-white"
              title="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
          </div>

          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-[#0f172a] text-[#a1e3d8] rounded-2xl mx-auto flex items-center justify-center shadow-lg border border-slate-800">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black tracking-tight">
              {storeConfig.storeName || 'Dizozet'} Control Center
            </h1>
            <p className={`text-xs ${textMuted}`}>
              Isolated secure master dashboard. Enter master password to access full store control.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold uppercase mb-1.5">
                Master Admin Password
              </label>
              <div className="relative">
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  value={loginPasswordInput}
                  onChange={(e) => setLoginPasswordInput(e.target.value)}
                  placeholder="Enter master admin password"
                  required
                  autoFocus
                  className={`w-full pl-4 pr-11 py-3 text-sm rounded-2xl border font-medium focus:outline-none focus:border-teal-500 ${inputBg}`}
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-white"
                >
                  {showLoginPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {loginError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold rounded-xl flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-slate-950 font-black text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
            >
              <Key className="w-4 h-4" />
              <span>Unlock Admin Dashboard</span>
            </button>
          </form>

        </div>
      </div>
    );
  }

  // ====================================================
  // 2. RENDER: STANDALONE PRO ADMIN DASHBOARD
  // ====================================================
  const navTabs = [
    { id: 'overview', label: 'Analytics & KPIs', icon: LayoutDashboard },
    { id: 'orders', label: `Orders & Dispatch (${orders.length})`, icon: ShoppingCart },
    { id: 'subscriptions', label: `Subscriptions (${subscriptions.length})`, icon: Tv },
    { id: 'reels', label: `Reels Bundles (${reelsBundles.length})`, icon: Film },
    { id: 'digital', label: `Digital Products (${digitalProducts.length})`, icon: Download },
    { id: 'reviews', label: `Reviews & Ratings (${reviews.length})`, icon: Star },
    { id: 'coupons', label: `Coupons & Offers (${coupons.length})`, icon: Tag },
    { id: 'banner', label: 'Flash Sale Banner', icon: Zap },
    { id: 'appearance', label: 'Store Branding & Colors', icon: Palette },
    { id: 'settings', label: 'Gateways & WhatsApp', icon: Settings },
    { id: 'security', label: 'Security & Backup', icon: Key },
  ];

  return (
    <div className={`min-h-screen flex ${bgMain}`}>
      
      {/* Toast Alert */}
      {successToast && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-fadeIn">
          <Check className="w-4 h-4" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* ==================================================== */}
      {/* LEFT SIDEBAR NAVIGATION                              */}
      {/* ==================================================== */}
      <aside className={`fixed lg:sticky top-0 h-screen w-72 z-50 flex flex-col justify-between border-r transition-transform duration-200 ${bgSidebar} ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        
        {/* Brand & Version */}
        <div className="p-6 border-b border-slate-800/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-600 text-slate-950 flex items-center justify-center font-black shadow-md shadow-teal-500/20">
                <Sparkles className="w-5 h-5 fill-slate-950" />
              </div>
              <div>
                <h2 className="font-black text-base tracking-tight leading-none">
                  {storeConfig.storeName || 'Dizozet'}
                </h2>
                <span className="text-[10px] font-black uppercase text-teal-400 tracking-wider">
                  Admin OS • Pro v3.0
                </span>
              </div>
            </div>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1.5 no-scrollbar">
          <div className="text-[10px] font-black uppercase tracking-wider text-slate-500 px-3 py-1">
            Store Management
          </div>

          {navTabs.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  setActiveTab(t.id);
                  setSearchTerm('');
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                  isActive
                    ? 'bg-gradient-to-r from-teal-500/20 to-emerald-500/10 text-teal-400 border border-teal-500/30 shadow-sm'
                    : isDark ? 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                <span className="truncate">{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer: Theme & Session */}
        <div className="p-4 border-t border-slate-800/60 space-y-2">
          
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/30 border border-slate-700/30 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-bold text-slate-300">Live Status</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-400 uppercase">Online</span>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={toggleTheme}
              className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                isDark ? 'border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-300' : 'border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-800'
              }`}
              title="Toggle Dark / Brightness Mode"
            >
              {isDark ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Bright Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-slate-700" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>

            <button
              onClick={logoutAdmin}
              className="p-2 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all"
              title="Lock Admin Session"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>

      </aside>

      {/* ==================================================== */}
      {/* MAIN ADMIN WORKSPACE                                 */}
      {/* ==================================================== */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        
        {/* Top Navbar */}
        <header className={`sticky top-0 z-30 h-16 border-b px-4 sm:px-8 flex items-center justify-between backdrop-blur-md ${bgTopbar}`}>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-extrabold">
              <span className={textMuted}>Admin Portal</span>
              <span className={textMuted}>/</span>
              <span className="text-teal-400 capitalize">{activeTab}</span>
            </div>
          </div>

          {/* Quick Header Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Live Store link */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl border border-teal-500/30 bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View Store</span>
            </a>

            {/* CSV Sales Export */}
            <button
              onClick={handleExportSalesCSV}
              className="px-3 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
              title="Download Sales Report CSV"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Export CSV</span>
            </button>

            {/* Brightness / Dark toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl border transition-all ${
                isDark ? 'border-slate-800 bg-slate-900 text-amber-400 hover:bg-slate-800' : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              title="Switch Dark / Light Theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Backup JSON */}
            <button
              onClick={handleDownloadBackup}
              className={`p-2 rounded-xl border transition-all ${
                isDark ? 'border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800' : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              title="Export Full Store JSON Backup"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Lock / Logout */}
            <button
              onClick={logoutAdmin}
              className="px-3 py-1.5 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold transition-all flex items-center gap-1"
              title="Lock Admin Session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lock</span>
            </button>

          </div>

        </header>

        {/* Content Body */}
        <main className="p-4 sm:p-8 space-y-6 flex-1">
          
          {/* ==================================================== */}
          {/* 1. OVERVIEW & ANALYTICS TAB                          */}
          {/* ==================================================== */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Header Banner */}
              <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${bgCard}`}>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-black uppercase text-teal-400 tracking-wider">
                      Executive Overview
                    </span>
                  </div>
                  <h2 className="text-2xl font-black tracking-tight">
                    Welcome, Administrator
                  </h2>
                  <p className={`text-xs ${textMuted} mt-0.5`}>
                    Real-time sales performance, active catalog items, and immediate fulfillment controls.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="px-4 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>View Orders ({orders.length})</span>
                  </button>
                  <button
                    onClick={() => handleOpenAddProduct('subscription')}
                    className={`px-4 py-2.5 rounded-xl border text-xs font-black transition-all flex items-center gap-1.5 ${
                      isDark ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-300 bg-slate-100 text-slate-800'
                    }`}
                  >
                    <Plus className="w-4 h-4 text-teal-400" />
                    <span>+ Add Product</span>
                  </button>
                </div>
              </div>

              {/* 4 Main KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div className={`p-5 rounded-3xl border shadow-sm space-y-1 ${bgCard}`}>
                  <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
                    <span>Total Sales</span>
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-3xl font-black text-emerald-400">
                    {storeConfig.currencySymbol}{totalSalesRevenue.toLocaleString()}
                  </div>
                  <p className={`text-[11px] ${textMuted}`}>Gross revenue across all orders</p>
                </div>

                <div className={`p-5 rounded-3xl border shadow-sm space-y-1 ${bgCard}`}>
                  <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
                    <span>Total Orders</span>
                    <ShoppingCart className="w-4 h-4 text-teal-400" />
                  </div>
                  <div className="text-3xl font-black">
                    {totalOrdersCount}
                  </div>
                  <p className={`text-[11px] ${textMuted}`}>{deliveredOrdersCount} marked as Delivered</p>
                </div>

                <div className={`p-5 rounded-3xl border shadow-sm space-y-1 ${bgCard}`}>
                  <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
                    <span>Avg Ticket (AOV)</span>
                    <TrendingUp className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-3xl font-black">
                    {storeConfig.currencySymbol}{avgOrderValue}
                  </div>
                  <p className={`text-[11px] ${textMuted}`}>Average spend per transaction</p>
                </div>

                <div className={`p-5 rounded-3xl border shadow-sm space-y-1 ${bgCard}`}>
                  <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
                    <span>Active Catalog</span>
                    <Layers className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-3xl font-black text-teal-400">
                    {subscriptions.length + reelsBundles.length + digitalProducts.length}
                  </div>
                  <p className={`text-[11px] ${textMuted}`}>
                    {reelsBundles.length} Bundles, {subscriptions.length} Subscriptions
                  </p>
                </div>

              </div>

              {/* Revenue Distribution & Quick Links Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Revenue Breakdown */}
                <div className={`lg:col-span-2 p-6 rounded-3xl border shadow-sm space-y-4 ${bgCard}`}>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <h3 className="font-black text-sm uppercase tracking-wide">Category Sales Distribution</h3>
                    <span className={`text-xs ${textMuted}`}>Based on current filter</span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="flex items-center gap-1.5">
                          <Tv className="w-3.5 h-3.5 text-teal-400" /> Subscriptions Revenue
                        </span>
                        <span>{storeConfig.currencySymbol}{subscriptionsRevenue}</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div 
                          className="h-full bg-teal-400 rounded-full" 
                          style={{ width: `${totalSalesRevenue ? Math.round((subscriptionsRevenue / totalSalesRevenue) * 100) : 40}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="flex items-center gap-1.5">
                          <Film className="w-3.5 h-3.5 text-purple-400" /> Reels Bundles Revenue
                        </span>
                        <span>{storeConfig.currencySymbol}{reelsRevenue}</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div 
                          className="h-full bg-purple-400 rounded-full" 
                          style={{ width: `${totalSalesRevenue ? Math.round((reelsRevenue / totalSalesRevenue) * 100) : 35}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="flex items-center gap-1.5">
                          <Download className="w-3.5 h-3.5 text-amber-400" /> Digital Products Revenue
                        </span>
                        <span>{storeConfig.currencySymbol}{digitalRevenue}</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div 
                          className="h-full bg-amber-400 rounded-full" 
                          style={{ width: `${totalSalesRevenue ? Math.round((digitalRevenue / totalSalesRevenue) * 100) : 25}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Shortcuts */}
                <div className={`p-6 rounded-3xl border shadow-sm space-y-4 ${bgCard}`}>
                  <h3 className="font-black text-sm uppercase tracking-wide pb-2 border-b border-slate-800">
                    Quick Operations
                  </h3>
                  <div className="space-y-2 text-xs font-bold">
                    <button
                      onClick={() => handleOpenAddProduct('reels-bundle')}
                      className={`w-full p-3 rounded-2xl border flex items-center justify-between text-left transition-all ${
                        isDark ? 'border-slate-800 hover:bg-slate-800/40 text-slate-200' : 'border-slate-200 hover:bg-slate-100 text-slate-800'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Film className="w-4 h-4 text-purple-400" />
                        <span>+ Add Reels Bundle</span>
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </button>

                    <button
                      onClick={() => setIsManualOrderModalOpen(true)}
                      className={`w-full p-3 rounded-2xl border flex items-center justify-between text-left transition-all ${
                        isDark ? 'border-slate-800 hover:bg-slate-800/40 text-slate-200' : 'border-slate-200 hover:bg-slate-100 text-slate-800'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4 text-emerald-400" />
                        <span>+ Create Manual Order</span>
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </button>

                    <button
                      onClick={() => setIsAddCouponModalOpen(true)}
                      className={`w-full p-3 rounded-2xl border flex items-center justify-between text-left transition-all ${
                        isDark ? 'border-slate-800 hover:bg-slate-800/40 text-slate-200' : 'border-slate-200 hover:bg-slate-100 text-slate-800'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-amber-400" />
                        <span>+ Create Discount Coupon</span>
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </button>

                    <button
                      onClick={() => setActiveTab('appearance')}
                      className={`w-full p-3 rounded-2xl border flex items-center justify-between text-left transition-all ${
                        isDark ? 'border-slate-800 hover:bg-slate-800/40 text-slate-200' : 'border-slate-200 hover:bg-slate-100 text-slate-800'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Palette className="w-4 h-4 text-teal-400" />
                        <span>Customize Store Appearance</span>
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </button>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ==================================================== */}
          {/* 2. ORDERS & SALES TAB                                */}
          {/* ==================================================== */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              
              {/* Controls Strip */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                  
                  {/* Search */}
                  <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      placeholder="Search name, phone, order ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`w-full pl-10 pr-4 py-2 text-xs rounded-xl border font-medium focus:outline-none focus:border-teal-500 ${inputBg}`}
                    />
                  </div>

                  {/* Status Filter */}
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className={`px-3 py-2 text-xs rounded-xl border font-bold focus:outline-none ${inputBg}`}
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
                    className={`px-3 py-2 text-xs rounded-xl border font-bold focus:outline-none ${inputBg}`}
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
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>Download CSV</span>
                  </button>

                  <button
                    onClick={() => setIsManualOrderModalOpen(true)}
                    className="px-3.5 py-2 bg-gradient-to-r from-teal-500 to-emerald-600 text-slate-950 text-xs font-black rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Create Order</span>
                  </button>
                </div>
              </div>

              {/* Orders Table */}
              <div className={`rounded-3xl border shadow-sm overflow-hidden ${bgCard}`}>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className={`font-black uppercase border-b ${isDark ? 'bg-[#0f172a] text-slate-300 border-slate-800' : 'bg-slate-50 text-slate-700 border-slate-200'}`}>
                      <tr>
                        <th className="p-4">Order ID & Date</th>
                        <th className="p-4">Customer Details</th>
                        <th className="p-4">Items Summary</th>
                        <th className="p-4">Amount Paid</th>
                        <th className="p-4">Payment</th>
                        <th className="p-4">Order Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${isDark ? 'divide-slate-800/80 text-slate-300' : 'divide-slate-100 text-slate-700'}`}>
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-12 text-center text-slate-500 font-medium">
                            No orders found matching the filter criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((ord) => (
                          <tr key={ord.orderId} className={hoverRow}>
                            
                            <td className="p-4 whitespace-nowrap">
                              <div className="font-mono font-black text-teal-400">{ord.orderId}</div>
                              <div className={`text-[11px] ${textMuted}`}>
                                {new Date(ord.date).toLocaleDateString()} {new Date(ord.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </td>

                            <td className="p-4">
                              <div className="font-bold">{ord.customer?.name || 'Customer'}</div>
                              <div className="text-[11px] font-mono text-slate-400">{ord.customer?.phone}</div>
                              <div className={`text-[10px] ${textMuted}`}>{ord.customer?.email}</div>
                            </td>

                            <td className="p-4 max-w-xs">
                              <div className="font-semibold line-clamp-2">
                                {(ord.items || []).map(i => `${i.title} (${i.planName || 'x' + (i.quantity || 1)})`).join(', ')}
                              </div>
                              <div className="text-[10px] text-teal-400 font-bold mt-0.5">
                                {ord.items?.length || 1} item(s)
                              </div>
                            </td>

                            <td className="p-4 whitespace-nowrap font-black text-sm">
                              {storeConfig.currencySymbol}{ord.total}
                              {ord.discount > 0 && (
                                <span className="text-[10px] text-emerald-400 font-bold block">
                                  Saved {storeConfig.currencySymbol}{ord.discount}
                                </span>
                              )}
                            </td>

                            <td className="p-4 whitespace-nowrap">
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-extrabold border border-emerald-500/30">
                                {ord.paymentStatus || 'Paid'}
                              </span>
                              <div className={`text-[10px] ${textMuted} mt-1`}>{ord.paymentMethod}</div>
                            </td>

                            <td className="p-4 whitespace-nowrap">
                              <select
                                value={ord.orderStatus || 'Delivered'}
                                onChange={(e) => updateOrderStatus(ord.orderId, e.target.value)}
                                className={`px-2.5 py-1 text-[11px] font-black rounded-lg border focus:outline-none ${
                                  ord.orderStatus === 'Delivered'
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                    : ord.orderStatus === 'Processing'
                                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                                    : ord.orderStatus === 'Pending'
                                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                                    : 'bg-red-500/10 text-red-400 border-red-500/30'
                                }`}
                              >
                                <option value="Delivered">Delivered</option>
                                <option value="Processing">Processing</option>
                                <option value="Pending">Pending</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </td>

                            <td className="p-4 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1.5">
                                {ord.customer?.phone && (
                                  <a
                                    href={`https://wa.me/${ord.customer.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(ord.customer.name || '')}%2C%20regarding%20your%20order%20${ord.orderId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                                    title="WhatsApp Customer"
                                  >
                                    <MessageCircle className="w-4 h-4" />
                                  </a>
                                )}

                                <button
                                  onClick={() => setSelectedOrderDetails(ord)}
                                  className={`p-1.5 rounded-lg transition-colors ${
                                    isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                  }`}
                                  title="View Order Details"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>

                                <button
                                  onClick={() => {
                                    if (window.confirm(`Delete order ${ord.orderId}?`)) {
                                      deleteOrder(ord.orderId);
                                      showNotification('Order removed.');
                                    }
                                  }}
                                  className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
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
          {/* 3. SUBSCRIPTIONS & SERVICES TAB                      */}
          {/* ==================================================== */}
          {activeTab === 'subscriptions' && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="Search subscriptions by title, category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 text-xs rounded-xl border font-medium focus:outline-none focus:border-teal-500 ${inputBg}`}
                  />
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <span className={`text-xs ${textMuted} font-semibold`}>
                    Total: <strong className="text-teal-400">{subscriptions.length} Subscriptions</strong>
                  </span>
                  <button
                    onClick={() => handleOpenAddProduct('subscription')}
                    className="px-4 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 text-slate-950 font-black text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> + Add Subscription
                  </button>
                </div>
              </div>

              <div className={`rounded-3xl border shadow-sm overflow-hidden ${bgCard}`}>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className={`font-black uppercase border-b ${isDark ? 'bg-[#0f172a] text-slate-300 border-slate-800' : 'bg-slate-50 text-slate-700 border-slate-200'}`}>
                      <tr>
                        <th className="p-4">Subscription Service</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Duration Plans & Price</th>
                        <th className="p-4">Rating</th>
                        <th className="p-4">Badge</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${isDark ? 'divide-slate-800/80 text-slate-300' : 'divide-slate-100 text-slate-700'}`}>
                      {subscriptions.filter(s => s.title.toLowerCase().includes(searchTerm.toLowerCase()) || (s.category || '').toLowerCase().includes(searchTerm.toLowerCase())).map((sub) => (
                        <tr key={sub.id} className={hoverRow}>
                          
                          <td className="p-4 flex items-center gap-3">
                            <img
                              src={sub.thumbnail}
                              alt={sub.title}
                              className="w-12 h-12 rounded-xl object-cover bg-slate-900 border border-slate-800 shrink-0"
                            />
                            <div className="min-w-0">
                              <div className="font-bold text-sm truncate max-w-xs">{sub.title}</div>
                              <div className={`text-[11px] ${textMuted} line-clamp-1`}>{sub.shortDescription}</div>
                            </div>
                          </td>

                          <td className="p-4 whitespace-nowrap">
                            <span className="px-2.5 py-0.5 rounded-full font-bold text-[11px] bg-teal-500/10 text-teal-400 border border-teal-500/20">
                              {sub.category}
                            </span>
                          </td>

                          <td className="p-4 whitespace-nowrap">
                            <div className="font-black text-sm">
                              {storeConfig.currencySymbol}{sub.plans?.[0]?.price || 149}
                            </div>
                            <div className={`text-[10px] ${textMuted}`}>
                              {sub.plans?.length || 1} duration tier(s)
                            </div>
                          </td>

                          <td className="p-4 whitespace-nowrap">
                            <div className="font-bold flex items-center gap-1 text-amber-400">
                              <Star className="w-3.5 h-3.5 fill-amber-400" />
                              <span>{sub.rating || 5.0}</span>
                              <span className={`text-[10px] ${textMuted}`}>({sub.reviewCount || 100})</span>
                            </div>
                          </td>

                          <td className="p-4 whitespace-nowrap">
                            {sub.badge ? (
                              <span className="bg-amber-500/10 text-amber-400 text-[10px] font-black px-2 py-0.5 rounded-full border border-amber-500/20">
                                {sub.badge}
                              </span>
                            ) : (
                              <span className={`text-[10px] ${textMuted}`}>—</span>
                            )}
                          </td>

                          <td className="p-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setEditingProduct({ type: 'subscription', data: { ...sub } })}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs bg-teal-500/15 text-teal-400 hover:bg-teal-500 hover:text-slate-950 border border-teal-500/30 transition-all shadow-sm"
                                title="Edit Subscription"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => handleDeleteProduct('subscription', sub.id, sub.title)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl font-bold text-xs bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/20 transition-all"
                                title="Delete Subscription"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete</span>
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
          {/* 4. REELS BUNDLES TAB (130+)                          */}
          {/* ==================================================== */}
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
                    className={`w-full pl-10 pr-4 py-2 text-xs rounded-xl border font-medium focus:outline-none focus:border-teal-500 ${inputBg}`}
                  />
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <span className={`text-xs ${textMuted} font-semibold`}>
                    Total: <strong className="text-teal-400">{reelsBundles.length} Bundles</strong>
                  </span>
                  <button
                    onClick={() => handleOpenAddProduct('reels-bundle')}
                    className="px-4 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 text-slate-950 font-black text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> + Add Reels Bundle
                  </button>
                </div>
              </div>

              <div className={`rounded-3xl border shadow-sm overflow-hidden ${bgCard}`}>
                <div className="max-h-[680px] overflow-x-auto overflow-y-auto">
                  <table className="w-full text-left text-xs min-w-[700px]">
                    <thead className={`font-black uppercase sticky top-0 border-b z-10 ${isDark ? 'bg-[#0f172a] text-slate-300 border-slate-800' : 'bg-slate-50 text-slate-700 border-slate-200'}`}>
                      <tr>
                        <th className="p-4">Reels Bundle</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Reels Count</th>
                        <th className="p-4">Personal / Reseller</th>
                        <th className="p-4">Google Drive Link</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${isDark ? 'divide-slate-800/80 text-slate-300' : 'divide-slate-100 text-slate-700'}`}>
                      {reelsBundles.filter(r => r.title.toLowerCase().includes(searchTerm.toLowerCase()) || (r.category || '').toLowerCase().includes(searchTerm.toLowerCase())).map((reel) => (
                        <tr key={reel.id} className={hoverRow}>
                          
                          <td className="p-4 flex items-center gap-3">
                            <img
                              src={reel.thumbnail}
                              alt={reel.title}
                              className="w-12 h-12 rounded-xl object-cover bg-slate-900 border border-slate-800 shrink-0"
                              onError={(e) => {
                                e.target.src = 'https://media-cdn.cosmofeed.com/chat/Neon-4000--Cartoon-Video-Bundle-2026-10-10-03-03-49.png?w=1200&q=75';
                              }}
                            />
                            <div className="min-w-0">
                              <div className="font-bold text-sm truncate max-w-xs">{reel.title}</div>
                              <div className={`text-[10px] font-mono ${textMuted}`}>ID: {reel.id}</div>
                            </div>
                          </td>

                          <td className="p-4 whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded font-bold text-[11px] bg-purple-500/10 text-purple-400 border border-purple-500/20">
                              {reel.category}
                            </span>
                          </td>

                          <td className="p-4 font-bold whitespace-nowrap">
                            🎬 {reel.reelCount || 1000}+ Reels
                          </td>

                          <td className="p-4 whitespace-nowrap">
                            <div className="font-black text-teal-400">
                              Personal: {storeConfig.currencySymbol}{reel.personalPrice || 99}
                            </div>
                            <div className={`text-[11px] font-semibold ${textMuted}`}>
                              Reseller: {storeConfig.currencySymbol}{reel.resellerPrice || 199}
                            </div>
                          </td>

                          <td className="p-4 truncate max-w-xs font-mono text-[11px]">
                            {reel.googleDriveLink ? (
                              <a href={reel.googleDriveLink} target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:underline flex items-center gap-1">
                                <span>Open Folder</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            ) : 'Drive Link Ready'}
                          </td>

                          <td className="p-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setEditingProduct({ type: 'reels-bundle', data: { ...reel } })}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs bg-teal-500/15 text-teal-400 hover:bg-teal-500 hover:text-slate-950 border border-teal-500/30 transition-all shadow-sm"
                                title="Edit Bundle"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => handleDeleteProduct('reels-bundle', reel.id, reel.title)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl font-bold text-xs bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/20 transition-all"
                                title="Delete Bundle"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete</span>
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
          {/* 5. DIGITAL PRODUCTS TAB                              */}
          {/* ==================================================== */}
          {activeTab === 'digital' && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="Search digital products & toolkits..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 text-xs rounded-xl border font-medium focus:outline-none focus:border-teal-500 ${inputBg}`}
                  />
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <span className={`text-xs ${textMuted} font-semibold`}>
                    Total: <strong className="text-teal-400">{digitalProducts.length} Products</strong>
                  </span>
                  <button
                    onClick={() => handleOpenAddProduct('digital-product')}
                    className="px-4 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 text-slate-950 font-black text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> + Add Digital Product
                  </button>
                </div>
              </div>

              <div className={`rounded-3xl border shadow-sm overflow-hidden ${bgCard}`}>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className={`font-black uppercase border-b ${isDark ? 'bg-[#0f172a] text-slate-300 border-slate-800' : 'bg-slate-50 text-slate-700 border-slate-200'}`}>
                      <tr>
                        <th className="p-4">Product Name</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Format</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">Rating</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${isDark ? 'divide-slate-800/80 text-slate-300' : 'divide-slate-100 text-slate-700'}`}>
                      {digitalProducts.filter(d => d.title.toLowerCase().includes(searchTerm.toLowerCase())).map((item) => (
                        <tr key={item.id} className={hoverRow}>
                          
                          <td className="p-4 flex items-center gap-3">
                            <img
                              src={item.thumbnail}
                              alt={item.title}
                              className="w-12 h-12 rounded-xl object-cover bg-slate-900 border border-slate-800 shrink-0"
                            />
                            <div className="min-w-0">
                              <div className="font-bold text-sm truncate max-w-xs">{item.title}</div>
                              <div className={`text-[11px] ${textMuted} line-clamp-1`}>{item.shortDescription}</div>
                            </div>
                          </td>

                          <td className="p-4 whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded font-bold text-[11px] bg-teal-500/10 text-teal-400 border border-teal-500/20">
                              {item.category}
                            </span>
                          </td>

                          <td className={`p-4 font-semibold whitespace-nowrap ${textMuted}`}>
                            {item.format || 'Digital Download'}
                          </td>

                          <td className="p-4 font-black text-sm whitespace-nowrap">
                            {storeConfig.currencySymbol}{item.price}
                          </td>

                          <td className="p-4 whitespace-nowrap text-amber-400 font-bold">
                            ★ {item.rating || 4.9}
                          </td>

                          <td className="p-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setEditingProduct({ type: 'digital-product', data: { ...item } })}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs bg-teal-500/15 text-teal-400 hover:bg-teal-500 hover:text-slate-950 border border-teal-500/30 transition-all shadow-sm"
                                title="Edit Product"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => handleDeleteProduct('digital-product', item.id, item.title)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl font-bold text-xs bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/20 transition-all"
                                title="Delete Product"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete</span>
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
          {/* 6. RATINGS & CUSTOMER REVIEWS TAB                    */}
          {/* ==================================================== */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-black tracking-tight">Customer Testimonials & Ratings</h3>
                  <p className={`text-xs ${textMuted}`}>
                    Add, edit, or delete customer reviews. Changes display live on the website homepage!
                  </p>
                </div>

                <button
                  onClick={() => setIsAddReviewModalOpen(true)}
                  className="px-4 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 text-slate-950 font-black text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> + Add Customer Review
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className={`p-5 rounded-3xl border shadow-sm flex flex-col justify-between space-y-4 ${bgCard}`}
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-teal-500/20 text-teal-400 font-black text-sm flex items-center justify-center border border-teal-500/30">
                            {rev.name ? rev.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div>
                            <h4 className="font-bold text-sm flex items-center gap-1">
                              {rev.name}
                              {rev.verified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                            </h4>
                            <p className={`text-[11px] ${textMuted}`}>{rev.role}</p>
                          </div>
                        </div>

                        <div className="flex text-amber-400">
                          {[...Array(Number(rev.rating) || 5)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                          ))}
                        </div>
                      </div>

                      <h5 className="font-extrabold text-xs">
                        "{rev.title}"
                      </h5>

                      <p className={`text-xs ${textMuted} leading-relaxed`}>
                        {rev.comment}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                      <span className="text-[10px] text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded font-bold border border-teal-500/20">
                        {rev.purchasedItem || 'Verified Buyer'}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingReview({ ...rev })}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-teal-500/15 text-teal-400 hover:bg-teal-500 hover:text-slate-950 border border-teal-500/30 transition-all"
                          title="Edit Review"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete review from "${rev.name}"?`)) {
                              deleteReview(rev.id);
                              showNotification('Review deleted.');
                            }
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-red-500/10 hover:bg-red-500 hover:text-white text-red-400 border border-red-500/20 transition-all"
                          title="Delete Review"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ==================================================== */}
          {/* 7. COUPONS & OFFERS TAB                              */}
          {/* ==================================================== */}
          {activeTab === 'coupons' && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-black tracking-tight">Discount Coupons & Offers</h3>
                  <p className={`text-xs ${textMuted}`}>
                    Create discount codes that buyers can apply in Cart or Checkout.
                  </p>
                </div>

                <button
                  onClick={() => setIsAddCouponModalOpen(true)}
                  className="px-4 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 text-slate-950 font-black text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> + Create Coupon Code
                </button>
              </div>

              <div className={`rounded-3xl border shadow-sm overflow-hidden ${bgCard}`}>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className={`font-black uppercase border-b ${isDark ? 'bg-[#0f172a] text-slate-300 border-slate-800' : 'bg-slate-50 text-slate-700 border-slate-200'}`}>
                      <tr>
                        <th className="p-4">Coupon Code</th>
                        <th className="p-4">Discount</th>
                        <th className="p-4">Min Spend</th>
                        <th className="p-4">Description</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${isDark ? 'divide-slate-800/80 text-slate-300' : 'divide-slate-100 text-slate-700'}`}>
                      {coupons.map((c) => (
                        <tr key={c.id} className={hoverRow}>
                          <td className="p-4 whitespace-nowrap">
                            <span className="font-mono font-black text-sm px-2.5 py-1 rounded-lg border bg-slate-800/40 border-slate-700 text-teal-400">
                              {c.code}
                            </span>
                          </td>
                          <td className="p-4 font-black text-emerald-400 text-sm whitespace-nowrap">
                            {c.discountPercent}% OFF
                          </td>
                          <td className="p-4 font-bold whitespace-nowrap">
                            {storeConfig.currencySymbol}{c.minAmount || 0}
                          </td>
                          <td className={`p-4 ${textMuted}`}>
                            {c.description || 'Special Discount'}
                          </td>
                          <td className="p-4 whitespace-nowrap">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                              c.isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}>
                              {c.isActive ? 'Active' : 'Disabled'}
                            </span>
                          </td>
                          <td className="p-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setEditingCoupon({ ...c })}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs bg-teal-500/15 text-teal-400 hover:bg-teal-500 hover:text-slate-950 border border-teal-500/30 transition-all shadow-sm"
                                title="Edit Coupon"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm(`Delete coupon "${c.code}"?`)) {
                                    deleteCoupon(c.id);
                                    showNotification('Coupon removed.');
                                  }
                                }}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl font-bold text-xs bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/20 transition-all"
                                title="Delete Coupon"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete</span>
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
          {/* 8. FLASH SALE BANNER TAB                             */}
          {/* ==================================================== */}
          {activeTab === 'banner' && (
            <div className={`p-6 sm:p-8 rounded-3xl border shadow-sm space-y-6 max-w-3xl ${bgCard}`}>
              <div className="pb-3 border-b border-slate-800">
                <h3 className="font-black text-base">Top Flash Sale Announcement Banner</h3>
                <p className={`text-xs ${textMuted}`}>
                  Live announcement bar rendered across the top of your entire website.
                </p>
              </div>

              {/* Live Preview */}
              <div>
                <label className="block text-xs font-extrabold uppercase mb-2">Live Storefront Preview</label>
                <div 
                  className="py-2.5 px-4 rounded-2xl text-center text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 border border-white/10"
                  style={{ backgroundColor: bannerForm.bannerBg, color: bannerForm.bannerTextCol }}
                >
                  <span>{bannerForm.announcementText || 'Flash Sale Announcement'}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase mb-1">Banner Announcement Text</label>
                  <input
                    type="text"
                    value={bannerForm.announcementText}
                    onChange={(e) => setBannerForm(prev => ({ ...prev, announcementText: e.target.value }))}
                    placeholder="⚡ FLASH SALE: FLAT 85% OFF TODAY | USE CODE: DIZO85"
                    className={`w-full px-4 py-2.5 text-xs rounded-xl border font-medium focus:outline-none focus:border-teal-500 ${inputBg}`}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold uppercase mb-1">Background Color</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={bannerForm.bannerBg}
                        onChange={(e) => setBannerForm(prev => ({ ...prev, bannerBg: e.target.value }))}
                        className="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={bannerForm.bannerBg}
                        onChange={(e) => setBannerForm(prev => ({ ...prev, bannerBg: e.target.value }))}
                        className={`flex-1 px-3 py-2 text-xs rounded-xl border font-mono ${inputBg}`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold uppercase mb-1">Text Color</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={bannerForm.bannerTextCol}
                        onChange={(e) => setBannerForm(prev => ({ ...prev, bannerTextCol: e.target.value }))}
                        className="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={bannerForm.bannerTextCol}
                        onChange={(e) => setBannerForm(prev => ({ ...prev, bannerTextCol: e.target.value }))}
                        className={`flex-1 px-3 py-2 text-xs rounded-xl border font-mono ${inputBg}`}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold">
                    <input
                      type="checkbox"
                      checked={bannerForm.isBannerActive}
                      onChange={(e) => setBannerForm(prev => ({ ...prev, isBannerActive: e.target.checked }))}
                      className="w-4 h-4 text-teal-500 rounded"
                    />
                    <span>Enable Announcement Banner on Live Store</span>
                  </label>
                </div>

                <button
                  type="button"
                  onClick={handleSaveAllSettings}
                  className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Announcement Banner</span>
                </button>
              </div>

            </div>
          )}

          {/* ==================================================== */}
          {/* 9. STORE BRANDING & APPEARANCE TAB                   */}
          {/* ==================================================== */}
          {activeTab === 'appearance' && (
            <div className={`p-6 sm:p-8 rounded-3xl border shadow-sm space-y-6 max-w-3xl ${bgCard}`}>
              <div className="pb-3 border-b border-slate-800">
                <h3 className="font-black text-base">Store Identity & Visual Appearance</h3>
                <p className={`text-xs ${textMuted}`}>
                  Customize website name, slogan, brand logo, and primary theme colors.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase mb-1">Store Name</label>
                  <input
                    type="text"
                    value={appearanceForm.storeName}
                    onChange={(e) => setAppearanceForm(prev => ({ ...prev, storeName: e.target.value }))}
                    className={`w-full px-4 py-2.5 text-xs rounded-xl border font-medium focus:outline-none focus:border-teal-500 ${inputBg}`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase mb-1">Store Tagline / Slogan</label>
                  <input
                    type="text"
                    value={appearanceForm.storeTagline}
                    onChange={(e) => setAppearanceForm(prev => ({ ...prev, storeTagline: e.target.value }))}
                    className={`w-full px-4 py-2.5 text-xs rounded-xl border font-medium focus:outline-none focus:border-teal-500 ${inputBg}`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase mb-1">Brand Logo Image URL</label>
                  <input
                    type="text"
                    value={appearanceForm.logoUrl}
                    onChange={(e) => setAppearanceForm(prev => ({ ...prev, logoUrl: e.target.value }))}
                    className={`w-full px-4 py-2.5 text-xs rounded-xl border font-mono text-[11px] focus:outline-none focus:border-teal-500 ${inputBg}`}
                  />
                </div>

                {/* Color Palettes Presets */}
                <div>
                  <label className="block text-xs font-extrabold uppercase mb-2">Primary Brand Theme Accent</label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {[
                      { name: 'Mint Glow', hex: '#a1e3d8' },
                      { name: 'Sunset Orange', hex: '#f97316' },
                      { name: 'Royal Purple', hex: '#8b5cf6' },
                      { name: 'Cyber Blue', hex: '#06b6d4' },
                      { name: 'Emerald Green', hex: '#10b981' },
                    ].map((c) => (
                      <button
                        key={c.hex}
                        type="button"
                        onClick={() => setAppearanceForm(prev => ({ ...prev, primaryColor: c.hex }))}
                        className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 ${
                          appearanceForm.primaryColor === c.hex 
                            ? 'border-teal-400 bg-teal-500/10 font-black' 
                            : isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-slate-50'
                        }`}
                      >
                        <span className="w-6 h-6 rounded-full shadow-md" style={{ backgroundColor: c.hex }} />
                        <span className="text-[11px]">{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleSaveAllSettings}
                    className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Store Branding</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* ==================================================== */}
          {/* 10. GATEWAYS & WHATSAPP SETTINGS TAB                 */}
          {/* ==================================================== */}
          {activeTab === 'settings' && (
            <div className={`p-6 sm:p-8 rounded-3xl border shadow-sm space-y-6 max-w-3xl ${bgCard}`}>
              <div className="pb-3 border-b border-slate-800">
                <h3 className="font-black text-base">Payment Gateways & WhatsApp Direct Order Config</h3>
                <p className={`text-xs ${textMuted}`}>
                  Configure official WhatsApp number for order activation, UPI ID, and gateway API keys.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div>
                  <label className="block text-xs font-extrabold uppercase mb-1">
                    WhatsApp Helpline (10-Digit Mobile)
                  </label>
                  <input
                    type="text"
                    value={settingsForm.whatsappNumber || '7895768118'}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                    className={`w-full px-4 py-2.5 text-xs rounded-xl border font-mono font-bold ${inputBg}`}
                  />
                  <span className={`text-[10px] ${textMuted}`}>All "Order on WhatsApp" buttons message this number</span>
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase mb-1">Support Email</label>
                  <input
                    type="email"
                    value={settingsForm.supportEmail || 'dizozet.org@gmail.com'}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, supportEmail: e.target.value }))}
                    className={`w-full px-4 py-2.5 text-xs rounded-xl border ${inputBg}`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase mb-1">Store UPI ID</label>
                  <input
                    type="text"
                    value={settingsForm.upiId || '7895768118@ptsbi'}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, upiId: e.target.value }))}
                    className={`w-full px-4 py-2.5 text-xs rounded-xl border font-mono ${inputBg}`}
                  />
                  <span className={`text-[10px] ${textMuted}`}>Dynamic QR codes generate using this VPA ID</span>
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase mb-1">Currency Symbol</label>
                  <input
                    type="text"
                    value={settingsForm.currencySymbol || '₹'}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, currencySymbol: e.target.value }))}
                    className={`w-full px-4 py-2.5 text-xs rounded-xl border ${inputBg}`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase mb-1">Cashfree App ID</label>
                  <input
                    type="text"
                    value={settingsForm.cashfreeAppId || '1495948439669a2ddbdd5af37fc8495941'}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, cashfreeAppId: e.target.value }))}
                    className={`w-full px-4 py-2.5 text-xs rounded-xl border font-mono text-[11px] ${inputBg}`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase mb-1">Razorpay Key ID (Optional)</label>
                  <input
                    type="text"
                    value={settingsForm.razorpayKeyId || ''}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, razorpayKeyId: e.target.value }))}
                    className={`w-full px-4 py-2.5 text-xs rounded-xl border font-mono text-[11px] ${inputBg}`}
                  />
                </div>

              </div>

              {/* Telegram Bot Order Alerts Card */}
              <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'} space-y-4`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-500 flex items-center justify-center">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black">Telegram Bot Order Notifications</h4>
                      <p className={`text-[11px] ${textMuted}`}>Get instant alerts on Telegram with full customer & product details on every purchase</p>
                    </div>
                  </div>
                  <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settingsForm.isTelegramNotificationActive !== false}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, isTelegramNotificationActive: e.target.checked }))}
                      className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
                    />
                    <span>Enable Telegram Alerts</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold uppercase mb-1">Telegram Bot Token</label>
                    <input
                      type="text"
                      placeholder="e.g. 7891234567:ABCdefGHIjklMNOpqr..."
                      value={settingsForm.telegramBotToken || ''}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, telegramBotToken: e.target.value }))}
                      className={`w-full px-4 py-2.5 text-xs rounded-xl border font-mono text-[11px] ${inputBg}`}
                    />
                    <span className={`text-[10px] ${textMuted}`}>Obtained from @BotFather on Telegram</span>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold uppercase mb-1">Telegram Chat ID</label>
                    <input
                      type="text"
                      placeholder="e.g. 123456789 or -100123456789"
                      value={settingsForm.telegramChatId || ''}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, telegramChatId: e.target.value }))}
                      className={`w-full px-4 py-2.5 text-xs rounded-xl border font-mono text-[11px] ${inputBg}`}
                    />
                    <span className={`text-[10px] ${textMuted}`}>Your personal Chat ID or Channel ID (from @userinfobot)</span>
                  </div>
                </div>

                {/* Quick Setup Instructions & Test Button */}
                <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={testingTelegram}
                      onClick={handleTestTelegramNotification}
                      className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{testingTelegram ? 'Sending Test...' : 'Send Test Notification'}</span>
                    </button>
                    {telegramTestStatus && (
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {telegramTestStatus}
                      </span>
                    )}
                  </div>
                </div>

                {/* 4-Step Guide inside Admin UI */}
                <div className={`p-3.5 rounded-xl text-xs space-y-1.5 ${isDark ? 'bg-slate-950/70 text-slate-300' : 'bg-white text-slate-600'} border border-slate-200 dark:border-slate-800`}>
                  <p className="font-extrabold text-sky-500">📖 2-Minute Telegram Bot Setup Guide:</p>
                  <p>1. Telegram open karein aur <strong>@BotFather</strong> search karke <code>/newbot</code> command send karein.</p>
                  <p>2. Bot ka naam choose karein. BotFather aapko ek <strong>HTTP API Token</strong> dega, usko upar <strong>Bot Token</strong> me daalein.</p>
                  <p>3. Telegram par <strong>@userinfobot</strong> ko start karein, ye aapko aapka <strong>Id</strong> (Chat ID) bata dega. Usko <strong>Chat ID</strong> me daalein.</p>
                  <p>4. Apne banaye hue Bot ko Telegram me open karke <strong>Start</strong> button dabayein, fir <strong>Send Test Notification</strong> par click karein!</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase mb-1">Guarantee & Warranty Policy Text</label>
                <textarea
                  rows={2}
                  value={settingsForm.guaranteeText || ''}
                  onChange={(e) => setSettingsForm(prev => ({ ...prev, guaranteeText: e.target.value }))}
                  className={`w-full px-4 py-2.5 text-xs rounded-xl border ${inputBg}`}
                />
              </div>

              <button
                type="button"
                onClick={handleSaveAllSettings}
                className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Payment & WhatsApp Gateway Settings</span>
              </button>

            </div>
          )}

          {/* ==================================================== */}
          {/* 11. SECURITY, MASTER PIN & BACKUP TAB                */}
          {/* ==================================================== */}
          {activeTab === 'security' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl">
              
              {/* Change Password Card */}
              <form onSubmit={handleChangePasswordSubmit} className={`p-6 sm:p-8 rounded-3xl border shadow-sm space-y-4 ${bgCard}`}>
                <div className="pb-3 border-b border-slate-800 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
                    <Key className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-black text-base">Change Master Admin Password</h3>
                    <p className={`text-[11px] ${textMuted}`}>Protect unauthorized access to your portal.</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase mb-1">Current Password</label>
                  <div className="relative">
                    <input
                      type={showCurrentPwd ? 'text' : 'password'}
                      required
                      value={pwdForm.current}
                      onChange={(e) => setPwdForm(prev => ({ ...prev, current: e.target.value }))}
                      placeholder="Enter current password..."
                      className={`w-full pl-4 pr-10 py-2.5 text-xs rounded-xl border ${inputBg}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPwd(!showCurrentPwd)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                    >
                      {showCurrentPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase mb-1">New Master Password</label>
                  <div className="relative">
                    <input
                      type={showNewPwd ? 'text' : 'password'}
                      required
                      value={pwdForm.newPwd}
                      onChange={(e) => setPwdForm(prev => ({ ...prev, newPwd: e.target.value }))}
                      placeholder="Enter new strong password..."
                      className={`w-full pl-4 pr-10 py-2.5 text-xs rounded-xl border ${inputBg}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPwd(!showNewPwd)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                    >
                      {showNewPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={pwdForm.confirm}
                    onChange={(e) => setPwdForm(prev => ({ ...prev, confirm: e.target.value }))}
                    placeholder="Repeat new password..."
                    className={`w-full px-4 py-2.5 text-xs rounded-xl border ${inputBg}`}
                  />
                </div>

                {pwdError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold rounded-xl flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{pwdError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-teal-500 to-emerald-600 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Key className="w-4 h-4" />
                  <span>Update Master Password</span>
                </button>
              </form>

              {/* Backup & Factory Reset Card */}
              <div className={`p-6 sm:p-8 rounded-3xl border shadow-sm space-y-4 ${bgCard}`}>
                <div className="pb-3 border-b border-slate-800 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-black text-base">Store Data Backup & Restore</h3>
                    <p className={`text-[11px] ${textMuted}`}>Export full store state or restore from file.</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className={`p-4 rounded-2xl border flex items-center justify-between ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <div>
                      <h4 className="font-black text-xs">Export Store JSON Backup</h4>
                      <p className={`text-[10px] ${textMuted}`}>Includes all 130+ bundles, orders, coupons, reviews.</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleDownloadBackup}
                      className="px-3.5 py-2 bg-gradient-to-r from-teal-500 to-emerald-600 text-slate-950 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>

                  <div className={`p-4 rounded-2xl border flex items-center justify-between ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <div>
                      <h4 className="font-black text-xs">Restore Store from Backup</h4>
                      <p className={`text-[10px] ${textMuted}`}>Upload previously saved .json backup file.</p>
                    </div>
                    <label className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl cursor-pointer transition-all flex items-center gap-1.5 shadow-sm">
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

                  <div className="p-4 rounded-2xl border border-red-500/30 bg-red-500/10 flex items-center justify-between">
                    <div>
                      <h4 className="font-black text-red-400 text-xs">Factory Reset Store</h4>
                      <p className="text-[10px] text-red-300">Resets back to original starter products & default password.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('WARNING: Are you sure you want to factory reset all store data?')) {
                          resetAllDataToDefault();
                          showNotification('All data reset to factory default.');
                        }
                      }}
                      className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
                    >
                      Reset All
                    </button>
                  </div>
                </div>

              </div>

            </div>
          )}

        </main>
      </div>

      {/* ==================================================== */}
      {/* MODAL: ADD PRODUCT / SUBSCRIPTION / REELS            */}
      {/* ==================================================== */}
      {isAddProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border p-6 sm:p-8 space-y-5 animate-fadeIn ${bgCard}`}>
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-black text-lg">
                + Add New {productModalType === 'subscription' ? 'Subscription / Service' : productModalType === 'reels-bundle' ? 'Reels Bundle' : 'Digital Product'}
              </h3>
              <button
                onClick={() => setIsAddProductModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAddProduct} className="space-y-4 text-xs">
              
              <div>
                <label className="block font-extrabold uppercase mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={productForm.title}
                  onChange={(e) => setProductForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Canva Pro Lifetime + Gemini AI"
                  className={`w-full px-4 py-2.5 rounded-xl border font-medium focus:outline-none focus:border-teal-500 ${inputBg}`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-extrabold uppercase mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={productForm.category}
                    onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value }))}
                    className={`w-full px-4 py-2.5 rounded-xl border font-medium focus:outline-none focus:border-teal-500 ${inputBg}`}
                  />
                </div>

                <div>
                  <label className="block font-extrabold uppercase mb-1">Badge</label>
                  <input
                    type="text"
                    value={productForm.badge}
                    onChange={(e) => setProductForm(prev => ({ ...prev, badge: e.target.value }))}
                    placeholder="e.g. Official Plan, HOT, 85% OFF"
                    className={`w-full px-4 py-2.5 rounded-xl border font-medium focus:outline-none focus:border-teal-500 ${inputBg}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-extrabold uppercase mb-1">Rating (★ 1-5)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={productForm.rating}
                    onChange={(e) => setProductForm(prev => ({ ...prev, rating: e.target.value }))}
                    className={`w-full px-4 py-2.5 rounded-xl border font-medium focus:outline-none focus:border-teal-500 ${inputBg}`}
                  />
                </div>

                <div>
                  <label className="block font-extrabold uppercase mb-1">Review Count</label>
                  <input
                    type="number"
                    value={productForm.reviewCount}
                    onChange={(e) => setProductForm(prev => ({ ...prev, reviewCount: e.target.value }))}
                    className={`w-full px-4 py-2.5 rounded-xl border font-medium focus:outline-none focus:border-teal-500 ${inputBg}`}
                  />
                </div>
              </div>

              {/* Reels specifics */}
              {productModalType === 'reels-bundle' && (
                <div className={`p-4 rounded-2xl border space-y-3 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-extrabold uppercase mb-1">Reels Count</label>
                      <input
                        type="number"
                        value={productForm.reelCount}
                        onChange={(e) => setProductForm(prev => ({ ...prev, reelCount: e.target.value }))}
                        className={`w-full px-3 py-2 rounded-xl border font-bold ${inputBg}`}
                      />
                    </div>
                    <div>
                      <label className="block font-extrabold uppercase mb-1">Personal Price (₹)</label>
                      <input
                        type="number"
                        value={productForm.personalPrice}
                        onChange={(e) => setProductForm(prev => ({ ...prev, personalPrice: e.target.value }))}
                        className={`w-full px-3 py-2 rounded-xl border font-bold ${inputBg}`}
                      />
                    </div>
                    <div>
                      <label className="block font-extrabold uppercase mb-1">Reseller Price (₹)</label>
                      <input
                        type="number"
                        value={productForm.resellerPrice}
                        onChange={(e) => setProductForm(prev => ({ ...prev, resellerPrice: e.target.value }))}
                        className={`w-full px-3 py-2 rounded-xl border font-bold ${inputBg}`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-extrabold uppercase mb-1">Google Drive Link (Instant Download Access)</label>
                    <input
                      type="url"
                      value={productForm.googleDriveLink}
                      onChange={(e) => setProductForm(prev => ({ ...prev, googleDriveLink: e.target.value }))}
                      className={`w-full px-3 py-2 rounded-xl border font-mono text-[11px] ${inputBg}`}
                    />
                  </div>
                </div>
              )}

              {/* Subscriptions Plans builder */}
              {productModalType === 'subscription' && (
                <div className={`p-4 rounded-2xl border space-y-3 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center justify-between">
                    <label className="font-extrabold uppercase">Pricing Duration Tiers</label>
                    <button
                      type="button"
                      onClick={() => setProductForm(prev => ({
                        ...prev,
                        plans: [...prev.plans, { id: `p-${Date.now()}`, name: '3 Months Plan', price: 399, regularPrice: 799, duration: '90 Days', isPopular: false }]
                      }))}
                      className="text-teal-400 font-extrabold text-[11px] hover:underline"
                    >
                      + Add Tier
                    </button>
                  </div>

                  {productForm.plans.map((p, idx) => (
                    <div key={p.id || idx} className={`grid grid-cols-4 gap-2 items-center p-2.5 rounded-xl border ${isDark ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200'}`}>
                      <input
                        type="text"
                        placeholder="Plan Name"
                        value={p.name}
                        onChange={(e) => {
                          const updated = [...productForm.plans];
                          updated[idx].name = e.target.value;
                          setProductForm(prev => ({ ...prev, plans: updated }));
                        }}
                        className={`px-2 py-1 text-xs rounded border font-bold ${inputBg}`}
                      />
                      <input
                        type="number"
                        placeholder="Price ₹"
                        value={p.price}
                        onChange={(e) => {
                          const updated = [...productForm.plans];
                          updated[idx].price = Number(e.target.value);
                          setProductForm(prev => ({ ...prev, plans: updated }));
                        }}
                        className={`px-2 py-1 text-xs rounded border font-bold ${inputBg}`}
                      />
                      <input
                        type="text"
                        placeholder="Duration"
                        value={p.duration}
                        onChange={(e) => {
                          const updated = [...productForm.plans];
                          updated[idx].duration = e.target.value;
                          setProductForm(prev => ({ ...prev, plans: updated }));
                        }}
                        className={`px-2 py-1 text-xs rounded border ${inputBg}`}
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
                        className="text-red-400 font-bold hover:underline text-[11px] text-right pr-2"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Digital Product specifics */}
              {productModalType === 'digital-product' && (
                <div className={`p-4 rounded-2xl border grid grid-cols-2 gap-3 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <div>
                    <label className="block font-extrabold uppercase mb-1">Price (₹)</label>
                    <input
                      type="number"
                      value={productForm.price}
                      onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                      className={`w-full px-3 py-2 rounded-xl border font-bold ${inputBg}`}
                    />
                  </div>
                  <div>
                    <label className="block font-extrabold uppercase mb-1">Format</label>
                    <input
                      type="text"
                      value={productForm.format}
                      onChange={(e) => setProductForm(prev => ({ ...prev, format: e.target.value }))}
                      className={`w-full px-3 py-2 rounded-xl border ${inputBg}`}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block font-extrabold uppercase mb-1">Thumbnail Cover Image URL</label>
                <input
                  type="url"
                  required
                  value={productForm.thumbnail}
                  onChange={(e) => setProductForm(prev => ({ ...prev, thumbnail: e.target.value }))}
                  className={`w-full px-4 py-2.5 rounded-xl border font-mono text-[11px] ${inputBg}`}
                />
              </div>

              <div>
                <label className="block font-extrabold uppercase mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={productForm.shortDescription}
                  onChange={(e) => setProductForm(prev => ({ ...prev, shortDescription: e.target.value }))}
                  placeholder="Key highlight for buyers..."
                  className={`w-full px-4 py-2.5 rounded-xl border font-medium ${inputBg}`}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddProductModalOpen(false)}
                  className={`px-5 py-2.5 rounded-xl font-bold ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 text-slate-950 font-black rounded-xl shadow-md"
                >
                  Publish to Store
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
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border p-6 sm:p-8 space-y-5 animate-fadeIn ${bgCard}`}>
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-black text-lg">
                Edit: {editingProduct.data.title}
              </h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditProduct} className="space-y-4 text-xs">
              
              <div>
                <label className="block font-extrabold uppercase mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editingProduct.data.title || ''}
                  onChange={(e) => setEditingProduct(prev => ({
                    ...prev,
                    data: { ...prev.data, title: e.target.value }
                  }))}
                  className={`w-full px-4 py-2.5 rounded-xl border font-medium ${inputBg}`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-extrabold uppercase mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.data.category || ''}
                    onChange={(e) => setEditingProduct(prev => ({
                      ...prev,
                      data: { ...prev.data, category: e.target.value }
                    }))}
                    className={`w-full px-4 py-2.5 rounded-xl border font-medium ${inputBg}`}
                  />
                </div>

                <div>
                  <label className="block font-extrabold uppercase mb-1">Badge</label>
                  <input
                    type="text"
                    value={editingProduct.data.badge || ''}
                    onChange={(e) => setEditingProduct(prev => ({
                      ...prev,
                      data: { ...prev.data, badge: e.target.value }
                    }))}
                    className={`w-full px-4 py-2.5 rounded-xl border font-medium ${inputBg}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-extrabold uppercase mb-1">Rating (★)</label>
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
                    className={`w-full px-4 py-2.5 rounded-xl border font-medium ${inputBg}`}
                  />
                </div>

                <div>
                  <label className="block font-extrabold uppercase mb-1">Reviews Count</label>
                  <input
                    type="number"
                    value={editingProduct.data.reviewCount || 100}
                    onChange={(e) => setEditingProduct(prev => ({
                      ...prev,
                      data: { ...prev.data, reviewCount: e.target.value }
                    }))}
                    className={`w-full px-4 py-2.5 rounded-xl border font-medium ${inputBg}`}
                  />
                </div>
              </div>

              {/* Reels specifics */}
              {editingProduct.type === 'reels-bundle' && (
                <div className={`p-4 rounded-2xl border space-y-3 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-extrabold uppercase mb-1">Reels Count</label>
                      <input
                        type="number"
                        value={editingProduct.data.reelCount || 1000}
                        onChange={(e) => setEditingProduct(prev => ({
                          ...prev,
                          data: { ...prev.data, reelCount: e.target.value }
                        }))}
                        className={`w-full px-3 py-2 rounded-xl border font-bold ${inputBg}`}
                      />
                    </div>
                    <div>
                      <label className="block font-extrabold uppercase mb-1">Personal Price (₹)</label>
                      <input
                        type="number"
                        value={editingProduct.data.personalPrice || 99}
                        onChange={(e) => setEditingProduct(prev => ({
                          ...prev,
                          data: { ...prev.data, personalPrice: e.target.value }
                        }))}
                        className={`w-full px-3 py-2 rounded-xl border font-bold ${inputBg}`}
                      />
                    </div>
                    <div>
                      <label className="block font-extrabold uppercase mb-1">Reseller Price (₹)</label>
                      <input
                        type="number"
                        value={editingProduct.data.resellerPrice || 199}
                        onChange={(e) => setEditingProduct(prev => ({
                          ...prev,
                          data: { ...prev.data, resellerPrice: e.target.value }
                        }))}
                        className={`w-full px-3 py-2 rounded-xl border font-bold ${inputBg}`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-extrabold uppercase mb-1">Google Drive Link</label>
                    <input
                      type="url"
                      value={editingProduct.data.googleDriveLink || ''}
                      onChange={(e) => setEditingProduct(prev => ({
                        ...prev,
                        data: { ...prev.data, googleDriveLink: e.target.value }
                      }))}
                      className={`w-full px-3 py-2 rounded-xl border font-mono text-[11px] ${inputBg}`}
                    />
                  </div>
                </div>
              )}

              {/* Subscriptions Plans builder */}
              {editingProduct.type === 'subscription' && editingProduct.data.plans && (
                <div className={`p-4 rounded-2xl border space-y-3 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center justify-between">
                    <label className="font-extrabold uppercase">Pricing Duration Tiers</label>
                    <button
                      type="button"
                      onClick={() => setEditingProduct(prev => ({
                        ...prev,
                        data: {
                          ...prev.data,
                          plans: [...(prev.data.plans || []), { id: `p-${Date.now()}`, name: '3 Months Plan', price: 399, regularPrice: 799, duration: '90 Days', isPopular: false }]
                        }
                      }))}
                      className="text-teal-400 font-extrabold text-[11px] hover:underline"
                    >
                      + Add Plan
                    </button>
                  </div>

                  {editingProduct.data.plans.map((p, idx) => (
                    <div key={p.id || idx} className={`grid grid-cols-4 gap-2 items-center p-2.5 rounded-xl border ${isDark ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200'}`}>
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
                        className={`px-2 py-1 text-xs rounded border font-bold ${inputBg}`}
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
                        className={`px-2 py-1 text-xs rounded border font-bold ${inputBg}`}
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
                        className={`px-2 py-1 text-xs rounded border ${inputBg}`}
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
                        className="text-red-400 font-bold hover:underline text-[11px] text-right pr-2"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Digital specifics */}
              {editingProduct.type === 'digital-product' && (
                <div className={`p-4 rounded-2xl border grid grid-cols-2 gap-3 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <div>
                    <label className="block font-extrabold uppercase mb-1">Price (₹)</label>
                    <input
                      type="number"
                      value={editingProduct.data.price || 99}
                      onChange={(e) => setEditingProduct(prev => ({
                        ...prev,
                        data: { ...prev.data, price: e.target.value }
                      }))}
                      className={`w-full px-3 py-2 rounded-xl border font-bold ${inputBg}`}
                    />
                  </div>
                  <div>
                    <label className="block font-extrabold uppercase mb-1">Format</label>
                    <input
                      type="text"
                      value={editingProduct.data.format || ''}
                      onChange={(e) => setEditingProduct(prev => ({
                        ...prev,
                        data: { ...prev.data, format: e.target.value }
                      }))}
                      className={`w-full px-3 py-2 rounded-xl border ${inputBg}`}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block font-extrabold uppercase mb-1">Thumbnail Cover Image URL</label>
                <input
                  type="url"
                  required
                  value={editingProduct.data.thumbnail || ''}
                  onChange={(e) => setEditingProduct(prev => ({
                    ...prev,
                    data: { ...prev.data, thumbnail: e.target.value }
                  }))}
                  className={`w-full px-4 py-2.5 rounded-xl border font-mono text-[11px] ${inputBg}`}
                />
              </div>

              <div>
                <label className="block font-extrabold uppercase mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={editingProduct.data.shortDescription || ''}
                  onChange={(e) => setEditingProduct(prev => ({
                    ...prev,
                    data: { ...prev.data, shortDescription: e.target.value }
                  }))}
                  className={`w-full px-4 py-2.5 rounded-xl border font-medium ${inputBg}`}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className={`px-5 py-2.5 rounded-xl font-bold ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 text-slate-950 font-black rounded-xl shadow-md"
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
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border p-6 sm:p-8 space-y-5 animate-fadeIn text-xs ${bgCard}`}>
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-black text-base text-teal-400">
                  Order Details: {selectedOrderDetails.orderId}
                </h3>
                <span className={`text-[11px] ${textMuted}`}>
                  {new Date(selectedOrderDetails.date).toLocaleString()}
                </span>
              </div>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className={`p-4 rounded-2xl border space-y-2 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <h4 className="font-black text-xs uppercase text-teal-400">Customer Information</h4>
              <div className="grid grid-cols-2 gap-2 font-medium">
                <div>Name: <strong className="text-white">{selectedOrderDetails.customer?.name}</strong></div>
                <div>Phone: <strong className="text-white font-mono">{selectedOrderDetails.customer?.phone}</strong></div>
                <div className="col-span-2">Email: <strong className="text-white">{selectedOrderDetails.customer?.email}</strong></div>
                <div className="col-span-2">City/State: <strong className="text-white">{selectedOrderDetails.customer?.city || 'India'}</strong></div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-black text-xs uppercase text-teal-400">Purchased Items</h4>
              <div className="space-y-2">
                {(selectedOrderDetails.items || []).map((it, idx) => (
                  <div key={idx} className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <img
                      src={it.thumbnail}
                      alt={it.title}
                      className="w-12 h-12 rounded-lg object-cover bg-slate-900 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="font-bold truncate">{it.title}</h5>
                      <p className={`text-[10px] ${textMuted}`}>{it.planName || 'Instant Delivery'}</p>
                      {it.googleDriveLink && (
                        <a href={it.googleDriveLink} target="_blank" rel="noopener noreferrer" className="text-teal-400 font-bold hover:underline text-[10px]">
                          Open Drive Folder →
                        </a>
                      )}
                    </div>
                    <div className="text-right font-black">
                      {storeConfig.currencySymbol}{it.price}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-between font-black text-emerald-400 text-sm">
              <span>Total Paid</span>
              <span>{storeConfig.currencySymbol}{selectedOrderDetails.total}</span>
            </div>

            <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-800">
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
                className={`px-5 py-2.5 rounded-xl font-bold ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'}`}
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
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`rounded-3xl max-w-md w-full shadow-2xl border p-6 sm:p-8 space-y-4 animate-fadeIn text-xs ${bgCard}`}>
            
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-black text-base">
                {editingReview ? 'Edit Customer Review' : '+ Add Customer Review'}
              </h3>
              <button
                onClick={() => { setIsAddReviewModalOpen(false); setEditingReview(null); }}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={editingReview ? handleSaveEditReview : handleSaveAddReview} className="space-y-3">
              <div>
                <label className="block font-extrabold uppercase mb-1">Customer Name</label>
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
                  className={`w-full px-4 py-2 rounded-xl border ${inputBg}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-extrabold uppercase mb-1">Role / City</label>
                  <input
                    type="text"
                    value={editingReview ? editingReview.role : reviewForm.role}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (editingReview) setEditingReview(prev => ({ ...prev, role: val }));
                      else setReviewForm(prev => ({ ...prev, role: val }));
                    }}
                    className={`w-full px-3 py-2 rounded-xl border ${inputBg}`}
                  />
                </div>

                <div>
                  <label className="block font-extrabold uppercase mb-1">Rating</label>
                  <select
                    value={editingReview ? editingReview.rating : reviewForm.rating}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (editingReview) setEditingReview(prev => ({ ...prev, rating: val }));
                      else setReviewForm(prev => ({ ...prev, rating: val }));
                    }}
                    className={`w-full px-3 py-2 rounded-xl border font-bold ${inputBg}`}
                  >
                    <option value={5}>5 Stars ★★★★★</option>
                    <option value={4}>4 Stars ★★★★</option>
                    <option value={3}>3 Stars ★★★</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-extrabold uppercase mb-1">Review Title</label>
                <input
                  type="text"
                  required
                  value={editingReview ? editingReview.title : reviewForm.title}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (editingReview) setEditingReview(prev => ({ ...prev, title: val }));
                    else setReviewForm(prev => ({ ...prev, title: val }));
                  }}
                  className={`w-full px-4 py-2 rounded-xl border ${inputBg}`}
                />
              </div>

              <div>
                <label className="block font-extrabold uppercase mb-1">Review Comment</label>
                <textarea
                  rows={3}
                  required
                  value={editingReview ? editingReview.comment : reviewForm.comment}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (editingReview) setEditingReview(prev => ({ ...prev, comment: val }));
                    else setReviewForm(prev => ({ ...prev, comment: val }));
                  }}
                  className={`w-full px-4 py-2 rounded-xl border ${inputBg}`}
                />
              </div>

              <div>
                <label className="block font-extrabold uppercase mb-1">Product Purchased</label>
                <input
                  type="text"
                  value={editingReview ? editingReview.purchasedItem : reviewForm.purchasedItem}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (editingReview) setEditingReview(prev => ({ ...prev, purchasedItem: val }));
                    else setReviewForm(prev => ({ ...prev, purchasedItem: val }));
                  }}
                  className={`w-full px-4 py-2 rounded-xl border ${inputBg}`}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => { setIsAddReviewModalOpen(false); setEditingReview(null); }}
                  className={`px-4 py-2 rounded-xl font-bold ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-teal-500 to-emerald-600 text-slate-950 font-black rounded-xl shadow-md"
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
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`rounded-3xl max-w-md w-full shadow-2xl border p-6 sm:p-8 space-y-4 animate-fadeIn text-xs ${bgCard}`}>
            
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-black text-base">
                {editingCoupon ? 'Edit Discount Coupon' : '+ Create New Coupon'}
              </h3>
              <button
                onClick={() => { setIsAddCouponModalOpen(false); setEditingCoupon(null); }}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={editingCoupon ? handleSaveEditCoupon : handleSaveAddCoupon} className="space-y-3">
              <div>
                <label className="block font-extrabold uppercase mb-1">Coupon Code (Uppercase)</label>
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
                  className={`w-full px-4 py-2 rounded-xl border font-mono font-black text-sm ${inputBg}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-extrabold uppercase mb-1">Discount (%)</label>
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
                    className={`w-full px-3 py-2 rounded-xl border font-bold ${inputBg}`}
                  />
                </div>

                <div>
                  <label className="block font-extrabold uppercase mb-1">Min Spend (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={editingCoupon ? editingCoupon.minAmount : couponForm.minAmount}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (editingCoupon) setEditingCoupon(prev => ({ ...prev, minAmount: val }));
                      else setCouponForm(prev => ({ ...prev, minAmount: val }));
                    }}
                    className={`w-full px-3 py-2 rounded-xl border font-bold ${inputBg}`}
                  />
                </div>
              </div>

              <div>
                <label className="block font-extrabold uppercase mb-1">Description / Offer Title</label>
                <input
                  type="text"
                  value={editingCoupon ? editingCoupon.description : couponForm.description}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (editingCoupon) setEditingCoupon(prev => ({ ...prev, description: val }));
                    else setCouponForm(prev => ({ ...prev, description: val }));
                  }}
                  className={`w-full px-4 py-2 rounded-xl border ${inputBg}`}
                />
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer font-bold">
                  <input
                    type="checkbox"
                    checked={editingCoupon ? editingCoupon.isActive : couponForm.isActive}
                    onChange={(e) => {
                      const val = e.target.checked;
                      if (editingCoupon) setEditingCoupon(prev => ({ ...prev, isActive: val }));
                      else setCouponForm(prev => ({ ...prev, isActive: val }));
                    }}
                    className="w-4 h-4 text-teal-500 rounded"
                  />
                  <span>Active & Usable by Buyers</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => { setIsAddCouponModalOpen(false); setEditingCoupon(null); }}
                  className={`px-4 py-2 rounded-xl font-bold ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-teal-500 to-emerald-600 text-slate-950 font-black rounded-xl shadow-md"
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
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`rounded-3xl max-w-md w-full shadow-2xl border p-6 sm:p-8 space-y-4 animate-fadeIn text-xs ${bgCard}`}>
            
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-black text-base">
                + Create Manual Customer Order
              </h3>
              <button
                onClick={() => setIsManualOrderModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveManualOrder} className="space-y-3">
              <div>
                <label className="block font-extrabold uppercase mb-1">Customer Name</label>
                <input
                  type="text"
                  required
                  value={manualOrderForm.customerName}
                  onChange={(e) => setManualOrderForm(prev => ({ ...prev, customerName: e.target.value }))}
                  placeholder="e.g. Vikramaditya"
                  className={`w-full px-4 py-2 rounded-xl border ${inputBg}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-extrabold uppercase mb-1">Phone / WhatsApp</label>
                  <input
                    type="text"
                    required
                    value={manualOrderForm.customerPhone}
                    onChange={(e) => setManualOrderForm(prev => ({ ...prev, customerPhone: e.target.value }))}
                    className={`w-full px-3 py-2 rounded-xl border font-mono ${inputBg}`}
                  />
                </div>
                <div>
                  <label className="block font-extrabold uppercase mb-1">City</label>
                  <input
                    type="text"
                    value={manualOrderForm.customerCity}
                    onChange={(e) => setManualOrderForm(prev => ({ ...prev, customerCity: e.target.value }))}
                    className={`w-full px-3 py-2 rounded-xl border ${inputBg}`}
                  />
                </div>
              </div>

              <div>
                <label className="block font-extrabold uppercase mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={manualOrderForm.itemTitle}
                  onChange={(e) => setManualOrderForm(prev => ({ ...prev, itemTitle: e.target.value }))}
                  placeholder="e.g. Google Gemini Advanced 1-Year"
                  className={`w-full px-4 py-2 rounded-xl border font-bold ${inputBg}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-extrabold uppercase mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={manualOrderForm.itemPrice}
                    onChange={(e) => setManualOrderForm(prev => ({ ...prev, itemPrice: e.target.value }))}
                    className={`w-full px-3 py-2 rounded-xl border font-black text-sm ${inputBg}`}
                  />
                </div>
                <div>
                  <label className="block font-extrabold uppercase mb-1">Status</label>
                  <select
                    value={manualOrderForm.orderStatus}
                    onChange={(e) => setManualOrderForm(prev => ({ ...prev, orderStatus: e.target.value }))}
                    className={`w-full px-3 py-2 rounded-xl border font-bold ${inputBg}`}
                  >
                    <option value="Delivered">Delivered</option>
                    <option value="Processing">Processing</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsManualOrderModalOpen(false)}
                  className={`px-4 py-2 rounded-xl font-bold ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-teal-500 to-emerald-600 text-slate-950 font-black rounded-xl shadow-md"
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
