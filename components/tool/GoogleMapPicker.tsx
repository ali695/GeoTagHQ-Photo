'use client';

// Google Maps version of the location picker: Google map/satellite tiles, Places
// autocomplete for streets, house addresses and businesses, and Google reverse
// geocoding when the pin is placed. Same props as MapPickerClient (the OSM version).
//
// Needs NEXT_PUBLIC_GOOGLE_MAPS_API_KEY with these APIs enabled: Maps JavaScript API,
// Places API (New), Geocoding API. Restrict the key to your domains in Google Cloud.
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import { Search, Loader2, X, MapPin, LocateFixed, Copy, Check, Images, Camera } from 'lucide-react';
import { GeoCoordinates } from '@/types/geo';
import { formatDecimal, formatDms, parseCoordinates } from '@/lib/geo';
import type { PhotoPoint } from './MapPickerClient';
import { useUi } from '@/components/tools/UiProvider';

export const GOOGLE_MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
// Advanced markers need a Map ID. DEMO_MAP_ID works for testing; create your own
// in Google Cloud (Map Management) for production and set NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID.
const MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || 'DEMO_MAP_ID';

interface Props {
  initialCoords?: GeoCoordinates;
  zoomLevel?: number;
  language?: string;
  photoPoints?: PhotoPoint[];
  readOnly?: boolean;
  placeholder?: string;
  searchLabel?: string;
  heightClass?: string;
  onChange?: (coords: GeoCoordinates, source: any, displayName?: string, provider?: string, fullSuggestion?: any) => void;
}

type AddressComponent = { longText?: string | null; shortText?: string | null; long_name?: string; short_name?: string; types: string[] };

/** Turns Google address components into the fields the metadata panel fills in. */
function parseAddress(components: AddressComponent[] = []) {
  const get = (type: string, short = false) => {
    const c = components.find((x) => x.types.includes(type));
    if (!c) return undefined;
    return (short ? c.shortText ?? c.short_name : c.longText ?? c.long_name) || undefined;
  };
  return {
    houseNumber: get('street_number'),
    street: get('route'),
    district: get('sublocality_level_1') || get('sublocality') || get('neighborhood'),
    city: get('locality') || get('postal_town') || get('administrative_area_level_2'),
    state: get('administrative_area_level_1'),
    country: get('country'),
    countryCode: get('country', true),
    postcode: get('postal_code'),
  };
}

type Suggestion = { id: string; main: string; secondary: string; prediction: google.maps.places.PlacePrediction };

function Picker({
  initialCoords,
  zoomLevel,
  language = 'en',
  photoPoints = [],
  readOnly = false,
  placeholder,
  searchLabel,
  onChange,
}: Props) {
  const { t } = useUi();
  placeholder = placeholder || t('mapSearchPh');
  searchLabel = searchLabel || t('mapSearch');
  const map = useMap();
  const places = useMapsLibrary('places');
  const geocoding = useMapsLibrary('geocoding');

  const [position, setPosition] = useState<google.maps.LatLngLiteral | null>(initialCoords ? { lat: initialCoords.lat, lng: initialCoords.lng } : null);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [busy, setBusy] = useState(false);
  const [locating, setLocating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const sessionToken = useRef<google.maps.places.AutocompleteSessionToken | null>(null);
  const skipSuggest = useRef(false);
  const skipPan = useRef(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Follow coordinates set from outside (manual input, photo GPS).
  useEffect(() => {
    if (!initialCoords) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPosition((prev) => (prev && Math.abs(prev.lat - initialCoords.lat) < 1e-9 && Math.abs(prev.lng - initialCoords.lng) < 1e-9 ? prev : { lat: initialCoords.lat, lng: initialCoords.lng }));
  }, [initialCoords]);

  useEffect(() => {
    if (!map || !position) return;
    if (skipPan.current) {
      skipPan.current = false;
      return;
    }
    map.panTo(position);
    map.setZoom(zoomLevel || Math.max(map.getZoom() || 0, 17));
  }, [map, position, zoomLevel]);

  const photoKey = photoPoints.map((p) => `${p.lat},${p.lng}`).join('|');
  useEffect(() => {
    if (!map || position || photoPoints.length === 0) return;
    if (photoPoints.length === 1) {
      map.setCenter(photoPoints[0]);
      map.setZoom(16);
    } else {
      const b = new google.maps.LatLngBounds();
      photoPoints.forEach((p) => b.extend(p));
      map.fitBounds(b, 60);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, photoKey]);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 5000);
    return () => clearTimeout(t);
  }, [notice]);

  /** Reverse geocode with Google so the address fields match what's on the map. */
  const reverse = useCallback(
    async (pos: google.maps.LatLngLiteral, source: string) => {
      if (!geocoding) {
        onChange?.(pos, source);
        return;
      }
      try {
        const { results } = await new geocoding.Geocoder().geocode({ location: pos, language });
        const best = results?.[0];
        if (!best) throw new Error('none');
        const addr = parseAddress(best.address_components as AddressComponent[]);
        onChange?.(pos, source, best.formatted_address, 'Google', {
          ...addr,
          displayName: best.formatted_address,
          lat: pos.lat,
          lon: pos.lng,
          provider: 'Google',
          type: addr.houseNumber ? 'address' : best.types?.[0],
          exactMatch: !!addr.houseNumber,
        });
      } catch {
        // No address here (sea, desert…) or geocoding unavailable: coordinates still count.
        onChange?.(pos, source, 'Custom coordinates selected', 'Google');
      }
    },
    [geocoding, language, onChange],
  );

  const place = (pos: google.maps.LatLngLiteral, source: string, pan = true) => {
    if (!pan) skipPan.current = true;
    setPosition(pos);
    reverse(pos, source);
  };

  // Places autocomplete (New) with a session token, so a search + pick bills as one session.
  useEffect(() => {
    if (readOnly || !places) return;
    if (skipSuggest.current) {
      skipSuggest.current = false;
      return;
    }
    const input = query.trim();
    if (input.length < 3 || parseCoordinates(input)) {
      setSuggestions([]);
      return;
    }
    let cancelled = false;
    const t = setTimeout(async () => {
      try {
        if (!sessionToken.current) sessionToken.current = new places.AutocompleteSessionToken();
        const center = map?.getCenter();
        const { suggestions: res } = await places.AutocompleteSuggestion.fetchAutocompleteSuggestions({
          input,
          sessionToken: sessionToken.current,
          language,
          ...(center && (map?.getZoom() || 0) > 5 ? { origin: center, locationBias: center } : {}),
        });
        if (cancelled) return;
        setSuggestions(
          res
            .filter((s) => s.placePrediction)
            .map((s) => ({
              id: s.placePrediction!.placeId,
              main: s.placePrediction!.mainText?.text || s.placePrediction!.text.text,
              secondary: s.placePrediction!.secondaryText?.text || '',
              prediction: s.placePrediction!,
            })),
        );
        setActive(-1);
        setOpen(true);
      } catch {
        if (!cancelled) setNotice('Address search is unavailable. Check that Places API (New) is enabled for your key.');
      }
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [query, places, map, language, readOnly]);

  const choose = async (s: Suggestion) => {
    skipSuggest.current = true;
    setOpen(false);
    setBusy(true);
    try {
      const p = s.prediction.toPlace();
      // Essentials-tier fields only (10,000 free/month). displayName would bill as Pro,
      // so the name comes from the autocomplete prediction instead (free in a session).
      await p.fetchFields({ fields: ['location', 'formattedAddress', 'addressComponents', 'types', 'viewport'] });
      sessionToken.current = null; // session ends once a place is fetched
      if (!p.location) throw new Error('no location');
      const pos = { lat: p.location.lat(), lng: p.location.lng() };
      const addr = parseAddress(p.addressComponents as AddressComponent[]);
      const name = p.formattedAddress && !p.formattedAddress.startsWith(s.main) ? `${s.main}, ${p.formattedAddress}` : p.formattedAddress || s.main;
      setQuery(name);
      setPosition(pos);
      if (p.viewport && map && !addr.houseNumber) map.fitBounds(p.viewport);
      onChange?.(pos, 'search', name, 'Google', {
        ...addr,
        displayName: name,
        lat: pos.lat,
        lon: pos.lng,
        provider: 'Google',
        type: addr.houseNumber ? 'address' : p.types?.[0],
        exactMatch: !!addr.houseNumber,
      });
    } catch {
      setNotice('Could not load that place. Try another result.');
    } finally {
      setBusy(false);
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const coords = parseCoordinates(query);
    if (coords) {
      setOpen(false);
      place(coords, 'manual');
      return;
    }
    const pick = suggestions[active >= 0 ? active : 0];
    if (pick) choose(pick);
    else if (query.trim().length >= 3) setNotice('No matching place yet. Keep typing or pick from the list.');
  };

  const locate = () => {
    if (!navigator.geolocation) return setNotice(t('mapNoGeo'));
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setLocating(false);
        place({ lat: p.coords.latitude, lng: p.coords.longitude }, 'current-location');
      },
      () => {
        setLocating(false);
        setNotice(t('mapBlocked'));
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const fitPhotos = () => {
    if (!map || photoPoints.length === 0) return;
    const b = new google.maps.LatLngBounds();
    photoPoints.forEach((p) => b.extend(p));
    if (photoPoints.length === 1) {
      map.panTo(photoPoints[0]);
      map.setZoom(17);
    } else map.fitBounds(b, 60);
  };

  const copy = async () => {
    if (!position) return;
    try {
      await navigator.clipboard.writeText(formatDecimal(position.lat, position.lng));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked */
    }
  };

  // Map click / marker drag
  useEffect(() => {
    if (!map || readOnly) return;
    const l = map.addListener('click', (e: google.maps.MapMouseEvent) => {
      if (e.latLng) place({ lat: e.latLng.lat(), lng: e.latLng.lng() }, 'map', false);
    });
    return () => l.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, readOnly, reverse]);

  const ctrlBtn =
    'flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-700 shadow-lg ring-1 ring-slate-900/10 hover:bg-slate-50 hover:text-blue-700 transition-colors disabled:opacity-60';

  return (
    <>
      {!readOnly && (
        <div ref={searchRef} className="absolute top-3 left-3 right-3 sm:right-auto sm:w-[min(520px,calc(100%-11rem))] z-10">
          <form onSubmit={submit} className="flex items-stretch gap-2" role="search">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => suggestions.length > 0 && setOpen(true)}
                onKeyDown={(e) => {
                  if (!open || suggestions.length === 0) return;
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setActive((a) => Math.min(a + 1, suggestions.length - 1));
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setActive((a) => Math.max(a - 1, -1));
                  } else if (e.key === 'Escape') setOpen(false);
                }}
                placeholder={placeholder}
                aria-label={placeholder}
                aria-autocomplete="list"
                aria-expanded={open}
                className="w-full h-12 rounded-xl border border-slate-200 bg-white pl-10 pr-9 text-sm font-medium text-slate-900 shadow-xl outline-none focus:ring-2 focus:ring-blue-600"
              />
              {query && !busy && (
                <button type="button" onClick={() => { setQuery(''); setSuggestions([]); }} className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:text-slate-700" aria-label={t('mapClear')}>
                  <X className="w-4 h-4" />
                </button>
              )}
              {busy && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-600 animate-spin" />}
              {open && suggestions.length > 0 && (
                <ul className="absolute top-full left-0 right-0 mt-2 max-h-80 overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 shadow-2xl" role="listbox">
                  {suggestions.map((s, i) => (
                    <li key={s.id} role="option" aria-selected={i === active}>
                      <button
                        type="button"
                        onMouseEnter={() => setActive(i)}
                        onClick={() => choose(s)}
                        className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors ${i === active ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
                      >
                        <span className="mt-0.5 rounded-lg bg-slate-100 p-1.5 text-slate-500">
                          <MapPin className="w-4 h-4" />
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-semibold text-slate-900">{s.main}</span>
                          {s.secondary && <span className="mt-0.5 block truncate text-xs text-slate-500">{s.secondary}</span>}
                        </span>
                      </button>
                    </li>
                  ))}
                  {/* Google requires this attribution when showing Places results. */}
                  <li className="flex justify-end px-4 py-1.5">
                    <span className="text-[10px] font-medium text-slate-400">Powered by Google</span>
                  </li>
                </ul>
              )}
            </div>
            <button type="submit" disabled={busy} className="hidden sm:flex h-12 items-center rounded-xl bg-blue-600 px-5 text-sm font-bold text-white shadow-xl hover:bg-blue-700 disabled:opacity-60">
              {searchLabel}
            </button>
          </form>
        </div>
      )}

      <div className="absolute right-3 bottom-28 z-10 flex flex-col gap-2">
        {!readOnly && (
          <button type="button" className={ctrlBtn} onClick={locate} disabled={locating} title={t('mapLocate')} aria-label={t('mapLocate')}>
            {locating ? <Loader2 className="w-5 h-5 animate-spin" /> : <LocateFixed className="w-5 h-5" />}
          </button>
        )}
        {photoPoints.length > 0 && (
          <button type="button" className={ctrlBtn} onClick={fitPhotos} title={t('mapPhotos')} aria-label={t('mapPhotos')}>
            <Images className="w-5 h-5" />
          </button>
        )}
      </div>

      {notice && (
        <div className="absolute left-1/2 top-[4.5rem] z-10 -translate-x-1/2 rounded-lg bg-slate-900/90 px-4 py-2 text-xs font-medium text-white shadow-lg" role="status">
          {notice}
        </div>
      )}
      {!readOnly && !position && (
        <div className="pointer-events-none absolute bottom-8 left-1/2 z-10 -translate-x-1/2 rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-slate-700 shadow-lg ring-1 ring-slate-900/10">
          {t('mapHint')}
        </div>
      )}
      {position && (
        <div className="absolute bottom-8 left-3 z-10 max-w-[calc(100%-5rem)] rounded-xl bg-white/95 p-2 pr-2.5 shadow-xl ring-1 ring-slate-900/10">
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-blue-600 p-1.5 text-white">
              <MapPin className="w-3.5 h-3.5" />
            </span>
            <div className="min-w-0 font-mono text-[11px] leading-tight text-slate-800">
              <div className="font-semibold">{formatDecimal(position.lat, position.lng)}</div>
              <div className="text-slate-500">{formatDms(position.lat, position.lng)}</div>
            </div>
            <button type="button" onClick={copy} className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900" title={t('copyCoords')} aria-label={t('copyCoords')}>
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      )}

      {photoPoints.map((p, i) => (
        <AdvancedMarker
          key={`${p.lat}-${p.lng}-${i}`}
          position={p}
          title={readOnly ? p.label : `${p.label}: ${t('mapUsePhoto')}`}
          onClick={readOnly ? undefined : () => place({ lat: p.lat, lng: p.lng }, 'photo')}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full border-[3px] border-white bg-slate-900 text-white shadow-lg">
            <Camera className="w-3.5 h-3.5" />
          </div>
        </AdvancedMarker>
      ))}

      {position && (
        <AdvancedMarker
          position={position}
          draggable={!readOnly}
          onDragEnd={(e: google.maps.MapMouseEvent) => e.latLng && place({ lat: e.latLng.lat(), lng: e.latLng.lng() }, 'map', false)}
        >
          <Pin background="#2563eb" borderColor="#ffffff" glyphColor="#ffffff" scale={1.25} />
        </AdvancedMarker>
      )}
    </>
  );
}

export default function GoogleMapPicker(props: Props) {
  const start = props.initialCoords || props.photoPoints?.[0];
  return (
    <div className={`relative flex-1 w-full h-full ${props.heightClass || 'min-h-[500px]'} flex flex-col`} dir="ltr">
      <div className="relative flex-1 overflow-hidden rounded-xl border border-slate-200">
        <APIProvider apiKey={GOOGLE_MAPS_KEY} language={props.language} libraries={['places', 'geocoding', 'marker']}>
          <Map
            mapId={MAP_ID}
            defaultCenter={start ? { lat: start.lat, lng: start.lng } : { lat: 20, lng: 0 }}
            defaultZoom={start ? props.zoomLevel || 16 : 2}
            gestureHandling="greedy"
            mapTypeControl
            mapTypeControlOptions={{ position: 3 /* TOP_RIGHT */ }}
            fullscreenControl
            streetViewControl={false}
            clickableIcons={false}
            className="absolute inset-0 h-full w-full"
          />
          <Picker {...props} />
        </APIProvider>
      </div>
    </div>
  );
}
