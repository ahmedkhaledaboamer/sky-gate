'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Banknote, Check, CreditCard, MapPin, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { addressesApi, ordersApi } from '@/lib/api';
import { ROLES } from '@/lib/constants';
import { useTranslations } from '@/lib/i18n';
import { useApiQuery } from '@/hooks/useApiQuery';
import { useProductsByIds } from '@/hooks/useProductsByIds';
import { ProtectedRoute } from '@/components/auth/Guards';
import { Button } from '@/components/ui/Button';
import { FormError } from '@/components/ui/Field';
import { EmptyState, LoadingState, Skeleton } from '@/components/ui/States';
import { AddressForm, AddressText } from '@/components/store/AddressForm';
import { CartItemRow } from '@/components/store/CartItemRow';
import { CartSummary } from '@/components/store/CartSummary';
import { CouponForm } from '@/components/store/CouponForm';
import { PageHero } from '@/components/store/PageHero';

const STEPS = ['address', 'payment', 'review'];
const toShipping = ({ details, phone, city, postalCode }) => ({ details, phone, city, postalCode });

function StepHeader({ index, title, active, done, onEdit, editLabel }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <span
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
            done ? 'bg-teal-500 text-white' : active ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'
          }`}
        >
          {done ? <Check className="w-4 h-4" /> : index + 1}
        </span>
        <h2 className={`font-serif text-2xl font-bold ${active || done ? 'text-slate-900' : 'text-slate-400'}`}>{title}</h2>
      </div>
      {done && onEdit && (
        <button type="button" onClick={onEdit} className="text-sm font-semibold text-teal-600 hover:text-teal-700">
          {editLabel}
        </button>
      )}
    </div>
  );
}

function PaymentOption({ value, selected, onSelect, icon: Icon, title, description }) {
  return (
    <label
      className={`flex items-start gap-4 rounded-2xl border-2 p-4 cursor-pointer transition-colors ${
        selected ? 'border-teal-500 bg-teal-50/50' : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      <input type="radio" name="payment" value={value} checked={selected} onChange={() => onSelect(value)} className="mt-1 accent-teal-600" />
      <Icon className="w-6 h-6 text-teal-600 shrink-0" />
      <span>
        <span className="block font-semibold text-slate-900">{title}</span>
        <span className="block text-sm text-slate-500">{description}</span>
      </span>
    </label>
  );
}

function CheckoutContent() {
  const t = useTranslations('Checkout');
  const cart = useCart();
  const toast = useToast();
  const router = useRouter();
  const [step, setStep] = useState('address');
  const [selectedId, setSelectedId] = useState(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [payment, setPayment] = useState('cash');
  const [placing, setPlacing] = useState(false);
  const [orderError, setOrderError] = useState('');
  // set once the order exists, so the emptied cart doesn't flash before redirect
  const [placed, setPlaced] = useState(false);

  const addresses = useApiQuery(['addresses'], (signal) => addressesApi.list({ signal }));
  const products = useProductsByIds(cart.items.map((i) => i.product?._id ?? i.product));
  const list = addresses.data?.data ?? [];
  // default to the first saved address until the user picks one
  const selected = list.find((a) => a._id === selectedId) ?? list[0] ?? null;
  const stepIndex = STEPS.indexOf(step);

  if (cart.isLoading || placed) return <LoadingState className="min-h-[50vh]" />;
  if (!cart.items.length) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title={t('emptyTitle')}
        description={t('emptyDescription')}
        action={<Button href="/products">{t('browse')}</Button>}
      />
    );
  }

  const saveAddress = async (values) => {
    const res = await addressesApi.add(values);
    const saved = res?.data ?? [];
    addresses.setData(res);
    const created = saved[saved.length - 1];
    if (created) setSelectedId(created._id);
    setShowNewForm(false);
    toast.success(t('addressSaved'));
  };

  const placeOrder = async () => {
    if (!selected || !cart.cartId) return;
    setPlacing(true);
    setOrderError('');
    try {
      const shippingAddress = toShipping(selected);
      if (payment === 'card') {
        // Stripe: redirect to the hosted page; the order is created by the webhook
        const res = await ordersApi.createCheckoutSession(cart.cartId, shippingAddress);
        const url = res?.session?.url;
        if (!url) throw new Error(t('cardUnavailable'));
        window.location.assign(url);
        return;
      }
      const res = await ordersApi.createCashOrder(cart.cartId, shippingAddress);
      setPlaced(true);
      cart.resetCart(); // the API cleared the cart after creating the order
      router.replace(`/checkout/success?order=${res?.data?._id ?? ''}`);
    } catch (err) {
      setOrderError(err.message);
      setPlacing(false);
    }
  };

  const card = 'bg-white rounded-3xl shadow-soft border border-slate-100 p-5 sm:p-6';

  return (
    <div className="grid lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-2 space-y-5">
        {/* 1. Address */}
        <section className={card}>
          <StepHeader
            index={0}
            title={t('stepAddress')}
            active={step === 'address'}
            done={stepIndex > 0}
            onEdit={() => setStep('address')}
            editLabel={t('change')}
          />
          {step === 'address' ? (
            <div className="mt-5 space-y-4">
              {addresses.isInitialLoading ? (
                <Skeleton className="h-24" />
              ) : (
                list.length > 0 && (
                  <div className="grid sm:grid-cols-2 gap-3" role="radiogroup" aria-label={t('stepAddress')}>
                    {list.map((address) => {
                      const active = selected?._id === address._id;
                      return (
                        <label
                          key={address._id}
                          className={`relative rounded-2xl border-2 p-4 text-sm cursor-pointer transition-colors ${
                            active ? 'border-teal-500 bg-teal-50/50' : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="address"
                            className="sr-only"
                            checked={active}
                            onChange={() => setSelectedId(address._id)}
                          />
                          <span className="flex items-center gap-2 font-semibold text-slate-900 mb-1">
                            <MapPin className="w-4 h-4 text-teal-600" />
                            {address.alias || t('address')}
                          </span>
                          <AddressText address={address} />
                          {active && <Check className="absolute top-3 end-3 w-5 h-5 text-teal-600" />}
                        </label>
                      );
                    })}
                  </div>
                )
              )}

              {showNewForm || (!addresses.isInitialLoading && list.length === 0) ? (
                <div className="rounded-2xl border border-slate-200 p-4 sm:p-5">
                  <h3 className="font-semibold text-slate-900 mb-4">{t('newAddress')}</h3>
                  <AddressForm
                    submitLabel={t('saveAddress')}
                    onSubmit={saveAddress}
                    onCancel={list.length ? () => setShowNewForm(false) : undefined}
                  />
                </div>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setShowNewForm(true)}>
                  <Plus className="w-4 h-4" />
                  {t('addAddress')}
                </Button>
              )}

              <div className="pt-2">
                <Button onClick={() => setStep('payment')} disabled={!selected}>
                  {t('continue')}
                </Button>
              </div>
            </div>
          ) : (
            selected && (
              <div className="mt-3 ps-11 text-sm">
                <AddressText address={selected} />
              </div>
            )
          )}
        </section>

        {/* 2. Payment */}
        <section className={card}>
          <StepHeader
            index={1}
            title={t('stepPayment')}
            active={step === 'payment'}
            done={stepIndex > 1}
            onEdit={() => setStep('payment')}
            editLabel={t('change')}
          />
          {step === 'payment' ? (
            <div className="mt-5 space-y-3">
              <PaymentOption
                value="cash"
                selected={payment === 'cash'}
                onSelect={setPayment}
                icon={Banknote}
                title={t('cash')}
                description={t('cashDescription')}
              />
              <PaymentOption
                value="card"
                selected={payment === 'card'}
                onSelect={setPayment}
                icon={CreditCard}
                title={t('card')}
                description={t('cardDescription')}
              />
              <div className="pt-2">
                <Button onClick={() => setStep('review')}>{t('continue')}</Button>
              </div>
            </div>
          ) : (
            stepIndex > 1 && <p className="mt-3 ps-11 text-sm text-slate-600">{payment === 'card' ? t('card') : t('cash')}</p>
          )}
        </section>

        {/* 3. Review */}
        <section className={card}>
          <StepHeader index={2} title={t('stepReview')} active={step === 'review'} done={false} />
          {step === 'review' && (
            <div className="mt-4">
              <ul className="divide-y divide-slate-100">
                {cart.items.map((item) => {
                  const id = item.product?._id ?? item.product;
                  return (
                    <CartItemRow key={item._id} item={item} product={products.data?.[id]} productLoading={products.isLoading} readOnly />
                  );
                })}
              </ul>
            </div>
          )}
        </section>
      </div>

      <aside className="lg:sticky lg:top-28">
        <CartSummary cart={cart.cart}>
          <CouponForm />
          <FormError message={orderError} />
          <Button block size="lg" onClick={placeOrder} loading={placing} disabled={step !== 'review' || !selected}>
            {payment === 'card' ? t('payNow') : t('placeOrder')}
          </Button>
          {step !== 'review' && <p className="text-xs text-center text-slate-500">{t('completeSteps')}</p>}
        </CartSummary>
      </aside>
    </div>
  );
}

export function CheckoutPage() {
  const t = useTranslations('Checkout');
  return (
    <ProtectedRoute roles={[ROLES.USER]}>
      <main className="pt-32 pb-24 bg-saudi-sand min-h-screen">
        <PageHero
          compact
          crumbs={[{ href: '/', label: t('home') }, { href: '/cart', label: t('cart') }, { label: t('title') }]}
          title={t('title')}
        />
        <div className="container mx-auto px-4 sm:px-6 md:px-12 mt-10">
          <CheckoutContent />
        </div>
      </main>
    </ProtectedRoute>
  );
}
