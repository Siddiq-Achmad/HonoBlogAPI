// ============================================================
// Supabase Client — Initialize public and admin clients
// ============================================================

import { createClient } from '@supabase/supabase-js'

// Bun automatically loads .env into process.env
const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
  console.error('❌ Environment Variables Error:', {
    SUPABASE_URL: supabaseUrl ? 'Set' : 'Missing',
    SUPABASE_ANON_KEY: supabaseAnonKey ? 'Set' : 'Missing',
    SUPABASE_SERVICE_ROLE_KEY: supabaseServiceRoleKey ? 'Set' : 'Missing'
  })
  throw new Error('Missing required Supabase environment variables.')
}

// Client for public operations (respects RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Client for administrative operations (bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})
