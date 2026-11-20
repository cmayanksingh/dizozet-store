import React, { createContext, useContext, useState, useEffect } from 'react';
import initialBundlesData from '../data/reelsBundles.json';
import { initialSubscriptions } from '../data/subscriptionsData';
import { initialDigitalProducts } from '../data/digitalProductsData';
import { initialStoreConfig, customerReviews as initialCustomerReviews } from '../data/storeContent';
import {
  getFirestoreDB,
  syncOrderToFirestore,
  fetchOrdersFromFirestore,
  updateOrderStatusInFirestore,
  deleteOrderFromFirestore,
  syncProductToFirestore,
  deleteProductFromFirestore,
  syncSettingsToFirestore,
  syncCouponToFirestore,
  deleteCouponFromFirestore
} from '../services/firebase';

const StoreContext = createContext(null);

export const defaultCoupons = [
  { id: 'c-1', code: 'DIZO85', discountPercent: 85, minAmount: 99, isActive: true, description: 'Flat 85% Flash Discount' },
  { id: 'c-2', code: 'FLAT50', discountPercent: 50, minAmount: 199, isActive: true, description: 'Flat 50% Off On Orders Above ₹199' },
  { id: 'c-3', code: 'SAVE20', discountPercent: 20, minAmount: 49, isActive: true, description: '20% Off Storewide' },
  { id: 'c-4', code: 'WELCOME10', discountPercent: 10, minAmount: 0, isActive: true, description: '10% Welcome Discount' }
];

export const StoreProvider = ({ children }) => {
  // 1. Subscriptions
  const [subscriptions, setSubscriptions] = useState(() => {
    try {
      const saved = localStorage.getItem('digivault_subscriptions_v2');
      return saved ? JSON.parse(saved) : initialSubscriptions;
    } catch {
      return initialSubscriptions;
    }
  });

  // 2. Reels Bundles
  const [reelsBundles, setReelsBundles] = useState(() => {
    try {
      const saved = localStorage.getItem('digivault_reels_bundles');
      return saved ? JSON.parse(saved) : initialBundlesData;
    } catch {
      return initialBundlesData;
    }
  });

  // 3. Digital Products / Services
  const [digitalProducts, setDigitalProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('digivault_digital_products');
      return saved ? JSON.parse(saved) : initialDigitalProducts;
    } catch {
      return initialDigitalProducts;
    }
  });

  // 4. Cart
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('digivault_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // 5. Orders (with demo historical orders for realistic sales reports)
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('digivault_orders');
      if (saved) return JSON.parse(saved);
      return [
        {
          orderId: 'ORD-98214',
          date: new Date(Date.now() - 3600000 * 2).toISOString(),
          customer: {
            name: 'Rahul Sharma',
            email: 'rahul.creator@gmail.com',
            phone: '+91 78957 68118',
            city: 'Mumbai',
            state: 'Maharashtra'
          },
          items: [
            {
              id: 'sub-gemini-advanced-1-year',
              productId: 'sub-gemini-advanced',
              title: 'Google Gemini Advanced (1 Year Subscription)',
              type: 'subscription',
              planName: '1 Year Plan',
              price: 999,
              quantity: 1,
              thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
              deliveryInfo: 'WhatsApp Activation on 7895768118 | Email: rahul.creator@gmail.com'
            }
          ],
          subtotal: 999,
          discount: 0,
          total: 999,
          paymentMethod: 'UPI QR Code / Apps',
          paymentStatus: 'Paid',
          orderStatus: 'Delivered',
          transactionId: 'UPI-TXN-9028340129'
        },
        {
          orderId: 'ORD-98150',
          date: new Date(Date.now() - 3600000 * 18).toISOString(),
          customer: {
            name: 'Priya Verma',
            email: 'priya.v@outlook.com',
            phone: '+91 98765 43210',
            city: 'Bangalore',
            state: 'Karnataka'
          },
          items: [
            {
              id: 'rb-4000-cartoon-bundle-reseller',
              productId: 'rb-4000-cartoon-bundle',
              title: '4000+ Ready-to-Upload 2D & 3D Cartoon Videos',
              type: 'reels-bundle',
              planName: 'Reseller Commercial License',
              price: 199,
              quantity: 1,
              thumbnail: 'https://media-cdn.cosmofeed.com/chat/Neon-4000--Cartoon-Video-Bundle-2026-10-10-03-03-49.png?w=1200&q=75',
              googleDriveLink: 'https://drive.google.com'
            }
          ],
          subtotal: 199,
          discount: 0,
          total: 199,
          paymentMethod: 'UPI Apps (PhonePe / GPay)',
          paymentStatus: 'Paid',
          orderStatus: 'Delivered',
          transactionId: 'UPI-TXN-8841029411'
        },
        {
          orderId: 'ORD-97992',
          date: new Date(Date.now() - 3600000 * 36).toISOString(),
          customer: {
            name: 'Amit Patel',
            email: 'amit.patel99@gmail.com',
            phone: '+91 99250 11223',
            city: 'Ahmedabad',
            state: 'Gujarat'
          },
          items: [
            {
              id: 'sub-netflix-uhd-3-m',
              productId: 'sub-netflix-uhd',
              title: 'Netflix 4K Ultra HD Premium',
              type: 'subscription',
              planName: '3 Months Plan',
              price: 399,
              quantity: 1,
              thumbnail: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&q=80',
              deliveryInfo: 'WhatsApp Order Activation. Connect with 7895768118.'
            }
          ],
          subtotal: 399,
          discount: 0,
          total: 399,
          paymentMethod: 'Card / Razorpay',
          paymentStatus: 'Paid',
          orderStatus: 'Delivered',
          transactionId: 'RZP-PAY-771928410'
        }
      ];
    } catch {
      return [];
    }
  });

  // 6. Store Config
  const [storeConfig, setStoreConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('digivault_config_v2');
      return saved ? JSON.parse(saved) : initialStoreConfig;
    } catch {
      return initialStoreConfig;
    }
  });

  // 7. Coupons & Offers
  const [coupons, setCoupons] = useState(() => {
    try {
      const saved = localStorage.getItem('digivault_coupons');
      return saved ? JSON.parse(saved) : defaultCoupons;
    } catch {
      return defaultCoupons;
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // 8. Ratings & Customer Reviews
  const [reviews, setReviews] = useState(() => {
    try {
      const saved = localStorage.getItem('digivault_reviews');
      return saved ? JSON.parse(saved) : initialCustomerReviews;
    } catch {
      return initialCustomerReviews;
    }
  });

  // 9. Admin Password & Security
  const [adminPassword, setAdminPassword] = useState(() => {
    try {
      return localStorage.getItem('digivault_admin_pwd') || 'admin123';
    } catch {
      return 'admin123';
    }
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    try {
      return sessionStorage.getItem('digivault_admin_auth') === 'true';
    } catch {
      return false;
    }
  });

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('digivault_subscriptions_v2', JSON.stringify(subscriptions));
  }, [subscriptions]);

  useEffect(() => {
    localStorage.setItem('digivault_reels_bundles', JSON.stringify(reelsBundles));
  }, [reelsBundles]);

  useEffect(() => {
    localStorage.setItem('digivault_digital_products', JSON.stringify(digitalProducts));
  }, [digitalProducts]);

  useEffect(() => {
    localStorage.setItem('digivault_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('digivault_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('digivault_config_v2', JSON.stringify(storeConfig));
  }, [storeConfig]);

  useEffect(() => {
    localStorage.setItem('digivault_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('digivault_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('digivault_admin_pwd', adminPassword);
  }, [adminPassword]);

  // Connect & Sync with Firebase Firestore on Mount
  useEffect(() => {
    try {
      getFirestoreDB();
      fetchOrdersFromFirestore().then((cloudOrders) => {
        if (cloudOrders && Array.isArray(cloudOrders) && cloudOrders.length > 0) {
          setOrders(prev => {
            const map = new Map();
            cloudOrders.forEach(o => map.set(o.orderId, o));
            prev.forEach(o => { if (!map.has(o.orderId)) map.set(o.orderId, o); });
            return Array.from(map.values());
          });
        }
      }).catch(err => console.warn('Firestore initial fetch notice:', err));
    } catch (e) {
      console.warn('Firebase init error:', e);
    }
  }, []);

  // Cart Calculations
  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

  let discountAmount = 0;
  if (appliedCoupon && appliedCoupon.isActive && cartSubtotal >= (appliedCoupon.minAmount || 0)) {
    discountAmount = Math.round((cartSubtotal * appliedCoupon.discountPercent) / 100);
  }
  const finalTotal = Math.max(0, cartSubtotal - discountAmount);

  // Cart Handlers
  const addToCart = (item, openCart = true) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(i => i.id === item.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += (item.quantity || 1);
        return updated;
      }
      return [...prev, { ...item, quantity: item.quantity || 1 }];
    });
    if (openCart) {
      setIsCartOpen(true);
    }
  };

  const removeFromCart = (cartItemId) => {
    setCart(prev => prev.filter(item => item.id !== cartItemId));
  };

  const updateCartQuantity = (cartItemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev => prev.map(item => item.id === cartItemId ? { ...item, quantity: newQty } : item));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Coupon Handlers
  const applyCoupon = (codeStr) => {
    const codeClean = (codeStr || '').trim().toUpperCase();
    const found = coupons.find(c => c.code.toUpperCase() === codeClean && c.isActive);
    if (!found) {
      return { success: false, message: 'Invalid or expired coupon code.' };
    }
    if (cartSubtotal < (found.minAmount || 0)) {
      return { 
        success: false, 
        message: `This coupon requires a minimum cart value of ${storeConfig.currencySymbol}${found.minAmount}.` 
      };
    }
    setAppliedCoupon(found);
    return { success: true, message: `Coupon "${found.code}" applied! ${found.discountPercent}% OFF.` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const addCoupon = (newCoupon) => {
    const id = `coupon-${Date.now()}`;
    const couponObj = { ...newCoupon, id, code: newCoupon.code.trim().toUpperCase() };
    setCoupons(prev => [couponObj, ...prev]);
    return couponObj;
  };

  const updateCoupon = (id, updatedFields) => {
    setCoupons(prev => prev.map(c => c.id === id ? { 
      ...c, 
      ...updatedFields, 
      code: (updatedFields.code || c.code).trim().toUpperCase() 
    } : c));
  };

  const deleteCoupon = (id) => {
    setCoupons(prev => prev.filter(c => c.id !== id));
    if (appliedCoupon && appliedCoupon.id === id) {
      setAppliedCoupon(null);
    }
  };

  // Reviews Handlers
  const addReview = (reviewData) => {
    const id = `rev-${Date.now()}`;
    const newRev = {
      id,
      name: reviewData.name || 'Happy Customer',
      role: reviewData.role || 'Verified Buyer',
      rating: Number(reviewData.rating) || 5,
      title: reviewData.title || 'Excellent Service!',
      comment: reviewData.comment || 'Smooth delivery and high quality.',
      purchasedItem: reviewData.purchasedItem || 'Reels Bundle & Subscription',
      date: reviewData.date || 'Just now',
      verified: reviewData.verified !== undefined ? reviewData.verified : true
    };
    setReviews(prev => [newRev, ...prev]);
    return newRev;
  };

  const updateReview = (id, updatedFields) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, ...updatedFields } : r));
  };

  const deleteReview = (id) => {
    setReviews(prev => prev.filter(r => r.id !== id));
  };

  // Admin Auth Handlers
  const loginAdmin = (enteredPassword) => {
    if (enteredPassword === adminPassword) {
      setIsAdminAuthenticated(true);
      try {
        sessionStorage.setItem('digivault_admin_auth', 'true');
      } catch {}
      return { success: true };
    }
    return { success: false, message: 'Incorrect Admin Password. Please try again.' };
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    try {
      sessionStorage.removeItem('digivault_admin_auth');
    } catch {}
  };

  const changeAdminPassword = (oldPwd, newPwd) => {
    if (oldPwd !== adminPassword) {
      return { success: false, message: 'Current password does not match.' };
    }
    if (!newPwd || newPwd.trim().length < 4) {
      return { success: false, message: 'New password must be at least 4 characters.' };
    }
    setAdminPassword(newPwd.trim());
    localStorage.setItem('digivault_admin_pwd', newPwd.trim());
    return { success: true, message: 'Admin password changed successfully!' };
  };

  // Order Placement
  const placeOrder = ({ customer, paymentMethod, paymentDetails }) => {
    const orderId = 'ORD-' + Math.floor(10000 + Math.random() * 90000);
    const total = finalTotal;

    const deliveredItems = cart.map(item => {
      let downloadLink = item.googleDriveLink || item.downloadUrl || 'https://drive.google.com';
      let credentials = item.deliveryInfo || 'Credentials will be sent to your Gmail & WhatsApp.';
      
      if (item.type === 'subscription') {
        credentials = `Service: ${item.title} (${item.planName || 'Standard'})\nWhatsApp Support: 7895768118\nEmail: ${customer.email}\nStatus: Activation Requested via WhatsApp`;
      }

      return {
        ...item,
        downloadUrl: downloadLink,
        googleDriveLink: downloadLink,
        deliveryInfo: credentials
      };
    });

    const newOrder = {
      orderId,
      date: new Date().toISOString(),
      customer,
      items: deliveredItems,
      subtotal: cartSubtotal,
      discount: discountAmount,
      couponCode: appliedCoupon ? appliedCoupon.code : null,
      total,
      paymentMethod,
      paymentStatus: 'Paid',
      orderStatus: 'Delivered',
      transactionId: paymentDetails?.txnId || 'TXN-' + Date.now().toString(36).toUpperCase()
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    // Sync to Cloud Firestore
    syncOrderToFirestore(newOrder);
    return newOrder;
  };

  // Orders Management
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.orderId === orderId ? { ...o, orderStatus: newStatus } : o));
    updateOrderStatusInFirestore(orderId, newStatus);
  };

  const deleteOrder = (orderId) => {
    setOrders(prev => prev.filter(o => o.orderId !== orderId));
    deleteOrderFromFirestore(orderId);
  };

  const addManualOrder = (orderObj) => {
    setOrders(prev => [orderObj, ...prev]);
    syncOrderToFirestore(orderObj);
  };

  // Admin CRUD for Products
  const addProduct = (categoryType, product) => {
    if (categoryType === 'subscription') {
      setSubscriptions(prev => [product, ...prev]);
    } else if (categoryType === 'reels-bundle') {
      setReelsBundles(prev => [product, ...prev]);
    } else if (categoryType === 'digital-product') {
      setDigitalProducts(prev => [product, ...prev]);
    }
    syncProductToFirestore(categoryType, product);
  };

  const updateProduct = (categoryType, id, updatedFields) => {
    if (categoryType === 'subscription') {
      setSubscriptions(prev => prev.map(p => p.id === id ? { ...p, ...updatedFields } : p));
    } else if (categoryType === 'reels-bundle') {
      setReelsBundles(prev => prev.map(p => p.id === id ? { ...p, ...updatedFields } : p));
    } else if (categoryType === 'digital-product') {
      setDigitalProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedFields } : p));
    }
    syncProductToFirestore(categoryType, { id, ...updatedFields });
  };

  const deleteProduct = (categoryType, id) => {
    if (categoryType === 'subscription') {
      setSubscriptions(prev => prev.filter(p => p.id !== id));
    } else if (categoryType === 'reels-bundle') {
      setReelsBundles(prev => prev.filter(p => p.id !== id));
    } else if (categoryType === 'digital-product') {
      setDigitalProducts(prev => prev.filter(p => p.id !== id));
    }
    deleteProductFromFirestore(id);
  };

  // Backup & Restore
  const exportStoreBackup = () => {
    return JSON.stringify({
      version: '2.0',
      exportedAt: new Date().toISOString(),
      subscriptions,
      reelsBundles,
      digitalProducts,
      orders,
      coupons,
      reviews,
      storeConfig
    }, null, 2);
  };

  const importStoreBackup = (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.subscriptions) setSubscriptions(parsed.subscriptions);
      if (parsed.reelsBundles) setReelsBundles(parsed.reelsBundles);
      if (parsed.digitalProducts) setDigitalProducts(parsed.digitalProducts);
      if (parsed.orders) setOrders(parsed.orders);
      if (parsed.coupons) setCoupons(parsed.coupons);
      if (parsed.reviews) setReviews(parsed.reviews);
      if (parsed.storeConfig) setStoreConfig(parsed.storeConfig);
      return { success: true };
    } catch (err) {
      return { success: false, message: 'Invalid backup JSON file: ' + err.message };
    }
  };

  const resetAllDataToDefault = () => {
    setSubscriptions(initialSubscriptions);
    setReelsBundles(initialBundlesData);
    setDigitalProducts(initialDigitalProducts);
    setStoreConfig(initialStoreConfig);
    setCoupons(defaultCoupons);
    setReviews(initialCustomerReviews);
    setAdminPassword('admin123');
    localStorage.removeItem('digivault_subscriptions_v2');
    localStorage.removeItem('digivault_reels_bundles');
    localStorage.removeItem('digivault_digital_products');
    localStorage.removeItem('digivault_config_v2');
    localStorage.removeItem('digivault_coupons');
    localStorage.removeItem('digivault_reviews');
    localStorage.removeItem('digivault_admin_pwd');
  };

  return (
    <StoreContext.Provider
      value={{
        subscriptions,
        reelsBundles,
        digitalProducts,
        cart,
        isCartOpen,
        setIsCartOpen,
        orders,
        storeConfig,
        setStoreConfig,
        isSearchOpen,
        setIsSearchOpen,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        discountAmount,
        finalTotal,
        coupons,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
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
        placeOrder,
        addProduct,
        updateProduct,
        deleteProduct,
        updateOrderStatus,
        deleteOrder,
        addManualOrder,
        exportStoreBackup,
        importStoreBackup,
        resetAllDataToDefault
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
