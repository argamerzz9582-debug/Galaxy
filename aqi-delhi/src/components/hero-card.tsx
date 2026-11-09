"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { SCALE, band, quips, stamp, type Band } from "@/lib/aqi";
import { href, t } from "@/lib/i18n";
import type { Live } from "@/data/snapshot";
import { useLang } from "./lang-context";
import { Chip, Pol, RefreshIcon } from "./ui";

export default function HeroCard({ initial }: { initial: Live }) {
  const lang = useLang();
  const [live, setLive] = useState(initial);
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    setBusy(true);
    try {
      const r = await fetch("/api/live", { cache: "no-store" });
      if (r.ok) {
        const j = (await r.json()) as Live;
        if (j?.city?.aqi != null) setLive(j);
      }
    } catch {
      /* keep what we have */
    } finally {
      setBusy(false);
    }
  }, []);

  const b: Band = band(live.city.aqi);
  const s = live.summary;
  const diff = s.vs_yesterday_diff;
  const deltaClass = diff == null ? "flat" : diff > 0 ? "bad" : diff < 0 ? "good" : "flat";

  return (
    <div className="hero-card">
      <div className="hc-top">
        <div>
          <small>{t(lang, "cur")}</small>
          <b>{lang === "hi" ? "दिल्ली AQI" : "Delhi AQI"}</b>
        </div>
        <span className="stamp" style={{ margin: 0 }}>
          {stamp(live.city.time)}
        </span>
      </div>

      <div className="hc-num">
        <span className="big num" style={{ color: b.hex }}>
          {live.city.aqi}
        </span>
        <Chip band={b} label={lang === "hi" ? b.hi : b.k} />
      </div>

      <p className="quip">{quips[SCALE.indexOf(b)]}</p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 16px" }}>
        {diff != null && (
          <span className={`delta ${deltaClass}`}>
            {diff === 0 ? "●" : diff > 0 ? "▲" : "▼"} {Math.abs(diff)}{" "}
            <span style={{ fontWeight: 500, color: "var(--ink-3)" }}>
              {s.vs_yesterday_status === "improved"
                ? t(lang, "improved")
                : s.vs_yesterday_status === "worsened"
                  ? t(lang, "worsened")
                  : t(lang, "same")}
            </span>
          </span>
        )}
        <span style={{ fontSize: 13, color: "var(--ink-3)" }}>
          <b className="num" style={{ color: "var(--ink)" }}>
            {s.reporting} / {s.total}
          </b>{" "}
          {t(lang, "stationsReporting")}
        </span>
      </div>

      <div className="hc-facts" style={{ marginTop: 12 }}>
        <div>
          <span>{t(lang, "leadPollutant")}</span>
          <b>
            <Pol n={s.lead} /> {lang === "hi" ? `${s.lead_sub_index_station_count} स्टेशनों पर` : `at ${s.lead_sub_index_station_count} stations`}
          </b>
        </div>
        <div>
          <span>GRAP</span>
          <b style={{ fontSize: 13.5 }}>
            {s.grap_stage === "No stage in force"
              ? lang === "hi"
                ? "लागू नहीं"
                : "No stage in force"
              : s.grap_stage}
          </b>
        </div>
      </div>

      <div className="legend-strip" aria-hidden="true">
        {SCALE.map((x) => (
          <i key={x.k} style={{ background: x.hex }} />
        ))}
      </div>
      <div className="legend-legend">
        {[...SCALE, { k: "Not reporting", hex: "#94a3b8" }].map((x) => (
          <span key={x.k}>
            <em style={{ background: x.hex }} />
            {lang === "hi" ? (SCALE.find((c) => c.k === x.k)?.hi ?? t(lang, "notRep")) : x.k}
            <b>{(s.legend as Record<string, number>)[x.k] ?? 0}</b>
          </span>
        ))}
      </div>

      <div className="hc-actions">
        <button className="btn" onClick={refresh} disabled={busy}>
          <RefreshIcon />
          {busy ? t(lang, "refreshing") : t(lang, "refresh")}
        </button>
        <Link className="btn solid" href={href(lang, "live")}>
          {t(lang, "liveH")}
        </Link>
        <span className="stamp">{t(lang, "newReadings")} {stamp(live.city.time)}</span>
      </div>
    </div>
  );
}
