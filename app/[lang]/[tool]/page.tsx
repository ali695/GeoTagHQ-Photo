import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ToolLayout, { landingMetadata } from '@/components/tools/ToolLayout';
import renderTool from '@/components/tools/renderTool';
import { TOOL_LANGS, landingFor } from '@/lib/i18n';
import { TOOLS } from '@/lib/tools';

// Localized tool pages: /de/heic-to-jpg, /ar/remove-exif-data, ...
// Only languages with a complete locale file get pages; anything else is a 404.
type Props = { params: Promise<{ lang: string; tool: string }> };

export const dynamicParams = false;

const slugOf = (path: string) => path.replace(/^\//, '');
const toolBySlug = (slug: string) => TOOLS.find((t) => t.id !== 'geotag' && slugOf(t.path) === slug);

export function generateStaticParams() {
  return TOOL_LANGS.flatMap((lang) =>
    TOOLS.filter((t) => t.id !== 'geotag' && landingFor(t.id, lang)).map((t) => ({ lang, tool: slugOf(t.path) })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, tool } = await params;
  const t = toolBySlug(tool);
  const content = t && landingFor(t.id, lang);
  if (!content) notFound();
  return landingMetadata(content, lang);
}

export default async function LocalizedToolPage({ params }: Props) {
  const { lang, tool } = await params;
  const t = toolBySlug(tool);
  const content = t && landingFor(t.id, lang);
  if (!t || !content) notFound();
  return (
    <ToolLayout content={content} lang={lang}>
      {renderTool(t.id)}
    </ToolLayout>
  );
}
