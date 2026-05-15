import type {Metadata} from 'next';
import { headers } from 'next/headers';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: {
    template: '%s | GeoTagHQ',
    default: 'GeoTagHQ - Free Geo Tagging Tool',
  },
  description: 'Free online tool to add GPS location and local SEO metadata to your photos. Edit EXIF data safely.',
  keywords: ['Geo Tagging', 'EXIF Editor', 'GPS Location', 'Local SEO', 'Photo Metadata', 'Add location to photo', 'GeoTagHQ'],
  authors: [{ name: 'GeoTagHQ' }],
  publisher: 'GeoTagHQ',
  metadataBase: new URL('https://geotaghq.com'),
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

  const siteUrl = 'https://geotaghq.com';
  const fullUrl = `${siteUrl}${pathname}`;

  const supportedLanguages = ['en', 'de', 'es', 'pt', 'fr', 'it', 'nl', 'tr', 'ar', 'hi', 'id', 'ja', 'ko'];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "GeoTagHQ",
    "url": siteUrl,
    "logo": `${siteUrl}/icon.svg`,
    "description": "Professional free online geo tagging tool for photographers and local SEO experts. Add GPS coordinates and advanced metadata to photos.",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <html lang={lang} dir={dir} suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossOrigin="" />
        
        {/* Hreflang Tags */}
        <link rel="alternate" href={siteUrl} hrefLang="x-default" />
        {supportedLanguages.map(l => (
          <link key={l} rel="alternate" href={`${siteUrl}/${l}${pathname.replace(new RegExp(`^/${lang}`), '')}`} hrefLang={l} />
        ))}

        {/* Global OpenGraph Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={fullUrl} />
        <meta property="og:site_name" content="GeoTagHQ" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@geotaghq" />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
