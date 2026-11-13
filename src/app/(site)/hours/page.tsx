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
import { BRAND } from '@/lib/site-config';
import { PAGE_DATES } from '@/lib/page-dates';
import { monthYearOf } from '@/lib/utils/date';

/** Day this page's content last really changed — update it with the content. */
const PAGE_UPDATED = PAGE_DATES['/hours'];

const CRUMBS = [
  { name: 'Home', path: '/' },
  { name: 'Opening Hours', path: '/hours' },
];

/**
 * The common weekly pattern — general guidance, deliberately not presented as
 * any city's or store's actual hours (franchisees set their own).
 */
const TYPICAL_WEEK = [
  { days: 'Sunday – Thursday', opens: 'About 10:30am', closes: 'About midnight' },
  { days: 'Friday – Saturday', opens: 'About 10:30am', closes: 'About 1:00am' },
];

const CHECK_STEPS = [
  {
    title: 'Open your store page, not the chain homepage',
    body: `Enter your address on ${BRAND.officialAppNote}. The store that comes back is the one that will make your order, and its page shows that store’s hours — including any holiday changes it has entered.`,
  },
  {
    title: 'Check delivery and carryout separately',
    body: 'Some stores list one set of hours for the building and stop delivery earlier. If delivery is grayed out but the store is “open”, switch to carryout.',
  },
  {
    title: 'Treat search-engine listings as a guide only',
    body: 'Map and search listings are convenient but are often not updated for one-off changes such as holidays, staff shortages or bad weather.',
  },
  {
    title: 'Call when it really matters',
    body: 'For a large order, a late order on a holiday or a party booking, a two-minute phone call to the store is the only answer that is guaranteed to be current.',
  },
];

const HOURS_FAQS = [
  {
    question: 'What time do pizza stores stop taking delivery orders?',
    answer:
      'It varies by store. Some stop taking delivery orders a little before the posted closing time, because the order still has to be made, baked and driven out before the store shuts. We have not surveyed stores for an exact cut-off, so check your store page or call if you are ordering close to closing time.',
  },
  {
    question: 'Are weekend hours different?',
    answer:
      'Usually later by about an hour on Friday and Saturday, with Sunday often the earliest close of the week. Hours are set store by store, so two stores in the same city can differ by more than an hour.',
  },
  {
    question: 'Is the food different late at night?',
    answer:
      'The recipe is the same. The practical risk near closing time is that the store stops taking orders, or delivery stops, a little before the posted close — so ordering well before closing time is the safer bet.',
  },
  {
    question: `What time does ${BRAND.name} open?`,
    answer:
      'Opening times are set by each store, so they vary. A late-morning opening is common, but check your store page for the exact time.',
  },
  {
    question: `What time does ${BRAND.name} close?`,
    answer:
      'Commonly around midnight from Sunday to Thursday and around 1am on Friday and Saturday, with campus and city-center stores often later. Some stores stop delivery a little before the posted close, so check your store page.',
  },
  {
    question: `Is ${BRAND.name} open 24 hours?`,
    answer:
      'Very rarely. A small number of stores in big cities and near campuses run into the early hours, but almost all close at some point overnight. If you need very late food, check which nearby store closes latest and switch to carryout as the cut-off approaches.',
  },
  {
    question: 'Do holidays change opening hours?',
    answer:
      'Yes, and unpredictably, because each franchisee decides. Major holidays commonly mean reduced hours or a full closure at some stores in a city while others nearby stay open. Check your specific store rather than assuming.',
  },
];

export const metadata: Metadata = generatePageSEO({
  title: `${BRAND.name} Hours & Last Order Times (${monthYearOf(PAGE_UPDATED)})`,
  description:
    'Closing time is not always last-order time. Typical weekday and weekend hours, holiday ' +
    'hours and how to check your own store before a late order.',
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
            Each store’s owner sets its hours, so there is no single {BRAND.name} timetable.
            This page gives the usual weekly pattern, a table of last-order times for every
            common closing time, the holidays that break the pattern, and how to see your
            own store’s real hours.
          </p>
          <LastUpdated date={PAGE_UPDATED} className="mt-5" />
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
            The time on the door is when the store shuts, which is not always the last moment
            it takes orders. An order still has to be made, baked and — for delivery — driven
            out before close, so some stores stop delivery earlier than the posted time. We
            have not surveyed stores for an exact cut-off, so check your store page and order
            with time to spare. What to do once you have missed it is covered in our{' '}
            <Link href="/posts/late-night-pizza-hours-guide">late-night ordering guide</Link>.
          </p>
          <h3>Hours are set per store, not nationally</h3>
          <p>
            Franchisees set their own hours based on local demand and staffing. The chain
            page tells you what is typical; your store page tells you what is true. Campus
            and city-center stores often run later than suburban ones.
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
            The usual {BRAND.name} hours pattern
          </h2>
          <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-ink-muted">
            Many stores open in the late morning and stay open later on Friday and Saturday
            than in the week. Treat this as a rough pattern, not the hours of any particular
            store — franchisees set
            their own, and your store page has the real answer.
          </p>

          <div className="table-scroll mt-6 overflow-hidden rounded-card border border-line bg-surface">
            <table className="w-full text-[14px] sm:text-[15px]">
              <caption className="sr-only">Common weekly opening-hours pattern</caption>
              <thead>
                <tr className="bg-navy text-left text-[11px] uppercase tracking-wide text-white">
                  <th scope="col" className="px-4 py-3 font-bold">Days</th>
                  <th scope="col" className="px-4 py-3 font-bold">Usually opens</th>
                  <th scope="col" className="px-4 py-3 font-bold">Usually closes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {TYPICAL_WEEK.map((row) => (
                  <tr key={row.days} className="odd:bg-surface even:bg-surface-alt">
                    <th scope="row" className="px-4 py-3.5 text-left font-bold text-ink">
                      {row.days}
                    </th>
                    <td className="px-4 py-3.5 text-ink">{row.opens}</td>
                    <td className="px-4 py-3.5 text-ink">{row.closes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[13px] text-ink-muted">
            Campus and city-center stores often close later; some suburban stores close
            earlier on Sundays. Always confirm your own store before ordering.
          </p>

        </div>
      </section>

      <section aria-labelledby="holidays" className="mx-auto max-w-3xl px-4 py-12">
        <h2 id="holidays" className="text-3xl font-extrabold tracking-tight text-navy-dark">
          Holiday hours and big-event nights
        </h2>
        <div className="prose-guide mt-4">
          <p>
            Holidays are where store-by-store hours matter most, because each franchisee
            decides whether to open, close early or stay closed. Two stores in the same
            town can make different calls on the same day.
          </p>
          <ul>
            <li>
              <strong>Thanksgiving and Christmas Day.</strong> The days most likely to see
              reduced hours or a full closure. If a store is open, expect a later opening
              and an earlier close than usual.
            </li>
            <li>
              <strong>Christmas Eve and New Year’s Eve.</strong> Often open but closing
              early — and New Year’s Eve evenings are busy, so order well before the
              countdown.
            </li>
            <li>
              <strong>New Year’s Day.</strong> Usually open, often busy from mid-afternoon
              as people avoid cooking.
            </li>
            <li>
              <strong>Big game nights.</strong> Super Bowl Sunday is one of the busiest
              pizza days of the year. Hours do not change, but waits do: order an hour
              before kick-off, or pre-order for a set time if the app offers it.
            </li>
          </ul>
          <p>
            On any of these days, the store page on {BRAND.officialAppNote} is more
            reliable than a search-engine listing, which is often not updated for
            one-off holiday hours. For Christmas specifically, see our guide to{' '}
            <Link href="/posts/dominos-christmas-availability">
              {BRAND.name} Christmas availability
            </Link>
            .
          </p>
        </div>
      </section>

      <section aria-labelledby="check-hours" className="border-y border-line bg-surface-alt">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <h2 id="check-hours" className="text-3xl font-extrabold tracking-tight text-navy-dark">
            How to check your store’s real hours
          </h2>
          <ol className="mt-6 space-y-4">
            {CHECK_STEPS.map((step, i) => (
              <li key={step.title} className="flex gap-4 rounded-card border border-line bg-surface p-5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy text-[14px] font-extrabold text-white">
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-[16px] font-extrabold text-ink">{step.title}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-ink-muted">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <AdSlot slotId="hours-mid" className="py-8" />

      <section aria-labelledby="last-hour" className="mx-auto max-w-3xl px-4 py-12">
        <h2
          id="last-hour"
          className="text-3xl font-extrabold tracking-tight text-navy-dark"
        >
          Ordering late? Plan around the cut-off
        </h2>
        <div className="prose-guide mt-4">
          <p>
            If your store closes at midnight, placing a delivery order by about 11:00pm on a
            weeknight leaves a comfortable margin before any delivery cut-off your store may
            have. On Friday and Saturday the same margin applies to the later close.
          </p>
          <p>
            Our late-night guide covers ordering near closing time and the
            options once every nearby store has stopped taking orders.
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
