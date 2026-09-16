import type { Metadata } from 'next';
import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import FaqAccordion from '@/components/FaqAccordion';
import LastUpdated from '@/components/LastUpdated';
import AdSlot from '@/components/AdSlot';
import JsonLd from '@/components/JsonLd';
import { generatePageSEO } from '@/lib/seo-config';
import { breadcrumbSchema, faqSchema } from '@/lib/seo/schema';
import { locations } from '@/data/locations';
import { BRAND } from '@/lib/site-config';
import { currentMonthYear } from '@/lib/utils/date';

const CRUMBS = [
  { name: 'Home', path: '/' },
  { name: 'Opening Hours', path: '/hours' },
];

const HOURS_FAQS = [
  {
    question: 'What time do pizza stores stop taking delivery orders?',
    answer:
      'Typically twenty to thirty minutes before the posted closing time, because the order still has to be made, baked, boxed, driven out and the driver returned before the store shuts. A store closing at midnight usually takes its last delivery order around 11:30pm.',
  },
  {
    question: 'Are weekend hours different?',
    answer:
      'Usually later by about an hour on Friday and Saturday, with Sunday often the earliest close of the week. Hours are set store by store, so two stores in the same city can genuinely differ by more than an hour.',
  },
  {
    question: 'Is the food different late at night?',
    answer:
      'The recipe is identical, but the closing crew is smaller and clean-down has already started, so some items requiring already-cleaned equipment can quietly become unavailable. Ordering thirty minutes before close rather than five gets you a noticeably better experience for the same money.',
  },
  {
    question: 'Do holidays change opening hours?',
    answer:
      'Yes, and unpredictably, because each franchisee decides. Major holidays commonly mean reduced hours or a full closure at some stores in a city while others nearby stay open. Check your specific store rather than assuming.',
  },
];

export const metadata: Metadata = generatePageSEO({
  title: `${BRAND.name} Opening Hours: Last Order Times Explained (${currentMonthYear()})`,
  description:
    'Closing time and last-order time are different things. Typical weekday, weekend and late-night ' +
    `hours across ${locations.length} US markets, plus what changes in the final hour of trading.`,
  path: '/hours',
  keywords: [
    'dominos hours',
    'pizza delivery hours',
    'what time does pizza close',
    'late night pizza hours',
  ],
});

export default function HoursPage() {
  return (
    <>
      <JsonLd data={[breadcrumbSchema(CRUMBS), faqSchema(HOURS_FAQS)]} />

      <div className="mx-auto max-w-5xl px-4">
        <Breadcrumbs crumbs={CRUMBS} />
      </div>

      <header className="border-b border-line bg-surface-alt">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-ink sm:text-[2.75rem]">
            Opening hours, and the last-order time nobody advertises
          </h1>
          <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-ink-muted">
            The most common late-night mistake is assuming a store listed as closing at
            midnight will take an order at 11:55pm. It will not, and the reason is
            straightforward once you have worked a closing shift.
          </p>
          <LastUpdated className="mt-5" />
        </div>
      </header>

      <section aria-labelledby="last-order" className="mx-auto max-w-3xl px-4 py-12">
        <h2
          id="last-order"
          className="text-3xl font-extrabold tracking-tight text-navy-dark"
        >
          Closing time is not last-order time
        </h2>
        <div className="prose-guide mt-4">
          <p>
            The posted closing time is when the store shuts. Your order has to be taken,
            made, baked, boxed and — for delivery — driven out and the driver returned,
            all before that moment.
          </p>
          <p>
            In practice most stores stop accepting delivery orders twenty to thirty minutes
            before close. Carryout often runs a little later, because there is no round trip
            to fit in. If you are close to the wire, switching to collection sometimes buys
            you fifteen minutes.
          </p>
          <h3>Hours are set per store, not nationally</h3>
          <p>
            Franchisees set their own hours based on local demand and staffing. The chain
            page tells you what is typical; your store page tells you what is true. Campus
            and city-centre stores consistently run later than suburban ones, because the
            demand justifies the staffing.
          </p>
        </div>
      </section>

      <section
        aria-labelledby="typical-hours"
        className="border-y border-line bg-surface-alt"
      >
        <div className="mx-auto max-w-5xl px-4 py-12">
          <h2
            id="typical-hours"
            className="flex items-center gap-2 text-3xl font-extrabold tracking-tight text-navy-dark"
          >
            <Clock className="h-7 w-7 text-brand" aria-hidden="true" />
            Typical hours by market
          </h2>
          <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-ink-muted">
            General guidance for each market we cover, not the hours of any one store.
            Subtract twenty to thirty minutes from the closing time to estimate the last
            delivery order.
          </p>

          <div className="mt-6 overflow-x-auto rounded-card border border-line bg-surface">
            <table className="w-full min-w-[38rem] text-sm">
              <caption className="sr-only">
                Typical opening hours by city, weekday and weekend
              </caption>
              <thead>
                <tr className="bg-navy-soft text-left text-[12px] uppercase tracking-wide text-navy-dark">
                  <th scope="col" className="px-4 py-3 font-bold">
                    City
                  </th>
                  <th scope="col" className="px-4 py-3 font-bold">
                    Mon–Thu
                  </th>
                  <th scope="col" className="px-4 py-3 font-bold">
                    Fri–Sat
                  </th>
                  <th scope="col" className="px-4 py-3 font-bold">
                    Sunday
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {locations.map((loc) => {
                  const weekday = loc.hours.find((h) => h.day === 'Monday')!;
                  const weekend = loc.hours.find((h) => h.day === 'Friday')!;
                  const sunday = loc.hours.find((h) => h.day === 'Sunday')!;
                  return (
                    <tr key={loc.slug}>
                      <th scope="row" className="px-4 py-3 text-left font-bold text-ink">
                        {loc.city}, {loc.stateCode}
                      </th>
                      <td className="px-4 py-3 text-ink-muted">
                        {weekday.open}–{weekday.close}
                      </td>
                      <td className="px-4 py-3 text-ink-muted">
                        {weekend.open}–{weekend.close}
                      </td>
                      <td className="px-4 py-3 text-ink-muted">
                        {sunday.open}–{sunday.close}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[13px] text-ink-muted">
            Times shown in 24-hour format. These are market-level examples for reference —
            confirm your own store&apos;s hours before ordering.
          </p>
        </div>
      </section>

      <AdSlot slotId="hours-mid" className="py-8" />

      <section aria-labelledby="last-hour" className="mx-auto max-w-3xl px-4 py-12">
        <h2
          id="last-hour"
          className="text-3xl font-extrabold tracking-tight text-navy-dark"
        >
          What changes in the last hour of trading
        </h2>
        <div className="prose-guide mt-4">
          <p>The recipe does not change. The circumstances do.</p>
          <ul>
            <li>
              <strong>Staffing is at its lowest.</strong> The closing crew is smaller than
              the dinner-rush crew, so a burst of late orders takes longer to clear than the
              same volume at seven o&apos;clock.
            </li>
            <li>
              <strong>Clean-down has started.</strong> Prep areas and equipment are broken
              down progressively through the last hour. That is a health requirement, not
              laziness.
            </li>
            <li>
              <strong>Some items become unavailable.</strong> Where an item needs equipment
              that has already been cleaned, it can quietly drop off the menu. Wings and
              pasta are the usual candidates.
            </li>
            <li>
              <strong>Delivery zones sometimes shrink.</strong> With fewer drivers on, some
              stores restrict how far they will send a late run.
            </li>
          </ul>
          <p>
            None of this makes a late-night pizza bad. It does mean that ordering at eleven
            rather than half past gets you a better experience for exactly the same money.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/posts/late-night-pizza-hours-guide"
            className="inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-dark"
          >
            The full late-night guide
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            href="/delivery-near-me"
            className="inline-flex items-center gap-2 rounded-md border border-navy px-4 py-2.5 text-sm font-bold text-navy transition-colors hover:bg-navy hover:text-white"
          >
            Delivery near me
          </Link>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 pb-16">
        <FaqAccordion faqs={HOURS_FAQS} heading="Opening hours questions" />
      </div>
    </>
  );
}
