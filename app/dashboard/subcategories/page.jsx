import { SubcategoriesAdminPage } from '@/components/dashboard/pages/SubcategoriesAdminPage';
import { getLocale } from '@/lib/getLocale';
import { createTranslator } from '@/messages';

export async function generateMetadata() {
  const t = createTranslator(await getLocale(), 'Dashboard');
  return { title: t('nav.subcategories') };
}

export default function Page() {
  return <SubcategoriesAdminPage />;
}
