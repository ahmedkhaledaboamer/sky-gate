'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { productsApi } from '@/lib/api';
import { BEST_SELLERS_QUERY, FEATURED_QUERY, NEWEST_QUERY } from '@/lib/homeQueries';
import { useTranslations } from '@/lib/i18n';
import { useApiQuery } from '@/hooks/useApiQuery';
import { useBrands, useCategories } from '@/hooks/useCatalogOptions';
import { Marquee } from '@/components/ui/Marquee';
import { ErrorState, Skeleton } from '@/components/ui/States';
import { BrandTile, CategoryTile } from '@/components/store/CatalogTiles';
import { ProductGrid } from '@/components/store/ProductCard';



/** Section heading in the style of the original "Featured Products" block. */
function SectionHeader({ eyebrow, title, description, href, cta }) {
  return (
    <div className="flex flex-col md:flex-row justify-between md:items-end mb-12 gap-6">
      <div className="max-w-2xl">
        <span className="inline-block text-xs font-semibold tracking-[0.2em] text-teal-600 uppercase mb-4">
          {eyebrow}
        </span>
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 mb-4 leading-tight">{title}</h2>
        {description && <p className="text-slate-600 text-lg leading-relaxed">{description}</p>}
      </div>
      {href && (
        <Link
          href={href}
          className="inline-flex self-start md:self-auto items-center gap-2 px-6 py-3 rounded-full bg-white border border-slate-200 text-slate-900 font-medium text-sm hover:border-teal-500 hover:text-teal-600 transition-all shadow-soft hover:shadow-card shrink-0"
        >
          {cta}
          <ArrowRight className="w-4 h-4 rtl:rotate-180" />
        </Link>
      )}
    </div>
  );
}

/** One row of placeholders shaped like the slider items. */
function SliderSkeleton({ className }) {
  return (
    <div className="flex gap-4 sm:gap-6 overflow-hidden py-2">
      {Array.from({ length: 6 }, (_, i) => (
        <Skeleton key={i} className={`shrink-0 rounded-3xl ${className}`} />
      ))}
    </div>
  );
}

function Reveal({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function ProductsSection({ id, eyebrow, title, description, href, cta, query, className = 'bg-saudi-sand' }) {
  const items = query.data?.data ?? [];
  if (!query.isInitialLoading && !query.error && items.length === 0) return null;
  return (
    <section id={id} className={`py-24 relative ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 md:px-12">
        <SectionHeader eyebrow={eyebrow} title={title} description={description} href={href} cta={cta} />
        <Reveal>
          {query.error && !query.data ? (
            <ErrorState error={query.error} onRetry={query.refetch} />
          ) : (
            <ProductGrid products={items} isLoading={query.isInitialLoading} skeletonCount={4} />
          )}
        </Reveal>
      </div>
    </section>
  );
}

/** Placeholder shown while a product section streams in from the server. */
export function ProductsSectionSkeleton() {
  return (
    <section className="py-24 bg-saudi-sand" aria-busy="true">
      <div className="container mx-auto px-4 sm:px-6 md:px-12">
        <Skeleton className="h-4 w-32 mb-4" />
        <Skeleton className="h-12 w-72 mb-12" />
        <ProductGrid products={[]} isLoading skeletonCount={4} />
      </div>
    </section>
  );
}

export function BestSellers({ initialData }) {
  const t = useTranslations('Home');
  const query = useApiQuery(
    ['home', 'best-sellers'],
    (signal) => productsApi.list(BEST_SELLERS_QUERY, { signal }),
    { initialData }
  );
  return (
    <ProductsSection
      id="products"
      eyebrow={t('bestEyebrow')}
      title={t('bestTitle')}
      description={t('bestDescription')}
      href="/products?sort=-sold"
      cta={t('viewAll')}
      query={query}
    />
  );
}

/** Products flagged `featured`; falls back to the newest products. */
export function FeaturedProducts({ initialFeatured, initialNewest }) {
  const t = useTranslations('Home');
  const featured = useApiQuery(
    ['home', 'featured'],
    (signal) => productsApi.list(FEATURED_QUERY, { signal }),
    { initialData: initialFeatured }
  );
  const noFeatured = featured.data && (featured.data.data ?? []).length === 0;
  const newest = useApiQuery(
    noFeatured ? ['home', 'newest'] : null,
    (signal) => productsApi.list(NEWEST_QUERY, { signal }),
    { initialData: initialNewest }
  );
  const query = noFeatured ? newest : featured;
  return (
    <ProductsSection
      id="featured"
      eyebrow={noFeatured ? t('newEyebrow') : t('featuredEyebrow')}
      title={noFeatured ? t('newTitle') : t('featuredTitle')}
      description={t('featuredDescription')}
      href="/products"
      cta={t('viewAll')}
      query={query}
      className="bg-white"
    />
  );
}

export function HomeCategories() {
  const t = useTranslations('Home');
  const query = useCategories();
  const items = query.data ?? [];
  if (!query.isInitialLoading && !query.error && items.length === 0) return null;
  return (
    <section id="categories" className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 md:px-12">
        <SectionHeader
          eyebrow={t('categoriesEyebrow')}
          title={t('categoriesTitle')}
          description={t('categoriesDescription')}
          href="/categories"
          cta={t('allCategories')}
        />
        <Reveal>
          {query.error && !query.data ? (
            <ErrorState error={query.error} onRetry={query.refetch} />
          ) : query.isInitialLoading ? (
            <SliderSkeleton className="w-56 sm:w-64 h-60 sm:h-64" />
          ) : (
            <Marquee label={t('categoriesTitle')} speed={5}>
              {items.map((category) => (
                <div key={category._id} className="w-56 sm:w-64">
                  <CategoryTile category={category} />
                </div>
              ))}
            </Marquee>
          )}
        </Reveal>
      </div>
    </section>
  );
}

export function HomeBrands() {
  const t = useTranslations('Home');
  const query = useBrands();
  const items = query.data ?? [];
  if (!query.isInitialLoading && !query.error && items.length === 0) return null;
  return (
    <section id="brands" className="py-24 bg-saudi-sand-deep">
      <div className="container mx-auto px-4 sm:px-6 md:px-12">
        <SectionHeader
          eyebrow={t('brandsEyebrow')}
          title={t('brandsTitle')}
          description={t('brandsDescription')}
          href="/brands"
          cta={t('allBrands')}
        />
        <Reveal>
          {query.error && !query.data ? (
            <ErrorState error={query.error} onRetry={query.refetch} />
          ) : query.isInitialLoading ? (
            <SliderSkeleton className="w-40 sm:w-48 aspect-square" />
          ) : (
            <Marquee label={t('brandsTitle')} speed={3.5}>
              {items.map((brand) => (
                <div key={brand._id} className="w-40 sm:w-48">
                  <BrandTile brand={brand} />
                </div>
              ))}
            </Marquee>
          )}
        </Reveal>
      </div>
    </section>
  );
}
