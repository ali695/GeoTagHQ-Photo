// Server component: all page copy is rendered as HTML so search engines can read it.
// Only <GeoTaggingTool /> (and the language switcher) run on the client.
import Link from 'next/link';
import { CONTENT_UPDATED, FOUNDER, updatedLabel } from '@/lib/site';
import { factsFor } from '@/lib/i18n/facts';
import {
  ShieldCheck,
  MapPin,
  Crosshair,
  Layers,
  Tag,
  Sparkles,
  Image as ImageIcon,
  Link2,
  Crop,
  Check,
  Plus,
  ArrowRight,
  Building2,
  Megaphone,
  Home,
  HardHat,
  Camera,
  Globe,
  Info,
  Lock,
  Lightbulb,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import GeoTaggingTool from '@/components/tool/GeoTaggingTool';
import HeroVisual from '@/components/tool/HeroVisual';
import { SITE_HOST } from '@/lib/site';
import { UiProvider } from '@/components/tools/UiProvider';
import { getUi } from '@/lib/i18n';
import { EXIF_TAGS, FEATURE_ICON_ORDER, FORMAT_LEVELS } from '@/lib/content/toolPage';
import type { FeatureIcon, ToolPageContent as Content } from '@/lib/content/toolPage';

const FEATURE_ICONS: Record<FeatureIcon, typeof MapPin> = {
  map: MapPin,
  crosshair: Crosshair,
  layers: Layers,
  tag: Tag,
  sparkles: Sparkles,
  image: ImageIcon,
  link: Link2,
  crop: Crop,
};

// One accent per card so the grid does not read as a wall of identical boxes.
const ACCENTS = [
  'from-blue-500 to-indigo-600 shadow-blue-500/25',
  'from-sky-500 to-cyan-500 shadow-sky-500/25',
  'from-violet-500 to-purple-600 shadow-violet-500/25',
  'from-emerald-500 to-teal-600 shadow-emerald-500/25',
  'from-amber-500 to-orange-500 shadow-amber-500/25',
  'from-pink-500 to-rose-500 shadow-pink-500/25',
  'from-indigo-500 to-blue-700 shadow-indigo-500/25',
  'from-teal-500 to-emerald-600 shadow-teal-500/25',
];

const USE_CASE_ICONS = [Building2, Megaphone, Home, HardHat, Camera, Globe];

function SectionHeading({ title, intro, center = true, dark = false }: { title: string; intro?: string; center?: boolean; dark?: boolean }) {
  return (
    <div className={`${center ? 'text-center mx-auto' : ''} max-w-3xl mb-12 md:mb-14`}>
      <h2 className={`text-3xl md:text-[2.5rem] md:leading-[1.15] font-extrabold tracking-tight ${dark ? 'text-white' : 'text-slate-900'}`}>{title}</h2>
      {intro && <p className={`mt-4 text-lg leading-relaxed ${dark ? 'text-slate-300' : 'text-slate-600'}`}>{intro}</p>}
    </div>
  );
}

export default function ToolPageContent({
  messages,
  lang,
  content: c,
}: {
  messages: any;
  lang: string;
  content: Content;
}) {
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const heroRows = (c.metadataRows || []).map((r) => ({ field: r.field, example: r.example }));

  // The interactive tool only needs its UI strings. Page copy (headings, SEO text, FAQ fallbacks)
  // is rendered as HTML above, so it is not shipped to the browser a second time.
  const PAGE_COPY = new Set(['h1', 'subtitle', 'metaTitle', 'metaDesc', 'seoTitle', 'seoDesc', 'privacyTitle', 'privacyDesc', 'howItWorks', 'howItWorksDesc', 'step1Title', 'step1Desc', 'step2Title', 'step2Desc', 'step3Title', 'step3Desc']);
  const toolMessages = { tool: Object.fromEntries(Object.entries(messages?.tool || {}).filter(([k]) => !PAGE_COPY.has(k))) };

  return (
    <div className="min-h-screen bg-paper flex flex-col font-sans text-slate-900" dir={dir}>
      <Header lang={lang} messages={messages} />

      <main className="flex-grow">
        {/* ───────── Hero ───────── */}
        <section className="relative overflow-hidden">
          <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-paper-2/70 via-paper to-paper" />
          <div
            aria-hidden
            className="absolute inset-0 bg-map-grid"
            style={{ maskImage: 'radial-gradient(ellipse at top, black 30%, transparent 75%)', WebkitMaskImage: 'radial-gradient(ellipse at top, black 30%, transparent 75%)' }}
          />
          <div aria-hidden className="absolute -top-24 end-[-10%] h-[28rem] w-[28rem] rounded-full bg-indigo-400/20 blur-3xl" />
          <div aria-hidden className="absolute top-40 start-[-10%] h-[22rem] w-[22rem] rounded-full bg-sky-300/25 blur-3xl" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 md:pt-20 md:pb-24">
            <div className={`grid items-center gap-12 lg:gap-16 ${heroRows.length ? 'lg:grid-cols-[1.05fr_1fr]' : ''}`}>
              <div className={heroRows.length ? 'text-center lg:text-start' : 'text-center max-w-3xl mx-auto'}>
                {c.eyebrow && (
                  <p className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-white/80 px-4 py-1.5 text-sm font-semibold text-blue-700 shadow-sm backdrop-blur mb-6">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 animate-ping-soft" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                    </span>
                    {c.eyebrow}
                  </p>
                )}
                <h1 className="text-4xl sm:text-5xl lg:text-[3.6rem] font-extrabold tracking-tight leading-[1.08] text-slate-950">
                  {c.h1}
                </h1>
                <p className="mt-6 text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">{c.subtitle}</p>

                {c.ctaPrimary && (
                  <div className="mt-9 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                    <a
                      href="#tool"
                      className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-7 py-4 text-base font-bold text-white shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 hover:-translate-y-0.5 transition-all"
                    >
                      {c.ctaPrimary}
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" aria-hidden />
                    </a>
                    {c.ctaSecondary && (
                      <a
                        href="#how-it-works"
                        className="inline-flex w-full sm:w-auto items-center justify-center rounded-xl border border-slate-200 bg-white px-7 py-4 text-base font-semibold text-slate-800 hover:border-slate-300 hover:bg-slate-50 transition-colors"
                      >
                        {c.ctaSecondary}
                      </a>
                    )}
                  </div>
                )}

                {c.trustChips && (
                  <ul className="mt-9 grid grid-cols-2 gap-3 max-w-xl mx-auto lg:mx-0 text-start">
                    {c.trustChips.map((chip) => (
                      <li key={chip} className="flex items-center gap-2 text-sm font-medium text-slate-700">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                          <Check className="w-3.5 h-3.5 text-emerald-700" aria-hidden />
                        </span>
                        {chip}
                      </li>
                    ))}
                  </ul>
                )}
                <p className="mt-7 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-3">
                  {factsFor(lang).by}{' '}
                  <Link href="/about" rel="author" className="text-ink underline decoration-pin decoration-2 underline-offset-2 hover:text-pin-2">{FOUNDER.name}</Link>
                  , {factsFor(lang).role} <span className="mx-1.5 text-ink/30">·</span> {factsFor(lang).updated}{' '}
                  <time dateTime={CONTENT_UPDATED}>{updatedLabel(lang)}</time>
                </p>
              </div>

              {heroRows.length > 0 && (
                <div className="px-4 sm:px-8 lg:px-0">
                  <HeroVisual rows={heroRows} />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ───────── Tool, framed as an app window ───────── */}
        <section id="tool" className="scroll-mt-20 relative px-3 sm:px-6 lg:px-8 pb-20 md:pb-28">
          <div className="max-w-7xl mx-auto">
            <div className="rounded-[1.75rem] bg-gradient-to-b from-slate-200 via-slate-200/60 to-transparent p-px shadow-2xl shadow-slate-900/10">
              <div className="rounded-[1.7rem] bg-slate-50/90">
                <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-3.5">
                  <span className="h-3 w-3 rounded-full bg-red-400" aria-hidden />
                  <span className="h-3 w-3 rounded-full bg-amber-400" aria-hidden />
                  <span className="h-3 w-3 rounded-full bg-emerald-400" aria-hidden />
                  <div className="mx-auto flex items-center gap-2 rounded-lg bg-paper border border-slate-200 px-4 py-1.5 text-xs font-medium text-slate-500" dir="ltr">
                    <Lock className="w-3 h-3 text-emerald-600" aria-hidden />
                    {SITE_HOST}
                  </div>
                  <span className="w-[52px]" aria-hidden />
                </div>
                <div className="p-3 sm:p-6 lg:p-8">
                  <UiProvider lang={lang} dict={getUi(lang)}>
            <GeoTaggingTool messages={toolMessages} />
          </UiProvider>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ───────── How it works: numbered timeline ───────── */}
        <section id="how-it-works" className="scroll-mt-20 py-20 md:py-28 bg-slate-50 border-y border-slate-200/70">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading title={c.stepsTitle} intro={c.stepsIntro} />
            <ol className={`relative grid grid-cols-1 sm:grid-cols-2 ${c.steps.length >= 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-6 lg:gap-8`}>
              <span aria-hidden className="hidden lg:block absolute top-7 start-[12%] end-[12%] h-px border-t-2 border-dashed border-blue-200" />
              {c.steps.map((step, i) => (
                <li key={i} className="relative flex flex-col items-center text-center">
                  <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-xl font-extrabold text-white shadow-lg shadow-blue-600/30 ring-8 ring-slate-50">
                    {i + 1}
                  </span>
                  <div className="mt-6 w-full flex-1 rounded-2xl border border-slate-200 bg-paper p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{step.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ───────── Features ───────── */}
        {c.features && c.featuresTitle && (
          <section id="features" className="py-20 md:py-28">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <SectionHeading title={c.featuresTitle} intro={c.featuresIntro} />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {c.features.map((f, i) => {
                  const Icon = FEATURE_ICONS[f.icon ?? FEATURE_ICON_ORDER[i % FEATURE_ICON_ORDER.length]];
                  return (
                    <div
                      key={f.title}
                      className="group relative rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-900/5"
                    >
                      <div className={`inline-flex rounded-xl bg-gradient-to-br p-3 text-white shadow-lg ${ACCENTS[i % ACCENTS.length]}`}>
                        <Icon className="w-5 h-5" aria-hidden />
                      </div>
                      <h3 className="mt-5 font-bold text-slate-900">{f.title}</h3>
                      <p className="mt-2 text-sm text-slate-600 leading-relaxed">{f.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ───────── What gets written: dark EXIF inspector ───────── */}
        {c.metadataRows && c.metadataTitle && (
          <section id="metadata" className="relative overflow-hidden py-20 md:py-28 bg-slate-950">
            <div aria-hidden className="absolute inset-0 bg-map-grid opacity-[0.07]" />
            <div aria-hidden className="absolute -top-32 start-1/2 h-72 w-[40rem] -translate-x-1/2 rtl:translate-x-1/2 rounded-full bg-blue-600/25 blur-3xl" />
            <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <SectionHeading title={c.metadataTitle} intro={c.metadataIntro} dark />
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 shadow-2xl shadow-black/40 backdrop-blur">
                <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400" aria-hidden />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" aria-hidden />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" aria-hidden />
                  <span className="ms-3 font-mono text-xs text-slate-400">EXIF · IMG_4521.jpg</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-start text-sm">
                    <thead className="text-slate-400">
                      <tr className="border-b border-white/10">
                        <th scope="col" className="px-5 py-3 text-start text-xs font-semibold uppercase tracking-wider">{c.metadataHeaders?.[0] ?? 'Field'}</th>
                        <th scope="col" className="hidden sm:table-cell px-5 py-3 text-start text-xs font-semibold uppercase tracking-wider">{c.metadataHeaders?.[1] ?? 'EXIF tag'}</th>
                        <th scope="col" className="px-5 py-3 text-start text-xs font-semibold uppercase tracking-wider">{c.metadataHeaders?.[2] ?? 'Example'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {c.metadataRows.map((r, i) => {
                        const tag = r.tag ?? EXIF_TAGS[i];
                        return (
                          <tr key={r.field} className="hover:bg-white/[0.03] transition-colors">
                            <th scope="row" className="px-5 py-4 align-top text-start font-semibold text-white sm:whitespace-nowrap">
                              {r.field}
                              <span className="sm:hidden block mt-1 font-mono text-[11px] font-normal text-blue-300 break-words" dir="ltr">{tag}</span>
                            </th>
                            <td className="hidden sm:table-cell px-5 py-4 align-top font-mono text-xs text-blue-300" dir="ltr">{tag}</td>
                            <td className="px-5 py-4 align-top text-slate-300" dir="auto">{r.example}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              {c.metadataNote && (
                <p className="mt-5 flex items-start gap-2 text-sm text-slate-400">
                  <Info className="w-4 h-4 mt-0.5 shrink-0 text-blue-400" aria-hidden />
                  {c.metadataNote}
                </p>
              )}
            </div>
          </section>
        )}

        {/* ───────── Use cases ───────── */}
        {c.useCases && c.useCasesTitle && (
          <section id="use-cases" className="py-20 md:py-28">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <SectionHeading title={c.useCasesTitle} />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {c.useCases.map((u, i) => {
                  const Icon = USE_CASE_ICONS[i % USE_CASE_ICONS.length];
                  return (
                    <div key={u.title} className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50/60 p-7">
                      <Icon aria-hidden className="absolute -end-4 -bottom-4 h-28 w-28 text-slate-100" />
                      <div className="relative">
                        <div className="inline-flex rounded-xl bg-blue-50 p-3 ring-1 ring-blue-100">
                          <Icon className="w-6 h-6 text-blue-600" aria-hidden />
                        </div>
                        <h3 className="mt-5 text-lg font-bold text-slate-900">{u.title}</h3>
                        <p className="mt-2 text-slate-600 leading-relaxed">{u.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ───────── Local SEO (honest answer) + privacy ───────── */}
        <section id="local-seo" className="scroll-mt-20 py-20 md:py-28 bg-gradient-to-b from-indigo-50/60 via-white to-white border-t border-slate-200/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            <div className="lg:col-span-7">
              {c.seoTitle && (
                <>
                  <span className="inline-flex items-center justify-center rounded-xl bg-amber-100 p-3 mb-5">
                    <Lightbulb className="w-6 h-6 text-amber-700" aria-hidden />
                  </span>
                  <h2 className="text-3xl md:text-[2.5rem] md:leading-[1.15] font-extrabold tracking-tight text-slate-900 mb-6">{c.seoTitle}</h2>
                </>
              )}
              <div className="space-y-5 text-lg leading-relaxed text-slate-700">
                {c.seoParagraphs.map((p, i) => (
                  <p key={i} className={i === 0 ? 'text-slate-900 font-medium' : ''}>{p}</p>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 space-y-6">
              {c.seoChecklist && (
                <div className="rounded-3xl border border-slate-200 bg-paper p-7 shadow-xl shadow-slate-900/5">
                  {c.seoChecklistTitle && <h3 className="text-lg font-bold text-slate-900 mb-5">{c.seoChecklistTitle}</h3>}
                  <ul className="space-y-4">
                    {c.seoChecklist.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-slate-700">
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                          <Check className="w-4 h-4 text-emerald-700" aria-hidden />
                        </span>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {c.privacyTitle && (
                <div id="privacy" className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-blue-950 p-7 text-slate-300 shadow-xl">
                  <ShieldCheck aria-hidden className="absolute -end-6 -top-6 h-32 w-32 text-white/5" />
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="inline-flex rounded-xl bg-emerald-400/15 p-2.5 ring-1 ring-emerald-400/30">
                        <ShieldCheck className="w-6 h-6 text-emerald-400" aria-hidden />
                      </span>
                      <h2 className="text-xl font-bold text-white">{c.privacyTitle}</h2>
                    </div>
                    <div className="space-y-3 leading-relaxed">
                      {c.privacyParagraphs.map((p, i) => (
                        <p key={i}>{p}</p>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ───────── Formats ───────── */}
        {c.formats && c.formatsTitle && (
          <section id="formats" className="py-20 md:py-24 border-t border-slate-200/70">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <SectionHeading title={c.formatsTitle} />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {c.formats.map((f, i) => {
                  const level = f.level ?? FORMAT_LEVELS[i] ?? 'converted';
                  const tone =
                    level === 'full'
                      ? { badge: 'bg-emerald-100 text-emerald-800', bar: 'bg-emerald-500', w: 'w-full' }
                      : level === 'good'
                        ? { badge: 'bg-blue-100 text-blue-800', bar: 'bg-blue-500', w: 'w-3/4' }
                        : { badge: 'bg-amber-100 text-amber-800', bar: 'bg-amber-500', w: 'w-1/2' };
                  return (
                    <div key={f.format} className="flex flex-col rounded-2xl border border-slate-200 bg-paper p-5">
                      <h3 className="font-mono text-sm font-bold text-slate-900" dir="ltr">{f.format}</h3>
                      <div className="mt-3 h-1.5 w-full rounded-full bg-slate-100">
                        <div className={`h-1.5 rounded-full ${tone.bar} ${tone.w}`} />
                      </div>
                      <span className={`mt-3 w-fit rounded-full px-2.5 py-0.5 text-xs font-semibold ${tone.badge}`}>{f.support}</span>
                      <p className="mt-3 text-sm text-slate-600 leading-relaxed">{f.note}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ───────── FAQ: heading beside, native <details> so every answer is in the HTML ───────── */}
        {c.faqs.length > 0 && (
          <section id="faq" className="scroll-mt-20 py-20 md:py-28 bg-slate-50 border-t border-slate-200/70">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
              <div className="lg:col-span-4">
                <div className="lg:sticky lg:top-24">
                  <h2 className="text-3xl md:text-[2.5rem] md:leading-[1.15] font-extrabold tracking-tight text-slate-900">{c.faqTitle}</h2>
                  {c.faqSubtitle && <p className="mt-4 text-lg text-slate-600 leading-relaxed">{c.faqSubtitle}</p>}
                  {c.ctaPrimary && (
                    <a href="#tool" className="mt-8 hidden lg:inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-800 transition-colors">
                      {c.ctaPrimary}
                      <ArrowRight className="w-4 h-4 rtl:rotate-180" aria-hidden />
                    </a>
                  )}
                </div>
              </div>
              <div className="lg:col-span-8 space-y-3">
                {c.faqs.map((faq, i) => (
                  <details
                    key={i}
                    open={i === 0}
                    className="group rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors open:border-blue-200 open:shadow-md open:shadow-blue-900/5"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 [&::-webkit-details-marker]:hidden">
                      <h3 className="font-bold text-base md:text-lg text-slate-900 group-hover:text-blue-700 transition-colors">{faq.q}</h3>
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-all duration-200 group-open:rotate-45 group-open:bg-blue-600 group-open:text-white">
                        <Plus className="w-4 h-4" aria-hidden />
                      </span>
                    </summary>
                    <p className="px-6 pb-6 -mt-1 text-slate-600 leading-relaxed">{faq.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ───────── Final CTA ───────── */}
        {c.finalCtaTitle && (
          <section className="py-20 md:py-24">
            <div className="max-w-5xl mx-auto px-4">
              <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 px-6 py-14 md:px-16 md:py-16 text-center text-white shadow-2xl shadow-indigo-600/30">
                <div aria-hidden className="absolute inset-0 bg-map-grid opacity-25" />
                <div aria-hidden className="absolute -top-20 -end-20 h-64 w-64 rounded-full bg-paper/15 blur-3xl" />
                <MapPin aria-hidden className="absolute -bottom-6 -start-6 h-40 w-40 text-white/10" />
                <div className="relative">
                  <h2 className="text-3xl md:text-[2.5rem] md:leading-[1.15] font-extrabold tracking-tight">{c.finalCtaTitle}</h2>
                  {c.finalCtaText && <p className="mt-4 text-lg text-blue-100">{c.finalCtaText}</p>}
                  {c.finalCtaButton && (
                    <a
                      href="#tool"
                      className="mt-9 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-4 font-bold text-indigo-700 shadow-lg hover:bg-blue-50 hover:-translate-y-0.5 transition-all"
                    >
                      {c.finalCtaButton}
                      <ArrowRight className="w-5 h-5 rtl:rotate-180" aria-hidden />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer lang={lang} messages={messages} />
    </div>
  );
}
