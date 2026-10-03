'use client';

import { useRouter } from 'next/navigation';
import { useToast } from '@/context/ToastContext';
import { productsApi } from '@/lib/api';
import {
  PRODUCT_DESCRIPTION,
  PRODUCT_MAX_IMAGES,
  PRODUCT_MAX_PRICE,
  PRODUCT_TITLE,
} from '@/lib/constants';
import { productFormData } from '@/lib/forms/productFormData';
import { useLocale, useTranslations } from '@/lib/i18n';
import { localized, refId } from '@/lib/product';
import { rules, validate } from '@/lib/validation';
import { useForm } from '@/hooks/useForm';
import { useBrands, useCategories, useSubcategories } from '@/hooks/useCatalogOptions';
import { invalidateProduct } from '@/hooks/useProductsByIds';
import { Button } from '@/components/ui/Button';
import { FormError, Input, Select, Textarea } from '@/components/ui/Field';
import { ImageInput, MultiImageInput } from './ImageInput';
import { TagInput } from './TagInput';

const card = 'bg-white rounded-3xl border border-slate-100 shadow-soft p-5 sm:p-6 space-y-5';

function initialValues(product) {
  return {
    title: product?.title ?? '',
    titleAr: product?.titleAr ?? '',
    description: product?.description ?? '',
    descriptionAr: product?.descriptionAr ?? '',
    quantity: product?.quantity ?? '',
    price: product?.price ?? '',
    priceAfterDiscount: product?.priceAfterDiscount ?? '',
    category: refId(product?.category) ?? '',
    subcategories: (product?.subcategories ?? []).map(refId),
    brand: refId(product?.brand) ?? '',
    colors: product?.colors ?? [],
    featured: Boolean(product?.featured),
    imageCoverFile: null,
    keptImages: product?.images ?? [],
    newImages: [],
  };
}

function SubcategoryPicker({ categoryId, value, onChange, error }) {
  const t = useTranslations('Dashboard');
  const locale = useLocale();
  const subs = useSubcategories(categoryId || undefined);
  if (!categoryId) return null;
  const list = subs.data ?? [];
  return (
    <fieldset>
      <legend className="block text-sm font-semibold text-slate-700 mb-1.5">{t('product.subcategories')}</legend>
      {subs.isInitialLoading ? (
        <p className="text-sm text-slate-500">{t('loading')}</p>
      ) : list.length === 0 ? (
        <p className="text-sm text-slate-500">{t('product.noSubcategories')}</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {list.map((sub) => {
            const checked = value.includes(sub._id);
            return (
              <label
                key={sub._id}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm cursor-pointer ${
                  checked ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-slate-200 text-slate-700'
                }`}
              >
                <input
                  type="checkbox"
                  className="accent-teal-600"
                  checked={checked}
                  onChange={() => onChange(checked ? value.filter((id) => id !== sub._id) : [...value, sub._id])}
                />
                {localized(sub, 'name', locale)}
              </label>
            );
          })}
        </div>
      )}
      {error && <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>}
    </fieldset>
  );
}

/** Create (no `product`) or edit a product — multipart/form-data. */
export function ProductForm({ product }) {
  const t = useTranslations('Dashboard');
  const locale = useLocale();
  const router = useRouter();
  const toast = useToast();
  const isEdit = Boolean(product);
  const categories = useCategories();
  const brands = useBrands();

  const form = useForm(initialValues(product), (v) =>
    validate(v, {
      title: [
        rules.required(t('v.required')),
        rules.minLength(PRODUCT_TITLE.min, t('v.minLength', { min: PRODUCT_TITLE.min })),
        rules.maxLength(PRODUCT_TITLE.max, t('v.maxLength', { max: PRODUCT_TITLE.max })),
      ],
      description: [
        rules.required(t('v.required')),
        rules.minLength(PRODUCT_DESCRIPTION.min, t('v.minLength', { min: PRODUCT_DESCRIPTION.min })),
        rules.maxLength(PRODUCT_DESCRIPTION.max, t('v.maxLength', { max: PRODUCT_DESCRIPTION.max })),
      ],
      quantity: [rules.required(t('v.required')), rules.number(t('v.integer'), { min: 0, integer: true })],
      price: [
        rules.required(t('v.required')),
        rules.number(t('v.priceRange', { max: PRODUCT_MAX_PRICE }), { min: 0, max: PRODUCT_MAX_PRICE }),
      ],
      priceAfterDiscount: [
        rules.number(t('v.number'), { min: 0 }),
        rules.custom((d, all) => d === '' || Number(d) < Number(all.price), t('v.discountLower')),
      ],
      category: [rules.required(t('v.categoryRequired'))],
      imageCoverFile: [rules.custom((f) => isEdit || Boolean(f), t('v.coverRequired'))],
      newImages: [
        rules.custom(
          (files, all) => files.length + all.keptImages.length <= PRODUCT_MAX_IMAGES,
          t('v.maxImages', { max: PRODUCT_MAX_IMAGES })
        ),
      ],
    })
  );
  const { values, setValue, errors } = form;

  const onSubmit = form.handleSubmit(async (v) => {
    const body = productFormData(v, { isEdit, original: product });
    if (isEdit) {
      await productsApi.update(product._id, body);
      invalidateProduct(product._id);
      toast.success(t('saved'));
    } else {
      await productsApi.create(body);
      toast.success(t('created'));
    }
    router.push('/dashboard/products');
  });

  const toOptions = (list) => (list ?? []).map((i) => ({ value: i._id, label: localized(i, 'name', locale) }));

  return (
    <form onSubmit={onSubmit} noValidate className="grid xl:grid-cols-3 gap-6 items-start">
      <div className="xl:col-span-2 space-y-6">
        <FormError message={form.formError} />
        <section className={card}>
          <h2 className="font-semibold text-slate-900">{t('product.basics')}</h2>
          <div className="grid md:grid-cols-2 gap-5">
            <Input {...form.field('title')} label={t('product.title')} maxLength={PRODUCT_TITLE.max} required />
            <Input {...form.field('titleAr')} label={t('product.titleAr')} dir="rtl" maxLength={PRODUCT_TITLE.max} />
          </div>
          <Textarea
            {...form.field('description')}
            label={t('product.description')}
            rows={5}
            maxLength={PRODUCT_DESCRIPTION.max}
            hint={t('product.descriptionHint', { min: PRODUCT_DESCRIPTION.min, count: values.description.length })}
            required
          />
          <Textarea {...form.field('descriptionAr')} label={t('product.descriptionAr')} rows={4} dir="rtl" />
        </section>

        <section className={card}>
          <h2 className="font-semibold text-slate-900">{t('product.pricing')}</h2>
          <div className="grid sm:grid-cols-3 gap-5">
            <Input {...form.field('price')} label={t('product.price')} type="number" min="0" step="0.01" required />
            <Input
              {...form.field('priceAfterDiscount')}
              label={t('product.priceAfterDiscount')}
              type="number"
              min="0"
              step="0.01"
              hint={t('product.discountHint')}
            />
            <Input {...form.field('quantity')} label={t('product.quantity')} type="number" min="0" step="1" required />
          </div>
          <TagInput
            label={t('product.colors')}
            hint={t('product.colorsHint')}
            value={values.colors}
            onChange={(c) => setValue('colors', c)}
            placeholder="red, #000000"
            swatch
          />
        </section>

        <section className={card}>
          <h2 className="font-semibold text-slate-900">{t('product.images')}</h2>
          <ImageInput
            label={t('product.imageCover')}
            required={!isEdit}
            error={errors.imageCoverFile}
            file={values.imageCoverFile}
            currentUrl={product?.imageCover}
            onChange={(f) => setValue('imageCoverFile', f)}
          />
          <MultiImageInput
            label={t('product.gallery')}
            hint={t('product.galleryHint', { max: PRODUCT_MAX_IMAGES })}
            error={errors.newImages}
            existing={values.keptImages}
            onExistingChange={(list) => setValue('keptImages', list)}
            files={values.newImages}
            onFilesChange={(files) => setValue('newImages', files)}
            max={PRODUCT_MAX_IMAGES}
          />
        </section>
      </div>

      <aside className="space-y-6 xl:sticky xl:top-24">
        <section className={card}>
          <h2 className="font-semibold text-slate-900">{t('product.organization')}</h2>
          <Select
            {...form.field('category')}
            onChange={(e) => {
              setValue('category', e.target.value);
              setValue('subcategories', []);
            }}
            label={t('product.category')}
            placeholder={categories.isInitialLoading ? t('loading') : t('select')}
            options={toOptions(categories.data)}
            required
          />
          <SubcategoryPicker
            categoryId={values.category}
            value={values.subcategories}
            onChange={(ids) => setValue('subcategories', ids)}
            error={errors.subcategories}
          />
          <Select
            {...form.field('brand')}
            label={t('product.brand')}
            placeholder={t('none')}
            options={toOptions(brands.data)}
          />
          <label className="flex items-center gap-3 text-sm font-medium text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 accent-teal-600"
              checked={values.featured}
              onChange={(e) => setValue('featured', e.target.checked)}
            />
            {t('product.featured')}
          </label>
        </section>
        <div className="flex gap-3">
          <Button type="submit" loading={form.isSubmitting} className="flex-1">
            {isEdit ? t('saveChanges') : t('product.create')}
          </Button>
          <Button variant="outline" href="/dashboard/products">
            {t('cancel')}
          </Button>
        </div>
      </aside>
    </form>
  );
}
