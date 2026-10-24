/**
 * Every phrase that describes where the prices come from is built here from
 * PRICE_SOURCE, so the site can never claim more than is true. See the note
 * on PRICE_SOURCE in site-config.ts.
 */
import { BRAND, PRICE_SOURCE } from './site-config';
import { formatLongDate } from './utils/date';

export const pricesVerified = PRICE_SOURCE.verified && Boolean(PRICE_SOURCE.store && PRICE_SOURCE.checkedOn);

const checkedOn = () => formatLongDate(PRICE_SOURCE.checkedOn);

/** Ends a price sentence: "…is about $14.99 by our estimate." */
export function priceBasis(): string {
  return pricesVerified ? `at ${PRICE_SOURCE.store} (checked ${checkedOn()})` : 'by our estimate';
}

/** Adjective for labels and table headings: "Estimated price" / "Checked price". */
export const PRICE_ADJ = pricesVerified ? 'Checked' : 'Estimated';

/** One or two sentences explaining the prices, for intros and FAQs. */
export function priceSourceSentence(): string {
  return pricesVerified
    ? `Prices were copied from the menu of ${PRICE_SOURCE.store} on ${checkedOn()}. ${BRAND.name} stores are mostly franchises that set their own prices, so your store may charge a little more or less — confirm the total at checkout.`
    : `Prices on this site are our estimates of typical ${BRAND.name} pricing. They have not been checked against a particular store, and ${BRAND.name} stores are mostly franchises that set their own prices — so treat them as a guide for comparing items, and confirm the real total at checkout.`;
}

/** The short caveat shown next to price tables (PriceNote). */
export function priceNoteText(): string {
  return pricesVerified
    ? `Prices checked at ${PRICE_SOURCE.store} on ${checkedOn()}. Your store may differ — confirm at checkout.`
    : 'Estimated prices, not checked against a store. Your store’s prices will differ — confirm at checkout.';
}
