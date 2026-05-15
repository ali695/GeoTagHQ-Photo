import Link from 'next/link';
import Image from 'next/image';
import { LANGUAGES } from '@/lib/constants';

export default function Footer({ lang = 'en', messages }: { lang?: string, messages?: any }) {
  const toolLink = lang === 'en' ? '/free-geo-tagging-tool' : `/${lang}/free-geo-tagging-tool`;
  const m = messages?.nav || { tool: "Free Geo Tagging Tool", guide: "SEO Guide" };
  const mCommon = messages?.common || { privacy: "Privacy Policy", terms: "Terms of Service", disclaimer: "Disclaimer", contact: "Contact", howItWorks: "How to Geotag Photos" };

  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <Link href="/" className="inline-flex mb-4 hover:opacity-90 transition-opacity">
            <Image 
              src="/logo-dark.svg" 
              alt="GeoTagHQ Logo" 
              width={320} 
              height={100} 
              className="w-full max-w-[170px] md:max-w-[220px] h-auto object-contain" 
              unoptimized
            />
          </Link>
          <p className="text-sm text-slate-400 leading-relaxed max-w-sm mb-6">
            {mCommon.footerDesc || 'A free, browser-based geo tagging tool for adding exact GPS locations to your photos instantly. Built for local SEO, photographers, and privacy-conscious users.'}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {LANGUAGES.map((l) => (
              <Link 
                key={l.code} 
                href={l.code === 'en' ? '/free-geo-tagging-tool' : `/${l.code}/free-geo-tagging-tool`}
                className={`text-xs hover:text-white transition-colors ${l.code === lang ? 'text-white font-semibold' : 'text-slate-500'}`}
              >
                {l.name}
              </Link>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="text-white font-medium mb-4 text-sm uppercase tracking-wider">{mCommon.usefulLinks || 'Useful Links'}</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href={toolLink} className="hover:text-white transition-colors">{m.tool}</Link></li>
            <li><Link href={`${toolLink}#how-it-works`} className="hover:text-white transition-colors">{mCommon.howItWorks}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-medium mb-4 text-sm uppercase tracking-wider">{mCommon.legal || 'Legal'}</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/privacy-policy" className="hover:text-white transition-colors">{mCommon.privacy || 'Privacy Policy'}</Link></li>
            <li><Link href="/terms-of-service" className="hover:text-white transition-colors">{mCommon.terms || 'Terms of Service'}</Link></li>
            <li><Link href="/disclaimer" className="hover:text-white transition-colors">{mCommon.disclaimer || 'Disclaimer'}</Link></li>
            <li><Link href="/contact" className="hover:text-white transition-colors">{mCommon.contact || 'Contact'}</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 text-sm text-center">
        &copy; {new Date().getFullYear()} GeoTagHQ. {mCommon.allRightsReserved || 'All rights reserved.'}
      </div>
    </footer>
  );
}
