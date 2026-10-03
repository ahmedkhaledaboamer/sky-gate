'use client';

import { useCallback, useMemo } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

/**
 * Reads / writes flat query-string state (?page=2&keyword=x) so filters,
 * sorting and pagination survive refresh and can be shared.
 * Uses the native History API (integrated with the Next.js router): the URL and
 * useSearchParams update without a server round trip — the page component
 * fetches the new data itself.
 * Components using this must sit inside a <Suspense> boundary.
 */
export function useUrlParams() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const params = useMemo(
    () => Object.fromEntries(searchParams.entries()),
    [searchParams]
  );

  /** Merges `patch` into the URL; empty values are removed. Resets page unless given. */
  const setParams = useCallback(
    (patch, { resetPage = true } = {}) => {
      const next = new URLSearchParams(searchParams.toString());
      if (resetPage && !('page' in patch)) next.delete('page');
      Object.entries(patch).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') {
          next.delete(key);
        } else {
          next.set(key, String(value));
        }
      });
      const qs = next.toString();
      window.history.replaceState(null, '', qs ? `${pathname}?${qs}` : pathname);
    },
    [pathname, searchParams]
  );

  const clearParams = useCallback(() => {
    window.history.replaceState(null, '', pathname);
  }, [pathname]);

  return [params, setParams, clearParams];
}

export const toPage = (value) => Math.max(parseInt(value, 10) || 1, 1);
