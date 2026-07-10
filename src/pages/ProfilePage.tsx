import React, { useEffect, useMemo, useState } from 'react';
import { Heart, Package, UserRound } from 'lucide-react';
import type { Product } from '../types';
import { useApp } from '../context/AppContext';
import { getCachedProducts } from '../lib/product-cache';
import OrderCard from './profile/components/OrderCard';
import WishlistTab from './profile/components/WishlistTab';

export default function ProfilePage() {
  const { pastOrders, wishlist: wishlistIds } = useApp();
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'ORDERS' | 'WISHLIST' | 'ACCOUNT'>('ORDERS');
  useEffect(() => { getCachedProducts().then(setProducts).catch(() => undefined); }, []);
  const wishlist = useMemo(() => wishlistIds.map((id) => products.find((product) => product.id === id)).filter(Boolean) as Product[], [wishlistIds, products]);

  const tabs = [
    { id: 'ORDERS' as const, label: 'Orders', icon: Package, count: pastOrders.length },
    { id: 'WISHLIST' as const, label: 'Saved', icon: Heart, count: wishlist.length },
    { id: 'ACCOUNT' as const, label: 'Account', icon: UserRound },
  ];

  return (
    <div className="store-container py-8 lg:py-14">
      <div className="mb-8"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">Your space</p><h1 className="mt-2 font-serif text-4xl font-bold tracking-[-0.045em] lg:text-5xl">Orders and saved pieces.</h1></div>
      <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
        <nav className="flex gap-2 overflow-x-auto lg:grid lg:self-start" aria-label="Account sections">{tabs.map((tab) => <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex min-w-fit items-center justify-between gap-5 border px-4 py-3 text-sm font-semibold lg:w-full ${activeTab === tab.id ? 'border-[var(--color-ink)] bg-[var(--color-ink)] text-white' : 'border-[var(--color-border)] bg-white'}`}><span className="flex items-center gap-2"><tab.icon size={17}/>{tab.label}</span>{tab.count !== undefined ? <span>{tab.count}</span> : null}</button>)}</nav>
        <section className="min-w-0 bg-white p-5 sm:p-7 lg:p-8">
          {activeTab === 'ORDERS' ? <div><div className="mb-6"><h2 className="font-serif text-2xl font-bold">Order history</h2><p className="mt-2 text-sm text-[var(--color-muted)]">Orders placed on this device are shown here. Database-linked customer accounts can replace this local history in a future account phase.</p></div>{pastOrders.length === 0 ? <div className="grid min-h-64 place-items-center border border-dashed border-[var(--color-border-strong)] text-center"><div><Package size={30} className="mx-auto text-[var(--color-muted)]"/><p className="mt-3 text-sm text-[var(--color-ink-soft)]">No previous orders on this device.</p></div></div> : <div className="grid gap-5">{pastOrders.map((order) => <OrderCard key={order.id} order={order}/>)}</div>}</div> : null}
          {activeTab === 'WISHLIST' ? <div><div className="mb-6"><h2 className="font-serif text-2xl font-bold">Saved pieces</h2><p className="mt-2 text-sm text-[var(--color-muted)]">Return to products you are considering.</p></div><WishlistTab wishlist={wishlist}/></div> : null}
          {activeTab === 'ACCOUNT' ? <div><h2 className="font-serif text-2xl font-bold">Customer account</h2><p className="mt-3 max-w-xl text-sm leading-6 text-[var(--color-ink-soft)]">Checkout currently supports guest ordering. Seller authentication is separate and secure. A customer sign-in can be introduced later without changing the order and wishlist interface.</p><div className="mt-6 border border-[var(--color-border)] bg-[var(--color-canvas)] p-5"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">Privacy note</p><p className="mt-2 text-sm leading-6">Contact and delivery details are stored only when an order is submitted successfully.</p></div></div> : null}
        </section>
      </div>
    </div>
  );
}
