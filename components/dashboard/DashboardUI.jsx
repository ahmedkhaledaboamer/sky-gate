'use client';

import { Eye, Pencil, Trash2 } from 'lucide-react';
import { useTranslations } from '@/lib/i18n';
import { Button } from '@/components/ui/Button';
import { Pagination } from '@/components/ui/Pagination';

export function DashboardPageHeader({ title, description, actions }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
      <div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">{title}</h1>
        {description && <p className="mt-1 text-slate-500">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Toolbar({ children }) {
  return <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 mb-5">{children}</div>;
}

/** Footer row under tables: "N results" + pagination. */
export function TableFooter({ list, page, onPageChange }) {
  const t = useTranslations('Dashboard');
  return (
    <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-4">
      <p className="text-sm text-slate-500">{list.total !== null ? t('totalResults', { count: list.total }) : ''}</p>
      <Pagination page={page} totalPages={list.totalPages} hasNext={list.hasNext} onChange={onPageChange} />
    </div>
  );
}

/** View / edit / delete icon buttons. Pass only the handlers the role may use. */
export function RowActions({ onView, viewHref, onEdit, editHref, onDelete }) {
  const t = useTranslations('Dashboard');
  return (
    <div className="flex items-center justify-end gap-1">
      {(onView || viewHref) && (
        <Button variant="ghost" size="iconSm" href={viewHref} onClick={onView} aria-label={t('view')} title={t('view')}>
          <Eye className="w-4 h-4" />
        </Button>
      )}
      {(onEdit || editHref) && (
        <Button variant="ghost" size="iconSm" href={editHref} onClick={onEdit} aria-label={t('edit')} title={t('edit')}>
          <Pencil className="w-4 h-4" />
        </Button>
      )}
      {onDelete && (
        <Button variant="dangerGhost" size="iconSm" onClick={onDelete} aria-label={t('delete')} title={t('delete')}>
          <Trash2 className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
