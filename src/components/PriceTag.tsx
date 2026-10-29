import { CURRENCY_SYMBOL, PRICE_SOURCE } from '@/lib/site-config';
import { checkedDate } from '@/lib/price-source';

/**
 * A price with its provenance. Checked prices get a tick and a tooltip naming
 * the store and date; estimates get a quiet "est." so the two can never be
 * confused.
 */
export default function PriceTag({
  price,
  verified = false,
  className = '',
}: {
  price: number;
  verified?: boolean;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-baseline gap-1 whitespace-nowrap ${className}`}>
      <span className="tabular-nums">
        {CURRENCY_SYMBOL}
        {price.toFixed(2)}
      </span>
      {verified ? (
        <span
          title={`Checked at ${PRICE_SOURCE.store} on ${checkedDate}`}
          className="text-[11px] font-bold text-navy"
        >
          ✓<span className="sr-only"> checked price</span>
        </span>
      ) : (
        <span className="text-[11px] font-semibold text-ink-muted">est.</span>
      )}
    </span>
  );
}
