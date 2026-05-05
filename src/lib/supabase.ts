// ============================================================
// Supabase Client — Initialize public and admin clients
// ============================================================

import { createClient } from '@supabase/supabase-js'

// Validate environment variables
const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
  console.error('❌ Environment Variables Error:', {
    SUPABASE_URL: supabaseUrl ? 'Set' : 'Missing',
    SUPABASE_ANON_KEY: supabaseAnonKey ? 'Set' : 'Missing',
    SUPABASE_SERVICE_ROLE_KEY: supabaseServiceRoleKey ? 'Set' : 'Missing',
  })
  throw new Error('Missing required Supabase environment variables.')
}

// Optimization for Cloudflare / Self-hosted WAF
const globalHeaders = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'X-Client-Info': 'luxima-hono-api@1.0.2',
}

// ── Standard Client (Anon) ──────────────────────────────────
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: { headers: globalHeaders },
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
})

// ── Admin Client (Service Role) ─────────────────────────────
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  global: { headers: globalHeaders },
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
})
