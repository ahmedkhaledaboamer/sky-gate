import {
  Amiri,
  Cormorant_Garamond,
  IBM_Plex_Sans_Arabic,
  Manrope,
} from 'next/font/google';

// Self-hosted Google fonts. They are registered under their real family names
// ('Manrope', 'Cormorant Garamond', ...), which styles/globals.css and the
// Tailwind font stacks reference directly, exactly as before the migration.

export const manrope = Manrope({
  display: 'swap',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-manrope',
});

export const cormorant = Cormorant_Garamond({
  display: 'swap',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
});

export const plexArabic = IBM_Plex_Sans_Arabic({
  display: 'swap',
  subsets: ['arabic', 'latin', 'latin-ext'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-plex-arabic',
  preload: false,
});

export const amiri = Amiri({
  display: 'swap',
  subsets: ['arabic', 'latin', 'latin-ext'],
  weight: ['400', '700'],
  variable: '--font-amiri',
  preload: false,
});

export const fontVariables = [
  manrope.variable,
  cormorant.variable,
  plexArabic.variable,
  amiri.variable,
].join(' ');
