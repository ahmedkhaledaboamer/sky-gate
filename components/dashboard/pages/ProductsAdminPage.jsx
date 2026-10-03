'use client';

import { useParams } from 'next/navigation';
import { Plus } from 'lucide-react';
import { usePermissions } from '@/context/AuthContext';
import { productsApi } from '@/lib/api';
import { isMongoId } from '@/lib/constants';
import { formatNumber, formatPrice } from '@/lib/format';
import { useLocale, useTranslations } from '@/lib/i18n';
import { hasDiscount, localized } from '@/lib/product';
import { useApiQuery } from '@/hooks/useApiQuery';
import { useBrands, useCategories } from '@/hooks/useCatalogOptions';
import { useDashboardList, useDeleteFlow } from '@/hooks/useDashboardList';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { DataTable } from '@/components/ui/DataTable';
import { Select } from '@/components/ui/Field';
import { Thumb } from '@/components/ui/RemoteImage';
import { SearchInput } from '@/components/ui/SearchInput';
import { SortSelect } from '@/components/ui/SortSelect';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/States';
import { StarRating } from '@/components/ui/StarRating';
import { DashboardPageHeader, RowActions, TableFooter, Toolbar } from '../DashboardUI';
import { ProductForm } from '../ProductForm';

export function ProductsAdminPage() {
  const t = useTranslations('Dashboard');
  const locale = useLocale();
  const { canDelete } = usePermissions();
  const categories = useCategories();
  const brands = useBrands();
  const { query, list, page, keyword, setKeyword, setPage, params, setParams } = useDashboardList(
    'admin-products',
    productsApi.list,
    (p) => ({ category: isMongoId(p.category) ? p.category : undefined })
  );
  const del = useDeleteFlow(productsApi.remove, () => query.refetch());
  const brandName = (id) => localized(brands.data?.find((b) => b._id === id), 'name', locale) || '—';

  const sortOptions = [
    { value: '', label: t('sort.newest') },
    { value: '-sold', label: t('sort.bestSelling') },
    { value: 'quantity', label: t('sort.lowStock') },
    { value: '-price', label: t('sort.priceDesc') },
    { value: 'price', label: t('sort.priceAsc') },
    { value: '-ratingsAverage', label: t('sort.topRated') },
  ];

  return (
    <>
      <DashboardPageHeader
        title={t('nav.products')}
        description={t('productsDescription')}
        actions={
          <Button href="/dashboard/products/new">
            <Plus className="w-4 h-4" />
            {t('product.create')}
          </Button>
        }
      />
      <Toolbar>
        <SearchInput value={keyword} onChange={setKeyword} placeholder={t('searchProducts')} className="sm:w-72" />
        <Select
          aria-label={t('product.category')}
          value={params.category ?? ''}
          onChange={(e) => setParams({ category: e.target.value })}
          placeholder={t('allCategories')}
          options={(categories.data ?? []).map((c) => ({ value: c._id, label: localized(c, 'name', locale) }))}
          className="sm:w-56"
        />
        <SortSelect value={params.sort ?? ''} onChange={(sort) => setParams({ sort })} options={sortOptions} className="sm:w-52 sm:ms-auto" />
      </Toolbar>

      {query.error && !query.data ? (
        <ErrorState error={query.error} onRetry={query.refetch} />
      ) : (
        <DataTable
          isLoading={query.isLoading}
          rows={list.items}
          empty={<EmptyState title={t('noProducts')} className="py-12" />}
          columns={[
            { key: 'image', header: t('col.image'), render: (p) => <Thumb src={p.imageCover} alt="" /> },
            {
              key: 'title',
              header: t('col.title'),
              className: 'min-w-[200px]',
              render: (p) => (
                <div>
                  <p className="font-semibold text-slate-900 line-clamp-2">{localized(p, 'title', locale)}</p>
                  {p.featured && <Badge tone="teal" className="mt-1">{t('product.featuredBadge')}</Badge>}
                </div>
              ),
            },
            { key: 'category', header: t('col.category'), render: (p) => localized(p.category, 'name', locale) || '—' },
            { key: 'brand', header: t('col.brand'), render: (p) => brandName(p.brand?._id ?? p.brand) },
            { key: 'price', header: t('col.price'), render: (p) => <span className={hasDiscount(p) ? 'line-through text-slate-400' : 'font-semibold'}>{formatPrice(p.price, locale)}</span> },
            { key: 'discount', header: t('col.discountPrice'), render: (p) => (hasDiscount(p) ? <span className="font-semibold text-terra-deep">{formatPrice(p.priceAfterDiscount, locale)}</span> : '—') },
            {
              key: 'quantity',
              header: t('col.quantity'),
              render: (p) => (
                <Badge tone={p.quantity === 0 ? 'danger' : p.quantity <= 5 ? 'warning' : 'neutral'}>{formatNumber(p.quantity, locale)}</Badge>
              ),
            },
            { key: 'rating', header: t('col.rating'), render: (p) => <StarRating value={p.ratingsAverage} count={p.ratingsQuantity ?? 0} size="w-3 h-3" /> },
            { key: 'sold', header: t('col.sold'), render: (p) => formatNumber(p.sold ?? 0, locale) },
            {
              key: 'actions',
              header: <span className="sr-only">{t('col.actions')}</span>,
              render: (p) => (
                <RowActions
                  viewHref={`/products/${p._id}`}
                  editHref={`/dashboard/products/${p._id}/edit`}
                  onDelete={canDelete ? () => del.request(p) : undefined}
                />
              ),
            },
          ]}
        />
      )}
      <TableFooter list={list} page={page} onPageChange={setPage} />
      <ConfirmModal {...del.modalProps} message={t('deleteMessage', { name: del.target ? localized(del.target, 'title', locale) : '' })} />
    </>
  );
}

export function ProductCreatePage() {
  const t = useTranslations('Dashboard');
  return (
    <>
      <DashboardPageHeader title={t('product.create')} description={t('product.createDescription')} />
      <ProductForm />
    </>
  );
}

export function ProductEditPage() {
  const t = useTranslations('Dashboard');
  const { id } = useParams();
  const query = useApiQuery(['admin-product', id], (signal) => productsApi.get(id, { signal }));
  const product = query.data?.data;
  return (
    <>
      <DashboardPageHeader title={t('product.edit')} description={product?.title} />
      {query.isInitialLoading ? (
        <LoadingState />
      ) : product ? (
        <ProductForm key={product._id} product={product} />
      ) : (
        <ErrorState error={query.error} onRetry={query.refetch} />
      )}
    </>
  );
}
