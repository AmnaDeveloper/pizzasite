import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  MapPin,
  Clock,
  Wallet,
  Truck,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import FaqAccordion from '@/components/FaqAccordion';
import PriceNote from '@/components/PriceNote';
import PostCard from '@/components/PostCard';
import AdSlot from '@/components/AdSlot';
import JsonLd from '@/components/JsonLd';
import { generatePageSEO } from '@/lib/seo-config';
import { breadcrumbSchema, faqSchema } from '@/lib/seo/schema';
import { getPost } from '@/lib/content';
import { BRAND, CURRENCY_SYMBOL, NOT_AFFILIATED_SHORT } from '@/lib/site-config';
import { monthYearOf } from '@/lib/utils/date';
import { PAGE_DATES } from '@/lib/page-dates';
import type { Post } from '@/data/types';

/** Day this page's content last really changed — update it with the content. */
const PAGE_UPDATED = PAGE_DATES['/delivery-near-me'];

const CRUMBS = [
  { name: 'Home', path: '/' },
  { name: 'Delivery Near Me', path: '/delivery-near-me' },
];

const DELIVERY_FAQS = [
  {
    question: 'How do I find out if pizza delivery is available at my address?',
    answer:
      'Enter your full street address into the official store finder rather than a ZIP code. Zone boundaries frequently run through the middle of a ZIP code, so a ZIP code search returns a best guess while a full address returns the actual answer, including whether your street is carryout only.',
  },
  {
    question: 'How far will a pizza chain deliver?',
    answer:
      'It varies enormously by market. Dense city zones can be under a mile because a driver covers ground slowly; suburban zones routinely extend several miles because the roads support it. The zone is drawn around driving time, not distance.',
  },
  {
    question: 'How long does pizza delivery usually take?',
    answer:
      'Your store quotes an estimate when you order, and that quote is the best number you will get. We have not timed deliveries ourselves. What stretches the wait is mostly how many orders are ahead of yours rather than how far the driver travels, so expect the quote to run long on a Friday or Saturday evening.',
  },
  {
    question: 'Is there a minimum order for delivery?',
    answer:
      'Usually, and it is set store by store to reflect what a run costs that store. Dense, slow-moving zones tend to carry higher minimums because a driver completes fewer deliveries an hour there.',
  },
  {
    question: 'Is delivery or carryout cheaper?',
    answer:
      'Carryout, by roughly thirteen to eighteen dollars on a large 1-topping pizza. That combines the delivery fee, the tip and the $7.99 carryout deal, which is not available for delivery. The saving narrows in percentage terms on a large multi-item order.',
  },
  {
    question: 'Does the delivery fee go to the driver?',
    answer:
      'At most chains, no. It is a store charge covering insurance, vehicle costs and operating overhead. Drivers are paid a wage plus tips, which is why reducing a tip because a fee was charged takes money from the driver rather than the company.',
  },
];

export const metadata: Metadata = generatePageSEO({
  title: `${BRAND.name} Delivery: Zones, Times & Costs`,
  description:
    'How pizza delivery zones are drawn, what actually determines your wait, and what delivery ' +
    'really costs once the fee and tip are counted.',
  path: '/delivery-near-me',
  keywords: [
    'pizza delivery near me',
    'dominos delivery near me',
    'pizza delivery zones',
    'how long does pizza delivery take',
    'pizza delivery cost',
  ],
});

const COST_ROWS = [
  { label: 'Large 1-topping pizza, $7.99 carryout deal', value: '7.99', note: 'No fee, no tip' },
  { label: 'Same pizza delivered, at menu price', value: '15.49', note: 'Our estimate: $13.99 checked for cheese, plus one topping' },
  { label: 'Delivery fee', value: '3.99', note: 'Set by each store, commonly $3–6; not paid to the driver' },
  { label: 'Tip', value: '3.00', note: 'Goes to the driver' },
];

export default function DeliveryNearMePage() {
  const relatedSlugs = [
    'carryout-vs-delivery-which-is-cheaper',
    'delivery-fee-vs-tip-what-goes-to-driver',
    'how-much-to-tip-pizza-delivery-driver',
  ];
  const relatedPosts = relatedSlugs
    .map((s) => getPost(s))
    .filter((p): p is Post => Boolean(p));

  return (
    <>
      <JsonLd data={[breadcrumbSchema(CRUMBS), faqSchema(DELIVERY_FAQS)]} />

      <div className="mx-auto max-w-6xl px-4">
        <Breadcrumbs crumbs={CRUMBS} />
      </div>

      <header className="border-b border-line bg-navy-dark text-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-brand px-3 py-1 text-xs font-bold uppercase tracking-wide">
            <Truck className="h-3.5 w-3.5" aria-hidden="true" />
            Updated {monthYearOf(PAGE_UPDATED)}
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-[1.12] tracking-tight sm:text-5xl">
            Pizza delivery near me: how zones, timing and cost actually work
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/85">
            Searching for delivery near you returns a store. It does not tell you why that
            store, how long you will really wait, or what the order costs once the fee and
            the tip are counted. This page covers all three.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="#zones"
              className="inline-flex items-center gap-2 rounded-md bg-brand px-5 py-3 text-base font-bold text-white transition-colors hover:bg-brand-dark"
            >
              See how zones work
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <Link
              href="/hours"
              className="inline-flex items-center gap-2 rounded-md border border-white/40 bg-white/10 px-5 py-3 text-base font-bold text-white transition-colors hover:bg-white/20"
            >
              Check opening hours
            </Link>
          </div>
          <div className="relative mt-8 aspect-[21/9] overflow-hidden rounded-card border border-white/20">
            <Image
              src="/images/delivery-hero.webp"
              alt="A delivery driver handing a pizza box to a customer at their front door"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1152px"
              className="object-cover"
            />
          </div>
        </div>
      </header>

      <section aria-labelledby="zones" className="mx-auto max-w-3xl px-4 py-12">
        <h2
          id="zones"
          className="flex items-center gap-2 text-3xl font-extrabold tracking-tight text-navy-dark"
        >
          <MapPin className="h-7 w-7 text-brand" aria-hidden="true" />
          Why that store, and not the closer one
        </h2>
        <div className="prose-guide mt-4">
          <p>
            For delivery, your address belongs to one store’s zone, and zones can follow
            <em> driving time</em> rather than distance — so the store nearest on a map is not
            always the one that brings your pizza.
          </p>
          <p>
            That assignment matters for your wallet as well as your wait. Store owners opt
            into promotions individually, so the store you are assigned decides which deals
            you see. If a nationally advertised deal is not on your store page, your store is
            not running it — and no coupon code will change that.
          </p>
          <p>
            Carryout is different: you can pick any store you are willing to drive to. If a
            second store is close, switch to carryout and compare its deals page with your
            delivery store’s before you build the order.
          </p>
        </div>
        <Link
          href="/store-locator"
          className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-navy hover:text-brand"
        >
          More on how store assignment works
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </section>

      <section
        aria-labelledby="timing"
        className="border-y border-line bg-surface-alt"
      >
        <div className="mx-auto max-w-3xl px-4 py-12">
          <h2
            id="timing"
            className="flex items-center gap-2 text-3xl font-extrabold tracking-tight text-navy-dark"
          >
            <Clock className="h-7 w-7 text-brand" aria-hidden="true" />
            What actually determines your wait
          </h2>
          <div className="prose-guide mt-4">
            <p>
              It is natural to assume the wait is about distance. Often it is more about queue
              depth: at a dinner-time peak a store may have many orders ahead of yours and a
              fixed number of ovens, and the drive can be the shortest part of the process.
            </p>
            <p>The four things that move the number:</p>
            <ul>
              <li>
                <strong>How many orders are ahead of you.</strong> Usually the biggest
                factor at peak times, and not something you can see before you order.
              </li>
              <li>
                <strong>How many stops are on the driver’s run.</strong> A driver may
                carry more than one order per trip. If yours is the third stop, it has been in
                the car through two other deliveries.
              </li>
              <li>
                <strong>Where you sit in the zone.</strong> An address at the edge of the
                zone means a longer round trip for the driver than one near the store.
              </li>
              <li>
                <strong>Weather and staffing.</strong> Snow, storms and a short-handed
                closing crew all stretch windows, and none of it is visible from outside.
              </li>
            </ul>
            <p>
              Practical version: treat the time quoted at checkout as a best case on a Friday
              or Saturday evening. Ordering before the dinner rush rather than in the middle of
              it is the simplest way to get the same food sooner for the same money.
            </p>
          </div>
        </div>
      </section>

      <AdSlot slotId="delivery-mid" className="py-8" />

      <section aria-labelledby="cost" className="mx-auto max-w-3xl px-4 py-12">
        <h2
          id="cost"
          className="flex items-center gap-2 text-3xl font-extrabold tracking-tight text-navy-dark"
        >
          <Wallet className="h-7 w-7 text-brand" aria-hidden="true" />
          What delivery really costs
        </h2>
        <p className="mt-3 text-[16px] leading-relaxed text-ink-muted">
          The gap between carryout and delivery is not just the fee. It is three separate
          charges pointing the same way — and the largest of them is the easiest one to
          forget.
        </p>

        <div className="mt-5 overflow-hidden rounded-card border border-line">
          <table className="w-full text-sm">
            <caption className="sr-only">
              Example cost comparison of carryout versus delivery for one large pizza
            </caption>
            <thead>
              <tr className="bg-navy-soft text-left text-[12px] uppercase tracking-wide text-navy-dark">
                <th scope="col" className="px-4 py-3 font-bold">
                  Line
                </th>
                <th scope="col" className="px-4 py-3 text-right font-bold">
                  Amount
                </th>
                <th scope="col" className="px-4 py-3 font-bold">
                  Note
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line bg-surface">
              {COST_ROWS.map((row) => (
                <tr key={row.label}>
                  <th scope="row" className="px-4 py-3 text-left font-semibold text-ink">
                    {row.label}
                  </th>
                  <td className="px-4 py-3 text-right font-extrabold text-brand">
                    {CURRENCY_SYMBOL}
                    {row.value}
                  </td>
                  <td className="px-4 py-3 text-[13px] text-ink-muted">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <PriceNote className="mt-3" />

        <div className="prose-guide mt-6">
          <p>
            Read down that table and a large 1-topping pizza that costs $7.99 picked up
            comes to about $22.48 delivered — a gap of roughly $14.50. More than half of it
            is the pizza price itself: the $7.99 deal does not exist in delivery mode, so it
            only shows up once you choose carryout.
          </p>
          <p>
            None of which means you should never pay for delivery. It means the decision is
            worth making deliberately: if the store is four minutes away, collecting is
            close to free money. If it is fifteen minutes each way, the saving has already
            been consumed by fuel and your own time.
          </p>
        </div>
      </section>

      <section
        aria-labelledby="checklist"
        className="border-y border-line bg-surface-alt"
      >
        <div className="mx-auto max-w-3xl px-4 py-12">
          <h2
            id="checklist"
            className="text-3xl font-extrabold tracking-tight text-navy-dark"
          >
            The five-point delivery checklist
          </h2>
          <ul className="mt-6 space-y-3">
            {[
              {
                id: 'order-type',
                body: 'Set delivery or carryout before you build the basket — carryout-only pricing never appears in delivery mode.',
              },
              {
                id: 'sign-in',
                body: (
                  <>
                    Sign in first.{' '}
                    <Link
                      href="/rewards"
                      className="font-semibold text-navy underline underline-offset-2 hover:text-brand"
                    >
                      Rewards points
                    </Link>{' '}
                    are not earned on guest orders, so sign in before you pay.
                  </>
                ),
              },
              {
                id: 'deals-first',
                body: 'Read your store deals page before the menu, then build from inside the deal tile.',
              },
              {
                id: 'instructions',
                body: 'Put the gate code, buzzer and unit number in the instructions field, so the driver is not left waiting outside a locked gate or building.',
              },
              {
                id: 'total',
                body: 'Judge the offer on the checkout total, not the tile price.',
              },
            ].map((point) => (
              <li key={point.id} className="flex gap-3 rounded-card border border-line bg-surface p-4">
                <CheckCircle2
                  className="mt-0.5 h-5 w-5 shrink-0 text-navy"
                  aria-hidden="true"
                />
                <span className="text-[16px] leading-relaxed text-ink-muted">
                  {point.body}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>


      <section aria-labelledby="read-next" className="mx-auto max-w-6xl px-4 pb-12">
        <h2
          id="read-next"
          className="text-2xl font-extrabold tracking-tight text-navy-dark"
        >
          Read next
        </h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {relatedPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 pb-16">
        <FaqAccordion faqs={DELIVERY_FAQS} heading="Delivery questions, answered" />
        <p className="mt-8 rounded-card border border-line bg-surface-alt p-4 text-[13px] leading-relaxed text-ink-muted">
          {NOT_AFFILIATED_SHORT} We do not take orders and cannot check delivery
          availability for your address — use {BRAND.officialAppNote} for that.
        </p>
      </div>
    </>
  );
}
