import type { Coupon } from './types';

/**
 * The Domino's US deals we could confirm, as of November 2026.
 *
 * Source: the wording on Domino's own deals page (seen through search
 * results) plus two regularly updated deal roundups — The Krazy Coupon Lady
 * (updated 1 Nov 2026) and EatDrinkDeals (9 Oct 2026). Deal prices were NOT
 * tested at a checkout, so the page labels them as reported prices.
 *
 * Only add a deal here when it can be confirmed the same way. This file used to
 * hold "illustrative" deal shapes (family bundles, party packs, student and
 * lunch discounts) that Domino's US does not run; on a page titled "Domino's
 * coupons" that read as fact and was removed on 9 Nov 2026.
 */
export const coupons: Coupon[] = [
  {
    id: 'cpn-carryout-deal',
    bestFor: 'One or two people who can pick up',
    discount: '$7.99',
    title: 'Carryout deal: large 1-topping pizza or 8-piece wings',
    desc:
      'A flat $7.99 at participating stores for a large 1-topping pizza, an 8-piece order of wings or boneless chicken, among the reported choices. Carryout only, and some stores charge more. Extra toppings cost extra. With no driver there is also no delivery fee and no tip.',
    expiry: 'Reported as running in November 2026',
    tags: ['carryout', 'single pizza', 'wings'],
    featured: true,
    howTo:
      'Choose carryout before you build the order — carryout-only prices do not show in delivery mode. Domino’s fine print says you may need to ask for the offer.',
    type: 'Carryout',
  },
  {
    id: 'cpn-mix-match',
    bestFor: 'Two people who want different things',
    discount: '$6.99 each',
    title: 'Mix & Match: two or more items at $6.99 each',
    desc:
      'Pick two or more items from the qualifying list — a medium 2-topping pizza, pasta, an oven-baked sandwich, Stuffed Cheesy Bread and more — and each one costs $6.99. Some locations charge more. Reported to work for delivery and carryout at participating stores.',
    expiry: 'Reported as running in November 2026',
    tags: ['bundle', 'two items', 'delivery'],
    featured: true,
    howTo:
      'Add two or more qualifying items and the price applies in the basket. If it does not, one item is outside the qualifying list — swap it and watch the total.',
    type: 'Bundle',
  },
  {
    id: 'cpn-perfect-combo',
    bestFor: 'Three or four people',
    discount: '$19.99',
    title: 'Perfect Combo: two medium pizzas, bread bites and twists',
    desc:
      'Two medium 1-topping pizzas, 16-piece Parmesan Bread Bites and an 8-piece order of Cinnamon Twists for $19.99. Sources differ on whether a 2-liter drink is included, so check the tile at your store.',
    expiry: 'Reported as running in November 2026',
    tags: ['bundle', 'group', 'family'],
    featured: true,
    howTo:
      'Start from the deal tile, not the menu, so the bundle price applies. Check whether your store adds a charge for extra toppings or a specialty crust.',
    type: 'Bundle',
  },
  {
    id: 'cpn-loyalty-free',
    bestFor: 'Anyone who orders every few weeks',
    discount: 'Free pizza',
    title: 'Domino’s Rewards: points toward a free medium pizza',
    desc:
      'Signed-in orders of $5 or more earn 10 points; 60 points can be redeemed for a free medium 2-topping pizza, so roughly every sixth order. Smaller rewards unlock at lower point totals.',
    expiry: 'Ongoing program',
    tags: ['rewards', 'loyalty', 'free'],
    featured: true,
    howTo:
      'Sign in before you order, carryout included. Guest orders do not earn points.',
    type: 'Loyalty',
  },
];

export function getFeaturedCoupons(): Coupon[] {
  return coupons.filter((c) => c.featured);
}

export const couponTags = Array.from(
  new Set(coupons.flatMap((c) => c.tags)),
).sort();

export const couponTypes = Array.from(new Set(coupons.map((c) => c.type)));
