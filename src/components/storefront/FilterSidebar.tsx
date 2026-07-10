import React from 'react';
import type { ProductFilterState, ProductSort } from '../../hooks/useProductFilters';

interface FilterSidebarProps {
  brands: string[];
  subCategories: string[];
  filters: ProductFilterState;
  sort: ProductSort;
  onFilterChange: (key: keyof ProductFilterState, value: string) => void;
  onSortChange: (value: ProductSort) => void;
  onReset: () => void;
}

const selectClass = 'h-11 w-full border border-[var(--color-border)] bg-white px-3 text-sm outline-none focus:border-[var(--color-ink)]';

export default function FilterSidebar({ brands, subCategories, filters, sort, onFilterChange, onSortChange, onReset }: FilterSidebarProps) {
  return (
    <aside className="sticky top-[calc(var(--header-desktop)+1.5rem)] hidden self-start border-t border-[var(--color-border-strong)] pt-5 lg:block" aria-label="Product filters">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-[0.16em]">Filter and sort</h2>
        <button type="button" onClick={onReset} className="text-xs text-[var(--color-muted)] underline underline-offset-4">Reset</button>
      </div>
      <div className="mt-5 grid gap-5">
        <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.12em]">Type
          <select value={filters.subCategory} onChange={(event) => onFilterChange('subCategory', event.target.value)} className={selectClass}>
            <option value="ALL">All types</option>
            {subCategories.map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
        </label>
        <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.12em]">Brand
          <select value={filters.brand} onChange={(event) => onFilterChange('brand', event.target.value)} className={selectClass}>
            <option value="ALL">All brands</option>
            {brands.map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
        </label>
        <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.12em]">Gender
          <select value={filters.gender} onChange={(event) => onFilterChange('gender', event.target.value)} className={selectClass}>
            <option value="ALL">All genders</option><option value="MALE">Men</option><option value="FEMALE">Women</option><option value="UNISEX">Unisex</option>
          </select>
        </label>
        <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.12em]">Sort
          <select value={sort} onChange={(event) => onSortChange(event.target.value as ProductSort)} className={selectClass}>
            <option value="recommended">Recommended</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="name">Name</option>
          </select>
        </label>
      </div>
    </aside>
  );
}
