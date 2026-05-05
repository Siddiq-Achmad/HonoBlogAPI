// ============================================================
// Categories Routes — CRUD for blog categories
// ============================================================

import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { supabase, supabaseAdmin } from '../lib/supabase.js'
import { successResponse } from '../lib/response.js'
import { generateSlug } from '../lib/slug.js'
import { authRequired } from '../middleware/auth.js'
import { AppError } from '../middleware/error-handler.js'
import {
  CreateCategorySchema,
  UpdateCategorySchema,
} from '../schemas/category.schema.js'
import type { Env } from '../types/index.js'

const categories = new Hono<Env>()

// ── GET /categories — List all categories ───────────────────

categories.get('/', async (c) => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) {
    throw new AppError(500, 'DATABASE_ERROR', error.message)
  }

  // Get post counts for each active category
  const categoriesWithCount = await Promise.all(
    (data || []).map(async (category) => {
      const { count } = await supabase
        .from('posts')
        .select('id', { count: 'exact', head: true })
        .eq('category_id', category.id)

      return {
        ...category,
        post_count: count || 0,
      }
    })
  )

  return successResponse(c, categoriesWithCount)
})

// ── GET /categories/:slug — Get single category ─────────────

categories.get('/:slug', async (c) => {
  const slug = c.req.param('slug')

  const { data: category, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !category) {
    throw new AppError(
      404,
      'CATEGORY_NOT_FOUND',
      `Category with slug "${slug}" not found`
    )
  }

  // Get post count
  const { count } = await supabase
    .from('posts')
    .select('id', { count: 'exact', head: true })
    .eq('category_id', category.id)

  return successResponse(c, {
    ...category,
    post_count: count || 0,
  })
})

// ── POST /categories — Create category ──────────────────────

categories.post(
  '/',
  authRequired,
  zValidator('json', CreateCategorySchema),
  async (c) => {
    const body = c.req.valid('json')
    const slug = generateSlug(body.name)

    // Check if slug already exists
    const { data: existing } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', slug)
      .single()

    if (existing) {
      throw new AppError(
        409,
        'CATEGORY_EXISTS',
        `A category with the name "${body.name}" already exists`
      )
    }

    const { data: category, error } = await supabaseAdmin
      .from('categories')
      .insert({
        ...body,
        slug,
      })
      .select('*')
      .single()

    if (error) {
      throw new AppError(500, 'CREATE_FAILED', error.message)
    }

    return successResponse(c, category, 201)
  }
)

// ── PUT /categories/:id — Update category ───────────────────

categories.put(
  '/:id',
  authRequired,
  zValidator('json', UpdateCategorySchema),
  async (c) => {
    const id = c.req.param('id')
    const body = c.req.valid('json')

    // Check category exists
    const { data: existing } = await supabase
      .from('categories')
      .select('id')
      .eq('id', id)
      .single()

    if (!existing) {
      throw new AppError(404, 'CATEGORY_NOT_FOUND', 'Category not found')
    }

    // If name is being updated, regenerate slug
    const updateData: any = { ...body }
    if (body.name) {
      updateData.slug = generateSlug(body.name)

      // Check slug uniqueness
      const { data: slugExists } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', updateData.slug)
        .neq('id', id)
        .single()

      if (slugExists) {
        throw new AppError(
          409,
          'CATEGORY_EXISTS',
          `A category with the name "${body.name}" already exists`
        )
      }
    }

    const { data: category, error } = await supabaseAdmin
      .from('categories')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single()

    if (error) {
      throw new AppError(500, 'UPDATE_FAILED', error.message)
    }

    return successResponse(c, category)
  }
)

// ── DELETE /categories/:id — Delete category ────────────────

categories.delete('/:id', authRequired, async (c) => {
  const id = c.req.param('id')

  // Check category exists
  const { data: existing } = await supabase
    .from('categories')
    .select('id')
    .eq('id', id)
    .single()

  if (!existing) {
    throw new AppError(404, 'CATEGORY_NOT_FOUND', 'Category not found')
  }

  // Check if category has posts
  const { count } = await supabase
    .from('posts')
    .select('id', { count: 'exact', head: true })
    .eq('category_id', id)

  if (count && count > 0) {
    throw new AppError(
      409,
      'CATEGORY_HAS_POSTS',
      `Cannot delete category — it has ${count} associated post(s). Reassign them first.`
    )
  }

  const { error } = await supabaseAdmin
    .from('categories')
    .delete()
    .eq('id', id)

  if (error) {
    throw new AppError(500, 'DELETE_FAILED', error.message)
  }

  return successResponse(c, { message: 'Category deleted successfully' })
})

export default categories
