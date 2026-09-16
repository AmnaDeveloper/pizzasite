import Link from 'next/link';
import type { Metadata } from 'next';
import { Compass, ArrowRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { NAV_LINKS, SITE_NAME } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
};

const POPULAR = [
  { href: '/menus-prices', label: 'Menu & example prices', desc: '20 items with sizes, calories and allergens' },
  { href: '/coupons', label: 'Coupons & deal types', desc: 'Every offer structure, explained properly' },
  { href: '/delivery-near-me', label: 'Delivery near me', desc: 'Zones, timing and what delivery really costs' },
  { href: '/posts', label: 'Money-saving guides', desc: '18 long-form guides from our editorial team' },
  { href: '/hours', label: 'Opening hours', desc: 'Last-order times and what changes near close' },
];

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main id="main" className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-16">
          <p className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-dark">
            <Compass className="h-3.5 w-3.5" aria-hidden="true" />
            Error 404
          </p>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-ink sm:text-5xl">
            We could not find that page
          </h1>
          <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-ink-muted">
            The address may be mistyped, or the page may have moved as the site has grown.
            Nothing on {SITE_NAME} has been deleted without a redirect, so a working link
            to what you wanted almost certainly exists below.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-md bg-brand px-5 py-3 text-base font-bold text-white transition-colors hover:bg-brand-dark"
            >
              Back to the homepage
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-md border border-navy px-5 py-3 text-base font-bold text-navy transition-colors hover:bg-navy hover:text-white"
            >
              Report a broken link
            </Link>
          </div>

          <section aria-labelledby="popular" className="mt-12">
            <h2
              id="popular"
              className="text-2xl font-extrabold tracking-tight text-navy-dark"
            >
              The pages people are usually looking for
            </h2>
            <ul className="mt-5 grid gap-4 sm:grid-cols-2">
              {POPULAR.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block rounded-card border border-line bg-surface p-4 transition-colors hover:border-navy"
                  >
                    <span className="block text-base font-extrabold text-ink">
                      {item.label}
                    </span>
                    <span className="mt-1 block text-[15px] leading-relaxed text-ink-muted">
                      {item.desc}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <nav aria-label="Main sections" className="mt-10">
            <h2 className="text-sm font-bold uppercase tracking-wide text-ink-muted">
              Or jump straight to a section
            </h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-block rounded-full border border-line px-3.5 py-1.5 text-sm font-semibold text-ink transition-colors hover:border-navy hover:text-navy"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </main>
      <Footer />
    </div>
  );
}
