import { CategoriesPage } from '@/components/pages/CategoriesPage';
import { serverGet } from '@/lib/api/server';
import { OPTIONS_LIMIT } from '@/lib/constants';
import { getLocale } from '@/lib/getLocale';
import { createTranslator } from '@/messages';

export async function generateMetadata() {
  const t = createTranslator(await getLocale(), 'Catalog');
  return {
    title: t('categoriesTitle'),
    description: t('categoriesDescription'),
    alternates: { canonical: '/categories' },
  };
}

// categories come from the site layout; subcategories are loaded here
export default async function Page() {
  const subcategories = await serverGet('/subcategories', { limit: OPTIONS_LIMIT, sort: 'name' });
  return <CategoriesPage initialSubcategories={subcategories?.data} />;
}
