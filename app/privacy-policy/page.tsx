import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />
      <main className="flex-grow max-w-4xl mx-auto px-4 py-12 w-full prose prose-slate">
        <h1>Privacy Policy</h1>
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2>1. Information We Collect</h2>
        <p>
          We do not permanently store your photos. Some image processing (such as applying advanced SEO EXIF/IPTC metadata) is performed momentarily on our secure servers to ensure broad compatibility. 
          The files are immediately deleted after processing. When you perform a location search, your query may be sent to third-party geocoding APIs (e.g., OpenStreetMap) to retrieve coordinates.
        </p>

        <h2>2. Data Processing Guarantee</h2>
        <p>
          The files you upload to the Free Geo Tagging Tool are used solely to inject your requested metadata. We do not permanently cache, distribute, or maintain copies of your image files or the metadata you provide.
        </p>

        <h2>3. Third-party Services</h2>
        <p>
          We use OpenStreetMap Nominatim for geocoding services. Their privacy policy dictates how they handle geocoding queries. We may also use standard analytics to monitor website traffic.
        </p>

        <h2>4. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us via the Contact page.</p>
      </main>
      <Footer />
    </div>
  );
}
