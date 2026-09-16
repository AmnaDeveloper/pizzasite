import { AlertCircle } from 'lucide-react';
import { PRICE_DISCLAIMER } from '@/lib/site-config';

/**
 * The example-price caveat. Rendered anywhere a number that looks like a price
 * appears, so no page can display pricing without the qualification next to it.
 */
export default function PriceNote({ className = '' }: { className?: string }) {
  return (
    <p
      className={`flex items-start gap-2 rounded-md bg-brand-soft px-3 py-2 text-[13px] leading-snug text-brand-dark ${className}`}
    >
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{PRICE_DISCLAIMER}</span>
    </p>
  );
}
