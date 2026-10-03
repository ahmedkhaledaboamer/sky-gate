import { ProductEditPage } from '@/components/dashboard/pages/ProductsAdminPage';
import { getLocale } from '@/lib/getLocale';
import { createTranslator } from '@/messages';

export async function generateMetadata() {
  const t = createTranslator(await getLocale(), 'Dashboard');
  return { title: t('product.edit') };
}

export default function Page() {
  return <ProductEditPage />;
}
