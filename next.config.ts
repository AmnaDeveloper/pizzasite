import type { NextConfig } from 'next';

/**
 * Security headers applied to every response. Values are conservative and safe
 * for a static content site that runs Google AdSense + Analytics.
 */
const securityHeaders = [
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(self), payment=()',
  },
];

const nextConfig: NextConfig = {
  // Pin the workspace root — there is an unrelated lockfile higher up the tree
  // and without this Next infers the wrong project root.
  turbopack: { root: __dirname },

  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  images: {
    // AVIF first, WebP fallback. Next serves the smallest format the browser accepts.
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 414, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [64, 96, 128, 192, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },

  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      {
        // Static content pages are safe to cache hard at the edge.
        source: '/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'index, follow, max-image-preview:large' },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
          { key: 'Cache-Control', value: 'no-store' },
        ],
      },
      {
        source: '/ads.txt',
        headers: [{ key: 'Content-Type', value: 'text/plain; charset=utf-8' }],
      },
    ];
  },

  /**
   * 301s for paths people (and old links) reasonably guess at. Keeps the site
   * free of 404s, which matters for both crawlers and AdSense review.
   */
  async redirects() {
    return [
      { source: '/menu', destination: '/menus-prices', statusCode: 301 },
      { source: '/menu-prices', destination: '/menus-prices', statusCode: 301 },
      { source: '/prices', destination: '/menus-prices', statusCode: 301 },
      { source: '/blog', destination: '/posts', statusCode: 301 },
      { source: '/blog/:slug', destination: '/posts/:slug', statusCode: 301 },
      { source: '/articles/:slug', destination: '/posts/:slug', statusCode: 301 },
      { source: '/deals', destination: '/coupons', statusCode: 301 },
      { source: '/promo-codes', destination: '/coupons', statusCode: 301 },
      { source: '/near-me', destination: '/delivery-near-me', statusCode: 301 },
      { source: '/pizza-near-me', destination: '/delivery-near-me', statusCode: 301 },
      { source: '/opening-hours', destination: '/hours', statusCode: 301 },
      { source: '/store-hours', destination: '/hours', statusCode: 301 },
      { source: '/locator', destination: '/store-locator', statusCode: 301 },
      { source: '/cities', destination: '/locations', statusCode: 301 },
      { source: '/city/:slug', destination: '/locations/:slug', statusCode: 301 },
      { source: '/privacy', destination: '/privacy-policy', statusCode: 301 },
      { source: '/terms-of-service', destination: '/terms', statusCode: 301 },
      { source: '/cookie-policy', destination: '/cookies', statusCode: 301 },
      { source: '/authors', destination: '/team', statusCode: 301 },
      { source: '/contact-us', destination: '/contact', statusCode: 301 },
    ];
  },
};

export default nextConfig;
