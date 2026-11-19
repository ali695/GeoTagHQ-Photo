'use client';

import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, X, CornerDownLeft } from 'lucide-react';
import ToolIcon from '@/components/layout/ToolIcon';
import type { ToolEntry } from '@/lib/tools';

// Extra words people type for each tool, so "iphone" finds HEIC and "privacy" finds Remove EXIF.
const KEYWORDS: Record<string, string> = {
  geotag: 'geotag gps location add map google business profile gmb local seo photo coordinates pin',
  'exif-viewer': 'exif metadata view read camera lens date info details check',
  'photo-location-finder': 'where taken find location photo gps map address',
  'remove-exif': 'remove delete strip exif metadata gps location privacy clean',
  'lat-long-finder': 'latitude longitude coordinates address find lat long gps',
  'image-converter': 'convert converter format change',
  'image-compressor': 'compress reduce size shrink smaller optimize kb mb',
  'ai-alt-text': 'alt text seo accessibility ai description caption',
};

const QUICK = [
  { label: 'iPhone HEIC to JPG', q: 'heic' },
  { label: 'Add location to photo', q: 'gps' },
  { label: 'Remove location', q: 'remove' },
  { label: 'Compress image', q: 'compress' },
  { label: 'WebP to JPG', q: 'webp to jpg' },
  { label: 'Get coordinates', q: 'coordinates' },
];

export default function ToolFinder({ tools, dark = false }: { tools: ToolEntry[]; dark?: boolean }) {
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const words = q.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(Boolean);
    if (!words.length) return [];
    return tools
      .map((t) => {
        const hay = `${t.name} ${t.desc} ${t.id.replace(/-/g, ' ')} ${KEYWORDS[t.id] || ''} ${t.path.includes('heic') ? 'iphone' : ''}`.toLowerCase();
        const hits = words.filter((w) => hay.includes(w)).length;
        // Exact "x to y" converter matches rank first.
        const exact = t.name.toLowerCase() === q.trim().toLowerCase() ? 10 : 0;
        return { t, score: hits * 2 + exact - (t.path.includes('-to-') ? 0.5 : 0) };
      })
      .filter((r) => r.score >= words.length * 2 - 0.5)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map((r) => r.t);
  }, [q, tools]);

  const go = (t?: ToolEntry) => {
    if (t) window.location.href = t.path;
  };

  return (
    <div className="relative mx-auto w-full max-w-2xl text-start">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          go(results[active]);
        }}
        className="relative"
      >
        <Search className="pointer-events-none absolute start-5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink" aria-hidden />
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setActive(0);
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setActive((a) => Math.min(a + 1, results.length - 1));
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setActive((a) => Math.max(a - 1, 0));
            } else if (e.key === 'Escape') setQ('');
          }}
          placeholder="What do you want to do? e.g. convert HEIC, remove location…"
          aria-label="Search tools"
          aria-autocomplete="list"
          aria-expanded={results.length > 0}
          className="h-16 w-full rounded-md border-2 border-ink bg-white ps-14 pe-12 text-base font-medium text-ink placeholder:text-ink-3 shadow-hard outline-none transition focus:shadow-[6px_6px_0_0_var(--color-pin)]"
        />
        {q && (
          <button type="button" onClick={() => { setQ(''); inputRef.current?.focus(); }} className="absolute end-4 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-ink-3 hover:bg-paper-2 hover:text-ink" aria-label="Clear search">
            <X className="h-4 w-4" />
          </button>
        )}

        {q && (
          <div className="absolute inset-x-0 top-full z-30 mt-3 overflow-hidden rounded-md border-2 border-ink bg-white shadow-hard">
            {results.length > 0 ? (
              <ul role="listbox">
                {results.map((t, i) => (
                  <li key={t.id} role="option" aria-selected={i === active}>
                    <Link
                      href={t.path}
                      onMouseEnter={() => setActive(i)}
                      className={`flex items-center gap-3 px-4 py-3 transition-colors ${i === active ? 'bg-paper-2' : 'hover:bg-paper'}`}
                    >
                      <span className="rounded-md bg-ink p-2 text-paper">
                        <ToolIcon name={t.icon} className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-semibold text-ink">{t.name}</span>
                        <span className="block truncate text-sm text-ink-3">{t.desc}</span>
                      </span>
                      {i === active ? <CornerDownLeft className="h-4 w-4 text-pin" aria-hidden /> : <ArrowRight className="h-4 w-4 text-ink-3" aria-hidden />}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-5 py-4 text-sm text-ink-2">
                No tool matches “{q}”. Try “convert”, “gps” or “compress”, or <a href="#tools" className="font-semibold text-ink underline decoration-pin decoration-2 underline-offset-2">browse all tools</a>.
              </p>
            )}
          </div>
        )}
      </form>

      <ul className="mt-5 flex flex-wrap gap-2" aria-label="Popular tasks">
        {dark && <li className="me-1 self-center font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-ink-3">Try:</li>}
        {QUICK.map((c) => (
          <li key={c.label}>
            <button
              type="button"
              onClick={() => {
                setQ(c.q);
                setActive(0);
                inputRef.current?.focus();
              }}
              className={
                'rounded-md border border-ink/25 bg-paper px-3 py-1.5 text-sm font-medium text-ink transition hover:border-ink hover:bg-white'
              }
            >
              {c.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
