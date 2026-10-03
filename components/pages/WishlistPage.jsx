'use client';

import { Heart } from 'lucide-react';
import { useWishlistIds } from '@/context/WishlistContext';
import { wishlistApi } from '@/lib/api';
import { ROLES } from '@/lib/constants';
import { useTranslations } from '@/lib/i18n';
import { useApiQuery } from '@/hooks/useApiQuery';
import { ProtectedRoute } from '@/components/auth/Guards';
import { Button } from '@/components/ui/Button';
import { EmptyState, ErrorState } from '@/components/ui/States';
import { PageHero } from '@/components/store/PageHero';
import { ProductGrid } from '@/components/store/ProductCard';

function WishlistContent() {
  const t = useTranslations('Wishlist');
  const ids = useWishlistIds();
  // full products come from GET /wishlist; removals update the shared id list
  const query = useApiQuery(['wishlist-products'], (signal) => wishlistApi.get({ signal }));
  const products = (query.data?.data ?? []).filter((p) => ids.has(p._id));

  return (
    <main className="pt-32 pb-24 bg-saudi-sand min-h-screen">
      <PageHero
        crumbs={[{ href: '/', label: t('home') }, { label: t('title') }]}
        eyebrow={t('eyebrow')}
        title={t('title')}
        description={t('description')}
      />
      <div className="container mx-auto px-4 sm:px-6 md:px-12 mt-12">
        {query.error && !query.data ? (
          <ErrorState error={query.error} onRetry={query.refetch} />
        ) : !query.isInitialLoading && products.length === 0 ? (
          <EmptyState
            icon={Heart}
            title={t('emptyTitle')}
            description={t('emptyDescription')}
            action={<Button href="/products">{t('browse')}</Button>}
          />
        ) : (
          <ProductGrid products={products} isLoading={query.isInitialLoading} skeletonCount={4} />
        )}
      </div>
    </main>
  );
}

export function WishlistPage() {
  return (
    <ProtectedRoute roles={[ROLES.USER]}>
      <WishlistContent />
    </ProtectedRoute>
  );
}
