'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { usePermissions } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { couponsApi } from '@/lib/api';
import { formatDate, toDateInputValue } from '@/lib/format';
import { useLocale, useTranslations } from '@/lib/i18n';
import { rules, validate } from '@/lib/validation';
import { useDashboardList, useDeleteFlow } from '@/hooks/useDashboardList';
import { useForm } from '@/hooks/useForm';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { DataTable } from '@/components/ui/DataTable';
import { FormError, Input } from '@/components/ui/Field';
import { Modal } from '@/components/ui/Modal';
import { SearchInput } from '@/components/ui/SearchInput';
import { EmptyState, ErrorState } from '@/components/ui/States';
import { DashboardPageHeader, RowActions, TableFooter, Toolbar } from '../DashboardUI';

const isExpired = (expire) => new Date(expire).getTime() < Date.now();

function CouponForm({ coupon, onSaved, onCancel }) {
  const t = useTranslations('Dashboard');
  const toast = useToast();
  const isEdit = Boolean(coupon);
  const form = useForm(
    { name: coupon?.name ?? '', expire: toDateInputValue(coupon?.expire), discount: coupon?.discount ?? '' },
    (v) =>
      validate(v, {
        name: [rules.required(t('v.required'))],
        expire: [rules.required(t('v.required'))],
        discount: [rules.required(t('v.required')), rules.number(t('v.discountRange'), { min: 1, max: 100 })],
      })
  );

  const onSubmit = form.handleSubmit(async (v) => {
    // the API upper-cases the name; expire is an ISO date (yyyy-mm-dd)
    const body = { name: v.name.trim().toUpperCase(), expire: v.expire, discount: Number(v.discount) };
    if (isEdit) await couponsApi.update(coupon._id, body);
    else await couponsApi.create(body);
    toast.success(isEdit ? t('saved') : t('created'));
    onSaved();
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <FormError message={form.formError} />
      <Input
        {...form.field('name')}
        onChange={(e) => form.setValue('name', e.target.value.toUpperCase())}
        label={t('coupon.name')}
        placeholder="SUMMER20"
        required
      />
      <div className="grid sm:grid-cols-2 gap-5">
        <Input {...form.field('expire')} label={t('coupon.expire')} type="date" required />
        <Input {...form.field('discount')} label={t('coupon.discount')} type="number" min="1" max="100" hint={t('coupon.discountHint')} required />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="outline" onClick={onCancel} disabled={form.isSubmitting}>
          {t('cancel')}
        </Button>
        <Button type="submit" loading={form.isSubmitting}>
          {isEdit ? t('saveChanges') : t('create')}
        </Button>
      </div>
    </form>
  );
}

export function CouponsAdminPage() {
  const t = useTranslations('Dashboard');
  const locale = useLocale();
  const { canDelete } = usePermissions();
  const { query, list, page, keyword, setKeyword, setPage } = useDashboardList('admin-coupons', couponsApi.list);
  const [editing, setEditing] = useState(null);
  const del = useDeleteFlow(couponsApi.remove, () => query.refetch());

  return (
    <>
      <DashboardPageHeader
        title={t('nav.coupons')}
        description={t('couponsDescription')}
        actions={
          <Button onClick={() => setEditing({})}>
            <Plus className="w-4 h-4" />
            {t('addCoupon')}
          </Button>
        }
      />
      <Toolbar>
        <SearchInput value={keyword} onChange={setKeyword} placeholder={t('search')} className="sm:w-72" />
      </Toolbar>
      {query.error && !query.data ? (
        <ErrorState error={query.error} onRetry={query.refetch} />
      ) : (
        <DataTable
          isLoading={query.isLoading}
          rows={list.items}
          empty={<EmptyState title={t('noResults')} className="py-12" />}
          columns={[
            { key: 'name', header: t('coupon.name'), render: (c) => <code className="font-bold text-slate-900">{c.name}</code> },
            { key: 'discount', header: t('coupon.discount'), render: (c) => <Badge tone="teal">{c.discount}%</Badge> },
            { key: 'expire', header: t('coupon.expire'), render: (c) => formatDate(c.expire, locale) },
            {
              key: 'status',
              header: t('col.status'),
              render: (c) =>
                isExpired(c.expire) ? <Badge tone="danger">{t('coupon.expired')}</Badge> : <Badge tone="success">{t('coupon.active')}</Badge>,
            },
            { key: 'createdAt', header: t('col.created'), render: (c) => formatDate(c.createdAt, locale) },
            {
              key: 'actions',
              header: <span className="sr-only">{t('col.actions')}</span>,
              render: (c) => (
                <RowActions onEdit={() => setEditing(c)} onDelete={canDelete ? () => del.request(c) : undefined} />
              ),
            },
          ]}
        />
      )}
      <TableFooter list={list} page={page} onPageChange={setPage} />

      <Modal open={Boolean(editing)} onClose={() => setEditing(null)} title={editing?._id ? t('editCoupon') : t('addCoupon')}>
        {editing && (
          <CouponForm
            key={editing._id ?? 'new'}
            coupon={editing._id ? editing : null}
            onCancel={() => setEditing(null)}
            onSaved={() => {
              setEditing(null);
              query.refetch();
            }}
          />
        )}
      </Modal>
      <ConfirmModal {...del.modalProps} message={t('deleteMessage', { name: del.target?.name ?? '' })} />
    </>
  );
}
