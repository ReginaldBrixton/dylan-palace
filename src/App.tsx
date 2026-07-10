import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { AppProvider } from './context/AppContext';
import { SellerAuthProvider } from './context/SellerAuthContext';
import Layout from './components/common/Layout';
import ProtectedRoute from './components/seller/ProtectedRoute';
import PageSkeleton from './components/common/PageSkeleton';

const Splash = lazy(() => import('./pages/SplashPage'));
const HomePage = lazy(() => import('./pages/HomePage'));
const ProductListPage = lazy(() => import('./pages/ProductListPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const SuccessPage = lazy(() => import('./pages/SuccessPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const SellerLoginPage = lazy(() => import('./pages/seller/SellerLoginPage'));
const SellerDashboardPage = lazy(() => import('./pages/seller/SellerDashboardPage'));
const SellerProductsPage = lazy(() => import('./pages/seller/SellerProductsPage'));
const SellerInventoryPage = lazy(() => import('./pages/seller/SellerInventoryPage'));
const SellerOrdersPage = lazy(() => import('./pages/seller/SellerOrdersPage'));
const SellerUsersPage = lazy(() => import('./pages/seller/SellerUsersPage'));
const SellerSettingsPage = lazy(() => import('./pages/seller/SellerSettingsPage'));

function Protected({ children }: { children: React.ReactNode }) { return <ProtectedRoute>{children}</ProtectedRoute>; }
function SplashRoute() { const navigate = useNavigate(); return <Splash onComplete={() => navigate('/')} />; }
function ScrollToTop() { const { pathname } = useLocation(); useEffect(() => { window.scrollTo(0, 0); }, [pathname]); return null; }
const pageVariants = { initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -6 } };

function AnimatedRoutes() {
  const location = useLocation();
  return <AnimatePresence mode="wait"><motion.div key={location.pathname} variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2 }} className="w-full"><ScrollToTop/><Routes location={location}>
    <Route path="/" element={<HomePage/>}/><Route path="/splash" element={<SplashRoute/>}/>
    <Route path="/shirts" element={<ProductListPage/>}/><Route path="/trousers" element={<ProductListPage/>}/><Route path="/bags" element={<ProductListPage/>}/><Route path="/shoes" element={<ProductListPage/>}/>
    <Route path="/product/:id" element={<ProductDetailPage/>}/><Route path="/checkout" element={<CheckoutPage/>}/><Route path="/success" element={<SuccessPage/>}/><Route path="/profile" element={<ProfilePage/>}/>
    <Route path="/seller/login" element={<SellerLoginPage/>}/>
    <Route path="/seller" element={<Protected><SellerDashboardPage/></Protected>}/>
    <Route path="/seller/products" element={<Protected><SellerProductsPage/></Protected>}/>
    <Route path="/seller/inventory" element={<Protected><SellerInventoryPage/></Protected>}/>
    <Route path="/seller/orders" element={<Protected><SellerOrdersPage/></Protected>}/>
    <Route path="/seller/users" element={<Protected><SellerUsersPage/></Protected>}/>
    <Route path="/seller/settings" element={<Protected><SellerSettingsPage/></Protected>}/>
    <Route path="*" element={<Navigate to="/" replace/>}/>
  </Routes></motion.div></AnimatePresence>;
}

export default function App() { return <BrowserRouter><SellerAuthProvider><AppProvider><Layout><Suspense fallback={<PageSkeleton/>}><AnimatedRoutes/></Suspense></Layout></AppProvider></SellerAuthProvider></BrowserRouter>; }
