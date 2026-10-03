import 'server-only';
import { cookies } from 'next/headers';
import { defaultLocale, isLocale, LOCALE_COOKIE } from '@/messages';

/** Reads the visitor's locale from the cookie set by the LocaleSwitcher. */
export async function getLocale() {
  const cookieStore = await cookies();
  const value = cookieStore.get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : defaultLocale;
}
