import type { ToolPageContent } from '../toolPage';
import ar from './ar';
import de from './de';
import es from './es';
import fr from './fr';
import hi from './hi';
import id from './id';
import it from './it';
import ja from './ja';
import ko from './ko';
import nl from './nl';
import pt from './pt';
import tr from './tr';

// Natively written tool pages, one per language (English lives in ../toolPage.ts).
// Each is built around the phrases people search for in that language, not translated.
// A language missing here falls back to the short page built from messages/<lang>.json.
export const LOCALE_PAGES: Record<string, ToolPageContent> = { ar, de, es, fr, hi, id, it, ja, ko, nl, pt, tr };
