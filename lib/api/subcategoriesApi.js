import { http } from './client';
import { createResource } from './resource';

export const subcategoriesApi = {
  ...createResource('/subcategories'),
  // note: the nested route is singular — /categories/:id/subcategory
  listByCategory: (categoryId, query, options) =>
    http.get(`/categories/${categoryId}/subcategory`, { ...options, query }),
  createForCategory: (categoryId, body) =>
    http.post(`/categories/${categoryId}/subcategory`, body),
};
