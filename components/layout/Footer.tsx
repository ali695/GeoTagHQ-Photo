import Link from 'next/link';
import BrandLogo from './BrandLogo';
import { LANGUAGES } from '@/lib/constants';
import { toolHref, uiStrings } from '@/lib/tools';
import { availableTools, toolText, TOOL_LANGS } from '@/lib/i18n';
import ToolIcon from './ToolIcon';

export default function Footer({ lang = 'en', messages }: { lang?: string; messages?: any }) {
  const ui = uiStrings(lang);
  const toolLink = toolHref(lang, '/free-geo-tagging-tool');
  const c = messages?.common || {};

  const heading = 'text-white font-semibold mb-4 text-sm';
  const link = 'text-slate-400 hover:text-white transition-colors';

  return (
    <footer className="relative overflow-hidden bg-slate-950 text-slate-400">
      <div aria-hidden className="pointer-events-none absolute -top-40 start-1/2 h-80 w-[48rem] -translate-x-1/2 rtl:translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />
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
                      <ToolIcon name={t.icon} className="w-4 h-4 text-blue-400" />
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
              <li><Link href={`${toolLink}#faq`} className={link}>FAQ</Link></li>
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

        <div className="mt-14 pt-8 border-t border-slate-800 flex flex-col-reverse gap-6 md:flex-row md:items-center md:justify-between">
          <p className="text-sm">&copy; {new Date().getFullYear()} PinPixl. {c.allRightsReserved || 'All rights reserved.'}</p>
          <ul className="flex flex-wrap gap-x-4 gap-y-2" aria-label="Languages">
            {LANGUAGES.map((l) => (
              <li key={l.code}>
                <Link
                  href={toolHref(l.code, '/free-geo-tagging-tool')}
                  hrefLang={l.code}
                  className={`text-xs transition-colors ${l.code === lang ? 'text-white font-semibold' : 'text-slate-500 hover:text-white'}`}
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
