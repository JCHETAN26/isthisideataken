
import { createClient } from '@supabase/supabase-js';

// Get environment variables with fallbacks to avoid crashing the app
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Log a warning in development/production instead of throwing an error
// This prevents the "blank screen" if environment variables are not yet set in Vercel
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
    console.warn('IsThisIdeaTaken: Supabase environment variables are missing. Some features may not work.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
