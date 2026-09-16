import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Star, Flame, AlertTriangle, Leaf, ArrowRight } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import MenuItemCard from '@/components/MenuItemCard';
import PriceNote from '@/components/PriceNote';
import LastUpdated from '@/components/LastUpdated';
import FaqAccordion from '@/components/FaqAccordion';
import AdSlot from '@/components/AdSlot';
import JsonLd from '@/components/JsonLd';
import { generatePageSEO } from '@/lib/seo-config';
import { breadcrumbSchema, faqSchema, menuItemSchema } from '@/lib/seo/schema';
import { getMenuItem, getRelatedMenuItems, menuSlugs } from '@/lib/content';
import { BRAND, CURRENCY_SYMBOL, NOT_AFFILIATED_SHORT } from '@/lib/site-config';
import { currentMonthYear } from '@/lib/utils/date';

/** Statically generate every menu item at build time. */
export function generateStaticParams() {
  return menuSlugs.map((slug) => ({ slug }));
}

/** Re-render at most once a day so the month in the title stays current. */
export const revalidate = 86400;
export const dynamicParams = false;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = getMenuItem(slug);
  if (!item) return { title: 'Item not found' };

  return generatePageSEO({
    title: `${item.title} Price & Calories (${currentMonthYear()})`,
    description: `${item.description} Example prices from ${CURRENCY_SYMBOL}${item.price.toFixed(
      2,
    )}, ${item.calories} calories, full ingredient and allergen list.`,
    path: `/menus-prices/${item.slug}`,
    image: item.image,
    imageAlt: item.imageAlt,
    keywords: [
      `${item.title.toLowerCase()} price`,
      `${item.title.toLowerCase()} calories`,
      'pizza menu prices',
      'pizza allergens',
    ],
  });
}

export default async function MenuItemPage({ params }: Props) {
  const { slug } = await params;
  const item = getMenuItem(slug);
  if (!item) notFound();

  const related = getRelatedMenuItems(slug, 3);
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Menu & Prices', path: '/menus-prices' },
    { name: item.title, path: `/menus-prices/${item.slug}` },
  ];

  const highestPrice = Math.max(...item.sizes.map((s) => s.price));

  return (
    <>
      <JsonLd
        data={[breadcrumbSchema(crumbs), menuItemSchema(item), faqSchema(item.faqs)]}
      />

      <div className="mx-auto max-w-5xl px-4">
        <Breadcrumbs crumbs={crumbs} />
      </div>

      <article className="mx-auto max-w-5xl px-4 pb-16">
        <header>
          <p className="text-[12px] font-bold uppercase tracking-wide text-navy">
            {item.category}
          </p>
          <h1 className="mt-1.5 text-4xl font-extrabold leading-tight tracking-tight text-ink">
            {item.title}
          </h1>
          <p className="mt-3 max-w-2xl text-[17px] leading-relaxed text-ink-muted">
            {item.description}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            <span className="inline-flex items-center gap-1.5 font-semibold text-ink">
              <Star className="h-4 w-4 fill-brand text-brand" aria-hidden="true" />
              {item.rating.toFixed(1)} / 5
              <span className="font-normal text-ink-muted">
                ({item.reviewCount} reader ratings)
              </span>
            </span>
            {item.popular ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-2.5 py-1 text-[12px] font-bold uppercase tracking-wide text-brand-dark">
                <Flame className="h-3 w-3" aria-hidden="true" />
                Frequently ordered
              </span>
            ) : null}
            <LastUpdated />
          </div>
        </header>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          <div className="relative aspect-[3/2] overflow-hidden rounded-card border border-line">
            <Image
              src={item.image}
              alt={item.imageAlt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover"
            />
          </div>

          <div className="rounded-card border border-line bg-surface-alt p-5">
            <h2 className="text-lg font-extrabold text-navy-dark">
              Sizes and example prices
            </h2>
            <div className="mt-3 overflow-hidden rounded-md border border-line bg-surface">
              <table className="w-full text-sm">
                <caption className="sr-only">
                  Example prices by size for {item.title}
                </caption>
                <thead>
                  <tr className="bg-navy-soft text-left text-[12px] uppercase tracking-wide text-navy-dark">
                    <th scope="col" className="px-3 py-2 font-bold">
                      Size
                    </th>
                    <th scope="col" className="px-3 py-2 font-bold">
                      Detail
                    </th>
                    <th scope="col" className="px-3 py-2 text-right font-bold">
                      Example
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {item.sizes.map((size) => (
                    <tr key={size.name}>
                      <th scope="row" className="px-3 py-2.5 text-left font-bold text-ink">
                        {size.name}
                      </th>
                      <td className="px-3 py-2.5 text-ink-muted">
                        {size.detail}
                        {size.slices ? ` · ${size.slices} slices` : ''}
                      </td>
                      <td className="px-3 py-2.5 text-right font-extrabold text-brand">
                        {CURRENCY_SYMBOL}
                        {size.price.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <PriceNote className="mt-3" />

            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-md bg-surface p-3">
                <dt className="text-[12px] font-bold uppercase tracking-wide text-ink-muted">
                  Example range
                </dt>
                <dd className="mt-0.5 text-lg font-extrabold text-ink">
                  {CURRENCY_SYMBOL}
                  {item.price.toFixed(2)} – {CURRENCY_SYMBOL}
                  {highestPrice.toFixed(2)}
                </dd>
              </div>
              <div className="rounded-md bg-surface p-3">
                <dt className="text-[12px] font-bold uppercase tracking-wide text-ink-muted">
                  Calories
                </dt>
                <dd className="mt-0.5 text-lg font-extrabold text-ink">{item.calories}</dd>
              </div>
            </dl>
            <p className="mt-2 text-[12px] leading-snug text-ink-muted">
              {item.caloriesNote}
            </p>
          </div>
        </div>

        <div
          className="prose-guide mt-10 max-w-3xl"
          dangerouslySetInnerHTML={{ __html: item.fullContent }}
        />

        <AdSlot slotId="menu-item-mid" className="my-10 !px-0" />

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          <section
            aria-labelledby="ingredients"
            className="rounded-card border border-line bg-surface p-5"
          >
            <h2
              id="ingredients"
              className="flex items-center gap-2 text-lg font-extrabold text-navy-dark"
            >
              <Leaf className="h-5 w-5" aria-hidden="true" />
              Ingredients
            </h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {item.ingredients.map((ing) => (
                <li
                  key={ing}
                  className="rounded-full bg-surface-alt px-3 py-1 text-sm text-ink"
                >
                  {ing}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[12px] leading-snug text-ink-muted">
              Formulations differ by region and change without notice. Confirm current
              ingredient information with {BRAND.officialAppNote} before ordering.
            </p>
          </section>

          <section
            aria-labelledby="allergens"
            className="rounded-card border border-brand/30 bg-brand-soft p-5"
          >
            <h2
              id="allergens"
              className="flex items-center gap-2 text-lg font-extrabold text-brand-dark"
            >
              <AlertTriangle className="h-5 w-5" aria-hidden="true" />
              Allergen information
            </h2>
            {item.allergens.length ? (
              <ul className="mt-3 flex flex-wrap gap-2">
                {item.allergens.map((a) => (
                  <li
                    key={a}
                    className="rounded-full bg-surface px-3 py-1 text-sm font-semibold text-brand-dark"
                  >
                    {a}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-brand-dark">
                No major allergens are listed for this item.
              </p>
            )}
            <p className="mt-3 text-[13px] leading-snug text-brand-dark">
              A shared pizza kitchen cannot rule out cross-contact. If you have a severe
              allergy or coeliac disease, speak to the store directly and treat this list
              as a starting point rather than a guarantee. See our{' '}
              <Link href="/posts/gluten-free-pizza-options-guide" className="underline">
                gluten-free guide
              </Link>{' '}
              for why that distinction matters.
            </p>
          </section>
        </div>

        <FaqAccordion faqs={item.faqs} headingId={`faq-${item.slug}`} />

        <section aria-labelledby="related" className="mt-14">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2
              id="related"
              className="text-2xl font-extrabold tracking-tight text-navy-dark"
            >
              Related items
            </h2>
            <Link
              href="/menus-prices"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-navy hover:text-brand"
            >
              Back to the full menu
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <MenuItemCard key={r.id} item={r} />
            ))}
          </div>
        </section>

        <p className="mt-10 rounded-card border border-line bg-surface-alt p-4 text-[13px] leading-relaxed text-ink-muted">
          {NOT_AFFILIATED_SHORT} This page describes an item on a publicly available menu
          for the purpose of consumer information.
        </p>
      </article>
    </>
  );
}
