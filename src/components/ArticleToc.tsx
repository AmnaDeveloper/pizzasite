'use client';

import { useEffect, useState } from 'react';
import type { PostHeading } from '@/lib/post-headings';

/** Sticky contents list that highlights the section being read. */
export default function ArticleToc({ headings }: { headings: PostHeading[] }) {
  const [active, setActive] = useState(headings[0]?.id);

  useEffect(() => {
    const els = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => Boolean(el));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) setActive(visible[visible.length - 1].target.id);
      },
      // A heading counts as current once it reaches the top quarter of the screen.
      { rootMargin: '-110px 0px -70% 0px' },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  return (
    <nav aria-label="In this guide" className="rounded-card border border-line bg-surface p-5">
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand">In this guide</p>
      <ol className="mt-3 space-y-0.5 border-l border-line">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              aria-current={active === h.id ? 'location' : undefined}
              className={`-ml-px block border-l-2 py-1.5 pl-3 text-[14px] leading-snug transition-colors ${
                active === h.id
                  ? 'border-brand font-bold text-navy-dark'
                  : 'border-transparent text-ink-muted hover:text-navy'
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
