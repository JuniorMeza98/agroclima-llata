import { createClient } from '@supabase/supabase-js';

// Reemplaza estos dos valores con los de tu proyecto en Supabase
const SUPABASE_URL = 'https://cnfjtxmafqaajvvlkxyd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNuZmp0eG1hZnFhYWp2dmxreHlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzOTYzNzAsImV4cCI6MjEwNDk3MjM3MH0.C9lB75PE5--sUZgHLdMvv9l23mMQKK05cIztGuU2-A0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);