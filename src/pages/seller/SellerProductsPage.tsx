import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Upload,
  Sparkles,
  Loader2,
  Package,
  ArrowLeft,
  Search,
} from 'lucide-react';
import { useSellerAuth } from '../../context/SellerAuthContext';
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../../lib/api';
import { uploadFile, deleteFile } from '../../lib/uploadthing';
import { analyzeProductImage, type AIProductSuggestion } from '../../lib/ai';
import type { Product, ProductCategory } from '../../lib/database.types';
import { CURRENCY } from '../../constants';

const CATEGORIES: ProductCategory[] = ['SHIRTS', 'TROUSERS', 'SHOES', 'BAGS'];

interface ProductForm {
  name: string;
  brand: string;
  category: ProductCategory;
  price: string;
  description: string;
  images: string[];
  sizes: string[];
  colors: string[];
  in_stock: boolean;
  stock_quantity: string;
  is_featured: boolean;
  tags: string[];
}

const emptyForm: ProductForm = {
  name: '',
  brand: '',
  category: 'SHIRTS',
  price: '',
  description: '',
  images: [],
  sizes: [],
  colors: [],
  in_stock: true,
  stock_quantity: '0',
  is_featured: false,
  tags: [],
};

export default function SellerProducts() {
  const navigate = useNavigate();
  const { profile } = useSellerAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      // Fetch all products (including out of stock) - seller view
      const data = await fetchProducts();
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
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowModal(true);
  };

  const handleOpenEdit = (product: Product) => {
    setForm({
      name: product.name,
      brand: product.brand || '',
      category: product.category,
      price: product.price.toString(),
      description: product.description || '',
      images: product.images,
      sizes: product.sizes,
      colors: product.colors,
      in_stock: product.in_stock,
      stock_quantity: product.stock_quantity.toString(),
      is_featured: product.is_featured,
      tags: product.tags,
    });
    setEditingId(product.id);
    setShowModal(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError('');
    try {
      const fileArray: File[] = Array.from(files);
      const uploaded = await uploadFile(fileArray[0]); // Upload first file
      const newImages = [...form.images, uploaded.url];
      setForm((f) => ({ ...f, images: newImages }));
    } catch (err: any) {
      setError(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleAIAnalyze = async () => {
    if (form.images.length === 0) {
      setError('Please upload an image first');
      return;
    }

    setAiLoading(true);
    setError('');
    try {
      const suggestion: AIProductSuggestion = await analyzeProductImage(form.images[0]);
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
      const productData = {
        name: form.name,
        brand: form.brand || null,
        category: form.category,
        price: parseFloat(form.price),
        description: form.description || null,
        images: form.images,
        sizes: form.sizes,
        colors: form.colors,
        in_stock: form.in_stock,
        stock_quantity: parseInt(form.stock_quantity) || 0,
        is_featured: form.is_featured,
        tags: form.tags,
        created_by: profile?.id || null,
      };

      if (editingId) {
        await updateProduct(editingId, productData);
      } else {
        await createProduct(productData);
      }

      setShowModal(false);
      await load();
    } catch (err: any) {
      setError(`Save failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product: Product) => {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    try {
      await deleteProduct(product.id);
      await load();
    } catch (err: any) {
      setError(`Delete failed: ${err.message}`);
    }
  };

  const removeImage = (idx: number) => {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
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
              className="flex items-center gap-2 bg-[#111111] text-white px-5 py-3 rounded-lg text-xs font-semibold uppercase tracking-widest hover:bg-[#333] transition-colors cursor-pointer"
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
              className="w-full bg-white border border-[#E5E5E5] rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#111111] transition-colors"
            />
          </div>

          {loading ? (
            <div className="text-center py-12 text-sm text-[#8B8B8A]">Loading products...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <Package size={32} className="text-[#E5E5E5] mx-auto mb-3" />
              <p className="text-sm text-[#8B8B8A]">No products found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-xl border border-[#E5E5E5] overflow-hidden group"
                >
                  <div className="aspect-square bg-[#F5F5F4] overflow-hidden relative">
                    {product.images[0] ? (
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Package size={24} className="text-[#E5E5E5]" />
                      </div>
                    )}
                    {!product.in_stock && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-bold uppercase px-2 py-1 rounded-full">
                        Out of Stock
                      </div>
                    )}
                    {product.is_featured && (
                      <div className="absolute top-2 right-2 bg-yellow-400 text-black text-[9px] font-bold uppercase px-2 py-1 rounded-full">
                        Featured
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-[9px] font-bold text-[#8B8B8A] uppercase tracking-wider mb-0.5">
                      {product.category}
                    </p>
                    <h3 className="text-sm font-bold text-[#111111] truncate mb-1">{product.name}</h3>
                    <p className="font-serif text-lg font-bold text-[#111111] mb-3">
                      {CURRENCY}{product.price.toFixed(2)}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenEdit(product)}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-[#F5F5F4] text-[#111111] py-2 rounded-lg text-xs font-semibold hover:bg-[#E5E5E5] transition-colors cursor-pointer"
                      >
                        <Pencil size={12} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product)}
                        className="flex items-center justify-center gap-1.5 bg-red-50 text-red-600 px-3 py-2 rounded-lg text-xs font-semibold hover:bg-red-100 transition-colors cursor-pointer"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-5 border-b border-[#E5E5E5] sticky top-0 bg-white z-10">
                <h3 className="font-bold text-base uppercase tracking-wider text-[#111111]">
                  {editingId ? 'Edit Product' : 'Add Product'}
                </h3>
                <button onClick={() => setShowModal(false)} className="text-[#8B8B8A] hover:text-[#111111] cursor-pointer">
                  <X size={20} />
                </button>
              </div>

              <div className="p-5 flex flex-col gap-4">
                {error && (
                  <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
                )}

                {/* Image Upload */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#8B8B8A]">
                    Product Images
                  </label>
                  <div className="flex gap-3 flex-wrap">
                    {form.images.map((img, idx) => (
                      <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-[#E5E5E5]">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <button
                          onClick={() => removeImage(idx)}
                          className="absolute top-0 right-0 bg-black/60 text-white p-0.5 rounded-bl-lg cursor-pointer"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    <label className="w-20 h-20 rounded-lg border-2 border-dashed border-[#E5E5E5] flex items-center justify-center cursor-pointer hover:border-[#111111] transition-colors">
                      {uploading ? (
                        <Loader2 size={18} className="animate-spin text-[#8B8B8A]" />
                      ) : (
                        <Upload size={18} className="text-[#8B8B8A]" />
                      )}
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </label>
                  </div>
                </div>

                {/* AI Auto-fill Button */}
                {form.images.length > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={handleAIAnalyze}
                    disabled={aiLoading}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg text-xs font-semibold uppercase tracking-widest hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
                  >
                    {aiLoading ? (
                      <><Loader2 size={14} className="animate-spin" /> AI Analyzing...</>
                    ) : (
                      <><Sparkles size={14} /> AI Auto-Fill from Image</>
                    )}
                  </motion.button>
                )}

                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#8B8B8A]">Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Product name"
                    className="border border-[#E5E5E5] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#111111] transition-colors"
                  />
                </div>

                {/* Brand & Category */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-[#8B8B8A]">Brand</label>
                    <input
                      type="text"
                      value={form.brand}
                      onChange={(e) => setForm({ ...form, brand: e.target.value })}
                      placeholder="Brand"
                      className="border border-[#E5E5E5] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#111111] transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-[#8B8B8A]">Category</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value as ProductCategory })}
                      className="border border-[#E5E5E5] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#111111] transition-colors"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Price & Stock */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-[#8B8B8A]">
                      Price ({CURRENCY})
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      placeholder="0.00"
                      className="border border-[#E5E5E5] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#111111] transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-[#8B8B8A]">Stock Qty</label>
                    <input
                      type="number"
                      value={form.stock_quantity}
                      onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })}
                      placeholder="0"
                      className="border border-[#E5E5E5] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#111111] transition-colors"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#8B8B8A]">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Product description"
                    rows={3}
                    className="border border-[#E5E5E5] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#111111] transition-colors resize-none"
                  />
                </div>

                {/* Sizes & Colors */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-[#8B8B8A]">
                      Sizes (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={form.sizes.join(', ')}
                      onChange={(e) => setForm({ ...form, sizes: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                      placeholder="S, M, L, XL"
                      className="border border-[#E5E5E5] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#111111] transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-[#8B8B8A]">
                      Colors (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={form.colors.join(', ')}
                      onChange={(e) => setForm({ ...form, colors: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                      placeholder="Black, White"
                      className="border border-[#E5E5E5] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#111111] transition-colors"
                    />
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#8B8B8A]">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={form.tags.join(', ')}
                    onChange={(e) => setForm({ ...form, tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                    placeholder="minimal, luxury, summer"
                    className="border border-[#E5E5E5] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#111111] transition-colors"
                  />
                </div>

                {/* Checkboxes */}
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.in_stock}
                      onChange={(e) => setForm({ ...form, in_stock: e.target.checked })}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <span className="text-sm text-[#111111]">In Stock</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.is_featured}
                      onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <span className="text-sm text-[#111111]">Featured</span>
                  </label>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-[#F5F5F4] text-[#111111] py-3 rounded-lg text-xs font-semibold uppercase tracking-widest hover:bg-[#E5E5E5] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 bg-[#111111] text-white py-3 rounded-lg text-xs font-semibold uppercase tracking-widest hover:bg-[#333] transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Product'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
