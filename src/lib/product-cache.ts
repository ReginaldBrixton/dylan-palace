import { fetchCatalogueFeaturedProducts, fetchCatalogueProductById, fetchCatalogueProducts } from './api/catalog';
import type { Product as DBProduct, ProductCategory } from './database.types';
import type { Product as FrontendProduct } from '../types/product';

const CACHE_KEY = 'dp_products_cache_v2';
const CACHE_TTL = 5 * 60 * 1000;
const STALE_TTL = 30 * 60 * 1000;

interface CacheEntry { timestamp: number; products: FrontendProduct[]; }
let memoryCache: CacheEntry | null = null;
let featuredCache: FrontendProduct[] | null = null;
let fetchPromise: Promise<FrontendProduct[]> | null = null;

export function adaptProduct(db: DBProduct): FrontendProduct {
  const images = [...(db.product_images || [])].sort((a, b) => a.position - b.position).map((image) => image.url);
  const variants = (db.product_variants || [])
    .filter((variant) => variant.active)
    .map((variant) => ({
      id: variant.id,
      sku: variant.sku,
      size: variant.size,
      color: variant.color || undefined,
      price: variant.price_override ?? undefined,
      stockQuantity: variant.stock_quantity,
      active: variant.active,
    }));
  const sizes = variants.length > 0
    ? Array.from(new Set(variants.filter((variant) => variant.stockQuantity > 0).map((variant) => variant.size)))
    : (db.product_sizes || []).filter((size) => size.in_stock).map((size) => size.size);

  return {
    id: db.id,
    name: db.name,
    price: db.price,
    category: (db.category?.name || 'SHIRTS') as FrontendProduct['category'],
    subCategory: db.sub_category?.display_name || db.sub_category?.name || undefined,
    brand: db.brand || undefined,
    gender: db.gender || undefined,
    images,
    description: db.description || '',
    sizes,
    variants,
    deliversBy: '',
  };
}

function readCache(): CacheEntry | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) as CacheEntry : null;
  } catch { return null; }
}

function writeCache(entry: CacheEntry) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(entry)); } catch { /* ignore unavailable storage */ }
}

const isFresh = (entry: CacheEntry | null) => Boolean(entry && Date.now() - entry.timestamp < CACHE_TTL);
const isUsable = (entry: CacheEntry | null) => Boolean(entry && Date.now() - entry.timestamp < STALE_TTL);

async function fetchAll(): Promise<FrontendProduct[]> {
  const products = (await fetchCatalogueProducts()).map(adaptProduct);
  const entry = { timestamp: Date.now(), products };
  memoryCache = entry;
  writeCache(entry);
  return products;
}

export async function getCachedProducts(): Promise<FrontendProduct[]> {
  if (isFresh(memoryCache)) return memoryCache!.products;
  const local = readCache();
  if (local) memoryCache = local;
  if (isFresh(local)) return local!.products;
  if (isUsable(memoryCache)) {
    if (!fetchPromise) fetchPromise = fetchAll().finally(() => { fetchPromise = null; });
    return memoryCache!.products;
  }
  if (!fetchPromise) fetchPromise = fetchAll().finally(() => { fetchPromise = null; });
  return fetchPromise;
}

export async function getCachedProductsByCategory(category: ProductCategory): Promise<FrontendProduct[]> {
  return (await getCachedProducts()).filter((product) => product.category === category);
}

export async function getCachedProductById(id: string): Promise<FrontendProduct | null> {
  const cached = (await getCachedProducts()).find((product) => product.id === id);
  if (cached) return cached;
  const product = await fetchCatalogueProductById(id);
  return product ? adaptProduct(product) : null;
}

export async function getCachedFeaturedProducts(limit?: number): Promise<FrontendProduct[]> {
  if (!featuredCache) featuredCache = (await fetchCatalogueFeaturedProducts()).map(adaptProduct);
  return limit ? featuredCache.slice(0, limit) : featuredCache;
}

export async function getRelatedProducts(product: FrontendProduct, limit = 4): Promise<FrontendProduct[]> {
  return (await getCachedProducts()).filter((candidate) => candidate.category === product.category && candidate.id !== product.id).slice(0, limit);
}

export function invalidateCache() {
  memoryCache = null;
  featuredCache = null;
  fetchPromise = null;
  try { localStorage.removeItem(CACHE_KEY); } catch { /* ignore */ }
}
