// Server component: shared page shell for the English tool pages.
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { Check, Plus, ArrowRight, ShieldCheck, Cpu, Server, Sparkles, Lock } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ToolIcon from '@/components/layout/ToolIcon';
import { isPair, toolById, type ToolEntry } from '@/lib/tools';
import { getUi, pathFor, toolLangs, toolText } from '@/lib/i18n';
import { UiProvider } from './UiProvider';
import { uiStrings } from '@/lib/tools';
import type { Landing, Privacy } from '@/lib/content/landing';
import { CONTENT_UPDATED, FOUNDER, OG_IMAGE, SITE_URL, ogAlternates, ogLocale, updatedLabel } from '@/lib/site';
import { factsFor } from '@/lib/i18n/facts';
import { LANGUAGES } from '@/lib/constants';

const SITE = SITE_URL;

export function landingMetadata(c: Landing, lang = 'en'): Metadata {
  const tool = toolById(c.id);
  const path = tool?.path || '/';
  const url = `${SITE}${pathFor(lang, path)}`;
  // hreflang: every language this tool exists in, plus x-default (English).
  const languages: Record<string, string> = {};
  for (const l of toolLangs(c.id)) languages[l] = `${SITE}${pathFor(l, path)}`;
  languages['x-default'] = `${SITE}${path}`;
  return {
    title: { absolute: `${c.metaTitle} | PinPixl` },
    description: c.metaDescription,
    alternates: { canonical: url, languages },
    openGraph: {
      title: c.metaTitle,
      description: c.metaDescription,
      url,
      type: 'website',
      siteName: 'PinPixl',
      locale: ogLocale(lang),
      alternateLocale: ogAlternates(lang, toolLangs(c.id)),
      images: [OG_IMAGE],
    },
    twitter: { card: 'summary_large_image', title: c.metaTitle, description: c.metaDescription, images: [OG_IMAGE.url] },
    robots: { index: true, follow: true },
  };
}

const PRIVACY_BADGE: Record<Privacy, { icon: typeof Cpu; key: 'badgeBrowser' | 'badgeMixed' | 'badgeServer' | 'badgeAi'; tone: string }> = {
  browser: { icon: Cpu, key: 'badgeBrowser', tone: 'border-emerald-200 bg-emerald-50 text-emerald-800' },
  mixed: { icon: ShieldCheck, key: 'badgeMixed', tone: 'border-emerald-200 bg-emerald-50 text-emerald-800' },
  server: { icon: Server, key: 'badgeServer', tone: 'border-blue-200 bg-blue-50 text-blue-800' },
  ai: { icon: Sparkles, key: 'badgeAi', tone: 'border-violet-200 bg-violet-50 text-violet-800' },
};

function RelatedCard({ t, lang }: { t: ToolEntry; lang: string }) {
  const g = uiStrings(lang);
  const label = toolText(t, lang, { name: g.geotagName, desc: g.geotagDesc });
  return (
    <Link href={pathFor(lang, t.path)} className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg hover:shadow-slate-900/5">
      <span className="shrink-0 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 text-white shadow-md shadow-blue-500/20">
        <ToolIcon name={t.icon} className="w-5 h-5" />
      </span>
      <span className="min-w-0">
        <span className="flex items-center gap-1 font-bold text-slate-900 group-hover:text-blue-700">
          {label.name}
          <ArrowRight className="w-4 h-4 opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0" aria-hidden />
        </span>
        <span className="mt-1 block text-sm text-slate-600">{label.desc}</span>
      </span>
    </Link>
  );
}

export default function ToolLayout({ content: c, children, lang = 'en' }: { content: Landing; children: ReactNode; lang?: string }) {
  const ui = getUi(lang);
  const g = uiStrings(lang);
  const tool = toolById(c.id);
  const url = `${SITE}${pathFor(lang, tool?.path || '/')}`;
  const toolName = tool ? toolText(tool, lang, { name: g.geotagName, desc: g.geotagDesc }).name : c.h1;
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const home = lang === 'en' ? '/' : `/${lang}`;
  const badge = PRIVACY_BADGE[c.privacy];
  const related = c.related
    .map(toolById)
    .filter((t): t is ToolEntry => !!t && t.id !== c.id && (t.id === 'geotag' || toolLangs(t.id).includes(lang)));

  const fx = factsFor(lang);
  const BATCH_TOOLS = ['remove-exif', 'image-compressor', 'image-converter', 'image-resizer', 'jpg-to-pdf', 'png-to-pdf'];
  const takesFiles = c.id !== 'lat-long-finder';
  const facts: Array<[string, string]> = [
    [fx.price, fx.priceVal],
    [fx.signup, fx.signupVal],
    ...(takesFiles ? [[fx.files, c.privacy === 'browser' ? fx.browserVal : c.privacy === 'mixed' ? fx.mixedVal : fx.serverVal] as [string, string]] : []),
    ...(BATCH_TOOLS.includes(c.id) || isPair({ id: c.id }) || c.id.startsWith('compress-to-') ? [[fx.batch, fx.batchVal] as [string, string]] : []),
    [fx.works, fx.worksVal],
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': `${url}#app`,
        name: toolName,
        alternateName: c.h1,
        url,
        image: `${SITE}${OG_IMAGE.url}`,
        browserRequirements: 'Requires a modern browser with JavaScript enabled',
        featureList: c.chips,
        isPartOf: { '@id': `${SITE}/#website` },
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Any (web browser)',
        inLanguage: lang,
        isAccessibleForFree: true,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        description: c.metaDescription,
        publisher: { '@id': `${SITE}/#organization` },
      },
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: c.metaTitle,
        description: c.metaDescription,
        inLanguage: lang,
        dateModified: CONTENT_UPDATED,
        author: { '@id': `${SITE}/#founder` },
        isPartOf: { '@id': `${SITE}/#website` },
        mainEntity: { '@id': `${url}#app` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: ui.freeTools, item: `${SITE}${home}` },
          { '@type': 'ListItem', position: 2, name: toolName, item: url },
        ],
      },
      {
        '@type': 'HowTo',
        name: c.stepsTitle,
        step: c.steps.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, name: s.title, text: s.desc })),
      },
      {
        '@type': 'FAQPage',
        mainEntity: c.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      },
    ],
  };

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-slate-900" dir={dir} lang={lang}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header lang={lang} />

      <main className="flex-grow">
        {/* ───────── Hero (dark, like the homepage) ───────── */}
        <section className="relative bg-slate-950 text-white">
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-map-grid opacity-[0.09]" style={{ maskImage: 'radial-gradient(ellipse at 50% 0%, black 25%, transparent 70%)', WebkitMaskImage: 'radial-gradient(ellipse at 50% 0%, black 25%, transparent 70%)' }} />
            <div className="absolute -top-40 start-[-10%] h-[30rem] w-[30rem] rounded-full bg-blue-600/35 blur-[120px]" />
            <div className="absolute top-10 end-[-12%] h-[28rem] w-[28rem] rounded-full bg-violet-600/30 blur-[120px]" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>
          <div className="relative mx-auto max-w-4xl px-4 pb-32 pt-10 text-center sm:px-6 md:pb-40 md:pt-14">
            <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-400">
              <Link href={home} className="hover:text-white">{ui.freeTools}</Link>
              <span className="mx-2 text-slate-600" aria-hidden>/</span>
              <span className="text-slate-200">{toolName}</span>
            </nav>
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-sm font-medium text-slate-200 backdrop-blur">
              <badge.icon className="h-4 w-4 text-emerald-400" aria-hidden />
              {ui[badge.key]}
            </p>
            <h1 className="animate-rise text-4xl font-extrabold leading-[1.06] tracking-tight sm:text-5xl lg:text-[3.6rem]">{c.h1}</h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-300 md:text-xl">{c.subtitle}</p>
            <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium text-slate-200">
              {c.chips.map((chip) => (
                <li key={chip} className="inline-flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-emerald-400" aria-hidden /> {chip}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-slate-400">
              {fx.by}{' '}
              <Link href="/about" rel="author" className="font-semibold text-blue-300 hover:text-white">{FOUNDER.name}</Link>, {fx.role}
              <span className="mx-2 text-slate-600">·</span>
              {fx.updated} <time dateTime={CONTENT_UPDATED}>{updatedLabel(lang)}</time>
            </p>
          </div>
        </section>

        {/* ───────── Tool, framed as an app window, overlapping the hero ───────── */}
        <section id="tool" className="relative z-10 -mt-24 scroll-mt-20 px-3 pb-16 sm:px-6 md:-mt-28 md:pb-24 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/15">
              <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-slate-50 px-5 py-3.5">
                <span className="h-3 w-3 rounded-full bg-rose-400" aria-hidden />
                <span className="h-3 w-3 rounded-full bg-amber-400" aria-hidden />
                <span className="h-3 w-3 rounded-full bg-emerald-400" aria-hidden />
                <span className={`ms-auto inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${badge.tone}`}>
                  <badge.icon className="h-3.5 w-3.5" aria-hidden />
                  {ui[badge.key]}
                </span>
              </div>
              <div className="p-3 sm:p-6 lg:p-8">
                <UiProvider lang={lang} dict={ui}>{children}</UiProvider>
              </div>
            </div>
            <p className="mt-4 flex items-start justify-center gap-2 text-center text-sm text-slate-500">
              <Lock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              {c.privacyNote}
            </p>

            {/* Quick facts (answer-first, for AI search) */}
            <section aria-labelledby="quick-facts" className="mt-10 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5">
              <h2 id="quick-facts" className="border-b border-slate-100 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-3 text-xs font-bold uppercase tracking-[0.14em] text-blue-700">{fx.title}</h2>
              <dl className="grid sm:grid-cols-2 lg:grid-cols-3">
                {facts.map(([k, v]) => (
                  <div key={k} className="flex items-start gap-3 border-b border-slate-100 px-6 py-5 sm:border-e">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/25">
                      <Check className="h-4 w-4" aria-hidden />
                    </span>
                    <span>
                      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{k}</dt>
                      <dd className="mt-1 font-semibold leading-snug text-slate-900">{v}</dd>
                    </span>
                  </div>
                ))}
              </dl>
            </section>
          </div>
        </section>

        {/* ───────── Steps ───────── */}
        <section id="how-it-works" className="scroll-mt-20 border-y border-slate-200/70 bg-slate-50 py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 data-reveal className="mb-12 text-center text-3xl font-extrabold tracking-tight text-slate-950 md:text-[2.6rem] md:leading-[1.15]">{c.stepsTitle}</h2>
            <ol data-reveal className={`relative grid gap-6 sm:grid-cols-2 ${c.steps.length >= 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
              <span aria-hidden className="absolute start-[16%] end-[16%] top-10 hidden border-t-2 border-dashed border-blue-200 lg:block" />
              {c.steps.map((s, i) => (
                <li key={i} className="stagger relative rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-sm" style={{ ['--i' as string]: i }}>
                  <span className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 font-display text-2xl font-extrabold text-white shadow-xl shadow-blue-600/30">{i + 1}</span>
                  <h3 className="mt-5 text-lg font-bold text-slate-950">{s.title}</h3>
                  <p className="mt-2 leading-relaxed text-slate-600">{s.desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ───────── Long-form content ───────── */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-3xl space-y-14 px-4 sm:px-6">
            {c.sections.map((sec) => (
              <article key={sec.title} data-reveal>
                <h2 className="mb-5 flex items-start gap-3 text-2xl font-extrabold tracking-tight text-slate-950 md:text-3xl">
                  <span aria-hidden className="mt-2 h-6 w-1.5 shrink-0 rounded-full bg-gradient-to-b from-blue-500 to-violet-500" />
                  {sec.title}
                </h2>
                <div className="space-y-4 text-lg leading-relaxed text-slate-700">
                  {sec.paragraphs?.map((p, i) => <p key={i}>{p}</p>)}
                </div>
                {sec.bullets && (
                  <ul className="mt-5 space-y-3">
                    {sec.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-slate-700 shadow-sm">
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                          <Check className="h-3.5 w-3.5" aria-hidden />
                        </span>
                        <span className="leading-relaxed">{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ))}

            {c.table && (
              <article data-reveal>
                <h2 className="mb-5 flex items-start gap-3 text-2xl font-extrabold tracking-tight text-slate-950 md:text-3xl">
                  <span aria-hidden className="mt-2 h-6 w-1.5 shrink-0 rounded-full bg-gradient-to-b from-blue-500 to-violet-500" />
                  {c.table.title}
                </h2>
                <div className="overflow-x-auto rounded-3xl border border-slate-200 shadow-xl shadow-slate-900/[0.06]">
                  <table className="w-full text-start text-sm">
                    <thead>
                      <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                        {c.table.headers.map((h, i) => (
                          <th key={h + i} scope="col" className="whitespace-nowrap px-4 py-3.5 text-start font-semibold">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {c.table.rows.map((r, ri) => (
                        <tr key={r[0]} className={ri % 2 ? 'bg-white' : 'bg-slate-50/60'}>
                          {r.map((cell, i) =>
                            i === 0 ? (
                              <th key={i} scope="row" className="whitespace-nowrap px-4 py-3 text-start font-semibold text-slate-900">{cell}</th>
                            ) : (
                              <td key={i} className="px-4 py-3 text-slate-600">{cell}</td>
                            ),
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {c.table.note && <p className="mt-3 text-sm text-slate-500">{c.table.note}</p>}
              </article>
            )}
          </div>
        </section>

        {/* ───────── FAQ ───────── */}
        <section id="faq" className="scroll-mt-20 border-t border-slate-200/70 bg-slate-50 py-16 md:py-24">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-24">
                <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 md:text-4xl">{ui.faqTitle}</h2>
                <a href="#tool" className="mt-6 hidden items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 font-bold text-white shadow-lg shadow-blue-600/25 transition-all hover:-translate-y-0.5 lg:inline-flex">
                  {ui.useTool} <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
                </a>
              </div>
            </div>
            <div className="space-y-3 lg:col-span-8">
              {c.faqs.map((f, i) => (
                <details key={i} open={i === 0} className="group rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors open:border-blue-200 open:shadow-md">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 [&::-webkit-details-marker]:hidden">
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 md:text-lg">{f.q}</h3>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-all group-open:rotate-45 group-open:bg-blue-600 group-open:text-white">
                      <Plus className="h-4 w-4" aria-hidden />
                    </span>
                  </summary>
                  <p className="-mt-1 px-6 pb-6 leading-relaxed text-slate-600">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ───────── Related tools ───────── */}
        {related.length > 0 && (
          <section className="py-16 md:py-20">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <div className="mb-8 flex items-end justify-between gap-4">
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-950 md:text-3xl">{ui.moreTools}</h2>
                <Link href={home} className="text-sm font-bold text-blue-700 hover:underline">{ui.allTools}</Link>
              </div>
              <div data-reveal className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((t) => <RelatedCard key={t.id} t={t} lang={lang} />)}
              </div>
            </div>
          </section>
        )}

        {/* ───────── Closing call to action (dark, like the homepage) ───────── */}
        <section className="pb-16 md:pb-24">
          <div className="mx-auto max-w-6xl px-4">
            <div data-reveal className="relative overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-12 text-center text-white shadow-2xl shadow-indigo-900/30 md:px-16 md:py-16">
              <div aria-hidden className="absolute inset-0 bg-map-grid opacity-[0.12]" />
              <div aria-hidden className="absolute -start-20 -top-24 h-72 w-72 rounded-full bg-blue-600/50 blur-3xl" />
              <div aria-hidden className="absolute -bottom-24 -end-20 h-72 w-72 rounded-full bg-violet-600/45 blur-3xl" />
              <div className="relative">
                <h2 className="mx-auto max-w-3xl text-3xl font-extrabold tracking-tight md:text-5xl md:leading-[1.1]">
                  <span className="bg-gradient-to-r from-sky-300 via-blue-300 to-violet-300 bg-clip-text text-transparent">{toolName}</span>
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-lg text-slate-300">{c.subtitle}</p>
                <a href="#tool" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-4 font-bold text-indigo-700 shadow-lg transition-all hover:-translate-y-0.5 hover:bg-blue-50">
                  {ui.useTool} <ArrowRight className="h-5 w-5 rtl:rotate-180" aria-hidden />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Same tool in every other language (internal links that mirror the hreflang tags). */}
        <section className="border-t border-slate-200 py-8" aria-label="Languages">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium">
              {LANGUAGES.filter((l) => tool && toolLangs(tool.id).includes(l.code)).map((l) => (
                <li key={l.code}>
                  {l.code === lang ? (
                    <span className="font-bold text-slate-900" aria-current="page">{l.name}</span>
                  ) : (
                    <Link href={pathFor(l.code, tool!.path)} hrefLang={l.code} lang={l.code} className="text-slate-500 hover:text-blue-700">
                      {l.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <Footer lang={lang} />
    </div>
  );
}
