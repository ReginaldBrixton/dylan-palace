import React from 'react';
import { Loader2, Sparkles, X } from 'lucide-react';
import { motion } from 'motion/react';
import { CURRENCY } from '../../../constants';
import type { ProductCategory } from '../../../lib/database.types';
import ProductMediaManager from '../../../components/admin/ProductMediaManager';
import { CATEGORIES, type ProductForm } from '../utils/productHelpers';

interface Props {
  editingId: string | null;
  form: ProductForm;
  setForm: React.Dispatch<React.SetStateAction<ProductForm>>;
  error: string;
  saving: boolean;
  aiLoading: boolean;
  pendingFiles: Array<{ file: File; previewUrl: string }>;
  onClose: () => void;
  onSave: () => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAIAnalyze: () => void;
  onRemoveImage: (index: number) => void;
  onMoveExisting: (index: number, direction: -1 | 1) => void;
  onMovePending: (index: number, direction: -1 | 1) => void;
}

const input = 'h-12 w-full border border-[var(--color-border)] bg-white px-4 text-sm outline-none focus:border-[var(--color-ink)]';
const label = 'grid gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-soft)]';

export default function ProductFormModal(props: Props) {
  const { editingId, form, setForm, error, saving, aiLoading, pendingFiles, onClose, onSave, onFileUpload, onAIAnalyze, onRemoveImage, onMoveExisting, onMovePending } = props;
  const update = <K extends keyof ProductForm>(key: K, value: ProductForm[K]) => setForm((current) => ({ ...current, [key]: value }));
  return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[90] bg-black/45 p-0 sm:p-4" onClick={onClose}><motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} onClick={(event) => event.stopPropagation()} className="ml-auto flex h-full w-full max-w-3xl flex-col overflow-hidden bg-[var(--color-canvas)] shadow-[var(--shadow-drawer)] sm:rounded-[var(--radius-lg)]"><header className="flex items-start justify-between border-b border-[var(--color-border)] bg-white px-5 py-4 sm:px-7"><div><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">Catalogue management</p><h2 className="mt-1 font-serif text-2xl font-bold">{editingId ? 'Edit product' : 'Add product'}</h2></div><button type="button" onClick={onClose} className="grid size-10 place-items-center rounded-full bg-[var(--color-surface-subtle)]" aria-label="Close"><X size={18}/></button></header><div className="flex-1 overflow-y-auto p-5 sm:p-7"><div className="grid gap-7"><ProductMediaManager images={form.images} pendingFiles={pendingFiles} onUpload={onFileUpload} onRemove={onRemoveImage} onMoveExisting={onMoveExisting} onMovePending={onMovePending}/>{(form.images.length > 0 || pendingFiles.length > 0) ? <button type="button" onClick={onAIAnalyze} disabled={aiLoading || saving} className="flex h-12 items-center justify-center gap-2 border border-violet-200 bg-violet-50 text-xs font-bold uppercase tracking-[0.13em] text-violet-800 disabled:opacity-50">{aiLoading ? <Loader2 size={16} className="animate-spin"/> : <Sparkles size={16}/>} {aiLoading ? 'Analysing image…' : 'Suggest product details from image'}</button> : null}<div className="grid gap-4 sm:grid-cols-2"><label className={`${label} sm:col-span-2`}>Name<input className={input} value={form.name} onChange={(event) => update('name', event.target.value)} placeholder="Product name"/></label><label className={label}>Brand<input className={input} value={form.brand} onChange={(event) => update('brand', event.target.value)} placeholder="Optional brand"/></label><label className={label}>Category<select className={input} value={form.category} onChange={(event) => update('category', event.target.value as ProductCategory)}>{CATEGORIES.map((category) => <option key={category}>{category}</option>)}</select></label><label className={label}>Price ({CURRENCY})<input type="number" min="0" step="0.01" className={input} value={form.price} onChange={(event) => update('price', event.target.value)}/></label><label className={label}>Total stock<input type="number" min="0" className={input} value={form.stock_quantity} onChange={(event) => update('stock_quantity', event.target.value)}/></label><label className={`${label} sm:col-span-2`}>Description<textarea className="min-h-28 w-full border border-[var(--color-border)] bg-white p-4 text-sm outline-none focus:border-[var(--color-ink)]" value={form.description} onChange={(event) => update('description', event.target.value)}/></label><label className={label}>Sizes<input className={input} value={form.sizes.join(', ')} onChange={(event) => update('sizes', event.target.value.split(',').map((value) => value.trim()).filter(Boolean))} placeholder="S, M, L, XL"/></label><label className={label}>Colours<input className={input} value={form.colors.join(', ')} onChange={(event) => update('colors', event.target.value.split(',').map((value) => value.trim()).filter(Boolean))} placeholder="Black, Cream"/></label><label className={`${label} sm:col-span-2`}>Tags<input className={input} value={form.tags.join(', ')} onChange={(event) => update('tags', event.target.value.split(',').map((value) => value.trim()).filter(Boolean))} placeholder="linen, summer, relaxed"/></label></div><div className="flex flex-wrap gap-5 border-t border-[var(--color-border)] pt-5"><label className="flex items-center gap-2 text-sm font-medium"><input type="checkbox" checked={form.in_stock} onChange={(event) => update('in_stock', event.target.checked)} className="size-4"/> Available for sale</label><label className="flex items-center gap-2 text-sm font-medium"><input type="checkbox" checked={form.is_featured} onChange={(event) => update('is_featured', event.target.checked)} className="size-4"/> Featured product</label></div>{error ? <p role="alert" className="border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</p> : null}</div></div><footer className="flex gap-3 border-t border-[var(--color-border)] bg-white p-4 sm:justify-end sm:px-7"><button type="button" onClick={onClose} className="h-12 flex-1 border border-[var(--color-border)] px-6 text-xs font-bold uppercase tracking-[0.13em] sm:flex-none">Cancel</button><button type="button" onClick={onSave} disabled={saving} className="h-12 flex-1 bg-[var(--color-ink)] px-7 text-xs font-bold uppercase tracking-[0.13em] text-white disabled:opacity-50 sm:flex-none">{saving ? 'Saving…' : 'Save product'}</button></footer></motion.div></motion.div>;
}
