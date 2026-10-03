'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTranslations } from '@/lib/i18n';
import { ProtectedRoute } from '@/components/auth/Guards';
import { accountLinks } from '@/components/store/AccountMenu';

/** Customer area frame: side navigation (tabs on mobile) + content. */
export function AccountShell({ children }) {
  const t = useTranslations('Header');
  const tAccount = useTranslations('Account');
  const pathname = usePathname();
  const { user, role, logout } = useAuth();
  const links = accountLinks(role);
  const isActive = (href) => (href === '/account' ? pathname === href : pathname.startsWith(href));

  return (
    <ProtectedRoute>
      <main className="pt-32 pb-24 bg-saudi-sand min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 md:px-12">
          <div className="mb-8">
            <p className="text-xs font-bold tracking-widest text-saudi-champagne uppercase">{tAccount('eyebrow')}</p>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-saudi-midnight">
              {tAccount('greeting', { name: user?.name?.split(' ')[0] ?? '' })}
            </h1>
          </div>
          <div className="grid lg:grid-cols-[260px_1fr] gap-8 items-start">
            <nav aria-label={tAccount('navLabel')} className="lg:sticky lg:top-28">
              <ul className="flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 lg:bg-white lg:rounded-3xl lg:shadow-soft lg:border lg:border-slate-100 lg:p-3">
                {links.map((item) => (
                  <li key={item.href} className="shrink-0">
                    <Link
                      href={item.href}
                      aria-current={isActive(item.href) ? 'page' : undefined}
                      className={`flex items-center gap-3 rounded-full lg:rounded-2xl px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors ${
                        isActive(item.href)
                          ? 'bg-slate-900 text-white'
                          : 'bg-white lg:bg-transparent text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      {t(item.key)}
                    </Link>
                  </li>
                ))}
                <li className="shrink-0 lg:border-t lg:border-slate-100 lg:mt-1 lg:pt-1">
                  <button
                    type="button"
                    onClick={() => logout('/')}
                    className="w-full flex items-center gap-3 rounded-full lg:rounded-2xl px-4 py-2.5 text-sm font-semibold text-red-600 bg-white lg:bg-transparent hover:bg-red-50 whitespace-nowrap"
                  >
                    <LogOut className="w-4 h-4 rtl:rotate-180" />
                    {t('logout')}
                  </button>
                </li>
              </ul>
            </nav>
            <div className="min-w-0">{children}</div>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}

/** Card wrapper with title used on account pages. */
export function AccountSection({ title, description, action, children, className = '' }) {
  return (
    <section className={`bg-white rounded-3xl shadow-soft border border-slate-100 p-5 sm:p-8 ${className}`}>
      {(title || action) && (
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            {title && <h2 className="font-serif text-2xl md:text-3xl font-bold text-slate-900">{title}</h2>}
            {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
