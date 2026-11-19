import type { ToolExtras, ToolLocale } from '../types';
import deX from '../extras/de';
import esX from '../extras/es';
import frX from '../extras/fr';
import ptX from '../extras/pt';
import itX from '../extras/it';
import nlX from '../extras/nl';
import trX from '../extras/tr';
import idX from '../extras/id';
import jaX from '../extras/ja';
import koX from '../extras/ko';
import arX from '../extras/ar';
import hiX from '../extras/hi';
import de from './de';
import es from './es';
import fr from './fr';
import pt from './pt';
import it from './it';
import nl from './nl';
import tr from './tr';
import id from './id';
import ja from './ja';
import ko from './ko';
import ar from './ar';
import hi from './hi';

// Registered tool languages. Add a language here once its file is complete.
const withExtras = (l: ToolLocale, extras?: ToolExtras): ToolLocale => (extras ? { ...l, extras } : l);

export const TOOL_LOCALES: Record<string, ToolLocale> = {
  de: withExtras(de, deX),
  es: withExtras(es, esX),
  fr: withExtras(fr, frX),
  pt: withExtras(pt, ptX),
  it: withExtras(it, itX),
  nl: withExtras(nl, nlX),
  tr: withExtras(tr, trX),
  id: withExtras(id, idX),
  ja: withExtras(ja, jaX),
  ko: withExtras(ko, koX),
  ar: withExtras(ar, arX),
  hi: withExtras(hi, hiX),
};
