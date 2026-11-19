import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, Bug, Lightbulb, Briefcase, ShieldCheck } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { FOUNDER, OG_IMAGE, SITE_URL } from '@/lib/site';

const TITLE = 'Contact PinPixl';
const DESC = 'Report a bug, suggest a tool or ask about SEO work. PinPixl is built by Ali Haider, and the fastest way to reach him is LinkedIn.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: `${SITE_URL}/contact` },
  openGraph: { title: TITLE, description: DESC, url: `${SITE_URL}/contact`, type: 'website', siteName: 'PinPixl', locale: 'en_US', images: [OG_IMAGE] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC, images: [OG_IMAGE.url] },
};

const REASONS = [
  { icon: Bug, title: 'Report a bug', text: 'Tell us which tool, what you expected and what happened. Your browser and device help a lot, and a screenshot is even better.' },
  { icon: Lightbulb, title: 'Suggest a tool', text: 'Missing a format, a language or a feature? The most-requested ideas are the ones that get built next.' },
  { icon: Briefcase, title: 'SEO work', text: `${FOUNDER.name} works as an SEO specialist. Share your website and what you want to improve.` },
];

export default function Contact() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    url: `${SITE_URL}/contact`,
    name: TITLE,
    description: DESC,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    mainEntity: { '@id': `${SITE_URL}/#founder` },
  };
  return (
    <div className="flex min-h-screen flex-col bg-paper font-sans text-ink">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header lang="en" />
      <main className="flex-grow">
        <section className="relative overflow-hidden border-b border-ink">
          <div aria-hidden className="anim-drift absolute -end-40 -top-24 h-[600px] w-[600px] topo" />
          <div className="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 md:py-24">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-ink-3"><span className="text-pin">●</span> Contact</p>
            <h1 className="mt-5 text-5xl font-extrabold leading-[1] tracking-[-0.04em] md:text-7xl">
              Talk to the person <em className="font-serif font-normal italic tracking-normal text-pin">who built it.</em>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-2 md:text-xl">
              PinPixl is built and maintained by {FOUNDER.name}. There is no support queue or ticket system, so messages reach him directly. LinkedIn is the fastest way.
            </p>
            <a
              href={FOUNDER.linkedin}
              target="_blank"
              rel="me noopener noreferrer"
              className="press mt-9 inline-flex items-center gap-2 rounded-md border border-ink bg-ink px-6 py-3.5 font-bold text-paper shadow-hard"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
              </svg>
              Message {FOUNDER.name} on LinkedIn <ArrowUpRight className="h-4 w-4" aria-hidden />
            </a>
          </div>
        </section>

        <section className="border-b border-ink py-16 md:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <h2 className="text-3xl font-extrabold tracking-[-0.03em] md:text-4xl">What can we help with?</h2>
            <div className="mt-10 grid border-s border-t border-ink md:grid-cols-3">
              {REASONS.map((r) => (
                <div key={r.title} className="border-b border-e border-ink bg-paper p-7">
                  <r.icon className="h-6 w-6 text-pin" aria-hidden />
                  <h3 className="mt-4 text-xl font-extrabold">{r.title}</h3>
                  <p className="mt-2 leading-relaxed text-ink-2">{r.text}</p>
                </div>
              ))}
            </div>
            <p className="mt-10 flex items-start gap-3 rounded-sm border border-rule bg-paper-2/60 p-5 leading-relaxed text-ink-2">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-moss" aria-hidden />
              <span>
                Please don’t send private photos unless they are needed to reproduce a bug. If you do, remove the location first with{' '}
                <Link href="/remove-exif-data" className="font-bold text-ink underline decoration-pin decoration-2 underline-offset-2">Remove EXIF Data</Link>.
              </span>
            </p>
          </div>
        </section>
      </main>
      <Footer lang="en" />
    </div>
  );
}
