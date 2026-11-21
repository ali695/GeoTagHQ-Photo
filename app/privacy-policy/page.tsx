import type { Metadata } from 'next';
import { OG_IMAGE, SITE_URL } from '@/lib/site';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How PinPixl handles your photos and data: most tools run in your browser, and files sent to our server are processed in memory and never stored.',
  alternates: { canonical: `${SITE_URL}/privacy-policy` },
  openGraph: { title: 'Privacy Policy', description: 'How PinPixl handles your photos and data: most tools run in your browser, and files sent to our server are processed in memory and never stored.', url: `${SITE_URL}/privacy-policy`, type: 'website', siteName: 'PinPixl', locale: 'en_US', images: [OG_IMAGE] },
  twitter: { card: 'summary_large_image', title: 'Privacy Policy', description: 'How PinPixl handles your photos and data: most tools run in your browser, and files sent to our server are processed in memory and never stored.', images: [OG_IMAGE.url] },
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-paper flex flex-col font-sans text-ink">
      <Header />
      <main className="flex-grow max-w-3xl mx-auto px-4 sm:px-6 py-16 md:py-24 w-full prose prose-slate prose-lg prose-headings:tracking-tight prose-h1:text-5xl prose-h1:font-extrabold prose-a:text-pin-2 prose-a:decoration-pin">
        <h1>Privacy Policy</h1>
        <p>Last updated: November 21, 2026</p>
        
        <h2>1. Information We Collect</h2>
        <p>
          We do not permanently store your photos. Most tools process photos within your browser. A few features use our server over an encrypted connection: writing GPS and metadata in the geotagging tool, decoding TIFF files, importing images from a web page URL, and a WebP fallback for older Safari versions. 
          Those files are processed in memory and are not retained as permanent uploads. Location searches may send an address or GPS coordinates to a third-party map or geocoding service.
        </p>

        <h2>2. Data Processing Guarantee</h2>
        <p>
          Files sent to server-based tools are used to perform the operation you requested, such as writing metadata, converting images or compressing files. We do not permanently cache, distribute, or maintain copies of your image files or the metadata you provide.
        </p>

        <h2>3. Third-party Services</h2>
        <p>
          Address searches and map lookups may use OpenStreetMap-powered geocoding services or Google Maps, depending on the tool configuration. The provider may receive the query or coordinates needed for the lookup. We may also use standard analytics to monitor website traffic.
        </p>

        <h2>4. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please use our <a href="/contact">Contact page</a>.</p>
      </main>
      <Footer />
    </div>
  );
}
