import Link from 'next/link';
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';

export default function Header({ lang = 'en', messages }: { lang?: string, messages?: any }) {
  const toolLink = lang === 'en' ? '/free-geo-tagging-tool' : `/${lang}/free-geo-tagging-tool`;
  const m = messages?.nav || { tool: "Geo Tagging Tool", guide: "SEO Guide" };
  const mCommon = messages?.common || { howItWorks: "How It Works" };

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href={toolLink} className="flex items-center gap-2 group hover:opacity-90 transition-opacity">
            <Image src="/logo.svg" alt="GeoTagHQ Logo" width={150} height={40} className="w-auto h-9" unoptimized priority />
          </Link>
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6">
              <Link href={toolLink} className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                {m.tool}
              </Link>
              <Link href={`${toolLink}#how-it-works`} className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                {mCommon.howItWorks}
              </Link>
              <Link href={`${toolLink}#faq`} className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                FAQ
              </Link>
            </nav>
            <LanguageSwitcher currentLang={lang} />
          </div>
        </div>
      </div>
    </header>
  );
}
