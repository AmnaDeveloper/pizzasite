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
            <span className={`ml-1.5 text-[12px] ${activeType === type ? 'text-white/80' : 'text-ink-muted'}`}>
              {type === 'All' ? coupons.length : coupons.filter((c) => c.type === type).length}
            </span>
          </button>
        ))}
      </div>

      <p aria-live="polite" className="mt-3 text-sm text-ink-muted">
        Showing {visible.length} of {coupons.length} deal types.
      </p>

      <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((coupon) => {
          const worked = savings[coupon.id];
          return (
            <li key={coupon.id}>
              <article
                id={coupon.id}
                className="group flex h-full scroll-mt-32 flex-col overflow-hidden rounded-card border border-line bg-surface shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-navy/10"
              >
                {/* Ticket stub */}
                <div className="relative bg-navy px-5 pb-5 pt-4 text-white">
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide">
                      {coupon.type}
                    </span>
                    {coupon.featured ? (
                      <span className="rounded-full bg-brand px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide">
                        Featured
                      </span>
                    ) : (
                      <Tag className="h-5 w-5 text-white/50" aria-hidden="true" />
                    )}
                  </div>
                  <p className="mt-3 text-[2rem] font-black leading-none tracking-tight">
                    {coupon.discount}
                  </p>
                </div>

                {/* Perforation: dashed rule with a notch cut from each side. */}
                <div aria-hidden="true" className="relative h-0">
                  <span className="absolute -left-3 -top-3 h-6 w-6 rounded-full border border-line bg-surface" />
                  <span className="absolute -right-3 -top-3 h-6 w-6 rounded-full border border-line bg-surface" />
                  <span className="absolute inset-x-5 top-0 border-t-2 border-dashed border-line" />
                </div>

                <div className="flex flex-1 flex-col px-5 pb-5 pt-6">
                  <h3 className="text-[17px] font-extrabold leading-snug text-ink">
                    {coupon.title}
                  </h3>
                  <p className="mt-2 inline-flex items-center gap-1.5 self-start rounded-full bg-navy-soft px-2.5 py-1 text-[12px] font-bold text-navy-dark">
                    <Users className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    Best for: {coupon.bestFor}
                  </p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">
                    {coupon.desc}
                  </p>

                  <p className="mt-4 border-l-[3px] border-brand pl-3 text-[13px] leading-snug text-ink-muted">
                    <strong className="text-ink">How to use it: </strong>
                    {coupon.howTo}
                  </p>

                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-3 text-[12px] leading-snug text-ink-muted">
                    {worked ? (
                      <a
                        href="#deal-math"
                        className="inline-flex items-center gap-1.5 rounded-md bg-brand-soft px-2 py-1 font-bold text-brand-dark hover:underline"
                      >
                        <TrendingDown className="h-4 w-4" aria-hidden="true" />
                        Saves {CURRENCY_SYMBOL}
                        {worked.saving.toFixed(2)} ({worked.savingPct}%)
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
