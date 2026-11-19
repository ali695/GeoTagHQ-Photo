'use client';

import { useEffect, useRef, useState } from 'react';
import { Download, Loader2, X, Trash2, Minimize2, ImageIcon, CheckCircle2 } from 'lucide-react';
import FileDrop from './FileDrop';
import { downloadBlob, downloadZip, encodeCanvas, fileToCanvas, formatBytes, isHeicFile, replaceExt, serverConvert, type OutputMime } from '@/lib/imageIO';
import { useUi } from './UiProvider';

type Out = 'same' | 'webp' | 'jpg';
type Item = { id: string; file: File; preview?: string; status: 'queued' | 'working' | 'done' | 'error'; result?: Blob; name?: string; keptOriginal?: boolean; error?: string };

const PRESETS = [
  { key: 'cmpSmallest', q: 55 },
  { key: 'cmpBalanced', q: 75 },
  { key: 'cmpHigh', q: 88 },
] as const;

function srcMime(f: File): string {
  if (isHeicFile(f)) return 'image/heic';
  if (f.type) return f.type;
  if (/\.png$/i.test(f.name)) return 'image/png';
  if (/\.webp$/i.test(f.name)) return 'image/webp';
  return 'image/jpeg';
}

export default function ImageCompressor() {
  const { t } = useUi();
  const [items, setItems] = useState<Item[]>([]);
  const [quality, setQuality] = useState(75);
  const [out, setOut] = useState<Out>('same');
  const [maxWidth, setMaxWidth] = useState(0);
  const [busy, setBusy] = useState(false);
  const ref = useRef(items);
  ref.current = items;

  useEffect(() => () => ref.current.forEach((i) => i.preview && URL.revokeObjectURL(i.preview)), []);

  const update = (id: string, patch: Partial<Item>) => setItems((p) => p.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  const requeue = () => setItems((p) => p.map((i) => (i.status === 'done' ? { ...i, status: 'queued' } : i)));

  const add = (files: File[]) =>
    setItems((p) => [
      ...p,
      ...files.slice(0, Math.max(0, 20 - p.length)).map((file) => ({
        id: Math.random().toString(36).slice(2),
        file,
        preview: isHeicFile(file) ? undefined : URL.createObjectURL(file),
        status: 'queued' as const,
      })),
    ]);

  const compressOne = async (f: File): Promise<{ blob: Blob; name: string }> => {
    const src = srcMime(f);
    // Decide the output type: keep the format, except HEIC/AVIF/GIF which become JPG.
    let mime: OutputMime;
    if (out === 'webp') mime = 'image/webp';
    else if (out === 'jpg') mime = 'image/jpeg';
    else mime = src === 'image/png' ? 'image/png' : src === 'image/webp' ? 'image/webp' : 'image/jpeg';
    const ext = mime === 'image/png' ? 'png' : mime === 'image/webp' ? 'webp' : 'jpg';
    const name = replaceExt(f.name, ext);

    // PNG -> PNG: browsers can't do lossy PNG, so use the server's palette quantization.
    if (mime === 'image/png') {
      const input = maxWidth ? await encodeCanvas(await fileToCanvas(f, { maxWidth }), 'image/png') : f;
      return { blob: await serverConvert(input, 'image/png', quality / 100), name };
    }
    const canvas = await fileToCanvas(f, { maxWidth: maxWidth || undefined, background: mime === 'image/jpeg' ? '#ffffff' : undefined });
    return { blob: await encodeCanvas(canvas, mime, quality / 100), name };
  };

  const run = async () => {
    setBusy(true);
    for (const it of ref.current) {
      if (it.status === 'done') continue;
      update(it.id, { status: 'working', error: undefined });
      try {
        const r = await compressOne(it.file);
        const sameType = r.name.split('.').pop() === it.file.name.split('.').pop()?.toLowerCase().replace('jpeg', 'jpg');
        // Never hand back a bigger file in the same format: keep the original instead.
        if (r.blob.size >= it.file.size && sameType && !maxWidth) {
          update(it.id, { status: 'done', result: it.file, name: it.file.name, keptOriginal: true });
        } else {
          update(it.id, { status: 'done', result: r.blob, name: r.name, keptOriginal: false, preview: it.preview || URL.createObjectURL(r.blob) });
        }
      } catch (e: any) {
        update(it.id, { status: 'error', error: e?.message || t('cmpError') });
      }
    }
    setBusy(false);
  };

  const done = items.filter((i) => i.status === 'done' && i.result);
  const before = done.reduce((s, i) => s + i.file.size, 0);
  const after = done.reduce((s, i) => s + (i.result?.size || 0), 0);
  const pending = items.some((i) => i.status === 'queued' || i.status === 'error');

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4 min-w-0">
        <FileDrop onFiles={add} compact={items.length > 0} title={t('cmpDrop')} />
        {items.length > 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <p className="text-sm font-semibold text-slate-700">{items.length === 1 ? t('imageOne') : t('imageCount', { n: items.length })}</p>
              <button type="button" onClick={() => setItems([])} className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-red-600"><Trash2 className="w-4 h-4" aria-hidden /> {t('clearAll')}</button>
            </div>
            <ul className="divide-y divide-slate-100">
              {items.map((it) => {
                const saved = it.result && !it.keptOriginal ? Math.round((1 - it.result.size / it.file.size) * 100) : 0;
                return (
                  <li key={it.id} className="flex items-center gap-3 px-4 py-3">
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {it.preview ? <img src={it.preview} alt="" className="h-full w-full object-cover" /> : <ImageIcon className="m-3 h-6 w-6 text-slate-300" aria-hidden />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-900">{it.name || it.file.name}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span>{formatBytes(it.file.size)}</span>
                        {it.result && !it.keptOriginal && <><span aria-hidden>→</span><span className="font-semibold text-slate-800">{formatBytes(it.result.size)}</span></>}
                        {saved > 0 && <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-bold text-emerald-700">−{saved}%</span>}
                        {saved < 0 && <span className="rounded-full bg-amber-50 px-2 py-0.5 font-bold text-amber-700">+{-saved}% {t('cmpFormatChange')}</span>}
                        {it.keptOriginal && <span className="inline-flex items-center gap-1 text-slate-600"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" aria-hidden /> {t('cmpKept')}</span>}
                        {it.status === 'working' && <span className="inline-flex items-center gap-1 text-blue-600"><Loader2 className="w-3 h-3 animate-spin" aria-hidden /> {t('cmpWorking')}</span>}
                        {it.status === 'error' && <span className="text-red-600">{it.error}</span>}
                      </div>
                      {it.result && !it.keptOriginal && (
                        <div className="mt-1.5 h-1.5 w-full max-w-xs rounded-full bg-slate-100">
                          <div className="h-1.5 rounded-full bg-emerald-500" style={{ width: `${Math.max(3, Math.min(100, (it.result.size / it.file.size) * 100))}%` }} />
                        </div>
                      )}
                    </div>
                    {it.status === 'done' && it.result ? (
                      <button type="button" onClick={() => downloadBlob(it.result!, it.name!)} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-700">
                        <Download className="w-4 h-4" aria-hidden /> {t('download')}
                      </button>
                    ) : (
                      <button type="button" onClick={() => setItems((p) => p.filter((x) => x.id !== it.id))} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100" aria-label={t('removeFile', { name: it.file.name })}><X className="w-4 h-4" /></button>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      <aside className="h-fit space-y-5 rounded-2xl border border-slate-200 bg-white p-5 lg:sticky lg:top-24">
        <div>
          <p className="mb-2 text-sm font-bold text-slate-900">{t('cmpLevel')}</p>
          <div className="grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1">
            {PRESETS.map((p) => (
              <button key={p.key} type="button" onClick={() => { setQuality(p.q); requeue(); }} aria-pressed={quality === p.q} className={`rounded-lg py-2 text-xs font-bold transition-all ${quality === p.q ? 'bg-white text-blue-700 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-800'}`}>
                {t(p.key)}
              </button>
            ))}
          </div>
          <label htmlFor="cq" className="mt-3 flex items-center justify-between text-xs font-semibold text-slate-600">{t('quality')} <span className="font-mono text-blue-700">{quality}%</span></label>
          <input id="cq" type="range" min={30} max={95} value={quality} onChange={(e) => { setQuality(Number(e.target.value)); requeue(); }} className="w-full accent-blue-600" />
        </div>

        <div>
          <p className="mb-2 text-sm font-bold text-slate-900">{t('cmpFormat')}</p>
          <div className="grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1">
            {([['same', t('cmpSame')], ['webp', 'WebP'], ['jpg', 'JPG']] as [Out, string][]).map(([v, l]) => (
              <button key={v} type="button" onClick={() => { setOut(v); requeue(); }} aria-pressed={out === v} className={`rounded-lg py-2 text-xs font-bold transition-all ${out === v ? 'bg-white text-blue-700 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-800'}`}>{l}</button>
            ))}
          </div>
          <p className="mt-1.5 text-xs text-slate-500">{t('cmpFormatHint')}</p>
        </div>

        <div>
          <label htmlFor="mw" className="mb-2 block text-sm font-bold text-slate-900">{t('cmpMaxWidth')}</label>
          <select id="mw" value={maxWidth} onChange={(e) => { setMaxWidth(Number(e.target.value)); requeue(); }} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value={0}>{t('cmpKeep')}</option>
            <option value={2560}>2560 px</option>
            <option value={1920}>{t('cmpFullHd')}</option>
            <option value={1200}>{t('cmpBlog')}</option>
            <option value={800}>800 px</option>
          </select>
        </div>

        <button type="button" disabled={!pending || busy} onClick={run} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 font-bold text-white shadow-lg shadow-blue-600/25 disabled:cursor-not-allowed disabled:opacity-50">
          {busy ? <Loader2 className="w-5 h-5 animate-spin" aria-hidden /> : <Minimize2 className="w-5 h-5" aria-hidden />} {t('cmpBtn')}
        </button>

        {done.length > 1 && (
          <button type="button" onClick={() => downloadZip(done.map((d) => ({ name: d.name!, blob: d.result! })), 'compressed-images.zip')} className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 font-bold text-white hover:bg-emerald-700">
            <Download className="w-5 h-5" aria-hidden /> {t('downloadAll')}
          </button>
        )}

        {done.length > 0 && before > 0 && (
          <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 p-4 text-center ring-1 ring-emerald-100">
            <p className="text-3xl font-extrabold text-emerald-700">−{Math.max(0, Math.round((1 - after / before) * 100))}%</p>
            <p className="mt-1 text-sm text-slate-600">{formatBytes(before)} → <span className="font-semibold text-slate-900">{formatBytes(after)}</span></p>
          </div>
        )}
      </aside>
    </div>
  );
}
