'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { authApi, setUnauthorizedHandler, usersApi } from '@/lib/api';
import {
  clearSession,
  getServerSession,
  getSession,
  setSession,
  subscribe,
  updateSessionToken,
  updateSessionUser,
} from '@/lib/auth/session';
import { useIsClient } from '@/hooks/useIsClient';
import { ROLES, STAFF_ROLES } from '@/lib/constants';
import { useTranslations } from '@/lib/i18n';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

/** Where a user lands after login when no `next` URL is given. */
export function homeForRole(role) {
  return STAFF_ROLES.includes(role) ? '/dashboard' : '/';
}

export function AuthProvider({ children }) {
  const session = useSyncExternalStore(subscribe, getSession, getServerSession);
  const router = useRouter();
  const pathname = usePathname();
  const toast = useToast();
  const t = useTranslations('Auth');

  // A 401 on any authenticated request: clear the session and go to login.
  useEffect(() => {
    setUnauthorizedHandler(() => {
      if (!getSession().token) return;
      clearSession();
      toast.error(t('sessionExpired'));
      const next =
        pathname && !pathname.startsWith('/login')
          ? `?next=${encodeURIComponent(pathname)}`
          : '';
      router.replace(`/login${next}`);
    });
    return () => setUnauthorizedHandler(null);
  }, [router, pathname, toast, t]);

  // Refresh the stored user once per token (role / profile may have changed).
  // An invalid token answers 401, which the handler above turns into a logout.
  const token = session.token;
  useEffect(() => {
    if (!token) return;
    const controller = new AbortController();
    usersApi
      .getMe({ signal: controller.signal })
      .then((res) => res?.data && updateSessionUser(res.data))
      .catch(() => {});
    return () => controller.abort();
  }, [token]);

  const login = useCallback(async (credentials) => {
    const res = await authApi.login(credentials);
    setSession({ token: res.token, user: res.data });
    return res.data;
  }, []);

  const signup = useCallback(async (body) => {
    const res = await authApi.signup(body);
    setSession({ token: res.token, user: res.data });
    return res.data;
  }, []);

  /** resetPassword only returns a token: load the user that owns it. */
  const loginWithToken = useCallback(async (newToken) => {
    const me = await usersApi.getMe({
      headers: { Authorization: `Bearer ${newToken}` },
    });
    setSession({ token: newToken, user: me.data });
    return me.data;
  }, []);

  const logout = useCallback(
    (redirectTo = '/login') => {
      clearSession();
      if (redirectTo) router.replace(redirectTo);
    },
    [router]
  );

  const value = useMemo(() => {
    const user = session.user;
    const role = user?.role ?? null;
    return {
      isReady: session.ready,
      isAuthenticated: Boolean(session.token && user),
      token: session.token,
      user,
      role,
      isAdmin: role === ROLES.ADMIN,
      isManager: role === ROLES.MANAGER,
      isStaff: STAFF_ROLES.includes(role),
      isCustomer: role === ROLES.USER,
      login,
      signup,
      loginWithToken,
      logout,
      updateUser: updateSessionUser,
      updateToken: updateSessionToken,
    };
  }, [session, login, signup, loginWithToken, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

/**
 * Whether to show shopping actions (add to cart, wishlist heart).
 * Server-rendered product cards are built without a session, so while a card
 * hydrates (streamed sections hydrate after the session is known) it must
 * render the same guest view; it switches to the real one right after.
 */
export function useCanShop() {
  const { isAuthenticated, isCustomer } = useAuth();
  const hydrated = useIsClient();
  return !hydrated || !isAuthenticated || isCustomer;
}

/** Role-based permissions used to show / hide actions in the UI. */
export function usePermissions() {
  const { role } = useAuth();
  return useMemo(
    () => ({
      canAccessDashboard: STAFF_ROLES.includes(role),
      // every delete is admin-only, except reviews (admin + manager)
      canDelete: role === ROLES.ADMIN,
      canDeleteReviews: STAFF_ROLES.includes(role),
      // cart, wishlist, addresses and reviews are `user`-role endpoints
      canShop: role === ROLES.USER,
    }),
    [role]
  );
}
