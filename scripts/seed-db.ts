/**
 * Seed Supabase database with products from seed-data.json
 * Uses the new Prisma-designed schema with separate tables:
 *   categories, sub_categories, products, product_images, product_sizes
 *
 * Prerequisites:
 *   1. Run prisma/migrations/0001_init/migration.sql in Supabase SQL Editor
 *   2. Run scripts/upload-images.ts to generate scripts/seed-data.json
 *
 * Usage: npx tsx scripts/seed-db.ts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import ws from 'ws';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '..', '.env.local') });

// ============================================
// Config
// ============================================
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://kgkmxeuchwchqrblfhro.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

// Use service role key for seeding (bypasses RLS)
// If not available, fall back to anon key (will need seller auth)
// Provide ws constructor for Node.js < 22 (must be before createClient)
(globalThis as any).WebSocket = ws;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false },
  realtime: { params: { eventsPerSecond: 0 } },
});

// ============================================
// Types
// ============================================

interface SeedProduct {
  id: string;
  name: string;
  price: number;
  category: string;
  subCategory: string;
  gender?: string;
  description: string;
  sizes: string[];
  images: { url: string; altText: string; position: number }[];
}

// ============================================
// Helper: slugify
// ============================================
function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// ============================================
// Main seed logic
// ============================================

async function main() {
  const seedPath = path.resolve(__dirname, 'seed-data.json');
  if (!fs.existsSync(seedPath)) {
    console.error('❌ seed-data.json not found. Run upload-images.ts first.');
    process.exit(1);
  }

  const { products } = JSON.parse(fs.readFileSync(seedPath, 'utf-8')) as { products: SeedProduct[] };
  console.log(`\n📦 Seeding ${products.length} products to Supabase...\n`);

  // Step 1: Ensure categories exist
  const categoryMap = new Map<string, number>();
  for (const catName of ['SHIRTS', 'TROUSERS', 'SHOES', 'BAGS']) {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name')
      .eq('name', catName)
      .single();

    if (error || !data) {
      console.error(`  ❌ Category ${catName} not found. Run migration SQL first.`);
      process.exit(1);
    }
    categoryMap.set(catName, data.id);
  }
  console.log('  ✅ Categories verified');

  // Step 2: Ensure sub-categories exist and build lookup
  const subCatMap = new Map<string, number>(); // "CATEGORY:SUBCATEGORY" -> id
  for (const product of products) {
    const key = `${product.category}:${product.subCategory}`;
    if (subCatMap.has(key)) continue;

    const slug = slugify(product.subCategory);
    const { data: existing } = await supabase
      .from('sub_categories')
      .select('id')
      .eq('slug', slug)
      .single();

    if (existing) {
      subCatMap.set(key, existing.id);
    } else {
      const { data, error } = await supabase
        .from('sub_categories')
        .insert({
          name: product.subCategory,
          display_name: product.subCategory.toLowerCase().replace(/_/g, ' '),
          slug,
          category_id: categoryMap.get(product.category)!,
        })
        .select('id')
        .single();

      if (error) {
        console.error(`  ❌ Failed to create sub-category ${product.subCategory}: ${error.message}`);
        continue;
      }
      subCatMap.set(key, data.id);
    }
  }
  console.log(`  ✅ Sub-categories verified (${subCatMap.size} unique)`);

  // Step 3: Insert products with images and sizes
  let inserted = 0;
  let errors = 0;

  for (const product of products) {
    const subCatKey = `${product.category}:${product.subCategory}`;
    const subCategoryId = subCatMap.get(subCatKey);

    // Insert product
    const { data: productData, error: productError } = await supabase
      .from('products')
      .insert({
        name: product.name,
        brand: null,
        category_id: categoryMap.get(product.category)!,
        sub_category_id: subCategoryId || null,
        price: product.price,
        description: product.description,
        gender: product.gender || null,
        in_stock: true,
        stock_quantity: 100,
        is_featured: false,
        tags: [],
        colors: [],
      })
      .select('id')
      .single();

    if (productError) {
      console.error(`  ❌ Failed to insert product ${product.id} (${product.name}): ${productError.message}`);
      errors++;
      continue;
    }

    const productId = productData.id;

    // Insert images
    const imageRows = product.images.map((img) => ({
      product_id: productId,
      url: img.url,
      alt_text: img.altText,
      position: img.position,
    }));

    const { error: imgError } = await supabase.from('product_images').insert(imageRows);
    if (imgError) {
      console.error(`  ⚠️  Failed to insert images for ${product.name}: ${imgError.message}`);
    }

    // Insert sizes
    const sizeRows = product.sizes.map((size) => ({
      product_id: productId,
      size,
      in_stock: true,
    }));

    const { error: sizeError } = await supabase.from('product_sizes').insert(sizeRows);
    if (sizeError) {
      console.error(`  ⚠️  Failed to insert sizes for ${product.name}: ${sizeError.message}`);
    }

    console.log(`  ✅ ${product.name} (${product.category}) — ${product.images.length} img, ${product.sizes.length} sizes`);
    inserted++;
  }

  console.log(`\n📊 Seed complete: ${inserted} products inserted, ${errors} errors\n`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
