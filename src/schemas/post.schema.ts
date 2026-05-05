// ============================================================
// Post Validation Schemas
// ============================================================

import { z } from 'zod'

/**
 * Schema for creating a new post.
 */
export const CreatePostSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must not exceed 200 characters'),
  content: z
    .string()
    .min(10, 'Content must be at least 10 characters'),
  description: z
    .string()
    .max(1000, 'Description must not exceed 1000 characters')
    .optional()
    .nullable(),
  cover_image: z
    .string()
    .url('Cover image must be a valid URL')
    .optional()
    .nullable(),
  category_id: z
    .string()
    .uuid('Category ID must be a valid UUID')
    .optional()
    .nullable(),
  reading_time_minutes: z
    .number()
    .int()
    .positive()
    .optional()
    .nullable(),
  tags: z
    .array(z.string())
    .optional()
    .default([]),
})

/**
 * Schema for updating an existing post.
 * All fields are optional — only provided fields are updated.
 */
export const UpdatePostSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must not exceed 200 characters')
    .optional(),
  content: z
    .string()
    .min(10, 'Content must be at least 10 characters')
    .optional(),
  description: z
    .string()
    .max(1000, 'Description must not exceed 1000 characters')
    .optional()
    .nullable(),
  cover_image: z
    .string()
    .url('Cover image must be a valid URL')
    .optional()
    .nullable(),
  category_id: z
    .string()
    .uuid('Category ID must be a valid UUID')
    .optional()
    .nullable(),
  reading_time_minutes: z
    .number()
    .int()
    .positive()
    .optional()
    .nullable(),
  tags: z
    .array(z.string())
    .optional(),
})

/**
 * Schema for post list query parameters.
 */
export const PostQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  category_id: z.string().uuid().optional(),
  tag: z.string().optional(),
  search: z.string().min(1).optional(),
  sort_by: z.enum(['created_at', 'updated_at', 'title']).default('created_at'),
  order: z.enum(['asc', 'desc']).default('desc'),
})

export type CreatePostInput = z.infer<typeof CreatePostSchema>
export type UpdatePostInput = z.infer<typeof UpdatePostSchema>
export type PostQueryInput = z.infer<typeof PostQuerySchema>
