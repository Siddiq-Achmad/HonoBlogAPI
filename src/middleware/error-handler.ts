// ============================================================
// Error Handler — Global error handling middleware
// ============================================================

import type { Context } from 'hono'
import type { StatusCode } from 'hono/utils/http-status'

/**
 * Custom application error class.
 * Use this to throw errors with a specific HTTP status code and error code.
 *
 * @example
 * throw new AppError(404, 'NOT_FOUND', 'Post not found')
 * throw new AppError(403, 'FORBIDDEN', 'You do not own this resource')
 */
export class AppError extends Error {
  public readonly statusCode: number
  public readonly code: string
  public readonly details?: unknown

  constructor(
    statusCode: number,
    code: string,
    message: string,
    details?: unknown
  ) {
    super(message)
    this.name = 'AppError'
    this.statusCode = statusCode
    this.code = code
    this.details = details
  }
}

/**
 * Global error handler for Hono.
 * Catches all unhandled errors and returns a consistent JSON response.
 */
export function globalErrorHandler(err: Error, c: Context) {
  // Handle known application errors
  if (err instanceof AppError) {
    return c.json(
      {
        success: false,
        error: {
          code: err.code,
          message: err.message,
          ...(err.details ? { details: err.details } : {}),
        },
      },
      err.statusCode as any
    )
  }

  // Handle Zod validation errors
  if (err.name === 'ZodError') {
    return c.json(
      {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Request validation failed',
          details: JSON.parse(err.message),
        },
      },
      400
    )
  }

  // Handle unknown/unexpected errors
  console.error('Unhandled error:', err)
  return c.json(
    {
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message:
          process.env.NODE_ENV === 'production'
            ? 'An unexpected error occurred'
            : err.message || 'An unexpected error occurred',
        stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
      },
    },
    500
  )
}

/**
 * 404 Not Found handler for unmatched routes.
 */
export function notFoundHandler(c: Context) {
  return c.json(
    {
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: `Route ${c.req.method} ${c.req.path} not found`,
      },
    },
    404
  )
}
