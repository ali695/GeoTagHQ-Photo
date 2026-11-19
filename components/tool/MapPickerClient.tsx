'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { GeoCoordinates } from '@/types/geo';
import { Search, Loader2, X, MapPin, LocateFixed, Layers, Maximize2, Minimize2, Copy, Check, Images } from 'lucide-react';
import { formatDecimal, formatDms, parseCoordinates } from '@/lib/geo';
import { useUi } from '@/components/tools/UiProvider';

export type PhotoPoint = { lat: number; lng: number; label: string };

interface MapPickerClientProps {
  initialCoords?: GeoCoordinates;
  zoomLevel?: number;
  language?: string;
  /** GPS already stored in uploaded photos, shown as camera markers. */
  photoPoints?: PhotoPoint[];
  /** Show the location only (no picking, no search). */
  readOnly?: boolean;
  placeholder?: string;
  searchLabel?: string;
  heightClass?: string;
  onChange?: (coords: GeoCoordinates, source: any, displayName?: string, provider?: string, fullSuggestion?: any) => void;
}

type Suggestion = {
  id: string;
  title: string;
  subtitle: string;
  displayName: string;
  lat: number;
  lon: number;
  type?: string;
  category?: string;
  [k: string]: any;
};

// Inline SVG markers, so nothing depends on external marker images.
const pinIcon = L.divIcon({
  className: '',
  html: `<div style="transform:translate(-50%,-100%);filter:drop-shadow(0 6px 8px rgba(30,64,175,.35))">
    <svg width="38" height="48" viewBox="0 0 38 48" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 47C19 47 36 29.6 36 18A17 17 0 1 0 2 18c0 11.6 17 29 17 29z" fill="#2563eb" stroke="#fff" stroke-width="3"/>
      <circle cx="19" cy="18" r="6.5" fill="#fff"/>
    </svg></div>`,
  iconSize: [0, 0],
});

const photoIcon = L.divIcon({
  className: '',
  html: `<div style="transform:translate(-50%,-50%);width:30px;height:30px;border-radius:9999px;background:#0f172a;border:3px solid #fff;box-shadow:0 4px 10px rgba(15,23,42,.35);display:flex;align-items:center;justify-content:center">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
  </div>`,
  iconSize: [0, 0],
});

const LAYERS = {
  streets: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Imagery &copy; Esri, Maxar, Earthstar Geographics, and the GIS User Community',
    maxZoom: 19,
  },
} as const;

const WORLD_CENTER = new L.LatLng(20, 0);

function ClickToPlace({ onPick, enabled }: { onPick: (pos: L.LatLng) => void; enabled: boolean }) {
  useMapEvents({
    click(e) {
      if (enabled) onPick(e.latlng);
    },
  });
  return null;
}

function MapRefSetter({ onReady }: { onReady: (m: L.Map) => void }) {
  const map = useMap();
  useEffect(() => onReady(map), [map, onReady]);
  return null;
}

function MapSizer({ trigger }: { trigger: unknown }) {
  const map = useMap();
  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 200);
    return () => clearTimeout(t);
  }, [map, trigger]);
  return null;
}

export default function MapPickerClient({
  initialCoords,
  zoomLevel,
  onChange,
  language = 'en',
  photoPoints = [],
  readOnly = false,
  placeholder,
  searchLabel,
  heightClass = 'min-h-[500px]',
}: MapPickerClientProps) {
  const { t } = useUi();
  placeholder = placeholder || t('mapSearchPh');
  searchLabel = searchLabel || t('mapSearch');
  const [position, setPosition] = useState<L.LatLng | null>(initialCoords ? new L.LatLng(initialCoords.lat, initialCoords.lng) : null);
  const [map, setMap] = useState<L.Map | null>(null);
  const [layer, setLayer] = useState<keyof typeof LAYERS>('streets');
  const [fullscreen, setFullscreen] = useState(false);
  const [copied, setCopied] = useState<'dec' | 'dms' | null>(null);
  const [locating, setLocating] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [searching, setSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const skipSuggest = useRef(false);

  // Follow coordinates set from outside (manual input, photo GPS, current location).
  useEffect(() => {
    if (!initialCoords) return;
    const next = new L.LatLng(initialCoords.lat, initialCoords.lng);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPosition((prev) => (prev && prev.equals(next, 1e-9) ? prev : next));
  }, [initialCoords]);

  // Fly to new positions from search, photos or outside input, but not when the
  // user clicked or dragged on the map (that would jerk the view around).
  const skipFly = useRef(false);
  useEffect(() => {
    if (!map || !position) return;
    if (skipFly.current) {
      skipFly.current = false;
      return;
    }
    map.flyTo(position, zoomLevel || Math.max(map.getZoom(), 15), { duration: 0.8 });
  }, [map, position, zoomLevel]);

  // Show all photo GPS points when photos are added and nothing is pinned yet.
  const photoKey = photoPoints.map((p) => `${p.lat},${p.lng}`).join('|');
  useEffect(() => {
    if (!map || position || photoPoints.length === 0) return;
    if (photoPoints.length === 1) map.setView([photoPoints[0].lat, photoPoints[0].lng], 15);
    else map.fitBounds(L.latLngBounds(photoPoints.map((p) => [p.lat, p.lng] as [number, number])), { padding: [60, 60] });
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
    if (!fullscreen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setFullscreen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [fullscreen]);

  const pick = useCallback(
    (pos: L.LatLng, source: string = 'map', displayName?: string, provider?: string, full?: any) => {
      if (source === 'map') skipFly.current = true;
      setPosition(pos);
      onChange?.({ lat: pos.lat, lng: pos.lng }, source, displayName, provider, full);
    },
    [onChange],
  );

  // Debounced, cancellable suggestions via our server (Photon).
  useEffect(() => {
    if (readOnly) return;
    if (skipSuggest.current) {
      skipSuggest.current = false;
      return;
    }
    const q = query.trim();
    if (q.length < 3 || parseCoordinates(q)) {
      setSuggestions([]);
      return;
    }
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const c = map?.getCenter();
        const params = new URLSearchParams({ q, lang: language });
        if (c && map && map.getZoom() > 4) {
          params.set('lat', c.lat.toFixed(4));
          params.set('lon', c.lng.toFixed(4));
        }
        const res = await fetch(`/api/place-suggest?${params}`, { signal: ctrl.signal });
        const data = await res.json();
        setSuggestions(data.results || []);
        setActive(-1);
        setOpen(true);
      } catch {
        /* aborted or offline */
      }
    }, 300);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [query, language, map, readOnly]);

  const selectSuggestion = (s: Suggestion) => {
    skipSuggest.current = true;
    setQuery(s.displayName);
    setOpen(false);
    pick(new L.LatLng(s.lat, s.lon), 'search', s.displayName, s.provider, {
      ...s,
      exactMatch: !!s.houseNumber,
    });
  };

  const runSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const q = query.trim();
    if (!q) return;

    // Pasted coordinates (decimal or DMS) jump straight there.
    const coords = parseCoordinates(q);
    if (coords) {
      setOpen(false);
      pick(new L.LatLng(coords.lat, coords.lng), 'manual');
      return;
    }
    if (active >= 0 && suggestions[active]) {
      selectSuggestion(suggestions[active]);
      return;
    }
    setSearching(true);
    setOpen(false);
    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(q)}&lang=${language}`);
      const data = await res.json();
      const best = data.results?.[0];
      if (best) {
        skipSuggest.current = true;
        setQuery(best.displayName);
        pick(new L.LatLng(best.lat, best.lon), 'search', best.displayName, 'OpenStreetMap', best);
      } else {
        setNotice(t('mapNoPlace'));
      }
    } catch {
      setNotice(t('mapUnavailable'));
    } finally {
      setSearching(false);
    }
  };

  const locate = () => {
    if (!navigator.geolocation) {
      setNotice(t('mapNoGeo'));
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setLocating(false);
        pick(new L.LatLng(p.coords.latitude, p.coords.longitude), 'current-location');
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
    if (photoPoints.length === 1) map.flyTo([photoPoints[0].lat, photoPoints[0].lng], 16);
    else map.flyToBounds(L.latLngBounds(photoPoints.map((p) => [p.lat, p.lng] as [number, number])), { padding: [60, 60] });
  };

  const copy = async (kind: 'dec' | 'dms') => {
    if (!position) return;
    const text = kind === 'dec' ? formatDecimal(position.lat, position.lng) : formatDms(position.lat, position.lng);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      /* clipboard blocked */
    }
  };

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 5000);
    return () => clearTimeout(t);
  }, [notice]);

  const tile = LAYERS[layer];
  const center = useMemo(() => position || (photoPoints[0] ? new L.LatLng(photoPoints[0].lat, photoPoints[0].lng) : WORLD_CENTER), []); // eslint-disable-line react-hooks/exhaustive-deps
  const ctrlBtn =
    'flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-700 shadow-lg ring-1 ring-slate-900/10 hover:bg-slate-50 hover:text-blue-700 transition-colors disabled:opacity-60';

  return (
    <div
      className={
        fullscreen
          ? 'fixed inset-0 z-[3000] flex flex-col bg-white p-2 sm:p-4'
          : `relative flex-1 w-full h-full ${heightClass} flex flex-col`
      }
      dir="ltr"
    >
      <div className="relative flex-1 overflow-hidden rounded-xl border border-slate-200 isolate">
        {/* Search */}
        {!readOnly && (
          <div ref={searchRef} className="absolute top-3 left-3 right-16 sm:right-auto sm:w-[min(520px,calc(100%-5rem))] z-[1000]">
            <form onSubmit={runSearch} className="flex items-stretch gap-2" role="search">
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
                  className="w-full h-12 rounded-xl border border-slate-200 bg-white/95 backdrop-blur pl-10 pr-9 text-sm font-medium text-slate-900 shadow-xl outline-none focus:ring-2 focus:ring-blue-600"
                />
                {query && !searching && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery('');
                      setSuggestions([]);
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:text-slate-700"
                    aria-label={t('mapClear')}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                {searching && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-600 animate-spin" />}

                {open && suggestions.length > 0 && (
                  <ul className="absolute top-full left-0 right-0 mt-2 max-h-80 overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 shadow-2xl" role="listbox">
                    {suggestions.map((s, i) => (
                      <li key={s.id} role="option" aria-selected={i === active}>
                        <button
                          type="button"
                          onMouseEnter={() => setActive(i)}
                          onClick={() => selectSuggestion(s)}
                          className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors ${i === active ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
                        >
                          <span className={`mt-0.5 rounded-lg p-1.5 ${s.type === 'address' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
                            <MapPin className="w-4 h-4" />
                          </span>
                          <span className="min-w-0">
                            <span className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                              <span className="truncate">{s.title}</span>
                              {s.category && s.category !== 'place' && s.category !== 'highway' && s.type && (
                                <span className="shrink-0 rounded bg-amber-100 px-1.5 text-[10px] font-bold uppercase text-amber-800">{String(s.type).replace(/_/g, ' ')}</span>
                              )}
                            </span>
                            {s.subtitle && <span className="mt-0.5 block truncate text-xs text-slate-500">{s.subtitle}</span>}
                          </span>
                        </button>
                      </li>
                    ))}
                    <li className="px-4 py-1.5 text-[10px] text-slate-400">Suggestions by Photon · © OpenStreetMap</li>
                  </ul>
                )}
              </div>
              <button
                type="submit"
                disabled={searching}
                className="hidden sm:flex h-12 items-center rounded-xl bg-blue-600 px-5 text-sm font-bold text-white shadow-xl hover:bg-blue-700 disabled:opacity-60"
              >
                {searchLabel}
              </button>
            </form>
          </div>
        )}

        {/* Map controls */}
        <div className="absolute right-3 top-3 z-[1000] flex flex-col gap-2">
          <button type="button" className={ctrlBtn} onClick={() => setLayer((l) => (l === 'streets' ? 'satellite' : 'streets'))} title={layer === 'streets' ? t('mapSatellite') : t('mapStreets')} aria-label={layer === 'streets' ? t('mapSatellite') : t('mapStreets')}>
            <Layers className="w-5 h-5" />
          </button>
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
          <button type="button" className={ctrlBtn} onClick={() => setFullscreen((f) => !f)} title={fullscreen ? t('mapExitFull') : t('mapFull')} aria-label={fullscreen ? t('mapExitFull') : t('mapFull')}>
            {fullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
        </div>

        {/* Hint / notices */}
        {notice && (
          <div className="absolute left-1/2 top-[4.5rem] z-[1000] -translate-x-1/2 rounded-lg bg-slate-900/90 px-4 py-2 text-xs font-medium text-white shadow-lg" role="status">
            {notice}
          </div>
        )}
        {!readOnly && !position && (
          <div className="pointer-events-none absolute bottom-3 left-1/2 z-[1000] -translate-x-1/2 rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-slate-700 shadow-lg ring-1 ring-slate-900/10">
            {t('mapHint')}
          </div>
        )}

        {/* Coordinates readout */}
        {position && (
          <div className="absolute bottom-3 left-3 z-[1000] max-w-[calc(100%-1.5rem)] rounded-xl bg-white/95 p-2 pr-2.5 shadow-xl ring-1 ring-slate-900/10 backdrop-blur">
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-blue-600 p-1.5 text-white">
                <MapPin className="w-3.5 h-3.5" />
              </span>
              <div className="min-w-0 font-mono text-[11px] leading-tight text-slate-800">
                <div className="font-semibold">{formatDecimal(position.lat, position.lng)}</div>
                <div className="text-slate-500">{formatDms(position.lat, position.lng)}</div>
              </div>
              <div className="flex gap-1 ps-1">
                <button type="button" onClick={() => copy('dec')} className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900" title={t('copyCoords')} aria-label={t('copyCoords')}>
                  {copied === 'dec' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
        )}

        <MapContainer
          center={center}
          zoom={position ? zoomLevel || 15 : photoPoints.length ? 13 : 2}
          minZoom={2}
          worldCopyJump
          scrollWheelZoom
          className="absolute inset-0 h-full w-full outline-none"
          style={{ position: 'absolute' }}
        >
          <TileLayer key={layer} url={tile.url} attribution={tile.attribution} maxZoom={tile.maxZoom} />
          {layer === 'satellite' && (
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
              attribution=""
              maxZoom={19}
            />
          )}
          <MapRefSetter onReady={setMap} />
          <MapSizer trigger={fullscreen} />
          <ClickToPlace enabled={!readOnly} onPick={(p) => pick(p, 'map')} />

          {photoPoints.map((p, i) => (
            <Marker
              key={`${p.lat}-${p.lng}-${i}`}
              position={[p.lat, p.lng]}
              icon={photoIcon}
              eventHandlers={readOnly ? undefined : { click: () => pick(new L.LatLng(p.lat, p.lng), 'photo') }}
            >
              <Tooltip direction="top" offset={[0, -14]}>
                <span className="text-xs font-semibold">{p.label}</span>
                {!readOnly && <span className="block text-[10px] text-slate-500">{t('mapUsePhoto')}</span>}
              </Tooltip>
            </Marker>
          ))}

          {position && (
            <Marker
              position={position}
              icon={pinIcon}
              draggable={!readOnly}
              eventHandlers={readOnly ? undefined : { dragend: (e) => pick((e.target as L.Marker).getLatLng(), 'map') }}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
}
