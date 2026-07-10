export type ProductCategoryName = 'SHIRTS' | 'TROUSERS' | 'SHOES' | 'BAGS';
export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'verified' | 'failed' | 'refunded';
export type PaymentMethod = 'MOMO' | 'DELIVERY';
export type UserRole = 'customer' | 'seller';
export type Gender = 'MALE' | 'FEMALE' | 'UNISEX';
export type InventoryReason = 'order' | 'manual_adjustment' | 'restock' | 'return' | 'cancellation';
export type ProductCategory = ProductCategoryName;

export interface Profile {
  id: string; email: string; full_name: string | null; role: UserRole; phone: string | null; created_at: string; updated_at: string;
}

export interface Category { id: number; name: ProductCategoryName; display_name: string; slug: string; }
export interface SubCategory { id: number; name: string; display_name: string; slug: string; category_id: number; }
export interface ProductImage { id: string; product_id: string; url: string; alt_text: string | null; position: number; created_at: string; }
export interface ProductSize { id: string; product_id: string; size: string; in_stock: boolean; }

export interface ProductVariant {
  id: string;
  product_id: string;
  sku: string;
  size: string;
  color: string | null;
  price_override: number | null;
  stock_quantity: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string | null;
  category_id: number;
  sub_category_id: number | null;
  price: number;
  description: string | null;
  gender: Gender | null;
  in_stock: boolean;
  stock_quantity: number;
  is_featured: boolean;
  tags: string[];
  colors: string[];
  created_by: string | null;
  created_at: string;
  updated_at: string;
  category?: Category;
  sub_category?: SubCategory | null;
  product_images?: ProductImage[];
  product_sizes?: ProductSize[];
  product_variants?: ProductVariant[];
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string | null;
  status: OrderStatus;
  payment_status: PaymentStatus;
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
  id: string; order_id: string; product_id: string; variant_id: string | null; product_name: string; product_image: string | null; size: string | null; quantity: number; unit_price: number; created_at: string;
}

export interface InventoryMovement { id: string; variant_id: string; actor_id: string | null; delta: number; reason: InventoryReason; note: string | null; created_at: string; }
export interface OrderStatusEvent { id: string; order_id: string; actor_id: string | null; from_status: OrderStatus | null; to_status: OrderStatus; note: string | null; created_at: string; }
export interface StoreSetting { key: string; value: Record<string, unknown>; updated_by: string | null; updated_at: string; }
export interface WishlistItem { id: string; user_id: string; product_id: string; created_at: string; }
