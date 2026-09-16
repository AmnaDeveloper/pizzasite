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

const CRUMBS = [
  { name: 'Home', path: '/' },
  { name: 'Menu & Prices', path: '/menus-prices' },
];

const MENU_FAQS = [
  {
    question: 'Are these the real prices at my local store?',
    answer:
      'They are examples gathered from a sample of stores, not a live price feed. Franchise stores set their own prices, so treat every figure here as a reference point and confirm the total at official checkout.',
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
  title: `${BRAND.name} Menu Prices — Full List with Sizes & Calories (${currentMonthYear()})`,
  description:
    `Example prices for 20 ${BRAND.name} menu items with size ladders, calorie counts, ` +
    `ingredients and allergens. Prices start from ${CURRENCY_SYMBOL}${lowestMenuPrice().toFixed(2)} — ` +
    'examples only, verify at official checkout.',
  path: '/menus-prices',
  keywords: [
    'dominos menu prices',
    'pizza menu prices',
    'pizza prices list',
    'pizza sizes and prices',
    'pizza calories',
  ],
});

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
            description: `Example prices for ${items.length} menu items.`,
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
            size ladder, an example price, calorie information, the full ingredient and
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
              {inCategory.length} item{inCategory.length === 1 ? '' : 's'} · example prices
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
