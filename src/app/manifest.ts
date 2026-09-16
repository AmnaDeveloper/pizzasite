import type { MetadataRoute } from 'next';
import { COLORS, SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from '@/lib/site-config';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — ${SITE_TAGLINE}`,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: COLORS.surface,
    theme_color: COLORS.primary,
    categories: ['food', 'shopping', 'lifestyle'],
    lang: 'en-US',
    dir: 'ltr',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/images/og-default.png',
        sizes: '1200x630',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    shortcuts: [
      { name: 'Menu & prices', url: '/menus-prices' },
      { name: 'Coupons & deals', url: '/coupons' },
      { name: 'Delivery near me', url: '/delivery-near-me' },
    ],
  };
}
