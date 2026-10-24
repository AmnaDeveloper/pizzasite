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
    `${BRAND.name} menu prices for all 20 items — pizzas by size, sides, wings, pasta, desserts ` +
    `and drinks — with calories and allergens. From ${CURRENCY_SYMBOL}${lowestMenuPrice().toFixed(2)}.`,
  path: '/menus-prices',
  keywords: [
    'dominos menu prices',
    'pizza menu prices',
    'pizza prices list',
    'pizza sizes and prices',
    'pizza calories',
  ],
});

/** A short buying guide per menu section — what is worth it and what fits a deal. */
const SECTION_GUIDE: Record<string, string> = {
  'Specialty Pizza':
    'Specialty pizzas carry four or five toppings for less than you would pay adding the same toppings yourself, so they are the better buy once you want three or more. They are also the pizzas that extract the most from a flat-price carryout deal, because the deal price does not rise with the toppings.',
  'Build Your Own':
    'The same base price as a cheese pizza, plus a fixed amount per topping. One or two toppings: build your own. Four or more: check the specialty section first. Hand tossed and thin crust cost the same; pan costs more and stops at large.',
  Sides:
    'Bread sides are made from the same dough as the pizza, so they are cheap to make and turn up in almost every bundle. One eight-piece side covers about four people alongside pizza, and the large size is the cheaper buy per piece.',
  Chicken:
    'The most expensive way to feed a group, because part of what you pay for is bone weight — boneless bites give more edible food per dollar than wings. Plan on about four pieces each as a side.',
  'Pasta & Sandwiches':
    'One adult portion each, modest by restaurant standards. At menu price they are poor value; as a qualifying item in a two-for deal they are among the best picks on the menu.',
  Desserts:
    'Small add-ons that are better collected than delivered — a lava cake loses its molten centre as it cools. Cinnamon twists stretch further across a group than the two-cake lava order.',
  Drinks:
    'The easiest line to cut. Bottled drinks cost roughly twice what a supermarket charges, so buying them separately trims a family order without anyone eating less.',
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
              alt="An overhead spread of pizzas, wings, breadsticks and dessert on a wooden table"
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
