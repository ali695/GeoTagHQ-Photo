import type { Metadata } from 'next';
import { OG_IMAGE, SITE_URL } from '@/lib/site';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'The terms for using PinPixl’s free online photo tools, including acceptable use and limitations.',
  alternates: { canonical: `${SITE_URL}/terms` },
  openGraph: { title: 'Terms of Service', description: 'The terms for using PinPixl’s free online photo tools, including acceptable use and limitations.', url: `${SITE_URL}/terms`, type: 'website', siteName: 'PinPixl', locale: 'en_US', images: [OG_IMAGE] },
  twitter: { card: 'summary_large_image', title: 'Terms of Service', description: 'The terms for using PinPixl’s free online photo tools, including acceptable use and limitations.', images: [OG_IMAGE.url] },
};

export default function Terms() {
  return (
    <div className="min-h-screen bg-paper flex flex-col font-sans text-ink">
      <Header />
      <main className="flex-grow max-w-3xl mx-auto px-4 sm:px-6 py-16 md:py-24 w-full prose prose-slate prose-lg prose-headings:tracking-tight prose-h1:text-5xl prose-h1:font-extrabold prose-a:text-pin-2 prose-a:decoration-pin">
        <h1>Terms of Service</h1>
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2>1. Acceptance of Terms</h2>
        <p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p>

        <h2>2. Use License</h2>
        <p>
          Permission is granted to temporarily use the materials (information or software) on PinPixl&apos;s website for personal, non-commercial transitory viewing only.
        </p>

        <h2>3. Use of Metadata & SEO</h2>
        <p>
          The tool is provided &quot;as-is&quot;. Metadata compatibility may vary by platform, and some social media or platforms strip EXIF data upon upload. Geo-tagging and EXIF SEO metadata do not guarantee any specific ranking on Google or local search results.
        </p>

        <h2>4. Limitations</h2>
        <p>
          In no event shall PinPixl or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on the website.
        </p>
      </main>
      <Footer />
    </div>
  );
}
