'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Minimal data-fetching hook (no external library).
 *
 *   const { data, error, isLoading, refetch } =
 *     useApiQuery(['products', params], (signal) => productsApi.list(params, { signal }));
 *
 * - `key` (array) identifies the request; pass `null` to skip fetching.
 * - Loading is derived from the key, so no state is set synchronously in effects.
 * - `keepPrevious` keeps the last data while a new key loads (pagination).
 * - `initialData` (rendered on the server) is used for the first key without
 *   fetching it again; later keys / refetch() load from the API as usual.
 */
export function useApiQuery(key, fetcher, { keepPrevious = false, initialData } = {}) {
  const hash = key ? JSON.stringify(key) : null;
  const [version, setVersion] = useState(0);
  // the request the server already answered (never re-fetched on mount)
  const [initialRequestId] = useState(() =>
    hash && initialData !== undefined ? `${hash}#0` : null
  );
  const [state, setState] = useState(() => ({
    requestId: initialRequestId,
    hash: initialRequestId ? hash : null,
    data: initialRequestId ? initialData : undefined,
    error: null,
  }));

  const fetcherRef = useRef(fetcher);
  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  const requestId = hash ? `${hash}#${version}` : null;

  useEffect(() => {
    if (!requestId || requestId === initialRequestId) return;
    const controller = new AbortController();
    Promise.resolve()
      .then(() => fetcherRef.current(controller.signal))
      .then(
        (data) => {
          if (!controller.signal.aborted) {
            setState({ requestId, hash, data, error: null });
          }
        },
        (error) => {
          if (controller.signal.aborted || error?.name === 'AbortError') return;
          setState((prev) => ({
            requestId,
            hash,
            data: prev.hash === hash ? prev.data : undefined,
            error,
          }));
        }
      );
    return () => controller.abort();
  }, [requestId, hash, initialRequestId]);

  const refetch = useCallback(() => setVersion((v) => v + 1), []);

  /** Optimistically replace the cached data (value or updater function). */
  const setData = useCallback((updater) => {
    setState((prev) => ({
      ...prev,
      data: typeof updater === 'function' ? updater(prev.data) : updater,
    }));
  }, []);

  const isCurrent = state.requestId === requestId;
  const sameKey = state.hash === hash;
  const data = sameKey || keepPrevious ? state.data : undefined;
  const isLoading = Boolean(requestId) && !isCurrent;

  return {
    data,
    error: isCurrent ? state.error : null,
    isLoading,
    // first load for this key (nothing to show yet) — render skeletons
    isInitialLoading: isLoading && data === undefined,
    refetch,
    setData,
  };
}
