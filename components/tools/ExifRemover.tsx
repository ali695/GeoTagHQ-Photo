'use client';

import { useRef, useState } from 'react';
import { Download, Loader2, X, ShieldCheck, MapPin, Camera, Calendar, AlertTriangle, Trash2, Eraser, Info } from 'lucide-react';
import FileDrop from './FileDrop';
import { downloadBlob, downloadZip, formatBytes } from '@/lib/imageIO';
import { metadataSummary, stripMetadata, type StripResult } from '@/lib/stripMetadata';
import { useUi } from './UiProvider';

type Summary = Awaited<ReturnType<typeof metadataSummary>>;
type Item = {
  id: string;
  file: File;
  before?: Summary;
  status: 'reading' | 'ready' | 'working' | 'done' | 'error';
  result?: StripResult;
  after?: Summary;
  error?: string;
};

export default function ExifRemover() {
  const { t } = useUi();
  const [items, setItems] = useState<Item[]>([]);
  const [busy, setBusy] = useState(false);
  const ref = useRef(items);
  ref.current = items;

  const update = (id: string, patch: Partial<Item>) => setItems((p) => p.map((i) => (i.id === id ? { ...i, ...patch } : i)));

  const add = async (files: File[]) => {
    const fresh = files.slice(0, Math.max(0, 20 - ref.current.length)).map((file) => ({ id: Math.random().toString(36).slice(2), file, status: 'reading' as const }));
    setItems((p) => [...p, ...fresh]);
    for (const it of fresh) {
      const before = await metadataSummary(it.file);
      update(it.id, { before, status: 'ready' });
    }
  };

  const removeAll = async () => {
    setBusy(true);
    for (const it of ref.current) {
      if (it.status !== 'ready' && it.status !== 'error') continue;
      update(it.id, { status: 'working', error: undefined });
      try {
        const result = await stripMetadata(it.file);
        // Read the cleaned file back to prove the metadata is gone.
        const after = await metadataSummary(result.blob);
        update(it.id, { status: 'done', result, after });
      } catch (e: any) {
        update(it.id, { status: 'error', error: e?.message || t('remError') });
      }
    }
    setBusy(false);
  };

  const done = items.filter((i) => i.status === 'done' && i.result);
  const ready = items.some((i) => i.status === 'ready' || i.status === 'error');
  const withGps = items.filter((i) => i.before?.gps).length;

  return (
    <div className="space-y-5">
      <FileDrop onFiles={add} compact={items.length > 0} title={t('remDrop')} />

      {items.length > 0 && (
        <>
          {withGps > 0 && (
            <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600" aria-hidden />
              <p>{t('remGpsWarn', { n: withGps, total: items.length })}</p>
            </div>
          )}

          <ul className="space-y-3">
            {items.map((it) => {
              const b = it.before;
              const clean = it.status === 'done' && it.after && it.after.count === 0 && !it.after.gps;
              return (
                <li key={it.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-start gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-slate-900">{it.result?.name || it.file.name}</p>
                      <p className="text-xs text-slate-500">
                        {formatBytes(it.file.size)}
                        {it.result && ` → ${formatBytes(it.result.blob.size)}`}
                      </p>
                    </div>
                    {it.status === 'done' && it.result ? (
                      <button type="button" onClick={() => downloadBlob(it.result!.blob, it.result!.name)} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-700">
                        <Download className="w-4 h-4" aria-hidden /> {t('download')}
                      </button>
                    ) : (
                      <button type="button" onClick={() => setItems((p) => p.filter((x) => x.id !== it.id))} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label={t('removeFile', { name: it.file.name })}>
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* What was found */}
                  {it.status === 'reading' && <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-slate-500"><Loader2 className="w-3 h-3 animate-spin" aria-hidden /> {t('remReading')}</p>}
                  {b && it.status !== 'done' && (
                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      {b.count === 0 ? (
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-600">{t('remNoMeta')}</span>
                      ) : (
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 font-semibold text-slate-700">{t('remFields', { n: b.count })}</span>
                      )}
                      {b.gps && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 font-semibold text-red-700 ring-1 ring-red-100">
                          <MapPin className="w-3 h-3" aria-hidden /> GPS {b.gps.lat.toFixed(4)}, {b.gps.lng.toFixed(4)}
                        </span>
                      )}
                      {b.camera && <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-slate-700"><Camera className="w-3 h-3" aria-hidden /> {b.camera}</span>}
                      {b.date && <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-slate-700"><Calendar className="w-3 h-3" aria-hidden /> {b.date}</span>}
                    </div>
                  )}

                  {it.status === 'working' && <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-blue-600"><Loader2 className="w-3 h-3 animate-spin" aria-hidden /> {t('remWorking')}</p>}
                  {it.status === 'error' && <p className="mt-3 text-xs font-medium text-red-600">{it.error}</p>}

                  {/* Result, verified by reading the clean file */}
                  {it.status === 'done' && it.after && (
                    <div className="mt-3 space-y-1.5">
                      <p className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${clean ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100' : 'bg-amber-50 text-amber-800 ring-1 ring-amber-100'}`}>
                        <ShieldCheck className="w-3.5 h-3.5" aria-hidden />
                        {clean ? t('remVerified') : t('remRemain', { n: it.after.count }) + (it.after.gps ? t('remGpsStill') : t('remNoGps'))}
                        {it.result?.method === 'lossless' && ` · ${t('remLossless')}`}
                      </p>
                      {it.result?.note && <p className="flex items-start gap-1.5 text-xs text-slate-500"><Info className="w-3.5 h-3.5 mt-px shrink-0" aria-hidden /> {t(it.result.note === 'heic' ? 'remNoteHeic' : it.result.note === 'rotated' ? 'remNoteRotated' : 'remNoteFormat')}</p>}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200 bg-white p-4">
            <button type="button" onClick={() => setItems([])} className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-red-600">
              <Trash2 className="w-4 h-4" aria-hidden /> {t('clearAll')}
            </button>
            <div className="flex flex-col gap-2 sm:flex-row">
              {done.length > 1 && (
                <button type="button" onClick={() => downloadZip(done.map((d) => ({ name: d.result!.name, blob: d.result!.blob })), 'photos-no-exif.zip')} className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white hover:bg-emerald-700">
                  <Download className="w-5 h-5" aria-hidden /> {t('downloadAll')}
                </button>
              )}
              <button type="button" disabled={!ready || busy} onClick={removeAll} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-bold text-white shadow-lg shadow-blue-600/25 disabled:cursor-not-allowed disabled:opacity-50">
                {busy ? <Loader2 className="w-5 h-5 animate-spin" aria-hidden /> : <Eraser className="w-5 h-5" aria-hidden />}
                {t('remBtn')}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
