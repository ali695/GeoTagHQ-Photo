'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Camera, Aperture, Calendar, MapPin, Ruler, Cpu, Copy, Check, ExternalLink, Download, Search, Eraser, MapPinOff, Loader2, RefreshCw, Mountain,
} from 'lucide-react';
import FileDrop from './FileDrop';
import MapPicker from '@/components/tool/MapPicker';
import { parseExifAny } from '@/lib/exifAny';
import { downloadBlob, formatBytes, heicToBlob, isHeicFile } from '@/lib/imageIO';
import { formatDecimal, formatDms, googleMapsUrl } from '@/lib/geo';
import { useUi } from './UiProvider';

type Mode = 'viewer' | 'locator';
type Parsed = { merged: Record<string, any>; groups: Record<string, Record<string, any>> };

const GROUP_LABEL: Record<string, string> = { ifd0: 'Image (IFD0)', exif: 'Camera & exposure (EXIF)', gps: 'GPS', interop: 'Interoperability', ifd1: 'Thumbnail (IFD1)', iptc: 'IPTC', xmp: 'XMP', icc: 'Color profile (ICC)', jfif: 'JFIF', ihdr: 'PNG header', makerNote: 'Maker note' };

function fmtValue(v: any): string {
  if (v === null || v === undefined) return '';
  if (v instanceof Date) return isNaN(v.getTime()) ? '' : v.toLocaleString();
  if (v instanceof Uint8Array || ArrayBuffer.isView(v)) return `[binary, ${(v as any).byteLength ?? (v as any).length} bytes]`;
  if (Array.isArray(v)) return v.length > 12 ? `[${v.length} values]` : v.map(fmtValue).join(', ');
  if (typeof v === 'object') return JSON.stringify(v).slice(0, 200);
  if (typeof v === 'number') return Number.isInteger(v) ? String(v) : String(Math.round(v * 1e6) / 1e6);
  return String(v);
}

const exposure = (t?: number) => (!t ? undefined : t >= 1 ? `${t}s` : `1/${Math.round(1 / t)}s`);

export default function ExifViewer({ mode = 'viewer' }: { mode?: Mode }) {
  const { t, lang } = useUi();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [data, setData] = useState<Parsed | null>(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('');
  const [address, setAddress] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  const open = async (files: File[]) => {
    const f = files[0];
    if (!f) return;
    setFile(f);
    setData(null);
    setAddress(null);
    setFilter('');
    setLoading(true);
    try {
      const [merged, groups] = await Promise.all([
        parseExifAny(f, { tiff: true, exif: true, gps: true, iptc: true, xmp: true, icc: true, jfif: true, ihdr: true, ifd1: true, interop: true, mergeOutput: true, translateValues: true, reviveValues: true }),
        parseExifAny(f, { tiff: true, exif: true, gps: true, iptc: true, xmp: true, icc: true, jfif: true, ihdr: true, ifd1: true, interop: true, mergeOutput: false, translateValues: true, reviveValues: true }),
      ]);
      setData({ merged: merged || {}, groups: groups || {} });
    } catch {
      setData({ merged: {}, groups: {} });
    }
    setLoading(false);
    // Preview: browsers can't show HEIC, so decode it for display only.
    try {
      const blob = isHeicFile(f) ? await heicToBlob(f, 'image/jpeg', 0.7) : f;
      setPreview(URL.createObjectURL(blob));
    } catch {
      setPreview(null);
    }
  };

  const m = data?.merged || {};
  const gps = Number.isFinite(m.latitude) && Number.isFinite(m.longitude) ? { lat: m.latitude as number, lng: m.longitude as number } : null;

  // Street address for the photo's GPS (OpenStreetMap via our server).
  useEffect(() => {
    if (!gps) return;
    let cancelled = false;
    fetch(`/api/reverse-geocode?lat=${gps.lat}&lon=${gps.lng}&lang=${lang}`)
      .then((r) => r.json())
      .then((d) => { if (!cancelled) setAddress(d?.result?.displayName || null); })
      .catch(() => {});
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gps?.lat, gps?.lng]);

  const rows = useMemo(() => {
    const out: { group: string; key: string; value: string }[] = [];
    for (const [g, obj] of Object.entries(data?.groups || {})) {
      if (!obj || typeof obj !== 'object') continue;
      for (const [k, v] of Object.entries(obj)) {
        const value = fmtValue(v);
        if (value !== '') out.push({ group: g, key: k, value });
      }
    }
    const q = filter.trim().toLowerCase();
    return q ? out.filter((r) => r.key.toLowerCase().includes(q) || r.value.toLowerCase().includes(q)) : out;
  }, [data, filter]);

  const grouped = useMemo(() => {
    const g: Record<string, typeof rows> = {};
    for (const r of rows) (g[r.group] ||= []).push(r);
    return g;
  }, [rows]);

  const totalTags = useMemo(() => Object.values(data?.groups || {}).reduce((s, o: any) => s + (o && typeof o === 'object' ? Object.keys(o).length : 0), 0), [data]);

  const cards = [
    { icon: Camera, label: t('viewCamera'), value: [m.Make, m.Model].filter(Boolean).join(' ') || undefined },
    { icon: Aperture, label: t('viewLens'), value: m.LensModel || m.LensMake },
    { icon: Aperture, label: t('viewExposure'), value: [m.FNumber && `f/${m.FNumber}`, exposure(m.ExposureTime), m.ISO && `ISO ${m.ISO}`, m.FocalLength && `${m.FocalLength}mm`].filter(Boolean).join(' · ') || undefined },
    { icon: Calendar, label: t('viewDate'), value: m.DateTimeOriginal instanceof Date ? m.DateTimeOriginal.toLocaleString() : m.DateTimeOriginal || m.CreateDate },
    { icon: Ruler, label: t('viewDims'), value: (m.ExifImageWidth || m.ImageWidth) ? `${m.ExifImageWidth || m.ImageWidth} × ${m.ExifImageHeight || m.ImageHeight} px` : undefined },
    { icon: Cpu, label: t('viewSoftware'), value: m.Software },
    { icon: Mountain, label: t('viewAltitude'), value: Number.isFinite(m.GPSAltitude) ? `${Math.round(m.GPSAltitude)} m` : undefined },
  ].filter((c) => c.value);

  const copyCoords = async () => {
    if (!gps) return;
    await navigator.clipboard.writeText(formatDecimal(gps.lat, gps.lng)).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const exportJson = () => {
    const safe = JSON.parse(JSON.stringify(data?.groups || {}, (_k, v) => (ArrayBuffer.isView(v) ? `[binary ${(v as any).byteLength} bytes]` : v)));
    downloadBlob(new Blob([JSON.stringify(safe, null, 2)], { type: 'application/json' }), `${file?.name || 'photo'}-metadata.json`);
  };

  if (!file) {
    return (
      <FileDrop
        onFiles={open}
        multiple={false}
        maxSize={50 * 1024 * 1024}
        title={mode === 'locator' ? t('locDrop') : t('viewDrop')}
        hint={t('viewHint')}
      />
    );
  }

  const locationPanel = (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      {gps ? (
        <>
          <div className="h-[340px] md:h-[420px] flex">
            <MapPicker readOnly initialCoords={gps} zoomLevel={16} heightClass="min-h-[340px]" />
          </div>
          <div className="p-4 space-y-3">
            <div className="flex items-start gap-3">
              <span className="rounded-xl bg-blue-600 p-2 text-white"><MapPin className="w-5 h-5" aria-hidden /></span>
              <div className="min-w-0">
                <p className="font-semibold text-slate-900">{address || t('viewLookingUp')}</p>
                <p className="mt-0.5 font-mono text-xs text-slate-500" dir="ltr">{formatDecimal(gps.lat, gps.lng)} · {formatDms(gps.lat, gps.lng)}</p>
                {address && <p className="mt-1 text-[11px] text-slate-400">{t('viewAddrCredit')}</p>}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={copyCoords} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                {copied ? <Check className="w-4 h-4 text-emerald-600" aria-hidden /> : <Copy className="w-4 h-4" aria-hidden />} {t('copyCoords')}
              </button>
              <a href={googleMapsUrl(gps.lat, gps.lng)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                <ExternalLink className="w-4 h-4" aria-hidden /> {t('openMaps')}
              </a>
              <Link href={lang === 'en' ? '/remove-exif-data' : `/${lang}/remove-exif-data`} className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800">
                <Eraser className="w-4 h-4" aria-hidden /> {t('viewRemoveLoc')}
              </Link>
            </div>
          </div>
        </>
      ) : (
        <div className="p-6 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100"><MapPinOff className="w-6 h-6 text-slate-500" aria-hidden /></span>
          <p className="mt-3 font-bold text-slate-900">{t('viewNoGpsTitle')}</p>
          <p className="mt-1 text-sm text-slate-600 max-w-md mx-auto">
            {t('viewNoGpsText')}
          </p>
          <Link href={lang === 'en' ? '/free-geo-tagging-tool' : `/${lang}/free-geo-tagging-tool`} className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            <MapPin className="w-4 h-4" aria-hidden /> {t('viewAddLoc')}
          </Link>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-5">
      {/* File header */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center">
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {preview && <img src={preview} alt="" className="h-full w-full object-cover" />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold text-slate-900">{file.name}</p>
          <p className="text-sm text-slate-500">{formatBytes(file.size)} · {file.type || 'image'} · {loading ? t('viewReading') : t('viewFields', { n: totalTags })}</p>
        </div>
        <div className="flex gap-2">
          {data && totalTags > 0 && (
            <button type="button" onClick={exportJson} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              <Download className="w-4 h-4" aria-hidden /> JSON
            </button>
          )}
          <button type="button" onClick={() => { setFile(null); setData(null); setPreview(null); }} className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800">
            <RefreshCw className="w-4 h-4" aria-hidden /> {t('viewAnother')}
          </button>
        </div>
      </div>

      {loading && <p className="flex items-center gap-2 text-sm text-slate-600"><Loader2 className="w-4 h-4 animate-spin" aria-hidden /> {t('viewReading')}</p>}

      {data && (
        <>
          {mode === 'locator' && locationPanel}

          {cards.length > 0 && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {cards.map((c) => (
                <div key={c.label} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4">
                  <span className="rounded-xl bg-blue-50 p-2 text-blue-600 ring-1 ring-blue-100"><c.icon className="w-5 h-5" aria-hidden /></span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{c.label}</p>
                    <p className="mt-0.5 font-semibold text-slate-900 break-words">{String(c.value)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {mode === 'viewer' && locationPanel}

          {totalTags === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-slate-600">
              {t('viewNoMeta')}
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white">
              <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="font-bold text-slate-900">{t('viewAll', { n: rows.length })}</h3>
                <label className="relative">
                  <span className="sr-only">{t('viewFilter')}</span>
                  <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden />
                  <input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder={t('viewFilter')} className="w-full sm:w-64 rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </label>
              </div>
              <div className="max-h-[520px] overflow-auto">
                {Object.entries(grouped).map(([g, list]) => (
                  <div key={g}>
                    <p className="sticky top-0 z-[1] bg-slate-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-500">{GROUP_LABEL[g] || g}</p>
                    <dl className="divide-y divide-slate-100">
                      {list.map((r) => (
                        <div key={`${g}-${r.key}`} className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-4 px-4 py-2 text-sm">
                          <dt className="truncate font-medium text-slate-700" title={r.key}>{r.key}</dt>
                          <dd className="break-words font-mono text-xs text-slate-600" dir="auto">{r.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
