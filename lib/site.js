export const SITE_NAME = 'Sky Gate';

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
).replace(/\/$/, '');

/**
 * Some source images in /public are very large (4096px PNGs), which social
 * crawlers reject. Route Open Graph images through the Next.js image
 * optimizer so they are served at a reasonable size.
 */
export function ogImage(src, width = 1200) {
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=75`;
}
