'use client';

import dynamic from 'next/dynamic';
import type { ComponentProps } from 'react';
import type MapPickerClientType from './MapPickerClient';

export type { PhotoPoint } from './MapPickerClient';

const loading = () => (
  <div className="w-full h-full min-h-[400px] bg-slate-100 animate-pulse rounded-xl flex items-center justify-center text-slate-500">
    Loading interactive map…
  </div>
);

// Google Maps when a key is configured (best street/address coverage), otherwise
// the OpenStreetMap version so the tools keep working without one.
const HAS_GOOGLE = !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const GoogleMapPicker = dynamic(() => import('./GoogleMapPicker'), { ssr: false, loading });
const OsmMapPicker = dynamic(() => import('./MapPickerClient'), { ssr: false, loading });

export default function MapPicker(props: ComponentProps<typeof MapPickerClientType>) {
  return HAS_GOOGLE ? <GoogleMapPicker {...props} /> : <OsmMapPicker {...props} />;
}
