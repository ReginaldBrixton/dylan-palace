import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowRight, Clock3, Package, ShoppingBag, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminShell from '../../components/admin/AdminShell';
import MetricCard from '../../components/admin/MetricCard';
import StatusBadge from '../../components/admin/StatusBadge';
import { fetchDashboardStats, fetchRecentOrders } from '../../lib/api';
import type { Order } from '../../lib/database.types';
import { CURRENCY } from '../../constants';

interface Stats { totalProducts: number; totalOrders: number; pendingOrders: number; totalUsers: number; }

export default function SellerDashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try { const [nextStats, nextOrders] = await Promise.all([fetchDashboardStats(), fetchRecentOrders(6)]); setStats(nextStats); setOrders(nextOrders); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const revenue = useMemo(() => orders.filter((order) => order.status !== 'cancelled').reduce((sum, order) => sum + order.total_amount, 0), [orders]);

  return (
    <AdminShell title="Dashboard" description="Store performance and items requiring attention.">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Products" value={stats?.totalProducts ?? '—'} icon={Package} note="Current catalogue" />
        <MetricCard label="Orders" value={stats?.totalOrders ?? '—'} icon={ShoppingBag} note="All recorded orders" />
        <MetricCard label="Pending" value={stats?.pendingOrders ?? '—'} icon={Clock3} note="Require review" />
        <MetricCard label="Customers" value={stats?.totalUsers ?? '—'} icon={Users} note="Profiles and sellers" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.5fr)]">
        <section className="border border-[var(--color-border)] bg-white">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-4"><div><h2 className="font-semibold">Recent orders</h2><p className="mt-1 text-xs text-[var(--color-muted)]">Latest activity across the store.</p></div><button onClick={() => navigate('/seller/orders')} className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em]">View all <ArrowRight size={14}/></button></div>
          {loading ? <div className="grid gap-1 p-5">{Array.from({ length: 5 }).map((_, index) => <div key={index} className="h-16 animate-pulse bg-[var(--color-surface-subtle)]" />)}</div> : orders.length === 0 ? <p className="p-8 text-center text-sm text-[var(--color-muted)]">No orders yet.</p> : <div className="overflow-x-auto"><table className="w-full min-w-[620px]"><thead><tr className="border-b border-[var(--color-border)] text-left text-[10px] uppercase tracking-[0.12em] text-[var(--color-muted)]"><th className="px-5 py-3">Order</th><th className="px-5 py-3">Customer</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Total</th></tr></thead><tbody>{orders.map((order) => <tr key={order.id} className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-canvas)]"><td className="px-5 py-4 text-sm font-semibold">{order.order_number}</td><td className="px-5 py-4"><p className="text-sm">{order.full_name}</p><p className="mt-1 text-xs text-[var(--color-muted)]">{order.email}</p></td><td className="px-5 py-4"><StatusBadge status={order.status}/></td><td className="px-5 py-4 text-right text-sm font-semibold">{CURRENCY}{order.total_amount.toFixed(2)}</td></tr>)}</tbody></table></div>}
        </section>

        <aside className="grid gap-4 self-start">
          <div className="bg-[var(--color-ink)] p-6 text-white"><p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/45">Recent order value</p><p className="mt-4 text-3xl font-bold">{CURRENCY}{revenue.toFixed(2)}</p><p className="mt-2 text-xs leading-5 text-white/55">Value of the latest non-cancelled orders displayed here.</p></div>
          <button onClick={() => navigate('/seller/products')} className="flex min-h-16 items-center justify-between border border-[var(--color-border)] bg-white px-5 text-left"><span><strong className="block text-sm">Add or update products</strong><span className="mt-1 block text-xs text-[var(--color-muted)]">Manage imagery, pricing and stock.</span></span><ArrowRight size={17}/></button>
          <button onClick={() => navigate('/seller/inventory')} className="flex min-h-16 items-center justify-between border border-[var(--color-border)] bg-white px-5 text-left"><span><strong className="block text-sm">Review inventory</strong><span className="mt-1 block text-xs text-[var(--color-muted)]">Find low and unavailable variants.</span></span><ArrowRight size={17}/></button>
        </aside>
      </div>
    </AdminShell>
  );
}
