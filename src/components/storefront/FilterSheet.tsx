import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import type { ProductFilterState, ProductSort } from '../../hooks/useProductFilters';
import FilterSidebar from './FilterSidebar';

interface FilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brands: string[];
  subCategories: string[];
  filters: ProductFilterState;
  sort: ProductSort;
  onFilterChange: (key: keyof ProductFilterState, value: string) => void;
  onSortChange: (value: ProductSort) => void;
  onReset: () => void;
}

export default function FilterSheet(props: FilterSheetProps) {
  useEffect(() => {
    if (!props.open) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = overflow; };
  }, [props.open]);

  if (!props.open) return null;

  return (
    <div className="fixed inset-0 z-[75] bg-black/45 lg:hidden" role="dialog" aria-modal="true" aria-label="Product filters">
      <div className="absolute inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto rounded-t-[var(--radius-lg)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-drawer)]">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
          <h2 className="text-lg font-semibold">Filter and sort</h2>
          <button type="button" onClick={() => props.onOpenChange(false)} className="grid size-10 place-items-center rounded-full bg-[var(--color-surface-subtle)]" aria-label="Close filters"><X size={19} /></button>
        </div>
        <div className="[&>aside]:block [&>aside]:static [&>aside]:border-0 [&>aside]:pt-5">
          <FilterSidebar {...props} />
        </div>
        <button type="button" onClick={() => props.onOpenChange(false)} className="mt-6 h-12 w-full bg-[var(--color-ink)] text-xs font-semibold uppercase tracking-[0.14em] text-white">Show products</button>
      </div>
    </div>
  );
}
