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

const CRUMBS = [
  { name: 'Home', path: '/' },
  { name: 'Guides', path: '/posts' },
];

export const metadata: Metadata = generatePageSEO({
  title: `Pizza Money-Saving Guides & Menu Explainers (${currentMonthYear()})`,
  description:
    'In-depth guides on pizza pricing, deals, crusts, nutrition, tipping and delivery — ' +
    'written by a price researcher, a former delivery driver and a registered dietitian.',
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
            you pay and what turns up at the door. Written and fact-checked by{' '}
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
            <p className="mt-1.5 text-[15px] text-ink-muted">
              {inCategory.length} guide{inCategory.length === 1 ? '' : 's'}
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
