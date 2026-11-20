import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import SearchModal from './components/SearchModal';
import WhatsAppButton from './components/WhatsAppButton';

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

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <ScrollToTop />
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
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </main>

          <Footer />

          {/* Interactive Global Elements */}
          <CartDrawer />
          <SearchModal />
          <WhatsAppButton />
        </div>
      </BrowserRouter>
    </StoreProvider>
  );
}
