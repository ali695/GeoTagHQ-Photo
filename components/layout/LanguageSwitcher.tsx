'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { LANGUAGES } from '@/lib/constants';

export function LanguageSwitcher({ currentLang }: { currentLang: string }) {
  const router = useRouter();
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
        className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors uppercase bg-slate-100 px-3 py-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-300"
        aria-expanded={isOpen}
      >
        {currentLang.toUpperCase()}
        <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute end-0 mt-2 w-48 origin-top-right bg-white border border-slate-200 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-[100] max-h-[60vh] overflow-y-auto">
          <div className="py-1">
            {LANGUAGES.map((lang) => {
              const targetPath = lang.code === 'en' ? '/free-geo-tagging-tool' : `/${lang.code}/free-geo-tagging-tool`;
              return (
                <button
                  key={lang.code}
                  onClick={() => {
                    setIsOpen(false);
                    router.push(targetPath);
                  }}
                  className={`w-full text-start block px-4 py-2 text-sm transition-colors ${lang.code === currentLang ? 'font-bold bg-slate-50 text-slate-900' : 'text-slate-700 hover:bg-slate-100'}`}
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
