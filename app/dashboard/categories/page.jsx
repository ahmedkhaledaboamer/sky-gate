import { CategoriesAdminPage } from '@/components/dashboard/pages/NameImageAdminPages';
import { getLocale } from '@/lib/getLocale';
import { createTranslator } from '@/messages';

export async function generateMetadata() {
  const t = createTranslator(await getLocale(), 'Dashboard');
  return { title: t('nav.categories') };
}

export default function Page() {
  return <CategoriesAdminPage />;
}
