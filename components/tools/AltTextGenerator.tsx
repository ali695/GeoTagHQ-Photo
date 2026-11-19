'use client';

import { useRef, useState } from 'react';
import { Sparkles, Loader2, Copy, Check, X, Trash2, Code2, ImageIcon, AlertCircle } from 'lucide-react';
import FileDrop from './FileDrop';
import { encodeCanvas, fileToCanvas, isHeicFile } from '@/lib/imageIO';

type Result = { altText: string; alternatives: string[]; caption: string; fileName: string; decorative: boolean };
type Item = { id: string; file: File; preview?: string; status: 'queued' | 'working' | 'done' | 'error'; result?: Result; error?: string; ext?: string };

const LANGS = ['English', 'Spanish', 'German', 'French', 'Portuguese', 'Italian', 'Dutch', 'Turkish', 'Indonesian', 'Japanese', 'Korean', 'Arabic', 'Hindi', 'Urdu'];

function CopyBtn({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(text).catch(() => {});
        setOk(true);
        setTimeout(() => setOk(false), 1500);
      }}
      className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
    >
      {ok ? <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden /> : <Copy className="w-3.5 h-3.5" aria-hidden />} {ok ? 'Copied' : label}
    </button>
  );
}

/** Downscale to 1024px JPEG before sending: faster, cheaper, and enough for a description. */
async function toPayload(file: File) {
  const canvas = await fileToCanvas(file, { maxWidth: 1024, maxHeight: 1024, background: '#ffffff' });
  const blob = await encodeCanvas(canvas, 'image/jpeg', 0.8);
  const buf = new Uint8Array(await blob.arrayBuffer());
  let bin = '';
  for (let i = 0; i < buf.length; i += 0x8000) bin += String.fromCharCode(...buf.subarray(i, i + 0x8000));
  return { image: btoa(bin), preview: URL.createObjectURL(blob) };
}

export default function AltTextGenerator() {
  const [items, setItems] = useState<Item[]>([]);
  const [keyword, setKeyword] = useState('');
  const [context, setContext] = useState('');
  const [language, setLanguage] = useState('English');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const ref = useRef(items);
  ref.current = items;

  const update = (id: string, patch: Partial<Item>) => setItems((p) => p.map((i) => (i.id === id ? { ...i, ...patch } : i)));

  const add = (files: File[]) =>
    setItems((p) => [
      ...p,
      ...files.slice(0, Math.max(0, 10 - p.length)).map((file) => ({
        id: Math.random().toString(36).slice(2),
        file,
        preview: isHeicFile(file) ? undefined : URL.createObjectURL(file),
        status: 'queued' as const,
        ext: isHeicFile(file) ? 'jpg' : (file.name.split('.').pop() || 'jpg').toLowerCase(),
      })),
    ]);

  const run = async () => {
    setBusy(true);
    setNotice(null);
    for (const it of ref.current) {
      if (it.status === 'done') continue;
      update(it.id, { status: 'working', error: undefined });
      try {
        const { image, preview } = await toPayload(it.file);
        if (!it.preview) update(it.id, { preview });
        const res = await fetch('/api/alt-text', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image, mimeType: 'image/jpeg', keyword: keyword || undefined, context: context || undefined, language }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          update(it.id, { status: 'error', error: data.error || 'Something went wrong.' });
          // Stop on limits or missing setup: the next images would fail the same way.
          if (res.status === 429 || res.status === 503) {
            setNotice(data.error);
            break;
          }
          continue;
        }
        update(it.id, { status: 'done', result: data });
      } catch {
        update(it.id, { status: 'error', error: 'Could not read this image.' });
      }
    }
    setBusy(false);
  };

  const pending = items.some((i) => i.status === 'queued' || i.status === 'error');

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4 min-w-0">
        <FileDrop onFiles={add} maxFiles={10} maxSize={20 * 1024 * 1024} compact={items.length > 0} title="Drop images to write alt text" hint="JPG, PNG, WebP, HEIC · up to 10 images" />
        {notice && (
          <p className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900" role="alert">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden /> {notice}
          </p>
        )}

        {items.map((it) => (
          <div key={it.id} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex gap-4">
              <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {it.preview ? <img src={it.preview} alt="" className="h-full w-full object-cover" /> : <ImageIcon className="m-8 h-8 w-8 text-slate-300" aria-hidden />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="truncate text-sm font-semibold text-slate-500">{it.file.name}</p>
                  {it.status !== 'working' && (
                    <button type="button" onClick={() => setItems((p) => p.filter((x) => x.id !== it.id))} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100" aria-label={`Remove ${it.file.name}`}><X className="w-4 h-4" /></button>
                  )}
                </div>
                {it.status === 'queued' && <p className="mt-2 text-sm text-slate-500">Ready</p>}
                {it.status === 'working' && <p className="mt-2 inline-flex items-center gap-2 text-sm text-violet-700"><Loader2 className="w-4 h-4 animate-spin" aria-hidden /> Looking at the image…</p>}
                {it.status === 'error' && <p className="mt-2 text-sm text-red-600">{it.error}</p>}
                {it.result && (
                  <div className="mt-2 space-y-3">
                    {it.result.decorative && <p className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs text-slate-600">Looks decorative: consider an empty alt (alt=&quot;&quot;) so screen readers skip it.</p>}
                    <div className="rounded-xl border border-violet-200 bg-violet-50/50 p-3">
                      <div className="flex items-start justify-between gap-3">
                        <p className="font-semibold leading-snug text-slate-900" dir="auto">{it.result.altText}</p>
                        <CopyBtn text={it.result.altText} />
                      </div>
                      <p className={`mt-1 text-[11px] font-medium ${it.result.altText.length > 125 ? 'text-amber-700' : 'text-slate-500'}`}>{it.result.altText.length} characters</p>
                    </div>
                    {it.result.alternatives.map((a) => (
                      <div key={a} className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 p-3">
                        <p className="text-sm leading-snug text-slate-700" dir="auto">{a}</p>
                        <CopyBtn text={a} />
                      </div>
                    ))}
                    <div className="grid gap-2 sm:grid-cols-2">
                      {it.result.caption && (
                        <div className="rounded-xl bg-slate-50 p-3">
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Caption</p>
                          <p className="mt-1 text-sm text-slate-700" dir="auto">{it.result.caption}</p>
                        </div>
                      )}
                      {it.result.fileName && (
                        <div className="rounded-xl bg-slate-50 p-3">
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">SEO file name</p>
                          <div className="mt-1 flex items-center justify-between gap-2">
                            <p className="truncate font-mono text-sm text-slate-700">{it.result.fileName}.{it.ext}</p>
                            <CopyBtn text={`${it.result.fileName}.${it.ext}`} />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-2 rounded-xl bg-slate-900 p-3">
                      <code className="truncate font-mono text-xs text-slate-200"><Code2 className="me-1.5 inline w-3.5 h-3.5 text-slate-400" aria-hidden />{`<img src="${it.result.fileName || 'image'}.${it.ext}" alt="${it.result.altText.replace(/"/g, '&quot;')}">`}</code>
                      <CopyBtn text={`<img src="${it.result.fileName || 'image'}.${it.ext}" alt="${it.result.altText.replace(/"/g, '&quot;')}">`} label="HTML" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {items.length > 1 && (
          <button type="button" onClick={() => setItems([])} className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-red-600"><Trash2 className="w-4 h-4" aria-hidden /> Clear all</button>
        )}
      </div>

      <aside className="h-fit space-y-4 rounded-2xl border border-slate-200 bg-white p-5 lg:sticky lg:top-24">
        <div>
          <label htmlFor="kw" className="mb-1.5 block text-sm font-bold text-slate-900">Focus keyword <span className="font-normal text-slate-400">(optional)</span></label>
          <input id="kw" value={keyword} onChange={(e) => setKeyword(e.target.value)} maxLength={80} placeholder="e.g. bridal makeup Rawalpindi" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
          <p className="mt-1 text-xs text-slate-500">Used only where it truthfully fits the image.</p>
        </div>
        <div>
          <label htmlFor="ctx" className="mb-1.5 block text-sm font-bold text-slate-900">Page context <span className="font-normal text-slate-400">(optional)</span></label>
          <textarea id="ctx" value={context} onChange={(e) => setContext(e.target.value)} maxLength={300} rows={3} placeholder="What is the page about?" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
        </div>
        <div>
          <label htmlFor="lng" className="mb-1.5 block text-sm font-bold text-slate-900">Language</label>
          <select id="lng" value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-violet-500">
            {LANGS.map((l) => <option key={l}>{l}</option>)}
          </select>
        </div>
        <button type="button" onClick={run} disabled={!pending || busy} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3.5 font-bold text-white shadow-lg shadow-violet-600/25 disabled:cursor-not-allowed disabled:opacity-50">
          {busy ? <Loader2 className="w-5 h-5 animate-spin" aria-hidden /> : <Sparkles className="w-5 h-5" aria-hidden />} Generate alt text
        </button>
        <p className="text-xs text-slate-500">Free limit: 15 images per hour. Always check AI text before publishing.</p>
      </aside>
    </div>
  );
}
