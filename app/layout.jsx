import '@/styles/globals.css';
import { AppProviders } from '@/context/AppProviders';
import { LocaleProvider } from '@/lib/i18n';
import { getLocale } from '@/lib/getLocale';
import { ogImage, SITE_NAME, SITE_URL } from '@/lib/site';
import { createTranslator, getDirection } from '@/messages';
import { fontVariables } from './fonts';

export async function generateMetadata() {
  const locale = await getLocale();
  const t = createTranslator(locale, 'Hero');
  const description = t('subtitle');
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: SITE_NAME,
      template: `%s | ${SITE_NAME}`,
    },
    description,
    applicationName: SITE_NAME,
    icons: {
      icon: '/images/logo2.png',
      apple: '/images/logo2.png',
    },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title: SITE_NAME,
      description,
      locale: locale === 'ar' ? 'ar_SA' : 'en_US',
      images: [ogImage('/images/care/banner16.png')],
    },
    twitter: {
      card: 'summary_large_image',
      title: SITE_NAME,
      description,
      images: [ogImage('/images/care/banner16.png')],
    },
  };
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#31859F',
};

export default async function RootLayout({ children }) {
  const locale = await getLocale();
  return (
    <html
      lang={locale}
      dir={getDirection(locale)}
      className={fontVariables}
      data-scroll-behavior="smooth"
    >
      <body>
        <LocaleProvider initialLocale={locale}>
          <AppProviders>
            <div className="min-h-screen bg-brand-cream font-sans selection:bg-brand-pinkDark selection:text-brand-dark">
              {children}
            </div>
          </AppProviders>
        </LocaleProvider>
      </body>
    </html>
  );
}
