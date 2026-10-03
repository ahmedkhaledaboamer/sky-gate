import { CouponsAdminPage } from '@/components/dashboard/pages/CouponsAdminPage';
import { getLocale } from '@/lib/getLocale';
import { createTranslator } from '@/messages';

export async function generateMetadata() {
  const t = createTranslator(await getLocale(), 'Dashboard');
  return { title: t('nav.coupons') };
}

export default function Page() {
  return <CouponsAdminPage />;
}
