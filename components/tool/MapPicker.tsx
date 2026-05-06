'use client';

import dynamic from 'next/dynamic';
import { GeoCoordinates } from '@/types/geo';

const MapPickerClient = dynamic(() => import('./MapPickerClient'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-slate-100 animate-pulse rounded-lg flex items-center justify-center text-slate-500">
      Loading interactive map...
    </div>
  ),
});

export default function MapPicker({ initialCoords, onChange }: { initialCoords?: GeoCoordinates, onChange: (coords: GeoCoordinates) => void }) {
  return <MapPickerClient initialCoords={initialCoords} onChange={onChange} />;
}
