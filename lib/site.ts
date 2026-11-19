// Site identity in one place.
//
// The site address comes from NEXT_PUBLIC_SITE_URL. Until pinpixl.com is bought and
// connected in Vercel it stays on geotaghq.com, so canonical URLs always point at a
// domain that actually serves the site. When the new domain is live, set
// NEXT_PUBLIC_SITE_URL=https://pinpixl.com in Vercel and redeploy.
export const SITE_NAME = 'PinPixl';
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://geotaghq.com').replace(/\/+$/, '');
export const SITE_HOST = new URL(SITE_URL).host;
export const BRAND_COLOR = '#4f46e5';
export const OG_IMAGE = { url: '/og/pinpixl-og.png', width: 1200, height: 630, alt: 'PinPixl – free photo tools' };

/** Date the page content was last reviewed (shown in bylines and as dateModified in schema). */
export const CONTENT_UPDATED = '2026-11-19';
export const updatedLabel = (lang: string) =>
  new Intl.DateTimeFormat(lang === 'en' ? 'en-US' : lang, { month: 'long', year: 'numeric' }).format(new Date(CONTENT_UPDATED));

/** The person behind PinPixl. Used on /about, in site-wide schema (E-E-A-T) and in llms.txt. */
export const FOUNDER = {
  name: 'Ali Haider',
  jobTitle: 'SEO Specialist',
  linkedin: 'https://www.linkedin.com/in/ali-haider-seo-consultant/',
  knowsAbout: ['Search engine optimization', 'Technical SEO', 'Local SEO', 'Image SEO', 'Photo metadata (EXIF, IPTC, XMP)', 'Browser extensions', 'Web performance'],
} as const;

/** Open Graph locale for each site language (og:locale / og:locale:alternate). */
export const OG_LOCALE: Record<string, string> = {
  en: 'en_US', de: 'de_DE', es: 'es_ES', fr: 'fr_FR', pt: 'pt_BR', it: 'it_IT', nl: 'nl_NL',
  tr: 'tr_TR', id: 'id_ID', ja: 'ja_JP', ko: 'ko_KR', ar: 'ar_SA', hi: 'hi_IN',
};
export const ogLocale = (lang: string) => OG_LOCALE[lang] || 'en_US';
/** og:locale:alternate values: every other language the page exists in. */
export const ogAlternates = (lang: string, langs: string[]) => langs.filter((l) => l !== lang).map(ogLocale);
