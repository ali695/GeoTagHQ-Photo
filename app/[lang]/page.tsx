import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Check } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ToolIcon from '@/components/layout/ToolIcon';
import { TOOL_LANGS, availableTools, getUi, pathFor, toolText } from '@/lib/i18n';
import { uiStrings, type ToolCategory } from '@/lib/tools';
import { SITE_URL, OG_IMAGE } from '@/lib/site';

// Localized tools hub: /de, /es, ... (the English hub is app/page.tsx).
type Props = { params: Promise<{ lang: string }> };
export const dynamicParams = false;

export function generateStaticParams() {
  return TOOL_LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!TOOL_LANGS.includes(lang)) notFound();
  const ui = getUi(lang);
  const languages: Record<string, string> = { en: `${SITE_URL}/`, 'x-default': `${SITE_URL}/` };
  for (const l of TOOL_LANGS) languages[l] = `${SITE_URL}/${l}`;
  return {
    title: { absolute: `${ui.homeTitle} | PinPixl` },
    description: ui.homeMeta,
    alternates: { canonical: `${SITE_URL}/${lang}`, languages },
    openGraph: { title: ui.homeTitle, description: ui.homeMeta, url: `${SITE_URL}/${lang}`, siteName: 'PinPixl', images: [OG_IMAGE], locale: lang },
  };
}

export default async function LocalizedHome({ params }: Props) {
  const { lang } = await params;
  if (!TOOL_LANGS.includes(lang)) notFound();
  const ui = getUi(lang);
  const g = uiStrings(lang);
  const tools = availableTools(lang);
  const featured = tools.filter((t) => t.inMenu && !t.path.includes('-to-'));
  const converters = tools.filter((t) => t.category === 'convert' && t.path.includes('-to-'));
  const label = (t: (typeof tools)[number]) => toolText(t, lang, { name: g.geotagName, desc: g.geotagDesc });
  const cats: [ToolCategory, string][] = [
    ['location', ui.catLocation],
    ['convert', ui.catConvert],
    ['optimize', ui.catOptimize],
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-slate-900" dir={lang === 'ar' ? 'rtl' : 'ltr'} lang={lang}>
      <Header lang={lang} />
      <main className="flex-grow">
        <section className="relative overflow-hidden">
          <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-blue-50/90 via-white to-white" />
          <div
            aria-hidden
            className="absolute inset-0 bg-map-grid"
            style={{ maskImage: 'radial-gradient(ellipse at top, black 30%, transparent 72%)', WebkitMaskImage: 'radial-gradient(ellipse at top, black 30%, transparent 72%)' }}
          />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 pt-14 pb-12 md:pt-20 md:pb-16 text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.08] text-slate-950">{ui.homeTitle}</h1>
            <p className="mt-6 text-lg md:text-xl text-slate-600 leading-relaxed">{ui.homeSub}</p>
          </div>
        </section>

        <section className="pb-20 md:pb-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
            {cats.map(([cat, title]) => {
              const list = featured.filter((t) => t.category === cat);
              if (!list.length) return null;
              return (
                <div key={cat}>
                  <h2 className="mb-6 text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">{title}</h2>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {list.map((t) => (
                      <Link
                        key={t.id}
                        href={pathFor(lang, t.path)}
                        className="group rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-900/5"
                      >
                        <span className="inline-flex rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-3 text-white shadow-lg shadow-blue-500/25">
                          <ToolIcon name={t.icon} className="h-6 w-6" />
                        </span>
                        <h3 className="mt-5 flex items-center gap-1.5 text-lg font-bold text-slate-900 group-hover:text-blue-700">
                          {label(t).name}
                          <ArrowRight className="h-4 w-4 opacity-0 transition-all group-hover:opacity-100 rtl:rotate-180" aria-hidden />
                        </h3>
                        <p className="mt-1.5 text-slate-600">{label(t).desc}</p>
                      </Link>
                    ))}
                  </div>
                  {cat === 'convert' && converters.length > 0 && (
                    <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                      <p className="mb-3 text-sm font-bold text-slate-700">{ui.homeConversions}</p>
                      <ul className="flex flex-wrap gap-2">
                        {converters.map((t) => (
                          <li key={t.id}>
                            <Link
                              href={pathFor(lang, t.path)}
                              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-700"
                            >
                              <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden /> {label(t).name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>
      <Footer lang={lang} />
    </div>
  );
}
