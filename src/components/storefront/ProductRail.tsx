import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../../types';
import ProductCard from './ProductCard';

interface ProductRailProps { title: string; description: string; products: Product[]; href: string; wishlist: string[]; onToggleWishlist: (id: string) => void; onQuickAdd: (product: Product) => void; }

export default function ProductRail({ title, description, products, href, wishlist, onToggleWishlist, onQuickAdd }: ProductRailProps) {
  const navigate = useNavigate();
  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="store-container">
        <div className="mb-7 flex items-end justify-between gap-5 lg:mb-10"><div><h2 className="font-serif text-3xl font-bold tracking-[-0.045em] sm:text-4xl lg:text-5xl">{title}</h2><p className="mt-3 max-w-xl text-sm leading-6 text-[var(--color-ink-soft)]">{description}</p></div><button type="button" onClick={() => navigate(href)} className="hidden items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] sm:flex">View all <ArrowRight size={15} /></button></div>
        <div className="grid grid-flow-col auto-cols-[78%] gap-4 overflow-x-auto pb-3 no-scrollbar sm:auto-cols-[45%] md:grid-flow-row md:grid-cols-3 md:overflow-visible lg:grid-cols-4">
          {products.slice(0, 4).map((product) => <ProductCard key={product.id} product={product} wishlisted={wishlist.includes(product.id)} onToggleWishlist={onToggleWishlist} onQuickAdd={onQuickAdd} />)}
        </div>
      </div>
    </section>
  );
}
