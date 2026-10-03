import { Suspense } from 'react';
import { ProductsPage } from '@/components/pages/ProductsPage';
import { LoadingState } from '@/components/ui/States';
import { serverGet } from '@/lib/api/server';
import { readProductFilters, toProductQuery } from '@/lib/productQuery';
import { getLocale } from '@/lib/getLocale';
import { createTranslator } from '@/messages';

export async function generateMetadata() {
  const t = createTranslator(await getLocale(), 'Shop');
  return {
    title: t('title'),
    description: t('description'),
    alternates: { canonical: '/products' },
    openGraph: { title: t('title'), description: t('description') },
  };
}

// Filters, sorting and pagination live in the URL (?keyword=&category=&page=…).
// The first page of results is rendered on the server for those filters.
export default async function Page({ searchParams }) {
  const raw = await searchParams;
  const params = Object.fromEntries(
    Object.entries(raw).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value])
  );
  const query = toProductQuery(readProductFilters(params), Math.max(parseInt(params.page, 10) || 1, 1));
  const data = await serverGet('/products', query);
  return (
    <Suspense fallback={<LoadingState className="min-h-screen" />}>
      <ProductsPage initial={data ? { query, data } : undefined} />
    </Suspense>
  );
}
