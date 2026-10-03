import { WishlistPage } from '@/components/pages/WishlistPage';
import { getLocale } from '@/lib/getLocale';
import { createTranslator } from '@/messages';

export async function generateMetadata() {
  const t = createTranslator(await getLocale(), 'Wishlist');
  return { title: t('title'), robots: { index: false } };
}

export default function Page() {
  return <WishlistPage />;
}
