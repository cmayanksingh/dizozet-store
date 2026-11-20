import React, { createContext, useContext, useState, useEffect } from 'react';
import initialBundlesData from '../data/reelsBundles.json';
import { initialSubscriptions } from '../data/subscriptionsData';
import { initialDigitalProducts } from '../data/digitalProductsData';
import { initialStoreConfig } from '../data/storeContent';

const StoreContext = createContext(null);

export const StoreProvider = ({ children }) => {
  // 1. Subscriptions (always fresh with Gemini Advanced)
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

  // 3. Digital Products
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

  // Cart Drawer open state
  const [isCartOpen, setIsCartOpen] = useState(false);

  // 5. Orders
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('digivault_orders');
      if (saved) return JSON.parse(saved);
      return [
        {
          orderId: 'ORD-89214',
          date: new Date(Date.now() - 3600000 * 4).toISOString(),
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
          total: 999,
          paymentMethod: 'UPI / WhatsApp Pay',
          paymentStatus: 'Paid',
          orderStatus: 'Delivered',
          transactionId: 'UPI-TXN-9028340129'
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

  // Global search modal state
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

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

  // Order Placement
  const placeOrder = ({ customer, paymentMethod, paymentDetails }) => {
    const orderId = 'ORD-' + Math.floor(10000 + Math.random() * 90000);
    const total = cartSubtotal;

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
      subtotal: total,
      total,
      paymentMethod,
      paymentStatus: 'Paid',
      orderStatus: 'Delivered',
      transactionId: paymentDetails?.txnId || 'TXN-' + Date.now().toString(36).toUpperCase()
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  // Admin CRUD
  const addProduct = (categoryType, product) => {
    if (categoryType === 'subscription') {
      setSubscriptions(prev => [product, ...prev]);
    } else if (categoryType === 'reels-bundle') {
      setReelsBundles(prev => [product, ...prev]);
    } else if (categoryType === 'digital-product') {
      setDigitalProducts(prev => [product, ...prev]);
    }
  };

  const updateProduct = (categoryType, id, updatedFields) => {
    if (categoryType === 'subscription') {
      setSubscriptions(prev => prev.map(p => p.id === id ? { ...p, ...updatedFields } : p));
    } else if (categoryType === 'reels-bundle') {
      setReelsBundles(prev => prev.map(p => p.id === id ? { ...p, ...updatedFields } : p));
    } else if (categoryType === 'digital-product') {
      setDigitalProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedFields } : p));
    }
  };

  const deleteProduct = (categoryType, id) => {
    if (categoryType === 'subscription') {
      setSubscriptions(prev => prev.filter(p => p.id !== id));
    } else if (categoryType === 'reels-bundle') {
      setReelsBundles(prev => prev.filter(p => p.id !== id));
    } else if (categoryType === 'digital-product') {
      setDigitalProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.orderId === orderId ? { ...o, orderStatus: newStatus } : o));
  };

  const resetAllDataToDefault = () => {
    setSubscriptions(initialSubscriptions);
    setReelsBundles(initialBundlesData);
    setDigitalProducts(initialDigitalProducts);
    setStoreConfig(initialStoreConfig);
    localStorage.removeItem('digivault_subscriptions_v2');
    localStorage.removeItem('digivault_reels_bundles');
    localStorage.removeItem('digivault_digital_products');
    localStorage.removeItem('digivault_config_v2');
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
        placeOrder,
        addProduct,
        updateProduct,
        deleteProduct,
        updateOrderStatus,
        resetAllDataToDefault
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
