// ============================================================
// Cloudflare R2 CDN Image Helper — LUXIMA Media Pipeline
// ============================================================

export interface ImageTransformOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'auto' | 'webp' | 'avif' | 'jpeg';
  fit?: 'cover' | 'contain' | 'crop' | 'scale-down';
}

const R2_BASE_URL = 'https://r2.luxima.id';
export const DEFAULT_CATEGORY_FALLBACK =
  'https://r2.luxima.id/cdn-cgi/image/width=1080,quality=75,format=auto/assets/categories/wedding-organizer.webp';

/**
 * Builds the Cloudflare image resizing URL on r2.luxima.id
 * Format: https://r2.luxima.id/cdn-cgi/image/width=1080,quality=75,format=auto/<clean_asset_path>
 */
export function buildR2ResizedUrl(
  assetPath: string,
  options: ImageTransformOptions = {}
): string {
  const width = options.width ?? 1080;
  const quality = options.quality ?? 75;
  const format = options.format ?? 'auto';

  const params: string[] = [
    `width=${width}`,
    `quality=${quality}`,
    `format=${format}`,
  ];

  if (options.height) {
    params.push(`height=${options.height}`);
  }
  if (options.fit) {
    params.push(`fit=${options.fit}`);
  }

  const paramString = params.join(',');
  const cleanPath = assetPath.replace(/^\/+/, '');

  return `${R2_BASE_URL}/cdn-cgi/image/${paramString}/${cleanPath}`;
}

/**
 * Transforms a category image path from database into an optimized R2 CDN URL.
 * Example:
 *   "assets/categories/florists.webp" ->
 *   "https://r2.luxima.id/cdn-cgi/image/width=1080,quality=75,format=auto/assets/categories/florists.webp"
 *
 *   "/assets/categories/florists.webp" ->
 *   "https://r2.luxima.id/cdn-cgi/image/width=1080,quality=75,format=auto/assets/categories/florists.webp"
 */
export function getCategoryImageUrl(
  imagePath?: string | null,
  options: ImageTransformOptions = {}
): string {
  if (!imagePath || typeof imagePath !== 'string' || imagePath.trim() === '') {
    return DEFAULT_CATEGORY_FALLBACK;
  }

  const trimmed = imagePath.trim();

  // If already absolute URL
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    // If it's already an r2.luxima.id/cdn-cgi/image URL, return as is
    if (trimmed.includes('r2.luxima.id/cdn-cgi/image/')) {
      return trimmed;
    }
    // If it's on r2.luxima.id without cdn-cgi resizing
    if (trimmed.startsWith(R2_BASE_URL)) {
      const relativePath = trimmed.replace(R2_BASE_URL, '').replace(/^\/+/, '');
      return buildR2ResizedUrl(relativePath, options);
    }
    // External URL (e.g. Unsplash or external storage)
    return trimmed;
  }

  // Relative path (e.g., "assets/categories/florists.webp" or "/assets/categories/florists.webp")
  return buildR2ResizedUrl(trimmed, options);
}
