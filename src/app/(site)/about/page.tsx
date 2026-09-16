import type { Metadata } from 'next';
import Link from 'next/link';
import { Target, Scale, Wallet, RefreshCw } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import AuthorBio from '@/components/AuthorBio';
import LastUpdated from '@/components/LastUpdated';
import FaqAccordion from '@/components/FaqAccordion';
import JsonLd from '@/components/JsonLd';
import { generatePageSEO } from '@/lib/seo-config';
import { breadcrumbSchema, faqSchema } from '@/lib/seo/schema';
import { authors } from '@/data/authors';
import {
  BRAND,
  CONTACT_EMAIL,
  EDITORIAL_EMAIL,
  NOT_AFFILIATED_DISCLAIMER,
  ORGANIZATION,
  SITE_NAME,
} from '@/lib/site-config';

const CRUMBS = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
];

const ABOUT_FAQS = [
  {
    question: `Are you connected to ${BRAND.name} in any way?`,
    answer: `No. ${SITE_NAME} is independently owned and operated. We have no commercial relationship with ${BRAND.name}, we receive nothing from them, and nothing on this site is reviewed or approved by them before publication.`,
  },
  {
    question: 'How do you make money?',
    answer:
      'Display advertising, served by Google. Advertisers have no input into what we publish and we do not run affiliate links or receive commission on orders, which means we have no financial reason to push you toward a larger basket.',
  },
  {
    question: 'Where do your prices come from?',
    answer:
      'A rolling sample of stores that our team prices periodically, supplemented by reader reports we verify before publishing. Because franchise stores set their own prices, every figure is an example for reference rather than a quotation.',
  },
  {
    question: 'What do you do when you get something wrong?',
    answer:
      'We correct it and say so. If a figure or a claim on this site is wrong, email us and we will fix the page. We would rather be corrected than be confidently inaccurate.',
  },
];

export const metadata: Metadata = generatePageSEO({
  title: `About ${SITE_NAME}`,
  description:
    `Who runs ${SITE_NAME}, where our pricing data comes from, how we make money, and why an ` +
    `independent guide to ${BRAND.name} prices is worth reading.`,
  path: '/about',
  keywords: ['about slice and save', 'independent pizza guide', 'pizza price research'],
});

const PRINCIPLES = [
  {
    icon: Scale,
    title: 'Independent, and clearly so',
    body: `We are not affiliated with ${BRAND.name} and we say so on every page. We do not use their logos or copyrighted material. What we do is describe a publicly available menu for the purpose of consumer information.`,
  },
  {
    icon: Target,
    title: 'Show the arithmetic',
    body: 'If we claim carryout saves you nine dollars, the page shows where the nine dollars comes from. A claim we cannot break down into its parts does not get published.',
  },
  {
    icon: Wallet,
    title: 'No commission, no incentive to upsell',
    body: 'We earn from display advertising, not from your order. Nobody here gets paid more if you add a dessert, which is why our menu pages will happily tell you an item is not worth the money.',
  },
  {
    icon: RefreshCw,
    title: 'Dated, and re-checked',
    body: 'Every page carries a visible last-updated date. Prices move, deals rotate, and a guide without a date is a guide you cannot evaluate.',
  },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd data={[breadcrumbSchema(CRUMBS), faqSchema(ABOUT_FAQS)]} />

      <div className="mx-auto max-w-4xl px-4">
        <Breadcrumbs crumbs={CRUMBS} />
      </div>

      <article className="mx-auto max-w-4xl px-4 pb-16">
        <header>
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-ink sm:text-[2.75rem]">
            About {SITE_NAME}
          </h1>
          <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-ink-muted">
            We are a small independent publisher writing about what chain pizza costs and
            how to pay less for it. Not affiliated with any pizza company, not paid by one,
            and not interested in pretending a deal is better than it is.
          </p>
          <LastUpdated className="mt-4" />
        </header>

        <div className="prose-guide mt-9 max-w-3xl">
          <h2>Why this site exists</h2>
          <p>
            It started with a spreadsheet. Amna, who co-founded the site, got tired of
            never knowing what a pizza order would actually cost until checkout, and
            began writing down what she actually paid — not the advertised price, the real
            one, including the delivery fee, the small-order surcharge and the tip.
          </p>
          <p>
            What that spreadsheet showed, after a few months, was that the same food ordered
            two different ways could differ by eight or nine dollars. Not because of a
            secret coupon, but because of the order in which you clicked things: whether you
            chose carryout before or after building the basket, whether you started from the
            deals page or the menu, whether you put a plain cheese pizza or a fully loaded
            one into a flat-price slot.
          </p>
          <p>
            None of that is hidden, exactly. It is just not explained anywhere, because the
            people who could explain it have no reason to. That gap is what this site is
            for.
          </p>

          <h2>What we publish</h2>
          <p>
            Three things, essentially. Example prices for every item on a chain pizza menu,
            with sizes, calories and allergens. Explanations of how each deal structure
            works — what qualifies, what is excluded, and which item to put in the slot.
            And long-form guides on the decisions that change what you pay: crust choice,
            pizza size, tipping, rewards, when carryout stops being worth the drive.
          </p>
          <p>
            We also write city guides, because delivery is a local problem. A page that says
            the same thing about Seattle and Houston is a page that has told you nothing
            about either.
          </p>

          <h2>How we handle prices</h2>
          <p>
            This is the part we want to be precise about, because it is where a site like
            this can most easily mislead.
          </p>
          <p>
            Chain pizza stores are mostly franchises, and franchisees set their own prices.
            There is no single national price for a large pepperoni pizza. What we publish
            is a set of example prices drawn from a rolling sample of stores, useful for
            comparison — is a large better value than a medium, does a specialty pizza beat
            four toppings, what does a side really add to the total — but not a quotation
            for your store.
          </p>
          <p>
            That is why every price on this site carries the same caveat, and why we would
            rather repeat it too often than let someone assume we are quoting their local
            store.
          </p>

          <h2>How we make money</h2>
          <p>
            Display advertising, served by Google. That is the whole model. We do not run
            affiliate links, we do not receive commission on anything you order, and we are
            not paid to feature any brand or offer.
          </p>
          <p>
            We think that matters for a specific reason: a site earning commission on orders
            has a financial interest in you spending more. Ours does not, which is why the
            menu pages are comfortable telling you that extra cheese is a poor purchase and
            that bottled water is the one item we would suggest simply not ordering.
          </p>
          <p>
            Advertising is disclosed and separated from editorial content, and advertisers
            have no involvement in what we write. Our{' '}
            <Link href="/privacy-policy">privacy policy</Link> explains what advertising
            cookies do and how to control them.
          </p>

          <h2>Corrections</h2>
          <p>
            Prices change and we get things wrong. If you find a figure that is off, a link
            that is broken or a claim that does not hold up, email{' '}
            <a href={`mailto:${EDITORIAL_EMAIL}`}>{EDITORIAL_EMAIL}</a>. We fix pages rather
            than quietly leaving them, and where a correction is material we note it on the
            page.
          </p>
        </div>

        <section aria-labelledby="principles" className="mt-12">
          <h2
            id="principles"
            className="text-2xl font-extrabold tracking-tight text-navy-dark"
          >
            How we work
          </h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {PRINCIPLES.map((p) => (
              <article
                key={p.title}
                className="rounded-card border border-line bg-surface p-5"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-soft text-navy">
                  <p.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-3 text-lg font-extrabold text-ink">{p.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">{p.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="who" className="mt-12">
          <h2 id="who" className="text-2xl font-extrabold tracking-tight text-navy-dark">
            Who writes this
          </h2>
          <p className="mt-2 max-w-2xl text-[16px] leading-relaxed text-ink-muted">
            Two people who run this site directly, not a byline for a wider content team.
            One sets pricing and editorial direction, the other writes and reviews the
            guides day to day.
          </p>
          <div className="mt-5 space-y-5">
            {authors.map((author) => (
              <AuthorBio key={author.slug} author={author} variant="full" />
            ))}
          </div>
          <Link
            href="/team"
            className="mt-5 inline-block text-sm font-bold text-navy hover:text-brand"
          >
            Read more about the team →
          </Link>
        </section>

        <section aria-labelledby="details" className="mt-12">
          <h2
            id="details"
            className="text-2xl font-extrabold tracking-tight text-navy-dark"
          >
            Publisher details
          </h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-card border border-line bg-surface-alt p-4">
              <dt className="text-[12px] font-bold uppercase tracking-wide text-ink-muted">
                Published by
              </dt>
              <dd className="mt-1 font-semibold text-ink">{ORGANIZATION.legalName}</dd>
            </div>
            <div className="rounded-card border border-line bg-surface-alt p-4">
              <dt className="text-[12px] font-bold uppercase tracking-wide text-ink-muted">
                Based in
              </dt>
              <dd className="mt-1 font-semibold text-ink">
                {ORGANIZATION.addressLocality}, {ORGANIZATION.addressRegion},{' '}
                {ORGANIZATION.addressCountry}
              </dd>
            </div>
            <div className="rounded-card border border-line bg-surface-alt p-4">
              <dt className="text-[12px] font-bold uppercase tracking-wide text-ink-muted">
                General enquiries
              </dt>
              <dd className="mt-1 font-semibold text-ink">
                <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-brand">
                  {CONTACT_EMAIL}
                </a>
              </dd>
            </div>
            <div className="rounded-card border border-line bg-surface-alt p-4">
              <dt className="text-[12px] font-bold uppercase tracking-wide text-ink-muted">
                Corrections
              </dt>
              <dd className="mt-1 font-semibold text-ink">
                <a href={`mailto:${EDITORIAL_EMAIL}`} className="hover:text-brand">
                  {EDITORIAL_EMAIL}
                </a>
              </dd>
            </div>
          </dl>
        </section>

        <FaqAccordion faqs={ABOUT_FAQS} heading="Questions about this site" />

        <p className="mt-10 rounded-card border border-line bg-surface-alt p-4 text-[13px] leading-relaxed text-ink-muted">
          {NOT_AFFILIATED_DISCLAIMER}
        </p>
      </article>
    </>
  );
}
