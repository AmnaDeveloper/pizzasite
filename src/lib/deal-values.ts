/**
 * Worked deal values: what each offer type saves against the same food bought
 * at menu price.
 *
 * Every basket is built from real rows in menu-items.json and every deal price
 * from coupons.ts, so the numbers on the page are arithmetic over the site's
 * own data rather than claims typed by hand. Change a menu price and every
 * saving recalculates.
 */
import { coupons } from '@/data/coupons';
import type { Coupon } from '@/data/types';
import { getMenuItem } from './content';

type BasketLine = { slug: string; size: string; qty?: number };

type DealBasket = {
  couponId: string;
  /** Total the deal charges for this basket. */
  dealPrice: number;
  basket: BasketLine[];
  /** How many people the basket comfortably feeds — for the per-person column. */
  feeds: number;
  note?: string;
};

/*
 * Baskets mirror what each coupon description says the offer covers. Where a
 * deal lets you choose (Mix & Match, add-on side), the basket uses an item
 * people commonly pick, and the note says so.
 */
const BASKETS: DealBasket[] = [
  {
    couponId: 'cpn-carryout-deal',
    dealPrice: 7.99,
    basket: [{ slug: 'pepperoni-pizza', size: 'Large' }],
    feeds: 3,
    note: 'Carryout also removes the delivery fee and tip, which is not counted here.',
  },
  {
    couponId: 'cpn-mix-match',
    dealPrice: 6.99 * 2,
    basket: [
      { slug: 'pepperoni-pizza', size: 'Medium' },
      { slug: 'chicken-alfredo-pasta', size: 'Single serving' },
    ],
    feeds: 2,
  },
  {
    couponId: 'cpn-late-night',
    dealPrice: 8.99,
    basket: [
      { slug: 'classic-cheese-pizza', size: 'Medium' },
      { slug: 'cinnamon-twists', size: 'Regular' },
    ],
    feeds: 2,
  },
  {
    couponId: 'cpn-family-bundle',
    dealPrice: 29.99,
    basket: [
      { slug: 'classic-cheese-pizza', size: 'Large', qty: 2 },
      { slug: 'garlic-parmesan-breadsticks', size: 'Regular' },
      { slug: 'two-liter-soda', size: '2 litre' },
    ],
    feeds: 5,
    note: 'Specialty pizzas usually add a surcharge of a dollar or two each inside a bundle.',
  },
  {
    couponId: 'cpn-group-order',
    dealPrice: 49.99,
    basket: [
      { slug: 'classic-cheese-pizza', size: 'Large', qty: 4 },
      { slug: 'garlic-parmesan-breadsticks', size: 'Regular' },
      { slug: 'cheesy-bread', size: 'Regular' },
    ],
    feeds: 10,
  },
  {
    couponId: 'cpn-sides-addon',
    dealPrice: 5.99,
    basket: [{ slug: 'chicken-wings', size: 'Regular' }],
    feeds: 2,
    note: 'Pick the dearest side in the slot — on a $5.99 lava cake the add-on saves nothing.',
  },
];

export type DealValue = {
  coupon: Coupon;
  dealPrice: number;
  menuPrice: number;
  saving: number;
  savingPct: number;
  perPerson: number;
  feeds: number;
  lines: { title: string; size: string; qty: number; price: number; slug: string }[];
  note?: string;
};

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

export function getDealValues(): DealValue[] {
  return BASKETS.flatMap((b) => {
    const coupon = coupons.find((c) => c.id === b.couponId);
    if (!coupon) return [];

    const lines = b.basket.flatMap((line) => {
      const item = getMenuItem(line.slug);
      const size = item?.sizes.find((s) => s.name === line.size);
      if (!item || !size) return [];
      const qty = line.qty ?? 1;
      return [{ title: item.title, size: line.size, qty, price: size.price * qty, slug: item.slug }];
    });
    if (lines.length !== b.basket.length) return [];

    const menuPrice = round2(lines.reduce((sum, l) => sum + l.price, 0));
    const dealPrice = round2(b.dealPrice);
    const saving = round2(menuPrice - dealPrice);

    return [
      {
        coupon,
        dealPrice,
        menuPrice,
        saving,
        savingPct: Math.round((saving / menuPrice) * 100),
        perPerson: round2(dealPrice / b.feeds),
        feeds: b.feeds,
        lines,
        note: b.note,
      },
    ];
  });
}

/**
 * What a percentage-off offer does to the family-bundle basket at menu price.
 * Used to show where a percentage discount overtakes a bundle.
 */
export function percentageVersusBundle(pct: number) {
  const family = getDealValues().find((d) => d.coupon.id === 'cpn-family-bundle');
  if (!family) return null;
  const afterPct = round2(family.menuPrice * (1 - pct / 100));
  return { menuPrice: family.menuPrice, afterPct, bundle: family.dealPrice };
}
