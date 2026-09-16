/** Shared content types. Every data file in this folder is typed against these. */

export interface Faq {
  question: string;
  answer: string;
}

export interface Author {
  slug: string;
  name: string;
  role: string;
  bio: string;
  /** Two or three sentences on why this person is qualified — used for E-E-A-T. */
  credentials: string;
  avatar: string;
  avatarAlt: string;
  email?: string;
  twitter?: string;
  linkedin?: string;
}

export type PostCategory =
  | 'Saving Money'
  | 'Menu Explained'
  | 'Comparisons'
  | 'Ordering'
  | 'Rewards'
  | 'Nutrition';

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  category: PostCategory;
  tags: string[];
  /** Author slug — resolved against data/authors.ts */
  author: string;
  datePublished: string;
  dateModified: string;
  /** Minutes, shown as "8 min read". */
  readTime: number;
  image: string;
  imageAlt: string;
  keywords: string[];
  featured?: boolean;
  /** Optional price context block rendered above the article body. */
  pricing?: {
    label: string;
    from: number;
    to: number;
    note: string;
  };
  faqs: Faq[];
  /** Sanitised HTML written by our editors. Rendered with dangerouslySetInnerHTML. */
  content: string;
}

export type MenuCategory =
  | 'Specialty Pizza'
  | 'Build Your Own'
  | 'Sides'
  | 'Chicken'
  | 'Pasta & Sandwiches'
  | 'Desserts'
  | 'Drinks';

export interface MenuSize {
  name: string;
  detail: string;
  /** Example price in USD. */
  price: number;
  slices?: number;
}

export interface MenuItem {
  id: string;
  slug: string;
  category: MenuCategory;
  title: string;
  description: string;
  /** Long-form HTML for the item detail page. */
  fullContent: string;
  /** Lowest example price across sizes. */
  price: number;
  currency: string;
  /** Calories for the default/reference serving. */
  calories: number;
  caloriesNote: string;
  /** Editorial score out of 5 from our own tasting notes. */
  rating: number;
  reviewCount: number;
  image: string;
  imageAlt: string;
  ingredients: string[];
  allergens: string[];
  sizes: MenuSize[];
  faqs: Faq[];
  /** Slugs of related menu items for internal linking. */
  related?: string[];
  popular?: boolean;
}

export interface Coupon {
  id: string;
  /** Headline saving, e.g. "$7.99" or "50% off". */
  discount: string;
  title: string;
  desc: string;
  /** Illustrative code — clearly labelled as an example in the UI. */
  code: string;
  /** ISO date or a phrase like "Ongoing". */
  expiry: string;
  tags: string[];
  featured?: boolean;
  /** How the deal is actually redeemed. */
  howTo: string;
  type: 'Carryout' | 'Delivery' | 'Bundle' | 'Loyalty' | 'National';
}

export interface LocationHours {
  day: string;
  open: string;
  close: string;
}

export interface Location {
  city: string;
  state: string;
  /** Two-letter code, used in LocalBusiness schema. */
  stateCode: string;
  slug: string;
  title: string;
  description: string;
  /** Example address of a representative store area — not a real store record. */
  address: string;
  phone: string;
  hours: LocationHours[];
  population: string;
  storeCountNote: string;
  /** Neighbourhoods used for internal linking and unique on-page copy. */
  neighborhoods: string[];
  latitude: number;
  longitude: number;
}
