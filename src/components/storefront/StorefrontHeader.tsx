import React, { useEffect, useState } from 'react';
import { Heart, Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import BrandLogo from '../brand/BrandLogo';
import SearchOverlay from './SearchOverlay';

interface StorefrontHeaderProps {
  cartCount: number;
  onOpenCart: () => void;
}

const categories = [
  { label: 'Shirts', href: '/shirts' },
  { label: 'Trousers', href: '/trousers' },
  { label: 'Shoes', href: '/shoes' },
  { label: 'Bags', href: '/bags' },
];

export default function StorefrontHeader({ cartCount, onOpenCart }: StorefrontHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location.pathname]);

  const transparent = location.pathname === '/' && !scrolled && !menuOpen;
  const foreground = transparent ? 'text-white' : 'text-[var(--color-ink)]';

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${transparent ? 'border-transparent bg-transparent' : 'border-[var(--color-border)] bg-[rgb(255_255_255_/_0.94)] shadow-sm backdrop-blur-xl'}`}>
        <div className="store-container flex h-[var(--header-mobile)] items-center justify-between gap-3 lg:h-[var(--header-desktop)]">
          <button type="button" className={`grid size-10 place-items-center lg:hidden ${foreground}`} onClick={() => setMenuOpen((value) => !value)} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen}>
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>

          <button type="button" onClick={() => navigate('/')} className={`min-w-0 ${foreground}`} aria-label="Go to Dylan's Palace home">
            <BrandLogo variant="wordmark" tone={transparent ? 'light' : 'dark'} className="h-5 w-auto sm:h-6 lg:h-7" />
          </button>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary navigation">
            {categories.map((category) => (
              <NavLink
                key={category.href}
                to={category.href}
                className={({ isActive }) => `relative py-7 text-[12px] font-semibold uppercase tracking-[0.16em] transition-colors ${transparent ? 'text-white/88 hover:text-white' : 'text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]'} ${isActive ? 'after:absolute after:inset-x-0 after:bottom-5 after:h-px after:bg-current' : ''}`}
              >
                {category.label}
              </NavLink>
            ))}
          </nav>

          <div className={`flex items-center gap-0.5 ${foreground}`}>
            <button type="button" onClick={() => setSearchOpen(true)} className="grid size-10 place-items-center rounded-full transition-colors hover:bg-black/5" aria-label="Search products">
              <Search size={19} />
            </button>
            <button type="button" onClick={() => navigate('/profile')} className="hidden size-10 place-items-center rounded-full transition-colors hover:bg-black/5 sm:grid" aria-label="Open wishlist and account">
              <Heart size={18} className="lg:hidden" />
              <User size={19} className="hidden lg:block" />
            </button>
            <button type="button" onClick={onOpenCart} className="relative grid size-10 place-items-center rounded-full transition-colors hover:bg-black/5" aria-label={`Open shopping bag with ${cartCount} items`}>
              <ShoppingBag size={19} />
              {cartCount > 0 ? <span className="absolute right-0.5 top-0.5 grid min-h-4 min-w-4 place-items-center rounded-full bg-[var(--color-accent)] px-1 text-[9px] font-bold text-white">{cartCount > 99 ? '99+' : cartCount}</span> : null}
            </button>
          </div>
        </div>

        {menuOpen ? (
          <div className="border-t border-[var(--color-border)] bg-[var(--color-surface)] lg:hidden">
            <nav className="store-container grid py-2" aria-label="Mobile navigation">
              {categories.map((category) => (
                <NavLink key={category.href} to={category.href} className="flex min-h-14 items-center justify-between border-b border-[var(--color-border)] text-sm font-semibold uppercase tracking-[0.15em] last:border-0">
                  {category.label}
                  <span aria-hidden="true">→</span>
                </NavLink>
              ))}
              <button type="button" onClick={() => navigate('/profile')} className="flex min-h-14 items-center justify-between text-left text-sm font-semibold uppercase tracking-[0.15em]">
                Account and wishlist
                <span aria-hidden="true">→</span>
              </button>
            </nav>
          </div>
        ) : null}
      </header>

      <SearchOverlay
        open={searchOpen}
        onOpenChange={setSearchOpen}
        onSearch={(query) => navigate(`/shirts?q=${encodeURIComponent(query)}`)}
      />
    </>
  );
}
