import React from 'react';
import type { Product } from '../../types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  wishlist: string[];
  onToggleWishlist: (productId: string) => void;
  onQuickAdd: (product: Product) => void;
}

export default function ProductGrid({ products, wishlist, onToggleWishlist, onQuickAdd }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="grid min-h-[360px] place-items-center border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface)] px-6 text-center">
        <div className="max-w-sm">
          <h2 className="text-xl font-semibold">No products match these filters</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--color-ink-soft)]">Clear one or more filters, or try a broader search term.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          wishlisted={wishlist.includes(product.id)}
          onToggleWishlist={onToggleWishlist}
          onQuickAdd={onQuickAdd}
        />
      ))}
    </div>
  );
}
