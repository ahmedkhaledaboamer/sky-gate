'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { cartApi, EMPTY_CART } from '@/lib/api';
import { useTranslations } from '@/lib/i18n';
import { createStore, useStoreSelector, withItem, withoutItem } from '@/lib/store';
import { useApiQuery } from '@/hooks/useApiQuery';
import { useCustomerGate } from '@/hooks/useCustomerGate';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

// Split on purpose, so actions never re-render product cards:
// - CartDataContext:    the cart itself (cart page, checkout, header badge)
// - CartActionsContext: stable functions (product cards only need these)
// - pending store:      per-item "request in flight" flags, read with useCartPending(id)
const CartDataContext = createContext(null);
const CartActionsContext = createContext(null);

export function CartProvider({ children }) {
  const { isCustomer, user } = useAuth();
  const toast = useToast();
  const t = useTranslations('Cart');
  const ensureCustomer = useCustomerGate();
  const [pendingStore] = useState(() => createStore(new Set()));

  const query = useApiQuery(
    isCustomer && user?._id ? ['cart', user._id] : null,
    (signal) => cartApi.get({ signal })
  );
  const { setData, refetch } = query;
  const response = isCustomer ? query.data ?? null : null;

  const track = useCallback(
    async (id, fn) => {
      pendingStore.set((set) => withItem(set, id));
      try {
        return await fn();
      } finally {
        pendingStore.set((set) => withoutItem(set, id));
      }
    },
    [pendingStore]
  );

  /** Runs a cart mutation and stores the cart the API returns. */
  const mutate = useCallback(
    (id, fn, successMessage) =>
      track(id, async () => {
        try {
          const res = await fn();
          setData(res ?? EMPTY_CART);
          if (successMessage) toast.success(successMessage);
          return res;
        } catch (err) {
          toast.error(err.message);
          throw err;
        }
      }),
    [track, setData, toast]
  );

  /**
   * POST /cart adds one unit (or +1 to the same product/color line). For a
   * larger quantity the resulting line is then set with PUT /cart/:itemId.
   */
  const addItem = useCallback(
    async (productId, color, quantity = 1) => {
      if (!ensureCustomer()) return null;
      try {
        return await mutate(
          productId,
          async () => {
            const res = await cartApi.add(productId, color);
            if (quantity <= 1) return res;
            const line = res?.data?.cartItems?.find(
              (item) =>
                String(item.product?._id ?? item.product) === productId &&
                (item.color || '') === (color || '')
            );
            return line
              ? cartApi.updateQuantity(line._id, line.quantity + quantity - 1)
              : res;
          },
          t('added')
        );
      } catch {
        return null;
      }
    },
    [ensureCustomer, mutate, t]
  );

  const updateQuantity = useCallback(
    (itemId, quantity) =>
      mutate(itemId, () => cartApi.updateQuantity(itemId, quantity)).catch(() => null),
    [mutate]
  );

  const removeItem = useCallback(
    (itemId) => mutate(itemId, () => cartApi.removeItem(itemId), t('removed')).catch(() => null),
    [mutate, t]
  );

  const clearCart = useCallback(
    () =>
      mutate(
        'clear',
        async () => {
          await cartApi.clear();
          return EMPTY_CART;
        },
        t('cleared')
      ).catch(() => null),
    [mutate, t]
  );

  /** Throws the API error so the coupon form can show it inline. */
  const applyCoupon = useCallback(
    (code) =>
      track('coupon', async () => {
        const res = await cartApi.applyCoupon(code);
        setData(res);
        toast.success(t('couponApplied'));
        return res;
      }),
    [track, setData, toast, t]
  );

  /** After an order the API clears the cart; mirror it locally. */
  const resetCart = useCallback(() => setData(EMPTY_CART), [setData]);

  const actions = useMemo(
    () => ({
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      applyCoupon,
      resetCart,
      refresh: refetch,
      pendingStore,
    }),
    [addItem, updateQuantity, removeItem, clearCart, applyCoupon, resetCart, refetch, pendingStore]
  );

  const data = useMemo(() => {
    const cart = response?.data ?? EMPTY_CART.data;
    return {
      cart,
      cartId: cart?._id ?? null,
      items: cart?.cartItems ?? [],
      count: response?.numOfCartItems ?? cart?.cartItems?.length ?? 0,
      isLoading: isCustomer && query.isInitialLoading,
      error: query.error,
    };
  }, [response, isCustomer, query.isInitialLoading, query.error]);

  return (
    <CartActionsContext.Provider value={actions}>
      <CartDataContext.Provider value={data}>{children}</CartDataContext.Provider>
    </CartActionsContext.Provider>
  );
}

/** Cart mutations only — does not re-render when the cart changes. */
export function useCartActions() {
  const ctx = useContext(CartActionsContext);
  if (!ctx) throw new Error('useCartActions must be used inside <CartProvider>');
  return ctx;
}

/** Cart data + actions (cart page, checkout). */
export function useCart() {
  const data = useContext(CartDataContext);
  const actions = useCartActions();
  if (!data) throw new Error('useCart must be used inside <CartProvider>');
  return { ...data, ...actions };
}

/** Header badge: re-renders only when the item count changes. */
export function useCartCount() {
  const ctx = useContext(CartDataContext);
  return ctx?.count ?? 0;
}

/** True while a request for `id` (product id, cart item id, 'coupon', 'clear') is running. */
export function useCartPending(id) {
  const { pendingStore } = useCartActions();
  const select = useCallback((set) => set.has(id), [id]);
  return useStoreSelector(pendingStore, select, false);
}
