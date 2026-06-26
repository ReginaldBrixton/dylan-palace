import { Plus, Minus } from 'lucide-react';
import type { CartItem } from '../../../types';
import { CURRENCY } from '../../../constants';

interface CartItemRowProps {
  item: CartItem;
  onUpdateQty: (cartItemId: string, change: number) => void;
  onRemoveItem: (cartItemId: string) => void;
}

export default function CartItemRow({ item, onUpdateQty, onRemoveItem }: CartItemRowProps) {
  return (
    <>
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
    </>
  );
}
