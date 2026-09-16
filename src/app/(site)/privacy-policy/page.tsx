import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import LastUpdated from '@/components/LastUpdated';
import JsonLd from '@/components/JsonLd';
import { generatePageSEO } from '@/lib/seo-config';
import { breadcrumbSchema } from '@/lib/seo/schema';
import { CONTACT_EMAIL, ORGANIZATION, SITE_NAME, SITE_URL } from '@/lib/site-config';

const CRUMBS = [
  { name: 'Home', path: '/' },
  { name: 'Privacy Policy', path: '/privacy-policy' },
];

export const metadata: Metadata = generatePageSEO({
  title: 'Privacy Policy',
  description:
    `How ${SITE_NAME} handles personal information: what we collect, the cookies used by Google ` +
    'advertising and analytics, your choices, and how to contact us about your data.',
  path: '/privacy-policy',
});

export default function PrivacyPolicyPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(CRUMBS)} />

      <div className="mx-auto max-w-3xl px-4">
        <Breadcrumbs crumbs={CRUMBS} />
      </div>

      <article className="mx-auto max-w-3xl px-4 pb-16">
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-ink">
          Privacy Policy
        </h1>
        <LastUpdated className="mt-4" />

        <div className="prose-guide mt-8">
          <p>
            This policy explains what personal information {SITE_NAME} collects when you
            visit {SITE_URL}, why we collect it, who else receives it, and what choices you
            have. We have tried to write it in plain English rather than in the usual legal
            fog. If anything here is unclear, email us and we will explain it.
          </p>
          <p>
            {SITE_NAME} is published by {ORGANIZATION.legalName}, based in{' '}
            {ORGANIZATION.addressLocality}, {ORGANIZATION.addressRegion}. For questions
            about this policy or about your data, contact{' '}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </p>

          <h2>The short version</h2>
          <ul>
            <li>We do not sell your personal information.</li>
            <li>We do not require an account, and we do not run a newsletter.</li>
            <li>
              We use Google to serve advertising and to measure traffic. Those services set
              cookies and receive certain device and usage data.
            </li>
            <li>
              If you email us or use the contact form, we keep your message and your email
              address so we can reply.
            </li>
          </ul>

          <h2>Information we collect</h2>
          <h3>Information you give us</h3>
          <p>
            If you use our contact form we collect the name, email address, subject and
            message you submit. We use it to reply to you and to correct our pages, and we
            keep it for as long as it is useful for that purpose. We do not add contact-form
            addresses to any mailing list, because we do not operate one.
          </p>
          <h3>Information collected automatically</h3>
          <p>
            Like almost every website, we and our service providers collect technical
            information when you visit: your IP address, browser type and version, operating
            system, device type, screen size, the pages you view, how long you spend on
            them, and the site or search that referred you.
          </p>
          <p>
            We use this to understand which guides are useful, to find broken pages, and to
            make sure the site works on the devices people actually use.
          </p>

          <h2>Cookies and similar technologies</h2>
          <p>
            A cookie is a small text file stored on your device by your browser. This site
            uses three categories:
          </p>
          <ul>
            <li>
              <strong>Strictly necessary.</strong> Required for the site to function and to
              remember choices you make, such as dismissing a notice. These cannot be
              switched off without breaking the site.
            </li>
            <li>
              <strong>Analytics.</strong> Used to count visits and understand how pages are
              used, in aggregate.
            </li>
            <li>
              <strong>Advertising.</strong> Used by Google and its partners to select and
              measure the adverts you see.
            </li>
          </ul>
          <p>
            Our <Link href="/cookies">Cookie Policy</Link> lists these in more detail and
            explains how to control them.
          </p>

          <h2>Advertising, and what Google does with cookies</h2>
          <p>
            This site is supported by display advertising served through Google AdSense.
            This section explains what that means for your data, because it is the part of
            this policy that actually affects most visitors.
          </p>
          <ul>
            <li>
              Google, as a third-party vendor, uses cookies to serve adverts on this site.
            </li>
            <li>
              Google&apos;s use of advertising cookies enables it and its partners to serve
              adverts to you based on your visits to this site and other sites on the
              internet.
            </li>
            <li>
              Third-party vendors and ad networks other than Google may also serve adverts
              on this site and may use their own cookies to do so.
            </li>
            <li>
              These cookies may be used for ad personalisation, frequency capping (so you
              are not shown the same advert repeatedly), and measuring whether an advert was
              seen or clicked.
            </li>
          </ul>
          <p>
            <strong>Your choices.</strong> You can opt out of personalised advertising by
            Google by visiting{' '}
            <a
              href="https://adssettings.google.com"
              rel="noopener noreferrer nofollow"
              target="_blank"
            >
              Google Ads Settings
            </a>
            . You can opt out of personalised advertising from many other vendors at{' '}
            <a
              href="https://optout.aboutads.info"
              rel="noopener noreferrer nofollow"
              target="_blank"
            >
              aboutads.info
            </a>{' '}
            or{' '}
            <a
              href="https://optout.networkadvertising.org"
              rel="noopener noreferrer nofollow"
              target="_blank"
            >
              the Network Advertising Initiative
            </a>
            . Opting out does not remove advertising — it makes the adverts you see less
            targeted.
          </p>
          <p>
            Visitors in the European Economic Area, the United Kingdom and Switzerland are
            shown a consent notice before non-essential cookies are set, and can change
            their choice at any time.
          </p>

          <h2>Analytics</h2>
          <p>
            We use Google Analytics 4 to measure traffic in aggregate, with IP anonymisation
            enabled. We may also use Microsoft Clarity to understand how pages are used —
            for example, which parts of a long guide people actually read. These services
            set their own cookies and process data under their own privacy policies.
          </p>
          <p>
            You can prevent Google Analytics from collecting data by installing{' '}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              rel="noopener noreferrer nofollow"
              target="_blank"
            >
              Google&apos;s opt-out browser add-on
            </a>
            .
          </p>

          <h2>Who we share information with</h2>
          <p>
            We do not sell personal information and we do not share it for anyone else&apos;s
            independent marketing. Information is shared only with:
          </p>
          <ul>
            <li>
              <strong>Service providers</strong> who host the site, serve advertising,
              measure traffic and deliver our email. They may only process data to provide
              those services.
            </li>
            <li>
              <strong>Legal authorities</strong>, where we are required by law to disclose
              information or need to protect our legal rights.
            </li>
          </ul>

          <h2>How long we keep information</h2>
          <p>
            Contact-form messages are kept for as long as they are useful for handling your
            enquiry and any follow-up, and are then deleted. Analytics data is retained
            according to the provider&apos;s standard retention settings. Advertising cookie
            lifetimes are set by the vendor and are listed in our{' '}
            <Link href="/cookies">Cookie Policy</Link>.
          </p>

          <h2>Your rights</h2>
          <p>
            Depending on where you live, you may have the right to request access to the
            personal information we hold about you, to have it corrected or deleted, to
            object to or restrict how it is processed, to receive it in a portable format,
            and to withdraw consent where processing is based on consent.
          </p>
          <p>
            If you are a California resident, you have the right to know what personal
            information is collected and disclosed, the right to request deletion, and the
            right to opt out of the sale or sharing of personal information. We do not sell
            personal information as that term is commonly understood, and we will not
            discriminate against you for exercising any of these rights.
          </p>
          <p>
            To exercise any of these rights, email{' '}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. We may need to verify
            your identity before acting on a request.
          </p>

          <h2>Children</h2>
          <p>
            This site is intended for a general adult audience and is not directed at
            children under 13. We do not knowingly collect personal information from
            children under 13. If you believe a child has provided us with personal
            information, contact us and we will delete it.
          </p>

          <h2>International visitors</h2>
          <p>
            We are based in the United States and information collected through this site is
            processed there. If you access the site from outside the United States, you
            understand that your information may be transferred to and processed in a
            country whose data protection laws differ from those in your own.
          </p>

          <h2>Security</h2>
          <p>
            The site is served over HTTPS and we apply reasonable technical measures to
            protect the limited information we hold. No method of transmission or storage is
            completely secure, so we cannot guarantee absolute security — please do not send
            us sensitive personal information, payment details or account credentials.
          </p>

          <h2>Links to other sites</h2>
          <p>
            We link to third-party sites, including official brand sites. We are not
            responsible for their content or their privacy practices, and this policy does
            not apply once you leave our site.
          </p>

          <h2>Changes to this policy</h2>
          <p>
            We may update this policy as the site or the law changes. The date at the top of
            this page always reflects the current version. Material changes will be flagged
            on the site rather than made quietly.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about this policy, or about your information, go to{' '}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. You can also read our{' '}
            <Link href="/terms">Terms of Use</Link>,{' '}
            <Link href="/cookies">Cookie Policy</Link> and{' '}
            <Link href="/disclaimer">Disclaimer</Link>.
          </p>
        </div>
      </article>
    </>
  );
}
