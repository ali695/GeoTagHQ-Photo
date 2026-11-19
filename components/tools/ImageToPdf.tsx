'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUp, Download, FileText, ImageIcon, Loader2, Trash2, X } from 'lucide-react';
import FileDrop from './FileDrop';
import { downloadBlob, encodeCanvas, fileToCanvas, formatBytes, isHeicFile } from '@/lib/imageIO';
import { buildPdf, type Orientation, type PageSize, type PdfImage } from '@/lib/pdf';

type Item = { id: string; file: File; preview?: string };

const seg = (on: boolean) =>
  `rounded-lg py-2 text-xs font-bold transition-all ${on ? 'bg-white text-blue-700 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-800'}`;

/** Combine images into one PDF, entirely in the browser. */
export default function ImageToPdf({ format = 'JPG' }: { format?: 'JPG' | 'PNG' }) {
  const [items, setItems] = useState<Item[]>([]);
  const [size, setSize] = useState<PageSize>('a4');
  const [orientation, setOrientation] = useState<Orientation>('auto');
  const [margin, setMargin] = useState(10);
  const [quality, setQuality] = useState(90);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Blob | null>(null);
  const ref = useRef(items);
  ref.current = items;
  useEffect(() => () => ref.current.forEach((i) => i.preview && URL.revokeObjectURL(i.preview)), []);

  const add = (files: File[]) => {
    setResult(null);
    setItems((p) => [
      ...p,
      ...files.slice(0, Math.max(0, 50 - p.length)).map((file) => ({
        id: Math.random().toString(36).slice(2),
        file,
        preview: isHeicFile(file) ? undefined : URL.createObjectURL(file),
      })),
    ]);
  };
  const move = (i: number, d: -1 | 1) => {
    setResult(null);
    setItems((p) => {
      const n = [...p];
      const j = i + d;
      if (j < 0 || j >= n.length) return p;
      [n[i], n[j]] = [n[j], n[i]];
      return n;
    });
  };

  const create = async () => {
    setBusy(true);
    setError(null);
    try {
      const pages: PdfImage[] = [];
      for (const it of ref.current) {
        // Cap very large photos at 3000 px: sharp on print, sensible file size.
        const canvas = await fileToCanvas(it.file, { maxWidth: 3000, maxHeight: 3000, background: '#ffffff' });
        const jpg = await encodeCanvas(canvas, 'image/jpeg', quality / 100);
        pages.push({ jpeg: new Uint8Array(await jpg.arrayBuffer()), width: canvas.width, height: canvas.height });
      }
      const bytes = buildPdf(pages, { size, orientation, marginMm: margin, title: ref.current[0]?.file.name.replace(/\.[^.]+$/, '') });
      setResult(new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' }));
    } catch (e: any) {
      setError(e?.message || 'Could not create the PDF.');
    } finally {
      setBusy(false);
    }
  };

  const pdfName = `${(items[0]?.file.name || 'images').replace(/\.[^.]+$/, '')}${items.length > 1 ? `-and-${items.length - 1}-more` : ''}.pdf`;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="min-w-0 space-y-4">
        <FileDrop onFiles={add} maxFiles={50} compact={items.length > 0} title={`Drop ${format} images here or click to choose`} />
        {items.length > 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <p className="text-sm font-semibold text-slate-700">{items.length} {items.length === 1 ? 'page' : 'pages'} · drag order with the arrows</p>
              <button type="button" onClick={() => { setItems([]); setResult(null); }} className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-red-600">
                <Trash2 className="h-4 w-4" aria-hidden /> Clear all
              </button>
            </div>
            <ol className="divide-y divide-slate-100">
              {items.map((it, i) => (
                <li key={it.id} className="flex items-center gap-3 px-4 py-3">
                  <span className="w-6 text-center font-mono text-xs font-bold text-slate-400">{i + 1}</span>
                  <div className="h-14 w-11 shrink-0 overflow-hidden rounded border border-slate-200 bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {it.preview ? <img src={it.preview} alt="" className="h-full w-full object-cover" /> : <ImageIcon className="m-2.5 h-6 w-6 text-slate-300" aria-hidden />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900">{it.file.name}</p>
                    <p className="text-xs text-slate-500">{formatBytes(it.file.size)}</p>
                  </div>
                  <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-30" aria-label={`Move ${it.file.name} up`}><ArrowUp className="h-4 w-4" /></button>
                  <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-30" aria-label={`Move ${it.file.name} down`}><ArrowDown className="h-4 w-4" /></button>
                  <button type="button" onClick={() => { setResult(null); setItems((p) => p.filter((x) => x.id !== it.id)); }} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100" aria-label={`Remove ${it.file.name}`}><X className="h-4 w-4" /></button>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

      <aside className="h-fit space-y-5 rounded-2xl border border-slate-200 bg-white p-5 lg:sticky lg:top-24">
        <div>
          <p className="mb-2 text-sm font-bold text-slate-900">Page size</p>
          <div className="grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1">
            {([['a4', 'A4'], ['letter', 'Letter'], ['fit', 'Fit image']] as [PageSize, string][]).map(([v, l]) => (
              <button key={v} type="button" aria-pressed={size === v} onClick={() => { setSize(v); setResult(null); }} className={seg(size === v)}>{l}</button>
            ))}
          </div>
        </div>
        {size !== 'fit' && (
          <div>
            <p className="mb-2 text-sm font-bold text-slate-900">Orientation</p>
            <div className="grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1">
              {([['auto', 'Auto'], ['portrait', 'Portrait'], ['landscape', 'Landscape']] as [Orientation, string][]).map(([v, l]) => (
                <button key={v} type="button" aria-pressed={orientation === v} onClick={() => { setOrientation(v); setResult(null); }} className={seg(orientation === v)}>{l}</button>
              ))}
            </div>
            <p className="mt-1.5 text-xs text-slate-500">Auto turns the page sideways for wide images.</p>
          </div>
        )}
        <div>
          <p className="mb-2 text-sm font-bold text-slate-900">Margin</p>
          <div className="grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1">
            {([[0, 'None'], [10, 'Small'], [20, 'Large']] as [number, string][]).map(([v, l]) => (
              <button key={v} type="button" aria-pressed={margin === v} onClick={() => { setMargin(v); setResult(null); }} className={seg(margin === v)}>{l}</button>
            ))}
          </div>
        </div>
        <div>
          <label htmlFor="pq" className="flex items-center justify-between text-sm font-bold text-slate-900">Image quality <span className="font-mono text-xs text-blue-700">{quality}%</span></label>
          <input id="pq" type="range" min={50} max={95} value={quality} onChange={(e) => { setQuality(Number(e.target.value)); setResult(null); }} className="mt-2 w-full accent-blue-600" />
          <p className="mt-1 text-xs text-slate-500">Lower quality makes a smaller PDF for email.</p>
        </div>

        <button type="button" disabled={!items.length || busy} onClick={create} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 font-bold text-white shadow-lg shadow-blue-600/25 disabled:cursor-not-allowed disabled:opacity-50">
          {busy ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : <FileText className="h-5 w-5" aria-hidden />} Create PDF
        </button>
        {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
        {result && (
          <div className="rounded-xl bg-emerald-50 p-4 ring-1 ring-emerald-100">
            <p className="text-sm font-semibold text-slate-800">{items.length} {items.length === 1 ? 'page' : 'pages'} · {formatBytes(result.size)}</p>
            <button type="button" onClick={() => downloadBlob(result, pdfName)} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 font-bold text-white hover:bg-emerald-700">
              <Download className="h-5 w-5" aria-hidden /> Download PDF
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
