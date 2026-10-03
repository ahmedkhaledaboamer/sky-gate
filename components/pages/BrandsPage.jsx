'use client';

import { BadgeCheck } from 'lucide-react';
import { useTranslations } from '@/lib/i18n';
import { useBrands } from '@/hooks/useCatalogOptions';
import { EmptyState, ErrorState } from '@/components/ui/States';
import { BrandTile, TileSkeletons } from '@/components/store/CatalogTiles';
import { PageHero } from '@/components/store/PageHero';

export function BrandsPage() {
  const t = useTranslations('Catalog');
  const brands = useBrands();
  return (
    <main className="pt-32 pb-24 bg-saudi-sand min-h-screen">
      <PageHero
        crumbs={[{ href: '/', label: t('home') }, { label: t('brandsTitle') }]}
        eyebrow={t('brandsEyebrow')}
        title={t('brandsTitle')}
        description={t('brandsDescription')}
      />
      <div className="container mx-auto px-4 sm:px-6 md:px-12 mt-12">
        {brands.error && !brands.data ? (
          <ErrorState error={brands.error} onRetry={brands.refetch} />
        ) : brands.isInitialLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            <TileSkeletons count={10} className="aspect-square" />
          </div>
        ) : brands.data.length === 0 ? (
          <EmptyState icon={BadgeCheck} title={t('noBrands')} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {brands.data.map((brand) => (
              <BrandTile key={brand._id} brand={brand} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
