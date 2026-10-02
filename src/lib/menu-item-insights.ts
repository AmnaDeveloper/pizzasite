/**
 * Computed facts for a single menu item page — the quick answer, the cheapest
 * way to buy it, how many to order, where it ranks on price, and the
 * question-shaped FAQs built from those numbers.
 *
 * Everything is derived from menu-items.json and coupons.ts so the 20 item
 * pages stay consistent with the price tables elsewhere on the site.
 */
import { coupons } from '@/data/coupons';
import type { Faq, MenuItem } from '@/data/types';
import { BRAND, CURRENCY_SYMBOL } from './site-config';
import { menuItems } from './content';

export const money = (n: number) => `${CURRENCY_SYMBOL}${n.toFixed(2)}`;

const PIZZA_SIZES = ['Small', 'Medium', 'Large', 'Extra Large'] as const;
const DIAMETER: Record<string, number> = { Small: 10, Medium: 12, Large: 14, 'Extra Large': 16 };

/** Slices per adult when pizza is the whole meal — the planning rule used site-wide. */
const SLICES_PER_ADULT = 3;

export function isPizza(item: MenuItem): boolean {
  return (
    (item.category === 'Specialty Pizza' || item.category === 'Build Your Own') &&
    item.sizes.some((s) => s.name === 'Large')
  );
}

export function sizeOf(item: MenuItem, name: string) {
  return item.sizes.find((s) => s.name === name);
}

/** Whole-pizza calories, only where the data states calories per slice of a large. */
export function wholeLargeCalories(item: MenuItem): number | null {
  const large = sizeOf(item, 'Large');
  if (!isPizza(item) || !large?.slices) return null;
  if (!/per slice of a large/i.test(item.caloriesNote)) return null;
  return item.calories * large.slices;
}

/** "Chicken Wings" takes plural verbs; "Cheesy Bread" does not. */
export function isPlural(item: MenuItem): boolean {
  return /s$/i.test(item.title);
}

const lowerFirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

/** Short, readable deal names for running text. */
const DEAL_LABEL: Record<string, string> = {
  'cpn-carryout-deal': 'carryout deal',
  'cpn-mix-match': 'Mix & Match deal',
  'cpn-sides-addon': 'add-on side deal',
};

/** One-paragraph answer to "how much is a Domino's <item>?" — the snippet target. */
export function quickAnswer(item: MenuItem): string {
  const low = Math.min(...item.sizes.map((s) => s.price));
  const high = Math.max(...item.sizes.map((s) => s.price));
  if (isPizza(item)) {
    const large = sizeOf(item, 'Large')!;
    const smallest = item.sizes[0];
    const biggest = item.sizes[item.sizes.length - 1];
    const route = cheapestRoute(item);
    return (
      `A large ${item.title.toLowerCase()} (${DIAMETER.Large} inch, ${large.slices} slices) is about ` +
      `${money(large.price)} at ${BRAND.name} in our store sample. Sizes run from ` +
      `${money(smallest.price)} for a ${DIAMETER[smallest.name]}-inch ${smallest.name.toLowerCase()} to ` +
      `${money(biggest.price)} for a ${DIAMETER[biggest.name]}-inch ${biggest.name.toLowerCase()}.` +
      (route ? ` On a carryout deal the same large commonly drops to about ${money(route.dealPrice)}.` : '')
    );
  }
  const sizes = item.sizes.map((s) => `${s.name.toLowerCase()} ${money(s.price)}`).join(', ');
  const plural = isPlural(item);
  return low === high
    ? `${item.title} ${plural ? 'are' : 'is'} about ${money(low)} at ${BRAND.name} in our store sample (${lowerFirst(item.sizes[0].detail)}).`
    : `${item.title} ${plural ? 'cost' : 'costs'} about ${money(low)} to ${money(high)} at ${BRAND.name} in our store sample — ${sizes}.`;
}

export type CheapestRoute = {
  couponId: string;
  dealName: string;
  /** Lower-case label for use mid-sentence, e.g. "carryout deal". */
  dealLabel: string;
  dealPrice: number;
  menuPrice: number;
  saving: number;
  savingPct: number;
  sizeLabel: string;
  how: string;
};

/**
 * The deal type that most often beats menu price for this kind of item.
 * Pizzas: the flat-rate carryout large ("any toppings"). Pasta/sandwiches:
 * Mix & Match. Sides, chicken and desserts: the add-on side. Drinks: none.
 */
export function cheapestRoute(item: MenuItem): CheapestRoute | null {
  const pick = (couponId: string, sizeName: string, how: string, dealPrice?: number) => {
    const coupon = coupons.find((c) => c.id === couponId);
    const size = sizeOf(item, sizeName) ?? item.sizes[0];
    if (!coupon || !size) return null;
    const price = dealPrice ?? parseFloat(coupon.discount.replace(/[^0-9.]/g, ''));
    if (!(price > 0) || price >= size.price) return null;
    const saving = Math.round((size.price - price) * 100) / 100;
    return {
      couponId,
      dealName: coupon.title.split(':')[0].split(',')[0],
      dealLabel: DEAL_LABEL[couponId] ?? 'deal',
      dealPrice: price,
      menuPrice: size.price,
      saving,
      savingPct: Math.round((saving / size.price) * 100),
      sizeLabel: `${size.name.toLowerCase()} (${size.detail})`,
      how,
    };
  };

  if (isPizza(item)) {
    return pick(
      'cpn-carryout-deal',
      'Large',
      'Switch to carryout before you build the order, then start from the carryout deal tile rather than the menu.',
    );
  }
  if (item.category === 'Pasta & Sandwiches') {
    return pick(
      'cpn-mix-match',
      item.sizes[0].name,
      'Add a second qualifying item — a medium pizza, another pasta or a side — and both drop to the flat Mix & Match price.',
    );
  }
  if (item.category === 'Sides' || item.category === 'Chicken' || item.category === 'Desserts') {
    return pick(
      'cpn-sides-addon',
      item.sizes[0].name,
      'Add a pizza to the basket first; the add-on price only unlocks once a qualifying main item is in it.',
    );
  }
  return null;
}

/** How many large pizzas a group needs at three slices per adult, and the menu cost. */
export function servingPlan(item: MenuItem) {
  const large = sizeOf(item, 'Large');
  if (!isPizza(item) || !large?.slices) return [];
  const route = cheapestRoute(item);
  return [2, 4, 6, 8, 10, 12].map((people) => {
    const pizzas = Math.ceil((people * SLICES_PER_ADULT) / large.slices!);
    return {
      people,
      pizzas,
      slices: pizzas * large.slices!,
      menuCost: pizzas * large.price,
      dealCost: route ? pizzas * route.dealPrice : null,
    };
  });
}

/** Where this pizza's large sits among every pizza on the menu, cheapest first. */
export function pizzaRanking(item: MenuItem) {
  if (!isPizza(item)) return [];
  return menuItems
    .filter(isPizza)
    .map((p) => ({ slug: p.slug, title: p.title, large: sizeOf(p, 'Large')!.price, current: p.slug === item.slug }))
    .sort((a, b) => a.large - b.large || a.title.localeCompare(b.title));
}

/** Question-shaped FAQs for the head queries, generated from the item's numbers. */
export function generatedFaqs(item: MenuItem): Faq[] {
  const name = item.title.toLowerCase();
  const faqs: Faq[] = [];
  const route = cheapestRoute(item);

  if (isPizza(item)) {
    const large = sizeOf(item, 'Large')!;
    const whole = wholeLargeCalories(item);
    faqs.push({
      question: `How much is a large ${name} at ${BRAND.name}?`,
      answer: `About ${money(large.price)} at menu price for a ${DIAMETER.Large}-inch large in our sample of stores. ${
        route
          ? `On a flat-rate carryout offer it commonly drops to about ${money(route.dealPrice)} — a saving of ${money(route.saving)}.`
          : ''
      } Franchise stores set their own prices, so confirm the total at checkout.`,
    });
    faqs.push({
      question: `How many slices are in a ${BRAND.name} ${name}?`,
      answer: item.sizes
        .filter((s) => s.slices)
        .map((s) => `${s.name}: ${s.slices} slices`)
        .join('; ')
        .concat('. At three slices per adult, a large feeds two to three people as a meal.'),
    });
    faqs.push({
      question: `How many calories are in a ${BRAND.name} ${name}?`,
      answer: `About ${item.calories} calories — ${lowerFirst(item.caloriesNote).replace(/\.$/, '')}${
        whole ? `, or roughly ${whole.toLocaleString('en-US')} for the whole large` : ''
      }. Crust choice changes the number more than anything else — thin crust is lighter, pan crust heavier. Treat these as estimates and check the official nutrition calculator.`,
    });
  } else {
    const plural = isPlural(item);
    const subject = plural ? `${BRAND.name} ${name}` : `the ${BRAND.name} ${name}`;
    faqs.push({
      question: `How much ${plural ? 'are' : 'is'} ${subject}?`,
      answer: `${quickAnswer(item)} ${
        route ? `On the ${route.dealLabel} ${plural ? 'they are' : 'it is'} about ${money(route.dealPrice)}.` : ''
      } Prices vary by store, so check the total at checkout.`.replace(/\s+/g, ' ').trim(),
    });
    faqs.push({
      question: `How many calories are in ${subject}?`,
      answer: `About ${item.calories} calories — ${lowerFirst(item.caloriesNote).replace(/\.$/, '')}. Check the official nutrition calculator for your exact order.`,
    });
  }
  return faqs;
}

/** <title> without the site suffix: brand + item + "Price" + month, kept short. */
export function seoTitle(item: MenuItem, monthYear: string): string {
  const base = `${BRAND.name} ${item.title} Price`;
  const [month, year] = monthYear.split(' ');
  const full = `${base} (${monthYear})`;
  const short = `${base} (${month.slice(0, 3)} ${year})`;
  // The layout appends " | Slice & Save" (15 chars); keep the whole under ~65.
  return full.length <= 48 ? full : short.length <= 50 ? short : base;
}

/** Meta description: the answer first, under 155 characters. */
export function seoDescription(item: MenuItem): string {
  const fit = (s: string) => (s.length <= 155 ? s : `${s.slice(0, 152).replace(/[\s,;—-]+\S*$/, '')}…`);
  if (isPizza(item)) {
    const large = sizeOf(item, 'Large')!;
    const smallest = item.sizes[0];
    const biggest = item.sizes[item.sizes.length - 1];
    return fit(
      `${BRAND.name} ${item.title.toLowerCase()} costs ${money(smallest.price)}–${money(biggest.price)}; ` +
        `a large is ${money(large.price)}. Prices by size, slices, calories, allergens and the cheapest way to order.`,
    );
  }
  const low = Math.min(...item.sizes.map((s) => s.price));
  const high = Math.max(...item.sizes.map((s) => s.price));
  const range = low === high ? money(low) : `${money(low)}–${money(high)}`;
  return fit(
    `${BRAND.name} ${item.title.toLowerCase()} costs about ${range}. Sizes, calories, ingredients, allergens and the cheapest way to order it.`,
  );
}

export { PIZZA_SIZES, DIAMETER, SLICES_PER_ADULT };
