'use client';

import { Minus, Plus } from 'lucide-react';
import { useTranslations } from '@/lib/i18n';

export function QuantityStepper({ value, onChange, min = 1, max = Infinity, disabled = false, size = 'md' }) {
  const t = useTranslations('Cart');
  const h = size === 'sm' ? 'h-9' : 'h-11';
  const w = size === 'sm' ? 'w-9' : 'w-11';
  return (
    <div className={`inline-flex items-center rounded-full border border-slate-200 bg-white ${h}`}>
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={disabled || value <= min}
        aria-label={t('decrease')}
        className={`${w} ${h} flex items-center justify-center rounded-full text-slate-600 hover:text-teal-600 disabled:opacity-30`}
      >
        <Minus className="w-4 h-4" />
      </button>
      <span className="min-w-8 text-center text-sm font-semibold text-slate-900" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={disabled || value >= max}
        aria-label={t('increase')}
        className={`${w} ${h} flex items-center justify-center rounded-full text-slate-600 hover:text-teal-600 disabled:opacity-30`}
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}
