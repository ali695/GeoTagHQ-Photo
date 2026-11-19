import { MapPin, ScanSearch, Eraser, FileImage, Minimize2, Crosshair, Type, Repeat, LocateFixed } from 'lucide-react';
import type { ToolIcon as ToolIconName } from '@/lib/tools';

const ICONS = {
  mapPin: MapPin,
  scan: ScanSearch,
  eraser: Eraser,
  fileImage: FileImage,
  minimize: Minimize2,
  crosshair: Crosshair,
  type: Type,
  repeat: Repeat,
  locate: LocateFixed,
} as const;

export default function ToolIcon({ name, className }: { name: ToolIconName; className?: string }) {
  const Icon = ICONS[name];
  return <Icon className={className} aria-hidden />;
}
