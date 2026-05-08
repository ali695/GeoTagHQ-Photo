'use client';

import { SelectedLocation } from '@/lib/location';
import { MapPin, Navigation, MousePointerClick, Edit3, Search, Copy } from 'lucide-react';

interface SelectedLocationCardProps {
  location: SelectedLocation | null;
  onAutoFillMetadata?: (details: Partial<SelectedLocation>) => void;
}

export default function SelectedLocationCard({ location, onAutoFillMetadata }: SelectedLocationCardProps) {
  if (!location) {
    return (
      <div className="bg-slate-50 border border-dashed border-slate-300 rounded-lg p-4 mb-4 text-center text-sm text-slate-500">
        No location selected yet.
      </div>
    );
  }

  const getSourceLabel = (source: string) => {
    switch (source) {
      case 'search': return 'Address search';
      case 'map': return 'Map click';
      case 'manual': return 'Manual input';
      case 'current-location': return 'Current location';
      default: return 'Selected';
    }
  };
  
  const isExact = location.source === 'search' && (location.type === 'address' || location.houseNumber || location.exactMatch);
  const confidenceText = isExact ? 'Exact or close match' : 'Approximate match';

  return (
    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 bg-blue-100 text-blue-600 p-1.5 rounded-full shrink-0">
          <MapPin className="w-4 h-4" />
        </div>
        <div className="min-w-0 w-full">
            <h4 className="font-semibold text-slate-800 text-sm mb-1 truncate">
              {location.displayName}
            </h4>
            
            <div className="flex flex-col gap-0.5 text-xs text-slate-600 mb-2">
              <span className="truncate">Latitude: {location.lat}</span>
              <span className="truncate">Longitude: {location.lon}</span>
              <span className="truncate">Source: {getSourceLabel(location.source)}</span>
              {location.provider && <span className="truncate">Provider: OpenStreetMap</span>}
            </div>

            {location.source === 'search' && (
              <div className="flex flex-col items-start gap-1">
                 <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${isExact ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                   {confidenceText}
                 </span>
                 {location.exactMatch === false && (
                    <span className="text-[10px] text-amber-600 font-medium mt-1">
                       Exact house number was not found. Showing the closest available location.
                    </span>
                 )}
              </div>
            )}

            {(location.city || location.country) && onAutoFillMetadata && (
                <div className="mt-3">
                    <button 
                        onClick={() => onAutoFillMetadata(location)}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-slate-200 shadow-sm text-xs text-slate-600 hover:text-blue-600 hover:border-blue-200 rounded transition-colors"
                        title="Copy address details into metadata fields"
                    >
                        <Copy className="w-3.5 h-3.5" />
                        Use location details for metadata
                    </button>
                </div>
            )}
            
            <p className="mt-3 text-[10px] text-slate-500 italic leading-snug">
               Note: This location will be applied to all uploaded images. Per-image GPS editing will be available later as a Pro feature.
            </p>
        </div>
      </div>
    </div>
  );
}
