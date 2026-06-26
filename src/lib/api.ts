import { supabase } from './supabase';
import type { Product, Order, OrderItem, Profile, ProductCategory, OrderStatus, Category, SubCategory } from './database.types';

// ============================================
// CATEGORIES
// ============================================

const categoryCache = new Map<string, Category>();

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase.from('categories').select('*').order('name');
  if (error) throw error;
  (data || []).forEach((c) => categoryCache.set(c.name, c));
  return data || [];
}

export async function fetchCategoryId(name: ProductCategory): Promise<number | null> {
  if (categoryCache.has(name)) return categoryCache.get(name)!.id;
  await fetchCategories();
  return categoryCache.get(name)?.id || null;
}

export async function fetchSubCategories(categoryId?: number): Promise<SubCategory[]> {
  let query = supabase.from('sub_categories').select('*').order('name');
  if (categoryId) query = query.eq('category_id', categoryId);
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

// ============================================
// PRODUCTS (with joined relations)
// ============================================

const PRODUCT_SELECT = `
  *,
  category:categories(*),
  sub_category:sub_categories(*),
  product_images(*),
  product_sizes(*)
` as const;

export async function fetchProducts(category?: ProductCategory): Promise<Product[]> {
  let query = supabase.from('products').select(PRODUCT_SELECT).eq('in_stock', true);
  if (category) {
    const catId = await fetchCategoryId(category);
    if (catId) query = query.eq('category_id', catId);
  }
  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as unknown as Product[];
}

export async function fetchAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as unknown as Product[];
}

export async function fetchProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('id', id)
    .single();
  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data as unknown as Product;
}

export async function fetchFeaturedProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('is_featured', true)
    .eq('in_stock', true)
    .limit(6);
  if (error) throw error;
  return (data || []) as unknown as Product[];
}

export async function createProduct(
  product: {
    name: string;
    brand?: string | null;
    category: ProductCategory;
    subCategory?: string;
    price: number;
    description?: string | null;
    gender?: string | null;
    images: string[];
    sizes: string[];
    colors?: string[];
    in_stock?: boolean;
    stock_quantity?: number;
    is_featured?: boolean;
    tags?: string[];
  }
): Promise<Product> {
  const catId = await fetchCategoryId(product.category);
  if (!catId) throw new Error(`Category ${product.category} not found`);

  // Resolve sub-category if provided
  let subCatId: number | null = null;
  if (product.subCategory) {
    const slug = product.subCategory.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const { data: subCat } = await supabase
      .from('sub_categories')
      .select('id')
      .eq('slug', slug)
      .eq('category_id', catId)
      .single();
    subCatId = subCat?.id || null;
  }

  // Insert product
  const { data: prodData, error: prodError } = await supabase
    .from('products')
    .insert({
      name: product.name,
      brand: product.brand || null,
      category_id: catId,
      sub_category_id: subCatId,
      price: product.price,
      description: product.description || null,
      gender: product.gender || null,
      in_stock: product.in_stock ?? true,
      stock_quantity: product.stock_quantity ?? 0,
      is_featured: product.is_featured ?? false,
      tags: product.tags || [],
      colors: product.colors || [],
    })
    .select('id')
    .single();
  if (prodError) throw prodError;

  const productId = prodData.id;

  // Insert images
  if (product.images.length > 0) {
    const imageRows = product.images.map((url, i) => ({
      product_id: productId,
      url,
      alt_text: `${product.name} - Image ${i + 1}`,
      position: i,
    }));
    const { error: imgError } = await supabase.from('product_images').insert(imageRows);
    if (imgError) throw imgError;
  }

  // Insert sizes
  if (product.sizes.length > 0) {
    const sizeRows = product.sizes.map((size) => ({
      product_id: productId,
      size,
      in_stock: true,
    }));
    const { error: sizeError } = await supabase.from('product_sizes').insert(sizeRows);
    if (sizeError) throw sizeError;
  }

  return await fetchProductById(productId) as Product;
}

export async function updateProduct(id: string, updates: Partial<Product> & {
  images?: string[];
  sizes?: string[];
  category?: ProductCategory;
}): Promise<Product> {
  const { images, sizes, category, ...productFields } = updates;

  const updateData: Record<string, any> = { ...productFields };

  if (category) {
    const catId = await fetchCategoryId(category);
    if (catId) updateData.category_id = catId;
  }

  // Remove relation fields that don't exist on the products table
  delete updateData.category;
  delete updateData.sub_category;
  delete updateData.product_images;
  delete updateData.product_sizes;

  const { data, error } = await supabase
    .from('products')
    .update(updateData)
    .eq('id', id)
    .select('id')
    .single();
  if (error) throw error;

  // Update images if provided
  if (images) {
    await supabase.from('product_images').delete().eq('product_id', id);
    if (images.length > 0) {
      const imageRows = images.map((url, i) => ({
        product_id: id,
        url,
        alt_text: `${updateData.name || 'Product'} - Image ${i + 1}`,
        position: i,
      }));
      await supabase.from('product_images').insert(imageRows);
    }
  }

  // Update sizes if provided
  if (sizes) {
    await supabase.from('product_sizes').delete().eq('product_id', id);
    if (sizes.length > 0) {
      const sizeRows = sizes.map((size) => ({ product_id: id, size, in_stock: true }));
      await supabase.from('product_sizes').insert(sizeRows);
    }
  }

  return await fetchProductById(id) as Product;
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
