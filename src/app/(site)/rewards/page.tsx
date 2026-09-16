import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Gift, TrendingUp, AlertTriangle, ArrowRight, Scale } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import FaqAccordion from '@/components/FaqAccordion';
import LastUpdated from '@/components/LastUpdated';
import PriceNote from '@/components/PriceNote';
import AdSlot from '@/components/AdSlot';
import JsonLd from '@/components/JsonLd';
import { generatePageSEO } from '@/lib/seo-config';
import { breadcrumbSchema, faqSchema } from '@/lib/seo/schema';
import { BRAND, CURRENCY_SYMBOL } from '@/lib/site-config';

const CRUMBS = [
  { name: 'Home', path: '/' },
  { name: 'Rewards', path: '/rewards' },
];

const SECTION = 'border-t border-line';
const INNER = 'mx-auto max-w-5xl px-5 py-14 sm:px-8 sm:py-16';

const REWARDS_FAQS = [
  {
    question: `How do ${BRAND.name} rewards points work?`,
    answer:
      'You earn a fixed number of points for each qualifying order above a modest minimum spend, and at a threshold — commonly around sixty points, reached in six orders — you can redeem them for a free pizza. Points sit on your account rather than in your basket, which is why a redemption generally applies on top of a deal price instead of competing with it.',
  },
  {
    question: 'Do rewards points depend on how much I spend?',
    answer:
      'At most pizza chains, no. Points are awarded per qualifying order above a modest minimum, which means a fifteen-dollar order and a sixty-dollar order typically earn exactly the same. That single design choice makes frequent small orders far more efficient than occasional large ones.',
  },
  {
    question: 'How many orders do I need for a free pizza?',
    answer:
      'Typically six qualifying orders. Since a redemption is usually worth around thirteen dollars at menu price, each order is generating roughly two dollars of value — an effective discount of about thirteen percent on a fifteen-dollar order, and only about three percent on a sixty-dollar one.',
  },
  {
    question: 'Do carryout orders earn points?',
    answer:
      'Yes at most chains, at the same rate as delivery. People routinely assume otherwise and lose points on exactly the orders they should be placing, since carryout is also the cheapest way to order.',
  },
  {
    question: 'Do points expire?',
    answer:
      'Usually after a period of account inactivity rather than on a fixed date from when each point was earned. A single qualifying order normally resets the clock on your whole balance, so an occasional order protects everything you have already built up.',
  },
  {
    question: 'Can I use a reward and a deal on the same order?',
    answer:
      'Usually yes, and this is the only reliable stacking in chain pizza. The redemption comes off your account rather than out of the basket, so it generally applies on top of a bundle price rather than competing with it.',
  },
  {
    question: 'Do orders through a third-party delivery app earn points?',
    answer:
      'Generally not, because the transaction never touches the chain account system. That is a real hidden cost of ordering through an aggregator, on top of the marked-up menu prices those platforms usually carry.',
  },
  {
    question: 'Is a rewards programme actually worth joining?',
    answer:
      'For a regular orderer, yes — signing up costs nothing and the effective discount is meaningful. The honest caveat is behavioural: these schemes exist to increase how often you order, and they work. If a points balance is nudging you into ordering more often than you otherwise would, the programme is making money from you rather than the other way round.',
  },
];

/* Title budget is ~45 characters before the site name is appended. */
export const metadata: Metadata = generatePageSEO({
  title: `${BRAND.name} Rewards: What Points Are Worth`,
  description:
    'How pizza loyalty points really work: earned per order, not per dollar. What a free pizza ' +
    'costs you in orders, and five mistakes that waste points.',
  path: '/rewards',
  keywords: [
    'dominos rewards',
    'dominos points',
    'pizza loyalty points',
    'how many points for a free pizza',
    'dominos rewards explained',
  ],
});

/** Worked example. Figures are illustrative and stated as such on the page. */
const VALUE_ROWS = [
  { orders: '1 order', points: '10 points', redeem: '—', value: '—' },
  { orders: '3 orders', points: '30 points', redeem: 'Halfway there', value: '—' },
  { orders: '6 orders', points: '60 points', redeem: 'Free medium pizza', value: '~$13.49' },
  { orders: '12 orders', points: '120 points', redeem: 'Two free pizzas', value: '~$26.98' },
];

/** Rewards in context: the other levers on the same order, ranked honestly. */
const LEVERS = [
  {
    lever: 'Switch to carryout',
    saving: '$8 – $12',
    effort: 'Collect it yourself',
    href: '/delivery-near-me',
  },
  {
    lever: 'Order from a bundle, not the menu',
    saving: '$4 – $8',
    effort: '90 seconds of comparing',
    href: '/coupons',
  },
  {
    lever: 'Buy drinks elsewhere',
    saving: '$3 – $6',
    effort: 'One extra stop',
    href: '/drinks',
  },
  {
    lever: 'Rewards points',
    saving: '~$2 per order',
    effort: 'Sign in before ordering',
    href: '/rewards',
  },
];

const OPTIMISE = [
  {
    icon: Gift,
    title: 'Sign in every single time',
    body: 'Including on carryout, including on a small order, including when you are in a hurry. This is the one that costs people the most and takes the least effort to fix.',
  },
  {
    icon: Gift,
    title: 'Remember carryout earns too',
    body: 'At most chains it earns at the same rate as delivery. Since carryout is also the cheapest way to order, it is the best combination available: lowest price and full points on the same transaction.',
  },
  {
    icon: Gift,
    title: 'Redeem on top of a deal',
    body: 'The redemption comes off your account, not out of the basket, so it generally applies alongside a bundle price. Redeeming on a full-price order wastes the only stacking the system allows.',
  },
  {
    icon: Gift,
    title: 'Redeem for the priciest qualifying item',
    body: 'If the reward is any medium pizza, take a specialty one rather than a plain cheese. Same points, more pizza — the same logic that applies to any flat-rate offer.',
  },
];

const MISTAKES = [
  {
    title: 'Checking out as a guest',
    body: 'Points do not attach to guest orders and most schemes will not add them retrospectively. Every guest checkout is roughly two dollars of value thrown away for the sake of skipping a ten-second sign-in.',
  },
  {
    title: 'Falling under the order minimum',
    body: 'There is a spend threshold below which an order earns nothing at all. An order a dollar under the line earns exactly zero points, not a reduced number.',
  },
  {
    title: 'Running two accounts in one household',
    body: 'Two people ordering under separate accounts earn at half the rate of one shared account. Consolidating is the single easiest improvement available.',
  },
  {
    title: 'Redeeming on a full-price order',
    body: 'Because the redemption comes off your account, it stacks with a bundle price. Using it on an order that had no other discount wastes the only stacking the system allows.',
  },
  {
    title: 'Ordering through an aggregator app',
    body: 'Third-party delivery platforms generally do not pass loyalty credit back to the chain. You pay marked-up prices and earn nothing for it.',
  },
];

export default function RewardsPage() {
  return (
    <>
      <JsonLd data={[breadcrumbSchema(CRUMBS), faqSchema(REWARDS_FAQS)]} />

      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <Breadcrumbs crumbs={CRUMBS} />
      </div>

      <header className="border-b border-line bg-surface-alt">
        <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-ink sm:text-[2.75rem]">
            Pizza rewards, explained: what the points are actually worth
          </h1>
          <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-ink-muted">
            Pizza loyalty schemes are unusual, and the way they are unusual inverts the
            normal logic of rewards programmes. Understanding one design choice tells you
            everything about how to use them well.
          </p>
          <LastUpdated className="mt-5" />
          <div className="relative mt-7 aspect-[21/9] overflow-hidden rounded-card border border-line">
            <Image
              src="/images/rewards-hero.jpg"
              alt="A phone showing a pizza ordering app next to a wrapped pizza box"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1024px"
              className="object-cover"
            />
          </div>
        </div>
      </header>

      {/* ── How they work ────────────────────────────────────────────────── */}
      <section aria-labelledby="how-it-works" className="mx-auto max-w-5xl px-5 py-14 sm:px-8 sm:py-16">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand">
          The one thing to understand
        </p>
        <h2
          id="how-it-works"
          className="mt-2.5 text-[1.75rem] font-extrabold leading-tight tracking-tight text-navy-dark sm:text-[2rem]"
        >
          Points per order, not per dollar
        </h2>
        <div className="prose-guide mt-5 max-w-3xl">
          <p>
            Airlines, supermarkets and credit cards award points in proportion to spending:
            spend twice as much, earn twice as much. Pizza chains generally do not work that
            way. They award a fixed number of points for each qualifying order above a
            modest minimum, which means a fifteen-dollar order and a sixty-dollar order earn
            the same.
          </p>
          <p>
            Everything useful about optimising these programmes follows from that single
            fact. The scheme rewards <strong>frequency</strong>, not spending. If you were
            going to place one sixty-dollar order and could reasonably split it into two
            thirty-dollar orders on different days, you earn twice the points for exactly
            the same total spend.
          </p>
          <p>
            It also explains why the advice you have absorbed from other loyalty schemes
            actively misleads you here. Saving up for one big order is the right move on an
            airline card and the wrong move on a pizza account.
          </p>
        </div>
      </section>

      {/* ── What the points are worth ────────────────────────────────────── */}
      <section aria-labelledby="worth" className={SECTION}>
        <div className={INNER}>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand">
            The arithmetic
          </p>
          <h2
            id="worth"
            className="mt-2.5 text-[1.75rem] font-extrabold leading-tight tracking-tight text-navy-dark sm:text-[2rem]"
          >
            What a free pizza actually costs you
          </h2>
          <p className="mt-3 max-w-3xl text-[16px] leading-relaxed text-ink-muted">
            Working from a typical structure — ten points per qualifying order, sixty points
            for a free medium pizza — here is what the balance is worth as it builds.
          </p>

          <div className="table-scroll mt-6 overflow-hidden rounded-card border border-line">
            <table className="w-full min-w-[34rem] text-[15px]">
              <caption className="sr-only">
                Example of how a pizza rewards balance builds and what it redeems for
              </caption>
              <thead>
                <tr className="bg-navy text-left text-[11px] uppercase tracking-wide text-white">
                  <th scope="col" className="px-4 py-3 font-bold">
                    Orders placed
                  </th>
                  <th scope="col" className="px-4 py-3 font-bold">
                    Balance
                  </th>
                  <th scope="col" className="px-4 py-3 font-bold">
                    Redeems for
                  </th>
                  <th scope="col" className="px-4 py-3 text-right font-bold">
                    Menu value
                  </th>
                </tr>
              </thead>
              <tbody>
                {VALUE_ROWS.map((row, i) => (
                  <tr
                    key={row.orders}
                    className={`border-t border-line ${
                      i % 2 === 1 ? 'bg-surface-alt' : 'bg-surface'
                    }`}
                  >
                    <th scope="row" className="px-4 py-3 text-left font-semibold text-ink">
                      {row.orders}
                    </th>
                    <td className="px-4 py-3 tabular-nums text-ink-muted">{row.points}</td>
                    <td className="px-4 py-3 text-ink-muted">{row.redeem}</td>
                    <td className="px-4 py-3 text-right font-extrabold tabular-nums text-brand">
                      {row.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <PriceNote className="mt-3" />

          <div className="prose-guide mt-6 max-w-3xl text-[15px]">
            <p>
              Six orders earning a pizza worth around {CURRENCY_SYMBOL}13.49 means each
              order generates roughly {CURRENCY_SYMBOL}2.25 of value. What that is worth as
              a percentage depends entirely on your order size: on a fifteen-dollar order it
              is an effective discount of about fifteen percent, and on a sixty-dollar
              family order about four percent.
            </p>
            <p>
              That is the number worth carrying around. It is real money, it costs nothing
              to collect, and it is also — as the next section sets out — the smallest of
              the four levers available to you.
            </p>
          </div>
        </div>
      </section>

      {/* ── Rewards in context ───────────────────────────────────────────── */}
      <section aria-labelledby="context" className={SECTION}>
        <div className={INNER}>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand">
            Honest perspective
          </p>
          <h2
            id="context"
            className="mt-2.5 flex items-center gap-3 text-[1.75rem] font-extrabold leading-tight tracking-tight text-navy-dark sm:text-[2rem]"
          >
            <Scale className="h-7 w-7 shrink-0 text-brand" aria-hidden="true" />
            Where rewards rank against everything else
          </h2>
          <p className="mt-3 max-w-3xl text-[16px] leading-relaxed text-ink-muted">
            Loyalty points get more attention than they deserve, because they feel like a
            reward rather than a discount. Measured on one order, here is how they compare
            with the other things you can do.
          </p>

          <div className="table-scroll mt-6 overflow-hidden rounded-card border border-line">
            <table className="w-full min-w-[36rem] text-[15px]">
              <caption className="sr-only">
                Typical saving from each money-saving lever on a single pizza order
              </caption>
              <thead>
                <tr className="bg-navy text-left text-[11px] uppercase tracking-wide text-white">
                  <th scope="col" className="px-4 py-3 font-bold">
                    What you do
                  </th>
                  <th scope="col" className="px-4 py-3 text-right font-bold">
                    Typical saving
                  </th>
                  <th scope="col" className="px-4 py-3 font-bold">
                    What it costs you
                  </th>
                </tr>
              </thead>
              <tbody>
                {LEVERS.map((row, i) => (
                  <tr
                    key={row.lever}
                    className={`border-t border-line ${
                      i % 2 === 1 ? 'bg-surface-alt' : 'bg-surface'
                    }`}
                  >
                    <th scope="row" className="px-4 py-3 text-left font-semibold">
                      <Link
                        href={row.href}
                        className="text-ink hover:text-brand hover:underline"
                      >
                        {row.lever}
                      </Link>
                    </th>
                    <td className="px-4 py-3 text-right font-extrabold tabular-nums text-brand">
                      {row.saving}
                    </td>
                    <td className="px-4 py-3 text-ink-muted">{row.effort}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="prose-guide mt-6 max-w-3xl text-[15px]">
            <p>
              Rewards come last, and by a wide margin. That is not an argument against
              joining — it takes ten seconds and the points accumulate whether you think
              about them or not. It is an argument against treating a points balance as a
              money-saving strategy. If you are signed in but still paying delivery fees on
              a store four minutes from your house, you are optimising the smallest number
              on the page.
            </p>
            <p>
              The combination that actually works is boring: collect it yourself, order from
              a bundle, skip the drinks, and be signed in while you do all three. Our{' '}
              <Link href="/posts/how-to-save-money-on-pizza-delivery">
                full money-saving guide
              </Link>{' '}
              ranks all eleven tactics by how much each one moves the total.
            </p>
          </div>
        </div>
      </section>

      <AdSlot slotId="rewards-mid" className="py-8" />

      {/* ── Optimise ─────────────────────────────────────────────────────── */}
      <section aria-labelledby="optimise" className={SECTION}>
        <div className={INNER}>
          <h2
            id="optimise"
            className="flex items-center gap-3 text-[1.75rem] font-extrabold leading-tight tracking-tight text-navy-dark sm:text-[2rem]"
          >
            <TrendingUp className="h-7 w-7 shrink-0 text-brand" aria-hidden="true" />
            Four ways to get more from the same spend
          </h2>
          <div className="mt-7 grid gap-5 sm:grid-cols-2">
            {OPTIMISE.map((tip) => (
              <article
                key={tip.title}
                className="rounded-card border border-line bg-surface p-5"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-soft text-brand">
                  <tip.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-3 text-lg font-extrabold text-ink">{tip.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">{tip.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mistakes ─────────────────────────────────────────────────────── */}
      <section aria-labelledby="mistakes" className={SECTION}>
        <div className={INNER}>
          <h2
            id="mistakes"
            className="flex items-center gap-3 text-[1.75rem] font-extrabold leading-tight tracking-tight text-navy-dark sm:text-[2rem]"
          >
            <AlertTriangle className="h-7 w-7 shrink-0 text-brand" aria-hidden="true" />
            Five mistakes that throw points away
          </h2>
          <ol className="mt-7 max-w-3xl space-y-4">
            {MISTAKES.map((m, i) => (
              <li
                key={m.title}
                className="flex gap-4 rounded-card border border-line bg-surface p-5"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-extrabold text-white">
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-base font-extrabold text-ink">{m.title}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-ink-muted">{m.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Honest answer ────────────────────────────────────────────────── */}
      <section aria-labelledby="honest" className={SECTION}>
        <div className={INNER}>
          <h2
            id="honest"
            className="text-[1.75rem] font-extrabold leading-tight tracking-tight text-navy-dark sm:text-[2rem]"
          >
            Are they worth joining? An honest answer
          </h2>
          <div className="prose-guide mt-5 max-w-3xl">
            <p>
              Yes, with a caveat. Signing up costs nothing and the effective discount for a
              regular orderer is meaningful — around ten to fifteen percent for someone who
              orders modest amounts frequently.
            </p>
            <p>
              The caveat is behavioural. These schemes exist to increase order frequency,
              and they work. If the existence of a points balance is nudging you into
              ordering pizza more often than you otherwise would, the programme is making
              money from you rather than the other way round. That is not a reason to avoid
              it — it is a reason to be honest with yourself about which is happening.
            </p>
            <p>
              One practical test: if you find yourself placing an order you did not want in
              order to reach a threshold, the maths has already failed. Spending fifteen
              dollars to unlock two dollars of value is not a saving, however satisfying the
              progress bar looks.
            </p>
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/posts/pizza-rewards-program-explained"
              className="inline-flex items-center gap-2 rounded-md bg-brand px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-dark"
            >
              The full rewards guide
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/coupons"
              className="inline-flex items-center gap-2 rounded-md border border-navy px-5 py-3 text-sm font-bold text-navy transition-colors hover:bg-navy hover:text-white"
            >
              Deal types that stack with rewards
            </Link>
            <Link
              href="/menus-prices"
              className="inline-flex items-center gap-2 rounded-md border border-navy px-5 py-3 text-sm font-bold text-navy transition-colors hover:bg-navy hover:text-white"
            >
              Menu &amp; example prices
            </Link>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className={SECTION}>
        <div className={INNER}>
          <FaqAccordion
            faqs={REWARDS_FAQS}
            heading="Rewards questions we get asked"
            headingId="rewards-faq"
            className=""
          />
        </div>
      </section>
    </>
  );
}
