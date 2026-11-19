'use client';

import { useEffect, useState, type ReactNode } from 'react';

// Sticky header wrapper: transparent-glass at the top, solid with a shadow once the page scrolls.
export default function HeaderShell({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return (
    <header
      data-scrolled={scrolled || undefined}
      className={`sticky top-0 z-50 border-b transition-[background-color,box-shadow,border-color] duration-200 ${
        scrolled
          ? 'border-slate-200 bg-white/95 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.18)] backdrop-blur-xl'
          : 'border-slate-200/60 bg-white/80 backdrop-blur-xl'
      }`}
    >
      {children}
    </header>
  );
}
