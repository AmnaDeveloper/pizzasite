import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  AlertTriangle,
  ArrowRight,
  CalendarCheck,
  Flame,
  Leaf,
  ShieldCheck,
  Store,
  Users,
} from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import MenuItemCard from '@/components/MenuItemCard';
import PriceNote from '@/components/PriceNote';
import FaqAccordion from '@/components/FaqAccordion';
import AdSlot from '@/components/AdSlot';
import JsonLd from '@/components/JsonLd';
import SizeValueChart from '@/components/SizeValueChart';
import { absoluteUrl, generatePageSEO } from '@/lib/seo-config';
import { breadcrumbSchema, faqSchema, menuItemSchema } from '@/lib/seo/schema';
import { getMenuItem, getRelatedMenuItems, menuSlugs } from '@/lib/content';
import {
  DIAMETER,
  cheapestRoute,
  generatedFaqs,
  isPizza,
  isPlural,
  money,
  pizzaRanking,
  quickAnswer,
  seoDescription,
  seoTitle,
  servingPlan,
  sizeOf,
  wholeLargeCalories,
} from '@/lib/menu-item-insights';
import { authors } from '@/data/authors';
import { BRAND, NOT_AFFILIATED_SHORT, SITE_URL } from '@/lib/site-config';
import { currentMonthYear, formatLongDate, toIsoDate } from '@/lib/utils/date';

/**
 * Date the item pages' content last genuinely changed. Shown on the page and
 * sent as dateModified — update it whenever prices or copy change, never just
 * to look fresh.
 */
const ITEMS_UPDATED = '2026-10-02';
const ITEMS_PUBLISHED = '2026-09-17';

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

  const name = item.title.toLowerCase();
  return generatePageSEO({
    title: seoTitle(item, currentMonthYear()),
    description: seoDescription(item),
    path: `/menus-prices/${item.slug}`,
    image: item.image,
    imageAlt: item.imageAlt,
    type: 'article',
    publishedTime: ITEMS_PUBLISHED,
    modifiedTime: ITEMS_UPDATED,
    keywords: [
      `dominos ${name} price`,
      `${BRAND.name.toLowerCase()} ${name} price`,
      `how much is a ${name} at dominos`,
      `dominos ${name} calories`,
      `dominos ${name} sizes`,
    ],
  });
}

const H2 = 'scroll-mt-32 text-2xl font-extrabold tracking-tight text-navy-dark sm:text-[1.75rem]';

export default async function MenuItemPage({ params }: Props) {
  const { slug } = await params;
  const item = getMenuItem(slug);
  if (!item) notFound();

  const url = absoluteUrl(`/menus-prices/${item.slug}`);
  const pizza = isPizza(item);
  const name = item.title.toLowerCase();
  const plural = isPlural(item);
  // "a pepperoni pizza", "the chicken alfredo pasta", "chicken wings".
  const theItem = plural ? name : `${pizza ? 'a' : 'the'} ${name}`;
  const related = getRelatedMenuItems(slug, 3);
  const route = cheapestRoute(item);
  const plan = servingPlan(item);
  const ranking = pizzaRanking(item);
  const rankIndex = ranking.findIndex((r) => r.current);
  const wholeCalories = wholeLargeCalories(item);

  // Ties matter: several pizzas share the lowest large price.
  const current = ranking[rankIndex];
  const cheapest = ranking[0];
  const tiedWith = current ? ranking.filter((r) => !r.current && r.large === current.large) : [];
  const cheaperCount = current ? ranking.filter((r) => r.large < current.large).length : 0;
  const compareSentence = !current
    ? ''
    : cheaperCount === 0
      ? `At ${money(current.large)} for a large it is the ${tiedWith.length ? 'joint-' : ''}cheapest pizza on the menu in our sample${
          tiedWith.length ? `, level with the ${tiedWith.map((t) => t.title.toLowerCase()).join(' and ')}` : ''
        } — the reference price every topping and specialty premium is measured against.`
      : `At ${money(current.large)} for a large, ${cheaperCount} of the ${ranking.length} pizzas in our sample cost less. It is ${money(
          current.large - cheapest.large,
        )} more than the cheapest large on the menu.`;
  const large = sizeOf(item, 'Large');
  const lowPrice = Math.min(...item.sizes.map((s) => s.price));
  const highPrice = Math.max(...item.sizes.map((s) => s.price));

  // Generated head-query FAQs first, then the item's own editorial FAQs.
  const faqs = [
    ...generatedFaqs(item),
    ...item.faqs.filter((f) => !/how many people/i.test(f.question) || !pizza),
  ];

  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Menu & Prices', path: '/menus-prices' },
    { name: item.title, path: `/menus-prices/${item.slug}` },
  ];

  const h1 = pizza
    ? `${BRAND.name} ${item.title}: Price, Sizes & Calories`
    : `${BRAND.name} ${item.title}: Price & Calories`;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${url}#article`,
    headline: h1,
    description: seoDescription(item),
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    about: { '@id': `${url}#item` },
    image: absoluteUrl(item.image),
    datePublished: ITEMS_PUBLISHED,
    dateModified: ITEMS_UPDATED,
    inLanguage: 'en-US',
    author: authors.map((a) => ({
      '@type': 'Person',
      name: a.name,
      jobTitle: a.role,
      url: absoluteUrl(`/team#${a.slug}`),
    })),
    publisher: { '@id': `${SITE_URL}/#organization` },
  };

  const jump = [
    { href: '#prices', label: 'Prices by size' },
    ...(pizza ? [{ href: '#best-size', label: 'Best-value size' }] : []),
    ...(route ? [{ href: '#cheapest', label: 'Cheapest way to buy' }] : []),
    ...(plan.length ? [{ href: '#how-many', label: 'How many to order' }] : []),
    { href: '#nutrition', label: 'Calories & allergens' },
    { href: '#faq', label: 'FAQ' },
  ];

  return (
    <>
      <JsonLd
        data={[
          articleSchema,
          menuItemSchema(item),
          breadcrumbSchema(crumbs),
          faqSchema(faqs),
        ]}
      />

      <div className="mx-auto max-w-5xl px-4">
        <Breadcrumbs crumbs={crumbs} />
      </div>

      <article className="mx-auto max-w-5xl px-4 pb-16">
        {/* ── Header ───────────────────────────────────────────────────── */}
        <header>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/menus-prices"
              className="rounded-full bg-navy-soft px-3 py-1 text-[12px] font-bold uppercase tracking-wide text-navy-dark hover:bg-navy hover:text-white"
            >
              {item.category}
            </Link>
            {item.popular ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-[12px] font-bold uppercase tracking-wide text-brand-dark">
                <Flame className="h-3 w-3" aria-hidden="true" />
                Frequently ordered
              </span>
            ) : null}
          </div>
          <h1 className="mt-3 text-[2.1rem] font-extrabold leading-[1.1] tracking-tight text-ink sm:text-[2.6rem]">
            {h1}
          </h1>
          <p className="mt-3 max-w-2xl text-[17px] leading-relaxed text-ink-muted">
            {item.description}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] font-medium text-ink-muted">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-navy" aria-hidden="true" />
              By{' '}
              {authors.map((a, i) => (
                <span key={a.slug}>
                  {i > 0 ? ' & ' : ''}
                  <Link href={`/team#${a.slug}`} className="font-semibold text-navy hover:underline">
                    {a.name}
                  </Link>
                </span>
              ))}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarCheck className="h-4 w-4 text-navy" aria-hidden="true" />
              Prices last checked{' '}
              <time dateTime={toIsoDate(ITEMS_UPDATED)}>{formatLongDate(ITEMS_UPDATED)}</time>
            </span>
          </div>
        </header>

        {/* ── Quick answer + image ─────────────────────────────────────── */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_1fr]">
          <div className="relative order-2 aspect-[3/2] overflow-hidden rounded-card border border-line lg:order-1">
            <Image
              src={item.image}
              alt={item.imageAlt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 520px"
              className="object-cover"
            />
          </div>

          <section
            aria-labelledby="quick-answer"
            className="order-1 flex flex-col rounded-card bg-navy p-6 text-white lg:order-2"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/80">
              Quick answer
            </p>
            <h2 id="quick-answer" className="mt-1.5 text-xl font-extrabold leading-snug">
              How much {plural ? 'are' : 'is'} {plural ? '' : pizza ? 'a ' : 'the '}
              {BRAND.name} {name}?
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-white/90">{quickAnswer(item)}</p>
            <dl className="mt-auto grid grid-cols-3 gap-2 pt-5 text-center">
              <div className="rounded-md bg-white/10 px-2 py-3">
                <dt className="text-[11px] font-bold uppercase tracking-wide text-white/80">
                  {pizza ? 'Large' : 'From'}
                </dt>
                <dd className="mt-1 text-xl font-black tabular-nums">
                  {money(pizza && large ? large.price : lowPrice)}
                </dd>
              </div>
              <div className="rounded-md bg-white/10 px-2 py-3">
                <dt className="text-[11px] font-bold uppercase tracking-wide text-white/80">
                  {route ? 'On a deal' : 'Up to'}
                </dt>
                <dd className="mt-1 text-xl font-black tabular-nums">
                  {money(route ? route.dealPrice : highPrice)}
                </dd>
              </div>
              <div className="rounded-md bg-white/10 px-2 py-3">
                <dt className="text-[11px] font-bold uppercase tracking-wide text-white/80">
                  Calories
                </dt>
                <dd className="mt-1 text-xl font-black tabular-nums">{item.calories}</dd>
              </div>
            </dl>
            <p className="mt-2 text-[12px] leading-snug text-white/80">{item.caloriesNote}</p>
          </section>
        </div>

        {/* ── On this page ─────────────────────────────────────────────── */}
        <nav aria-label="On this page" className="mt-8">
          <ul className="flex flex-wrap gap-1 rounded-card border border-line bg-surface-alt p-1.5 sm:rounded-full">
            {jump.map((j) => (
              <li key={j.href}>
                <a
                  href={j.href}
                  className="inline-block rounded-full px-3.5 py-1.5 text-[13px] font-semibold text-ink transition-colors hover:bg-surface hover:text-navy"
                >
                  {j.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* ── Prices by size ───────────────────────────────────────────── */}
        <section aria-labelledby="prices" className="mt-12">
          <h2 id="prices" className={H2}>
            {BRAND.name} {name} prices by size
          </h2>
          <div className="table-scroll mt-5 overflow-hidden rounded-card border border-line">
            <table className="w-full text-[15px]">
              <caption className="sr-only">
                Example {BRAND.name} prices by size for the {name}
              </caption>
              <thead>
                <tr className="bg-navy text-left text-[11px] uppercase tracking-wide text-white">
                  <th scope="col" className="px-4 py-3 font-bold">Size</th>
                  <th scope="col" className="px-4 py-3 font-bold">Detail</th>
                  {pizza ? (
                    <th scope="col" className="px-3 py-3 text-right font-bold">Slices</th>
                  ) : null}
                  <th scope="col" className="px-4 py-3 text-right font-bold">Example price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {item.sizes.map((size) => (
                  <tr key={size.name} className="odd:bg-surface even:bg-surface-alt">
                    <th scope="row" className="px-4 py-3.5 text-left font-bold text-ink">
                      {size.name}
                    </th>
                    <td className="px-4 py-3.5 text-ink-muted">{size.detail}</td>
                    {/* No per-slice price: slice size differs by pizza size, so it
                        contradicts the per-square-inch value table below. */}
                    {pizza ? (
                      <td className="px-3 py-3.5 text-right tabular-nums text-ink-muted">
                        {size.slices ?? '—'}
                      </td>
                    ) : null}
                    <td className="px-4 py-3.5 text-right text-[16px] font-extrabold tabular-nums text-brand">
                      {money(size.price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <PriceNote className="mt-3" />
          <p className="mt-3 text-[14px] leading-relaxed text-ink-muted">
            Prices come from a rolling sample of stores. {BRAND.name} is largely run by
            franchisees who set their own prices, so your store may charge a little more or
            less — compare items against each other here, then confirm the total at
            checkout. See the{' '}
            <Link href="/menus-prices" className="font-semibold text-navy underline underline-offset-2">
              full {BRAND.name} menu with prices
            </Link>
            .
          </p>
        </section>

        {/* ── Best-value size (pizzas) ─────────────────────────────────── */}
        {pizza ? (
          <section aria-labelledby="best-size" className="mt-14">
            <h2 id="best-size" className={H2}>
              Which size {name} is the best value?
            </h2>
            <p className="mt-3 max-w-3xl text-[16px] leading-relaxed text-ink-muted">
              Pizza is priced by diameter but eaten by area, so every step up the size
              ladder buys more pizza per dollar. Here is the {name} priced per square inch.
            </p>
            <div className="mt-5">
              <SizeValueChart item={item} />
            </div>
            <p className="mt-3 text-[14px] leading-relaxed text-ink-muted">
              Need more food? Size up before adding a second pizza — it is almost always the
              cheaper way to get more.{' '}
              <Link
                href="/posts/large-vs-medium-pizza-value"
                className="font-semibold text-navy underline underline-offset-2"
              >
                Large vs medium, worked through
              </Link>
              .
            </p>
          </section>
        ) : null}

        {/* ── Cheapest way to buy it ───────────────────────────────────── */}
        {route ? (
          <section aria-labelledby="cheapest" className="mt-14">
            <h2 id="cheapest" className={H2}>
              The cheapest way to buy {theItem}
            </h2>
            <div className="mt-5 grid gap-5 rounded-card border border-brand/30 bg-brand-soft/60 p-5 sm:grid-cols-[auto_1fr] sm:items-center sm:p-6">
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand text-white">
                  <Store className="h-6 w-6" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-[12px] font-bold uppercase tracking-wide text-brand-dark">
                    {route.dealName}
                  </p>
                  <p className="text-[2rem] font-black leading-none tabular-nums text-brand">
                    {money(route.dealPrice)}
                  </p>
                  <p className="mt-1 text-[13px] text-ink-muted">
                    vs <span className="line-through">{money(route.menuPrice)}</span> at menu price
                  </p>
                </div>
              </div>
              <div className="sm:border-l sm:border-brand/25 sm:pl-6">
                <p className="text-[16px] font-extrabold text-ink">
                  Saves {money(route.saving)} ({route.savingPct}%) on a {route.sizeLabel}
                </p>
                <p className="mt-1.5 text-[15px] leading-relaxed text-ink-muted">{route.how}</p>
                <p className="mt-2 text-[13px] text-ink-muted">
                  Example deal price — participation is store by store.{' '}
                  <Link href={`/coupons#${route.couponId}`} className="font-semibold text-navy underline underline-offset-2">
                    How this deal works
                  </Link>
                </p>
              </div>
            </div>
          </section>
        ) : null}

        {/* ── How many to order (pizzas) ───────────────────────────────── */}
        {plan.length && large ? (
          <section aria-labelledby="how-many" className="mt-14">
            <h2 id="how-many" className={H2}>
              How many {name}s to order for a group
            </h2>
            <p className="mt-3 max-w-3xl text-[16px] leading-relaxed text-ink-muted">
              Plan on three slices per adult when pizza is the whole meal. A large is cut
              into {large.slices} slices, so this is how many larges you need — and what
              they cost at menu price versus on the carryout deal.
            </p>
            <div className="table-scroll mt-5 overflow-hidden rounded-card border border-line">
              <table className="w-full min-w-[30rem] text-[15px]">
                <caption className="sr-only">
                  Number of large {name}s and cost by group size
                </caption>
                <thead>
                  <tr className="bg-navy text-left text-[11px] uppercase tracking-wide text-white">
                    <th scope="col" className="px-4 py-3 font-bold">People</th>
                    <th scope="col" className="px-3 py-3 text-right font-bold">Large pizzas</th>
                    <th scope="col" className="px-3 py-3 text-right font-bold">Slices</th>
                    <th scope="col" className="px-3 py-3 text-right font-bold">Menu price</th>
                    {route ? (
                      <th scope="col" className="px-4 py-3 text-right font-bold">On carryout deal</th>
                    ) : null}
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {plan.map((p) => (
                    <tr key={p.people} className="odd:bg-surface even:bg-surface-alt">
                      <th scope="row" className="px-4 py-3 text-left font-semibold text-ink">
                        <span className="inline-flex items-center gap-2">
                          <Users className="h-4 w-4 text-navy" aria-hidden="true" />
                          {p.people} people
                        </span>
                      </th>
                      <td className="px-3 py-3 text-right font-bold tabular-nums text-ink">{p.pizzas}</td>
                      <td className="px-3 py-3 text-right tabular-nums text-ink-muted">{p.slices}</td>
                      <td className="px-3 py-3 text-right tabular-nums text-ink">{money(p.menuCost)}</td>
                      {route && p.dealCost !== null ? (
                        <td className="px-4 py-3 text-right font-extrabold tabular-nums text-brand">
                          {money(p.dealCost)}
                        </td>
                      ) : null}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-[14px] leading-relaxed text-ink-muted">
              Adding sides? Drop to two slices per adult and you can usually order one pizza
              fewer. For eight or more people a bundle is often cheaper still —{' '}
              <Link
                href="/posts/group-ordering-pizza-for-a-party"
                className="font-semibold text-navy underline underline-offset-2"
              >
                our group ordering guide
              </Link>{' '}
              works through it.
            </p>
          </section>
        ) : null}

        {/* ── Editorial notes ──────────────────────────────────────────── */}
        <section aria-label={`About the ${name}`} className="mt-14">
          <div
            className="prose-guide max-w-3xl"
            dangerouslySetInnerHTML={{ __html: item.fullContent }}
          />
        </section>

        <AdSlot slotId="menu-item-mid" className="my-10 !px-0" />

        {/* ── Price compared with other pizzas ─────────────────────────── */}
        {ranking.length > 1 && rankIndex >= 0 ? (
          <section aria-labelledby="compare" className="mt-14">
            <h2 id="compare" className={H2}>
              How the {name} compares with other {BRAND.name} pizzas
            </h2>
            <p className="mt-3 max-w-3xl text-[16px] leading-relaxed text-ink-muted">
              {compareSentence}
            </p>
            <ol className="mt-5 grid gap-2 sm:grid-cols-2">
              {ranking.map((r, i) => (
                <li key={r.slug}>
                  <Link
                    href={`/menus-prices/${r.slug}`}
                    aria-current={r.current ? 'page' : undefined}
                    className={`flex items-center justify-between gap-3 rounded-md border px-4 py-2.5 text-[15px] transition-colors ${
                      r.current
                        ? 'border-brand bg-brand-soft font-extrabold text-brand-dark'
                        : 'border-line bg-surface text-ink hover:border-navy hover:text-navy'
                    }`}
                  >
                    <span>
                      <span className="mr-2 text-[12px] font-bold text-ink-muted">{i + 1}.</span>
                      {r.title}
                    </span>
                    <span className="font-bold tabular-nums">{money(r.large)}</span>
                  </Link>
                </li>
              ))}
            </ol>
            <p className="mt-2 text-[13px] text-ink-muted">Large ({DIAMETER.Large}″) example prices.</p>
          </section>
        ) : null}

        {/* ── Nutrition & allergens ────────────────────────────────────── */}
        <section aria-labelledby="nutrition" className="mt-14">
          <h2 id="nutrition" className={H2}>
            {BRAND.name} {name} calories, ingredients & allergens
          </h2>
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            <div className="rounded-card border border-line bg-surface p-5">
              <h3 className="flex items-center gap-2 text-lg font-extrabold text-navy-dark">
                <Flame className="h-5 w-5" aria-hidden="true" />
                Calories
              </h3>
              <p className="mt-3 text-[2rem] font-black leading-none tabular-nums text-ink">
                {item.calories}
              </p>
              <p className="mt-1.5 text-[13px] leading-snug text-ink-muted">{item.caloriesNote}</p>
              {wholeCalories ? (
                <p className="mt-3 border-t border-line pt-3 text-[14px] text-ink">
                  Whole large: about <strong>{wholeCalories.toLocaleString('en-US')}</strong>{' '}
                  calories
                </p>
              ) : null}
              <Link
                href="/posts/pizza-calories-and-nutrition-guide"
                className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-bold text-navy hover:text-brand"
              >
                What changes the number
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="rounded-card border border-line bg-surface p-5">
              <h3 className="flex items-center gap-2 text-lg font-extrabold text-navy-dark">
                <Leaf className="h-5 w-5" aria-hidden="true" />
                Ingredients
              </h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {item.ingredients.map((ing) => (
                  <li key={ing} className="rounded-full bg-surface-alt px-3 py-1 text-sm text-ink">
                    {ing}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[12px] leading-snug text-ink-muted">
                Formulations differ by region and change without notice. Confirm current
                ingredient information with {BRAND.officialAppNote} before ordering.
              </p>
            </div>

            <div className="rounded-card border border-brand/30 bg-brand-soft p-5">
              <h3 className="flex items-center gap-2 text-lg font-extrabold text-brand-dark">
                <AlertTriangle className="h-5 w-5" aria-hidden="true" />
                Allergens
              </h3>
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
                A shared pizza kitchen cannot rule out cross-contact. With a severe allergy
                or coeliac disease, speak to the store directly — see our{' '}
                <Link href="/posts/gluten-free-pizza-options-guide" className="underline">
                  gluten-free guide
                </Link>
                .
              </p>
            </div>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────── */}
        <section aria-labelledby="faq" className="mt-14">
          <h2 id="faq" className={H2}>
            {BRAND.name} {name}: questions people ask
          </h2>
          <FaqAccordion faqs={faqs} headingId={`faq-${item.slug}`} className="mt-5" labelledBy="faq" />
        </section>

        {/* ── Related ──────────────────────────────────────────────────── */}
        <section aria-labelledby="related" className="mt-14">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 id="related" className={H2}>
              {pizza ? 'Other pizzas to compare' : 'Related items'}
            </h2>
            <Link
              href="/menus-prices"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-navy hover:text-brand"
            >
              Full menu with prices
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <MenuItemCard key={r.id} item={r} />
            ))}
          </div>
          <ul className="mt-6 flex flex-wrap gap-2 text-[14px]">
            {[
              { href: '/coupons', label: `${BRAND.name} coupons & deals compared` },
              { href: '/posts/hand-tossed-vs-thin-crust-vs-pan', label: 'Hand tossed vs thin vs pan' },
              { href: '/posts/carryout-vs-delivery-which-is-cheaper', label: 'Carryout vs delivery cost' },
            ].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-1.5 font-semibold text-ink hover:border-navy hover:text-navy"
                >
                  {l.label}
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-10 rounded-card border border-line bg-surface-alt p-4 text-[13px] leading-relaxed text-ink-muted">
          {NOT_AFFILIATED_SHORT} This page describes an item on a publicly available menu
          for the purpose of consumer information.
        </p>
      </article>
    </>
  );
}
