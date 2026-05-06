'use client';

import { SelectedLocation } from '@/lib/location';
import { MapPin, Navigation, MousePointerClick, Edit3, Search } from 'lucide-react';

interface SelectedLocationCardProps {
  location: SelectedLocation | null;
}

export default function SelectedLocationCard({ location }: SelectedLocationCardProps) {
  if (!location) return null;

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'search': return <Search className="w-3.5 h-3.5" />;
      case 'map': return <MousePointerClick className="w-3.5 h-3.5" />;
      case 'manual': return <Edit3 className="w-3.5 h-3.5" />;
      case 'current-location': return <Navigation className="w-3.5 h-3.5" />;
      default: return <MapPin className="w-3.5 h-3.5" />;
    }
  };

  const getSourceLabel = (source: string) => {
    switch (source) {
      case 'search': return 'Search result';
      case 'map': return 'Map click';
      case 'manual': return 'Manual input';
      case 'current-location': return 'Current location';
      default: return 'Selected';
    }
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 bg-blue-100 text-blue-600 p-1.5 rounded-full shrink-0">
          <MapPin className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <h4 className="font-semibold text-slate-800 text-sm mb-1 truncate">
            {location.displayName}
          </h4>
          <div className="flex flex-col gap-0.5 text-xs text-slate-500">
            <span className="truncate">Latitude: {location.lat.toFixed(8)}</span>
            <span className="truncate">Longitude: {location.lon.toFixed(8)}</span>
          </div>
          <div className="mt-2 inline-flex items-center gap-1 text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-medium">
            {getSourceIcon(location.source)}
            {getSourceLabel(location.source)}
          </div>
          {location.provider && (
             <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-500">
               Provider: {location.provider}
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
