'use client';

import { useMemo, useState } from 'react';
import { Check, Copy, Tag, Filter } from 'lucide-react';
import type { Coupon } from '@/data/types';

/**
 * Filterable list of illustrative deals. Every card is explicitly labelled as
 * an example so nobody mistakes these for live promotional codes.
 */
export default function CouponsClient({ coupons }: { coupons: Coupon[] }) {
  const types = useMemo(
    () => ['All', ...Array.from(new Set(coupons.map((c) => c.type)))],
    [coupons],
  );
  const [activeType, setActiveType] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const visible = useMemo(
    () => (activeType === 'All' ? coupons : coupons.filter((c) => c.type === activeType)),
    [coupons, activeType],
  );

  async function copy(coupon: Coupon) {
    try {
      await navigator.clipboard.writeText(coupon.code);
      setCopiedId(coupon.id);
      window.setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Clipboard access can be blocked; the code is visible on the card anyway.
      setCopiedId(null);
    }
  }

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
        {visible.map((coupon) => (
          <li key={coupon.id}>
            <article className="flex h-full flex-col overflow-hidden rounded-card border border-line bg-surface">
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
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">
                  {coupon.desc}
                </p>

                <p className="mt-3 rounded-md bg-surface-alt px-3 py-2 text-[13px] leading-snug text-ink-muted">
                  <strong className="text-ink">How to use it: </strong>
                  {coupon.howTo}
                </p>

                <div className="mt-4 border-t border-line pt-3">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-ink-muted">
                    Example code (illustrative only)
                  </p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <code className="flex-1 truncate rounded-md border border-dashed border-brand bg-brand-soft px-3 py-2 font-mono text-sm font-bold text-brand-dark">
                      {coupon.code}
                    </code>
                    <button
                      type="button"
                      onClick={() => copy(coupon)}
                      className="inline-flex items-center gap-1.5 rounded-md bg-navy px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-navy-dark"
                    >
                      {copiedId === coupon.id ? (
                        <Check className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <Copy className="h-4 w-4" aria-hidden="true" />
                      )}
                      <span className="sr-only sm:not-sr-only">
                        {copiedId === coupon.id ? 'Copied' : 'Copy'}
                      </span>
                    </button>
                  </div>
                  <p className="mt-2 text-[12px] leading-snug text-ink-muted">
                    Expiry: {coupon.expiry}. This is an example of an offer type, not a
                    live promotional code — check the official site for what is running
                    today.
                  </p>
                </div>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
