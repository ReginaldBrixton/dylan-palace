export type ProductCategory = 'SHIRTS' | 'TROUSERS' | 'SHOES' | 'BAGS';

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
  deliversBy: string;
}

export interface CartItem {
  id: string;
  product: Product;
  selectedSize: string;
  quantity: number;
}
