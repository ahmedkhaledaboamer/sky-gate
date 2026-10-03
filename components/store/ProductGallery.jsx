'use client';

import { useState } from 'react';
import { RemoteImage } from '@/components/ui/RemoteImage';

/** Main image + thumbnails (imageCover first, then images). */
export function ProductGallery({ product, title }) {
  const images = [...new Set([product.imageCover, ...(product.images ?? [])].filter(Boolean))];
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];

  return (
    <div className="flex flex-col-reverse sm:flex-row gap-4">
      {images.length > 1 && (
        <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible pb-1">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`${title} ${i + 1}`}
              aria-current={i === active}
              className={`relative w-20 h-20 shrink-0 rounded-2xl overflow-hidden bg-white border-2 transition-colors ${
                i === active ? 'border-teal-500' : 'border-transparent hover:border-slate-300'
              }`}
            >
              <RemoteImage src={src} alt="" sizes="80px" />
            </button>
          ))}
        </div>
      )}
      <div className="relative flex-1 aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-white to-slate-100 shadow-soft">
        <RemoteImage
          src={current}
          alt={title}
          preload
          sizes="(min-width: 1024px) 45vw, 100vw"
          className="object-contain p-4"
        />
      </div>
    </div>
  );
}
