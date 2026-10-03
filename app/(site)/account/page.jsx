import { ProfilePage } from '@/components/account/ProfilePage';
import { getLocale } from '@/lib/getLocale';
import { createTranslator } from '@/messages';

export async function generateMetadata() {
  const t = createTranslator(await getLocale(), 'Account');
  return { title: t('personalInfo'), robots: { index: false } };
}

export default function Page() {
  return <ProfilePage />;
}
