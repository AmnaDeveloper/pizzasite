import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import HeroSection from '@/components/HeroSection';
import MenuGuideSection from '@/components/MenuGuideSection';
import SectionHeading from '@/components/SectionHeading';
import PostCard from '@/components/PostCard';
import FaqAccordion from '@/components/FaqAccordion';
import LastUpdated from '@/components/LastUpdated';
import AdSlot from '@/components/AdSlot';
import JsonLd from '@/components/JsonLd';
import { generatePageSEO } from '@/lib/seo-config';
import { faqSchema, priceListSchema } from '@/lib/seo/schema';
import PriceNote from '@/components/PriceNote';
import MenuPriceTable from '@/components/MenuPriceTable';
import {
  getAllPosts,
  getFeaturedPosts,
  getHeadlinePrices,
  getMenuByCategory,
  getMenuCategories,
  getPopularMenuItems,
  menuItems,
} from '@/lib/content';
import type { MenuCategory } from '@/data/types';
import { coupons } from '@/data/coupons';
import { BRAND, CURRENCY_SYMBOL, SITE_NAME } from '@/lib/site-config';
import { currentMonthYear } from '@/lib/utils/date';

/**
 * FAQ set is written against the questions people actually type, not against
 * what is convenient to answer. Each one is also emitted as FAQPage structured
 * data, so the wording has to stand on its own out of context.
 */
const HOME_FAQS = [
  {
    question: `How much is a large pizza at ${BRAND.name}?`,
    answer:
      'A large cheese pizza is around $14.99 at menu price in our sample of stores, and a large pepperoni around $16.49. On a flat-rate carryout offer the same large pizza commonly drops to about $7.99, which is why the offer you order under matters more than the item you choose. These are example prices — franchise stores set their own, so confirm the total at official checkout.',
  },
  {
    question: `What is the cheapest way to order ${BRAND.name}?`,
    answer:
      'Collect it yourself. Carryout removes the delivery fee and the tip, and it unlocks flat-rate offers that do not exist in delivery mode. Together that is commonly eight to twelve dollars on a single-pizza order. The next biggest saving is ordering from a bundle rather than the standard menu, then dropping the drinks, which carry roughly double supermarket prices.',
  },
  {
    question: `Are ${BRAND.name} prices the same at every location?`,
    answer:
      'No. Most stores are run by independent franchisees who set their own menu prices, hours, delivery zones and promotional participation. Two stores a few miles apart can charge different amounts for the same pizza and show different deals. That is why every price on this site is labelled as an example rather than a quotation.',
  },
  {
    question: 'Is carryout actually cheaper than delivery?',
    answer:
      'Yes, and by more than most people expect. The gap is three separate charges pointing the same way: the delivery fee, the tip, and the higher price the pizza itself carries in delivery mode. On one large pizza that adds up to roughly nine dollars in our worked example. The saving shrinks in percentage terms on a large multi-item order.',
  },
  {
    question: `Do ${BRAND.name} coupon codes still work?`,
    answer:
      'Typed codes have largely been replaced by deal tiles that apply automatically once your basket qualifies. Codes still exist for targeted and email promotions, but most of what circulates on coupon aggregator sites is expired. The reliable place to look is your own store deals page after entering your address, because franchisees opt into promotions individually.',
  },
  {
    question: 'How many people does a large pizza feed?',
    answer:
      'Two to three adults as a meal, or four when there are sides on the table. A large is cut into eight slices, and the planning number that holds up is three slices per adult when pizza is the whole meal and two when it is not.',
  },
  {
    question: `Is ${SITE_NAME} the official ${BRAND.name} website?`,
    answer: `No. We are an independent guide with no affiliation to ${BRAND.name}. We do not take orders, we cannot access your account, and we are not able to resolve problems with an order. For anything transactional you need the official site or app.`,
  },
  {
    question: 'Where do your prices come from?',
    answer:
      'From a rolling sample of stores that our team prices periodically, plus reader reports that we verify before publishing. Because franchise stores set their own prices, every figure on this site is an example for reference rather than a quotation — your store may differ.',
  },
  {
    question: 'How often is the site updated?',
    answer:
      'Prices are reviewed on a rolling schedule and every page carries a visible last-updated date. Deal structures change less often than the promotions built on top of them, which is why our guides explain the structures rather than chasing individual offers.',
  },
  {
    question: 'Do you make money from this site?',
    answer:
      'Yes — through display advertising. Advertisers have no involvement in what we write, and we do not receive commission on anything you order, which means we have no reason to push you toward a more expensive basket.',
  },
];

/*
 * Title and description are kept inside Google's display limits on purpose.
 * The root layout appends " | Slice & Save" to the title, so the string below
 * has to leave room for it — roughly 45 characters is the ceiling.
 */
export const metadata: Metadata = generatePageSEO({
  title: `${BRAND.name} Menu Prices & Coupons (${currentMonthYear()})`,
  description:
    `Independent guide to ${BRAND.name} menu prices, coupons and deals. Example prices for ` +
    '20 items, 12 deal types explained and 16 city delivery guides.',
  path: '/',
  keywords: [
    'dominos menu prices',
    'dominos prices',
    'dominos coupons',
    'dominos deals',
    'how much is a large pizza at dominos',
    'dominos carryout deal',
    'pizza delivery near me',
    'dominos menu with prices',
  ],
});

/**
 * HOMEPAGE STRUCTURE — six content sections, deliberately.
 *
 *   1. Hero            blue, headline + two buttons + a four-fact bar
 *   2. Prices          the two summary tables people search for
 *   3. Menu            four cards
 *   4. Deals           four cards
 *   5. Guides          four cards
 *   6. Cities          four cards + a compact strip for the rest
 *   7. FAQ             ten questions, two-column
 *
 * Every section below uses the SAME wrapper: a top border for separation, the
 * same max width, the same side gutter and the same vertical padding. Cards are
 * always four across on desktop. Nothing alternates its background — the border
 * and the whitespace do the separating, which is what keeps the page calm.
 */
const SECTION = 'border-t border-line';
const INNER = 'mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20';

export default function HomePage() {
  const popularItems = getPopularMenuItems(4);

  // Featured guides first, topped up with the most recent so the row is full.
  const featured = getFeaturedPosts(4);
  const guides = [
    ...featured,
    ...getAllPosts().filter((p) => !featured.some((f) => f.slug === p.slug)),
  ].slice(0, 4);

  const dealTypes = coupons.slice(0, 4);

  // Price tables — computed from the menu data, never typed by hand.
  const headlinePrices = getHeadlinePrices();

  // Pizzas share a size ladder; everything else does not. See MenuPriceTable.
  const PIZZA_CATEGORIES: MenuCategory[] = ['Specialty Pizza', 'Build Your Own'];
  const allGroups = getMenuCategories().map((category) => ({
    category,
    items: getMenuByCategory(category),
  }));
  const pizzaGroups = allGroups.filter((g) => PIZZA_CATEGORIES.includes(g.category));
  const otherGroups = allGroups.filter((g) => !PIZZA_CATEGORIES.includes(g.category));

  return (
    <>
      <JsonLd
        data={[
          faqSchema(HOME_FAQS),
          // Structured data for the visible price tables. Every one of the 20
          // items is now rendered on this page, so all 20 belong in the list.
          priceListSchema({
            name: `${BRAND.name} menu prices`,
            items: menuItems.map((item) => ({
              name: item.title,
              price: item.price,
              path: `/menus-prices/${item.slug}`,
            })),
          }),
        ]}
      />

      {/* 1 ── Hero ───────────────────────────────────────────────────────── */}
      <HeroSection />

      {/* 2 ── Price overview ─────────────────────────────────────────────── */}
      <section aria-labelledby="prices" className={SECTION}>
        <div className={INNER}>
          <SectionHeading
            id="prices"
            eyebrow="Prices at a glance"
            title={`How much ${BRAND.name} costs in ${currentMonthYear()}`}
            intro={`Every price below is an example drawn from a rolling sample of stores. ${BRAND.name} is largely a franchise network, so there is no single national price list — use these to compare items against each other, then confirm the total at official checkout.`}
          />

          {/* Quick answers — the four figures people most often arrive looking for.
              Price first and large, label underneath: the number is the answer. */}
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {headlinePrices.slice(0, 4).map((row) => (
              <li key={row.label}>
                <Link
                  href={`/menus-prices/${row.slug}`}
                  className="group flex h-full items-baseline gap-3 rounded-card border border-line bg-surface px-5 py-4 transition-colors hover:border-navy"
                >
                  <span className="text-[1.6rem] font-extrabold leading-none tabular-nums text-brand">
                    {CURRENCY_SYMBOL}
                    {row.price.toFixed(2)}
                  </span>
                  <span className="text-[13px] font-semibold leading-snug text-ink-muted group-hover:text-navy">
                    {row.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Pizzas: one shared size ladder, so they belong in columns.
              The red rule marks these as headings rather than table labels —
              at text-xl with no accent they read as captions. */}
          <h3 className="mt-14 flex items-center gap-3 text-2xl font-extrabold tracking-tight text-navy-dark">
            <span aria-hidden="true" className="h-7 w-1.5 shrink-0 rounded-full bg-brand" />
            Pizza prices by size
          </h3>
          <p className="mt-2.5 max-w-3xl text-[15px] leading-relaxed text-ink-muted">
            Sizes are 10&Prime; small, 12&Prime; medium, 14&Prime; large and 16&Prime;
            extra large. Calories are per slice of a large. Pan crust stops at large
            because the pans come in fixed sizes.
          </p>
          <div className="mt-5">
            <MenuPriceTable
              groups={pizzaGroups}
              variant="pizza"
              caption={`Example ${BRAND.name} pizza prices by size and crust`}
            />
          </div>

          {/* Everything else: each item has its own size names. */}
          <h3 className="mt-14 flex items-center gap-3 text-2xl font-extrabold tracking-tight text-navy-dark">
            <span aria-hidden="true" className="h-7 w-1.5 shrink-0 rounded-full bg-brand" />
            Sides, chicken, pasta, desserts and drinks
          </h3>
          <p className="mt-2.5 max-w-3xl text-[15px] leading-relaxed text-ink-muted">
            Calories are per piece or per serving — the exact basis is listed on each
            item&rsquo;s own page.
          </p>
          <div className="mt-5">
            <MenuPriceTable
              groups={otherGroups}
              variant="other"
              caption={`Example ${BRAND.name} prices for sides, chicken, pasta, desserts and drinks`}
            />
          </div>

          <PriceNote className="mt-5" />
        </div>
      </section>

      {/* 3 ── Menu ───────────────────────────────────────────────────────── */}
      <MenuGuideSection
        items={popularItems}
        eyebrow="Menu & prices"
        title="Popular items and what they cost"
        intro="Example prices with sizes, calories and allergens on every item — plus an honest note on whether it is worth ordering at menu price or only inside a deal."
        ctaHref="/menus-prices"
        ctaLabel="All 20 items"
        prioritiseFirstImage
      />

      {/* 3 ── Deals ──────────────────────────────────────────────────────── */}
      <section aria-labelledby="deals" className={SECTION}>
        <div className={INNER}>
          <SectionHeading
            id="deals"
            eyebrow="Coupons & deals"
            title="The deal structures worth knowing"
            intro="Promotions rotate constantly. The structures underneath them barely change from year to year, and once you can recognise which one you are looking at, judging it takes about ten seconds."
            ctaHref="/coupons"
            ctaLabel="All 12 deal types"
          />

          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {dealTypes.map((coupon) => (
              <li key={coupon.id}>
                <article className="flex h-full flex-col rounded-card border border-line bg-surface p-5 transition-colors hover:border-navy">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-navy">
                    {coupon.type}
                  </p>
                  <p className="mt-1.5 text-2xl font-extrabold leading-none text-brand">
                    {coupon.discount}
                  </p>
                  {/* Same single-line clamps as the image cards, so all four
                      grids on this page settle at a uniform card height. */}
                  <h3 className="mt-3 line-clamp-1 text-[17px] font-extrabold leading-snug text-ink">
                    {coupon.title}
                  </h3>
                  <p className="mt-2 line-clamp-1 flex-1 text-[14px] leading-relaxed text-ink-muted">
                    {coupon.desc}
                  </p>
                  <p className="mt-4 border-t border-line pt-3 text-[12px] leading-snug text-ink-muted">
                    Example of an offer type, not a live code.
                  </p>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <AdSlot slotId="home-mid" className="py-4" />

      {/* 4 ── Guides ─────────────────────────────────────────────────────── */}
      <section aria-labelledby="guides" className={SECTION}>
        <div className={INNER}>
          <SectionHeading
            id="guides"
            eyebrow="Money-saving guides"
            title="Where the money actually goes"
            intro="Long-form guides on the decisions that change what you pay — written by a price researcher, a former delivery driver and a registered dietitian."
            ctaHref="/posts"
            ctaLabel="All 18 guides"
          />

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {guides.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* 6 ── FAQ ────────────────────────────────────────────────────────── */}
      <section aria-labelledby="faq-title" className={SECTION}>
        <div className={INNER}>
          <div className="max-w-2xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand">
              Questions
            </p>
            <h2
              id="faq-title"
              className="mt-2.5 text-[1.75rem] font-extrabold leading-tight tracking-tight text-navy-dark sm:text-[2rem]"
            >
              Common questions about this site
            </h2>
            <p className="mt-3 text-[16px] leading-relaxed text-ink-muted">
              What we are, where the numbers come from, and how the site pays for itself.
              The short version: we are not the pizza company, and nobody pays us to tell
              you what to order.
            </p>
          </div>

          {/* Full width, so the bars read as one continuous stack. */}
          <FaqAccordion
            faqs={HOME_FAQS}
            heading="Common questions about this site"
            headingId="home-faq"
            className="mt-8"
            hideHeading
          />

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-card border border-line bg-surface-alt px-5 py-4">
            <div>
              <h3 className="text-[15px] font-extrabold text-ink">
                Something we have not answered?
              </h3>
              <p className="mt-1 text-[14px] leading-relaxed text-ink-muted">
                Price corrections are the most useful thing you can send us — real people
                read the inbox.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex shrink-0 items-center gap-2 rounded-md border border-navy px-4 py-2.5 text-sm font-bold text-navy transition-colors hover:bg-navy hover:text-white"
            >
              Get in touch
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <LastUpdated className="mt-6" />
        </div>
      </section>
    </>
  );
}
