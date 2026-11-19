import ToolLayout, { landingMetadata } from '@/components/tools/ToolLayout';
import ExifViewer from '@/components/tools/ExifViewer';
import { EXIF_VIEWER as content } from '@/lib/content/metadataTools';

export const metadata = landingMetadata(content);

export default function Page() {
  return (
    <ToolLayout content={content}>
      <ExifViewer mode="viewer" />
    </ToolLayout>
  );
}
