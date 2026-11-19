import type { Metadata } from 'next';
import { ToolPage, toolMetadata } from '@/lib/toolPage';

export async function generateMetadata(): Promise<Metadata> {
  return toolMetadata('en');
}

export default function FreeGeoTaggingToolPage() {
  return <ToolPage lang="en" />;
}
