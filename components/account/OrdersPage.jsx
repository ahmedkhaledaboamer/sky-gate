'use client';

import Link from 'next/link';
import { ChevronRight, CircleCheck, Package } from 'lucide-react';
import { ordersApi } from '@/lib/api';
import { ROLES } from '@/lib/constants';
import { formatDate, formatPrice, shortId } from '@/lib/format';
import { useLocale, useTranslations } from '@/lib/i18n';
import { readList } from '@/lib/listResponse';
import { useApiQuery } from '@/hooks/useApiQuery';
import { toPage, useUrlParams } from '@/hooks/useUrlParams';
import { ProtectedRoute } from '@/components/auth/Guards';
import { Button } from '@/components/ui/Button';
import { Pagination } from '@/components/ui/Pagination';
import { Thumb } from '@/components/ui/RemoteImage';
import { EmptyState, ErrorState, Skeleton } from '@/components/ui/States';
import { DeliveredBadge, PaidBadge } from '@/components/orders/OrderStatus';
import { AccountSection } from './AccountShell';

const PAGE_SIZE = 10;

function OrderCard({ order }) {
  const t = useTranslations('Orders');
  const locale = useLocale();
  const items = order.cartItems ?? [];
  return (
    <li>
      <Link
        href={`/account/orders/${order._id}`}
        className="block rounded-2xl border border-slate-200 p-4 sm:p-5 hover:border-teal-500 hover:shadow-soft transition-all"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-semibold text-slate-900">
              {t('order')} {shortId(order._id)}
            </p>
            <p className="text-xs text-slate-500">{formatDate(order.createdAt, locale)}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <PaidBadge order={order} />
            <DeliveredBadge order={order} />
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between gap-4">
          <div className="flex -space-x-3 rtl:space-x-reverse">
            {items.slice(0, 4).map((item, i) => (
              <Thumb
                key={item._id ?? i}
                src={item.product?.imageCover}
                alt={item.product?.title ?? ''}
                className="w-12 h-12 rounded-full ring-2 ring-white"
              />
            ))}
            {items.length > 4 && (
              <span className="w-12 h-12 rounded-full ring-2 ring-white bg-slate-100 text-xs font-semibold text-slate-600 flex items-center justify-center">
                +{items.length - 4}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="text-end">
              <p className="text-xs text-slate-500">{t('items', { count: items.length })}</p>
              <p className="font-bold text-slate-900">{formatPrice(order.totalOrderPrice, locale)}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 rtl:rotate-180" />
          </div>
        </div>
      </Link>
    </li>
  );
}

function OrdersContent() {
  const t = useTranslations('Orders');
  const [params, setParams] = useUrlParams();
  const page = toPage(params.page);
  const query = useApiQuery(
    ['my-orders', page],
    (signal) => ordersApi.list({ page, limit: PAGE_SIZE, sort: '-createdAt' }, { signal }),
    { keepPrevious: true }
  );
  const { items, totalPages, hasNext } = readList(query.data);

  return (
    <AccountSection title={t('myOrders')} description={t('myOrdersDescription')}>
      {params.payment === 'success' && (
        <div role="status" className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <CircleCheck className="w-4 h-4 shrink-0" />
          {t('paymentSuccess')}
        </div>
      )}
      {query.error && !query.data ? (
        <ErrorState error={query.error} onRetry={query.refetch} className="py-10" />
      ) : query.isInitialLoading ? (
        <div className="space-y-4">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={Package}
          title={t('emptyTitle')}
          description={t('emptyDescription')}
          action={<Button href="/products">{t('startShopping')}</Button>}
          className="py-10"
        />
      ) : (
        <>
          <ul className={`space-y-4 ${query.isLoading ? 'opacity-60' : ''}`}>
            {items.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </ul>
          <Pagination
            className="mt-8"
            page={page}
            totalPages={totalPages}
            hasNext={hasNext}
            onChange={(p) => setParams({ page: p > 1 ? p : '', payment: '' }, { resetPage: false })}
          />
        </>
      )}
    </AccountSection>
  );
}

export function OrdersPage() {
  return (
    <ProtectedRoute roles={[ROLES.USER]}>
      <OrdersContent />
    </ProtectedRoute>
  );
}
