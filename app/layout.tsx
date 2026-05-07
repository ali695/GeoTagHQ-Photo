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
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL) : new URL('https://ais-pre-mmjuvtpvcoditfinnw5al2-488794791272.asia-southeast1.run.app'),
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

  return (
    <html lang={lang} dir={dir} suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossOrigin="" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
