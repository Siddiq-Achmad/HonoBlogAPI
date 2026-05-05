// ============================================================
// Comment Validation Schemas
// ============================================================

import { z } from 'zod'

/**
 * Schema for creating a new comment.
 */
export const CreateCommentSchema = z.object({
  post_id: z
    .string()
    .uuid('Post ID must be a valid UUID'),
  content: z
    .string()
    .min(3, 'Comment must be at least 3 characters')
    .max(2000, 'Comment must not exceed 2000 characters'),
})

/**
 * Schema for listing comments (query params).
 */
export const CommentQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  post_id: z.string().uuid().optional(),
  is_approved: z
    .enum(['true', 'false'])
    .transform((val) => val === 'true')
    .optional(),
})

export type CreateCommentInput = z.infer<typeof CreateCommentSchema>
export type CommentQueryInput = z.infer<typeof CommentQuerySchema>
