import type { Metadata } from 'next';
import { OG_IMAGE, SITE_URL } from '@/lib/site';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Disclaimer',
  description: 'Important limits of PinPixl’s photo tools, including what geotagging can and cannot do for search rankings.',
  alternates: { canonical: `${SITE_URL}/disclaimer` },
  openGraph: { title: 'Disclaimer', description: 'Important limits of PinPixl’s photo tools, including what geotagging can and cannot do for search rankings.', url: `${SITE_URL}/disclaimer`, type: 'website', siteName: 'PinPixl', locale: 'en_US', images: [OG_IMAGE] },
  twitter: { card: 'summary_large_image', title: 'Disclaimer', description: 'Important limits of PinPixl’s photo tools, including what geotagging can and cannot do for search rankings.', images: [OG_IMAGE.url] },
};

export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-paper flex flex-col font-sans text-ink">
      <Header />
      <main className="flex-grow max-w-3xl mx-auto px-4 sm:px-6 py-16 md:py-24 w-full prose prose-slate prose-lg prose-headings:tracking-tight prose-h1:text-5xl prose-h1:font-extrabold prose-a:text-pin-2 prose-a:decoration-pin">
        <h1>Disclaimer</h1>
        <p>The materials on PinPixl&apos;s website are provided on an &apos;as is&apos; basis. PinPixl makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
        <p>Further, PinPixl does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.</p>
        <h2>Local SEO Disclaimer</h2>
        <p>Local SEO depends on many factors. GPS EXIF metadata and IPTC photo tags are only one supporting optimization step. Geo-tagging photos does not guarantee increased search visibility, Google Business Profile rankings, or traffic.</p>
      </main>
      <Footer />
    </div>
  );
}
