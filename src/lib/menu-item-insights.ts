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

/** Search-friendly name for headings and prose; falls back to the menu title. */
export function displayName(item: MenuItem): string {
  return item.seoName ?? item.title;
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
      `A large ${displayName(item).toLowerCase()} (${DIAMETER.Large} inch${large.slices ? `, ${large.slices} slices` : ''}) is about ` +
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
    .map((p) => ({ slug: p.slug, title: displayName(p), large: sizeOf(p, 'Large')!.price, current: p.slug === item.slug }))
    .sort((a, b) => a.large - b.large || a.title.localeCompare(b.title));
}

/** Question-shaped FAQs for the head queries, generated from the item's numbers. */
export function generatedFaqs(item: MenuItem): Faq[] {
  const name = displayName(item).toLowerCase();
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
    // Square-cut pizzas have no slice count in the data — skip rather than guess.
    if (item.sizes.some((s) => s.slices)) {
      faqs.push({
        question: `How many slices are in a ${BRAND.name} ${name}?`,
        answer: item.sizes
          .filter((s) => s.slices)
          .map((s) => `${s.name}: ${s.slices} slices`)
          .join('; ')
          .concat('. At three slices per adult, a large feeds two to three people as a meal.'),
      });
    }
    faqs.push({
      question: `How many calories are in a ${BRAND.name} ${name}?`,
      answer: `About ${item.calories} calories per slice${
        whole ? `, or roughly ${whole.toLocaleString('en-US')} for a whole large` : ''
      }. ${item.caloriesNote} Crust choice changes the number more than anything else — thin crust is lighter, pan crust heavier. Treat these as estimates and check the official nutrition calculator.`,
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
  const base = `${BRAND.name} ${displayName(item)} Price`;
  const [month, year] = monthYear.split(' ');
  const full = `${base} (${monthYear})`;
  const short = `${base} (${month.slice(0, 3)} ${year})`;
  // The layout appends " | Slice & Save" (15 chars); keep the whole under ~65.
  return full.length <= 48 ? full : short.length <= 50 ? short : base;
}

/** Meta description: the answer first, under 155 characters. */
export function seoDescription(item: MenuItem): string {
  const fit = (s: string) => (s.length <= 155 ? s : `${s.slice(0, 152).replace(/[\s,;—-]+\S*$/, '')}…`);
  if (isBuildYourOwn(item)) {
    const large = sizeOf(item, 'Large')!;
    const tops = impliedToppingPrices();
    const perTopping = tops.find((t) => t.size === 'Large')?.price;
    return fit(
      `${BRAND.name} ${displayName(item).toLowerCase()}: a large is ${money(large.price)}` +
        (perTopping ? ` plus about ${money(perTopping)} per topping` : '') +
        (specialtyVersusBuild(item).length
          ? `. Prices by size, build-your-own vs specialty, crusts compared and calories.`
          : `. Prices by size, topping costs, crusts compared and calories.`),
    );
  }
  if (isPizza(item)) {
    const large = sizeOf(item, 'Large')!;
    const smallest = item.sizes[0];
    const biggest = item.sizes[item.sizes.length - 1];
    return fit(
      `${BRAND.name} ${displayName(item).toLowerCase()} costs ${money(smallest.price)}–${money(biggest.price)}; ` +
        `a large is ${money(large.price)}. Prices by size, slices, calories, allergens and the cheapest way to order.`,
    );
  }
  const low = Math.min(...item.sizes.map((s) => s.price));
  const high = Math.max(...item.sizes.map((s) => s.price));
  const range = low === high ? money(low) : `${money(low)}–${money(high)}`;
  return fit(
    `${BRAND.name} ${displayName(item).toLowerCase()} costs about ${range}. Sizes, calories, ingredients, allergens and the cheapest way to order it.`,
  );
}

/* ------------------------------------------------------- build your own */

const byId = (slug: string) => menuItems.find((m) => m.slug === slug);

/**
 * The implied price of one topping, per size: pepperoni minus cheese. Both are
 * the same pizza apart from one topping, so the gap is what a topping costs in
 * our sample. Returns null for a size if either price is missing.
 */
export function impliedToppingPrices(): { size: string; price: number }[] {
  const cheese = byId('classic-cheese-pizza');
  const pepperoni = byId('pepperoni-pizza');
  if (!cheese || !pepperoni) return [];
  return PIZZA_SIZES.flatMap((size) => {
    const c = sizeOf(cheese, size);
    const p = sizeOf(pepperoni, size);
    return c && p ? [{ size, price: Math.round((p.price - c.price) * 100) / 100 }] : [];
  });
}

export function isBuildYourOwn(item: MenuItem): boolean {
  return item.category === 'Build Your Own' && isPizza(item);
}

/** Price of this base with 0–5 toppings, per size, at the implied topping price. */
export function toppingLadder(item: MenuItem) {
  if (!isBuildYourOwn(item)) return [];
  const topping = new Map(impliedToppingPrices().map((t) => [t.size, t.price]));
  return item.sizes
    .filter((s) => topping.has(s.name))
    .map((s) => ({
      size: s.name,
      prices: [0, 1, 2, 3, 4, 5].map((n) => Math.round((s.price + n * topping.get(s.name)!) * 100) / 100),
    }));
}

/**
 * Each specialty pizza against building the same toppings yourself on this
 * base, large size. Only meaningful when this base costs the same as the
 * hand-tossed cheese pizza the specialties are built on.
 */
export function specialtyVersusBuild(item: MenuItem) {
  if (!isBuildYourOwn(item)) return [];
  const cheese = byId('classic-cheese-pizza');
  const base = sizeOf(item, 'Large');
  const toppingLarge = impliedToppingPrices().find((t) => t.size === 'Large')?.price;
  if (!cheese || !base || !toppingLarge || base.price !== sizeOf(cheese, 'Large')?.price) return [];

  return menuItems
    .filter((m) => m.category === 'Specialty Pizza' && !['classic-cheese-pizza', 'pepperoni-pizza'].includes(m.slug))
    .flatMap((m) => {
      const large = sizeOf(m, 'Large');
      if (!large) return [];
      // Ingredients are listed dough, sauce, cheese, then toppings.
      const toppings = m.ingredients.slice(3);
      const built = Math.round((base.price + toppings.length * toppingLarge) * 100) / 100;
      return [
        {
          slug: m.slug,
          title: m.title,
          toppings,
          specialty: large.price,
          built,
          difference: Math.round((built - large.price) * 100) / 100,
        },
      ];
    })
    .sort((a, b) => b.difference - a.difference);
}

/** Hand tossed vs thin vs pan, side by side. */
export function crustComparison() {
  return menuItems.filter(isBuildYourOwn).map((m) => ({
    slug: m.slug,
    name: displayName(m),
    large: sizeOf(m, 'Large')!.price,
    smallest: m.sizes[0].price,
    calories: m.calories,
    sizes: m.sizes.map((s) => s.name),
    slicesLarge: sizeOf(m, 'Large')?.slices,
  }));
}

/** Extra FAQs for build-your-own pages, from the numbers above. */
export function buildYourOwnFaqs(item: MenuItem): Faq[] {
  if (!isBuildYourOwn(item)) return [];
  const tops = impliedToppingPrices();
  const flat = tops.length > 0 && tops.every((t) => t.price === tops[0].price);
  const ladder = toppingLadder(item).find((l) => l.size === 'Large');
  const versus = specialtyVersusBuild(item);
  const cheaperSpecialties = versus.filter((v) => v.difference > 0);
  const faqs: Faq[] = [];

  if (tops.length) {
    faqs.push({
      question: `How much does a topping cost at ${BRAND.name}?`,
      answer: flat
        ? `About ${money(tops[0].price)} per topping in our sample, at every size — that is the gap between a cheese and a pepperoni pizza of the same size. Premium toppings such as chicken or extra cheese can cost more, and some stores charge more per topping on bigger pizzas, so watch the total as you add them.`
        : `In our sample: ${tops.map((t) => `${t.size.toLowerCase()} ${money(t.price)}`).join(', ')} per topping. Premium toppings can cost more.`,
    });
  }
  if (ladder) {
    faqs.push({
      question: `How much is a large build-your-own ${displayName(item).toLowerCase()} with toppings?`,
      answer: `About ${money(ladder.prices[0])} with no toppings, ${money(ladder.prices[1])} with one, ${money(ladder.prices[2])} with two and ${money(ladder.prices[3])} with three, in our store sample. Inside a deal the topping count often stops mattering — a carryout large is a flat price with any toppings.`,
    });
  }
  if (versus.length) {
    faqs.push({
      question: `Is it cheaper to build your own pizza or order a specialty pizza at ${BRAND.name}?`,
      answer: cheaperSpecialties.length
        ? `For pizzas with four or more toppings, the specialty is usually cheaper. In our sample, building the ${cheaperSpecialties[0].title.toLowerCase()}'s ${cheaperSpecialties[0].toppings.length} toppings yourself costs ${money(cheaperSpecialties[0].built)} on a large, against ${money(cheaperSpecialties[0].specialty)} for the specialty. With two or three toppings, building your own usually wins.`
        : 'With two or three toppings, building your own is usually cheaper; past that, check the specialty section before checking out.',
    });
  }
  return faqs;
}

export { PIZZA_SIZES, DIAMETER, SLICES_PER_ADULT };
