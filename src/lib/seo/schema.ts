/**
 * JSON-LD builders. Each returns a plain object that a page drops into a
 * <script type="application/ld+json"> tag via the <JsonLd> component.
 */
import {
  BRAND,
  CURRENCY,
  ORGANIZATION,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  SOCIAL_LINKS,
} from '../site-config';
import { absoluteUrl } from '../seo-config';
import type { Author, Faq, MenuItem, Post } from '@/data/types';

type Json = Record<string, unknown>;

export function organizationSchema(): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    legalName: ORGANIZATION.legalName,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    foundingDate: String(ORGANIZATION.foundingYear),
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl('/logo.svg'),
      width: 512,
      height: 512,
    },
    sameAs: Object.values(SOCIAL_LINKS),
    address: {
      '@type': 'PostalAddress',
      addressLocality: ORGANIZATION.addressLocality,
      addressRegion: ORGANIZATION.addressRegion,
      addressCountry: ORGANIZATION.addressCountry,
    },
    /** Explicit, machine-readable statement that we are an independent publisher. */
    disambiguatingDescription: `${SITE_NAME} is an independent publisher and is not affiliated with ${BRAND.name}.`,
  };
}

export function websiteSchema(): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    publisher: { '@id': `${SITE_URL}/#organization` },
    inLanguage: 'en-US',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/posts?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export type Crumb = { name: string; path: string };

export function breadcrumbSchema(crumbs: Crumb[]): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}

export function faqSchema(faqs: Faq[]): Json | null {
  if (!faqs?.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

export function articleSchema(post: Post, author: Author | undefined): Json {
  const url = absoluteUrl(`/posts/${post.slug}`);
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${url}#article`,
    headline: post.title,
    description: post.excerpt,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    datePublished: post.datePublished,
    dateModified: post.dateModified,
    articleSection: post.category,
    keywords: post.keywords.join(', '),
    wordCount: countWords(post.content),
    inLanguage: 'en-US',
    image: {
      '@type': 'ImageObject',
      url: absoluteUrl(post.image),
      width: 1200,
      height: 630,
    },
    author: author
      ? {
          '@type': 'Person',
          name: author.name,
          jobTitle: author.role,
          url: absoluteUrl(`/team#${author.slug}`),
          description: author.credentials,
        }
      : { '@type': 'Organization', name: SITE_NAME },
    publisher: { '@id': `${SITE_URL}/#organization` },
  };
}

export function menuItemSchema(item: MenuItem): Json {
  const url = absoluteUrl(`/menus-prices/${item.slug}`);
  const prices = item.sizes.length ? item.sizes.map((s) => s.price) : [item.price];
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${url}#product`,
    name: item.title,
    description: item.description,
    url,
    category: item.category,
    image: absoluteUrl(item.image),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: item.rating,
      reviewCount: item.reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: item.currency || CURRENCY,
      lowPrice: Math.min(...prices).toFixed(2),
      highPrice: Math.max(...prices).toFixed(2),
      offerCount: prices.length,
      availability: 'https://schema.org/InStock',
      /** Prices are illustrative; this is stated in the visible copy too. */
      description: 'Example price for reference. Verify at official checkout.',
    },
  };
}

/**
 * A plain ItemList of priced items. Used by the homepage price summary so the
 * visible table has matching structured data — the list must only ever contain
 * items that are actually rendered on the page.
 */
export function priceListSchema(opts: {
  name: string;
  items: { name: string; price: number; path: string }[];
}): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: opts.name,
    numberOfItems: opts.items.length,
    itemListElement: opts.items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Product',
        name: item.name,
        url: absoluteUrl(item.path),
        offers: {
          '@type': 'Offer',
          price: item.price.toFixed(2),
          priceCurrency: CURRENCY,
          availability: 'https://schema.org/InStock',
          description: 'Example price for reference. Verify at official checkout.',
        },
      },
    })),
  };
}

export function collectionPageSchema(opts: {
  name: string;
  description: string;
  path: string;
  items: { name: string; path: string }[];
}): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: opts.name,
    description: opts.description,
    url: absoluteUrl(opts.path),
    isPartOf: { '@id': `${SITE_URL}/#website` },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: opts.items.length,
      itemListElement: opts.items.map((it, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: it.name,
        url: absoluteUrl(it.path),
      })),
    },
  };
}

function countWords(html: string): number {
  return html
    .replace(/<[^>]+>/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
}
