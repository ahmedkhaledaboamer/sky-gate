import { UsersAdminPage } from '@/components/dashboard/pages/UsersAdminPage';
import { getLocale } from '@/lib/getLocale';
import { createTranslator } from '@/messages';

export async function generateMetadata() {
  const t = createTranslator(await getLocale(), 'Dashboard');
  return { title: t('nav.users') };
}

export default function Page() {
  return <UsersAdminPage />;
}
