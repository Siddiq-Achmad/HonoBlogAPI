// ============================================================
// Comments Routes — Create, list, delete comments
// ============================================================

import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { supabase, supabaseAdmin } from '../lib/supabase.js'
import { successResponse, paginatedResponse } from '../lib/response.js'
import { authRequired } from '../middleware/auth.js'
import { AppError } from '../middleware/error-handler.js'
import { CreateCommentSchema, CommentQuerySchema } from '../schemas/comment.schema.js'
import type { Env } from '../types/index.js'

const comments = new Hono<Env>()

// ── GET /comments — List comments ───────────────────────────

comments.get('/', zValidator('query', CommentQuerySchema), async (c) => {
  const { page, limit, post_id } = c.req.valid('query')
  const offset = (page - 1) * limit

  let query = supabase
    .from('comments')
    .select(
      `
      *,
      user:profiles_view(id, fullName, avatar)
    `,
      { count: 'exact' }
    )

  if (post_id) query = query.eq('post_id', post_id)

  query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1)

  const { data, error, count } = await query

  if (error) throw new AppError(500, 'DATABASE_ERROR', error.message)

  return paginatedResponse(c, data || [], page, limit, count || 0)
})

// ── POST /comments — Create a comment (Auth Required) ───────

comments.post('/', authRequired, zValidator('json', CreateCommentSchema), async (c) => {
  const user = c.get('user')!
  const body = c.req.valid('json')

  // Verify post exists
  const { data: post } = await supabase
    .from('posts').select('id').eq('id', body.post_id).single()

  if (!post) throw new AppError(404, 'POST_NOT_FOUND', 'Post not found')

  const { data: comment, error } = await supabaseAdmin
    .from('comments')
    .insert({ 
      ...body, 
      user_id: user.id,
      created_at: new Date().toISOString()
    })
    .select(`
      *,
      user:profiles_view(id, fullName, avatar)
    `)
    .single()

  if (error) throw new AppError(500, 'CREATE_FAILED', error.message)

  return successResponse(c, comment, 201)
})

// ── DELETE /comments/:id — Delete a comment (Owner only) ────

comments.delete('/:id', authRequired, async (c) => {
  const user = c.get('user')!
  const id = c.req.param('id')

  const { data: existing, error: findError } = await supabaseAdmin
    .from('comments').select('id, user_id').eq('id', id).single()

  if (findError || !existing) throw new AppError(404, 'COMMENT_NOT_FOUND', 'Comment not found')

  if (existing.user_id !== user.id) {
    throw new AppError(403, 'FORBIDDEN', 'You can only delete your own comments')
  }

  const { error } = await supabaseAdmin.from('comments').delete().eq('id', id)

  if (error) throw new AppError(500, 'DELETE_FAILED', error.message)

  return successResponse(c, { message: 'Comment deleted successfully' })
})

export default comments
