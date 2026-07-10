import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Product } from '../types';
import { getCachedProductById, getRelatedProducts } from '../lib/product-cache';
import { useApp } from '../context/AppContext';
import ProductGallery from '../components/storefront/ProductGallery';
import PurchasePanel from '../components/storefront/PurchasePanel';
import ProductGrid from '../components/storefront/ProductGrid';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { wishlist, toggleWishlist, handleAddtoBag } = useApp();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    if (!id) return;
    setLoading(true);
    getCachedProductById(id)
      .then(async (nextProduct) => {
        if (!active) return;
        setProduct(nextProduct);
        setSelectedSize(nextProduct?.sizes[0] || '');
        setActiveImage(0);
        if (nextProduct) setRelated(await getRelatedProducts(nextProduct, 4));
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  if (loading) return <div className="store-container grid gap-8 py-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.65fr)]"><div className="aspect-[4/5] animate-pulse bg-[var(--color-surface-subtle)]" /><div className="h-[520px] animate-pulse bg-white" /></div>;

  if (!product) return <div className="store-container grid min-h-[60vh] place-items-center text-center"><div><h1 className="font-serif text-4xl font-bold">Product not found</h1><button onClick={() => navigate('/shirts')} className="mt-6 h-12 bg-[var(--color-ink)] px-7 text-xs font-semibold uppercase tracking-[0.15em] text-white">Return to shop</button></div></div>;

  const wishlisted = wishlist.includes(product.id);

  return (
    <div className="bg-[var(--color-canvas)]">
      <div className="store-container py-4 lg:py-8">
        <button type="button" onClick={() => navigate(-1)} className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)] hover:text-[var(--color-ink)]"><ArrowLeft size={15} /> Back</button>
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.65fr)] lg:gap-8">
          <ProductGallery images={product.images} productName={product.name} activeIndex={activeImage} onActiveIndexChange={setActiveImage} />
          <PurchasePanel product={product} selectedSize={selectedSize} onSizeChange={setSelectedSize} onAddToCart={() => handleAddtoBag(product, selectedSize)} wishlisted={wishlisted} onToggleWishlist={() => toggleWishlist(product.id)} />
        </div>
      </div>

      <section className="border-t border-[var(--color-border)] bg-white py-12 lg:py-16">
        <div className="store-container">
          <div className="mb-7 flex items-end justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">Continue exploring</p><h2 className="mt-2 font-serif text-3xl font-bold tracking-[-0.04em]">Related pieces</h2></div><button onClick={() => navigate(`/${product.category.toLowerCase()}`)} className="hidden text-xs font-semibold uppercase tracking-[0.14em] underline underline-offset-4 sm:block">View collection</button></div>
          <ProductGrid products={related} wishlist={wishlist} onToggleWishlist={toggleWishlist} onQuickAdd={(item) => handleAddtoBag(item, item.sizes[0] || 'OS')} />
        </div>
      </section>
    </div>
  );
}
