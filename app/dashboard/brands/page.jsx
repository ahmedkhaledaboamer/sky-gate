import { BrandsAdminPage } from '@/components/dashboard/pages/NameImageAdminPages';
import { getLocale } from '@/lib/getLocale';
import { createTranslator } from '@/messages';

export async function generateMetadata() {
  const t = createTranslator(await getLocale(), 'Dashboard');
  return { title: t('nav.brands') };
}

export default function Page() {
  return <BrandsAdminPage />;
}
