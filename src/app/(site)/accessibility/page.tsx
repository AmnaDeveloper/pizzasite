import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import LastUpdated from '@/components/LastUpdated';
import JsonLd from '@/components/JsonLd';
import { generatePageSEO } from '@/lib/seo-config';
import { breadcrumbSchema } from '@/lib/seo/schema';
import { CONTACT_EMAIL, SITE_NAME } from '@/lib/site-config';

const CRUMBS = [
  { name: 'Home', path: '/' },
  { name: 'Accessibility', path: '/accessibility' },
];

export const metadata: Metadata = generatePageSEO({
  title: 'Accessibility Statement',
  description:
    `How ${SITE_NAME} approaches accessibility, what we have built in, the limitations we know ` +
    'about, and how to tell us when something does not work for you.',
  path: '/accessibility',
});

export default function AccessibilityPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(CRUMBS)} />

      <div className="mx-auto max-w-3xl px-4">
        <Breadcrumbs crumbs={CRUMBS} />
      </div>

      <article className="mx-auto max-w-3xl px-4 pb-16">
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-ink">
          Accessibility Statement
        </h1>
        <LastUpdated className="mt-4" />

        <div className="prose-guide mt-8">
          <p>
            {SITE_NAME} should be usable by everyone, including people using a screen
            reader, navigating by keyboard, using magnification, or reading with reduced
            motion. This page sets out what we have done, what we know is imperfect, and how
            to tell us when something does not work.
          </p>

          <h2>What we aim for</h2>
          <p>
            We target conformance with the Web Content Accessibility Guidelines (WCAG) 2.1
            at Level AA. We treat that as a working standard to build against rather than a
            badge to claim, and we test against it as pages change.
          </p>

          <h2>What is built in</h2>
          <ul>
            <li>
              <strong>Keyboard navigation.</strong> Every interactive element — links,
              buttons, the mobile menu, the FAQ accordions, the deal filters and the contact
              form — is reachable and operable by keyboard alone.
            </li>
            <li>
              <strong>Visible focus.</strong> A high-contrast focus ring is shown on every
              focusable element, so you can always see where you are.
            </li>
            <li>
              <strong>Skip link.</strong> A &ldquo;skip to main content&rdquo; link is the
              first thing in the tab order on every page, so you do not have to tab through
              the navigation every time.
            </li>
            <li>
              <strong>Semantic structure.</strong> Pages use real headings in order, real
              lists, real tables with header cells and captions, and landmark regions, so a
              screen reader can navigate by structure.
            </li>
            <li>
              <strong>Colour contrast.</strong> Body text and interactive elements are
              chosen to meet the AA contrast ratio against their backgrounds.
            </li>
            <li>
              <strong>Colour is never the only signal.</strong> Anything indicated by colour
              is also indicated by text, an icon or a shape.
            </li>
            <li>
              <strong>Images.</strong> Meaningful images carry descriptive alternative text;
              decorative images are hidden from assistive technology rather than announced.
            </li>
            <li>
              <strong>Reduced motion.</strong> If your system requests reduced motion, we
              disable transitions and smooth scrolling.
            </li>
            <li>
              <strong>Forms.</strong> Every field has a visible, associated label, required
              fields are marked in text as well as colour, and status messages are announced
              to assistive technology.
            </li>
            <li>
              <strong>Zoom and reflow.</strong> Text can be resized to 200% and the layout
              reflows to a single column without horizontal scrolling. Wide tables scroll
              inside their own container rather than pushing the page sideways.
            </li>
          </ul>

          <h2>Known limitations</h2>
          <p>We would rather list these than pretend they do not exist.</p>
          <ul>
            <li>
              <strong>Third-party advertising.</strong> Adverts on this site are served by
              third parties and their internal markup is outside our control. Some ad
              creatives may not meet the standards we apply to our own content. We control
              where ads sit and reserve space so they do not shift the page, but we cannot
              rewrite what is inside them.
            </li>
            <li>
              <strong>Wide data tables.</strong> Some price and hours tables are genuinely
              wide and require horizontal scrolling within their container on a small
              screen. We use proper header cells and captions so the content remains
              navigable, but the scrolling itself is an inconvenience.
            </li>
            <li>
              <strong>Illustration alt text.</strong> Our images are abstract decorative
              artwork rather than photographs of food. Their alternative text describes them
              honestly as illustrations, which means it conveys less than a photograph
              caption would.
            </li>
          </ul>

          <h2>How we test</h2>
          <p>
            We test with keyboard-only navigation, with browser zoom at 200%, with automated
            accessibility checks during development, and with a screen reader on the
            templates that most pages are built from. Automated tools catch a minority of
            real problems, which is why reports from readers matter more than any score.
          </p>

          <h2>Tell us when something does not work</h2>
          <p>
            If any part of this site is difficult or impossible for you to use, please email{' '}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> with the page address
            and a short description of the problem and the technology you are using. We aim
            to acknowledge within two working days and to fix genuine barriers quickly.
          </p>
          <p>
            If you need information from a page in a different format, ask and we will
            provide it.
          </p>

          <h2>Related pages</h2>
          <p>
            <Link href="/about">About us</Link> ·{' '}
            <Link href="/contact">Contact</Link> ·{' '}
            <Link href="/privacy-policy">Privacy Policy</Link> ·{' '}
            <Link href="/terms">Terms of Use</Link>
          </p>
        </div>
      </article>
    </>
  );
}
