// Database types matching the Supabase schema

export type ProductCategory = 'SHIRTS' | 'TROUSERS' | 'SHOES' | 'BAGS';
export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentMethod = 'MOMO' | 'DELIVERY';
export type UserRole = 'customer' | 'seller';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string | null;
  category: ProductCategory;
  price: number;
  description: string | null;
  images: string[];
  sizes: string[];
  colors: string[];
  in_stock: boolean;
  stock_quantity: number;
  is_featured: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string | null;
  status: OrderStatus;
  total_amount: number;
  subtotal: number;
  shipping_cost: number;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zip: string | null;
  payment_method: PaymentMethod;
  momo_network: string | null;
  momo_number: string | null;
  tracking_number: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image: string | null;
  size: string | null;
  quantity: number;
  unit_price: number;
  created_at: string;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
}
