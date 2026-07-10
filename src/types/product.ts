export type ProductCategory = 'SHIRTS' | 'TROUSERS' | 'SHOES' | 'BAGS';

export interface ProductVariant {
  id: string;
  sku: string;
  size: string;
  color?: string;
  price?: number;
  stockQuantity: number;
  active: boolean;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: ProductCategory;
  subCategory?: string;
  brand?: string;
  gender?: 'MALE' | 'FEMALE' | 'UNISEX';
  images: string[];
  description: string;
  sizes: string[];
  variants?: ProductVariant[];
  deliversBy: string;
}

export interface CartItem {
  id: string;
  product: Product;
  selectedSize: string;
  selectedVariantId?: string;
  quantity: number;
}
