import { CheckCircle2, MapPin } from 'lucide-react';

type Row = { field: string; example: string };

// Decorative product preview for the hero: a photo on a map with the EXIF data
// the tool writes. Uses each language's own example values, so it needs no new copy.
export default function HeroVisual({ rows }: { rows: Row[] }) {
  const [gps, title, , keywords] = rows;

  return (
    <div className="relative mx-auto w-full max-w-[520px] aspect-[5/4]" aria-hidden>
      {/* Map card */}
      <div className="absolute inset-0 rounded-[2rem] border border-slate-200 bg-[#eef3f8] shadow-2xl shadow-blue-900/10 overflow-hidden">
        <svg viewBox="0 0 500 400" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
          <rect width="500" height="400" fill="#eef3f8" />
          <path d="M0 290 C 90 260, 160 330, 260 300 S 420 250, 500 280 L500 400 L0 400 Z" fill="#cfe4f7" />
          <rect x="300" y="40" width="150" height="90" rx="18" fill="#d9ecd5" />
          <rect x="40" y="60" width="110" height="70" rx="16" fill="#d9ecd5" />
          <g stroke="#ffffff" strokeLinecap="round">
            <path d="M-10 170 L510 150" strokeWidth="16" />
            <path d="M210 -10 L240 410" strokeWidth="14" />
            <path d="M-10 60 L520 230" strokeWidth="8" />
            <path d="M380 -10 L330 410" strokeWidth="8" />
            <path d="M80 -10 L120 300" strokeWidth="6" />
          </g>
          <g stroke="#fde68a" strokeLinecap="round">
            <path d="M-10 170 L510 150" strokeWidth="4" />
          </g>
        </svg>
        {/* Pin with pulse */}
        <div className="absolute start-[46%] top-[30%]">
          <span className="absolute -inset-3 rounded-full bg-blue-500/30 animate-ping-soft" />
          <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/40 ring-4 ring-white">
            <MapPin className="h-5 w-5" />
          </span>
        </div>
      </div>

      {/* Photo card */}
      <div className="absolute -start-4 sm:-start-8 bottom-6 w-[52%] rotate-[-4deg] rtl:rotate-[4deg] rounded-2xl bg-white p-2 shadow-2xl shadow-slate-900/20 animate-float-slow">
        <svg viewBox="0 0 240 170" className="w-full rounded-xl">
          <defs>
            <linearGradient id="hv-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fbbf24" />
              <stop offset="0.55" stopColor="#fb923c" />
              <stop offset="1" stopColor="#f472b6" />
            </linearGradient>
          </defs>
          <rect width="240" height="170" fill="url(#hv-sky)" />
          <circle cx="178" cy="62" r="20" fill="#fff7ed" opacity="0.9" />
          <path d="M0 120 L50 88 L95 112 L150 72 L240 118 L240 170 L0 170 Z" fill="#7c3aed" opacity="0.55" />
          <path d="M0 140 L70 110 L130 134 L190 104 L240 130 L240 170 L0 170 Z" fill="#1e3a8a" opacity="0.85" />
          {/* storefront */}
          <rect x="30" y="98" width="70" height="56" rx="4" fill="#ffffff" />
          <path d="M26 98 L104 98 L98 84 L32 84 Z" fill="#ef4444" />
          <rect x="40" y="110" width="20" height="44" rx="2" fill="#93c5fd" />
          <rect x="68" y="110" width="24" height="18" rx="2" fill="#93c5fd" />
        </svg>
        <div className="flex items-center justify-between gap-2 px-1.5 pt-2 pb-1">
          <span className="truncate text-[11px] font-semibold text-slate-700">IMG_4521.jpg</span>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
            <MapPin className="h-3 w-3" /> GPS
          </span>
        </div>
      </div>

      {/* EXIF panel */}
      <div className="absolute -end-3 sm:-end-6 top-6 w-[60%] rounded-2xl border border-white/10 bg-slate-900/95 p-4 text-start shadow-2xl shadow-slate-900/30 backdrop-blur">
        <div className="mb-3 flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          <span className="ms-auto font-mono text-[10px] text-slate-400">EXIF</span>
        </div>
        <dl className="space-y-2.5">
          {[gps, title, keywords].filter(Boolean).map((r) => (
            <div key={r.field}>
              <dt className="text-[10px] font-semibold uppercase tracking-wider text-blue-300">{r.field}</dt>
              <dd className="mt-0.5 truncate text-[12px] font-medium text-slate-100" dir="auto">{r.example}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-3 flex items-center gap-1.5 border-t border-white/10 pt-3 text-[11px] font-semibold text-emerald-400">
          <CheckCircle2 className="h-4 w-4" />
          <span className="font-mono">GPSLatitude · GPSLongitude</span>
        </div>
      </div>
    </div>
  );
}
