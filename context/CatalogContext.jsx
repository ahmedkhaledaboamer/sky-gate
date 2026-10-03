'use client';

import { createContext, useContext } from 'react';

// Categories and brands fetched on the server by app/(site)/layout.jsx, so the
// header, footer, filters and home sliders render with data immediately.
const CatalogContext = createContext({ categories: undefined, brands: undefined });

export function CatalogProvider({ categories, brands, children }) {
  return <CatalogContext.Provider value={{ categories, brands }}>{children}</CatalogContext.Provider>;
}

export const useInitialCatalog = () => useContext(CatalogContext);
