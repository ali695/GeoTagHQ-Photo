import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://geotaghq.com';
  
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
