import { BrandsPage } from '@/components/pages/BrandsPage';
import { getLocale } from '@/lib/getLocale';
import { createTranslator } from '@/messages';

export async function generateMetadata() {
  const t = createTranslator(await getLocale(), 'Catalog');
  return {
    title: t('brandsTitle'),
    description: t('brandsDescription'),
    alternates: { canonical: '/brands' },
  };
}

export default function Page() {
  return <BrandsPage />;
}
