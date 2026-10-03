import { ProductCreatePage } from '@/components/dashboard/pages/ProductsAdminPage';
import { getLocale } from '@/lib/getLocale';
import { createTranslator } from '@/messages';

export async function generateMetadata() {
  const t = createTranslator(await getLocale(), 'Dashboard');
  return { title: t('product.create') };
}

export default function Page() {
  return <ProductCreatePage />;
}
