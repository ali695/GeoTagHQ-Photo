import type { ReactNode } from 'react';

// Hand-drawn underline that draws itself under a word (pure SVG stroke animation, no JS).
export default function Scribble({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span className={`relative inline-block ${className}`}>
      {children}
      <svg aria-hidden viewBox="0 0 200 16" preserveAspectRatio="none" className="pointer-events-none absolute -bottom-[0.08em] start-0 h-[0.28em] w-full overflow-visible">
        <path
          d="M3 11 C 40 4, 80 4, 118 8 S 180 13, 197 5"
          fill="none"
          stroke="var(--color-pin)"
          strokeWidth="3.2"
          strokeLinecap="round"
          className="anim-draw"
          style={{ ['--len' as string]: 210, animationDelay: '0.9s' }}
          pathLength={210}
        />
      </svg>
    </span>
  );
}
