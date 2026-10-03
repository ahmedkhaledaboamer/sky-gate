import { http } from './client';

export const ordersApi = {
  // users get their own orders, admin/manager get all orders
  list: (query, options) => http.get('/orders', { ...options, query }),
  get: (id, options) => http.get(`/orders/${id}`, options),
  createCashOrder: (cartId, shippingAddress) =>
    http.post(`/orders/${cartId}`, { shippingAddress }),
  // Stripe: returns { session: { url } } — the order is created by the webhook
  createCheckoutSession: (cartId, shippingAddress) =>
    http.post(`/orders/checkout-session/${cartId}`, { shippingAddress }),
  markPaid: (id) => http.put(`/orders/${id}/pay`),
  markDelivered: (id) => http.put(`/orders/${id}/deliver`),
};
