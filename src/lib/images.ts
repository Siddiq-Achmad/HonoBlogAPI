// ============================================================
// Cloudflare R2 CDN Image Helper — LUXIMA Media Pipeline
// Mirrors LUXIMA awedz asset architecture with Cloudflare Image Resizing
// ============================================================

export interface ImageTransformOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'auto' | 'webp' | 'avif' | 'jpeg';
  fit?: 'cover' | 'contain' | 'crop' | 'scale-down';
}

export const R2_BASE_URL = 'https://r2.luxima.id';

export const DEFAULT_CATEGORY_FALLBACK =
  'https://r2.luxima.id/cdn-cgi/image/width=1080,quality=75,format=auto/assets/categories/wedding-organizer.webp';

export const DEFAULT_POST_COVER =
  'https://r2.luxima.id/cdn-cgi/image/width=1200,quality=75,format=auto/images/hero/aceh-venue.jpg';

export const DEFAULT_HERO_IMAGE =
  'https://r2.luxima.id/cdn-cgi/image/width=1920,quality=75,format=auto/images/hero/aceh-venue.jpg';

export const DEFAULT_OG_IMAGE =
  'https://r2.luxima.id/cdn-cgi/image/width=1600,quality=80,format=auto/images/hero/aceh-venue.jpg';

export const DEFAULT_LOGO_URL =
  'https://r2.luxima.id/cdn-cgi/image/width=400,quality=80,format=auto/images/fallbacks/vendor-logo.png';

export const DEFAULT_AVATAR_FALLBACK = '/assets/avatar-fallback.svg';

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
    if (trimmed.includes('r2.luxima.id/cdn-cgi/image/')) {
      return trimmed;
    }
    if (trimmed.startsWith(R2_BASE_URL)) {
      const relativePath = trimmed.replace(R2_BASE_URL, '').replace(/^\/+/, '');
      return buildR2ResizedUrl(relativePath, options);
    }
    return trimmed;
  }

  // Relative path (e.g., "assets/categories/florists.webp" or "/assets/categories/florists.webp")
  return buildR2ResizedUrl(trimmed, options);
}

/**
 * Resolves post cover image URL with fallback to high-res editorial image from R2.
 */
export function getPostCoverUrl(
  imagePath?: string | null,
  options: ImageTransformOptions = { width: 1200, quality: 75 }
): string {
  if (!imagePath || typeof imagePath !== 'string' || imagePath.trim() === '') {
    return DEFAULT_POST_COVER;
  }

  const trimmed = imagePath.trim();

  // If unsplash was passed, replace with default R2 cover
  if (trimmed.includes('unsplash.com')) {
    return DEFAULT_POST_COVER;
  }

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    if (trimmed.includes('r2.luxima.id/cdn-cgi/image/')) {
      return trimmed;
    }
    if (trimmed.startsWith(R2_BASE_URL)) {
      const relativePath = trimmed.replace(R2_BASE_URL, '').replace(/^\/+/, '');
      return buildR2ResizedUrl(relativePath, options);
    }
    return trimmed;
  }

  return buildR2ResizedUrl(trimmed, options);
}

/**
 * Resolves user avatar URL with fallback to local SVG vector avatar.
 */
export function getUserAvatarUrl(avatarPath?: string | null): string {
  if (!avatarPath || typeof avatarPath !== 'string' || avatarPath.trim() === '') {
    return DEFAULT_AVATAR_FALLBACK;
  }

  const trimmed = avatarPath.trim();

  if (trimmed.includes('unsplash.com')) {
    return DEFAULT_AVATAR_FALLBACK;
  }

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    if (trimmed.includes('r2.luxima.id/cdn-cgi/image/')) {
      return trimmed;
    }
    if (trimmed.startsWith(R2_BASE_URL)) {
      const relativePath = trimmed.replace(R2_BASE_URL, '').replace(/^\/+/, '');
      return buildR2ResizedUrl(relativePath, { width: 120, height: 120, fit: 'cover', quality: 80 });
    }
    return trimmed;
  }

  if (trimmed.startsWith('/')) {
    return trimmed;
  }

  return buildR2ResizedUrl(trimmed, { width: 120, height: 120, fit: 'cover', quality: 80 });
}
