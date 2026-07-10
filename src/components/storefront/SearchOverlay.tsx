import React, { useEffect, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';

interface SearchOverlayProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSearch: (query: string) => void;
}

export default function SearchOverlay({ open, onOpenChange, onSearch }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.setTimeout(() => inputRef.current?.focus(), 0);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onOpenChange(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] bg-[rgb(21_21_21_/_0.55)] backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Search products">
      <div className="mx-auto mt-0 w-full bg-[var(--color-surface)] shadow-[var(--shadow-drawer)] lg:mt-20 lg:max-w-3xl lg:rounded-[var(--radius-lg)]">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const nextQuery = query.trim();
            if (!nextQuery) return;
            onSearch(nextQuery);
            onOpenChange(false);
          }}
          className="flex min-h-[72px] items-center gap-3 border-b border-[var(--color-border)] px-4 lg:px-6"
        >
          <Search size={20} aria-hidden="true" />
          <label htmlFor="global-product-search" className="sr-only">Search products</label>
          <input
            ref={inputRef}
            id="global-product-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search shirts, trousers, shoes and bags"
            className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-[var(--color-muted)] lg:text-lg"
          />
          <button type="button" onClick={() => onOpenChange(false)} className="grid size-10 place-items-center rounded-full hover:bg-[var(--color-surface-subtle)]" aria-label="Close search">
            <X size={20} />
          </button>
        </form>
        <div className="px-4 py-5 text-sm text-[var(--color-ink-soft)] lg:px-6">
          Search by product name or brand. Results open in the complete catalogue.
        </div>
      </div>
    </div>
  );
}
