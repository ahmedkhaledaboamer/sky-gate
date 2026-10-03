'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { useTranslations } from '@/lib/i18n';

export default function Error({ error, retry, reset }) {
  const t = useTranslations('ErrorPage');

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="pt-40 pb-24 min-h-screen bg-saudi-sand flex items-center justify-center">
      <div className="container mx-auto px-6 md:px-12 text-center max-w-2xl">
        <h1 className="font-serif text-5xl font-bold text-saudi-midnight mb-6">
          {t('title')}
        </h1>
        <p className="text-saudi-ink/70 mb-10 font-light text-lg">
          {t('description')}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button
            type="button"
            // retry() re-fetches the segment (Next 16.2+); fall back to reset().
            onClick={() => (retry ?? reset)()}
            className="inline-flex items-center gap-3 px-8 py-4 bg-saudi-midnight text-saudi-champagne font-semibold text-sm uppercase tracking-wider hover:bg-saudi-ink transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            {t('retry')}
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-3 px-8 py-4 bg-transparent text-saudi-midnight font-semibold border border-saudi-midnight hover:bg-saudi-midnight hover:text-saudi-champagne transition-colors uppercase tracking-wider text-sm"
          >
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
            {t('backHome')}
          </Link>
        </div>
      </div>
    </main>
  );
}
