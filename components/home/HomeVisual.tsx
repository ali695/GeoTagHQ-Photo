// Hero art: a "field specimen" — a taped photo, its index card of metadata, and a rubber-stamp result.
// Shows what the tools actually read and write, instead of abstract gradients.
const ROWS: Array<[string, string]> = [
  ['File', 'IMG_2048.HEIC'],
  ['Camera', 'iPhone 15 Pro · 24 mm'],
  ['Exposure', 'ƒ/1.8 · 1/120 s · ISO 80'],
  ['Taken', '2026-11-14 · 16:42'],
  ['Lat', '30.268490° N'],
  ['Lng', '97.743070° W'],
];

export default function HomeVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[540px] pb-6 pt-4" aria-hidden>
      {/* photo */}
      <div className="anim-photo relative z-10 ms-[4%] w-[62%] -rotate-3 rounded-sm border border-ink bg-white p-2.5 pb-9 shadow-hard rtl:rotate-3">
        <span className="absolute -top-3 start-1/2 h-6 w-20 -translate-x-1/2 rotate-2 bg-[#efe3b8]/90 shadow-sm rtl:translate-x-1/2" />
        <svg viewBox="0 0 300 220" className="w-full">
          <rect width="300" height="220" fill="#d7e3e8" />
          <circle cx="226" cy="58" r="22" fill="#f6e7c1" />
          <path d="M0 150 L70 96 L120 132 L190 80 L300 146 L300 220 L0 220 Z" fill="#7d8f76" />
          <path d="M0 176 L90 140 L160 168 L230 132 L300 160 L300 220 L0 220 Z" fill="#40553f" />
          <rect x="128" y="150" width="44" height="40" fill="#16150f" />
          <path d="M124 152 L150 132 L176 152 Z" fill="#ff4f1f" />
          <rect x="144" y="170" width="12" height="20" fill="#f4f1ea" />
        </svg>
        <p className="absolute bottom-2.5 start-3 font-serif text-lg italic leading-none text-ink-2">Congress Ave.</p>
      </div>

      {/* index card */}
      <div className="anim-card relative z-20 -mt-24 ms-auto w-[68%] rotate-[1.5deg] rounded-sm border border-ink bg-paper shadow-hard rtl:-rotate-[1.5deg] sm:-mt-28">
        <div className="flex items-center justify-between border-b border-ink px-4 py-2">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-ink">Specimen № 2048</span>
          <span className="h-2.5 w-2.5 rounded-full bg-pin" />
        </div>
        <dl className="ruled px-4 py-1 font-mono text-[11px] leading-8">
          {ROWS.map(([k, v], i) => (
            <div key={k} className="anim-row flex justify-between gap-3" style={{ '--i': i } as React.CSSProperties}>
              <dt className="uppercase tracking-wider text-ink-3">{k}</dt>
              <dd className="truncate font-semibold text-ink">{v}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* rubber stamp */}
      <div className="anim-stamp absolute bottom-[3%] start-[7%] z-30 -rotate-12 rounded-md border-[3px] border-pin px-3 py-1.5 text-pin opacity-90 mix-blend-multiply">
        <p className="font-mono text-[10px] font-bold uppercase leading-tight tracking-[0.2em]">GPS written</p>
        <p className="font-mono text-[13px] font-extrabold uppercase leading-tight tracking-[0.12em]">✓ Verified</p>
      </div>

      {/* pin */}
      <svg viewBox="0 0 40 52" className="anim-pin absolute end-[6%] top-0 z-30 h-14 w-11 drop-shadow-[2px_2px_0_var(--color-ink)]">
        <path d="M20 50 C20 50 3 31 3 19 A17 17 0 1 1 37 19 C37 31 20 50 20 50 Z" fill="#ff4f1f" stroke="#16150f" strokeWidth="2" />
        <circle cx="20" cy="19" r="6" fill="#f4f1ea" stroke="#16150f" strokeWidth="2" />
      </svg>
    </div>
  );
}
