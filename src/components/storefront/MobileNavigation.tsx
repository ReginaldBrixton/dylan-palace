import React from 'react';
import { Heart, Home, Search, ShoppingBag } from 'lucide-react';
import { NavLink } from 'react-router-dom';

interface MobileNavigationProps {
  cartCount: number;
  onOpenCart: () => void;
}

const linkClass = ({ isActive }: { isActive: boolean }) => `flex min-w-0 flex-1 flex-col items-center justify-center gap-1 text-[10px] font-semibold uppercase tracking-[0.08em] ${isActive ? 'text-[var(--color-ink)]' : 'text-[var(--color-muted)]'}`;

export default function MobileNavigation({ cartCount, onOpenCart }: MobileNavigationProps) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex h-[68px] items-stretch border-t border-[var(--color-border)] bg-[rgb(255_255_255_/_0.96)] px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden" aria-label="Mobile storefront navigation">
      <NavLink to="/" className={linkClass}><Home size={19} /><span>Home</span></NavLink>
      <NavLink to="/shirts" className={linkClass}><Search size={19} /><span>Shop</span></NavLink>
      <NavLink to="/profile" className={linkClass}><Heart size={19} /><span>Saved</span></NavLink>
      <button type="button" onClick={onOpenCart} className="relative flex min-w-0 flex-1 flex-col items-center justify-center gap-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--color-muted)]" aria-label={`Open bag with ${cartCount} items`}>
        <span className="relative"><ShoppingBag size={19} />{cartCount > 0 ? <span className="absolute -right-2 -top-2 grid min-h-4 min-w-4 place-items-center rounded-full bg-[var(--color-accent)] px-1 text-[9px] text-white">{cartCount}</span> : null}</span>
        <span>Bag</span>
      </button>
    </nav>
  );
}
