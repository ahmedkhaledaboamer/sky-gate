import { en } from './en';
import { ar } from './ar';
import { storeAr, storeArExtra } from './store.ar';
import { storeEn, storeEnExtra } from './store.en';

export const locales = ['en', 'ar'];
export const defaultLocale = 'en';
export const LOCALE_COOKIE = 'ds_locale';

function deepMerge(base, extra) {
  const out = { ...base };
  Object.entries(extra).forEach(([key, value]) => {
    out[key] =
      value && typeof value === 'object' && base[key] && typeof base[key] === 'object'
        ? deepMerge(base[key], value)
        : value;
  });
  return out;
}

// Marketing-site strings (en.js / ar.js) + store, account and dashboard strings.
export const messages = {
  en: deepMerge(deepMerge(en, storeEn), storeEnExtra),
  ar: deepMerge(deepMerge(ar, storeAr), storeArExtra),
};

export function isLocale(value) {
  return locales.includes(value);
}

export function getDirection(locale) {
  return locale === 'ar' ? 'rtl' : 'ltr';
}

/** Resolves `namespace.key` inside a messages object; falls back to the key path. */
export function lookupMessage(localeMessages, path) {
  let cur = localeMessages;
  for (const p of path.split('.')) {
    if (cur && typeof cur === 'object' && p in cur) {
      cur = cur[p];
    } else {
      return path; // fallback to key path if missing
    }
  }
  return typeof cur === 'string' ? cur : path;
}

/** Replaces `{name}` placeholders with values from `vars`. */
export function interpolate(message, vars) {
  if (!vars) return message;
  return message.replace(/\{(\w+)\}/g, (match, name) =>
    vars[name] === undefined ? match : String(vars[name])
  );
}

/** Non-hook translator, usable in Server Components and metadata. */
export function createTranslator(locale, namespace) {
  const localeMessages = messages[locale] ?? messages[defaultLocale];
  return (key, vars) =>
    interpolate(
      lookupMessage(localeMessages, namespace ? `${namespace}.${key}` : key),
      vars
    );
}
