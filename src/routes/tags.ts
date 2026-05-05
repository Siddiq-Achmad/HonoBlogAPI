// ============================================================
// Tags Routes — CRUD for blog tags
// ============================================================

import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { supabase, supabaseAdmin } from '../lib/supabase.js'
import { successResponse } from '../lib/response.js'
import { generateSlug } from '../lib/slug.js'
import { authRequired } from '../middleware/auth.js'
import { AppError } from '../middleware/error-handler.js'
import { getCache, setCache, delCache } from '../lib/redis.js'
import { CreateTagSchema, UpdateTagSchema } from '../schemas/tag.schema.js'
import type { Env } from '../types/index.js'

const tags = new Hono<Env>()

// ── GET /tags ───────────────────────────────────────────────
tags.get('/', async (c) => {
  const cacheKey = 'tags:list'
  const cachedData = await getCache<any>(cacheKey)
  if (cachedData) return successResponse(c, cachedData)

  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .order('name', { ascending: true })

  if (error) throw new AppError(500, 'DATABASE_ERROR', error.message)

  await setCache(cacheKey, data || [], 3600) // Cache for 1 hour
  return successResponse(c, data || [])
})

// ── POST /tags ──────────────────────────────────────────────

tags.post('/', authRequired, zValidator('json', CreateTagSchema), async (c) => {
  const body = c.req.valid('json')
  const slug = generateSlug(body.name)

  const { data: existing } = await supabase
    .from('tags').select('id').eq('slug', slug).single()

  if (existing) {
    throw new AppError(409, 'TAG_EXISTS', `Tag "${body.name}" already exists`)
  }

  const { data: tag, error } = await supabaseAdmin
    .from('tags').insert({ ...body, slug }).select('*').single()

  if (error) throw new AppError(500, 'CREATE_FAILED', error.message)

  await delCache('tags:list')
  return successResponse(c, tag, 201)
})

// ── PUT /tags/:id ───────────────────────────────────────────

tags.put('/:id', authRequired, zValidator('json', UpdateTagSchema), async (c) => {
  const id = c.req.param('id')
  const body = c.req.valid('json')

  const { data: existing } = await supabase
    .from('tags').select('id').eq('id', id).single()

  if (!existing) throw new AppError(404, 'TAG_NOT_FOUND', 'Tag not found')

  const updateData: any = { ...body }
  if (body.name) {
    updateData.slug = generateSlug(body.name)
    const { data: slugExists } = await supabase
      .from('tags').select('id').eq('slug', updateData.slug).neq('id', id).single()
    if (slugExists) {
      throw new AppError(409, 'TAG_EXISTS', `Tag "${body.name}" already exists`)
    }
  }

  const { data: tag, error } = await supabaseAdmin
    .from('tags').update(updateData).eq('id', id).select('*').single()

  if (error) throw new AppError(500, 'UPDATE_FAILED', error.message)

  await delCache('tags:list')
  return successResponse(c, tag)
})

// ── DELETE /tags/:id ────────────────────────────────────────

tags.delete('/:id', authRequired, async (c) => {
  const id = c.req.param('id')

  const { data: existing } = await supabase
    .from('tags').select('id').eq('id', id).single()

  if (!existing) throw new AppError(404, 'TAG_NOT_FOUND', 'Tag not found')

  await supabaseAdmin.from('post_tags').delete().eq('tag_id', id)

  const { error } = await supabaseAdmin.from('tags').delete().eq('id', id)

  if (error) throw new AppError(500, 'DELETE_FAILED', error.message)

  await delCache('tags:list')
  return successResponse(c, { message: 'Tag deleted successfully' })
})

export default tags
