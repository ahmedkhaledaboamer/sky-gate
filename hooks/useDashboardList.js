'use client';

import { useCallback, useState } from 'react';
import { useToast } from '@/context/ToastContext';
import { DASHBOARD_PAGE_SIZE } from '@/lib/constants';
import { useTranslations } from '@/lib/i18n';
import { readList } from '@/lib/listResponse';
import { useApiQuery } from './useApiQuery';
import { toPage, useUrlParams } from './useUrlParams';

/**
 * Paginated, searchable list state for dashboard tables, kept in the URL.
 *   const { list, query, page, keyword, setKeyword, setPage, params, setParams } =
 *     useDashboardList('products', productsApi.list, (params) => ({ category: params.category }));
 */
export function useDashboardList(name, fetchList, buildFilters = () => ({}), { sort = '-createdAt' } = {}) {
  const [params, setParams] = useUrlParams();
  const page = toPage(params.page);
  const keyword = params.keyword ?? '';
  const apiQuery = {
    page,
    limit: DASHBOARD_PAGE_SIZE,
    sort: params.sort || sort,
    keyword: keyword || undefined,
    ...buildFilters(params),
  };
  const query = useApiQuery([name, apiQuery], (signal) => fetchList(apiQuery, { signal }), { keepPrevious: true });

  const setKeyword = useCallback((value) => setParams({ keyword: value }), [setParams]);
  const setPage = useCallback(
    (p) => setParams({ page: p > 1 ? p : '' }, { resetPage: false }),
    [setParams]
  );

  return { query, list: readList(query.data), page, keyword, setKeyword, setPage, params, setParams };
}

/**
 * Delete confirmation flow: `request(row)` opens the dialog, `confirm()` calls
 * `remove(row._id)` and then `onDone()`. Spread `modalProps` onto <ConfirmModal>.
 */
export function useDeleteFlow(remove, onDone) {
  const t = useTranslations('Dashboard');
  const toast = useToast();
  const [target, setTarget] = useState(null);
  const [loading, setLoading] = useState(false);

  const confirm = async () => {
    setLoading(true);
    try {
      await remove(target._id);
      toast.success(t('deleted'));
      setTarget(null);
      onDone?.(target);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    target,
    request: setTarget,
    modalProps: {
      open: Boolean(target),
      onClose: () => setTarget(null),
      onConfirm: confirm,
      loading,
      danger: true,
      title: t('deleteTitle'),
      confirmLabel: t('delete'),
    },
  };
}
