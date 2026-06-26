import { useEffect } from 'react';
import { X } from 'lucide-react';
import { CartItem } from '../../types';
import CartItemRow from './cart/CartItemRow';
import CartEmptyState from './cart/CartEmptyState';
import CartFooter from './cart/CartFooter';

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
                <CartItemRow
                  item={item}
                  onUpdateQty={onUpdateQty}
                  onRemoveItem={onRemoveItem}
                />
              </div>
            ))
          ) : (
            <CartEmptyState onClose={onClose} />
          )}
        </div>

        {/* Total Calculations & Proceed CTA button */}
        {cartItems.length > 0 && (
          <CartFooter subtotal={subtotal} onProceedToCheckout={onProceedToCheckout} />
        )}

      </div>
    </div>
  );
}
