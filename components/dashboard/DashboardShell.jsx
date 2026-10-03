'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  BadgeCheck,
  Bell,
  FolderTree,
  LayoutDashboard,
  LayoutGrid,
  LogOut,
  Menu,
  MessageSquareText,
  Package,
  ShoppingCart,
  Store,
  TicketPercent,
  Users,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTranslations } from '@/lib/i18n';
import { userImageUrl } from '@/lib/api/client';
import { DashboardRoute } from '@/components/auth/Guards';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { Drawer } from '@/components/ui/Drawer';
import { Thumb } from '@/components/ui/RemoteImage';

export const DASHBOARD_NAV = [
  { href: '/dashboard', key: 'overview', icon: LayoutDashboard },
  { href: '/dashboard/products', key: 'products', icon: Package },
  { href: '/dashboard/categories', key: 'categories', icon: LayoutGrid },
  { href: '/dashboard/subcategories', key: 'subcategories', icon: FolderTree },
  { href: '/dashboard/brands', key: 'brands', icon: BadgeCheck },
  { href: '/dashboard/coupons', key: 'coupons', icon: TicketPercent },
  { href: '/dashboard/users', key: 'users', icon: Users },
  { href: '/dashboard/orders', key: 'orders', icon: ShoppingCart },
  { href: '/dashboard/reviews', key: 'reviews', icon: MessageSquareText },
];

function NavLinks({ onNavigate }) {
  const t = useTranslations('Dashboard');
  const pathname = usePathname();
  const isActive = (href) => (href === '/dashboard' ? pathname === href : pathname.startsWith(href));
  return (
    <ul className="space-y-1">
      {DASHBOARD_NAV.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            onClick={onNavigate}
            aria-current={isActive(item.href) ? 'page' : undefined}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
              isActive(item.href) ? 'bg-teal-500 text-white shadow-soft' : 'text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <item.icon className="w-5 h-5" />
            {t(`nav.${item.key}`)}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function SidebarContent({ onNavigate }) {
  const t = useTranslations('Dashboard');
  return (
    <div className="flex flex-col h-full">
      <Link href="/dashboard" onClick={onNavigate} className="flex items-center gap-3 px-5 py-6">
        <Image src="/images/logo3.png" alt="" width={577} height={433} sizes="64px" className="w-16" />
        <span className="text-xs font-bold tracking-[0.2em] text-saudi-champagne uppercase">{t('panel')}</span>
      </Link>
      <nav aria-label={t('panel')} className="flex-1 overflow-y-auto px-3">
        <NavLinks onNavigate={onNavigate} />
      </nav>
      <div className="p-3 border-t border-white/10">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/10 hover:text-white"
        >
          <Store className="w-5 h-5" />
          {t('viewStore')}
        </Link>
      </div>
    </div>
  );
}

function DashboardHeader({ onOpenMenu }) {
  const t = useTranslations('Dashboard');
  const tRoles = useTranslations('Roles');
  const { user, role, logout } = useAuth();
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="flex items-center gap-3 h-16 px-4 sm:px-6">
        <button
          type="button"
          onClick={onOpenMenu}
          className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-100"
          aria-label={t('openMenu')}
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex-1" />
        <div className="hidden sm:block">
          <LocaleSwitcher />
        </div>
        {/* placeholder: the API has no notifications endpoint yet */}
        <button
          type="button"
          disabled
          title={t('notificationsSoon')}
          aria-label={t('notificationsSoon')}
          className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 cursor-not-allowed"
        >
          <Bell className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3 ps-3 border-s border-slate-200">
          {user?.profileImg ? (
            <Thumb src={userImageUrl(user.profileImg)} alt="" className="w-9 h-9 rounded-full" />
          ) : (
            <span className="w-9 h-9 rounded-full bg-teal-500 text-white font-bold flex items-center justify-center">
              {(user?.name ?? '?').charAt(0).toUpperCase()}
            </span>
          )}
          <div className="hidden md:block leading-tight">
            <p className="text-sm font-semibold text-slate-900 max-w-[160px] truncate">{user?.name}</p>
            <p className="text-xs text-teal-600 font-semibold uppercase tracking-wider">{tRoles(role)}</p>
          </div>
          <button
            type="button"
            onClick={() => logout('/login')}
            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:bg-red-50 hover:text-red-600"
            aria-label={t('logout')}
            title={t('logout')}
          >
            <LogOut className="w-5 h-5 rtl:rotate-180" />
          </button>
        </div>
      </div>
    </header>
  );
}

export function DashboardShell({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const t = useTranslations('Dashboard');
  return (
    <DashboardRoute>
      <div className="min-h-screen bg-slate-50">
        <aside className="hidden lg:block fixed inset-y-0 start-0 w-64 bg-slate-900 z-40">
          <SidebarContent />
        </aside>
        <Drawer open={menuOpen} onClose={() => setMenuOpen(false)} title={t('panel')} className="w-72 max-w-[86vw] !bg-slate-900 [&_h2]:text-white">
          <SidebarContent onNavigate={() => setMenuOpen(false)} />
        </Drawer>
        <div className="lg:ps-64">
          <DashboardHeader onOpenMenu={() => setMenuOpen(true)} />
          <main className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto">{children}</main>
        </div>
      </div>
    </DashboardRoute>
  );
}
