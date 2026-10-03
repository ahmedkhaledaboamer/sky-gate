'use client';

import Link from 'next/link';
import { useTranslations } from '@/lib/i18n';

/**
 * Page title block used across store pages (same style as the original
 * products page header). crumbs: [{ href?, label }]
 */
export function PageHero({ crumbs = [], eyebrow, title, description, children, compact = false }) {
  const t = useTranslations('Common');
  return (
    <section className={`relative border-b border-saudi-champagne/20 ${compact ? 'pb-8' : 'pb-12'}`}>
      <div className="container mx-auto px-4 sm:px-6 md:px-12">
        {crumbs.length > 0 && (
          <nav aria-label={t('breadcrumb')} className="text-sm text-saudi-ink/70 mb-6">
            <ol className="flex flex-wrap items-center gap-2">
              {crumbs.map((crumb, i) => (
                <li key={`${crumb.label}-${i}`} className="flex items-center gap-2">
                  {i > 0 && <span aria-hidden>/</span>}
                  {crumb.href ? (
                    <Link href={crumb.href} className="hover:text-saudi-champagne transition-colors">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className="text-saudi-midnight font-medium">
                      {crumb.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        {(title || eyebrow || description) && (
        <div className="max-w-3xl">
          {eyebrow && (
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="text-xs font-bold tracking-widest text-saudi-champagne uppercase">{eyebrow}</span>
              <div className="w-8 h-[1px] bg-saudi-champagne" />
            </div>
          )}
          <h1 className={`font-serif font-bold text-saudi-midnight leading-tight ${compact ? 'text-4xl md:text-5xl' : 'text-4xl md:text-6xl mb-4'}`}>
            {title}
          </h1>
          {description && (
            <p className="text-saudi-ink/80 text-lg max-w-2xl font-light leading-relaxed">{description}</p>
          )}
        </div>
        )}
        {children}
      </div>
    </section>
  );
}
