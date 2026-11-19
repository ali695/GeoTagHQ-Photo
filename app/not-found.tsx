import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { TOOLS } from '@/lib/tools';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  const popular = ['geotag', 'heic-to-jpg', 'remove-exif', 'image-compressor', 'exif-viewer', 'photo-location-finder']
    .map((id) => TOOLS.find((t) => t.id === id))
    .filter((t): t is (typeof TOOLS)[number] => !!t);
  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900">
      <Header lang="en" />
      <main className="flex-grow">
        <section className="relative overflow-hidden bg-slate-950 text-white">
          <div aria-hidden className="absolute -end-40 -top-20 h-[600px] w-[600px] bg-map-grid opacity-[0.09]" />
          <div className="relative mx-auto max-w-4xl px-4 py-24 sm:px-6 md:py-32">
            <p className="font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
              <span className="text-blue-400">404</span> · Location unknown
            </p>
            <h1 className="mt-5 text-5xl font-extrabold leading-[1] tracking-[-0.04em] md:text-7xl">
              This page is <em className="bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 bg-clip-text text-transparent">off the map.</em>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
              The link may be old or mistyped. Every PinPixl tool is still here, free and without sign-up.
            </p>
            <Link href="/" className="mt-9 inline-flex items-center gap-2 rounded-xl border border-white/15 bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 font-bold text-white shadow-xl shadow-slate-900/10">
              Go to all tools <ArrowRight className="h-5 w-5" aria-hidden />
            </Link>
            <ul className="mt-14 grid border-t border-white/15 sm:grid-cols-2 sm:gap-x-10">
              {popular.map((t) => (
                <li key={t.id} className="border-b border-white/10">
                  <Link href={t.path} className="flex items-center justify-between py-4 font-bold hover:text-blue-400">
                    {t.name} <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <Footer lang="en" />
    </div>
  );
}
