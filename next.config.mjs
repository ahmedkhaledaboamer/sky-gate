// API images (/products/<file>, /categories/<file>…) are resized and served as
// WebP by the Next.js image optimizer and cached, instead of downloading the
// full-size JPEG for every card and thumbnail.
const apiUrl = process.env.NEXT_PUBLIC_API_URL ? new URL(process.env.NEXT_PUBLIC_API_URL) : null;
const isLocalApi = apiUrl ? ['localhost', '127.0.0.1', '[::1]'].includes(apiUrl.hostname) : false;

/** @type {import('next').NextConfig} */
const nextConfig = {
  // automatic memoization: components re-render only when their inputs change.
  // Production builds only — in `next dev` the Babel-based compiler slows every
  // compile a lot, and the site works the same without it.
  reactCompiler: process.env.NODE_ENV === 'production',
  images: {
    formats: ['image/webp'],
    qualities: [75],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      ...(apiUrl
        ? ['categories', 'brands', 'products', 'users'].map((folder) => ({
            protocol: apiUrl.protocol.replace(':', ''),
            hostname: apiUrl.hostname,
            port: apiUrl.port,
            pathname: `/${folder}/**`,
          }))
        : []),
    ],
    // only needed when the API runs on this machine (local development);
    // a deployed API on its own domain does not need it
    dangerouslyAllowLocalIP: isLocalApi,
  },
};

export default nextConfig;
