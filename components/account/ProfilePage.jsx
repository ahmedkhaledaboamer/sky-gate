'use client';

import { useState } from 'react';
import { Mail, Phone, Trash2, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { usersApi } from '@/lib/api';
import { PASSWORD_MIN } from '@/lib/constants';
import { formatDate } from '@/lib/format';
import { useLocale, useTranslations } from '@/lib/i18n';
import { rules, validate } from '@/lib/validation';
import { useForm } from '@/hooks/useForm';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { Button } from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { FormError, Input } from '@/components/ui/Field';
import { AccountSection } from './AccountShell';

function PersonalInfoForm({ user }) {
  const t = useTranslations('Account');
  const tAuth = useTranslations('Auth');
  const toast = useToast();
  const { updateUser } = useAuth();
  const form = useForm({ name: user.name ?? '', email: user.email ?? '', phone: user.phone ?? '' }, (v) =>
    validate(v, {
      name: [rules.required(tAuth('nameRequired')), rules.minLength(3, tAuth('nameMin'))],
      email: [rules.required(tAuth('emailRequired')), rules.email(tAuth('emailInvalid'))],
      phone: [rules.phone(t('phoneInvalid'))],
    })
  );

  const onSubmit = form.handleSubmit(async (values) => {
    // Send only what changed. The email is included only when the user
    // actually edits it (older API versions rejected an unchanged email).
    const body = {};
    if (values.name.trim() !== user.name) body.name = values.name.trim();
    if (values.email.trim().toLowerCase() !== String(user.email).toLowerCase()) body.email = values.email.trim();
    if (values.phone.trim() !== (user.phone ?? '')) body.phone = values.phone.trim();
    if (!Object.keys(body).length) {
      toast.info(t('nothingChanged'));
      return;
    }
    const res = await usersApi.updateMe(body);
    updateUser(res.data);
    toast.success(t('profileUpdated'));
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <FormError message={form.formError} />
      <div className="grid sm:grid-cols-2 gap-5">
        <Input {...form.field('name')} label={t('name')} icon={User} autoComplete="name" required />
        <Input
          {...form.field('phone')}
          label={t('phone')}
          type="tel"
          icon={Phone}
          autoComplete="tel"
          hint={t('phoneHint')}
        />
      </div>
      <Input
        {...form.field('email')}
        label={t('email')}
        type="email"
        icon={Mail}
        autoComplete="email"
        hint={t('emailHint')}
        required
      />
      <Button type="submit" loading={form.isSubmitting}>
        {t('saveChanges')}
      </Button>
    </form>
  );
}

function ChangePasswordForm() {
  const t = useTranslations('Account');
  const tAuth = useTranslations('Auth');
  const toast = useToast();
  const { updateToken, updateUser } = useAuth();
  const form = useForm({ password: '', confirm: '' }, (v) =>
    validate(v, {
      password: [rules.required(tAuth('passwordRequired')), rules.password(tAuth('passwordMin', { min: PASSWORD_MIN }))],
      confirm: [rules.required(tAuth('passwordConfirmRequired')), rules.matches('password', tAuth('passwordMismatch'))],
    })
  );

  const onSubmit = form.handleSubmit(async ({ password }) => {
    const res = await usersApi.changeMyPassword(password);
    // the previous token stops working — store the new one
    if (res?.token) updateToken(res.token);
    if (res?.data) updateUser(res.data);
    form.reset({ password: '', confirm: '' });
    toast.success(t('passwordChanged'));
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <FormError message={form.formError} />
      <div className="grid sm:grid-cols-2 gap-5">
        <PasswordInput
          {...form.field('password')}
          label={tAuth('newPassword')}
          autoComplete="new-password"
          hint={tAuth('passwordMin', { min: PASSWORD_MIN })}
          required
        />
        <PasswordInput {...form.field('confirm')} label={tAuth('passwordConfirm')} autoComplete="new-password" required />
      </div>
      <Button type="submit" loading={form.isSubmitting}>
        {t('changePassword')}
      </Button>
    </form>
  );
}

function DeleteAccount() {
  const t = useTranslations('Account');
  const toast = useToast();
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const confirm = async () => {
    setLoading(true);
    try {
      await usersApi.deleteMe();
      toast.success(t('accountDeleted'));
      logout('/');
    } catch (err) {
      toast.error(err.message);
      setLoading(false);
    }
  };

  return (
    <>
      <p className="text-sm text-slate-600 mb-4">{t('deleteDescription')}</p>
      <Button variant="danger" onClick={() => setOpen(true)}>
        <Trash2 className="w-4 h-4" />
        {t('deleteAccount')}
      </Button>
      <ConfirmModal
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={confirm}
        loading={loading}
        danger
        title={t('deleteConfirmTitle')}
        message={t('deleteConfirmMessage')}
        confirmLabel={t('deleteAccount')}
      />
    </>
  );
}

export function ProfilePage() {
  const t = useTranslations('Account');
  const tRoles = useTranslations('Roles');
  const locale = useLocale();
  const { user, role } = useAuth();
  if (!user) return null;
  return (
    <div className="space-y-6">
      <AccountSection
        title={t('personalInfo')}
        description={t('memberSince', { date: formatDate(user.createdAt, locale) })}
        action={<span className="rounded-full bg-teal-50 text-teal-700 text-xs font-bold uppercase tracking-wider px-3 py-1">{tRoles(role)}</span>}
      >
        {/* key: refill the form if the stored user is refreshed */}
        <PersonalInfoForm key={`${user._id}-${user.updatedAt ?? ''}`} user={user} />
      </AccountSection>
      <AccountSection title={t('passwordTitle')} description={t('passwordDescription')}>
        <ChangePasswordForm />
      </AccountSection>
      <AccountSection title={t('dangerZone')} className="border-red-100">
        <DeleteAccount />
      </AccountSection>
    </div>
  );
}
