import { supabase } from './supabase';
import type { Product, Order, OrderItem, Profile, ProductCategory, OrderStatus } from './database.types';

// ============================================
// PRODUCTS
// ============================================

export async function fetchProducts(category?: ProductCategory): Promise<Product[]> {
  let query = supabase.from('products').select('*').eq('in_stock', true);
  if (category) {
    query = query.eq('category', category);
  }
  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function fetchProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw error;
  }
  return data;
}

export async function fetchFeaturedProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_featured', true)
    .eq('in_stock', true)
    .limit(6);
  if (error) throw error;
  return data || [];
}

export async function createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
  const { data, error } = await supabase.from('products').insert(product).select().single();
  if (error) throw error;
  return data;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}

// ============================================
// ORDERS
// ============================================

export async function fetchOrders(status?: OrderStatus): Promise<Order[]> {
  let query = supabase.from('orders').select('*');
  if (status) {
    query = query.eq('status', status);
  }
  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function fetchOrderById(id: string): Promise<Order | null> {
  const { data, error } = await supabase.from('orders').select('*').eq('id', id).single();
  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function fetchOrderItems(orderId: string): Promise<OrderItem[]> {
  const { data, error } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', orderId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createOrder(
  order: Omit<Order, 'id' | 'created_at' | 'updated_at' | 'order_number'>,
  items: Omit<OrderItem, 'id' | 'created_at' | 'order_id'>[]
): Promise<Order> {
  // Generate order number
  const orderNumber = `DP-${Date.now().toString().slice(-8)}`;

  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .insert({ ...order, order_number: orderNumber })
    .select()
    .single();
  if (orderError) throw orderError;

  const orderItems = items.map((item) => ({
    ...item,
    order_id: orderData.id,
  }));

  const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
  if (itemsError) throw itemsError;

  return orderData;
}

export async function updateOrderStatus(id: string, status: OrderStatus, trackingNumber?: string): Promise<Order> {
  const updates: Partial<Order> = { status };
  if (trackingNumber) updates.tracking_number = trackingNumber;
  const { data, error } = await supabase
    .from('orders')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ============================================
// PROFILES / USERS
// ============================================

export async function fetchProfiles(): Promise<Profile[]> {
  const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function fetchProfile(id: string): Promise<Profile | null> {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

// ============================================
// WISHLIST
// ============================================

export async function fetchWishlist(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('wishlist')
    .select('product_id')
    .eq('user_id', userId);
  if (error) throw error;
  return (data || []).map((item) => item.product_id);
}

export async function addToWishlist(userId: string, productId: string): Promise<void> {
  const { error } = await supabase
    .from('wishlist')
    .insert({ user_id: userId, product_id: productId });
  if (error) throw error;
}

export async function removeFromWishlist(userId: string, productId: string): Promise<void> {
  const { error } = await supabase
    .from('wishlist')
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId);
  if (error) throw error;
}

// ============================================
// DASHBOARD STATS
// ============================================

export async function fetchDashboardStats() {
  const [productsResult, ordersResult, pendingOrdersResult, usersResult] = await Promise.all([
    supabase.from('products').select('id', { count: 'exact', head: true }),
    supabase.from('orders').select('id', { count: 'exact', head: true }),
    supabase.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
  ]);

  return {
    totalProducts: productsResult.count || 0,
    totalOrders: ordersResult.count || 0,
    pendingOrders: pendingOrdersResult.count || 0,
    totalUsers: usersResult.count || 0,
  };
}

export async function fetchRecentOrders(limit = 5): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data || [];
}
