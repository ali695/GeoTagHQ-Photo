'use client';

import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, Download, Gauge, ImageIcon, Loader2, Trash2, X } from 'lucide-react';
import FileDrop from './FileDrop';
import { downloadBlob, downloadZip, encodeCanvas, formatBytes, isHeicFile, loadDrawable, replaceExt } from '@/lib/imageIO';

type Item = { id: string; file: File; preview?: string; status: 'queued' | 'working' | 'done' | 'error'; result?: Blob; name?: string; info?: string; error?: string };

/**
 * Compress a photo to just under a target size (e.g. 50 KB) for exam, job and government forms.
 * Strategy: binary-search the JPEG quality; if even low quality is too big, scale the image down
 * step by step and search again. Always returns the largest file that fits.
 */
async function fitToSize(file: File, targetBytes: number, mime: 'image/jpeg' | 'image/webp') {
  const img = await loadDrawable(file);
  try {
    // Start near the likely answer: a typical JPG needs ~0.08 bytes per pixel at mid quality,
    // so begin with roughly target/0.08 pixels (never upscaling, never above 3000 px).
    const estimate = Math.sqrt(targetBytes / 0.08 / (img.width * img.height));
    let scale = Math.min(1, 3000 / Math.max(img.width, img.height), estimate);
    for (let round = 0; round < 12; round++) {
      const w = Math.max(1, Math.round(img.width * scale));
      const h = Math.max(1, Math.round(img.height * scale));
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img.source, 0, 0, w, h);

      let lo = 0.3, hi = 0.95, best: { blob: Blob; q: number } | null = null;
      for (let i = 0; i < 7; i++) {
        const q = (lo + hi) / 2;
        const blob = await encodeCanvas(canvas, mime, q);
        if (blob.size <= targetBytes) { best = { blob, q }; lo = q; } else hi = q;
      }
      if (!best) {
        const floor = await encodeCanvas(canvas, mime, 0.3);
        if (floor.size <= targetBytes) best = { blob: floor, q: 0.3 };
      }
      if (best) return { blob: best.blob, w, h, q: Math.round(best.q * 100) };
      if (w < 120 || h < 120) break;
      scale *= 0.82;
    }
    throw new Error('This image can’t get that small without becoming unusable. Try a larger target size.');
  } finally {
    img.close?.();
  }
}

export default function CompressToSize({ targetKB = 100 }: { targetKB?: number }) {
  const [items, setItems] = useState<Item[]>([]);
  const [target, setTarget] = useState(String(targetKB));
  const [format, setFormat] = useState<'image/jpeg' | 'image/webp'>('image/jpeg');
  const [busy, setBusy] = useState(false);
  const ref = useRef(items);
  ref.current = items;
  useEffect(() => () => ref.current.forEach((i) => i.preview && URL.revokeObjectURL(i.preview)), []);

  const requeue = () => setItems((p) => p.map((i) => (i.status === 'done' ? { ...i, status: 'queued' } : i)));
  const update = (id: string, patch: Partial<Item>) => setItems((p) => p.map((i) => (i.id === id ? { ...i, ...patch } : i)));
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

  const kb = Math.max(5, Math.min(5000, parseInt(target, 10) || targetKB));
  const ext = format === 'image/webp' ? 'webp' : 'jpg';

  const run = async () => {
    setBusy(true);
    const bytes = kb * 1024;
    for (const it of ref.current) {
      if (it.status === 'done') continue;
      update(it.id, { status: 'working', error: undefined });
      try {
        const isSameFormat = format === 'image/jpeg' ? /jpe?g$/i.test(it.file.name) || it.file.type === 'image/jpeg' : it.file.type === 'image/webp';
        if (isSameFormat && it.file.size <= bytes) {
          update(it.id, { status: 'done', result: it.file, name: it.file.name, info: 'Already under the limit, kept as is' });
          continue;
        }
        const r = await fitToSize(it.file, bytes, format);
        update(it.id, { status: 'done', result: r.blob, name: replaceExt(it.file.name.replace(/\.[^.]+$/, '') + `-${kb}kb.x`, ext), info: `${r.w}×${r.h} px · quality ${r.q}%` });
      } catch (e: any) {
        update(it.id, { status: 'error', error: e?.message || 'Could not compress this image.' });
      }
    }
    setBusy(false);
  };

  const done = items.filter((i) => i.status === 'done' && i.result);
  const pending = items.some((i) => i.status !== 'done');

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="min-w-0 space-y-4">
        <FileDrop onFiles={add} compact={items.length > 0} title={`Drop a photo to get it under ${kb} KB`} />
        {items.length > 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <p className="text-sm font-semibold text-slate-700">{items.length} {items.length === 1 ? 'image' : 'images'}</p>
              <button type="button" onClick={() => setItems([])} className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-red-600"><Trash2 className="h-4 w-4" aria-hidden /> Clear all</button>
            </div>
            <ul className="divide-y divide-slate-100">
              {items.map((it) => {
                const ok = it.result && it.result.size <= kb * 1024;
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
                        {it.result && <><span aria-hidden>→</span><span className="font-semibold text-slate-800">{formatBytes(it.result.size)}</span></>}
                        {ok && <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 font-bold text-emerald-700"><CheckCircle2 className="h-3.5 w-3.5" aria-hidden /> Under {kb} KB</span>}
                        {it.info && <span className="text-slate-600">{it.info}</span>}
                        {it.status === 'working' && <span className="inline-flex items-center gap-1 text-blue-600"><Loader2 className="h-3 w-3 animate-spin" aria-hidden /> Finding the best quality…</span>}
                        {it.status === 'error' && <span className="text-red-600">{it.error}</span>}
                      </div>
                    </div>
                    {it.status === 'done' && it.result ? (
                      <button type="button" onClick={() => downloadBlob(it.result!, it.name!)} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-700"><Download className="h-4 w-4" aria-hidden /> Download</button>
                    ) : (
                      <button type="button" onClick={() => setItems((p) => p.filter((x) => x.id !== it.id))} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100" aria-label={`Remove ${it.file.name}`}><X className="h-4 w-4" /></button>
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
          <label htmlFor="tkb" className="mb-2 block text-sm font-bold text-slate-900">Target size</label>
          <div className="flex items-center gap-2">
            <input id="tkb" inputMode="numeric" value={target} onChange={(e) => { setTarget(e.target.value.replace(/\D/g, '')); requeue(); }} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <span className="font-mono text-sm font-bold text-slate-600">KB</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {[20, 50, 100, 200, 500].map((v) => (
              <button key={v} type="button" onClick={() => { setTarget(String(v)); requeue(); }} className={`rounded-lg px-2.5 py-1 text-xs font-bold ${kb === v ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:text-slate-900'}`}>{v} KB</button>
            ))}
          </div>
          <p className="mt-2 text-xs text-slate-500">We keep the best quality that still fits under your limit.</p>
        </div>
        <div>
          <p className="mb-2 text-sm font-bold text-slate-900">Format</p>
          <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1">
            {([['image/jpeg', 'JPG (forms)'], ['image/webp', 'WebP (web)']] as const).map(([v, l]) => (
              <button key={v} type="button" aria-pressed={format === v} onClick={() => { setFormat(v); requeue(); }} className={`rounded-lg py-2 text-xs font-bold transition-all ${format === v ? 'bg-white text-blue-700 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-800'}`}>{l}</button>
            ))}
          </div>
          <p className="mt-1.5 text-xs text-slate-500">Most upload forms ask for JPG.</p>
        </div>
        <button type="button" disabled={!pending || busy || !items.length} onClick={run} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 font-bold text-white shadow-lg shadow-blue-600/25 disabled:cursor-not-allowed disabled:opacity-50">
          {busy ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : <Gauge className="h-5 w-5" aria-hidden />} Compress to {kb} KB
        </button>
        {done.length > 1 && (
          <button type="button" onClick={() => downloadZip(done.map((d) => ({ name: d.name!, blob: d.result! })), `images-under-${kb}kb.zip`)} className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 font-bold text-white hover:bg-emerald-700">
            <Download className="h-5 w-5" aria-hidden /> Download all (ZIP)
          </button>
        )}
      </aside>
    </div>
  );
}
