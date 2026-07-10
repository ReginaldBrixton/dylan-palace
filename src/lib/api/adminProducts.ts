import { supabase } from '../supabase';
import type { Product, ProductCategory } from '../database.types';

const adminProductSelect = `
  *,
  category:categories(*),
  sub_category:sub_categories(*),
  product_images(*),
  product_sizes(*),
  product_variants(*)
`;

export interface AdminProductInput {
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
}

export async function fetchAdminProducts(): Promise<Product[]> {
  const { data, error } = await supabase.from('products').select(adminProductSelect).order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as unknown as Product[];
}

export async function saveAdminProduct(id: string | null, input: AdminProductInput): Promise<Product> {
  const images = input.images.map((url, position) => ({
    url,
    position,
    altText: `${input.name} - view ${position + 1}`,
  }));
  const payload = {
    name: input.name,
    brand: input.brand || '',
    category: input.category,
    price: input.price,
    description: input.description || '',
    inStock: input.in_stock,
    stockQuantity: input.stock_quantity,
    isFeatured: input.is_featured,
    tags: input.tags,
    colors: input.colors,
  };

  const { data: productId, error } = await supabase.rpc('save_product', {
    p_product_id: id,
    p_payload: payload,
    p_images: images,
    p_sizes: input.sizes.length > 0 ? input.sizes : ['OS'],
  });
  if (error) throw new Error(error.message);

  const { data, error: fetchError } = await supabase.from('products').select(adminProductSelect).eq('id', productId).single();
  if (fetchError) throw fetchError;
  return data as unknown as Product;
}

export async function deleteAdminProduct(id: string): Promise<void> {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}
