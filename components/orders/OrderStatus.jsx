'use client';

import { CheckCircle2, Circle, Clock, Package, Truck } from 'lucide-react';
import { formatDate } from '@/lib/format';
import { useLocale, useTranslations } from '@/lib/i18n';
import { Badge } from '@/components/ui/Badge';

export function PaidBadge({ order }) {
  const t = useTranslations('Orders');
  return order.isPaid ? <Badge tone="success">{t('paid')}</Badge> : <Badge tone="warning">{t('unpaid')}</Badge>;
}

export function DeliveredBadge({ order }) {
  const t = useTranslations('Orders');
  return order.isDelivered ? (
    <Badge tone="success">{t('delivered')}</Badge>
  ) : (
    <Badge tone="neutral">{t('notDelivered')}</Badge>
  );
}

export function PaymentMethod({ order }) {
  const t = useTranslations('Orders');
  return <span>{order.paymentMethodType === 'card' ? t('methodCard') : t('methodCash')}</span>;
}

/** Placed → Paid → Delivered progress. */
export function OrderTimeline({ order }) {
  const t = useTranslations('Orders');
  const locale = useLocale();
  const steps = [
    { key: 'placed', icon: Package, label: t('placed'), date: order.createdAt, done: true },
    { key: 'paid', icon: Clock, label: t('paid'), date: order.paidAt, done: order.isPaid },
    { key: 'delivered', icon: Truck, label: t('delivered'), date: order.deliveredAt, done: order.isDelivered },
  ];
  return (
    <ol className="grid grid-cols-3 gap-2">
      {steps.map((step, i) => (
        <li key={step.key} className="relative flex flex-col items-center text-center">
          {i > 0 && (
            <span
              aria-hidden
              className={`absolute top-5 end-1/2 w-full h-0.5 -z-0 ${step.done ? 'bg-teal-500' : 'bg-slate-200'}`}
            />
          )}
          <span
            className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center ${
              step.done ? 'bg-teal-500 text-white' : 'bg-slate-100 text-slate-400'
            }`}
          >
            {step.done ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
          </span>
          <span className={`mt-2 text-sm font-semibold ${step.done ? 'text-slate-900' : 'text-slate-400'}`}>{step.label}</span>
          <span className="text-xs text-slate-500">{step.done && step.date ? formatDate(step.date, locale) : '—'}</span>
        </li>
      ))}
    </ol>
  );
}
