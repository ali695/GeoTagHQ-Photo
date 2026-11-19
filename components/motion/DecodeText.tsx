'use client';

import { useEffect, useRef } from 'react';

const GLYPHS = '0123456789°·NSEW';

// Scrambles then "locks in" each character, like a GPS fix resolving (idea from Magic UI's MIT
// hyper-text). Server renders the final text; the effect only runs in the browser.
export default function DecodeText({ text, className = '', delay = 300 }: { text: string; className?: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame = 0;
    let timer: ReturnType<typeof setTimeout>;
    let iv: ReturnType<typeof setInterval>;
    timer = setTimeout(() => {
      iv = setInterval(() => {
        frame++;
        const locked = Math.floor(frame / 2);
        el.textContent = text
          .split('')
          .map((ch, i) => (i < locked || ch === ' ' ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
          .join('');
        if (locked >= text.length) clearInterval(iv);
      }, 32);
    }, delay);
    return () => {
      clearTimeout(timer);
      clearInterval(iv);
    };
  }, [text, delay]);
  return (
    <span ref={ref} className={className} aria-label={text}>
      {text}
    </span>
  );
}
