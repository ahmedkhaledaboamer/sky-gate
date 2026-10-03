import { Suspense } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { LoadingState } from '@/components/ui/States';
import { getLocale } from '@/lib/getLocale';
import { createTranslator } from '@/messages';

export async function generateMetadata() {
  const t = createTranslator(await getLocale(), 'Auth');
  return { title: t('loginTitle'), robots: { index: false } };
}

export default function Page() {
  return (
    <Suspense fallback={<LoadingState className="min-h-screen" />}>
      <LoginForm />
    </Suspense>
  );
}
