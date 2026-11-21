'use client';

import { SelectedLocation } from '@/lib/location';
import { MapPin, Navigation, MousePointerClick, Edit3, Search, Copy } from 'lucide-react';

interface SelectedLocationCardProps {
  location: SelectedLocation | null;
  onAutoFillMetadata?: (details: Partial<SelectedLocation>) => void;
  d?: Record<string, string>;
}

export default function SelectedLocationCard({ location, onAutoFillMetadata, d = {} }: SelectedLocationCardProps) {
  if (!location) {
    return (
      <div className="bg-slate-50 border border-dashed border-slate-300 rounded-lg p-4 mb-4 text-center text-sm text-slate-500">
        {d.noLocationSelected || 'No location selected yet.'}
      </div>
    );
  }

  const getSourceLabel = (source: string) => {
    switch (source) {
      case 'search': return d.srcSearch || 'Address search';
      case 'map': return d.srcMap || 'Map click';
      case 'manual': return d.srcManual || 'Manual entry';
      case 'current-location': return d.srcCurrent || 'Current location';
      default: return d.srcSelected || 'Selected';
    }
  };
  
  const isExact = location.source === 'search' && (location.type === 'address' || location.houseNumber || location.exactMatch);
  const confidenceText = isExact ? (d.exactMatch || 'Exact or close match') : (d.approxMatch || 'Approximate match');

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
              <span className="truncate">{d.lat || 'Latitude'}: {location.lat}</span>
              <span className="truncate">{d.lng || 'Longitude'}: {location.lon}</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-0.5 mt-1 border-t border-blue-100 pt-1">
                {location.street && <span className="truncate">{d.street || 'Street'}: <span className="text-slate-900 font-medium">{location.street} {location.houseNumber}</span></span>}
                {location.district && <span className="truncate">{d.district || 'District'}: <span className="text-slate-900 font-medium">{location.district}</span></span>}
                {location.city && <span className="truncate">{d.city || 'City'}: <span className="text-slate-900 font-medium">{location.city}</span></span>}
                {location.state && <span className="truncate">{d.state || 'State'}: <span className="text-slate-900 font-medium">{location.state}</span></span>}
                {location.postcode && <span className="truncate">{d.postal || 'Postcode'}: <span className="text-slate-900 font-medium">{location.postcode}</span></span>}
                {location.country && <span className="truncate">{d.country || 'Country'}: <span className="text-slate-900 font-medium">{location.country}</span></span>}
              </div>
              <span className="truncate mt-1 opacity-70 italic text-[10px]">{d.source || 'Source'}: {getSourceLabel(location.source)}{location.provider && ` ${d.via || 'via'} ${location.provider}`}</span>
            </div>

            {location.source === 'search' && (
              <div className="flex flex-col items-start gap-1">
                 <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${isExact ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                   {confidenceText}
                 </span>
                 {location.exactMatch === false && (
                    <span className="text-[10px] text-amber-600 font-medium mt-1">
                       {d.houseNotFound || 'The exact house number was not found, so the closest available location is shown.'}
                    </span>
                 )}
              </div>
            )}

            {(location.city || location.country) && onAutoFillMetadata && (
                <div className="mt-3">
                    <button 
                        onClick={() => onAutoFillMetadata(location)}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-slate-200 shadow-sm text-xs text-slate-600 hover:text-blue-600 hover:border-blue-200 rounded transition-colors"
                        title={d.useLocDetailsTitle || 'Copy the address details into the metadata fields'}
                    >
                        <Copy className="w-3.5 h-3.5" />
                        {d.useLocDetails || 'Use location details for metadata'}
                    </button>
                </div>
            )}
            
            <p className="mt-3 text-[10px] text-slate-500 italic leading-snug">
               {d.applyAllNote || 'This location is applied to every uploaded photo. Setting a different location per photo is not currently available.'}
            </p>
        </div>
      </div>
    </div>
  );
}
