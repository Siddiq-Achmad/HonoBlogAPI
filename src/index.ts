import "dotenv/config"
// ============================================================
// Blog API — Main Entry Point
// ============================================================

import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'
import { timing } from 'hono/timing'
import { rateLimiter, RedisStore } from 'hono-rate-limiter'
import { secureHeaders } from 'hono/secure-headers'
import { compress } from 'hono/compress'
import { etag } from 'hono/etag'

import { notFoundHandler, globalErrorHandler } from './middleware/error-handler.js'
import type { Env } from './types/index.js'
import { readFile } from 'node:fs/promises'

// Route imports
import { supabase } from './lib/supabase.js'
import { redis, getCache, setCache, rateLimitClient } from './lib/redis.js'
import authRoutes from './routes/auth.js'
import postRoutes from './routes/posts.js'
import categoryRoutes from './routes/categories.js'
import tagRoutes from './routes/tags.js'
import commentRoutes from './routes/comments.js'
import storageRoutes from './routes/storage.js'

// ── Initialize App ──────────────────────────────────────────

const app = new Hono<Env>()

// ── Global Middleware ───────────────────────────────────────

// Redis-backed Rate Limiting
const limiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-6',
  keyGenerator: (c) => c.req.header('x-forwarded-for') || 'anonymous',
  store: new RedisStore({
    // @ts-ignore
    client: rateLimitClient,
    prefix: 'hono-rate-limit:',
  }),
})

app.use('*', limiter)
app.use('*', secureHeaders({
  contentSecurityPolicy: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdn.jsdelivr.net"],
    styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
    imgSrc: ["'self'", "data:", "blob:", "https://r2.luxima.id", "https://*.supabase.co", "https://lh3.googleusercontent.com", "https://*.luxima.id"],
    connectSrc: ["'self'", "https://*.supabase.co", "https://auth.luxima.id"],
    frameAncestors: ["'none'"],
  },
  xFrameOptions: 'DENY',
  xContentTypeOptions: 'nosniff',
  strictTransportSecurity: 'max-age=31536000; includeSubDomains',
  referrerPolicy: 'strict-origin-when-cross-origin',
}))
app.use('*', compress())
app.use('*', etag())
app.use('*', logger())
app.use('*', prettyJSON())
app.use('*', timing())
app.use(
  '*',
  cors({
    origin: (origin) => {
      if (!origin) return 'https://luxima.id';
      if (
        origin.endsWith('.luxima.id') ||
        origin.endsWith('.awedz.id') ||
        origin.startsWith('http://localhost:') ||
        origin.startsWith('http://127.0.0.1:')
      ) {
        return origin;
      }
      return 'https://luxima.id';
    },
    credentials: true,
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposeHeaders: ['X-Total-Count'],
    maxAge: 86400,
  })
)

// ── Static Files ───────────────────────────────────────────
if (typeof Bun !== 'undefined') {
  const { serveStatic } = await import('hono/bun')
  app.use('/src/*', serveStatic({ root: './' }))
  app.use('/favicon.ico', serveStatic({ path: './favicon.ico' }))
}

// ── API Routes ──────────────────────────────────────────────

const api = app.basePath('/api')

// ── Backend API Info Route (/api and /api/) ────────────────
api.get('/', (c) => c.json({
  success: true,
  service: 'LUXIMA Editorial & Magazine API',
  version: '1.0.2',
  engine: 'Astro v7 + Hono v4.7',
  health: '/api/health',
  documentation: 'https://blog.luxima.id/api'
}))

// Health Check
api.get('/health', async (c) => {
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

// Sitemap Generator
api.get('/sitemap.xml', async (c) => {
  // Use caching for sitemap
  const cacheKey = 'sitemap:xml'
  const cachedSitemap = await getCache<string>(cacheKey)
  if (cachedSitemap) {
    c.header('Content-Type', 'application/xml')
    c.header('Cache-Control', 'public, max-age=3600')
    return c.body(cachedSitemap)
  }

  const { data: posts } = await supabase.from('posts').select('slug, updated_at')
  const { data: categories } = await supabase.from('categories').select('slug')

  const escapeXml = (unsafe: string) =>
    String(unsafe || '').replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case "'": return '&apos;';
        case '"': return '&quot;';
        default: return c;
      }
    });

  const baseUrl = process.env.BASE_URL || 'https://blog.luxima.id'
  const postUrls = (posts || []).map(p => `
    <url>
      <loc>${baseUrl}/blog/${escapeXml(p.slug)}</loc>
      <lastmod>${new Date(p.updated_at).toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>`).join('')

  const catUrls = (categories || []).map(c => `
    <url>
      <loc>${baseUrl}/categories/${escapeXml(c.slug)}</loc>
      <changefreq>monthly</changefreq>
      <priority>0.5</priority>
    </url>`).join('')

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>${baseUrl}</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
      </url>
      ${postUrls}
      ${catUrls}
    </urlset>`.trim()

  await setCache(cacheKey, sitemap, 3600) // Cache for 1 hour

  c.header('Content-Type', 'application/xml')
  c.header('Cache-Control', 'public, max-age=3600')
  return c.body(sitemap)
})

// Robots.txt
api.get('/robots.txt', (c) => {
  const baseUrl = process.env.BASE_URL || 'https://blog.luxima.id'
  const robots = `
User-agent: *
Allow: /
Sitemap: ${baseUrl}/api/sitemap.xml
`.trim()
  return c.text(robots)
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

export { app }
