import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import LastUpdated from '@/components/LastUpdated';
import JsonLd from '@/components/JsonLd';
import { generatePageSEO } from '@/lib/seo-config';
import { breadcrumbSchema } from '@/lib/seo/schema';
import { PAGE_DATES } from '@/lib/page-dates';
import { CLARITY_ID, CONTACT_EMAIL, GA4_ID, SITE_NAME } from '@/lib/site-config';

const HAS_ANALYTICS = Boolean(GA4_ID || CLARITY_ID);

/** Day this page's content last really changed — update it with the content. */
const PAGE_UPDATED = PAGE_DATES['/cookies'];

const CRUMBS = [
  { name: 'Home', path: '/' },
  { name: 'Cookie Policy', path: '/cookies' },
];

export const metadata: Metadata = generatePageSEO({
  title: 'Cookie Policy',
  description:
    `Which cookies ${SITE_NAME} uses, what each category does, who sets them, roughly how long ` +
    'they last, and exactly how to control or remove them.',
  path: '/cookies',
});

const ALL_COOKIE_ROWS = [
  {
    category: 'Security',
    setBy: 'Our hosting and security provider',
    purpose:
      'May be set to protect the site against bots and automated abuse. This site does not set cookies of its own.',
    duration: 'Up to 30 minutes',
    optional: 'No — set only when needed for security'
  },
  {
    category: 'Analytics',
    setBy: 'Google Analytics',
    purpose:
      'Counts visits and measures which pages are read, in aggregate. Helps us find broken pages and see which guides are useful.',
    duration: 'Up to 24 months',
    optional: 'Yes',
  },
  {
    category: 'Analytics',
    setBy: 'Microsoft Clarity',
    purpose:
      'Aggregated usage measurement — for example, how far down a long guide people actually read.',
    duration: 'Up to 12 months',
    optional: 'Yes',
  },
  {
    category: 'Advertising',
    setBy: 'Google AdSense and partners',
    purpose:
      'Selects which ads to show, limits how often you see the same one, and measures whether an ad was viewed or clicked.',
    duration: 'Up to 24 months',
    optional: 'Yes',
  },
];

/** List only the services this build actually loads. */
const COOKIE_TABLE = ALL_COOKIE_ROWS.filter(
  (row) =>
    (row.setBy !== 'Google Analytics' || Boolean(GA4_ID)) &&
    (row.setBy !== 'Microsoft Clarity' || Boolean(CLARITY_ID)),
);

export default function CookiePolicyPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(CRUMBS)} />

      <div className="mx-auto max-w-3xl px-4">
        <Breadcrumbs crumbs={CRUMBS} />
      </div>

      <article className="mx-auto max-w-3xl px-4 pb-16">
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-ink">
          Cookie Policy
        </h1>
        <LastUpdated date={PAGE_UPDATED} className="mt-4" />

        <div className="prose-guide mt-8">
          <p>
            This page explains which cookies {SITE_NAME} uses and how to control them. It
            sits alongside our <Link href="/privacy-policy">Privacy Policy</Link>, which
            covers personal information more broadly.
          </p>

          <h2>What a cookie is</h2>
          <p>
            A cookie is a small text file that a website asks your browser to store on your
            device. It lets a site recognize your browser on a later page or a later visit.
            This site does not set cookies of its own; the ones you may see here are set by
            the services we use, principally Google.
          </p>
          <p>
            Similar technologies — local storage, pixels and software development kits — do
            comparable jobs, and everything on this page applies to them too.
          </p>

          <h2>Why we use them</h2>
          <p>This site does not set cookies of its own. The services it uses may set them for these reasons, and no others:</p>
          <ul>
            <li>To keep the site secure.</li>
            {HAS_ANALYTICS ? <li>To understand, in aggregate, which guides people find useful.</li> : null}
            <li>
              To serve the display advertising that pays for the site, since we do not
              charge readers and do not take commission on orders.
            </li>
          </ul>
        </div>

        <div className="table-scroll mt-8 rounded-card border border-line">
          <table className="w-full min-w-[46rem] text-sm">
            <caption className="sr-only">
              Cookie categories used on this site, who sets them and how long they last
            </caption>
            <thead>
              <tr className="bg-navy-soft text-left text-[12px] uppercase tracking-wide text-navy-dark">
                <th scope="col" className="px-4 py-3 font-bold">
                  Category
                </th>
                <th scope="col" className="px-4 py-3 font-bold">
                  Set by
                </th>
                <th scope="col" className="px-4 py-3 font-bold">
                  What it does
                </th>
                <th scope="col" className="px-4 py-3 font-bold">
                  Typical duration
                </th>
                <th scope="col" className="px-4 py-3 font-bold">
                  Optional?
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line bg-surface">
              {COOKIE_TABLE.map((row, i) => (
                <tr key={`${row.category}-${i}`}>
                  <th scope="row" className="px-4 py-3 text-left font-bold text-ink">
                    {row.category}
                  </th>
                  <td className="px-4 py-3 text-ink-muted">{row.setBy}</td>
                  <td className="px-4 py-3 text-ink-muted">{row.purpose}</td>
                  <td className="px-4 py-3 text-ink-muted">{row.duration}</td>
                  <td className="px-4 py-3 text-ink-muted">{row.optional}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="prose-guide mt-8">
          <p>
            Durations are typical values set by the providers, not by us, and can change
            when they update their own systems.
          </p>

          <h2>Advertising cookies specifically</h2>
          <p>
            Google, as a third-party vendor, uses cookies to serve ads on this site.
            Google’s use of advertising cookies enables it and its partners to serve
            ads based on your visits to this site and other sites on the internet. Other
            third-party vendors and ad networks may also serve ads here and may set
            their own cookies.
          </p>
          <p>
            These cookies are used to choose which ad to show, to avoid showing you the
            same ad repeatedly, and to measure whether an ad was seen or clicked.
          </p>

          <h2>How to control cookies</h2>
          <h3>Opt out of personalized advertising</h3>
          <ul>
            <li>
              <a
                href="https://adssettings.google.com"
                rel="noopener noreferrer nofollow"
                target="_blank"
              >
                Google Ads Settings
              </a>{' '}
              — controls personalization for Google advertising.
            </li>
            <li>
              <a
                href="https://optout.aboutads.info"
                rel="noopener noreferrer nofollow"
                target="_blank"
              >
                aboutads.info
              </a>{' '}
              and{' '}
              <a
                href="https://optout.networkadvertising.org"
                rel="noopener noreferrer nofollow"
                target="_blank"
              >
                the Network Advertising Initiative
              </a>{' '}
              — industry opt-outs covering many vendors at once.
            </li>
          </ul>
          <p>
            Opting out does not remove advertising from the site. It makes the ads you
            see less relevant to you, which is a trade some people are happy to make.
          </p>

          {GA4_ID ? (
            <>
              <h3>Opt out of analytics</h3>
              <p>
                You can prevent Google Analytics from picking up your data with{' '}
                <a
                  href="https://tools.google.com/dlpage/gaoptout"
                  rel="noopener noreferrer nofollow"
                  target="_blank"
                >
                  Google’s opt-out browser add-on
                </a>
                .
              </p>
            </>
          ) : null}

          <h3>Control cookies in your browser</h3>
          <p>
            Every major browser lets you view, block and delete cookies, usually under
            Settings, then Privacy. You can block third-party cookies entirely, which stops
            most advertising and analytics cookies on any site, or delete existing cookies
            to start fresh. Blocking cookies does not stop you reading this site.
          </p>

          <h3>Consent in the EEA, UK and Switzerland</h3>
          <p>
            Visitors in these regions are asked for consent through Google’s consent
            message before personalized ads are shown, and can change or withdraw that
            choice at any time.
          </p>

          <h2>Changes</h2>
          <p>
            We update this page when the services we use change. The date at the top always
            reflects the current version.
          </p>

          <h2>Questions</h2>
          <p>
            Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>, or read our{' '}
            <Link href="/privacy-policy">Privacy Policy</Link> and{' '}
            <Link href="/terms">Terms of Use</Link>.
          </p>
        </div>
      </article>
    </>
  );
}
