import ToolLayout, { landingMetadata } from '@/components/tools/ToolLayout';
import CompressToSize from '@/components/tools/CompressToSize';
import { compressToLanding } from '@/lib/content/newTools';

const content = compressToLanding(50);

export const metadata = landingMetadata(content);

export default function Page() {
  return (
    <ToolLayout content={content}>
      <CompressToSize targetKB={50} />
    </ToolLayout>
  );
}
