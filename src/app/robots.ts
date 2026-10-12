import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site-config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // API routes hold nothing indexable and must never appear in results.
        // Never disallow /_next/: every image (/_next/image) and all CSS/JS
        // (/_next/static) are served from there, and Google needs them to
        // render pages and index images.
        disallow: ['/api/'],
      },
      // Google's ad crawler needs access to render pages for ad targeting.
      { userAgent: 'Mediapartners-Google', allow: '/' },
      { userAgent: 'AdsBot-Google', allow: '/' },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
