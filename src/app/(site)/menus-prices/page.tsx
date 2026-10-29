import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import MenuItemCard from '@/components/MenuItemCard';
import PriceNote from '@/components/PriceNote';
import LastUpdated from '@/components/LastUpdated';
import FaqAccordion from '@/components/FaqAccordion';
import AdSlot from '@/components/AdSlot';
import JsonLd from '@/components/JsonLd';
import { generatePageSEO } from '@/lib/seo-config';
import { breadcrumbSchema, collectionPageSchema, faqSchema } from '@/lib/seo/schema';
import verifiedPrices from '../../../../data/verified-prices-2026-10-25.json';
import PriceTag from '@/components/PriceTag';
import { getAllMenuItems, getMenuCategories, lowestMenuPrice } from '@/lib/content';
import { BRAND, CURRENCY_SYMBOL } from '@/lib/site-config';
import { currentMonthYear } from '@/lib/utils/date';
import { priceSourceSentence } from '@/lib/price-source';

const CRUMBS = [
  { name: 'Home', path: '/' },
  { name: 'Menu & Prices', path: '/menus-prices' },
];

const MENU_FAQS = [
  {
    question: 'Are these the real prices at my local store?',
    answer:
      priceSourceSentence(),
  },
  {
    question: 'Which menu item gives the best value?',
    answer:
      'Measured by price per square inch, an extra-large pizza is the best value item on the board and a small is the worst. Measured by what a flat-rate deal buys you, the most heavily topped pizza wins, because the deal price does not change with the toppings.',
  },
  {
    question: 'Why do the sizes cost so little more than each other?',
    answer:
      'Because dough and sauce are cheap relative to the fixed costs of making and delivering any pizza at all. The store spends similar labour on a small and a large, so the price gap between them is much smaller than the difference in food.',
  },
  {
    question: 'Do the calorie figures include toppings?',
    answer:
      'Each item lists what its figure covers in the note underneath. Pizza figures are per slice of a large unless stated otherwise, and build-your-own bases are quoted before toppings are added.',
  },
];

export const metadata: Metadata = generatePageSEO({
  title: `${BRAND.name} Menu Prices (${currentMonthYear()})`,
  description:
    `${BRAND.name} menu prices checked at a real store: pizzas by size, sides, wings, pasta, ` +
    `desserts and drinks, with calories and allergens. From ${CURRENCY_SYMBOL}${lowestMenuPrice().toFixed(2)}.`,
  path: '/menus-prices',
  keywords: [
    'dominos menu prices',
    'pizza menu prices',
    'pizza prices list',
    'pizza sizes and prices',
    'pizza calories',
  ],
});

/**
 * Checked items without their own page — taken from the price check file, so
 * every row here is a real price from the real store.
 */
const PAGED = new Set(['ExtravaganZZa', 'MeatZZa', 'Pacific Veggie', 'Memphis BBQ Chicken', 'Philly Cheese Steak']);
const ALSO_ON_MENU = (verifiedPrices.items as { section: string; name: string; size?: string; price: number; calories?: string }[])
  .filter(
    (i) =>
      (i.section === 'Specialty Pizza' && !PAGED.has(i.name)) ||
      ['Salads', 'Extras'].includes(i.section) ||
      /Marbled Cookie Brownie|Mac & Cheese|Sandwich|Philly Cheese Steak$/.test(i.name) && i.section !== 'Specialty Pizza' && i.section !== 'Sandwiches',
  )
  .map((i) => ({ name: i.name, size: i.size ?? '', price: i.price, calories: i.calories ?? '—' }));

/** A short buying guide per menu section — what is worth it and what fits a deal. */
const SECTION_GUIDE: Record<string, string> = {
  'Specialty Pizza':
    'Every large specialty pizza we checked cost the same $19.99, whether it carried four toppings or nine — so the most heavily topped ones are the best value if you like what is on them. They are also the pizzas that get the most out of a flat-price carryout deal, because the deal price does not rise with the toppings.',
  'Build Your Own':
    'A large hand-tossed cheese pizza was $13.99 in our check; each topping adds a charge we have not checked yet. One or two toppings: build your own. Four or more: the $19.99 specialty pizzas usually win. Hand tossed stops at large, and Handmade Pan is made as a 12-inch medium only.',
  Sides:
    'Bread sides are made from the same dough as the pizza, so they are cheap to make and turn up in almost every bundle. Sixteen Bread Bites for $5.99 cover about four people alongside pizza; Stuffed Cheesy Bread is $8.49 and comes with a dip.',
  Chicken:
    'The most expensive way to feed a group — eight wings were $10.99, and part of what you pay for is bone. Loaded Chicken gives eight boneless pieces for $8.99. Plan on about four pieces each as a side.',
  'Pasta & Sandwiches':
    'One adult portion each: pastas $8.49 and sandwiches $8.99 in our check, whichever filling you choose. At menu price they are modest value; as a qualifying item in a two-for deal they are among the best picks on the menu.',
  Desserts:
    'Small add-ons that are better collected than delivered — a lava cake loses its molten centre as it cools. Sixteen Cinnamon Bread Bites ($5.99) stretch further across a group than the three-cake Lava Cake Flight ($9.99).',
  Drinks:
    'The easiest line to cut. A 2-liter was $4.49 and a 20-ounce bottle $3.49 in our check — well above supermarket prices — so buying drinks separately trims a family order without anyone eating less.',
};

export default function MenuIndexPage() {
  const items = getAllMenuItems();
  const categories = getMenuCategories();

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(CRUMBS),
          faqSchema(MENU_FAQS),
          collectionPageSchema({
            name: `${BRAND.name} menu prices`,
            description: `Prices for ${items.length} menu items.`,
            path: '/menus-prices',
            items: items.map((i) => ({
              name: i.title,
              path: `/menus-prices/${i.slug}`,
            })),
          }),
        ]}
      />

      <div className="mx-auto max-w-6xl px-4">
        <Breadcrumbs crumbs={CRUMBS} />
      </div>

      <header className="border-b border-line bg-surface-alt">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-ink sm:text-[2.75rem]">
            {BRAND.name} menu prices — every item, with sizes and calories
          </h1>
          <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-ink-muted">
            {items.length} items priced across {categories.length} sections. Each one has a
            size ladder, an estimated price, calorie information, the full ingredient and
            allergen list, and our note on whether it is worth ordering at menu price or
            only inside a deal.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <LastUpdated />
            <Link
              href="/coupons"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-navy hover:text-brand"
            >
              See how the deals change these prices
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <PriceNote className="mt-5 max-w-2xl" />
          <div className="relative mt-7 aspect-[21/9] overflow-hidden rounded-card border border-line">
            <Image
              src="/images/menus-prices-hero.jpg"
              alt="An overhead spread of pizzas, wings, bread and dessert on a wooden table"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1152px"
              className="object-cover"
            />
          </div>
        </div>
      </header>

      <nav aria-label="Menu sections" className="border-b border-line bg-surface">
        <ul className="mx-auto flex max-w-6xl flex-wrap gap-2 px-4 py-4">
          {categories.map((cat) => (
            <li key={cat}>
              <a
                href={`#${slugifyCategory(cat)}`}
                className="inline-block rounded-full border border-line px-3.5 py-1.5 text-sm font-semibold text-ink transition-colors hover:border-navy hover:text-navy"
              >
                {cat}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {categories.map((category, ci) => {
        const inCategory = items.filter((i) => i.category === category);
        return (
          <section
            key={category}
            id={slugifyCategory(category)}
            aria-labelledby={`${slugifyCategory(category)}-heading`}
            className="mx-auto max-w-6xl scroll-mt-28 px-4 py-10"
          >
            <h2
              id={`${slugifyCategory(category)}-heading`}
              className="text-2xl font-extrabold tracking-tight text-navy-dark"
            >
              {category}
            </h2>
            <p className="mt-2 text-[15px] text-ink-muted">
              {inCategory.length} item{inCategory.length === 1 ? '' : 's'} · prices
              from {CURRENCY_SYMBOL}
              {Math.min(...inCategory.map((i) => i.price)).toFixed(2)}
              {['Sides', 'Chicken', 'Desserts', 'Drinks'].includes(category) ? (
                <>
                  {' · '}
                  <Link
                    href="/drinks"
                    className="font-semibold text-navy hover:text-brand hover:underline"
                  >
                    is it worth ordering?
                  </Link>
                </>
              ) : null}
            </p>
            {SECTION_GUIDE[category] ? (
              <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-ink">
                {SECTION_GUIDE[category]}
              </p>
            ) : null}
            {inCategory.length > 1 ? (() => {
              const cheapest = [...inCategory].sort((a, b) => a.price - b.price)[0];
              const prices = inCategory.flatMap((i) => i.sizes.map((sz) => sz.price));
              return (
                <p className="mt-2 text-[14px] text-ink-muted">
                  Cheapest here:{' '}
                  <Link href={`/menus-prices/${cheapest.slug}`} className="font-semibold text-navy hover:underline">
                    {cheapest.title}
                  </Link>{' '}
                  from {CURRENCY_SYMBOL}
                  {cheapest.price.toFixed(2)}. Prices in this section run {CURRENCY_SYMBOL}
                  {Math.min(...prices).toFixed(2)}–{CURRENCY_SYMBOL}
                  {Math.max(...prices).toFixed(2)} across all sizes.
                </p>
              );
            })() : null}
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {inCategory.map((item, i) => (
                <MenuItemCard key={item.id} item={item} priority={ci === 0 && i === 0} />
              ))}
            </div>
          </section>
        );
      })}

      <section aria-labelledby="also-on-menu" className="border-t border-line bg-surface-alt">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h2 id="also-on-menu" className="text-2xl font-extrabold tracking-tight text-navy-dark">
            Also on the menu
          </h2>
          <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-ink-muted">
            Items we checked at the same store that do not have their own page yet.
          </p>
          <div className="table-scroll mt-5 overflow-hidden rounded-card border border-line bg-surface">
            <table className="w-full text-[15px]">
              <caption className="sr-only">Other checked menu prices</caption>
              <thead>
                <tr className="bg-navy text-left text-[11px] uppercase tracking-wide text-white">
                  <th scope="col" className="px-4 py-3 font-bold">Item</th>
                  <th scope="col" className="hidden px-4 py-3 font-bold sm:table-cell">Calories</th>
                  <th scope="col" className="px-4 py-3 text-right font-bold">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {ALSO_ON_MENU.map((row) => (
                  <tr key={row.name} className="odd:bg-surface even:bg-surface-alt">
                    <th scope="row" className="px-4 py-3 text-left font-semibold text-ink">
                      {row.name}
                      {row.size ? <span className="ml-1.5 text-[13px] font-medium text-ink-muted">{row.size}</span> : null}
                    </th>
                    <td className="hidden px-4 py-3 text-[14px] text-ink-muted sm:table-cell">{row.calories}</td>
                    <td className="px-4 py-3 text-right font-extrabold text-brand">
                      <PriceTag price={row.price} verified />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <AdSlot slotId="menu-index" className="py-6" />

      <div className="mx-auto max-w-3xl px-4 pb-16">
        <FaqAccordion faqs={MENU_FAQS} heading="Questions about these prices" />
      </div>
    </>
  );
}

function slugifyCategory(category: string): string {
  return category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}
