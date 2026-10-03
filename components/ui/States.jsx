'use client';

import { AlertCircle, Inbox, Loader2, RotateCcw } from 'lucide-react';
import { useTranslations } from '@/lib/i18n';
import { Button } from './Button';

export function Spinner({ className = 'w-6 h-6' }) {
  return <Loader2 className={`animate-spin text-teal-500 ${className}`} aria-hidden />;
}

export function LoadingState({ label, className = 'py-24' }) {
  const t = useTranslations('Common');
  return (
    <div role="status" className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <Spinner className="w-8 h-8" />
      <span className="text-sm text-slate-500">{label ?? t('loading')}</span>
    </div>
  );
}

export function Skeleton({ className = '' }) {
  return <div aria-hidden className={`animate-pulse rounded-xl bg-slate-200/70 ${className}`} />;
}

export function ErrorState({ error, onRetry, title, className = 'py-20' }) {
  const t = useTranslations('Common');
  return (
    <div role="alert" className={`flex flex-col items-center text-center gap-4 ${className}`}>
      <div className="w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
        <AlertCircle className="w-7 h-7" />
      </div>
      <div>
        <h3 className="font-serif text-2xl font-bold text-slate-900">{title ?? t('errorTitle')}</h3>
        <p className="mt-1 text-slate-500 max-w-md">{error?.message ?? t('errorDescription')}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RotateCcw className="w-4 h-4" />
          {t('retry')}
        </Button>
      )}
    </div>
  );
}

export function EmptyState({ icon: Icon = Inbox, title, description, action, className = 'py-20' }) {
  return (
    <div className={`flex flex-col items-center text-center gap-4 ${className}`}>
      <div className="w-16 h-16 rounded-full bg-teal-50 text-teal-500 flex items-center justify-center">
        <Icon className="w-8 h-8" />
      </div>
      <div>
        <h3 className="font-serif text-2xl font-bold text-slate-900">{title}</h3>
        {description && <p className="mt-1 text-slate-500 max-w-md">{description}</p>}
      </div>
      {action}
    </div>
  );
}

/** Renders loading / error / empty / children for a query result. */
export function QueryBoundary({ query, isEmpty, empty, loading, children }) {
  if (query.isInitialLoading) return loading ?? <LoadingState />;
  if (query.error && query.data === undefined) {
    return <ErrorState error={query.error} onRetry={query.refetch} />;
  }
  if (isEmpty) return empty ?? null;
  return children;
}
