// PinPixl logo: pin-with-pixels icon + wordmark. Ink square, paper pin, one pin-orange pixel.
// Drawn inline (not an <img>) so it stays crisp and uses the real brand font.
export function BrandIcon({ className = 'h-9 w-9' }: { className?: string }) {
  return (
    <svg viewBox="0 0 512 512" className={className} aria-hidden>
      <rect width="512" height="512" rx="104" fill="#16150f" />
      <path d="M256 430 C256 430 132 306 132 214 A124 124 0 1 1 380 214 C380 306 256 430 256 430 Z" fill="#f4f1ea" />
      <rect x="190" y="148" width="60" height="60" rx="10" fill="#16150f" />
      <rect x="262" y="148" width="60" height="60" rx="10" fill="#16150f" opacity="0.35" />
      <rect x="190" y="220" width="60" height="60" rx="10" fill="#16150f" opacity="0.35" />
      <rect x="262" y="220" width="60" height="60" rx="10" fill="#ff4f1f" />
    </svg>
  );
}

export default function BrandLogo({ dark = false, size = 'md' }: { dark?: boolean; size?: 'md' | 'lg' }) {
  const icon = size === 'lg' ? 'h-11 w-11' : 'h-9 w-9';
  const text = size === 'lg' ? 'text-[1.75rem]' : 'text-[1.4rem]';
  return (
    <span className="inline-flex items-center gap-2.5" dir="ltr">
      <BrandIcon className={`${icon} shrink-0`} />
      <span className={`font-display ${text} font-extrabold leading-none tracking-[-0.04em] ${dark ? 'text-paper' : 'text-ink'}`}>
        Pin<span className="text-pin">Pixl</span>
      </span>
    </span>
  );
}
