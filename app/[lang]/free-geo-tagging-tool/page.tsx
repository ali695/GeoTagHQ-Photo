import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LANGUAGES } from '@/lib/constants';
import { ToolPage, toolMetadata } from '@/lib/toolPage';

type Props = {
  params: Promise<{ lang: string }>;
};

// Only pre-built languages exist. /en/... and unknown codes return 404
// (/en/... is also redirected to the main URL in next.config.ts).
export const dynamicParams = false;

const LOCALIZED = LANGUAGES.filter((l) => l.code !== 'en').map((l) => l.code);

export function generateStaticParams() {
  return LOCALIZED.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!LOCALIZED.includes(lang)) notFound();
  return toolMetadata(lang);
}

export default async function LocalizedToolPage({ params }: Props) {
  const { lang } = await params;
  if (!LOCALIZED.includes(lang)) notFound();
  return <ToolPage lang={lang} />;
}
