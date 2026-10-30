// Dizozet Application Logic
(function () {
  'use strict';

  // --- State ---
  const state = {
    cart: [], // { product, license: 'personal'|'reseller', price, quantity }
    orderBumpAdded: false,
    couponApplied: null,
    discountAmount: 0,
    selectedCategory: 'All',
    searchQuery: '',
    activeTab: 'home', // 'home' | 'shop' | 'reels' | 'orders' | 'about' | 'contact' | 'refund'
    selectedPlan: 'personal', // 'personal' | 'reseller'
    previewProduct: null,
    detailProduct: null,
    isCartOpen: false,
    isCheckoutOpen: false,
    orderCompleted: null,
    visibleProductsLimit: 16
  };

  // Dynamic Catalog, Settings & Coupons Loader
  function getCatalog() {
    try {
      const stored = localStorage.getItem('dizozet_catalog');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          if (typeof PRODUCTS_DATA !== 'undefined') {
            parsed.forEach(p => {
              const base = PRODUCTS_DATA.find(b => b.id === p.id);
              if (base && base.googleDriveLink && (!p.googleDriveLink || p.googleDriveLink.length < 5)) {
                p.googleDriveLink = base.googleDriveLink;
              }
            });
          }
          return parsed;
        }
      }
    } catch (e) {}
    return (typeof PRODUCTS_DATA !== 'undefined') ? PRODUCTS_DATA : [];
  }

  function getStoreSettings() {
    try {
      const stored = localStorage.getItem('dizozet_settings');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return {
      storeName: 'Dizozet',
      whatsapp: '917895768118',
      upi: '7895768118@ptsbi',
      banner: '🔥 FLASH SALE: GET ANY REELS BUNDLE AT ₹59 ONLY | USE CODE: DIZO85'
    };
  }

  function getCoupons() {
    try {
      const stored = localStorage.getItem('dizozet_coupons');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return [
      { code: 'DIZO85', discountPercent: 15, active: true },
      { code: 'DIZI85', discountPercent: 15, active: true },
      { code: 'VIRAL85', discountPercent: 15, active: true },
      { code: 'SAVE10', discountPercent: 10, active: true }
    ];
  }


  // Load cart from localStorage (with backwards compatibility)
  try {
    const savedCart = localStorage.getItem('dizozet_cart') || localStorage.getItem('viralbox_cart');
    if (savedCart) {
      state.cart = JSON.parse(savedCart);
    }
  } catch (e) {}

  function saveCart() {
    try {
      localStorage.setItem('dizozet_cart', JSON.stringify(state.cart));
    } catch (e) {}
    updateCartUI();
  }

  // --- Toast Notifications ---
  function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'fixed bottom-24 right-4 sm:bottom-8 sm:right-8 z-[9999] flex flex-col gap-2 pointer-events-none';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'pointer-events-auto transform transition-all duration-300 translate-y-2 opacity-0 flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#0f172a] text-white shadow-2xl border border-purple-500/30 text-xs sm:text-sm font-bold';
    toast.innerHTML = `
      <div class="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg>
      </div>
      <span>${message}</span>
    `;
    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-2', 'opacity-0');
    });

    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-2');
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  // --- Cart Operations ---
  function addToCart(productId, license = 'personal') {
    const product = getCatalog().find(p => p.id === productId);
    if (!product) return;

    const price = license === 'reseller' ? product.resellerPrice : product.personalPrice;
    const existing = state.cart.find(item => item.product.id === productId && item.license === license);

    if (existing) {
      existing.quantity += 1;
    } else {
      state.cart.push({
        product,
        license,
        price,
        quantity: 1
      });
    }

    saveCart();
    showToast(`Added "${product.title.slice(0, 32)}..." to cart!`);
  }

  function removeFromCart(productId, license) {
    state.cart = state.cart.filter(item => !(item.product.id === productId && item.license === license));
    saveCart();
  }

  function updateItemQty(productId, license, delta) {
    const item = state.cart.find(item => item.product.id === productId && item.license === license);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) {
      removeFromCart(productId, license);
    } else {
      saveCart();
    }
  }

  function buyNow(productId, license = 'personal') {
    addToCart(productId, license);
    openCart();
  }

  function buyPlan(planId) {
    const plan = PLANS_DATA.find(p => p.id === planId) || PLANS_DATA[0];
    const pseudoProduct = {
      id: plan.id,
      slug: plan.id,
      title: plan.name,
      shortDescription: plan.subtitle,
      category: "All Access Pass",
      reelCount: 222000,
      personalPrice: plan.price,
      personalOriginalPrice: plan.originalPrice,
      resellerPrice: plan.price,
      resellerOriginalPrice: plan.originalPrice,
      thumbnail: "images/3200-ultimate-twisted-world-reel-bundle-reels-bundle-1-2-768x576.png",
      format: "Google Drive Cloud"
    };

    const existing = state.cart.find(item => item.product.id === plan.id);
    if (!existing) {
      state.cart.push({
        product: pseudoProduct,
        license: plan.licenseType,
        price: plan.price,
        quantity: 1
      });
    }
    saveCart();
    openCheckout();
  }

  // --- Cart Calculations ---
  function getCartSubtotal() {
    let subtotal = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (state.orderBumpAdded) {
      subtotal += BUMP_SPECIAL.discountPrice;
    }
    return subtotal;
  }

  function getCartTotal() {
    const subtotal = getCartSubtotal();
    let discount = 0;
    if (state.couponApplied) {
      const activeCoupons = getCoupons();
      const matched = activeCoupons.find(c => c.active && c.code.toUpperCase() === state.couponApplied.toUpperCase());
      const pct = matched ? matched.discountPercent : 15;
      discount = Math.round(subtotal * (pct / 100));
    }
    state.discountAmount = discount;
    return Math.max(0, subtotal - discount);
  }

  function getTotalItemsCount() {
    let count = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    if (state.orderBumpAdded) count += 1;
    return count;
  }

  // --- Update UI ---
  function updateCartUI() {
    const totalCount = getTotalItemsCount();
    
    // Header cart badges
    document.querySelectorAll('.cart-badge-count').forEach(el => {
      el.textContent = totalCount;
      if (totalCount > 0) {
        el.classList.remove('hidden');
      } else {
        el.classList.add('hidden');
      }
    });

    renderCartDrawerItems();
  }

  function renderCartDrawerItems() {
    const container = document.getElementById('cart-items-container');
    const emptyState = document.getElementById('cart-empty-state');
    const footerContainer = document.getElementById('cart-footer-container');
    if (!container) return;

    if (state.cart.length === 0 && !state.orderBumpAdded) {
      if (emptyState) emptyState.classList.remove('hidden');
      if (footerContainer) footerContainer.classList.add('hidden');
      container.innerHTML = '';
      return;
    }

    if (emptyState) emptyState.classList.add('hidden');
    if (footerContainer) footerContainer.classList.remove('hidden');

    let html = '';
    state.cart.forEach(item => {
      const p = item.product;
      const thumb = p.localThumbnail || p.thumbnail || 'images/dizozet-logo.png';
      html += `
        <div class="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#eee8f8] shadow-xs flex items-center gap-3 relative group">
          <img src="${thumb}" alt="${p.title}" class="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0 bg-slate-100" onerror="this.src='images/dizozet-logo.png'"/>
          <div class="flex-1 min-w-0">
            <h4 class="text-xs sm:text-[13px] font-extrabold text-[#162048] line-clamp-2 leading-snug">${p.title}</h4>
            <div class="flex items-center gap-2 mt-1">
              <span class="text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${item.license === 'reseller' ? 'bg-amber-100 text-amber-900 border border-amber-200' : 'bg-purple-50 text-[#7c3aed]'}">${item.license === 'reseller' ? 'Reseller Rights' : 'Personal'}</span>
              <span class="text-[11px] font-semibold text-slate-400">${p.reelCount || '1000+'}+ Reels</span>
            </div>
            <div class="flex items-center justify-between mt-2.5">
              <div class="flex items-center gap-1.5 border border-slate-200 rounded-lg px-2 py-0.5">
                <button type="button" class="text-slate-400 hover:text-slate-800 text-sm font-black px-1" onclick="window.Dizozet.updateItemQty('${p.id}', '${item.license}', -1)">-</button>
                <span class="text-xs font-bold text-slate-700 min-w-[14px] text-center">${item.quantity}</span>
                <button type="button" class="text-slate-400 hover:text-slate-800 text-sm font-black px-1" onclick="window.Dizozet.updateItemQty('${p.id}', '${item.license}', 1)">+</button>
              </div>
              <span class="font-black text-sm text-[#162048]">₹${item.price * item.quantity}.00</span>
            </div>
          </div>
          <button type="button" aria-label="Remove item" class="absolute top-2.5 right-2.5 text-slate-300 hover:text-rose-500 transition-colors p-1" onclick="window.Dizozet.removeFromCart('${p.id}', '${item.license}')">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>
      `;
    });

    container.innerHTML = html;

    // Update Bump box in cart
    const bumpCheckbox = document.getElementById('cart-bump-checkbox');
    if (bumpCheckbox) {
      bumpCheckbox.checked = state.orderBumpAdded;
    }

    // Update Totals
    const subtotalEl = document.getElementById('cart-subtotal');
    const discountEl = document.getElementById('cart-discount');
    const discountRow = document.getElementById('cart-discount-row');
    const totalEl = document.getElementById('cart-total');

    if (subtotalEl) subtotalEl.textContent = `₹${getCartSubtotal()}.00`;
    if (totalEl) totalEl.textContent = `₹${getCartTotal()}.00`;
    
    if (state.discountAmount > 0) {
      if (discountRow) discountRow.classList.remove('hidden');
      if (discountEl) discountEl.textContent = `-₹${state.discountAmount}.00`;
    } else {
      if (discountRow) discountRow.classList.add('hidden');
    }
  }

  // --- Modals & Drawers ---
  function openCart() {
    state.isCartOpen = true;
    const drawer = document.getElementById('cart-drawer');
    const backdrop = document.getElementById('cart-backdrop');
    if (drawer && backdrop) {
      backdrop.classList.remove('hidden');
      setTimeout(() => {
        backdrop.classList.remove('opacity-0');
        drawer.classList.remove('translate-x-full');
      }, 10);
    }
    updateCartUI();
  }

  function closeCart() {
    state.isCartOpen = false;
    const drawer = document.getElementById('cart-drawer');
    const backdrop = document.getElementById('cart-backdrop');
    if (drawer && backdrop) {
      drawer.classList.add('translate-x-full');
      backdrop.classList.add('opacity-0');
      setTimeout(() => {
        backdrop.classList.add('hidden');
      }, 300);
    }
  }

  function openCheckout() {
    closeCart();
    state.isCheckoutOpen = true;
    const modal = document.getElementById('checkout-modal');
    if (!modal) return;
    
    // Calculate total
    const total = getCartTotal();
    const checkoutTotalEl = document.getElementById('checkout-total-btn');
    if (checkoutTotalEl) checkoutTotalEl.textContent = `Pay ₹${total}.00`;

    // Render items list inside checkout
    const checkoutSummaryEl = document.getElementById('checkout-summary-list');
    if (checkoutSummaryEl) {
      let itemsHtml = '';
      state.cart.forEach(item => {
        itemsHtml += `
          <div class="flex items-center justify-between text-xs py-1.5 border-b border-slate-100 last:border-0">
            <div class="flex items-center gap-2 truncate max-w-[220px]">
              <span class="w-1.5 h-1.5 rounded-full bg-[#7c3aed]"></span>
              <span class="font-bold text-slate-800 truncate">${item.product.title}</span>
              <span class="text-slate-400">×${item.quantity}</span>
            </div>
            <span class="font-extrabold text-slate-900 shrink-0">₹${item.price * item.quantity}</span>
          </div>
        `;
      });
      if (state.orderBumpAdded) {
        itemsHtml += `
          <div class="flex items-center justify-between text-xs py-1.5 border-b border-slate-100 last:border-0 text-amber-800 font-bold">
            <span class="truncate max-w-[220px]">🎁 ${BUMP_SPECIAL.title}</span>
            <span>₹${BUMP_SPECIAL.discountPrice}</span>
          </div>
        `;
      }
      checkoutSummaryEl.innerHTML = itemsHtml;
    }

    modal.classList.remove('hidden');
    requestAnimationFrame(() => modal.classList.remove('opacity-0'));
  }

  function closeCheckout() {
    state.isCheckoutOpen = false;
    const modal = document.getElementById('checkout-modal');
    if (modal) {
      modal.classList.add('opacity-0');
      setTimeout(() => modal.classList.add('hidden'), 300);
    }
  }

  async function processPayment(e) {
    if (e) e.preventDefault();
    const nameInput = document.getElementById('checkout-name');
    const emailInput = document.getElementById('checkout-email');
    const phoneInput = document.getElementById('checkout-phone');

    const name = nameInput ? nameInput.value.trim() : 'Customer';
    const email = emailInput ? emailInput.value.trim() : 'customer@example.com';
    const phone = phoneInput ? phoneInput.value.trim() : '9876543210';

    if (!name || !email || !phone) {
      alert('Please fill in your name, email, and WhatsApp number.');
      return;
    }

    const payBtn = document.getElementById('pay-submit-btn');
    const originalBtnText = payBtn ? payBtn.innerHTML : '';
    if (payBtn) {
      payBtn.disabled = true;
      payBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Opening Cashfree Gateway...
      `;
    }

    const totalPaid = getCartTotal();
    const purchasedItems = [...state.cart];
    const bumpIncluded = state.orderBumpAdded;

    try {
      // 1. Create order on Cashfree via Vercel serverless API
      const resp = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: totalPaid,
          name,
          email,
          phone,
          items: purchasedItems.map(i => ({ id: i.product.id, title: i.product.title, price: i.price, license: i.license }))
        })
      });

      const orderData = await resp.json();

      if (!orderData.success || !orderData.payment_session_id) {
        throw new Error(orderData.error || 'Could not initiate payment session');
      }

      // 2. Open Cashfree JS Checkout Modal
      if (typeof Cashfree !== 'undefined') {
        const cashfree = Cashfree({ mode: "production" });
        
        cashfree.checkout({
          paymentSessionId: orderData.payment_session_id,
          redirectTarget: "_modal"
        }).then(async (result) => {
          if (result.error) {
            console.warn('Cashfree payment dismissed or error:', result.error);
            if (payBtn) {
              payBtn.disabled = false;
              payBtn.innerHTML = originalBtnText;
            }
            return;
          }

          // Verify order status
          await handlePaymentSuccess(orderData.order_id, name, email, phone, totalPaid, purchasedItems, bumpIncluded);
        });
      } else {
        window.location.href = `https://api.cashfree.com/pg/orders/${orderData.order_id}`;
      }

    } catch (err) {
      console.error('Payment error:', err);
      alert('Payment Error: ' + err.message);
      if (payBtn) {
        payBtn.disabled = false;
        payBtn.innerHTML = originalBtnText;
      }
    }
  }

  async function handlePaymentSuccess(orderId, name, email, phone, totalPaid, purchasedItems, bumpIncluded) {
    state.orderCompleted = {
      orderId,
      name,
      email,
      phone,
      items: purchasedItems || [...state.cart],
      bump: bumpIncluded,
      total: totalPaid,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    // Save order to dizozet_orders for Admin Portal
    try {
      const existingOrders = JSON.parse(localStorage.getItem('dizozet_orders') || '[]');
      existingOrders.unshift({
        ...state.orderCompleted,
        timestamp: Date.now(),
        status: 'Paid'
      });
      localStorage.setItem('dizozet_orders', JSON.stringify(existingOrders));
    } catch (e) {}

    // Record in Firebase Cloud Firestore
    if (window.DizozetDB && window.DizozetDB.recordOrder) {
      window.DizozetDB.recordOrder(state.orderCompleted);
    }

    // Clear Cart
    state.cart = [];
    state.orderBumpAdded = false;
    saveCart();

    // Show Success Modal
    closeCheckout();
    openSuccessModal(state.orderCompleted);
  }

  function openSuccessModal(order) {
    const modal = document.getElementById('success-modal');
    if (!modal) return;

    document.getElementById('success-order-id').textContent = order.orderId;
    document.getElementById('success-email').textContent = order.email;
    document.getElementById('success-total').textContent = `₹${order.total}.00`;

    // Dynamic Google Drive Link
    const driveBtn = modal.querySelector('a[href*="drive.google"]');
    const storeSettings = getStoreSettings();
    let driveLink = storeSettings.masterDriveLink || 'https://drive.google.com';
    if (order.items && order.items.length > 0) {
      const itemWithDrive = order.items.find(i => i.product && i.product.googleDriveLink && i.product.googleDriveLink.trim().length > 5);
      if (itemWithDrive) {
        driveLink = itemWithDrive.product.googleDriveLink.trim();
      }
    }
    if (driveBtn) {
      driveBtn.href = driveLink;
    }

    modal.classList.remove('hidden');
    requestAnimationFrame(() => modal.classList.remove('opacity-0'));
  }

  function closeSuccessModal() {
    const modal = document.getElementById('success-modal');
    if (modal) {
      modal.classList.add('opacity-0');
      setTimeout(() => modal.classList.add('hidden'), 300);
    }
  }

  // Handle return redirect from Cashfree (e.g. UPI apps / Mobile)
  async function checkRedirectPayment() {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('order_id');
    if (orderId && orderId.startsWith('DZ_')) {
      try {
        const resp = await fetch('/api/verify-order?order_id=' + encodeURIComponent(orderId));
        const data = await resp.json();
        if (data && data.order_status === 'PAID') {
          window.history.replaceState({}, document.title, window.location.pathname);
          const customer = data.customer_details || {};
          handlePaymentSuccess(
            orderId,
            customer.customer_name || 'Customer',
            customer.customer_email || '',
            customer.customer_phone || '',
            data.order_amount || 59,
            [],
            false
          );
        }
      } catch (e) {
        console.warn('Redirect verify error:', e);
      }
    }
  }

  // --- Reel Video Preview Modal ---
  function openReelPreview(productId) {
    const p = getCatalog().find(x => x.id === productId) || getCatalog()[0];
    state.previewProduct = p;

    const modal = document.getElementById('reel-preview-modal');
    const video = document.getElementById('reel-preview-video');
    const titleEl = document.getElementById('reel-preview-title');
    const priceEl = document.getElementById('reel-preview-price');
    const buyBtn = document.getElementById('reel-preview-buy-btn');

    if (!modal || !video) return;

    video.src = p.previewVideoUrl || 'https://reelsbundlepro.com/wp-content/uploads/2026/04/250-Baby-Food-Eating-Food-Ai-Reels-1.mp4';
    if (titleEl) titleEl.textContent = p.title;
    if (priceEl) priceEl.textContent = `₹${p.personalPrice}.00`;
    if (buyBtn) {
      buyBtn.onclick = () => {
        closeReelPreview();
        buyNow(p.id, 'personal');
      };
    }

    modal.classList.remove('hidden');
    requestAnimationFrame(() => modal.classList.remove('opacity-0'));
    video.play().catch(() => {});
  }

  function closeReelPreview() {
    const modal = document.getElementById('reel-preview-modal');
    const video = document.getElementById('reel-preview-video');
    if (video) {
      video.pause();
      video.src = '';
    }
    if (modal) {
      modal.classList.add('opacity-0');
      setTimeout(() => modal.classList.add('hidden'), 300);
    }
  }

  // --- Product Detail Modal ---
  function openProductDetail(productId) {
    const p = getCatalog().find(x => x.id === productId);
    if (!p) return;
    state.detailProduct = p;

    const modal = document.getElementById('product-detail-modal');
    if (!modal) return;

    const thumb = p.localThumbnail || p.thumbnail || 'images/dizozet-logo.png';
    document.getElementById('detail-modal-img').src = thumb;
    document.getElementById('detail-modal-title').textContent = p.title;
    document.getElementById('detail-modal-desc').textContent = p.shortDescription || '';
    document.getElementById('detail-modal-category').textContent = p.category;
    document.getElementById('detail-modal-reels').textContent = `${p.reelCount || 1000}+ High Quality Reels`;
    document.getElementById('detail-modal-rating').textContent = `${p.rating || 4.9} ★ (${p.reviewCount || 200}+ reviews)`;
    
    // Prices
    document.getElementById('detail-personal-price').textContent = `₹${p.personalPrice}.00`;
    document.getElementById('detail-personal-reg').textContent = `₹${p.personalOriginalPrice}.00`;
    document.getElementById('detail-reseller-price').textContent = `₹${p.resellerPrice}.00`;
    document.getElementById('detail-reseller-reg').textContent = `₹${p.resellerOriginalPrice}.00`;

    // Features
    const featuresList = document.getElementById('detail-modal-features');
    if (featuresList && p.features) {
      featuresList.innerHTML = p.features.map(f => `
        <li class="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <svg class="w-4 h-4 text-emerald-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          <span>${f}</span>
        </li>
      `).join('');
    }

    // Set buttons
    document.getElementById('detail-add-cart-btn').onclick = () => {
      const license = document.querySelector('input[name="detail-license"]:checked')?.value || 'personal';
      addToCart(p.id, license);
    };

    document.getElementById('detail-buy-now-btn').onclick = () => {
      const license = document.querySelector('input[name="detail-license"]:checked')?.value || 'personal';
      closeProductDetail();
      buyNow(p.id, license);
    };

    modal.classList.remove('hidden');
    requestAnimationFrame(() => modal.classList.remove('opacity-0'));
  }

  function closeProductDetail() {
    const modal = document.getElementById('product-detail-modal');
    if (modal) {
      modal.classList.add('opacity-0');
      setTimeout(() => modal.classList.add('hidden'), 300);
    }
  }

  // --- Rendering Catalog Grids ---
  function createProductCardHTML(p) {
    const thumb = p.localThumbnail || p.thumbnail || 'images/dizozet-logo.png';
    const discount = Math.round(((p.personalOriginalPrice - p.personalPrice) / p.personalOriginalPrice) * 100);

    return `
      <div class="bg-white rounded-2xl sm:rounded-[24px] border border-[#eee8f8] shadow-[0_2px_12px_rgba(40,20,80,0.03)] hover:shadow-[0_14px_32px_rgba(108,60,240,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden group">
        <div class="relative aspect-[4/3] overflow-hidden bg-slate-900 block cursor-pointer" onclick="window.Dizozet.openProductDetail('${p.id}')">
          <img src="${thumb}" alt="${p.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" onerror="this.src='images/dizozet-logo.png'"/>
          
          ${p.isHot ? `
            <div class="absolute top-0 right-0 overflow-hidden w-24 h-24 pointer-events-none">
              <div class="absolute transform rotate-45 bg-gradient-to-r from-red-700 to-rose-700 text-white font-black text-[9px] py-1 right-[-32px] top-[18px] w-[120px] text-center shadow-md flex items-center justify-center gap-1">
                <span>🔥</span><span>HOT</span>
              </div>
            </div>
          ` : p.isTrending ? `
            <div class="absolute top-0 right-0 overflow-hidden w-24 h-24 pointer-events-none">
              <div class="absolute transform rotate-45 bg-gradient-to-r from-purple-700 to-indigo-700 text-white font-black text-[9px] py-1 right-[-32px] top-[18px] w-[120px] text-center shadow-md flex items-center justify-center gap-1">
                <span>⚡</span><span>TRENDING</span>
              </div>
            </div>
          ` : ''}

          <div class="absolute top-2.5 left-2.5 flex items-center gap-1">
            <button type="button" aria-label="Play video preview" class="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-[#7c3aed] transition-colors" onclick="event.stopPropagation(); window.Dizozet.openReelPreview('${p.id}')">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3"/></svg>
            </button>
          </div>

          <span class="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-black bg-black/80 text-white backdrop-blur-md border border-white/20 flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>1080P</span>
          </span>
        </div>

        <div class="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-3">
          <div class="space-y-1.5">
            <h3 class="font-extrabold text-xs sm:text-[14px] text-[#162048] hover:text-[#6d36e8] transition-colors line-clamp-2 leading-snug cursor-pointer" onclick="window.Dizozet.openProductDetail('${p.id}')">
              ${p.title}
            </h3>
            <div class="flex items-center gap-1.5 pt-0.5 flex-wrap">
              <span class="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-[#e6fbfb] text-[#065f5b]">${p.reelCount || '1000+'}+ Reels</span>
              <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#f1f2f6] text-[#334155] flex items-center gap-1">
                <svg class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18M3 7.5h4M3 12h18M3 16.5h4M17 3v18"/></svg>
                <span>MP4</span>
              </span>
            </div>
          </div>

          <div class="pt-2 border-t border-slate-100 space-y-2.5">
            <div class="flex items-baseline justify-between">
              <div class="flex items-baseline gap-1.5">
                <span class="text-[11px] sm:text-xs text-[#525b7a] line-through font-semibold">₹${p.personalOriginalPrice}.00</span>
                <span class="text-base sm:text-xl font-black text-[#162048]">₹${p.personalPrice}.00</span>
              </div>
              <span class="px-1.5 sm:px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-extrabold bg-[#e8fbf3] text-[#065f46]">${discount}% OFF</span>
            </div>

            <div class="grid grid-cols-2 gap-1.5 sm:gap-2">
              <button type="button" class="py-2 px-1.5 sm:px-2 rounded-xl bg-[#f5f1fd] hover:bg-[#ece4fc] text-[#6533e4] font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1 sm:gap-1.5 transition-colors" onclick="window.Dizozet.addToCart('${p.id}', 'personal')">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                <span>Add</span>
              </button>
              <button type="button" class="py-2 px-1.5 sm:px-2 rounded-xl bg-[#6533e4] hover:bg-[#5326c9] text-white font-extrabold text-[11px] sm:text-xs flex items-center justify-center gap-1 shadow-md shadow-purple-500/20" onclick="window.Dizozet.buyNow('${p.id}', 'personal')">
                <span>Buy Now</span>
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderTrendingCarousel() {
    const container = document.getElementById('trending-carousel-container');
    if (!container) return;

    // Filter trending or top products
    let trending = getCatalog().filter(p => p.isHot || p.isTrending);
    if (trending.length < 8) {
      trending = getCatalog().slice(0, 10);
    }

    container.innerHTML = trending.map(p => {
      const thumb = p.localThumbnail || p.thumbnail || 'images/dizozet-logo.png';
      const discount = Math.round(((p.personalOriginalPrice - p.personalPrice) / p.personalOriginalPrice) * 100);
      return `
        <div class="w-72 sm:w-[305px] bg-white rounded-[24px] border border-[#eee8f8] shadow-[0_4px_18px_rgba(40,20,80,0.03)] hover:shadow-[0_14px_32px_rgba(108,60,240,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden group shrink-0">
          <div class="relative aspect-[4/3] overflow-hidden bg-slate-900 block cursor-pointer" onclick="window.Dizozet.openProductDetail('${p.id}')">
            <img src="${thumb}" alt="${p.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" onerror="this.src='images/dizozet-logo.png'"/>
            <div class="absolute top-0 right-0 overflow-hidden w-24 h-24 pointer-events-none">
              <div class="absolute transform rotate-45 bg-gradient-to-r from-red-700 to-rose-700 text-white font-black text-[9px] py-1 right-[-32px] top-[18px] w-[120px] text-center shadow-md flex items-center justify-center gap-1">
                <span>🔥</span><span>HOT</span>
              </div>
            </div>
            <span class="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md text-[10px] font-black bg-black/85 text-white border border-white/20">1080P</span>
            <button type="button" aria-label="Preview" class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30" onclick="event.stopPropagation(); window.Dizozet.openReelPreview('${p.id}')">
              <span class="w-12 h-12 rounded-full bg-white/95 text-[#6533e4] shadow-xl flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform">
                <svg class="w-5 h-5 ml-0.5 fill-[#6533e4]" viewBox="0 0 24 24"><polygon points="6 3 20 12 6 21 6 3"/></svg>
              </span>
            </button>
          </div>

          <div class="p-4 flex-1 flex flex-col justify-between space-y-3.5">
            <div class="space-y-2">
              <h3 class="font-extrabold text-[14px] text-[#162048] hover:text-[#6d36e8] transition-colors line-clamp-2 leading-snug cursor-pointer" onclick="window.Dizozet.openProductDetail('${p.id}')">
                ${p.title}
              </h3>
              <div class="flex items-center gap-2 pt-0.5">
                <span class="px-2.5 py-0.5 rounded-md text-[11px] font-extrabold bg-[#e6fbfb] text-[#065f5b]">${p.reelCount || '1000+'}+ Reels</span>
                <span class="px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#f1f2f6] text-[#334155] flex items-center gap-1">
                  <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18M3 7.5h4M3 12h18M3 16.5h4M17 3v18"/></svg>
                  <span>MP4</span>
                </span>
              </div>
            </div>

            <div class="pt-2 border-t border-slate-100 space-y-2.5">
              <div class="flex items-baseline justify-between">
                <div class="flex items-baseline gap-2">
                  <span class="text-xs text-[#525b7a] line-through font-semibold">₹${p.personalOriginalPrice}.00</span>
                  <span class="text-xl font-black text-[#162048]">₹${p.personalPrice}.00</span>
                </div>
                <span class="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-[#e8fbf3] text-[#065f46]">${discount}% OFF</span>
              </div>

              <div class="grid grid-cols-2 gap-2">
                <button type="button" class="py-2.5 px-2 rounded-xl bg-[#f5f1fd] hover:bg-[#ece4fc] text-[#6533e4] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors" onclick="window.Dizozet.addToCart('${p.id}', 'personal')">
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                  <span>Add to Cart</span>
                </button>
                <button type="button" class="py-2.5 px-2 rounded-xl bg-[#6533e4] hover:bg-[#5326c9] text-white font-extrabold text-xs flex items-center justify-center gap-1 shadow-md shadow-purple-500/20" onclick="window.Dizozet.buyNow('${p.id}', 'personal')">
                  <span>Buy Now</span>
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderFreshGrid() {
    const container = document.getElementById('fresh-grid-container');
    if (!container) return;

    let filtered = getCatalog();

    // Filter by Category
    if (state.selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === state.selectedCategory || (p.tags && p.tags.includes(state.selectedCategory)));
    }

    // Filter by Search
    if (state.searchQuery.trim()) {
      const q = state.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q) || 
        (p.shortDescription && p.shortDescription.toLowerCase().includes(q))
      );
    }

    const visibleItems = filtered.slice(0, state.visibleProductsLimit);
    container.innerHTML = visibleItems.map(p => createProductCardHTML(p)).join('');

    // Load More Button visibility
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) {
      if (state.visibleProductsLimit >= filtered.length) {
        loadMoreBtn.classList.add('hidden');
      } else {
        loadMoreBtn.classList.remove('hidden');
        loadMoreBtn.textContent = `Load More (${filtered.length - state.visibleProductsLimit} remaining)`;
      }
    }
  }

  function renderPreviewFeedSection() {
    const container = document.getElementById('reels-preview-feed');
    if (!container) return;

    // 6 sample videos with real MP4 previews
    const previewItems = getCatalog().filter(p => p.previewVideoUrl).slice(0, 6);
    container.innerHTML = previewItems.map((p, idx) => `
      <div class="w-[240px] sm:w-[280px] shrink-0 rounded-[28px] overflow-hidden bg-slate-900 border border-slate-800 shadow-xl relative aspect-[9/16] group">
        <video src="${p.previewVideoUrl}" class="w-full h-full object-cover" loop muted playsinline autoplay></video>
        <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-between p-4 text-white">
          <div class="flex items-center justify-between">
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/20 backdrop-blur-md">Sample #${idx + 1}</span>
            <button type="button" aria-label="Toggle mute" class="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white" onclick="const v = this.closest('.group').querySelector('video'); v.muted = !v.muted; this.innerHTML = v.muted ? '🔇' : '🔊'">
              🔇
            </button>
          </div>

          <div class="space-y-2">
            <h4 class="font-extrabold text-xs sm:text-sm text-white line-clamp-2 leading-tight">${p.title}</h4>
            <div class="flex items-center justify-between pt-1">
              <span class="text-xs font-black text-cyan-300">₹${p.personalPrice}.00</span>
              <button type="button" class="py-1.5 px-3 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] text-white font-extrabold text-[11px] hover:opacity-95 shadow-md" onclick="window.Dizozet.buyNow('${p.id}', 'personal')">
                Get Pack
              </button>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  // --- Category Tabs ---
  function selectCategory(catName) {
    state.selectedCategory = catName;
    document.querySelectorAll('.cat-pill-btn').forEach(btn => {
      if (btn.getAttribute('data-cat') === catName) {
        btn.className = 'cat-pill-btn px-4 py-2 rounded-full text-xs font-black transition-all bg-[#6533e4] text-white shadow-md shadow-purple-500/20 shrink-0';
      } else {
        btn.className = 'cat-pill-btn px-4 py-2 rounded-full text-xs font-bold transition-all bg-white text-[#4a5270] hover:bg-[#f5f1fd] hover:text-[#6533e4] border border-[#ede7fa] shrink-0';
      }
    });
    renderFreshGrid();
  }

  // --- Plan Toggle ---
  function togglePlan(type) {
    state.selectedPlan = type;
    const personalBtn = document.getElementById('plan-tab-personal');
    const resellerBtn = document.getElementById('plan-tab-reseller');
    const plan = PLANS_DATA.find(p => p.licenseType === type) || PLANS_DATA[0];

    if (type === 'personal') {
      personalBtn.className = 'py-2.5 px-4 rounded-[14px] text-left transition-all bg-white shadow-[0_2px_10px_rgba(124,58,237,0.1)] border border-slate-200/90';
      resellerBtn.className = 'py-2.5 px-4 rounded-[14px] text-left transition-all flex items-start justify-between gap-2 hover:bg-white/50 border border-transparent';
    } else {
      resellerBtn.className = 'py-2.5 px-4 rounded-[14px] text-left transition-all bg-white shadow-[0_2px_10px_rgba(6,182,212,0.1)] border border-slate-200/90 flex items-start justify-between gap-2';
      personalBtn.className = 'py-2.5 px-4 rounded-[14px] text-left transition-all hover:bg-white/50 border border-transparent';
    }

    // Update Plan card elements
    document.getElementById('plan-card-badge').textContent = plan.badge;
    document.getElementById('plan-card-title').textContent = plan.name;
    document.getElementById('plan-card-desc').textContent = plan.subtitle;
    document.getElementById('plan-card-price').textContent = `₹${plan.price}`;
    document.getElementById('plan-card-orig').textContent = `₹${plan.originalPrice}`;
    document.getElementById('plan-card-discount').textContent = `${plan.discountPercentage}% OFF`;
    document.getElementById('plan-card-cta-text').textContent = type === 'personal' ? 'Get Personal Access' : 'Get Reseller Access';

    const featuresList = document.getElementById('plan-card-features');
    if (featuresList) {
      featuresList.innerHTML = plan.features.map(f => `
        <div class="py-2.5 flex items-center gap-3 first:pt-1 last:pb-1">
          <div class="w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${type === 'reseller' ? 'bg-cyan-100 text-cyan-600' : 'bg-violet-100 text-[#7c3aed]'}">
            <svg class="w-3 h-3 stroke-[3]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <span class="text-xs sm:text-[13px] font-bold text-slate-700">${f}</span>
        </div>
      `).join('');
    }
  }

  // --- FAQs Toggle ---
  function toggleFaq(index) {
    const content = document.getElementById(`faq-content-${index}`);
    const icon = document.getElementById(`faq-icon-${index}`);
    if (!content) return;

    const isOpen = !content.classList.contains('hidden');
    if (isOpen) {
      content.classList.add('hidden');
      if (icon) icon.classList.remove('rotate-180');
    } else {
      content.classList.remove('hidden');
      if (icon) icon.classList.add('rotate-180');
    }
  }

  // --- Navigation Router ---
  function navigateTo(tab) {
    state.activeTab = tab;

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Hide all view pages
    document.querySelectorAll('.view-page').forEach(page => {
      page.classList.add('hidden');
    });

    // Show active view
    const target = document.getElementById(`view-${tab}`);
    if (target) {
      target.classList.remove('hidden');
    } else {
      // default to home view
      document.getElementById('view-home')?.classList.remove('hidden');
    }

    // Update Desktop Nav link styles
    document.querySelectorAll('.desktop-nav-link').forEach(link => {
      const linkTab = link.getAttribute('data-tab');
      if (linkTab === tab) {
        link.className = 'desktop-nav-link text-[15px] font-bold transition-all relative py-1 text-[#162048]';
        if (!link.querySelector('.nav-underline')) {
          link.innerHTML += '<span class="nav-underline absolute -bottom-1 left-0 right-0 h-[3px] bg-gradient-to-r from-[#6b39ff] to-[#ff4fb3] rounded-full"></span>';
        }
      } else {
        link.className = 'desktop-nav-link text-[15px] font-bold transition-all relative py-1 text-[#3c4666] hover:text-[#162048]';
        link.querySelector('.nav-underline')?.remove();
      }
    });

    // Update Mobile Bottom Bar active state
    document.querySelectorAll('.mobile-nav-btn').forEach(btn => {
      const btnTab = btn.getAttribute('data-tab');
      if (btnTab === tab) {
        btn.className = 'mobile-nav-btn relative flex flex-col items-center justify-center py-1 px-1 rounded-[14px] transition-all bg-gradient-to-br from-[#ede9fe] to-[#e0f2fe] text-[#7c3aed] font-extrabold';
        if (!btn.querySelector('.mobile-active-bar')) {
          btn.insertAdjacentHTML('afterbegin', '<span class="mobile-active-bar absolute -top-[5px] left-1/2 -translate-x-1/2 w-6 h-[3px] rounded-full bg-gradient-to-r from-[#7c3aed] to-[#06b6d4]"></span>');
        }
      } else {
        btn.className = 'mobile-nav-btn relative flex flex-col items-center justify-center py-1 px-1 rounded-[14px] transition-all text-slate-500 hover:text-[#7c3aed] font-bold';
        btn.querySelector('.mobile-active-bar')?.remove();
      }
    });
  }

  
  // Apply Live Store Settings & Customizations (Banner, WhatsApp, Hero, Plans)
  function applyStoreCustomizations(settings) {
    if (!settings) settings = getStoreSettings();

    // 1. Top Announcement Bar
    if (settings.banner) {
      const bannerEl = document.getElementById('announcement-banner-text');
      if (bannerEl) {
        bannerEl.innerHTML = settings.banner;
      }
    }

    // 2. WhatsApp Number across all buttons and links
    if (settings.whatsapp) {
      const cleanPhone = settings.whatsapp.replace(/\D/g, '');
      const waLinks = document.querySelectorAll('a[href*="wa.me"], a.site-whatsapp-link');
      waLinks.forEach(link => {
        const currentHref = link.getAttribute('href') || '';
        // If it had custom prefilled text, preserve text param
        const textParam = currentHref.includes('text=') ? currentHref.substring(currentHref.indexOf('text=')) : '';
        const newHref = 'https://wa.me/' + cleanPhone + (textParam ? '?' + textParam : '');
        link.setAttribute('href', newHref);
      });
      // Also update text if displayed
      const waTextEl = document.getElementById('header-wa-text');
      if (waTextEl) {
        waTextEl.textContent = 'WhatsApp: +' + cleanPhone;
      }
    }

    // 3. Hero Section Headline & Subtitle
    if (settings.heroTitle) {
      const heroTitleEl = document.getElementById('hero-main-title');
      if (heroTitleEl) heroTitleEl.innerHTML = settings.heroTitle;
    }
    if (settings.heroSubtitle) {
      const heroSubEl = document.getElementById('hero-main-subtitle');
      if (heroSubEl) heroSubEl.textContent = settings.heroSubtitle;
    }
    if (settings.heroBadge) {
      const heroBadgeEl = document.getElementById('hero-badge-text');
      if (heroBadgeEl) heroBadgeEl.textContent = settings.heroBadge;
    }

    // 4. All-Access Plans Pricing
    if (settings.personalPlanPrice && typeof PLANS_DATA !== 'undefined' && PLANS_DATA[0]) {
      PLANS_DATA[0].price = Number(settings.personalPlanPrice);
      if (settings.personalPlanOrig) PLANS_DATA[0].originalPrice = Number(settings.personalPlanOrig);
    }
    if (settings.resellerPlanPrice && typeof PLANS_DATA !== 'undefined' && PLANS_DATA[1]) {
      PLANS_DATA[1].price = Number(settings.resellerPlanPrice);
      if (settings.resellerPlanOrig) PLANS_DATA[1].originalPrice = Number(settings.resellerPlanOrig);
    }
    togglePlan(state.selectedPlan || 'personal');

    // 5. Order Bump Special
    if (settings.bumpPrice && typeof BUMP_SPECIAL !== 'undefined') {
      BUMP_SPECIAL.discountPrice = Number(settings.bumpPrice);
      if (settings.bumpTitle) BUMP_SPECIAL.title = settings.bumpTitle;
      const bumpPriceEl = document.getElementById('cart-bump-price');
      if (bumpPriceEl) bumpPriceEl.textContent = '₹' + BUMP_SPECIAL.discountPrice;
    }
  }

  // Load Cloud Data (Firestore) asynchronously for all visitors
  async function loadCloudData() {
    try {
      if (window.DizozetDB) {
        // Fetch Cloud Settings
        if (window.DizozetDB.getSettings) {
          const cloudSettings = await window.DizozetDB.getSettings();
          if (cloudSettings) {
            localStorage.setItem('dizozet_settings', JSON.stringify(cloudSettings));
            applyStoreCustomizations(cloudSettings);
          }
        }

        // Fetch Cloud Products
        if (window.DizozetDB.getProducts) {
          const cloudProducts = await window.DizozetDB.getProducts();
          if (cloudProducts && Array.isArray(cloudProducts) && cloudProducts.length > 0) {
            localStorage.setItem('dizozet_catalog', JSON.stringify(cloudProducts));
            renderTrendingCarousel();
            renderFreshGrid();
          }
        }
      }
    } catch (e) {
      console.warn('Cloud sync note:', e.message);
    }
  }

  // --- Initialize App ---
  function init() {
    applyStoreCustomizations();
    renderTrendingCarousel();
    renderFreshGrid();
    loadCloudData();
    renderPreviewFeedSection();
    updateCartUI();

    // Search inputs
    const searchInputs = document.querySelectorAll('.site-search-input');
    searchInputs.forEach(input => {
      input.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        renderFreshGrid();
        // If not on home or shop, go to shop
        if (state.activeTab !== 'home' && state.activeTab !== 'shop') {
          navigateTo('shop');
        }
      });
    });

    // Order Bump Checkbox
    const bumpBox = document.getElementById('cart-bump-checkbox');
    if (bumpBox) {
      bumpBox.addEventListener('change', (e) => {
        state.orderBumpAdded = e.target.checked;
        saveCart();
      });
    }

    // Coupon Apply
    const couponBtn = document.getElementById('apply-coupon-btn');
    const couponInput = document.getElementById('coupon-code-input');
    if (couponBtn && couponInput) {
      couponBtn.addEventListener('click', () => {
        const code = couponInput.value.trim().toUpperCase();
        if (code === 'DIZO85' || code === 'DIZI85' || code === 'VIRAL85' || code === 'SAVE10') {
          state.couponApplied = code;
          showToast(`Coupon "${code}" applied successfully!`);
          updateCartUI();
        } else {
          alert('Invalid coupon code. Try "DIZO85" for 15% discount!');
        }
      });
    }

    // Load More Button
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', () => {
        state.visibleProductsLimit += 16;
        renderFreshGrid();
      });
    }

    // Check Cashfree return redirect
    checkRedirectPayment();

    // Checkout form submit
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
      checkoutForm.addEventListener('submit', processPayment);
    }
  }

  // Expose global methods
  window.Dizozet = {
    state,
    state,
    addToCart,
    removeFromCart,
    updateItemQty,
    buyNow,
    buyPlan,
    openCart,
    closeCart,
    openCheckout,
    closeCheckout,
    closeSuccessModal,
    openReelPreview,
    closeReelPreview,
    openProductDetail,
    closeProductDetail,
    selectCategory,
    togglePlan,
    toggleFaq,
    navigateTo
  };

  // Backwards compatibility alias
  window.Dizistore = window.Dizozet;
  window.ViralBox = window.Dizozet;

  // Run on DOM loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
