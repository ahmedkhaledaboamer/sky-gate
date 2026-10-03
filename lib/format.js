import { CURRENCY } from './constants';

const intlLocale = (locale) => (locale === 'ar' ? 'ar-EG' : 'en-US');

export function formatPrice(value, locale = 'en') {
  const amount = Number(value) || 0;
  try {
    return new Intl.NumberFormat(intlLocale(locale), {
      style: 'currency',
      currency: CURRENCY,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${CURRENCY}`;
  }
}

export function formatNumber(value, locale = 'en') {
  return new Intl.NumberFormat(intlLocale(locale)).format(Number(value) || 0);
}

export function formatDate(value, locale = 'en', withTime = false) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat(intlLocale(locale), {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
  }).format(date);
}

/** yyyy-mm-dd for <input type="date"> */
export function toDateInputValue(value) {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);
}

export const shortId = (id = '') => `#${String(id).slice(-6).toUpperCase()}`;
