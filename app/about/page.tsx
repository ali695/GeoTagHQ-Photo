import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function About() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />
      <main className="flex-grow max-w-4xl mx-auto px-4 py-12 w-full prose prose-slate">
        <h1>About GeoTagHQ</h1>
        <p>
          GeoTagHQ started as a simple, free tool to help photographers, real estate agents, and local business owners add location metadata to their photos quickly and privately.
        </p>
        <p>
          Unlike heavy desktop software or privacy-invasive online applications, our Free Geo Tagging Tool leverages modern web browsers to keep data as localized as possible while outputting high compatibility formats.
        </p>
        <h2>Our Mission</h2>
        <p>
          We aim to provide the most accessible, fastest, and private way to edit EXIF GPS tags online without compromising image quality or user privacy.
        </p>
      </main>
      <Footer />
    </div>
  );
}
