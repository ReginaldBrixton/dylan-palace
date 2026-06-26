/**
 * Apply database schema to Supabase via the PostgreSQL connection.
 * Run with: npx tsx scripts/apply-schema.ts
 */
import 'dotenv/config';
import fs from 'fs';
import pg from 'pg';
import dns from 'dns';

async function main() {
  // Load .env.local
  const envPath = '.env.local';
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    for (const line of envContent.split('\n')) {
      const match = line.match(/^([^#=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim();
        if (!process.env[key]) process.env[key] = value;
      }
    }
  }

  const dbUrl = process.env.SUPABASE_DB_URL;
  if (!dbUrl) {
    console.error('❌ Missing SUPABASE_DB_URL in env');
    process.exit(1);
  }

  // Supabase direct connection is IPv6-only; try pooler for IPv4
  const poolerRegions = [
    'aws-0-eu-west-1',
    'aws-0-us-east-1',
    'aws-0-us-west-1',
    'aws-0-eu-central-1',
    'aws-0-ap-southeast-1',
    'aws-0-ap-northeast-1',
  ];

  let connected = false;
  let client: pg.Client | null = null;

  for (const region of poolerRegions) {
    const poolerHost = `${region}.pooler.supabase.com`;
    let testClient: pg.Client | null = null;
    try {
      console.log(`Trying pooler: ${poolerHost}...`);
      testClient = new pg.Client({
        host: poolerHost,
        port: 5432,
        user: `postgres.kgkmxeuchwchqrblfhro`,
        password: 'Twc1SLuipIJc5AnB',
        database: 'postgres',
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 5000,
      });
      await testClient.connect();
      console.log(`✅ Connected via ${poolerHost}`);
      client = testClient;
      connected = true;
      break;
    } catch (err: any) {
      const code = err.code;
      if (testClient) { try { await testClient.end(); } catch { } }
      if (code === 'ENOTFOUND' || code === 'ETIMEDOUT' || code === 'ECONNREFUSED') {
        continue;
      }
      if (code === 'XX000' || code === '28P01' || err.message?.includes('not found') || err.message?.includes('authentication')) {
        console.log(`   Region ${region}: ${err.message?.substring(0, 80)}`);
        continue;
      }
      throw err;
    }
  }

  if (!connected || !client) {
    console.error('❌ Could not connect to Supabase via direct or pooler connection.');
    console.error('   Please run scripts/schema.sql manually in the Supabase SQL Editor:');
    console.error('   Dashboard → SQL Editor → New query → paste schema.sql → Run');
    process.exit(1);
  }

  try {
    const schema = fs.readFileSync('scripts/schema.sql', 'utf-8');
    console.log('Applying schema...');

    await client.query(schema);
    console.log('✅ Schema applied successfully!');

    // Verify tables
    const { rows } = await client.query(
      "SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename"
    );
    console.log('\nTables created:');
    for (const row of rows) {
      console.log(`  - ${row.tablename}`);
    }
  } catch (err) {
    console.error('❌ Failed to apply schema:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
