import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../types';
import { getCachedFeaturedProducts, getCachedProducts } from '../lib/product-cache';
import { useApp } from '../context/AppContext';
import HeroCampaign from '../components/storefront/HeroCampaign';
import ProductRail from '../components/storefront/ProductRail';
import CategoryShowcase from '../components/storefront/CategoryShowcase';
import AtelierDiagram from '../components/storefront/AtelierDiagram';
import ServiceStrip from '../components/storefront/ServiceStrip';

const fallback = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900"><rect width="100%" height="100%" fill="#151515"/><text x="50%" y="50%" text-anchor="middle" fill="#fff" font-family="sans-serif" font-size="48">Dylan\'s Palace</text></svg>')}`;

export default function HomePage() {
  const navigate = useNavigate();
  const { wishlist, toggleWishlist, handleAddtoBag } = useApp();
  const [products, setProducts] = useState<Product[]>([]);
  const [featured, setFeatured] = useState<Product[]>([]);

  useEffect(() => {
    Promise.all([getCachedProducts(), getCachedFeaturedProducts(8)]).then(([all, selected]) => {
      setProducts(all);
      setFeatured(selected.length > 0 ? selected : all.slice(0, 8));
    });
  }, []);

  const heroImage = featured[0]?.images[0] || products[0]?.images[0] || fallback;
  const categoryCards = useMemo(() => [
    { title: 'Shirts', description: 'Relaxed tailoring, knit polos and expressive resort pieces.', href: '/shirts', image: products.find((product) => product.category === 'SHIRTS')?.images[0] || heroImage },
    { title: 'Trousers', description: 'Structured silhouettes built for movement and everyday polish.', href: '/trousers', image: products.find((product) => product.category === 'TROUSERS')?.images[0] || heroImage },
    { title: 'Shoes', description: 'Clean leather, considered soles and modern proportions.', href: '/shoes', image: products.find((product) => product.category === 'SHOES')?.images[0] || heroImage },
    { title: 'Bags', description: 'Practical forms with refined hardware and useful volume.', href: '/bags', image: products.find((product) => product.category === 'BAGS')?.images[0] || heroImage },
  ], [products, heroImage]);

  return (
    <div className="bg-[var(--color-canvas)]">
      <HeroCampaign image={heroImage} />
      <ServiceStrip />

      <ProductRail title="New arrivals" description="The latest pieces added to the Dylan’s Palace edit." products={products.slice(0, 4)} href="/shirts" wishlist={wishlist} onToggleWishlist={toggleWishlist} onQuickAdd={(product) => handleAddtoBag(product, product.sizes[0] || 'OS')} />

      <section className="store-container pb-12 sm:pb-16 lg:pb-20">
        <div className="mb-7"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">Shop by category</p><h2 className="mt-2 font-serif text-4xl font-bold tracking-[-0.045em] lg:text-5xl">Build the full look.</h2></div>
        <div className="grid gap-4 md:grid-cols-2">{categoryCards.map((category, index) => <CategoryShowcase key={category.href} {...category} index={`0${index + 1}`} />)}</div>
      </section>

      <section className="grid bg-[var(--color-surface)] lg:grid-cols-2">
        <div className="min-h-[480px] lg:min-h-[620px]"><AtelierDiagram /></div>
        <div className="flex items-center px-[var(--space-page)] py-12 lg:px-16 lg:py-20">
          <div className="max-w-xl"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">The fitting room</p><h2 className="mt-4 font-serif text-4xl font-bold leading-tight tracking-[-0.045em] sm:text-5xl">Details that make clothes easier to live in.</h2><p className="mt-6 text-sm leading-7 text-[var(--color-ink-soft)]">The collection balances strong shape with practical wear. Clear sizing, multiple product views and live inventory make it easier to choose with confidence.</p><button type="button" onClick={() => navigate('/trousers')} className="mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em]">Explore tailored pieces <ArrowRight size={15}/></button></div>
        </div>
      </section>

      <ProductRail title="Selected for you" description="Featured pieces from across the current catalogue." products={featured.slice(0, 4)} href="/shoes" wishlist={wishlist} onToggleWishlist={toggleWishlist} onQuickAdd={(product) => handleAddtoBag(product, product.sizes[0] || 'OS')} />
    </div>
  );
}
