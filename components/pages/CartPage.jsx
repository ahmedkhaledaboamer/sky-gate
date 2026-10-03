'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowRight, Info, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart, useCartPending } from '@/context/CartContext';
import { ROLES } from '@/lib/constants';
import { useTranslations } from '@/lib/i18n';
import { useProductsByIds } from '@/hooks/useProductsByIds';
import { ProtectedRoute } from '@/components/auth/Guards';
import { Button } from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/States';
import { CartItemRow } from '@/components/store/CartItemRow';
import { CartSummary } from '@/components/store/CartSummary';
import { CouponForm } from '@/components/store/CouponForm';
import { PageHero } from '@/components/store/PageHero';

function CartContent() {
  const t = useTranslations('Cart');
  const cart = useCart();
  const clearing = useCartPending('clear');
  const cancelled = useSearchParams().get('payment') === 'cancelled';
  const [confirmClear, setConfirmClear] = useState(false);
  const products = useProductsByIds(cart.items.map((i) => i.product?._id ?? i.product));

  let content;
  if (cart.isLoading) {
    content = <LoadingState />;
  } else if (cart.error && !cart.items.length) {
    content = <ErrorState error={cart.error} onRetry={cart.refresh} />;
  } else if (!cart.items.length) {
    content = (
      <EmptyState
        icon={ShoppingBag}
        title={t('emptyTitle')}
        description={t('emptyDescription')}
        action={<Button href="/products">{t('continueShopping')}</Button>}
      />
    );
  } else {
    content = (
      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <section className="lg:col-span-2 bg-white rounded-3xl shadow-soft border border-slate-100 px-5 sm:px-6">
          <div className="flex items-center justify-between py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">{t('itemsCount', { count: cart.count })}</h2>
            <Button variant="dangerGhost" size="sm" onClick={() => setConfirmClear(true)}>
              <Trash2 className="w-4 h-4" />
              {t('clear')}
            </Button>
          </div>
          <ul className="divide-y divide-slate-100">
            {cart.items.map((item) => {
              const id = item.product?._id ?? item.product;
              return (
                <CartItemRow
                  key={item._id}
                  item={item}
                  product={products.data?.[id]}
                  productLoading={products.isLoading}
                />
              );
            })}
          </ul>
        </section>
        <aside className="lg:sticky lg:top-28">
          <CartSummary cart={cart.cart}>
            <CouponForm />
            <Button href="/checkout" block size="lg">
              {t('checkout')}
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </Button>
            <Button href="/products" variant="ghost" block>
              {t('continueShopping')}
            </Button>
          </CartSummary>
        </aside>
      </div>
    );
  }

  return (
    <main className="pt-32 pb-24 bg-saudi-sand min-h-screen">
      <PageHero crumbs={[{ href: '/', label: t('home') }, { label: t('title') }]} title={t('title')} compact />
      <div className="container mx-auto px-4 sm:px-6 md:px-12 mt-10">
        {cancelled && (
          <div role="status" className="mb-6 flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <Info className="w-4 h-4 shrink-0" />
            {t('paymentCancelled')}
          </div>
        )}
        {content}
      </div>
      <ConfirmModal
        open={confirmClear}
        onClose={() => setConfirmClear(false)}
        onConfirm={async () => {
          await cart.clearCart();
          setConfirmClear(false);
        }}
        loading={clearing}
        danger
        title={t('clearTitle')}
        message={t('clearMessage')}
        confirmLabel={t('clear')}
      />
    </main>
  );
}

export function CartPage() {
  return (
    <ProtectedRoute roles={[ROLES.USER]}>
      <CartContent />
    </ProtectedRoute>
  );
}
