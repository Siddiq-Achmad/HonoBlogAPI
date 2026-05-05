// ============================================================
// Category Validation Schemas
// ============================================================

import { z } from 'zod'

/**
 * Schema for creating a new category.
 */
export const CreateCategorySchema = z.object({
  name: z
    .string()
    .min(2, 'Category name must be at least 2 characters')
    .max(100, 'Category name must not exceed 100 characters'),
  description: z
    .string()
    .max(500, 'Description must not exceed 500 characters')
    .optional()
    .nullable(),
  icon: z.string().optional().nullable(),
  parent_id: z.string().uuid().optional().nullable(),
  sort_order: z.number().int().default(0),
  status: z.enum(['active', 'inactive']).default('active'),
  image: z.string().url().optional().nullable(),
})

/**
 * Schema for updating a category.
 */
export const UpdateCategorySchema = z.object({
  name: z
    .string()
    .min(2, 'Category name must be at least 2 characters')
    .max(100, 'Category name must not exceed 100 characters')
    .optional(),
  description: z
    .string()
    .max(500, 'Description must not exceed 500 characters')
    .optional()
    .nullable(),
  icon: z.string().optional().nullable(),
  parent_id: z.string().uuid().optional().nullable(),
  sort_order: z.number().int().optional(),
  status: z.enum(['active', 'inactive']).optional(),
  image: z.string().url().optional().nullable(),
})

export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>
export type UpdateCategoryInput = z.infer<typeof UpdateCategorySchema>
