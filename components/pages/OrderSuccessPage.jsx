'use client';

import { useSearchParams } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import { isMongoId, ROLES } from '@/lib/constants';
import { shortId } from '@/lib/format';
import { useTranslations } from '@/lib/i18n';
import { ProtectedRoute } from '@/components/auth/Guards';
import { Button } from '@/components/ui/Button';

export function OrderSuccessPage() {
  const t = useTranslations('Checkout');
  const orderId = useSearchParams().get('order');
  const validId = isMongoId(orderId);
  return (
    <ProtectedRoute roles={[ROLES.USER]}>
      <main className="pt-40 pb-24 bg-saudi-sand min-h-screen">
        <div className="container mx-auto px-4 max-w-xl">
          <div className="bg-white rounded-3xl shadow-card border border-slate-100 p-8 sm:p-12 text-center">
            <div className="mx-auto w-20 h-20 rounded-full bg-teal-50 text-teal-500 flex items-center justify-center mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h1 className="font-serif text-4xl font-bold text-slate-900">{t('successTitle')}</h1>
            <p className="mt-3 text-slate-600">{t('successDescription')}</p>
            {validId && (
              <p className="mt-4 text-sm text-slate-500">
                {t('orderNumber')} <strong className="text-slate-900">{shortId(orderId)}</strong>
              </p>
            )}
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
              <Button href={validId ? `/account/orders/${orderId}` : '/account/orders'}>{t('viewOrder')}</Button>
              <Button href="/products" variant="outline">
                {t('continueShopping')}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
