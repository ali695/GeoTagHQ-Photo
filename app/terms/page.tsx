import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function Terms() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />
      <main className="flex-grow max-w-4xl mx-auto px-4 py-12 w-full prose prose-slate">
        <h1>Terms of Service</h1>
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2>1. Acceptance of Terms</h2>
        <p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p>

        <h2>2. Use License</h2>
        <p>
          Permission is granted to temporarily use the materials (information or software) on GeoTagHQ&apos;s website for personal, non-commercial transitory viewing only.
        </p>

        <h2>3. Use of Metadata & SEO</h2>
        <p>
          The tool is provided &quot;as-is&quot;. Metadata compatibility may vary by platform, and some social media or platforms strip EXIF data upon upload. Geo-tagging and EXIF SEO metadata do not guarantee any specific ranking on Google or local search results.
        </p>

        <h2>4. Limitations</h2>
        <p>
          In no event shall GeoTagHQ or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on the website.
        </p>
      </main>
      <Footer />
    </div>
  );
}
