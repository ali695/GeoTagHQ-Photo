import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />
      <main className="flex-grow max-w-4xl mx-auto px-4 py-12 w-full prose prose-slate">
        <h1>Disclaimer</h1>
        <p>The materials on GeoTagHQ&apos;s website are provided on an &apos;as is&apos; basis. GeoTagHQ makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
        <p>Further, GeoTagHQ does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.</p>
        <h2>Local SEO Disclaimer</h2>
        <p>Local SEO depends on many factors. GPS EXIF metadata and IPTC photo tags are only one supporting optimization step. Geo-tagging photos does not guarantee increased search visibility, Google Business Profile rankings, or traffic.</p>
      </main>
      <Footer />
    </div>
  );
}
