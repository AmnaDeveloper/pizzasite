import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site-config';
import { menuItems, posts } from '@/lib/content';

/**
 * Sitemap generated entirely from the data files. Adding a post, menu item or
 * city to src/data automatically adds its URL here — there is no list to keep
 * in sync by hand.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: {
    path: string;
    priority: number;
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
  }[] = [
    { path: '/', priority: 1, changeFrequency: 'daily' },
    { path: '/menus-prices', priority: 0.95, changeFrequency: 'weekly' },
    { path: '/coupons', priority: 0.95, changeFrequency: 'daily' },
    { path: '/delivery-near-me', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/posts', priority: 0.85, changeFrequency: 'daily' },
    { path: '/rewards', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/hours', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/drinks', priority: 0.75, changeFrequency: 'weekly' },
    { path: '/store-locator', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/about', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/team', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/contact', priority: 0.5, changeFrequency: 'yearly' },
    { path: '/privacy-policy', priority: 0.4, changeFrequency: 'yearly' },
    { path: '/terms', priority: 0.4, changeFrequency: 'yearly' },
    { path: '/cookies', priority: 0.4, changeFrequency: 'yearly' },
    { path: '/disclaimer', priority: 0.4, changeFrequency: 'yearly' },
    { path: '/accessibility', priority: 0.4, changeFrequency: 'yearly' },
  ];

  return [
    ...staticPages.map((page) => ({
      url: `${SITE_URL}${page.path === '/' ? '' : page.path}`,
      lastModified: now,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),

    ...menuItems.map((item) => ({
      url: `${SITE_URL}/menus-prices/${item.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),

    ...posts.map((post) => ({
      url: `${SITE_URL}/posts/${post.slug}`,
      lastModified: new Date(post.dateModified),
      changeFrequency: 'monthly' as const,
      priority: post.featured ? 0.85 : 0.75,
    })),
  ];
}
