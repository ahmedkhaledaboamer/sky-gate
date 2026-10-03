// Product lists of the home page — used by the server render (app/(site)/page.jsx)
// and by the client sections, so both ask the API for exactly the same data.
import { PRODUCT_CARD_FIELDS } from './constants';

export const HOME_LIMIT = 8;
const field = PRODUCT_CARD_FIELDS;
export const BEST_SELLERS_QUERY = { sort: '-sold', limit: HOME_LIMIT, field };
export const FEATURED_QUERY = { featured: true, limit: HOME_LIMIT, field };
export const NEWEST_QUERY = { sort: '-createdAt', limit: HOME_LIMIT, field };
