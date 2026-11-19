// PinPixl logo: pin-with-pixels icon + wordmark set in the site's display font.
// Drawn inline (not an <img>) so it stays crisp and uses the real brand font.
export function BrandIcon({ className = 'h-9 w-9' }: { className?: string }) {
  return (
    <svg viewBox="0 0 512 512" className={className} aria-hidden>
      <defs>
        <linearGradient id="bi-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2563eb" />
          <stop offset="0.55" stopColor="#4f46e5" />
          <stop offset="1" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient id="bi-px" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2563eb" />
          <stop offset="1" stopColor="#4f46e5" />
        </linearGradient>
      </defs>
      <rect width="512" height="512" rx="116" fill="url(#bi-bg)" />
      <path d="M256 430 C256 430 132 306 132 214 A124 124 0 1 1 380 214 C380 306 256 430 256 430 Z" fill="#fff" />
      <rect x="190" y="148" width="60" height="60" rx="13" fill="url(#bi-px)" />
      <rect x="262" y="148" width="60" height="60" rx="13" fill="url(#bi-px)" opacity="0.55" />
      <rect x="190" y="220" width="60" height="60" rx="13" fill="url(#bi-px)" opacity="0.55" />
      <rect x="262" y="220" width="60" height="60" rx="13" fill="#10b981" />
    </svg>
  );
}

export default function BrandLogo({ dark = false, size = 'md' }: { dark?: boolean; size?: 'md' | 'lg' }) {
  const icon = size === 'lg' ? 'h-11 w-11' : 'h-9 w-9';
  const text = size === 'lg' ? 'text-[1.75rem]' : 'text-[1.4rem]';
  return (
    <span className="inline-flex items-center gap-2.5" dir="ltr">
      <BrandIcon className={`${icon} shrink-0 drop-shadow-sm`} />
      <span className={`font-display ${text} font-extrabold leading-none tracking-[-0.03em]`}>
        <span className={dark ? 'text-white' : 'text-slate-900'}>Pin</span>
        <span className={`bg-gradient-to-r bg-clip-text text-transparent ${dark ? 'from-blue-300 to-violet-300' : 'from-blue-600 to-violet-600'}`}>Pixl</span>
      </span>
    </span>
  );
}
