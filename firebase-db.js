// ==========================================
// Dizozet Cloud Database (Firebase Firestore)
// ==========================================
(function () {
  'use strict';

  const firebaseConfig = {
    apiKey: "AIzaSyB91A1WjgNidRCCU3zaj2qkuCR6k_vuIwE",
    authDomain: "dizozet-store.firebaseapp.com",
    projectId: "dizozet-store",
    storageBucket: "dizozet-store.firebasestorage.app",
    messagingSenderId: "384307783808",
    appId: "1:384307783808:web:6efe5b075127341596de65"
  };

  let db = null;
  let isFirebaseReady = false;

  try {
    if (typeof firebase !== 'undefined') {
      if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
      }
      db = firebase.firestore();
      isFirebaseReady = true;
      console.log('✅ Firebase Firestore connected successfully for Dizozet.');
    }
  } catch (err) {
    console.warn('Firebase init warning:', err.message);
  }

  window.DizozetDB = {
    isReady: () => isFirebaseReady,

    // ================= PRODUCTS =================
    async getProducts() {
      // 1. Try Firestore
      if (isFirebaseReady && db) {
        try {
          const snapshot = await db.collection('products').get();
          if (!snapshot.empty) {
            const list = [];
            snapshot.forEach(doc => {
              list.push({ id: doc.id, ...doc.data() });
            });
            // Cache locally for instant offline performance
            localStorage.setItem('dizozet_catalog', JSON.stringify(list));
            return list;
          }
        } catch (e) {
          console.warn('Firestore products fetch error:', e.message);
        }
      }

      // 2. Fallback to localStorage
      try {
        const cached = localStorage.getItem('dizozet_catalog');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {}

      // 3. Fallback to default catalog_data.js
      return (typeof PRODUCTS_DATA !== 'undefined') ? PRODUCTS_DATA : [];
    },

    async saveProduct(product) {
      if (!product || !product.id) return false;

      // Update Firestore
      if (isFirebaseReady && db) {
        try {
          await db.collection('products').doc(product.id).set(product, { merge: true });
        } catch (e) {
          console.warn('Firestore product save error:', e.message);
        }
      }

      // Also update local cache
      try {
        const list = JSON.parse(localStorage.getItem('dizozet_catalog') || '[]');
        const idx = list.findIndex(p => p.id === product.id);
        if (idx !== -1) {
          list[idx] = { ...list[idx], ...product };
        } else {
          list.unshift(product);
        }
        localStorage.setItem('dizozet_catalog', JSON.stringify(list));
      } catch (e) {}

      return true;
    },

    async deleteProduct(productId) {
      if (!productId) return false;

      if (isFirebaseReady && db) {
        try {
          await db.collection('products').doc(productId).delete();
        } catch (e) {
          console.warn('Firestore delete error:', e.message);
        }
      }

      try {
        const list = JSON.parse(localStorage.getItem('dizozet_catalog') || '[]');
        const filtered = list.filter(p => p.id !== productId);
        localStorage.setItem('dizozet_catalog', JSON.stringify(filtered));
      } catch (e) {}

      return true;
    },

    // Seed Firestore with original 125 bundles in batches if database is empty
    async seedCatalogIfEmpty() {
      if (!isFirebaseReady || !db || typeof PRODUCTS_DATA === 'undefined') return;
      try {
        const snap = await db.collection('products').limit(1).get();
        if (snap.empty) {
          console.log('Seeding initial 125 bundles to Firebase Firestore...');
          const batchLimit = 400;
          let batch = db.batch();
          let count = 0;

          for (const p of PRODUCTS_DATA) {
            const ref = db.collection('products').doc(p.id);
            batch.set(ref, p);
            count++;
            if (count % batchLimit === 0) {
              await batch.commit();
              batch = db.batch();
            }
          }
          await batch.commit();
          console.log('✅ Successfully seeded bundles to Firestore!');
        }
      } catch (e) {
        console.warn('Seeding notice:', e.message);
      }
    },

    // ================= ORDERS =================
    async recordOrder(order) {
      if (!order || !order.orderId) return false;

      const orderData = {
        ...order,
        timestamp: Date.now(),
        createdAt: new Date().toISOString(),
        status: order.status || 'Paid'
      };

      // 1. Save to Cloud Firestore
      if (isFirebaseReady && db) {
        try {
          await db.collection('orders').doc(order.orderId).set(orderData);
          console.log('✅ Order recorded in Cloud Firestore:', order.orderId);
        } catch (e) {
          console.warn('Firestore order save error:', e.message);
        }
      }

      // 2. Also save to local storage
      try {
        const localOrders = JSON.parse(localStorage.getItem('dizozet_orders') || '[]');
        localOrders.unshift(orderData);
        localStorage.setItem('dizozet_orders', JSON.stringify(localOrders));
      } catch (e) {}

      return true;
    },

    // Realtime Orders Listener for Admin
    listenToOrders(callback) {
      if (isFirebaseReady && db) {
        try {
          return db.collection('orders').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
            const list = [];
            snapshot.forEach(doc => {
              list.push({ id: doc.id, ...doc.data() });
            });
            localStorage.setItem('dizozet_orders', JSON.stringify(list));
            if (callback) callback(list);
          }, err => {
            console.warn('Orders listener error:', err.message);
            // Fallback to local
            const local = JSON.parse(localStorage.getItem('dizozet_orders') || '[]');
            if (callback) callback(local);
          });
        } catch (e) {
          console.warn('Listener setup error:', e.message);
        }
      }

      // Offline fallback
      const local = JSON.parse(localStorage.getItem('dizozet_orders') || '[]');
      if (callback) callback(local);
      return () => {};
    },

    async updateOrderStatus(orderId, status) {
      if (isFirebaseReady && db) {
        try {
          await db.collection('orders').doc(orderId).update({ status });
        } catch (e) {}
      }
      try {
        const local = JSON.parse(localStorage.getItem('dizozet_orders') || '[]');
        const target = local.find(o => o.orderId === orderId);
        if (target) {
          target.status = status;
          localStorage.setItem('dizozet_orders', JSON.stringify(local));
        }
      } catch (e) {}
    },

    async deleteOrder(orderId) {
      if (isFirebaseReady && db) {
        try {
          await db.collection('orders').doc(orderId).delete();
        } catch (e) {}
      }
      try {
        const local = JSON.parse(localStorage.getItem('dizozet_orders') || '[]');
        const filtered = local.filter(o => o.orderId !== orderId);
        localStorage.setItem('dizozet_orders', JSON.stringify(filtered));
      } catch (e) {}
    },

    // ================= COUPONS =================
    async getCoupons() {
      if (isFirebaseReady && db) {
        try {
          const snap = await db.collection('coupons').get();
          if (!snap.empty) {
            const list = [];
            snap.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
            localStorage.setItem('dizozet_coupons', JSON.stringify(list));
            return list;
          }
        } catch (e) {}
      }
      try {
        const cached = localStorage.getItem('dizozet_coupons');
        if (cached) return JSON.parse(cached);
      } catch (e) {}
      return [
        { code: 'DIZO85', discountPercent: 15, active: true },
        { code: 'DIZI85', discountPercent: 15, active: true },
        { code: 'VIRAL85', discountPercent: 15, active: true },
        { code: 'SAVE10', discountPercent: 10, active: true }
      ];
    },

    async saveCoupon(coupon) {
      if (isFirebaseReady && db) {
        try {
          await db.collection('coupons').doc(coupon.code.toUpperCase()).set(coupon, { merge: true });
        } catch (e) {}
      }
      try {
        const list = await this.getCoupons();
        const idx = list.findIndex(c => c.code.toUpperCase() === coupon.code.toUpperCase());
        if (idx !== -1) list[idx] = coupon;
        else list.push(coupon);
        localStorage.setItem('dizozet_coupons', JSON.stringify(list));
      } catch (e) {}
    },

    async deleteCoupon(code) {
      if (isFirebaseReady && db) {
        try {
          await db.collection('coupons').doc(code.toUpperCase()).delete();
        } catch (e) {}
      }
      try {
        const list = await this.getCoupons();
        const filtered = list.filter(c => c.code.toUpperCase() !== code.toUpperCase());
        localStorage.setItem('dizozet_coupons', JSON.stringify(filtered));
      } catch (e) {}
    },

    // ================= STORE SETTINGS =================
    async getSettings() {
      if (isFirebaseReady && db) {
        try {
          const doc = await db.collection('settings').doc('store_config').get();
          if (doc.exists) {
            const data = doc.data();
            localStorage.setItem('dizozet_settings', JSON.stringify(data));
            return data;
          }
        } catch (e) {}
      }
      try {
        const cached = localStorage.getItem('dizozet_settings');
        if (cached) return JSON.parse(cached);
      } catch (e) {}
      return {
        storeName: 'Dizozet',
        whatsapp: '917895768118',
        upi: '7895768118@ptsbi',
        banner: '🔥 FLASH SALE: GET ANY REELS BUNDLE AT ₹59 ONLY | USE CODE: DIZO85',
        adminPass: 'dizozet2026'
      };
    },

    async saveSettings(settings) {
      if (isFirebaseReady && db) {
        try {
          await db.collection('settings').doc('store_config').set(settings, { merge: true });
        } catch (e) {}
      }
      localStorage.setItem('dizozet_settings', JSON.stringify(settings));
    }
  };
})();
