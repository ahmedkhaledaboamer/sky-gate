'use client';

import { useId, useState } from 'react';
import { X } from 'lucide-react';
import { useTranslations } from '@/lib/i18n';
import { FieldShell, inputClasses } from '@/components/ui/Field';

/** Free-text chips (Enter or comma to add) — used for product colors. */
export function TagInput({ label, hint, error, value = [], onChange, placeholder, swatch = false }) {
  const id = useId();
  const tCommon = useTranslations('Common');
  const [text, setText] = useState('');

  const add = () => {
    const parts = text
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s && !value.includes(s));
    if (parts.length) onChange([...value, ...parts]);
    setText('');
  };

  return (
    <FieldShell id={id} label={label} hint={hint} error={error}>
      <div className={`${inputClasses(error)} flex flex-wrap items-center gap-2 py-2`}>
        {value.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 ps-2 pe-1 py-1 text-xs font-semibold text-slate-700">
            {swatch && <span className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: tag }} />}
            {tag}
            <button
              type="button"
              onClick={() => onChange(value.filter((v) => v !== tag))}
              aria-label={tCommon('removeItem', { name: tag })}
              className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-slate-300"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          id={id}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ',') {
              e.preventDefault();
              add();
            } else if (e.key === 'Backspace' && !text && value.length) {
              onChange(value.slice(0, -1));
            }
          }}
          onBlur={add}
          placeholder={placeholder}
          className="flex-1 min-w-[120px] bg-transparent outline-none text-sm py-1"
        />
      </div>
    </FieldShell>
  );
}
