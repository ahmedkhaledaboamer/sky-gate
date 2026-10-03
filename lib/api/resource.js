import { http } from './client';

/**
 * Standard CRUD calls shared by most resources:
 *   GET /path, GET /path/:id, POST /path, PUT /path/:id, DELETE /path/:id
 * `body` may be a plain object (JSON) or FormData (multipart).
 */
export function createResource(path) {
  return {
    list: (query, options) => http.get(path, { ...options, query }),
    get: (id, options) => http.get(`${path}/${id}`, options),
    create: (body) => http.post(path, body),
    update: (id, body) => http.put(`${path}/${id}`, body),
    remove: (id) => http.delete(`${path}/${id}`),
  };
}
