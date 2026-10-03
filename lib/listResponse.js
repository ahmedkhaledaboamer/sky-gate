/**
 * Normalizes a list response: { results, pagination, data }.
 * `hasNext` relies on `pagination.next` (always accurate); `totalPages` falls
 * back gracefully when numberOfPage is missing.
 */
export function readList(response) {
  const items = Array.isArray(response?.data) ? response.data : [];
  const p = response?.pagination ?? {};
  const page = Number(p.currentPage) || 1;
  const hasNext = Boolean(p.next);
  const hasPrev = Boolean(p.prev) || page > 1;
  const reported = Number(p.numberOfPage) || 0;
  const totalPages = Math.max(reported, hasNext ? page + 1 : page, 1);
  const total =
    p.totalResults !== undefined && p.totalResults !== null
      ? Number(p.totalResults)
      : null;
  return { items, page, hasNext, hasPrev, totalPages, total };
}

/** Total count of a collection using the list endpoint (limit=1). */
export function readTotal(response) {
  const p = response?.pagination ?? {};
  if (p.totalResults !== undefined && p.totalResults !== null) {
    return Number(p.totalResults);
  }
  // with limit=1 the number of pages equals the number of documents
  if (Number(p.limit) === 1 && p.numberOfPage !== undefined) {
    return Number(p.numberOfPage);
  }
  return Array.isArray(response?.data) ? response.data.length : 0;
}
