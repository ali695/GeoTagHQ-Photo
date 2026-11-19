import ToolLayout, { landingMetadata } from '@/components/tools/ToolLayout';
import ExifRemover from '@/components/tools/ExifRemover';
import { REMOVE_EXIF as content } from '@/lib/content/metadataTools';

export const metadata = landingMetadata(content);

export default function Page() {
  return (
    <ToolLayout content={content}>
      <ExifRemover />
    </ToolLayout>
  );
}
