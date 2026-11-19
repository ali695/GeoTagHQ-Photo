'use client';

import { useEffect, useRef } from 'react';

// Counts up to `value` when scrolled into view (idea from Magic UI's MIT number-ticker, without the
// motion library). The final number is server-rendered, so crawlers and no-JS visitors see it.
export default function NumberTicker({ value, className = '' }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || value <= 0 || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const dur = 1100 + value * 12;
        const tick = (t: number) => {
          const p = Math.min(1, (t - start) / dur);
          const eased = 1 - Math.pow(1 - p, 4);
          el.textContent = String(Math.round(eased * value));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        el.textContent = '0';
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);
  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {value}
    </span>
  );
}
