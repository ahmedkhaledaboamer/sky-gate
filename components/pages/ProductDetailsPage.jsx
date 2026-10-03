'use client';

import Link from 'next/link';
import { useState } from 'react';
import { BookOpen, Beaker, Check, Package, PackageX, ShoppingBag, Truck } from 'lucide-react';
import { useCanShop } from '@/context/AuthContext';
import { useCartActions, useCartPending } from '@/context/CartContext';
import { brandsApi, productsApi } from '@/lib/api';
import { PRODUCT_CARD_FIELDS } from '@/lib/constants';
import { formatNumber } from '@/lib/format';
import { useLocale, useTranslations } from '@/lib/i18n';
import { discountPercent, isInStock, localized, refId } from '@/lib/product';
import { useApiQuery } from '@/hooks/useApiQuery';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState, ErrorState, Skeleton } from '@/components/ui/States';
import { StarRating } from '@/components/ui/StarRating';
import { PageHero } from '@/components/store/PageHero';
import { PriceTag } from '@/components/store/PriceTag';
import { ProductGallery } from '@/components/store/ProductGallery';
import { ProductGrid } from '@/components/store/ProductCard';
import { ProductReviews } from '@/components/store/ProductReviews';
import { QuantityStepper } from '@/components/store/QuantityStepper';
import { WishlistButton } from '@/components/store/WishlistButton';

function DetailsSkeleton() {
  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-12 grid lg:grid-cols-2 gap-10">
      <Skeleton className="aspect-square rounded-3xl" />
      <div className="space-y-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-12 w-full rounded-full" />
      </div>
    </div>
  );
}

/** Bilingual extra details ({ en, ar } items) the API may return. */
function InfoList({ icon: Icon, title, items, locale, chips = false }) {
  const values = (items ?? []).map((i) => i?.[locale] || i?.en).filter(Boolean);
  if (!values.length) return null;
  return (
    <div>
      <h3 className="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase mb-3 flex items-center gap-2 pb-2 border-b border-slate-100">
        <Icon className="w-4 h-4 text-teal-500" /> {title}
      </h3>
      {chips ? (
        <div className="flex flex-wrap gap-2">
          {values.map((v) => (
            <span key={v} className="px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium">
              {v}
            </span>
          ))}
        </div>
      ) : (
        <ul className="space-y-2">
          {values.map((v) => (
            <li key={v} className="flex items-start gap-2 text-sm text-slate-700">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
              {v}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function RelatedProducts({ product }) {
  const t = useTranslations('ProductDetails');
  const categoryId = refId(product.category);
  const query = useApiQuery(categoryId ? ['related', categoryId] : null, (signal) =>
    productsApi.list({ category: categoryId, limit: 5, sort: '-sold', field: PRODUCT_CARD_FIELDS }, { signal })
  );
  const items = (query.data?.data ?? []).filter((p) => p._id !== product._id).slice(0, 4);
  if (!query.isInitialLoading && items.length === 0) return null;
  return (
    <section className="container mx-auto px-4 sm:px-6 md:px-12 mt-20">
      <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 mb-8">{t('related')}</h2>
      <ProductGrid products={items} isLoading={query.isInitialLoading} skeletonCount={4} />
    </section>
  );
}

export function ProductDetailsPage({ id, initialProduct, initialBrand }) {
  const t = useTranslations('ProductDetails');
  const tShop = useTranslations('Shop');
  const locale = useLocale();
  const canShop = useCanShop();
  const { addItem } = useCartActions();
  const adding = useCartPending(id);
  const [color, setColor] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const query = useApiQuery(['product', id], (signal) => productsApi.get(id, { signal }), {
    initialData: initialProduct,
  });
  const product = query.data?.data;
  const brandId = refId(product?.brand);
  const brand = useApiQuery(
    brandId && typeof product?.brand !== 'object' ? ['brand', brandId] : null,
    (signal) => brandsApi.get(brandId, { signal }),
    { initialData: initialBrand }
  );
  const brandData = typeof product?.brand === 'object' ? product.brand : brand.data?.data;

  if (query.isInitialLoading) {
    return (
      <main className="pt-32 pb-24 bg-saudi-sand min-h-screen">
        <DetailsSkeleton />
      </main>
    );
  }

  if (!product) {
    const notFound = query.error?.status === 404 || query.error?.status === 400;
    return (
      <main className="pt-32 pb-24 bg-saudi-sand min-h-screen">
        {notFound ? (
          <EmptyState
            icon={PackageX}
            title={t('notFoundTitle')}
            description={t('notFoundDescription')}
            action={<Button href="/products">{t('backToShop')}</Button>}
          />
        ) : (
          <ErrorState error={query.error} onRetry={query.refetch} />
        )}
      </main>
    );
  }

  const title = localized(product, 'title', locale);
  const description = localized(product, 'description', locale);
  const inStock = isInStock(product);
  const discount = discountPercent(product);
  const colors = product.colors ?? [];
  const selectedColor = color ?? colors[0] ?? null;
  const categoryId = refId(product.category);
  const directions = product.directions?.[locale] || product.directions?.en;

  return (
    <main className="pt-32 pb-24 bg-saudi-sand min-h-screen">
      <PageHero
        compact
        crumbs={[
          { href: '/', label: tShop('breadcrumbHome') },
          { href: '/products', label: tShop('breadcrumbProducts') },
          ...(categoryId
            ? [{ href: `/products?category=${categoryId}`, label: localized(product.category, 'name', locale) }]
            : []),
          { label: title },
        ]}
        title=""
      />

      <div className="container mx-auto px-4 sm:px-6 md:px-12 mt-8">
        <div className="grid lg:grid-cols-2 gap-10 xl:gap-16 items-start">
          <div className="lg:sticky lg:top-28">
            <ProductGallery product={product} title={title} />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {product.category?.name && (
                <Link href={`/products?category=${categoryId}`}>
                  <Badge tone="teal">{localized(product.category, 'name', locale)}</Badge>
                </Link>
              )}
              {brandData?.name && (
                <Link href={`/products?brand=${brandData._id ?? brandId}`}>
                  <Badge>{localized(brandData, 'name', locale)}</Badge>
                </Link>
              )}
              {discount > 0 && <Badge tone="terra">-{discount}%</Badge>}
            </div>

            <h1 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-3">{title}</h1>

            <a href="#reviews" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-teal-600">
              <StarRating value={product.ratingsAverage} showValue />
              <span>{t('reviewsCount', { count: product.ratingsQuantity ?? 0 })}</span>
              {product.sold > 0 && (
                <span className="text-slate-400">• {tShop('soldCount', { count: formatNumber(product.sold, locale) })}</span>
              )}
            </a>

            <div className="mt-6">
              <PriceTag product={product} size="lg" />
            </div>

            <p className={`mt-3 inline-flex items-center gap-2 text-sm font-semibold ${inStock ? 'text-emerald-600' : 'text-red-600'}`}>
              {inStock ? <Check className="w-4 h-4" /> : <PackageX className="w-4 h-4" />}
              {inStock ? t('inStock', { count: formatNumber(product.quantity, locale) }) : tShop('outOfStock')}
            </p>

            {description && (
              <p className="mt-6 text-slate-600 leading-relaxed whitespace-pre-line">{description}</p>
            )}

            {colors.length > 0 && (
              <fieldset className="mt-8">
                <legend className="text-sm font-semibold text-slate-700 mb-3">
                  {t('color')}: <span className="font-normal text-slate-600">{selectedColor}</span>
                </legend>
                <div className="flex flex-wrap gap-2">
                  {colors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      aria-pressed={c === selectedColor}
                      className={`inline-flex items-center gap-2 h-10 ps-2 pe-4 rounded-full border text-sm font-medium transition-colors ${
                        c === selectedColor ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'
                      }`}
                    >
                      <span className="w-6 h-6 rounded-full border border-black/10" style={{ backgroundColor: c }} />
                      {c}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

            {canShop ? (
              <div className="mt-8 flex flex-wrap items-center gap-3">
                {inStock && (
                  <QuantityStepper value={quantity} onChange={setQuantity} max={product.quantity} />
                )}
                <Button
                  size="lg"
                  className="flex-1 min-w-[200px]"
                  disabled={!inStock}
                  loading={adding}
                  onClick={async () => {
                    const res = await addItem(product._id, selectedColor ?? undefined, quantity);
                    if (res) setQuantity(1);
                  }}
                >
                  <ShoppingBag className="w-5 h-5" />
                  {inStock ? tShop('addToCart') : tShop('outOfStock')}
                </Button>
                <WishlistButton
                  productId={product._id}
                  className="h-12 w-12 border border-slate-200 bg-white hover:border-red-300"
                />
              </div>
            ) : (
              <p className="mt-8 rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-600">{t('staffNotice')}</p>
            )}

            <div className="mt-8 flex items-center gap-3 rounded-2xl bg-white border border-slate-100 px-4 py-3 text-sm text-slate-600">
              <Truck className="w-5 h-5 text-teal-500 shrink-0" />
              {t('cashOnDelivery')}
            </div>

            <div className="mt-10 space-y-6">
              <InfoList icon={Check} title={t('benefits')} items={product.benefits} locale={locale} />
              <InfoList icon={Beaker} title={t('ingredients')} items={product.ingredients} locale={locale} chips />
              {directions && (
                <div>
                  <h3 className="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase mb-3 flex items-center gap-2 pb-2 border-b border-slate-100">
                    <BookOpen className="w-4 h-4 text-teal-500" /> {t('directions')}
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed bg-white rounded-2xl p-4">{directions}</p>
                </div>
              )}
              <InfoList icon={Package} title={t('sizes')} items={product.sizes} locale={locale} chips />
            </div>
          </div>
        </div>

        <div className="mt-20">
          <ProductReviews product={product} onRatingsChange={query.refetch} />
        </div>
      </div>

      <RelatedProducts product={product} />
    </main>
  );
}
