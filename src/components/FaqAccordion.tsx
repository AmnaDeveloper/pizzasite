'use client';

import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import type { Faq } from '@/data/types';

/**
 * Accessible FAQ list.
 *
 * Each question is its own solid brand-blue bar with a plus/minus toggle, and
 * the answer opens in a panel attached beneath it. Uses buttons plus
 * aria-expanded rather than <details> so the open state is controllable and the
 * styling is identical across browsers.
 *
 * White on #006491 is 6.50:1 and on the #004E71 hover state 9.02:1, both well
 * clear of AA. The focus ring is forced to white because the site-wide navy
 * ring would sit invisibly on a navy bar.
 *
 * Pair with faqSchema() so the answers are eligible for rich results.
 */
export default function FaqAccordion({
  faqs,
  heading = 'Frequently asked questions',
  headingId = 'faq',
  className = 'mt-12',
  hideHeading = false,
}: {
  faqs: Faq[];
  heading?: string;
  headingId?: string;
  /** Override the default top margin when the parent already provides spacing. */
  className?: string;
  /**
   * Visually hide the heading when the surrounding layout already shows one.
   * It stays in the DOM so aria-labelledby still resolves for screen readers.
   */
  hideHeading?: boolean;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!faqs?.length) return null;

  return (
    <section aria-labelledby={headingId} className={className}>
      <h2
        id={headingId}
        className={
          hideHeading
            ? 'sr-only'
            : 'text-2xl font-extrabold tracking-tight text-navy-dark'
        }
      >
        {heading}
      </h2>

      <div className={`${hideHeading ? '' : 'mt-5'} space-y-3`}>
        {faqs.map((faq, i) => {
          const open = openIndex === i;
          return (
            <div key={faq.question}>
              <h3>
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : i)}
                  aria-expanded={open}
                  aria-controls={`${headingId}-panel-${i}`}
                  id={`${headingId}-button-${i}`}
                  className={`flex w-full items-center justify-between gap-4 bg-navy px-5 py-4 text-left text-[16px] font-semibold text-white transition-colors hover:bg-navy-dark focus-visible:outline-white sm:text-[17px] ${
                    open ? 'rounded-t-card' : 'rounded-card'
                  }`}
                >
                  <span>{faq.question}</span>
                  <span
                    aria-hidden="true"
                    className="flex h-6 w-6 shrink-0 items-center justify-center"
                  >
                    {open ? (
                      <Minus className="h-5 w-5" strokeWidth={2.5} />
                    ) : (
                      <Plus className="h-5 w-5" strokeWidth={2.5} />
                    )}
                  </span>
                </button>
              </h3>

              <div
                id={`${headingId}-panel-${i}`}
                role="region"
                aria-labelledby={`${headingId}-button-${i}`}
                hidden={!open}
                className="rounded-b-card border border-t-0 border-line bg-surface px-5 py-4 text-[15px] leading-relaxed text-ink-muted"
              >
                {faq.answer}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
