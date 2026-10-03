'use client';

import { useMemo } from 'react';
import { LayoutGrid } from 'lucide-react';
import { useTranslations } from '@/lib/i18n';
import { refId } from '@/lib/product';
import { useCategories, useSubcategories } from '@/hooks/useCatalogOptions';
import { EmptyState, ErrorState } from '@/components/ui/States';
import { CategoryTile, TileSkeletons } from '@/components/store/CatalogTiles';
import { PageHero } from '@/components/store/PageHero';

export function CategoriesPage({ initialSubcategories }) {
  const t = useTranslations('Catalog');
  const categories = useCategories();
  const subcategories = useSubcategories(undefined, initialSubcategories);

  // group subcategories under their category (one request for all of them)
  const byCategory = useMemo(() => {
    const map = {};
    (subcategories.data ?? []).forEach((sub) => {
      const id = refId(sub.category);
      (map[id] ??= []).push(sub);
    });
    return map;
  }, [subcategories.data]);

  return (
    <main className="pt-32 pb-24 bg-saudi-sand min-h-screen">
      <PageHero
        crumbs={[{ href: '/', label: t('home') }, { label: t('categoriesTitle') }]}
        eyebrow={t('categoriesEyebrow')}
        title={t('categoriesTitle')}
        description={t('categoriesDescription')}
      />
      <div className="container mx-auto px-4 sm:px-6 md:px-12 mt-12">
        {categories.error && !categories.data ? (
          <ErrorState error={categories.error} onRetry={categories.refetch} />
        ) : categories.isInitialLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            <TileSkeletons />
          </div>
        ) : categories.data.length === 0 ? (
          <EmptyState icon={LayoutGrid} title={t('noCategories')} />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {categories.data.map((category) => (
              <CategoryTile key={category._id} category={category} subcategories={byCategory[category._id]} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
