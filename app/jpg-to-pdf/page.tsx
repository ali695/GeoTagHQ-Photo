import ToolLayout, { landingMetadata } from '@/components/tools/ToolLayout';
import ImageToPdf from '@/components/tools/ImageToPdf';
import { JPG_TO_PDF as content } from '@/lib/content/newTools';

export const metadata = landingMetadata(content);

export default function Page() {
  return (
    <ToolLayout content={content}>
      <ImageToPdf format="JPG" />
    </ToolLayout>
  );
}
