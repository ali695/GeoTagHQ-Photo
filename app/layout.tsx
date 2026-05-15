import type { Metadata, Viewport } from 'next';
import { headers } from 'next/headers';
import './globals.css'; // Global styles

const SITE_URL = 'https://geotaghq.com';

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: '%s | GeoTagHQ',
    default: 'GeoTagHQ - Free Geo Tagging Tool & EXIF Editor',
  },
  description: 'Professional free online tool to add GPS location and local SEO metadata to your photos. Edit EXIF data safely for better local search rankings.',
  keywords: ['Geo Tagging', 'EXIF Editor', 'GPS Location', 'Local SEO', 'Photo Metadata', 'Add location to photo', 'GeoTagHQ', 'Image GPS tagger'],
  authors: [{ name: 'GeoTagHQ' }],
  publisher: 'GeoTagHQ',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    siteName: 'GeoTagHQ',
    url: SITE_URL,
    title: 'GeoTagHQ - Free Geo Tagging Tool & EXIF Editor',
    description: 'Professional free online tool to add GPS location and local SEO metadata to your photos. Edit EXIF data safely.',
    images: [{
      url: '/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'GeoTagHQ Preview',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@geotaghq',
    creator: '@geotaghq',
    title: 'GeoTagHQ - Free Geo Tagging Tool & EXIF Editor',
    description: 'Professional free online tool to add GPS location and local SEO metadata to your photos. Edit EXIF data safely.',
    images: ['/og-image.jpg'],
  },
  manifest: '/site.webmanifest',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

export default async function RootLayout({children}: {children: React.ReactNode}) {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';
  
  let lang = 'en';
  let dir = 'ltr';
  
  const match = pathname.match(/^\/([a-z]{2})(?:\/|$)/);
  const supported = ['de', 'es', 'pt', 'fr', 'it', 'nl', 'tr', 'ar', 'hi', 'id', 'ja', 'ko', 'zh'];
  let currentLangCode = 'en';
  if (match) {
    const locale = match[1];
    if (supported.includes(locale)) {
      lang = locale;
      currentLangCode = locale;
      if (lang === 'ar') dir = 'rtl';
    }
  }

  const fullUrl = `${SITE_URL}${pathname}`;
  
  // Clean pathname for hreflang logic
  let pathWithoutLang = pathname;
  if (currentLangCode !== 'en' && pathname.startsWith(`/${currentLangCode}`)) {
    pathWithoutLang = pathname.substring(currentLangCode.length) || '/';
  }

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "GeoTagHQ",
    "url": SITE_URL,
    "logo": `${SITE_URL}/icon.svg`,
    "sameAs": [
      "https://twitter.com/geotaghq"
    ]
  };

  const softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "GeoTagHQ",
    "url": SITE_URL,
    "logo": `${SITE_URL}/icon.svg`,
    "description": "Professional free online geo tagging tool for photographers and local SEO experts. Add GPS coordinates and advanced metadata to photos.",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": SITE_URL,
    "name": "GeoTagHQ",
    "description": "Professional free online geo tagging tool",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${SITE_URL}/free-geo-tagging-tool?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang={lang} dir={dir} suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossOrigin="" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={fullUrl} />

        {/* Hreflang Tags */}
        <link rel="alternate" href={`${SITE_URL}${pathWithoutLang === '/' ? '' : pathWithoutLang}`} hrefLang="x-default" />
        <link rel="alternate" href={`${SITE_URL}${pathWithoutLang === '/' ? '' : pathWithoutLang}`} hrefLang="en" />
        {supported.map(l => {
          const lPath = pathWithoutLang === '/' ? `/${l}` : `/${l}${pathWithoutLang}`;
          return (
            <link key={l} rel="alternate" href={`${SITE_URL}${lPath}`} hrefLang={l} />
          );
        })}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
