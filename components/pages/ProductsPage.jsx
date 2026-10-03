'use client';

import { useCallback, useMemo, useState } from 'react';
import { PackageSearch, SlidersHorizontal, X } from 'lucide-react';
import { productsApi } from '@/lib/api';
import { PRODUCT_SORT_OPTIONS } from '@/lib/constants';
import { formatNumber, formatPrice } from '@/lib/format';
import { useLocale, useTranslations } from '@/lib/i18n';
import { readList } from '@/lib/listResponse';
import { localized } from '@/lib/product';
import { countActiveFilters, readProductFilters, toProductQuery } from '@/lib/productQuery';
import { useApiQuery } from '@/hooks/useApiQuery';
import { useBrands, useCategories, useSubcategories } from '@/hooks/useCatalogOptions';
import { toPage, useUrlParams } from '@/hooks/useUrlParams';
import { Button } from '@/components/ui/Button';
import { Drawer } from '@/components/ui/Drawer';
import { Pagination } from '@/components/ui/Pagination';
import { SearchInput } from '@/components/ui/SearchInput';
import { SortSelect } from '@/components/ui/SortSelect';
import { EmptyState, ErrorState } from '@/components/ui/States';
import { FilterPanel } from '@/components/store/FilterPanel';
import { PageHero } from '@/components/store/PageHero';
import { ProductGrid } from '@/components/store/ProductCard';

function ActiveFilterChips({ filters, onChange }) {
  const t = useTranslations('Shop');
  const locale = useLocale();
  const categories = useCategories();
  const brands = useBrands();
  const subcategories = useSubcategories(filters.category || undefined);
  const nameOf = (list, id) => localized(list?.find((i) => i._id === id), 'name', locale) || '…';

  const chips = [
    filters.keyword && { key: 'keyword', label: `“${filters.keyword}”`, clear: { keyword: '' } },
    filters.category && {
      key: 'category',
      label: nameOf(categories.data, filters.category),
      clear: { category: '', subcategory: '' },
    },
    filters.subcategory && {
      key: 'subcategory',
      label: nameOf(subcategories.data, filters.subcategory),
      clear: { subcategory: '' },
    },
    filters.brand && { key: 'brand', label: nameOf(brands.data, filters.brand), clear: { brand: '' } },
    (filters.minPrice !== '' || filters.maxPrice !== '') && {
      key: 'price',
      label: `${filters.minPrice !== '' ? formatPrice(filters.minPrice, locale) : '0'} – ${
        filters.maxPrice !== '' ? formatPrice(filters.maxPrice, locale) : '∞'
      }`,
      clear: { minPrice: '', maxPrice: '' },
    },
    filters.rating && { key: 'rating', label: t('ratingChip', { rating: filters.rating }), clear: { rating: '' } },
  ].filter(Boolean);

  if (!chips.length) return null;
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={() => onChange(chip.clear)}
          className="inline-flex items-center gap-1.5 rounded-full bg-white border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-red-300 hover:text-red-600"
        >
          {chip.label}
          <X className="w-3.5 h-3.5" />
        </button>
      ))}
    </div>
  );
}

/** `initial` = { query, data } rendered on the server for the URL's filters. */
export function ProductsPage({ initial }) {
  const t = useTranslations('Shop');
  const locale = useLocale();
  const [params, setParams, clearParams] = useUrlParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filters = useMemo(() => readProductFilters(params), [params]);
  const page = toPage(params.page);
  const apiQuery = toProductQuery(filters, page);

  const query = useApiQuery(
    ['products', apiQuery],
    (signal) => productsApi.list(apiQuery, { signal }),
    {
      keepPrevious: true,
      initialData:
        initial && JSON.stringify(initial.query) === JSON.stringify(apiQuery) ? initial.data : undefined,
    }
  );
  const list = readList(query.data);
  const activeCount = countActiveFilters(filters);

  const updateFilters = useCallback((patch) => setParams(patch), [setParams]);
  const goToPage = (p) => {
    setParams({ page: p > 1 ? p : '' }, { resetPage: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sortOptions = PRODUCT_SORT_OPTIONS.map((o) => ({ value: o.value, label: t(o.labelKey) }));

  return (
    <main className="pt-32 pb-24 bg-saudi-sand min-h-screen">
      <PageHero
        crumbs={[{ href: '/', label: t('breadcrumbHome') }, { label: t('breadcrumbProducts') }]}
        eyebrow={t('eyebrow')}
        title={t('title')}
        description={t('description')}
      />

      <div className="container mx-auto px-4 sm:px-6 md:px-12 mt-10">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center mb-6">
          <SearchInput
            value={filters.keyword}
            onChange={(keyword) => updateFilters({ keyword })}
            placeholder={t('searchPlaceholder')}
            className="flex-1 sm:max-w-md"
          />
          <div className="flex gap-3 sm:ms-auto">
            <Button variant="outline" className="lg:hidden flex-1 sm:flex-none" onClick={() => setFiltersOpen(true)}>
              <SlidersHorizontal className="w-4 h-4" />
              {t('filters')}
              {activeCount > 0 && (
                <span className="ms-1 w-5 h-5 rounded-full bg-teal-500 text-white text-[10px] flex items-center justify-center">
                  {activeCount}
                </span>
              )}
            </Button>
            <SortSelect
              value={filters.sort}
              onChange={(sort) => updateFilters({ sort })}
              options={sortOptions}
              className="flex-1 sm:w-56"
            />
          </div>
        </div>

        <div className="flex gap-8">
          <aside className="hidden lg:block w-72 shrink-0" aria-label={t('filters')}>
            <div className="sticky top-28 bg-white rounded-3xl shadow-soft border border-slate-100 max-h-[calc(100vh-8rem)] overflow-y-auto">
              <FilterPanel filters={filters} onChange={updateFilters} onClear={clearParams} />
            </div>
          </aside>

          <section className="flex-1 min-w-0" aria-live="polite" aria-busy={query.isLoading}>
            <ActiveFilterChips filters={filters} onChange={updateFilters} />

            {!query.isInitialLoading && !query.error && list.total !== null && (
              <p className="text-sm text-slate-500 mb-4">
                {t('resultsCount', { count: formatNumber(list.total, locale) })}
              </p>
            )}

            {query.error && query.data === undefined ? (
              <ErrorState error={query.error} onRetry={query.refetch} />
            ) : !query.isLoading && list.items.length === 0 ? (
              <EmptyState
                icon={PackageSearch}
                title={t('emptyTitle')}
                description={t('emptyState')}
                action={
                  activeCount > 0 || filters.keyword ? (
                    <Button variant="outline" onClick={clearParams}>
                      {t('clearFilters')}
                    </Button>
                  ) : null
                }
              />
            ) : (
              <ProductGrid
                products={list.items}
                isLoading={query.isLoading}
                skeletonCount={6}
                preloadCount={3}
                className="grid grid-cols-1 min-[420px]:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6"
              />
            )}

            <Pagination
              className="mt-12"
              page={page}
              totalPages={list.totalPages}
              hasNext={list.hasNext}
              onChange={goToPage}
            />
          </section>
        </div>
      </div>

      <Drawer open={filtersOpen} onClose={() => setFiltersOpen(false)} title={t('filters')}>
        <FilterPanel
          filters={filters}
          onChange={(patch) => {
            updateFilters(patch);
          }}
          onClear={() => {
            clearParams();
            setFiltersOpen(false);
          }}
        />
        <div className="sticky bottom-0 bg-white border-t border-slate-100 p-4">
          <Button block onClick={() => setFiltersOpen(false)}>
            {t('showResults')}
          </Button>
        </div>
      </Drawer>
    </main>
  );
}
