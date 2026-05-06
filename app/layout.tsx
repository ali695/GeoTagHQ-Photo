import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: {
    template: '%s | GeoTagHQ',
    default: 'GeoTagHQ - Free Geo Tagging Tool',
  },
  description: 'Free online tool to add GPS location and local SEO metadata to your photos. Edit EXIF data safely.',
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL) : new URL('https://ais-pre-mmjuvtpvcoditfinnw5al2-488794791272.asia-southeast1.run.app'),
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
