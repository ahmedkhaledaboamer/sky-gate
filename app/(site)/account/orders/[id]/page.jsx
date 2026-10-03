import { OrderDetailsPage } from '@/components/account/OrderDetailsPage';
import { getLocale } from '@/lib/getLocale';
import { createTranslator } from '@/messages';

export async function generateMetadata() {
  const t = createTranslator(await getLocale(), 'Orders');
  return { title: t('orderDetails'), robots: { index: false } };
}

export default async function Page({ params }) {
  const { id } = await params;
  return <OrderDetailsPage key={id} id={id} />;
}
