import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Validate URL format
if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('.supabase.co')) {
  throw new Error('Invalid VITE_SUPABASE_URL format. Expected format: https://your-project-id.supabase.co');
}

// Validate anon key format (basic check)
if (supabaseAnonKey.includes('your-anon') || supabaseAnonKey.length < 100) {
  throw new Error('Invalid VITE_SUPABASE_ANON_KEY. Please use your actual Supabase anon key from the dashboard.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);