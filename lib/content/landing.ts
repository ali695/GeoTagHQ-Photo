// Content shape for the English tool landing pages (converters, EXIF tools, etc.).

export type Privacy = 'browser' | 'server' | 'ai' | 'mixed';

export type Landing = {
  /** Registry id, used for the URL, related tools and schema. */
  id: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow?: string;
  h1: string;
  subtitle: string;
  chips: string[];
  privacy: Privacy;
  privacyNote: string;
  stepsTitle: string;
  steps: { title: string; desc: string }[];
  sections: { title: string; paragraphs?: string[]; bullets?: string[] }[];
  table?: { title: string; headers: string[]; rows: string[][]; note?: string };
  faqs: { q: string; a: string }[];
  /** Registry ids to link to in "More free tools". */
  related: string[];
};
