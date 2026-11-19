import type { Metadata } from 'next';
import { getMessages } from '@/lib/messages';
import { LANGUAGES, UI_LABELS } from '@/lib/constants';
import { buildToolPageContent } from '@/lib/content/toolPage';
import ToolPageContent from '@/components/tool/ToolPageContent';
import { CONTENT_UPDATED, OG_IMAGE, SITE_URL, ogAlternates, ogLocale } from '@/lib/site';

export { SITE_URL };
const TOOL_PATH = '/free-geo-tagging-tool';

export const toolUrl = (lang: string) =>
  lang === 'en' ? `${SITE_URL}${TOOL_PATH}` : `${SITE_URL}/${lang}${TOOL_PATH}`;

function languageAlternates() {
  const langs: Record<string, string> = {};
  for (const l of LANGUAGES) langs[l.code] = toolUrl(l.code);
  langs['x-default'] = toolUrl('en');
  return langs;
}

export async function toolMetadata(lang: string): Promise<Metadata> {
  const messages = await getMessages(lang);
  const m = messages.tool || {};
  const content = buildToolPageContent(lang, messages, UI_LABELS[lang] || UI_LABELS.en);
  const title = content.metaTitle || m.metaTitle;
  const description = content.metaDescription || m.metaDesc;
  const url = toolUrl(lang);

  return {
    // `absolute` stops the layout template from adding "| PinPixl" twice.
    title: { absolute: `${title} | PinPixl` },
    description,
    alternates: { canonical: url, languages: languageAlternates() },
    openGraph: {
      title,
      description,
      type: 'website',
      url,
      siteName: 'PinPixl',
      locale: ogLocale(lang),
      alternateLocale: ogAlternates(lang, LANGUAGES.map((l) => l.code)),
      images: [OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [OG_IMAGE.url],
    },
    robots: { index: true, follow: true },
  };
}

export async function ToolPage({ lang }: { lang: string }) {
  const messages = await getMessages(lang);
  const labels = UI_LABELS[lang] || UI_LABELS.en;
  const content = buildToolPageContent(lang, messages, labels);
  const url = toolUrl(lang);

  const graph: any[] = [
    {
      '@type': 'WebApplication',
      '@id': `${url}#app`,
      name: content.h1,
      alternateName: 'PinPixl Geo Tagging Tool',
      image: `${SITE_URL}${OG_IMAGE.url}`,
      isPartOf: { '@id': `${SITE_URL}/#website` },
      url,
      inLanguage: lang,
      applicationCategory: 'MultimediaApplication',
      operatingSystem: 'Any (web browser)',
      isAccessibleForFree: true,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      description: content.subtitle,
      publisher: { '@id': `${SITE_URL}/#organization` },
    },
    {
      '@type': 'WebPage',
      '@id': `${url}#webpage`,
      url,
      name: content.h1,
      inLanguage: lang,
      dateModified: CONTENT_UPDATED,
      author: { '@id': `${SITE_URL}/#founder` },
      isPartOf: { '@id': `${SITE_URL}/#website` },
      mainEntity: { '@id': `${url}#app` },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: messages.common?.home || 'Home', item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: content.h1, item: url },
      ],
    },
  ];

  if (content.steps.length) {
    graph.push({
      '@type': 'HowTo',
      name: content.stepsTitle,
      totalTime: 'PT1M',
      step: content.steps.map((s, i) => ({
        '@type': 'HowToStep',
        position: i + 1,
        name: s.title,
        text: s.desc,
        url: `${url}#how-it-works`,
      })),
    });
  }

  if (content.faqs.length) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: content.faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    });
  }

  const jsonLd = { '@context': 'https://schema.org', '@graph': graph };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolPageContent messages={messages} lang={lang} content={content} />
    </>
  );
}


