import { Client } from 'pg';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '..', '.env.local') });

const DB_URL = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL || '';

const PROJECT_REF = 'kgkmxeuchwchqrblfhro';
const DB_PASSWORD = 'Twc1SLuipIJc5AnB';
const POOLER_REGIONS = [
  'aws-0-eu-central-1', 'aws-1-eu-central-1',
  'aws-0-eu-west-1', 'aws-1-eu-west-1',
  'aws-0-eu-west-2', 'aws-1-eu-west-2',
  'aws-0-eu-west-3',
  'aws-0-eu-north-1',
  'aws-0-eu-central-2',
  'aws-0-us-east-1', 'aws-1-us-east-1',
  'aws-0-us-east-2',
  'aws-0-us-west-1', 'aws-1-us-west-1',
  'aws-0-us-west-2',
  'aws-0-ap-southeast-1', 'aws-0-ap-southeast-2',
  'aws-0-ap-northeast-1', 'aws-0-ap-northeast-2',
  'aws-0-ap-south-1',
  'aws-0-ca-central-1', 'aws-0-sa-east-1',
];

async function tryConnect(): Promise<Client> {
  // Try direct connection first (if IPv6 is available)
  if (DB_URL) {
    try {
      console.log('🔌 Trying direct connection...');
      const client = new Client({ connectionString: DB_URL, connectionTimeoutMillis: 5000 });
      await client.connect();
      console.log('✅ Direct connection established!');
      return client;
    } catch (e: any) {
      console.log(`⚠️  Direct connection failed: ${e.code || e.message}`);
    }
  }

  // Try project-specific pooler URL (newer format)
  for (const port of [5432, 6543]) {
    const poolerUrl = `postgresql://postgres.${PROJECT_REF}:${DB_PASSWORD}@${PROJECT_REF}.pooler.supabase.com:${port}/postgres`;
    try {
      console.log(`🔌 Trying project pooler (:${port})...`);
      const client = new Client({
        connectionString: poolerUrl,
        connectionTimeoutMillis: 5000,
        ssl: { rejectUnauthorized: false },
      });
      await client.connect();
      console.log(`✅ Project pooler connection established (:${port})!`);
      return client;
    } catch (e: any) {
      console.log(`⚠️  Project pooler :${port} failed: ${e.code || ''} ${(e.message || '').slice(0, 80)}`);
    }
  }

  // Try pooler connections (IPv4) — both session (5432) and transaction (6543) modes
  const ports = [5432, 6543];
  for (const region of POOLER_REGIONS) {
    for (const port of ports) {
      const poolerUrl = `postgresql://postgres.${PROJECT_REF}:${DB_PASSWORD}@${region}.pooler.supabase.com:${port}/postgres`;
      try {
        console.log(`🔌 Trying pooler (${region}:${port})...`);
        const client = new Client({
          connectionString: poolerUrl,
          connectionTimeoutMillis: 5000,
          ssl: { rejectUnauthorized: false },
        });
        await client.connect();
        console.log(`✅ Pooler connection established (${region}:${port})!`);
        return client;
      } catch (e: any) {
        console.log(`⚠️  Pooler ${region}:${port} failed: ${e.code || ''} ${(e.message || '').slice(0, 80)}`);
      }
    }
  }

  // Try with plain postgres username (older Supabase projects)
  for (const region of POOLER_REGIONS) {
    const poolerUrl = `postgresql://postgres:${DB_PASSWORD}@${region}.pooler.supabase.com:5432/postgres`;
    try {
      console.log(`🔌 Trying pooler plain (${region}:5432)...`);
      const client = new Client({
        connectionString: poolerUrl,
        connectionTimeoutMillis: 5000,
        ssl: { rejectUnauthorized: false },
      });
      await client.connect();
      console.log(`✅ Pooler plain connection established (${region})!`);
      return client;
    } catch (e: any) {
      console.log(`⚠️  Pooler plain ${region} failed: ${e.code || ''} ${(e.message || '').slice(0, 80)}`);
    }
  }

  throw new Error('Could not connect to Supabase via any method');
}

const migrationPath = resolve(__dirname, '..', 'prisma', 'migrations', '0001_init', 'migration.sql');

async function main() {
  console.log('📋 Reading migration SQL...');
  const sql = readFileSync(migrationPath, 'utf-8');

  console.log('🔌 Connecting to Supabase...');
  const client = await tryConnect();

  console.log('🚀 Applying migration...\n');
  try {
    await client.query(sql);
    console.log('\n✅ Migration applied successfully!\n');

    // Verify tables exist
    const { rows } = await client.query(`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    console.log('📊 Tables in database:');
    rows.forEach((row) => console.log(`   - ${row.table_name}`));

    // Check categories
    const { rows: cats } = await client.query('SELECT * FROM public.categories ORDER BY id;');
    console.log(`\n📂 Categories (${cats.length}):`);
    cats.forEach((c) => console.log(`   - ${c.id}: ${c.name} (${c.display_name})`));

    // Check sub-categories
    const { rows: subCats } = await client.query('SELECT * FROM public.sub_categories ORDER BY id;');
    console.log(`\n🏷️  Sub-categories (${subCats.length}):`);
    subCats.forEach((c) => console.log(`   - ${c.id}: ${c.name} → category_id=${c.category_id}`));

    // Check products count
    const { rows: prodCount } = await client.query('SELECT COUNT(*) as count FROM public.products;');
    console.log(`\n📦 Products: ${prodCount[0].count}`);

    // Check product images count
    const { rows: imgCount } = await client.query('SELECT COUNT(*) as count FROM public.product_images;');
    console.log(`🖼️  Product images: ${imgCount[0].count}`);

    // Check product sizes count
    const { rows: sizeCount } = await client.query('SELECT COUNT(*) as count FROM public.product_sizes;');
    console.log(`📏 Product sizes: ${sizeCount[0].count}`);
  } catch (err: any) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
