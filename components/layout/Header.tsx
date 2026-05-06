import Link from 'next/link';
import { MapPin } from 'lucide-react';

export default function Header() {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/free-geo-tagging-tool" className="flex items-center gap-2 group">
            <div className="bg-blue-600 p-2 rounded-lg group-hover:bg-blue-700 transition-colors">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">GeoTag<span className="text-blue-600">HQ</span></span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/free-geo-tagging-tool" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Tool
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              How it Works
            </Link>
            <Link href="#faq" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              FAQ
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
