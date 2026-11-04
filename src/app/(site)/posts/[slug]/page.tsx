import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, CalendarCheck, Clock, Tag } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import PostCard from '@/components/PostCard';
import ArticleToc from '@/components/ArticleToc';
import AuthorBio from '@/components/AuthorBio';
import FaqAccordion from '@/components/FaqAccordion';
import PriceNote from '@/components/PriceNote';
import AdSlot from '@/components/AdSlot';
import JsonLd from '@/components/JsonLd';
import { generatePageSEO } from '@/lib/seo-config';
import { articleSchema, breadcrumbSchema, faqSchema } from '@/lib/seo/schema';
import { getPost, getRelatedPosts, postSlugs } from '@/lib/content';
import { withHeadingIds } from '@/lib/post-headings';
import { getAuthor } from '@/data/authors';
import { CURRENCY_SYMBOL, NOT_AFFILIATED_SHORT } from '@/lib/site-config';
import { formatLongDate, toIsoDate, withCurrentMonthYear } from '@/lib/utils/date';

const SIDEBAR_LINKS = [
  { href: '/menus-prices', label: 'Full menu with prices' },
  { href: '/coupons', label: 'Coupons & deals compared' },
  { href: '/hours', label: 'Hours & last orders' },
];

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

  const { html, headings } = withHeadingIds(withCurrentMonthYear(post.content));

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          articleSchema(post, author),
          faqSchema(post.faqs),
        ]}
      />

      <article>
        <div className="mx-auto max-w-[1240px] px-5">
          <Breadcrumbs crumbs={crumbs} />
        </div>

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <header className="bg-navy-dark text-white">
          <div className="mx-auto grid max-w-[1240px] items-center gap-8 px-5 py-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:py-14">
            <div>
              <p className="inline-block rounded-full bg-brand px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em]">
                {post.category}
              </p>
              <h1 className="mt-4 text-[2.1rem] font-extrabold leading-[1.12] tracking-tight sm:text-[2.75rem] lg:text-[3.1rem]">
                {post.title}
              </h1>
              <p className="mt-5 text-[18px] leading-relaxed text-white/85">{post.excerpt}</p>
              <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-white/20 pt-5 text-[14px] text-white/85">
                {author ? (
                  <Link href={`/team#${author.slug}`} className="group inline-flex items-center gap-2.5">
                    <Image
                      src={author.avatar}
                      alt={author.avatarAlt}
                      width={36}
                      height={36}
                      className="h-9 w-9 rounded-full object-cover ring-2 ring-white/30"
                    />
                    <span>
                      <span className="block font-bold text-white group-hover:underline">{author.name}</span>
                      <span className="block text-[12px] text-white/80">{author.role}</span>
                    </span>
                  </Link>
                ) : null}
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4" aria-hidden="true" />
                  {post.readTime} min read
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CalendarCheck className="h-4 w-4" aria-hidden="true" />
                  Updated{' '}
                  <time dateTime={toIsoDate(post.dateModified)}>{formatLongDate(post.dateModified)}</time>
                </span>
              </div>
            </div>
            <div className="relative aspect-[16/9] overflow-hidden rounded-card shadow-2xl shadow-black/30 ring-1 ring-white/15">
              <Image
                src={post.image}
                alt={post.imageAlt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 580px"
                className="object-cover"
              />
            </div>
          </div>
        </header>

        {/* ── Article + sidebar ────────────────────────────────────────── */}
        <div className="mx-auto grid max-w-[1240px] gap-12 px-5 py-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-14 lg:py-14">
          <div className="min-w-0">
            {headings.length > 1 ? (
              <details className="mb-8 rounded-card border border-line bg-surface-alt p-4 lg:hidden">
                <summary className="cursor-pointer text-[15px] font-bold text-ink">In this guide</summary>
                <ol className="mt-3 space-y-2 text-[14px]">
                  {headings.map((h) => (
                    <li key={h.id}>
                      <a href={`#${h.id}`} className="text-navy underline underline-offset-2">
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </details>
            ) : null}

            {post.pricing ? (
              <aside
                aria-label="Price context"
                className="mb-8 rounded-card border border-line bg-navy-soft p-5"
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

            <div className="prose-guide article-body" dangerouslySetInnerHTML={{ __html: html }} />

            <AdSlot slotId="post-end" className="my-10 !px-0" />

            <ul className="mt-10 flex flex-wrap items-center gap-2 border-t border-line pt-6">
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
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-5">
              {headings.length > 1 ? <ArticleToc headings={headings} /> : null}
              <div className="rounded-card bg-navy p-5 text-white">
                <p className="font-heading text-[17px] font-extrabold leading-snug">
                  Planning your order?
                </p>
                <ul className="mt-3 space-y-1 text-[14px]">
                  {SIDEBAR_LINKS.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="flex items-center justify-between gap-2 rounded-md py-1.5 font-semibold hover:underline"
                      >
                        {l.label}
                        <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>

        {/* ── Related ──────────────────────────────────────────────────── */}
        <section aria-labelledby="related-posts" className="border-t border-line bg-surface-alt">
          <div className="mx-auto max-w-[1240px] px-5 py-12">
            <h2
              id="related-posts"
              className="text-[1.75rem] font-extrabold tracking-tight text-navy-dark"
            >
              Keep reading
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <PostCard key={r.slug} post={r} />
              ))}
            </div>
          </div>
        </section>
      </article>
    </>
  );
}
