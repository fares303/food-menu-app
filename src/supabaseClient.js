import { createClient } from '@supabase/supabase-js'

// These will be replaced with your actual Supabase URL and anon key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Debug environment variables
console.log('Supabase URL defined:', !!supabaseUrl)
console.log('Supabase Anon Key defined:', !!supabaseAnonKey)

// Fallback to default values if environment variables are not set
const finalSupabaseUrl = supabaseUrl || 'https://your-project-url.supabase.co'
const finalSupabaseAnonKey = supabaseAnonKey || 'public-anon-key'

export const supabase = createClient(finalSupabaseUrl, finalSupabaseAnonKey)
