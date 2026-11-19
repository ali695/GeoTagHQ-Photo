'use client';

import { useEffect, useState, type ReactNode } from 'react';

// Sticky header wrapper: paper with a hairline rule at the top, a solid ink rule once the page scrolls.
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
      className={`sticky top-0 z-50 border-b bg-paper/95 backdrop-blur transition-colors duration-200 ${scrolled ? 'border-ink' : 'border-rule'}`}
    >
      {children}
    </header>
  );
}
