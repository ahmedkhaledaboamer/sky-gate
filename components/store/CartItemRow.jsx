'use client';

import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { useCartActions, useCartPending } from '@/context/CartContext';
import { formatPrice } from '@/lib/format';
import { useLocale, useTranslations } from '@/lib/i18n';
import { localized } from '@/lib/product';
import { Button } from '@/components/ui/Button';
import { Thumb } from '@/components/ui/RemoteImage';
import { Skeleton } from '@/components/ui/States';
import { QuantityStepper } from './QuantityStepper';

/** One cart line. `product` comes from the per-id cache (cart items only hold the id). */
export function CartItemRow({ item, product, productLoading, readOnly = false }) {
  const t = useTranslations('Cart');
  const locale = useLocale();
  const cart = useCartActions();
  const productId = item.product?._id ?? item.product;
  const busy = useCartPending(item._id);
  const title = product ? localized(product, 'title', locale) : null;

  return (
    <li className={`flex gap-4 py-5 ${busy ? 'opacity-60' : ''}`}>
      <Link href={`/products/${productId}`} className="shrink-0">
        <Thumb src={product?.imageCover} alt={title ?? ''} className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl" />
      </Link>
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {title ? (
              <Link href={`/products/${productId}`} className="font-semibold text-slate-900 hover:text-teal-600 line-clamp-2">
                {title}
              </Link>
            ) : productLoading ? (
              <Skeleton className="h-5 w-40" />
            ) : (
              <span className="font-semibold text-slate-500">{t('unavailableProduct')}</span>
            )}
            <div className="mt-1 flex flex-wrap gap-x-3 text-xs text-slate-500">
              {item.color && (
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: item.color }} />
                  {item.color}
                </span>
              )}
              <span>{t('unitPrice', { price: formatPrice(item.price, locale) })}</span>
            </div>
          </div>
          <p className="font-bold text-slate-900 whitespace-nowrap">{formatPrice(item.price * item.quantity, locale)}</p>
        </div>
        <div className="flex items-center justify-between gap-3 mt-auto">
          {readOnly ? (
            <span className="text-sm text-slate-600">{t('qty', { count: item.quantity })}</span>
          ) : (
            <>
              <QuantityStepper
                size="sm"
                value={item.quantity}
                max={product?.quantity ?? Infinity}
                disabled={busy}
                onChange={(q) => cart.updateQuantity(item._id, q)}
              />
              <Button
                variant="dangerGhost"
                size="sm"
                onClick={() => cart.removeItem(item._id)}
                disabled={busy}
                aria-label={t('remove')}
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">{t('remove')}</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </li>
  );
}
