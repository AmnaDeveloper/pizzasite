import type { Author } from './types';

/**
 * Author records exist for E-E-A-T: readers and search engines should be able
 * to see who wrote a guide and why they are worth listening to. These are the
 * two real people behind the site — bios describe what they actually do here,
 * not invented outside credentials.
 */
export const authors: Author[] = [
  {
    slug: 'amna-sadam',
    name: 'Amna Sadam',
    role: 'Co-Founder',
    bio:
      "Amna co-founded this site to answer one question honestly: what does a chain pizza order actually cost once every fee and surcharge is counted, and which order of clicks gets you the better deal. She sets the direction for what gets covered, keeps the pricing data current, and signs off on every guide before it publishes.",
    credentials:
      'Oversees the site end to end — what gets published, how prices are sourced, and how corrections are handled. Her standing rule for this site: if a figure cannot be shown with its working, it does not get published as fact.',
    avatar: '/images/authors/amna-sadam.png',
    avatarAlt: 'Avatar tile for Amna Sadam, Co-Founder',
    email: 'amna@sliceandsave.com',
  },
  {
    slug: 'maha-iqbal',
    name: 'Maha Iqbal',
    role: 'Content Lead',
    bio:
      'Maha leads day-to-day content on the site — the deal breakdowns, delivery and ordering guides, and the menu, nutrition and allergen pages. She writes each guide against the site\'s own pricing and menu data rather than reusing what other sites already say, and flags where a chain simply has not published a figure instead of estimating one.',
    credentials:
      'Reviews and edits every guide before it goes live, cross-checking nutrition and allergen claims against each chain\'s own published data rather than presenting an estimate as fact.',
    avatar: '/images/authors/maha-iqbal.png',
    avatarAlt: 'Avatar tile for Maha Iqbal, Content Lead',
    email: 'maha@sliceandsave.com',
  },
];

export function getAuthor(slug: string): Author | undefined {
  return authors.find((a) => a.slug === slug);
}

export const defaultAuthorSlug = 'amna-sadam';
