import type { Product, ProductCategory } from '../../../lib/database.types';

export const CATEGORIES: ProductCategory[] = ['SHIRTS', 'TROUSERS', 'SHOES', 'BAGS'];

export function productImages(p: Product): string[] {
  return (p.product_images || []).sort((a, b) => a.position - b.position).map((img) => img.url);
}

export function productSizes(p: Product): string[] {
  return (p.product_sizes || []).map((s) => s.size);
}

export function productCategoryName(p: Product): ProductCategory {
  return (p.category?.name || 'SHIRTS') as ProductCategory;
}

export interface ProductForm {
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

export const emptyForm: ProductForm = {
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

export function productToForm(product: Product): ProductForm {
  return {
    name: product.name,
    brand: product.brand || '',
    category: productCategoryName(product),
    price: product.price.toString(),
    description: product.description || '',
    images: productImages(product),
    sizes: productSizes(product),
    colors: product.colors || [],
    in_stock: product.in_stock,
    stock_quantity: product.stock_quantity.toString(),
    is_featured: product.is_featured,
    tags: product.tags || [],
  };
}
