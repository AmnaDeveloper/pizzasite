/**
 * SINGLE SOURCE OF TRUTH FOR THE WHOLE SITE.
 *
 * Change values here and every page, meta tag, sitemap entry and JSON-LD block
 * updates automatically. Nothing else in the codebase should hardcode a URL,
 * a site name, a colour or a third-party ID.
 *
 * ── BEFORE YOU DEPLOY ─────────────────────────────────────────────────────────
 * 1. Set SITE_URL to your real domain (no trailing slash).
 * 2. Fill in the THIRD_PARTY ids once you have them (GA4, AdSense, Clarity).
 * 3. Keep CONTACT_EMAIL pointing at an inbox that receives mail; add SOCIAL_LINKS
 *    only for accounts that exist.
 * Everything else can stay as-is.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * The live domain. Used for canonical URLs, sitemap.xml, robots.txt, OpenGraph
 * tags and structured data, so it MUST match the domain verified in Search
 * Console exactly — www and https included. No trailing slash.
 */
export const SITE_URL = 'https://www.dominos-menus.com';

export const SITE_NAME = 'Slice & Save';

export const SITE_TAGLINE = 'Independent pizza menu, price and coupon guide';

export const SITE_TITLE_DEFAULT = `${SITE_NAME} — Domino's Menu Prices, Coupons & Deals Guide`;

export const SITE_TITLE_TEMPLATE = `%s | ${SITE_NAME}`;

export const SITE_DESCRIPTION =
  "An independent, reader-supported guide to Domino's menu prices, coupon codes, " +
  'rewards and delivery. We track example prices, explain how the deals actually ' +
  'work and show you which order saves the most money.';

/** The brand this guide writes *about*. We are not affiliated with it. */
export const BRAND = {
  name: "Domino's",
  /** Used in copy like "the official Domino's app". Never used as a logo. */
  possessive: "Domino's",
  foodType: 'pizza',
  officialSite: 'https://www.dominos.com',
  officialAppNote: 'the official app or dominos.com',
} as const;

/**
 * STRICT TWO-COLOUR PALETTE.
 *
 * The entire site uses exactly two hues — brand red (#E31837) and brand blue
 * (#006491) — plus white. Every other value below is a shade or tint of one of
 * those two. There is deliberately no green, no amber and no neutral grey:
 * even the body text, borders and page backgrounds are desaturated shades of
 * the blue, so nothing on the page introduces a third hue.
 *
 * All text/background pairs here meet WCAG AA (4.5:1) — see /accessibility.
 * If you change a value, re-check the contrast before shipping it.
 *
 * The palette follows the brand's familiar red-and-blue look so the guide
 * feels visually at home next to it. Colours are not trademarks, but the
 * closer the look, the louder the disclaimer has to be — see
 * NOT_AFFILIATED_DISCLAIMER, which is rendered on every single page.
 */
export const COLORS = {
  // ── Hue 1: red ────────────────────────────────────────────────────────────
  primary: '#E31837', // CTAs, prices, ratings, active nav
  primaryDark: '#B31229', // hover / pressed states, text on light red
  primarySoft: '#FCE9EC', // tinted panels behind red content

  // ── Hue 2: blue ───────────────────────────────────────────────────────────
  secondary: '#006491', // headings, links, info panels
  secondaryDark: '#004E71', // hover states, text on light blue
  secondarySoft: '#E4F0F5', // tinted panels behind blue content

  // ── Neutrals, all derived from hue 2 ──────────────────────────────────────
  ink: '#062F42', // body text — a very dark shade of the blue
  inkMuted: '#446B7D', // secondary text — a desaturated shade of the blue
  line: '#D6E4EB', // borders and dividers — a light tint of the blue
  surface: '#FFFFFF',
  surfaceAlt: '#F2F7F9', // alternating sections — the faintest blue tint
} as const;

/** Third-party IDs. Empty string = script is not rendered at all. */
export const THIRD_PARTY = {
  /** e.g. 'G-XXXXXXXXXX' */
  GA4_ID: process.env.NEXT_PUBLIC_GA4_ID ?? '',
  /** e.g. 'ca-pub-0000000000000000' */
  /** AdSense publisher ID. The env var overrides it if set. */
  ADSENSE_PUB_ID: process.env.NEXT_PUBLIC_ADSENSE_PUB_ID || 'ca-pub-7176456641838512',
  /** Microsoft Clarity project id, e.g. 'abcd1234' */
  CLARITY_ID: process.env.NEXT_PUBLIC_CLARITY_ID ?? '',
  /** Search Console HTML-tag verification token */
  GOOGLE_SITE_VERIFICATION: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? '',
} as const;

// Re-exported flat for convenience, because most files only need one of them.
export const GA4_ID = THIRD_PARTY.GA4_ID;
export const ADSENSE_PUB_ID = THIRD_PARTY.ADSENSE_PUB_ID;
export const CLARITY_ID = THIRD_PARTY.CLARITY_ID;
export const GOOGLE_SITE_VERIFICATION = THIRD_PARTY.GOOGLE_SITE_VERIFICATION;

/** The inbox that actually receives mail. Corrections go to the same address. */
export const CONTACT_EMAIL = 'codepixel484@gmail.com';
export const EDITORIAL_EMAIL = CONTACT_EMAIL;

/**
 * Social profiles. Empty on purpose: only list accounts that exist — a link to
 * a profile that 404s is a trust signal working against the site.
 */
export const SOCIAL_LINKS: Record<string, string> = {};

/**
 * Rendered in the footer of every page, in the header notice bar, and inside
 * the About / legal pages. Required for the "unofficial guide" positioning.
 */
export const NOT_AFFILIATED_DISCLAIMER =
  `${SITE_NAME} is an independent guide. We are not affiliated with, endorsed by, ` +
  `sponsored by or connected to ${BRAND.name} or any of its subsidiaries. All ` +
  `trademarks and brand names belong to their respective owners. Prices shown are ` +
  `examples for reference only — they change by store, date and offer, so always ` +
  `verify the final total at official checkout before you order.`;

/** Short version for tight spaces (header bar, card footers). */
export const NOT_AFFILIATED_SHORT =
  `Independent guide — not affiliated with ${BRAND.name}. Example prices only.`;

/**
 * WHERE THE PRICES COME FROM — the single source of truth for every sentence
 * on the site that describes the prices.
 *
 * Individual prices carry `verified: true` in menu-items.json only when they
 * were copied from this store's menu on this date; everything else is shown as
 * an estimate. Never mark a price verified without checking it.
 */
export const PRICE_SOURCE = {
  /** The store whose carryout menu the checked prices were copied from. */
  store: "Domino's, 628 N High St, Columbus, OH 43215",
  /** Short form for running text. */
  storeShort: 'a Columbus, Ohio store',
  /** ISO date the menu was checked. */
  checkedOn: '2026-10-25',
};

export const NAV_LINKS = [
  { href: '/menus-prices', label: 'Menu & Prices' },
  { href: '/coupons', label: 'Coupons' },
  { href: '/delivery-near-me', label: 'Delivery Near Me' },
  { href: '/rewards', label: 'Rewards' },
  { href: '/hours', label: 'Hours' },
  { href: '/posts', label: 'Guides' },
] as const;

export const FOOTER_LINKS = {
  guide: [
    { href: '/menus-prices', label: 'Menu & Prices' },
    { href: '/coupons', label: 'Coupons & Deals' },
    { href: '/drinks', label: 'Drinks & Sides' },
    { href: '/rewards', label: 'Rewards Explained' },
    { href: '/posts', label: 'Money-Saving Guides' },
  ],
  local: [
    { href: '/delivery-near-me', label: 'Delivery Near Me' },
    { href: '/store-locator', label: 'Store Locator Tips' },
    { href: '/hours', label: 'Opening Hours' },
  ],
  company: [
    { href: '/about', label: 'About Us' },
    { href: '/team', label: 'Our Team' },
    { href: '/contact', label: 'Contact' },
  ],
  legal: [
    { href: '/privacy-policy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Use' },
    { href: '/cookies', label: 'Cookie Policy' },
    { href: '/disclaimer', label: 'Disclaimer' },
    { href: '/accessibility', label: 'Accessibility' },
  ],
} as const;

/** Default currency used across menu data and Product schema. */
export const CURRENCY = 'USD';
export const CURRENCY_SYMBOL = '$';
