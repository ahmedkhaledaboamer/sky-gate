import { CheckoutPage } from '@/components/pages/CheckoutPage';
import { getLocale } from '@/lib/getLocale';
import { createTranslator } from '@/messages';

export async function generateMetadata() {
  const t = createTranslator(await getLocale(), 'Checkout');
  return { title: t('title'), robots: { index: false } };
}

export default function Page() {
  return <CheckoutPage />;
}
