import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Calculator,
  CalendarCheck,
  Gift,
  House,
  Info,
  ListChecks,
  Mail,
  PartyPopper,
  Percent,
  Repeat,
  Search,
  ShieldCheck,
  ShoppingBasket,
  Star,
  Store,
  Ticket,
  TriangleAlert,
  Truck,
  User,
  Users,
} from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import CouponsClient, { type CouponSaving } from '@/components/CouponsClient';
import FaqAccordion from '@/components/FaqAccordion';
import PostCard from '@/components/PostCard';
import AdSlot from '@/components/AdSlot';
import JsonLd from '@/components/JsonLd';
import PriceNote from '@/components/PriceNote';
import { absoluteUrl, generatePageSEO } from '@/lib/seo-config';
import { breadcrumbSchema, faqSchema } from '@/lib/seo/schema';
import { getDealValues, percentageVersusBundle } from '@/lib/deal-values';
import { authors } from '@/data/authors';
import { coupons } from '@/data/coupons';
import { BRAND, CURRENCY_SYMBOL, SITE_NAME, SITE_URL } from '@/lib/site-config';
import { currentMonthYear, formatLongDate, toIsoDate } from '@/lib/utils/date';
import { getPost } from '@/lib/content';
import type { Post } from '@/data/types';

/** Date this page's content last genuinely changed — update it with the content. */
const PAGE_UPDATED = '2026-10-02';
const PAGE_PUBLISHED = '2026-09-17';

const money = (n: number) => `${CURRENCY_SYMBOL}${n.toFixed(2)}`;

const CRUMBS = [
  { name: 'Home', path: '/' },
  { name: 'Coupons & Deals', path: '/coupons' },
];

/*
 * Worked values are computed once at module level so the takeaways, tables,
 * cards and FAQ answers all quote identical figures.
 */
const DEAL_VALUES = getDealValues();
const byId = (id: string) => DEAL_VALUES.find((d) => d.coupon.id === id);
const carryout = byId('cpn-carryout-deal');
const mixMatch = byId('cpn-mix-match');
const family = byId('cpn-family-bundle');
const party = byId('cpn-group-order');
const pctVsBundle = percentageVersusBundle(25);

const SAVINGS: Record<string, CouponSaving> = Object.fromEntries(
  DEAL_VALUES.map((d) => [d.coupon.id, { saving: d.saving, savingPct: d.savingPct }]),
);

/** Situation → deal. The quick answer most searchers are actually after. */
const BEST_BY_SITUATION = [
  {
    situation: 'One or two people, you can collect',
    couponId: 'cpn-carryout-deal',
    icon: User,
    why: 'Lowest price per pizza, and no delivery fee or tip.',
  },
  {
    situation: 'Two people who want a pizza and something else',
    couponId: 'cpn-mix-match',
    icon: Users,
    why: 'Each qualifying item drops to one flat price.',
  },
  {
    situation: 'One pizza, delivered',
    couponId: 'cpn-large-3-topping',
    icon: Truck,
    why: 'Fixed price on a large; fee and tip are still added.',
  },
  {
    situation: 'Family of four to six',
    couponId: 'cpn-family-bundle',
    icon: House,
    why: 'Two large pizzas, a side and a drink for one price.',
  },
  {
    situation: 'Party of eight to twelve',
    couponId: 'cpn-group-order',
    icon: PartyPopper,
    why: 'Lowest cost per person of any offer type.',
  },
  {
    situation: 'Big order that no bundle fits',
    couponId: 'cpn-online-only',
    icon: ShoppingBasket,
    why: 'A percentage off grows with the basket.',
  },
];

const COUPON_FAQS = [
  {
    question: `Does ${BRAND.name} have a $7.99 deal?`,
    answer: `A flat-rate carryout offer on a large pizza, commonly around $7.99 with any toppings, is the offer type to look for. In our worked example it saves ${carryout ? money(carryout.saving) : 'about $8.50'} against a large pepperoni at menu price, before you count the delivery fee and tip you also avoid. Participation is decided store by store, so check your own store's deals page after entering your address.`,
  },
  {
    question: `What is the ${BRAND.name} Mix & Match deal?`,
    answer: `You pick two or more items from a qualifying list — a medium pizza, a pasta, a sandwich, a side — and each one drops to a flat price, commonly around $6.99 each. In our example, a medium pepperoni plus a chicken alfredo pasta costs ${mixMatch ? money(mixMatch.menuPrice) : 'about $22.48'} at menu price and ${mixMatch ? money(mixMatch.dealPrice) : '$13.98'} on the deal. It only applies when every item is on the qualifying list.`,
  },
  {
    question: `How do I get ${BRAND.name} coupons that actually work?`,
    answer:
      'Enter your address on the official site or app and open the deals page for your store — that list is the only reliable source, because franchise stores opt into promotions individually. Then sign up for the email list and the rewards programme, which is where targeted codes are sent. Most codes on coupon aggregator sites are expired.',
  },
  {
    question: `Why is my ${BRAND.name} coupon code not working?`,
    answer:
      'The usual reasons, in order: your store is not taking part in that promotion; you are in delivery mode on a carryout-only offer; one item in your basket is not on the qualifying list; the code was a targeted one tied to someone else’s account; or it has simply expired. Switching between carryout and delivery and re-checking the qualifying list fixes most of them.',
  },
  {
    question: `Which ${BRAND.name} deal saves the most money?`,
    answer: `By percentage, the flat-rate carryout large — about ${carryout?.savingPct ?? 52}% off menu price in our example. By cost per person, the party pack — about ${party ? money(party.perPerson) : '$5.00'} a head for ten people. For a family of four to six, the two-pizza bundle works out at about ${family ? money(family.perPerson) : '$6.00'} per person.`,
  },
  {
    question: `Can I combine two ${BRAND.name} deals on one order?`,
    answer:
      'Very rarely. A percentage discount and a bundle price compete, and the checkout keeps whichever is cheaper. The one reliable exception is a loyalty redemption, which comes off your account rather than out of the basket and therefore usually applies on top of a deal price.',
  },
  {
    question: `Do ${BRAND.name} deals work for delivery?`,
    answer:
      'Many do, but the best-value ones are often carryout-only, and every delivery order adds a delivery fee and a tip that the deal does not cover. Compare the final checkout total, not the tile price — a deal that is cheaper on the tile can be dearer once the fee is added.',
  },
  {
    question: 'Are the deals on this page live promotional codes?',
    answer:
      'No. This page explains the offer types that run again and again, with typical prices and worked savings. We deliberately do not list codes: live offers differ by store and change constantly, and the only reliable list is your own store’s deals page on the official site or app.',
  },
  {
    question: 'Why does a nationally advertised deal not appear at my store?',
    answer:
      'Because participation is decided store by store. Franchisees absorb the cost of a discount, so a promotion advertised nationally is live only at the stores that opted in. If it is not on your store deals page, no code will make it appear.',
  },
  {
    question: 'How do I get the most out of a flat-price deal?',
    answer:
      'Put the most expensive qualifying item into the slot. A fixed price buys a plain cheese pizza or a fully loaded one equally, so choose the item that extracts the most from the price rather than the one you would normally order.',
  },
];

const RELATED_SLUGS = [
  'best-pizza-deals-this-month',
  'mix-and-match-deal-explained',
  'how-to-save-money-on-pizza-delivery',
];
const relatedPosts = RELATED_SLUGS.map((slug) => getPost(slug)).filter((p): p is Post => Boolean(p));

const JUMP_LINKS = [
  { href: '#best-deal', label: 'Best deal by situation' },
  { href: '#deal-math', label: 'What each deal saves' },
  { href: '#deal-types', label: 'All 12 deal types' },
  { href: '#find-codes', label: 'Finding codes that work' },
  { href: '#how-to-read', label: 'Spotting a bad deal' },
  { href: '#faq', label: 'FAQ' },
];

const TITLE = `${BRAND.name} Coupons & Deals (${currentMonthYear()})`;
const DESCRIPTION =
  `Which ${BRAND.name} deal saves the most? 12 deal types compared with worked savings — ` +
  '$7.99 carryout, Mix & Match, bundles — and how to find codes that work.';

/*
 * Title is ~40 characters so the " | Slice & Save" suffix still fits inside
 * Google's display width; the description stays under 155 characters.
 */
export const metadata: Metadata = generatePageSEO({
  title: TITLE,
  description: DESCRIPTION,
  path: '/coupons',
  image: '/images/coupons-hero.jpg',
  imageAlt: `${BRAND.name} coupons and deal types compared`,
  keywords: [
    'dominos coupons',
    'dominos deals',
    'dominos coupon codes',
    'dominos 7.99 deal',
    'dominos mix and match deal',
    'dominos carryout deal',
    'best dominos deal',
  ],
});

const SECTION_HEADING =
  'scroll-mt-32 text-[1.75rem] font-extrabold leading-tight tracking-tight text-navy-dark sm:text-[2rem]';

export default function CouponsPage() {
  const url = absoluteUrl('/coupons');

  // Article markup ties the page to the people who research it (E-E-A-T) and
  // states its real publish and update dates.
  const pageSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${url}#article`,
    headline: `${BRAND.name} coupons and deals: which one actually saves you money`,
    description: DESCRIPTION,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    datePublished: PAGE_PUBLISHED,
    dateModified: PAGE_UPDATED,
    inLanguage: 'en-US',
    image: absoluteUrl('/images/coupons-hero.jpg'),
    author: authors.map((a) => ({
      '@type': 'Person',
      name: a.name,
      jobTitle: a.role,
      url: absoluteUrl(`/team#${a.slug}`),
    })),
    publisher: { '@id': `${SITE_URL}/#organization` },
    about: { '@type': 'Thing', name: `${BRAND.name} coupons and deals` },
  };

  return (
    <>
      <JsonLd data={[pageSchema, breadcrumbSchema(CRUMBS), faqSchema(COUPON_FAQS)]} />

      <div className="mx-auto max-w-6xl px-4">
        <Breadcrumbs crumbs={CRUMBS} />
      </div>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <header className="relative overflow-hidden bg-navy text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(50rem_30rem_at_85%_0%,rgba(255,255,255,0.14),transparent_60%)]"
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:py-16 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-brand px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.1em]">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-white" />
              Updated {currentMonthYear()}
            </p>
            <h1 className="mt-5 text-[2.35rem] font-black leading-[1.05] tracking-tight sm:text-[3.1rem]">
              {BRAND.name}{' '}
              <span className="relative whitespace-nowrap">
                coupons & deals
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 -bottom-1 h-1.5 rounded-full bg-brand sm:h-2"
                />
              </span>
              : which one actually saves you money
            </h1>
            <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-white/85">
              Promotions rotate every few weeks, but the deal structures underneath them
              barely change. We priced the same food at menu price and on each deal, so you
              can see what every offer type really saves — and which one fits the order
              you’re about to place.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#best-deal"
                className="inline-flex items-center gap-2 rounded-md bg-brand px-5 py-3 text-[15px] font-bold text-white shadow-lg shadow-black/15 transition-colors hover:bg-brand-dark"
              >
                Find my best deal
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href="#deal-math"
                className="inline-flex items-center gap-2 rounded-md border border-white/45 bg-white/5 px-5 py-3 text-[15px] font-bold text-white transition-colors hover:bg-white/15"
              >
                See what each deal saves
              </a>
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] font-medium text-white/80">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                By{' '}
                {authors.map((a, i) => (
                  <span key={a.slug}>
                    {i > 0 ? ' & ' : ''}
                    <Link
                      href={`/team#${a.slug}`}
                      className="font-semibold text-white underline decoration-white/40 underline-offset-2 hover:decoration-white"
                    >
                      {a.name}
                    </Link>
                  </span>
                ))}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarCheck className="h-4 w-4" aria-hidden="true" />
                Last updated{' '}
                <time dateTime={toIsoDate(PAGE_UPDATED)}>{formatLongDate(PAGE_UPDATED)}</time>
              </span>
            </div>
          </div>

          {/* Photo with the headline deal pinned to it. */}
          <div className="relative">
            <div className="relative aspect-[16/11] overflow-hidden rounded-card shadow-2xl shadow-black/30 ring-1 ring-white/15">
              <Image
                src="/images/coupons-hero.jpg"
                alt="Coupons, percentage-off tags and a gift card scattered over a table of pizza sides"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 520px"
                className="object-cover"
              />
            </div>
            {carryout ? (
              <div className="relative -mt-10 ml-4 mr-10 rounded-card bg-surface p-4 text-ink shadow-xl shadow-black/25 sm:absolute sm:-bottom-6 sm:-left-6 sm:m-0 sm:w-72">
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-brand">
                  Best single deal
                </p>
                <div className="mt-1.5 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-[15px] font-extrabold leading-snug">Carryout large pizza</p>
                    <p className="text-[13px] text-ink-muted">any toppings</p>
                  </div>
                  <p className="text-[2rem] font-black leading-none tabular-nums text-brand">
                    {money(carryout.dealPrice)}
                  </p>
                </div>
                <p className="mt-3 rounded-md bg-brand-soft px-2.5 py-1.5 text-[13px] font-bold text-brand-dark">
                  Saves {money(carryout.saving)} ({carryout.savingPct}%) vs menu price
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      {/* ── The short answer ───────────────────────────────────────────── */}
      <section aria-labelledby="takeaways" className="mx-auto max-w-6xl px-4 pt-14">
        <h2 id="takeaways" className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand">
          The short answer
        </h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            carryout && {
              icon: Store,
              value: `${carryout.savingPct}%`,
              label: 'off a large pizza on the carryout deal — the best single saving',
            },
            family && {
              icon: House,
              value: money(family.perPerson),
              label: 'per person on the family bundle, for four to six people',
            },
            party && {
              icon: PartyPopper,
              value: money(party.perPerson),
              label: 'a head on the party pack — the cheapest way to feed ten',
            },
            {
              icon: Ticket,
              value: String(coupons.length),
              label: 'deal types explained, with who each one suits',
            },
          ]
            .filter((t): t is { icon: typeof Store; value: string; label: string } => Boolean(t))
            .map((t) => (
              <li
                key={t.label}
                className="flex gap-4 rounded-card border border-line bg-surface p-5 transition-colors hover:border-navy"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-navy-soft text-navy">
                  <t.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-[1.75rem] font-black leading-none tabular-nums text-brand">
                    {t.value}
                  </span>
                  <span className="mt-2 block text-[14px] leading-snug text-ink-muted">{t.label}</span>
                </span>
              </li>
            ))}
        </ul>
        <p className="mt-4 flex gap-2.5 rounded-card bg-navy-soft px-4 py-3 text-[14px] leading-relaxed text-navy-dark">
          <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>
            <strong>Looking for a live code?</strong> Only your own store’s deals page is
            reliable — stores opt into promotions individually.{' '}
            <a href="#find-codes" className="font-bold underline underline-offset-2">
              Here’s where to look
            </a>
          </span>
        </p>
      </section>

      {/* ── On this page ───────────────────────────────────────────────── */}
      <nav aria-label="On this page" className="mx-auto max-w-6xl px-4 pt-8">
        <div className="flex flex-wrap items-center gap-1 rounded-card border border-line bg-surface-alt p-1.5 sm:rounded-full">
          <span className="hidden shrink-0 pl-3 pr-1 text-[11px] font-bold uppercase tracking-[0.14em] text-ink-muted sm:inline">
            Jump to
          </span>
          {JUMP_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-semibold text-ink transition-colors hover:bg-surface hover:text-navy"
            >
              {l.label}
            </a>
          ))}
        </div>
      </nav>

      {/* ── Best deal by situation ─────────────────────────────────────── */}
      <section aria-labelledby="best-deal" className="mx-auto max-w-6xl px-4 py-14">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand">
          Quick picker
        </p>
        <h2 id="best-deal" className={`mt-2 ${SECTION_HEADING}`}>
          Which {BRAND.name} deal should you use?
        </h2>
        <p className="mt-3 max-w-3xl text-[16px] leading-relaxed text-ink-muted">
          Match the deal to the order, not the other way round. Find the card that
          describes tonight’s order.
        </p>
        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BEST_BY_SITUATION.map((row, i) => {
            const c = coupons.find((x) => x.id === row.couponId);
            if (!c) return null;
            return (
              <li key={row.couponId}>
                <a
                  href={`#${c.id}`}
                  className={`group flex h-full flex-col rounded-card border p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-navy/10 ${
                    i === 0 ? 'border-brand/40 bg-brand-soft/50' : 'border-line bg-surface hover:border-navy'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-navy text-white">
                      <row.icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="text-[1.6rem] font-black leading-none tabular-nums text-brand">
                      {c.discount}
                    </span>
                  </div>
                  <p className="mt-4 text-[12px] font-bold uppercase tracking-wide text-ink-muted">
                    {row.situation}
                  </p>
                  <h3 className="mt-1 text-[18px] font-extrabold leading-snug text-ink group-hover:text-navy">
                    {c.title.split(':')[0].split(',')[0]}
                  </h3>
                  <p className="mt-2 flex-1 text-[14px] leading-relaxed text-ink-muted">{row.why}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-navy">
                    How it works
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                </a>
              </li>
            );
          })}
        </ol>
      </section>

      {/* ── Worked savings ─────────────────────────────────────────────── */}
      <section aria-labelledby="deal-math" className="border-y border-line bg-surface-alt">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-3xl">
              <p className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-brand">
                <Calculator className="h-3.5 w-3.5" aria-hidden="true" />
                Our analysis
              </p>
              <h2 id="deal-math" className={`mt-2 ${SECTION_HEADING}`}>
                What each {BRAND.name} deal really saves
              </h2>
              <p className="mt-3 text-[16px] leading-relaxed text-ink-muted">
                We built the same basket twice — once at menu price, once on the deal —
                using example prices from our store sample. Every item links to its own
                price page so you can check the working.
              </p>
            </div>
          </div>

          <p className="mt-6 text-[12px] font-semibold text-ink-muted md:hidden">
            Swipe the table sideways to see every column →
          </p>
          <div className="table-scroll mt-3 overflow-hidden rounded-card border border-line bg-surface shadow-sm md:mt-6">
            <table className="w-full min-w-[46rem] text-[15px]">
              <caption className="sr-only">
                Menu price versus deal price for each {BRAND.name} deal type
              </caption>
              <thead>
                <tr className="bg-navy text-left text-[11px] uppercase tracking-wide text-white">
                  <th scope="col" className="px-4 py-3.5 font-bold">Deal</th>
                  <th scope="col" className="px-4 py-3.5 font-bold">What’s in the basket</th>
                  <th scope="col" className="px-3 py-3.5 text-right font-bold">Menu price</th>
                  <th scope="col" className="px-3 py-3.5 text-right font-bold">Deal price</th>
                  <th scope="col" className="px-3 py-3.5 text-right font-bold">You save</th>
                  <th scope="col" className="px-4 py-3.5 text-right font-bold">Per person</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {DEAL_VALUES.map((d) => (
                  <tr key={d.coupon.id} className="align-top transition-colors hover:bg-surface-alt">
                    <th scope="row" className="px-4 py-4 text-left font-semibold text-ink">
                      <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-navy">
                        {d.coupon.type}
                      </span>
                      <a href={`#${d.coupon.id}`} className="hover:text-navy hover:underline">
                        {d.coupon.title.split(':')[0].split(',')[0]}
                      </a>
                      {d.note ? (
                        <span className="mt-1 block text-[12px] font-normal leading-snug text-ink-muted">
                          {d.note}
                        </span>
                      ) : null}
                    </th>
                    <td className="px-4 py-4 text-[14px] leading-snug text-ink-muted">
                      {d.lines.map((l, i) => (
                        <span key={`${l.slug}-${l.size}`}>
                          {i > 0 ? ', ' : ''}
                          {l.qty > 1 ? `${l.qty}× ` : ''}
                          <Link href={`/menus-prices/${l.slug}`} className="text-navy hover:underline">
                            {['Small', 'Medium', 'Large', 'Extra Large'].includes(l.size)
                              ? `${l.size} ${l.title}`
                              : l.title}
                          </Link>
                        </span>
                      ))}
                    </td>
                    <td className="px-3 py-4 text-right tabular-nums text-ink-muted line-through decoration-ink-muted/50">
                      {money(d.menuPrice)}
                    </td>
                    <td className="px-3 py-4 text-right font-bold tabular-nums text-ink">
                      {money(d.dealPrice)}
                    </td>
                    <td className="px-3 py-4 text-right">
                      <span className="inline-flex flex-col items-end rounded-md bg-brand-soft px-2.5 py-1">
                        <span className="font-extrabold tabular-nums text-brand-dark">
                          {money(d.saving)}
                        </span>
                        <span className="text-[11px] font-bold text-brand-dark">{d.savingPct}% off</span>
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right tabular-nums text-ink">
                      {money(d.perPerson)}
                      <span className="block text-[12px] text-ink-muted">feeds {d.feeds}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {pctVsBundle ? (
              <div className="flex gap-4 rounded-card border border-line bg-surface p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy-soft text-navy">
                  <Percent className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-[16px] font-extrabold text-ink">
                    When does a percentage discount beat a bundle?
                  </h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-ink-muted">
                    Take the family basket: {money(pctVsBundle.menuPrice)} at menu price.
                    With 25% off it comes to {money(pctVsBundle.afterPct)} — almost exactly
                    the {money(pctVsBundle.bundle)} bundle. So on anything <em>bigger</em>{' '}
                    than a family meal, or with specialty pizzas that carry a bundle
                    surcharge, price it both ways: the percentage usually wins.
                  </p>
                </div>
              </div>
            ) : null}
            <div className="flex gap-4 rounded-card border border-line bg-surface p-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy-soft text-navy">
                <Star className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-[16px] font-extrabold text-ink">Put the dearest item in the slot</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-muted">
                  A flat-price deal charges the same for a plain cheese pizza as for a
                  loaded one, and the same for a lava cake as for wings. The saving above
                  assumes a sensible pick — choose the cheapest qualifying item and most of
                  it disappears.
                </p>
              </div>
            </div>
          </div>
          <PriceNote className="mt-5" />
        </div>
      </section>

      {/* ── All deal types ─────────────────────────────────────────────── */}
      <section aria-labelledby="deal-types" className="mx-auto max-w-6xl px-4 py-14">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand">
          Every offer type
        </p>
        <h2 id="deal-types" className={`mt-2 ${SECTION_HEADING}`}>
          All {coupons.length} {BRAND.name} deal types, explained
        </h2>
        <p className="mt-3 max-w-3xl text-[16px] leading-relaxed text-ink-muted">
          These are the offer structures that come back again and again, with typical
          prices. Your store’s live versions will use one of these shapes — once you
          recognise it, you know what it’s worth.
        </p>
        <div className="mt-5 flex gap-3 rounded-card border border-navy/25 bg-navy-soft p-4">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-navy-dark" aria-hidden="true" />
          <p className="text-[14px] leading-relaxed text-navy-dark">
            <strong>No fake codes here.</strong> Live codes differ by store and change
            constantly, so we don’t list any. {SITE_NAME} is an independent guide, not{' '}
            {BRAND.name} — see{' '}
            <a href="#find-codes" className="font-semibold underline underline-offset-2">
              how to find the codes running at your store
            </a>
            .
          </p>
        </div>
        <div className="mt-8">
          <CouponsClient coupons={coupons} savings={SAVINGS} />
        </div>
      </section>

      <AdSlot slotId="coupons-mid" className="pb-6" />

      {/* ── Finding codes that work ────────────────────────────────────── */}
      <section aria-labelledby="find-codes" className="border-t border-line bg-surface-alt">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-brand">
              <Search className="h-3.5 w-3.5" aria-hidden="true" />
              Live codes
            </p>
            <h2 id="find-codes" className={`mt-2 ${SECTION_HEADING}`}>
              How to find {BRAND.name} coupon codes that actually work
            </h2>
            <p className="mt-3 text-[16px] leading-relaxed text-ink-muted">
              Most codes on coupon sites are expired or tied to someone else’s account.
              These five places are where working offers actually turn up, in the order
              worth checking.
            </p>
          </div>
          <ol className="relative space-y-5 before:absolute before:bottom-6 before:left-[19px] before:top-6 before:w-0.5 before:bg-line">
            {[
              {
                icon: Store,
                t: 'Your store’s deals page',
                b: `Enter your address on ${BRAND.officialAppNote}, then open Deals. This is the only complete list for your store — franchisees opt into promotions one by one, so a national ad means nothing if your store isn’t on it.`,
              },
              {
                icon: ShoppingBasket,
                t: 'Switch to carryout before you look',
                b: 'Carryout-only offers don’t appear in delivery mode. Toggle it first, then browse the deals again — the cheapest prices are often hiding there.',
              },
              {
                icon: Mail,
                t: 'Email and text sign-ups',
                b: 'Targeted codes are sent to subscribers and are usually single-use. They’re the main reason a code from a friend fails for you.',
              },
              {
                icon: Gift,
                t: 'The rewards programme',
                b: 'Points come from signed-in orders, carryout included. A free-pizza redemption usually stacks on top of a deal price — the one discount that does.',
                link: { href: '/rewards', label: 'How the rewards points work' },
              },
              {
                icon: ListChecks,
                t: 'Check the qualifying list before checkout',
                b: 'If a deal won’t apply, one item in your basket is outside its list. Swap it and watch the total update.',
                link: { href: '/posts/pizza-coupon-codes-explained', label: 'Why your code didn’t work' },
              },
            ].map((step, i) => (
              <li key={step.t} className="relative flex gap-4">
                <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy text-white ring-4 ring-surface-alt">
                  <step.icon className="h-[18px] w-[18px]" aria-hidden="true" />
                </span>
                <div className="flex-1 rounded-card border border-line bg-surface p-5">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-brand">Step {i + 1}</p>
                  <h3 className="mt-0.5 text-[16px] font-extrabold text-ink">{step.t}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-ink-muted">{step.b}</p>
                  {step.link ? (
                    <Link
                      href={step.link.href}
                      className="mt-2 inline-flex items-center gap-1.5 text-[14px] font-bold text-navy hover:text-brand"
                    >
                      {step.link.label}
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Spotting a bad deal ────────────────────────────────────────── */}
      <section aria-labelledby="how-to-read" className="border-t border-line">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <p className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-brand">
            <TriangleAlert className="h-3.5 w-3.5" aria-hidden="true" />
            Watch out
          </p>
          <h2 id="how-to-read" className={`mt-2 ${SECTION_HEADING}`}>
            How to tell a good deal from a bad one
          </h2>
          <p className="mt-3 max-w-3xl text-[16px] leading-relaxed text-ink-muted">
            Four warning signs, in rough order of how often they catch people out.
          </p>
          <ul className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              {
                t: 'The qualifying item list is narrow',
                b: (
                  <>
                    A bundle that accepts only two-topping medium pizzas and plain breadsticks
                    is a much smaller discount than one that accepts anything on the menu.
                    Read the list before you read the headline number — the headline is chosen
                    by a marketing team, the list is where the actual offer lives.
                  </>
                ),
              },
              {
                t: 'Specialty items carry a surcharge inside it',
                b: (
                  <>
                    Common on family packs. Four pizzas with a dollar-fifty surcharge each is
                    six dollars off the advertised saving, and it is disclosed in small type
                    at the point where you are already choosing pizzas.
                  </>
                ),
              },
              {
                t: 'It is delivery-only and the fee is not included',
                b: (
                  <>
                    A ten-dollar large pizza delivered is not a ten-dollar large pizza. Judge
                    every offer on the checkout total rather than the tile price — our{' '}
                    <Link
                      href="/posts/carryout-vs-delivery-which-is-cheaper"
                      className="font-semibold text-navy underline underline-offset-2 hover:text-brand"
                    >
                      carryout vs delivery breakdown
                    </Link>{' '}
                    shows where the gap comes from.
                  </>
                ),
              },
              {
                t: 'It requires a minimum you would not otherwise hit',
                b: (
                  <>
                    Spending eight extra dollars to unlock a five-dollar discount is not a
                    saving, however the interface presents it.
                  </>
                ),
              },
            ].map((w, i) => (
              <li key={w.t} className="flex gap-4 rounded-card border border-line bg-surface p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-soft text-[15px] font-black text-brand-dark">
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-[16px] font-extrabold text-ink">{w.t}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-ink-muted">{w.b}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-col gap-4 rounded-card bg-navy p-6 text-white sm:flex-row sm:items-center sm:p-7">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/15">
              <Repeat className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <h3 className="text-[18px] font-extrabold">The habit that beats all of this</h3>
              <p className="mt-1.5 text-[15px] leading-relaxed text-white/85">
                Build your basket, note the total, then rebuild the same food under a
                different offer structure and note that total too. It takes about ninety
                seconds and finds four or five dollars often enough to be worth doing every
                single time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Related guides ─────────────────────────────────────────────── */}
      {relatedPosts.length ? (
        <section aria-labelledby="related" className="border-t border-line bg-surface-alt">
          <div className="mx-auto max-w-6xl px-4 py-14">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 id="related" className={SECTION_HEADING}>
                Keep reading
              </h2>
              <Link
                href="/menus-prices"
                className="inline-flex items-center gap-2 rounded-md border border-navy px-4 py-2.5 text-sm font-bold text-navy transition-colors hover:bg-navy hover:text-white"
              >
                Full {BRAND.name} menu prices
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ── FAQ ────────────────────────────────────────────────────────── */}
      <section aria-labelledby="faq" className="border-t border-line">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 lg:grid-cols-[1fr_1.7fr]">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand">Questions</p>
            <h2 id="faq" className={`mt-2 ${SECTION_HEADING}`}>
              {BRAND.name} coupons: frequently asked questions
            </h2>
            <p className="mt-3 text-[16px] leading-relaxed text-ink-muted">
              The questions people ask most about {BRAND.name} deals and codes, answered
              with the numbers from this page.
            </p>
            <div className="mt-6 rounded-card border border-line bg-surface-alt p-5">
              <p className="text-[15px] font-extrabold text-ink">Seen a different price?</p>
              <p className="mt-1 text-[14px] leading-relaxed text-ink-muted">
                Deal prices are reviewed monthly. Price reports from readers are the most
                useful thing you can send us.
              </p>
              <Link
                href="/contact"
                className="mt-3 inline-flex items-center gap-2 rounded-md bg-navy px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-navy-dark"
              >
                Tell us
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
          <FaqAccordion faqs={COUPON_FAQS} headingId="coupon-faq" className="" labelledBy="faq" />
        </div>
      </section>
    </>
  );
}
