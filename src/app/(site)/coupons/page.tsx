import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ShieldAlert } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import CouponsClient from '@/components/CouponsClient';
import FaqAccordion from '@/components/FaqAccordion';
import LastUpdated from '@/components/LastUpdated';
import AdSlot from '@/components/AdSlot';
import JsonLd from '@/components/JsonLd';
import { generatePageSEO } from '@/lib/seo-config';
import { breadcrumbSchema, faqSchema } from '@/lib/seo/schema';
import { coupons } from '@/data/coupons';
import { BRAND } from '@/lib/site-config';
import { currentMonthYear } from '@/lib/utils/date';

const CRUMBS = [
  { name: 'Home', path: '/' },
  { name: 'Coupons & Deals', path: '/coupons' },
];

const COUPON_FAQS = [
  {
    question: 'Are the codes on this page live promotional codes?',
    answer:
      'No. They are placeholders we wrote to illustrate what each type of offer looks like. Live codes and deal tiles are shown on the official site once you have entered your address, because franchise stores opt into promotions individually.',
  },
  {
    question: 'Why does a nationally advertised deal not appear at my store?',
    answer:
      'Because participation is decided store by store. Franchisees absorb the margin cost of a discount, so a promotion advertised nationally is live only at the stores that opted in. If it is not on your store deals page, no code will make it appear.',
  },
  {
    question: 'Can I combine two deals on one order?',
    answer:
      'Very rarely. Most chains explicitly block combining a percentage discount with a bundle price. The one reliable exception is a loyalty redemption, which comes off your account rather than out of the basket and therefore usually stacks.',
  },
  {
    question: 'Which deal type saves the most money?',
    answer:
      'A flat-rate carryout offer gives the largest saving per item, while a multi-item bundle gives the lowest cost per person for four or more people. Percentage discounts only pull ahead on larger baskets, usually above thirty to forty dollars.',
  },
  {
    question: 'How do I get the most out of a flat-price deal?',
    answer:
      'Put the most expensive qualifying item into the slot. A fixed price buys a plain cheese pizza or a fully loaded one equally, so ordering what you would normally order and then applying a deal is backwards — choose the item that extracts the most from the price.',
  },
];

export const metadata: Metadata = generatePageSEO({
  title: `${BRAND.name} Coupons & Deal Types Explained (${currentMonthYear()})`,
  description:
    `Every ${BRAND.name} deal structure explained: what qualifies, what is excluded, and which item ` +
    'to put in the slot. Illustrative examples of 12 offer types — check the official site for live codes.',
  path: '/coupons',
  keywords: [
    'dominos coupons',
    'pizza coupon codes',
    'pizza deals explained',
    'pizza promo codes',
  ],
});

export default function CouponsPage() {
  return (
    <>
      <JsonLd data={[breadcrumbSchema(CRUMBS), faqSchema(COUPON_FAQS)]} />

      <div className="mx-auto max-w-6xl px-4">
        <Breadcrumbs crumbs={CRUMBS} />
      </div>

      <header className="border-b border-line bg-surface-alt">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-ink sm:text-[2.75rem]">
            Pizza coupons and deal types, explained properly
          </h1>
          <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-ink-muted">
            Individual promotions rotate constantly. The structures underneath them barely
            change from one year to the next — there are about a dozen, and once you can
            tell which one you are looking at, working out whether it is worth using takes
            about ten seconds.
          </p>
          <LastUpdated className="mt-5" />
          <div className="relative mt-7 aspect-[21/9] overflow-hidden rounded-card border border-line">
            <Image
              src="/images/coupons-hero.jpg"
              alt="Coupons, percentage-off tags and a gift card scattered over a table of pizza sides"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1152px"
              className="object-cover"
            />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 pt-8">
        <div className="flex gap-3 rounded-card border border-brand/40 bg-brand-soft p-4">
          <ShieldAlert
            className="mt-0.5 h-5 w-5 shrink-0 text-brand-dark"
            aria-hidden="true"
          />
          <div>
            <h2 className="text-sm font-extrabold uppercase tracking-wide text-brand-dark">
              Read this before you copy a code
            </h2>
            <p className="mt-1.5 text-[15px] leading-relaxed text-brand-dark">
              The codes below are placeholders written by us to illustrate each offer type.
              They are not live promotional codes and they will not work at checkout. Live
              offers live on the official site, personalised to your store — this page is
              here to teach you how to read them, not to hand you a code.
            </p>
          </div>
        </div>
      </div>

      <section aria-labelledby="deal-list" className="mx-auto max-w-6xl px-4 py-10">
        <h2 id="deal-list" className="sr-only">
          Deal types
        </h2>
        <CouponsClient coupons={coupons} />
      </section>

      <AdSlot slotId="coupons-mid" className="pb-6" />

      <section
        aria-labelledby="how-to-read"
        className="border-y border-line bg-surface-alt"
      >
        <div className="mx-auto max-w-3xl px-4 py-12">
          <h2
            id="how-to-read"
            className="text-3xl font-extrabold tracking-tight text-navy-dark"
          >
            How to tell a good deal from a bad one
          </h2>
          <div className="prose-guide mt-5">
            <p>
              Four warning signs, in rough order of how often they catch people out.
            </p>
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
              every offer on the checkout total rather than the tile price.
            </p>
            <h3>It requires a minimum you would not otherwise hit</h3>
            <p>
              Spending eight extra dollars to unlock a five-dollar discount is not a saving,
              however the interface presents it.
            </p>
            <h3>The one discount that stacks with everything</h3>
            <p>
              Almost nothing on this page combines. A percentage discount and a bundle
              price compete, and the site keeps whichever is cheaper. The single reliable
              exception is a{' '}
              <Link href="/rewards">loyalty redemption</Link>: because it comes off your
              account rather than out of your basket, it generally applies on top of a deal
              price. If you have a free-pizza redemption sitting unused, spending it inside
              a bundle order rather than on a full-price one is worth several dollars for
              no extra effort.
            </p>
            <h3>The habit that beats all of this</h3>
            <p>
              Build your basket, note the total, then rebuild the same food under a
              different offer structure and note that total too. It takes about ninety
              seconds and finds four or five dollars often enough to be worth doing every
              single time. Everything else on this page is detail — that habit is the
              actual advice.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/posts/best-pizza-deals-this-month"
              className="inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-dark"
            >
              Full guide to reading deals
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/posts/mix-and-match-deal-explained"
              className="inline-flex items-center gap-2 rounded-md border border-navy px-4 py-2.5 text-sm font-bold text-navy transition-colors hover:bg-navy hover:text-white"
            >
              Mix &amp; match, explained
            </Link>
            <Link
              href="/posts/pizza-coupon-codes-explained"
              className="inline-flex items-center gap-2 rounded-md border border-navy px-4 py-2.5 text-sm font-bold text-navy transition-colors hover:bg-navy hover:text-white"
            >
              Why your code did not work
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-14">
        <FaqAccordion faqs={COUPON_FAQS} heading="Coupon questions we get asked" />
      </div>
    </>
  );
}
