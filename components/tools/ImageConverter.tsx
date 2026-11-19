'use client';

import { useEffect, useRef, useState } from 'react';
import { Download, Loader2, X, CheckCircle2, AlertCircle, ArrowRight, Trash2, ImageIcon } from 'lucide-react';
import FileDrop, { ACCEPT_IMAGES, acceptFor } from './FileDrop';
import { downloadBlob, downloadZip, encodeCanvas, fileToCanvas, formatBytes, isHeicFile, replaceExt, type OutputMime } from '@/lib/imageIO';
import { useUi } from './UiProvider';

type Target = 'jpg' | 'png' | 'webp';
const MIME: Record<Target, OutputMime> = { jpg: 'image/jpeg', png: 'image/png', webp: 'image/webp' };

type Item = {
  id: string;
  file: File;
  preview?: string;
  status: 'queued' | 'working' | 'done' | 'error';
  result?: Blob;
  resultUrl?: string;
  outName?: string;
  error?: string;
};

const SIZES = [0, 2560, 1920, 1200, 800];

export default function ImageConverter({
  from,
  to: initialTo = 'jpg',
  chooseTarget = false,
}: {
  /** Input format this page is for (e.g. "heic"); undefined accepts any image. */
  from?: string;
  to?: Target;
  /** Show the output-format picker (general Image Converter page). */
  chooseTarget?: boolean;
}) {
  const { t } = useUi();
  const [items, setItems] = useState<Item[]>([]);
  const [to, setTo] = useState<Target>(initialTo);
  const [quality, setQuality] = useState(90);
  const [background, setBackground] = useState('#ffffff');
  const [maxSize, setMaxSize] = useState(0);
  const [busy, setBusy] = useState(false);
  const itemsRef = useRef(items);
  itemsRef.current = items;

  useEffect(
    () => () => {
      for (const it of itemsRef.current) {
        if (it.preview) URL.revokeObjectURL(it.preview);
        if (it.resultUrl) URL.revokeObjectURL(it.resultUrl);
      }
    },
    [],
  );

  // A page like "JPG to PNG" still accepts any image, but leads with its own format.
  const accept = from ? { ...acceptFor(from === 'jpg' ? ['jpg', 'jpeg'] : [from]), ...ACCEPT_IMAGES } : ACCEPT_IMAGES;

  const add = (files: File[]) => {
    setItems((prev) => [
      ...prev,
      ...files.slice(0, Math.max(0, 20 - prev.length)).map((file) => ({
        id: Math.random().toString(36).slice(2),
        file,
        // Browsers can't show HEIC, so its preview appears after conversion.
        preview: isHeicFile(file) ? undefined : URL.createObjectURL(file),
        status: 'queued' as const,
      })),
    ]);
  };

  const update = (id: string, patch: Partial<Item>) => setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));

  const convertAll = async () => {
    setBusy(true);
    const mime = MIME[to];
    for (const it of itemsRef.current) {
      if (it.status === 'done') continue;
      update(it.id, { status: 'working', error: undefined });
      try {
        const canvas = await fileToCanvas(it.file, {
          maxWidth: maxSize || undefined,
          maxHeight: maxSize || undefined,
          // JPG has no transparency, so fill it; PNG/WebP keep transparent areas.
          background: to === 'jpg' ? background : undefined,
        });
        const blob = await encodeCanvas(canvas, mime, quality / 100);
        const url = URL.createObjectURL(blob);
        update(it.id, {
          status: 'done',
          result: blob,
          resultUrl: url,
          outName: replaceExt(it.file.name, to),
          preview: it.preview || url,
        });
      } catch (e: any) {
        update(it.id, { status: 'error', error: e?.message || t('convError') });
      }
    }
    setBusy(false);
  };

  const done = items.filter((i) => i.status === 'done' && i.result);
  const pending = items.some((i) => i.status === 'queued' || i.status === 'error');
  const totalIn = done.reduce((s, i) => s + i.file.size, 0);
  const totalOut = done.reduce((s, i) => s + (i.result?.size || 0), 0);

  const reset = () => {
    items.forEach((i) => {
      if (i.preview) URL.revokeObjectURL(i.preview);
      if (i.resultUrl && i.resultUrl !== i.preview) URL.revokeObjectURL(i.resultUrl);
    });
    setItems([]);
  };

  // Changing settings re-queues finished files so they convert again with the new options.
  const requeue = () => setItems((prev) => prev.map((i) => (i.status === 'done' ? { ...i, status: 'queued' } : i)));

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4 min-w-0">
        <FileDrop
          onFiles={add}
          accept={accept}
          compact={items.length > 0}
          title={from ? t('convDrop', { fmt: from === 'jpg' ? 'JPG' : from === 'webp' ? 'WebP' : from.toUpperCase() }) : t('dropTitle')}
        />

        {items.length > 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
              <p className="text-sm font-semibold text-slate-700">{items.length === 1 ? t('fileOne') : t('fileCount', { n: items.length })}</p>
              <button type="button" onClick={reset} className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-red-600">
                <Trash2 className="w-4 h-4" aria-hidden /> {t('clearAll')}
              </button>
            </div>
            <ul className="divide-y divide-slate-100">
              {items.map((it) => (
                <li key={it.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-[conic-gradient(#f1f5f9_25%,#fff_0_50%,#f1f5f9_0_75%,#fff_0)] bg-[length:12px_12px]">
                    {it.preview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={it.preview} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <ImageIcon className="m-3 h-6 w-6 text-slate-300" aria-hidden />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900">{it.outName || it.file.name}</p>
                    <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-slate-500">
                      <span>{formatBytes(it.file.size)}</span>
                      {it.result && (
                        <>
                          <ArrowRight className="w-3 h-3" aria-hidden />
                          <span className="font-semibold text-slate-700">{formatBytes(it.result.size)}</span>
                        </>
                      )}
                      {it.status === 'working' && <span className="inline-flex items-center gap-1 text-blue-600"><Loader2 className="w-3 h-3 animate-spin" aria-hidden /> {t('converting')}</span>}
                      {it.status === 'error' && <span className="inline-flex items-center gap-1 text-red-600"><AlertCircle className="w-3 h-3" aria-hidden /> {it.error}</span>}
                      {it.status === 'done' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" aria-label={t('converted')} />}
                    </p>
                  </div>
                  {it.status === 'done' && it.result ? (
                    <button
                      type="button"
                      onClick={() => downloadBlob(it.result!, it.outName!)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                    >
                      <Download className="w-4 h-4" aria-hidden /> {t('download')}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setItems((p) => p.filter((x) => x.id !== it.id))}
                      className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                      aria-label={t('removeFile', { name: it.file.name })}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Settings */}
      <aside className="h-fit space-y-5 rounded-2xl border border-slate-200 bg-white p-5 lg:sticky lg:top-24">
        {chooseTarget && (
          <div>
            <p className="mb-2 text-sm font-bold text-slate-900">{t('convertTo')}</p>
            <div className="grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1">
              {(['jpg', 'png', 'webp'] as Target[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => { setTo(t); requeue(); }}
                  className={`rounded-lg py-2 text-sm font-bold uppercase transition-all ${to === t ? 'bg-white text-blue-700 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-800'}`}
                  aria-pressed={to === t}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {to !== 'png' && (
          <div>
            <label htmlFor="q" className="mb-2 flex items-center justify-between text-sm font-bold text-slate-900">
              {t('quality')} <span className="font-mono text-blue-700">{quality}%</span>
            </label>
            <input id="q" type="range" min={40} max={100} step={1} value={quality} onChange={(e) => { setQuality(Number(e.target.value)); requeue(); }} className="w-full accent-blue-600" />
            <p className="mt-1 text-xs text-slate-500">{t('qualityHint')}</p>
          </div>
        )}

        {to === 'jpg' && (
          <div>
            <label htmlFor="bg" className="mb-2 block text-sm font-bold text-slate-900">{t('background')}</label>
            <div className="flex items-center gap-3">
              <input id="bg" type="color" value={background} onChange={(e) => { setBackground(e.target.value); requeue(); }} className="h-10 w-14 cursor-pointer rounded-lg border border-slate-200" />
              <span className="font-mono text-sm text-slate-600">{background}</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">{t('backgroundHint')}</p>
          </div>
        )}

        <div>
          <label htmlFor="size" className="mb-2 block text-sm font-bold text-slate-900">{t('resize')}</label>
          <select id="size" value={maxSize} onChange={(e) => { setMaxSize(Number(e.target.value)); requeue(); }} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500">
            {SIZES.map((v) => <option key={v} value={v}>{v ? t('sizeMax', { n: v }) : t('sizeOriginal')}</option>)}
          </select>
        </div>

        <button
          type="button"
          disabled={!pending || busy}
          onClick={convertAll}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 font-bold text-white shadow-lg shadow-blue-600/25 transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? <><Loader2 className="w-5 h-5 animate-spin" aria-hidden /> {t('converting')}</> : <>{t('convertBtn', { fmt: to === 'webp' ? 'WebP' : to.toUpperCase() })}</>}
        </button>

        {done.length > 1 && (
          <button
            type="button"
            onClick={() => downloadZip(done.map((d) => ({ name: d.outName!, blob: d.result! })), `converted-${to}.zip`)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 font-bold text-white hover:bg-emerald-700"
          >
            <Download className="w-5 h-5" aria-hidden /> {t('downloadAll')}
          </button>
        )}

        {done.length > 0 && (
          <p className="rounded-xl bg-slate-50 p-3 text-center text-sm text-slate-600">
            {formatBytes(totalIn)} → <span className="font-bold text-slate-900">{formatBytes(totalOut)}</span>
            {totalOut < totalIn && <span className="ms-1 font-semibold text-emerald-700">({t('smaller', { n: Math.round((1 - totalOut / totalIn) * 100) })})</span>}
          </p>
        )}
      </aside>
    </div>
  );
}
