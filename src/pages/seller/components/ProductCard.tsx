import React from 'react';
import { motion } from 'motion/react';
import { Pencil, Trash2, Package } from 'lucide-react';
import type { Product } from '../../../lib/database.types';
import { CURRENCY } from '../../../constants';
import { productImages, productCategoryName } from '../utils/productHelpers';

interface ProductCardProps {
  product: Product;
  index: number;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index, onEdit, onDelete }) => {
  return (
    <motion.div
      key={product.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-xl border border-[#E5E5E5] overflow-hidden group"
    >
      <div className="aspect-square bg-[#F5F5F4] overflow-hidden relative">
        {productImages(product)[0] ? (
          <img src={productImages(product)[0]} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
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
          {productCategoryName(product)}
        </p>
        <h3 className="text-sm font-bold text-[#111111] truncate mb-1">{product.name}</h3>
        <p className="font-serif text-lg font-bold text-[#111111] mb-3">
          {CURRENCY}{product.price.toFixed(2)}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(product)}
            className="flex-1 flex items-center justify-center gap-1.5 bg-[#F5F5F4] text-[#111111] py-2 rounded-lg text-xs font-semibold hover:bg-[#E5E5E5] transition-colors cursor-pointer"
          >
            <Pencil size={12} /> Edit
          </button>
          <button
            onClick={() => onDelete(product)}
            className="flex items-center justify-center gap-1.5 bg-red-50 text-red-600 px-3 py-2 rounded-lg text-xs font-semibold hover:bg-red-100 transition-colors cursor-pointer"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default ProductCard;
