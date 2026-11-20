// ==========================================
// Dizozet Firebase Firestore Cloud Service
// ==========================================

export const firebaseConfig = {
  apiKey: "AIzaSyB91A1WjgNidRCCU3zaj2qkuCR6k_vuIwE",
  authDomain: "dizozet-store.firebaseapp.com",
  projectId: "dizozet-store",
  storageBucket: "dizozet-store.firebasestorage.app",
  messagingSenderId: "384307783808",
  appId: "1:384307783808:web:6efe5b075127341596de65"
};

let dbInstance = null;

export function getFirestoreDB() {
  if (dbInstance) return dbInstance;
  try {
    if (typeof window !== 'undefined' && window.firebase) {
      if (!window.firebase.apps || !window.firebase.apps.length) {
        window.firebase.initializeApp(firebaseConfig);
      }
      dbInstance = window.firebase.firestore();
      console.log('✅ Firebase Firestore connected for Dizozet Cloud.');
      return dbInstance;
    }
  } catch (err) {
    console.warn('Firebase init warning:', err.message);
  }
  return null;
}

// ------------------------------------------
// ORDERS SYNC
// ------------------------------------------
export async function syncOrderToFirestore(order) {
  const db = getFirestoreDB();
  if (!db || !order || !order.orderId) return;
  try {
    const payload = {
      ...order,
      timestamp: Date.now(),
      syncedAt: new Date().toISOString()
    };
    await db.collection('orders').doc(order.orderId).set(payload, { merge: true });
    console.log(`✅ Order ${order.orderId} synced to Firebase Firestore.`);
  } catch (e) {
    console.warn('Firestore sync order error:', e.message);
  }
}

export async function fetchOrdersFromFirestore() {
  const db = getFirestoreDB();
  if (!db) return null;
  try {
    const snapshot = await db.collection('orders').orderBy('timestamp', 'desc').limit(100).get();
    if (!snapshot.empty) {
      const list = [];
      snapshot.forEach(doc => {
        list.push({ id: doc.id, ...doc.data() });
      });
      return list;
    }
  } catch (e) {
    console.warn('Firestore fetch orders error:', e.message);
  }
  return null;
}

export async function updateOrderStatusInFirestore(orderId, status) {
  const db = getFirestoreDB();
  if (!db || !orderId) return;
  try {
    await db.collection('orders').doc(orderId).update({ orderStatus: status });
  } catch (e) {
    console.warn('Firestore update order status error:', e.message);
  }
}

export async function deleteOrderFromFirestore(orderId) {
  const db = getFirestoreDB();
  if (!db || !orderId) return;
  try {
    await db.collection('orders').doc(orderId).delete();
  } catch (e) {
    console.warn('Firestore delete order error:', e.message);
  }
}

// ------------------------------------------
// PRODUCTS & BUNDLES SYNC
// ------------------------------------------
export async function syncProductToFirestore(categoryType, product) {
  const db = getFirestoreDB();
  if (!db || !product || !product.id) return;
  try {
    await db.collection('products').doc(product.id).set({
      ...product,
      categoryType,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    console.log(`✅ Product ${product.id} synced to Firestore Cloud.`);
  } catch (e) {
    console.warn('Firestore product save error:', e.message);
  }
}

export async function fetchProductsFromFirestore() {
  const db = getFirestoreDB();
  if (!db) return null;
  try {
    const snapshot = await db.collection('products').get();
    if (!snapshot.empty) {
      const list = [];
      snapshot.forEach(doc => {
        list.push({ id: doc.id, ...doc.data() });
      });
      return list;
    }
  } catch (e) {
    console.warn('Firestore fetch products error:', e.message);
  }
  return null;
}

export async function deleteProductFromFirestore(productId) {
  const db = getFirestoreDB();
  if (!db || !productId) return;
  try {
    await db.collection('products').doc(productId).delete();
  } catch (e) {
    console.warn('Firestore delete product error:', e.message);
  }
}

// ------------------------------------------
// SETTINGS SYNC
// ------------------------------------------
export async function syncSettingsToFirestore(settings) {
  const db = getFirestoreDB();
  if (!db || !settings) return;
  try {
    const toSave = { ...settings, updatedAt: new Date().toISOString() };
    // CRITICAL: Protect telegram credentials - never overwrite non-empty credentials with empty strings
    if (!toSave.telegramBotToken || typeof toSave.telegramBotToken !== 'string' || !toSave.telegramBotToken.trim()) {
      delete toSave.telegramBotToken;
    }
    if (!toSave.telegramChatId || !String(toSave.telegramChatId).trim()) {
      delete toSave.telegramChatId;
    }
    // Protect admin password - never overwrite existing password with empty string
    if (!toSave.adminPass || typeof toSave.adminPass !== 'string' || !toSave.adminPass.trim()) {
      delete toSave.adminPass;
    }
    await db.collection('settings').doc('store_config').set(toSave, { merge: true });
    console.log('✅ Store settings synced to Firebase Firestore.');
  } catch (e) {
    console.warn('Firestore settings sync error:', e.message);
  }
}

export async function fetchSettingsFromFirestore() {
  const db = getFirestoreDB();
  if (!db) return null;
  try {
    const doc = await db.collection('settings').doc('store_config').get();
    if (doc.exists) {
      return doc.data();
    }
  } catch (e) {
    console.warn('Firestore fetch settings error:', e.message);
  }
  return null;
}

// ------------------------------------------
// COUPONS SYNC
// ------------------------------------------
export async function syncCouponToFirestore(coupon) {
  const db = getFirestoreDB();
  if (!db || !coupon || !coupon.code) return;
  try {
    await db.collection('coupons').doc(coupon.code.toUpperCase()).set(coupon, { merge: true });
  } catch (e) {
    console.warn('Firestore coupon sync error:', e.message);
  }
}

export async function deleteCouponFromFirestore(code) {
  const db = getFirestoreDB();
  if (!db || !code) return;
  try {
    await db.collection('coupons').doc(code.toUpperCase()).delete();
  } catch (e) {
    console.warn('Firestore delete coupon error:', e.message);
  }
}
