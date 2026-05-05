// ============================================================
// Tag Validation Schemas
// ============================================================

import { z } from 'zod'

/**
 * Schema for creating a new tag.
 */
export const CreateTagSchema = z.object({
  name: z
    .string()
    .min(2, 'Tag name must be at least 2 characters')
    .max(50, 'Tag name must not exceed 50 characters'),
})

/**
 * Schema for updating a tag.
 */
export const UpdateTagSchema = z.object({
  name: z
    .string()
    .min(2, 'Tag name must be at least 2 characters')
    .max(50, 'Tag name must not exceed 50 characters')
    .optional(),
})

export type CreateTagInput = z.infer<typeof CreateTagSchema>
export type UpdateTagInput = z.infer<typeof UpdateTagSchema>
