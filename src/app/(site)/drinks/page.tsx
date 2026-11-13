import type { Metadata } from 'next';
import Link from 'next/link';
import { TrendingDown, ThermometerSun, Users } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import MenuItemCard from '@/components/MenuItemCard';
import FaqAccordion from '@/components/FaqAccordion';
import LastUpdated from '@/components/LastUpdated';
import PriceNote from '@/components/PriceNote';
import AdSlot from '@/components/AdSlot';
import JsonLd from '@/components/JsonLd';
import { generatePageSEO } from '@/lib/seo-config';
import { breadcrumbSchema, faqSchema } from '@/lib/seo/schema';
import { getMenuByCategory } from '@/lib/content';
import PriceTag from '@/components/PriceTag';
import { PAGE_DATES } from '@/lib/page-dates';
import { BRAND, CURRENCY_SYMBOL } from '@/lib/site-config';

/** Day this page's content last really changed — update it with the content. */
const PAGE_UPDATED = PAGE_DATES['/drinks'];

const CRUMBS = [
  { name: 'Home', path: '/' },
  { name: 'Drinks & Sides', path: '/drinks' },
];

const SECTION = 'border-t border-line';
const INNER = 'mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-16';

const DRINK_FAQS = [
  {
    question: `How much are drinks at ${BRAND.name}?`,
    answer:
      'A 2-liter bottle was $4.49 and a 20-ounce Dasani water or Gold Peak sweet tea $3.49 at the Columbus, Ohio store we checked on 25 October 2026, before tax. Both cost well above supermarket prices. It is a convenience charge rather than a scandal, and it is the easiest line to remove from an order without anyone eating less.',
  },
  {
    question: 'What is the cheapest side to order?',
    answer:
      'Bread Bites: $5.99 for 16 pieces in garlic, parmesan or cinnamon at the store we checked — about $1.50 a head for four people. Wings are the most expensive way to feed people, at $10.99 for eight, because a large share of what you pay for is bone weight.',
  },
  {
    question: 'Which side gives the most food for the money?',
    answer:
      'Loaded Chicken, if you want protein — eight boneless pieces for $8.99 against $10.99 for eight wings, and almost all of it is edible. For sheer volume, bread sides win: they are made from the same dough as the pizza, which keeps them cheap; the Perfect Combo includes two of them.',
  },
  {
    question: 'Is the soda delivered cold?',
    answer:
      'Do not assume it will be. If you need it cold, ask the store when you order.',
  },
  {
    question: 'Do drinks count toward a deal?',
    answer:
      'We did not see drinks listed as Mix & Match items in the reports we used. If a deal on your store page does include a drink, take it — drinks are priced well above shop prices.',
  },
  {
    question: 'Which sides survive a long delivery?',
    answer:
      'Loaded Chicken and Cinnamon Bread Bites travel best. Stuffed Cheesy Bread and lava cakes are the worst — melted cheese firms up as it cools and a lava cake loses its molten center entirely, which is the whole point of it. If your delivery is long, order those two only on a carryout order.',
  },
  {
    question: 'How many sides do I need for a group?',
    answer:
      'One 16-piece order of Bread Bites covers about four people alongside pizza, and it lets you order one fewer pizza because people fill up faster. Wings are the exception — at four per person, feeding ten people means five 8-piece orders, $54.95 at the prices we checked, which costs more than an extra pizza.',
  },
  {
    question: `What is the cheapest way to get drinks with a ${BRAND.name} order?`,
    answer:
      'Buy them from a shop and order only the food. A 2-liter was $4.49 in our check, about 8% of a $55 family order (two large specialty pizzas, wings and one bottle), and nearer 15% if the order has two bottles. It is the least painful saving available, because no food is removed.',
  },
];

/* Title budget is ~45 characters before the site name is appended. */
export const metadata: Metadata = generatePageSEO({
  title: `${BRAND.name} Sides & Drinks Prices`,
  description:
    'Bread bites, wings, desserts and drinks with prices checked at a real store — which ' +
    'sides are worth it, which travel badly, and the line to delete.',
  path: '/drinks',
  keywords: [
    'dominos sides prices',
    'dominos drinks price',
    'dominos bread bites price',
    'dominos wings price',
    'cheapest pizza side',
  ],
});

/**
 * Indicative markup comparison. The shop column is an approximate national
 * retail figure for the same product, not a surveyed price — it is here to show
 * the direction and rough scale, which is what the decision turns on.
 */
const MARKUP = [
  { item: '2-Liter Coke', store: 4.49, shop: 2.75 },
  { item: 'Gold Peak Sweet Tea, single bottle', store: 3.49, shop: 2.0 },
  { item: 'Dasani water, 20 fl oz', store: 3.49, shop: 1.79 },
];

/**
 * Our own verdict on each side, kept blunt. Store prices are the checked ones
 * (data/verified-prices-2026-10-25.json).
 */
const VERDICTS = [
  {
    item: 'Cinnamon Bread Bites (16)',
    price: 5.99,
    feeds: '4 as dessert',
    verdict: 'Best value dessert on the menu, by a distance',
    good: true,
  },
  {
    item: 'Garlic or Parmesan Bread Bites (16)',
    price: 5.99,
    feeds: '4 as a side',
    verdict: 'The cheapest side — cheap for the store, filling for you',
    good: true,
  },
  {
    item: 'Lava Cake Flight (3)',
    price: 9.99,
    feeds: '3',
    verdict: '$3.33 a cake; the molten center sets on a long delivery',
    good: true,
  },
  {
    item: 'Stuffed Cheesy Bread',
    price: 8.49,
    feeds: '3–4 as a side',
    verdict: '$2.50 more than Bread Bites, with a marinara cup included in our check',
    good: true,
  },
  {
    item: 'Loaded Chicken (8)',
    price: 8.99,
    feeds: '2 as a side',
    verdict: 'All meat and $2 cheaper than eight wings — the protein pick',
    good: true,
  },
  {
    item: '8-piece wings',
    price: 10.99,
    feeds: '2 as a side',
    verdict: 'Worst food per dollar — you are buying bone weight',
    good: false,
  },
  {
    item: '2-Liter soda',
    price: 4.49,
    feeds: '6–8 glasses',
    verdict: 'Worth taking if a deal includes one; poor value bought separately',
    good: false,
  },
  {
    item: 'Dasani water, 20 fl oz',
    price: 3.49,
    feeds: '1',
    verdict: 'The one item we would simply not order',
    good: false,
  },
];

export default function DrinksPage() {
  const drinks = getMenuByCategory('Drinks');
  const sides = getMenuByCategory('Sides');
  const desserts = getMenuByCategory('Desserts');
  const chicken = getMenuByCategory('Chicken');

  const sections = [
    {
      id: 'sides',
      title: 'Bread sides',
      items: sides,
      intro:
        'Made from the same dough as the pizza, which keeps them cheap. Bread Bites ($5.99) cost less on the menu than a $6.99 Mix & Match slot, so buy them outside the deal; Stuffed Cheesy Bread is the one worth putting in it.',
    },
    {
      id: 'chicken',
      title: 'Chicken',
      items: chicken,
      intro:
        'Boneless pieces beat wings on meat per dollar because there is no bone weight. An 8-piece wings order is one of the reported choices on the $7.99 carryout deal, which takes $3.00 off its $10.99 menu price.',
    },
    {
      id: 'desserts',
      title: 'Desserts',
      items: desserts,
      intro:
        'Sixteen Cinnamon Bread Bites cost the same $5.99 as the savory ones, and the three-cake Lava Cake Flight is $9.99. Both are best eaten fresh, so they suit carryout better than a long delivery.',
    },
    {
      id: 'drinks',
      title: 'Drinks',
      items: drinks,
      intro:
        'Priced well above shop prices, and the easiest thing to remove from an order. Worth taking when a bundle includes one; rarely worth paying for separately.',
    },
  ];

  return (
    <>
      <JsonLd data={[breadcrumbSchema(CRUMBS), faqSchema(DRINK_FAQS)]} />

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Breadcrumbs crumbs={CRUMBS} />
      </div>

      <header className="border-b border-line bg-surface-alt">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-ink sm:text-[2.75rem]">
            Sides, drinks and desserts — prices and what is actually worth it
          </h1>
          <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-ink-muted">
            The pizza gets all the attention, and the rest of the order is where the money
            quietly goes. Here is what each section costs, which items earn their place in
            a bundle, which ones survive the journey, and the one line we would suggest
            simply deleting.
          </p>
          <LastUpdated date={PAGE_UPDATED} className="mt-5" />
          <PriceNote className="mt-5 max-w-2xl" />
        </div>
      </header>

      {/* ── The verdict table ────────────────────────────────────────────── */}
      <section aria-labelledby="verdicts" className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand">
          Straight answers
        </p>
        <h2
          id="verdicts"
          className="mt-2.5 text-[1.75rem] font-extrabold leading-tight tracking-tight text-navy-dark sm:text-[2rem]"
        >
          Each side and drink we checked, ranked by whether it is worth the money
        </h2>
        <p className="mt-3 max-w-3xl text-[16px] leading-relaxed text-ink-muted">
          We earn nothing from what you order, so this is our honest read on each item —
          not a list of everything on the menu described in flattering terms.
        </p>

        <div className="table-scroll mt-6 overflow-hidden rounded-card border border-line">
          <table className="w-full min-w-[46rem] text-[15px]">
            <caption className="sr-only">
              Each side and drink with its checked price, how many people it feeds, and our
              verdict
            </caption>
            <thead>
              <tr className="bg-navy text-left text-[11px] uppercase tracking-wide text-white">
                <th scope="col" className="px-4 py-3 font-bold">
                  Item
                </th>
                <th scope="col" className="px-4 py-3 text-right font-bold">
                  Price
                </th>
                <th scope="col" className="px-4 py-3 font-bold">
                  Feeds
                </th>
                <th scope="col" className="px-4 py-3 font-bold">
                  Our verdict
                </th>
              </tr>
            </thead>
            <tbody>
              {VERDICTS.map((row, i) => (
                <tr
                  key={row.item}
                  className={`border-t border-line ${
                    i % 2 === 1 ? 'bg-surface-alt' : 'bg-surface'
                  }`}
                >
                  <th scope="row" className="px-4 py-3 text-left font-semibold text-ink">
                    {row.item}
                  </th>
                  <td className="px-4 py-3 text-right font-extrabold text-brand">
                    <PriceTag price={row.price} verified />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-ink-muted">{row.feeds}</td>
                  <td className="px-4 py-3 text-[14px] text-ink-muted">
                    <span
                      aria-hidden="true"
                      className={`mr-2 inline-block h-2 w-2 rounded-full align-middle ${
                        row.good ? 'bg-navy' : 'bg-brand'
                      }`}
                    />
                    {row.verdict}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[13px] text-ink-muted">
          A blue dot means we would order it; red means we would think twice.
        </p>
      </section>

      {/* ── The markup argument ──────────────────────────────────────────── */}
      <section aria-labelledby="markup" className={SECTION}>
        <div className={INNER}>
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand">
                The easiest saving on the menu
              </p>
              <h2
                id="markup"
                className="mt-2.5 flex items-center gap-3 text-[1.75rem] font-extrabold leading-tight tracking-tight text-navy-dark sm:text-[2rem]"
              >
                <TrendingDown className="h-7 w-7 shrink-0 text-brand" aria-hidden="true" />
                Buy your drinks somewhere else
              </h2>
              <div className="prose-guide mt-5 text-[15px]">
                <p>
                  A 2-liter bottle cost $4.49 at the store we checked — well above what the
                  same bottle costs in a supermarket. A 20-ounce bottle cost $3.49: nearly the
                  price of the 2-liter for less than a third of the liquid. Neither is a
                  scandal — you are paying for the convenience of not making a second stop
                  — but both are worth knowing before you add them to a basket.
                </p>
                <p>
                  On a family order, drinks are commonly five or six dollars of pure
                  convenience charge. That makes them the least painful thing on the whole
                  order to remove, because unlike cutting a pizza size or dropping a side,
                  nobody at the table eats less as a result.
                </p>
                <p>
                  The exception is a deal on your store page that includes a drink. If one
                  does, take it — you get an item priced well above shop prices for
                  nothing. Our{' '}
                  <Link href="/coupons">guide to deal structures</Link> covers which
                  bundles do that.
                </p>
              </div>
            </div>

            <div>
              <div className="table-scroll overflow-hidden rounded-card border border-line">
                <table className="w-full min-w-[26rem] text-[15px]">
                  <caption className="sr-only">
                    Pizza store drink prices compared with approximate shop prices
                  </caption>
                  <thead>
                    <tr className="bg-navy text-left text-[11px] uppercase tracking-wide text-white">
                      <th scope="col" className="px-4 py-3 font-bold">
                        Drink
                      </th>
                      <th scope="col" className="px-4 py-3 text-right font-bold">
                        Store
                      </th>
                      <th scope="col" className="px-4 py-3 text-right font-bold">
                        Shop
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {MARKUP.map((row, i) => (
                      <tr
                        key={row.item}
                        className={`border-t border-line ${
                          i % 2 === 1 ? 'bg-surface-alt' : 'bg-surface'
                        }`}
                      >
                        <th
                          scope="row"
                          className="px-4 py-3 text-left text-[14px] font-semibold text-ink"
                        >
                          {row.item}
                        </th>
                        <td className="px-4 py-3 text-right font-extrabold tabular-nums text-brand">
                          {CURRENCY_SYMBOL}
                          {row.store.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums text-ink-muted">
                          ~{CURRENCY_SYMBOL}
                          {row.shop.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-ink-muted">
                Store figures were checked at one Columbus, Ohio store. The shop column is an approximate
                typical retail price for the same product, included to show the direction
                and rough scale rather than as a surveyed figure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── What survives delivery ───────────────────────────────────────── */}
      <section aria-labelledby="travel" className={SECTION}>
        <div className={INNER}>
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
            <div>
              <h2
                id="travel"
                className="flex items-center gap-3 text-[1.75rem] font-extrabold leading-tight tracking-tight text-navy-dark sm:text-[2rem]"
              >
                <ThermometerSun className="h-7 w-7 shrink-0 text-brand" aria-hidden="true" />
                What survives the journey
              </h2>
              <div className="prose-guide mt-5 text-[15px]">
                <p>
                  We have not timed how each side holds up in a delivery bag, so this is general
                  guidance rather than a test. The rule of thumb: anything that depends on being
                  molten or freshly melted changes most as it cools, and anything dry and baked
                  changes least.
                </p>
                <ul>
                  <li>
                    <strong>Loaded Chicken and Cinnamon Bread Bites</strong> — nothing molten
                    to lose, so they are the safer choices for a long delivery.
                  </li>
                  <li>
                    <strong>Wings</strong> — sauce can soften the skin in transit, so if your
                    store offers sauce on the side, consider it.
                  </li>
                  <li>
                    <strong>Bread Bites and Stuffed Cheesy Bread</strong> — warm bread sides,
                    so order them with the pizza rather than ahead of it.
                  </li>
                  <li>
                    <strong>Lava cakes</strong> — the point is the warm, runny center, which
                    sets as the cake cools.
                  </li>
                </ul>
                <p>
                  If your store is close enough that{' '}
                  <Link href="/delivery-near-me">carryout makes sense</Link>, the items that
                  benefit most from a short trip are the cheesy breads and lava cakes.
                </p>
              </div>
            </div>

            <div>
              <h2 className="flex items-center gap-3 text-[1.75rem] font-extrabold leading-tight tracking-tight text-navy-dark sm:text-[2rem]">
                <Users className="h-7 w-7 shrink-0 text-brand" aria-hidden="true" />
                How much to order for a group
              </h2>
              <div className="prose-guide mt-5 text-[15px]">
                <p>
                  The planning number that holds up is <strong>one 16-piece order of Bread
                  Bites per four people</strong> alongside pizza. That is enough for everyone to have some,
                  and it lets you order one fewer pizza because bread fills people up faster
                  than an extra slice does.
                </p>
                <p>
                  Wings break that rule. As a side you need about four per person, so a
                  group of ten means five 8-piece orders — $54.95 at the prices we checked, more than simply
                  adding another pizza, and it feeds fewer people. Wings work as a treat for
                  a small group and badly as catering for a large one.
                </p>
                <p>
                  Desserts are the opposite. A 16-piece order of Cinnamon Bread Bites ($5.99)
                  covers four people, where the three-cake Lava Cake Flight ($9.99) covers three. For a party, the bread bites are
                  the efficient choice; for two people at home, the cakes are the better
                  one.
                </p>
                <p>
                  And drinks: buy them from a shop. On a party order with three or four bottles that is
                  about $5–8 of pure convenience charge, and it is the only saving on this page
                  that costs you nothing at all in food.{' '}
                  <Link href="/posts/group-ordering-pizza-for-a-party">
                    Our group-ordering guide
                  </Link>{' '}
                  works through a full twelve-person order.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AdSlot slotId="drinks-mid" className="py-6" />

      {/* ── The menu sections ────────────────────────────────────────────── */}
      {sections.map((section) =>
        section.items.length ? (
          <section
            key={section.id}
            id={section.id}
            aria-labelledby={`${section.id}-heading`}
            className={`${SECTION} scroll-mt-28`}
          >
            <div className={INNER}>
              <h2
                id={`${section.id}-heading`}
                className="text-2xl font-extrabold tracking-tight text-navy-dark"
              >
                {section.title}
              </h2>
              <p className="mt-2 max-w-2xl text-[16px] leading-relaxed text-ink-muted">
                {section.intro}
              </p>
              <p className="mt-2 text-sm text-ink-muted">
                Prices from {CURRENCY_SYMBOL}
                {Math.min(...section.items.map((i) => i.price)).toFixed(2)}
              </p>
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {section.items.map((item) => (
                  <MenuItemCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          </section>
        ) : null,
      )}

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className={SECTION}>
        <div className={INNER}>
          <FaqAccordion
            faqs={DRINK_FAQS}
            heading="Sides and drinks: common questions"
            headingId="drinks-faq"
            className=""
          />
          <p className="mt-8 max-w-3xl text-[15px] leading-relaxed text-ink-muted">
            Working out the rest of the order?{' '}
            <Link href="/menus-prices" className="font-semibold text-navy hover:text-brand">
              See the menu with prices
            </Link>
            , compare{' '}
            <Link href="/coupons" className="font-semibold text-navy hover:text-brand">
              the deal structures
            </Link>{' '}
            that make sides cheap, or read our guide to{' '}
            <Link
              href="/posts/how-to-save-money-on-pizza-delivery"
              className="font-semibold text-navy hover:text-brand"
            >
              saving money on a delivery order
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
