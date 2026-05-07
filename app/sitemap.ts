import { MetadataRoute } from 'next';
import { LANGUAGES } from '@/lib/constants';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ais-pre-mmjuvtpvcoditfinnw5al2-488794791272.asia-southeast1.run.app';
  const lastModified = new Date();

  const toolPages = LANGUAGES.map(lang => ({
    url: lang.code === 'en' ? `${baseUrl}/free-geo-tagging-tool` : `${baseUrl}/${lang.code}/free-geo-tagging-tool`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: 1.0,
  }));

  return [
    ...toolPages,
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/disclaimer`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    }
  ];
}
