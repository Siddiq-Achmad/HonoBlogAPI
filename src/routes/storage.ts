// ============================================================
// Storage Routes — Handle file uploads to Supabase Storage
// ============================================================

import { Hono } from 'hono'
import { authRequired } from '../middleware/auth.js'
import { supabaseAdmin } from '../lib/supabase.js'
import { successResponse, errorResponse } from '../lib/response.js'
import { AppError } from '../middleware/error-handler.js'
import type { Env } from '../types/index.js'

const storage = new Hono<Env>()

/**
 * POST /storage/upload
 * Upload an image to a specific bucket
 */
storage.post('/upload', authRequired, async (c) => {
  const user = c.get('user')!
  const body = await c.req.parseBody()
  const file = body['file'] as File
  const bucket = (body['bucket'] as string) || 'blog-assets'

  if (!file) {
    throw new AppError(400, 'MISSING_FILE', 'No file provided')
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new AppError(400, 'INVALID_FILE_TYPE', 'Only image files are allowed')
  }

  // Generate a unique file name
  const fileExt = file.name.split('.').pop()
  const fileName = `${user.id}/${Date.now()}.${fileExt}`

  // Upload to Supabase Storage
  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(fileName, file, {
      contentType: file.type,
      upsert: true
    })

  if (error) {
    throw new AppError(500, 'UPLOAD_FAILED', error.message)
  }

  // Get public URL
  const { data: { publicUrl } } = supabaseAdmin.storage
    .from(bucket)
    .getPublicUrl(fileName)

  return successResponse(c, {
    url: publicUrl,
    path: data.path,
    fileName: fileName
  })
})

export default storage
