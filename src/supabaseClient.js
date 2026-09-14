import { createClient } from '@supabase/supabase-js';

// Lee las variables de entorno de Vite/Vercel o usa valores por defecto
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);