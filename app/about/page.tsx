import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Check, Cpu, BadgeCheck, Languages, Scale, Gift, Plus, Puzzle, Wrench, Search } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
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

const browserTools = TOOLS.filter((t) => !['geotag', 'lat-long-finder', 'image-compressor', 'ai-alt-text'].includes(t.id)).length;

const PRINCIPLES = [
  { icon: Gift, title: 'Free, with no catch', text: 'No account, no watermark, no “3 free files a day”. The browser tools have no limits at all.' },
  { icon: Cpu, title: 'Your files stay yours', text: `${browserTools} of ${TOOLS.length} tools run inside your browser. When a tool needs the server, files are processed in memory and discarded.` },
  { icon: BadgeCheck, title: 'Verified, not just “done”', text: 'Every result is read back before you download it: GPS really written, metadata really gone, file really smaller.' },
  { icon: Scale, title: 'Honest about SEO', text: 'Geotagging is not a ranking hack, and we say so. The tools help you keep photos accurate and fast; they don’t promise rankings.' },
  { icon: Languages, title: 'Native in every language', text: `Each of the ${LANGUAGES.length} languages is written for its own market, with the words people there actually search for.` },
];

const PROBLEMS = [
  ['Geotagging tools were paid or capped', 'Most “free” geotaggers allowed a few photos, then asked for a subscription, or stamped a watermark on the result.'],
  ['Photos were uploaded to unknown servers', 'Fixing a photo’s metadata meant sending it, GPS location included, to a server you knew nothing about.'],
  ['iPhone HEIC photos broke everything', 'Clients sent HEIC files that wouldn’t open on Windows, upload to websites or load in editing tools.'],
  ['Nobody verified the result', 'Tools said “done” without checking. The GPS often wasn’t written, or the “stripped” file still had a location in it.'],
];

const FAQS = [
  { q: 'Who built PinPixl?', a: `PinPixl is designed and developed by ${FOUNDER.name}, an SEO specialist. He builds tools, browser extensions and other projects that make SEO work faster and more accurate, and PinPixl is one of them.` },
  { q: 'Is PinPixl really free?', a: 'Yes. Every tool is free with no account, no watermark and no paid plan. The browser-based tools have no usage limits.' },
  { q: 'Do you keep my photos?', a: 'No. Most tools never upload your file at all. The Geo Tagging Tool and PNG compression use our server, which processes the file in memory and discards it straight away.' },
  { q: 'Can I request a tool or report a bug?', a: `Yes, and it genuinely shapes what gets built next. Message ${FOUNDER.name} on LinkedIn or use the contact page.` },
  { q: 'Can Ali help with my website’s SEO?', a: `${FOUNDER.name} works as an SEO specialist. The quickest way to talk about your project is a message on LinkedIn.` },
];

/* ───────── Small editorial blocks (same language as the homepage) ───────── */
function Label({ n, children, dark = false }: { n: string; children: React.ReactNode; dark?: boolean }) {
  return (
    <p className={`flex items-center gap-3 font-sans text-[11px] font-bold uppercase tracking-[0.18em] ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
      <span className="text-blue-600">{n}</span>
      <span className={`h-px w-8 ${dark ? 'bg-paper/30' : 'bg-slate-300'}`} />
      {children}
    </p>
  );
}
const Em = ({ children }: { children: React.ReactNode }) => <em className="bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 bg-clip-text text-transparent">{children}</em>;
const h2 = 'mt-4 text-4xl font-extrabold leading-[1.02] tracking-[-0.035em] md:text-[3.2rem]';

function LinkedInButton({ dark = false, label = 'Connect on LinkedIn' }: { dark?: boolean; label?: string }) {
  return (
    <a
      href={FOUNDER.linkedin}
      target="_blank"
      rel="me noopener noreferrer"
      className={` inline-flex items-center gap-2 rounded-xl border px-5 py-3 font-bold ${dark ? 'border-white bg-white text-slate-900 shadow-lg shadow-blue-900/30' : 'border-slate-200 bg-slate-950 text-white shadow-xl shadow-slate-900/10'}`}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
      </svg>
      {label}
      <ArrowUpRight className="h-4 w-4" aria-hidden />
    </a>
  );
}

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
        <section className="relative overflow-hidden bg-slate-950 text-white">
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 hidden opacity-70" />
            <div className="absolute -end-40 -top-24 h-[640px] w-[640px] bg-map-grid opacity-[0.09]" />
          </div>
          <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 md:pb-24 md:pt-16 lg:px-8">
            <nav aria-label="Breadcrumb" className="mb-10 font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
              <Link href="/" className="hover:text-white">PinPixl</Link> <span className="mx-2">/</span> <span className="text-white">About</span>
            </nav>
            <div className="grid items-center gap-14 lg:grid-cols-[1.25fr_1fr]">
              <div className="animate-rise">
                <Label n="00">About PinPixl</Label>
                <h1 className="mt-5 text-[2.7rem] font-extrabold leading-[1] tracking-[-0.045em] sm:text-6xl lg:text-[4.6rem]">
                  Photo tools built by an SEO specialist, <Em>for people who publish.</Em>
                </h1>
                <p className="mt-7 max-w-xl text-lg leading-relaxed text-slate-300 md:text-xl">
                  PinPixl is a free toolkit for the jobs that slow down anyone who puts photos online: adding locations, reading and removing metadata, fixing iPhone formats and shrinking file sizes. It is designed and developed by <strong className="font-bold text-white">{FOUNDER.name}</strong>.
                </p>
                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <Link href="/" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 font-bold text-white shadow-xl shadow-slate-900/10">
                    Try the free tools <ArrowRight className="h-5 w-5" aria-hidden />
                  </Link>
                  <a href="#founder" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 px-6 py-3.5 font-bold text-white hover:border-white/15">
                    Meet the developer
                  </a>
                </div>
              </div>

              {/* Founder card */}
              <div className="animate-rise [animation-delay:150ms]">
                <div className="relative mx-auto max-w-sm text-slate-900 rotate-[1.5deg] rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10 rtl:-rotate-[1.5deg]">
                  <div className="flex items-center justify-between border-b border-slate-200 px-5 py-2.5 font-sans text-[10px] font-bold uppercase tracking-[0.16em]">
                    <span>Field notes · Maker</span>
                    <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600" />
                  </div>
                  <div className="flex items-center gap-5 px-5 py-6">
                    <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 font-display text-3xl font-extrabold text-white shadow-lg shadow-blue-600/30">AH</span>
                    <span>
                      <span className="block text-2xl font-extrabold tracking-[-0.02em]">{FOUNDER.name}</span>
                      <span className="mt-1 block font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-blue-700">{FOUNDER.jobTitle}</span>
                    </span>
                  </div>
                  <dl className="ruled border-t border-slate-200 px-5 py-1 font-sans text-[11px] leading-8">
                    {[
                      ['Role', 'Designer & developer'],
                      ['Builds', 'SEO tools & extensions'],
                      ['Project', `PinPixl · ${TOOLS.length} tools`],
                      ['Languages', `${LANGUAGES.length} markets`],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-3">
                        <dt className="uppercase tracking-wider text-slate-500">{k}</dt>
                        <dd className="font-semibold">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="border-t border-slate-200 p-4">
                    <a href={FOUNDER.linkedin} target="_blank" rel="me noopener noreferrer" className="flex items-center justify-between font-bold hover:text-blue-700">
                      linkedin.com/in/ali-haider-seo-consultant <ArrowUpRight className="h-4 w-4" aria-hidden />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* true numbers */}
          <dl className="relative border-t border-white/15">
            <div className="mx-auto grid max-w-7xl grid-cols-2 px-4 sm:px-6 md:grid-cols-4 lg:px-8">
              {[
                [String(TOOLS.length), 'free tools'],
                [String(browserTools), 'run fully in your browser'],
                [String(LANGUAGES.length), 'languages, written natively'],
                ['0', 'photos stored, ever'],
              ].map(([v, l], i) => (
                <div key={l} className={`py-6 md:py-8 ${i ? 'md:border-s md:border-white/10 md:ps-8' : ''} ${i % 2 ? 'border-s border-white/10 ps-5' : ''} ${i > 1 ? 'border-t border-white/10 md:border-t-0' : ''}`}>
                  <dt className="sr-only">{l}</dt>
                  <dd>
                    <span className="block font-serif text-5xl leading-none md:text-6xl">{v}</span>
                    <span className="mt-2 block font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">{l}</span>
                  </dd>
                </div>
              ))}
            </div>
          </dl>
        </section>

        {/* ───────── 01 Why it exists ───────── */}
        <section className="border-b border-slate-200 py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div data-reveal className="grid gap-6 md:grid-cols-[1fr_1.3fr] md:items-end">
              <div>
                <Label n="01">Why it exists</Label>
                <h2 className={h2}>Built out of <Em>real</Em> SEO work.</h2>
              </div>
              <p className="max-w-xl text-lg leading-relaxed text-slate-600 md:justify-self-end">
                Working on SEO means handling a lot of photos: for websites, Google Business Profiles, listings and client projects. The same problems kept coming up, and the tools to fix them were either paid, slow, or quietly uploading private photos.
              </p>
            </div>
            <ol data-reveal className="mt-14 grid border-s border-t border-slate-200 md:grid-cols-2">
              {PROBLEMS.map(([title, text], i) => (
                <li key={title} className="stagger border-b border-e border-slate-200 bg-white p-7" style={{ ['--i' as string]: i }}>
                  <span className="font-sans text-[11px] font-bold text-blue-600">Problem {String(i + 1).padStart(2, '0')}</span>
                  <h3 className="mt-3 text-xl font-extrabold tracking-[-0.02em]">{title}</h3>
                  <p className="mt-2 leading-relaxed text-slate-600">{text}</p>
                </li>
              ))}
            </ol>
            <p data-reveal className="mt-10 max-w-3xl text-xl leading-relaxed text-slate-900">
              PinPixl is the answer to all four: <Em>free</Em>, private by default, iPhone-ready, and it checks its own work before you download anything.
            </p>
          </div>
        </section>

        {/* ───────── 02 The developer ───────── */}
        <section id="founder" className="scroll-mt-20 relative overflow-hidden border-b border-slate-200 bg-slate-950 py-20 text-white md:py-28">
          <div aria-hidden className="absolute inset-0 bg-map-grid opacity-[0.07]" />
          <div className="relative mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-[1fr_1.15fr] lg:px-8">
            <div data-reveal>
              <Label n="02" dark>The developer</Label>
              <h2 className={`${h2} text-white`}>{FOUNDER.name}, <Em>SEO specialist.</Em></h2>
              <p className="mt-6 text-lg leading-relaxed text-slate-300">
                Ali works in search engine optimization, and he builds the tools he wishes existed. PinPixl is one of them. Alongside it he develops <strong className="text-white">browser extensions</strong> and other projects that take the repetitive, error-prone parts of SEO and make them fast and reliable.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-slate-300">
                That background shapes every tool here: they are built around how search engines and platforms actually treat images, they say plainly what they can and can’t do for rankings, and they are fast enough to use on real client work.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <LinkedInButton dark />
                <Link href="/contact" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 px-5 py-3 font-bold text-white hover:border-white">
                  Contact
                </Link>
              </div>
            </div>

            <div data-reveal style={{ ['--d' as string]: '150ms' }} className="grid self-start gap-px border border-white/15 bg-white/10 sm:grid-cols-2">
              {[
                { icon: Search, title: 'SEO specialist', text: 'Day-to-day work in search optimization, from technical fixes to local visibility and image SEO.' },
                { icon: Puzzle, title: 'Browser extensions', text: 'Building extensions that bring SEO checks and shortcuts straight into the browser.' },
                { icon: Wrench, title: 'Practical tools', text: 'Free utilities like PinPixl that remove friction from real SEO and publishing tasks.' },
                { icon: Languages, title: 'Built for many markets', text: `Every tool written natively in ${LANGUAGES.length} languages, not run through a translator.` },
              ].map((c, i) => (
                <div key={c.title} className="stagger bg-slate-950 p-7" style={{ ['--i' as string]: i }}>
                  <c.icon className="h-6 w-6 text-blue-600" aria-hidden />
                  <h3 className="mt-4 text-lg font-extrabold">{c.title}</h3>
                  <p className="mt-1.5 leading-relaxed text-slate-400">{c.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ───────── 03 Principles ───────── */}
        <section className="border-b border-slate-200 py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div data-reveal>
              <Label n="03">How it’s built</Label>
              <h2 className={h2}>Five rules every tool <Em>follows.</Em></h2>
            </div>
            <ol data-reveal className="mt-14 border-t border-slate-200">
              {PRINCIPLES.map((p, i) => (
                <li key={p.title} className="stagger grid grid-cols-[3rem_1fr] items-start gap-4 border-b border-slate-200 py-6 md:grid-cols-[4rem_18rem_1fr] md:gap-8" style={{ ['--i' as string]: i }}>
                  <span className="font-sans text-sm font-bold text-slate-500">{String(i + 1).padStart(2, '0')}</span>
                  <span className="flex items-center gap-3 text-xl font-extrabold tracking-[-0.02em]">
                    <p.icon className="h-5 w-5 shrink-0 text-blue-600" aria-hidden /> {p.title}
                  </span>
                  <span className="col-start-2 leading-relaxed text-slate-600 md:col-start-auto">{p.text}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ───────── 04 What's next ───────── */}
        <section className="border-b border-slate-200 bg-slate-50 py-20 md:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div data-reveal>
              <Label n="04">What’s next</Label>
              <h2 className={h2}>More tools. <Em>Browser extensions.</Em></h2>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-600">
                PinPixl keeps growing, and Ali is working on browser extensions and further tools for SEO and publishing work. The best way to hear first, or to suggest the tool you need, is to follow him on LinkedIn.
              </p>
              <div className="mt-8"><LinkedInButton label="Follow on LinkedIn" /></div>
            </div>
            <ul data-reveal style={{ ['--d' as string]: '150ms' }} className="self-center border-t border-slate-200">
              {[
                ['Live now', `${TOOLS.length} photo, location and format tools in ${LANGUAGES.length} languages`],
                ['In the works', 'Browser extensions for faster SEO checks'],
                ['Your idea', 'Suggest a tool, and the most-requested ones get built'],
              ].map(([k, v], i) => (
                <li key={k} className="stagger grid grid-cols-[8.5rem_1fr] gap-4 border-b border-slate-200 py-5" style={{ ['--i' as string]: i }}>
                  <span className={`font-sans text-[11px] font-bold uppercase tracking-[0.14em] ${i === 0 ? 'text-emerald-600' : 'text-blue-700'}`}>{k}</span>
                  <span className="font-semibold">{v}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ───────── 05 FAQ ───────── */}
        <section className="border-b border-slate-200 py-20 md:py-28">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
            <div data-reveal className="lg:col-span-4">
              <Label n="05">FAQ</Label>
              <h2 className={h2}>Questions, <Em>answered.</Em></h2>
            </div>
            <div data-reveal className="border-t border-slate-200 lg:col-span-8">
              {FAQS.map((f, i) => (
                <details key={f.q} open={i === 0} className="group border-b border-slate-200">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
                    <h3 className="text-lg font-extrabold tracking-[-0.01em] group-hover:text-blue-700 md:text-xl">{f.q}</h3>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-slate-200 transition-all group-open:rotate-45 group-open:bg-blue-600 group-open:text-white">
                      <Plus className="h-4 w-4" aria-hidden />
                    </span>
                  </summary>
                  <p className="-mt-1 max-w-2xl pb-7 text-lg leading-relaxed text-slate-600">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ───────── CTA: two clear paths ───────── */}
        <section className="py-20 md:py-28">
          <div data-reveal className="mx-auto grid max-w-6xl gap-6 px-4 md:grid-cols-2">
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white shadow-2xl shadow-indigo-600/30 md:p-10">
              <div aria-hidden className="absolute -end-24 -top-24 h-80 w-80 bg-map-grid opacity-[0.08]" />
              <p className="relative font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-white/80">For your photos</p>
              <h2 className="relative mt-4 text-3xl font-extrabold leading-tight tracking-[-0.03em] md:text-4xl">Fix a photo right now, <em className="bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 bg-clip-text text-transparent">free.</em></h2>
              <ul className="relative mt-6 space-y-2">
                {['No account or email', 'No watermark, no limits', 'Works on iPhone & Android'].map((s) => (
                  <li key={s} className="flex items-center gap-2 font-semibold"><Check className="h-4 w-4" aria-hidden /> {s}</li>
                ))}
              </ul>
              <Link href="/" className="relative mt-8 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 font-bold text-slate-900 shadow-xl shadow-slate-900/10">
                Open the tools <ArrowRight className="h-5 w-5" aria-hidden />
              </Link>
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/10 md:p-10">
              <p className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">For your website</p>
              <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-[-0.03em] md:text-4xl">Want an SEO specialist <Em>on your side?</Em></h2>
              <p className="mt-4 leading-relaxed text-slate-600">
                Talk to {FOUNDER.name} about your site’s search visibility, technical SEO or getting more out of your images.
              </p>
              <div className="mt-8"><LinkedInButton label="Message Ali on LinkedIn" /></div>
            </div>
          </div>
        </section>
      </main>

      <Footer lang="en" />
    </div>
  );
}
