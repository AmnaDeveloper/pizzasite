import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import PostCard from '@/components/PostCard';
import LastUpdated from '@/components/LastUpdated';
import AdSlot from '@/components/AdSlot';
import JsonLd from '@/components/JsonLd';
import { generatePageSEO } from '@/lib/seo-config';
import { breadcrumbSchema, collectionPageSchema } from '@/lib/seo/schema';
import { getAllPosts, getPostCategories } from '@/lib/content';
import { authors } from '@/data/authors';
import { currentMonthYear } from '@/lib/utils/date';

/**
 * What each category is for. Written per category so the index page explains
 * the guides rather than just listing them.
 */
const CATEGORY_INTRO: Record<string, string> = {
  'Saving Money':
    'The order you click things in changes the total more than any single coupon. These guides cover the deal structures that come back every month, why a code fails, and the tactics that stack — carryout first, the deal tile before the menu, the dearest item in the flat-price slot.',
  Comparisons:
    'Two options side by side, with the arithmetic shown: carryout against delivery once the fee and tip are counted, a large against a medium by area rather than diameter, and what each crust really changes beyond the price.',
  Rewards:
    'Loyalty schemes that count orders rather than dollars reward a different habit from the one most people have. This explains what the points are actually worth and how to collect them without spending more.',
  Ordering:
    'The practical side of getting food to the door: ordering online without paying for extras by accident, what the delivery fee is and is not, how much to tip, planning for a group, late-night cut-offs and what the tracker is telling you.',
  'Menu Explained':
    'Which parts of the menu are worth paying for and which are padding — starting with toppings, where the cheapest-looking choice is often the worst value.',
  Nutrition:
    'Calories, gluten and vegetarian or vegan options, written to help you compare choices rather than as medical advice. Allergy sufferers should always confirm with the store directly.',
};

/** Three reading paths for the most common reasons people arrive. */
const START_HERE = [
  {
    title: 'I want to pay less tonight',
    body: 'Start with the eleven tactics, then check whether carryout is worth the drive for your order.',
    slugs: ['how-to-save-money-on-pizza-delivery', 'carryout-vs-delivery-which-is-cheaper', 'mix-and-match-deal-explained'],
  },
  {
    title: 'I am feeding a group',
    body: 'Work out how much to order, whether to size up or add pizzas, and which deal fits a crowd.',
    slugs: ['group-ordering-pizza-for-a-party', 'large-vs-medium-pizza-value', 'best-pizza-deals-this-month'],
  },
  {
    title: 'I have a dietary need',
    body: 'Understand what changes the calorie count, and what gluten-free and vegetarian options really mean.',
    slugs: ['pizza-calories-and-nutrition-guide', 'gluten-free-pizza-options-guide', 'vegetarian-and-vegan-pizza-guide'],
  },
];

const CRUMBS = [
  { name: 'Home', path: '/' },
  { name: 'Guides', path: '/posts' },
];

export const metadata: Metadata = generatePageSEO({
  title: `Pizza Money-Saving Guides (${currentMonthYear()})`,
  description:
    'In-depth guides on pizza prices, deals, crusts, nutrition, tipping and delivery — each one ' +
    'with the arithmetic shown, so you can check it yourself.',
  path: '/posts',
  keywords: [
    'pizza guides',
    'save money on pizza',
    'pizza deals explained',
    'pizza nutrition guide',
  ],
});

export default function PostsIndexPage() {
  const allPosts = getAllPosts();
  const categories = getPostCategories();
  const [lead, ...rest] = allPosts;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(CRUMBS),
          collectionPageSchema({
            name: 'Pizza money-saving guides',
            description: `${allPosts.length} original guides on pizza pricing, deals and ordering.`,
            path: '/posts',
            items: allPosts.map((p) => ({ name: p.title, path: `/posts/${p.slug}` })),
          }),
        ]}
      />

      <div className="mx-auto max-w-6xl px-4">
        <Breadcrumbs crumbs={CRUMBS} />
      </div>

      <header className="border-b border-line bg-surface-alt">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-ink sm:text-[2.75rem]">
            Guides to spending less on pizza
          </h1>
          <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-ink-muted">
            {allPosts.length} long-form pieces on the decisions that actually change what
            you pay and what turns up at the door. Written and edited by{' '}
            {authors.map((a, i) => (
              <span key={a.slug}>
                {i > 0 ? (i === authors.length - 1 ? ' and ' : ', ') : ''}
                <Link href={`/team#${a.slug}`} className="font-semibold text-navy hover:text-brand">
                  {a.name}
                </Link>
              </span>
            ))}
            .
          </p>
          <LastUpdated className="mt-5" />
        </div>
      </header>

      <nav aria-label="Guide categories" className="border-b border-line bg-surface">
        <ul className="mx-auto flex max-w-6xl flex-wrap gap-2 px-4 py-4">
          {categories.map((cat) => (
            <li key={cat}>
              <a
                href={`#${cat.toLowerCase().replace(/\s+/g, '-')}`}
                className="inline-block rounded-full border border-line px-3.5 py-1.5 text-sm font-semibold text-ink transition-colors hover:border-navy hover:text-navy"
              >
                {cat}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <section aria-labelledby="latest" className="mx-auto max-w-6xl px-4 py-10">
        <h2 id="latest" className="sr-only">
          Latest guide
        </h2>
        {lead ? (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <PostCard post={lead} priority />
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:col-span-2">
              {rest.slice(0, 4).map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        ) : null}
      </section>

      <section aria-labelledby="start-here" className="border-y border-line bg-surface-alt">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <h2 id="start-here" className="text-2xl font-extrabold tracking-tight text-navy-dark">
            Not sure where to start?
          </h2>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-ink-muted">
            Pick the situation closest to yours. Each path is three guides, in the order
            worth reading them.
          </p>
          <ol className="mt-6 grid gap-4 md:grid-cols-3">
            {START_HERE.map((path) => (
              <li key={path.title} className="rounded-card border border-line bg-surface p-5">
                <h3 className="text-[17px] font-extrabold text-ink">{path.title}</h3>
                <p className="mt-1.5 text-[14px] leading-relaxed text-ink-muted">{path.body}</p>
                <ol className="mt-3 space-y-1.5 text-[14px]">
                  {path.slugs.map((slug, i) => {
                    const post = allPosts.find((p) => p.slug === slug);
                    return post ? (
                      <li key={slug} className="flex gap-2">
                        <span className="font-bold text-brand">{i + 1}.</span>
                        <Link href={`/posts/${slug}`} className="font-semibold text-navy hover:text-brand hover:underline">
                          {post.title}
                        </Link>
                      </li>
                    ) : null;
                  })}
                </ol>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="how-written" className="mx-auto max-w-3xl px-4 pt-10">
        <h2 id="how-written" className="text-2xl font-extrabold tracking-tight text-navy-dark">
          How these guides are written
        </h2>
        <div className="prose-guide mt-3">
          <p>
            Each guide answers one question that changes what you pay or what arrives —
            not a list of tips that could apply to any restaurant. Where a guide makes a
            claim about money, the arithmetic is on the page: the sizes, the prices used
            and the sum, so you can redo it with your own store’s numbers.
          </p>
          <p>
            Prices quoted inside the guides are estimates, the same ones used across the
            menu pages, and are labelled that way. When something in a guide turns out to be
            wrong, we correct the page and change its date rather than leaving the old
            version up. If you spot a mistake, the{' '}
            <Link href="/contact">contact page</Link> reaches both editors.
          </p>
        </div>
      </section>

      <AdSlot slotId="posts-index" className="pb-4" />

      {categories.map((category) => {
        const inCategory = allPosts.filter((p) => p.category === category);
        if (!inCategory.length) return null;
        const id = category.toLowerCase().replace(/\s+/g, '-');
        return (
          <section
            key={category}
            id={id}
            aria-labelledby={`${id}-heading`}
            className="mx-auto max-w-6xl scroll-mt-28 px-4 py-8"
          >
            <h2
              id={`${id}-heading`}
              className="text-2xl font-extrabold tracking-tight text-navy-dark"
            >
              {category}
            </h2>
            <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-ink-muted">
              {CATEGORY_INTRO[category] ? `${CATEGORY_INTRO[category]} ` : ''}
              <span className="font-semibold text-ink">
                {inCategory.length} guide{inCategory.length === 1 ? '' : 's'}.
              </span>
            </p>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {inCategory.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          </section>
        );
      })}

      <div className="h-8" />
    </>
  );
}
