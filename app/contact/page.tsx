import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function Contact() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />
      <main className="flex-grow max-w-4xl mx-auto px-4 py-12 w-full prose prose-slate">
        <h1>Contact Us</h1>
        <p>If you have questions about the Free Geo Tagging Tool, please reach out to us.</p>
        <div className="mt-8 p-6 bg-white border border-slate-200 rounded-lg shadow-sm">
          <p className="font-medium text-slate-900 mb-2">Email Technical Support</p>
          <p className="text-slate-600">support@example-geotaghq.com</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
