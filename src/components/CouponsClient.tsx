'use client';

import { useMemo, useState } from 'react';
import { Filter, Tag, TrendingDown, Users } from 'lucide-react';
import type { Coupon } from '@/data/types';
import { CURRENCY_SYMBOL } from '@/lib/site-config';

export type CouponSaving = { saving: number; savingPct: number };

/**
 * Filterable list of deal types. There are deliberately no promo codes on the
 * cards: a code that fails at checkout costs the reader time and trust, so each
 * card explains who the offer suits and how it is applied instead. Where the
 * page has a worked example for the offer, its saving is shown on the card.
 *
 * All cards render on the server with the "All" filter, so every deal type is
 * in the initial HTML for crawlers; the filter only hides cards client-side.
 */
export default function CouponsClient({
  coupons,
  savings = {},
}: {
  coupons: Coupon[];
  savings?: Record<string, CouponSaving>;
}) {
  const types = useMemo(
    () => ['All', ...Array.from(new Set(coupons.map((c) => c.type)))],
    [coupons],
  );
  const [activeType, setActiveType] = useState<string>('All');

  const visible = useMemo(
    () => (activeType === 'All' ? coupons : coupons.filter((c) => c.type === activeType)),
    [coupons, activeType],
  );

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink">
          <Filter className="h-4 w-4 text-navy" aria-hidden="true" />
          Filter by type
        </span>
        {types.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setActiveType(type)}
            aria-pressed={activeType === type}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors ${
              activeType === type
                ? 'border-brand bg-brand text-white'
                : 'border-line bg-surface text-ink hover:border-navy hover:text-navy'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <p aria-live="polite" className="mt-3 text-sm text-ink-muted">
        Showing {visible.length} of {coupons.length} deal types.
      </p>

      <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((coupon) => {
          const worked = savings[coupon.id];
          return (
            <li key={coupon.id}>
              <article
                id={coupon.id}
                className="flex h-full scroll-mt-32 flex-col overflow-hidden rounded-card border border-line bg-surface"
              >
                <div className="flex items-start justify-between gap-3 bg-navy-soft px-4 py-3">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wide text-navy">
                      {coupon.type}
                    </p>
                    <p className="text-2xl font-extrabold leading-tight text-brand">
                      {coupon.discount}
                    </p>
                  </div>
                  <Tag className="h-5 w-5 shrink-0 text-navy" aria-hidden="true" />
                </div>

                <div className="flex flex-1 flex-col p-4">
                  <h3 className="text-base font-extrabold leading-snug text-ink">
                    {coupon.title}
                  </h3>
                  <p className="mt-2 inline-flex items-center gap-1.5 text-[13px] font-semibold text-navy">
                    <Users className="h-4 w-4 shrink-0" aria-hidden="true" />
                    Best for: {coupon.bestFor}
                  </p>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">
                    {coupon.desc}
                  </p>

                  <p className="mt-3 rounded-md bg-surface-alt px-3 py-2 text-[13px] leading-snug text-ink-muted">
                    <strong className="text-ink">How to use it: </strong>
                    {coupon.howTo}
                  </p>

                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-3 text-[12px] leading-snug text-ink-muted">
                    {worked ? (
                      <a
                        href="#deal-math"
                        className="inline-flex items-center gap-1 font-bold text-brand-dark hover:underline"
                      >
                        <TrendingDown className="h-4 w-4" aria-hidden="true" />
                        Saves {CURRENCY_SYMBOL}
                        {worked.saving.toFixed(2)} ({worked.savingPct}%) in our example
                      </a>
                    ) : (
                      <span>{coupon.expiry}</span>
                    )}
                    <span className="shrink-0">Example offer</span>
                  </div>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
