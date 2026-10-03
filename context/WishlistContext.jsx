'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { wishlistApi } from '@/lib/api';
import { useTranslations } from '@/lib/i18n';
import { createStore, useStoreSelector, withItem, withoutItem } from '@/lib/store';
import { useApiQuery } from '@/hooks/useApiQuery';
import { useCustomerGate } from '@/hooks/useCustomerGate';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

// The ids live in an external store so each heart button subscribes to its
// own product only (useWishlistItem); the context value itself never changes
// after mount, so it does not re-render the product grid.
const WishlistContext = createContext(null);
const EMPTY = { ids: new Set(), pending: new Set() };
const toIds = (list = []) => list.map((item) => (typeof item === 'object' ? item._id : item));

export function WishlistProvider({ children }) {
  const { isCustomer, user } = useAuth();
  const toast = useToast();
  const t = useTranslations('Wishlist');
  const ensureCustomer = useCustomerGate();
  const [store] = useState(() => createStore(EMPTY));

  // GET returns full products; POST / DELETE return the list of ids.
  const query = useApiQuery(
    isCustomer && user?._id ? ['wishlist', user._id] : null,
    async (signal) => toIds((await wishlistApi.get({ signal }))?.data)
  );
  const loadedIds = isCustomer ? query.data : undefined;
  useEffect(() => {
    store.set((s) => ({ ...s, ids: new Set(loadedIds ?? []) }));
  }, [store, loadedIds]);

  const toggle = useCallback(
    async (productId) => {
      if (!ensureCustomer()) return;
      const { ids, pending } = store.get();
      if (pending.has(productId)) return;
      const inList = ids.has(productId);
      store.set((s) => ({ ...s, pending: withItem(s.pending, productId) }));
      try {
        const res = inList ? await wishlistApi.remove(productId) : await wishlistApi.add(productId);
        store.set((s) => ({ ...s, ids: new Set(toIds(res?.data)) }));
        toast.success(inList ? t('removed') : t('added'));
      } catch (err) {
        toast.error(err.message);
      } finally {
        store.set((s) => ({ ...s, pending: withoutItem(s.pending, productId) }));
      }
    },
    [ensureCustomer, store, toast, t]
  );

  const value = useMemo(() => ({ store, toggle, refresh: query.refetch }), [store, toggle, query.refetch]);
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

function useWishlistContext() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('Wishlist hooks must be used inside <WishlistProvider>');
  return ctx;
}

/** One product's heart: re-renders only when this product changes. */
export function useWishlistItem(productId) {
  const { store, toggle } = useWishlistContext();
  const selectActive = useCallback((s) => s.ids.has(productId), [productId]);
  const selectPending = useCallback((s) => s.pending.has(productId), [productId]);
  const active = useStoreSelector(store, selectActive, false);
  const pending = useStoreSelector(store, selectPending, false);
  return { active, pending, toggle };
}

const selectCount = (s) => s.ids.size;
export function useWishlistCount() {
  const { store } = useWishlistContext();
  return useStoreSelector(store, selectCount, 0);
}

const selectIds = (s) => s.ids;
/** The full id set (wishlist page). */
export function useWishlistIds() {
  const { store } = useWishlistContext();
  return useStoreSelector(store, selectIds, EMPTY.ids);
}
