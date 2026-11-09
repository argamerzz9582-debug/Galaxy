"use client";

import { useState } from "react";
import Link from "next/link";
import { ADVICE, SCALE, band, bandIndex } from "@/lib/aqi";
import { href, t } from "@/lib/i18n";
import type { Live } from "@/data/snapshot";
import { useLang } from "../lang-context";

export default function Health({ live }: { live: Live }) {
  const lang = useLang();
  const s = live.summary;
  const nowIdx = bandIndex(live.city.aqi);
  const [sel, setSel] = useState<number | null>(null);
  const shown = sel ?? nowIdx;
  const b = SCALE[shown];

  const asOf = lang === "hi"
    ? `${new Date(live.city.time).toLocaleDateString("hi-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" })} को ${new Date(live.city.time).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Kolkata" })} IST`
    : new Date(live.city.time).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Kolkata" }) +
      " IST on " +
      new Date(live.city.time).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" });

  return (
    <section>
      <div className="wrap gutter view">
        <h1>{t(lang, "hH")}</h1>
        <p className="lede">{t(lang, "hP")}</p>

        <div className="sheet" style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 17, margin: "0 0 6px" }}>{t(lang, "nowInDelhi")}</h2>
          <p style={{ margin: "0 0 6px", fontSize: 15, color: "var(--ink-2)" }}>
            {lang === "hi" ? (
              <>
                {asOf} दिल्ली का AQI भारत के राष्ट्रीय AQI पैमाने पर <b>{live.city.aqi}</b> ({band(live.city.aqi).hi}) है।{" "}
                {s.total} में से {s.reporting} स्टेशन रिपोर्ट कर रहे हैं
                {s.lead ? `, और ${s.lead_sub_index_station_count} स्टेशनों पर ${s.lead} मुख्य प्रदूषक है` : ""}।
                {s.vs_yesterday_diff != null && (
                  <> यह कल इसी समय से {Math.abs(s.vs_yesterday_diff)} अंक {s.vs_yesterday_diff > 0 ? "ज़्यादा" : "कम"} है।</>
                )}
              </>
            ) : (
              <>
                As of {asOf}, Delhi&apos;s AQI is <b>{live.city.aqi}</b> ({band(live.city.aqi).k}) on India&apos;s
                National AQI scale. {s.reporting} of {s.total} stations are reporting
                {s.lead ? `, and ${s.lead} is the lead pollutant at ${s.lead_sub_index_station_count} of them` : ""}.
                {s.vs_yesterday_diff != null && (
                  <> The AQI is {Math.abs(s.vs_yesterday_diff)} points {s.vs_yesterday_diff > 0 ? "higher" : "lower"} than at the same hour yesterday.</>
                )}
              </>
            )}
          </p>
          <p style={{ margin: 0, fontSize: 14 }}>
            <b>GRAP:</b> {s.grap_stage} ·{" "}
            <a href="https://caqm.nic.in/" target="_blank" rel="noopener">
              {t(lang, "caqm")}
            </a>
          </p>
        </div>

        <div className="tabs" role="tablist">
          {SCALE.map((x, i) => (
            <button
              key={x.k}
              role="tab"
              aria-selected={i === shown}
              style={{ ["--c" as string]: x.hex }}
              onClick={() => setSel(i)}
            >
              <i />
              {lang === "hi" ? x.hi : x.k}{" "}
              <small>
                {x.min}–{x.max}
              </small>
              {i === nowIdx && <span className="now-tag">{lang === "hi" ? "अभी" : "Now"}</span>}
            </button>
          ))}
        </div>

        <p style={{ fontSize: 18, fontWeight: 600, margin: "0 0 16px", color: b.fg }}>
          {lang === "hi" ? ADVICE[shown].impact.replace(/\.$/, "") + "।" : ADVICE[shown].impact}
        </p>

        <div className="adv" style={{ ["--c" as string]: b.hex }}>
          <div className="sheet">
            <h3>{t(lang, "everyone")}</h3>
            <ul style={{ margin: 0 }}>
              {ADVICE[shown].gen.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
          <div className="sheet">
            <h3>{t(lang, "sensitive")}</h3>
            <ul style={{ margin: 0 }}>
              {ADVICE[shown].sen.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
        </div>

        <p className="src-note">{t(lang, "healthNote")}</p>

        <div className="range-chart">
          <div className="range-bar">
            {SCALE.map((x) => (
              <div key={x.k} style={{ background: x.hex, flex: x.max - x.min + 1 }}>
                {x.min}–{x.max}
              </div>
            ))}
          </div>
          <div className="range-ticks">
            <span>0</span>
            <span>100</span>
            <span>200</span>
            <span>300</span>
            <span>400</span>
            <span>500</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap" }}>
          <Link className="btn solid" href={href(lang, "stations")}>
            {t(lang, "stH")}
          </Link>
          <Link className="btn" href={href(lang, "about")}>
            {lang === "hi" ? "AQI के बारे में" : "About AQI"}
          </Link>
        </div>
      </div>
    </section>
  );
}
