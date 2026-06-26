import { supabase } from './supabase';
import type { Product, Order, OrderItem, Profile, ProductCategory, OrderStatus, Category, SubCategory } from './database.types';

// ============================================
// REQUEST DEDUPLICATION & CACHING UTILITIES
// ============================================

const inflight = new Map<string, Promise<unknown>>();
const apiCache = new Map<string, { data: unknown; ts: number }>();
const API_CACHE_TTL = 60 * 1000; // 1 minute for list endpoints

function dedupe<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const existing = inflight.get(key);
  if (existing) return existing as Promise<T>;
  const p = fn().finally(() => inflight.delete(key));
  inflight.set(key, p);
  return p;
}

function cached<T>(key: string, fn: () => Promise<T>, ttl = API_CACHE_TTL): Promise<T> {
  const hit = apiCache.get(key);
  if (hit && Date.now() - hit.ts < ttl) {
    return Promise.resolve(hit.data as T);
  }
  return dedupe(key, async () => {
    const data = await fn();
    apiCache.set(key, { data, ts: Date.now() });
    return data;
  });
}

function invalidateApiCache(prefix?: string) {
  if (prefix) {
    for (const key of apiCache.keys()) {
      if (key.startsWith(prefix)) apiCache.delete(key);
    }
  } else {
    apiCache.clear();
  }
}

// ============================================
// CATEGORIES
// ============================================

const categoryCache = new Map<string, Category>();

export async function fetchCategories(): Promise<Category[]> {
  return cached('categories', async () => {
    const { data, error } = await supabase.from('categories').select('*').order('name');
    if (error) throw error;
    (data || []).forEach((c) => categoryCache.set(c.name, c));
    return data || [];
  });
}

export async function fetchCategoryId(name: ProductCategory): Promise<number | null> {
  if (categoryCache.has(name)) return categoryCache.get(name)!.id;
  await fetchCategories();
  return categoryCache.get(name)?.id || null;
}

export async function fetchSubCategories(categoryId?: number): Promise<SubCategory[]> {
  const cacheKey = `sub_categories:${categoryId ?? 'all'}`;
  return cached(cacheKey, async () => {
    let query = supabase.from('sub_categories').select('*').order('name');
    if (categoryId) query = query.eq('category_id', categoryId);
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  });
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
  const cacheKey = `products:${category ?? 'all'}`;
  return cached(cacheKey, async () => {
    let query = supabase.from('products').select(PRODUCT_SELECT).eq('in_stock', true);
    if (category) {
      const catId = await fetchCategoryId(category);
      if (catId) query = query.eq('category_id', catId);
    }
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []) as unknown as Product[];
  });
}

export async function fetchAllProducts(): Promise<Product[]> {
  return cached('products:all_incl_out', async () => {
    const { data, error } = await supabase
      .from('products')
      .select(PRODUCT_SELECT)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []) as unknown as Product[];
  });
}

export async function fetchProductById(id: string): Promise<Product | null> {
  return dedupe(`product:${id}`, async () => {
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
  });
}

export async function fetchFeaturedProducts(): Promise<Product[]> {
  return cached('products:featured', async () => {
    const { data, error } = await supabase
      .from('products')
      .select(PRODUCT_SELECT)
      .eq('is_featured', true)
      .eq('in_stock', true)
      .limit(6);
    if (error) throw error;
    return (data || []) as unknown as Product[];
  });
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
    .select(PRODUCT_SELECT)
    .single();
  if (prodError) throw prodError;

  const productId = prodData.id;

  // Parallelize image and size inserts
  const parallelTasks: Promise<unknown>[] = [];

  if (product.images.length > 0) {
    const imageRows = product.images.map((url, i) => ({
      product_id: productId,
      url,
      alt_text: `${product.name} - Image ${i + 1}`,
      position: i,
    }));
    parallelTasks.push(Promise.resolve(supabase.from('product_images').insert(imageRows)));
  }

  if (product.sizes.length > 0) {
    const sizeRows = product.sizes.map((size) => ({
      product_id: productId,
      size,
      in_stock: true,
    }));
    parallelTasks.push(Promise.resolve(supabase.from('product_sizes').insert(sizeRows)));
  }

  if (parallelTasks.length > 0) {
    const results = await Promise.all(parallelTasks);
    for (const result of results) {
      const { error } = result as { error: unknown };
      if (error) throw error;
    }
  }

  invalidateApiCache('products:');
  return prodData as unknown as Product;
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
    .select(PRODUCT_SELECT)
    .single();
  if (error) throw error;

  // Parallelize image and size updates
  const parallelTasks: Promise<unknown>[] = [];

  if (images) {
    parallelTasks.push(
      Promise.resolve(supabase.from('product_images').delete().eq('product_id', id)).then(({ error }) => {
        if (error) throw error;
        if (images.length > 0) {
          const imageRows = images.map((url, i) => ({
            product_id: id,
            url,
            alt_text: `${updateData.name || 'Product'} - Image ${i + 1}`,
            position: i,
          }));
          return Promise.resolve(supabase.from('product_images').insert(imageRows));
        }
        return { error: null };
      })
    );
  }

  if (sizes) {
    parallelTasks.push(
      Promise.resolve(supabase.from('product_sizes').delete().eq('product_id', id)).then(({ error }) => {
        if (error) throw error;
        if (sizes.length > 0) {
          const sizeRows = sizes.map((size) => ({ product_id: id, size, in_stock: true }));
          return Promise.resolve(supabase.from('product_sizes').insert(sizeRows));
        }
        return { error: null };
      })
    );
  }

  if (parallelTasks.length > 0) {
    const results = await Promise.all(parallelTasks);
    for (const result of results) {
      const { error: err } = result as { error: unknown };
      if (err) throw err;
    }
  }

  invalidateApiCache('products:');
  return data as unknown as Product;
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
  invalidateApiCache('products:');
}

// ============================================
// ORDERS
// ============================================

export async function fetchOrders(status?: OrderStatus): Promise<Order[]> {
  const cacheKey = `orders:${status ?? 'all'}`;
  return cached(cacheKey, async () => {
    let query = supabase.from('orders').select('*');
    if (status) {
      query = query.eq('status', status);
    }
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  });
}

export async function fetchOrderById(id: string): Promise<Order | null> {
  return dedupe(`order:${id}`, async () => {
    const { data, error } = await supabase.from('orders').select('*').eq('id', id).single();
    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  });
}

export async function fetchOrderItems(orderId: string): Promise<OrderItem[]> {
  return dedupe(`order_items:${orderId}`, async () => {
    const { data, error } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  });
}

export async function createOrder(
  order: Omit<Order, 'id' | 'created_at' | 'updated_at' | 'order_number'>,
  items: Omit<OrderItem, 'id' | 'created_at' | 'order_id'>[]
): Promise<Order> {
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

  invalidateApiCache('orders:');
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
  invalidateApiCache('orders:');
  return data;
}

// ============================================
// PROFILES / USERS
// ============================================

export async function fetchProfiles(): Promise<Profile[]> {
  return cached('profiles', async () => {
    const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  });
}

export async function fetchProfile(id: string): Promise<Profile | null> {
  return dedupe(`profile:${id}`, async () => {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  });
}

// ============================================
// WISHLIST
// ============================================

export async function fetchWishlist(userId: string): Promise<string[]> {
  return dedupe(`wishlist:${userId}`, async () => {
    const { data, error } = await supabase
      .from('wishlist')
      .select('product_id')
      .eq('user_id', userId);
    if (error) throw error;
    return (data || []).map((item) => item.product_id);
  });
}

export async function addToWishlist(userId: string, productId: string): Promise<void> {
  const { error } = await supabase
    .from('wishlist')
    .insert({ user_id: userId, product_id: productId });
  if (error) throw error;
  inflight.delete(`wishlist:${userId}`);
}

export async function removeFromWishlist(userId: string, productId: string): Promise<void> {
  const { error } = await supabase
    .from('wishlist')
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId);
  if (error) throw error;
  inflight.delete(`wishlist:${userId}`);
}

// ============================================
// DASHBOARD STATS
// ============================================

export async function fetchDashboardStats() {
  return cached('dashboard_stats', async () => {
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
  });
}

export async function fetchRecentOrders(limit = 5): Promise<Order[]> {
  return cached(`recent_orders:${limit}`, async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data || [];
  });
}
