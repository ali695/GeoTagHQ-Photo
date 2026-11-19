'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { LANGUAGES } from '@/lib/constants';

/**
 * Keeps the visitor on the same page when switching language:
 * /heic-to-jpg -> /de/heic-to-jpg, / -> /de. Pages that only exist in English
 * (about, privacy...) fall back to the geotag tool, which exists in every language.
 */
export function LanguageSwitcher({
  currentLang,
  toolLangs = [],
  toolSlugs = [],
}: {
  currentLang: string;
  /** Languages (besides English) that have the full set of tool pages. */
  toolLangs?: string[];
  /** Tool paths like "/heic-to-jpg" that exist in those languages. */
  toolSlugs?: string[];
}) {
  const router = useRouter();
  const pathname = usePathname() || '/';
  const codes = LANGUAGES.map((l) => l.code);
  const seg = pathname.split('/')[1];
  const rest = codes.includes(seg) && seg !== 'en' ? pathname.slice(seg.length + 1) || '' : pathname === '/' ? '' : pathname;
  const targetFor = (code: string) => {
    if (code === 'en') return rest || '/';
    if (rest === '/free-geo-tagging-tool') return `/${code}/free-geo-tagging-tool`;
    if (toolLangs.includes(code)) {
      if (rest === '') return `/${code}`;
      if (toolSlugs.includes(rest)) return `/${code}${rest}`;
    }
    return `/${code}/free-geo-tagging-tool`;
  };
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 font-mono text-xs font-bold text-ink transition-colors uppercase border border-ink/25 bg-paper hover:border-ink px-3 py-2.5 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-pin"
        aria-expanded={isOpen}
      >
        {currentLang.toUpperCase()}
        <svg className="w-4 h-4 text-ink-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute end-0 mt-2 w-52 origin-top-right bg-paper border border-ink rounded-lg shadow-hard p-1 focus:outline-none z-[100] max-h-[60vh] overflow-y-auto">
          <div className="py-1">
            {LANGUAGES.map((lang) => {
              const targetPath = targetFor(lang.code);
              return (
                <button
                  key={lang.code}
                  onClick={() => {
                    setIsOpen(false);
                    router.push(targetPath);
                  }}
                  className={`w-full text-start block rounded-md px-3 py-2 text-sm transition-colors ${lang.code === currentLang ? 'font-semibold bg-ink text-paper' : 'text-ink hover:bg-paper-2'}`}
                >
                  {lang.name}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
