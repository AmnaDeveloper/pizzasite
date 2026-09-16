import Link from 'next/link';
import { Pizza, Mail } from 'lucide-react';
import {
  BRAND,
  CONTACT_EMAIL,
  FOOTER_LINKS,
  NOT_AFFILIATED_DISCLAIMER,
  SITE_NAME,
  SOCIAL_LINKS,
} from '@/lib/site-config';
import { currentYear } from '@/lib/utils/date';

const COLUMNS: { title: string; links: readonly { href: string; label: string }[] }[] = [
  { title: 'Menu & Deals', links: FOOTER_LINKS.guide },
  { title: 'Local Guides', links: FOOTER_LINKS.local },
  { title: 'Company', links: FOOTER_LINKS.company },
  { title: 'Legal', links: FOOTER_LINKS.legal },
];

/**
 * Three stacked bands:
 *   1. navy  — brand block plus the link columns
 *   2. red   — the one-line "we are not them" statement and the copyright
 *   3. light — the full unaffiliated disclaimer, required on every page
 *
 * Contrast is checked for each band: white on #006491 is 6.50:1, white on
 * #E31837 is 4.72:1, and the muted ink on the light strip is 4.87:1 — all clear
 * of AA. Link text is held at white/80 (4.77:1) rather than lower.
 */
export default function Footer() {
  return (
    <footer className="mt-20">
      {/* ── Band 1: navy ─────────────────────────────────────────────────── */}
      <div className="bg-navy text-white">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-6">
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand">
                  <Pizza className="h-5 w-5 text-white" aria-hidden="true" />
                </span>
                <span className="text-lg font-extrabold tracking-tight">{SITE_NAME}</span>
              </Link>

              <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-white/80">
                An independent, unofficial guide to {BRAND.name} menu prices, coupons,
                rewards and delivery in the United States. We track example prices and
                explain how the deals actually work.
              </p>

              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="mt-5 inline-flex items-center gap-2 text-[15px] font-semibold text-white hover:text-brand-soft"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                {CONTACT_EMAIL}
              </a>

              <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[14px]">
                {Object.entries(SOCIAL_LINKS).map(([name, url]) => (
                  <li key={name}>
                    <a
                      href={url}
                      rel="noopener noreferrer nofollow"
                      target="_blank"
                      className="capitalize text-white/80 transition-colors hover:text-white"
                    >
                      {name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {COLUMNS.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <h2 className="text-[15px] font-extrabold text-white">{col.title}</h2>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-[15px] text-white/80 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>
      </div>

      {/* ── Band 2: red ──────────────────────────────────────────────────── */}
      <div className="bg-brand text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-4 text-[14px] sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>
            We publish information only — we cannot take an order, change one, or act
            for {BRAND.name}.
          </p>
          <p className="shrink-0">
            © {currentYear()} {SITE_NAME}
          </p>
        </div>
      </div>

      {/* ── Band 3: the full disclaimer, on every page ───────────────────── */}
      <div className="border-t border-line bg-surface-alt">
        <div className="mx-auto max-w-4xl px-5 py-5 sm:px-8">
          <p className="text-center text-[13px] leading-relaxed text-ink-muted">
            {NOT_AFFILIATED_DISCLAIMER}
          </p>
        </div>
      </div>
    </footer>
  );
}
