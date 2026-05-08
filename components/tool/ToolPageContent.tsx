import { ShieldCheck, Map, Image as ImageIcon, Search } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import GeoTaggingTool from '@/components/tool/GeoTaggingTool';

export default function ToolPageContent({ messages, lang }: { messages: any, lang: string }) {
  const m = messages.tool || {};
  const faqs = messages.faq || [];
  
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.documentElement.lang = '${lang}';
            document.documentElement.dir = '${lang === 'ar' ? 'rtl' : 'ltr'}';
          `
        }}
      />
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <Header lang={lang} messages={messages} />
        
        <main className="flex-grow">
          <section className="bg-white border-b border-slate-200 pt-16 pb-20">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
                {m.h1}
              </h1>
              <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                {m.subtitle}
              </p>
            </div>
          </section>

          <section className="py-12 px-4 sm:px-6 lg:px-8 -mt-8">
            <GeoTaggingTool messages={messages} />
          </section>

          <section className="py-16 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                <div className="flex flex-col gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg w-fit">
                    <ShieldCheck className="w-6 h-6 text-blue-700" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">{m.privacyTitle}</h2>
                  <p className="text-slate-600 leading-relaxed">
                    {m.privacyDesc}
                  </p>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="bg-emerald-100 p-3 rounded-lg w-fit">
                     <Search className="w-6 h-6 text-emerald-700" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">{m.seoTitle}</h2>
                  <p className="text-slate-600 leading-relaxed">
                    {m.seoDesc}
                  </p>
                </div>
              </div>

              <div id="how-it-works" className="prose prose-slate max-w-none mt-16">
                <h2 className="text-3xl font-bold text-slate-900 mb-6">{m.howItWorks}</h2>
                <p className="text-slate-600 mb-6">
                  {m.howItWorksDesc}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-2">{m.step1Title}</h3>
                    <p className="text-sm text-slate-600">{m.step1Desc}</p>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-2">{m.step2Title}</h3>
                    <p className="text-sm text-slate-600">{m.step2Desc}</p>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-2">{m.step3Title}</h3>
                    <p className="text-sm text-slate-600">{m.step3Desc}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="faq" className="py-16 bg-slate-50 border-t border-slate-200">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">FAQ</h2>
              <div className="space-y-6">
                
                {faqs.map((faq: any, i: number) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="font-bold text-lg text-slate-900 mb-2">{faq.q}</h3>
                    <p className="text-slate-600">{faq.a}</p>
                  </div>
                ))}

              </div>
            </div>
          </section>
        </main>
        
        <Footer lang={lang} messages={messages} />
      </div>
    </>
  );
}
