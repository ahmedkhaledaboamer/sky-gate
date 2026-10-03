'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, KeyRound, Mail } from 'lucide-react';
import { homeForRole, useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useForm } from '@/hooks/useForm';
import { authApi } from '@/lib/api';
import { PASSWORD_MIN, STORAGE_KEYS } from '@/lib/constants';
import { useTranslations } from '@/lib/i18n';
import { rules, validate } from '@/lib/validation';
import { Button } from '@/components/ui/Button';
import { FormError, Input } from '@/components/ui/Field';
import { AuthCard } from './AuthCard';
import { PublicRoute } from './Guards';
import { PasswordInput } from './PasswordInput';

const STEPS = ['email', 'code', 'password'];

// The email from step 1 is needed again in step 3 — keep it for this tab.
const readEmail = () => {
  try {
    return sessionStorage.getItem(STORAGE_KEYS.resetEmail) ?? '';
  } catch {
    return '';
  }
};
const writeEmail = (email) => {
  try {
    if (email) sessionStorage.setItem(STORAGE_KEYS.resetEmail, email);
    else sessionStorage.removeItem(STORAGE_KEYS.resetEmail);
  } catch {
    // ignore
  }
};

function StepIndicator({ step }) {
  const tCommon = useTranslations('Common');
  const index = STEPS.indexOf(step);
  return (
    <ol className="flex items-center justify-center gap-2 mb-8" aria-label={tCommon('progress')}>
      {STEPS.map((s, i) => (
        <li
          key={s}
          aria-current={i === index ? 'step' : undefined}
          className={`h-1.5 rounded-full transition-all ${i <= index ? 'bg-teal-500 w-10' : 'bg-slate-200 w-6'}`}
        />
      ))}
    </ol>
  );
}

function EmailStep({ initialEmail, onDone }) {
  const t = useTranslations('Auth');
  const form = useForm({ email: initialEmail }, (v) =>
    validate(v, { email: [rules.required(t('emailRequired')), rules.email(t('emailInvalid'))] })
  );
  const onSubmit = form.handleSubmit(async ({ email }) => {
    await authApi.forgotPassword(email.trim());
    onDone(email.trim());
  });
  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <FormError message={form.formError} />
      <Input {...form.field('email')} label={t('email')} type="email" autoComplete="email" icon={Mail} required />
      <Button type="submit" block size="lg" loading={form.isSubmitting}>
        {t('sendCode')}
      </Button>
    </form>
  );
}

function CodeStep({ email, onDone, onResend }) {
  const t = useTranslations('Auth');
  const toast = useToast();
  const [resending, setResending] = useState(false);
  const form = useForm({ resetCode: '' }, (v) =>
    validate(v, {
      resetCode: [
        rules.required(t('codeRequired')),
        rules.custom((c) => /^\d{6}$/.test(String(c).trim()), t('codeInvalid')),
      ],
    })
  );
  const onSubmit = form.handleSubmit(async ({ resetCode }) => {
    await authApi.verifyResetCode(resetCode.trim());
    onDone();
  });
  const resend = async () => {
    setResending(true);
    try {
      await onResend();
      toast.success(t('codeResent'));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setResending(false);
    }
  };
  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <p className="text-sm text-slate-600 text-center">
        {t('codeSentTo')} <strong className="text-slate-900">{email}</strong>
      </p>
      <FormError message={form.formError} />
      <Input
        {...form.field('resetCode')}
        label={t('resetCode')}
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={6}
        icon={KeyRound}
        placeholder="123456"
        className="[&_input]:tracking-[0.4em] [&_input]:font-semibold"
        required
      />
      <Button type="submit" block size="lg" loading={form.isSubmitting}>
        {t('verifyCode')}
      </Button>
      <button
        type="button"
        onClick={resend}
        disabled={resending}
        className="w-full text-sm font-semibold text-teal-600 hover:text-teal-700 disabled:opacity-50"
      >
        {t('resendCode')}
      </button>
    </form>
  );
}

function PasswordStep({ email, onDone }) {
  const t = useTranslations('Auth');
  const form = useForm({ newPassword: '', confirm: '' }, (v) =>
    validate(v, {
      newPassword: [
        rules.required(t('passwordRequired')),
        rules.password(t('passwordMin', { min: PASSWORD_MIN })),
      ],
      confirm: [rules.required(t('passwordConfirmRequired')), rules.matches('newPassword', t('passwordMismatch'))],
    })
  );
  const onSubmit = form.handleSubmit(async ({ newPassword }) => {
    const res = await authApi.resetPassword(email, newPassword);
    await onDone(res.token);
  });
  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <FormError message={form.formError} />
      <PasswordInput
        {...form.field('newPassword')}
        label={t('newPassword')}
        autoComplete="new-password"
        hint={t('passwordMin', { min: PASSWORD_MIN })}
        required
      />
      <PasswordInput {...form.field('confirm')} label={t('passwordConfirm')} autoComplete="new-password" required />
      <Button type="submit" block size="lg" loading={form.isSubmitting}>
        {t('resetPassword')}
      </Button>
    </form>
  );
}

function ForgotPasswordInner() {
  const t = useTranslations('Auth');
  const toast = useToast();
  const router = useRouter();
  const { loginWithToken } = useAuth();
  const [email, setEmail] = useState(readEmail);
  const [step, setStep] = useState('email');

  const titles = {
    email: [t('forgotTitle'), t('forgotDescription')],
    code: [t('verifyTitle'), t('verifyDescription')],
    password: [t('newPasswordTitle'), t('newPasswordDescription')],
  };

  const finish = async (token) => {
    writeEmail('');
    // resetPassword returns a token: the user is logged in
    const user = await loginWithToken(token);
    toast.success(t('passwordResetDone'));
    router.replace(homeForRole(user?.role));
  };

  return (
    <AuthCard
      eyebrow={t('forgotEyebrow')}
      title={titles[step][0]}
      description={titles[step][1]}
      footer={
        <Link href="/login" className="inline-flex items-center gap-2 font-semibold text-teal-600 hover:text-teal-700">
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          {t('backToLogin')}
        </Link>
      }
    >
      <StepIndicator step={step} />
      {step === 'email' && (
        <EmailStep
          initialEmail={email}
          onDone={(value) => {
            setEmail(value);
            writeEmail(value);
            setStep('code');
          }}
        />
      )}
      {step === 'code' && (
        <CodeStep
          email={email}
          onDone={() => setStep('password')}
          onResend={() => authApi.forgotPassword(email)}
        />
      )}
      {step === 'password' && <PasswordStep email={email} onDone={finish} />}
      {step !== 'email' && (
        <button
          type="button"
          onClick={() => setStep('email')}
          className="mt-4 w-full text-sm text-slate-500 hover:text-slate-800"
        >
          {t('changeEmail')}
        </button>
      )}
    </AuthCard>
  );
}

export function ForgotPasswordFlow() {
  return (
    <PublicRoute>
      <ForgotPasswordInner />
    </PublicRoute>
  );
}
