// ============================================================
// Response Helpers — Standardized API response format
// ============================================================

import type { Context } from 'hono'
import type { PaginationMeta } from '../types/index.js'

/**
 * Send a success response with data and optional pagination meta.
 */
export function successResponse<T>(
  c: Context,
  data: T,
  statusCode: number = 200,
  meta?: PaginationMeta
) {
  return c.json(
    {
      success: true as const,
      data,
      ...(meta && { meta }),
    },
    statusCode as any
  )
}

/**
 * Send a paginated success response.
 */
export function paginatedResponse<T>(
  c: Context,
  data: T[],
  page: number,
  limit: number,
  total: number
) {
  const totalPages = Math.ceil(total / limit)
  const meta: PaginationMeta = {
    page,
    limit,
    total,
    total_pages: totalPages,
    has_next: page < totalPages,
    has_prev: page > 1,
  }
  return successResponse(c, data, 200, meta)
}

/**
 * Send an error response.
 */
export function errorResponse(
  c: Context,
  statusCode: number,
  code: string,
  message: string,
  details?: unknown
) {
  return c.json(
    {
      success: false as const,
      error: {
        code,
        message,
        ...(details ? { details } : {}),
      },
    },
    statusCode as any
  )
}
