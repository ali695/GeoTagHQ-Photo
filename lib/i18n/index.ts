// Which tools exist in which language, and their text.
// English content lives in lib/content/*; other languages in lib/i18n/locales/<lang>.ts.
// A language appears in routes, menus, hreflang and the sitemap only once its file is registered here.
import type { Landing } from '@/lib/content/landing';
import { converterLanding, IMAGE_CONVERTER_LANDING } from '@/lib/content/converters';
import { EXIF_VIEWER, PHOTO_LOCATION_FINDER, REMOVE_EXIF } from '@/lib/content/metadataTools';
import { AI_ALT_TEXT, IMAGE_COMPRESSOR, LAT_LONG_FINDER } from '@/lib/content/seoTools';
import { IMAGE_RESIZER, JPG_TO_PDF, PNG_TO_PDF, compressToLanding } from '@/lib/content/newTools';
import { CONVERTER_PAIRS, FORMAT_LABEL, TOOLS, toolById, type ToolEntry } from '@/lib/tools';
import { UI_EN, type UiDict } from './ui';
import type { ToolLocale } from './types';
import { TOOL_LOCALES } from './locales';

const EN_LANDINGS: Record<string, Landing> = {
  'exif-viewer': EXIF_VIEWER,
  'photo-location-finder': PHOTO_LOCATION_FINDER,
  'remove-exif': REMOVE_EXIF,
  'lat-long-finder': LAT_LONG_FINDER,
  'image-compressor': IMAGE_COMPRESSOR,
  'ai-alt-text': AI_ALT_TEXT,
  'image-converter': IMAGE_CONVERTER_LANDING,
  'image-resizer': IMAGE_RESIZER,
  'jpg-to-pdf': JPG_TO_PDF,
  'png-to-pdf': PNG_TO_PDF,
  'compress-to-20kb': compressToLanding(20),
  'compress-to-50kb': compressToLanding(50),
  'compress-to-100kb': compressToLanding(100),
  'compress-to-200kb': compressToLanding(200),
};

export const locale = (lang: string): ToolLocale | undefined => TOOL_LOCALES[lang];
/** Languages (besides English) with tool pages. */
export const TOOL_LANGS = Object.keys(TOOL_LOCALES);

export function getUi(lang: string): UiDict {
  return { ...UI_EN, ...(TOOL_LOCALES[lang]?.ui || {}) } as UiDict;
}

const pairOf = (id: string) => CONVERTER_PAIRS.find(([f, t]) => `${f}-to-${t}` === id);

/** Page content for a tool in a language, or null if that language doesn't have it. */
export function landingFor(id: string, lang: string): Landing | null {
  const pair = pairOf(id);
  if (lang === 'en') {
    if (pair) return converterLanding(pair[0] as any, pair[1] as any);
    return EN_LANDINGS[id] || null;
  }
  const loc = TOOL_LOCALES[lang];
  if (!loc) return null;
  const ex = loc.extras;
  // Core page plus the native long-form sections (Phase 2) when the language has them.
  const withExtra = (l: Landing | undefined, extra: Landing['sections'] = []): Landing | null =>
    l ? { ...l, sections: [...l.sections, ...extra] } : null;
  if (pair) {
    const c = { from: pair[0], to: pair[1], F: FORMAT_LABEL[pair[0]], T: FORMAT_LABEL[pair[1]] };
    // Keep the iPhone (HEIC) and website (WebP) tips; the generic "good to know" note is
    // replaced by the format-specific section, which keeps sibling pages distinct.
    const tips = c.from === 'heic' || c.to === 'webp' ? ex?.converter(c) : [];
    return withExtra(loc.converter(c), tips);
  }
  if (id === 'image-converter') return withExtra(loc.imageConverter, ex?.imageConverter);
  return withExtra(loc.landings[id], ex?.sections[id]);
}

/** Tools available in a language (geotag is translated separately and is always included). */
export function availableTools(lang: string): ToolEntry[] {
  return TOOLS.filter((t) => t.id === 'geotag' || landingFor(t.id, lang) !== null);
}

/** Languages a tool page exists in, English first. */
export function toolLangs(id: string): string[] {
  return ['en', ...TOOL_LANGS.filter((l) => landingFor(id, l) !== null)];
}

/** Localized name and description for a tool. */
export function toolText(t: ToolEntry, lang: string, geotag: { name: string; desc: string }) {
  if (t.id === 'geotag') return geotag;
  const ui = getUi(lang);
  const pair = pairOf(t.id);
  if (pair) {
    const vars = { from: FORMAT_LABEL[pair[0]], to: FORMAT_LABEL[pair[1]] };
    return { name: ui.converterName.replace('{from}', vars.from).replace('{to}', vars.to), desc: ui.converterDesc.replace('{from}', vars.from).replace('{to}', vars.to) };
  }
  return { name: (ui as any)[`name.${t.id}`] || t.name, desc: (ui as any)[`desc.${t.id}`] || t.desc };
}

export const pathFor = (lang: string, path: string) => (lang === 'en' ? path : `/${lang}${path}`);
export { toolById };
