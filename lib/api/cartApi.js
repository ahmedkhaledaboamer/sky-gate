import { http } from './client';

export const EMPTY_CART = {
  status: 'success',
  numOfCartItems: 0,
  data: { cartItems: [], totalCartPrice: 0 },
};

export const cartApi = {
  // Older API versions answered 404 when the user had no cart yet.
  get: async (options) => {
    try {
      return (await http.get('/cart', options)) ?? EMPTY_CART;
    } catch (err) {
      if (err?.status === 404) return EMPTY_CART;
      throw err;
    }
  },
  add: (productId, color) =>
    http.post('/cart', color ? { productId, color } : { productId }),
  // itemId is the _id inside cartItems, not the product id
  updateQuantity: (itemId, quantity) =>
    http.put(`/cart/${itemId}`, { quantity }),
  removeItem: (itemId) => http.delete(`/cart/${itemId}`),
  clear: () => http.delete('/cart'),
  applyCoupon: (coupon) => http.put('/cart/applyCoupon', { coupon }),
};
