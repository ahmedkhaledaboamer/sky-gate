/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './lib/**/*.{js,jsx}',
    './data/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        // Legacy brand colors (kept for backward compatibility)
        brand: {
          gold: '#E8A87C',
          goldLight: '#F5D5C0',
          pink: '#E8F3D6',
          pinkDark: '#C5DC95',
          peach: '#D9E5F2',
          peachDark: '#95B4D8',
          purple: '#E1F0CB',
          purpleDark: '#B5CCE5',
          cream: '#FAFAF7',
          beige: '#F1F5F7',
          dark: '#0B2E3B',
        },
        // Remapped to the new "Warm Professional" palette
        // (keys preserved so existing class names continue to work)
        saudi: {
          midnight: '#31859F', // primary teal
          ink: '#1E293B', // dark slate text
          champagne: '#E8A87C', // warm terracotta accent
          'champagne-light': '#F5D5C0',
          sand: '#FAFAF7', // warm off-white background
          'sand-deep': '#F1F5F7', // cool neutral section background
          palm: '#256A80', // deeper teal for hover states
          rose: '#B85C5C',
        },
        // New explicit palette tokens for the modern redesign
        teal: {
          DEFAULT: '#31859F',
          50: '#E6F2F5',
          100: '#C2DFE7',
          500: '#31859F',
          600: '#256A80',
          700: '#1B5266',
          900: '#0B2E3B',
        },
        terra: {
          DEFAULT: '#E8A87C',
          soft: '#F5D5C0',
          deep: '#D08A5C',
        },
        slate: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        },
      },
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
        serif: ['Cormorant Garamond', 'serif'],
      },
      // one-row sliders (components/ui/Marquee.jsx): the track holds the items
      // twice, so moving it by half its width loops seamlessly
      keyframes: {
        // hero entrance (same motion as the former Framer Motion version)
        'hero-text': {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'hero-image': {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        'hero-block': {
          from: { opacity: '0', transform: 'translateX(20px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        'marquee-rtl': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(50%)' },
        },
      },
      animation: {
        'hero-text': 'hero-text 0.8s ease-out both',
        'hero-image': 'hero-image 1s ease-out 0.2s both',
        'hero-block': 'hero-block 1s ease-out 0.4s both',
        marquee: 'marquee 40s linear infinite',
        'marquee-rtl': 'marquee-rtl 40s linear infinite',
      },
      boxShadow: {
        soft: '0 4px 20px -2px rgba(15, 23, 42, 0.06)',
        card: '0 12px 32px -8px rgba(15, 23, 42, 0.10)',
        cardHover: '0 24px 48px -12px rgba(15, 23, 42, 0.18)',
        ring: '0 0 0 1px rgba(15, 23, 42, 0.05)',
      },
    },
  },
  plugins: [],
};

export default config;
