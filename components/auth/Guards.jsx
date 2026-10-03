'use client';

import { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ShieldAlert } from 'lucide-react';
import { homeForRole, useAuth } from '@/context/AuthContext';
import { STAFF_ROLES } from '@/lib/constants';
import { useTranslations } from '@/lib/i18n';
import { Button } from '@/components/ui/Button';
import { EmptyState, LoadingState } from '@/components/ui/States';

// The token lives in localStorage, so guards run on the client. They control
// what the UI shows; the API enforces the real permissions on every request.

/** Only allows a relative in-app path for ?next= (prevents open redirects). */
export function safeNext(value) {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//')
    ? value
    : null;
}

/** Requires a logged-in user; optionally restricted to `roles`. */
export function ProtectedRoute({ roles, children, fallback }) {
  const { isReady, isAuthenticated, role } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('Auth');
  const allowed = !roles || roles.includes(role);

  useEffect(() => {
    if (isReady && !isAuthenticated) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [isReady, isAuthenticated, router, pathname]);

  if (!isReady || !isAuthenticated) {
    return fallback ?? <LoadingState className="min-h-[60vh]" />;
  }
  if (!allowed) {
    return (
      <EmptyState
        className="min-h-[60vh] py-20"
        icon={ShieldAlert}
        title={t('forbiddenTitle')}
        description={t('forbiddenDescription')}
        action={<Button href={homeForRole(role)}>{t('goBack')}</Button>}
      />
    );
  }
  return children;
}

/** Dashboard: admin and manager only. */
export function DashboardRoute({ children }) {
  return (
    <ProtectedRoute roles={STAFF_ROLES} fallback={<LoadingState className="min-h-screen" />}>
      {children}
    </ProtectedRoute>
  );
}

/** Login / signup / forgot password: redirect away when already logged in. */
export function PublicRoute({ children }) {
  const { isReady, isAuthenticated, role } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeNext(searchParams.get('next'));

  useEffect(() => {
    if (isReady && isAuthenticated) {
      router.replace(next ?? homeForRole(role));
    }
  }, [isReady, isAuthenticated, role, next, router]);

  if (!isReady || isAuthenticated) return <LoadingState className="min-h-[60vh]" />;
  return children;
}

/** Renders children only for the given roles (e.g. admin-only delete buttons). */
export function RoleGuard({ roles, children, fallback = null }) {
  const { role } = useAuth();
  return roles.includes(role) ? children : fallback;
}
