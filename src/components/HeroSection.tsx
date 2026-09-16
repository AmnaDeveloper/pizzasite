import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { BRAND, CURRENCY_SYMBOL, SITE_NAME } from '@/lib/site-config';
import { currentMonthYear } from '@/lib/utils/date';

const FACTS = [
  { value: '20', label: 'menu items priced' },
  { value: '12', label: 'deal types explained' },
  { value: '16', label: 'city delivery guides' },
  { value: `${CURRENCY_SYMBOL}9`, label: 'typical carryout saving' },
];

/**
 * Depth here is built entirely from white at low opacity over the flat brand
 * blue — a radial highlight plus three concentric rings. Layering with white
 * rather than a second colour keeps the strict two-hue palette intact and costs
 * nothing at load time, since there is no image to fetch and the heading stays
 * the LCP element.
 *
 * Contrast on every text layer is checked: white 6.50:1, white/85 5.18:1,
 * white/80 4.77:1 against #006491. Nothing sits below white/80.
 */
export default function HeroSection() {
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

      <div className="relative mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <p className="inline-flex items-center gap-2 rounded-full bg-brand px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.1em]">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-white" />
          Updated {currentMonthYear()}
        </p>

        {/* 58px / weight 900 on desktop. Mobile steps down to 40px — 58px does
            not fit a phone without breaking mid-word. Inter is loaded as a
            variable font across 100–900, so 900 is a real cut, not synthesised. */}
        <h1 className="mt-6 max-w-4xl text-[2.5rem] font-black leading-[1.03] tracking-tight sm:text-[58px]">
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
          {SITE_NAME} is an independent guide. We track example prices across a sample of
          stores, work out which offer actually costs less for the order you are placing,
          and tell you when the answer is simply to collect it yourself.
        </p>

        <div className="mt-9 flex flex-wrap gap-3">
          <Link
            href="/menus-prices"
            className="inline-flex items-center gap-2 rounded-md bg-brand px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-black/10 transition-colors hover:bg-brand-dark"
          >
            Browse menu &amp; prices
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            href="/coupons"
            className="inline-flex items-center gap-2 rounded-md border border-white/45 bg-white/5 px-6 py-3.5 text-base font-bold text-white transition-colors hover:bg-white/15"
          >
            See current deal types
          </Link>
        </div>

        {/* Facts as one panel rather than four loose numbers under a hairline. */}
        <dl className="mt-14 grid grid-cols-2 divide-white/15 overflow-hidden rounded-card border border-white/20 bg-white/[0.07] sm:grid-cols-4 sm:divide-x">
          {FACTS.map((fact) => (
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
