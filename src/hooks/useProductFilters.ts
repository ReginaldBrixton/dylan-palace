import { useMemo, useState } from 'react';
import type { Product } from '../types';

export type ProductSort = 'recommended' | 'price-asc' | 'price-desc' | 'name';

export interface ProductFilterState {
  brand: string;
  gender: string;
  subCategory: string;
}

const emptyFilters: ProductFilterState = {
  brand: 'ALL',
  gender: 'ALL',
  subCategory: 'ALL',
};

export function filterProducts(
  products: Product[],
  query: string,
  filters: ProductFilterState,
  sort: ProductSort,
): Product[] {
  const normalizedQuery = query.trim().toLowerCase();
  const filtered = products.filter((product) => {
    const haystack = [product.name, product.brand, product.subCategory, product.description]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    if (normalizedQuery && !haystack.includes(normalizedQuery)) return false;
    if (filters.brand !== 'ALL' && product.brand !== filters.brand) return false;
    if (filters.gender !== 'ALL' && product.gender !== filters.gender) return false;
    if (filters.subCategory !== 'ALL' && product.subCategory !== filters.subCategory) return false;
    return true;
  });

  if (sort === 'price-asc') return [...filtered].sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') return [...filtered].sort((a, b) => b.price - a.price);
  if (sort === 'name') return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
  return filtered;
}

export function useProductFilters(products: Product[], initialQuery = '') {
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<ProductFilterState>(emptyFilters);
  const [sort, setSort] = useState<ProductSort>('recommended');

  const filteredProducts = useMemo(
    () => filterProducts(products, query, filters, sort),
    [products, query, filters, sort],
  );

  const activeCount = Object.values(filters).filter((value) => value !== 'ALL').length;

  const setFilter = (key: keyof ProductFilterState, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const reset = () => {
    setFilters(emptyFilters);
    setSort('recommended');
  };

  return {
    query,
    setQuery,
    filters,
    setFilter,
    sort,
    setSort,
    filteredProducts,
    activeCount,
    reset,
  };
}
