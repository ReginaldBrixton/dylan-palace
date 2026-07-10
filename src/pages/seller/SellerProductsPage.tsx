import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import AdminShell from '../../components/admin/AdminShell';
import { deleteAdminProduct, fetchAdminProducts, saveAdminProduct } from '../../lib/api/adminProducts';
import { uploadFile, deleteFile } from '../../lib/uploadthing';
import { analyzeProductFile, analyzeProductImage, type AIProductSuggestion } from '../../lib/ai';
import type { Product, ProductCategory } from '../../lib/database.types';
import { invalidateCache } from '../../lib/product-cache';
import { emptyForm, productCategoryName, productImages, productToForm, type ProductForm } from './utils/productHelpers';
import ProductCard from './components/ProductCard';
import ProductFormModal from './components/ProductFormModal';

export default function SellerProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState('');
  const [pendingFiles, setPendingFiles] = useState<Array<{ file: File; previewUrl: string }>>([]);

  const load = useCallback(async () => { setLoading(true); try { setProducts(await fetchAdminProducts()); } finally { setLoading(false); } }, []);
  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => { const query = search.trim().toLowerCase(); return products.filter((product) => !query || [product.name, product.brand, productCategoryName(product)].filter(Boolean).join(' ').toLowerCase().includes(query)); }, [products, search]);
  const openAdd = () => { setForm(emptyForm); setEditingId(null); setPendingFiles([]); setError(''); setShowModal(true); };
  const openEdit = (product: Product) => { setForm(productToForm(product)); setEditingId(product.id); setPendingFiles([]); setError(''); setShowModal(true); };
  const upload = (event: React.ChangeEvent<HTMLInputElement>) => { const files = event.target.files; if (!files) return; setPendingFiles((current) => [...current, ...Array.from(files).map((file) => ({ file, previewUrl: URL.createObjectURL(file) }))]); event.target.value = ''; };
  const analyze = async () => { if (pendingFiles.length === 0 && form.images.length === 0) { setError('Add at least one product image first.'); return; } setAiLoading(true); setError(''); try { const suggestion: AIProductSuggestion = pendingFiles[0] ? await analyzeProductFile(pendingFiles[0].file) : await analyzeProductImage(form.images[0]); setForm((current) => ({ ...current, name: suggestion.name, description: suggestion.description, brand: suggestion.brand, category: suggestion.category as ProductCategory, tags: suggestion.tags, colors: suggestion.colors })); } catch (reason) { setError(reason instanceof Error ? reason.message : 'Image analysis failed.'); } finally { setAiLoading(false); } };
  const save = async () => {
    if (!form.name.trim() || !form.price) { setError('Name and price are required.'); return; }
    if (form.images.length + pendingFiles.length === 0) { setError('Add at least one product image. Three or more views are recommended.'); return; }
    setSaving(true); setError('');
    try {
      const uploadedUrls: string[] = [];
      for (const pending of pendingFiles) { const result = await uploadFile(pending.file); uploadedUrls.push(result.url); URL.revokeObjectURL(pending.previewUrl); }
      await saveAdminProduct(editingId, {
        name: form.name.trim(), brand: form.brand || null, category: form.category, price: Number(form.price), description: form.description || null,
        images: [...form.images, ...uploadedUrls], sizes: form.sizes, colors: form.colors, in_stock: form.in_stock,
        stock_quantity: Number(form.stock_quantity) || 0, is_featured: form.is_featured, tags: form.tags,
      });
      invalidateCache(); setShowModal(false); setPendingFiles([]); await load();
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Product could not be saved.'); }
    finally { setSaving(false); }
  };
  const removeImage = (index: number) => { if (index < form.images.length) setForm((current) => ({ ...current, images: current.images.filter((_, itemIndex) => itemIndex !== index) })); else { const pendingIndex = index - form.images.length; setPendingFiles((current) => current.filter((item, itemIndex) => { if (itemIndex === pendingIndex) URL.revokeObjectURL(item.previewUrl); return itemIndex !== pendingIndex; })); } };
  const removeProduct = async (product: Product) => { if (!window.confirm(`Delete ${product.name}?`)) return; for (const image of productImages(product)) { try { const key = image.split('/').pop()?.split('.')[0]; if (key) await deleteFile(key); } catch { /* storage cleanup is best effort */ } } await deleteAdminProduct(product.id); invalidateCache(); await load(); };

  const action = <button type="button" onClick={openAdd} className="flex h-11 items-center gap-2 bg-[var(--color-ink)] px-4 text-xs font-bold uppercase tracking-[0.13em] text-white"><Plus size={16}/> Add product</button>;
  return <AdminShell title="Products" description={`${products.length} products across the current catalogue.`} actions={action}><label className="relative mb-5 block max-w-xl"><span className="sr-only">Search products</span><Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)]"/><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, brand or category" className="h-12 w-full border border-[var(--color-border)] bg-white pl-11 pr-4 text-sm outline-none focus:border-[var(--color-ink)]"/></label>{loading ? <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">{Array.from({ length: 8 }).map((_, index) => <div key={index} className="aspect-[4/5] animate-pulse bg-white"/>)}</div> : <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">{filtered.map((product, index) => <ProductCard key={product.id} product={product} index={index} onEdit={openEdit} onDelete={removeProduct}/>)}</div>}<AnimatePresence>{showModal ? <ProductFormModal editingId={editingId} form={form} setForm={setForm} error={error} saving={saving} aiLoading={aiLoading} pendingFiles={pendingFiles} onClose={() => setShowModal(false)} onSave={save} onFileUpload={upload} onAIAnalyze={analyze} onRemoveImage={removeImage}/> : null}</AnimatePresence></AdminShell>;
}
