'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';

/** Read-only stars with partial fill (e.g. 4.3). */
export function StarRating({ value = 0, size = 'w-4 h-4', showValue = false, count, className = '' }) {
  const rating = Math.max(0, Math.min(5, Number(value) || 0));
  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <div className="flex" role="img" aria-label={`${rating.toFixed(1)} / 5`}>
        {[0, 1, 2, 3, 4].map((i) => {
          const fill = Math.max(0, Math.min(1, rating - i)) * 100;
          return (
            <span key={i} className="relative inline-block">
              <Star className={`${size} text-slate-200 fill-slate-200`} />
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill}%` }}>
                <Star className={`${size} text-amber-400 fill-amber-400`} />
              </span>
            </span>
          );
        })}
      </div>
      {showValue && <span className="text-sm font-semibold text-slate-700">{rating.toFixed(1)}</span>}
      {count !== undefined && <span className="text-xs text-slate-500">({count})</span>}
    </div>
  );
}

/** Clickable 1–5 star input (radio group semantics). */
export function StarInput({ value = 0, onChange, label, size = 'w-7 h-7' }) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <div role="radiogroup" aria-label={label} className="flex gap-1" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n}`}
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          className="p-0.5 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
        >
          <Star
            className={`${size} transition-colors ${n <= shown ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`}
          />
        </button>
      ))}
    </div>
  );
}
