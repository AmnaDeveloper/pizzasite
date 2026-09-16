import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import LastUpdated from '@/components/LastUpdated';
import JsonLd from '@/components/JsonLd';
import { generatePageSEO } from '@/lib/seo-config';
import { breadcrumbSchema } from '@/lib/seo/schema';
import {
  BRAND,
  CONTACT_EMAIL,
  ORGANIZATION,
  SITE_NAME,
  SITE_URL,
} from '@/lib/site-config';

const CRUMBS = [
  { name: 'Home', path: '/' },
  { name: 'Terms of Use', path: '/terms' },
];

export const metadata: Metadata = generatePageSEO({
  title: 'Terms of Use',
  description:
    `The terms that govern your use of ${SITE_NAME}: what the content is and is not, ` +
    'intellectual property, acceptable use, and limitation of liability.',
  path: '/terms',
});

export default function TermsPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(CRUMBS)} />

      <div className="mx-auto max-w-3xl px-4">
        <Breadcrumbs crumbs={CRUMBS} />
      </div>

      <article className="mx-auto max-w-3xl px-4 pb-16">
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-ink">
          Terms of Use
        </h1>
        <LastUpdated className="mt-4" />

        <div className="prose-guide mt-8">
          <p>
            These terms govern your use of {SITE_URL}, published by{' '}
            {ORGANIZATION.legalName} ({SITE_NAME}, &ldquo;we&rdquo;, &ldquo;us&rdquo;). By
            using the site you accept them. If you do not accept them, please do not use the
            site.
          </p>

          <h2>1. What this site is</h2>
          <p>
            {SITE_NAME} is an independent editorial website providing general consumer
            information about chain pizza menus, pricing, promotions and delivery. It is a
            publication, not a shop and not an ordering service.
          </p>
          <p>
            We are not affiliated with, endorsed by, sponsored by or connected to{' '}
            {BRAND.name} or any of its subsidiaries, franchisees or affiliates. We cannot
            place, change, track or refund an order, and we have no access to any customer
            account.
          </p>

          <h2>2. Prices and other information are examples</h2>
          <p>
            All prices shown on this site are illustrative examples gathered for reference
            and comparison. They are not offers, quotations or guarantees.
          </p>
          <p>
            Chain pizza stores are largely operated by independent franchisees who set their
            own prices, hours, delivery zones and promotional participation. Prices,
            availability, ingredients, nutritional values and opening hours change without
            notice and vary by location. You must verify the current price and any product
            information at official checkout before ordering.
          </p>
          <p>
            Nutritional and allergen information on this site is general guidance. It is not
            medical or dietary advice, and it must not be relied on by anyone with a food
            allergy, coeliac disease or another medical condition. Confirm current allergen
            information directly with the restaurant.
          </p>

          <h2>3. Intellectual property</h2>
          <p>
            All original text, layout, illustration, code and other material on this site is
            owned by {ORGANIZATION.legalName} and protected by copyright. You may read,
            print and share our pages for personal, non-commercial use, and you may quote a
            short extract with clear attribution and a link.
          </p>
          <p>
            You may not republish substantial portions of this site, scrape it in bulk, use
            its content to train machine-learning systems, or present it as your own work,
            without our written permission.
          </p>
          <p>
            Third-party trade marks, brand names and product names referred to on this site
            are the property of their respective owners. They are used here for
            identification and descriptive purposes only, in the context of consumer
            reporting, and their use does not imply any affiliation or endorsement. We do
            not reproduce third-party logos or other copyrighted brand assets.
          </p>

          <h2>4. Acceptable use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use the site for any unlawful purpose or in breach of these terms.</li>
            <li>
              Attempt to gain unauthorised access to the site, its servers or any connected
              system.
            </li>
            <li>
              Introduce malicious code, or interfere with the operation or availability of
              the site.
            </li>
            <li>
              Use automated systems to scrape or harvest content beyond ordinary, respectful
              search-engine crawling.
            </li>
            <li>
              Submit false, abusive or misleading information through our contact form.
            </li>
          </ul>

          <h2>5. Advertising</h2>
          <p>
            This site is supported by third-party display advertising. Advertisements are
            selected and served by third parties and are not endorsements by us. We are not
            responsible for the content of any advertisement or for any product or service
            advertised, and any dealings you have with an advertiser are between you and
            them. See our <Link href="/privacy-policy">Privacy Policy</Link> for how
            advertising cookies work.
          </p>

          <h2>6. External links</h2>
          <p>
            We link to third-party websites, including official brand sites, for your
            convenience. We do not control those sites, we are not responsible for their
            content, accuracy or practices, and a link does not imply endorsement.
          </p>

          <h2>7. No warranty</h2>
          <p>
            The site and its content are provided &ldquo;as is&rdquo; and &ldquo;as
            available&rdquo;, without warranties of any kind, express or implied, including
            any implied warranty of accuracy, merchantability, fitness for a particular
            purpose or non-infringement.
          </p>
          <p>
            We work hard to be accurate and we correct errors when we find them, but we do
            not warrant that the content is complete, current or error-free, or that the
            site will be available without interruption.
          </p>

          <h2>8. Limitation of liability</h2>
          <p>
            To the fullest extent permitted by law, neither {ORGANIZATION.legalName} nor its
            contributors will be liable for any indirect, incidental, special, consequential
            or punitive damages, or for any loss of profits, revenue, data or goodwill,
            arising out of or in connection with your use of this site or your reliance on
            any content on it — including any difference between a price shown here and a
            price charged by a restaurant.
          </p>
          <p>
            Nothing in these terms excludes or limits liability that cannot be excluded or
            limited under applicable law.
          </p>

          <h2>9. Indemnity</h2>
          <p>
            You agree to indemnify and hold harmless {ORGANIZATION.legalName} and its
            contributors from any claim, loss or expense arising out of your misuse of the
            site or your breach of these terms.
          </p>

          <h2>10. Changes</h2>
          <p>
            We may update these terms from time to time. The date at the top of this page
            reflects the current version, and continued use of the site after a change
            constitutes acceptance of the updated terms.
          </p>

          <h2>11. Governing law</h2>
          <p>
            These terms are governed by the laws of the State of{' '}
            {ORGANIZATION.addressRegion === 'TX' ? 'Texas' : ORGANIZATION.addressRegion},
            United States, without regard to its conflict-of-laws rules. Nothing here
            affects mandatory consumer protection rights available to you where you live.
          </p>

          <h2>12. Contact</h2>
          <p>
            Questions about these terms go to{' '}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. See also our{' '}
            <Link href="/privacy-policy">Privacy Policy</Link>,{' '}
            <Link href="/cookies">Cookie Policy</Link> and{' '}
            <Link href="/disclaimer">Disclaimer</Link>.
          </p>
        </div>
      </article>
    </>
  );
}
