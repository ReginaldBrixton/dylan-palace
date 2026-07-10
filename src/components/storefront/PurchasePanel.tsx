import React from 'react';
import { Heart, PackageCheck, Ruler, ShieldCheck, Truck } from 'lucide-react';
import type { Product } from '../../types';
import { CURRENCY } from '../../constants';

interface PurchasePanelProps {
  product: Product;
  selectedSize: string;
  onSizeChange: (size: string) => void;
  onAddToCart: () => void;
  wishlisted: boolean;
  onToggleWishlist: () => void;
}

export default function PurchasePanel({ product, selectedSize, onSizeChange, onAddToCart, wishlisted, onToggleWishlist }: PurchasePanelProps) {
  const selectedVariant = product.variants?.find((variant) => variant.size === selectedSize && variant.active);
  const price = selectedVariant?.price ?? product.price;
  const available = product.variants ? Boolean(selectedVariant && selectedVariant.stockQuantity > 0) : product.sizes.includes(selectedSize);

  return (
    <section className="bg-white p-5 sm:p-7 lg:sticky lg:top-[calc(var(--header-desktop)+1.5rem)] lg:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">{product.brand || product.category}</p>
      <div className="mt-2 flex items-start justify-between gap-4">
        <h1 className="font-serif text-3xl font-bold leading-tight tracking-[-0.04em] sm:text-4xl">{product.name}</h1>
        <button type="button" onClick={onToggleWishlist} className="grid size-11 shrink-0 place-items-center rounded-full border border-[var(--color-border)]" aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}><Heart size={19} className={wishlisted ? 'fill-current' : ''} /></button>
      </div>
      <p className="mt-4 text-2xl font-bold">{CURRENCY}{price.toFixed(2)}</p>
      <p className="mt-5 text-sm leading-7 text-[var(--color-ink-soft)]">{product.description}</p>

      <div className="mt-7 border-t border-[var(--color-border)] pt-6">
        <div className="flex items-center justify-between"><h2 className="text-xs font-semibold uppercase tracking-[0.15em]">Select size</h2><span className="flex items-center gap-1 text-xs text-[var(--color-muted)]"><Ruler size={14} /> Size guide</span></div>
        <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5">
          {product.sizes.map((size) => {
            const variant = product.variants?.find((candidate) => candidate.size === size && candidate.active);
            const inStock = variant ? variant.stockQuantity > 0 : true;
            return <button key={size} type="button" disabled={!inStock} onClick={() => onSizeChange(size)} className={`h-12 border text-sm font-semibold transition ${selectedSize === size ? 'border-[var(--color-ink)] bg-[var(--color-ink)] text-white' : 'border-[var(--color-border)] bg-white'} disabled:cursor-not-allowed disabled:opacity-35`} aria-pressed={selectedSize === size}>{size}</button>;
          })}
        </div>
        {selectedVariant && selectedVariant.stockQuantity <= 3 ? <p className="mt-3 text-xs font-medium text-[var(--color-warning)]">Only {selectedVariant.stockQuantity} left in this size.</p> : null}
      </div>

      <button type="button" onClick={onAddToCart} disabled={!selectedSize || !available} className="mt-6 h-14 w-full bg-[var(--color-accent)] text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[var(--color-accent-strong)] disabled:cursor-not-allowed disabled:bg-[var(--color-muted)]">{available ? 'Add to bag' : 'Select an available size'}</button>

      <div className="mt-7 grid gap-4 border-t border-[var(--color-border)] pt-6 text-sm">
        <div className="flex gap-3"><Truck size={18} className="mt-0.5 text-[var(--color-accent)]" /><div><p className="font-semibold">Delivery within Ghana</p><p className="mt-1 text-xs leading-5 text-[var(--color-muted)]">Delivery cost is calculated at checkout. Pickup may be selected in the delivery instructions.</p></div></div>
        <div className="flex gap-3"><PackageCheck size={18} className="mt-0.5 text-[var(--color-accent)]" /><div><p className="font-semibold">Stock-aware ordering</p><p className="mt-1 text-xs leading-5 text-[var(--color-muted)]">Availability is checked again when the order is placed.</p></div></div>
        <div className="flex gap-3"><ShieldCheck size={18} className="mt-0.5 text-[var(--color-accent)]" /><div><p className="font-semibold">Secure order record</p><p className="mt-1 text-xs leading-5 text-[var(--color-muted)]">Your bag clears only after the order is saved successfully.</p></div></div>
      </div>
    </section>
  );
}
