'use client';

import Link from 'next/link';
import {
  AlertTriangle,
  BadgeCheck,
  Clock,
  FolderTree,
  LayoutGrid,
  MessageSquareText,
  Package,
  ShoppingCart,
  TicketPercent,
  Truck,
  Users,
} from 'lucide-react';
import {
  brandsApi,
  categoriesApi,
  couponsApi,
  ordersApi,
  productsApi,
  reviewsApi,
  subcategoriesApi,
  usersApi,
} from '@/lib/api';
import { formatDate, formatNumber, formatPrice, shortId } from '@/lib/format';
import { useLocale, useTranslations } from '@/lib/i18n';
import { readTotal } from '@/lib/listResponse';
import { localized } from '@/lib/product';
import { useApiQuery } from '@/hooks/useApiQuery';
import { DataTable } from '@/components/ui/DataTable';
import { Thumb } from '@/components/ui/RemoteImage';
import { ErrorState, Skeleton } from '@/components/ui/States';
import { DeliveredBadge, PaidBadge } from '@/components/orders/OrderStatus';
import { DashboardPageHeader } from '../DashboardUI';

// No aggregate endpoint exists: every count is read from a list endpoint
// called with limit=1 (pagination.totalResults).
const COUNT = { limit: 1, field: '_id' };

const STATS = [
  { key: 'products', icon: Package, href: '/dashboard/products', load: (s) => productsApi.list(COUNT, { signal: s }) },
  { key: 'orders', icon: ShoppingCart, href: '/dashboard/orders', load: (s) => ordersApi.list(COUNT, { signal: s }) },
  { key: 'users', icon: Users, href: '/dashboard/users', load: (s) => usersApi.list(COUNT, { signal: s }) },
  { key: 'categories', icon: LayoutGrid, href: '/dashboard/categories', load: (s) => categoriesApi.list(COUNT, { signal: s }) },
  { key: 'subcategories', icon: FolderTree, href: '/dashboard/subcategories', load: (s) => subcategoriesApi.list(COUNT, { signal: s }) },
  { key: 'brands', icon: BadgeCheck, href: '/dashboard/brands', load: (s) => brandsApi.list(COUNT, { signal: s }) },
  { key: 'coupons', icon: TicketPercent, href: '/dashboard/coupons', load: (s) => couponsApi.list(COUNT, { signal: s }) },
  { key: 'reviews', icon: MessageSquareText, href: '/dashboard/reviews', load: (s) => reviewsApi.list(COUNT, { signal: s }) },
  { key: 'unpaidOrders', icon: Clock, href: '/dashboard/orders?isPaid=false', tone: 'amber', load: (s) => ordersApi.list({ ...COUNT, isPaid: false }, { signal: s }) },
  { key: 'pendingDelivery', icon: Truck, href: '/dashboard/orders?isDelivered=false', tone: 'amber', load: (s) => ordersApi.list({ ...COUNT, isDelivered: false }, { signal: s }) },
];

function StatCard({ stat }) {
  const t = useTranslations('Dashboard');
  const locale = useLocale();
  const query = useApiQuery(['stat', stat.key], (signal) => stat.load(signal).then(readTotal));
  const tone = stat.tone === 'amber' ? 'bg-amber-50 text-amber-600' : 'bg-teal-50 text-teal-600';
  return (
    <Link
      href={stat.href}
      className="bg-white rounded-3xl border border-slate-100 shadow-soft p-5 flex items-center gap-4 hover:shadow-card hover:border-teal-100 transition-all"
    >
      <span className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${tone}`}>
        <stat.icon className="w-6 h-6" />
      </span>
      <div className="min-w-0">
        <p className="text-sm text-slate-500 truncate">{t(`stats.${stat.key}`)}</p>
        {query.isInitialLoading ? (
          <Skeleton className="h-7 w-16 mt-1" />
        ) : query.error ? (
          <p className="text-sm text-red-500" title={query.error.message}>
            —
          </p>
        ) : (
          <p className="text-2xl font-bold text-slate-900">{formatNumber(query.data, locale)}</p>
        )}
      </div>
    </Link>
  );
}

function Panel({ title, href, linkLabel, children }) {
  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-slate-900">{title}</h2>
        {href && (
          <Link href={href} className="text-sm font-semibold text-teal-600 hover:text-teal-700">
            {linkLabel}
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

function RecentOrders() {
  const t = useTranslations('Dashboard');
  const tOrders = useTranslations('Orders');
  const locale = useLocale();
  const query = useApiQuery(['dash-recent-orders'], (signal) =>
    ordersApi.list({ limit: 5, sort: '-createdAt' }, { signal })
  );
  if (query.error && !query.data) return <ErrorState error={query.error} onRetry={query.refetch} className="py-8" />;
  return (
    <DataTable
      isLoading={query.isInitialLoading}
      skeletonRows={5}
      rows={query.data?.data ?? []}
      empty={<p className="p-6 text-center text-sm text-slate-500">{t('noOrders')}</p>}
      columns={[
        {
          key: 'id',
          header: tOrders('order'),
          render: (o) => (
            <Link href={`/dashboard/orders/${o._id}`} className="font-semibold text-teal-600 hover:underline">
              {shortId(o._id)}
            </Link>
          ),
        },
        { key: 'customer', header: tOrders('customer'), render: (o) => o.user?.name ?? '—' },
        { key: 'total', header: tOrders('total'), render: (o) => formatPrice(o.totalOrderPrice, locale) },
        { key: 'paid', header: tOrders('payment'), render: (o) => <PaidBadge order={o} /> },
        { key: 'delivered', header: tOrders('delivery'), render: (o) => <DeliveredBadge order={o} /> },
        { key: 'date', header: tOrders('date'), render: (o) => formatDate(o.createdAt, locale) },
      ]}
    />
  );
}

function ProductMiniList({ queryKey, params, valueLabel, emptyLabel }) {
  const locale = useLocale();
  const query = useApiQuery([queryKey], (signal) =>
    productsApi.list({ limit: 5, field: 'title,titleAr,imageCover,quantity,sold', ...params }, { signal })
  );
  const items = query.data?.data ?? [];
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-soft divide-y divide-slate-100">
      {query.isInitialLoading ? (
        [0, 1, 2].map((i) => <Skeleton key={i} className="h-14 m-4" />)
      ) : query.error ? (
        <ErrorState error={query.error} onRetry={query.refetch} className="py-8" />
      ) : items.length === 0 ? (
        <p className="p-6 text-center text-sm text-slate-500">{emptyLabel}</p>
      ) : (
        items.map((p) => (
          <Link key={p._id} href={`/dashboard/products/${p._id}/edit`} className="flex items-center gap-3 p-4 hover:bg-slate-50">
            <Thumb src={p.imageCover} alt="" className="w-10 h-10 rounded-xl" />
            <span className="flex-1 min-w-0 text-sm font-medium text-slate-800 truncate">{localized(p, 'title', locale)}</span>
            <span className="text-sm font-semibold text-slate-900 whitespace-nowrap">{valueLabel(p)}</span>
          </Link>
        ))
      )}
    </div>
  );
}

export function OverviewPage() {
  const t = useTranslations('Dashboard');
  return (
    <>
      <DashboardPageHeader title={t('overviewTitle')} description={t('overviewDescription')} />
      <div className="grid grid-cols-1 min-[480px]:grid-cols-2 xl:grid-cols-5 gap-4 mb-8">
        {STATS.map((stat) => (
          <StatCard key={stat.key} stat={stat} />
        ))}
      </div>
      <div className="grid xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <Panel title={t('recentOrders')} href="/dashboard/orders" linkLabel={t('viewAll')}>
            <RecentOrders />
          </Panel>
        </div>
        <div className="space-y-6">
          <Panel title={<span className="inline-flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-500" />{t('lowStock')}</span>}>
            <ProductMiniList
              queryKey="dash-low-stock"
              params={{ quantity: { lte: 5 }, sort: 'quantity' }}
              valueLabel={(p) => t('inStockCount', { count: p.quantity })}
              emptyLabel={t('noLowStock')}
            />
          </Panel>
          <Panel title={t('topSelling')} href="/dashboard/products?sort=-sold" linkLabel={t('viewAll')}>
            <ProductMiniList
              queryKey="dash-top-selling"
              params={{ sort: '-sold' }}
              valueLabel={(p) => t('soldCount', { count: p.sold ?? 0 })}
              emptyLabel={t('noProducts')}
            />
          </Panel>
        </div>
      </div>
    </>
  );
}
