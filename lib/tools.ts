// Registry of every tool on PinPixl. The header menu, footer, homepage and
// "More free tools" sections all read from this list.
import { AI_ENABLED } from './features';

export type ToolIcon = 'mapPin' | 'scan' | 'eraser' | 'fileImage' | 'minimize' | 'crosshair' | 'type' | 'repeat' | 'locate' | 'scaling' | 'fileText' | 'gauge';
export type ToolCategory = 'convert' | 'location' | 'optimize';

export type ToolEntry = {
  id: string;
  /** Path without language prefix. */
  path: string;
  icon: ToolIcon;
  category: ToolCategory;
  /** English name and description. */
  name: string;
  desc: string;
  /** Languages with a translated page. Tools without this exist in English only. */
  localized?: boolean;
  /** Shown in the header menu (converters are grouped behind the Image Converter). */
  inMenu?: boolean;
};

export const CONVERTER_PAIRS = [
  ['heic', 'jpg'], ['heic', 'png'], ['webp', 'jpg'], ['webp', 'png'], ['jpg', 'webp'], ['png', 'webp'],
  ['png', 'jpg'], ['jpg', 'png'], ['avif', 'jpg'], ['avif', 'png'], ['svg', 'png'],
  ['gif', 'jpg'], ['gif', 'png'], ['gif', 'webp'], ['bmp', 'jpg'], ['bmp', 'png'], ['tiff', 'jpg'], ['tiff', 'png'], ['svg', 'jpg'],
] as const;

export const FORMAT_LABEL: Record<string, string> = { heic: 'HEIC', jpg: 'JPG', png: 'PNG', webp: 'WebP', avif: 'AVIF', svg: 'SVG', gif: 'GIF', bmp: 'BMP', tiff: 'TIFF' };

const ALL_TOOLS: ToolEntry[] = [
  { id: 'geotag', path: '/free-geo-tagging-tool', icon: 'mapPin', category: 'location', name: 'Geo Tagging Tool', desc: 'Add GPS location and SEO metadata to photos', localized: true, inMenu: true },
  { id: 'exif-viewer', path: '/exif-viewer', icon: 'scan', category: 'location', name: 'EXIF Viewer', desc: 'See all hidden photo metadata', inMenu: true },
  { id: 'photo-location-finder', path: '/photo-location-finder', icon: 'locate', category: 'location', name: 'Photo Location Finder', desc: 'Find where a photo was taken on a map', inMenu: true },
  { id: 'remove-exif', path: '/remove-exif-data', icon: 'eraser', category: 'location', name: 'Remove EXIF Data', desc: 'Strip GPS location and metadata from photos', inMenu: true },
  { id: 'lat-long-finder', path: '/lat-long-finder', icon: 'crosshair', category: 'location', name: 'Lat Long Finder', desc: 'Get coordinates for any address', inMenu: true },
  { id: 'image-converter', path: '/image-converter', icon: 'repeat', category: 'convert', name: 'Image Converter', desc: 'Convert HEIC, WebP, PNG, JPG, AVIF, GIF, BMP, TIFF and SVG', inMenu: true },
  ...CONVERTER_PAIRS.map(([from, to]): ToolEntry => ({
    id: `${from}-to-${to}`,
    path: `/${from}-to-${to}`,
    icon: 'fileImage',
    category: 'convert',
    name: `${FORMAT_LABEL[from]} to ${FORMAT_LABEL[to]}`,
    desc: `Convert ${FORMAT_LABEL[from]} images to ${FORMAT_LABEL[to]}`,
    inMenu: ['heic-jpg', 'webp-jpg', 'jpg-webp', 'png-jpg'].includes(`${from}-${to}`),
  })),
  { id: 'jpg-to-pdf', path: '/jpg-to-pdf', icon: 'fileText', category: 'convert', name: 'JPG to PDF', desc: 'Combine JPG photos into one PDF', inMenu: true },
  { id: 'png-to-pdf', path: '/png-to-pdf', icon: 'fileText', category: 'convert', name: 'PNG to PDF', desc: 'Turn PNG images and screenshots into a PDF' },
  { id: 'image-compressor', path: '/image-compressor', icon: 'minimize', category: 'optimize', name: 'Image Compressor', desc: 'Shrink JPG, PNG and WebP file size', inMenu: true },
  { id: 'image-resizer', path: '/image-resizer', icon: 'scaling', category: 'optimize', name: 'Image Resizer', desc: 'Resize images by pixels, percent or social size', inMenu: true },
  ...([20, 50, 100, 200] as const).map((kb): ToolEntry => ({
    id: `compress-to-${kb}kb`,
    path: `/compress-image-to-${kb}kb`,
    icon: 'gauge',
    category: 'optimize',
    name: `Compress Image to ${kb}KB`,
    desc: `Shrink a photo to under ${kb} KB for forms and uploads`,
    inMenu: kb === 100,
  })),
  { id: 'ai-alt-text', path: '/ai-alt-text-generator', icon: 'type', category: 'optimize', name: 'AI Alt Text Generator', desc: 'Write SEO-friendly alt text from an image', inMenu: true },
];

// AI tools are hidden everywhere (menu, footer, homepage, sitemap, related links) unless enabled.
export const TOOLS: ToolEntry[] = ALL_TOOLS.filter((t) => AI_ENABLED || t.id !== 'ai-alt-text');

export const CATEGORY_LABEL: Record<ToolCategory, string> = {
  location: 'Location & metadata',
  convert: 'Convert images',
  optimize: 'Optimize & SEO',
};

export const toolById = (id: string) => TOOLS.find((t) => t.id === id);
/** True for the format-pair converter pages (heic-to-jpg, webp-to-png, ...). */
export const isPair = (t: { id: string }) => CONVERTER_PAIRS.some(([f, to]) => `${f}-to-${to}` === t.id);
export const toolHref = (lang: string, path: string) => (lang === 'en' ? path : `/${lang}${path}`);
/** Tools available in a language (only the geotag tool is translated so far). */
export const toolsForLang = (lang: string) => (lang === 'en' ? TOOLS : TOOLS.filter((t) => t.localized));

export type UiStrings = {
  tools: string;
  resources: string;
  cta: string;
  geotagName: string;
  geotagDesc: string;
};

export const UI_STRINGS: Record<string, UiStrings> = {
  en: { tools: 'Free tools', resources: 'Resources', cta: 'Try it free', geotagName: 'Geo Tagging Tool', geotagDesc: 'Add GPS location and SEO metadata to photos' },
  de: { tools: 'Kostenlose Tools', resources: 'Ressourcen', cta: 'Jetzt nutzen', geotagName: 'Fotos geotaggen', geotagDesc: 'GPS-Standort und SEO-Daten zu Fotos hinzufügen' },
  es: { tools: 'Herramientas gratis', resources: 'Recursos', cta: 'Usar gratis', geotagName: 'Geoetiquetar fotos', geotagDesc: 'Añade ubicación GPS y metadatos SEO a tus fotos' },
  fr: { tools: 'Outils gratuits', resources: 'Ressources', cta: 'Essayer', geotagName: 'Géolocaliser une photo', geotagDesc: 'Ajoutez une position GPS et des métadonnées SEO' },
  pt: { tools: 'Ferramentas grátis', resources: 'Recursos', cta: 'Usar grátis', geotagName: 'Localização na foto', geotagDesc: 'Adicione localização GPS e metadados de SEO às fotos' },
  it: { tools: 'Strumenti gratuiti', resources: 'Risorse', cta: 'Usa gratis', geotagName: 'Geotag foto', geotagDesc: 'Aggiungi posizione GPS e metadati SEO alle foto' },
  nl: { tools: 'Gratis tools', resources: 'Informatie', cta: 'Gratis gebruiken', geotagName: 'Foto geotaggen', geotagDesc: "Voeg GPS-locatie en SEO-metadata toe aan foto's" },
  tr: { tools: 'Ücretsiz araçlar', resources: 'Kaynaklar', cta: 'Ücretsiz kullan', geotagName: 'Fotoğrafa konum ekleme', geotagDesc: 'Fotoğraflara GPS konumu ve SEO bilgisi ekleyin' },
  id: { tools: 'Alat gratis', resources: 'Sumber daya', cta: 'Coba gratis', geotagName: 'Geotag foto', geotagDesc: 'Tambahkan lokasi GPS dan metadata SEO ke foto' },
  ja: { tools: '無料ツール', resources: 'リソース', cta: '無料で使う', geotagName: '写真に位置情報を追加', geotagDesc: '写真にGPS位置情報とSEO用メタデータを追加' },
  ko: { tools: '무료 도구', resources: '자료', cta: '무료로 사용', geotagName: '사진 위치 정보 추가', geotagDesc: '사진에 GPS 위치와 SEO 메타데이터 추가' },
  ar: { tools: 'أدوات مجانية', resources: 'مصادر', cta: 'استخدمها مجاناً', geotagName: 'إضافة الموقع إلى الصورة', geotagDesc: 'أضف موقع GPS وبيانات السيو إلى الصور' },
  hi: { tools: 'फ्री टूल्स', resources: 'रिसोर्स', cta: 'फ्री में इस्तेमाल करें', geotagName: 'फोटो में लोकेशन जोड़ें', geotagDesc: 'फोटो में GPS लोकेशन और SEO मेटाडेटा डालें' },
};

export const uiStrings = (lang: string): UiStrings => UI_STRINGS[lang] || UI_STRINGS.en;

/** Display name/description for a tool in a language. */
export function toolLabel(t: ToolEntry, lang: string) {
  if (t.id === 'geotag') {
    const ui = uiStrings(lang);
    return { name: ui.geotagName, desc: ui.geotagDesc };
  }
  return { name: t.name, desc: t.desc };
}
