"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DEPT, NAV, href, t } from "@/lib/i18n";
import { useLang } from "./lang-context";
import { Seal } from "./ui";

const isActive = (pathname: string, target: string) => {
  const p = pathname.replace(/\/+$/, "") || "/";
  if (target === "") return p === "/" || p === "/hi";
  return p.endsWith("/" + target);
};

/** Swaps the language segment of the current URL, keeping the page. */
const swapLang = (pathname: string, lang: "en" | "hi") => {
  const stripped = pathname.replace(/^\/hi(?=\/|$)/, "") || "/";
  if (lang === "hi") return "/hi" + (stripped === "/" ? "" : stripped);
  return stripped || "/";
};

export default function Header() {
  const pathname = usePathname() || "/";
  const lang = useLang();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="site">
      <div className="tri" aria-hidden="true" />
      <div className="wrap gutter hbar">
        <Link className="brand" href={href(lang)}>
          <Seal />
          <div>
            <b>
              Delhi <span>AQI</span>
            </b>
            <small>{DEPT[lang]}</small>
          </div>
        </Link>

        <button
          className="menu"
          aria-expanded={open}
          aria-controls="nav"
          aria-label={lang === "hi" ? "मेन्यू" : "Menu"}
          onClick={() => setOpen((v) => !v)}
        >
          ☰
        </button>

        <nav id="nav" className={`main${open ? " open" : ""}`} aria-label={lang === "hi" ? "मुख्य" : "Main"}>
          <Link
            className="navlink"
            href={href(lang)}
            aria-current={isActive(pathname, "") ? "page" : undefined}
            data-lang={lang}
          >
            {t(lang, "home")}
          </Link>
          <a
            className="navlink"
            href="https://airquality.cpcb.gov.in/AQI_India/"
            target="_blank"
            rel="noopener"
          >
            {t(lang, "otherCities")}
          </a>
          {NAV.slice(1).map((n) => (
            <Link
              key={n.key}
              className="navlink"
              href={href(lang, n.href)}
              aria-current={isActive(pathname, n.href) ? "page" : undefined}
              data-lang={lang}
            >
              {lang === "hi" ? n.hi : n.en}
            </Link>
          ))}
          <Link className="navlink" href={href(lang, "faq")} aria-current={isActive(pathname, "faq") ? "page" : undefined}>
            {t(lang, "faq")}
          </Link>
          <div className="langs" role="group" aria-label="Language / भाषा">
            <Link href={swapLang(pathname, "en")} hrefLang="en" lang="en" title="English" aria-label="English" aria-current={lang === "en" ? "true" : undefined}>
              A
            </Link>
            <Link href={swapLang(pathname, "hi")} hrefLang="hi" lang="hi" title="हिंदी" aria-label="हिंदी" aria-current={lang === "hi" ? "true" : undefined}>
              अ
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
