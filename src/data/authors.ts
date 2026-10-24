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
      "Amna co-founded this site to answer one question honestly: what does a chain pizza order actually cost once every fee and surcharge is counted, and which order of clicks gets you the better deal. She sets the direction for what gets covered and signs off on every guide before it publishes.",
    credentials:
      'Oversees the site end to end — what gets published and how corrections are handled. Her standing rule for this site: show the working behind every figure, and say plainly when a number is an estimate.',
    avatar: '/images/authors/amna-sadam.png',
    avatarAlt: 'Avatar tile for Amna Sadam, Co-Founder',
  },
  {
    slug: 'maha-iqbal',
    name: 'Maha Iqbal',
    role: 'Content Lead',
    bio:
      'Maha leads day-to-day content on the site — the deal breakdowns, delivery and ordering guides, and the menu, nutrition and allergen pages. She writes each guide from scratch rather than reusing what other sites already say, and works the arithmetic through on the page so readers can check it.',
    credentials:
      'Reviews and edits every guide before it goes live, and labels calorie, allergen and price figures as estimates wherever they have not been confirmed.',
    avatar: '/images/authors/maha-iqbal.png',
    avatarAlt: 'Avatar tile for Maha Iqbal, Content Lead',
  },
];

export function getAuthor(slug: string): Author | undefined {
  return authors.find((a) => a.slug === slug);
}

export const defaultAuthorSlug = 'amna-sadam';
