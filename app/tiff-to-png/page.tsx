import ToolLayout, { landingMetadata } from '@/components/tools/ToolLayout';
import ImageConverter from '@/components/tools/ImageConverter';
import { converterLanding } from '@/lib/content/converters';

const content = converterLanding('tiff', 'png');
export const metadata = landingMetadata(content);

export default function Page() {
  return (
    <ToolLayout content={content}>
      <ImageConverter from="tiff" to="png" />
    </ToolLayout>
  );
}
