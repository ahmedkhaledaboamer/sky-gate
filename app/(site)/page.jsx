import { Suspense } from 'react';
import { Hero } from '@/components/Hero';
import { WhyChooseUs } from '@/components/WhyChooseUs';
import { AboutUs } from '@/components/AboutUs';
import { Banner } from '@/components/Banner';
import { Features } from '@/components/Features';
import { Blog } from '@/components/Blog';
import { Agents } from '@/components/Agents';
import { ContactUs } from '@/components/ContactUs';
import {
  BestSellers,
  FeaturedProducts,
  HomeBrands,
  HomeCategories,
  ProductsSectionSkeleton,
} from '@/components/home/HomeSections';
import { serverGet } from '@/lib/api/server';
import { BEST_SELLERS_QUERY, FEATURED_QUERY, NEWEST_QUERY } from '@/lib/homeQueries';

export const metadata = {
  alternates: { canonical: '/' },
};

// Product sections load on the server (cached) and stream in: the hero and the
// rest of the page are sent immediately, each section follows when its data is ready.
async function BestSellersSection() {
  const data = await serverGet('/products', BEST_SELLERS_QUERY);
  return <BestSellers initialData={data ?? undefined} />;
}

async function FeaturedSection() {
  const featured = await serverGet('/products', FEATURED_QUERY);
  const noFeatured = featured && (featured.data ?? []).length === 0;
  const newest = noFeatured ? await serverGet('/products', NEWEST_QUERY) : null;
  return <FeaturedProducts initialFeatured={featured ?? undefined} initialNewest={newest ?? undefined} />;
}

export default function Home() {
  return (
    <main>
      <Hero />
      <HomeCategories />
      <Suspense fallback={<ProductsSectionSkeleton />}>
        <BestSellersSection />
      </Suspense>
      <WhyChooseUs />
      <Suspense fallback={<ProductsSectionSkeleton />}>
        <FeaturedSection />
      </Suspense>
      <HomeBrands />
      <Banner />
      <AboutUs />
      <Features />
      <Blog />
      <Agents />
      <ContactUs />
    </main>
  );
}
