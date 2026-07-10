import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Boxes, Minus, Plus, Search, X } from 'lucide-react';
import AdminShell from '../../components/admin/AdminShell';
import StatusBadge from '../../components/admin/StatusBadge';
import { adjustVariantInventory, fetchInventoryMovements, fetchInventoryVariants, type InventoryVariantRow } from '../../lib/api/admin';
import type { InventoryMovement } from '../../lib/database.types';

export default function SellerInventoryPage() {
  const [variants, setVariants] = useState<InventoryVariantRow[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'low' | 'out'>('all');
  const [selected, setSelected] = useState<InventoryVariantRow | null>(null);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [delta, setDelta] = useState(1);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => setVariants(await fetchInventoryVariants()), []);
  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return variants.filter((variant) => {
      const matchesSearch = !query || [variant.product.name, variant.product.brand, variant.sku, variant.size, variant.color].filter(Boolean).join(' ').toLowerCase().includes(query);
      const matchesFilter = filter === 'all' || (filter === 'out' ? variant.stock_quantity === 0 : variant.stock_quantity > 0 && variant.stock_quantity <= 3);
      return matchesSearch && matchesFilter;
    });
  }, [variants, search, filter]);

  const open = async (variant: InventoryVariantRow) => { setSelected(variant); setDelta(1); setNote(''); setError(''); setMovements(await fetchInventoryMovements(variant.id)); };
  const adjust = async () => {
    if (!selected || delta === 0) return;
    setSaving(true); setError('');
    try {
      const quantity = await adjustVariantInventory(selected.id, delta, note);
      setVariants((current) => current.map((variant) => variant.id === selected.id ? { ...variant, stock_quantity: quantity } : variant));
      setSelected((current) => current ? { ...current, stock_quantity: quantity } : null);
      setMovements(await fetchInventoryMovements(selected.id));
      setDelta(1); setNote('');
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Inventory could not be adjusted.'); }
    finally { setSaving(false); }
  };

  const status = (quantity: number) => quantity === 0 ? 'out' : quantity <= 3 ? 'low' : 'active';

  return (
    <AdminShell title="Inventory" description="Variant-level stock with an auditable movement history.">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row"><label className="relative min-w-0 flex-1"><span className="sr-only">Search inventory</span><Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)]"/><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search product, SKU, size or colour" className="h-12 w-full border border-[var(--color-border)] bg-white pl-11 pr-4 text-sm outline-none focus:border-[var(--color-ink)]"/></label><select value={filter} onChange={(event) => setFilter(event.target.value as typeof filter)} className="h-12 border border-[var(--color-border)] bg-white px-4 text-sm"><option value="all">All stock</option><option value="low">Low stock</option><option value="out">Out of stock</option></select></div>
      {filtered.length === 0 ? <div className="border border-dashed border-[var(--color-border-strong)] bg-white p-12 text-center"><Boxes className="mx-auto text-[var(--color-muted)]"/><p className="mt-3 text-sm text-[var(--color-muted)]">No matching inventory variants.</p></div> : <div className="overflow-hidden border border-[var(--color-border)] bg-white"><div className="overflow-x-auto"><table className="w-full min-w-[760px]"><thead><tr className="border-b border-[var(--color-border)] text-left text-[10px] uppercase tracking-[0.13em] text-[var(--color-muted)]"><th className="px-5 py-3">Product</th><th className="px-5 py-3">SKU</th><th className="px-5 py-3">Variant</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Quantity</th></tr></thead><tbody>{filtered.map((variant) => { const image = [...(variant.product.product_images || [])].sort((a,b) => a.position - b.position)[0]?.url; return <tr key={variant.id} onClick={() => open(variant)} className="cursor-pointer border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-canvas)]"><td className="px-5 py-4"><div className="flex items-center gap-3">{image ? <img src={image} alt="" className="h-12 w-10 object-cover"/> : <span className="h-12 w-10 bg-[var(--color-surface-subtle)]"/>}<div><p className="text-sm font-semibold">{variant.product.name}</p><p className="mt-1 text-xs text-[var(--color-muted)]">{variant.product.brand || 'Dylan’s Palace'}</p></div></div></td><td className="px-5 py-4 font-mono text-xs">{variant.sku}</td><td className="px-5 py-4 text-sm">{variant.size}{variant.color ? ` · ${variant.color}` : ''}</td><td className="px-5 py-4"><StatusBadge status={status(variant.stock_quantity)}/></td><td className="px-5 py-4 text-right text-lg font-bold">{variant.stock_quantity}</td></tr>; })}</tbody></table></div></div>}

      {selected ? <div className="fixed inset-0 z-[80] bg-black/45"><button className="absolute inset-0 h-full w-full" onClick={() => setSelected(null)} aria-label="Close inventory adjustment"/><aside className="absolute inset-y-0 right-0 w-full max-w-lg overflow-y-auto bg-white shadow-[var(--shadow-drawer)]"><header className="sticky top-0 flex items-start justify-between border-b border-[var(--color-border)] bg-white p-5"><div><h2 className="font-serif text-2xl font-bold">{selected.product.name}</h2><p className="mt-1 text-xs text-[var(--color-muted)]">{selected.sku} · {selected.size}{selected.color ? ` · ${selected.color}` : ''}</p></div><button onClick={() => setSelected(null)} className="grid size-10 place-items-center rounded-full bg-[var(--color-surface-subtle)]" aria-label="Close"><X size={18}/></button></header><div className="grid gap-6 p-5"><section className="bg-[var(--color-canvas)] p-5"><p className="text-xs uppercase tracking-[0.14em] text-[var(--color-muted)]">Current quantity</p><p className="mt-2 text-4xl font-bold">{selected.stock_quantity}</p></section><section><h3 className="text-sm font-semibold">Adjust stock</h3><div className="mt-3 flex items-center gap-3"><button onClick={() => setDelta((value) => value - 1)} className="grid size-12 place-items-center border border-[var(--color-border)]"><Minus size={18}/></button><input type="number" value={delta} onChange={(event) => setDelta(Number(event.target.value))} className="h-12 min-w-0 flex-1 border border-[var(--color-border)] px-4 text-center text-lg font-bold"/><button onClick={() => setDelta((value) => value + 1)} className="grid size-12 place-items-center border border-[var(--color-border)]"><Plus size={18}/></button></div><textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Reason for adjustment" className="mt-3 min-h-24 w-full border border-[var(--color-border)] p-3 text-sm"/>{error ? <p className="mt-2 text-sm text-[var(--color-danger)]">{error}</p> : null}<button onClick={adjust} disabled={saving || delta === 0} className="mt-4 h-12 w-full bg-[var(--color-ink)] text-xs font-bold uppercase tracking-[0.14em] text-white disabled:opacity-50">{saving ? 'Saving…' : 'Apply adjustment'}</button></section><section><h3 className="text-sm font-semibold">Recent movements</h3><div className="mt-3 grid gap-2">{movements.length === 0 ? <p className="text-sm text-[var(--color-muted)]">No recorded adjustments.</p> : movements.map((movement) => <div key={movement.id} className="flex items-start justify-between border-b border-[var(--color-border)] py-3"><div><p className="text-sm font-medium capitalize">{movement.reason.replace('_',' ')}</p><p className="mt-1 text-xs text-[var(--color-muted)]">{movement.note || new Date(movement.created_at).toLocaleString()}</p></div><span className={`font-bold ${movement.delta > 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}`}>{movement.delta > 0 ? '+' : ''}{movement.delta}</span></div>)}</div></section></div></aside></div> : null}
    </AdminShell>
  );
}
