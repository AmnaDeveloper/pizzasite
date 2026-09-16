import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Clock, Tag } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import PostCard from '@/components/PostCard';
import AuthorBio from '@/components/AuthorBio';
import FaqAccordion from '@/components/FaqAccordion';
import LastUpdated from '@/components/LastUpdated';
import PriceNote from '@/components/PriceNote';
import AdSlot from '@/components/AdSlot';
import JsonLd from '@/components/JsonLd';
import { generatePageSEO } from '@/lib/seo-config';
import { articleSchema, breadcrumbSchema, faqSchema } from '@/lib/seo/schema';
import { getPost, getRelatedPosts, postSlugs } from '@/lib/content';
import { getAuthor } from '@/data/authors';
import { CURRENCY_SYMBOL, NOT_AFFILIATED_SHORT } from '@/lib/site-config';
import { formatLongDate, toIsoDate, withCurrentMonthYear } from '@/lib/utils/date';

export function generateStaticParams() {
  return postSlugs.map((slug) => ({ slug }));
}

export const revalidate = 86400;
export const dynamicParams = false;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: 'Guide not found' };

  const author = getAuthor(post.author);

  return generatePageSEO({
    title: post.title,
    description: post.excerpt,
    path: `/posts/${post.slug}`,
    image: post.image,
    imageAlt: post.imageAlt,
    keywords: post.keywords,
    type: 'article',
    publishedTime: post.datePublished,
    modifiedTime: post.dateModified,
    authors: author ? [author.name] : undefined,
  });
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const author = getAuthor(post.author);
  const related = getRelatedPosts(slug, 3);
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Guides', path: '/posts' },
    { name: post.title, path: `/posts/${post.slug}` },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          articleSchema(post, author),
          faqSchema(post.faqs),
        ]}
      />

      <div className="mx-auto max-w-3xl px-4">
        <Breadcrumbs crumbs={crumbs} />
      </div>

      <article className="mx-auto max-w-3xl px-4 pb-16">
        <header>
          <p className="text-[12px] font-bold uppercase tracking-wide text-navy">
            {post.category}
          </p>
          <h1 className="mt-1.5 text-[2.1rem] font-extrabold leading-[1.15] tracking-tight text-ink sm:text-[2.6rem]">
            {post.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-ink-muted">{post.excerpt}</p>

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-line py-3 text-sm text-ink-muted">
            {author ? (
              <span>
                By{' '}
                <Link
                  href={`/team#${author.slug}`}
                  className="font-bold text-ink hover:text-brand"
                >
                  {author.name}
                </Link>
                , {author.role}
              </span>
            ) : null}
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" aria-hidden="true" />
              {post.readTime} min read
            </span>
            <span>
              Published{' '}
              <time dateTime={toIsoDate(post.datePublished)}>
                {formatLongDate(post.datePublished)}
              </time>
            </span>
            <LastUpdated date={post.dateModified} />
          </div>
        </header>

        <div className="relative mt-7 aspect-[16/9] overflow-hidden rounded-card border border-line">
          <Image
            src={post.image}
            alt={post.imageAlt}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
        </div>

        {post.pricing ? (
          <aside
            aria-label="Price context"
            className="mt-7 rounded-card border border-line bg-navy-soft p-5"
          >
            <h2 className="text-[12px] font-bold uppercase tracking-wide text-navy-dark">
              {post.pricing.label}
            </h2>
            <p className="mt-1 text-3xl font-extrabold text-navy-dark">
              {post.pricing.label.toLowerCase().includes('calorie')
                ? `${post.pricing.from} – ${post.pricing.to}`
                : `${CURRENCY_SYMBOL}${post.pricing.from} – ${CURRENCY_SYMBOL}${post.pricing.to}`}
            </p>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">
              {post.pricing.note}
            </p>
            <PriceNote className="mt-3" />
          </aside>
        ) : null}

        <div
          className="prose-guide mt-8"
          dangerouslySetInnerHTML={{ __html: withCurrentMonthYear(post.content) }}
        />

        <AdSlot slotId="post-end" className="my-10 !px-0" />

        <ul className="mt-8 flex flex-wrap items-center gap-2">
          <li className="inline-flex items-center gap-1.5 text-sm font-bold text-ink">
            <Tag className="h-4 w-4 text-navy" aria-hidden="true" />
            Topics:
          </li>
          {post.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full bg-surface-alt px-3 py-1 text-sm capitalize text-ink-muted"
            >
              {tag}
            </li>
          ))}
        </ul>

        <FaqAccordion faqs={post.faqs} headingId={`faq-${post.slug}`} />

        {author ? (
          <div className="mt-12">
            <AuthorBio author={author} variant="full" />
          </div>
        ) : null}

        <p className="mt-8 rounded-card border border-line bg-surface-alt p-4 text-[13px] leading-relaxed text-ink-muted">
          {NOT_AFFILIATED_SHORT} This guide is general consumer information and is not
          financial, dietary or medical advice.
        </p>

        <section aria-labelledby="related-posts" className="mt-14">
          <h2
            id="related-posts"
            className="text-2xl font-extrabold tracking-tight text-navy-dark"
          >
            Keep reading
          </h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <PostCard key={r.slug} post={r} />
            ))}
          </div>
        </section>
      </article>
    </>
  );
}
