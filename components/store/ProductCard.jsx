'use client';

import Link from 'next/link';
import { ArrowUpRight, ShoppingBag } from 'lucide-react';
import { useCanShop } from '@/context/AuthContext';
import { useCartActions, useCartPending } from '@/context/CartContext';
import { formatNumber } from '@/lib/format';
import { useLocale, useTranslations } from '@/lib/i18n';
import { discountPercent, isInStock, localized } from '@/lib/product';
import { Button } from '@/components/ui/Button';
import { RemoteImage } from '@/components/ui/RemoteImage';
import { Skeleton } from '@/components/ui/States';
import { StarRating } from '@/components/ui/StarRating';
import { PriceTag } from './PriceTag';
import { WishlistButton } from './WishlistButton';

export function ProductCard({ product, preload = false }) {
  const t = useTranslations('Shop');
  const locale = useLocale();
  const { addItem } = useCartActions();
  const adding = useCartPending(product._id);
  const href = `/products/${product._id}`;
  const title = localized(product, 'title', locale);
  const inStock = isInStock(product);
  const discount = discountPercent(product);
  const canShop = useCanShop();

  return (
    <article className="group relative flex flex-col h-full bg-white rounded-3xl overflow-hidden shadow-soft hover:shadow-cardHover transition-shadow duration-500">
      <Link href={href} className="relative block aspect-square overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
        <RemoteImage
          src={product.imageCover}
          alt={title}
          preload={preload}
          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className={`object-cover group-hover:scale-105 transition-transform duration-700 ease-out ${inStock ? '' : 'opacity-60 grayscale'}`}
        />
        <div className="absolute top-3 start-3 flex flex-col items-start gap-1.5">
          {discount > 0 && (
            <span className="px-2.5 py-1 rounded-full bg-terra-deep text-white text-[11px] font-bold">
              -{discount}%
            </span>
          )}
          {!inStock && (
            <span className="px-2.5 py-1 rounded-full bg-slate-900 text-white text-[11px] font-bold uppercase tracking-wider">
              {t('outOfStock')}
            </span>
          )}
        </div>
      </Link>

      {canShop && (
        <WishlistButton
          productId={product._id}
          className="absolute top-3 end-3 w-10 h-10 bg-white/95 backdrop-blur-sm shadow-soft"
        />
      )}

      <div className="flex flex-col flex-grow p-5">
        {product.category?.name && (
          <span className="text-[11px] font-semibold tracking-widest text-teal-600 uppercase mb-1.5">
            {localized(product.category, 'name', locale)}
          </span>
        )}
        <h3 className="font-serif text-xl font-bold text-slate-900 leading-snug line-clamp-2 mb-2">
          <Link href={href} className="hover:text-teal-600 transition-colors">
            {title}
          </Link>
        </h3>
        <div className="flex items-center justify-between gap-2 mb-4 text-xs text-slate-500">
          <StarRating value={product.ratingsAverage} count={product.ratingsQuantity ?? 0} size="w-3.5 h-3.5" />
          {product.sold > 0 && <span>{t('soldCount', { count: formatNumber(product.sold, locale) })}</span>}
        </div>
        <div className="mt-auto">
          <PriceTag product={product} />
          <div className="mt-4 flex items-center gap-2">
            {canShop ? (
              <Button
                size="sm"
                className="flex-1"
                disabled={!inStock}
                loading={adding}
                onClick={() => addItem(product._id)}
              >
                <ShoppingBag className="w-4 h-4" />
                {inStock ? t('addToCart') : t('outOfStock')}
              </Button>
            ) : null}
            <Button
              href={href}
              variant="outline"
              size={canShop ? 'iconSm' : 'sm'}
              className={canShop ? 'h-9 w-9 shrink-0' : 'flex-1'}
              aria-label={t('viewDetails')}
              title={t('viewDetails')}
            >
              {!canShop && t('viewDetails')}
              <ArrowUpRight className="w-4 h-4 rtl:-scale-x-100" />
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-soft">
      <Skeleton className="aspect-square rounded-none" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-9 w-full rounded-full" />
      </div>
    </div>
  );
}

/** `preloadCount`: how many of the first images are above the fold (LCP). */
export function ProductGrid({ products, isLoading, skeletonCount = 8, preloadCount = 0, className = 'grid grid-cols-1 min-[420px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6' }) {
  if (isLoading && !products?.length) {
    return (
      <div className={className}>
        {Array.from({ length: skeletonCount }, (_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }
  return (
    <div className={`${className} ${isLoading ? 'opacity-60 transition-opacity' : ''}`}>
      {products.map((product, i) => (
        <ProductCard key={product._id} product={product} preload={i < preloadCount} />
      ))}
    </div>
  );
}
