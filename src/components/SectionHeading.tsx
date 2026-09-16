import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

/**
 * The single section header used everywhere on the homepage.
 *
 * One header pattern, one type scale, one spacing rule — the page reads as a
 * sequence of identical blocks rather than as a set of unrelated designs.
 */
export default function SectionHeading({
  id,
  eyebrow,
  title,
  intro,
  ctaHref,
  ctaLabel,
}: {
  id: string;
  eyebrow: string;
  title: string;
  intro?: string;
  ctaHref?: string;
  ctaLabel?: string;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
      <div className="max-w-2xl">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand">
          {eyebrow}
        </p>
        <h2
          id={id}
          className="mt-2.5 text-[1.75rem] font-extrabold leading-tight tracking-tight text-navy-dark sm:text-[2rem]"
        >
          {title}
        </h2>
        {intro ? (
          <p className="mt-3 text-[16px] leading-relaxed text-ink-muted">{intro}</p>
        ) : null}
      </div>

      {ctaHref && ctaLabel ? (
        <Link
          href={ctaHref}
          className="inline-flex shrink-0 items-center gap-2 rounded-md border border-navy px-4 py-2.5 text-sm font-bold text-navy transition-colors hover:bg-navy hover:text-white"
        >
          {ctaLabel}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      ) : null}
    </div>
  );
}
