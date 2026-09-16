import type { Metadata } from 'next';
import Link from 'next/link';
import { Search } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import FaqAccordion from '@/components/FaqAccordion';
import LastUpdated from '@/components/LastUpdated';
import AdSlot from '@/components/AdSlot';
import JsonLd from '@/components/JsonLd';
import { generatePageSEO } from '@/lib/seo-config';
import { breadcrumbSchema, faqSchema } from '@/lib/seo/schema';
import { BRAND, NOT_AFFILIATED_SHORT } from '@/lib/site-config';
import { currentMonthYear } from '@/lib/utils/date';

const CRUMBS = [
  { name: 'Home', path: '/' },
  { name: 'Store Locator Guide', path: '/store-locator' },
];

const LOCATOR_FAQS = [
  {
    question: 'Why does the locator assign me a store that is not the closest one?',
    answer:
      'Because delivery zones are drawn around driving routes rather than straight-line distance. Freeways, rivers, canyons and city boundaries all split zones, so the store nearest on a map is frequently not the one that serves your street.',
  },
  {
    question: 'Can I order from a different store than the one assigned to me?',
    answer:
      'For delivery, generally not — the zone determines it. For carryout you can usually choose any store you are willing to drive to, which occasionally matters because deal availability differs store by store.',
  },
  {
    question: 'My new address is not recognised. What now?',
    answer:
      'Zone maps are updated periodically and new streets can lag behind construction. Call the nearest store directly — staff can often serve an address the online checker has not yet picked up.',
  },
  {
    question: 'Why do two nearby stores show different deals?',
    answer:
      'Franchisees opt into promotions individually because they absorb the margin cost. A nationally advertised offer is live only at participating stores, which is why checking your own store page matters more than searching for a code.',
  },
];

export const metadata: Metadata = generatePageSEO({
  title: `How the ${BRAND.name} Store Locator Works — and Why It Picks That Store (${currentMonthYear()})`,
  description:
    'Why delivery zones follow driving routes rather than distance, how store assignment affects which ' +
    'deals you see, and what to do when the locator does not recognise your address.',
  path: '/store-locator',
  keywords: [
    'pizza store locator',
    'find pizza store near me',
    'pizza delivery zone',
    'which store delivers to me',
  ],
});

const STEPS = [
  {
    title: 'Enter the full street address, not just a postcode',
    body: 'Zone boundaries frequently run down the middle of a postcode. A postcode-level search returns a best guess; a full address returns the actual answer, including whether your street is delivery or carryout only.',
  },
  {
    title: 'Set delivery or carryout before you look at anything else',
    body: 'The two modes surface different offers, and carryout-only pricing does not appear while the site has you in delivery mode. Choosing afterwards re-prices the basket or clears it at some chains.',
  },
  {
    title: 'Check whether more than one store serves you',
    body: 'Uncommon in dense cities, quite common in suburbs. Where two stores overlap, their deal lists genuinely differ, so it is worth thirty seconds to compare before you build a basket.',
  },
  {
    title: 'Read the store page, not the national page',
    body: 'Hours, deals and item availability are all set at store level. The national menu tells you what typically exists; your store page tells you what you can actually order tonight.',
  },
];

export default function StoreLocatorPage() {
  return (
    <>
      <JsonLd data={[breadcrumbSchema(CRUMBS), faqSchema(LOCATOR_FAQS)]} />

      <div className="mx-auto max-w-5xl px-4">
        <Breadcrumbs crumbs={CRUMBS} />
      </div>

      <header className="border-b border-line bg-surface-alt">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-ink sm:text-[2.75rem]">
            How store assignment actually works
          </h1>
          <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-ink-muted">
            The locator is not choosing the nearest store. It is choosing the store whose
            delivery zone contains your address — and zones follow driving routes, not
            distance. That one distinction explains most of what confuses people about it.
          </p>
          <LastUpdated className="mt-5" />
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 pt-8">
        <div className="flex gap-3 rounded-card border border-navy/30 bg-navy-soft p-4">
          <Search className="mt-0.5 h-5 w-5 shrink-0 text-navy-dark" aria-hidden="true" />
          <p className="text-[15px] leading-relaxed text-navy-dark">
            <strong>We do not operate a store finder.</strong> {NOT_AFFILIATED_SHORT} To
            find the store that serves your address, use the official locator on{' '}
            {BRAND.officialAppNote}. This page explains how to read what it tells you.
          </p>
        </div>
      </div>

      <section aria-labelledby="how-zones-work" className="mx-auto max-w-3xl px-4 py-12">
        <h2
          id="how-zones-work"
          className="text-3xl font-extrabold tracking-tight text-navy-dark"
        >
          Why zones look arbitrary
        </h2>
        <div className="prose-guide mt-4">
          <p>
            A delivery zone is a map of what one store can reach quickly enough for the
            food to still be worth eating. That makes it a map of driving time, and driving
            time is shaped by geography rather than by geometry.
          </p>
          <p>
            In San Diego, canyons split neighbourhoods that share a border. In Jacksonville,
            the river does it — a store on the far bank may as well be in another city
            because of how the bridges route traffic. In Los Angeles it is the freeways, in
            Seattle the hills and the water, and in Atlanta the fact that everything depends
            on a highway network that stops working at half past five.
          </p>
          <p>
            The result is zones that look odd on a map and make perfect sense from a
            driver&apos;s seat. A store two miles away across a freeway may not serve you
            while one three miles away on your side does.
          </p>
          <h3>Why this affects your price, not just your wait</h3>
          <p>
            Store assignment decides which offers you see, because franchisees opt into
            promotions individually. Two stores four miles apart can show different deal
            lists. If a nationally advertised offer is not on your store page, your store is
            not running it — and no coupon code will change that.
          </p>
        </div>
      </section>

      <section
        aria-labelledby="steps"
        className="border-y border-line bg-surface-alt"
      >
        <div className="mx-auto max-w-3xl px-4 py-12">
          <h2 id="steps" className="text-3xl font-extrabold tracking-tight text-navy-dark">
            Getting a useful answer out of the locator
          </h2>
          <ol className="mt-6 space-y-4">
            {STEPS.map((step, i) => (
              <li
                key={step.title}
                className="flex gap-4 rounded-card border border-line bg-surface p-5"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-extrabold text-white">
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-base font-extrabold text-ink">{step.title}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-ink-muted">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <AdSlot slotId="locator-mid" className="py-8" />

      <div className="mx-auto max-w-3xl px-4 pb-16">
        <FaqAccordion faqs={LOCATOR_FAQS} heading="Store locator questions" />
      </div>
    </>
  );
}
