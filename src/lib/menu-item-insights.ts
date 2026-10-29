/**
 * Computed facts for a single menu item page — the quick answer, the cheapest
 * way to buy it, how many to order, where it ranks on price, and the
 * question-shaped FAQs built from those numbers.
 *
 * Everything is derived from menu-items.json and coupons.ts so the item
 * pages stay consistent with the price tables elsewhere on the site.
 */
import { coupons } from '@/data/coupons';
import type { Faq, MenuItem } from '@/data/types';
import { BRAND, CURRENCY_SYMBOL } from './site-config';
import { menuItems } from './content';
import { priceBasis } from './price-source';

export const money = (n: number) => `${CURRENCY_SYMBOL}${n.toFixed(2)}`;

const PIZZA_SIZES = ['Small', 'Medium', 'Large', 'Extra Large'] as const;
const DIAMETER: Record<string, number> = { Small: 10, Medium: 12, Large: 14, 'Extra Large': 16 };

/** Slices per adult when pizza is the whole meal — the planning rule used site-wide. */
const SLICES_PER_ADULT = 3;

export function isPizza(item: MenuItem): boolean {
  return (
    (item.category === 'Specialty Pizza' || item.category === 'Build Your Own') &&
    item.sizes.some((s) => DIAMETER[s.name])
  );
}

/**
 * The size a pizza page leads with: the large where there is one, otherwise
 * the biggest size offered (Handmade Pan only comes as a medium).
 */
export function refSize(item: MenuItem) {
  return (
    item.sizes.find((s) => s.name === 'Large') ??
    [...item.sizes].filter((s) => DIAMETER[s.name]).sort((a, b) => DIAMETER[b.name] - DIAMETER[a.name])[0] ??
    item.sizes[0]
  );
}

/** True when every option of an item shares one price (wing flavours, soda flavours). */
export function singlePrice(item: MenuItem): boolean {
  return item.sizes.every((s) => s.price === item.sizes[0].price && Boolean(s.verified) === Boolean(item.sizes[0].verified));
}

/** Search-friendly name for headings and prose; falls back to the menu title. */
export function displayName(item: MenuItem): string {
  return item.seoName ?? item.title;
}

/**
 * The name as it reads mid-sentence. Named specialty pizzas are proper nouns
 * ("ExtravaganZZa", "Pacific Veggie") and keep their spelling; generic items
 * ("cheese pizza", "8-piece wings") are lower-cased.
 */
export function proseName(item: MenuItem): string {
  const n = displayName(item);
  return item.category === 'Specialty Pizza' && item.slug !== 'pepperoni-pizza' ? n : n.toLowerCase();
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
    const ref = refSize(item);
    const others = item.sizes.filter((s) => s !== ref && DIAMETER[s.name]);
    const route = cheapestRoute(item);
    const label = `${ref.name.toLowerCase()} ${proseName(item)} (${DIAMETER[ref.name]} inch${ref.slices ? `, ${ref.slices} slices` : ''})`;
    const lead = ref.verified
      ? `A ${label} is ${money(ref.price)} at ${BRAND.name} ${priceBasis(true)}, before tax.`
      : `A ${label} is about ${money(ref.price)} at ${BRAND.name} ${priceBasis(false)}.`;
    const range = others.length
      ? ` ${others.every((o) => !o.verified) ? 'Our estimates for the other sizes' : 'Other sizes'}: ${others
          .map((o) => `${money(o.price)} for a ${DIAMETER[o.name]}-inch ${o.name.toLowerCase()}`)
          .join(', ')}.`
      : '';
    const deal = route ? ` A flat-rate carryout deal, where your store runs one, is about ${money(route.dealPrice)} by our estimate.` : '';
    return lead + range + deal;
  }
  const plural = isPlural(item);
  const v = item.sizes.every((s) => s.verified);
  const basis = priceBasis(v);
  if (singlePrice(item)) {
    const options = item.sizes.length > 1 ? ` — any of the ${item.sizes.length} options (${item.sizes.map((s) => s.name).join(', ')})` : ` (${lowerFirst(item.sizes[0].detail)})`;
    return `${item.title} ${plural ? 'are' : 'is'} ${v ? '' : 'about '}${money(low)} at ${BRAND.name} ${basis}${options}.`;
  }
  const sizes = item.sizes.map((s) => `${s.name.toLowerCase()} ${money(s.price)}`).join(', ');
  return `${item.title} ${plural ? 'cost' : 'costs'} ${v ? '' : 'about '}${money(low)} to ${money(high)} at ${BRAND.name} ${basis} — ${sizes}.`;
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

  if (isPizza(item) && sizeOf(item, 'Large')) {
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
  const large = isPizza(item) ? refSize(item) : undefined;
  if (!large?.slices) return [];
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
    .filter((p) => isPizza(p) && sizeOf(p, 'Large'))
    .map((p) => {
      const l = sizeOf(p, 'Large')!;
      return { slug: p.slug, title: displayName(p), large: l.price, verified: Boolean(l.verified), current: p.slug === item.slug };
    })
    .sort((a, b) => a.large - b.large || a.title.localeCompare(b.title));
}

/** Question-shaped FAQs for the head queries, generated from the item's numbers. */
export function generatedFaqs(item: MenuItem): Faq[] {
  const name = proseName(item);
  const faqs: Faq[] = [];
  const route = cheapestRoute(item);

  if (isPizza(item)) {
    const ref = refSize(item);
    const whole = wholeLargeCalories(item);
    faqs.push({
      question: `How much is a ${ref.name.toLowerCase()} ${name} at ${BRAND.name}?`,
      answer: `${ref.verified ? '' : 'About '}${money(ref.price)} at menu price for a ${DIAMETER[ref.name]}-inch ${ref.name.toLowerCase()}, ${priceBasis(ref.verified)}. ${
        route
          ? `A flat-rate carryout deal, where your store runs one, is about ${money(route.dealPrice)} by our estimate.`
          : ''
      } Franchise stores set their own prices, so confirm the total at checkout.`.replace(/\s+/g, ' '),
    });
    // Square-cut pizzas have no slice count in the data — skip rather than guess.
    if (item.sizes.some((s) => s.slices)) {
      faqs.push({
        question: `How many slices are in a ${BRAND.name} ${name}?`,
        answer: item.sizes
          .filter((s) => s.slices)
          .map((s) => `${s.name}: ${s.slices} slices`)
          .join('; ')
          .concat(`. At three slices per adult, a ${refSize(item).name.toLowerCase()} feeds two to three people as a meal.`),
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
        route ? `On the ${route.dealLabel}, where a store offers it, ${plural ? 'they are' : 'it is'} about ${money(route.dealPrice)} by our estimate.` : ''
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
    const ref = refSize(item);
    const tops = impliedToppingPrices();
    const perTopping = tops.find((t) => t.size === ref.name)?.price;
    return fit(
      `${BRAND.name} ${proseName(item)}: a ${ref.name.toLowerCase()} is ${money(ref.price)}${ref.verified ? ' (checked)' : ' (est.)'}` +
        (perTopping ? ` plus about ${money(perTopping)} per topping` : '') +
        (specialtyVersusBuild(item).length
          ? `. Prices by size, build-your-own vs specialty, crusts compared and calories.`
          : `. Prices by size, topping costs, crusts compared and calories.`),
    );
  }
  if (isPizza(item)) {
    const ref = refSize(item);
    return fit(
      `${BRAND.name} ${proseName(item)} price: a ${ref.name.toLowerCase()} is ${money(ref.price)}` +
        `${ref.verified ? ' (checked at a Columbus, Ohio store)' : ' by our estimate'}. Sizes, calories, toppings and the cheapest way to order.`,
    );
  }
  const low = Math.min(...item.sizes.map((s) => s.price));
  const high = Math.max(...item.sizes.map((s) => s.price));
  const range = low === high ? money(low) : `${money(low)}–${money(high)}`;
  const checked = item.sizes.every((s) => s.verified);
  const verb = isPlural(item) ? 'cost' : 'costs';
  return fit(
    `${BRAND.name} ${proseName(item)} ${verb} ${checked ? '' : 'about '}${range}${checked ? ' (checked at a Columbus, Ohio store)' : ''}. Options, calories, allergens and the cheapest way to order.`,
  );
}

/* ------------------------------------------------------- build your own */

const byId = (slug: string) => menuItems.find((m) => m.slug === slug);

/**
 * The implied price of one topping, per size: pepperoni minus cheese. Both are
 * the same pizza apart from one topping, so the gap is what a topping costs in
 * these prices. Returns null for a size if either price is missing.
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
    .filter((m) => m.category === 'Specialty Pizza' && m.slug !== 'pepperoni-pizza')
    .flatMap((m) => {
      const large = sizeOf(m, 'Large');
      if (!large) return [];
      // Ingredients are listed dough, sauce, cheese, then toppings; seasonings are not charged as toppings.
      const toppings = m.ingredients.slice(3).filter((t) => !/seasoning|sauce/i.test(t));
      const built = Math.round((base.price + toppings.length * toppingLarge) * 100) / 100;
      return [
        {
          slug: m.slug,
          title: m.title,
          toppings,
          specialty: large.price,
          specialtyVerified: Boolean(large.verified),
          built,
          difference: Math.round((built - large.price) * 100) / 100,
        },
      ];
    })
    .sort((a, b) => b.difference - a.difference);
}

/** Hand tossed vs thin vs pan, side by side. */
export function crustComparison() {
  return menuItems.filter((m) => isBuildYourOwn(m) && m.slug !== 'classic-cheese-pizza').map((m) => ({
    slug: m.slug,
    name: displayName(m),
    refName: refSize(m).name,
    large: refSize(m).price,
    largeVerified: Boolean(refSize(m).verified),
    smallest: m.sizes[0].price,
    calories: m.calories,
    sizes: m.sizes.map((s) => s.name),
    slicesLarge: refSize(m).slices,
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
        ? `We have not checked the topping charge yet; our estimate is about ${money(tops[0].price)} per topping. Premium toppings such as chicken, steak or extra cheese can cost more, and some stores charge more per topping on bigger pizzas, so watch the total as you add them.`
        : `We have not checked the topping charge yet. Our estimates: ${tops.map((t) => `${t.size.toLowerCase()} ${money(t.price)}`).join(', ')} per topping. Premium toppings can cost more.`,
    });
  }
  if (ladder) {
    faqs.push({
      question: `How much is a large build-your-own ${proseName(item)} with toppings?`,
      answer: `${money(ladder.prices[0])} with no toppings${refSize(item).verified ? ` (checked at ${'a Columbus, Ohio store'})` : ''}; with our estimated topping charge, about ${money(ladder.prices[1])} with one, ${money(ladder.prices[2])} with two and ${money(ladder.prices[3])} with three. Inside a deal the topping count often stops mattering — a carryout large is a flat price with any toppings.`,
    });
  }
  if (versus.length) {
    faqs.push({
      question: `Is it cheaper to build your own pizza or order a specialty pizza at ${BRAND.name}?`,
      answer: cheaperSpecialties.length
        ? `For pizzas with four or more toppings, the specialty is usually cheaper. Every large specialty pizza we checked was ${money(cheaperSpecialties[0].specialty)}; adding the ${cheaperSpecialties[0].title}’s ${cheaperSpecialties[0].toppings.length} toppings to a cheese pizza yourself would come to about ${money(cheaperSpecialties[0].built)} with our estimated topping charge. With two or three toppings, building your own usually wins.`
        : 'With two or three toppings, building your own is usually cheaper; past that, check the specialty section before checking out.',
    });
  }
  return faqs;
}

/* ------------------------------------------------- sides, chicken & extras */

/** "8 pieces", "16 pieces with icing dip", "3 cakes" → 8 / 16 / 3. */
export function piecesOf(detail: string): { count: number; unit: string } | null {
  const m = detail.match(/(\d+)\s+(sticks|pieces|wings|twists|cakes)\b/i);
  return m ? { count: Number(m[1]), unit: m[2].toLowerCase() } : null;
}

export function perPieceRows(item: MenuItem) {
  if (isPizza(item)) return [];
  const rows = item.sizes.flatMap((s) => {
    const p = piecesOf(s.detail);
    return p
      ? [{ size: s.name, pieces: p.count, unit: p.unit, price: s.price, verified: Boolean(s.verified), perPiece: s.price / p.count }]
      : [];
  });
  // Flavours that share a count and price (four wing sauces at one price) are one row.
  const unique = rows.filter((r, i) => rows.findIndex((x) => x.pieces === r.pieces && x.price === r.price) === i);
  return unique.map((r) =>
    rows.filter((x) => x.pieces === r.pieces && x.price === r.price).length > 1 ? { ...r, size: 'Any flavour' } : r,
  );
}

/**
 * How much of this item each person needs, as a side alongside pizza (or as a
 * main for pasta and subs). Matches the planning rules on the drinks & sides
 * page: four bread bites and four wings each.
 */
const SERVING_RULE: Record<string, { perPerson: number; unit: string; basis: string }> = {
  'bread-bites': { perPerson: 4, unit: 'pieces', basis: 'four bread bites each alongside pizza' },
  'cinnamon-bread-bites': { perPerson: 4, unit: 'pieces', basis: 'four pieces each for dessert' },
  'chicken-wings': { perPerson: 4, unit: 'wings', basis: 'four wings each as a side' },
  'loaded-chicken': { perPerson: 4, unit: 'pieces', basis: 'four pieces each as a side' },
};

/** Cheapest mix of sizes that covers each group size. */
export function sidesPlan(item: MenuItem) {
  const rule = SERVING_RULE[item.slug];
  if (!rule) return [];
  const all = item.sizes.flatMap((s) => {
    const p = piecesOf(s.detail);
    return p ? [{ name: `${p.count}-piece order`, pieces: p.count, price: s.price }] : [];
  });
  const packs = all.filter((p, i) => all.findIndex((x) => x.pieces === p.pieces) === i);
  if (!packs.length) return [];
  return [2, 4, 6, 8, 10, 12].map((people) => {
    const need = people * rule.perPerson;
    // Small search: try every count of the biggest pack, fill with the rest.
    let best: { price: number; pieces: number; combo: string } | null = null;
    const sorted = [...packs].sort((a, b) => b.pieces - a.pieces);
    const big = sorted[0];
    const small = sorted[sorted.length - 1];
    for (let nBig = 0; nBig <= Math.ceil(need / big.pieces); nBig++) {
      const rest = Math.max(0, need - nBig * big.pieces);
      const nSmall = sorted.length > 1 ? Math.ceil(rest / small.pieces) : 0;
      if (sorted.length === 1 && rest > 0) continue;
      const price = Math.round((nBig * big.price + nSmall * small.price) * 100) / 100;
      const pieces = nBig * big.pieces + nSmall * small.pieces;
      const combo = [
        nBig ? `${nBig} × ${big.name.toLowerCase()}` : '',
        nSmall ? `${nSmall} × ${small.name.toLowerCase()}` : '',
      ]
        .filter(Boolean)
        .join(' + ');
      if (!best || price < best.price || (price === best.price && pieces < best.pieces)) {
        best = { price, pieces, combo };
      }
    }
    return { people, need, ...best!, unit: rule.unit };
  });
}

export function servingBasis(item: MenuItem): string | null {
  return SERVING_RULE[item.slug]?.basis ?? null;
}

/** Other items in the same section of the menu, cheapest first. */
export function categoryPeers(item: MenuItem) {
  if (isPizza(item)) return [];
  return menuItems
    .filter((m) => m.category === item.category)
    .map((m) => {
      const first = m.sizes[0];
      const p = piecesOf(first.detail);
      return {
        slug: m.slug,
        title: m.title,
        from: Math.min(...m.sizes.map((s) => s.price)),
        detail: first.detail,
        perPiece: p ? first.price / p.count : null,
        unit: p?.unit ?? null,
        calories: m.calories,
        caloriesNote: m.caloriesNote,
        current: m.slug === item.slug,
      };
    })
    .sort((a, b) => a.from - b.from);
}

/** Extra FAQs for sides, chicken and desserts sold by the piece. */
export function pieceFaqs(item: MenuItem): Faq[] {
  const rows = perPieceRows(item);
  if (!rows.length) return [];
  const name = proseName(item);
  const plural = isPlural(item);
  const faqs: Faq[] = [
    {
      question: `How many ${rows[0].unit} come in ${BRAND.name} ${name}?`,
      answer: `${rows.map((r) => `${r.size === 'Any flavour' ? 'Any flavour' : r.size}: ${r.pieces} ${r.unit} for ${r.verified ? '' : 'about '}${money(r.price)}`).join('; ')}, ${priceBasis(rows.every((r) => r.verified))}, before tax.`,
    },
  ];
  if (rows.length > 1) {
    const [a, b] = [rows[0], rows[rows.length - 1]];
    const cheaper = Math.round((1 - b.perPiece / a.perPiece) * 100);
    faqs.push({
      question: `Is a large order of ${BRAND.name} ${name} worth it?`,
      answer: `Per piece, yes: about ${money(b.perPiece)} each in the ${b.size.toLowerCase()} against ${money(a.perPiece)} in the ${a.size.toLowerCase()} — roughly ${cheaper}% cheaper. It only pays off if ${plural ? 'they' : 'it'} will actually get eaten; ${b.pieces} ${b.unit} is a lot for two people.`,
    });
  }
  return faqs;
}

export { PIZZA_SIZES, DIAMETER, SLICES_PER_ADULT };
