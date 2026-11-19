import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, ArrowRight, Check, X, Plus, Cpu, Server } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ToolIcon from '@/components/layout/ToolIcon';
import ToolFinder from '@/components/home/ToolFinder';
import HomeVisual from '@/components/home/HomeVisual';
import DottedWorld, { type Pin } from '@/components/home/DottedWorld';
import NumberTicker from '@/components/motion/NumberTicker';
import DecodeText from '@/components/motion/DecodeText';
import Scribble from '@/components/motion/Scribble';
import { CATEGORY_LABEL, FORMAT_LABEL, TOOLS, toolById, type ToolCategory, type ToolEntry } from '@/lib/tools';
import { LANGUAGES } from '@/lib/constants';
import { OG_IMAGE, SITE_URL } from '@/lib/site';

const SITE = SITE_URL;

export const metadata: Metadata = {
  title: { absolute: 'PinPixl – Free Photo Tools: Geotag, EXIF Viewer & Image Converter' },
  description:
    'Free photo tools: geotag photos, view and remove EXIF data, find where a photo was taken, convert HEIC to JPG and WebP, and compress images. No sign-up.',
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
  twitter: { card: 'summary_large_image', images: [OG_IMAGE.url] },
};

/* ───────── Content ───────── */

const CATEGORY_INTRO: Record<ToolCategory, string> = {
  location: 'Add, read, find and remove the location and metadata hidden inside photos.',
  convert: 'Change formats in your browser, iPhone HEIC included.',
  optimize: 'Make images lighter so pages load faster and uploads go through.',
};

/** Tools that send something to our server; everything else runs fully in the browser. */
const SERVER_NOTE: Record<string, string> = {
  geotag: 'Writes GPS on our server, in memory only',
  'image-compressor': 'PNG mode only; JPG & WebP stay in your browser',
  'lat-long-finder': 'Sends only the address you search, never a photo',
  'ai-alt-text': 'Sends the image to an AI model',
};

/** One pin per language market; the label links to that language's tools. */
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

/** Dashed routes between markets on the language map. */
const ROUTES: Array<[string, string]> = [['EN', 'DE'], ['EN', 'PT'], ['DE', 'TR'], ['TR', 'HI'], ['HI', 'ID'], ['ID', 'JA'], ['JA', 'KO'], ['FR', 'AR']];

const MATRIX_FROM = ['heic', 'webp', 'jpg', 'png', 'avif', 'svg'] as const;
const MATRIX_TO = ['jpg', 'png', 'webp'] as const;

const STEPS = [
  { title: 'Pick a tool', text: 'Search above or choose from the index. Every tool opens instantly, with no account.' },
  { title: 'Drop your photos', text: 'Up to 20 files at once, straight from your phone or computer. iPhone HEIC included.' },
  { title: 'Download verified files', text: 'Each result is read back before you get it: GPS written, metadata gone, file really smaller.' },
];

const AUDIENCES = [
  { title: 'Local businesses', text: 'Prepare storefront and work photos with the right location before they go on your Google Business Profile or website.', tools: ['geotag', 'image-compressor'] },
  { title: 'SEO & marketing agencies', text: 'Geotag client photos in batches, compress images for faster sites and convert formats without installing software.', tools: ['geotag', 'jpg-to-webp'] },
  { title: 'Real estate & contractors', text: 'Record where every property or job photo was taken, and strip locations before sharing photos publicly.', tools: ['photo-location-finder', 'remove-exif'] },
  { title: 'Photographers & travellers', text: 'Read camera settings, check where a photo was taken and add locations to photos from cameras without GPS.', tools: ['exif-viewer', 'geotag'] },
  { title: 'Privacy-conscious people', text: 'Remove hidden GPS coordinates and personal details before selling, posting or sending photos.', tools: ['remove-exif', 'exif-viewer'] },
  { title: 'Website owners', text: 'Turn heavy JPG and PNG images into small WebP files and fix iPhone uploads that won’t open.', tools: ['jpg-to-webp', 'heic-to-jpg'] },
];

const COMPARE = [
  { label: 'Price', us: 'Free, no limits on browser tools', them: 'Free trial, then subscription' },
  { label: 'Sign-up', us: 'None', them: 'Email or account required' },
  { label: 'Your files', us: 'Most tools never upload them', them: 'Usually uploaded to their servers' },
  { label: 'Watermark', us: 'Never', them: 'Often on free plans' },
  { label: 'Batch', us: 'Up to 20 files', them: 'Often 1 file on free plans' },
  { label: 'iPhone HEIC', us: 'Supported everywhere', them: 'Often missing or paid' },
  { label: 'Languages', us: `${LANGUAGES.length}, written natively`, them: 'English, or machine-translated' },
];

const FAQS = [
  { q: 'Are PinPixl tools really free?', a: 'Yes. Every tool is free with no account, no watermark and no paid plan. The browser-based tools have no usage limits.' },
  { q: 'Are my photos uploaded to your server?', a: 'Most tools run entirely in your browser, so your photos never leave your device: the converters, EXIF Viewer, Photo Location Finder, Remove EXIF Data and JPG/WebP compression. The Geo Tagging Tool and PNG compression use our server, which processes files in memory and does not store them.' },
  { q: 'Can I use these tools on my phone?', a: 'Yes. All tools work in modern mobile browsers on iPhone and Android, including converting HEIC photos straight from your camera roll.' },
  { q: 'Does geotagging photos improve Google rankings?', a: 'Not directly. Google hasn’t confirmed image GPS data as a ranking factor, and Google Business Profile removes EXIF data from published photos. Geotagging helps keep location details accurate and consistent; real photos, good file names and alt text matter more for SEO.' },
  { q: 'Which image formats do you support?', a: 'You can open JPG, PNG, WebP, HEIC/HEIF, AVIF, GIF and SVG, and save as JPG, PNG or WebP. Metadata tools also read TIFF.' },
  { q: 'Are the tools available in other languages?', a: `Yes. Every tool is available in ${LANGUAGES.length} languages, including German, Spanish, French, Portuguese, Turkish, Arabic, Hindi, Japanese and Korean, written natively for each language rather than machine-translated.` },
];

/* ───────── Building blocks ───────── */

/** Section label in the margin: "02 — The kit". */
function Label({ n, children, dark = false }: { n: string; children: React.ReactNode; dark?: boolean }) {
  return (
    <p className={`flex items-center gap-3 font-mono text-[11px] font-bold uppercase tracking-[0.18em] ${dark ? 'text-paper/60' : 'text-ink-3'}`}>
      <span className="text-pin">{n}</span>
      <span className={`h-px w-8 ${dark ? 'bg-paper/30' : 'bg-ink/30'}`} />
      {children}
    </p>
  );
}

function H2({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return <h2 className={`mt-4 text-4xl font-extrabold leading-[1.02] tracking-[-0.035em] md:text-[3.4rem] ${dark ? 'text-paper' : 'text-ink'}`}>{children}</h2>;
}

/** Serif italic accent inside headlines. */
const Em = ({ children }: { children: React.ReactNode }) => <em className="font-serif font-normal italic tracking-normal text-pin">{children}</em>;

function RunsTag({ id }: { id: string }) {
  if (id === 'image-compressor') return <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink-3">Browser · PNG on server</span>;
  return SERVER_NOTE[id] ? (
    <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-wider text-pin-2"><Server className="h-3 w-3" aria-hidden /> Uses server</span>
  ) : (
    <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-wider text-moss"><Cpu className="h-3 w-3" aria-hidden /> In your browser</span>
  );
}

/* ───────── Page ───────── */

export default function Home() {
  const main = TOOLS.filter((t) => !t.path.includes('-to-'));
  const converters = TOOLS.filter((t) => t.path.includes('-to-'));
  const browserTools = TOOLS.filter((t) => !SERVER_NOTE[t.id]);
  const serverTools = TOOLS.filter((t) => SERVER_NOTE[t.id]);
  const geotag = toolById('geotag')!;
  const pair = (f: string, t: string) => toolById(`${f}-to-${t}`);
  let n = 0;
  const num = () => String(++n).padStart(2, '0');

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
        about: 'Free online photo tools for geotagging, EXIF metadata, image conversion and compression',
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
    <div className="flex min-h-screen flex-col bg-paper font-sans text-ink">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header lang="en" />

      <main className="flex-grow">
        {/* ───────── Hero ───────── */}
        <section className="relative border-b border-ink">
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 paper-grain opacity-70" />
            <div className="anim-drift absolute -end-40 -top-20 h-[640px] w-[640px] topo" />
          </div>

          {/* coordinate strip */}
          <div className="relative border-b border-rule">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 overflow-hidden px-4 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-3 sm:px-6 lg:px-8">
              <span className="whitespace-nowrap"><span className="text-pin">●</span> <DecodeText text="N 30.2685° · W 97.7431°" delay={400} /></span>
              <span className="hidden whitespace-nowrap md:inline">A field kit for your photos</span>
              <span className="whitespace-nowrap">{TOOLS.length} tools · {LANGUAGES.length} languages · $0</span>
            </div>
          </div>

          <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 md:pb-24 md:pt-16 lg:px-8">
            <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_1fr] lg:gap-10">
              <div className="animate-rise">
                <h1 className="text-[2.9rem] font-extrabold leading-[0.98] tracking-[-0.045em] text-ink sm:text-6xl lg:text-[5.2rem]">
                  Free photo tools that know <Scribble><Em>where</Em></Scribble> your pictures have been.
                </h1>
                <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink-2 md:text-xl">
                  Geotag photos, view and remove EXIF data, find where a photo was taken, convert iPhone HEIC and WebP, and compress images. No sign-up, no watermark, and most tools never upload your files.
                </p>
                <div className="mt-9 max-w-xl">
                  <ToolFinder tools={TOOLS} dark />
                </div>
              </div>
              <div className="animate-rise px-2 [animation-delay:150ms] sm:px-8 lg:px-0">
                <HomeVisual />
              </div>
            </div>
          </div>

          {/* stats ledger */}
          <div className="relative border-t border-ink bg-paper">
            <dl className="mx-auto grid max-w-7xl grid-cols-2 px-4 sm:px-6 md:grid-cols-4 lg:px-8">
              {[
                [TOOLS.length, 'free tools, no limits'],
                [browserTools.length, 'run fully in your browser'],
                [LANGUAGES.length, 'languages, written natively'],
                [0, 'photos stored on our servers'],
              ].map(([v, l], i) => (
                <div key={l as string} className={`py-6 ps-0 md:py-8 ${i ? 'md:border-s md:border-rule md:ps-8' : ''} ${i % 2 ? 'border-s border-rule ps-5 md:ps-8' : ''} ${i > 1 ? 'border-t border-rule md:border-t-0' : ''}`}>
                  <dt className="sr-only">{l as string}</dt>
                  <dd>
                    <NumberTicker value={v as number} className="block font-serif text-5xl leading-none text-ink md:text-6xl" />
                    <span className="mt-2 block font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-3">{l as string}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ───────── Format ticker ───────── */}
        <section className="overflow-hidden border-b border-ink bg-ink py-3 text-paper" aria-label="Supported formats and devices">
          <div className="mask-fade-x">
            <ul className="animate-marquee flex w-max items-center gap-8 font-mono text-sm font-bold uppercase tracking-[0.2em]">
              {[0, 1].map((k) =>
                ['HEIC', 'HEIF', 'JPG', 'PNG', 'WebP', 'AVIF', 'GIF', 'SVG', 'TIFF', 'iPhone', 'Android', 'Windows', 'Mac'].map((f) => (
                  <li key={`${k}-${f}`} aria-hidden={k === 1} className="flex items-center gap-8">
                    {f} <span className="text-pin">✦</span>
                  </li>
                )),
              )}
            </ul>
          </div>
        </section>

        {/* ───────── 01 The kit (index of tools) ───────── */}
        <section id="tools" className="scroll-mt-20 border-b border-ink py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div data-reveal className="grid gap-6 md:grid-cols-[1fr_1.4fr] md:items-end">
              <div>
                <Label n={num()}>The kit</Label>
                <H2>Everything in <Em>one</Em> drawer.</H2>
              </div>
              <p className="max-w-xl text-lg leading-relaxed text-ink-2 md:justify-self-end">
                Seven tools for location and metadata, plus a converter for every common format. Each one says plainly whether your file stays on your device.
              </p>
            </div>

            <ol data-reveal className="mt-14 border-t-2 border-ink">
              {main.map((t, i) => (
                <li key={t.id} className="stagger border-b border-ink" style={{ ['--i' as string]: i }}>
                  <Link href={t.path} className="group grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 py-5 transition-colors hover:bg-paper-2 md:grid-cols-[4rem_1.1fr_1.4fr_11rem_2rem] md:gap-6 md:py-6">
                    <span className="font-mono text-sm font-bold text-ink-3 group-hover:text-pin">{String(i + 1).padStart(2, '0')}</span>
                    <span className="flex items-center gap-3">
                      <ToolIcon name={t.icon} className="hidden h-5 w-5 shrink-0 text-ink md:block" />
                      <span className="text-xl font-extrabold tracking-[-0.02em] text-ink md:text-2xl">{t.name}</span>
                      {t.id === 'geotag' && <span className="rounded-sm bg-pin px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-white">Most used</span>}
                    </span>
                    <span className="col-span-3 col-start-2 text-ink-2 md:col-span-1 md:col-start-auto">{t.desc}</span>
                    <span className="col-span-3 col-start-2 md:col-span-1 md:col-start-auto"><RunsTag id={t.id} /></span>
                    <ArrowUpRight className="row-start-1 col-start-3 h-6 w-6 text-ink transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-pin md:col-start-auto md:row-start-auto rtl:-scale-x-100" aria-hidden />
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ───────── 02 Conversion matrix ───────── */}
        <section className="border-b border-ink bg-paper-2/60 py-20 md:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.25fr] lg:px-8">
            <div data-reveal>
              <Label n={num()}>Converters</Label>
              <H2>Pick a row. <Em>Pick</Em> a column.</H2>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-2">
                {converters.length} one-click converters, all running in your browser. iPhone photos open everywhere, heavy PNGs shrink to WebP, logos become PNGs at any size.
              </p>
              <Link href="/image-converter" className="press mt-8 inline-flex items-center gap-2 rounded-md border border-ink bg-paper px-5 py-3 font-bold text-ink shadow-hard-sm">
                Convert any format <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>

            <div data-reveal style={{ ['--d' as string]: '150ms' }} className="overflow-x-auto">
              <table className="matrix w-full min-w-[420px] border-collapse border-2 border-ink bg-paper text-start">
                <caption className="sr-only">Image format converters: rows are the format you have, columns the format you get</caption>
                <thead>
                  <tr className="bg-ink text-paper">
                    <th scope="col" className="border border-ink px-4 py-3 text-start font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-paper/60">From ↓ / To →</th>
                    {MATRIX_TO.map((t) => (
                      <th key={t} scope="col" className="border border-ink px-4 py-3 text-center font-mono text-sm font-bold uppercase tracking-wider">{FORMAT_LABEL[t]}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MATRIX_FROM.map((f) => (
                    <tr key={f}>
                      <th scope="row" className="border border-ink px-4 py-3 text-start font-mono text-sm font-bold uppercase tracking-wider text-ink">{FORMAT_LABEL[f]}</th>
                      {MATRIX_TO.map((t) => {
                        const tool = pair(f, t);
                        return (
                          <td key={t} className="border border-ink p-0 text-center">
                            {tool ? (
                              <Link href={tool.path} className="group flex h-full items-center justify-center gap-1.5 px-3 py-3.5 text-sm font-bold text-ink transition-colors hover:bg-pin hover:text-white" title={tool.name}>
                                {tool.name.replace(' Converter', '')}
                                <ArrowUpRight className="h-3.5 w-3.5 opacity-40 group-hover:opacity-100" aria-hidden />
                              </Link>
                            ) : (
                              <span className="block px-3 py-3.5 font-mono text-ink/25" aria-label={f === t ? 'same format' : 'not available'}>{f === t ? '—' : '·'}</span>
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

        {/* ───────── 03 Spotlight: geotag ───────── */}
        <section className="relative overflow-hidden border-b border-ink py-20 md:py-28">
          <div aria-hidden className="absolute -start-48 top-0 h-[640px] w-[640px] topo opacity-80" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div data-reveal>
              <Label n={num()}>Most used</Label>
              <H2>Put any photo <Em>on the map.</Em></H2>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-2">{geotag.desc}. Search any street address with Google Maps, drop up to 20 photos and download them with the GPS written in, checked and verified.</p>
              <ul className="mt-8 space-y-3">
                {['Exact street-level search, or click the map', 'Batch up to 20 photos, iPhone HEIC included', 'Every file read back to confirm the GPS', `Available in ${LANGUAGES.length} languages`].map((s) => (
                  <li key={s} className="flex items-start gap-3 text-ink">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-sm bg-ink text-paper"><Check className="h-3.5 w-3.5" aria-hidden /></span>
                    {s}
                  </li>
                ))}
              </ul>
              <Link href={geotag.path} className="press mt-10 inline-flex items-center gap-2 rounded-md border border-ink bg-pin px-6 py-3.5 text-lg font-bold text-white shadow-hard">
                Geotag a photo <ArrowRight className="h-5 w-5" aria-hidden />
              </Link>
            </div>

            {/* steps as a field notebook */}
            <ol data-reveal style={{ ['--d' as string]: '150ms' }} className="relative rounded-sm border-2 border-ink bg-paper shadow-hard">
              <li className="border-b border-ink px-6 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-ink-3">How it works · 3 steps · ~1 minute</li>
              {STEPS.map((s, i) => (
                <li key={s.title} className="stagger grid grid-cols-[4.5rem_1fr] border-b border-rule last:border-b-0" style={{ ['--i' as string]: i + 1 }}>
                  <span className="flex items-start justify-center border-e border-rule pt-5 font-serif text-5xl leading-none text-pin">{i + 1}</span>
                  <span className="px-6 py-6">
                    <span className="block text-lg font-extrabold text-ink">{s.title}</span>
                    <span className="mt-1 block leading-relaxed text-ink-2">{s.text}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ───────── 04 Privacy ledger (dark) ───────── */}
        <section className="relative overflow-hidden border-b border-ink bg-ink py-20 text-paper md:py-28">
          <div aria-hidden className="absolute inset-0 topo opacity-50 invert" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div data-reveal className="grid gap-6 md:grid-cols-[1fr_1.2fr] md:items-end">
              <div>
                <Label n={num()} dark>Privacy</Label>
                <H2 dark>Your photos <Em>stay</Em> yours.</H2>
              </div>
              <p className="max-w-xl text-lg leading-relaxed text-paper/70 md:justify-self-end">
                {browserTools.length} of {TOOLS.length} tools work inside your browser with WebAssembly and the browser’s own image engine. Here is exactly which ones don’t, and why.
              </p>
            </div>

            <div data-reveal className="mt-14 grid border border-paper/25 md:grid-cols-2">
              <div className="border-b border-paper/25 p-6 md:border-b-0 md:border-e md:p-8">
                <p className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[#9fd3a9]"><Cpu className="h-4 w-4" aria-hidden /> Stays on your device</p>
                <ul className="mt-6 divide-y divide-paper/10">
                  {browserTools.filter((t) => !t.path.includes('-to-')).map((t) => (
                    <li key={t.id}><Link href={t.path} className="flex items-center justify-between py-3 font-semibold text-paper hover:text-pin">{t.name}<ArrowUpRight className="h-4 w-4 opacity-50" aria-hidden /></Link></li>
                  ))}
                  <li><a href="#tools" className="flex items-center justify-between py-3 font-semibold text-paper hover:text-pin">+ {converters.length} format converters<ArrowUpRight className="h-4 w-4 opacity-50" aria-hidden /></a></li>
                </ul>
              </div>
              <div className="p-6 md:p-8">
                <p className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-pin"><Server className="h-4 w-4" aria-hidden /> Uses our server · never stored</p>
                <ul className="mt-6 divide-y divide-paper/10">
                  {serverTools.map((t) => (
                    <li key={t.id} className="py-3">
                      <Link href={t.path} className="font-semibold text-paper hover:text-pin">{t.name}</Link>
                      <span className="mt-0.5 block text-sm text-paper/60">{SERVER_NOTE[t.id]}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 border-t border-dashed border-paper/25 pt-5 text-sm leading-relaxed text-paper/60">
                  Files sent to our server are handled in memory and discarded right away. No copies, no logs of your data, no account to tie anything to.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ───────── 05 Languages map ───────── */}
        <section className="border-b border-ink py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div data-reveal className="grid gap-6 md:grid-cols-[1fr_1.2fr] md:items-end">
              <div>
                <Label n={num()}>Languages</Label>
                <H2>Written for <Em>{LANGUAGES.length}</Em> markets, not translated.</H2>
              </div>
              <p className="max-w-xl text-lg leading-relaxed text-ink-2 md:justify-self-end">
                Every tool exists natively in each language, with the words people there actually search for: Marktplaats tips in Dutch, メルカリ in Japanese, Haraj in Arabic.
              </p>
            </div>
            <div data-reveal className="mt-12 rounded-sm border-2 border-ink bg-paper p-3 shadow-hard sm:p-6">
              <DottedWorld pins={PINS} routes={ROUTES} className="h-auto w-full text-ink/30" />
            </div>
            <ul className="mt-8 grid grid-cols-2 gap-x-6 border-t border-ink sm:grid-cols-3 lg:grid-cols-5">
              {LANGUAGES.map((l) => (
                <li key={l.code} className="border-b border-rule">
                  <Link href={l.code === 'en' ? '/' : `/${l.code}`} hrefLang={l.code} lang={l.code} className="group flex items-center justify-between py-3">
                    <span className="font-semibold text-ink group-hover:text-pin">{l.name}</span>
                    <span className="font-mono text-[11px] font-bold uppercase text-ink-3">{l.code}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ───────── 06 Who it's for ───────── */}
        <section className="border-b border-ink bg-paper-2/60 py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div data-reveal>
              <Label n={num()}>Who it’s for</Label>
              <H2>Built for people who <Em>work</Em> with photos.</H2>
            </div>
            <div data-reveal className="mt-14 grid border-s border-t border-ink sm:grid-cols-2 lg:grid-cols-3">
              {AUDIENCES.map((a, i) => (
                <div key={a.title} className="stagger flex flex-col border-b border-e border-ink bg-paper p-7" style={{ ['--i' as string]: i }}>
                  <span className="font-mono text-[11px] font-bold text-pin">{String.fromCharCode(65 + i)}.</span>
                  <h3 className="mt-3 text-xl font-extrabold tracking-[-0.02em] text-ink">{a.title}</h3>
                  <p className="mt-2 flex-1 leading-relaxed text-ink-2">{a.text}</p>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {a.tools.map(toolById).filter((t): t is ToolEntry => !!t).map((t) => (
                      <li key={t.id}>
                        <Link href={t.path} className="inline-flex items-center gap-1 rounded-sm border border-ink px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-wide text-ink hover:bg-ink hover:text-paper">
                          {t.name} <ArrowUpRight className="h-3 w-3" aria-hidden />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ───────── 07 Comparison ───────── */}
        <section className="border-b border-ink py-20 md:py-28">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div data-reveal>
              <Label n={num()}>Compare</Label>
              <H2>PinPixl vs the <Em>usual</Em> online tools.</H2>
            </div>
            <div data-reveal className="mt-12 overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse text-start">
                <thead>
                  <tr className="border-b-2 border-ink">
                    <th scope="col" className="py-4 pe-4 text-start font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-ink-3" />
                    <th scope="col" className="bg-ink px-5 py-4 text-start font-mono text-xs font-bold uppercase tracking-[0.14em] text-paper">PinPixl</th>
                    <th scope="col" className="px-5 py-4 text-start font-mono text-xs font-bold uppercase tracking-[0.14em] text-ink-3">Typical tools</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARE.map((r) => (
                    <tr key={r.label} className="border-b border-rule">
                      <th scope="row" className="py-4 pe-4 text-start font-bold text-ink">{r.label}</th>
                      <td className="bg-paper-2/70 px-5 py-4 text-ink"><span className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-moss" aria-hidden />{r.us}</span></td>
                      <td className="px-5 py-4 text-ink-3"><span className="flex items-start gap-2"><X className="mt-0.5 h-4 w-4 shrink-0 text-pin" aria-hidden />{r.them}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ───────── 08 FAQ ───────── */}
        <section id="faq" className="scroll-mt-20 border-b border-ink py-20 md:py-28">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
            <div data-reveal className="lg:col-span-4">
              <Label n={num()}>FAQ</Label>
              <H2>Questions, <Em>answered.</Em></H2>
              <Link href="/contact" className="mt-6 inline-flex items-center gap-1 font-bold text-ink underline decoration-pin decoration-2 underline-offset-4 hover:text-pin-2">
                Still have one? Contact us <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
            <div data-reveal className="border-t-2 border-ink lg:col-span-8">
              {FAQS.map((f, i) => (
                <details key={f.q} open={i === 0} className="group border-b border-ink">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
                    <h3 className="text-lg font-extrabold tracking-[-0.01em] text-ink group-hover:text-pin-2 md:text-xl">{f.q}</h3>
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
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-4">
            <div data-reveal className="relative overflow-hidden rounded-sm border-2 border-ink bg-pin px-6 py-14 text-white shadow-[8px_8px_0_0_var(--color-ink)] md:px-14 md:py-20">
              <div aria-hidden className="anim-drift absolute -end-32 -top-32 h-[520px] w-[520px] topo opacity-70 invert" />
              <div className="relative max-w-3xl">
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-white/80">● Ready when you are</p>
                <h2 className="mt-5 text-4xl font-extrabold leading-[1.02] tracking-[-0.035em] md:text-6xl">
                  Fix your photos in seconds. <em className="font-serif font-normal italic tracking-normal">Free, no sign-up.</em>
                </h2>
                <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                  <Link href="/free-geo-tagging-tool" className="press inline-flex items-center justify-center gap-2 rounded-md border border-ink bg-paper px-7 py-4 font-bold text-ink shadow-hard">
                    Geotag a photo <ArrowRight className="h-5 w-5" aria-hidden />
                  </Link>
                  <Link href="/heic-to-jpg" className="inline-flex items-center justify-center gap-2 rounded-md border border-white/60 px-7 py-4 font-bold text-white hover:bg-white/10">
                    Convert HEIC to JPG
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
