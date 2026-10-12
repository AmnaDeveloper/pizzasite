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
    question: 'Can I get pizza delivered to a hotel or a park?',
    answer:
      'A hotel, yes — give the street address and room number and expect to meet the driver in the lobby. A park or beach has no street address, so a normal delivery usually is not possible; some ordering apps offer fixed drop-off points instead, or you can use a nearby address and walk over.',
  },
  {
    question: 'Why is my order coming from a store further away?',
    answer:
      'Your address sits inside that store’s delivery zone. Zones are drawn around driving time, so a store that looks further away can be quicker to reach than one just across a freeway or river.',
  },
  {
    question: 'Why do two nearby stores show different deals?',
    answer:
      'Franchisees opt into promotions individually because they absorb the margin cost. A nationally advertised offer is live only at participating stores, which is why checking your own store page matters more than searching for a code.',
  },
];

export const metadata: Metadata = generatePageSEO({
  title: `How the ${BRAND.name} Store Locator Works`,
  description:
    'Why delivery zones follow driving routes, not distance; how your assigned store decides which ' +
    'deals you see; and what to do when your address is not recognised.',
  path: '/store-locator',
  keywords: [
    'pizza store locator',
    'find pizza store near me',
    'pizza delivery zone',
    'which store delivers to me',
  ],
});

const TRICKY_ADDRESSES = [
  {
    title: 'Apartments and gated communities',
    body: 'Put the building, unit number and gate code in the delivery instructions, not just the street address. If the entrance is round the back, say so — drivers lose most time at the gate, not on the road.',
  },
  {
    title: 'Campuses and dorms',
    body: 'Many campuses route all deliveries to a single drop-off point. Use the building name, and meet the driver at the main entrance if your dorm needs a key card.',
  },
  {
    title: 'Hotels',
    body: 'Give the hotel’s street address and your room number, and expect to meet the driver in the lobby — most hotels do not let delivery drivers go up to rooms.',
  },
  {
    title: 'Offices and business parks',
    body: 'Add the company name and floor, and check reception will accept food after hours. Large orders go far more smoothly when one person is named as the contact.',
  },
  {
    title: 'Parks, beaches and venues',
    body: 'Places without a street address can’t take a normal delivery. Some ordering apps offer set drop-off points for these; otherwise, pick a nearby address you can walk to.',
  },
  {
    title: 'Brand-new streets',
    body: 'New builds can take months to appear in delivery maps. Enter the nearest established address with a clear note, or call the store directly — staff can often serve what the website can’t find.',
  },
];

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
            driver’s seat. A store two miles away across a freeway may not serve you
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

      <section aria-labelledby="tricky-addresses" className="mx-auto max-w-3xl px-4 py-12">
        <h2
          id="tricky-addresses"
          className="text-3xl font-extrabold tracking-tight text-navy-dark"
        >
          Ordering to a tricky address
        </h2>
        <p className="mt-3 text-[16px] leading-relaxed text-ink-muted">
          Most failed or late deliveries are not the store’s fault — the driver simply
          cannot find the door. These are the addresses that cause the most trouble, and
          what to type so the order arrives.
        </p>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {TRICKY_ADDRESSES.map((a) => (
            <li key={a.title} className="rounded-card border border-line bg-surface p-5">
              <h3 className="text-base font-extrabold text-ink">{a.title}</h3>
              <p className="mt-1.5 text-[15px] leading-relaxed text-ink-muted">{a.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="carryout-choice" className="border-y border-line bg-surface-alt">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <h2
            id="carryout-choice"
            className="text-3xl font-extrabold tracking-tight text-navy-dark"
          >
            Carryout: you can pick the store
          </h2>
          <div className="prose-guide mt-4">
            <p>
              Delivery is locked to the store whose zone covers your address. Carryout is
              not — you can collect from any store you are willing to drive to. That opens
              up a small but real saving that most people never use.
            </p>
            <p>
              Because each franchisee chooses its own promotions, the store near your office
              and the store near your home may show different deal lists on the same day.
              Before a large order, enter each address in the app, compare the deals
              pages, and collect from whichever is running the better offer. It takes two
              minutes and can be worth several dollars on a family order.
            </p>
            <p>
              The same trick works for hours: if your usual store has stopped taking orders,
              a store across town that closes later may still accept a carryout.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/posts/carryout-vs-delivery-which-is-cheaper"
              className="inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-dark"
            >
              Carryout vs delivery, worked out
            </Link>
            <Link
              href="/hours"
              className="inline-flex items-center gap-2 rounded-md border border-navy px-4 py-2.5 text-sm font-bold text-navy transition-colors hover:bg-navy hover:text-white"
            >
              Opening hours & last orders
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 pb-16">
        <FaqAccordion faqs={LOCATOR_FAQS} heading="Store locator questions" />
      </div>
    </>
  );
}
