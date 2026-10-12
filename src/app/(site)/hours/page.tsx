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
import { currentMonthYear } from '@/lib/utils/date';

const CRUMBS = [
  { name: 'Home', path: '/' },
  { name: 'Opening Hours', path: '/hours' },
];

/**
 * The common weekly pattern — general guidance, deliberately not presented as
 * any city's or store's actual hours (franchisees set their own).
 */
const TYPICAL_WEEK = [
  { days: 'Sunday – Thursday', opens: 'About 10:30am', closes: 'About midnight', lastDelivery: 'About 11:30pm' },
  { days: 'Friday – Saturday', opens: 'About 10:30am', closes: 'About 1:00am', lastDelivery: 'About 12:30am' },
];

/** Typical cut-offs before the posted close. */
const DELIVERY_CUTOFF_MIN = 30;
const CARRYOUT_CUTOFF_MIN = 10;

/** Closing times in minutes after midnight of the opening day (so 1am = 25 * 60). */
const CLOSING_TIMES = [
  { label: '10:00pm', minutes: 22 * 60 },
  { label: '11:00pm', minutes: 23 * 60 },
  { label: 'Midnight', minutes: 24 * 60 },
  { label: '1:00am', minutes: 25 * 60 },
  { label: '2:00am', minutes: 26 * 60 },
  { label: '3:00am', minutes: 27 * 60 },
];

/** Minutes after midnight → "11:30pm". */
function clock(total: number): string {
  const m = ((total % 1440) + 1440) % 1440;
  const h24 = Math.floor(m / 60);
  const min = m % 60;
  const suffix = h24 < 12 ? 'am' : 'pm';
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(min).padStart(2, '0')}${suffix}`;
}

const CHECK_STEPS = [
  {
    title: 'Open your store page, not the chain homepage',
    body: `Enter your address on ${BRAND.officialAppNote}. The store that comes back is the one that will make your order, and its page shows that store’s hours — including any holiday changes it has entered.`,
  },
  {
    title: 'Check delivery and carryout separately',
    body: 'Some stores list one set of hours for the building and stop delivery earlier. If delivery is greyed out but the store is “open”, switch to carryout.',
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
    question: `What time does ${BRAND.name} open?`,
    answer:
      'Most stores open late morning, commonly around 10:30am, seven days a week. Some open earlier for lunch trade and a few later on Sundays. Your store page shows the exact time.',
  },
  {
    question: `What time does ${BRAND.name} close?`,
    answer:
      'Commonly around midnight from Sunday to Thursday and around 1am on Friday and Saturday, with campus and city-centre stores often later. Delivery orders usually stop about thirty minutes before the posted close.',
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
  title: `${BRAND.name} Hours & Last Order Times (${currentMonthYear()})`,
  description:
    'Closing time is not last-order time. Typical weekday and weekend hours, a last-order ' +
    'calculator, holiday hours and how to check your own store.',
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
            The usual {BRAND.name} hours pattern
          </h2>
          <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-ink-muted">
            Most stores follow a similar weekly rhythm: a late-morning opening, a midnight
            close in the week and a later close on Friday and Saturday. Treat this as the
            pattern to expect, not the hours of any particular store — franchisees set
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
                  <th scope="col" className="px-4 py-3 font-bold">Last delivery order, roughly</th>
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
                    <td className="px-4 py-3.5 font-bold text-brand">{row.lastDelivery}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[13px] text-ink-muted">
            Campus and city-centre stores often close later; some suburban stores close
            earlier on Sundays. Always confirm your own store before ordering.
          </p>

          <h3 className="mt-12 text-2xl font-extrabold tracking-tight text-navy-dark">
            Last-order calculator
          </h3>
          <p className="mt-2 max-w-2xl text-[16px] leading-relaxed text-ink-muted">
            Find your store’s posted closing time on the left. The columns show roughly when
            it stops taking each kind of order — delivery stops earlier because the driver
            has to get back before close.
          </p>
          <div className="table-scroll mt-5 overflow-hidden rounded-card border border-line bg-surface">
            <table className="w-full text-[14px] sm:text-[15px]">
              <caption className="sr-only">
                Approximate last delivery and carryout order times for each closing time
              </caption>
              <thead>
                <tr className="bg-navy text-left text-[11px] uppercase tracking-wide text-white">
                  <th scope="col" className="px-4 py-3 font-bold">Posted closing time</th>
                  <th scope="col" className="px-4 py-3 font-bold">Last delivery order</th>
                  <th scope="col" className="px-4 py-3 font-bold">Last carryout order</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {CLOSING_TIMES.map((t) => (
                  <tr key={t.label} className="odd:bg-surface even:bg-surface-alt">
                    <th scope="row" className="px-4 py-3.5 text-left font-bold text-ink">
                      {t.label}
                    </th>
                    <td className="px-4 py-3.5 font-bold text-brand">
                      {clock(t.minutes - DELIVERY_CUTOFF_MIN)}
                    </td>
                    <td className="px-4 py-3.5 text-ink">{clock(t.minutes - CARRYOUT_CUTOFF_MIN)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[13px] text-ink-muted">
            Based on the common {DELIVERY_CUTOFF_MIN}-minute delivery and{' '}
            {CARRYOUT_CUTOFF_MIN}-minute carryout cut-offs. Busy nights and short-staffed
            closes can bring both forward.
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
            one-off holiday hours.
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
          What changes in the last hour of trading
        </h2>
        <div className="prose-guide mt-4">
          <p>The recipe does not change. The circumstances do.</p>
          <ul>
            <li>
              <strong>Staffing is at its lowest.</strong> The closing crew is smaller than
              the dinner-rush crew, so a burst of late orders takes longer to clear than the
              same volume at seven o’clock.
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
