'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from '@/lib/i18n';

/** Page numbers around the current page: [1, '…', 4, 5, 6, '…', 10] */
function pageWindow(page, totalPages) {
  const pages = new Set([1, totalPages, page - 1, page, page + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);
  const out = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push(`gap-${p}`);
    out.push(p);
  });
  return out;
}

/**
 * `hasNext` comes from pagination.next, which stays accurate even if the
 * reported number of pages is not — "Next" relies on it.
 */
export function Pagination({ page, totalPages, hasNext, onChange, className = '' }) {
  const t = useTranslations('Common');
  if (totalPages <= 1 && !hasNext && page <= 1) return null;

  const btn =
    'min-w-10 h-10 px-3 rounded-full text-sm font-semibold inline-flex items-center justify-center transition-colors';

  return (
    <nav aria-label={t('pagination')} className={`flex items-center justify-center gap-1.5 flex-wrap ${className}`}>
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className={`${btn} gap-1 border border-slate-200 bg-white text-slate-700 hover:border-teal-500 hover:text-teal-600 disabled:opacity-40 disabled:pointer-events-none`}
      >
        <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
        <span className="hidden sm:inline">{t('previous')}</span>
      </button>

      {pageWindow(page, totalPages).map((p) =>
        typeof p === 'string' ? (
          <span key={p} className="px-1 text-slate-400">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            aria-current={p === page ? 'page' : undefined}
            className={`${btn} ${p === page ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
          >
            {p}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={!hasNext}
        className={`${btn} gap-1 border border-slate-200 bg-white text-slate-700 hover:border-teal-500 hover:text-teal-600 disabled:opacity-40 disabled:pointer-events-none`}
      >
        <span className="hidden sm:inline">{t('next')}</span>
        <ChevronRight className="w-4 h-4 rtl:rotate-180" />
      </button>
    </nav>
  );
}
