import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import SearchModal from './components/SearchModal';
import WhatsAppButton from './components/WhatsAppButton';
import RecentSalesToast from './components/RecentSalesToast';
import Gta6PromoModal from './components/Gta6PromoModal';

import HomePage from './pages/HomePage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import ReelsBundlesPage from './pages/ReelsBundlesPage';
import DigitalProductsPage from './pages/DigitalProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import MyOrdersPage from './pages/MyOrdersPage';
import AdminDashboard from './pages/AdminDashboard';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppContent() {
  const { pathname } = useLocation();
  const isAdminRoute = pathname.startsWith('/admin');

  // If in Admin Portal, render clean dedicated full-screen page WITHOUT storefront header/footer/widgets
  if (isAdminRoute) {
    return (
      <main className="min-h-screen">
        <Routes>
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>
    );
  }

  // Customer Storefront Layout
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-slate-800">
      <Navbar />
      
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/subscriptions" element={<SubscriptionsPage />} />
          <Route path="/reels-bundles" element={<ReelsBundlesPage />} />
          <Route path="/digital-products" element={<DigitalProductsPage />} />
          <Route path="/product/:type/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
          <Route path="/orders" element={<MyOrdersPage />} />
        </Routes>
      </main>

      <Footer />

      {/* Interactive Global Elements */}
      <CartDrawer />
      <SearchModal />
      <WhatsAppButton />
      <RecentSalesToast />
      <Gta6PromoModal />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <ScrollToTop />
        <AppContent />
      </BrowserRouter>
    </StoreProvider>
  );
}
