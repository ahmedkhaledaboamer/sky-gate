import { Suspense } from 'react';
import { OrdersPage } from '@/components/account/OrdersPage';
import { LoadingState } from '@/components/ui/States';
import { getLocale } from '@/lib/getLocale';
import { createTranslator } from '@/messages';

export async function generateMetadata() {
  const t = createTranslator(await getLocale(), 'Orders');
  return { title: t('myOrders'), robots: { index: false } };
}

export default function Page() {
  return (
    <Suspense fallback={<LoadingState className="min-h-screen" />}>
      <OrdersPage />
    </Suspense>
  );
}
