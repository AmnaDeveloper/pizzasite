'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, Pizza, Info } from 'lucide-react';
import { NAV_LINKS, NOT_AFFILIATED_SHORT, SITE_NAME, SITE_TAGLINE } from '@/lib/site-config';

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Every link in the drawer closes it on click, so there is no effect
  // watching the route — navigating away always tears the drawer down anyway.
  const closeMenu = () => setOpen(false);

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname.startsWith(`${href}/`));

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface/95 backdrop-blur">
      {/* The unaffiliated notice sits above the logo so it is impossible to miss. */}
      <div className="bg-navy text-white">
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-5 py-1.5 sm:px-8 text-[13px] leading-snug">
          <Info className="hidden h-3.5 w-3.5 shrink-0 sm:block" aria-hidden="true" />
          <p>{NOT_AFFILIATED_SHORT}</p>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5" aria-label={`${SITE_NAME} home`}>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-white">
            <Pizza className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="leading-tight">
            <span className="block text-lg font-extrabold tracking-tight text-ink">
              {SITE_NAME}
            </span>
            <span className="hidden text-[11px] font-medium uppercase tracking-wide text-ink-muted sm:block">
              {SITE_TAGLINE}
            </span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                  className={`rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
                    isActive(link.href)
                      ? 'bg-brand-soft text-brand-dark'
                      : 'text-ink hover:bg-surface-alt hover:text-navy'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/coupons"
            className="hidden rounded-md bg-brand px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-brand-dark sm:inline-block"
          >
            See Deals
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="rounded-md border border-line p-2 text-ink lg:hidden"
          >
            <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
            {open ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {open ? (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-line lg:hidden">
          <ul className="mx-auto max-w-6xl px-5 py-2 sm:px-8">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={closeMenu}
                  className={`block rounded-md px-3 py-3 text-base font-semibold ${
                    isActive(link.href) ? 'bg-brand-soft text-brand-dark' : 'text-ink'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/about"
                onClick={closeMenu}
                className="block rounded-md px-3 py-3 text-base font-semibold text-ink"
              >
                About Us
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
