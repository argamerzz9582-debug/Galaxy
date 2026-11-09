"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { href, t } from "@/lib/i18n";
import { useLang } from "./lang-context";
import { Seal, StoreBadge } from "./ui";

const PLAY = "https://play.google.com/store/apps/details?id=com.green_delhi_teste";
const IOS = "https://apps.apple.com/in/app/green-delhi-app/id1586987377";

export default function Footer() {
  const lang = useLang();
  const [visits, setVisits] = useState<number | null>(null);
  const [sheet, setSheet] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const url = "https://abacus.jasoncameron.dev/hit/aqi-delhi-clone/visits";
    fetch(url)
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (!cancelled && typeof j?.value === "number") setVisits(j.value);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <footer className="site">
      <div className="wrap gutter f-links">
        <div className="f-brand">
          <div className="fb-top">
            <Seal className="fb-logo" />
            <div>
              <b>
                Delhi <span>AQI</span>
              </b>
              <small>{lang === "hi" ? "पर्यावरण विभाग · दिल्ली सरकार" : "Department of Environment · GNCTD"}</small>
            </div>
          </div>
          <p className="note">{t(lang, "fAbout")}</p>
          <span className="visits">
            {t(lang, "visitors")} <strong>{(visits ?? 180052).toLocaleString("en-IN")}</strong>
          </span>
        </div>

        <div>
          <h4>{t(lang, "fExplore")}</h4>
          <div className="f-nav">
            <a href="https://airquality.cpcb.gov.in/AQI_India/" target="_blank" rel="noopener">
              {t(lang, "otherCities")}
            </a>
            <Link href={href(lang, "live")}>{t(lang, "delhiLive")}</Link>
            <Link href={href(lang, "stations")}>{t(lang, "stH")}</Link>
            <Link href={href(lang, "health")}>{t(lang, "hH")}</Link>
            <Link href={href(lang, "about")}>{lang === "hi" ? "AQI के बारे में" : "About AQI"}</Link>
            <Link href={href(lang, "faq")}>{t(lang, "faq")}</Link>
            <Link href={href(lang, "sameer")}>{t(lang, "sameer")}</Link>
          </div>
        </div>

        <div>
          <h4>{t(lang, "fReport")}</h4>
          <div className="f-nav">
            <a
              href={PLAY}
              target="_blank"
              rel="noopener"
              onClick={(e) => {
                e.preventDefault();
                setSheet(true);
              }}
            >
              {t(lang, "greenApp")}
            </a>
          </div>
          <p className="gd-cap">{t(lang, "reportCap")}</p>
        </div>

        <div>
          <h4>{t(lang, "fHelp")}</h4>
          <ul className="f-help">
            <li>
              <span>{t(lang, "emergency")}</span>
              <b>112</b>
            </li>
            <li>
              <span>{t(lang, "ambulance")}</span>
              <b>102 / 108</b>
            </li>
            <li>
              <span>{t(lang, "polControl")}</span>
              <b>1800 202 5051</b>
            </li>
            <li>
              <span>ICCC</span>
              <b>10741</b>
            </li>
          </ul>
        </div>
      </div>

      <div className="f-barwrap">
        <div className="wrap gutter f-bottom">
          <span>{t(lang, "copyright")}</span>
          <span>
            {t(lang, "data")}{" "}
            <a href="https://cpcb.nic.in/" target="_blank" rel="noopener">
              CPCB
            </a>{" "}
            ·{" "}
            <a href="https://www.dpcc.delhigovt.nic.in/" target="_blank" rel="noopener">
              DPCC
            </a>{" "}
            ·{" "}
            <a href="https://caqm.nic.in/" target="_blank" rel="noopener">
              CAQM
            </a>{" "}
            {t(lang, "reuse")}{" "}
            <a href="https://data.gov.in/government-open-data-license-india" target="_blank" rel="noopener license">
              GODL-India
            </a>
          </span>
          <span>
            {t(lang, "credits")}{" "}
            <a href="https://mausam.imd.gov.in/" target="_blank" rel="noopener">
              IMD
            </a>
          </span>
        </div>
      </div>

      {sheet && (
        <>
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(20,26,18,.55)",
              zIndex: 90,
            }}
            onClick={() => setSheet(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="gdmT"
            style={{
              position: "fixed",
              zIndex: 91,
              left: "50%",
              top: "50%",
              transform: "translate(-50%,-50%)",
              width: "min(420px, calc(100vw - 32px))",
              background: "var(--card)",
              border: "1px solid var(--line)",
              borderRadius: "var(--r-lg)",
              boxShadow: "var(--shadow-lg)",
              padding: 24,
            }}
          >
            <button
              onClick={() => setSheet(false)}
              aria-label="Close"
              style={{
                position: "absolute",
                right: 12,
                top: 10,
                border: 0,
                background: "none",
                fontSize: 22,
                lineHeight: 1,
                cursor: "pointer",
                color: "var(--ink-3)",
              }}
            >
              ×
            </button>
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: 14,
                display: "grid",
                placeItems: "center",
                background: "#eaf4ec",
                marginBottom: 12,
              }}
            >
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#2f7a4a" strokeWidth="1.8" strokeLinecap="round">
                <path d="M5 19C5 9 11 5 19 5c0 9-5 14-14 14zM5 19l8-8" />
              </svg>
            </div>
            <h3 id="gdmT" style={{ fontSize: 20 }}>
              {lang === "hi" ? "ग्रीन दिल्ली ऐप डाउनलोड करें" : "Download the Green Delhi app"}
            </h3>
            <p style={{ fontSize: 14, color: "var(--ink-2)" }}>
              {lang === "hi"
                ? "खुले में जलाने, धूल, औद्योगिक धुएं और अन्य प्रदूषण की शिकायत सीधे दिल्ली सरकार को करें।"
                : "Report open burning, dust, industrial smoke and other pollution directly to the Delhi Government."}
            </p>
            <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
              <div style={{ display: "flex", gap: 8, padding: 0 }}>
                <span style={{ display: "contents" }}>
                  <StoreBadgeInline kind="play" href={PLAY} />
                  <StoreBadgeInline kind="ios" href={IOS} />
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </footer>
  );
}

function StoreBadgeInline({ kind, href }: { kind: "play" | "ios"; href: string }) {
  return (
    <span style={{ filter: "invert(1) hue-rotate(180deg)" }}>
      <StoreBadge kind={kind} href={href} />
    </span>
  );
}
