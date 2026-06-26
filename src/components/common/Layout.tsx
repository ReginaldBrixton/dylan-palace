import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import BottomNav from './BottomNav';
import { CartDrawer } from '../ui';
import { useApp } from '../../context/AppContext';

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    isCartOpen,
    setIsCartOpen,
    cartItems,
    updateQty,
    removeItem,
    totalCartUnits,
  } = useApp();

  const isSplash = location.pathname === '/splash';
  const isSellerRoute = location.pathname.startsWith('/seller');
  const isCheckout = location.pathname === '/checkout';
  const isSuccess = location.pathname === '/success';

  if (isSplash || isSellerRoute) {
    return <>{children}</>;
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-[#F9F9F8] text-[#111111] antialiased">
      <Header
        cartCount={totalCartUnits}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <main className={`flex-grow pb-[120px] ${location.pathname === '/' ? 'pt-0' : 'pt-[52px]'}`}>
        {children}
      </main>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQty={updateQty}
        onRemoveItem={removeItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          navigate('/checkout');
        }}
      />

      {!isCheckout && !isSuccess && <BottomNav />}
    </div>
  );
}
