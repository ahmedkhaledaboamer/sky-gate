import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ScrollToTop } from '@/components/ScrollToTop';
import { CatalogProvider } from '@/context/CatalogContext';
import { serverGet } from '@/lib/api/server';
import { OPTIONS_LIMIT } from '@/lib/constants';

// Public website + customer area. The dashboard has its own layout.
// Categories / brands are fetched here once (cached) for the header, footer,
// filters and home sliders.
export default async function SiteLayout({ children }) {
  const options = { limit: OPTIONS_LIMIT, sort: 'name' };
  const [categories, brands] = await Promise.all([
    serverGet('/categories', options),
    serverGet('/brands', options),
  ]);
  return (
    <CatalogProvider categories={categories?.data} brands={brands?.data}>
      <Header />
      {children}
      <Footer />
      <ScrollToTop />
    </CatalogProvider>
  );
}
