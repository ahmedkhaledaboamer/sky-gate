import { AddressesPage } from '@/components/account/AddressesPage';
import { getLocale } from '@/lib/getLocale';
import { createTranslator } from '@/messages';

export async function generateMetadata() {
  const t = createTranslator(await getLocale(), 'Address');
  return { title: t('title'), robots: { index: false } };
}

export default function Page() {
  return <AddressesPage />;
}
