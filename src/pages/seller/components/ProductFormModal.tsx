import { motion } from 'motion/react';
import {
  X,
  Upload,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { CURRENCY } from '../../../constants';
import type { ProductCategory } from '../../../lib/database.types';
import { CATEGORIES, type ProductForm } from '../utils/productHelpers';

interface ProductFormModalProps {
  editingId: string | null;
  form: ProductForm;
  setForm: React.Dispatch<React.SetStateAction<ProductForm>>;
  error: string;
  saving: boolean;
  aiLoading: boolean;
  pendingFiles: { file: File; previewUrl: string }[];
  onClose: () => void;
  onSave: () => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAIAnalyze: () => void;
  onRemoveImage: (idx: number) => void;
}

export default function ProductFormModal({
  editingId,
  form,
  setForm,
  error,
  saving,
  aiLoading,
  pendingFiles,
  onClose,
  onSave,
  onFileUpload,
  onAIAnalyze,
  onRemoveImage,
}: ProductFormModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
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
          <button onClick={onClose} className="text-[#8B8B8A] hover:text-[#111111] cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4">
          {error && (
            <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}

          {/* Image Upload */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] uppercase tracking-widest font-bold text-[#555555]">
              Product Images
            </label>
            <div className="flex gap-3 flex-wrap">
              {form.images.map((img, idx) => (
                <div key={`img-${idx}`} className="relative w-20 h-20 rounded-lg overflow-hidden border border-[#E5E5E5]">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={() => onRemoveImage(idx)}
                    className="absolute top-0 right-0 bg-black/60 text-white p-0.5 rounded-bl-lg cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              {pendingFiles.map((pf, idx) => (
                <div key={`pending-${idx}`} className="relative w-20 h-20 rounded-lg overflow-hidden border border-[#E5E5E5]">
                  <img src={pf.previewUrl} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={() => onRemoveImage(form.images.length + idx)}
                    className="absolute top-0 right-0 bg-black/60 text-white p-0.5 rounded-bl-lg cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              <label className="w-20 h-20 rounded-lg border-2 border-dashed border-[#E5E5E5] flex items-center justify-center cursor-pointer hover:border-[#111111] transition-colors">
                <Upload size={18} className="text-[#8B8B8A]" />
                <input type="file" accept="image/*" multiple onChange={onFileUpload} className="hidden" />
              </label>
            </div>
          </div>

          {/* AI Auto-fill Button */}
          {(form.images.length > 0 || pendingFiles.length > 0) && (
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={onAIAnalyze}
              disabled={aiLoading || saving}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3.5 rounded-xl text-sm font-semibold uppercase tracking-widest hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 shadow-md"
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
            <label className="text-[11px] uppercase tracking-widest font-bold text-[#555555]">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Product name"
              className="bg-[#F9F9F8] border border-[#E5E5E5] rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#111111] focus:bg-white transition-all"
            />
          </div>

          {/* Brand & Category */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] uppercase tracking-widest font-bold text-[#555555]">Brand</label>
              <input
                type="text"
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                placeholder="Brand"
                className="bg-[#F9F9F8] border border-[#E5E5E5] rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#111111] focus:bg-white transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] uppercase tracking-widest font-bold text-[#555555]">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as ProductCategory })}
                className="bg-[#F9F9F8] border border-[#E5E5E5] rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#111111] focus:bg-white transition-all cursor-pointer"
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
              <label className="text-[11px] uppercase tracking-widest font-bold text-[#555555]">
                Price ({CURRENCY})
              </label>
              <input
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="0.00"
                className="bg-[#F9F9F8] border border-[#E5E5E5] rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#111111] focus:bg-white transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] uppercase tracking-widest font-bold text-[#555555]">Stock Qty</label>
              <input
                type="number"
                value={form.stock_quantity}
                onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })}
                placeholder="0"
                className="bg-[#F9F9F8] border border-[#E5E5E5] rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#111111] focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-widest font-bold text-[#555555]">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Product description"
              rows={3}
              className="bg-[#F9F9F8] border border-[#E5E5E5] rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#111111] focus:bg-white transition-all resize-none"
            />
          </div>

          {/* Sizes & Colors */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] uppercase tracking-widest font-bold text-[#555555]">
                Sizes (comma-separated)
              </label>
              <input
                type="text"
                value={form.sizes.join(', ')}
                onChange={(e) => setForm({ ...form, sizes: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                placeholder="S, M, L, XL"
                className="bg-[#F9F9F8] border border-[#E5E5E5] rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#111111] focus:bg-white transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] uppercase tracking-widest font-bold text-[#555555]">
                Colors (comma-separated)
              </label>
              <input
                type="text"
                value={form.colors.join(', ')}
                onChange={(e) => setForm({ ...form, colors: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                placeholder="Black, White"
                className="bg-[#F9F9F8] border border-[#E5E5E5] rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#111111] focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-widest font-bold text-[#555555]">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={form.tags.join(', ')}
              onChange={(e) => setForm({ ...form, tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
              placeholder="minimal, luxury, summer"
              className="bg-[#F9F9F8] border border-[#E5E5E5] rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#111111] focus:bg-white transition-all"
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
              <span className="text-base text-[#111111]">In Stock</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                className="w-4 h-4 cursor-pointer"
              />
              <span className="text-base text-[#111111]">Featured</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 bg-[#F5F5F4] text-[#111111] py-3.5 rounded-xl text-sm font-semibold uppercase tracking-widest hover:bg-[#E5E5E5] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={onSave}
              disabled={saving}
              className="flex-1 bg-[#111111] text-white py-3.5 rounded-xl text-sm font-semibold uppercase tracking-widest hover:bg-[#333] transition-colors cursor-pointer disabled:opacity-50 shadow-lg"
            >
              {saving ? 'Saving...' : 'Save Product'}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
