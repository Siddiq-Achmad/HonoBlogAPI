// ============================================================
// Slug Utility — Generate URL-friendly slugs from text
// ============================================================

/**
 * Generate a URL-friendly slug from a given string.
 *
 * - Converts to lowercase
 * - Replaces spaces and special characters with hyphens
 * - Removes consecutive hyphens
 * - Trims leading/trailing hyphens
 *
 * @example
 * generateSlug('Hello World! This is a Test')
 * // => 'hello-world-this-is-a-test'
 *
 * generateSlug('Cara Membuat API dengan Hono & Supabase')
 * // => 'cara-membuat-api-dengan-hono-supabase'
 */
export function generateSlug(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')         // Replace spaces with hyphens
    .replace(/[^\w\-]+/g, '')     // Remove non-word characters (except hyphens)
    .replace(/\-\-+/g, '-')      // Replace multiple hyphens with single
    .replace(/^-+/, '')           // Trim leading hyphens
    .replace(/-+$/, '')           // Trim trailing hyphens
}

/**
 * Generate a unique slug by appending a short random suffix.
 * Useful when you need guaranteed uniqueness (e.g., for posts with similar titles).
 */
export function generateUniqueSlug(text: string): string {
  const baseSlug = generateSlug(text)
  const suffix = Math.random().toString(36).substring(2, 8)
  return `${baseSlug}-${suffix}`
}
