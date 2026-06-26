import { CURRENCY } from '../../../constants';

interface CartFooterProps {
  subtotal: number;
  onProceedToCheckout: () => void;
}

export default function CartFooter({ subtotal, onProceedToCheckout }: CartFooterProps) {
  return (
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
  );
}
