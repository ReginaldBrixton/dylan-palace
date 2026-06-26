import { fetchProducts, fetchProductById, fetchFeaturedProducts } from './api';
import type { Product as DBProduct, ProductCategory } from './database.types';
import type { Product as FrontendProduct } from '../types/product';

const CACHE_KEY = 'dp_products_cache';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface CacheEntry {
  timestamp: number;
  products: FrontendProduct[];
}

let memoryCache: CacheEntry | null = null;
let fetchPromise: Promise<FrontendProduct[]> | null = null;

export function adaptProduct(db: DBProduct): FrontendProduct {
  const images = (db.product_images || [])
    .sort((a, b) => a.position - b.position)
    .map((img) => img.url);

  const sizes = (db.product_sizes || []).map((s) => s.size);

  const category = (db.category?.name || 'SHIRTS') as FrontendProduct['category'];

  return {
    id: db.id,
    name: db.name,
    price: db.price,
    category,
    subCategory: db.sub_category?.name || db.sub_category?.display_name || undefined,
    brand: db.brand || undefined,
    gender: (db.gender as FrontendProduct['gender']) || undefined,
    images,
    description: db.description || '',
    sizes,
    deliversBy: '',
  };
}

function readLocalStorageCache(): CacheEntry | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CacheEntry;
    if (Date.now() - parsed.timestamp > CACHE_TTL) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeLocalStorageCache(entry: CacheEntry) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(entry));
  } catch {
    // ignore
  }
}

export async function getCachedProducts(): Promise<FrontendProduct[]> {
  // Check memory cache
  if (memoryCache && Date.now() - memoryCache.timestamp < CACHE_TTL) {
    return memoryCache.products;
  }

  // Check localStorage cache
  const local = readLocalStorageCache();
  if (local) {
    memoryCache = local;
    return local.products;
  }

  // Deduplicate concurrent fetches
  if (fetchPromise) return fetchPromise;

  fetchPromise = (async () => {
    const dbProducts = await fetchProducts();
    const adapted = dbProducts.map(adaptProduct);
    const entry: CacheEntry = { timestamp: Date.now(), products: adapted };
    memoryCache = entry;
    writeLocalStorageCache(entry);
    fetchPromise = null;
    return adapted;
  })();

  return fetchPromise;
}

export async function getCachedProductsByCategory(category: ProductCategory): Promise<FrontendProduct[]> {
  const all = await getCachedProducts();
  return all.filter((p) => p.category === category);
}

export async function getCachedProductById(id: string): Promise<FrontendProduct | null> {
  // Try cache first
  const cached = await getCachedProducts();
  const found = cached.find((p) => p.id === id);
  if (found) return found;

  // Fallback to direct fetch
  const dbProduct = await fetchProductById(id);
  if (!dbProduct) return null;
  return adaptProduct(dbProduct);
}

export async function getCachedFeaturedProducts(limit?: number): Promise<FrontendProduct[]> {
  const dbProducts = await fetchFeaturedProducts();
  const adapted = dbProducts.map(adaptProduct);
  if (limit) return adapted.slice(0, limit);
  return adapted;
}

export async function getRelatedProducts(product: FrontendProduct, limit: number = 3): Promise<FrontendProduct[]> {
  const all = await getCachedProducts();
  return all
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, limit);
}

export function invalidateCache() {
  memoryCache = null;
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch {
    // ignore
  }
}
