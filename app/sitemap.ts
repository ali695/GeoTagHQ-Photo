import { MetadataRoute } from 'next';
import { LANGUAGES } from '@/lib/constants';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://geotaghq.com';
  const lastModified = new Date("2026-05-15T13:35:58.744Z");

  const toolAlternates = LANGUAGES.reduce((acc, lang) => {
    acc[lang.code] = lang.code === 'en' ? `${baseUrl}/free-geo-tagging-tool` : `${baseUrl}/${lang.code}/free-geo-tagging-tool`;
    return acc;
  }, {} as Record<string, string>);
  
  toolAlternates['x-default'] = `${baseUrl}/free-geo-tagging-tool`;

  const toolPages = LANGUAGES.map(lang => ({
    url: lang.code === 'en' ? `${baseUrl}/free-geo-tagging-tool` : `${baseUrl}/${lang.code}/free-geo-tagging-tool`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: lang.code === 'en' ? 1.0 : 0.8,
    alternates: {
      languages: toolAlternates,
    }
  }));

  return [
    {
      url: `${baseUrl}/`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    ...toolPages,
    {
      url: `${baseUrl}/how-it-works`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/geotagging-for-local-seo`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/disclaimer`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    }
  ];
}
