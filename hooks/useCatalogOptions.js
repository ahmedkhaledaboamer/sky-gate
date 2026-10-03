'use client';

import { useInitialCatalog } from '@/context/CatalogContext';
import { brandsApi, categoriesApi, subcategoriesApi } from '@/lib/api';
import { OPTIONS_LIMIT } from '@/lib/constants';
import { useApiQuery } from './useApiQuery';

// Categories / brands / subcategories are small, shared lists used by filters,
// the home page and dashboard forms. One request per list per session; the
// dashboard invalidates after it creates / edits / deletes.
const cache = new Map();

function cached(key, load) {
  if (!cache.has(key)) {
    cache.set(
      key,
      load().catch((err) => {
        cache.delete(key);
        throw err;
      })
    );
  }
  return cache.get(key);
}

export function invalidateCatalog(prefix) {
  [...cache.keys()].forEach((key) => key.startsWith(prefix) && cache.delete(key));
}

const listAll = (api, extra = {}) =>
  api.list({ limit: OPTIONS_LIMIT, sort: 'name', ...extra }).then((res) => res?.data ?? []);

// server-rendered lists (CatalogProvider) are used first; the browser only
// fetches when they are missing (dashboard) or after an invalidation
export function useCategories() {
  const { categories } = useInitialCatalog();
  return useApiQuery(
    ['catalog', 'categories'],
    () => cached('categories', () => listAll(categoriesApi)),
    { initialData: categories }
  );
}

export function useBrands() {
  const { brands } = useInitialCatalog();
  return useApiQuery(['catalog', 'brands'], () => cached('brands', () => listAll(brandsApi)), {
    initialData: brands,
  });
}

/** All subcategories, or those of one category when `categoryId` is given. */
export function useSubcategories(categoryId, initialData) {
  return useApiQuery(
    ['catalog', 'subcategories', categoryId ?? 'all'],
    () =>
    categoryId
      ? cached(`subcategories:${categoryId}`, () =>
          subcategoriesApi
            .listByCategory(categoryId, { limit: OPTIONS_LIMIT, sort: 'name' })
            .then((res) => res?.data ?? [])
        )
      : cached('subcategories:all', () => listAll(subcategoriesApi)),
    { initialData }
  );
}
