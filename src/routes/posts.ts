// ============================================================
// Posts Routes — Full CRUD with pagination, search, filtering
// ============================================================

import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { supabase, supabaseAdmin } from '../lib/supabase.js'
import { successResponse, paginatedResponse, errorResponse } from '../lib/response.js'
import { generateSlug } from '../lib/slug.js'
import { authRequired, authOptional } from '../middleware/auth.js'
import { AppError } from '../middleware/error-handler.js'
import { getCache, setCache, delCache } from '../lib/redis.js'
import {
  CreatePostSchema,
  UpdatePostSchema,
  PostQuerySchema,
} from '../schemas/post.schema.js'
import type { Env } from '../types/index.js'

const posts = new Hono<Env>()

// ── GET /posts/rss — RSS Feed generator ─────────────────────
posts.get('/rss', async (c) => {
  const cacheKey = 'rss:feed'
  const cachedRss = await getCache<string>(cacheKey)
  if (cachedRss) {
    c.header('Content-Type', 'application/xml')
    return c.body(cachedRss)
  }

  const { data: latestPosts, error } = await supabase
    .from('posts')
    .select('*, author:profiles_view(fullName), category:categories(name)')
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) throw new AppError(500, 'RSS_GENERATION_FAILED', error.message)

  const baseUrl = 'https://luxima.id'
  const rssItems = (latestPosts || []).map(post => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${baseUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.created_at).toUTCString()}</pubDate>
      <description><![CDATA[${post.description || ''}]]></description>
      <category>${post.category?.name || 'General'}</category>
      <author>${post.author?.fullName || 'LUXIMA'}</author>
    </item>
  `).join('')

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0" xmlns:atom="http://www.w3.org/2007/Atom">
      <channel>
        <title>LUXIMA Blog</title>
        <link>${baseUrl}</link>
        <description>Elite content from LUXIMA infrastructure.</description>
        <language>en-us</language>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        ${rssItems}
      </channel>
    </rss>`.trim()

  await setCache(cacheKey, rssFeed, 1800) // 30 minutes cache

  c.header('Content-Type', 'application/xml')
  return c.body(rssFeed)
})

// ── GET /posts — List posts (public, paginated) ─────────────

posts.get('/', zValidator('query', PostQuerySchema), async (c) => {
  const queryParams = c.req.valid('query')
  const cacheKey = `posts:list:${JSON.stringify(queryParams)}`
  
  const cachedData = await getCache<any>(cacheKey)
  if (cachedData) return c.json(cachedData)

  const {
    page,
    limit,
    category_id,
    tag,
    search,
    sort_by,
    order,
  } = queryParams

  const offset = (page - 1) * limit

  // Build the base query
  let query = supabase
    .from('posts')
    .select(
      `
      *,
      author:profiles_view(id, fullName, avatar),
      category:categories(id, name, slug)
    `,
      { count: 'exact' }
    )

  if (category_id) {
    query = query.eq('category_id', category_id)
  }

  if (tag) {
    query = query.contains('tags', [tag])
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,content.ilike.%${search}%`)
  }

  // Apply sorting and pagination
  query = query
    .order(sort_by, { ascending: order === 'asc' })
    .range(offset, offset + limit - 1)

  const { data, error, count } = await query

  if (error) {
    throw new AppError(500, 'DATABASE_ERROR', error.message)
  }

  const response = paginatedResponse(c, data || [], page, limit, count || 0)
  // Cache for 5 minutes
  await setCache(cacheKey, response, 300)
  
  return response
})

// ── GET /posts/:slug — Get single post by slug ──────────────

posts.get('/:slug', async (c) => {
  const slug = c.req.param('slug')
  const cacheKey = `post:slug:${slug}`

  const cachedPost = await getCache<any>(cacheKey)
  if (cachedPost) {
    // Still increment views in background
    supabaseAdmin.rpc('increment_post_views', { post_id: cachedPost.id }).then(({ error }) => {
      if (error) console.error('Failed to increment views (cached):', error)
    })
    return successResponse(c, cachedPost)
  }

  const { data: post, error } = await supabase
    .from('posts')
    .select(
      `
      *,
      author:profiles_view(id, fullName, avatar, username),
      category:categories(id, name, slug)
    `
    )
    .eq('slug', slug)
    .single()

  if (error || !post) {
    throw new AppError(404, 'POST_NOT_FOUND', `Post with slug "${slug}" not found`)
  }

  // Increment views in the background
  supabaseAdmin.rpc('increment_post_views', { post_id: post.id }).then(({ error }) => {
    if (error) console.error('Failed to increment views:', error)
  })

  await setCache(cacheKey, post, 600) // Cache for 10 minutes
  return successResponse(c, post)
})

// ── POST /posts — Create new post ───────────────────────────

posts.post('/', authRequired, zValidator('json', CreatePostSchema), async (c) => {
  const user = c.get('user')!
  const body = c.req.valid('json')

  // Generate slug from title
  const slug = generateSlug(body.title)

  // Check if slug already exists
  const { data: existing } = await supabase
    .from('posts')
    .select('id')
    .eq('slug', slug)
    .single()

  const finalSlug = existing
    ? `${slug}-${Date.now().toString(36)}`
    : slug

  // Insert the post
  const { data: post, error } = await supabaseAdmin
    .from('posts')
    .insert({
      ...body,
      slug: finalSlug,
      author_id: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select(
      `
      *,
      author:profiles_view(id, fullName, avatar),
      category:categories(id, name, slug)
    `
    )
    .single()

  if (error) {
    throw new AppError(500, 'CREATE_FAILED', error.message)
  }

  // Invalidate caches
  await delCache('rss:feed')
  await delCache('sitemap:xml')
  // Note: we can't easily invalidate all paginated lists, but they have short TTL (5m)

  return successResponse(c, post, 201)
})

// ── PUT /posts/:id — Update post (author only) ──────────────

posts.put(
  '/:id',
  authRequired,
  zValidator('json', UpdatePostSchema),
  async (c) => {
    const user = c.get('user')!
    const postId = c.req.param('id')
    const updateData = c.req.valid('json')

    // Verify post exists and user is the author
    const { data: existingPost, error: findError } = await supabase
      .from('posts')
      .select('id, author_id')
      .eq('id', postId)
      .single()

    if (findError || !existingPost) {
      throw new AppError(404, 'POST_NOT_FOUND', 'Post not found')
    }

    if (existingPost.author_id !== user.id) {
      throw new AppError(403, 'FORBIDDEN', 'You can only edit your own posts')
    }

    // If title is being updated, regenerate slug
    if (updateData.title) {
      const newSlug = generateSlug(updateData.title)
      const { data: slugExists } = await supabase
        .from('posts')
        .select('id')
        .eq('slug', newSlug)
        .neq('id', postId)
        .single()

      ;(updateData as any).slug = slugExists
        ? `${newSlug}-${Date.now().toString(36)}`
        : newSlug
    }

    // Update the post
    const { data: updatedPost, error: updateError } = await supabaseAdmin
      .from('posts')
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', postId)
      .select(
        `
        *,
        author:profiles_view(id, fullName, avatar),
        category:categories(id, name, slug)
      `
      )
      .single()

    if (updateError) {
      throw new AppError(500, 'UPDATE_FAILED', updateError.message)
    }

    return successResponse(c, updatedPost)
  }
)

// ── DELETE /posts/:id — Delete post (author only) ───────────

posts.delete('/:id', authRequired, async (c) => {
  const user = c.get('user')!
  const postId = c.req.param('id')

  // Verify post exists and user is the author
  const { data: existingPost, error: findError } = await supabase
    .from('posts')
    .select('id, author_id')
    .eq('id', postId)
    .single()

  if (findError || !existingPost) {
    throw new AppError(404, 'POST_NOT_FOUND', 'Post not found')
  }

  if (existingPost.author_id !== user.id) {
    throw new AppError(403, 'FORBIDDEN', 'You can only delete your own posts')
  }

  // Delete related comments
  await supabaseAdmin.from('comments').delete().eq('post_id', postId)

  // Delete the post
  const { error: deleteError } = await supabaseAdmin
    .from('posts')
    .delete()
    .eq('id', postId)

  if (deleteError) {
    throw new AppError(500, 'DELETE_FAILED', deleteError.message)
  }

  return successResponse(c, { message: 'Post deleted successfully' })
})

export default posts
