import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kgkmxeuchwchqrblfhro.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_FHsrI9Wjn7DSRNZ19o4Oag_Dv5QH7jH';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: { eventsPerSecond: 1 },
  },
  global: {
    headers: { 'x-application-name': 'dylan-palace' },
  },
  db: {
    schema: 'public',
  },
});
