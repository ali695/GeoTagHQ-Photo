import { Metadata } from 'next';
import { getMessages } from '@/lib/messages';
import ToolPageContent from '@/components/tool/ToolPageContent';
import { LANGUAGES } from '@/lib/constants';

type Props = {
  params: Promise<{ lang: string }>;
}

export function generateStaticParams() {
  return LANGUAGES.filter(l => l.code !== 'en').map((lang) => ({
    lang: lang.code,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await params;
  const messages = await getMessages(p.lang);
  const m = messages.tool || {};
  
  const siteUrl = 'https://geotaghq.com';
  
  return {
    title: m.metaTitle,
    description: m.metaDesc,
    keywords: m.metaKeywords ? m.metaKeywords.split(',').map((k: string) => k.trim()) : undefined,
    openGraph: {
      title: m.metaTitle,
      description: m.metaDesc,
      type: 'website',
      url: `/${p.lang}/free-geo-tagging-tool`,
      images: ['/og/free-geo-tagging-tool.svg'],
    },
    twitter: {
      card: 'summary_large_image',
      title: m.metaTitle,
      description: m.metaDesc,
      images: ['/og/free-geo-tagging-tool.svg'],
    },
  };
}

export default async function LocalizedToolPage({ params }: Props) {
  const p = await params;
  const messages = await getMessages(p.lang);
  const faqs = messages.faq || [];
  
  const siteUrl = 'https://geotaghq.com';

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "name": messages.tool?.h1 || "Free Geo Tagging Tool",
        "url": `${siteUrl}/${p.lang}/free-geo-tagging-tool`,
        "applicationCategory": "MultimediaApplication",
        "operatingSystem": "Web",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "description": messages.tool?.metaDesc,
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": messages.common?.home || "Home",
            "item": siteUrl
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": messages.tool?.h1 || "Free Geo Tagging Tool",
            "item": `${siteUrl}/${p.lang}/free-geo-tagging-tool`
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": faqs.map((faq: any) => ({
          "@type": "Question",
          "name": faq.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.a
          }
        }))
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ToolPageContent messages={messages} lang={p.lang} />
    </>
  );
}
