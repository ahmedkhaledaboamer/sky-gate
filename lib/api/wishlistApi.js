import { http } from './client';

export const wishlistApi = {
  // data: full products
  get: (options) => http.get('/wishlist', options),
  // data: array of product ids
  add: (productId) => http.post('/wishlist', { productId }),
  remove: (productId) => http.delete(`/wishlist/${productId}`),
};
