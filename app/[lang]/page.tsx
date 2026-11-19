import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, ArrowUpRight, Check, Plus, Cpu, BadgeCheck, Smartphone } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ToolIcon from '@/components/layout/ToolIcon';
import { TOOL_LANGS, availableTools, getUi, pathFor, toolText } from '@/lib/i18n';
import { hubFor } from '@/lib/i18n/hub';
import { factsFor } from '@/lib/i18n/facts';
import { uiStrings, type ToolCategory } from '@/lib/tools';
import { CONTENT_UPDATED, FOUNDER, SITE_URL, OG_IMAGE, ogAlternates, ogLocale, updatedLabel } from '@/lib/site';

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
    openGraph: {
      title: ui.homeTitle,
      description: ui.homeMeta,
      url: `${SITE_URL}/${lang}`,
      type: 'website',
      siteName: 'PinPixl',
      images: [OG_IMAGE],
      locale: ogLocale(lang),
      alternateLocale: ogAlternates(lang, ['en', ...TOOL_LANGS]),
    },
    twitter: { card: 'summary_large_image', title: ui.homeTitle, description: ui.homeMeta, images: [OG_IMAGE.url] },
    robots: { index: true, follow: true },
  };
}

const WHY_ICONS = [Cpu, BadgeCheck, Smartphone];

export default async function LocalizedHome({ params }: Props) {
  const { lang } = await params;
  if (!TOOL_LANGS.includes(lang)) notFound();
  const ui = getUi(lang);
  const g = uiStrings(lang);
  const hub = hubFor(lang);
  const fx = factsFor(lang);
  const tools = availableTools(lang);
  const featured = tools.filter((t) => t.inMenu && !t.path.includes('-to-'));
  const converters = tools.filter((t) => t.category === 'convert' && t.path.includes('-to-'));
  const label = (t: (typeof tools)[number]) => toolText(t, lang, { name: g.geotagName, desc: g.geotagDesc });
  const cats: [ToolCategory, string][] = [
    ['location', ui.catLocation],
    ['convert', ui.catConvert],
    ['optimize', ui.catOptimize],
  ];
  const geotagHref = pathFor(lang, '/free-geo-tagging-tool');

  const url = `${SITE_URL}/${lang}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${url}#hub`,
        name: ui.homeTitle,
        description: hub?.answer || ui.homeMeta,
        url,
        inLanguage: lang,
        dateModified: CONTENT_UPDATED,
        author: { '@id': `${SITE_URL}/#founder` },
        isPartOf: { '@id': `${SITE_URL}/#website` },
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: tools.length,
          itemListElement: tools.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: label(t).name, url: `${SITE_URL}${pathFor(lang, t.path)}` })),
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'PinPixl', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: ui.freeTools, item: url },
        ],
      },
      ...(hub
        ? [{ '@type': 'FAQPage', mainEntity: hub.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }]
        : []),
    ],
  };

  const label2 = 'flex items-center gap-3 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-ink-3';

  return (
    <div className="flex min-h-screen flex-col bg-paper font-sans text-ink" dir={lang === 'ar' ? 'rtl' : 'ltr'} lang={lang}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header lang={lang} />
      <main className="flex-grow">
        {/* ───────── Hero ───────── */}
        <section className="relative overflow-hidden border-b border-ink">
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 paper-grain opacity-70" />
            <div className="anim-drift absolute -end-40 -top-24 h-[620px] w-[620px] topo" />
          </div>
          <div className="relative mx-auto max-w-5xl px-4 pb-14 pt-14 sm:px-6 md:pb-20 md:pt-20">
            <p className={label2}>
              <span className="text-pin">●</span> PinPixl <span className="h-px w-8 bg-ink/30" /> {tools.length} · {ui.freeTools}
            </p>
            <h1 className="animate-rise mt-6 text-[2.5rem] font-extrabold leading-[1.02] tracking-[-0.04em] sm:text-6xl lg:text-[4.2rem]">{ui.homeTitle}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-2 md:text-xl">{ui.homeSub}</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href={geotagHref} className="press inline-flex items-center justify-center gap-2 rounded-md border border-ink bg-pin px-6 py-3.5 font-bold text-white shadow-hard">
                {hub?.ctaButton || g.cta} <ArrowRight className="h-5 w-5 rtl:rotate-180" aria-hidden />
              </Link>
              <a href="#tools" className="inline-flex items-center justify-center rounded-md border border-ink/30 px-6 py-3.5 font-bold text-ink hover:border-ink">
                {ui.allTools}
              </a>
            </div>
            <p className="mt-8 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-3">
              {fx.by}{' '}
              <Link href="/about" rel="author" className="text-ink underline decoration-pin decoration-2 underline-offset-2 hover:text-pin-2">{FOUNDER.name}</Link>
              , {fx.role} <span className="mx-1.5 text-ink/30">·</span> {fx.updated} <time dateTime={CONTENT_UPDATED}>{updatedLabel(lang)}</time>
            </p>
          </div>
        </section>

        {/* ───────── Answer-first definition (AEO) ───────── */}
        {hub && (
          <section className="border-b border-ink bg-paper-2/60">
            <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 md:py-12">
              <p data-reveal className="border-s-4 border-pin ps-5 text-xl font-semibold leading-relaxed text-ink md:text-2xl">{hub.answer}</p>
            </div>
          </section>
        )}

        {/* ───────── Tools ───────── */}
        <section id="tools" className="scroll-mt-20 border-b border-ink py-16 md:py-24">
          <div className="mx-auto max-w-7xl space-y-14 px-4 sm:px-6 lg:px-8">
            {cats.map(([cat, title], ci) => {
              const list = featured.filter((t) => t.category === cat);
              if (!list.length) return null;
              return (
                <div key={cat} data-reveal>
                  <p className={label2}><span className="text-pin">{String(ci + 1).padStart(2, '0')}</span><span className="h-px w-8 bg-ink/30" /></p>
                  <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.03em] md:text-4xl">{title}</h2>
                  <ol className="mt-6 border-t-2 border-ink">
                    {list.map((t, i) => (
                      <li key={t.id} className="stagger border-b border-ink" style={{ ['--i' as string]: i }}>
                        <Link href={pathFor(lang, t.path)} className="group grid grid-cols-[2rem_1fr_auto] items-center gap-4 py-5 transition-colors hover:bg-paper-2 md:grid-cols-[3rem_1fr_1.4fr_2rem] md:gap-6">
                          <ToolIcon name={t.icon} className="h-5 w-5 text-ink group-hover:text-pin" />
                          <span className="text-lg font-extrabold tracking-[-0.01em] md:text-xl">{label(t).name}</span>
                          <span className="col-span-2 col-start-2 text-ink-2 md:col-span-1 md:col-start-auto">{label(t).desc}</span>
                          <ArrowUpRight className="col-start-3 row-start-1 h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:text-pin md:col-start-auto md:row-start-auto rtl:-scale-x-100" aria-hidden />
                        </Link>
                      </li>
                    ))}
                  </ol>
                  {cat === 'convert' && converters.length > 0 && (
                    <div className="mt-6 rounded-sm border-2 border-ink bg-paper p-5 shadow-hard">
                      <p className="mb-3 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-ink-3">{ui.homeConversions}</p>
                      <ul className="flex flex-wrap gap-2">
                        {converters.map((t) => (
                          <li key={t.id}>
                            <Link href={pathFor(lang, t.path)} className="inline-flex items-center gap-1.5 rounded-sm border border-ink px-3 py-1.5 text-sm font-bold text-ink hover:bg-ink hover:text-paper">
                              <Check className="h-3.5 w-3.5 text-moss" aria-hidden /> {label(t).name}
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

        {hub && (
          <>
            {/* ───────── Why ───────── */}
            <section className="relative overflow-hidden border-b border-ink bg-ink py-16 text-paper md:py-24">
              <div aria-hidden className="absolute inset-0 topo opacity-50 invert" />
              <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <h2 data-reveal className="text-4xl font-extrabold tracking-[-0.035em] md:text-5xl">{hub.whyTitle}</h2>
                <div data-reveal className="mt-12 grid gap-px border border-paper/25 bg-paper/25 md:grid-cols-3">
                  {hub.why.map((w, i) => {
                    const Icon = WHY_ICONS[i] || Check;
                    return (
                      <div key={w.t} className="stagger bg-ink p-7" style={{ ['--i' as string]: i }}>
                        <Icon className="h-6 w-6 text-pin" aria-hidden />
                        <h3 className="mt-4 text-xl font-extrabold">{w.t}</h3>
                        <p className="mt-2 leading-relaxed text-paper/70">{w.d}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* ───────── FAQ ───────── */}
            <section id="faq" className="scroll-mt-20 border-b border-ink py-16 md:py-24">
              <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
                <h2 data-reveal className="text-4xl font-extrabold tracking-[-0.035em] md:text-5xl lg:col-span-4">{hub.faqTitle}</h2>
                <div data-reveal className="border-t-2 border-ink lg:col-span-8">
                  {hub.faqs.map((f, i) => (
                    <details key={f.q} open={i === 0} className="group border-b border-ink">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
                        <h3 className="text-lg font-extrabold group-hover:text-pin-2 md:text-xl">{f.q}</h3>
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-ink transition-all group-open:rotate-45 group-open:bg-pin group-open:text-white">
                          <Plus className="h-4 w-4" aria-hidden />
                        </span>
                      </summary>
                      <p className="-mt-1 max-w-2xl pb-7 text-lg leading-relaxed text-ink-2">{f.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            </section>

            {/* ───────── CTA ───────── */}
            <section className="py-16 md:py-24">
              <div className="mx-auto max-w-6xl px-4">
                <div data-reveal className="relative overflow-hidden rounded-sm border-2 border-ink bg-pin px-6 py-12 text-white shadow-[8px_8px_0_0_var(--color-ink)] md:px-14 md:py-16">
                  <div aria-hidden className="anim-drift absolute -end-32 -top-32 h-[480px] w-[480px] topo opacity-70 invert" />
                  <div className="relative max-w-2xl">
                    <h2 className="text-3xl font-extrabold leading-tight tracking-[-0.03em] md:text-5xl">{hub.ctaTitle}</h2>
                    <p className="mt-4 text-lg text-white/85">{hub.ctaText}</p>
                    <Link href={geotagHref} className="press mt-8 inline-flex items-center gap-2 rounded-md border border-ink bg-paper px-7 py-4 font-bold text-ink shadow-hard">
                      {hub.ctaButton} <ArrowRight className="h-5 w-5 rtl:rotate-180" aria-hidden />
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
      <Footer lang={lang} />
    </div>
  );
}
