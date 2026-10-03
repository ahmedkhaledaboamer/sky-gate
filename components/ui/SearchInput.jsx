'use client';

import { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import { useTranslations } from '@/lib/i18n';
import { inputClasses } from './Field';

/**
 * Debounced search box. `value` is the committed (URL) value; typing calls
 * `onChange` after `delay` ms. External changes (e.g. "clear filters") reset it.
 */
export function SearchInput({ value = '', onChange, placeholder, delay = 400, className = '' }) {
  const t = useTranslations('Common');
  const [text, setText] = useState(value);
  const [committed, setCommitted] = useState(value);

  // sync when the committed value changes from outside (derived-state pattern)
  if (value !== committed) {
    setCommitted(value);
    if (value !== text.trim()) setText(value);
  }

  useEffect(() => {
    if (text.trim() === value) return;
    const id = setTimeout(() => onChange(text.trim()), delay);
    return () => clearTimeout(id);
  }, [text, value, delay, onChange]);

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      <input
        type="search"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onChange(text.trim())}
        placeholder={placeholder ?? t('search')}
        aria-label={placeholder ?? t('search')}
        className={`${inputClasses()} ps-11 pe-10 [&::-webkit-search-cancel-button]:hidden`}
      />
      {text && (
        <button
          type="button"
          onClick={() => {
            setText('');
            onChange('');
          }}
          aria-label={t('clear')}
          className="absolute end-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
