import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ais-pre-mmjuvtpvcoditfinnw5al2-488794791272.asia-southeast1.run.app';
  
  return {
    rules: {
      userAgent: '*',
      allow: [
        '/',
        '/free-geo-tagging-tool',
        '/privacy-policy',
        '/terms',
        '/contact',
        '/disclaimer',
        '/about',
      ],
      disallow: [
        '/api/',
        '/admin/',
        '/test/',
        '/debug/',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
