import type { Metadata, Viewport } from 'next';
import { headers } from 'next/headers';
import { Inter, Plus_Jakarta_Sans, Instrument_Serif, JetBrains_Mono } from 'next/font/google';
import './globals.css'; // Global styles
import MotionObserver from '@/components/motion/MotionObserver';
import { FOUNDER, OG_IMAGE, SITE_URL } from '@/lib/site';

// Self-hosted by Next.js at build time (no request to Google from visitors).
const inter = Inter({ subsets: ['latin', 'latin-ext'], variable: '--font-inter', display: 'swap' });
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin', 'latin-ext'], variable: '--font-jakarta', display: 'swap' });
// Editorial accents: serif for display italics, mono for coordinate-style labels.
const serif = Instrument_Serif({ subsets: ['latin', 'latin-ext'], weight: '400', style: ['normal', 'italic'], variable: '--font-instrument', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin', 'latin-ext'], variable: '--font-jbmono', display: 'swap' });

export const viewport: Viewport = {
  themeColor: "#f4f1ea",
};

export const metadata: Metadata = {
  title: {
    template: '%s | PinPixl',
    default: 'PinPixl – Free Photo Tools',
  },
  description: 'Free photo tools: geotag photos, view and remove EXIF data, find where a photo was taken, convert HEIC and WebP, and compress images.',
  keywords: ['Geo Tagging', 'EXIF Editor', 'GPS Location', 'Local SEO', 'Photo Metadata', 'Add location to photo', 'PinPixl'],
  authors: [{ name: FOUNDER.name, url: FOUNDER.linkedin }],
  creator: FOUNDER.name,
  publisher: 'PinPixl',
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" }
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
    ]
  },
  manifest: "/site.webmanifest",
  applicationName: "PinPixl",
  openGraph: { siteName: "PinPixl", type: "website", images: [OG_IMAGE] },
  twitter: { card: "summary_large_image", images: [OG_IMAGE.url] },
};

export default async function RootLayout({children}: {children: React.ReactNode}) {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';
  
  let lang = 'en';
  let dir = 'ltr';
  
  const match = pathname.match(/^\/([a-z]{2})(?:\/|$)/);
  if (match) {
    const locale = match[1];
    const supported = ['de', 'es', 'pt', 'fr', 'it', 'nl', 'tr', 'ar', 'hi', 'id', 'ja', 'ko'];
    if (supported.includes(locale)) {
      lang = locale;
      if (lang === 'ar') dir = 'rtl';
    }
  }

  const siteUrl = SITE_URL;

  // Site-wide identity. Page-level schema (WebApplication, FAQ, HowTo) lives on each page.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        "name": "PinPixl",
        "url": siteUrl,
        "logo": `${siteUrl}/brand/pinpixl-icon-512.png`,
        "description": "Free online photo tools for geotagging, EXIF metadata, image conversion and compression.",
        "founder": { "@id": `${siteUrl}/#founder` },
      },
      {
        "@type": "Person",
        "@id": `${siteUrl}/#founder`,
        "name": FOUNDER.name,
        "jobTitle": FOUNDER.jobTitle,
        "url": `${siteUrl}/about`,
        "sameAs": [FOUNDER.linkedin],
        "knowsAbout": FOUNDER.knowsAbout,
        "worksFor": { "@id": `${siteUrl}/#organization` },
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        "name": "PinPixl",
        "url": siteUrl,
        "description": "Free photo tools: geotag photos, view and remove EXIF data, convert HEIC and WebP, compress images.",
        "inLanguage": ["en", "de", "es", "fr", "pt", "it", "nl", "tr", "id", "ja", "ko", "ar", "hi"],
        "publisher": { "@id": `${siteUrl}/#organization` },
      },
    ],
  };

  return (
    <html lang={lang} dir={dir} className={`${inter.variable} ${jakarta.variable} ${serif.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossOrigin="" />
        {/* Marks JS as available before first paint, so scroll-reveal styles only apply when they can be undone.
            Without JS (or for crawlers) every element simply stays visible. */}
        <script dangerouslySetInnerHTML={{ __html: "var d=document.documentElement;d.classList.add('js');setTimeout(function(){if(!window.__motion)d.classList.add('motion-failed')},3000)" }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning>
        {children}
        <MotionObserver />
      </body>
    </html>
  );
}
