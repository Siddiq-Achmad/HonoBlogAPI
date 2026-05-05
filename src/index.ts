import "dotenv/config"
// ============================================================
// Blog API — Main Entry Point
// ============================================================

import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'
import { timing } from 'hono/timing'
import { rateLimiter } from 'hono-rate-limiter'

import { notFoundHandler, globalErrorHandler } from './middleware/error-handler.js'
import type { Env } from './types/index.js'

import { supabase } from './lib/supabase.js'
import authRoutes from './routes/auth.js'
import postRoutes from './routes/posts.js'
import categoryRoutes from './routes/categories.js'
import tagRoutes from './routes/tags.js'
import commentRoutes from './routes/comments.js'
import storageRoutes from './routes/storage.js'

// ── Initialize App ──────────────────────────────────────────

const app = new Hono<Env>()

// ── Global Middleware ───────────────────────────────────────

// Rate Limiting: 100 requests per 15 minutes
const limiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-6',
  keyGenerator: (c) => c.req.header('x-forwarded-for') || 'anonymous',
})

app.use('*', limiter)
app.use('*', logger())
app.use('*', prettyJSON())
app.use('*', timing())
app.use(
  '*',
  cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    exposeHeaders: ['X-Total-Count'],
    maxAge: 86400,
  })
)

// ── Health Check ────────────────────────────────────────────

const api = app.basePath('/api')

api.get('/health', async (c) => {
  // Check Supabase Connectivity
  const { error } = await supabase.from('categories').select('id', { count: 'estimated', head: true }).limit(1)
  const isDbHealthy = !error

  return c.json({
    success: true,
    data: {
      status: 'healthy',
      database: isDbHealthy ? 'connected' : 'disconnected',
      dbError: error ? error.message : null,
      timestamp: new Date().toISOString(),
      version: '1.0.2',
    },
  })
})

// ── Mount Routes ────────────────────────────────────────────

api.route('/auth', authRoutes)
api.route('/posts', postRoutes)
api.route('/categories', categoryRoutes)
api.route('/tags', tagRoutes)
api.route('/comments', commentRoutes)
api.route('/storage', storageRoutes)

// ── Error Handlers ──────────────────────────────────────────

app.notFound(notFoundHandler)
app.onError(globalErrorHandler)

// ── Start Server (Bun Native) ───────────────────────────────

export default {
  port: Number(process.env.PORT) || 3000,
  fetch: app.fetch,
}
