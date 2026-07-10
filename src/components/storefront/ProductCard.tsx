import React from 'react';
import { Heart, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../../types';
import { CURRENCY } from '../../constants';
import ImageWithSkeleton from '../common/ImageWithSkeleton';

interface ProductCardProps {
  product: Product;
  wishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onQuickAdd: (product: Product) => void;
}

export default function ProductCard({ product, wishlisted, onToggleWishlist, onQuickAdd }: ProductCardProps) {
  const navigate = useNavigate();
  const primaryImage = product.images[0];
  const secondaryImage = product.images[1];

  return (
    <article className="group min-w-0 bg-[var(--color-surface)]">
      <div className="relative aspect-[4/5] overflow-hidden bg-[var(--color-surface-subtle)]">
        <button type="button" onClick={() => navigate(`/product/${product.id}`)} className="absolute inset-0 z-10" aria-label={`View ${product.name}`} />
        <ImageWithSkeleton
          src={primaryImage}
          alt={product.name}
          className="h-full w-full"
          imgClassName={`h-full w-full object-cover transition duration-700 ${secondaryImage ? 'group-hover:opacity-0' : 'group-hover:scale-[1.025]'}`}
        />
        {secondaryImage ? (
          <img src={secondaryImage} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-0 transition duration-700 group-hover:opacity-100" />
        ) : null}
        <button
          type="button"
          onClick={() => onToggleWishlist(product.id)}
          className="absolute right-3 top-3 z-20 grid size-9 place-items-center rounded-full bg-white/90 text-[var(--color-ink)] shadow-sm backdrop-blur-sm transition hover:bg-white"
          aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
        >
          <Heart size={17} className={wishlisted ? 'fill-current' : ''} />
        </button>
        <button
          type="button"
          onClick={() => onQuickAdd(product)}
          className="absolute inset-x-3 bottom-3 z-20 flex min-h-11 translate-y-3 items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-[var(--color-ink)] px-4 text-[11px] font-semibold uppercase tracking-[0.13em] text-white opacity-0 shadow-lg transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 focus:translate-y-0 focus:opacity-100"
        >
          <Plus size={15} /> Quick add
        </button>
      </div>
      <div className="grid gap-1 px-1 py-4">
        <button type="button" onClick={() => navigate(`/product/${product.id}`)} className="truncate text-left text-sm font-semibold text-[var(--color-ink)] hover:underline">
          {product.name}
        </button>
        <div className="flex items-center justify-between gap-3 text-xs text-[var(--color-muted)]">
          <span className="truncate">{product.brand || product.subCategory || 'Dylan’s Palace'}</span>
          <span className="shrink-0 font-semibold text-[var(--color-ink)]">{CURRENCY}{product.price.toFixed(2)}</span>
        </div>
      </div>
    </article>
  );
}
