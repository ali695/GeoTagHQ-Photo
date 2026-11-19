import { MapPin, Repeat, ShieldCheck, Minimize2, CheckCircle2, Search, Download, Lock } from 'lucide-react';

const PHOTOS = [
  { name: 'storefront.HEIC', from: '#60a5fa', to: '#a78bfa', tag: 'HEIC → JPG' },
  { name: 'kitchen-job.jpg', from: '#34d399', to: '#22d3ee', tag: null },
  { name: 'team-photo.jpg', from: '#f59e0b', to: '#f472b6', tag: null },
];

// Decorative hero art: a mock of the geotag tool (map + photo list) with real tool outcomes around it.
export default function HomeVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[600px] pb-8 pt-6 sm:pb-10" aria-hidden>
      {/* glow */}
      <div className="absolute inset-x-10 top-10 bottom-0 rounded-[3rem] bg-gradient-to-br from-blue-500/40 via-indigo-500/30 to-violet-500/40 blur-3xl" />

      {/* app window */}
      <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-white shadow-2xl shadow-black/40 ring-1 ring-black/5">
        {/* window chrome */}
        <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-50 px-4 py-2.5">
          <span className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </span>
          <span className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-white px-3 py-1 text-[11px] font-medium text-slate-500 ring-1 ring-slate-200">
            <Lock className="h-3 w-3 text-emerald-600" /> pinpixl · Geo Tagging Tool
          </span>
        </div>

        <div className="grid sm:grid-cols-[1.35fr_1fr]">
          {/* map */}
          <div className="relative h-56 overflow-hidden bg-[#eef3f8] sm:h-auto sm:min-h-[19rem]">
            <svg viewBox="0 0 400 320" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
              <rect width="400" height="320" fill="#eef3f8" />
              <path d="M0 236 C 90 210, 140 270, 226 244 S 350 206, 400 228 L400 320 L0 320 Z" fill="#cfe4f7" />
              <rect x="262" y="28" width="112" height="74" rx="16" fill="#d9ecd5" />
              <rect x="22" y="40" width="96" height="62" rx="14" fill="#d9ecd5" />
              <g stroke="#fff" strokeLinecap="round">
                <path d="M-10 142 L410 124" strokeWidth="16" />
                <path d="M182 -10 L202 330" strokeWidth="13" />
                <path d="M-10 54 L420 190" strokeWidth="7" />
                <path d="M320 -10 L278 330" strokeWidth="7" />
              </g>
              <path d="M-10 142 L410 124" stroke="#fde68a" strokeWidth="3.5" strokeLinecap="round" />
            </svg>
            {/* search bar */}
            <div className="absolute inset-x-3 top-3 flex items-center gap-2 rounded-xl bg-white/95 px-3 py-2 text-[11px] font-medium text-slate-700 shadow-lg shadow-slate-900/10">
              <Search className="h-3.5 w-3.5 text-slate-400" />
              <span className="truncate">221 Congress Ave, Austin, TX</span>
            </div>
            {/* pin */}
            <div className="absolute start-[47%] top-[44%] -translate-x-1/2 -translate-y-full rtl:translate-x-1/2">
              <span className="absolute start-1/2 top-full h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/40 animate-ping-soft rtl:translate-x-1/2" />
              <span className="relative flex h-11 w-11 items-center justify-center rounded-full rounded-br-none bg-blue-600 text-white shadow-lg shadow-blue-600/40 ring-4 ring-white rotate-45">
                <MapPin className="h-5 w-5 -rotate-45" />
              </span>
            </div>
            {/* coordinates chip */}
            <div className="absolute bottom-3 start-3 rounded-lg bg-slate-900/85 px-2.5 py-1.5 font-mono text-[10px] text-white backdrop-blur">
              30.26849, −97.74307
            </div>
          </div>

          {/* side panel */}
          <div className="hidden flex-col gap-2 border-s border-slate-200 p-3 sm:flex">
            <p className="px-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">3 photos</p>
            {PHOTOS.map((p) => (
              <div key={p.name} className="flex items-center gap-2.5 rounded-xl border border-slate-200 p-2">
                <span className="h-9 w-9 shrink-0 rounded-lg" style={{ background: `linear-gradient(135deg, ${p.from}, ${p.to})` }} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[11px] font-semibold text-slate-800">{p.name}</span>
                  <span className="mt-0.5 flex items-center gap-1 text-[10px] font-bold text-emerald-700">
                    <CheckCircle2 className="h-3 w-3" /> GPS verified
                  </span>
                </span>
                {p.tag && <span className="rounded-md bg-sky-50 px-1.5 py-0.5 text-[9px] font-bold text-sky-700">{p.tag}</span>}
              </div>
            ))}
            <div className="mt-1 grid grid-cols-2 gap-1.5">
              {[['Lat', '30.26849'], ['Lng', '−97.74307']].map(([k, v]) => (
                <span key={k} className="rounded-lg bg-slate-50 px-2 py-1.5 ring-1 ring-slate-200">
                  <span className="block text-[9px] font-bold uppercase text-slate-400">{k}</span>
                  <span className="block font-mono text-[11px] text-slate-800">{v}</span>
                </span>
              ))}
            </div>
            <span className="mt-auto flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-2.5 text-[11px] font-bold text-white shadow-md shadow-blue-600/30">
              <Download className="h-3.5 w-3.5" /> Download all
            </span>
          </div>
        </div>
      </div>

      {/* floating outcome cards */}
      {[
        { icon: Repeat, title: 'HEIC → JPG', sub: 'Converted in your browser', cls: 'end-[-4%] top-0 hidden sm:flex', tone: 'from-sky-500 to-cyan-500' },
        { icon: ShieldCheck, title: 'GPS removed', sub: 'Verified clean · lossless', cls: 'start-[-6%] top-[46%] hidden md:flex', tone: 'from-emerald-500 to-teal-600' },
        { icon: Minimize2, title: '−84% smaller', sub: '2.31 MB → 380 KB', cls: 'end-[6%] bottom-0 flex', tone: 'from-violet-500 to-indigo-600' },
      ].map((c, i) => (
        <div
          key={c.title}
          style={{ animationDelay: `${i * 1.3}s` }}
          className={`absolute ${c.cls} animate-float-slow items-center gap-3 rounded-2xl border border-white/70 bg-white/95 py-2.5 pe-4 ps-2.5 shadow-2xl shadow-slate-900/25 backdrop-blur`}
        >
          <span className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${c.tone} text-white shadow-md`}>
            <c.icon className="h-5 w-5" />
          </span>
          <span>
            <span className="flex items-center gap-1 text-sm font-bold text-slate-900">
              {c.title} <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            </span>
            <span className="block text-[11px] text-slate-500">{c.sub}</span>
          </span>
        </div>
      ))}
    </div>
  );
}
