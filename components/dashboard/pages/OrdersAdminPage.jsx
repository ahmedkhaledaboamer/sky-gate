'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, CreditCard, PackageX, Truck } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { ordersApi } from '@/lib/api';
import { formatDate, formatPrice, shortId } from '@/lib/format';
import { useLocale, useTranslations } from '@/lib/i18n';
import { useApiQuery } from '@/hooks/useApiQuery';
import { useDashboardList } from '@/hooks/useDashboardList';
import { Button } from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { DataTable } from '@/components/ui/DataTable';
import { Select } from '@/components/ui/Field';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/States';
import { OrderDetails } from '@/components/orders/OrderDetails';
import { DeliveredBadge, PaidBadge, PaymentMethod } from '@/components/orders/OrderStatus';
import { DashboardPageHeader, RowActions, TableFooter, Toolbar } from '../DashboardUI';

const BOOL = ['true', 'false'];

/** Mark paid / delivered with a confirmation dialog. */
function useOrderStatusAction(onDone) {
  const t = useTranslations('Dashboard');
  const toast = useToast();
  const [pending, setPending] = useState(null); // { order, action: 'pay' | 'deliver' }
  const [loading, setLoading] = useState(false);

  const confirm = async () => {
    setLoading(true);
    try {
      const { order, action } = pending;
      const res = action === 'pay' ? await ordersApi.markPaid(order._id) : await ordersApi.markDelivered(order._id);
      toast.success(action === 'pay' ? t('order.markedPaid') : t('order.markedDelivered'));
      setPending(null);
      onDone?.(res?.data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const modal = (
    <ConfirmModal
      open={Boolean(pending)}
      onClose={() => setPending(null)}
      onConfirm={confirm}
      loading={loading}
      title={pending?.action === 'pay' ? t('order.confirmPaidTitle') : t('order.confirmDeliveredTitle')}
      message={t(pending?.action === 'pay' ? 'order.confirmPaidMessage' : 'order.confirmDeliveredMessage', {
        id: pending ? shortId(pending.order._id) : '',
      })}
      confirmLabel={pending?.action === 'pay' ? t('order.markPaid') : t('order.markDelivered')}
    />
  );

  return { request: (order, action) => setPending({ order, action }), modal };
}

function StatusButtons({ order, onRequest, size = 'xs' }) {
  const t = useTranslations('Dashboard');
  return (
    <>
      {!order.isPaid && (
        <Button size={size} variant="outline" onClick={() => onRequest(order, 'pay')}>
          <CreditCard className="w-3.5 h-3.5" />
          {t('order.markPaid')}
        </Button>
      )}
      {!order.isDelivered && (
        <Button size={size} variant="outline" onClick={() => onRequest(order, 'deliver')}>
          <Truck className="w-3.5 h-3.5" />
          {t('order.markDelivered')}
        </Button>
      )}
    </>
  );
}

export function OrdersAdminPage() {
  const t = useTranslations('Dashboard');
  const tOrders = useTranslations('Orders');
  const locale = useLocale();
  // orders have no `name` field, so keyword search does not apply here
  const { query, list, page, setPage, params, setParams } = useDashboardList('admin-orders', ordersApi.list, (p) => ({
    isPaid: BOOL.includes(p.isPaid) ? p.isPaid : undefined,
    isDelivered: BOOL.includes(p.isDelivered) ? p.isDelivered : undefined,
    paymentMethodType: ['cash', 'card'].includes(p.method) ? p.method : undefined,
  }));
  const status = useOrderStatusAction(() => query.refetch());

  const boolOptions = (yes, no) => [
    { value: 'true', label: yes },
    { value: 'false', label: no },
  ];

  return (
    <>
      <DashboardPageHeader title={t('nav.orders')} description={t('ordersDescription')} />
      <Toolbar>
        <Select
          aria-label={tOrders('payment')}
          value={params.isPaid ?? ''}
          onChange={(e) => setParams({ isPaid: e.target.value })}
          placeholder={t('order.anyPayment')}
          options={boolOptions(tOrders('paid'), tOrders('unpaid'))}
          className="sm:w-48"
        />
        <Select
          aria-label={tOrders('delivery')}
          value={params.isDelivered ?? ''}
          onChange={(e) => setParams({ isDelivered: e.target.value })}
          placeholder={t('order.anyDelivery')}
          options={boolOptions(tOrders('delivered'), tOrders('notDelivered'))}
          className="sm:w-48"
        />
        <Select
          aria-label={tOrders('method')}
          value={params.method ?? ''}
          onChange={(e) => setParams({ method: e.target.value })}
          placeholder={t('order.anyMethod')}
          options={[
            { value: 'cash', label: tOrders('methodCash') },
            { value: 'card', label: tOrders('methodCard') },
          ]}
          className="sm:w-48"
        />
      </Toolbar>
      {query.error && !query.data ? (
        <ErrorState error={query.error} onRetry={query.refetch} />
      ) : (
        <DataTable
          isLoading={query.isLoading}
          rows={list.items}
          empty={<EmptyState title={t('noOrders')} className="py-12" />}
          columns={[
            {
              key: 'id',
              header: tOrders('order'),
              render: (o) => (
                <Link href={`/dashboard/orders/${o._id}`} className="font-semibold text-teal-600 hover:underline" title={o._id}>
                  {shortId(o._id)}
                </Link>
              ),
            },
            {
              key: 'customer',
              header: tOrders('customer'),
              render: (o) => (
                <div className="min-w-[140px]">
                  <p className="font-medium text-slate-900">{o.user?.name ?? '—'}</p>
                  <p className="text-xs text-slate-500">{o.user?.email}</p>
                </div>
              ),
            },
            { key: 'total', header: tOrders('total'), render: (o) => <span className="font-semibold">{formatPrice(o.totalOrderPrice, locale)}</span> },
            { key: 'method', header: tOrders('method'), render: (o) => <PaymentMethod order={o} /> },
            { key: 'paid', header: tOrders('payment'), render: (o) => <PaidBadge order={o} /> },
            { key: 'delivered', header: tOrders('delivery'), render: (o) => <DeliveredBadge order={o} /> },
            { key: 'date', header: tOrders('date'), render: (o) => formatDate(o.createdAt, locale) },
            {
              key: 'actions',
              header: <span className="sr-only">{t('col.actions')}</span>,
              render: (o) => (
                <div className="flex items-center justify-end gap-1.5">
                  <StatusButtons order={o} onRequest={status.request} />
                  <RowActions viewHref={`/dashboard/orders/${o._id}`} />
                </div>
              ),
            },
          ]}
        />
      )}
      <TableFooter list={list} page={page} onPageChange={setPage} />
      {status.modal}
    </>
  );
}

export function OrderAdminDetailsPage() {
  const t = useTranslations('Dashboard');
  const tOrders = useTranslations('Orders');
  const { id } = useParams();
  const query = useApiQuery(['admin-order', id], (signal) => ordersApi.get(id, { signal }));
  const status = useOrderStatusAction(() => query.refetch());
  const order = query.data?.data;

  return (
    <>
      <Button href="/dashboard/orders" variant="ghost" size="sm" className="mb-4 -ms-3">
        <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
        {t('backToOrders')}
      </Button>
      {query.isInitialLoading ? (
        <LoadingState />
      ) : order ? (
        <OrderDetails
          order={order}
          showCustomer
          actions={
            !order.isPaid || !order.isDelivered ? <StatusButtons order={order} onRequest={status.request} size="sm" /> : null
          }
        />
      ) : [400, 404].includes(query.error?.status) ? (
        <EmptyState icon={PackageX} title={tOrders('notFoundTitle')} />
      ) : (
        <ErrorState error={query.error} onRetry={query.refetch} />
      )}
      {status.modal}
    </>
  );
}
