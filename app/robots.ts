import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ais-pre-mmjuvtpvcoditfinnw5al2-488794791272.asia-southeast1.run.app';
  
  return {
    rules: [
      {
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
          '/*/_next/',
          '/*.json$',
          '/wp-admin/',
          '/cart/',
          '/checkout/',
          '/account/',
          '/login/',
          '/search/',
          '/tag/',
          '/?s=',
          '/cdn-cgi/'
        ],
      },
      {
        userAgent: 'GPTBot',
        disallow: ['/api/', '/admin/'],
      },
      {
        userAgent: 'CCBot',
        disallow: ['/'], // Common Crawl usually not needed for SEO ranking
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
