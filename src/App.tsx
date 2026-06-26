import React, { lazy, Suspense, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Screen, Product, Category, CheckoutDetails } from './types';
import { PRODUCTS } from './api/products';
import { useCart } from './hooks/useCart';
import { useWishlist } from './hooks/useWishlist';
import { useOrders } from './hooks/useOrders';
import { countCartUnits } from './utils/format';
import { triggerHaptic } from './utils/haptic';
import Header from './components/common/Header';
import BottomNav from './components/common/BottomNav';
import { CartDrawer } from './components/ui';

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

export default function App() {
  const [screen, setScreen] = useState<Screen>('splash');
  const [category, setCategory] = useState<Category>('SHIRTS');
  const [selectedProduct, setSelectedProduct] = useState<Product>(PRODUCTS[0]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [lastOrder, setLastOrder] = useState<CheckoutDetails | null>(null);

  const { cartItems, addToBag, updateQty, removeItem, clearCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();
  const { pastOrders, addOrder } = useOrders();

  const navigate = useCallback((target: Screen) => {
    setScreen(target);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const handleSelectProduct = useCallback((product: Product) => {
    setSelectedProduct(product);
  }, []);

  const handleAddtoBag = useCallback((product: Product, size: string) => {
    addToBag(product, size);
    setTimeout(() => setIsCartOpen(true), 450);
  }, [addToBag]);

  const handleOrderComplete = useCallback((details: CheckoutDetails) => {
    triggerHaptic('heavy');
    setLastOrder(details);
    addOrder(details, cartItems);
    clearCart();
    setScreen('success');
  }, [addOrder, cartItems, clearCart]);

  const totalCartUnits = countCartUnits(cartItems);

  if (screen === 'splash') {
    return (
      <Suspense fallback={<ScreenLoader />}>
        <Splash onComplete={() => setScreen('home')} />
      </Suspense>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-[#F9F9F8] text-[#111111] antialiased">
      <Header
        currentScreen={screen}
        onNavigate={navigate}
        cartCount={totalCartUnits}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <main className={`flex-grow pb-[80px] ${screen === 'home' ? 'pt-0' : 'pt-[52px]'}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={screen}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full"
          >
            <Suspense fallback={<ScreenLoader />}>
              {screen === 'home' && (
                <HomeScreen
                  onNavigate={navigate}
                  onSelectCategory={setCategory}
                />
              )}

              {screen === 'plp' && (
                <ProductListScreen
                  currentCategory={category}
                  onSelectCategory={setCategory}
                  onSelectProduct={handleSelectProduct}
                  onNavigate={navigate}
                />
              )}

              {screen === 'pdp' && (
                <ProductDetailScreen
                  product={selectedProduct}
                  wishlist={wishlist}
                  onToggleWishlist={toggleWishlist}
                  onAddtoBag={handleAddtoBag}
                  onSelectProduct={handleSelectProduct}
                />
              )}

              {screen === 'checkout' && (
                <CheckoutScreen
                  cartItems={cartItems}
                  onOrderComplete={handleOrderComplete}
                  onNavigate={navigate}
                />
              )}

              {screen === 'success' && (
                <SuccessScreen
                  orderDetails={lastOrder as any}
                  onContinueShopping={() => navigate('home')}
                />
              )}

              {screen === 'profile' && (
                <ProfileScreen
                  pastOrders={pastOrders}
                  wishlist={wishlist.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean) as Product[]}
                  onSelectProduct={handleSelectProduct}
                />
              )}
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQty={updateQty}
        onRemoveItem={removeItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          navigate('checkout');
        }}
      />

      {screen !== 'success' && screen !== 'checkout' && (
        <BottomNav
          currentScreen={screen}
          currentCategory={category}
          onSelectCategory={setCategory}
          onNavigate={navigate}
        />
      )}
    </div>
  );
}
