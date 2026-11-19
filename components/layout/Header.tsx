import Link from 'next/link';
import BrandLogo from './BrandLogo';
import { ChevronDown, Menu, ArrowRight, MapPin, Repeat, Sparkles } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import ToolIcon from './ToolIcon';
import HeaderShell from './HeaderShell';
import { isPair, toolHref, uiStrings, type ToolCategory, type ToolEntry } from '@/lib/tools';
import { getMessages } from '@/lib/messages';
import { availableTools, getUi, toolText, TOOL_LANGS } from '@/lib/i18n';

const TONE: Record<ToolCategory, string> = {
  location: 'from-blue-500 to-indigo-600 shadow-blue-500/30',
  convert: 'from-sky-500 to-cyan-600 shadow-sky-500/30',
  optimize: 'from-violet-500 to-fuchsia-600 shadow-violet-500/30',
};

// Server component. Menus open on hover/focus with CSS and the mobile menu uses
// <details>, so navigation works without JavaScript; only the scroll shadow is client-side.
export default async function Header({ lang = 'en', messages }: { lang?: string; messages?: any }) {
  // Every page gets its own language's labels, even when the page doesn't pass messages.
  const common = (messages ?? (await getMessages(lang)))?.common || {};
  const ui = uiStrings(lang);
  const ui2 = getUi(lang);
  const toolLink = toolHref(lang, '/free-geo-tagging-tool');
  const howItWorks = common.howItWorks || 'How It Works';
  const faqLabel = common.faq || 'FAQ';
  const hasHub = lang === 'en' || TOOL_LANGS.includes(lang);
  const home = hasHub ? (lang === 'en' ? '/' : `/${lang}`) : toolLink;
  const faqHref = lang === 'en' ? '/#faq' : `${toolLink}#faq`;

  const CATEGORY_LABEL: Record<ToolCategory, string> = { location: ui2.catLocation, convert: ui2.catConvert, optimize: ui2.catOptimize };
  const all = availableTools(lang);
  const menuTools = all.filter((t) => t.inMenu && t.id !== 'geotag');
  const converters = all.filter(isPair);
  const categories = (['location', 'convert', 'optimize'] as ToolCategory[])
    .map((c) => ({ c, items: menuTools.filter((t) => t.category === c) }))
    .filter((g) => g.items.length > 0);
  const label = (t: ToolEntry) => toolText(t, lang, { name: ui.geotagName, desc: ui.geotagDesc });

  const toolRow = (t: ToolEntry) => {
    const l = label(t);
    return (
      <Link href={toolHref(lang, t.path)} className="group/row flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-slate-50">
        <span className={`shrink-0 rounded-lg bg-gradient-to-br p-2 text-white shadow-md ${TONE[t.category]}`}>
          <ToolIcon name={t.icon} className="h-4 w-4" />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-semibold text-slate-900 group-hover/row:text-blue-700">{l.name}</span>
          <span className="mt-0.5 block text-xs leading-snug text-slate-500">{l.desc}</span>
        </span>
      </Link>
    );
  };

  const featured = (
    <Link
      href={toolLink}
      className="group/feat relative flex h-full flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 p-5 text-white"
    >
      <span aria-hidden className="absolute inset-0 bg-map-grid opacity-20" />
      <span aria-hidden className="absolute -end-10 -top-10 h-40 w-40 rounded-full bg-blue-500/40 blur-3xl" />
      <span className="relative">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-200 ring-1 ring-white/15">
          <Sparkles className="h-3 w-3" aria-hidden /> #1
        </span>
        <span className="mt-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500 shadow-lg shadow-blue-500/40">
          <MapPin className="h-5 w-5" aria-hidden />
        </span>
        <span className="mt-3 block text-lg font-bold leading-snug">{ui.geotagName}</span>
        <span className="mt-1 block text-sm leading-relaxed text-blue-100/80">{ui.geotagDesc}</span>
      </span>
      <span className="relative mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-white">
        {ui2.useTool} <ArrowRight className="h-4 w-4 transition-transform group-hover/feat:translate-x-1 rtl:rotate-180" aria-hidden />
      </span>
    </Link>
  );

  const navBtn =
    'inline-flex items-center gap-1 rounded-lg px-3 py-2 text-[15px] font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-950';
  const panel =
    'invisible absolute opacity-0 translate-y-1 transition-all duration-150 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:translate-y-0';

  return (
    <HeaderShell>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[4.25rem] items-center justify-between gap-4">
          <Link href={home} className="flex items-center transition-opacity hover:opacity-90" aria-label="PinPixl home">
            <BrandLogo />
          </Link>

          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main">
            {/* Tools mega menu */}
            {/* Not `relative`: the panel is positioned against the sticky header so it centres on the page. */}
            <div className="group">
              <button type="button" className={navBtn} aria-haspopup="true">
                {ui.tools}
                <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180 group-focus-within:rotate-180" aria-hidden />
              </button>
              <div className={`${panel} top-[3.25rem] pt-4 start-1/2 w-[min(60rem,calc(100vw-3rem))] -translate-x-1/2 rtl:translate-x-1/2`}>
                <div className="grid grid-cols-[15rem_1fr] gap-3 rounded-3xl border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-900/15">
                  {featured}
                  <div className="grid grid-cols-3 gap-x-3 gap-y-2 py-1">
                    {categories.map((g) => (
                      <div key={g.c}>
                        <p className="px-2.5 pb-1 pt-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">{CATEGORY_LABEL[g.c]}</p>
                        <ul className="space-y-0.5">
                          {g.items.map((t) => <li key={t.id}>{toolRow(t)}</li>)}
                        </ul>
                      </div>
                    ))}
                    {hasHub && (
                      <div className="col-span-3 mt-1 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                        <span className="text-sm font-semibold text-slate-600">{all.length} · {ui2.freeTools}</span>
                        <Link href={home} className="text-sm font-bold text-blue-700 hover:underline">
                          {ui2.seeAllTools}
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Converters menu */}
            {converters.length > 0 && (
              <div className="group relative">
                <button type="button" className={navBtn} aria-haspopup="true">
                  {ui2.catConvert}
                  <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180 group-focus-within:rotate-180" aria-hidden />
                </button>
                <div className={`${panel} top-full pt-3 start-0 w-[30rem]`}>
                  <div className="rounded-3xl border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-900/15">
                    <ul className="grid grid-cols-2 gap-1">
                      {converters.map((t) => (
                        <li key={t.id}>
                          <Link href={toolHref(lang, t.path)} className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 transition-colors hover:bg-sky-50 hover:text-sky-800">
                            <Repeat className="h-4 w-4 shrink-0 text-sky-500" aria-hidden />
                            {label(t).name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            <Link href={`${toolLink}#how-it-works`} className={navBtn}>{howItWorks}</Link>
            <Link href={faqHref} className={navBtn}>{faqLabel}</Link>
          </nav>

          <div className="flex items-center gap-2">
            <LanguageSwitcher currentLang={lang} toolLangs={TOOL_LANGS} toolSlugs={availableTools('en').filter((t) => t.id !== 'geotag').map((t) => t.path)} />
            <Link
              href={`${toolLink}#tool`}
              className="hidden items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition-all hover:-translate-y-px hover:shadow-blue-600/40 sm:inline-flex"
            >
              <MapPin className="h-4 w-4" aria-hidden />
              {ui.cta}
            </Link>

            {/* Mobile / tablet menu */}
            <details className="group/menu lg:hidden">
              <summary
                className="flex cursor-pointer list-none items-center justify-center rounded-xl border border-slate-200 bg-white p-2.5 text-slate-700 hover:bg-slate-50 [&::-webkit-details-marker]:hidden"
                aria-label="Menu"
              >
                <Menu className="h-5 w-5" aria-hidden />
              </summary>
              <div className="absolute inset-x-0 top-full max-h-[calc(100dvh-4.25rem)] overflow-y-auto border-t border-slate-200 bg-white px-4 pb-6 pt-4 shadow-2xl sm:px-6">
                <div className="mx-auto max-w-3xl">
                  {featured}
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    {categories.map((g) => (
                      <div key={g.c}>
                        <p className="px-2.5 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">{CATEGORY_LABEL[g.c]}</p>
                        <ul className="space-y-0.5">{g.items.map((t) => <li key={t.id}>{toolRow(t)}</li>)}</ul>
                      </div>
                    ))}
                  </div>
                  {converters.length > 0 && (
                    <>
                      <p className="mt-4 px-2.5 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">{ui2.catConvert}</p>
                      <ul className="flex flex-wrap gap-2 px-1">
                        {converters.map((t) => (
                          <li key={t.id}>
                            <Link href={toolHref(lang, t.path)} className="inline-flex rounded-full border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:border-sky-300 hover:text-sky-800">
                              {label(t).name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                  <div className="mt-5 grid grid-cols-2 gap-2 border-t border-slate-100 pt-4">
                    <Link href={`${toolLink}#how-it-works`} className="rounded-xl bg-slate-50 px-4 py-3 text-center text-sm font-semibold text-slate-700">{howItWorks}</Link>
                    <Link href={faqHref} className="rounded-xl bg-slate-50 px-4 py-3 text-center text-sm font-semibold text-slate-700">{faqLabel}</Link>
                  </div>
                  <Link href={`${toolLink}#tool`} className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3.5 font-bold text-white shadow-lg shadow-blue-600/25">
                    <MapPin className="h-4 w-4" aria-hidden /> {ui.cta}
                  </Link>
                </div>
              </div>
            </details>
          </div>
        </div>
      </div>
    </HeaderShell>
  );
}
