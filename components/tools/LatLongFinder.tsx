'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Copy, Check, ExternalLink, MapPin, Navigation, ArrowRight } from 'lucide-react';
import MapPicker from '@/components/tool/MapPicker';
import { formatDecimal, formatDms, googleMapsUrl, parseCoordinates } from '@/lib/geo';
import { useUi } from './UiProvider';

type Picked = { lat: number; lng: number; address?: string; source?: string };

function CopyRow({ label, value }: { label: string; value: string }) {
  const { t } = useUi();
  const [ok, setOk] = useState(false);
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5">
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{label}</p>
        <p className="truncate font-mono text-sm font-semibold text-slate-900" dir="ltr">{value}</p>
      </div>
      <button
        type="button"
        onClick={async () => {
          await navigator.clipboard.writeText(value).catch(() => {});
          setOk(true);
          setTimeout(() => setOk(false), 1500);
        }}
        className="shrink-0 rounded-lg p-2 text-slate-500 hover:bg-white hover:text-slate-900"
        aria-label={`${t('copyCoords')}: ${label}`}
      >
        {ok ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
      </button>
    </div>
  );
}

export default function LatLongFinder() {
  const { t, lang } = useUi();
  const [picked, setPicked] = useState<Picked | null>(null);
  const [manual, setManual] = useState('');
  const [manualError, setManualError] = useState<string | null>(null);

  const lookupAddress = async (lat: number, lng: number) => {
    try {
      const r = await fetch(`/api/reverse-geocode?lat=${lat}&lon=${lng}&lang=${lang}`);
      const d = await r.json();
      setPicked((p) => (p && p.lat === lat && p.lng === lng ? { ...p, address: d?.result?.displayName } : p));
    } catch {
      /* address is optional */
    }
  };

  const onMapChange = (c: { lat: number; lng: number }, source: string, displayName?: string) => {
    const hasAddress = displayName && displayName !== 'Custom coordinates selected';
    setPicked({ lat: c.lat, lng: c.lng, address: hasAddress ? displayName : undefined, source });
    if (!hasAddress) lookupAddress(c.lat, c.lng);
  };

  const goManual = (e: React.FormEvent) => {
    e.preventDefault();
    const c = parseCoordinates(manual);
    if (!c) {
      setManualError(t('llInvalid'));
      return;
    }
    setManualError(null);
    setPicked({ lat: c.lat, lng: c.lng, source: 'manual' });
    lookupAddress(c.lat, c.lng);
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
      <div className="h-[460px] md:h-[560px] flex">
        <MapPicker
          initialCoords={picked ? { lat: picked.lat, lng: picked.lng } : undefined}
          onChange={onMapChange}
          heightClass="min-h-[460px]"
          placeholder={t('llSearchPh')}
        />
      </div>

      <aside className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="flex items-center gap-2 font-bold text-slate-900"><MapPin className="w-5 h-5 text-blue-600" aria-hidden /> {t('llCoords')}</h3>
          {picked ? (
            <div className="mt-4 space-y-2.5">
              {picked.address && <p className="text-sm font-medium text-slate-700 leading-snug">{picked.address}</p>}
              <CopyRow label={t('llLatLng')} value={formatDecimal(picked.lat, picked.lng)} />
              <div className="grid grid-cols-2 gap-2.5">
                <CopyRow label={t('llLat')} value={picked.lat.toFixed(6)} />
                <CopyRow label={t('llLng')} value={picked.lng.toFixed(6)} />
              </div>
              <CopyRow label={t('llDms')} value={formatDms(picked.lat, picked.lng)} />
              <div className="flex flex-wrap gap-2 pt-1">
                <a href={googleMapsUrl(picked.lat, picked.lng)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  <ExternalLink className="w-4 h-4" aria-hidden /> Google Maps
                </a>
                <Link href={lang === 'en' ? '/free-geo-tagging-tool' : `/${lang}/free-geo-tagging-tool`} className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800">
                  {t('llAddToPhoto')} <ArrowRight className="w-4 h-4" aria-hidden />
                </Link>
              </div>
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-600">{t('llEmpty')}</p>
          )}
        </div>

        <form onSubmit={goManual} className="rounded-2xl border border-slate-200 bg-white p-5">
          <label htmlFor="manual" className="flex items-center gap-2 font-bold text-slate-900"><Navigation className="w-5 h-5 text-blue-600" aria-hidden /> {t('llFind')}</label>
          <p className="mt-1 text-xs text-slate-500">{t('llFindHint')}</p>
          <div className="mt-3 flex gap-2">
            <input id="manual" value={manual} onChange={(e) => setManual(e.target.value)} placeholder="33.6844, 73.0479" className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" dir="ltr" />
            <button type="submit" className="rounded-xl bg-blue-600 px-4 text-sm font-bold text-white hover:bg-blue-700">{t('llShow')}</button>
          </div>
          {manualError && <p className="mt-2 text-xs text-red-600">{manualError}</p>}
        </form>

      </aside>
    </div>
  );
}
