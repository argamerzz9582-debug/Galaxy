"use client";

import { createContext, useContext } from "react";
import type { Lang } from "@/lib/i18n";

const Ctx = createContext<Lang>("en");

/**
 * A real component (not the bare Context.Provider object) so that it can be
 * rendered from server components across the client boundary.
 */
export function LangProvider({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  return <Ctx.Provider value={lang}>{children}</Ctx.Provider>;
}

export const useLang = () => useContext(Ctx);
