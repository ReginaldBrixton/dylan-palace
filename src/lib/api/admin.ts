import { supabase } from '../supabase';
import type { InventoryMovement, StoreSetting } from '../database.types';

export interface InventoryVariantRow {
  id: string;
  product_id: string;
  sku: string;
  size: string;
  color: string | null;
  price_override: number | null;
  stock_quantity: number;
  active: boolean;
  product: {
    id: string;
    name: string;
    brand: string | null;
    product_images: Array<{ url: string; position: number }>;
  };
}

export async function fetchInventoryVariants(): Promise<InventoryVariantRow[]> {
  const { data, error } = await supabase
    .from('product_variants')
    .select('*, product:products(id,name,brand,product_images(url,position))')
    .order('stock_quantity', { ascending: true });
  if (error) throw error;
  return (data || []) as unknown as InventoryVariantRow[];
}

export async function adjustVariantInventory(variantId: string, delta: number, note: string): Promise<number> {
  const { data, error } = await supabase.rpc('adjust_inventory', {
    p_variant_id: variantId,
    p_delta: delta,
    p_note: note,
  });
  if (error) throw new Error(error.message);
  return Number(data);
}

export async function fetchInventoryMovements(variantId: string): Promise<InventoryMovement[]> {
  const { data, error } = await supabase
    .from('inventory_movements')
    .select('*')
    .eq('variant_id', variantId)
    .order('created_at', { ascending: false })
    .limit(30);
  if (error) throw error;
  return (data || []) as InventoryMovement[];
}

export async function fetchStoreSettings(): Promise<StoreSetting[]> {
  const { data, error } = await supabase.from('store_settings').select('*').order('key');
  if (error) throw error;
  return (data || []) as StoreSetting[];
}

export async function saveStoreSetting(key: string, value: Record<string, unknown>): Promise<StoreSetting> {
  const { data: authData } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from('store_settings')
    .upsert({ key, value, updated_by: authData.user?.id || null }, { onConflict: 'key' })
    .select()
    .single();
  if (error) throw error;
  return data as StoreSetting;
}
