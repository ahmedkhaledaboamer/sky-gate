'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronDown,
  Heart,
  LayoutDashboard,
  LogOut,
  MapPin,
  Package,
  UserRound,
} from 'lucide-react';
import { ROLES, STAFF_ROLES } from '@/lib/constants';
import { useTranslations } from '@/lib/i18n';

/** Links shown in the account dropdown / mobile menu, per role. */
export function accountLinks(role) {
  const isStaff = STAFF_ROLES.includes(role);
  return [
    isStaff && { href: '/dashboard', key: 'dashboard', icon: LayoutDashboard },
    { href: '/account', key: 'profile', icon: UserRound },
    role === ROLES.USER && { href: '/account/orders', key: 'orders', icon: Package },
    role === ROLES.USER && { href: '/account/addresses', key: 'addresses', icon: MapPin },
    role === ROLES.USER && { href: '/wishlist', key: 'wishlist', icon: Heart },
  ].filter(Boolean);
}

export function AccountMenu({ user, role, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const t = useTranslations('Header');
  const tRoles = useTranslations('Roles');

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => !ref.current?.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const initial = (user?.name || '?').trim().charAt(0).toUpperCase();

  return (
    <div ref={ref} className="relative hidden sm:block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 h-10 ps-1 pe-3 rounded-full bg-white/80 border border-slate-200 hover:border-teal-500 transition-colors"
      >
        <span className="w-8 h-8 rounded-full bg-teal-500 text-white text-sm font-bold flex items-center justify-center">
          {initial}
        </span>
        <span className="hidden xl:block max-w-[110px] truncate text-sm font-semibold text-slate-800">
          {user?.name}
        </span>
        <ChevronDown className="w-4 h-4 text-slate-500" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute end-0 mt-2 w-64 bg-white rounded-2xl shadow-cardHover border border-slate-100 py-2 z-50"
          >
            <div className="px-4 py-3 border-b border-slate-100">
              <p className="font-semibold text-slate-900 truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              <span className="mt-2 inline-block rounded-full bg-teal-50 text-teal-700 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
                {tRoles(role)}
              </span>
            </div>
            {accountLinks(role).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-teal-600"
              >
                <item.icon className="w-4 h-4" />
                {t(item.key)}
              </Link>
            ))}
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onLogout();
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 border-t border-slate-100 mt-1"
            >
              <LogOut className="w-4 h-4 rtl:rotate-180" />
              {t('logout')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
