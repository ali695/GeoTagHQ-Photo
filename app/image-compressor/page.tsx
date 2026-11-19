import ToolLayout, { landingMetadata } from '@/components/tools/ToolLayout';
import ImageCompressor from '@/components/tools/ImageCompressor';
import { IMAGE_COMPRESSOR as content } from '@/lib/content/seoTools';

export const metadata = landingMetadata(content);

export default function Page() {
  return (
    <ToolLayout content={content}>
      <ImageCompressor />
    </ToolLayout>
  );
}
