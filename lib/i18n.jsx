'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  createContext,
  useContext,
} from 'react';
import { useRouter } from 'next/navigation';
import {
  messages,
  defaultLocale,
  getDirection,
  interpolate,
  isLocale,
  lookupMessage,
  LOCALE_COOKIE,
} from '@/messages';

const I18nContext = createContext(null);
const ONE_YEAR = 60 * 60 * 24 * 365;

export function LocaleProvider({ children, initialLocale = defaultLocale }) {
  const router = useRouter();
  const [locale, setLocaleState] = useState(initialLocale);

  // Apply lang + dir to <html> and persist the choice in a cookie so the
  // server renders the right language/direction on the next request.
  useEffect(() => {
    const html = document.documentElement;
    html.lang = locale;
    html.dir = getDirection(locale);
    document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${ONE_YEAR}; samesite=lax`;
  }, [locale]);

  const setLocale = useCallback(
    (next) => {
      if (!isLocale(next)) return;
      setLocaleState(next);
      document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${ONE_YEAR}; samesite=lax`;
      // Re-render Server Components (e.g. page metadata) in the new language.
      router.refresh();
    },
    [router]
  );

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      messages: messages[locale],
    }),
    [locale, setLocale]
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside <LocaleProvider>');
  return ctx;
}

/** next-intl compatible: returns the current locale string */
export function useLocale() {
  return useI18n().locale;
}

/** Setter — not part of next-intl, but useful for our LocaleSwitcher */
export function useSetLocale() {
  return useI18n().setLocale;
}

/** next-intl compatible: returns t(key, vars?) scoped to a namespace */
export function useTranslations(namespace) {
  const { messages: localeMessages } = useI18n();
  return useCallback(
    (key, vars) =>
      interpolate(
        lookupMessage(localeMessages, namespace ? `${namespace}.${key}` : key),
        vars
      ),
    [localeMessages, namespace]
  );
}
