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
 * deal lets you choose (Mix & Match), the basket uses an item
 * people commonly pick, and the note says so.
 */
const BASKETS: DealBasket[] = [
  {
    couponId: 'cpn-carryout-deal',
    dealPrice: 7.99,
    basket: [{ slug: 'classic-cheese-pizza', size: 'Large' }],
    feeds: 3,
    note: 'Compared with a large cheese pizza before the included topping, so the real saving is a little higher. On an 8-piece wings order ($10.99) the same deal saves $3.00. Carryout also removes the delivery fee and tip, which is not counted here.',
  },
  {
    couponId: 'cpn-mix-match',
    dealPrice: 6.99 * 2,
    basket: [
      { slug: 'chicken-alfredo-pasta', size: 'Chicken Alfredo' },
      { slug: 'oven-baked-sandwiches', size: 'Italian' },
    ],
    feeds: 2,
  },
  {
    couponId: 'cpn-perfect-combo',
    dealPrice: 19.99,
    basket: [
      { slug: 'classic-cheese-pizza', size: 'Medium', qty: 2 },
      { slug: 'bread-bites', size: 'Parmesan' },
    ],
    feeds: 4,
    note: 'Leaves out the Cinnamon Twists and the toppings, which we have not priced, so the real saving is higher. The medium price is our estimate.',
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
  lines: { title: string; size: string; qty: number; price: number; slug: string; verified: boolean }[];
  /** True when every menu price in the basket was checked (the deal price is always an estimate). */
  menuVerified: boolean;
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
      return [{ title: item.title, size: line.size, qty, price: size.price * qty, slug: item.slug, verified: Boolean(size.verified) }];
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
        menuVerified: lines.every((l) => l.verified),
        note: b.note,
      },
    ];
  });
}
