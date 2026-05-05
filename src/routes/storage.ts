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

/**
 * POST /storage/avatar
 * Specific endpoint for profile pictures
 * Automatically updates the user's profile table
 */
storage.post('/avatar', authRequired, async (c) => {
  const user = c.get('user')!
  const body = await c.req.parseBody()
  const file = body['file'] as File

  if (!file || !file.type.startsWith('image/')) {
    throw new AppError(400, 'INVALID_FILE', 'Please provide a valid image file')
  }

  // Use a fixed name per user to overwrite old avatars
  const fileExt = file.name.split('.').pop() || 'jpg'
  const fileName = `${user.id}/avatar.${fileExt}`

  // Upload to 'avatars' bucket
  const { error: uploadError } = await supabaseAdmin.storage
    .from('avatars')
    .upload(fileName, file, {
      contentType: file.type,
      upsert: true
    })

  if (uploadError) {
    throw new AppError(500, 'UPLOAD_FAILED', uploadError.message)
  }

  // Get public URL
  const { data: { publicUrl } } = supabaseAdmin.storage
    .from('avatars')
    .getPublicUrl(fileName)

  // Update profiles table
  const { error: dbError } = await supabaseAdmin
    .from('profiles')
    .update({ avatar_url: publicUrl })
    .eq('id', user.id)

  if (dbError) {
    throw new AppError(500, 'DATABASE_ERROR', 'Avatar uploaded but failed to update profile data')
  }

  return successResponse(c, {
    avatar: publicUrl
  })
})

export default storage
