'use client';

import { AlertTriangle } from 'lucide-react';
import { useTranslations } from '@/lib/i18n';
import { Button } from './Button';
import { Modal } from './Modal';

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel,
  danger = false,
  loading = false,
}) {
  const t = useTranslations('Common');
  return (
    <Modal
      open={open}
      onClose={loading ? undefined : onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            {t('cancel')}
          </Button>
          <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm} loading={loading}>
            {confirmLabel ?? t('confirm')}
          </Button>
        </>
      }
    >
      <div className="flex gap-4">
        {danger && (
          <div className="shrink-0 w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        )}
        <p className="text-slate-600 leading-relaxed">{message}</p>
      </div>
    </Modal>
  );
}
