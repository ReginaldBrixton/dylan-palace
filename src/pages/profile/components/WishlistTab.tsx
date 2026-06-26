import { useNavigate } from 'react-router-dom';
import { Heart, ChevronRight } from 'lucide-react';
import type { Product } from '../../../types';
import { CURRENCY } from '../../../constants';

interface WishlistTabProps {
  wishlist: Product[];
}

export default function WishlistTab({ wishlist }: WishlistTabProps) {
  const navigate = useNavigate();

  if (wishlist.length === 0) {
    return (
      <div className="py-12 flex flex-col items-center justify-center text-center">
        <Heart size={24} className="text-[#E5E5E5] mb-3" />
        <p className="text-[13px] text-[#555555]">Your wishlist is empty.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col divide-y divide-[#E5E5E5] border-y border-[#E5E5E5]">
      {wishlist.map((product) => (
        <div
          key={product.id}
          className="flex items-center py-3 gap-3 cursor-pointer group hover:bg-[#F9F9F8]"
          onClick={() => navigate(`/product/${product.id}`)}
        >
          <div className="w-16 h-20 bg-[#eeeeed] shrink-0 rounded overflow-hidden">
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
          </div>
          <div className="flex-1 min-w-0 font-sans">
            <p className="text-[9px] font-bold text-[#8B8B8A] uppercase tracking-wider mb-0.5">{product.brand || product.category}</p>
            <h4 className="text-[12px] font-bold text-[#111111] truncate">{product.name}</h4>
            <p className="font-serif text-[13px] font-bold text-[#111111] mt-1">{CURRENCY}{product.price.toFixed(2)}</p>
          </div>
          <ChevronRight size={16} className="text-[#E5E5E5] group-hover:text-[#111111] shrink-0" />
        </div>
      ))}
    </div>
  );
}
