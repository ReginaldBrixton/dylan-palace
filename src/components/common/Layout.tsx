import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CartDrawer } from '../ui';
import { useApp } from '../../context/AppContext';
import StorefrontHeader from '../storefront/StorefrontHeader';
import MobileNavigation from '../storefront/MobileNavigation';
import SiteFooter from '../storefront/SiteFooter';

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
  const isHomePage = location.pathname === '/';
  const showMobileNavigation = !isCheckout && !isSuccess;
  const showFooter = !isCheckout && !isSuccess;

  if (isSplash || isSellerRoute) return <>{children}</>;

  return (
    <div className="relative flex min-h-screen flex-col bg-[var(--color-canvas)] text-[var(--color-ink)] antialiased">
      <StorefrontHeader cartCount={totalCartUnits} onOpenCart={() => setIsCartOpen(true)} />

      <main className={`min-w-0 flex-1 ${isHomePage ? 'pt-0' : 'pt-[var(--header-mobile)] lg:pt-[var(--header-desktop)]'} ${showMobileNavigation ? 'pb-[68px] lg:pb-0' : ''}`}>
        {children}
      </main>

      {showFooter ? <SiteFooter /> : null}

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

      {showMobileNavigation ? <MobileNavigation cartCount={totalCartUnits} onOpenCart={() => setIsCartOpen(true)} /> : null}
    </div>
  );
}
