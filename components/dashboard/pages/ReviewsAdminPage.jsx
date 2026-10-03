'use client';

import Link from 'next/link';
import { usePermissions } from '@/context/AuthContext';
import { reviewsApi } from '@/lib/api';
import { formatDate } from '@/lib/format';
import { useLocale, useTranslations } from '@/lib/i18n';
import { localized, refId } from '@/lib/product';
import { useDashboardList, useDeleteFlow } from '@/hooks/useDashboardList';
import { useProductsByIds } from '@/hooks/useProductsByIds';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { DataTable } from '@/components/ui/DataTable';
import { Select } from '@/components/ui/Field';
import { Thumb } from '@/components/ui/RemoteImage';
import { EmptyState, ErrorState, Skeleton } from '@/components/ui/States';
import { StarRating } from '@/components/ui/StarRating';
import { DashboardPageHeader, RowActions, TableFooter, Toolbar } from '../DashboardUI';

export function ReviewsAdminPage() {
  const t = useTranslations('Dashboard');
  const locale = useLocale();
  // reviews can be deleted by admin and manager
  const { canDeleteReviews } = usePermissions();
  const { query, list, page, setPage, params, setParams } = useDashboardList('admin-reviews', reviewsApi.list, (p) => ({
    ratings: ['1', '2', '3', '4', '5'].includes(p.ratings) ? p.ratings : undefined,
  }));
  // reviews only carry the product id — load titles / images per id (cached)
  const products = useProductsByIds(list.items.map((r) => refId(r.product)));
  const del = useDeleteFlow(reviewsApi.remove, () => query.refetch());

  return (
    <>
      <DashboardPageHeader title={t('nav.reviews')} description={t('reviewsDescription')} />
      <Toolbar>
        <Select
          aria-label={t('col.rating')}
          value={params.ratings ?? ''}
          onChange={(e) => setParams({ ratings: e.target.value })}
          placeholder={t('allRatings')}
          options={[5, 4, 3, 2, 1].map((n) => ({ value: String(n), label: '★'.repeat(n) }))}
          className="sm:w-48"
        />
      </Toolbar>
      {query.error && !query.data ? (
        <ErrorState error={query.error} onRetry={query.refetch} />
      ) : (
        <DataTable
          isLoading={query.isLoading}
          rows={list.items}
          empty={<EmptyState title={t('noReviews')} className="py-12" />}
          columns={[
            {
              key: 'product',
              header: t('col.product'),
              render: (r) => {
                const id = refId(r.product);
                const product = products.data?.[id];
                if (!product && products.isLoading) return <Skeleton className="h-10 w-40" />;
                return (
                  <Link href={`/products/${id}`} className="flex items-center gap-3 min-w-[180px] hover:text-teal-600">
                    <Thumb src={product?.imageCover} alt="" className="w-10 h-10 rounded-xl" />
                    <span className="line-clamp-2 font-medium">{product ? localized(product, 'title', locale) : t('deletedProduct')}</span>
                  </Link>
                );
              },
            },
            { key: 'user', header: t('col.user'), render: (r) => r.user?.name ?? '—' },
            { key: 'rating', header: t('col.rating'), render: (r) => <StarRating value={r.ratings} size="w-3.5 h-3.5" /> },
            {
              key: 'title',
              header: t('col.review'),
              className: 'max-w-xs',
              render: (r) => <p className="line-clamp-2 text-slate-600">{r.title || '—'}</p>,
            },
            { key: 'date', header: t('col.created'), render: (r) => formatDate(r.createdAt, locale) },
            {
              key: 'actions',
              header: <span className="sr-only">{t('col.actions')}</span>,
              render: (r) => <RowActions onDelete={canDeleteReviews ? () => del.request(r) : undefined} />,
            },
          ]}
        />
      )}
      <TableFooter list={list} page={page} onPageChange={setPage} />
      <ConfirmModal {...del.modalProps} message={t('deleteReviewMessage')} />
    </>
  );
}
