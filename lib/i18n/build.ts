// Builds localized converter pages from a per-language template, so every pair
// (HEIC to JPG, WebP to PNG, ...) gets native text without writing 11 pages per language.
import type { Landing } from '@/lib/content/landing';
import type { ConverterCtx } from './types';

type Fmt = 'heic' | 'jpg' | 'png' | 'webp' | 'avif' | 'svg' | 'gif' | 'bmp' | 'tiff';

export type ConverterTemplate = {
  metaTitle: string; // {F} {T}
  metaDescription: string;
  h1: string;
  subtitle: string;
  chips: { free: string; batch: string; noUpload: string; nothingStored: string; noWatermark: string };
  privacyBrowser: string; // {F} {T}
  privacyMixed: string;
  /** TIFF input: decoded on the server in browsers other than Safari. */
  privacyTiff: string;
  stepsTitle: string;
  steps: { add: [string, string]; settings: [string, string]; settingsPng: string; bgNote: string; download: [string, string] };
  whyTitle: string;
  /** Reasons by target format. */
  why: Record<'jpg' | 'png' | 'webp', string[]>;
  /** Extra reason shown first when converting from this source format. */
  fromNote: Partial<Record<Fmt, string>>;
  /** Heading for the source-format section, e.g. "About {F} files". */
  sourceTitle: string;
  /** Per source format: two native paragraphs and one format-specific FAQ.
   *  This is what makes sibling pages (GIF→JPG vs BMP→JPG) genuinely different. */
  sources: Record<Fmt, { p: [string, string]; faq: [string, string] }>;
  tableTitle: string; // {F} {T}
  tableRows: [string, string, string, string]; // compression, transparency, support, best for
  formats: Record<Fmt, [string, string, string, string]>;
  faqs: {
    free: [string, string];
    upload: [string, string];
    uploadMixed: string;
    quality: [string, string];
    qualityPng: string;
    batch: [string, string];
    transparency: [string, string]; // only for JPG output
    heicMeta: [string, string]; // only for HEIC input
  };
};

const fill = (s: string, c: ConverterCtx) => s.replaceAll('{F}', c.F).replaceAll('{T}', c.T);

const PAIRS = ['heic-jpg', 'heic-png', 'webp-jpg', 'webp-png', 'jpg-webp', 'png-webp', 'png-jpg', 'jpg-png', 'avif-jpg', 'avif-png', 'svg-png', 'gif-jpg', 'gif-png', 'gif-webp', 'bmp-jpg', 'bmp-png', 'tiff-jpg', 'tiff-png', 'svg-jpg'];

export function buildConverter(t: ConverterTemplate, c: ConverterCtx): Landing {
  const from = c.from as Fmt;
  const to = c.to as 'jpg' | 'png' | 'webp';
  const tiff = from === 'tiff';
  const mixed = to === 'webp' || tiff;
  const key = `${from}-${to}`;
  const related = PAIRS.filter((k) => k !== key && (k.startsWith(`${from}-`) || k.endsWith(`-${to}`) || k === `${to}-${from}`))
    .slice(0, 3)
    .map((k) => k.replace('-', '-to-'));

  const why = [...(t.fromNote[from] ? [t.fromNote[from]!] : []), ...t.why[to]].map((s) => fill(s, c));
  const faqs = [
    { q: fill(t.sources[from].faq[0], c), a: fill(t.sources[from].faq[1], c) },
    { q: fill(t.faqs.free[0], c), a: fill(t.faqs.free[1], c) },
    { q: fill(t.faqs.upload[0], c), a: fill(mixed ? t.faqs.uploadMixed : t.faqs.upload[1], c) },
    { q: fill(t.faqs.quality[0], c), a: fill(to === 'png' ? t.faqs.qualityPng : t.faqs.quality[1], c) },
    ...(to === 'jpg' ? [{ q: fill(t.faqs.transparency[0], c), a: fill(t.faqs.transparency[1], c) }] : []),
    ...(from === 'heic' ? [{ q: fill(t.faqs.heicMeta[0], c), a: fill(t.faqs.heicMeta[1], c) }] : []),
    { q: fill(t.faqs.batch[0], c), a: fill(t.faqs.batch[1], c) },
  ];
  const fmtRow = (f: Fmt) => t.formats[f];

  return {
    id: `${from}-to-${to}`,
    metaTitle: fill(t.metaTitle, c),
    metaDescription: fill(t.metaDescription, c),
    h1: fill(t.h1, c),
    subtitle: fill(t.subtitle, c),
    chips: [t.chips.free, t.chips.batch, mixed && from !== 'heic' ? t.chips.nothingStored : t.chips.noUpload, t.chips.noWatermark],
    privacy: mixed ? 'mixed' : 'browser',
    privacyNote: fill(tiff ? t.privacyTiff : mixed ? t.privacyMixed : t.privacyBrowser, c),
    stepsTitle: fill(t.stepsTitle, c),
    steps: [
      { title: fill(t.steps.add[0], c), desc: fill(t.steps.add[1], c) },
      { title: fill(t.steps.settings[0], c), desc: fill(to === 'png' ? t.steps.settingsPng : t.steps.settings[1] + (to === 'jpg' ? ' ' + t.steps.bgNote : ''), c) },
      { title: fill(t.steps.download[0], c), desc: fill(t.steps.download[1], c) },
    ],
    sections: [
      { title: fill(t.sourceTitle, c), paragraphs: t.sources[from].p.map((x) => fill(x, c)) },
      { title: fill(t.whyTitle, c), bullets: why },
    ],
    table: {
      title: fill(t.tableTitle, c),
      headers: ['', c.F, c.T],
      rows: t.tableRows.map((label, i) => [label, fmtRow(from)[i], fmtRow(to)[i]]),
    },
    faqs,
    related: [...related, 'image-converter', 'image-compressor', 'remove-exif'].slice(0, 6),
  };
}
