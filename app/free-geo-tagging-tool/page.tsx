import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import GeoTaggingTool from '@/components/tool/GeoTaggingTool';
import { ShieldCheck, Map, Image as ImageIcon, Search } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Free Geo Tagging Tool - Add GPS to Photos Online',
  description: 'Use a free geo tagging tool to add GPS coordinates, location data and local SEO metadata to photos online. Upload, pin a location, edit metadata and download optimized images.',
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL ? `${process.env.NEXT_PUBLIC_SITE_URL}/free-geo-tagging-tool` : 'https://ais-pre-mmjuvtpvcoditfinnw5al2-488794791272.asia-southeast1.run.app/free-geo-tagging-tool',
  },
  openGraph: {
    title: 'Free Geo Tagging Tool - Add GPS to Photos Online',
    description: 'Add GPS coordinates and local SEO metadata to photos with a free online geo tagging tool. Choose a map location, edit metadata and download optimized images.',
    type: 'website',
    url: '/free-geo-tagging-tool',
    images: ['/og/free-geo-tagging-tool.svg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Geo Tagging Tool - Add GPS to Photos Online',
    description: 'Add GPS coordinates and local SEO metadata to photos with a free online geo tagging tool. Choose a map location, edit metadata and download optimized images.',
    images: ['/og/free-geo-tagging-tool.svg'],
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function FreeGeoTaggingToolPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "name": "Free Geo Tagging Tool",
        "url": process.env.NEXT_PUBLIC_SITE_URL ? `${process.env.NEXT_PUBLIC_SITE_URL}/free-geo-tagging-tool` : "https://ais-pre-mmjuvtpvcoditfinnw5al2-488794791272.asia-southeast1.run.app/free-geo-tagging-tool",
        "applicationCategory": "MultimediaApplication",
        "operatingSystem": "Web",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "description": "Use a free geo tagging tool to add GPS coordinates, location data and local SEO metadata to photos online. Upload, pin a location, edit metadata and download optimized images.",
        "featureList": [
          "Add GPS coordinates to photos",
          "Edit local SEO metadata",
          "Select location on map",
          "Add business, city, district and country metadata",
          "Download optimized images"
        ]
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": process.env.NEXT_PUBLIC_SITE_URL ? process.env.NEXT_PUBLIC_SITE_URL : "https://ais-pre-mmjuvtpvcoditfinnw5al2-488794791272.asia-southeast1.run.app"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Free Geo Tagging Tool",
            "item": process.env.NEXT_PUBLIC_SITE_URL ? `${process.env.NEXT_PUBLIC_SITE_URL}/free-geo-tagging-tool` : "https://ais-pre-mmjuvtpvcoditfinnw5al2-488794791272.asia-southeast1.run.app/free-geo-tagging-tool"
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is a free geo tagging tool?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "A free geo tagging tool is a software or web application that allows you to embed GPS location data (latitude and longitude) into the EXIF metadata of your image files, helping map the exact location where the photo was taken or where a subject is located."
            }
          },
          {
            "@type": "Question",
            "name": "How do I add GPS location to a photo?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Upload your photo to our online tool, select a location on the interactive map or enter coordinates manually, and click 'Write GPS & Metadata'. The tool embeds the data directly into the file and lets you download it."
            }
          },
          {
            "@type": "Question",
            "name": "Does this tool upload my photos to your servers?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No. Our application leverages modern web features to process the EXIF data entirely within your browser memory. We never see, store, or transmit your files permanently. Server processing is used only momentarily for compatibility if requested, and files are not saved."
            }
          },
          {
            "@type": "Question",
            "name": "Which image formats support GPS EXIF writing?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "JPG/JPEG offers the best compatibility for GPS and SEO metadata. PNG, WebP, AVIF, and HEIC may have limited metadata support depending on the platform."
            }
          },
          {
            "@type": "Question",
            "name": "Can I geotag multiple photos at once?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes! Our free tool acts as a batch EXIF GPS editor. Upload up to 10 images at once, apply metadata, and download all modified photos in a convenient ZIP file."
            }
          },
          {
            "@type": "Question",
            "name": "Does geotagging photos really help local SEO?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "While Google's algorithms constantly evolve, SEO professionals often rely on geotagged images directly uploaded to Google Business Profile to provide clear geographic signals. Our tool also adds local SEO metadata like business name and location."
            }
          },
          {
            "@type": "Question",
            "name": "Can I manually enter latitude and longitude?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. The manual coordinate input lets you paste exact coordinates directly if you already know them, instantly updating the map and EXIF injection properties."
            }
          }
        ]
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <Header />
        
        <main className="flex-grow">
          <section className="bg-white border-b border-slate-200 pt-16 pb-20">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
                Free Geo Tagging Tool
              </h1>
              <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                Add GPS location to photos in seconds. Edit EXIF metadata, plot coordinates on a map, and ready your images for local SEO—100% free and processed privately in your browser.
              </p>
            </div>
          </section>

          <section className="py-12 px-4 sm:px-6 lg:px-8 -mt-8">
            <GeoTaggingTool />
          </section>

          <section className="py-16 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                <div className="flex flex-col gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg w-fit">
                    <ShieldCheck className="w-6 h-6 text-blue-700" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">A Free Geo Tagging Tool Built for Privacy</h2>
                  <p className="text-slate-600 leading-relaxed">
                    Most online geotagging tools force you to upload your sensitive images to their servers. 
                    Our tool utilizes advanced web technologies to parse and write EXIF metadata directly inside your browser. 
                    Your photos never leave your device, ensuring total privacy.
                  </p>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="bg-emerald-100 p-3 rounded-lg w-fit">
                     <Search className="w-6 h-6 text-emerald-700" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Geotag Images for Local SEO</h2>
                  <p className="text-slate-600 leading-relaxed">
                    Uploading photos to Google Business Profile (GBP) or a local business directory? 
                    Adding accurate location metadata helps establish geographical relevance. 
                    Geotag photos online before posting to signal exactly where your business operates.
                  </p>
                </div>
              </div>

              <div id="how-it-works" className="prose prose-slate max-w-none mt-16">
                <h2 className="text-3xl font-bold text-slate-900 mb-6">How the Free Geo Tagging Tool Works</h2>
                <p className="text-slate-600 mb-6">
                  Adding GPS coordinates to a JPG photo doesn&apos;t require downloading heavy software. 
                  Our GPS EXIF editor simplifies the process into a few quick steps.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-2">1. Upload Image</h3>
                    <p className="text-sm text-slate-600">Drag and drop your JPG/JPEG files into the dropzone. We instantly read any existing metadata.</p>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-2">2. Pin Location</h3>
                    <p className="text-sm text-slate-600">Search an address, drag the map marker, or manually enter latitude and longitude coordinates.</p>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-2">3. Download</h3>
                    <p className="text-sm text-slate-600">Click write, and we embed the exact GPS location into the photo&apos;s EXIF data. Download instantly.</p>
                  </div>
                </div>

                <h2 className="text-3xl font-bold text-slate-900 mb-6">What is GPS EXIF Data?</h2>
                <p className="text-slate-600 mb-6">
                  EXIF, short for Exchangeable Image File Format, is a standardized tag structure used by digital cameras and smartphones to store 
                  important contextual information alongside the image pixels. This data includes camera model, exposure settings, date taken, and 
                  crucially, <strong>GPS latitude and longitude coordinates</strong>. By updating this metadata, you embed a permanent location marker into the file itself.
                </p>

                <h2 className="text-3xl font-bold text-slate-900 mb-6">Why Use an Online Geotagging Tool?</h2>
                <ul className="list-disc pl-6 space-y-3 text-slate-600 mb-8">
                  <li><strong>Local Business SEO:</strong> Improve your business&apos;s local search presence by posting geographically tagged images.</li>
                  <li><strong>Travel Blogs:</strong> Automatically categorize and map out photos on your blog or personal website.</li>
                  <li><strong>Real Estate:</strong> Guarantee property photos contain undeniable metadata linking them to the physical address.</li>
                  <li><strong>Photo Organization:</strong> Fix missing GPS tags from cameras that don&apos;t have built-in geolocation.</li>
                  <li><strong>Batch Operations:</strong> Geotag multiple photos at once with our batch processing feature, saving hours of manual data entry.</li>
                </ul>
              </div>
            </div>
          </section>

          <section id="faq" className="py-16 bg-slate-50 border-t border-slate-200">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">Frequently Asked Questions</h2>
              <div className="space-y-6">
                
                {[
                  { q: "What is a free geo tagging tool?", a: "A free geo tagging tool is a software or web application that allows you to embed GPS location data (latitude and longitude) into the EXIF metadata of your image files, helping map the exact location where the photo was taken or where a subject is located." },
                  { q: "How do I add GPS location to a photo?", a: "Upload your photo to our online tool, select a location on the interactive map or enter coordinates manually, and click 'Write GPS & Metadata'. The tool embeds the data directly into the file and lets you download it." },
                  { q: "Does this tool upload my photos to your servers?", a: "No. Our application leverages modern web features to process the EXIF data entirely within your browser memory. We never see, store, or transmit your files permanently. Server processing is used only momentarily for compatibility if requested, and files are not saved." },
                  { q: "Which image formats support GPS EXIF writing?", a: "JPG/JPEG offers the best compatibility for GPS and SEO metadata. PNG, WebP, AVIF, and HEIC may have limited metadata support depending on the platform." },
                  { q: "Can I geotag multiple photos at once?", a: "Yes! Our free tool acts as a batch EXIF GPS editor. Upload up to 10 images at once, apply metadata, and download all modified photos in a convenient ZIP file." },
                  { q: "Does geotagging photos really help local SEO?", a: "While Google's algorithms constantly evolve, SEO professionals often rely on geotagged images directly uploaded to Google Business Profile to provide clear geographic signals. Our tool also adds local SEO metadata like business name and location." },
                  { q: "Can I manually enter latitude and longitude?", a: "Yes. The manual coordinate input lets you paste exact coordinates directly if you already know them, instantly updating the map and EXIF injection properties." }
                ].map((faq, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="font-bold text-lg text-slate-900 mb-2">{faq.q}</h3>
                    <p className="text-slate-600">{faq.a}</p>
                  </div>
                ))}

              </div>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </>
  );
}
