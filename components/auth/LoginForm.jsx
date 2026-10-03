'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail } from 'lucide-react';
import { homeForRole, useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useForm } from '@/hooks/useForm';
import { useTranslations } from '@/lib/i18n';
import { rules, validate } from '@/lib/validation';
import { Button } from '@/components/ui/Button';
import { FormError, Input } from '@/components/ui/Field';
import { AuthCard } from './AuthCard';
import { PublicRoute, safeNext } from './Guards';
import { PasswordInput } from './PasswordInput';

function LoginFormInner() {
  const t = useTranslations('Auth');
  const { login } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const next = safeNext(useSearchParams().get('next'));

  const form = useForm({ email: '', password: '' }, (v) =>
    validate(v, {
      email: [rules.required(t('emailRequired')), rules.email(t('emailInvalid'))],
      password: [rules.required(t('passwordRequired'))],
    })
  );

  const onSubmit = form.handleSubmit(async ({ email, password }) => {
    const user = await login({ email: email.trim(), password });
    toast.success(t('welcomeBack', { name: user?.name ?? '' }));
    // staff land on the dashboard, customers go back where they were
    router.replace(next ?? homeForRole(user?.role));
  });

  return (
    <AuthCard
      eyebrow={t('loginEyebrow')}
      title={t('loginTitle')}
      description={t('loginDescription')}
      footer={
        <>
          {t('noAccount')}{' '}
          <Link
            href={next ? `/signup?next=${encodeURIComponent(next)}` : '/signup'}
            className="font-semibold text-teal-600 hover:text-teal-700"
          >
            {t('createAccount')}
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <FormError message={form.formError} />
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
          autoComplete="current-password"
          required
        />
        <div className="flex justify-end">
          <Link href="/forgot-password" className="text-sm font-semibold text-teal-600 hover:text-teal-700">
            {t('forgotPassword')}
          </Link>
        </div>
        <Button type="submit" block size="lg" loading={form.isSubmitting}>
          {t('login')}
        </Button>
      </form>
    </AuthCard>
  );
}

export function LoginForm() {
  return (
    <PublicRoute>
      <LoginFormInner />
    </PublicRoute>
  );
}
