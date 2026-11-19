import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight, ArrowUpRight, BadgeCheck, Check, CheckCircle2, Cpu, Gift, Languages, Layers, Lock, Plus, Puzzle, Rocket, Scale, Search,
  ShieldCheck, Sparkles, Upload, Wallet, Wrench, Smartphone, Lightbulb,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import NumberTicker from '@/components/motion/NumberTicker';
import { FOUNDER, OG_IMAGE, SITE_URL } from '@/lib/site';
import { TOOLS } from '@/lib/tools';
import { LANGUAGES } from '@/lib/constants';

const TITLE = 'About PinPixl – Built by SEO Specialist Ali Haider';
const DESC =
  'PinPixl is a free set of photo tools built by Ali Haider, an SEO specialist who also builds browser extensions and SEO tools. Here is why it exists.';
const URL = `${SITE_URL}/about`;

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | PinPixl` },
  description: DESC,
  alternates: { canonical: URL },
  authors: [{ name: FOUNDER.name, url: FOUNDER.linkedin }],
  openGraph: { title: TITLE, description: DESC, url: URL, type: 'profile', siteName: 'PinPixl', locale: 'en_US', images: [OG_IMAGE] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC, images: [OG_IMAGE.url] },
};

// Tools that never send a file anywhere (TIFF is decoded on the server in most browsers).
const browserTools = TOOLS.filter((t) => !['geotag', 'lat-long-finder', 'image-compressor', 'ai-alt-text', 'tiff-to-jpg', 'tiff-to-png'].includes(t.id)).length;

const PROBLEMS = [
  { icon: Wallet, title: 'Geotagging tools were paid or capped', text: 'Most “free” geotaggers allowed a few photos, then asked for a subscription, or stamped a watermark on the result.', fix: 'Free, with no limits on browser tools' },
  { icon: Upload, title: 'Photos went to unknown servers', text: 'Fixing a photo’s metadata meant sending it, GPS location included, to a server you knew nothing about.', fix: `${browserTools} of ${TOOLS.length} tools never upload anything` },
  { icon: Smartphone, title: 'iPhone HEIC photos broke everything', text: 'Clients sent HEIC files that wouldn’t open on Windows, upload to websites or load in editing tools.', fix: 'HEIC works in every tool' },
  { icon: BadgeCheck, title: 'Nobody verified the result', text: 'Tools said “done” without checking. The GPS often wasn’t written, or the “stripped” file still had a location in it.', fix: 'Every result is read back before download' },
];

const PRINCIPLES = [
  { icon: Gift, title: 'Free, with no catch', text: 'No account, no watermark, no “3 free files a day”. The browser tools have no limits at all.', tone: 'from-blue-500 to-indigo-600' },
  { icon: Cpu, title: 'Your files stay yours', text: 'Most tools run inside your browser. When one needs the server, files are processed in memory and discarded.', tone: 'from-emerald-500 to-teal-600' },
  { icon: BadgeCheck, title: 'Verified, not just “done”', text: 'GPS really written, metadata really gone, file really smaller. Every output is checked.', tone: 'from-sky-500 to-cyan-600' },
  { icon: Scale, title: 'Honest about SEO', text: 'Geotagging is not a ranking hack, and we say so. The tools keep photos accurate and fast; they don’t promise rankings.', tone: 'from-amber-500 to-orange-600' },
  { icon: Languages, title: 'Native in every language', text: `${LANGUAGES.length} languages, each written for its own market with the words people there actually search for.`, tone: 'from-violet-500 to-fuchsia-600' },
  { icon: Rocket, title: 'Built for real work', text: 'Batch processing, fast results and no friction, because these tools are used on real client projects.', tone: 'from-rose-500 to-pink-600' },
];

const FAQS = [
  { q: 'Who built PinPixl?', a: `PinPixl is designed and developed by ${FOUNDER.name}, an SEO specialist. He builds tools, browser extensions and other projects that make SEO work faster and more accurate, and PinPixl is one of them.` },
  { q: 'Is PinPixl really free?', a: 'Yes. Every tool is free with no account, no watermark and no paid plan. The browser-based tools have no usage limits.' },
  { q: 'Do you keep my photos?', a: 'No. Most tools never upload your file at all. The Geo Tagging Tool and PNG compression use our server, which processes the file in memory and discards it straight away.' },
  { q: 'Can I request a tool or report a bug?', a: `Yes, and it genuinely shapes what gets built next. Message ${FOUNDER.name} on LinkedIn or use the contact page.` },
  { q: 'Can Ali help with my website’s SEO?', a: `${FOUNDER.name} works as an SEO specialist. The quickest way to talk about your project is a message on LinkedIn.` },
];

/* ───────── Building blocks (same as the homepage) ───────── */
function Eyebrow({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <p className={`mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] ${dark ? 'bg-white/10 text-blue-200 ring-1 ring-white/15' : 'bg-blue-50 text-blue-700 ring-1 ring-blue-100'}`}>
      {children}
    </p>
  );
}

function SectionHead({ eyebrow, title, sub, dark = false }: { eyebrow: React.ReactNode; title: React.ReactNode; sub?: string; dark?: boolean }) {
  return (
    <div className="mx-auto mb-14 max-w-3xl text-center">
      <Eyebrow dark={dark}>{eyebrow}</Eyebrow>
      <h2 className={`text-3xl font-extrabold tracking-tight md:text-[2.75rem] md:leading-[1.12] ${dark ? 'text-white' : 'text-slate-950'}`}>{title}</h2>
      {sub && <p className={`mt-4 text-lg ${dark ? 'text-slate-400' : 'text-slate-600'}`}>{sub}</p>}
    </div>
  );
}

const LinkedInIcon = ({ className = 'h-4 w-4' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
  </svg>
);

export default function About() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'AboutPage',
        '@id': `${URL}#page`,
        url: URL,
        name: TITLE,
        description: DESC,
        inLanguage: 'en',
        isPartOf: { '@id': `${SITE_URL}/#website` },
        about: { '@id': `${SITE_URL}/#organization` },
        mainEntity: { '@id': `${SITE_URL}/#founder` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'PinPixl', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'About', item: URL },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      },
    ],
  };

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-slate-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header lang="en" />

      <main className="flex-grow">
        {/* ───────── Hero ───────── */}
        <section className="relative bg-slate-950 text-white">
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-map-grid opacity-[0.09]" style={{ maskImage: 'radial-gradient(ellipse at 30% 20%, black 20%, transparent 70%)', WebkitMaskImage: 'radial-gradient(ellipse at 30% 20%, black 20%, transparent 70%)' }} />
            <div className="absolute -top-40 start-[-10%] h-[34rem] w-[34rem] rounded-full bg-blue-600/35 blur-[120px]" />
            <div className="absolute top-20 end-[-12%] h-[30rem] w-[30rem] rounded-full bg-violet-600/30 blur-[120px]" />
            <div className="absolute bottom-[-12rem] start-1/3 h-[24rem] w-[40rem] rounded-full bg-cyan-500/15 blur-[120px]" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 pb-28 pt-12 sm:px-6 md:pb-36 md:pt-16 lg:px-8">
            <nav aria-label="Breadcrumb" className="mb-8 text-sm text-slate-400">
              <Link href="/" className="hover:text-white">PinPixl</Link> <span className="mx-2 text-slate-600">/</span> <span className="text-slate-200">About</span>
            </nav>
            <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
              <div className="animate-rise text-center lg:text-start">
                <p className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 py-1.5 pe-4 ps-1.5 text-sm font-medium text-slate-200 backdrop-blur">
                  <span className="rounded-full bg-gradient-to-r from-blue-500 to-violet-500 px-2.5 py-0.5 text-xs font-bold text-white">About</span>
                  The people behind PinPixl
                </p>
                <h1 className="text-[2.5rem] font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-[4rem]">
                  Photo tools built by an SEO specialist,{' '}
                  <span className="bg-gradient-to-r from-sky-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">for people who publish.</span>
                </h1>
                <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-300 md:text-xl lg:mx-0">
                  PinPixl is a free toolkit for the jobs that slow down anyone who puts photos online: adding locations, reading and removing metadata, fixing iPhone formats, resizing and shrinking files. It is designed and developed by <strong className="font-bold text-white">{FOUNDER.name}</strong>.
                </p>
                <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
                  <Link href="/" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-7 py-4 font-bold text-white shadow-lg shadow-blue-600/30 transition-all hover:-translate-y-0.5">
                    Try the free tools <ArrowRight className="h-5 w-5" aria-hidden />
                  </Link>
                  <a href="#founder" className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/5 px-7 py-4 font-semibold text-white backdrop-blur transition hover:bg-white/10">
                    Meet the developer
                  </a>
                </div>
                <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-300 lg:justify-start">
                  {['No account needed', 'Private by default', `${LANGUAGES.length} languages`].map((s) => (
                    <li key={s} className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-emerald-400" aria-hidden /> {s}</li>
                  ))}
                </ul>
              </div>

              {/* Founder profile card */}
              <div className="animate-rise relative mx-auto w-full max-w-[460px] [animation-delay:150ms]">
                <div aria-hidden className="absolute inset-x-8 top-8 bottom-0 rounded-[3rem] bg-gradient-to-br from-blue-500/40 via-indigo-500/30 to-violet-500/40 blur-3xl" />
                <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-white text-slate-900 shadow-2xl shadow-black/40">
                  <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-50 px-4 py-2.5">
                    <span className="flex gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    </span>
                    <span className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-white px-3 py-1 text-[11px] font-medium text-slate-500 ring-1 ring-slate-200">
                      <Lock className="h-3 w-3 text-emerald-600" aria-hidden /> pinpixl · About the maker
                    </span>
                  </div>
                  <div className="flex items-center gap-4 p-6">
                    <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 font-display text-2xl font-extrabold text-white shadow-lg shadow-blue-600/30">AH</span>
                    <span>
                      <span className="block text-xl font-extrabold">{FOUNDER.name}</span>
                      <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700 ring-1 ring-blue-100">
                        <Search className="h-3 w-3" aria-hidden /> {FOUNDER.jobTitle}
                      </span>
                    </span>
                  </div>
                  <dl className="divide-y divide-slate-100 border-t border-slate-100 px-6 text-sm">
                    {[
                      [Wrench, 'Role', 'Designer & developer'],
                      [Puzzle, 'Builds', 'SEO tools & browser extensions'],
                      [Layers, 'Project', `PinPixl · ${TOOLS.length} free tools`],
                      [Languages, 'Reach', `${LANGUAGES.length} language markets`],
                    ].map(([Icon, k, v]) => {
                      const I = Icon as typeof Wrench;
                      return (
                        <div key={k as string} className="flex items-center gap-3 py-3">
                          <I className="h-4 w-4 shrink-0 text-blue-600" aria-hidden />
                          <dt className="w-20 text-slate-500">{k as string}</dt>
                          <dd className="font-semibold text-slate-900">{v as string}</dd>
                        </div>
                      );
                    })}
                  </dl>
                  <a href={FOUNDER.linkedin} target="_blank" rel="me noopener noreferrer" className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-3.5 text-sm font-bold text-slate-800 hover:text-blue-700">
                    <span className="inline-flex items-center gap-2"><LinkedInIcon className="h-4 w-4 text-[#0a66c2]" /> Connect on LinkedIn</span>
                    <ArrowUpRight className="h-4 w-4" aria-hidden />
                  </a>
                </div>
                {/* floating badges */}
                <div className="animate-float-slow absolute -end-3 -top-4 hidden items-center gap-2.5 rounded-2xl border border-white/70 bg-white/95 py-2 pe-4 ps-2 shadow-2xl shadow-slate-900/25 sm:flex">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white"><ShieldCheck className="h-5 w-5" aria-hidden /></span>
                  <span className="text-sm font-bold text-slate-900">Privacy first <CheckCircle2 className="inline h-3.5 w-3.5 text-emerald-600" aria-hidden /></span>
                </div>
                <div className="animate-float-slow absolute -start-5 bottom-10 hidden items-center gap-2.5 rounded-2xl border border-white/70 bg-white/95 py-2 pe-4 ps-2 shadow-2xl shadow-slate-900/25 [animation-delay:1.3s] md:flex">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white"><Sparkles className="h-5 w-5" aria-hidden /></span>
                  <span className="text-sm font-bold text-slate-900">Extensions in the works</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ───────── Stats card (true numbers only) ───────── */}
        <section className="relative z-10 -mt-16 px-4 sm:px-6">
          <div className="mx-auto grid max-w-6xl grid-cols-2 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10 md:grid-cols-4">
            {[
              { n: TOOLS.length, l: 'free tools', icon: Layers },
              { n: browserTools, l: 'run fully in your browser', icon: Cpu },
              { n: LANGUAGES.length, l: 'languages, written natively', icon: Languages },
              { n: 0, l: 'photos stored, ever', icon: ShieldCheck },
            ].map((s, i) => (
              <div key={s.l} className={`flex items-center gap-4 px-5 py-6 md:px-7 md:py-8 ${i % 2 ? 'border-s border-slate-100' : ''} ${i > 1 ? 'border-t border-slate-100 md:border-t-0' : ''} ${i === 2 ? 'md:border-s' : ''}`}>
                <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 ring-1 ring-blue-100 sm:flex">
                  <s.icon className="h-6 w-6" aria-hidden />
                </span>
                <span>
                  <NumberTicker value={s.n} className="block font-display text-3xl font-extrabold leading-none text-slate-950 md:text-4xl" />
                  <span className="mt-1.5 block text-sm leading-snug text-slate-500">{s.l}</span>
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ───────── Why it exists ───────── */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHead
              eyebrow={<><Lightbulb className="h-3.5 w-3.5" aria-hidden /> Why it exists</>}
              title={<>Built out of <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">real SEO work</span></>}
              sub="Working on SEO means handling a lot of photos: for websites, Google Business Profiles, listings and client projects. The same four problems kept coming up."
            />
            <div data-reveal className="grid gap-5 md:grid-cols-2">
              {PROBLEMS.map((p, i) => (
                <div key={p.title} className="stagger group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 transition-shadow hover:shadow-xl hover:shadow-slate-900/[0.06]" style={{ ['--i' as string]: i }}>
                  <p.icon aria-hidden className="absolute -bottom-6 -end-6 h-32 w-32 text-slate-100 transition-colors group-hover:text-blue-50" />
                  <div className="relative">
                    <span className="inline-flex rounded-2xl bg-gradient-to-br from-rose-500 to-orange-500 p-3 text-white shadow-lg shadow-rose-500/25"><p.icon className="h-6 w-6" aria-hidden /></span>
                    <h3 className="mt-5 text-lg font-bold text-slate-950">{p.title}</h3>
                    <p className="mt-2 leading-relaxed text-slate-600">{p.text}</p>
                    <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-800 ring-1 ring-emerald-100">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden /> PinPixl: {p.fix}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ───────── The developer (dark) ───────── */}
        <section id="founder" className="relative scroll-mt-20 overflow-hidden bg-slate-950 py-20 text-slate-300 md:py-28">
          <div aria-hidden className="absolute inset-0 bg-map-grid opacity-[0.06]" />
          <div aria-hidden className="absolute -top-40 start-1/2 h-80 w-[44rem] -translate-x-1/2 rounded-full bg-blue-600/25 blur-3xl rtl:translate-x-1/2" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div data-reveal>
              <Eyebrow dark><Search className="h-3.5 w-3.5" aria-hidden /> The developer</Eyebrow>
              <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-[2.75rem] md:leading-[1.12]">
                {FOUNDER.name}, <span className="bg-gradient-to-r from-sky-300 to-violet-300 bg-clip-text text-transparent">SEO specialist</span>
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-slate-400">
                Ali works in search engine optimization and builds the tools he wishes existed. PinPixl is one of them. Alongside it he develops <strong className="text-white">browser extensions</strong> and other projects that take the repetitive, error-prone parts of SEO and make them fast and reliable.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-slate-400">
                That background shapes every tool here: built around how search engines and platforms actually treat images, honest about what they can and can’t do for rankings, and fast enough for real client work.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a href={FOUNDER.linkedin} target="_blank" rel="me noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-indigo-700 shadow-lg transition-all hover:-translate-y-0.5 hover:bg-blue-50">
                  <LinkedInIcon /> Connect on LinkedIn <ArrowUpRight className="h-4 w-4" aria-hidden />
                </a>
                <Link href="/contact" className="inline-flex items-center justify-center rounded-xl border border-white/25 bg-white/5 px-6 py-3.5 font-semibold text-white hover:bg-white/10">Contact</Link>
              </div>
            </div>
            <div data-reveal style={{ ['--d' as string]: '150ms' }} className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: Search, title: 'SEO specialist', text: 'Day-to-day work in search optimization, from technical fixes to local visibility and image SEO.', tone: 'from-blue-500 to-indigo-600' },
                { icon: Puzzle, title: 'Browser extensions', text: 'Building extensions that bring SEO checks and shortcuts straight into the browser.', tone: 'from-violet-500 to-fuchsia-600' },
                { icon: Wrench, title: 'Practical tools', text: 'Free utilities like PinPixl that remove friction from real SEO and publishing tasks.', tone: 'from-sky-500 to-cyan-600' },
                { icon: Languages, title: 'Many markets', text: `Every core tool written natively in ${LANGUAGES.length} languages, not run through a translator.`, tone: 'from-emerald-500 to-teal-600' },
              ].map((c, i) => (
                <div key={c.title} className="stagger rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur" style={{ ['--i' as string]: i }}>
                  <span className={`inline-flex rounded-xl bg-gradient-to-br p-2.5 text-white shadow-lg ${c.tone}`}><c.icon className="h-5 w-5" aria-hidden /></span>
                  <h3 className="mt-4 font-bold text-white">{c.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{c.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ───────── Principles ───────── */}
        <section className="border-b border-slate-200/70 bg-slate-50 py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHead eyebrow={<><BadgeCheck className="h-3.5 w-3.5" aria-hidden /> How it’s built</>} title="The rules every tool follows" />
            <div data-reveal className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {PRINCIPLES.map((p, i) => (
                <div key={p.title} className="stagger rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/[0.06]" style={{ ['--i' as string]: i }}>
                  <span className={`inline-flex rounded-2xl bg-gradient-to-br p-3 text-white shadow-lg ${p.tone}`}><p.icon className="h-6 w-6" aria-hidden /></span>
                  <h3 className="mt-5 text-lg font-bold text-slate-950">{p.title}</h3>
                  <p className="mt-2 leading-relaxed text-slate-600">{p.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ───────── What's next ───────── */}
        <section className="py-20 md:py-28">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
            <div data-reveal>
              <Eyebrow><Rocket className="h-3.5 w-3.5" aria-hidden /> What’s next</Eyebrow>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 md:text-[2.75rem] md:leading-[1.12]">
                More tools and <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">browser extensions</span>
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-slate-600">
                PinPixl keeps growing, and Ali is working on browser extensions and further tools for SEO and publishing work. Follow him on LinkedIn to hear first, or to suggest the tool you need.
              </p>
              <a href={FOUNDER.linkedin} target="_blank" rel="me noopener noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 font-bold text-white shadow-lg shadow-blue-600/25 transition-all hover:-translate-y-0.5">
                <LinkedInIcon /> Follow on LinkedIn
              </a>
            </div>
            <ol data-reveal style={{ ['--d' as string]: '150ms' }} className="relative space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 md:p-8">
              {[
                { k: 'Live now', v: `${TOOLS.length} photo, PDF, location and format tools`, dot: 'bg-emerald-500', ring: 'ring-emerald-100' },
                { k: 'In the works', v: 'Browser extensions for faster SEO checks', dot: 'bg-blue-600', ring: 'ring-blue-100' },
                { k: 'Your idea', v: 'Suggest a tool; the most-requested ones get built', dot: 'bg-violet-500', ring: 'ring-violet-100' },
              ].map((r, i) => (
                <li key={r.k} className="stagger flex items-start gap-4" style={{ ['--i' as string]: i }}>
                  <span className={`mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full ring-4 ${r.dot} ${r.ring}`} />
                  <span>
                    <span className="block text-xs font-bold uppercase tracking-wider text-slate-500">{r.k}</span>
                    <span className="mt-0.5 block font-semibold text-slate-900">{r.v}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ───────── FAQ ───────── */}
        <section id="faq" className="scroll-mt-20 border-t border-slate-200/70 bg-slate-50 py-20 md:py-28">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Eyebrow>FAQ</Eyebrow>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 md:text-4xl">Questions & answers</h2>
              <p className="mt-4 text-slate-600">About PinPixl and the person who builds it.</p>
            </div>
            <div className="space-y-3 lg:col-span-8">
              {FAQS.map((f, i) => (
                <details key={f.q} open={i === 0} className="group rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors open:border-blue-200 open:shadow-md">
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

        {/* ───────── Closing CTA: two clear paths ───────── */}
        <section className="py-20 md:py-24">
          <div className="mx-auto max-w-6xl px-4">
            <div data-reveal className="relative overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-14 text-center text-white shadow-2xl shadow-indigo-900/30 md:px-16 md:py-20">
              <div aria-hidden className="absolute inset-0 bg-map-grid opacity-[0.12]" />
              <div aria-hidden className="absolute -start-20 -top-24 h-80 w-80 rounded-full bg-blue-600/50 blur-3xl" />
              <div aria-hidden className="absolute -bottom-24 -end-20 h-80 w-80 rounded-full bg-violet-600/45 blur-3xl" />
              <div className="relative">
                <h2 className="mx-auto max-w-3xl text-3xl font-extrabold tracking-tight md:text-5xl md:leading-[1.1]">
                  Fix your photos now, or{' '}
                  <span className="bg-gradient-to-r from-sky-300 to-violet-300 bg-clip-text text-transparent">talk SEO with Ali.</span>
                </h2>
                <p className="mx-auto mt-5 max-w-xl text-lg text-slate-300">Every tool is free, with no account. For help with your website’s search visibility, Ali is one message away.</p>
                <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Link href="/" className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-4 font-bold text-indigo-700 shadow-lg transition-all hover:-translate-y-0.5 hover:bg-blue-50">
                    Open the free tools <ArrowRight className="h-5 w-5" aria-hidden />
                  </Link>
                  <a href={FOUNDER.linkedin} target="_blank" rel="me noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/5 px-7 py-4 font-semibold text-white backdrop-blur transition hover:bg-white/10">
                    <LinkedInIcon /> Message Ali on LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer lang="en" />
    </div>
  );
}
