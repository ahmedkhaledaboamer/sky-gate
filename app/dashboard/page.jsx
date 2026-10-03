import { OverviewPage } from '@/components/dashboard/pages/OverviewPage';
import { getLocale } from '@/lib/getLocale';
import { createTranslator } from '@/messages';

export async function generateMetadata() {
  const t = createTranslator(await getLocale(), 'Dashboard');
  return { title: t('overviewTitle') };
}

export default function Page() {
  return <OverviewPage />;
}
