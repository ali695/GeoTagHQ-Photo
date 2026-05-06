'use client';

import { useState, useEffect } from 'react';
import { GeoCoordinates } from '@/types/geo';

interface CoordinateInputProps {
  coords?: GeoCoordinates;
  onChange: (coords: GeoCoordinates) => void;
}

export default function CoordinateInput({ coords, onChange }: CoordinateInputProps) {
  const [lat, setLat] = useState(coords?.lat.toString() || '');
  const [lng, setLng] = useState(coords?.lng.toString() || '');

  useEffect(() => {
    if (coords) {
      // eslint-disable-next-line
      setLat(coords.lat.toString());
      // eslint-disable-next-line
      setLng(coords.lng.toString());
    }
  }, [coords]);

  const [error, setError] = useState<string | null>(null);

  const handleApply = () => {
    setError(null);
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);
    
    if (!isNaN(latNum) && !isNaN(lngNum)) {
      if (latNum >= -90 && latNum <= 90 && lngNum >= -180 && lngNum <= 180) {
        onChange({ lat: latNum, lng: lngNum });
      } else {
        setError("Latitude must be between -90 and 90, and Longitude must be between -180 and 180.");
      }
    } else {
      setError("Please enter valid numbers.");
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 items-end">
        <div className="w-full">
          <label className="block text-sm font-medium text-slate-700 mb-1">Latitude</label>
          <input 
            type="number" 
            value={lat} 
            onChange={(e) => setLat(e.target.value)}
            placeholder="e.g. 51.505"
            step="any"
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="w-full">
          <label className="block text-sm font-medium text-slate-700 mb-1">Longitude</label>
          <input 
            type="number" 
            value={lng} 
            onChange={(e) => setLng(e.target.value)}
            placeholder="e.g. -0.09"
            step="any"
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button 
          onClick={handleApply}
          className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium whitespace-nowrap transition-colors"
        >
          Apply
        </button>
      </div>
      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
    </div>
  );
}
