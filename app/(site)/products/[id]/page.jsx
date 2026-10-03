import { ProductDetailsPage } from '@/components/pages/ProductDetailsPage';
import { serverGet } from '@/lib/api/server';
import { isMongoId } from '@/lib/constants';
import { getLocale } from '@/lib/getLocale';
import { createTranslator } from '@/messages';

// Same call in generateMetadata and the page: Next.js shares one request.
const getProduct = (id) => (isMongoId(id) ? serverGet(`/products/${id}`) : null);

export async function generateMetadata({ params }) {
  const { id } = await params;
  const locale = await getLocale();
  const t = createTranslator(locale, 'ProductDetails');
  const data = (await getProduct(id))?.data;
  if (!data) return { title: t('metaTitle') };
  const title = (locale === 'ar' && data.titleAr) || data.title;
  const description = String((locale === 'ar' && data.descriptionAr) || data.description || '').slice(0, 160);
  return {
    title,
    description,
    alternates: { canonical: `/products/${id}` },
    openGraph: { title, description, images: data.imageCover ? [data.imageCover] : undefined },
  };
}

// The product (and its brand) are rendered on the server; reviews, related
// products and the user's cart / wishlist state load in the browser.
export default async function Page({ params }) {
  const { id } = await params;
  const product = await getProduct(id);
  const brandId = product?.data?.brand;
  const brand = typeof brandId === 'string' && isMongoId(brandId) ? await serverGet(`/brands/${brandId}`) : null;
  // `key` resets local state (selected color, quantity) between products
  return (
    <ProductDetailsPage
      key={id}
      id={id}
      initialProduct={product ?? undefined}
      initialBrand={brand ?? undefined}
    />
  );
}
