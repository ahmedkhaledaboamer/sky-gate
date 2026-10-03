import { createResource } from './resource';

// POST/PUT use multipart/form-data: name, nameAr, image
export const categoriesApi = createResource('/categories');
