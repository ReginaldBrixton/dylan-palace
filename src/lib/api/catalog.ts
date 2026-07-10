import { supabase } from '../supabase';
import type { Product, ProductCategory } from '../database.types';

const productSelect = `
  *,
  category:categories(*),
  sub_category:sub_categories(*),
  product_images(*),
  product_sizes(*),
  product_variants(*)
`;

async function categoryId(name: ProductCategory): Promise<number | null> {
  const { data, error } = await supabase.from('categories').select('id').eq('name', name).single();
  if (error) throw error;
  return data?.id ?? null;
}

export async function fetchCatalogueProducts(category?: ProductCategory): Promise<Product[]> {
  let query = supabase.from('products').select(productSelect).eq('in_stock', true);
  if (category) {
    const id = await categoryId(category);
    if (id) query = query.eq('category_id', id);
  }
  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as unknown as Product[];
}

export async function fetchCatalogueProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase.from('products').select(productSelect).eq('id', id).single();
  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data as unknown as Product;
}

export async function fetchCatalogueFeaturedProducts(): Promise<Product[]> {
  const { data, error } = await supabase.from('products').select(productSelect).eq('is_featured', true).eq('in_stock', true).limit(8);
  if (error) throw error;
  return (data || []) as unknown as Product[];
}
