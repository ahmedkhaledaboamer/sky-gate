// Helpers around the API product / category / brand objects.

/** Picks the Arabic variant (nameAr, titleAr ...) when available. */
export function localized(entity, field, locale) {
  if (!entity) return '';
  if (locale === 'ar' && entity[`${field}Ar`]) return entity[`${field}Ar`];
  return entity[field] ?? '';
}

export function hasDiscount(product) {
  return (
    Number(product?.priceAfterDiscount) > 0 &&
    Number(product.priceAfterDiscount) < Number(product.price)
  );
}

/** The price the customer pays (same rule the API uses in the cart). */
export function finalPrice(product) {
  return hasDiscount(product)
    ? Number(product.priceAfterDiscount)
    : Number(product?.price) || 0;
}

export function discountPercent(product) {
  if (!hasDiscount(product)) return 0;
  return Math.round(
    ((product.price - product.priceAfterDiscount) / product.price) * 100
  );
}

export const isInStock = (product) => Number(product?.quantity) > 0;

/** category may be populated ({ _id, name }) or a bare id */
export const refId = (value) =>
  value && typeof value === 'object' ? value._id ?? value.id : value;
