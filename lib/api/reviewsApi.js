import { http } from './client';
import { createResource } from './resource';

const reviews = createResource('/reviews');

export const reviewsApi = {
  list: reviews.list,
  get: reviews.get,
  update: reviews.update,
  remove: reviews.remove,
  listForProduct: (productId, query, options) =>
    http.get(`/products/${productId}/reviews`, { ...options, query }),
  create: (productId, body) => http.post(`/products/${productId}/reviews`, body),
};
