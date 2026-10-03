'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useTranslations } from '@/lib/i18n';

export function NotFoundPage() {
  const t = useTranslations('NotFound');
  return (
    <main className="pt-40 pb-24 min-h-screen bg-saudi-sand flex items-center justify-center">
      <div className="container mx-auto px-6 md:px-12 text-center max-w-2xl">
        <p className="text-xs font-bold tracking-widest text-saudi-champagne uppercase mb-4">
          404
        </p>
        <h1 className="font-serif text-5xl font-bold text-saudi-midnight mb-6">
          {t('title')}
        </h1>
        <p className="text-saudi-ink/70 mb-10 font-light text-lg">
          {t('description')}
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-3 px-8 py-4 bg-saudi-midnight text-saudi-champagne font-semibold text-sm uppercase tracking-wider hover:bg-saudi-ink transition-colors"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          {t('backHome')}
        </Link>
      </div>
    </main>
  );
}
