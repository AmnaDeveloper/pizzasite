/**
 * Every phrase that describes where a price comes from is built here, so the
 * site never claims more than is true. A price is "checked" only when its size
 * has `verified: true` in menu-items.json (copied from PRICE_SOURCE.store on
 * PRICE_SOURCE.checkedOn); everything else is an estimate.
 */
import { BRAND, PRICE_SOURCE } from './site-config';
import { formatLongDate } from './utils/date';

export const checkedDate = formatLongDate(PRICE_SOURCE.checkedOn);

/** Ends a price sentence: "…is $13.99 at Domino's in our check of a Columbus, Ohio store on October 25, 2026." */
export function priceBasis(verified = false): string {
  return verified ? `in our check of ${PRICE_SOURCE.storeShort} on ${checkedDate}` : 'by our estimate';
}

/** Short label next to a price. */
export function priceLabel(verified = false): string {
  return verified ? 'checked' : 'est.';
}

/** One or two sentences explaining the prices, for intros and FAQs. */
export function priceSourceSentence(): string {
  return `Prices marked “checked” were copied from the carryout menu of ${PRICE_SOURCE.store} on ${checkedDate}, before tax. Prices marked “est.” are our estimates for sizes and items we have not checked yet. ${BRAND.name} stores are mostly franchises that set their own prices, so your store may differ — confirm the total at checkout.`;
}

/** The short caveat shown next to price tables (PriceNote). */
export function priceNoteText(): string {
  return `“Checked” prices: ${PRICE_SOURCE.store}, ${checkedDate}, before tax. “Est.” prices are estimates. Your store may differ — confirm at checkout.`;
}

/** Kept for labels that describe a whole table of mixed prices. */
export const PRICE_ADJ = 'Checked & estimated';
