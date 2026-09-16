import type { Metadata } from 'next';
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE_DEFAULT,
  SITE_TITLE_TEMPLATE,
  SITE_URL,
  TWITTER_HANDLE,
  GOOGLE_SITE_VERIFICATION,
} from './site-config';
import { currentMonthYear } from './utils/date';

export type PageSEOInput = {
  /** Page title WITHOUT the site name — the template appends it. */
  title: string;
  description: string;
  /** Path only, e.g. "/coupons" or "/posts/how-to-save". Leading slash required. */
  path: string;
  /** Absolute or root-relative image path for OG/Twitter cards. */
  image?: string;
  imageAlt?: string;
  keywords?: string[];
  /** Set for blog posts so OG type becomes "article". */
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  /** Pass true on thin utility pages you do not want in the index. */
  noindex?: boolean;
};

export function absoluteUrl(path = '/'): string {
  if (path.startsWith('http')) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

/**
 * Builds a complete Metadata object for one page: title, description,
 * canonical, OpenGraph and Twitter card. Every page in the app uses this so
 * no page can accidentally ship without a canonical or a description.
 */
export function generatePageSEO(input: PageSEOInput): Metadata {
  const {
    title,
    description,
    path,
    image = '/images/og-default.png',
    imageAlt = `${SITE_NAME} — ${SITE_DESCRIPTION.slice(0, 90)}`,
    keywords,
    type = 'website',
    publishedTime,
    modifiedTime,
    authors,
    noindex = false,
  } = input;

  const url = absoluteUrl(path);
  const ogImage = absoluteUrl(image);

  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    robots: noindex
      ? { index: false, follow: true }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
          },
        },
    openGraph: {
      type,
      url,
      siteName: SITE_NAME,
      title: `${title} | ${SITE_NAME}`,
      description,
      locale: 'en_US',
      images: [{ url: ogImage, width: 1200, height: 630, alt: imageAlt }],
      ...(type === 'article'
        ? { publishedTime, modifiedTime, authors }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      site: TWITTER_HANDLE,
      creator: TWITTER_HANDLE,
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [ogImage],
    },
  };
}

/** Root metadata used by app/layout.tsx. */
export const rootMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE_DEFAULT, template: SITE_TITLE_TEMPLATE },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  alternates: { canonical: SITE_URL },
  formatDetection: { telephone: false, address: false, email: false },
  ...(GOOGLE_SITE_VERIFICATION
    ? { verification: { google: GOOGLE_SITE_VERIFICATION } }
    : {}),
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE_DEFAULT,
    description: SITE_DESCRIPTION,
    locale: 'en_US',
    images: [
      {
        url: absoluteUrl('/images/og-default.png'),
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — independent pizza price and coupon guide`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: TWITTER_HANDLE,
    title: SITE_TITLE_DEFAULT,
    description: SITE_DESCRIPTION,
    images: [absoluteUrl('/images/og-default.png')],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
};

/**
 * Appends the live month + year to a title so index pages read as current
 * ("Menu Prices — March 2026") without anyone editing content each month.
 */
export function withFreshness(title: string): string {
  return `${title} (${currentMonthYear()})`;
}
