import { createResource } from './resource';

// POST/PUT use multipart/form-data: name, nameAr, image (optional)
export const brandsApi = createResource('/brands');
