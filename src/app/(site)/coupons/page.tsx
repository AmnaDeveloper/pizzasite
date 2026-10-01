import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CalendarCheck, CheckCircle2, Info, ShieldCheck } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import CouponsClient, { type CouponSaving } from '@/components/CouponsClient';
import FaqAccordion from '@/components/FaqAccordion';
import LastUpdated from '@/components/LastUpdated';
import AdSlot from '@/components/AdSlot';
import JsonLd from '@/components/JsonLd';
import PriceNote from '@/components/PriceNote';
import { absoluteUrl, generatePageSEO } from '@/lib/seo-config';
import { breadcrumbSchema, faqSchema } from '@/lib/seo/schema';
import { getDealValues, percentageVersusBundle } from '@/lib/deal-values';
import { authors } from '@/data/authors';
import { coupons } from '@/data/coupons';
import { BRAND, CURRENCY_SYMBOL, SITE_NAME, SITE_URL } from '@/lib/site-config';
import { currentMonthYear } from '@/lib/utils/date';

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
    why: 'Lowest price per pizza, and no delivery fee or tip.',
  },
  {
    situation: 'Two people who want a pizza and something else',
    couponId: 'cpn-mix-match',
    why: 'Each qualifying item drops to one flat price.',
  },
  {
    situation: 'One pizza, delivered',
    couponId: 'cpn-large-3-topping',
    why: 'Fixed price on a large; fee and tip are still added.',
  },
  {
    situation: 'Family of four to six',
    couponId: 'cpn-family-bundle',
    why: 'Two large pizzas, a side and a drink for one price.',
  },
  {
    situation: 'Party of eight to twelve',
    couponId: 'cpn-group-order',
    why: 'Lowest cost per person of any offer type.',
  },
  {
    situation: 'Big order that no bundle fits',
    couponId: 'cpn-online-only',
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

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="border-b border-line bg-surface-alt">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-10 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-brand px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-white">
              Updated {currentMonthYear()}
            </p>
            <h1 className="mt-4 text-4xl font-extrabold leading-[1.1] tracking-tight text-ink sm:text-[2.75rem]">
              {BRAND.name} coupons & deals: which one actually saves you money
            </h1>
            <p className="mt-4 text-[17px] leading-relaxed text-ink-muted">
              Promotions rotate every few weeks, but the deal structures underneath them
              barely change. We priced the same food at menu price and on each deal, so you
              can see what every offer type really saves — and which one fits the order
              you’re about to place.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] font-medium text-ink-muted">
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
              <LastUpdated date={PAGE_UPDATED} />
            </div>
          </div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-card border border-line">
            <Image
              src="/images/coupons-hero.jpg"
              alt="Coupons, percentage-off tags and a gift card scattered over a table of pizza sides"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 520px"
              className="object-cover"
            />
          </div>
        </div>
      </header>

      {/* ── Key takeaways — answer-first summary ───────────────────────── */}
      <section aria-labelledby="takeaways" className="mx-auto max-w-6xl px-4 pt-10">
        <div className="rounded-card border border-line bg-surface p-5 sm:p-6">
          <h2 id="takeaways" className="text-lg font-extrabold text-navy-dark">
            The short answer
          </h2>
          <ul className="mt-4 grid gap-3 text-[15px] leading-relaxed text-ink md:grid-cols-2">
            {carryout ? (
              <li className="flex gap-2.5">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
                <span>
                  <strong>Best single deal:</strong> a carryout large at about{' '}
                  {money(carryout.dealPrice)} — {carryout.savingPct}% under menu price, with
                  no delivery fee or tip.
                </span>
              </li>
            ) : null}
            {family ? (
              <li className="flex gap-2.5">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
                <span>
                  <strong>Best for a family:</strong> the two-pizza bundle, about{' '}
                  {money(family.perPerson)} per person and {money(family.saving)} under menu
                  price.
                </span>
              </li>
            ) : null}
            {party ? (
              <li className="flex gap-2.5">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
                <span>
                  <strong>Cheapest per person:</strong> the party pack, about{' '}
                  {money(party.perPerson)} a head for ten people.
                </span>
              </li>
            ) : null}
            <li className="flex gap-2.5">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
              <span>
                <strong>Live codes:</strong> only your own store’s deals page is
                reliable — stores opt into promotions individually.{' '}
                <a href="#find-codes" className="font-semibold text-navy underline underline-offset-2">
                  Where to look
                </a>
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* ── On this page ───────────────────────────────────────────────── */}
      <nav aria-label="On this page" className="mx-auto max-w-6xl px-4 pt-6">
        <ul className="flex flex-wrap gap-2">
          {JUMP_LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="inline-block rounded-full border border-line px-3.5 py-1.5 text-[13px] font-semibold text-ink transition-colors hover:border-navy hover:text-navy"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* ── Best deal by situation ─────────────────────────────────────── */}
      <section aria-labelledby="best-deal" className="mx-auto max-w-6xl px-4 py-12">
        <h2 id="best-deal" className={SECTION_HEADING}>
          Which {BRAND.name} deal should you use?
        </h2>
        <p className="mt-3 max-w-3xl text-[16px] leading-relaxed text-ink-muted">
          Match the deal to the order, not the other way round. Start from the row that
          describes tonight’s order.
        </p>
        <div className="table-scroll mt-6 overflow-hidden rounded-card border border-line">
          <table className="w-full min-w-[36rem] text-[15px]">
            <caption className="sr-only">Best {BRAND.name} deal type for each kind of order</caption>
            <thead>
              <tr className="bg-navy text-left text-[11px] uppercase tracking-wide text-white">
                <th scope="col" className="px-4 py-3 font-bold">Your order</th>
                <th scope="col" className="px-4 py-3 font-bold">Best deal type</th>
                <th scope="col" className="px-4 py-3 text-right font-bold">Typical price</th>
                <th scope="col" className="hidden px-4 py-3 font-bold md:table-cell">Why</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {BEST_BY_SITUATION.map((row) => {
                const c = coupons.find((x) => x.id === row.couponId);
                if (!c) return null;
                return (
                  <tr key={row.couponId} className="odd:bg-surface even:bg-surface-alt">
                    <th scope="row" className="px-4 py-3.5 text-left font-semibold text-ink">
                      {row.situation}
                    </th>
                    <td className="px-4 py-3.5">
                      <a href={`#${c.id}`} className="font-semibold text-navy hover:underline">
                        {c.title.split(':')[0].split(',')[0]}
                      </a>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-right font-extrabold text-brand">
                      {c.discount}
                    </td>
                    <td className="hidden px-4 py-3.5 text-ink-muted md:table-cell">{row.why}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Worked savings ─────────────────────────────────────────────── */}
      <section aria-labelledby="deal-math" className="border-y border-line bg-surface-alt">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand">
            Our analysis
          </p>
          <h2 id="deal-math" className={`mt-2 ${SECTION_HEADING}`}>
            What each {BRAND.name} deal really saves
          </h2>
          <p className="mt-3 max-w-3xl text-[16px] leading-relaxed text-ink-muted">
            We built the same basket twice — once at menu price, once on the deal — using
            example prices from our store sample. Every item links to its own price page so
            you can check the working.
          </p>

          <div className="table-scroll mt-6 overflow-hidden rounded-card border border-line bg-surface">
            <table className="w-full min-w-[46rem] text-[15px]">
              <caption className="sr-only">
                Menu price versus deal price for each {BRAND.name} deal type
              </caption>
              <thead>
                <tr className="bg-navy text-left text-[11px] uppercase tracking-wide text-white">
                  <th scope="col" className="px-4 py-3 font-bold">Deal</th>
                  <th scope="col" className="px-4 py-3 font-bold">What’s in the basket</th>
                  <th scope="col" className="px-3 py-3 text-right font-bold">Menu price</th>
                  <th scope="col" className="px-3 py-3 text-right font-bold">Deal price</th>
                  <th scope="col" className="px-3 py-3 text-right font-bold">You save</th>
                  <th scope="col" className="px-4 py-3 text-right font-bold">Per person</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {DEAL_VALUES.map((d) => (
                  <tr key={d.coupon.id} className="align-top">
                    <th scope="row" className="px-4 py-3.5 text-left font-semibold text-ink">
                      <a href={`#${d.coupon.id}`} className="hover:text-navy hover:underline">
                        {d.coupon.title.split(':')[0].split(',')[0]}
                      </a>
                      {d.note ? (
                        <span className="mt-1 block text-[12px] font-normal leading-snug text-ink-muted">
                          {d.note}
                        </span>
                      ) : null}
                    </th>
                    <td className="px-4 py-3.5 text-[14px] leading-snug text-ink-muted">
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
                    <td className="px-3 py-3.5 text-right tabular-nums text-ink-muted line-through decoration-ink-muted/50">
                      {money(d.menuPrice)}
                    </td>
                    <td className="px-3 py-3.5 text-right font-bold tabular-nums text-ink">
                      {money(d.dealPrice)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3.5 text-right font-extrabold tabular-nums text-brand">
                      {money(d.saving)}
                      <span className="ml-1 text-[12px] font-bold">({d.savingPct}%)</span>
                    </td>
                    <td className="px-4 py-3.5 text-right tabular-nums text-ink">
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
              <div className="rounded-card border border-line bg-surface p-5">
                <h3 className="text-[16px] font-extrabold text-ink">
                  When does a percentage discount beat a bundle?
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-muted">
                  Take the family basket: {money(pctVsBundle.menuPrice)} at menu price. With
                  25% off it comes to {money(pctVsBundle.afterPct)} — almost exactly the{' '}
                  {money(pctVsBundle.bundle)} bundle. So on anything <em>bigger</em> than a
                  family meal, or with specialty pizzas that carry a bundle surcharge, price
                  it both ways: the percentage usually wins.
                </p>
              </div>
            ) : null}
            <div className="rounded-card border border-line bg-surface p-5">
              <h3 className="text-[16px] font-extrabold text-ink">
                Put the dearest item in the slot
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-muted">
                A flat-price deal charges the same for a plain cheese pizza as for a loaded
                one, and the same for a lava cake as for wings. The saving above assumes a
                sensible pick — choose the cheapest qualifying item and most of it
                disappears.
              </p>
            </div>
          </div>
          <PriceNote className="mt-5" />
        </div>
      </section>

      {/* ── All deal types ─────────────────────────────────────────────── */}
      <section aria-labelledby="deal-types" className="mx-auto max-w-6xl px-4 py-12">
        <h2 id="deal-types" className={SECTION_HEADING}>
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
      <section aria-labelledby="find-codes" className="border-t border-line">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <h2 id="find-codes" className={SECTION_HEADING}>
            How to find {BRAND.name} coupon codes that actually work
          </h2>
          <p className="mt-3 text-[16px] leading-relaxed text-ink-muted">
            Most codes on coupon sites are expired or tied to someone else’s account.
            These five places are where working offers actually turn up, in the order worth
            checking.
          </p>
          <ol className="mt-6 space-y-4">
            {[
              {
                t: 'Your store’s deals page',
                b: `Enter your address on ${BRAND.officialAppNote}, then open Deals. This is the only complete list for your store — franchisees opt into promotions one by one, so a national ad means nothing if your store isn’t on it.`,
              },
              {
                t: 'Switch to carryout before you look',
                b: 'Carryout-only offers don’t appear in delivery mode. Toggle it first, then browse the deals again — the cheapest prices are often hiding there.',
              },
              {
                t: 'Email and text sign-ups',
                b: 'Targeted codes are sent to subscribers and are usually single-use. They’re the main reason a code from a friend fails for you.',
              },
              {
                t: 'The rewards programme',
                b: 'Points come from signed-in orders, carryout included. A free-pizza redemption usually stacks on top of a deal price — the one discount that does.',
                link: { href: '/rewards', label: 'How the rewards points work' },
              },
              {
                t: 'Check the qualifying list before checkout',
                b: 'If a deal won’t apply, one item in your basket is outside its list. Swap it and watch the total update.',
                link: { href: '/posts/pizza-coupon-codes-explained', label: 'Why your code didn’t work' },
              },
            ].map((step, i) => (
              <li key={step.t} className="flex gap-4 rounded-card border border-line bg-surface p-5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy text-[14px] font-extrabold text-white">
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-[16px] font-extrabold text-ink">{step.t}</h3>
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
      <section aria-labelledby="how-to-read" className="border-y border-line bg-surface-alt">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <h2 id="how-to-read" className={SECTION_HEADING}>
            How to tell a good deal from a bad one
          </h2>
          <div className="prose-guide mt-5">
            <p>Four warning signs, in rough order of how often they catch people out.</p>
            <h3>The qualifying item list is narrow</h3>
            <p>
              A bundle that accepts only two-topping medium pizzas and plain breadsticks is
              a much smaller discount than one that accepts anything on the menu. Read the
              list before you read the headline number — the headline is chosen by a
              marketing team, the list is where the actual offer lives.
            </p>
            <h3>Specialty items carry a surcharge inside it</h3>
            <p>
              Common on family packs. Four pizzas with a dollar-fifty surcharge each is six
              dollars off the advertised saving, and it is disclosed in small type at the
              point where you are already choosing pizzas.
            </p>
            <h3>It is delivery-only and the fee is not included</h3>
            <p>
              A ten-dollar large pizza delivered is not a ten-dollar large pizza. Judge
              every offer on the checkout total rather than the tile price — our{' '}
              <Link href="/posts/carryout-vs-delivery-which-is-cheaper">
                carryout vs delivery breakdown
              </Link>{' '}
              shows where the gap comes from.
            </p>
            <h3>It requires a minimum you would not otherwise hit</h3>
            <p>
              Spending eight extra dollars to unlock a five-dollar discount is not a saving,
              however the interface presents it.
            </p>
            <h3>The habit that beats all of this</h3>
            <p>
              Build your basket, note the total, then rebuild the same food under a
              different offer structure and note that total too. It takes about ninety
              seconds and finds four or five dollars often enough to be worth doing every
              single time.
            </p>
          </div>

          <h3 className="mt-10 text-[13px] font-bold uppercase tracking-[0.14em] text-ink-muted">
            Related guides
          </h3>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {[
              { href: '/posts/best-pizza-deals-this-month', label: 'How to judge this month’s deals' },
              { href: '/posts/mix-and-match-deal-explained', label: 'The Mix & Match deal, explained' },
              { href: '/posts/how-to-save-money-on-pizza-delivery', label: '11 ways to pay less for delivery' },
              { href: '/menus-prices', label: `Full ${BRAND.name} menu prices` },
            ].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="flex items-center justify-between gap-3 rounded-card border border-line bg-surface px-4 py-3 text-[15px] font-semibold text-ink transition-colors hover:border-navy hover:text-navy"
                >
                  {l.label}
                  <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-3xl px-4 py-14">
        <h2 id="faq" className={SECTION_HEADING}>
          {BRAND.name} coupons: frequently asked questions
        </h2>
        <FaqAccordion faqs={COUPON_FAQS} headingId="coupon-faq" className="mt-6" labelledBy="faq" />
        <p className="mt-8 text-[13px] leading-relaxed text-ink-muted">
          <CalendarCheck
            className="mr-1.5 inline h-4 w-4 align-[-3px] text-navy"
            aria-hidden="true"
          />
          Deal prices are reviewed monthly. Seen a different price at your store?{' '}
          <Link href="/contact" className="font-semibold text-navy underline underline-offset-2">
            Tell us
          </Link>
          .
        </p>
      </div>
    </>
  );
}
