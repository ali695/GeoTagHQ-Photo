import Link from 'next/link';
import BrandLogo from './BrandLogo';
import { LANGUAGES } from '@/lib/constants';
import { toolHref, uiStrings } from '@/lib/tools';
import { availableTools, toolText, TOOL_LANGS } from '@/lib/i18n';
import ToolIcon from './ToolIcon';
import { FOUNDER } from '@/lib/site';
import { getMessages } from '@/lib/messages';

export default async function Footer({ lang = 'en', messages }: { lang?: string; messages?: any }) {
  const ui = uiStrings(lang);
  const toolLink = toolHref(lang, '/free-geo-tagging-tool');
  const c = (messages ?? (await getMessages(lang)))?.common || {};

  const heading = 'mb-4 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-pin';
  const link = 'text-paper/70 hover:text-paper transition-colors';

  return (
    <footer className="relative overflow-hidden border-t border-ink bg-ink text-paper/60">
      <div aria-hidden className="pointer-events-none absolute inset-0 topo opacity-40 invert" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-10">
          <div className="col-span-2 md:col-span-5">
            <Link href={lang === 'en' ? '/' : TOOL_LANGS.includes(lang) ? `/${lang}` : toolLink} className="inline-flex mb-5 hover:opacity-90 transition-opacity" aria-label="PinPixl home">
              <BrandLogo dark size="lg" />
            </Link>
            <p className="text-sm leading-relaxed max-w-sm">
              {c.footerDesc ||
                'Free photo tools to geotag photos, read and remove EXIF data, convert iPhone HEIC and WebP, and compress images. No sign-up, no watermark, and most tools never upload your files.'}
            </p>
          </div>

          <div className="col-span-2 md:col-span-3">
            <h2 className={heading}>{ui.tools}</h2>
            <ul className="space-y-3 text-sm">
              {availableTools(lang)
                .filter((t) => t.inMenu)
                .map((t) => (
                  <li key={t.id}>
                    <Link href={toolHref(lang, t.path)} className={`${link} inline-flex items-center gap-2`}>
                      <ToolIcon name={t.icon} className="w-4 h-4 text-paper/40" />
                      {toolText(t, lang, { name: ui.geotagName, desc: ui.geotagDesc }).name}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h2 className={heading}>{ui.resources}</h2>
            <ul className="space-y-3 text-sm">
              <li><Link href={`${toolLink}#how-it-works`} className={link}>{c.howItWorks || 'How It Works'}</Link></li>
              <li><Link href={`${toolLink}#faq`} className={link}>{c.faq || 'FAQ'}</Link></li>
              <li><Link href="/about" className={link}>{c.about || 'About'}</Link></li>
              <li><Link href="/contact" className={link}>{c.contact || 'Contact'}</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h2 className={heading}>{c.legal || 'Legal'}</h2>
            <ul className="space-y-3 text-sm">
              <li><Link href="/privacy-policy" className={link}>{c.privacy || 'Privacy Policy'}</Link></li>
              <li><Link href="/terms" className={link}>{c.terms || 'Terms of Service'}</Link></li>
              <li><Link href="/disclaimer" className={link}>{c.disclaimer || 'Disclaimer'}</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-paper/15 flex flex-col-reverse gap-6 md:flex-row md:items-center md:justify-between">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} PinPixl. {c.allRightsReserved || 'All rights reserved.'}{' '}
            <span className="text-paper/40">·</span>{' '}
            <Link href="/about" className="font-semibold text-paper/80 hover:text-paper">{FOUNDER.name}</Link>{' '}
            <a href={FOUNDER.linkedin} target="_blank" rel="me noopener noreferrer" aria-label={`${FOUNDER.name} on LinkedIn`} className="inline-flex align-[-2px] text-paper/50 hover:text-pin">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" /></svg>
            </a>
          </p>
          <ul className="flex flex-wrap gap-x-4 gap-y-2" aria-label="Languages">
            {LANGUAGES.map((l) => (
              <li key={l.code}>
                <Link
                  href={toolHref(l.code, '/free-geo-tagging-tool')}
                  hrefLang={l.code}
                  className={`text-xs transition-colors ${l.code === lang ? 'text-paper font-semibold' : 'text-paper/50 hover:text-paper'}`}
                >
                  {l.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
