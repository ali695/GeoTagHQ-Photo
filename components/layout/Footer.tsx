import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-white font-semibold mb-4 tracking-tight">GeoTag<span className="text-blue-500">HQ</span></h3>
          <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
            A free, browser-based geo tagging tool for adding exact GPS locations to your photos instantly. Built for local SEO, photographers, and privacy-conscious users.
          </p>
        </div>
        
        <div>
          <h4 className="text-white font-medium mb-4 text-sm uppercase tracking-wider">Useful Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/free-geo-tagging-tool" className="hover:text-white transition-colors">Free Geo Tagging Tool</Link></li>
            <li><Link href="#how-it-works" className="hover:text-white transition-colors">How to Geotag Photos</Link></li>
            <li><Link href="#local-seo" className="hover:text-white transition-colors">Geotagging for Local SEO</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-medium mb-4 text-sm uppercase tracking-wider">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            <li><Link href="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link></li>
            <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 text-sm text-center">
        &copy; {new Date().getFullYear()} GeoTagHQ. All rights reserved.
      </div>
    </footer>
  );
}
