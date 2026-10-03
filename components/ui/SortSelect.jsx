'use client';

import { ArrowUpDown, ChevronDown } from 'lucide-react';
import { useTranslations } from '@/lib/i18n';

/** options: [{ value, label }] */
export function SortSelect({ value = '', onChange, options, className = '' }) {
  const t = useTranslations('Common');
  return (
    <label className={`relative inline-flex items-center ${className}`}>
      <span className="sr-only">{t('sortBy')}</span>
      <ArrowUpDown className="absolute start-4 w-4 h-4 text-slate-400 pointer-events-none" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-full border border-slate-200 bg-white ps-10 pe-10 h-11 text-sm font-medium text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-500"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute end-4 w-4 h-4 text-slate-400 pointer-events-none" />
    </label>
  );
}
