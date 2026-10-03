'use client';

import { ArrowLeft, PackageX } from 'lucide-react';
import { ordersApi } from '@/lib/api';
import { ROLES } from '@/lib/constants';
import { useTranslations } from '@/lib/i18n';
import { useApiQuery } from '@/hooks/useApiQuery';
import { ProtectedRoute } from '@/components/auth/Guards';
import { Button } from '@/components/ui/Button';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/States';
import { OrderDetails } from '@/components/orders/OrderDetails';

function OrderDetailsContent({ id }) {
  const t = useTranslations('Orders');
  const query = useApiQuery(['order', id], (signal) => ordersApi.get(id, { signal }));
  const order = query.data?.data;

  return (
    <div>
      <Button href="/account/orders" variant="ghost" size="sm" className="mb-4 -ms-3">
        <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
        {t('backToOrders')}
      </Button>
      {query.isInitialLoading ? (
        <LoadingState />
      ) : order ? (
        <OrderDetails order={order} />
      ) : [400, 404].includes(query.error?.status) ? (
        <EmptyState icon={PackageX} title={t('notFoundTitle')} description={t('notFoundDescription')} />
      ) : (
        <ErrorState error={query.error} onRetry={query.refetch} />
      )}
    </div>
  );
}

export function OrderDetailsPage({ id }) {
  return (
    <ProtectedRoute roles={[ROLES.USER]}>
      <OrderDetailsContent id={id} />
    </ProtectedRoute>
  );
}
