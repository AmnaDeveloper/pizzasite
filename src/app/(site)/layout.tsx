import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

/**
 * Route group wrapper: everything inside (site) gets the header and footer.
 * The URL path is unaffected by the folder name.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
