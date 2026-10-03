export const ROLES = Object.freeze({
  USER: 'user',
  MANAGER: 'manager',
  ADMIN: 'admin',
});
export const ALL_ROLES = [ROLES.USER, ROLES.MANAGER, ROLES.ADMIN];
export const STAFF_ROLES = [ROLES.ADMIN, ROLES.MANAGER];

export const STORE_PAGE_SIZE = 12;
export const DASHBOARD_PAGE_SIZE = 10;
// used to load complete option lists (categories, brands ...) — API max is 500
export const OPTIONS_LIMIT = 500;

export const PRODUCT_MAX_IMAGES = 5;
export const PRODUCT_TITLE = { min: 3, max: 100 };
export const PRODUCT_DESCRIPTION = { min: 20, max: 2000 };
export const PRODUCT_MAX_PRICE = 200000;
export const NAME_LENGTH = { min: 3, max: 32 };
export const SUBCATEGORY_NAME_LENGTH = { min: 2, max: 32 };
export const PASSWORD_MIN = 6;

// label keys live in messages under Shop.sort*
export const PRODUCT_SORT_OPTIONS = [
  { value: '', labelKey: 'sortNewest' },
  { value: '-sold', labelKey: 'sortBestSelling' },
  { value: 'price', labelKey: 'sortPriceAsc' },
  { value: '-price', labelKey: 'sortPriceDesc' },
  { value: '-ratingsAverage', labelKey: 'sortTopRated' },
  { value: 'title', labelKey: 'sortName' },
];

export const RATING_FILTERS = [4, 3, 2, 1];

// Only what a product card shows (API `field` param — note: `field`, not `fields`).
// Keeps list responses and server-rendered pages small.
export const PRODUCT_CARD_FIELDS =
  'title,titleAr,imageCover,price,priceAfterDiscount,quantity,sold,ratingsAverage,ratingsQuantity,category';

export const CURRENCY = (process.env.NEXT_PUBLIC_CURRENCY || 'AED').toUpperCase();

export const STORAGE_KEYS = {
  token: 'sg_token',
  user: 'sg_user',
  resetEmail: 'sg_reset_email',
};

export const isMongoId = (value) =>
  typeof value === 'string' && /^[a-f\d]{24}$/i.test(value);
