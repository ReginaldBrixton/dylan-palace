import React, { useEffect, useMemo, useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useLocation, useSearchParams } from 'react-router-dom';
import type { Product } from '../types';
import { getCachedProductsByCategory } from '../lib/product-cache';
import { useApp } from '../context/AppContext';
import { useProductFilters } from '../hooks/useProductFilters';
import ProductGrid from '../components/storefront/ProductGrid';
import FilterSidebar from '../components/storefront/FilterSidebar';
import FilterSheet from '../components/storefront/FilterSheet';

const categoryMap: Record<string, Product['category']> = {
  shirts: 'SHIRTS',
  trousers: 'TROUSERS',
  shoes: 'SHOES',
  bags: 'BAGS',
};

export default function ProductListPage() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { wishlist, toggleWishlist, handleAddtoBag } = useApp();
  const category = categoryMap[location.pathname.slice(1)] || 'SHIRTS';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const initialQuery = searchParams.get('q') || '';
  const filterState = useProductFilters(products, initialQuery);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getCachedProductsByCategory(category)
      .then((data) => { if (active) setProducts(data); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [category]);

  useEffect(() => {
    filterState.setQuery(initialQuery);
  }, [initialQuery]);

  const brands = useMemo(() => Array.from(new Set(products.map((product) => product.brand).filter(Boolean) as string[])).sort(), [products]);
  const subCategories = useMemo(() => Array.from(new Set(products.map((product) => product.subCategory).filter(Boolean) as string[])).sort(), [products]);

  const title = category.charAt(0) + category.slice(1).toLowerCase();

  return (
    <div className="bg-[var(--color-canvas)]">
      <section className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="store-container py-8 sm:py-10 lg:py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">The collection</p>
          <div className="mt-2 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="font-serif text-4xl font-bold tracking-[-0.04em] sm:text-5xl lg:text-6xl">{title}</h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--color-ink-soft)]">Explore the current edit, compare details and add your preferred size directly from the catalogue.</p>
            </div>
            <p className="text-sm text-[var(--color-muted)]">{filterState.filteredProducts.length} {filterState.filteredProducts.length === 1 ? 'piece' : 'pieces'}</p>
          </div>
        </div>
      </section>

      <div className="sticky top-[var(--header-mobile)] z-30 border-b border-[var(--color-border)] bg-[rgb(246_244_239_/_0.94)] backdrop-blur-xl lg:top-[var(--header-desktop)]">
        <div className="store-container flex items-center gap-3 py-3">
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">Search {title}</span>
            <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
            <input value={filterState.query} onChange={(event) => filterState.setQuery(event.target.value)} placeholder={`Search ${title.toLowerCase()}`} className="h-11 w-full border border-[var(--color-border)] bg-white pl-10 pr-10 text-sm outline-none focus:border-[var(--color-ink)]" />
            {filterState.query ? <button type="button" onClick={() => filterState.setQuery('')} className="absolute right-1 top-1/2 grid size-9 -translate-y-1/2 place-items-center" aria-label="Clear search"><X size={16} /></button> : null}
          </label>
          <button type="button" onClick={() => setFilterOpen(true)} className="flex h-11 items-center gap-2 border border-[var(--color-border)] bg-white px-4 text-xs font-semibold uppercase tracking-[0.12em] lg:hidden">
            <SlidersHorizontal size={16} /> Filters {filterState.activeCount > 0 ? `(${filterState.activeCount})` : ''}
          </button>
          <label className="hidden items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] md:flex lg:hidden">Sort
            <select value={filterState.sort} onChange={(event) => filterState.setSort(event.target.value as typeof filterState.sort)} className="h-11 border border-[var(--color-border)] bg-white px-3 text-sm normal-case tracking-normal">
              <option value="recommended">Recommended</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="name">Name</option>
            </select>
          </label>
        </div>
      </div>

      <div className="store-container grid gap-8 py-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 lg:py-12">
        <FilterSidebar brands={brands} subCategories={subCategories} filters={filterState.filters} sort={filterState.sort} onFilterChange={filterState.setFilter} onSortChange={filterState.setSort} onReset={filterState.reset} />
        {loading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4" aria-label="Loading products">
            {Array.from({ length: 8 }).map((_, index) => <div key={index} className="aspect-[4/5] animate-pulse bg-[var(--color-surface-subtle)]" />)}
          </div>
        ) : (
          <ProductGrid
            products={filterState.filteredProducts}
            wishlist={wishlist}
            onToggleWishlist={toggleWishlist}
            onQuickAdd={(product) => handleAddtoBag(product, product.sizes[0] || 'OS')}
          />
        )}
      </div>

      <FilterSheet open={filterOpen} onOpenChange={setFilterOpen} brands={brands} subCategories={subCategories} filters={filterState.filters} sort={filterState.sort} onFilterChange={filterState.setFilter} onSortChange={filterState.setSort} onReset={filterState.reset} />
    </div>
  );
}
