// Server component: shared page shell for the English tool pages.
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { Check, Plus, ArrowRight, ShieldCheck, Cpu, Server, Sparkles, Lock } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ToolIcon from '@/components/layout/ToolIcon';
import { toolById, type ToolEntry } from '@/lib/tools';
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
  const BATCH_TOOLS = ['remove-exif', 'image-compressor', 'image-converter'];
  const takesFiles = c.id !== 'lat-long-finder';
  const facts: Array<[string, string]> = [
    [fx.price, fx.priceVal],
    [fx.signup, fx.signupVal],
    ...(takesFiles ? [[fx.files, c.privacy === 'browser' ? fx.browserVal : c.privacy === 'mixed' ? fx.mixedVal : fx.serverVal] as [string, string]] : []),
    ...(BATCH_TOOLS.includes(c.id) || c.id.includes('-to-') ? [[fx.batch, fx.batchVal] as [string, string]] : []),
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
    <div className="min-h-screen bg-paper flex flex-col font-sans text-slate-900" dir={dir} lang={lang}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header lang={lang} />

      <main className="flex-grow">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-paper-2/70 via-paper to-paper" />
          <div aria-hidden className="absolute inset-0 bg-map-grid" style={{ maskImage: 'radial-gradient(ellipse at top, black 30%, transparent 70%)', WebkitMaskImage: 'radial-gradient(ellipse at top, black 30%, transparent 70%)' }} />
          <div aria-hidden className="absolute -top-24 end-[-8%] h-80 w-80 rounded-full bg-indigo-400/20 blur-3xl" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-10 md:pt-16 md:pb-12 text-center">
            <nav aria-label="Breadcrumb" className="mb-5 text-sm text-slate-500">
              <Link href={home} className="hover:text-blue-700">{ui.freeTools}</Link>
              <span className="mx-2" aria-hidden>/</span>
              <span className="text-slate-700">{toolName}</span>
            </nav>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.1] text-slate-950">{c.h1}</h1>
            <p className="mt-5 text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">{c.subtitle}</p>
            <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium text-slate-700">
              {c.chips.map((chip) => (
                <li key={chip} className="inline-flex items-center gap-1.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100">
                    <Check className="w-3.5 h-3.5 text-emerald-700" aria-hidden />
                  </span>
                  {chip}
                </li>
              ))}
            </ul>
            <p className="mt-6 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-3">
              {fx.by}{' '}
              <Link href="/about" rel="author" className="text-ink underline decoration-pin decoration-2 underline-offset-2 hover:text-pin-2">{FOUNDER.name}</Link>
              , {fx.role} <span className="mx-1.5 text-ink/30">·</span> {fx.updated}{' '}
              <time dateTime={CONTENT_UPDATED}>{updatedLabel(lang)}</time>
            </p>
          </div>
        </section>

        {/* Tool in an app window */}
        <section id="tool" className="scroll-mt-20 px-3 sm:px-6 lg:px-8 pb-16 md:pb-24">
          <div className="max-w-6xl mx-auto">
            <div className="rounded-[1.75rem] bg-gradient-to-b from-slate-200 via-slate-200/60 to-transparent p-px shadow-2xl shadow-slate-900/10">
              <div className="rounded-[1.7rem] bg-slate-50/90">
                <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 px-5 py-3.5">
                  <span className="h-3 w-3 rounded-full bg-red-400" aria-hidden />
                  <span className="h-3 w-3 rounded-full bg-amber-400" aria-hidden />
                  <span className="h-3 w-3 rounded-full bg-emerald-400" aria-hidden />
                  <span className={`ms-auto inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${badge.tone}`}>
                    <badge.icon className="w-3.5 h-3.5" aria-hidden />
                    {ui[badge.key]}
                  </span>
                </div>
                <div className="p-3 sm:p-6 lg:p-8">
                  <UiProvider lang={lang} dict={ui}>{children}</UiProvider>
                </div>
              </div>
            </div>
            <p className="mt-4 flex items-start justify-center gap-2 text-center text-sm text-slate-500">
              <Lock className="w-4 h-4 mt-0.5 shrink-0" aria-hidden />
              {c.privacyNote}
            </p>
            <section aria-labelledby="quick-facts" className="mt-8 rounded-sm border-2 border-ink bg-paper shadow-hard">
              <h2 id="quick-facts" className="border-b border-ink px-5 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-ink">{fx.title}</h2>
              <dl className="grid sm:grid-cols-2 lg:grid-cols-3">
                {facts.map(([k, v]) => (
                  <div key={k} className="border-b border-rule px-5 py-4 sm:border-e last:border-b-0">
                    <dt className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink-3">{k}</dt>
                    <dd className="mt-1 font-semibold leading-snug text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
            </section>
          </div>
        </section>

        {/* Steps */}
        <section id="how-it-works" className="scroll-mt-20 py-16 md:py-24 bg-slate-50 border-y border-slate-200/70">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mb-12">{c.stepsTitle}</h2>
            <ol className={`relative grid grid-cols-1 sm:grid-cols-2 ${c.steps.length >= 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-6`}>
              <span aria-hidden className="hidden lg:block absolute top-7 start-[12%] end-[12%] border-t-2 border-dashed border-blue-200" />
              {c.steps.map((s, i) => (
                <li key={i} className="relative flex flex-col items-center text-center">
                  <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-xl font-extrabold text-white shadow-lg shadow-blue-600/30 ring-8 ring-slate-50">{i + 1}</span>
                  <div className="mt-6 w-full flex-1 rounded-2xl border border-slate-200 bg-paper p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{s.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{s.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Long-form content */}
        <section className="py-16 md:py-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-14">
            {c.sections.map((sec) => (
              <article key={sec.title}>
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 mb-5">{sec.title}</h2>
                <div className="space-y-4 text-lg leading-relaxed text-slate-700">
                  {sec.paragraphs?.map((p, i) => <p key={i}>{p}</p>)}
                </div>
                {sec.bullets && (
                  <ul className="mt-5 space-y-3">
                    {sec.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-3 text-slate-700">
                        <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100">
                          <Check className="w-3.5 h-3.5 text-blue-700" aria-hidden />
                        </span>
                        <span className="leading-relaxed">{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ))}

            {c.table && (
              <article>
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 mb-5">{c.table.title}</h2>
                <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-700">
                      <tr>
                        {c.table.headers.map((h) => (
                          <th key={h} scope="col" className="px-4 py-3 font-semibold whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {c.table.rows.map((r) => (
                        <tr key={r[0]}>
                          {r.map((cell, i) =>
                            i === 0 ? (
                              <th key={i} scope="row" className="px-4 py-3 font-semibold text-slate-900 whitespace-nowrap">{cell}</th>
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

        {/* FAQ */}
        <section id="faq" className="scroll-mt-20 py-16 md:py-24 bg-slate-50 border-t border-slate-200/70">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-24">
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">{ui.faqTitle}</h2>
                <a href="#tool" className="mt-6 hidden lg:inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-800">
                  {ui.useTool} <ArrowRight className="w-4 h-4 rtl:rotate-180" aria-hidden />
                </a>
              </div>
            </div>
            <div className="lg:col-span-8 space-y-3">
              {c.faqs.map((f, i) => (
                <details key={i} open={i === 0} className="group rounded-2xl border border-slate-200 bg-white shadow-sm open:border-blue-200">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 [&::-webkit-details-marker]:hidden">
                    <h3 className="font-bold text-base md:text-lg text-slate-900 group-hover:text-blue-700">{f.q}</h3>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-all group-open:rotate-45 group-open:bg-blue-600 group-open:text-white">
                      <Plus className="w-4 h-4" aria-hidden />
                    </span>
                  </summary>
                  <p className="px-6 pb-6 -mt-1 text-slate-600 leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Related tools (internal links) */}
        {related.length > 0 && (
          <section className="py-16 md:py-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-end justify-between gap-4 mb-8">
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">{ui.moreTools}</h2>
                <Link href={home} className="text-sm font-semibold text-blue-700 hover:underline">{ui.allTools}</Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {related.map((t) => <RelatedCard key={t.id} t={t} lang={lang} />)}
              </div>
            </div>
          </section>
        )}
        {/* Same tool in every other language (internal links that mirror the hreflang tags). */}
        <section className="border-t border-rule py-10" aria-label="Languages">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs font-semibold uppercase tracking-wider">
              {LANGUAGES.filter((l) => tool && toolLangs(tool.id).includes(l.code)).map((l) => (
                <li key={l.code}>
                  {l.code === lang ? (
                    <span className="text-ink" aria-current="page">{l.name}</span>
                  ) : (
                    <Link href={pathFor(l.code, tool!.path)} hrefLang={l.code} lang={l.code} className="text-ink-3 hover:text-pin-2">
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
