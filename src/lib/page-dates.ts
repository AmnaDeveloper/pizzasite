/**
 * The day each page's content last really changed. Pages show it as "Last
 * updated" and the sitemap sends it as lastmod, so both always agree.
 *
 * Update a date only when the page's content changes — never just to look
 * fresh. Posts carry their own dateModified in posts.json.
 */
export const PAGE_DATES = {
  '/': '2026-11-12',
  '/menus-prices': '2026-11-12',
  '/coupons': '2026-11-12',
  '/delivery-near-me': '2026-11-12',
  '/posts': '2026-11-12',
  '/rewards': '2026-11-12',
  '/hours': '2026-11-12',
  '/drinks': '2026-11-12',
  '/store-locator': '2026-11-12',
  '/about': '2026-11-12',
  '/team': '2026-11-12',
  '/contact': '2026-11-12',
  '/privacy-policy': '2026-11-12',
  '/terms': '2026-11-12',
  '/cookies': '2026-11-12',
  '/disclaimer': '2026-11-12',
  '/accessibility': '2026-11-12',
} as const;

/** All menu item pages share one template and one data file, so one date. */
export const MENU_ITEMS_UPDATED = '2026-11-12';
