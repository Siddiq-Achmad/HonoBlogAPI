// ============================================================
// Auth Routes — Registration, Login, Logout, Profile
// ============================================================

import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { supabase, supabaseAdmin } from '../lib/supabase.js'
import { successResponse, errorResponse } from '../lib/response.js'
import { authRequired } from '../middleware/auth.js'
import type { Env } from '../types/index.js'

const auth = new Hono<Env>()

// ── Root Auth ───────────────────────────────────────────────

auth.get('/', (c) => {
  return c.json({
    message: 'Auth module is running',
    endpoints: {
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
      me: 'GET /api/auth/me',
      refresh: 'POST /api/auth/refresh',
      logout: 'POST /api/auth/logout'
    }
  })
})

// ── Validation Schemas ──────────────────────────────────────

const RegisterSchema = z.object({
  email: z.string().email('Must be a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  username: z.string().min(3).max(30).optional(),
})

const LoginSchema = z.object({
  email: z.string().email('Must be a valid email'),
  password: z.string().min(1, 'Password is required'),
})

// ── POST /auth/register ─────────────────────────────────────

auth.post('/register', zValidator('json', RegisterSchema), async (c) => {
  const { email, password, name, username } = c.req.valid('json')

  // Register user via Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name, username },
    },
  })

  if (authError) {
    return errorResponse(c, 400, 'REGISTRATION_FAILED', authError.message)
  }

  if (!authData.user) {
    return errorResponse(c, 400, 'REGISTRATION_FAILED', 'Failed to create user')
  }

  // Create profile in the identity.profiles table
  const { error: profileError } = await supabaseAdmin
    .schema('identity')
    .from('profiles')
    .insert({
      id: authData.user.id,
      full_name: name,
      username: username || email.split('@')[0],
      updated_at: new Date().toISOString(),
    })

  if (profileError) {
    console.error('Failed to create profile:', profileError)
  }

  return successResponse(
    c,
    {
      user: {
        id: authData.user.id,
        email: authData.user.email,
      },
      session: authData.session
        ? {
            access_token: authData.session.access_token,
            refresh_token: authData.session.refresh_token,
            expires_at: authData.session.expires_at,
          }
        : null,
      message: authData.session
        ? 'Registration successful'
        : 'Registration successful. Please check your email for verification.',
    },
    201
  )
})

// ── POST /auth/login ────────────────────────────────────────

auth.post('/login', zValidator('json', LoginSchema), async (c) => {
  const { email, password } = c.req.valid('json')

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return errorResponse(c, 401, 'LOGIN_FAILED', error.message)
  }

  return successResponse(c, {
    user: {
      id: data.user.id,
      email: data.user.email,
      name: data.user.user_metadata?.full_name || null,
    },
    session: {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_at: data.session.expires_at,
    },
  })
})

// ── POST /auth/refresh ──────────────────────────────────────

auth.post(
  '/refresh',
  zValidator('json', z.object({ refresh_token: z.string() })),
  async (c) => {
    const { refresh_token } = c.req.valid('json')

    const { data, error } = await supabase.auth.refreshSession({
      refresh_token,
    })

    if (error || !data.session) {
      return errorResponse(
        c,
        401,
        'REFRESH_FAILED',
        error?.message || 'Failed to refresh session'
      )
    }

    return successResponse(c, {
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at,
      },
    })
  }
)

// ── POST /auth/logout ───────────────────────────────────────

auth.post('/logout', authRequired, async (c) => {
  const { error } = await supabase.auth.signOut()

  if (error) {
    return errorResponse(c, 500, 'LOGOUT_FAILED', error.message)
  }

  return successResponse(c, { message: 'Logged out successfully' })
})

// ── GET /auth/me ────────────────────────────────────────────

auth.get('/me', authRequired, async (c) => {
  const user = c.get('user')!

  const { data: profile, error } = await supabaseAdmin
    .from('profiles_view')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error || !profile) {
    return errorResponse(c, 404, 'PROFILE_NOT_FOUND', 'User profile not found')
  }

  return successResponse(c, profile)
})

export default auth
