import ToolLayout, { landingMetadata } from '@/components/tools/ToolLayout';
import ImageConverter from '@/components/tools/ImageConverter';
import { IMAGE_CONVERTER_LANDING as content } from '@/lib/content/converters';

export const metadata = landingMetadata(content);

export default function Page() {
  return (
    <ToolLayout content={content}>
      <ImageConverter to="jpg" chooseTarget />
    </ToolLayout>
  );
}
