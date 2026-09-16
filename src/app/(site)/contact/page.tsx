import type { Metadata } from 'next';
import Link from 'next/link';
import { Mail, MessageSquare, AlertTriangle, Megaphone } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import ContactForm from '@/components/ContactForm';
import LastUpdated from '@/components/LastUpdated';
import FaqAccordion from '@/components/FaqAccordion';
import JsonLd from '@/components/JsonLd';
import { generatePageSEO } from '@/lib/seo-config';
import { breadcrumbSchema, faqSchema } from '@/lib/seo/schema';
import {
  BRAND,
  CONTACT_EMAIL,
  EDITORIAL_EMAIL,
  ORGANIZATION,
  SITE_NAME,
} from '@/lib/site-config';

const CRUMBS = [
  { name: 'Home', path: '/' },
  { name: 'Contact', path: '/contact' },
];

const CONTACT_FAQS = [
  {
    question: 'Can you help with a problem with my pizza order?',
    answer: `No, and we want to be clear about it: we are not ${BRAND.name} and we have no access to any order system. If your order is wrong, late or missing, contact the store you ordered from directly — they are the only people who can fix it.`,
  },
  {
    question: 'How quickly do you reply?',
    answer:
      'Most messages get a reply within two working days. Price corrections tend to be quickest because we can usually verify them the same day.',
  },
  {
    question: 'I found a price that is wrong. What should I include?',
    answer:
      'The city, the item, the size, and the price you actually saw. That is enough for us to check it against our sample and update the page if we are out of date.',
  },
  {
    question: 'Do you accept guest posts or sponsored articles?',
    answer:
      'No. We do not publish sponsored content, guest posts or paid links, and requests for them will not receive a reply. Our only revenue is display advertising, which is kept entirely separate from editorial.',
  },
];

export const metadata: Metadata = generatePageSEO({
  title: 'Contact Us',
  description:
    `Get in touch with ${SITE_NAME} — price corrections, content feedback, broken links and ` +
    'advertising enquiries. We reply to most messages within two working days.',
  path: '/contact',
  keywords: ['contact slice and save', 'report price error', 'pizza guide contact'],
});

const REASONS = [
  {
    icon: AlertTriangle,
    title: 'A price looks wrong',
    body: 'The most useful message you can send us. Include the city, the item and the price you saw, and we will check it against our sample.',
  },
  {
    icon: MessageSquare,
    title: 'Feedback on a guide',
    body: 'Disagree with something we wrote? Tell us why. We would rather be argued with than be confidently wrong in public.',
  },
  {
    icon: Megaphone,
    title: 'Advertising',
    body: 'We run display advertising only. We do not accept sponsored posts, guest articles or paid links, so please do not pitch them.',
  },
];

export default function ContactPage() {
  return (
    <>
      <JsonLd data={[breadcrumbSchema(CRUMBS), faqSchema(CONTACT_FAQS)]} />

      <div className="mx-auto max-w-4xl px-4">
        <Breadcrumbs crumbs={CRUMBS} />
      </div>

      <div className="mx-auto max-w-4xl px-4 pb-16">
        <header>
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-ink sm:text-[2.75rem]">
            Contact us
          </h1>
          <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-ink-muted">
            Real people read this inbox. Price corrections are the most useful thing you can
            send, and they are the fastest for us to act on.
          </p>
          <LastUpdated className="mt-4" />
        </header>

        <div className="mt-8 flex gap-3 rounded-card border border-brand/40 bg-brand-soft p-4">
          <AlertTriangle
            className="mt-0.5 h-5 w-5 shrink-0 text-brand-dark"
            aria-hidden="true"
          />
          <div>
            <h2 className="text-sm font-extrabold uppercase tracking-wide text-brand-dark">
              We cannot help with an order
            </h2>
            <p className="mt-1.5 text-[15px] leading-relaxed text-brand-dark">
              {SITE_NAME} is an independent guide with no affiliation to {BRAND.name}. We
              do not take orders, cannot access any account, and cannot resolve a problem
              with a delivery. For anything transactional, contact the store you ordered
              from directly.
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.25fr_1fr]">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-navy-dark">
              Send us a message
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">
              Required fields are marked with an asterisk. We only use your email address to
              reply to you.
            </p>
            <div className="mt-5">
              <ContactForm />
            </div>
          </div>

          <aside>
            <h2 className="text-2xl font-extrabold tracking-tight text-navy-dark">
              What people write to us about
            </h2>
            <div className="mt-5 space-y-4">
              {REASONS.map((reason) => (
                <article
                  key={reason.title}
                  className="rounded-card border border-line bg-surface p-4"
                >
                  <h3 className="flex items-center gap-2 text-base font-extrabold text-ink">
                    <reason.icon className="h-4 w-4 text-navy" aria-hidden="true" />
                    {reason.title}
                  </h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-ink-muted">
                    {reason.body}
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-6 rounded-card border border-line bg-surface-alt p-5">
              <h2 className="text-base font-extrabold text-ink">Email us directly</h2>
              <ul className="mt-3 space-y-2 text-[15px]">
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 shrink-0 text-navy" aria-hidden="true" />
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="font-semibold text-navy hover:text-brand"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 shrink-0 text-navy" aria-hidden="true" />
                  <a
                    href={`mailto:${EDITORIAL_EMAIL}`}
                    className="font-semibold text-navy hover:text-brand"
                  >
                    {EDITORIAL_EMAIL}
                  </a>
                </li>
              </ul>
              <p className="mt-4 text-[13px] leading-relaxed text-ink-muted">
                {ORGANIZATION.legalName}
                <br />
                {ORGANIZATION.addressLocality}, {ORGANIZATION.addressRegion},{' '}
                {ORGANIZATION.addressCountry}
              </p>
              <p className="mt-3 text-[13px] leading-relaxed text-ink-muted">
                Read how we handle your message in our{' '}
                <Link
                  href="/privacy-policy"
                  className="font-semibold text-navy hover:text-brand"
                >
                  privacy policy
                </Link>
                .
              </p>
            </div>
          </aside>
        </div>

        <FaqAccordion faqs={CONTACT_FAQS} heading="Before you write to us" />
      </div>
    </>
  );
}
