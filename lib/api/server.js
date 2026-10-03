import 'server-only';
import { API_BASE_URL, API_ORIGIN, buildQuery } from './client';

// How long the Next.js server reuses an API answer before asking again.
// Public catalog data only — anything user-specific is fetched in the browser.
export const REVALIDATE_SECONDS = 60;

/**
 * GET from the API on the server (Server Components). Responses are cached by
 * Next.js for REVALIDATE_SECONDS and identical calls in one render are shared.
 * Returns null on any failure: the page then loads the data in the browser.
 */
export async function serverGet(path, query, { revalidate = REVALIDATE_SECONDS } = {}) {
  if (!API_ORIGIN) return null;
  try {
    const res = await fetch(`${API_BASE_URL}${path}${buildQuery(query)}`, {
      next: { revalidate },
      signal: AbortSignal.timeout(8000),
    });
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
}
