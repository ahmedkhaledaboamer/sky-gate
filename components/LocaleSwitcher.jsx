import React from 'react';
import { Globe } from 'lucide-react';
import { useLocale, useSetLocale, useTranslations } from '../lib/i18n';
export function LocaleSwitcher() {
  const locale = useLocale();
  const setLocale = useSetLocale();
  const t = useTranslations('LocaleSwitcher');
  return (
    <div
      role="group"
      aria-label={t('label')}
      className="inline-flex items-center gap-1 bg-saudi-sand/70 backdrop-blur-sm border border-saudi-champagne/30 rounded-none p-1">
      
      <Globe className="w-4 h-4 text-saudi-midnight/60 mx-1.5 hidden sm:block" />
      <button
        onClick={() => setLocale('en')}
        aria-pressed={locale === 'en'}
        className={`px-3 py-1 rounded-none text-xs font-semibold transition-all ${locale === 'en' ? 'bg-saudi-champagne text-saudi-midnight' : 'text-saudi-midnight/70 hover:text-saudi-midnight'}`}>
        
        {t('en')}
      </button>
      <button
        onClick={() => setLocale('ar')}
        aria-pressed={locale === 'ar'}
        className={`px-3 py-1 rounded-none text-xs font-semibold transition-all ${locale === 'ar' ? 'bg-saudi-champagne text-saudi-midnight' : 'text-saudi-midnight/70 hover:text-saudi-midnight'}`}>
        
        {t('ar')}
      </button>
    </div>);

}