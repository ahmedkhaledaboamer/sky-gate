'use client';

import { productsApi } from '@/lib/api';
import { useApiQuery } from './useApiQuery';

// Cart items and reviews only carry a product id. Product details are cached
// per id for the session so revisiting the cart does not refetch them.
const cache = new Map();

function loadProduct(id) {
  if (!cache.has(id)) {
    const promise = productsApi
      .get(id)
      .then((res) => res?.data ?? null)
      .catch((err) => {
        cache.delete(id);
        // a deleted product should not break the whole list
        if (err?.status === 404 || err?.status === 400) return null;
        throw err;
      });
    cache.set(id, promise);
  }
  return cache.get(id);
}

/** Returns { [productId]: product | null } for the given ids. */
export function useProductsByIds(ids) {
  const unique = [...new Set(ids.filter(Boolean))].sort();
  return useApiQuery(
    unique.length ? ['products-by-id', unique] : null,
    async () => {
      const products = await Promise.all(unique.map(loadProduct));
      return Object.fromEntries(unique.map((id, i) => [id, products[i]]));
    },
    { keepPrevious: true }
  );
}

/** Drop cached details after a product changes (dashboard edits). */
export function invalidateProduct(id) {
  cache.delete(id);
}
