import { BlogPage } from '@/components/pages/BlogPage';
import { getLocale } from '@/lib/getLocale';
import { createTranslator } from '@/messages';

export async function generateMetadata() {
  const t = createTranslator(await getLocale(), 'BlogPage');
  return {
    title: t('title'),
    description: t('description'),
    alternates: { canonical: '/blog' },
    openGraph: { title: t('title'), description: t('description') },
  };
}

export default function Page() {
  return <BlogPage />;
}
