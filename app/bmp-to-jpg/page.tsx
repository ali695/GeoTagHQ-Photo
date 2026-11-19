import ToolLayout, { landingMetadata } from '@/components/tools/ToolLayout';
import ImageConverter from '@/components/tools/ImageConverter';
import { converterLanding } from '@/lib/content/converters';

const content = converterLanding('bmp', 'jpg');
export const metadata = landingMetadata(content);

export default function Page() {
  return (
    <ToolLayout content={content}>
      <ImageConverter from="bmp" to="jpg" />
    </ToolLayout>
  );
}
