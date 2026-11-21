import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight, Cpu, ShieldCheck, Zap, Check, X, Plus, Building2, Home as HomeIcon, Camera, Megaphone, Lock, Globe2, Layers, BadgeCheck, MapPin,
  Languages, MousePointerClick, Upload, Download, Smartphone, Server, Sparkles, Star,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ToolIcon from '@/components/layout/ToolIcon';
import ToolFinder from '@/components/home/ToolFinder';
import HomeVisual from '@/components/home/HomeVisual';
import { CATEGORY_LABEL, FORMAT_LABEL, TOOLS, isPair, toolById, type ToolCategory, type ToolEntry } from '@/lib/tools';
import NumberTicker from '@/components/motion/NumberTicker';
import DottedWorld, { type Pin } from '@/components/home/DottedWorld';
import { LANGUAGES } from '@/lib/constants';
import { OG_IMAGE, SITE_URL } from '@/lib/site';

const SITE = SITE_URL;

export const metadata: Metadata = {
  title: { absolute: 'PinPixl – Free Photo Tools: Geotag, EXIF Viewer & Image Converter' },
  description:
    'Free photo tools: geotag photos, remove EXIF data, convert HEIC, WebP and JPG to PDF, resize images and compress to an exact KB size. No sign-up.',
  alternates: {
    canonical: `${SITE}/`,
    languages: Object.fromEntries([...LANGUAGES.map((l) => [l.code, l.code === 'en' ? `${SITE}/` : `${SITE}/${l.code}`]), ['x-default', `${SITE}/`]]),
  },
  openGraph: {
    title: 'PinPixl – Free Photo, Location & Image Tools',
    description: 'Geotag photos, read and remove EXIF data, convert HEIC and WebP, and compress images. Free, private, no sign-up.',
    url: `${SITE}/`,
    type: 'website',
    siteName: 'PinPixl',
    locale: 'en_US',
    images: [OG_IMAGE],
  },
};

/* ───────── Content ───────── */

const TONE: Record<ToolCategory, { icon: string; soft: string; text: string; ring: string }> = {
  location: { icon: 'from-blue-500 to-indigo-600 shadow-blue-500/30', soft: 'bg-blue-50', text: 'text-blue-700', ring: 'hover:border-blue-300' },
  convert: { icon: 'from-sky-500 to-cyan-600 shadow-sky-500/30', soft: 'bg-sky-50', text: 'text-sky-700', ring: 'hover:border-sky-300' },
  optimize: { icon: 'from-violet-500 to-fuchsia-600 shadow-violet-500/30', soft: 'bg-violet-50', text: 'text-violet-700', ring: 'hover:border-violet-300' },
};

const CATEGORY_INTRO: Record<ToolCategory, string> = {
  location: 'Add, read, find and remove the location and metadata hidden inside your photos.',
  convert: 'Change image formats right in your browser, including iPhone HEIC photos.',
  optimize: 'Make images lighter so pages load faster and uploads go through.',
};

/** Tools that send something to our server; everything else runs fully in the browser. */
const SERVER_NOTE: Record<string, string> = {
  geotag: 'Writes GPS on our server, in memory only',
  'image-compressor': 'PNG mode only; JPG & WebP stay in your browser',
  'lat-long-finder': 'Sends only the address you search, never a photo',
  'ai-alt-text': 'Sends the image to an AI model',
  'tiff-to-jpg': 'Most browsers can’t read TIFF, so it is decoded on our server',
  'tiff-to-png': 'Most browsers can’t read TIFF, so it is decoded on our server',
};

const POPULAR_SMALL = ['jpg-to-pdf', 'heic-to-jpg', 'image-resizer', 'compress-to-100kb'];

/** One pin per language market on the world map; each links to that language's tools. */
const PINS: Pin[] = [
  { label: 'EN', lat: 40.7, lng: -74, href: '/' },
  { label: 'ES', lat: 40.4, lng: -3.7, href: '/es', dx: -10, dy: 1.6 },
  { label: 'FR', lat: 48.9, lng: 2.35, href: '/fr', dx: -10, dy: 1.6 },
  { label: 'NL', lat: 52.4, lng: 4.9, href: '/nl', dx: -9, dy: -2.4 },
  { label: 'DE', lat: 52.5, lng: 13.4, href: '/de' },
  { label: 'IT', lat: 41.9, lng: 12.5, href: '/it', dx: 2.6, dy: 4 },
  { label: 'TR', lat: 41, lng: 29, href: '/tr' },
  { label: 'AR', lat: 24.7, lng: 46.7, href: '/ar' },
  { label: 'HI', lat: 28.6, lng: 77.2, href: '/hi' },
  { label: 'ID', lat: -6.2, lng: 106.8, href: '/id' },
  { label: 'KO', lat: 37.6, lng: 127, href: '/ko', dx: -9.5, dy: -1.6 },
  { label: 'JA', lat: 35.7, lng: 139.7, href: '/ja' },
  { label: 'PT', lat: -23.5, lng: -46.6, href: '/pt' },
];
const ROUTES: Array<[string, string]> = [['EN', 'DE'], ['EN', 'PT'], ['DE', 'TR'], ['TR', 'HI'], ['HI', 'ID'], ['ID', 'JA'], ['JA', 'KO'], ['FR', 'AR']];
const MATRIX_FROM = ['heic', 'webp', 'jpg', 'png', 'avif', 'gif', 'bmp', 'tiff', 'svg'] as const;
const MATRIX_TO = ['jpg', 'png', 'webp'] as const;

const FORMATS = ['HEIC', 'HEIF', 'JPG', 'PNG', 'WebP', 'AVIF', 'GIF', 'BMP', 'TIFF', 'SVG', 'PDF', 'iPhone', 'Android', 'Windows', 'Mac', 'Chrome', 'Safari'];

const STEPS = [
  { icon: MousePointerClick, title: 'Pick a tool', text: 'Search above or choose from the list. Every tool opens instantly, with no account.' },
  { icon: Upload, title: 'Drop your photos', text: 'Add up to 20 files at once to the converters (10 for geotagging), straight from your phone or computer. iPhone HEIC included.' },
  { icon: Download, title: 'Download verified files', text: 'Each result is checked before you get it: GPS written, metadata gone, file really smaller.' },
];

const AUDIENCES = [
  { icon: Building2, title: 'Local businesses', text: 'Prepare storefront and work photos with the right location before posting them to your Google Business Profile or website.', tools: ['geotag', 'image-compressor'] },
  { icon: Megaphone, title: 'SEO & marketing agencies', text: 'Geotag client photos in batches, compress images for faster sites and convert formats without installing software.', tools: ['geotag', 'jpg-to-webp'] },
  { icon: HomeIcon, title: 'Real estate & contractors', text: 'Record where every property or job photo was taken, and strip locations before sharing photos publicly.', tools: ['photo-location-finder', 'remove-exif'] },
  { icon: Camera, title: 'Photographers & travellers', text: 'Read camera settings, check where a photo was taken and add locations to photos from cameras without GPS.', tools: ['exif-viewer', 'geotag'] },
  { icon: Lock, title: 'Privacy-conscious people', text: 'Remove hidden GPS coordinates and personal details from photos before selling, posting or sending them.', tools: ['remove-exif', 'exif-viewer'] },
  { icon: Globe2, title: 'Website owners', text: 'Turn heavy JPG and PNG images into small WebP files and fix iPhone uploads that won’t open.', tools: ['jpg-to-webp', 'heic-to-jpg'] },
];

const COMPARE = [
  { label: 'Price', us: 'Free, no limits on browser tools', them: 'Free trial, then subscription' },
  { label: 'Sign-up', us: 'None', them: 'Email or account required' },
  { label: 'Your files', us: 'Most tools never upload them', them: 'Usually uploaded to their servers' },
  { label: 'Watermark', us: 'Never', them: 'Often on free plans' },
  { label: 'Batch processing', us: '20 files (10 for geotagging)', them: 'Often 1 file on free plans' },
  { label: 'iPhone HEIC', us: 'Supported everywhere', them: 'Often missing or paid' },
  { label: 'Languages', us: `${LANGUAGES.length}, written natively`, them: 'English, or machine-translated' },
];

const FAQS = [
  { q: 'Are PinPixl tools really free?', a: 'Yes. Every tool is free with no account, no watermark and no paid plan. The browser-based tools have no usage limits.' },
  { q: 'Are my photos uploaded to your server?', a: 'Most tools run entirely in your browser, so your photos never leave your device: the converters, EXIF Viewer, Photo Location Finder, Remove EXIF Data and JPG/WebP compression. The Geo Tagging Tool and PNG compression use our server, which processes files in memory and does not store them.' },
  { q: 'Can I use these tools on my phone?', a: 'Yes. All tools work in modern mobile browsers on iPhone and Android, including converting HEIC photos straight from your camera roll.' },
  { q: 'Does geotagging photos improve Google rankings?', a: 'Not directly. Google hasn’t confirmed image GPS data as a ranking factor, and Google Business Profile removes EXIF data from published photos. Geotagging helps keep location details accurate and consistent; real photos, good file names and alt text matter more for SEO.' },
  { q: 'Which image formats do you support?', a: 'You can open JPG, PNG, WebP, HEIC/HEIF, AVIF, GIF, BMP, TIFF and SVG, save as JPG, PNG or WebP, and combine images into a PDF.' },
  { q: 'Are the tools available in other languages?', a: `Yes. The geotag tool, the metadata tools, every format converter and the compressor are available in ${LANGUAGES.length} languages, written natively rather than machine-translated. The newest tools (image resizer, JPG to PDF and compress to an exact size) are in English for now.` },
];

/* ───────── Small building blocks ───────── */

function Eyebrow({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <p className={`mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] ${dark ? 'bg-white/10 text-blue-200 ring-1 ring-white/15' : 'bg-blue-50 text-blue-700 ring-1 ring-blue-100'}`}>
      {children}
    </p>
  );
}

function SectionHead({ eyebrow, title, sub, dark = false }: { eyebrow: string; title: React.ReactNode; sub?: string; dark?: boolean }) {
  return (
    <div className="mx-auto mb-14 max-w-3xl text-center">
      <Eyebrow dark={dark}>{eyebrow}</Eyebrow>
      <h2 className={`text-3xl font-extrabold tracking-tight md:text-[2.75rem] md:leading-[1.12] ${dark ? 'text-white' : 'text-slate-950'}`}>{title}</h2>
      {sub && <p className={`mt-4 text-lg ${dark ? 'text-slate-400' : 'text-slate-600'}`}>{sub}</p>}
    </div>
  );
}

function RunsBadge({ id }: { id: string }) {
  if (id === 'image-compressor')
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2 py-0.5 text-[11px] font-semibold text-sky-800 ring-1 ring-sky-200">
        <Cpu className="h-3 w-3" aria-hidden /> In your browser · PNG on server
      </span>
    );
  return SERVER_NOTE[id] ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-800 ring-1 ring-amber-200">
      <Server className="h-3 w-3" aria-hidden /> Uses our server
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-800 ring-1 ring-emerald-200">
      <Cpu className="h-3 w-3" aria-hidden /> Runs in your browser
    </span>
  );
}

function ToolCard({ t }: { t: ToolEntry }) {
  const tone = TONE[t.category];
  return (
    <Link
      href={t.path}
      className={`group relative flex flex-col rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/[0.06] ${tone.ring}`}
    >
      <span className={`inline-flex w-fit rounded-xl bg-gradient-to-br p-2.5 text-white shadow-lg ${tone.icon}`}>
        <ToolIcon name={t.icon} className="h-5 w-5" />
      </span>
      <h3 className="mt-4 flex items-center gap-1.5 font-bold text-slate-900 group-hover:text-blue-700">
        {t.name}
        <ArrowRight className="h-4 w-4 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" aria-hidden />
      </h3>
      <p className="mt-1 flex-1 text-sm leading-relaxed text-slate-600">{t.desc}</p>
      <span className="mt-4"><RunsBadge id={t.id} /></span>
    </Link>
  );
}

/* ───────── Page ───────── */

export default function Home() {
  const featured = TOOLS.filter((t) => t.inMenu && !isPair(t));
  const converters = TOOLS.filter(isPair);
  const geotag = toolById('geotag')!;
  const popular = POPULAR_SMALL.map(toolById).filter((t): t is ToolEntry => !!t);
  const browserTools = TOOLS.filter((t) => !SERVER_NOTE[t.id]);
  const serverTools = TOOLS.filter((t) => SERVER_NOTE[t.id]);
  const browserMain = browserTools.filter((t) => !isPair(t) && !(t.id.startsWith('compress-to-') && t.id !== 'compress-to-100kb') && t.id !== 'png-to-pdf');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${SITE}/#home`,
        name: 'PinPixl – Free Photo Tools',
        url: `${SITE}/`,
        inLanguage: 'en',
        isPartOf: { '@id': `${SITE}/#website` },
        mainEntity: {
          '@type': 'ItemList',
          name: 'PinPixl free photo tools',
          numberOfItems: TOOLS.length,
          itemListElement: TOOLS.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.name, url: `${SITE}${t.path}` })),
        },
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
          {/* Decoration lives in its own clipped layer so the search dropdown is never cut off. */}
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-map-grid opacity-[0.09]" style={{ maskImage: 'radial-gradient(ellipse at 30% 20%, black 20%, transparent 70%)', WebkitMaskImage: 'radial-gradient(ellipse at 30% 20%, black 20%, transparent 70%)' }} />
            <div className="absolute -top-40 start-[-10%] h-[34rem] w-[34rem] rounded-full bg-blue-600/35 blur-[120px]" />
            <div className="absolute top-20 end-[-12%] h-[30rem] w-[30rem] rounded-full bg-violet-600/30 blur-[120px]" />
            <div className="absolute bottom-[-12rem] start-1/3 h-[24rem] w-[40rem] rounded-full bg-cyan-500/15 blur-[120px]" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 pb-28 pt-14 sm:px-6 md:pb-36 md:pt-20 lg:px-8">
            <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
              <div className="animate-rise text-center lg:text-start">
                <p className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 py-1.5 pe-4 ps-1.5 text-sm font-medium text-slate-200 backdrop-blur">
                  <span className="rounded-full bg-gradient-to-r from-blue-500 to-violet-500 px-2.5 py-0.5 text-xs font-bold text-white">{TOOLS.length} tools</span>
                  Free forever · no sign-up · no watermark
                </p>
                <h1 className="text-[2.6rem] font-extrabold leading-[1.04] tracking-tight sm:text-6xl lg:text-[4.1rem]">
                  Every photo tool you need.{' '}
                  <span className="bg-gradient-to-r from-sky-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">Free and private.</span>
                </h1>
                <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-300 md:text-xl lg:mx-0">
                  Geotag photos, view and remove EXIF data, convert HEIC, WebP and JPG to PDF, resize images and compress them to an exact size. Most tools never upload your files.
                </p>
                <div className="mt-9 lg:max-w-xl">
                  <ToolFinder tools={TOOLS} dark />
                </div>
                <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-300 lg:justify-start">
                  {['No account needed', 'Works on iPhone & Android', `${LANGUAGES.length} languages`].map((s) => (
                    <li key={s} className="inline-flex items-center gap-1.5">
                      <Check className="h-4 w-4 text-emerald-400" aria-hidden /> {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="animate-rise px-2 [animation-delay:150ms] sm:px-6 lg:px-0">
                <HomeVisual />
              </div>
            </div>
          </div>
        </section>

        {/* ───────── Stats card (true numbers only) ───────── */}
        <section className="relative z-10 -mt-16 px-4 sm:px-6">
          <div className="mx-auto grid max-w-6xl grid-cols-2 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10 md:grid-cols-4">
            {[
              { n: TOOLS.length, l: 'free tools', icon: Layers },
              { n: browserTools.length, l: 'run fully in your browser', icon: Cpu },
              { n: LANGUAGES.length, l: 'languages, written natively', icon: Languages },
              { n: 0, l: 'photos stored on our servers', icon: ShieldCheck },
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

        {/* ───────── Formats marquee ───────── */}
        <section className="py-12" aria-label="Supported formats and devices">
          <p className="mb-5 text-center text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Works with the formats and devices you already use</p>
          <div className="mask-fade-x overflow-hidden">
            <ul className="animate-marquee flex w-max gap-3">
              {[...FORMATS, ...FORMATS].map((f, i) => (
                <li key={i} aria-hidden={i >= FORMATS.length} className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-2.5 font-display text-base font-bold text-slate-500">
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ───────── Popular (bento) ───────── */}
        <section className="pb-20 pt-8 md:pb-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <Eyebrow><Star className="h-3.5 w-3.5" aria-hidden /> Most popular</Eyebrow>
                <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 md:text-[2.75rem] md:leading-[1.12]">What people use PinPixl for</h2>
              </div>
              <a href="#tools" className="inline-flex items-center gap-1 text-sm font-bold text-blue-700 hover:underline">
                See all {TOOLS.length} tools <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
              {/* Hero card */}
              <Link
                href={geotag.path}
                className="group relative flex min-h-[22rem] flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 p-7 text-white shadow-xl shadow-indigo-900/20 md:col-span-2 lg:row-span-2 lg:p-9"
              >
                <span aria-hidden className="absolute inset-0 bg-map-grid opacity-20" />
                <span aria-hidden className="absolute -end-16 -top-16 h-72 w-72 rounded-full bg-blue-500/40 blur-3xl" />
                {/* pin illustration */}
                <span aria-hidden className="absolute bottom-10 end-10 hidden sm:block">
                  <span className="absolute -inset-6 rounded-full bg-blue-400/25 animate-ping-soft" />
                  <span className="relative flex h-20 w-20 rotate-45 items-center justify-center rounded-full rounded-br-none bg-gradient-to-br from-blue-500 to-indigo-600 shadow-2xl shadow-blue-500/50 ring-8 ring-white/10">
                    <MapPin className="h-9 w-9 -rotate-45" />
                  </span>
                </span>
                <span className="relative">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400 px-3 py-1 text-xs font-extrabold text-amber-950">
                    <Sparkles className="h-3.5 w-3.5" aria-hidden /> #1 tool
                  </span>
                  <h3 className="mt-6 text-3xl font-extrabold leading-tight md:text-4xl">{geotag.name}</h3>
                  <p className="mt-3 max-w-md text-lg leading-relaxed text-blue-100/85">{geotag.desc}</p>
                  <ul className="mt-6 grid max-w-md gap-2 text-sm text-blue-100">
                    {['Search any street address or landmark', 'Batch up to 10 photos, HEIC included', 'Every file read back to verify the GPS'].map((s) => (
                      <li key={s} className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" aria-hidden /> {s}</li>
                    ))}
                  </ul>
                </span>
                <span className="relative mt-8 inline-flex w-fit items-center gap-2 rounded-xl bg-white px-5 py-3 font-bold text-indigo-700 shadow-lg transition-transform group-hover:-translate-y-0.5">
                  Geotag a photo <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                </span>
              </Link>

              {popular.map((t) => <ToolCard key={t.id} t={t} />)}
            </div>
          </div>
        </section>

        {/* ───────── How it works ───────── */}
        <section className="border-y border-slate-200/70 bg-slate-50 py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionHead eyebrow="How it works" title="Three steps. No account. No waiting." />
            <ol className="relative grid gap-6 md:grid-cols-3">
              <span aria-hidden className="absolute start-[16%] end-[16%] top-10 hidden border-t-2 border-dashed border-blue-200 md:block" />
              {STEPS.map((s, i) => (
                <li key={s.title} className="relative rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-sm">
                  <span className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-600/30">
                    <s.icon className="h-8 w-8" aria-hidden />
                    <span className="absolute -end-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white font-display text-sm font-extrabold text-blue-700 ring-4 ring-slate-50">{i + 1}</span>
                  </span>
                  <h3 className="mt-6 text-xl font-bold text-slate-950">{s.title}</h3>
                  <p className="mt-2 leading-relaxed text-slate-600">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ───────── Privacy (dark) ───────── */}
        <section className="relative overflow-hidden bg-slate-950 py-20 text-slate-300 md:py-28">
          <div aria-hidden className="absolute inset-0 bg-map-grid opacity-[0.06]" />
          <div aria-hidden className="absolute -top-40 start-1/2 h-80 w-[44rem] -translate-x-1/2 rounded-full bg-blue-600/25 blur-3xl rtl:translate-x-1/2" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div>
              <Eyebrow dark><Lock className="h-3.5 w-3.5" aria-hidden /> Privacy first</Eyebrow>
              <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-[2.75rem] md:leading-[1.12]">Your photos stay yours</h2>
              <p className="mt-4 text-lg leading-relaxed text-slate-400">
                {browserTools.length} of our {TOOLS.length} tools work inside your browser using WebAssembly and the browser’s own image engine, so the file never leaves your device. We tell you exactly which ones don’t.
              </p>
              <div className="mt-9 grid gap-5 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                {[
                  { icon: Cpu, title: 'On your device', text: 'Converters, EXIF tools and the location finder never upload anything.' },
                  { icon: ShieldCheck, title: 'Nothing stored', text: 'When our server is needed, files are handled in memory and discarded.' },
                  { icon: BadgeCheck, title: 'Verified results', text: 'Every output is read back to prove it worked, not just marked “done”.' },
                ].map((f) => (
                  <div key={f.title}>
                    <span className="inline-flex rounded-xl bg-emerald-400/15 p-2.5 ring-1 ring-emerald-400/30">
                      <f.icon className="h-5 w-5 text-emerald-400" aria-hidden />
                    </span>
                    <h3 className="mt-3 font-bold text-white">{f.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-400">{f.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Where your files go */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur md:p-8">
              <p className="text-sm font-bold uppercase tracking-wider text-slate-400">Where your files go</p>
              <div className="mt-5 rounded-2xl border border-emerald-400/25 bg-emerald-400/[0.06] p-5">
                <p className="flex items-center gap-2 font-bold text-white">
                  <Smartphone className="h-5 w-5 text-emerald-400" aria-hidden /> Stays on your device
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {browserMain.map((t) => (
                    <li key={t.id}>
                      <Link href={t.path} className="inline-flex rounded-full bg-white/10 px-3 py-1.5 text-sm font-medium text-slate-100 hover:bg-white/20">{t.name}</Link>
                    </li>
                  ))}
                  <li><a href="#tools" className="inline-flex rounded-full bg-white/10 px-3 py-1.5 text-sm font-medium text-slate-100 hover:bg-white/20">+ {converters.length} format converters</a></li>
                </ul>
              </div>
              <div className="mt-4 rounded-2xl border border-amber-300/25 bg-amber-300/[0.05] p-5">
                <p className="flex items-center gap-2 font-bold text-white">
                  <Server className="h-5 w-5 text-amber-300" aria-hidden /> Uses our server, never stored
                </p>
                <ul className="mt-4 space-y-2.5">
                  {serverTools.map((t) => (
                    <li key={t.id} className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-2">
                      <Link href={t.path} className="shrink-0 text-sm font-semibold text-slate-100 hover:underline">{t.name}</Link>
                      <span className="text-sm text-slate-400">{SERVER_NOTE[t.id]}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ───────── All tools by category ───────── */}
        <section id="tools" className="scroll-mt-20 py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHead eyebrow="All tools" title={`${TOOLS.length} free tools, grouped by job`} sub="Pick what you want to do. Every tool is free, with no limits on the browser-based ones." />
            <div className="space-y-6">
              {(['location', 'convert', 'optimize'] as ToolCategory[]).map((cat) => {
                const list = featured.filter((t) => t.category === cat);
                if (!list.length) return null;
                const tone = TONE[cat];
                return (
                  <div key={cat} className="grid gap-6 rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50/80 p-6 md:p-8 lg:grid-cols-[250px_1fr] lg:gap-10">
                    <div>
                      <span className={`inline-flex rounded-2xl bg-gradient-to-br p-3 text-white shadow-lg ${tone.icon}`}>
                        {cat === 'location' ? <MapPin className="h-6 w-6" aria-hidden /> : cat === 'convert' ? <Layers className="h-6 w-6" aria-hidden /> : <Zap className="h-6 w-6" aria-hidden />}
                      </span>
                      <h3 className="mt-4 text-2xl font-extrabold text-slate-950">{CATEGORY_LABEL[cat]}</h3>
                      <p className="mt-2 leading-relaxed text-slate-600">{CATEGORY_INTRO[cat]}</p>
                    </div>
                    <div>
                      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {list.map((t) => <ToolCard key={t.id} t={t} />)}
                      </div>
                      {cat === 'convert' && (
                        <ul className="mt-5 flex flex-wrap gap-2" aria-label="All conversions">
                          {converters.map((t) => (
                            <li key={t.id}>
                              <Link href={t.path} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:text-sky-800">
                                <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden /> {t.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ───────── Converter matrix ───────── */}
        <section className="border-y border-slate-200/70 bg-slate-50 py-20 md:py-28">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.25fr] lg:px-8">
            <div data-reveal>
              <Eyebrow><Layers className="h-3.5 w-3.5" aria-hidden /> Converters</Eyebrow>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 md:text-[2.75rem] md:leading-[1.12]">
                Pick a row. <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">Pick a column.</span>
              </h2>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-slate-600">
                {converters.length} one-click converters, almost all running in your browser. iPhone photos open everywhere, heavy PNGs shrink to WebP, old BMP and TIFF files become JPGs, and logos become PNGs at any size.
              </p>
              <Link href="/image-converter" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 font-bold text-white shadow-lg shadow-blue-600/25 transition-all hover:-translate-y-0.5">
                Convert any format <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
            <div data-reveal style={{ ['--d' as string]: '150ms' }} className="overflow-x-auto">
              <table className="w-full min-w-[440px] overflow-hidden rounded-3xl border border-slate-200 bg-white text-start shadow-xl shadow-slate-900/[0.06]">
                <caption className="sr-only">Image format converters: rows are the format you have, columns the format you get</caption>
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                    <th scope="col" className="px-4 py-3.5 text-start text-xs font-semibold uppercase tracking-wider text-blue-100">From ↓ / To →</th>
                    {MATRIX_TO.map((t) => (
                      <th key={t} scope="col" className="px-4 py-3.5 text-center text-sm font-bold">{FORMAT_LABEL[t]}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {MATRIX_FROM.map((f) => (
                    <tr key={f} className="transition-colors hover:bg-blue-50/40">
                      <th scope="row" className="px-4 py-3 text-start text-sm font-bold text-slate-900">{FORMAT_LABEL[f]}</th>
                      {MATRIX_TO.map((t) => {
                        const tool = toolById(`${f}-to-${t}`);
                        return (
                          <td key={t} className="p-1.5 text-center">
                            {tool ? (
                              <Link href={tool.path} className="inline-flex w-full items-center justify-center gap-1 rounded-xl px-2 py-2 text-sm font-semibold text-blue-700 transition hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 hover:text-white" title={tool.name}>
                                {tool.name} <ArrowRight className="h-3.5 w-3.5 opacity-60" aria-hidden />
                              </Link>
                            ) : (
                              <span className="text-slate-300" aria-label={f === t ? 'same format' : 'not available'}>{f === t ? '—' : '·'}</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ───────── Who it's for ───────── */}
        <section className="border-y border-slate-200/70 bg-slate-50 py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHead eyebrow="Who it’s for" title="Built for people who work with photos" />
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {AUDIENCES.map((a) => (
                <div key={a.title} className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 transition-shadow hover:shadow-xl hover:shadow-slate-900/[0.06]">
                  <a.icon aria-hidden className="absolute -bottom-6 -end-6 h-32 w-32 text-slate-100 transition-colors group-hover:text-blue-50" />
                  <div className="relative flex flex-1 flex-col">
                    <span className="inline-flex w-fit rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-3 text-white shadow-lg shadow-blue-500/25"><a.icon className="h-6 w-6" aria-hidden /></span>
                    <h3 className="mt-5 text-lg font-bold text-slate-950">{a.title}</h3>
                    <p className="mt-2 flex-1 leading-relaxed text-slate-600">{a.text}</p>
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {a.tools.map(toolById).filter((t): t is ToolEntry => !!t).map((t) => (
                        <li key={t.id}>
                          <Link href={t.path} className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 hover:bg-blue-100">
                            {t.name} <ArrowRight className="h-3 w-3" aria-hidden />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ───────── Comparison ───────── */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <SectionHead eyebrow="Compare" title="PinPixl vs typical online photo tools" sub="What you usually get elsewhere, and what you get here." />
            <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-2xl shadow-slate-900/[0.07]">
              <div className="grid grid-cols-[0.9fr_1.2fr_1.2fr] bg-slate-50 text-sm font-bold text-slate-700">
                <div className="px-3 py-4 sm:px-6" />
                <div className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-4 text-white sm:px-6">
                  <MapPin className="h-4 w-4" aria-hidden /> PinPixl
                </div>
                <div className="px-3 py-4 sm:px-6">Typical tools</div>
              </div>
              {COMPARE.map((r, i) => (
                <div key={r.label} className={`grid grid-cols-[0.9fr_1.2fr_1.2fr] text-[13px] sm:text-sm ${i % 2 ? 'bg-white' : 'bg-slate-50/50'}`}>
                  <div className="px-3 py-4 font-semibold text-slate-900 sm:px-6">{r.label}</div>
                  <div className="flex items-start gap-2 bg-blue-50/60 px-3 py-4 font-medium text-slate-800 sm:px-6">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden /> {r.us}
                  </div>
                  <div className="flex items-start gap-2 px-3 py-4 text-slate-500 sm:px-6">
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" aria-hidden /> {r.them}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ───────── Languages ───────── */}
        <section className="pb-20 md:pb-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-blue-50/50 to-indigo-50/70 p-8 md:p-12">
              <Globe2 aria-hidden className="absolute -bottom-16 -end-16 h-72 w-72 text-blue-100/80" />
              <div className="relative grid items-center gap-8 md:grid-cols-[1fr_1.4fr]">
                <div>
                  <span className="inline-flex rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 p-3 text-white shadow-lg shadow-blue-600/25"><Languages className="h-6 w-6" aria-hidden /></span>
                  <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-slate-950 md:text-3xl">Written for {LANGUAGES.length} markets, not translated</h2>
                  <p className="mt-3 leading-relaxed text-slate-600">Each language is written natively, with the words people there actually search for: Marktplaats tips in Dutch, メルカリ in Japanese, Haraj in Arabic.</p>
                </div>
                <ul className="flex flex-wrap gap-2">
                  {LANGUAGES.map((l) => (
                    <li key={l.code}>
                      <Link
                        href={l.code === 'en' ? '/' : `/${l.code}`}
                        hrefLang={l.code}
                        lang={l.code}
                        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-px hover:border-blue-300 hover:text-blue-700"
                      >
                        <span className="text-[10px] font-extrabold uppercase text-slate-400">{l.code}</span> {l.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div data-reveal className="relative mt-10 rounded-2xl border border-slate-200 bg-white/80 p-3 shadow-sm backdrop-blur sm:p-6">
                <DottedWorld pins={PINS} routes={ROUTES} className="h-auto w-full text-blue-300/70" />
              </div>
            </div>
          </div>
        </section>

        {/* ───────── FAQ ───────── */}
        <section id="faq" className="scroll-mt-20 border-t border-slate-200/70 bg-slate-50 py-20 md:py-28">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Eyebrow>FAQ</Eyebrow>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 md:text-4xl">Questions & answers</h2>
              <p className="mt-4 text-slate-600">Everything about how PinPixl handles your photos.</p>
              <Link href="/contact" className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-blue-700 hover:underline">
                Still have a question? Contact us <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
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

        {/* ───────── Final CTA ───────── */}
        <section className="py-20 md:py-24">
          <div className="mx-auto max-w-6xl px-4">
            <div className="relative overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-14 text-center text-white shadow-2xl shadow-indigo-900/30 md:px-16 md:py-20">
              <div aria-hidden className="absolute inset-0 bg-map-grid opacity-[0.12]" />
              <div aria-hidden className="absolute -start-20 -top-24 h-80 w-80 rounded-full bg-blue-600/50 blur-3xl" />
              <div aria-hidden className="absolute -bottom-24 -end-20 h-80 w-80 rounded-full bg-violet-600/45 blur-3xl" />
              <div className="relative">
                <h2 className="mx-auto max-w-3xl text-3xl font-extrabold tracking-tight md:text-5xl md:leading-[1.1]">
                  Fix your photos in seconds.{' '}
                  <span className="bg-gradient-to-r from-sky-300 to-violet-300 bg-clip-text text-transparent">Free, no sign-up.</span>
                </h2>
                <p className="mx-auto mt-5 max-w-xl text-lg text-slate-300">Add an exact GPS location, convert an iPhone photo or shrink an image, right now, in your browser.</p>
                <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Link href="/free-geo-tagging-tool" className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-4 font-bold text-indigo-700 shadow-lg transition-all hover:-translate-y-0.5 hover:bg-blue-50">
                    <MapPin className="h-5 w-5" aria-hidden /> Geotag a photo
                  </Link>
                  <Link href="/heic-to-jpg" className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/5 px-7 py-4 font-semibold text-white backdrop-blur transition hover:bg-white/10">
                    Convert HEIC to JPG <ArrowRight className="h-5 w-5" aria-hidden />
                  </Link>
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
