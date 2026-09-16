import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import LastUpdated from '@/components/LastUpdated';
import JsonLd from '@/components/JsonLd';
import { generatePageSEO } from '@/lib/seo-config';
import { breadcrumbSchema } from '@/lib/seo/schema';
import {
  BRAND,
  CONTACT_EMAIL,
  NOT_AFFILIATED_DISCLAIMER,
  ORGANIZATION,
  SITE_NAME,
} from '@/lib/site-config';

const CRUMBS = [
  { name: 'Home', path: '/' },
  { name: 'Disclaimer', path: '/disclaimer' },
];

export const metadata: Metadata = generatePageSEO({
  title: 'Disclaimer',
  description:
    `${SITE_NAME} is an independent guide and is not affiliated with ${BRAND.name}. What our ` +
    'prices mean, what our nutrition information does not mean, and the limits of everything here.',
  path: '/disclaimer',
});

export default function DisclaimerPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(CRUMBS)} />

      <div className="mx-auto max-w-3xl px-4">
        <Breadcrumbs crumbs={CRUMBS} />
      </div>

      <article className="mx-auto max-w-3xl px-4 pb-16">
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-ink">
          Disclaimer
        </h1>
        <LastUpdated className="mt-4" />

        <div className="mt-6 flex gap-3 rounded-card border border-brand/40 bg-brand-soft p-5">
          <ShieldAlert
            className="mt-0.5 h-6 w-6 shrink-0 text-brand-dark"
            aria-hidden="true"
          />
          <p className="text-[15px] font-medium leading-relaxed text-brand-dark">
            {NOT_AFFILIATED_DISCLAIMER}
          </p>
        </div>

        <div className="prose-guide mt-8">
          <h2>We are not the brand</h2>
          <p>
            {SITE_NAME}, published by {ORGANIZATION.legalName}, is an independent editorial
            website. We have no affiliation, association, authorisation, endorsement or
            sponsorship relationship with {BRAND.name} or with any of its subsidiaries,
            franchisees or affiliates.
          </p>
          <p>
            Practically, that means we cannot place an order for you, change or cancel one,
            look up an order status, access any customer account, honour a promotion, issue
            a refund, or resolve a complaint about a delivery. If you need any of those
            things, contact the restaurant you ordered from directly.
          </p>

          <h2>Trade marks</h2>
          <p>
            All trade marks, service marks, brand names and product names referenced on this
            site are the property of their respective owners. They are used here purely for
            identification and descriptive purposes, in the context of independent consumer
            reporting on publicly available menus and offers. Their use does not imply any
            affiliation with or endorsement by the owner.
          </p>
          <p>
            We do not reproduce brand logos or other copyrighted brand assets. All
            illustration, text and layout on this site is our own original work.
          </p>

          <h2>Prices are examples, not quotations</h2>
          <p>
            This is the most important thing on this page.
          </p>
          <p>
            Chain pizza stores are largely operated by independent franchisees who set their
            own prices, their own hours, their own delivery zones and their own promotional
            participation. There is no single national price for a large pepperoni pizza,
            and no site — including this one — can tell you what your store will charge.
          </p>
          <p>
            Every price shown here is an illustrative example gathered from a rolling sample
            of stores. It is useful for comparison: whether a large is better value than a
            medium, whether a specialty pizza beats four toppings, what a side really adds
            to a total. It is not a quotation, an offer or a guarantee, and it may differ
            from what you are charged. Always confirm the final total at official checkout
            before ordering.
          </p>

          <h2>Coupon codes on this site are illustrative</h2>
          <p>
            The codes shown on our <Link href="/coupons">coupons page</Link> are placeholders
            we wrote to demonstrate what each type of offer looks like. They are not live
            promotional codes and they will not work at checkout. Live offers appear on the
            official site, personalised to your store, because franchisees opt into
            promotions individually.
          </p>

          <h2>Nutrition and allergen information</h2>
          <p>
            Nutritional values, ingredient lists and allergen information on this site are
            general guidance compiled for consumer reference. They are approximate,
            formulations change without notice, and portioning at a store is done by hand
            against a target rather than measured precisely.
          </p>
          <p>
            <strong>
              None of it is medical, dietary or nutritional advice, and it must not be
              relied on by anyone with a food allergy, coeliac disease or another medical
              condition.
            </strong>{' '}
            A shared pizza kitchen cannot rule out cross-contact between allergens. If you
            have a serious dietary requirement, obtain current allergen information directly
            from the restaurant and speak to a qualified healthcare professional about your
            own circumstances.
          </p>

          <h2>Hours, availability and delivery zones</h2>
          <p>
            Opening hours, item availability and delivery coverage shown here describe a
            market in general, not any individual store, and they change frequently. Store
            addresses and phone numbers shown on our city pages are illustrative
            service-area examples rather than the contact details of a specific store. Use
            the official store finder for anything you intend to act on.
          </p>

          <h2>Advertising</h2>
          <p>
            This site is funded by third-party display advertising. Adverts are selected and
            served by third parties, are not endorsements by us, and we are not responsible
            for the products or services advertised. We do not run affiliate links and we do
            not receive commission on orders. See our{' '}
            <Link href="/privacy-policy">Privacy Policy</Link> for how advertising cookies
            work.
          </p>

          <h2>External links</h2>
          <p>
            We link to third-party sites, including official brand sites, for your
            convenience. We do not control them, we are not responsible for their content or
            practices, and a link is not an endorsement.
          </p>

          <h2>Errors and corrections</h2>
          <p>
            We check our figures and we still get things wrong sometimes. If you find an
            error, email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and we will
            correct the page. We would rather be corrected than be confidently inaccurate.
          </p>

          <h2>Limitation of liability</h2>
          <p>
            To the fullest extent permitted by law, we accept no liability for any loss
            arising from reliance on the content of this site, including any difference
            between a price shown here and a price charged by a restaurant. Full terms are
            in our <Link href="/terms">Terms of Use</Link>.
          </p>
        </div>
      </article>
    </>
  );
}
