/**
 * Upload all product images to UploadThing using UTApi (v7)
 * and generate a seed JSON with the resulting URLs.
 *
 * Usage: UPLOADTHING_TOKEN="..." npx tsx scripts/upload-images.ts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { UTApi } from 'uploadthing/server';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================
// UploadThing setup
// ============================================
const UPLOADTHING_TOKEN = process.env.UPLOADTHING_TOKEN || '';

const utapi = new UTApi({ token: UPLOADTHING_TOKEN });

// ============================================
// Product data loading
// ============================================

interface RawProduct {
  id: string;
  name: string;
  price: number;
  image: string | string[];
  subCategory: string;
  gender?: string;
  description: string;
  sizes: string[];
}

interface RawData {
  shirts?: RawProduct[];
  trousers?: RawProduct[];
  shoes?: RawProduct[];
  bags?: RawProduct[];
}

const IMAGES_BASE = path.resolve(__dirname, '..', 'src', 'assets', 'images');

function loadData(): { category: string; folder: string; products: RawProduct[] }[] {
  const dataDir = path.resolve(__dirname, '..', 'src', 'data');
  return [
    {
      category: 'SHIRTS',
      folder: 'shirts',
      products: (JSON.parse(fs.readFileSync(path.join(dataDir, 'shirts.json'), 'utf-8')) as RawData).shirts || [],
    },
    {
      category: 'TROUSERS',
      folder: 'trousers',
      products: (JSON.parse(fs.readFileSync(path.join(dataDir, 'trousers.json'), 'utf-8')) as RawData).trousers || [],
    },
    {
      category: 'SHOES',
      folder: 'shoes',
      products: (JSON.parse(fs.readFileSync(path.join(dataDir, 'shoes.json'), 'utf-8')) as RawData).shoes || [],
    },
    {
      category: 'BAGS',
      folder: 'bags',
      products: (JSON.parse(fs.readFileSync(path.join(dataDir, 'bags.json'), 'utf-8')) as RawData).bags || [],
    },
  ];
}

// ============================================
// Main upload logic
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

async function main() {
  if (!UPLOADTHING_TOKEN) {
    console.error('❌ UPLOADTHING_TOKEN not set in environment');
    process.exit(1);
  }

  const categories = loadData();
  const seedProducts: SeedProduct[] = [];
  const imageMap = new Map<string, string>(); // local filename -> UploadThing URL
  let uploaded = 0;
  let skipped = 0;
  let failed = 0;

  // Collect all unique image filenames
  const allImages: { filename: string; folder: string }[] = [];
  for (const cat of categories) {
    for (const product of cat.products) {
      const imageFiles = Array.isArray(product.image) ? product.image : [product.image];
      for (const imgFile of imageFiles) {
        // Check both the category folder and shorts folder for trousers
        const possibleFolders = [cat.folder];
        if (cat.folder === 'trousers' && product.subCategory === 'SHORTS') {
          possibleFolders.push('shorts');
        }
        for (const folder of possibleFolders) {
          const fullPath = path.join(IMAGES_BASE, folder, imgFile);
          if (fs.existsSync(fullPath)) {
            allImages.push({ filename: imgFile, folder });
            break;
          }
        }
      }
    }
  }

  // Deduplicate by filename
  const uniqueImages = new Map<string, { filename: string; folder: string }>();
  for (const img of allImages) {
    if (!uniqueImages.has(img.filename)) {
      uniqueImages.set(img.filename, img);
    }
  }

  console.log(`\n📦 Found ${uniqueImages.size} unique images to upload\n`);

  // Upload each image
  for (const [filename, { folder }] of uniqueImages) {
    const fullPath = path.join(IMAGES_BASE, folder, filename);

    try {
      process.stdout.write(`  Uploading ${folder}/${filename}... `);
      const fileBuffer = fs.readFileSync(fullPath);
      const file = new File([fileBuffer], filename, { type: 'image/jpeg' });

      const result = await utapi.uploadFiles(file);

      if (result.error) {
        throw new Error(result.error.message || String(result.error));
      }

      const url = result.data.url;
      imageMap.set(filename, url);
      console.log(`✅ ${url}`);
      uploaded++;
    } catch (err: any) {
      console.log(`❌ ${err.message}`);
      failed++;
    }
  }

  console.log(`\n📊 Upload complete: ${uploaded} uploaded, ${failed} failed\n`);

  // Build seed products with UploadThing URLs
  for (const cat of categories) {
    for (const product of cat.products) {
      const imageFiles = Array.isArray(product.image) ? product.image : [product.image];
      const images: { url: string; altText: string; position: number }[] = [];

      for (let i = 0; i < imageFiles.length; i++) {
        const imgFile = imageFiles[i];
        const url = imageMap.get(imgFile);
        if (url) {
          images.push({
            url,
            altText: `${product.name} - Image ${i + 1}`,
            position: i,
          });
        } else {
          console.warn(`  ⚠️  No URL for ${imgFile} (product: ${product.name})`);
        }
      }

      if (images.length === 0) {
        console.warn(`  ⚠️  Skipping product ${product.id} (${product.name}) — no images`);
        skipped++;
        continue;
      }

      seedProducts.push({
        id: product.id,
        name: product.name,
        price: product.price,
        category: cat.category,
        subCategory: product.subCategory,
        gender: product.gender,
        description: product.description,
        sizes: product.sizes,
        images,
      });
    }
  }

  // Write seed file
  const seedPath = path.resolve(__dirname, 'seed-data.json');
  fs.writeFileSync(seedPath, JSON.stringify({ products: seedProducts }, null, 2));
  console.log(`\n✅ Seed data written to ${seedPath}`);
  console.log(`   ${seedProducts.length} products, ${skipped} skipped\n`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
