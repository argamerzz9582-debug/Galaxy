"use client";

import { createContext, useContext } from "react";
import type { Lang } from "@/lib/i18n";

const Ctx = createContext<Lang>("en");

export const LangProvider = Ctx.Provider;
export const useLang = () => useContext(Ctx);
