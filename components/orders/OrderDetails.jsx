'use client';

import Link from 'next/link';
import { MapPin, Receipt, UserRound } from 'lucide-react';
import { formatDate, formatPrice, shortId } from '@/lib/format';
import { useLocale, useTranslations } from '@/lib/i18n';
import { localized } from '@/lib/product';
import { Thumb } from '@/components/ui/RemoteImage';
import { DeliveredBadge, OrderTimeline, PaidBadge, PaymentMethod } from './OrderStatus';

const card = 'bg-white rounded-3xl shadow-soft border border-slate-100 p-5 sm:p-6';

/** Full order view — used by "My orders" and the dashboard. */
export function OrderDetails({ order, showCustomer = false, actions }) {
  const t = useTranslations('Orders');
  const locale = useLocale();
  const items = order.cartItems ?? [];
  const itemsTotal = items.reduce((sum, i) => sum + (i.price || 0) * (i.quantity || 0), 0);
  const address = order.shippingAddress ?? {};

  return (
    <div className="space-y-6">
      <div className={`${card} flex flex-wrap items-start justify-between gap-4`}>
        <div>
          <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase">{t('order')}</p>
          <h2 className="font-serif text-3xl font-bold text-slate-900" title={order._id}>
            {shortId(order._id)}
          </h2>
          <p className="text-sm text-slate-500 mt-1">{formatDate(order.createdAt, locale, true)}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <PaidBadge order={order} />
          <DeliveredBadge order={order} />
        </div>
        {actions && <div className="w-full flex flex-wrap gap-2">{actions}</div>}
      </div>

      <div className={card}>
        <OrderTimeline order={order} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 items-start">
        <section className={`${card} lg:col-span-2`}>
          <h3 className="font-semibold text-slate-900 mb-2">{t('items', { count: items.length })}</h3>
          <ul className="divide-y divide-slate-100">
            {items.map((item, i) => {
              const product = item.product && typeof item.product === 'object' ? item.product : null;
              const title = product ? localized(product, 'title', locale) : t('deletedProduct');
              return (
                <li key={item._id ?? i} className="flex items-center gap-4 py-4">
                  <Thumb src={product?.imageCover} alt={title} className="w-16 h-16 rounded-2xl" />
                  <div className="flex-1 min-w-0">
                    {product?._id ? (
                      <Link href={`/products/${product._id}`} className="font-semibold text-slate-900 hover:text-teal-600 line-clamp-2">
                        {title}
                      </Link>
                    ) : (
                      <span className="font-semibold text-slate-500">{title}</span>
                    )}
                    <p className="text-xs text-slate-500 mt-0.5 flex flex-wrap gap-x-3">
                      <span>{t('qty', { count: item.quantity })}</span>
                      {item.color && (
                        <span className="inline-flex items-center gap-1">
                          <span className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: item.color }} />
                          {item.color}
                        </span>
                      )}
                      <span>{formatPrice(item.price, locale)}</span>
                    </p>
                  </div>
                  <span className="font-semibold text-slate-900 whitespace-nowrap">
                    {formatPrice(item.price * item.quantity, locale)}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>

        <div className="space-y-6">
          <section className={card}>
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-teal-600" /> {t('payment')}
            </h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-500">{t('method')}</dt>
                <dd className="font-medium text-slate-800">
                  <PaymentMethod order={order} />
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">{t('itemsTotal')}</dt>
                <dd className="text-slate-800">{formatPrice(itemsTotal, locale)}</dd>
              </div>
              {itemsTotal + (order.taxPrice || 0) + (order.shippingPrice || 0) > order.totalOrderPrice && (
                <div className="flex justify-between text-emerald-700">
                  <dt>{t('discount')}</dt>
                  <dd>
                    −{formatPrice(itemsTotal + (order.taxPrice || 0) + (order.shippingPrice || 0) - order.totalOrderPrice, locale)}
                  </dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-slate-500">{t('shipping')}</dt>
                <dd className="text-slate-800">{formatPrice(order.shippingPrice, locale)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">{t('tax')}</dt>
                <dd className="text-slate-800">{formatPrice(order.taxPrice, locale)}</dd>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-100 text-base">
                <dt className="font-semibold text-slate-900">{t('total')}</dt>
                <dd className="font-bold text-slate-900">{formatPrice(order.totalOrderPrice, locale)}</dd>
              </div>
            </dl>
          </section>

          <section className={card}>
            <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-teal-600" /> {t('shippingAddress')}
            </h3>
            <address className="not-italic text-sm space-y-0.5">
              <span className="block text-slate-700">{address.details || '—'}</span>
              <span className="block text-slate-500">{[address.city, address.postalCode].filter(Boolean).join(' • ')}</span>
              {address.phone && (
                <span className="block text-slate-500" dir="ltr">
                  {address.phone}
                </span>
              )}
            </address>
          </section>

          {showCustomer && order.user && (
            <section className={card}>
              <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <UserRound className="w-4 h-4 text-teal-600" /> {t('customer')}
              </h3>
              <p className="text-sm font-medium text-slate-800">{order.user.name}</p>
              <p className="text-sm text-slate-500">{order.user.email}</p>
              {order.user.phone && (
                <p className="text-sm text-slate-500" dir="ltr">
                  {order.user.phone}
                </p>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
