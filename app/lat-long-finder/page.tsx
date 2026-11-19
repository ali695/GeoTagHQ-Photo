import ToolLayout, { landingMetadata } from '@/components/tools/ToolLayout';
import LatLongFinder from '@/components/tools/LatLongFinder';
import { LAT_LONG_FINDER as content } from '@/lib/content/seoTools';

export const metadata = landingMetadata(content);

export default function Page() {
  return (
    <ToolLayout content={content}>
      <LatLongFinder />
    </ToolLayout>
  );
}
