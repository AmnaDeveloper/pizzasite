import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, BadgeCheck, Car, Layers, Maximize2, ReceiptText, Star } from 'lucide-react';
import HeroSection from '@/components/HeroSection';
import MenuGuideSection from '@/components/MenuGuideSection';
import SectionHeading from '@/components/SectionHeading';
import PostCard from '@/components/PostCard';
import FaqAccordion from '@/components/FaqAccordion';
import LastUpdated from '@/components/LastUpdated';
import AdSlot from '@/components/AdSlot';
import JsonLd from '@/components/JsonLd';
import SizeValueChart, { sizeValueRows } from '@/components/SizeValueChart';
import { generatePageSEO } from '@/lib/seo-config';
import { faqSchema, priceListSchema } from '@/lib/seo/schema';
import PriceNote from '@/components/PriceNote';
import MenuPriceTable from '@/components/MenuPriceTable';
import {
  getAllPosts,
  getCategoryPriceRanges,
  getFeaturedPosts,
  getHeadlinePrices,
  getMenuByCategory,
  getMenuCategories,
  getMenuItem,
  getPopularMenuItems,
  menuItems,
  posts,
} from '@/lib/content';
import type { MenuCategory } from '@/data/types';
import { authors } from '@/data/authors';
import { coupons } from '@/data/coupons';
import { BRAND, CURRENCY_SYMBOL, SITE_NAME } from '@/lib/site-config';
import { currentMonthYear } from '@/lib/utils/date';

const money = (n: number) => `${CURRENCY_SYMBOL}${n.toFixed(2)}`;

/*
 * The size-value numbers are computed once here so the section, the FAQ and
 * the "pay less" steps all quote the same figures. Pepperoni is used because
 * it is the item the large-vs-medium guide works through.
 */
const VALUE_ITEM = getMenuItem('pepperoni-pizza');
const VALUE_ROWS = VALUE_ITEM ? sizeValueRows(VALUE_ITEM) : [];
const smallRow = VALUE_ROWS.find((r) => r.size === 'Small');
const largeRow = VALUE_ROWS.find((r) => r.size === 'Large');
const xlRow = VALUE_ROWS.find((r) => r.size === 'Extra Large');
const mediumRow = VALUE_ROWS.find((r) => r.size === 'Medium');
const SMALL_TO_XL_SAVING =
  smallRow && xlRow ? Math.round((1 - xlRow.centsPerSqIn / smallRow.centsPerSqIn) * 100) : 0;
const MEDIUM_TO_LARGE_MORE_FOOD =
  mediumRow && largeRow ? Math.round((largeRow.area / mediumRow.area - 1) * 100) : 0;

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
    question: `Which ${BRAND.name} pizza size is the best value?`,
    answer:
      smallRow && xlRow && largeRow
        ? `The extra large. Using our example pepperoni prices, a 10-inch small works out at about ${smallRow.centsPerSqIn.toFixed(1)} cents per square inch, a 14-inch large at ${largeRow.centsPerSqIn.toFixed(1)} cents and a 16-inch extra large at ${xlRow.centsPerSqIn.toFixed(1)} cents — roughly ${SMALL_TO_XL_SAVING}% cheaper per bite than the small. Every step up the size ladder lowers the unit cost, so size up before adding a second pizza.`
        : 'The biggest size you will actually finish. Every step up the size ladder lowers the price per square inch, so size up before adding a second pizza.',
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

/**
 * "Pay less" steps, ordered by how much each one typically saves. Every step
 * links to the guide that works it through in full, so the homepage passes
 * authority down to the articles that rank for the long-tail version.
 */
const SAVING_STEPS = [
  {
    icon: Car,
    title: 'Switch to carryout before you build the order',
    body: 'No delivery fee, no tip, and access to flat-rate carryout offers that never show in delivery mode. Commonly $8–12 off a single-pizza order.',
    href: '/posts/carryout-vs-delivery-which-is-cheaper',
    link: 'Carryout vs delivery, worked out',
  },
  {
    icon: Layers,
    title: 'Start from a deal tile, not the menu',
    body: 'Mix & Match and bundle prices only apply when you build from the deal. Starting from the menu charges per-topping rates the deal would have covered.',
    href: '/posts/mix-and-match-deal-explained',
    link: 'The Mix & Match deal explained',
  },
  {
    icon: Maximize2,
    title: 'Size up before you add a second pizza',
    body: `A large is about ${MEDIUM_TO_LARGE_MORE_FOOD}% more pizza than a medium for a few dollars more. Adding a second medium costs a whole pizza.`,
    href: '/posts/large-vs-medium-pizza-value',
    link: 'Large vs medium: the maths',
  },
  {
    icon: ReceiptText,
    title: 'Drop the drinks and check the fees line',
    body: 'Bottled drinks carry roughly double supermarket prices, and the delivery fee is not a tip — read the itemised total before you pay.',
    href: '/posts/delivery-fee-vs-tip-what-goes-to-driver',
    link: 'Where the delivery fee goes',
  },
  {
    icon: Star,
    title: 'Sign in every time, even for carryout',
    body: 'Loyalty points only attach to signed-in orders and are rarely added retroactively. Six qualifying orders is typically one free pizza.',
    href: '/posts/pizza-rewards-program-explained',
    link: 'What rewards points are worth',
  },
];

const JUMP_LINKS = [
  { href: '#prices', label: 'Price list' },
  { href: '#best-value', label: 'Best-value size' },
  { href: '#menu-guide', label: 'Popular items' },
  { href: '#pay-less', label: 'How to pay less' },
  { href: '#deals', label: 'Deal types' },
  { href: '#guides', label: 'Guides' },
  { href: '#faq-title', label: 'FAQ' },
];

/*
 * Title and description are kept inside Google's display limits on purpose.
 * The root layout appends " | Slice & Save" to the title, so the string below
 * has to leave room for it — roughly 45 characters is the ceiling.
 */
export const metadata: Metadata = generatePageSEO({
  title: `${BRAND.name} Menu Prices & Coupons (${currentMonthYear()})`,
  description:
    `${BRAND.name} menu prices for every pizza size, sides, wings and drinks — plus ` +
    'which deals and sizes actually save you money. Independent guide.',
  path: '/',
  keywords: [
    'dominos menu prices',
    'dominos prices',
    'dominos coupons',
    'dominos deals',
    'how much is a large pizza at dominos',
    'dominos pizza sizes and prices',
    'dominos carryout deal',
    'dominos menu with prices',
  ],
});

/**
 * HOMEPAGE STRUCTURE
 *
 *   1. Hero            headline, quick-answer price card, four-fact bar
 *   2. Jump links      on-page navigation (also feeds Google's jump-to links)
 *   3. Prices          key facts, then the two full price tables
 *   4. Best value      price per square inch — the site's own analysis
 *   5. Menu            four cards
 *   6. Pay less        five steps, each linking to its guide
 *   7. Deals           four cards
 *   8. Guides          four cards
 *   9. Method          who prices the menu and how
 *  10. FAQ
 *
 * Sections share one wrapper: a top border, the same max width, gutter and
 * vertical padding. Two sections (best value, method) sit on the faint blue
 * tint so the long page has a rhythm rather than one unbroken white column.
 */
const SECTION = 'border-t border-line';
const SECTION_TINT = 'border-t border-line bg-surface-alt';
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
  const ranges = getCategoryPriceRanges();
  const rangeOf = (cats: MenuCategory[]) => {
    const rs = ranges.filter((r) => cats.includes(r.category));
    return rs.length
      ? { low: Math.min(...rs.map((r) => r.low)), high: Math.max(...rs.map((r) => r.high)) }
      : null;
  };
  const keyFacts = [
    { label: 'Pizzas', range: rangeOf(['Specialty Pizza', 'Build Your Own']) },
    { label: 'Sides', range: rangeOf(['Sides']) },
    { label: 'Chicken', range: rangeOf(['Chicken']) },
    { label: 'Pasta & sandwiches', range: rangeOf(['Pasta & Sandwiches']) },
    { label: 'Desserts', range: rangeOf(['Desserts']) },
    { label: 'Drinks', range: rangeOf(['Drinks']) },
  ].filter((f) => f.range);

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
          // items is rendered on this page, so all 20 belong in the list.
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

      {/* 2 ── Jump links ─────────────────────────────────────────────────── */}
      <nav aria-label="On this page" className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-6xl items-center gap-2 overflow-x-auto px-5 py-3 sm:px-8">
          <span className="shrink-0 pr-1 text-[11px] font-bold uppercase tracking-[0.14em] text-ink-muted">
            On this page
          </span>
          {JUMP_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="shrink-0 rounded-full border border-line px-3.5 py-1.5 text-[13px] font-semibold text-ink transition-colors hover:border-navy hover:text-navy"
            >
              {l.label}
            </a>
          ))}
        </div>
      </nav>

      {/* 3 ── Price overview ─────────────────────────────────────────────── */}
      <section aria-labelledby="prices">
        <div className={INNER}>
          <SectionHeading
            id="prices"
            eyebrow="Prices at a glance"
            title={`${BRAND.name} menu prices for ${currentMonthYear()}`}
            intro={`Every price below is an example drawn from a rolling sample of stores. ${BRAND.name} is largely a franchise network, so there is no single national price list — use these to compare items against each other, then confirm the total at official checkout.`}
          />

          {/* Key facts — the answer-first summary Google can lift as a snippet. */}
          <div className="mt-8 grid gap-6 rounded-card border border-line bg-surface-alt p-5 sm:p-6 lg:grid-cols-[1fr_2fr]">
            <div>
              <h3 className="text-lg font-extrabold text-navy-dark">
                {BRAND.name} price ranges by section
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-muted">
                Lowest to highest example price across every size in our sample, for all{' '}
                {menuItems.length} items on this page.
              </p>
            </div>
            <ul className="grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
              {keyFacts.map((f) => (
                <li
                  key={f.label}
                  className="flex items-baseline justify-between gap-3 border-b border-line pb-2 text-[15px]"
                >
                  <span className="font-semibold text-ink">{f.label}</span>
                  <span className="font-bold tabular-nums text-brand">
                    {f.range!.low === f.range!.high
                      ? money(f.range!.low)
                      : `${money(f.range!.low)} – ${money(f.range!.high)}`}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick answers — the four figures people most often arrive looking for.
              Price first and large, label underneath: the number is the answer. */}
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {headlinePrices.slice(0, 4).map((row) => (
              <li key={row.label}>
                <Link
                  href={`/menus-prices/${row.slug}`}
                  className="group flex h-full items-baseline gap-3 rounded-card border border-line bg-surface px-5 py-4 transition-colors hover:border-navy"
                >
                  <span className="text-[1.6rem] font-extrabold leading-none tabular-nums text-brand">
                    {money(row.price)}
                  </span>
                  <span className="text-[13px] font-semibold leading-snug text-ink-muted group-hover:text-navy">
                    {row.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Pizzas: one shared size ladder, so they belong in columns. */}
          <h3 className="mt-14 flex items-center gap-3 text-2xl font-extrabold tracking-tight text-navy-dark">
            <span aria-hidden="true" className="h-7 w-1.5 shrink-0 rounded-full bg-brand" />
            {BRAND.name} pizza prices by size
          </h3>
          <p className="mt-2.5 max-w-3xl text-[15px] leading-relaxed text-ink-muted">
            Sizes are 10″ small, 12″ medium, 14″ large and 16″
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
            item’s own page.
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

      {/* 4 ── Best value by size ─────────────────────────────────────────── */}
      {VALUE_ITEM && smallRow && xlRow ? (
        <section aria-labelledby="best-value" className={`${SECTION_TINT}`}>
          <div className={INNER}>
            <SectionHeading
              id="best-value"
              eyebrow="Our analysis"
              title="Which pizza size is the best value?"
              intro={`Pizza is sold by diameter but eaten by area, and the two don't scale together. We divided each example price by the size of the pizza. The result: a 16-inch extra large costs about ${SMALL_TO_XL_SAVING}% less per square inch than a 10-inch small.`}
              ctaHref="/posts/large-vs-medium-pizza-value"
              ctaLabel="Read the full breakdown"
            />

            <div className="mt-8 grid gap-6 lg:grid-cols-[2fr_1fr]">
              <SizeValueChart item={VALUE_ITEM} />

              <div className="flex flex-col gap-4">
                <div className="rounded-card border border-line bg-surface p-5">
                  <p className="text-[2rem] font-extrabold leading-none tabular-nums text-brand">
                    +{MEDIUM_TO_LARGE_MORE_FOOD}%
                  </p>
                  <p className="mt-2 text-[14px] leading-relaxed text-ink-muted">
                    more pizza in a 14″ large than a 12″ medium, for{' '}
                    {mediumRow && largeRow ? money(largeRow.price - mediumRow.price) : 'a few dollars'}{' '}
                    more at menu price.
                  </p>
                </div>
                <div className="rounded-card border border-line bg-surface p-5">
                  <h3 className="text-[15px] font-extrabold text-ink">The rule that follows</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-ink-muted">
                    Need more pizza? Size up first, and add a second pizza only once
                    you’ve run out of sizes — unless a deal prices two mediums close
                    to one large, which flips the maths.
                  </p>
                </div>
              </div>
            </div>
            <p className="mt-4 text-[13px] leading-relaxed text-ink-muted">
              Based on example {VALUE_ITEM.title.toLowerCase()} prices from our store sample,
              hand-tossed crust. Other pizzas follow the same pattern.
            </p>
          </div>
        </section>
      ) : null}

      {/* 5 ── Menu ───────────────────────────────────────────────────────── */}
      <MenuGuideSection
        items={popularItems}
        eyebrow="Menu & prices"
        title={`Most-ordered ${BRAND.name} items and what they cost`}
        intro="Example prices with sizes, calories and allergens on every item — plus an honest note on whether it is worth ordering at menu price or only inside a deal."
        ctaHref="/menus-prices"
        ctaLabel={`All ${menuItems.length} items`}
        prioritiseFirstImage
      />

      {/* 6 ── How to pay less ────────────────────────────────────────────── */}
      <section aria-labelledby="pay-less" className={`${SECTION}`}>
        <div className={INNER}>
          <SectionHeading
            id="pay-less"
            eyebrow="Save money"
            title={`How to pay less for ${BRAND.name}: 5 steps`}
            intro="Ordered by how much each typically saves. None of them need a coupon code — they are about which buttons you press, and in what order."
            ctaHref="/posts/how-to-save-money-on-pizza-delivery"
            ctaLabel="All 11 tactics"
          />

          <ol className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-6">
            {SAVING_STEPS.map((step, i) => (
              <li
                key={step.title}
                className={`flex flex-col rounded-card border p-5 ${
                  i < 2 ? 'lg:col-span-3' : 'lg:col-span-2'
                } ${i === 0 ? 'border-brand/40 bg-brand-soft/50' : 'border-line bg-surface'} ${
                  i === SAVING_STEPS.length - 1 ? 'md:col-span-2 lg:col-span-2' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy text-[15px] font-extrabold text-white">
                    {i + 1}
                  </span>
                  <step.icon className="h-5 w-5 text-brand" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-[17px] font-extrabold leading-snug text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 flex-1 text-[14px] leading-relaxed text-ink-muted">
                  {step.body}
                </p>
                <Link
                  href={step.href}
                  className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-bold text-navy hover:text-brand"
                >
                  {step.link}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 7 ── Deals ──────────────────────────────────────────────────────── */}
      <section aria-labelledby="deals" className={`${SECTION}`}>
        <div className={INNER}>
          <SectionHeading
            id="deals"
            eyebrow="Coupons & deals"
            title={`${BRAND.name} deal types worth knowing`}
            intro="Promotions rotate constantly. The structures underneath them barely change from year to year, and once you can recognise which one you are looking at, judging it takes about ten seconds."
            ctaHref="/coupons"
            ctaLabel={`All ${coupons.length} deal types`}
          />

          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {dealTypes.map((coupon) => (
              <li key={coupon.id}>
                <article className="flex h-full flex-col rounded-card border border-line bg-surface p-5 transition-colors hover:border-navy">
                  <p className="self-start rounded-full bg-navy-soft px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-navy-dark">
                    {coupon.type}
                  </p>
                  <p className="mt-3 text-2xl font-extrabold leading-none text-brand">
                    {coupon.discount}
                  </p>
                  <h3 className="mt-3 line-clamp-2 min-h-[2.75em] text-[17px] font-extrabold leading-snug text-ink">
                    {coupon.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 flex-1 text-[14px] leading-relaxed text-ink-muted">
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

      {/* 8 ── Guides ─────────────────────────────────────────────────────── */}
      <section aria-labelledby="guides" className={`${SECTION}`}>
        <div className={INNER}>
          <SectionHeading
            id="guides"
            eyebrow="Money-saving guides"
            title="Where the money actually goes"
            intro="Long-form guides on the decisions that change what you pay — carryout versus delivery, sizes, toppings, tips and rewards — each worked through against our own price data."
            ctaHref="/posts"
            ctaLabel={`All ${posts.length} guides`}
          />

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {guides.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* 9 ── Method & people ────────────────────────────────────────────── */}
      <section aria-labelledby="method" className={SECTION_TINT}>
        <div className={INNER}>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand">
                How we work
              </p>
              <h2
                id="method"
                className="mt-2.5 text-[1.75rem] font-extrabold leading-tight tracking-tight text-navy-dark sm:text-[2rem]"
              >
                Where our numbers come from
              </h2>
              <ul className="mt-6 space-y-4 text-[15px] leading-relaxed text-ink-muted">
                <li className="flex gap-3">
                  <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-navy" aria-hidden="true" />
                  <span>
                    <strong className="font-bold text-ink">A rolling store sample.</strong>{' '}
                    We price the menu across a sample of stores and publish example figures,
                    never a single “national” price that doesn’t exist.
                  </span>
                </li>
                <li className="flex gap-3">
                  <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-navy" aria-hidden="true" />
                  <span>
                    <strong className="font-bold text-ink">Working shown.</strong> If a figure
                    can’t be shown with its arithmetic — like the price-per-inch table
                    above — it doesn’t get published as fact.
                  </span>
                </li>
                <li className="flex gap-3">
                  <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-navy" aria-hidden="true" />
                  <span>
                    <strong className="font-bold text-ink">Corrections welcome.</strong> Seen
                    a different price at your store?{' '}
                    <Link href="/contact" className="font-semibold text-navy underline underline-offset-2 hover:text-brand">
                      Tell us
                    </Link>{' '}
                    — reader reports are verified, then folded in.
                  </span>
                </li>
                <li className="flex gap-3">
                  <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-navy" aria-hidden="true" />
                  <span>
                    <strong className="font-bold text-ink">No commission.</strong> The site is
                    ad-supported. We earn nothing from what you order, so bigger baskets
                    don’t pay us more.
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand">
                The team
              </p>
              <p className="mt-2.5 text-[1.35rem] font-extrabold leading-tight tracking-tight text-navy-dark">
                Who checks every price and guide
              </p>
              <ul className="mt-6 space-y-4">
                {authors.map((a) => (
                  <li key={a.slug}>
                    <Link
                      href={`/team#${a.slug}`}
                      className="group flex gap-4 rounded-card border border-line bg-surface p-5 transition-colors hover:border-navy"
                    >
                      <Image
                        src={a.avatar}
                        alt={a.avatarAlt}
                        width={56}
                        height={56}
                        className="h-14 w-14 shrink-0 rounded-full object-cover"
                      />
                      <span className="min-w-0">
                        <span className="flex flex-wrap items-center gap-x-2">
                          <span className="text-[16px] font-extrabold text-ink group-hover:text-navy">
                            {a.name}
                          </span>
                          <span className="text-[12px] font-bold uppercase tracking-wide text-navy">
                            {a.role}
                          </span>
                        </span>
                        <span className="mt-1.5 line-clamp-3 block text-[14px] leading-relaxed text-ink-muted">
                          {a.credentials}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 10 ── FAQ ───────────────────────────────────────────────────────── */}
      <section aria-labelledby="faq-title" className={`${SECTION}`}>
        <div className={INNER}>
          <div className="max-w-2xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand">
              Questions
            </p>
            <h2
              id="faq-title"
              className="mt-2.5 scroll-mt-32 text-[1.75rem] font-extrabold leading-tight tracking-tight text-navy-dark sm:text-[2rem]"
            >
              {BRAND.name} prices and deals: FAQ
            </h2>
            <p className="mt-3 text-[16px] leading-relaxed text-ink-muted">
              The questions people ask most about what {BRAND.name} costs — plus what this
              site is, and how it pays for itself.
            </p>
          </div>

          {/* Full width, so the bars read as one continuous stack. */}
          <FaqAccordion
            faqs={HOME_FAQS}
            headingId="home-faq"
            className="mt-8"
            labelledBy="faq-title"
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
