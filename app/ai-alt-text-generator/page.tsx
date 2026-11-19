import ToolLayout, { landingMetadata } from '@/components/tools/ToolLayout';
import AltTextGenerator from '@/components/tools/AltTextGenerator';
import { AI_ALT_TEXT as content } from '@/lib/content/seoTools';
import { notFound } from 'next/navigation';
import { AI_ENABLED } from '@/lib/features';

export const metadata = landingMetadata(content);

export default function Page() {
  if (!AI_ENABLED) notFound();
  return (
    <ToolLayout content={content}>
      <AltTextGenerator />
    </ToolLayout>
  );
}
