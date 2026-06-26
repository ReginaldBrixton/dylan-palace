import React, { useEffect } from 'react';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { CartItem } from '../../types';
import { CURRENCY } from '../../constants';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQty: (cartItemId: string, change: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onProceedToCheckout: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onProceedToCheckout
}: CartDrawerProps) {
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const totalItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden select-none">
      {/* Background dark modal overlay backdrop with blur */}
      <div
        id="cart-backdrop"
        onClick={onClose}
        className="absolute inset-0 bg-[#111111]/45 backdrop-blur-xs transition-opacity animate-fade-in"
      />

      {/* Cart Container bottom-sheet sheet */}
      <div
        id="cart-bottom-sheet"
        className="absolute bottom-0 inset-x-0 h-[75vh] sm:h-[80vh] w-full flex flex-col bg-white/70 backdrop-blur-2xl backdrop-saturate-[180%] border-t border-[#E5E5E5]/50 transition-transform duration-300 transform translate-y-0 rounded-t-[24px]"
      >

        {/* Grab Handle */}
        <div className="w-full flex justify-center pt-3 pb-1.5 rounded-t-[24px]">
          <div className="w-10 h-1.5 bg-[#E5E5E5] rounded-full"></div>
        </div>

        {/* Header container */}
        <div className="h-[44px] min-h-[44px] flex items-center justify-between px-5 border-b border-[#E5E5E5]/50">
          <h2 className="font-serif text-[18px] sm:text-[22px] font-bold text-[#111111] uppercase tracking-tighter">
            Your Bag ({totalItemCount})
          </h2>
          <button
            id="close-cart-btn"
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 flex items-center justify-end text-[#111111] hover:opacity-70 transition-opacity cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Products List area */}
        <div className="flex-grow overflow-y-auto px-5 py-4 flex flex-col gap-3 no-scrollbar">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div key={item.id} className="flex flex-col gap-4">
                <div className="flex h-[72px] w-full group">

                  {/* Thumbnail Image */}
                  <div className="w-[56px] h-[72px] bg-[#eeeeed] shrink-0 border border-[#E5E5E5] overflow-hidden rounded-md shadow-sm">
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      alt={item.product.name}
                      src={item.product.images[0]}
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Metadata middle details */}
                  <div className="flex-grow ml-3 flex flex-col justify-between py-0.5">

                    {/* Title & price side-by-side */}
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="text-[11px] sm:text-[12px] font-semibold text-[#111111] uppercase leading-tight line-clamp-2">
                        {item.product.name}
                      </h3>
                      <span className="text-[12px] sm:text-[13px] font-bold text-[#111111] shrink-0">
                        {CURRENCY}{(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>

                    {/* Sizing & custom controls row */}
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-[10px] font-medium text-[#8B8B8A] uppercase tracking-widest pl-0.5">
                        SIZE: {item.selectedSize}
                      </span>

                      {/* Quantity Modifier controls */}
                      <div className="flex items-center gap-1 border border-[#E5E5E5] bg-white p-0.5 rounded-lg shadow-sm">
                        <button
                          onClick={() => {
                            if (item.quantity === 1) {
                              onRemoveItem(item.id);
                            } else {
                              onUpdateQty(item.id, -1);
                            }
                          }}
                          aria-label="Decrease qty"
                          className="w-6 h-6 flex items-center justify-center text-[#111111] hover:bg-[#E5E5E5] active:scale-90 transition-all cursor-pointer rounded-md"
                        >
                          <Minus size={11} strokeWidth={2.5} />
                        </button>
                        <span className="text-[11px] font-bold text-[#111111] w-5 text-center select-none">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQty(item.id, 1)}
                          aria-label="Increase qty"
                          className="w-6 h-6 flex items-center justify-center text-[#111111] hover:bg-[#E5E5E5] active:scale-90 transition-all cursor-pointer rounded-md"
                        >
                          <Plus size={11} strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
                {/* Thin border divider */}
                <div className="w-full h-px bg-[#E5E5E5]" />
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center flex-grow">
              <div className="w-14 h-14 border-2 border-dashed border-[#E5E5E5] flex items-center justify-center mb-3 text-[#8B8B8A] text-[22px]">
                👜
              </div>
              <h3 className="font-serif text-[16px] font-bold text-[#111111] uppercase tracking-tight mb-2">
                Your bag is empty
              </h3>
              <p className="text-[12px] text-[#8B8B8A] max-w-[220px] mb-5 leading-relaxed">
                Fill it with our curated, high-contrast minimal garments.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-[#111111] text-white text-[11px] font-semibold uppercase tracking-widest cursor-pointer rounded-lg hover:bg-[#333333] active:scale-95 transition-all shadow-md"
              >
                KEEP BROWSING
              </button>
            </div>
          )}
        </div>

        {/* Total Calculations & Proceed CTA button */}
        {cartItems.length > 0 && (
          <div className="border-t border-[#E5E5E5]/50 px-5 py-3 pb-10 z-10">
            <div className="flex justify-between items-end mb-3 pr-1">
              <span className="text-[10px] font-semibold text-[#8B8B8A] uppercase tracking-widest">
                Subtotal
              </span>
              <span className="font-serif text-[18px] sm:text-[22px] font-bold text-[#111111] tracking-tighter leading-none">
                {CURRENCY}{subtotal.toFixed(2)}
              </span>
            </div>
            <button
              id="proceed-checkout-btn"
              onClick={onProceedToCheckout}
              className="w-full h-11 sm:h-13 bg-[#111111] text-[#FFFFFF] text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.1em] flex items-center justify-center border border-[#111111] hover:bg-black active:scale-[0.98] transition-all duration-300 cursor-pointer rounded-lg shadow-lg"
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
