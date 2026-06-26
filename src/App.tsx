import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/common/Layout';

// Code-split screen components for smaller initial bundle
const Splash = lazy(() => import('./components/screens/Splash'));
const HomeScreen = lazy(() => import('./components/screens/HomeScreen'));
const ProductListScreen = lazy(() => import('./components/screens/ProductListScreen'));
const ProductDetailScreen = lazy(() => import('./components/screens/ProductDetailScreen'));
const CheckoutScreen = lazy(() => import('./components/screens/CheckoutScreen'));
const SuccessScreen = lazy(() => import('./components/screens/SuccessScreen'));
const ProfileScreen = lazy(() => import('./components/screens/ProfileScreen'));

function ScreenLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] w-full">
      <div className="w-8 h-8 border-2 border-[#E5E5E5] border-t-[#111111] rounded-full animate-spin" />
    </div>
  );
}

function SplashRoute() {
  const navigate = useNavigate();
  return <Splash onComplete={() => navigate('/home')} />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Layout>
          <Suspense fallback={<ScreenLoader />}>
            <Routes>
              <Route path="/" element={<SplashRoute />} />
              <Route path="/home" element={<HomeScreen />} />
              <Route path="/shirts" element={<ProductListScreen />} />
              <Route path="/trousers" element={<ProductListScreen />} />
              <Route path="/bags" element={<ProductListScreen />} />
              <Route path="/shoes" element={<ProductListScreen />} />
              <Route path="/product/:id" element={<ProductDetailScreen />} />
              <Route path="/checkout" element={<CheckoutScreen />} />
              <Route path="/success" element={<SuccessScreen />} />
              <Route path="/profile" element={<ProfileScreen />} />
              <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
          </Suspense>
        </Layout>
      </AppProvider>
    </BrowserRouter>
  );
}
