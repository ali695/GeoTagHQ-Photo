'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// One IntersectionObserver for the whole page: any element with `data-reveal` gets the class `in`
// when it scrolls into view, which starts its CSS entrance (and un-pauses animations inside it).
export default function MotionObserver() {
  const pathname = usePathname();
  useEffect(() => {
    (window as any).__motion = true;
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]:not(.in)'));
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);
  return null;
}
