'use client';

import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, Download, ImageIcon, Loader2, Scaling, Trash2, X } from 'lucide-react';
import FileDrop from './FileDrop';
import { downloadBlob, downloadZip, encodeCanvas, formatBytes, isHeicFile, loadDrawable, replaceExt, type OutputMime } from '@/lib/imageIO';

type Mode = 'percent' | 'pixels' | 'preset';
type Fit = 'cover' | 'contain';
type Out = 'same' | 'jpg' | 'png' | 'webp';
type Item = { id: string; file: File; preview?: string; status: 'queued' | 'working' | 'done' | 'error'; result?: Blob; name?: string; dims?: string; error?: string };

const PRESETS = [
  { id: 'ig-post', label: 'Instagram post', w: 1080, h: 1080 },
  { id: 'ig-portrait', label: 'Instagram portrait', w: 1080, h: 1350 },
  { id: 'ig-story', label: 'Instagram / TikTok story', w: 1080, h: 1920 },
  { id: 'fb-post', label: 'Facebook post', w: 1200, h: 630 },
  { id: 'fb-cover', label: 'Facebook cover', w: 851, h: 315 },
  { id: 'yt-thumb', label: 'YouTube thumbnail', w: 1280, h: 720 },
  { id: 'x-post', label: 'X (Twitter) post', w: 1600, h: 900 },
  { id: 'li-banner', label: 'LinkedIn banner', w: 1584, h: 396 },
  { id: 'gbp', label: 'Google Business Profile', w: 1200, h: 900 },
  { id: 'passport', label: 'Passport photo 2×2 in', w: 600, h: 600 },
];

const seg = (on: boolean) =>
  `rounded-lg py-2 text-xs font-bold transition-all ${on ? 'bg-white text-blue-700 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-800'}`;
const input = 'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500';

function outMime(f: File, out: Out): OutputMime {
  if (out === 'jpg') return 'image/jpeg';
  if (out === 'png') return 'image/png';
  if (out === 'webp') return 'image/webp';
  if (f.type === 'image/png' || /\.png$/i.test(f.name)) return 'image/png';
  if (f.type === 'image/webp' || /\.webp$/i.test(f.name)) return 'image/webp';
  return 'image/jpeg';
}

/** Resize images by percentage, exact pixels or a social-media preset, in the browser. */
export default function ImageResizer() {
  const [items, setItems] = useState<Item[]>([]);
  const [mode, setMode] = useState<Mode>('pixels');
  const [percent, setPercent] = useState(50);
  const [width, setWidth] = useState('1200');
  const [height, setHeight] = useState('');
  const [keepRatio, setKeepRatio] = useState(true);
  const [preset, setPreset] = useState(PRESETS[0].id);
  const [fit, setFit] = useState<Fit>('cover');
  const [out, setOut] = useState<Out>('same');
  const [quality, setQuality] = useState(90);
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

  const resizeOne = async (f: File) => {
    const img = await loadDrawable(f);
    try {
      const sw = img.width;
      const sh = img.height;
      let cw: number, ch: number; // canvas size
      let dx = 0, dy = 0, dw: number, dh: number; // where the image is drawn
      if (mode === 'percent') {
        cw = dw = Math.max(1, Math.round((sw * percent) / 100));
        ch = dh = Math.max(1, Math.round((sh * percent) / 100));
      } else if (mode === 'pixels') {
        const W = parseInt(width, 10) || 0;
        const H = parseInt(height, 10) || 0;
        if (!W && !H) throw new Error('Enter a width or a height.');
        if (keepRatio) {
          const s = Math.min(W ? W / sw : Infinity, H ? H / sh : Infinity);
          cw = dw = Math.max(1, Math.round(sw * s));
          ch = dh = Math.max(1, Math.round(sh * s));
        } else {
          cw = dw = W || sw;
          ch = dh = H || sh;
        }
      } else {
        const p = PRESETS.find((x) => x.id === preset)!;
        cw = p.w;
        ch = p.h;
        // cover: fill the frame and crop the overflow; contain: show everything with bars.
        const s = fit === 'cover' ? Math.max(cw / sw, ch / sh) : Math.min(cw / sw, ch / sh);
        dw = sw * s;
        dh = sh * s;
        dx = (cw - dw) / 2;
        dy = (ch - dh) / 2;
      }
      if (cw > 12000 || ch > 12000) throw new Error('That size is too large (max 12,000 px).');
      const mime = outMime(f, out);
      const canvas = document.createElement('canvas');
      canvas.width = cw;
      canvas.height = ch;
      const ctx = canvas.getContext('2d')!;
      if (mime === 'image/jpeg' || (mode === 'preset' && fit === 'contain')) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, cw, ch);
      }
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img.source, dx, dy, dw, dh);
      const blob = await encodeCanvas(canvas, mime, quality / 100);
      const ext = mime === 'image/png' ? 'png' : mime === 'image/webp' ? 'webp' : 'jpg';
      return { blob, name: replaceExt(f.name.replace(/\.[^.]+$/, '') + `-${cw}x${ch}.x`, ext), dims: `${sw}×${sh} → ${cw}×${ch}` };
    } finally {
      img.close?.();
    }
  };

  const run = async () => {
    setBusy(true);
    for (const it of ref.current) {
      if (it.status === 'done') continue;
      update(it.id, { status: 'working', error: undefined });
      try {
        const r = await resizeOne(it.file);
        update(it.id, { status: 'done', result: r.blob, name: r.name, dims: r.dims });
      } catch (e: any) {
        update(it.id, { status: 'error', error: e?.message || 'Could not resize this image.' });
      }
    }
    setBusy(false);
  };

  const done = items.filter((i) => i.status === 'done' && i.result);
  const pending = items.some((i) => i.status !== 'done');

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="min-w-0 space-y-4">
        <FileDrop onFiles={add} compact={items.length > 0} title="Drop images to resize or click to choose" />
        {items.length > 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <p className="text-sm font-semibold text-slate-700">{items.length} {items.length === 1 ? 'image' : 'images'}</p>
              <button type="button" onClick={() => setItems([])} className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-red-600"><Trash2 className="h-4 w-4" aria-hidden /> Clear all</button>
            </div>
            <ul className="divide-y divide-slate-100">
              {items.map((it) => (
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
                      {it.dims && <span className="inline-flex items-center gap-1 font-mono text-slate-700"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" aria-hidden /> {it.dims}</span>}
                      {it.status === 'working' && <span className="inline-flex items-center gap-1 text-blue-600"><Loader2 className="h-3 w-3 animate-spin" aria-hidden /> Resizing…</span>}
                      {it.status === 'error' && <span className="text-red-600">{it.error}</span>}
                    </div>
                  </div>
                  {it.status === 'done' && it.result ? (
                    <button type="button" onClick={() => downloadBlob(it.result!, it.name!)} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-700"><Download className="h-4 w-4" aria-hidden /> Download</button>
                  ) : (
                    <button type="button" onClick={() => setItems((p) => p.filter((x) => x.id !== it.id))} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100" aria-label={`Remove ${it.file.name}`}><X className="h-4 w-4" /></button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <aside className="h-fit space-y-5 rounded-2xl border border-slate-200 bg-white p-5 lg:sticky lg:top-24">
        <div>
          <p className="mb-2 text-sm font-bold text-slate-900">Resize by</p>
          <div className="grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1">
            {([['pixels', 'Pixels'], ['percent', 'Percent'], ['preset', 'Social size']] as [Mode, string][]).map(([v, l]) => (
              <button key={v} type="button" aria-pressed={mode === v} onClick={() => { setMode(v); requeue(); }} className={seg(mode === v)}>{l}</button>
            ))}
          </div>
        </div>

        {mode === 'pixels' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs font-semibold text-slate-600">Width (px)
                <input inputMode="numeric" value={width} onChange={(e) => { setWidth(e.target.value.replace(/\D/g, '')); requeue(); }} placeholder="auto" className={`${input} mt-1`} />
              </label>
              <label className="text-xs font-semibold text-slate-600">Height (px)
                <input inputMode="numeric" value={height} onChange={(e) => { setHeight(e.target.value.replace(/\D/g, '')); requeue(); }} placeholder="auto" className={`${input} mt-1`} />
              </label>
            </div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <input type="checkbox" checked={keepRatio} onChange={(e) => { setKeepRatio(e.target.checked); requeue(); }} className="h-4 w-4 accent-blue-600" />
              Keep aspect ratio (no stretching)
            </label>
          </div>
        )}

        {mode === 'percent' && (
          <div>
            <label htmlFor="rp" className="flex items-center justify-between text-xs font-semibold text-slate-600">Scale <span className="font-mono text-blue-700">{percent}%</span></label>
            <input id="rp" type="range" min={5} max={200} step={5} value={percent} onChange={(e) => { setPercent(Number(e.target.value)); requeue(); }} className="w-full accent-blue-600" />
          </div>
        )}

        {mode === 'preset' && (
          <div className="space-y-3">
            <select value={preset} onChange={(e) => { setPreset(e.target.value); requeue(); }} className={input} aria-label="Social media size">
              {PRESETS.map((p) => <option key={p.id} value={p.id}>{p.label} · {p.w}×{p.h}</option>)}
            </select>
            <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1">
              {([['cover', 'Fill & crop'], ['contain', 'Fit with border']] as [Fit, string][]).map(([v, l]) => (
                <button key={v} type="button" aria-pressed={fit === v} onClick={() => { setFit(v); requeue(); }} className={seg(fit === v)}>{l}</button>
              ))}
            </div>
          </div>
        )}

        <div>
          <p className="mb-2 text-sm font-bold text-slate-900">Format</p>
          <div className="grid grid-cols-4 gap-1 rounded-xl bg-slate-100 p-1">
            {([['same', 'Same'], ['jpg', 'JPG'], ['png', 'PNG'], ['webp', 'WebP']] as [Out, string][]).map(([v, l]) => (
              <button key={v} type="button" aria-pressed={out === v} onClick={() => { setOut(v); requeue(); }} className={seg(out === v)}>{l}</button>
            ))}
          </div>
          {out !== 'png' && (
            <>
              <label htmlFor="rq" className="mt-3 flex items-center justify-between text-xs font-semibold text-slate-600">Quality <span className="font-mono text-blue-700">{quality}%</span></label>
              <input id="rq" type="range" min={40} max={100} value={quality} onChange={(e) => { setQuality(Number(e.target.value)); requeue(); }} className="w-full accent-blue-600" />
            </>
          )}
        </div>

        <button type="button" disabled={!pending || busy || !items.length} onClick={run} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 font-bold text-white shadow-lg shadow-blue-600/25 disabled:cursor-not-allowed disabled:opacity-50">
          {busy ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : <Scaling className="h-5 w-5" aria-hidden />} Resize images
        </button>
        {done.length > 1 && (
          <button type="button" onClick={() => downloadZip(done.map((d) => ({ name: d.name!, blob: d.result! })), 'resized-images.zip')} className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 font-bold text-white hover:bg-emerald-700">
            <Download className="h-5 w-5" aria-hidden /> Download all (ZIP)
          </button>
        )}
      </aside>
    </div>
  );
}
