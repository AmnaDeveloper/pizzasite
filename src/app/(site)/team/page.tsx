import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import AuthorBio from '@/components/AuthorBio';
import PostCard from '@/components/PostCard';
import LastUpdated from '@/components/LastUpdated';
import JsonLd from '@/components/JsonLd';
import { generatePageSEO, absoluteUrl } from '@/lib/seo-config';
import { breadcrumbSchema } from '@/lib/seo/schema';
import { authors } from '@/data/authors';
import { getPostsByAuthor } from '@/lib/content';
import { SITE_NAME, SITE_URL } from '@/lib/site-config';

const CRUMBS = [
  { name: 'Home', path: '/' },
  { name: 'Our Team', path: '/team' },
];

export const metadata: Metadata = generatePageSEO({
  title: `Our Editorial Team`,
  description:
    `The two people who research, write and fact-check every guide on ${SITE_NAME}.`,
  path: '/team',
  keywords: ['slice and save team', 'pizza writers', 'editorial team'],
});

/** Person entries so search engines can connect articles to real authors. */
function peopleSchema() {
  return authors.map((a) => ({
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/team#${a.slug}`,
    name: a.name,
    jobTitle: a.role,
    description: a.credentials,
    image: absoluteUrl(a.avatar),
    url: absoluteUrl(`/team#${a.slug}`),
    worksFor: { '@id': `${SITE_URL}/#organization` },
    ...(a.email ? { email: a.email } : {}),
    ...(a.linkedin || a.twitter
      ? { sameAs: [a.linkedin, a.twitter].filter(Boolean) }
      : {}),
  }));
}

export default function TeamPage() {
  return (
    <>
      <JsonLd data={[breadcrumbSchema(CRUMBS), ...peopleSchema()]} />

      <div className="mx-auto max-w-4xl px-4">
        <Breadcrumbs crumbs={CRUMBS} />
      </div>

      <article className="mx-auto max-w-4xl px-4 pb-16">
        <header>
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-ink sm:text-[2.75rem]">
            The people who write this
          </h1>
          <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-ink-muted">
            Two people, not a byline for a wider content mill. Amna sets pricing and
            editorial direction; Maha writes and reviews the guides day to day. Every guide
            is argued over between the two of us before it publishes.
          </p>
          <LastUpdated className="mt-4" />
        </header>

        <div className="mt-10 space-y-12">
          {authors.map((author) => {
            const written = getPostsByAuthor(author.slug);
            return (
              <section key={author.slug} aria-labelledby={`${author.slug}-heading`}>
                <h2 id={`${author.slug}-heading`} className="sr-only">
                  {author.name}
                </h2>
                <AuthorBio author={author} variant="full" />

                {written.length ? (
                  <div className="mt-5">
                    <h3 className="text-lg font-extrabold text-navy-dark">
                      Guides by {author.name.split(' ')[0]} ({written.length})
                    </h3>
                    <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                      {written.slice(0, 3).map((post) => (
                        <PostCard key={post.slug} post={post} />
                      ))}
                    </div>
                    {written.length > 3 ? (
                      <Link
                        href="/posts"
                        className="mt-4 inline-block text-sm font-bold text-navy hover:text-brand"
                      >
                        See all {written.length} guides →
                      </Link>
                    ) : null}
                  </div>
                ) : null}
              </section>
            );
          })}
        </div>

        <section
          aria-labelledby="standards"
          className="mt-14 rounded-card border border-line bg-surface-alt p-6"
        >
          <h2
            id="standards"
            className="text-2xl font-extrabold tracking-tight text-navy-dark"
          >
            Our editorial standards
          </h2>
          <div className="prose-guide mt-4">
            <p>
              Every guide on this site is written by a named person, dated, and reviewed by
              at least one other member of the team before it publishes. Where a claim is
              operational — how dispatch works, how a promotion is applied at the till — it
              is checked against how the job is actually done rather than against a
              corporate FAQ.
            </p>
            <p>
              Nutrition and allergen content is checked against each chain&apos;s own
              published data before it goes live. Where a chain does not publish a figure,
              we say so rather than estimating and presenting the estimate as fact.
            </p>
            <p>
              Nothing on this site is sponsored, and no advertiser sees an article before it
              publishes. If we get something wrong, we correct the page and note it — see{' '}
              <Link href="/about">about us</Link> for how to report an error.
            </p>
          </div>
        </section>
      </article>
    </>
  );
}
