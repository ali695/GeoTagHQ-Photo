import type { Metadata, Viewport } from 'next';
import { headers } from 'next/headers';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css'; // Global styles
import { OG_IMAGE, SITE_URL } from '@/lib/site';

// Self-hosted by Next.js at build time (no request to Google from visitors).
const inter = Inter({ subsets: ['latin', 'latin-ext'], variable: '--font-inter', display: 'swap' });
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin', 'latin-ext'], variable: '--font-jakarta', display: 'swap' });

export const viewport: Viewport = {
  themeColor: "#4f46e5",
};

export const metadata: Metadata = {
  title: {
    template: '%s | PinPixl',
    default: 'PinPixl - Free Geo Tagging Tool',
  },
  description: 'Free online tool to add GPS location and local SEO metadata to your photos. Edit EXIF data safely.',
  keywords: ['Geo Tagging', 'EXIF Editor', 'GPS Location', 'Local SEO', 'Photo Metadata', 'Add location to photo', 'PinPixl'],
  authors: [{ name: 'PinPixl' }],
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
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        "name": "PinPixl",
        "url": siteUrl,
        "publisher": { "@id": `${siteUrl}/#organization` },
      },
    ],
  };

  return (
    <html lang={lang} dir={dir} className={`${inter.variable} ${jakarta.variable}`} suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossOrigin="" />
        
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
