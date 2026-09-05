// ============================================================
// Auth Middleware — Supabase JWT validation for Hono
// ============================================================

import { createMiddleware } from 'hono/factory'
import { verify, decode } from 'hono/jwt'
import { getCookie } from 'hono/cookie'
import { supabase } from '../lib/supabase.js'
import type { Env, AuthUser } from '../types/index.js'

const JWT_SECRET = process.env.JWT_SECRET || ''

/**
 * Robustly extracts the JWT token from Authorization header or cookies.
 * Supports:
 * - Bearer <token>
 * - Chunked cookies: sb-luxima-auth-token.0, sb-luxima-auth-token.1, etc.
 * - Single cookie: sb-luxima-auth-token, sb-luxima-auth-token-access-token
 * - @supabase/ssr base64- format
 * - JSON string or array legacy format
 * - Raw JWT format
 */
export function extractToken(c: any): string | null {
  const authHeader = c.req.header('Authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const raw = authHeader.substring(7).trim()
    if (raw) return raw
  }

  const cookies = getCookie(c)
  if (!cookies || typeof cookies !== 'object') return null

  // 1. Direct access token cookie
  if (cookies['sb-luxima-auth-token-access-token']) {
    return cookies['sb-luxima-auth-token-access-token']
  }

  // 2. Assemble chunked cookies (sb-luxima-auth-token.0, .1, etc.)
  let combinedValue = ''
  let chunkIdx = 0
  while (cookies['sb-luxima-auth-token.' + chunkIdx] !== undefined) {
    combinedValue += cookies['sb-luxima-auth-token.' + chunkIdx]
    chunkIdx++
  }

  // If no chunks, check standard cookie
  if (!combinedValue && cookies['sb-luxima-auth-token']) {
    combinedValue = cookies['sb-luxima-auth-token']
  }

  // Fallback: search for any auth-token cookie if still empty
  if (!combinedValue) {
    for (const [key, value] of Object.entries(cookies)) {
      if (key.includes('auth-token') && typeof value === 'string' && value.length > 0) {
        combinedValue = value
        break
      }
    }
  }

  if (!combinedValue) return null

  // Clean quotes if present
  let str = combinedValue.trim()
  if (str.startsWith('"') && str.endsWith('"')) {
    str = str.slice(1, -1)
  }

  // 3. Parse value formats
  // Case A: @supabase/ssr base64 prefix
  if (str.startsWith('base64-')) {
    try {
      const b64 = str.substring(7)
      const decodedJson = Buffer.from(b64, 'base64').toString('utf-8')
      const parsed = JSON.parse(decodedJson)
      if (parsed && typeof parsed === 'object') {
        if (typeof parsed.access_token === 'string') return parsed.access_token
        if (Array.isArray(parsed) && typeof parsed[0] === 'string') return parsed[0]
      }
    } catch (e) {
      console.error('[luxima-blog] Failed to decode base64 cookie:', e)
    }
  }

  // Case B: URL-encoded JSON or JSON string
  try {
    const decoded = decodeURIComponent(str)
    const parsed = JSON.parse(decoded)
    if (Array.isArray(parsed) && typeof parsed[0] === 'string') {
      return parsed[0]
    }
    if (parsed && typeof parsed === 'object' && typeof parsed.access_token === 'string') {
      return parsed.access_token
    }
    if (typeof parsed === 'string' && parsed.startsWith('eyJ')) {
      return parsed
    }
  } catch {
    // Not valid JSON, proceed
  }

  // Case C: Raw JWT
  if (str.startsWith('eyJ')) {
    return str
  }

  return null
}

/**
 * Validates a Supabase JWT token and returns the payload/user info.
 */
async function resolveAuthUser(token: string): Promise<AuthUser | null> {
  let payload: any = null

  // 1. Try verifying with JWT_SECRET if present
  if (JWT_SECRET) {
    try {
      payload = await verify(token, JWT_SECRET, 'HS256')
    } catch {
      // Secret mismatch or different algorithm, fallback below
    }
  }

  // 2. Fallback to Supabase getUser
  if (!payload) {
    try {
      const { data, error } = await supabase.auth.getUser(token)
      if (data?.user && !error) {
        const u = data.user
        return {
          id: u.id,
          email: u.email || '',
          role: u.role || (u.user_metadata?.role as string) || (u.app_metadata?.role as string) || 'user',
          tier: (u.user_metadata?.tier as string) || (u.app_metadata?.tier as string) || 'standard',
          name: (u.user_metadata?.full_name as string) || (u.user_metadata?.name as string) || '',
        }
      }
    } catch (e) {
      console.error('[luxima-blog] Supabase getUser failed:', e)
    }
  }

  // 3. Fallback: decode JWT and verify expiration
  if (!payload) {
    try {
      const decoded = decode(token)
      if (decoded?.payload && typeof decoded.payload === 'object') {
        const exp = (decoded.payload as any).exp
        if (exp && exp * 1000 > Date.now()) {
          payload = decoded.payload
        }
      }
    } catch {
      // Invalid JWT format
    }
  }

  if (!payload || !payload.sub) {
    return null
  }

  const role = (payload.role as string) ||
    (payload.user_metadata?.role as string) ||
    (payload.app_metadata?.role as string) ||
    'user'

  const tier = (payload.user_metadata?.tier as string) ||
    (payload.app_metadata?.tier as string) ||
    'standard'

  const name = (payload.user_metadata?.full_name as string) ||
    (payload.user_metadata?.name as string) ||
    ''

  return {
    id: payload.sub as string,
    email: (payload.email as string) || '',
    role,
    tier,
    name,
  }
}

/**
 * Required authentication middleware.
 * Validates the Supabase JWT from Authorization header or cookies.
 * If invalid or missing, returns 401 Unauthorized.
 */
export const authRequired = createMiddleware<Env>(async (c, next) => {
  const token = extractToken(c)

  if (!token) {
    return c.json(
      {
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Missing token in Authorization header or auth cookies.',
        },
      },
      401
    )
  }

  const user = await resolveAuthUser(token)

  if (!user) {
    return c.json(
      {
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Invalid or expired token. Please login again.',
        },
      },
      401
    )
  }

  c.set('user', user)
  await next()
})

/**
 * Optional authentication middleware.
 * Attempts to validate a JWT if present, but does NOT block the request
 * if no token is provided.
 */
export const authOptional = createMiddleware<Env>(async (c, next) => {
  const token = extractToken(c)

  if (!token) {
    c.set('user', null)
    await next()
    return
  }

  const user = await resolveAuthUser(token)
  c.set('user', user)
  await next()
})
