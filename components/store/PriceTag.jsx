'use client';

import { formatPrice } from '@/lib/format';
import { useLocale } from '@/lib/i18n';
import { finalPrice, hasDiscount } from '@/lib/product';

/** Current price, plus the original price struck through when discounted. */
export function PriceTag({ product, size = 'md' }) {
  const locale = useLocale();
  const big = size === 'lg';
  return (
    <div className="flex items-baseline gap-2 flex-wrap">
      <span className={`font-bold text-slate-900 ${big ? 'text-3xl' : 'text-lg'}`}>
        {formatPrice(finalPrice(product), locale)}
      </span>
      {hasDiscount(product) && (
        <span className={`text-slate-400 line-through ${big ? 'text-lg' : 'text-sm'}`}>
          {formatPrice(product.price, locale)}
        </span>
      )}
    </div>
  );
}
