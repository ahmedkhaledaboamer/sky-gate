'use client';

import { formatPrice } from '@/lib/format';
import { useLocale, useTranslations } from '@/lib/i18n';

/** Subtotal / discount / total from the cart totals returned by the API. */
export function cartTotals(cart) {
  const subtotal = Number(cart?.totalCartPrice) || 0;
  const discounted =
    cart?.totalPriceAfterDiscount !== undefined && cart?.totalPriceAfterDiscount !== null
      ? Number(cart.totalPriceAfterDiscount)
      : null;
  const total = discounted ?? subtotal;
  return { subtotal, discount: Math.max(subtotal - total, 0), total };
}

export function CartSummary({ cart, children }) {
  const t = useTranslations('Cart');
  const locale = useLocale();
  const { subtotal, discount, total } = cartTotals(cart);
  return (
    <div className="bg-white rounded-3xl shadow-soft border border-slate-100 p-6">
      <h2 className="font-serif text-2xl font-bold text-slate-900 mb-5">{t('summary')}</h2>
      <dl className="space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-slate-600">{t('subtotal')}</dt>
          <dd className="font-semibold text-slate-900">{formatPrice(subtotal, locale)}</dd>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-emerald-700">
            <dt>
              {t('discount')}
              {cart?.coupon ? ` (${cart.coupon})` : ''}
            </dt>
            <dd className="font-semibold">−{formatPrice(discount, locale)}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt className="text-slate-600">{t('shipping')}</dt>
          <dd className="text-slate-500">{t('shippingNote')}</dd>
        </div>
        <div className="flex justify-between pt-3 border-t border-slate-100 text-base">
          <dt className="font-semibold text-slate-900">{t('total')}</dt>
          <dd className="font-bold text-slate-900">{formatPrice(total, locale)}</dd>
        </div>
      </dl>
      {children && <div className="mt-6 space-y-4">{children}</div>}
    </div>
  );
}
