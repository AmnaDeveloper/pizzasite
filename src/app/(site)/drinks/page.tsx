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
import { BRAND, CURRENCY_SYMBOL } from '@/lib/site-config';

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
      'A two-litre bottle is around $3.49 in our sample of stores and an individual bottle around $2.29 to $2.79. Both are roughly double what the same product costs in a supermarket. It is a convenience charge rather than a scandal, and it is the easiest line to remove from an order without anyone eating less.',
  },
  {
    question: 'What is the cheapest side to order?',
    answer:
      'Cinnamon twists and plain breadsticks are the cheapest per person, at around $5.49 and $6.49 for a portion that serves three or four alongside pizza. Wings are the most expensive way to feed people, because a large share of what you pay for is bone weight.',
  },
  {
    question: 'Which side gives the most food for the money?',
    answer:
      'Boneless chicken bites, if you want protein — there is no bone weight, so almost all of it is edible. For sheer volume, bread sides win: they are made from the same dough as the pizza, which is why they cost the store very little and appear in nearly every bundle.',
  },
  {
    question: 'Is the soda delivered cold?',
    answer:
      'Not always. Many stores keep bottled stock at room temperature rather than chilled. If you need it cold, ask when ordering — some stores keep chilled stock and some genuinely do not.',
  },
  {
    question: 'Do drinks count toward a deal?',
    answer:
      'They usually count toward the minimum order value for delivery, but almost never as a qualifying item in a mix-and-match bundle. Some family bundles include a drink at no extra cost, and where that is the case it is worth taking.',
  },
  {
    question: 'Which sides survive a long delivery?',
    answer:
      'Boneless chicken and cinnamon twists travel best. Cheesy bread and lava cakes are the worst — melted cheese firms up as it cools and a lava cake loses its molten centre entirely, which is the whole point of it. If your delivery is long, order those two only on a carryout trip.',
  },
  {
    question: 'How many sides do I need for a group?',
    answer:
      'One bread side per four people works alongside pizza, and it lets you order one fewer pizza because people fill up faster. Wings are the exception — at four to five per person, feeding ten people means two large portions, which usually costs more than an extra pizza.',
  },
  {
    question: `What is the cheapest way to get drinks with a ${BRAND.name} order?`,
    answer:
      'Buy them from a shop and order only the food. On a family order that alone cuts ten to fifteen percent off the total without removing any food, which makes it the least painful saving available.',
  },
];

/* Title budget is ~45 characters before the site name is appended. */
export const metadata: Metadata = generatePageSEO({
  title: `${BRAND.name} Sides & Drinks Prices`,
  description:
    'Example prices for breadsticks, wings, pasta, desserts and drinks — plus which sides are ' +
    'worth the money, which travel badly, and the one line worth deleting.',
  path: '/drinks',
  keywords: [
    'dominos sides prices',
    'dominos drinks price',
    'pizza breadsticks price',
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
  { item: 'Two-litre soda bottle', store: 3.49, shop: 2.0 },
  { item: 'Bottled soda, 20 fl oz', store: 2.79, shop: 2.0 },
  { item: 'Bottled juice, single serve', store: 2.79, shop: 1.6 },
  { item: 'Bottled water, 16.9 fl oz', store: 2.29, shop: 0.5 },
];

/** Our own verdict on each side, kept blunt. */
const VERDICTS = [
  {
    item: 'Cinnamon twists',
    price: 5.49,
    feeds: '3–4 as dessert',
    verdict: 'Best value dessert on the menu, by a distance',
    good: true,
  },
  {
    item: 'Garlic parmesan breadsticks',
    price: 6.49,
    feeds: '3–4 as a side',
    verdict: 'The reliable bundle filler — cheap for the store, filling for you',
    good: true,
  },
  {
    item: 'Chocolate lava cakes (2)',
    price: 5.99,
    feeds: '2',
    verdict: 'Excellent collected, ordinary after a long delivery',
    good: true,
  },
  {
    item: 'Cheesy bread',
    price: 8.49,
    feeds: '3–4 as a side',
    verdict: 'Take it when a bundle prices it the same as plain breadsticks',
    good: true,
  },
  {
    item: 'Boneless chicken bites',
    price: 8.99,
    feeds: '2 as a side',
    verdict: 'Most edible weight per dollar, and the best leftovers on the menu',
    good: true,
  },
  {
    item: 'Chicken wings',
    price: 9.49,
    feeds: '2 as a side',
    verdict: 'Worst food per dollar — you are buying bone weight',
    good: false,
  },
  {
    item: 'Two-litre soda',
    price: 3.49,
    feeds: '6–8 glasses',
    verdict: 'Fine inside a bundle, poor value bought separately',
    good: false,
  },
  {
    item: 'Bottled water',
    price: 2.29,
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
        'Made from the same dough as the pizza, which is why they are cheap for the store and reliably good value inside a two-item bundle.',
    },
    {
      id: 'chicken',
      title: 'Chicken',
      items: chicken,
      intro:
        'Boneless bites beat wings on meat per dollar because there is no bone weight. Wings are often excluded from the cheapest bundles or surcharged inside them.',
    },
    {
      id: 'desserts',
      title: 'Desserts',
      items: desserts,
      intro:
        'Usually discounted as an add-on once a main item is already in the basket, so adding one last is cheaper than ordering it separately.',
    },
    {
      id: 'drinks',
      title: 'Drinks',
      items: drinks,
      intro:
        'The highest-markup section of any pizza menu and the easiest thing to remove from an order. Worth taking when a bundle includes one; rarely worth paying for separately.',
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
          <LastUpdated className="mt-5" />
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
          Every side, ranked by whether it is worth the money
        </h2>
        <p className="mt-3 max-w-3xl text-[16px] leading-relaxed text-ink-muted">
          We earn nothing from what you order, so this is our honest read on each item —
          not a list of everything on the menu described in flattering terms.
        </p>

        <div className="table-scroll mt-6 overflow-hidden rounded-card border border-line">
          <table className="w-full min-w-[46rem] text-[15px]">
            <caption className="sr-only">
              Each side and drink with its example price, how many people it feeds, and our
              verdict
            </caption>
            <thead>
              <tr className="bg-navy text-left text-[11px] uppercase tracking-wide text-white">
                <th scope="col" className="px-4 py-3 font-bold">
                  Item
                </th>
                <th scope="col" className="px-4 py-3 text-right font-bold">
                  Example
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
                  <td className="px-4 py-3 text-right font-extrabold tabular-nums text-brand">
                    {CURRENCY_SYMBOL}
                    {row.price.toFixed(2)}
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
                  A two-litre bottle from a pizza store costs roughly twice what the same
                  bottle costs in a supermarket. An individual bottle costs about half the
                  price of the two-litre for about a quarter of the liquid. Neither is a
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
                  The exception is a bundle that includes a drink at no extra cost. Several
                  family packs do, and where the drink is genuinely free rather than
                  nominally discounted, take it — you are getting the highest-markup item on
                  the menu for nothing. Our{' '}
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
                Store figures are our example prices. The shop column is an approximate
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
                  Sides are far more sensitive to delivery time than pizza is. A pizza that
                  arrives thirty minutes after it left the oven is a slightly cooler pizza.
                  A lava cake that arrives thirty minutes late is a different product — the
                  molten centre has set, and that centre was the entire reason to order it.
                </p>
                <p>Ranked by how well they hold up:</p>
                <ul>
                  <li>
                    <strong>Boneless chicken</strong> — travels best, and reheats better in
                    an air fryer or hot oven than anything else on the menu.
                  </li>
                  <li>
                    <strong>Cinnamon twists</strong> — no molten centre to lose. Good for
                    about half an hour, chewy after an hour.
                  </li>
                  <li>
                    <strong>Wings</strong> — fine, provided you asked for the sauce on the
                    side so the skin does not soften in transit.
                  </li>
                  <li>
                    <strong>Breadsticks</strong> — harden as they cool, faster than pizza
                    does. Reheat in an oven, never a microwave.
                  </li>
                  <li>
                    <strong>Cheesy bread</strong> — melted cheese sets within about twenty
                    minutes and the texture changes noticeably.
                  </li>
                  <li>
                    <strong>Lava cakes</strong> — the worst traveller on the menu, and the
                    best thing on it if you collect the order yourself.
                  </li>
                </ul>
                <p>
                  If your store is close enough that{' '}
                  <Link href="/delivery-near-me">carryout makes sense</Link>, the two items
                  that gain the most from it are cheesy bread and lava cakes.
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
                  The planning number that holds up is <strong>one bread side per four
                  people</strong> alongside pizza. That is enough for everyone to have some,
                  and it lets you order one fewer pizza because bread fills people up faster
                  than an extra slice does.
                </p>
                <p>
                  Wings break that rule. As a side you need four to five per person, so a
                  group of ten means two large portions — usually more expensive than simply
                  adding another pizza, and it feeds fewer people. Wings work as a treat for
                  a small group and badly as catering for a large one.
                </p>
                <p>
                  Desserts are the opposite. A single order of cinnamon twists covers three
                  or four people, where two lava cakes cover two. For a party, twists are
                  the efficient choice; for two people at home, the cakes are the better
                  one.
                </p>
                <p>
                  And drinks: buy them from a shop. On a party order that is ten or fifteen
                  dollars of pure convenience charge, and it is the only saving on this page
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
                Example prices from {CURRENCY_SYMBOL}
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
              See the full menu with example prices
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
