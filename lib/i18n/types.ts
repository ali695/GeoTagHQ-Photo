import type { Landing } from '@/lib/content/landing';
import type { UiDict } from './ui';

export type ConverterCtx = { from: string; to: string; F: string; T: string };

export type Section = { title: string; paragraphs?: string[]; bullets?: string[] };

/** Phase 2 long-form sections, written natively per language (not translated). */
export type ToolExtras = {
  /** Extra sections for the non-converter tools, keyed by registry id. */
  sections: Partial<Record<string, Section[]>>;
  /** Extra sections for converter pages; can vary by source/target format. */
  converter: (c: ConverterCtx) => Section[];
  /** Extra sections for the general Image Converter page. */
  imageConverter: Section[];
};

/** Everything one language provides for the tool pages. */
export type ToolLocale = {
  /** Every interface phrase is required, so a missing translation fails the build. */
  ui: UiDict;
  /** Native page content for the non-converter tools, keyed by registry id. */
  landings: Partial<Record<string, Landing>>;
  /** Builds the page for any converter pair (e.g. HEIC to JPG). */
  converter: (c: ConverterCtx) => Landing;
  /** Page for the general Image Converter. */
  imageConverter: Landing;
  /** Long-form sections added on top of the core page. */
  extras?: ToolExtras;
};
