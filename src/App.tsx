import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { AppProvider } from './context/AppContext';
import { SellerAuthProvider } from './context/SellerAuthContext';
import Layout from './components/common/Layout';
import ProtectedRoute from './components/seller/ProtectedRoute';
import PageSkeleton from './components/common/PageSkeleton';

// Code-split screen components for smaller initial bundle
const Splash = lazy(() => import('./pages/SplashPage'));
const HomeScreen = lazy(() => import('./pages/HomePage'));
const ProductListScreen = lazy(() => import('./pages/ProductListPage'));
const ProductDetailScreen = lazy(() => import('./pages/ProductDetailPage'));
const CheckoutScreen = lazy(() => import('./pages/CheckoutPage'));
const SuccessScreen = lazy(() => import('./pages/SuccessPage'));
const ProfileScreen = lazy(() => import('./pages/ProfilePage'));

// Seller pages
const SellerLogin = lazy(() => import('./pages/seller/SellerLoginPage'));
const SellerDashboard = lazy(() => import('./pages/seller/SellerDashboardPage'));
const SellerProducts = lazy(() => import('./pages/seller/SellerProductsPage'));
const SellerOrders = lazy(() => import('./pages/seller/SellerOrdersPage'));
const SellerUsers = lazy(() => import('./pages/seller/SellerUsersPage'));

function SplashRoute() {
  const navigate = useNavigate();
  return <Splash onComplete={() => navigate('/')} />;
}

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

const pageTransition = { duration: 0.25, ease: [0.22, 1, 0.36, 1] as const };

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={pageTransition}
        className="w-full"
      >
        <ScrollToTop />
        <Routes location={location}>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/splash" element={<SplashRoute />} />
          <Route path="/shirts" element={<ProductListScreen />} />
          <Route path="/trousers" element={<ProductListScreen />} />
          <Route path="/bags" element={<ProductListScreen />} />
          <Route path="/shoes" element={<ProductListScreen />} />
          <Route path="/product/:id" element={<ProductDetailScreen />} />
          <Route path="/checkout" element={<CheckoutScreen />} />
          <Route path="/success" element={<SuccessScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
          {/* Seller routes */}
          <Route path="/seller/login" element={<SellerLogin />} />
          <Route path="/seller" element={<ProtectedRoute><SellerDashboard /></ProtectedRoute>} />
          <Route path="/seller/products" element={<ProtectedRoute><SellerProducts /></ProtectedRoute>} />
          <Route path="/seller/orders" element={<ProtectedRoute><SellerOrders /></ProtectedRoute>} />
          <Route path="/seller/users" element={<ProtectedRoute><SellerUsers /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <SellerAuthProvider>
        <AppProvider>
          <Layout>
            <Suspense fallback={<PageSkeleton />}>
              <AnimatedRoutes />
            </Suspense>
          </Layout>
        </AppProvider>
      </SellerAuthProvider>
    </BrowserRouter>
  );
}
