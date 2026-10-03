'use client';

import { useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useTranslations } from '@/lib/i18n';

/**
 * Cart, wishlist, addresses and reviews are `user`-role endpoints.
 * Returns `ensureCustomer()`: true when the action may proceed; otherwise it
 * sends guests to login (and back) or explains why staff accounts can't shop.
 */
export function useCustomerGate() {
  const { isAuthenticated, isCustomer } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const toast = useToast();
  const t = useTranslations('Auth');

  return useCallback(() => {
    if (!isAuthenticated) {
      toast.info(t('loginRequired'));
      router.push(`/login?next=${encodeURIComponent(pathname || '/')}`);
      return false;
    }
    if (!isCustomer) {
      toast.info(t('customersOnly'));
      return false;
    }
    return true;
  }, [isAuthenticated, isCustomer, router, pathname, toast, t]);
}
