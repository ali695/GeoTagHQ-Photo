import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = SITE_URL;
  
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
