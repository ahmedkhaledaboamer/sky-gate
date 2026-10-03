// Builds the multipart body for POST / PUT /products.
//   colors        -> repeated field (colors=red&colors=blue), or "[]" to clear on edit
//   images        -> new files (max 5 in total) + on edit a JSON list of the
//                    existing image URLs to keep
//   subcategories -> JSON array of ids (must belong to the selected category)

export function productFormData(values, { isEdit, original }) {
  const fd = new FormData();
  const set = (key, value) => fd.append(key, value === undefined || value === null ? '' : String(value));

  set('title', values.title.trim());
  set('description', values.description.trim());
  set('quantity', values.quantity);
  set('price', values.price);
  set('category', values.category);

  if (values.titleAr.trim() || isEdit) set('titleAr', values.titleAr.trim());
  if (values.descriptionAr.trim() || isEdit) set('descriptionAr', values.descriptionAr.trim());
  // '' clears the value on edit (the API maps it to null)
  if (values.priceAfterDiscount !== '' || (isEdit && original?.priceAfterDiscount)) {
    set('priceAfterDiscount', values.priceAfterDiscount);
  }
  if (values.brand || (isEdit && original?.brand)) set('brand', values.brand);
  set('featured', values.featured ? 'true' : 'false');

  if (values.colors.length) values.colors.forEach((c) => fd.append('colors', c));
  else if (isEdit && original?.colors?.length) set('colors', '[]');

  if (values.subcategories.length || (isEdit && original?.subcategories?.length)) {
    set('subcategories', JSON.stringify(values.subcategories));
  }

  if (values.imageCoverFile) fd.append('imageCover', values.imageCoverFile);
  if (isEdit) set('images', JSON.stringify(values.keptImages));
  values.newImages.forEach((file) => fd.append('images', file));

  return fd;
}
