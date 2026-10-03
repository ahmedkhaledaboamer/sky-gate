import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { NotFoundPage } from '@/components/pages/NotFoundPage';

export const metadata = {
  title: 'Page Not Found',
  robots: { index: false },
};

export default function NotFound() {
  return (
    <>
      <Header />
      <NotFoundPage />
      <Footer />
    </>
  );
}
