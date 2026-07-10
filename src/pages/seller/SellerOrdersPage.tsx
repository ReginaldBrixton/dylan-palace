import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import AdminShell from '../../components/admin/AdminShell';
import StatusBadge from '../../components/admin/StatusBadge';
import { fetchOrderItems, fetchOrders, updateOrderStatus } from '../../lib/api';
import type { Order, OrderItem, OrderStatus } from '../../lib/database.types';
import { CURRENCY } from '../../constants';

const statuses: Array<OrderStatus | 'all'> = ['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');
  const [selected, setSelected] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [updating, setUpdating] = useState(false);

  const load = useCallback(async () => { setLoading(true); try { setOrders(await fetchOrders()); } finally { setLoading(false); } }, []);
  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return orders.filter((order) => (filter === 'all' || order.status === filter) && (!query || [order.order_number, order.full_name, order.email, order.phone].join(' ').toLowerCase().includes(query)));
  }, [orders, search, filter]);

  const openOrder = async (order: Order) => { setSelected(order); setItems(await fetchOrderItems(order.id)); };
  const changeStatus = async (status: OrderStatus) => {
    if (!selected) return;
    setUpdating(true);
    try { const next = await updateOrderStatus(selected.id, status); setSelected(next); setOrders((current) => current.map((order) => order.id === next.id ? next : order)); }
    finally { setUpdating(false); }
  };

  return (
    <AdminShell title="Orders" description={`${orders.length} orders recorded across all fulfilment states.`}>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row"><label className="relative min-w-0 flex-1"><span className="sr-only">Search orders</span><Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)]"/><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search order, customer, email or phone" className="h-12 w-full border border-[var(--color-border)] bg-white pl-11 pr-4 text-sm outline-none focus:border-[var(--color-ink)]"/></label><select value={filter} onChange={(event) => setFilter(event.target.value as OrderStatus | 'all')} className="h-12 border border-[var(--color-border)] bg-white px-4 text-sm">{statuses.map((status) => <option key={status} value={status}>{status === 'all' ? 'All statuses' : status}</option>)}</select></div>
      {loading ? <div className="grid gap-2">{Array.from({ length: 6 }).map((_, index) => <div key={index} className="h-16 animate-pulse bg-white"/>)}</div> : filtered.length === 0 ? <div className="border border-dashed border-[var(--color-border-strong)] bg-white p-12 text-center text-sm text-[var(--color-muted)]">No matching orders.</div> : <div className="overflow-hidden border border-[var(--color-border)] bg-white"><div className="overflow-x-auto"><table className="w-full min-w-[760px]"><thead><tr className="border-b border-[var(--color-border)] text-left text-[10px] uppercase tracking-[0.13em] text-[var(--color-muted)]"><th className="px-5 py-3">Order</th><th className="px-5 py-3">Customer</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Payment</th><th className="px-5 py-3">Date</th><th className="px-5 py-3 text-right">Total</th></tr></thead><tbody>{filtered.map((order) => <tr key={order.id} onClick={() => openOrder(order)} className="cursor-pointer border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-canvas)]"><td className="px-5 py-4 text-sm font-semibold">{order.order_number}</td><td className="px-5 py-4"><p className="text-sm">{order.full_name}</p><p className="mt-1 text-xs text-[var(--color-muted)]">{order.email}</p></td><td className="px-5 py-4"><StatusBadge status={order.status}/></td><td className="px-5 py-4"><StatusBadge status={order.payment_status || 'pending'}/></td><td className="px-5 py-4 text-xs text-[var(--color-muted)]">{new Date(order.created_at).toLocaleDateString()}</td><td className="px-5 py-4 text-right text-sm font-semibold">{CURRENCY}{order.total_amount.toFixed(2)}</td></tr>)}</tbody></table></div></div>}

      {selected ? <div className="fixed inset-0 z-[80] bg-black/45"><button type="button" className="absolute inset-0 h-full w-full" onClick={() => setSelected(null)} aria-label="Close order details"/><aside className="absolute inset-y-0 right-0 w-full max-w-xl overflow-y-auto bg-white shadow-[var(--shadow-drawer)]"><header className="sticky top-0 z-10 flex items-start justify-between border-b border-[var(--color-border)] bg-white px-5 py-4"><div><h2 className="font-serif text-2xl font-bold">{selected.order_number}</h2><p className="mt-1 text-xs text-[var(--color-muted)]">{new Date(selected.created_at).toLocaleString()}</p></div><button onClick={() => setSelected(null)} className="grid size-10 place-items-center rounded-full bg-[var(--color-surface-subtle)]" aria-label="Close"><X size={18}/></button></header><div className="grid gap-6 p-5"><section><h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">Fulfilment status</h3><div className="mt-3 flex flex-wrap gap-2">{statuses.filter((status): status is OrderStatus => status !== 'all').map((status) => <button key={status} disabled={updating} onClick={() => changeStatus(status)} className={`rounded-full border px-3 py-2 text-xs font-semibold capitalize ${selected.status === status ? 'border-[var(--color-ink)] bg-[var(--color-ink)] text-white' : 'border-[var(--color-border)]'}`}>{status}</button>)}</div></section><section className="bg-[var(--color-canvas)] p-4"><h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">Customer and delivery</h3><div className="mt-3 grid gap-1 text-sm"><strong>{selected.full_name}</strong><span>{selected.email}</span><span>{selected.phone}</span><span className="mt-2">{selected.address}, {selected.city}{selected.zip ? ` · ${selected.zip}` : ''}</span></div></section><section><h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">Items</h3><div className="mt-3 grid gap-3">{items.map((item) => <div key={item.id} className="grid grid-cols-[56px_1fr_auto] gap-3 border-b border-[var(--color-border)] pb-3"><img src={item.product_image || ''} alt="" className="h-16 w-14 bg-[var(--color-surface-subtle)] object-cover"/><div><p className="text-sm font-semibold">{item.product_name}</p><p className="mt-1 text-xs text-[var(--color-muted)]">Size {item.size || '—'} · Qty {item.quantity}</p></div><p className="text-sm font-semibold">{CURRENCY}{(item.unit_price * item.quantity).toFixed(2)}</p></div>)}</div></section><div className="flex justify-between border-t border-[var(--color-border-strong)] pt-4 text-lg font-bold"><span>Total</span><span>{CURRENCY}{selected.total_amount.toFixed(2)}</span></div></div></aside></div> : null}
    </AdminShell>
  );
}
