'use client';

import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { GeoCoordinates } from '@/types/geo';
import { Search, Loader2, X, MapPin } from 'lucide-react';

// Fix Leaflet's default icon path issues in Next.js/Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface MapPickerClientProps {
  initialCoords?: GeoCoordinates;
  zoomLevel?: number;
  language?: string;
  onChange: (coords: GeoCoordinates, source: any, displayName?: string, provider?: string, fullSuggestion?: any) => void;
}

function LocationMarker({ position, onChange }: { position: L.LatLng; onChange: (pos: L.LatLng) => void }) {
  const markerRef = useRef<L.Marker>(null);

  useMapEvents({
    click(e) {
      onChange(e.latlng);
    },
  });

  const eventHandlers = {
    dragend() {
      const marker = markerRef.current;
      if (marker != null) {
        onChange(marker.getLatLng());
      }
    },
  };

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
    />
  );
}

export default function MapPickerClient({ initialCoords, zoomLevel, onChange, language = 'en' }: MapPickerClientProps) {
  // Default to a central location (e.g., somewhere neutral or geographically central) if no location is provided
  const defaultPos = new L.LatLng(51.505, -0.09);
  
  const [position, setPosition] = useState<L.LatLng>(
    initialCoords ? new L.LatLng(initialCoords.lat, initialCoords.lng) : defaultPos
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!initialCoords) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPosition(new L.LatLng(initialCoords.lat, initialCoords.lng));
  }, [initialCoords]);

  // Debounced suggestion fetch
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.length > 2 && !isSearching) {
        try {
          // fetch with explicit address details, namedetails and extratags for full visibility
          const lang = language || 'en';
          const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&addressdetails=1&namedetails=1&extratags=1&limit=12&countrycodes=&dedupe=1&accept-language=${lang}`);
          const data = await response.json();
          
          // Sort results: prioritize specific addresses (house numbers), then roads, then specific points of interest
          const sorted = [...data].sort((a, b) => {
            const getScore = (item: any) => {
              let score = 0;
              if (item.address?.house_number) score += 150;
              if (item.address?.building) score += 130;
              if (item.address?.office || item.address?.shop || item.address?.amenity) score += 100;
              if (item.address?.road) score += 70;
              if (item.class === 'place' && item.type === 'house') score += 120;
              if (item.extratags?.amenity || item.extratags?.tourism || item.extratags?.shop) score += 60;
              if (item.type === 'street') score += 50;
              if (item.importance) score += item.importance * 20;
              return score;
            };
            return getScore(b) - getScore(a);
          });

          setSuggestions(sorted);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Suggestion fetch error:', error);
        }
      } else {
        setSuggestions([]);
      }
    }, 400); // slightly faster debounce
    return () => clearTimeout(timer);
  }, [searchQuery, isSearching, language]);

  const handlePositionChange = (pos: L.LatLng) => {
    setPosition(pos);
    onChange({ lat: pos.lat, lng: pos.lng }, 'map');
  };

  const handleSelectSuggestion = (suggestion: any) => {
    const { lat, lon, display_name, address, namedetails, type, extratags, importance } = suggestion;
    const newPos = new L.LatLng(parseFloat(lat), parseFloat(lon));
    
    // Create a much cleaner display name for the input
    const houseNum = address?.house_number;
    const street = address?.road || address?.pedestrian || address?.path;
    const local = address?.suburb || address?.neighbourhood || address?.village || address?.quarter;
    const city = address?.city || address?.town;
    const state = address?.state;
    const country = address?.country;
    
    let label = '';
    if (houseNum && street) label = `${houseNum} ${street}`;
    else if (street) label = street;
    else if (namedetails?.name) label = namedetails.name;
    else label = display_name.split(',')[0];

    const contextArr = [local, city, state, country].filter(v => v && v !== label).filter(Boolean);
    const context = contextArr.slice(0, 2).join(', ');
    
    setSearchQuery(context ? `${label}, ${context}` : label);
    
    // Pass full suggestion info back for better precision
    const fullSuggestion = {
      id: suggestion.place_id,
      displayName: display_name,
      street,
      houseNumber: houseNum,
      district: local,
      city,
      state,
      country,
      countryCode: address?.country_code,
      postcode: address?.postcode,
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      provider: 'OpenStreetMap',
      type: type || suggestion.class,
      exactMatch: !!houseNum,
      importance
    };

    setPosition(newPos);
    onChange({ lat: newPos.lat, lng: newPos.lng }, 'search', display_name, 'OpenStreetMap', fullSuggestion as any);
    setShowSuggestions(false);
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setShowSuggestions(false);
    try {
      const lang = language || 'en';
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&addressdetails=1&limit=5&accept-language=${lang}`);
      const data = await response.json();
      
      if (data && data.length > 0) {
        // Prefer exact matches if multiple results
        const best = data[0];
        const newPos = new L.LatLng(parseFloat(best.lat), parseFloat(best.lon));
        handlePositionChange(newPos);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="relative flex-1 w-full h-full min-h-[500px] flex flex-col">
      {/* Search Overlay */}
      <div 
        ref={searchRef}
        className="absolute top-4 left-4 right-4 md:left-4 md:right-auto z-[2000]"
      >
        <form 
          onSubmit={handleSearch}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1 md:w-[500px] shadow-2xl">
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.length > 2 && setShowSuggestions(true)}
              placeholder="Enter full address, street, city or zip..."
              className="w-full bg-white border border-slate-300 rounded-xl py-4 pl-12 pr-10 text-sm outline-none focus:ring-2 focus:ring-blue-600 transition-all font-medium text-slate-900 shadow-xl"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            {searchQuery && (
              <button 
                type="button"
                onClick={() => { setSearchQuery(''); setSuggestions([]); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            {isSearching && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500 animate-spin" />
            )}
            
            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl z-[2001] max-h-96 overflow-y-auto overflow-x-hidden divide-y divide-slate-100">
                {suggestions.map((s, i) => {
                  const addr = s.address;
                  const houseNum = addr?.house_number;
                  const street = addr?.road || addr?.pedestrian || addr?.path;
                  const title = houseNum && street ? `${houseNum} ${street}` : (street || s.namedetails?.name || s.display_name.split(',')[0]);
                  const subtext = s.display_name.split(',').slice(houseNum && street ? 2 : 1).join(',').trim();

                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelectSuggestion(s)}
                      className="w-full text-left px-5 py-4 hover:bg-blue-50 transition-colors flex items-start gap-4 group"
                    >
                      <div className="mt-0.5 p-2 bg-slate-100 rounded-lg group-hover:bg-blue-100 transition-colors shrink-0">
                        {s.type === 'house' || s.type === 'building' || addr?.house_number ? (
                          <div className="relative">
                            <MapPin className="w-4 h-4 text-slate-500 group-hover:text-blue-600" />
                            <span className="absolute -top-1 -right-1 flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                          </div>
                        ) : s.extratags?.amenity || s.extratags?.shop || s.extratags?.tourism ? (
                          <Search className="w-4 h-4 text-orange-500 group-hover:text-blue-600" />
                        ) : (
                          <MapPin className="w-4 h-4 text-slate-500 group-hover:text-blue-600" />
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-slate-900 text-[15px] truncate leading-tight flex items-center gap-2">
                          {title}
                          {s.extratags?.amenity && <span className="bg-orange-100 text-orange-700 text-[9px] px-1 rounded font-bold uppercase">{s.extratags.amenity.replace('_', ' ')}</span>}
                          {addr?.postcode && <span className="bg-slate-200 text-slate-600 text-[9px] px-1 rounded font-normal">{addr.postcode}</span>}
                        </span>
                        <span className="text-slate-500 text-[12px] leading-relaxed mt-1 line-clamp-2">{subtext}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          <button 
            type="submit"
            disabled={isSearching}
            className="bg-blue-600 text-white h-[56px] px-8 rounded-xl text-sm font-bold shadow-xl hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center min-w-[100px]"
          >
            {isSearching ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Search'}
          </button>
        </form>
      </div>

      <MapContainer
        center={position}
        zoom={zoomLevel || 13}
        scrollWheelZoom={true}
        className="flex-1 w-full h-full rounded-lg outline-none"
      >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker position={position} onChange={handlePositionChange} />
      
      {/* Invisible center updater when initial coordinates change from outside */}
      <MapCenterUpdater position={position} zoomLevel={zoomLevel} />
      
      {/* Fix for map visibility issue on mount/resize */}
      <MapSizer />
      </MapContainer>
    </div>
  );
}

function MapSizer() {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

function MapCenterUpdater({ position, zoomLevel }: { position: L.LatLng, zoomLevel?: number }) {
  const map = useMapEvents({});
  useEffect(() => {
    map.flyTo(position, zoomLevel || map.getZoom());
  }, [position, zoomLevel, map]);
  return null;
}
