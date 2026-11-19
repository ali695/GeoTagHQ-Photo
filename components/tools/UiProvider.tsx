'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { UI_EN, fmt, type UiDict, type UiKey } from '@/lib/i18n/ui';

type Ctx = { lang: string; dict: UiDict };
const UiContext = createContext<Ctx>({ lang: 'en', dict: UI_EN });

/** Gives client tool components their interface text. The server passes a plain dict. */
export function UiProvider({ lang, dict, children }: { lang: string; dict: UiDict; children: ReactNode }) {
  return <UiContext.Provider value={{ lang, dict }}>{children}</UiContext.Provider>;
}

export function useUi() {
  const { lang, dict } = useContext(UiContext);
  const t = (key: UiKey, vars?: Record<string, string | number>) => fmt(dict[key] ?? UI_EN[key], vars);
  return { t, lang };
}
