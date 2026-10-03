'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ImageOff } from 'lucide-react';

/**
 * Image served by the API. Goes through the Next.js image optimizer (see
 * next.config.mjs): resized to the rendered size, converted to WebP, cached.
 * `preload` marks the above-the-fold image (LCP). Falls back to a placeholder
 * when missing or broken.
 */
// An API whose BASE_URL ends with "/" returns "https://host//products/x.jpeg":
// collapse the extra slashes after the host (the server only answers "/products/…").
const normalizeSrc = (src) =>
  typeof src === 'string' ? src.replace(/^(https?:\/\/[^/]+)\/{2,}/, '$1/') : src;

export function RemoteImage({ src: rawSrc, alt = '', className = 'object-cover', sizes = '100vw', preload = false }) {
  const src = normalizeSrc(rawSrc);
  const [failedSrc, setFailedSrc] = useState(null);
  if (!src || failedSrc === src) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-slate-100 text-slate-300">
        <ImageOff className="w-1/4 h-1/4 max-w-10 max-h-10" aria-hidden />
        <span className="sr-only">{alt}</span>
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      preload={preload}
      className={className}
      onError={() => setFailedSrc(src)}
    />
  );
}

/** Small square thumbnail (tables, cart rows). */
export function Thumb({ src, alt, className = 'w-12 h-12 rounded-xl' }) {
  return (
    <div className={`relative overflow-hidden bg-slate-100 shrink-0 ${className}`}>
      <RemoteImage src={src} alt={alt} sizes="96px" />
    </div>
  );
}
