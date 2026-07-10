import React, { useState } from 'react';
import { Boxes, LayoutDashboard, Menu, Package, Settings, ShoppingBag, Store, Users, X, LogOut } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import BrandLogo from '../brand/BrandLogo';
import { useSellerAuth } from '../../context/SellerAuthContext';

interface AdminShellProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

const navigation = [
  { label: 'Dashboard', href: '/seller', icon: LayoutDashboard, end: true },
  { label: 'Products', href: '/seller/products', icon: Package },
  { label: 'Inventory', href: '/seller/inventory', icon: Boxes },
  { label: 'Orders', href: '/seller/orders', icon: ShoppingBag },
  { label: 'Customers', href: '/seller/users', icon: Users },
  { label: 'Settings', href: '/seller/settings', icon: Settings },
];

export default function AdminShell({ title, description, actions, children }: AdminShellProps) {
  const navigate = useNavigate();
  const { seller, signOut } = useSellerAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/', { replace: true });
  };

  const sidebar = (
    <div className="flex h-full flex-col bg-[var(--color-ink)] text-white">
      <div className="flex h-20 items-center border-b border-white/10 px-5">
        <BrandLogo variant="wordmark" tone="light" className="h-6 w-auto" />
      </div>
      <div className="px-5 pb-2 pt-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35">Store operations</div>
      <nav className="grid gap-1 px-3" aria-label="Admin navigation">
        {navigation.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.end}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => `flex min-h-11 items-center gap-3 rounded-[var(--radius-sm)] px-3 text-sm transition ${isActive ? 'bg-white text-[var(--color-ink)]' : 'text-white/62 hover:bg-white/8 hover:text-white'}`}
          >
            <item.icon size={18} /> {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto border-t border-white/10 p-4">
        <button type="button" onClick={() => navigate('/')} className="mb-2 flex min-h-10 w-full items-center gap-3 rounded-[var(--radius-sm)] px-3 text-left text-sm text-white/55 hover:bg-white/8 hover:text-white"><Store size={17} /> View storefront</button>
        <div className="mb-3 rounded-[var(--radius-sm)] bg-white/6 px-3 py-3"><p className="truncate text-sm font-medium">{seller?.full_name || 'Seller'}</p><p className="mt-1 truncate text-xs text-white/42">{seller?.email}</p></div>
        <button type="button" onClick={handleSignOut} className="flex min-h-10 w-full items-center gap-3 rounded-[var(--radius-sm)] px-3 text-left text-sm text-white/55 hover:bg-white/8 hover:text-white"><LogOut size={17} /> Sign out</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--color-canvas)] lg:grid lg:grid-cols-[248px_minmax(0,1fr)]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[248px] lg:block">{sidebar}</aside>
      {mobileOpen ? <div className="fixed inset-0 z-[70] lg:hidden"><button type="button" className="absolute inset-0 h-full w-full bg-black/45" onClick={() => setMobileOpen(false)} aria-label="Close admin navigation"/><aside className="relative h-full w-[min(320px,88vw)]">{sidebar}</aside></div> : null}

      <div className="min-w-0 lg:col-start-2">
        <header className="sticky top-0 z-30 border-b border-[var(--color-border)] bg-white/95 backdrop-blur-xl">
          <div className="admin-container flex min-h-16 items-center gap-3 lg:min-h-20">
            <button type="button" onClick={() => setMobileOpen(true)} className="grid size-10 place-items-center lg:hidden" aria-label="Open admin navigation"><Menu size={20} /></button>
            <div className="min-w-0 flex-1"><h1 className="truncate font-serif text-2xl font-bold tracking-[-0.035em] lg:text-3xl">{title}</h1>{description ? <p className="mt-0.5 hidden truncate text-sm text-[var(--color-muted)] sm:block">{description}</p> : null}</div>
            {actions ? <div className="shrink-0">{actions}</div> : null}
          </div>
        </header>
        <main className="admin-container py-6 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
