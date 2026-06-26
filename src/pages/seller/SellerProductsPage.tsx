import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Package, ArrowLeft, Search } from 'lucide-react';
import {
  fetchAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../../lib/api';
import { uploadFile, deleteFile } from '../../lib/uploadthing';
import { analyzeProductImage, analyzeProductFile, type AIProductSuggestion } from '../../lib/ai';
import type { Product, ProductCategory } from '../../lib/database.types';
import { invalidateCache } from '../../lib/product-cache';
import {
  productImages,
  productCategoryName,
  productToForm,
  emptyForm,
  type ProductForm,
} from './utils/productHelpers';
import ProductCard from './components/ProductCard';
import ProductFormModal from './components/ProductFormModal';

export default function SellerProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState('');
  const [pendingFiles, setPendingFiles] = useState<{ file: File; previewUrl: string }[]>([]);

  const load = useCallback(async () => {
    try {
      const data = await fetchAllProducts();
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    productCategoryName(p).toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setPendingFiles([]);
    setShowModal(true);
  };

  const handleOpenEdit = (product: Product) => {
    setForm(productToForm(product));
    setEditingId(product.id);
    setPendingFiles([]);
    setShowModal(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newPending = Array.from(files).map((file: File) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setPendingFiles((prev) => [...prev, ...newPending]);
    e.target.value = '';
  };

  const handleAIAnalyze = async () => {
    if (pendingFiles.length === 0 && form.images.length === 0) {
      setError('Please add an image first');
      return;
    }

    setAiLoading(true);
    setError('');
    try {
      let suggestion: AIProductSuggestion;
      if (pendingFiles.length > 0) {
        suggestion = await analyzeProductFile(pendingFiles[0].file);
      } else {
        suggestion = await analyzeProductImage(form.images[0]);
      }
      setForm((f) => ({
        ...f,
        name: suggestion.name,
        description: suggestion.description,
        brand: suggestion.brand,
        category: suggestion.category as ProductCategory,
        tags: suggestion.tags,
        colors: suggestion.colors,
      }));
    } catch (err: any) {
      console.error('[SellerProducts] AI analysis failed:', err);
      setError(`AI analysis failed: ${err.message}`);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSave = async () => {
    if (!form.name || !form.price) {
      setError('Name and price are required');
      return;
    }

    setSaving(true);
    setError('');
    try {
      const uploadedUrls: string[] = [];
      for (const pf of pendingFiles) {
        const result = await uploadFile(pf.file);
        uploadedUrls.push(result.url);
        URL.revokeObjectURL(pf.previewUrl);
      }

      const allImages = [...form.images, ...uploadedUrls];
      const productData = {
        name: form.name,
        brand: form.brand || null,
        category: form.category,
        price: parseFloat(form.price),
        description: form.description || null,
        images: allImages,
        sizes: form.sizes,
        colors: form.colors,
        in_stock: form.in_stock,
        stock_quantity: parseInt(form.stock_quantity) || 0,
        is_featured: form.is_featured,
        tags: form.tags,
      };

      if (editingId) {
        await updateProduct(editingId, productData);
      } else {
        await createProduct(productData);
      }

      invalidateCache();
      setShowModal(false);
      setPendingFiles([]);
      await load();
    } catch (err: any) {
      console.error('[SellerProducts] Save failed:', err);
      setError(`Save failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product: Product) => {
    if (!confirm(`Delete "${product.name}"? This will also delete all associated images from UploadThing.`)) return;
    try {
      const images = productImages(product);
      for (const imgUrl of images) {
        try {
          const urlParts = imgUrl.split('/');
          const fileKey = urlParts[urlParts.length - 1].split('.')[0];
          if (fileKey) await deleteFile(fileKey);
        } catch (e) {
          console.warn('Failed to delete image from UploadThing:', e);
        }
      }
      await deleteProduct(product.id);
      invalidateCache();
      await load();
    } catch (err: any) {
      setError(`Delete failed: ${err.message}`);
    }
  };

  const removeImage = (idx: number) => {
    if (idx < form.images.length) {
      const imgUrl = form.images[idx];
      try {
        const urlParts = imgUrl.split('/');
        const fileKey = urlParts[urlParts.length - 1].split('.')[0];
        if (fileKey) deleteFile(fileKey).catch(() => { });
      } catch {
        // ignore
      }
      setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
    } else {
      const pendingIdx = idx - form.images.length;
      setPendingFiles((prev) => {
        const item = prev[pendingIdx];
        if (item) URL.revokeObjectURL(item.previewUrl);
        return prev.filter((_, i) => i !== pendingIdx);
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F8] flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#111111] text-white flex flex-col shrink-0">
        <div className="p-6 border-b border-[#333]">
          <h1 className="font-serif text-xl font-bold uppercase tracking-tighter">Dylan's Palace</h1>
          <p className="text-[10px] uppercase tracking-widest text-[#8B8B8A] mt-0.5">Seller Portal</p>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-1">
          {[
            { label: 'Dashboard', path: '/seller', icon: ArrowLeft },
            { label: 'Products', path: '/seller/products', icon: Package },
          ].map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-[#ccc] hover:bg-[#1a1a1a] hover:text-white transition-all cursor-pointer"
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#111111] uppercase tracking-tighter mb-1">
                Products
              </h2>
              <p className="text-sm text-[#8B8B8A]">{products.length} products in catalog</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleOpenAdd}
              className="flex items-center gap-2 bg-[#111111] text-white px-5 py-3.5 rounded-xl text-sm font-semibold uppercase tracking-widest hover:bg-[#333] transition-colors cursor-pointer shadow-lg"
            >
              <Plus size={16} /> Add Product
            </motion.button>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B8B8A]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-white border border-[#E5E5E5] rounded-xl pl-10 pr-4 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#111111] transition-all"
            />
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-[#E5E5E5] overflow-hidden">
                  <div className="aspect-square bg-[#E5E5E5]/50" />
                  <div className="p-4 flex flex-col gap-2">
                    <div className="h-3 w-2/3 bg-[#E5E5E5] rounded-full" />
                    <div className="h-4 w-1/3 bg-[#E5E5E5] rounded-full" />
                    <div className="flex gap-2 mt-2">
                      <div className="h-8 flex-1 bg-[#E5E5E5]/50 rounded-lg" />
                      <div className="h-8 w-12 bg-[#E5E5E5]/50 rounded-lg" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <Package size={32} className="text-[#E5E5E5] mx-auto mb-3" />
              <p className="text-sm text-[#8B8B8A]">No products found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={i}
                  onEdit={handleOpenEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <ProductFormModal
            editingId={editingId}
            form={form}
            setForm={setForm}
            error={error}
            saving={saving}
            aiLoading={aiLoading}
            pendingFiles={pendingFiles}
            onClose={() => setShowModal(false)}
            onSave={handleSave}
            onFileUpload={handleFileUpload}
            onAIAnalyze={handleAIAnalyze}
            onRemoveImage={removeImage}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
