import { isMongoId, PRODUCT_CARD_FIELDS, STORE_PAGE_SIZE } from './constants';

const num = (v) => (v !== undefined && v !== '' && !Number.isNaN(Number(v)) ? Number(v) : undefined);

/** Store filters as read from the URL (?category=…&minPrice=…). */
export function readProductFilters(params) {
  return {
    keyword: params.keyword ?? '',
    category: isMongoId(params.category) ? params.category : '',
    subcategory: isMongoId(params.subcategory) ? params.subcategory : '',
    brand: isMongoId(params.brand) ? params.brand : '',
    minPrice: num(params.minPrice) !== undefined ? params.minPrice : '',
    maxPrice: num(params.maxPrice) !== undefined ? params.maxPrice : '',
    rating: num(params.rating) !== undefined ? params.rating : '',
    sort: params.sort ?? '',
  };
}

/**
 * URL filters => API query:
 *   ?keyword=x&category=id&brand=id&subcategories=id
 *   &price[gte]=100&price[lte]=500&ratingsAverage[gte]=4&sort=-sold&page=1&limit=12
 */
export function toProductQuery(filters, page = 1, limit = STORE_PAGE_SIZE) {
  const price = {};
  if (num(filters.minPrice) !== undefined) price.gte = num(filters.minPrice);
  if (num(filters.maxPrice) !== undefined) price.lte = num(filters.maxPrice);
  return {
    page,
    limit,
    field: PRODUCT_CARD_FIELDS,
    sort: filters.sort || undefined,
    keyword: filters.keyword || undefined,
    category: filters.category || undefined,
    subcategories: filters.subcategory || undefined,
    brand: filters.brand || undefined,
    price: Object.keys(price).length ? price : undefined,
    ratingsAverage: num(filters.rating) !== undefined ? { gte: num(filters.rating) } : undefined,
  };
}

export const countActiveFilters = (f) =>
  ['category', 'subcategory', 'brand', 'rating'].filter((k) => f[k]).length +
  (f.minPrice !== '' || f.maxPrice !== '' ? 1 : 0);
