import React from 'react';
import { Link } from 'react-router-dom';
import BrandLogo from '../brand/BrandLogo';

const serviceLinks = [
  ['Delivery information', '/checkout'],
  ['My account', '/profile'],
  ['Seller portal', '/seller/login'],
] as const;

export default function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-ink)] text-white">
      <div className="store-container grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.8fr] lg:py-16">
        <div className="max-w-md">
          <BrandLogo variant="wordmark" tone="light" className="h-7 w-auto" />
          <p className="mt-5 text-sm leading-6 text-white/65">A considered wardrobe of shirts, trousers, footwear and bags selected for everyday life in Ghana.</p>
        </div>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">Shop</h2>
          <div className="mt-4 grid gap-3 text-sm">
            <Link to="/shirts">Shirts</Link><Link to="/trousers">Trousers</Link><Link to="/shoes">Shoes</Link><Link to="/bags">Bags</Link>
          </div>
        </div>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">Service</h2>
          <div className="mt-4 grid gap-3 text-sm">
            {serviceLinks.map(([label, href]) => <Link key={href} to={href}>{label}</Link>)}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="store-container flex flex-col gap-2 py-5 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Dylan's Palace.</span>
          <span>Designed for mobile, tablet and desktop shopping.</span>
        </div>
      </div>
    </footer>
  );
}
