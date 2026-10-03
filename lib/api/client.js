// Centralized HTTP client for the E-Commerce API.
// - Base URL comes from NEXT_PUBLIC_API_URL (the API origin, without /api/v1)
// - Adds `Authorization: Bearer <token>` when a session exists
// - Normalizes both error shapes ({ errors: [...] } and { status, message })
// - Notifies the auth layer on 401 so the session can be cleared
// - Shows API messages in Arabic when the site is in Arabic (apiMessages.js)
import { currentLocale, translateApiMessage } from './apiMessages';

export const API_ORIGIN = (process.env.NEXT_PUBLIC_API_URL || '').replace(
  /\/+$/,
  ''
);
export const API_BASE_URL = `${API_ORIGIN}/api/v1`;

let authToken = null;
let unauthorizedHandler = null;

export function setAuthToken(token) {
  authToken = token || null;
}

/** Registers the callback run when an authenticated request returns 401. */
export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler;
}

export class ApiError extends Error {
  constructor(rawMessage, { status = 0, errors: rawErrors = [], data = null } = {}) {
    const locale = currentLocale();
    const message = translateApiMessage(rawMessage, locale);
    const errors = rawErrors.map((e) => (e?.msg ? { ...e, msg: translateApiMessage(e.msg, locale) } : e));
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
    this.data = data;
    // { email: 'Email required', ... } — first message per field
    this.fieldErrors = errors.reduce((acc, e) => {
      if (e?.path && !acc[e.path]) acc[e.path] = e.msg;
      return acc;
    }, {});
  }
}

/**
 * Serializes nested query objects the way the API expects:
 * { price: { gte: 100 } } => price[gte]=100. Empty values are skipped.
 */
export function buildQuery(params = {}) {
  const search = new URLSearchParams();
  const append = (key, value) => {
    if (value === undefined || value === null || value === '') return;
    if (Array.isArray(value)) {
      value.forEach((v) => append(key, v));
    } else if (typeof value === 'object') {
      Object.entries(value).forEach(([k, v]) => append(`${key}[${k}]`, v));
    } else {
      search.append(key, String(value));
    }
  };
  Object.entries(params).forEach(([k, v]) => append(k, v));
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

async function parseBody(res) {
  if (res.status === 204) return null;
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

export async function request(
  path,
  { method = 'GET', query, body, signal, headers = {} } = {}
) {
  if (!API_ORIGIN) {
    throw new ApiError(
      'API URL is not configured. Set NEXT_PUBLIC_API_URL in .env.local.'
    );
  }

  const isFormData =
    typeof FormData !== 'undefined' && body instanceof FormData;
  const sentToken = authToken;
  const init = {
    method,
    signal,
    headers: {
      Accept: 'application/json',
      ...(body && !isFormData ? { 'Content-Type': 'application/json' } : {}),
      ...(sentToken ? { Authorization: `Bearer ${sentToken}` } : {}),
      ...headers,
    },
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
  };

  let res;
  try {
    res = await fetch(`${API_BASE_URL}${path}${buildQuery(query)}`, init);
  } catch (err) {
    if (err?.name === 'AbortError') throw err;
    throw new ApiError('Network error — please check your connection.');
  }

  const data = await parseBody(res);
  if (res.ok) return data;

  const errors = Array.isArray(data?.errors) ? data.errors : [];
  const message =
    data?.message ||
    errors[0]?.msg ||
    res.statusText ||
    'Something went wrong';
  const error = new ApiError(message, { status: res.status, errors, data });

  // An expired / revoked token: let the auth layer log the user out.
  if (res.status === 401 && sentToken && unauthorizedHandler) {
    unauthorizedHandler(error);
  }
  throw error;
}

export const http = {
  get: (path, options) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options) =>
    request(path, { ...options, method: 'POST', body }),
  put: (path, body, options) =>
    request(path, { ...options, method: 'PUT', body }),
  delete: (path, options) => request(path, { ...options, method: 'DELETE' }),
};

/** profileImg comes back as a bare file name served at `<origin>/users/<file>`. */
export function userImageUrl(fileName) {
  if (!fileName) return null;
  if (/^https?:\/\//.test(fileName)) return fileName;
  return `${API_ORIGIN}/users/${fileName}`;
}
