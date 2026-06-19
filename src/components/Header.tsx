import React, { useState, useEffect } from 'react';
import { ArrowLeft, Home, ShoppingBag, User } from 'lucide-react';
import { Screen } from '../types';

interface HeaderProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  cartCount: number;
  onOpenCart: () => void;
}

export default function Header({ currentScreen, onNavigate, cartCount, onOpenCart }: HeaderProps) {
  const isProductPage = currentScreen === 'pdp';
  const isCheckoutPage = currentScreen === 'checkout';
  const isSuccessPage = currentScreen === 'success';

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine dynamic contrast themes depending on scroll state & current screen
  const isHomeFirstFold = currentScreen === 'home' && !scrolled;
  const headerBgClass = isHomeFirstFold 
    ? 'bg-black/15 backdrop-blur-[6px] border-transparent' 
    : 'bg-white/90 backdrop-blur-2xl backdrop-saturate-[180%] border-b border-[#E5E5E5]/50 shadow-sm';
  
  const textIconClass = isHomeFirstFold 
    ? 'text-white hover:text-white/80' 
    : 'text-[#111111] hover:opacity-75';

  return (
    <header className={`fixed top-0 left-0 w-full h-[52px] z-50 flex items-center justify-between px-4 pl-3 pr-3 flex-shrink-0 transition-all duration-500 ease-out ${headerBgClass}`}>
      
      {/* Left Back/Home Button */}
      <div className="flex items-center justify-start z-10">
        {currentScreen !== 'home' ? (
          <button 
            id="back-button"
            onClick={() => {
              if (isSuccessPage) {
                onNavigate('home');
              } else if (isCheckoutPage) {
                onNavigate('plp');
              } else if (isProductPage) {
                onNavigate('plp');
              } else {
                onNavigate('home');
              }
            }}
            aria-label="Go back"
            className={`transition-all active:scale-95 cursor-pointer p-1 ${textIconClass}`}
          >
            <ArrowLeft size={18} strokeWidth={2} />
          </button>
        ) : (
          <button 
            id="home-icon"
            onClick={() => onNavigate('home')}
            aria-label="Home"
            className={`transition-all active:scale-95 cursor-pointer p-1 ${textIconClass}`}
          >
            <Home size={18} strokeWidth={2} />
          </button>
        )}
      </div>

      {/* Centered Brand Title */}
      <h1 
        id="app-branding"
        onClick={() => onNavigate('home')}
        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-[16px] md:text-[18px] font-bold tracking-tighter cursor-pointer select-none whitespace-nowrap z-0 pt-0.5 transition-all duration-500 ease-out ${
          isHomeFirstFold ? 'text-white tracking-[0.05em] scale-102' : 'text-[#111111] tracking-tighter scale-100'
        }`}
      >
        DYLAN'S PALACE
      </h1>

      {/* Right Header Controls */}
      <div className="flex items-center justify-end gap-2 z-10">
        {!isSuccessPage && (
          <>
            <button 
              id="profile-toggle-btn"
              onClick={() => onNavigate('profile')}
              aria-label="Profile"
              className={`relative transition-all active:scale-95 cursor-pointer flex items-center justify-center p-1.5 ${textIconClass}`}
            >
              <User size={18} strokeWidth={2} />
            </button>
            <button 
              id="cart-toggle-btn"
              onClick={onOpenCart}
              aria-label="Shopping Bag"
              className={`relative transition-all active:scale-95 cursor-pointer flex items-center justify-center p-1.5 ${textIconClass}`}
            >
              <ShoppingBag size={18} strokeWidth={2} />
              {cartCount > 0 && (
                <span 
                  id="cart-badge"
                  className={`absolute top-0 right-0 text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full animate-pulse transition-colors duration-500 ${
                    isHomeFirstFold ? 'bg-white text-black' : 'bg-[#4A5D23] text-white'
                  }`}
                >
                  {cartCount}
                </span>
              )}
            </button>
          </>
        )}
      </div>
    </header>
  );
}
