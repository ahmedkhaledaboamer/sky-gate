'use client';

import { Building2, Hash, MapPin, Phone, Tag } from 'lucide-react';
import { useForm } from '@/hooks/useForm';
import { useTranslations } from '@/lib/i18n';
import { rules, validate } from '@/lib/validation';
import { Button } from '@/components/ui/Button';
import { FormError, Input, Textarea } from '@/components/ui/Field';

export const EMPTY_ADDRESS = { alias: '', details: '', phone: '', city: '', postalCode: '' };

/**
 * Address fields: alias, details, phone, city, postalCode.
 * `withAlias` adds the label used in the address book (Home, Work…).
 */
export function AddressForm({ initial = EMPTY_ADDRESS, withAlias = true, submitLabel, onSubmit, onCancel, extra }) {
  const t = useTranslations('Address');
  const form = useForm({ ...EMPTY_ADDRESS, ...initial }, (v) =>
    validate(v, {
      ...(withAlias ? { alias: [rules.required(t('aliasRequired'))] } : {}),
      details: [rules.required(t('detailsRequired')), rules.minLength(5, t('detailsMin'))],
      phone: [rules.required(t('phoneRequired')), rules.phone(t('phoneInvalid'))],
      city: [rules.required(t('cityRequired'))],
    })
  );

  const submit = form.handleSubmit(async (values) => {
    const clean = Object.fromEntries(
      Object.entries(values).map(([k, v]) => [k, String(v ?? '').trim()])
    );
    if (!withAlias) delete clean.alias;
    if (!clean.postalCode) delete clean.postalCode;
    await onSubmit(clean);
  });

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <FormError message={form.formError} />
      {withAlias && (
        <Input {...form.field('alias')} label={t('alias')} placeholder={t('aliasPlaceholder')} icon={Tag} required />
      )}
      <Textarea {...form.field('details')} label={t('details')} placeholder={t('detailsPlaceholder')} rows={2} required />
      <div className="grid sm:grid-cols-2 gap-4">
        <Input {...form.field('city')} label={t('city')} icon={Building2} autoComplete="address-level2" required />
        <Input {...form.field('postalCode')} label={t('postalCode')} icon={Hash} autoComplete="postal-code" />
      </div>
      <Input
        {...form.field('phone')}
        label={t('phone')}
        type="tel"
        icon={Phone}
        autoComplete="tel"
        placeholder="05XXXXXXXX"
        hint={t('phoneHint')}
        required
      />
      {extra}
      <div className="flex flex-wrap gap-3 pt-1">
        <Button type="submit" loading={form.isSubmitting}>
          <MapPin className="w-4 h-4" />
          {submitLabel ?? t('save')}
        </Button>
        {onCancel && (
          <Button variant="outline" onClick={onCancel} disabled={form.isSubmitting}>
            {t('cancel')}
          </Button>
        )}
      </div>
    </form>
  );
}

export function AddressText({ address }) {
  return (
    <>
      <span className="block text-slate-700">{address.details}</span>
      <span className="block text-slate-500">
        {[address.city, address.postalCode].filter(Boolean).join(' • ')}
      </span>
      <span className="block text-slate-500" dir="ltr">
        {address.phone}
      </span>
    </>
  );
}
