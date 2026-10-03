import { Suspense } from 'react';
import { OrderSuccessPage } from '@/components/pages/OrderSuccessPage';
import { LoadingState } from '@/components/ui/States';
import { getLocale } from '@/lib/getLocale';
import { createTranslator } from '@/messages';

export async function generateMetadata() {
  const t = createTranslator(await getLocale(), 'Checkout');
  return { title: t('successTitle'), robots: { index: false } };
}

export default function Page() {
  return (
    <Suspense fallback={<LoadingState className="min-h-screen" />}>
      <OrderSuccessPage />
    </Suspense>
  );
}
