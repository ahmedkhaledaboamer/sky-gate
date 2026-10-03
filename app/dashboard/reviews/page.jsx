import { ReviewsAdminPage } from '@/components/dashboard/pages/ReviewsAdminPage';
import { getLocale } from '@/lib/getLocale';
import { createTranslator } from '@/messages';

export async function generateMetadata() {
  const t = createTranslator(await getLocale(), 'Dashboard');
  return { title: t('nav.reviews') };
}

export default function Page() {
  return <ReviewsAdminPage />;
}
