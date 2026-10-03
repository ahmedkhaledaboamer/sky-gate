'use client';

import { useCallback, useSyncExternalStore } from 'react';

/**
 * Minimal external store. Components read it through `useStoreSelector`, which
 * re-renders a component only when ITS selected value changes — e.g. toggling
 * one product's wishlist heart re-renders that one button, not every card.
 */
export function createStore(initialState) {
  let state = initialState;
  const listeners = new Set();
  return {
    get: () => state,
    set(updater) {
      const next = typeof updater === 'function' ? updater(state) : updater;
      if (Object.is(next, state)) return;
      state = next;
      listeners.forEach((listener) => listener());
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

/** `selector` must return a primitive (or a stable reference) for the bail-out to work. */
export function useStoreSelector(store, selector, serverValue) {
  const getSnapshot = useCallback(() => selector(store.get()), [store, selector]);
  const getServerSnapshot = useCallback(
    () => (serverValue !== undefined ? serverValue : selector(store.get())),
    [store, selector, serverValue]
  );
  return useSyncExternalStore(store.subscribe, getSnapshot, getServerSnapshot);
}

/** Set helpers that always return a new Set (stores compare by reference). */
export const withItem = (set, id) => new Set(set).add(id);
export const withoutItem = (set, id) => {
  const next = new Set(set);
  next.delete(id);
  return next;
};
