import { createResource } from './resource';

// POST/PUT use multipart/form-data (see lib/forms/productFormData.js)
export const productsApi = createResource('/products');
