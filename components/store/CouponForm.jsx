'use client';

import { useState } from 'react';
import { TicketPercent } from 'lucide-react';
import { useCart, useCartPending } from '@/context/CartContext';
import { useTranslations } from '@/lib/i18n';
import { Button } from '@/components/ui/Button';
import { inputClasses } from '@/components/ui/Field';

/** PUT /cart/applyCoupon — shows the API message when the coupon is rejected. */
export function CouponForm() {
  const t = useTranslations('Cart');
  const cart = useCart();
  const applying = useCartPending('coupon');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (!code.trim()) {
      setError(t('couponRequired'));
      return;
    }
    setError('');
    try {
      await cart.applyCoupon(code.trim());
      setCode('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={submit} noValidate>
      <label htmlFor="coupon" className="block text-sm font-semibold text-slate-700 mb-1.5">
        {t('couponLabel')}
      </label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <TicketPercent className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="coupon"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              setError('');
            }}
            placeholder="SUMMER20"
            aria-invalid={Boolean(error) || undefined}
            aria-describedby={error ? 'coupon-error' : undefined}
            className={`${inputClasses(error)} ps-10 py-2.5 uppercase`}
          />
        </div>
        <Button type="submit" variant="outline" loading={applying}>
          {t('apply')}
        </Button>
      </div>
      {error && (
        <p id="coupon-error" role="alert" className="mt-1.5 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
      {cart.cart?.coupon && (
        <p className="mt-2 text-xs font-semibold text-emerald-700">
          {t('couponActive', { code: cart.cart.coupon })}
        </p>
      )}
    </form>
  );
}
