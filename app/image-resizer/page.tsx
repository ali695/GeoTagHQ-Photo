import ToolLayout, { landingMetadata } from '@/components/tools/ToolLayout';
import ImageResizer from '@/components/tools/ImageResizer';
import { IMAGE_RESIZER as content } from '@/lib/content/newTools';

export const metadata = landingMetadata(content);

export default function Page() {
  return (
    <ToolLayout content={content}>
      <ImageResizer />
    </ToolLayout>
  );
}
