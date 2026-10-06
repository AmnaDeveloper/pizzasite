import type { Metadata, Viewport } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import Analytics from '@/components/Analytics';
import JsonLd from '@/components/JsonLd';
import { rootMetadata } from '@/lib/seo-config';
import { organizationSchema, websiteSchema } from '@/lib/seo/schema';
import { COLORS } from '@/lib/site-config';

/**
 * Poppins for every heading (see globals.css). Body text is Arial, a system
 * font, so only the heading font is downloaded. Poppins is not a variable
 * font, so each weight the headings use has to be listed.
 */
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-poppins',
});

export const metadata: Metadata = rootMetadata;

export const viewport: Viewport = {
  themeColor: COLORS.primary,
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="min-h-dvh antialiased">
        {/* Site-wide structured data: who publishes this and what the site is. */}
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
