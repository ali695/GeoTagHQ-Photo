import { MetadataRoute } from 'next';
import { LANGUAGES } from '@/lib/constants';
import { TOOLS } from '@/lib/tools';
import { TOOL_LANGS, pathFor, toolLangs } from '@/lib/i18n';
import { SITE_URL } from '@/lib/site';

// Only list URLs that return 200 and are canonical.
// Update LAST_UPDATED when page content changes.
const LAST_UPDATED = new Date('2026-11-19');

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL;
  const toolUrl = (code: string) =>
    code === 'en' ? `${baseUrl}/free-geo-tagging-tool` : `${baseUrl}/${code}/free-geo-tagging-tool`;

  const languages: Record<string, string> = {};
  for (const l of LANGUAGES) languages[l.code] = toolUrl(l.code);
  languages['x-default'] = toolUrl('en');

  const toolPages: MetadataRoute.Sitemap = LANGUAGES.map((l) => ({
    url: toolUrl(l.code),
    lastModified: LAST_UPDATED,
    changeFrequency: 'weekly',
    priority: l.code === 'en' ? 1.0 : 0.8,
    alternates: { languages },
  }));

  const staticPages: MetadataRoute.Sitemap = [
    { path: '/about', priority: 0.5 },
    { path: '/contact', priority: 0.4 },
    { path: '/privacy-policy', priority: 0.2 },
    { path: '/terms', priority: 0.2 },
    { path: '/disclaimer', priority: 0.2 },
  ].map(({ path, priority }) => ({
    url: `${baseUrl}${path}`,
    lastModified: LAST_UPDATED,
    changeFrequency: 'yearly',
    priority,
  }));

  // Every other tool, in every language it exists in, with hreflang alternates.
  const otherTools: MetadataRoute.Sitemap = TOOLS.filter((t) => !t.localized).flatMap((t) => {
    const langs = toolLangs(t.id);
    const alternates: Record<string, string> = {};
    for (const l of langs) alternates[l] = `${baseUrl}${pathFor(l, t.path)}`;
    alternates['x-default'] = `${baseUrl}${t.path}`;
    return langs.map((l) => ({
      url: `${baseUrl}${pathFor(l, t.path)}`,
      lastModified: LAST_UPDATED,
      changeFrequency: 'monthly' as const,
      priority: l === 'en' ? (t.inMenu ? 0.9 : 0.8) : 0.7,
      alternates: { languages: alternates },
    }));
  });

  // Tools hubs: / and /de, /es, ...
  const hubAlternates: Record<string, string> = { en: `${baseUrl}/`, 'x-default': `${baseUrl}/` };
  for (const l of TOOL_LANGS) hubAlternates[l] = `${baseUrl}/${l}`;
  const hubs: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: LAST_UPDATED, changeFrequency: 'weekly', priority: 1.0, alternates: { languages: hubAlternates } },
    ...TOOL_LANGS.map((l) => ({ url: `${baseUrl}/${l}`, lastModified: LAST_UPDATED, changeFrequency: 'weekly' as const, priority: 0.8, alternates: { languages: hubAlternates } })),
  ];

  return [
    ...hubs,
    ...toolPages,
    ...otherTools,
    ...staticPages,
  ];
}
