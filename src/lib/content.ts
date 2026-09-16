/**
 * Read-only accessors over the JSON/TS files in src/data.
 *
 * Every page imports from here rather than importing the JSON directly, so
 * adding a data entry automatically produces a page, a sitemap URL and the
 * internal links that point at it.
 */
import postsJson from '@/data/posts.json';
import menuJson from '@/data/menu-items.json';
import type { MenuCategory, MenuItem, Post, PostCategory } from '@/data/types';
import { sortByDateDesc } from './utils/date';

export const posts = postsJson as Post[];
export const menuItems = menuJson as MenuItem[];

/* ------------------------------------------------------------------ posts */

export function getAllPosts(): Post[] {
  return sortByDateDesc(posts);
}

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getFeaturedPosts(limit = 3): Post[] {
  const featured = getAllPosts().filter((p) => p.featured);
  return (featured.length ? featured : getAllPosts()).slice(0, limit);
}

export function getPostsByCategory(category: PostCategory): Post[] {
  return getAllPosts().filter((p) => p.category === category);
}

export function getPostCategories(): PostCategory[] {
  return Array.from(new Set(posts.map((p) => p.category))).sort() as PostCategory[];
}

export function getPostsByAuthor(authorSlug: string): Post[] {
  return getAllPosts().filter((p) => p.author === authorSlug);
}

/**
 * Related posts: same category first, then shared tags, then most recent.
 * Never returns the post itself.
 */
export function getRelatedPosts(slug: string, limit = 3): Post[] {
  const post = getPost(slug);
  if (!post) return getAllPosts().slice(0, limit);

  const others = getAllPosts().filter((p) => p.slug !== slug);
  const scored = others.map((p) => {
    let score = 0;
    if (p.category === post.category) score += 3;
    score += p.tags.filter((t) => post.tags.includes(t)).length;
    return { post: p, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.post);
}

export const postSlugs = posts.map((p) => p.slug);

/* -------------------------------------------------------------- menu items */

export function getAllMenuItems(): MenuItem[] {
  return menuItems;
}

export function getMenuItem(slug: string): MenuItem | undefined {
  return menuItems.find((m) => m.slug === slug);
}

export function getMenuByCategory(category: MenuCategory): MenuItem[] {
  return menuItems.filter((m) => m.category === category);
}

export function getMenuCategories(): MenuCategory[] {
  // Preserve the order items appear in the data file rather than sorting.
  return Array.from(new Set(menuItems.map((m) => m.category))) as MenuCategory[];
}

export function getPopularMenuItems(limit = 6): MenuItem[] {
  const popular = menuItems.filter((m) => m.popular);
  return (popular.length ? popular : menuItems).slice(0, limit);
}

export function getRelatedMenuItems(slug: string, limit = 3): MenuItem[] {
  const item = getMenuItem(slug);
  if (!item) return menuItems.slice(0, limit);

  const explicit = (item.related ?? [])
    .map((s) => getMenuItem(s))
    .filter((m): m is MenuItem => Boolean(m));

  if (explicit.length >= limit) return explicit.slice(0, limit);

  const fallback = menuItems.filter(
    (m) => m.slug !== slug && m.category === item.category && !explicit.includes(m),
  );
  return [...explicit, ...fallback].slice(0, limit);
}

export const menuSlugs = menuItems.map((m) => m.slug);

/** Cheapest example price on the menu — used in copy on index pages. */
export function lowestMenuPrice(): number {
  return Math.min(...menuItems.map((m) => m.price));
}

export function highestMenuPrice(): number {
  return Math.max(...menuItems.flatMap((m) => m.sizes.map((s) => s.price)));
}

/**
 * Price range per menu category, computed from the data rather than typed by
 * hand — so the summary table on the homepage can never drift out of step with
 * the individual item pages it links to.
 */
export function getCategoryPriceRanges(): {
  category: MenuCategory;
  count: number;
  low: number;
  high: number;
  /** Slug of a representative item, for the "see prices" link. */
  exampleSlug: string;
  exampleTitle: string;
}[] {
  return getMenuCategories().map((category) => {
    const items = getMenuByCategory(category);
    const prices = items.flatMap((i) => i.sizes.map((s) => s.price));
    const example = items.find((i) => i.popular) ?? items[0];
    return {
      category,
      count: items.length,
      low: Math.min(...prices),
      high: Math.max(...prices),
      exampleSlug: example.slug,
      exampleTitle: example.title,
    };
  });
}

/**
 * The handful of size/price combinations people actually search for
 * ("how much is a large pepperoni pizza"). Pulled live from the menu data.
 */
export function getHeadlinePrices(): {
  label: string;
  price: number;
  slug: string;
}[] {
  const pick = (slug: string, sizeName: string, label: string) => {
    const item = getMenuItem(slug);
    const size = item?.sizes.find((s) => s.name === sizeName);
    return item && size ? { label, price: size.price, slug: item.slug } : null;
  };

  return [
    pick('classic-cheese-pizza', 'Large', 'Large cheese pizza'),
    pick('pepperoni-pizza', 'Large', 'Large pepperoni pizza'),
    pick('pepperoni-pizza', 'Medium', 'Medium pepperoni pizza'),
    pick('meat-lovers-pizza', 'Large', 'Large meat lover’s pizza'),
    pick('garlic-parmesan-breadsticks', 'Regular', 'Breadsticks (8 pieces)'),
    pick('chicken-wings', 'Regular', 'Chicken wings (8 pieces)'),
    pick('chocolate-lava-cake', 'Two cakes', 'Chocolate lava cakes (2)'),
    pick('two-liter-soda', '2 litre', 'Two-litre soda bottle'),
  ].filter((r): r is { label: string; price: number; slug: string } => Boolean(r));
}
