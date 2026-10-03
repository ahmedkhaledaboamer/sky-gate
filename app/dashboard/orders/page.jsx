import { OrdersAdminPage } from '@/components/dashboard/pages/OrdersAdminPage';
import { getLocale } from '@/lib/getLocale';
import { createTranslator } from '@/messages';

export async function generateMetadata() {
  const t = createTranslator(await getLocale(), 'Dashboard');
  return { title: t('nav.orders') };
}

export default function Page() {
  return <OrdersAdminPage />;
}
