import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { coupons } from '@/data/coupons';
import { getMenuItem, menuItems } from '@/lib/content';
import { BRAND, CURRENCY_SYMBOL } from '@/lib/site-config';
import { currentYear, formatLongDate } from '@/lib/utils/date';

/** Date the homepage figures were last checked. Update it with the content. */
const HOME_UPDATED = '2026-10-12';

const money = (n: number) => `${CURRENCY_SYMBOL}${n.toFixed(2)}`;

/**
 * Homepage hero: badges, a large uppercase headline, a short answer-first
 * paragraph, two calls to action and three headline stats on the left; a
 * framed food photo with the cheapest pizza pinned to it on the right.
 *
 * Colours stay inside the site's two-hue palette: navy background, brand red
 * accents, and the red tint (brand-soft) for the sub-headline. Contrast on
 * navy: white 6.50:1, brand-soft 5.9:1, white/80 4.77:1.
 */
export default function HeroSection() {
  const year = currentYear();
  const cheese = getMenuItem('classic-cheese-pizza');
  const cheapestPizza = cheese ? Math.min(...cheese.sizes.map((s) => s.price)) : null;
  const largeCheese = cheese?.sizes.find((s) => s.name === 'Large')?.price;

  const stats = [
    { label: 'Menu items', value: String(menuItems.length) },
    { label: 'Deal types', value: String(coupons.length) },
    ...(cheapestPizza ? [{ label: 'Pizzas from', value: money(cheapestPizza) }] : []),
  ];

  return (
    <section className="relative overflow-hidden bg-navy-dark text-white">
      {/* Soft highlight behind the photo — white at low opacity keeps the palette. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(55rem_35rem_at_80%_30%,rgba(255,255,255,0.09),transparent_60%)]"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
        <div>
          <ul className="flex flex-wrap gap-2" aria-label="Highlights">
            {[`${year} prices`, 'Photos', 'Deals'].map((badge) => (
              <li
                key={badge}
                className="bg-brand px-3 py-1.5 text-[12px] font-extrabold uppercase tracking-[0.12em] text-white"
              >
                {badge}
              </li>
            ))}
          </ul>

          <h1 className="mt-6 text-[2.6rem] font-extrabold uppercase leading-[1.02] tracking-tight sm:text-[3.4rem] lg:text-[60px]">
            {BRAND.name} menu prices {year}
          </h1>

          <p className="mt-5 font-heading text-[1.35rem] font-extrabold uppercase leading-tight tracking-tight text-brand-soft sm:text-[1.75rem]">
            Check the price before you order.
          </p>

          <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-white/85">
            Every {BRAND.name} menu item with its estimated price by size, the deal types
            that actually lower your total, food photos and ordering tips
            {largeCheese ? ` — a large cheese pizza is about ${money(largeCheese)}` : ''}.
            Page updated {formatLongDate(HOME_UPDATED)}.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="#prices"
              className="inline-flex items-center gap-2.5 bg-brand px-6 py-4 text-[15px] font-extrabold uppercase tracking-wide text-white transition-colors hover:bg-brand-dark"
            >
              See menu & prices
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/coupons"
              className="inline-flex items-center gap-2.5 border-2 border-white px-6 py-[14px] text-[15px] font-extrabold uppercase tracking-wide text-white transition-colors hover:bg-white hover:text-navy-dark"
            >
              Deals & coupons
            </Link>
          </div>

          <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-white/20 pt-6">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/80 sm:text-[12px]">
                  {s.label}
                </dt>
                <dd className="mt-2 font-heading text-[1.6rem] font-extrabold leading-none tabular-nums sm:text-[2.1rem]">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Framed photo with the cheapest pizza pinned to the corner. */}
        <figure className="relative border-[5px] border-brand bg-navy shadow-2xl shadow-black/40">
          <div className="relative aspect-[4/3]">
            <Image
              src="/images/home-hero.jpg"
              alt="Overhead view of a table with pepperoni and veggie pizzas, wings, breadsticks and dipping sauces"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 540px"
              className="object-cover"
            />
          </div>
          {cheapestPizza ? (
            <figcaption className="absolute bottom-0 left-0 bg-brand px-5 py-3 text-white">
              <span className="block text-[11px] font-bold uppercase tracking-[0.14em] text-white/90">
                Cheapest pizza
              </span>
              <span className="mt-0.5 block font-heading text-[1.25rem] font-extrabold leading-tight sm:text-[1.5rem]">
                Small cheese {money(cheapestPizza)}
              </span>
            </figcaption>
          ) : null}
        </figure>
      </div>
    </section>
  );
}
