import type { Coupon } from './types';

/**
 * ILLUSTRATIVE DEALS ONLY.
 *
 * These entries describe the *shapes* of offers that pizza chains run so
 * readers know what to look for. The codes are placeholders written by us —
 * they are not live promotional codes and are labelled as examples everywhere
 * they are displayed. Always check the official site or app for what is
 * actually running today.
 */
export const coupons: Coupon[] = [
  {
    id: 'cpn-mix-match',
    discount: '$6.99 each',
    title: 'Mix & Match: pick any two menu items',
    desc:
      'The workhorse deal of the pizza world. Choose two or more qualifying items — a medium two-topping pizza, a pasta, a sandwich, a side — and each one drops to a flat price instead of its normal menu price.',
    code: 'EXAMPLE-MIX2',
    expiry: 'Ongoing offer type',
    tags: ['bundle', 'best value', 'family'],
    featured: true,
    howTo:
      'Add two or more qualifying items to your basket and the discount applies automatically at checkout. If it does not, one of your items is outside the qualifying list — swap it and watch the total update.',
    type: 'Bundle',
  },
  {
    id: 'cpn-carryout-deal',
    discount: '$7.99',
    title: 'Carryout large pizza, any toppings',
    desc:
      'A flat price on a large pizza when you collect it yourself. Because there is no driver, no delivery fee and no tip involved, this is almost always the cheapest way to buy a single large pizza.',
    code: 'EXAMPLE-CARRY8',
    expiry: 'Ongoing offer type',
    tags: ['carryout', 'single pizza', 'cheapest'],
    featured: true,
    howTo:
      'Select carryout before you build your order, not after. Some sites keep you in delivery mode and the carryout-only price never appears.',
    type: 'Carryout',
  },
  {
    id: 'cpn-large-3-topping',
    discount: '$9.99',
    title: 'Large three-topping pizza, delivery included',
    desc:
      'A middle-ground offer for people who want delivery but not a full bundle. You get a large pizza with up to three toppings at a fixed price; fees and tip are still added on top.',
    code: 'EXAMPLE-LG3TOP',
    expiry: 'Ongoing offer type',
    tags: ['delivery', 'single pizza'],
    howTo:
      'Build the pizza from the deal tile rather than the main menu. Starting from the menu often charges per-topping rates the deal would have covered.',
    type: 'Delivery',
  },
  {
    id: 'cpn-family-bundle',
    discount: '$29.99',
    title: 'Family bundle: two large pizzas plus two sides',
    desc:
      'Aimed at four to six people. Two large pizzas, a bread side and a two-litre drink for one price. Works out cheapest per head when everyone will actually eat two or three slices.',
    code: 'EXAMPLE-FAM30',
    expiry: 'Ongoing offer type',
    tags: ['family', 'bundle', 'group'],
    featured: true,
    howTo:
      'Check whether specialty pizzas cost extra inside the bundle. On most bundles they carry a surcharge of a dollar or two per pizza.',
    type: 'Bundle',
  },
  {
    id: 'cpn-loyalty-free',
    discount: 'Free pizza',
    title: 'Loyalty points: six qualifying orders, one free pizza',
    desc:
      'Rewards schemes at pizza chains typically hand out points per qualifying order rather than per dollar spent. Hit the threshold and you redeem for a free medium pizza.',
    code: 'No code — sign in to your account',
    expiry: 'Ongoing programme',
    tags: ['rewards', 'loyalty', 'free'],
    howTo:
      'Order while signed in every single time, including carryout. Points do not attach to guest checkouts, and most schemes will not add them retroactively.',
    type: 'Loyalty',
  },
  {
    id: 'cpn-weekday-lunch',
    discount: '20% off',
    title: 'Weekday lunch discount, order before 3pm',
    desc:
      'Percentage-off offers that run in the quiet part of the day. Because they are percentage based rather than flat, they get better the larger your order is.',
    code: 'EXAMPLE-LUNCH20',
    expiry: 'Weekdays, typically 11am–3pm',
    tags: ['lunch', 'percentage', 'weekday'],
    howTo:
      'The clock that matters is order placement, not delivery. Placing at 2:55pm normally still qualifies even if the food arrives at 3:20pm.',
    type: 'National',
  },
  {
    id: 'cpn-online-only',
    discount: '25% off',
    title: 'Online-only discount on menu-priced items',
    desc:
      'Chains push people to their own apps and websites because it is cheaper than taking a phone order. The reward is a percentage off items bought at full menu price.',
    code: 'EXAMPLE-WEB25',
    expiry: 'Ongoing offer type',
    tags: ['online', 'percentage', 'app'],
    howTo:
      'These almost never stack with a bundle. Price your basket both ways — bundle price versus menu price minus the percentage — and keep the cheaper one.',
    type: 'National',
  },
  {
    id: 'cpn-sides-addon',
    discount: '$5.99 add-on',
    title: 'Discounted side when you buy a pizza',
    desc:
      'An add-on rate on breadsticks, wings or a dessert once a pizza is already in the basket. Cheaper than the standalone side, more expensive than skipping it.',
    code: 'EXAMPLE-SIDE6',
    expiry: 'Ongoing offer type',
    tags: ['sides', 'add-on'],
    howTo:
      'Add the pizza first. The add-on price usually only unlocks once the basket contains a qualifying main item.',
    type: 'Bundle',
  },
  {
    id: 'cpn-new-customer',
    discount: '$5 off first order',
    title: 'First-order discount for new accounts',
    desc:
      'A one-time discount for creating an account. Small, but it applies on top of a normal menu price and takes about ninety seconds to claim.',
    code: 'EXAMPLE-NEW5',
    expiry: 'One use per new account',
    tags: ['new customer', 'first order'],
    howTo:
      'Create the account before you build the basket. Signing in halfway through checkout sometimes clears the basket and loses the offer.',
    type: 'National',
  },
  {
    id: 'cpn-late-night',
    discount: '$8.99',
    title: 'Late-night pizza and side combo',
    desc:
      'Runs at the end of trading, usually after 9pm, at stores that stay open late. Designed to keep the kitchen busy during the slow hours before close.',
    code: 'EXAMPLE-LATE9',
    expiry: 'Late evening, participating stores',
    tags: ['late night', 'combo'],
    howTo:
      'Availability is store-by-store, not national. If it is not showing on your store page, the store near you is not running it.',
    type: 'National',
  },
  {
    id: 'cpn-student',
    discount: '15% off',
    title: 'Student discount with verified account',
    desc:
      'Verified student pricing through a third-party verification service. Stacks poorly with bundles but works well on a normal menu-priced order.',
    code: 'EXAMPLE-STUDENT15',
    expiry: 'While enrolment verification is valid',
    tags: ['student', 'percentage'],
    howTo:
      'Verification is separate from your pizza account and can take a day. Do it before the night you actually want to order.',
    type: 'National',
  },
  {
    id: 'cpn-group-order',
    discount: '$49.99',
    title: 'Party pack: four pizzas plus sides',
    desc:
      'Volume pricing for eight to twelve people. The per-person cost is the lowest of any offer on this page, provided you actually have eight to twelve people.',
    code: 'EXAMPLE-PARTY50',
    expiry: 'Ongoing offer type',
    tags: ['group', 'party', 'bundle'],
    howTo:
      'Order large-format bundles at least ninety minutes ahead on a Friday or Saturday. Kitchens sequence big orders around smaller ones during a rush.',
    type: 'Bundle',
  },
];

export function getFeaturedCoupons(): Coupon[] {
  return coupons.filter((c) => c.featured);
}

export const couponTags = Array.from(
  new Set(coupons.flatMap((c) => c.tags)),
).sort();

export const couponTypes = Array.from(new Set(coupons.map((c) => c.type)));
