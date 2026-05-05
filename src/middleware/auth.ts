// ============================================================
// Auth Middleware — Supabase JWT validation for Hono
// ============================================================

import { createMiddleware } from 'hono/factory'
import { jwt } from 'hono/jwt'
import { getCookie } from 'hono/cookie'
import type { Env, AuthUser } from '../types/index.js'

const JWT_SECRET = process.env.JWT_SECRET || ''

/**
 * Required authentication middleware.
 * Validates the Supabase JWT from the Authorization header.
 * If invalid or missing, returns 401 Unauthorized.
 *
 * After successful validation, the user object is available via:
 *   `c.get('user')` → { id, email, role }
 */
export const authRequired = createMiddleware<Env>(async (c, next) => {
  const authHeader = c.req.header('Authorization')
  let token: string | undefined

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.replace('Bearer ', '')
  } else {
    // Fallback to cookie
    token = getCookie(c, 'sb-luxima-auth-token')
  }

  if (!token) {
    return c.json(
      {
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Missing token in Authorization header or sb-luxima-auth-token cookie.',
        },
      },
      401
    )
  }

  try {
    // Verify JWT using Hono's built-in JWT verification
    const jwtMiddleware = jwt({ secret: JWT_SECRET, alg: 'HS256' })
    await jwtMiddleware(c, async () => {})

    const payload = c.get('jwtPayload' as any)

    const user: AuthUser = {
      id: payload.sub as string,
      email: payload.email as string,
      role: payload.role as string | undefined,
    }

    c.set('user', user)
    await next()
  } catch {
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
})

/**
 * Optional authentication middleware.
 * Attempts to validate a JWT if present, but does NOT block the request
 * if no token is provided. Useful for public endpoints that can
 * optionally track the authenticated user.
 *
 * After execution:
 *   - `c.get('user')` → AuthUser | null
 */
export const authOptional = createMiddleware<Env>(async (c, next) => {
  const authHeader = c.req.header('Authorization')
  let token: string | undefined

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.replace('Bearer ', '')
  } else {
    token = getCookie(c, 'sb-luxima-auth-token')
  }

  if (!token) {
    c.set('user', null)
    await next()
    return
  }

  try {
    const jwtMiddleware = jwt({ secret: JWT_SECRET, alg: 'HS256' })
    await jwtMiddleware(c, async () => {})

    const payload = c.get('jwtPayload' as any)

    const user: AuthUser = {
      id: payload.sub as string,
      email: payload.email as string,
      role: payload.role as string | undefined,
    }

    c.set('user', user)
  } catch {
    // Token invalid but that's okay for optional auth
    c.set('user', null)
  }

  await next()
})
