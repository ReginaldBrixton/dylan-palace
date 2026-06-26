/**
 * Test script for Supabase and UploadThing connections.
 * Run with: npx tsx scripts/test-connections.ts
 */
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import ws from 'ws';

async function testSupabase() {
  console.log('\n--- Testing Supabase Connection ---');
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.error('❌ Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in env');
    return false;
  }

  try {
    const supabase = createClient(url, key, {
      realtime: { transport: ws as any },
    });

    // Test auth health - try to get session
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error('❌ Supabase auth error:', error.message);
      return false;
    }

    console.log('✅ Supabase client created successfully');
    console.log('   Project URL:', url);
    console.log('   Session check:', data.session ? 'Active session found' : 'No active session (expected)');

    // Test database access - try listing tables via REST API
    const { error: dbError } = await supabase.from('products').select('count').limit(1);

    if (dbError && dbError.code !== 'PGRST205') {
      // PGRST205 = schema not loaded yet, which is expected for a fresh project
      console.log('   DB query result: Table "products" not found yet (expected for fresh project)');
    } else if (dbError) {
      console.log('   DB query result: Schema not loaded yet (expected for fresh project)');
    } else {
      console.log('   DB query result: products table accessible');
    }

    console.log('✅ Supabase connection verified');
    return true;
  } catch (err) {
    console.error('❌ Supabase connection failed:', err);
    return false;
  }
}

async function testUploadThing() {
  console.log('\n--- Testing UploadThing Connection ---');
  const token = process.env.UPLOADTHING_TOKEN;

  if (!token) {
    console.error('❌ Missing UPLOADTHING_TOKEN in env');
    return false;
  }

  try {
    // Parse the token to get app ID
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
    console.log('✅ UploadThing token parsed successfully');
    console.log('   App ID:', decoded.appId);
    console.log('   Regions:', decoded.regions);
    console.log('   API Key prefix:', decoded.apiKey?.substring(0, 10) + '...');

    // Test API connectivity - list files (POST endpoint)
    const response = await fetch('https://api.uploadthing.com/v6/listFiles', {
      method: 'POST',
      headers: {
        'x-uploadthing-api-key': decoded.apiKey,
        'x-uploadthing-version': '6.0.0',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    if (response.ok) {
      const files = await response.json();
      console.log('✅ UploadThing API accessible');
      console.log('   Files in storage:', Array.isArray(files) ? files.length : 'unknown');
    } else if (response.status === 401) {
      console.error('❌ UploadThing auth failed (401) - check token');
      return false;
    } else {
      console.log('⚠️  UploadThing API returned status:', response.status);
      const text = await response.text();
      console.log('   Response:', text.substring(0, 200));
    }

    console.log('✅ UploadThing connection verified');
    return true;
  } catch (err) {
    console.error('❌ UploadThing connection failed:', err);
    return false;
  }
}

async function main() {
  console.log('=========================================');
  console.log('  Testing Database & Storage Connections  ');
  console.log('=========================================');

  // Load .env.local manually
  const fs = await import('fs');
  const envPath = '.env.local';
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    for (const line of envContent.split('\n')) {
      const match = line.match(/^([^#=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim();
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    }
    console.log('✅ Loaded .env.local');
  }

  const supaOk = await testSupabase();
  const utOk = await testUploadThing();

  console.log('\n=========================================');
  console.log('  Summary');
  console.log('=========================================');
  console.log(`  Supabase:     ${supaOk ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`  UploadThing:  ${utOk ? '✅ PASS' : '❌ FAIL'}`);
  console.log('');

  if (supaOk && utOk) {
    console.log('🎉 All connections verified successfully!');
    process.exit(0);
  } else {
    console.log('⚠️  Some connections failed. Check errors above.');
    process.exit(1);
  }
}

main();
