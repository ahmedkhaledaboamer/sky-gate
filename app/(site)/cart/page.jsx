import { Suspense } from 'react';
import { CartPage } from '@/components/pages/CartPage';
import { LoadingState } from '@/components/ui/States';
import { getLocale } from '@/lib/getLocale';
import { createTranslator } from '@/messages';

export async function generateMetadata() {
  const t = createTranslator(await getLocale(), 'Cart');
  return { title: t('title'), robots: { index: false } };
}

export default function Page() {
  return (
    <Suspense fallback={<LoadingState className="min-h-screen" />}>
      <CartPage />
    </Suspense>
  );
}
