'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { LANGUAGES } from '@/lib/constants';

export function LanguageSwitcher({ currentLang }: { currentLang: string }) {
  const pathname = usePathname();

  // Determine the base path without the current language prefix
  let basePath = pathname;
  if (currentLang !== 'en') {
    basePath = pathname.replace(`/${currentLang}`, '');
  }
  if (!basePath) basePath = '/';
  
  // The tool page is exactly /free-geo-tagging-tool or /[lang]/free-geo-tagging-tool
  // We should only show this switcher safely, but for now we always show.
  
  return (
    <div className="relative group inline-block">
      <button className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors uppercase bg-slate-100 px-3 py-1.5 rounded-md">
        {currentLang}
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </button>
      <div className="absolute end-0 mt-2 w-48 bg-white border border-slate-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <ul className="py-1">
          {LANGUAGES.map((lang) => {
            const targetPath = lang.code === 'en' ? '/free-geo-tagging-tool' : `/${lang.code}/free-geo-tagging-tool`;
            return (
              <li key={lang.code}>
                <Link href={targetPath} className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${lang.code === currentLang ? 'font-bold bg-slate-50' : ''}`}>
                  {lang.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
