import { http } from './client';

// note: the route is singular — /address. Every call returns data = addresses.
export const addressesApi = {
  list: (options) => http.get('/address', options),
  add: (body) => http.post('/address', body),
  remove: (addressId) => http.delete(`/address/${addressId}`),
};
