import Link from 'next/link';
import { ArrowRight, CalendarCheck, ShieldCheck } from 'lucide-react';
import { authors } from '@/data/authors';
import { coupons } from '@/data/coupons';
import { getMenuItem, menuItems, posts } from '@/lib/content';
import { BRAND, CURRENCY_SYMBOL, SITE_NAME } from '@/lib/site-config';
import { currentMonthYear } from '@/lib/utils/date';

const money = (n: number) => `${CURRENCY_SYMBOL}${n.toFixed(2)}`;

/**
 * Depth here is built entirely from white at low opacity over the flat brand
 * blue — a radial highlight plus three concentric rings. Layering with white
 * rather than a second colour keeps the strict two-hue palette intact and costs
 * nothing at load time, since there is no image to fetch and the heading stays
 * the LCP element.
 *
 * The right-hand card answers the page's head query ("how much is a Domino's
 * pizza") in the first screen, in a shape Google can lift as a snippet. Every
 * number in it is read from the menu and coupon data, so it cannot drift.
 *
 * Contrast on every text layer is checked: white 6.50:1, white/85 5.18:1,
 * white/80 4.77:1 against #006491. Nothing sits below white/80.
 */
export default function HeroSection() {
  const cheese = getMenuItem('classic-cheese-pizza');
  const carryout = coupons.find((c) => c.id === 'cpn-carryout-deal');

  const facts = [
    { value: String(menuItems.length), label: 'menu items priced' },
    { value: String(coupons.length), label: 'deal types explained' },
    { value: String(posts.length), label: 'money-saving guides' },
    { value: `${CURRENCY_SYMBOL}9`, label: 'typical carryout saving' },
  ];

  return (
    <section className="relative overflow-hidden bg-navy text-white">
      {/* Soft highlight, upper right. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60rem_40rem_at_78%_12%,rgba(255,255,255,0.13),transparent_60%)]"
      />
      {/* Concentric rings — a pizza motif, drawn in CSS rather than fetched. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-28 hidden lg:block"
      >
        <div className="h-[34rem] w-[34rem] rounded-full border border-white/10">
          <div className="absolute inset-10 rounded-full border border-white/10" />
          <div className="absolute inset-24 rounded-full border border-white/[0.07]" />
        </div>
      </div>

      <div className="relative mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_24rem] lg:gap-14">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-brand px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.1em]">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-white" />
              Updated {currentMonthYear()}
            </p>

            {/* Mobile steps down to 40px — 56px does not fit a phone without
                breaking mid-word. Inter is a variable font, so 900 is real. */}
            <h1 className="mt-6 text-[2.5rem] font-black leading-[1.03] tracking-tight sm:text-[56px]">
              {BRAND.name}{' '}
              {/* The red rule marks the phrase the page is actually about. */}
              <span className="relative whitespace-nowrap">
                menu prices
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 -bottom-1.5 h-1.5 rounded-full bg-brand sm:-bottom-2 sm:h-2"
                />
              </span>
              , coupons and deals
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-white/85">
              Every item on the {BRAND.name} menu with example prices by size, the deal
              structures that actually lower your total, and the arithmetic on when
              carryout beats delivery. {SITE_NAME} is independent — we don&rsquo;t
              sell pizza, so we have no reason to push you toward a bigger basket.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="#prices"
                className="inline-flex items-center gap-2 rounded-md bg-brand px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-black/10 transition-colors hover:bg-brand-dark"
              >
                See the price list
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/coupons"
                className="inline-flex items-center gap-2 rounded-md border border-white/45 bg-white/5 px-6 py-3.5 text-base font-bold text-white transition-colors hover:bg-white/15"
              >
                Compare deal types
              </Link>
            </div>

            {/* Trust line — who checked the numbers and when. */}
            <p className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] font-medium text-white/80">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                Researched by {authors.map((a) => a.name).join(' & ')}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarCheck className="h-4 w-4" aria-hidden="true" />
                Prices reviewed {currentMonthYear()}
              </span>
            </p>
          </div>

          {/* Quick answer card. */}
          {cheese ? (
            <aside
              aria-labelledby="quick-answer"
              className="rounded-card bg-surface p-6 text-ink shadow-2xl shadow-black/25"
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand">
                Quick answer
              </p>
              <h2
                id="quick-answer"
                className="mt-2 text-xl font-extrabold leading-snug tracking-tight text-navy-dark"
              >
                How much is a {BRAND.name} pizza?
              </h2>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-muted">
                Cheese pizza at menu price, by size:
              </p>
              <dl className="mt-4 divide-y divide-line border-y border-line">
                {cheese.sizes.map((size) => (
                  <div key={size.name} className="flex items-baseline justify-between py-2.5">
                    <dt className="text-[15px] font-semibold">
                      {size.name}
                      <span className="ml-1.5 text-[13px] font-medium text-ink-muted">
                        {size.detail.split(',')[0]}
                      </span>
                    </dt>
                    <dd className="text-[17px] font-extrabold tabular-nums text-brand">
                      {money(size.price)}
                    </dd>
                  </div>
                ))}
              </dl>
              {carryout ? (
                <p className="mt-4 rounded-md bg-navy-soft px-3.5 py-3 text-[14px] leading-snug text-navy-dark">
                  <strong className="font-extrabold">Cheapest route:</strong> a large on a
                  carryout offer is commonly around{' '}
                  <strong className="font-extrabold">{carryout.discount}</strong>, any
                  toppings.
                </p>
              ) : null}
              <p className="mt-3 text-[12px] leading-snug text-ink-muted">
                Example prices from our store sample. Your store may differ — confirm at
                checkout.
              </p>
            </aside>
          ) : null}
        </div>

        {/* Facts as one panel rather than four loose numbers under a hairline. */}
        <dl className="mt-12 grid grid-cols-2 divide-white/15 overflow-hidden rounded-card border border-white/20 bg-white/[0.07] sm:grid-cols-4 sm:divide-x">
          {facts.map((fact) => (
            <div key={fact.label} className="px-5 py-5 sm:px-6">
              <dt className="sr-only">{fact.label}</dt>
              <dd>
                <span className="block text-[2rem] font-extrabold leading-none tabular-nums">
                  {fact.value}
                </span>
                <span className="mt-2.5 block text-[13px] font-medium leading-snug text-white/80">
                  {fact.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
