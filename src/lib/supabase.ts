import { createClient } from '@supabase/supabase-js';

// Hardcoded credentials с fallback из .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://bbayqzqlqgqipohulcsd.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_FmZxEB3IzAM-KrIbH372xQ_vMx5KJ42';

// Debug log (можно удалить позже)
console.log('🔧 Supabase Config:');
console.log('  URL from env:', import.meta.env.VITE_SUPABASE_URL ? '✅' : '❌ (using hardcoded)');
console.log('  KEY from env:', import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅' : '❌ (using hardcoded)');
console.log('  Final URL:', supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('✅ Supabase client initialized');
