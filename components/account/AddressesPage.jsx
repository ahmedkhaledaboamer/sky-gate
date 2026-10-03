'use client';

import { useState } from 'react';
import { MapPin, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { addressesApi } from '@/lib/api';
import { ROLES } from '@/lib/constants';
import { useTranslations } from '@/lib/i18n';
import { useApiQuery } from '@/hooks/useApiQuery';
import { ProtectedRoute } from '@/components/auth/Guards';
import { Button } from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { Modal } from '@/components/ui/Modal';
import { EmptyState, ErrorState, Skeleton } from '@/components/ui/States';
import { AddressForm, AddressText } from '@/components/store/AddressForm';
import { AccountSection } from './AccountShell';

// The API has no "edit address" endpoint: delete and add a new one instead.
function AddressesContent() {
  const t = useTranslations('Address');
  const toast = useToast();
  const [adding, setAdding] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const query = useApiQuery(['addresses'], (signal) => addressesApi.list({ signal }));
  const list = query.data?.data ?? [];

  const add = async (values) => {
    const res = await addressesApi.add(values);
    query.setData(res);
    setAdding(false);
    toast.success(t('added'));
  };

  const remove = async () => {
    setDeleting(true);
    try {
      const res = await addressesApi.remove(toDelete._id);
      query.setData(res);
      toast.success(t('deleted'));
      setToDelete(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AccountSection
      title={t('title')}
      description={t('description')}
      action={
        list.length > 0 && (
          <Button size="sm" onClick={() => setAdding(true)}>
            <Plus className="w-4 h-4" />
            {t('add')}
          </Button>
        )
      }
    >
      {query.error && !query.data ? (
        <ErrorState error={query.error} onRetry={query.refetch} className="py-10" />
      ) : query.isInitialLoading ? (
        <div className="grid sm:grid-cols-2 gap-4">
          <Skeleton className="h-36 rounded-2xl" />
          <Skeleton className="h-36 rounded-2xl" />
        </div>
      ) : list.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title={t('emptyTitle')}
          description={t('emptyDescription')}
          action={
            <Button onClick={() => setAdding(true)}>
              <Plus className="w-4 h-4" />
              {t('add')}
            </Button>
          }
          className="py-10"
        />
      ) : (
        <ul className="grid sm:grid-cols-2 gap-4">
          {list.map((address) => (
            <li key={address._id} className="rounded-2xl border border-slate-200 p-5 text-sm flex flex-col gap-3">
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 font-semibold text-slate-900">
                  <MapPin className="w-4 h-4 text-teal-600" />
                  {address.alias || t('address')}
                </span>
                <Button
                  variant="dangerGhost"
                  size="iconSm"
                  onClick={() => setToDelete(address)}
                  aria-label={t('delete')}
                  title={t('delete')}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-0.5">
                <AddressText address={address} />
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal open={adding} onClose={() => setAdding(false)} title={t('add')} description={t('noEditNote')}>
        <AddressForm onSubmit={add} onCancel={() => setAdding(false)} />
      </Modal>
      <ConfirmModal
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={remove}
        loading={deleting}
        danger
        title={t('deleteTitle')}
        message={t('deleteMessage', { name: toDelete?.alias ?? '' })}
        confirmLabel={t('delete')}
      />
    </AccountSection>
  );
}

export function AddressesPage() {
  return (
    <ProtectedRoute roles={[ROLES.USER]}>
      <AddressesContent />
    </ProtectedRoute>
  );
}
