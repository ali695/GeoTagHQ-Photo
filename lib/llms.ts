// Builds /llms.txt and /llms-full.txt from the tool registry and page content,
// so the files always match what the site actually offers.
import { CATEGORY_LABEL, TOOLS, type ToolCategory } from '@/lib/tools';
import { LANGUAGES } from '@/lib/constants';
import { landingFor } from '@/lib/i18n';
import { FOUNDER, SITE_URL } from '@/lib/site';

const SERVER: Record<string, string> = {
  geotag: 'uses our server to write GPS (processed in memory, never stored)',
  'image-compressor': 'runs in the browser for JPG and WebP; PNG compression uses our server (never stored)',
  'lat-long-finder': 'sends only the searched address to a geocoding service, never a photo',
  'ai-alt-text': 'sends the image to an AI model',
};
const privacy = (id: string) => SERVER[id] || 'runs entirely in the browser; files never leave the device';
const url = (path: string) => `${SITE_URL}${path}`;

const INTRO = `# PinPixl

> PinPixl is a free set of online photo tools: add GPS location to photos (geotagging), view and remove EXIF metadata, find where a photo was taken, get coordinates for an address, convert HEIC, WebP, AVIF, PNG, JPG and SVG, and compress images. No sign-up, no watermark, no paid plan. Most tools run entirely in the visitor's browser.

Key facts:
- ${TOOLS.length} free tools, available in ${LANGUAGES.length} languages, each written natively (not machine-translated).
- Batch processing of up to 20 files; iPhone HEIC/HEIF photos are supported everywhere.
- Results are verified: written GPS is read back, removed metadata is re-checked, compressed files are compared.
- Geotagging does not directly improve Google rankings, and Google Business Profile strips EXIF data from published photos.
- Designed and developed by ${FOUNDER.name}, an SEO specialist who also builds browser extensions and SEO tools (${FOUNDER.linkedin}). About: ${SITE_URL}/about`;

export function llmsTxt(): string {
  const cats: ToolCategory[] = ['location', 'convert', 'optimize'];
  const sections = cats.map((c) => {
    const list = TOOLS.filter((t) => t.category === c);
    if (!list.length) return '';
    return `## ${CATEGORY_LABEL[c]}\n${list.map((t) => `- [${t.name}](${url(t.path)}): ${t.desc}. Privacy: ${privacy(t.id)}.`).join('\n')}`;
  });
  const langs = LANGUAGES.map((l) => `- [${l.name}](${l.code === 'en' ? url('/') : url(`/${l.code}`)})`).join('\n');
  return [
    INTRO,
    ...sections.filter(Boolean),
    `## Languages\nEvery tool exists in each language at /{lang}/{tool}, for example ${url('/de/heic-to-jpg')}.\n${langs}`,
    `## Optional\n- [Full tool documentation](${url('/llms-full.txt')}): steps, details and FAQs for every tool.\n- [Privacy policy](${url('/privacy-policy')})\n- [About](${url('/about')})\n- [Contact](${url('/contact')})`,
  ].join('\n\n') + '\n';
}

export function llmsFullTxt(): string {
  const parts = TOOLS.map((t) => {
    const c = landingFor(t.id, 'en');
    const head = `## ${t.name}\nURL: ${url(t.path)}\nPrivacy: ${privacy(t.id)}.\n\n${c?.subtitle || t.desc}`;
    if (!c) return head;
    const steps = c.steps.length ? `\n\n### ${c.stepsTitle}\n${c.steps.map((s, i) => `${i + 1}. ${s.title}: ${s.desc}`).join('\n')}` : '';
    const secs = c.sections
      .map((s) => `\n\n### ${s.title}\n${[...(s.paragraphs || []), ...(s.bullets || []).map((b) => `- ${b}`)].join('\n')}`)
      .join('');
    const faqs = c.faqs.length ? `\n\n### FAQ\n${c.faqs.map((f) => `Q: ${f.q}\nA: ${f.a}`).join('\n\n')}` : '';
    return head + steps + secs + faqs;
  });
  return `${INTRO}\n\n${parts.join('\n\n---\n\n')}\n`;
}
