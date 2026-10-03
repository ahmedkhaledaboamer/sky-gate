'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, User } from 'lucide-react';
import { homeForRole, useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useForm } from '@/hooks/useForm';
import { PASSWORD_MIN } from '@/lib/constants';
import { useTranslations } from '@/lib/i18n';
import { rules, validate } from '@/lib/validation';
import { Button } from '@/components/ui/Button';
import { FormError, Input } from '@/components/ui/Field';
import { AuthCard } from './AuthCard';
import { PublicRoute, safeNext } from './Guards';
import { PasswordInput } from './PasswordInput';

function SignupFormInner() {
  const t = useTranslations('Auth');
  const { signup } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const next = safeNext(useSearchParams().get('next'));

  const form = useForm(
    { name: '', email: '', password: '', passwordConfirm: '' },
    (v) =>
      validate(v, {
        name: [rules.required(t('nameRequired')), rules.minLength(3, t('nameMin'))],
        email: [rules.required(t('emailRequired')), rules.email(t('emailInvalid'))],
        password: [
          rules.required(t('passwordRequired')),
          rules.password(t('passwordMin', { min: PASSWORD_MIN })),
        ],
        passwordConfirm: [
          rules.required(t('passwordConfirmRequired')),
          rules.matches('password', t('passwordMismatch')),
        ],
      })
  );

  const onSubmit = form.handleSubmit(async (values) => {
    const user = await signup({ ...values, name: values.name.trim(), email: values.email.trim() });
    toast.success(t('accountCreated'));
    router.replace(next ?? homeForRole(user?.role));
  });

  return (
    <AuthCard
      eyebrow={t('signupEyebrow')}
      title={t('signupTitle')}
      description={t('signupDescription')}
      footer={
        <>
          {t('haveAccount')}{' '}
          <Link
            href={next ? `/login?next=${encodeURIComponent(next)}` : '/login'}
            className="font-semibold text-teal-600 hover:text-teal-700"
          >
            {t('login')}
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <FormError message={form.formError} />
        <Input {...form.field('name')} label={t('name')} autoComplete="name" icon={User} required />
        <Input
          {...form.field('email')}
          label={t('email')}
          type="email"
          autoComplete="email"
          icon={Mail}
          placeholder="name@example.com"
          required
        />
        <PasswordInput
          {...form.field('password')}
          label={t('password')}
          autoComplete="new-password"
          hint={t('passwordMin', { min: PASSWORD_MIN })}
          required
        />
        <PasswordInput
          {...form.field('passwordConfirm')}
          label={t('passwordConfirm')}
          autoComplete="new-password"
          required
        />
        <Button type="submit" block size="lg" loading={form.isSubmitting}>
          {t('createAccount')}
        </Button>
      </form>
    </AuthCard>
  );
}

export function SignupForm() {
  return (
    <PublicRoute>
      <SignupFormInner />
    </PublicRoute>
  );
}
