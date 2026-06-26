import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const data = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'seed-data.json'), 'utf-8'));
const products: any[] = data.products;

function esc(s: string): string {
  return s.replace(/'/g, "''");
}

let sql = '-- Auto-generated seed SQL\n\n';
sql += '-- Temporarily disable RLS for seeding\n';
sql += 'ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;\n';
sql += 'ALTER TABLE public.product_images DISABLE ROW LEVEL SECURITY;\n';
sql += 'ALTER TABLE public.product_sizes DISABLE ROW LEVEL SECURITY;\n';
sql += 'ALTER TABLE public.sub_categories DISABLE ROW LEVEL SECURITY;\n\n';

sql += "-- Ensure TROUSERS sub-category exists\n";
sql += "INSERT INTO public.sub_categories (name, display_name, slug, category_id)\n";
sql += "SELECT 'TROUSERS', 'Trousers', 'trousers-pants', id FROM public.categories WHERE name = 'TROUSERS'\n";
sql += "ON CONFLICT (slug) DO NOTHING;\n\n";

for (const p of products) {
  sql += 'DO $do$\nDECLARE\n  _pid UUID;\nBEGIN\n';
  sql += `  INSERT INTO public.products (name, brand, category_id, sub_category_id, price, description, gender, in_stock, stock_quantity, is_featured, tags, colors)\n`;
  sql += `  SELECT '${esc(p.name)}', NULL, c.id, sc.id, ${p.price}, '${esc(p.description || '')}', ${p.gender ? "'" + p.gender + "'" : 'NULL'}, true, 100, false, '{}', '{}'\n`;
  sql += `  FROM public.categories c\n`;
  sql += `  LEFT JOIN public.sub_categories sc ON sc.name = '${esc(p.subCategory)}' AND sc.category_id = c.id\n`;
  sql += `  WHERE c.name = '${p.category}'\n`;
  sql += `  RETURNING id INTO _pid;\n`;

  for (const img of p.images) {
    sql += `  INSERT INTO public.product_images (product_id, url, alt_text, position) VALUES (_pid, '${img.url}', '${esc(img.altText || '')}', ${img.position});\n`;
  }

  for (const size of p.sizes) {
    sql += `  INSERT INTO public.product_sizes (product_id, size, in_stock) VALUES (_pid, '${size}', true);\n`;
  }

  sql += `END $do$;\n\n`;
}

sql += '-- Re-enable RLS\n';
sql += 'ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;\n';
sql += 'ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;\n';
sql += 'ALTER TABLE public.product_sizes ENABLE ROW LEVEL SECURITY;\n';
sql += 'ALTER TABLE public.sub_categories ENABLE ROW LEVEL SECURITY;\n';

fs.writeFileSync(path.resolve(__dirname, 'seed.sql'), sql);
console.log(`Generated seed.sql: ${products.length} products, ${sql.split('\n').length} lines`);
