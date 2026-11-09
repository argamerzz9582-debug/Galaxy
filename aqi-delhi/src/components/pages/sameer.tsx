"use client";

import { useMemo, useState } from "react";
import { band } from "@/lib/aqi";
import type { Live } from "@/data/snapshot";
import { useLang } from "../lang-context";
import { StoreBadge } from "../ui";
import { CITIES } from "@/data/cities";

const PLAY = "https://play.google.com/store/apps/details?id=com.cpcb";
const IOS = "https://apps.apple.com/in/app/sameer-indias-aqi/id1186664744";

const trend = (v: number) => (v > 0 ? 1 : v < 0 ? -1 : 0);

export default function Sameer({ live }: { live: Live }) {
  const lang = useLang();
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"all" | "worst" | "best">("all");
  const [picked, setPicked] = useState<string | null>(null);

  const cities = useMemo(
    () => CITIES.map((c, i) => ({ ...c, name: c.name === "Delhi" ? "Delhi" : c.name, aqi: c.name === "Delhi" ? live.city.aqi : c.aqi, tr: i === 0 ? (live.summary.vs_yesterday_diff ?? 0) : c.tr })),
    [live.city.aqi, live.summary.vs_yesterday_diff],
  );

  const needle = q.trim().toLowerCase();
  const filtered = cities.filter(
    (c) => !needle || c.name.toLowerCase().includes(needle) || c.state.toLowerCase().includes(needle),
  );

  const listed = useMemo(() => {
    const copy = [...filtered];
    if (tab === "worst") copy.sort((a, b) => b.aqi - a.aqi);
    else if (tab === "best") copy.sort((a, b) => a.aqi - b.aqi);
    else copy.sort((a, b) => a.name.localeCompare(b.name));
    return copy;
  }, [filtered, tab]);

  const worst = useMemo(() => [...cities].sort((a, b) => b.aqi - a.aqi), [cities]);
  const max = worst[0];
  const rank = worst.findIndex((c) => c.name === "Delhi") + 1;
  const detail = picked ? cities.find((c) => c.name === picked) : null;

  return (
    <section>
      <div className="wrap gutter view">
        <div className="sam">
          <div className="phone" aria-label="SAMEER app preview">
            <div className={`screen${detail ? " detail" : ""}`}>
              {!detail ? (
                <>
                  <div className="scr list">
                    <div className="app-top">
                      <div className="app-brand">
                        <span className="mk">
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0e6942" strokeWidth="2.4" strokeLinecap="round">
                            <path d="M3 8h11a3 3 0 1 0-3-3M3 12h15a3 3 0 1 1-3 3M3 16h7" />
                          </svg>
                        </span>
                        <div>
                          <b>SAMEER</b>
                          <small>National Air Quality Index · CPCB</small>
                        </div>
                      </div>
                      <input
                        type="search"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Search a city or state"
                        aria-label="Search a city"
                        autoComplete="off"
                      />
                      <div className="app-tabs">
                        {(
                          [
                            ["all", lang === "hi" ? "सभी शहर" : "All cities"],
                            ["worst", lang === "hi" ? "सबसे प्रदूषित" : "Most polluted"],
                            ["best", lang === "hi" ? "सबसे साफ़" : "Cleanest"],
                          ] as const
                        ).map(([k, label]) => (
                          <button key={k} aria-pressed={tab === k} onClick={() => setTab(k)}>
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="app-list">
                      {listed.length ? (
                        listed.map((c) => {
                          const b = band(c.aqi);
                          const tr = trend(c.tr);
                          return (
                            <button
                              key={c.name}
                              className={`city${c.name === "Delhi" ? " home" : ""}`}
                              onClick={() => setPicked(c.name)}
                              style={{ ["--c" as string]: b.hex, ["--tc" as string]: b.fg, ["--cf" as string]: b.fg }}
                            >
                              <span className="badge">{c.aqi}</span>
                              <span>
                                <span className="nm">{c.name}</span>
                                <span className="stt">{c.state}</span>
                              </span>
                              <span className="r">
                                <b>{lang === "hi" ? b.hi : b.k}</b>
                                {tr > 0 ? "▲ " + (lang === "hi" ? "बढ़ रहा" : "rising") : tr < 0 ? "▼ " + (lang === "hi" ? "घट रहा" : "easing") : "● " + (lang === "hi" ? "स्थिर" : "steady")}
                              </span>
                            </button>
                          );
                        })
                      ) : (
                        <div style={{ padding: 22, fontSize: 12, color: "#6d7768", textAlign: "center" }}>
                          {lang === "hi" ? `“${q}” से कोई शहर नहीं मिला।` : `No city matches “${q}”.`}
                          <br />
                          {lang === "hi" ? "पंजाब जैसा राज्य खोजें।" : "Try a state name like Punjab."}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="scr det">
                  <div className="app-top">
                    <button
                      onClick={() => setPicked(null)}
                      style={{ border: 0, background: "none", color: "#fff", font: "inherit", fontSize: 12, padding: 0, marginBottom: 8, cursor: "pointer" }}
                    >
                      ← {lang === "hi" ? "शहर" : "Cities"}
                    </button>
                    <div className="app-brand" style={{ marginBottom: 4 }}>
                      <div>
                        <b>{detail.name}</b>
                        <small>{detail.state}</small>
                      </div>
                      <span
                        style={{
                          marginLeft: "auto",
                          background: band(detail.aqi).hex,
                          padding: "3px 9px",
                          borderRadius: 8,
                          fontSize: 13,
                          fontWeight: 700,
                        }}
                      >
                        {detail.aqi}
                      </span>
                    </div>
                  </div>
                  <div style={{ padding: 14, overflowY: "auto" }}>
                    <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".07em", color: "#6d7768", fontWeight: 700, marginBottom: 6 }}>
                      {lang === "hi" ? "प्रदूषक" : "Pollutants"}
                    </div>
                    {(["PM2.5", "PM10", "NO₂", "O₃"] as const).map((p) => (
                      <div key={p} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "6px 0", borderBottom: "1px solid #e3e8df" }}>
                        <span>{p}</span>
                        <b>{Math.round(detail.aqi / (p === "PM10" ? 2.4 : 2.1))}</b>
                      </div>
                    ))}
                    <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".07em", color: "#6d7768", fontWeight: 700, margin: "14px 0 6px" }}>
                      {lang === "hi" ? "पूर्वानुमान" : "Forecast"}
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      {[0.92, 0.88, 0.83].map((f, i) => {
                        const v = Math.round(detail.aqi * f);
                        return (
                          <div key={i} style={{ flex: 1, background: "#fff", borderRadius: 8, padding: 6, textAlign: "center", fontSize: 11 }}>
                            <div style={{ color: "#6d7768" }}>{[lang === "hi" ? "शनि" : "Sat", lang === "hi" ? "रवि" : "Sun", lang === "hi" ? "सोम" : "Mon"][i]}</div>
                            <b style={{ color: band(v).fg, fontSize: 13 }}>{v}</b>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="sam-intro">
              <div className="kicker" style={{ marginBottom: 10 }}>
                {lang === "hi" ? "समीर ऐप (अन्य शहरों का AQI)" : "SAMEER App (Other Cities AQI)"}
              </div>
              <h1 style={{ fontSize: "clamp(26px,3.4vw,38px)" }}>
                {lang === "hi" ? "पूरे भारत की वायु गुणवत्ता, शहर-दर-शहर" : "Air quality across India, city by city"}
              </h1>
              <p className="lede" style={{ marginBottom: 0 }}>
                {lang === "hi"
                  ? "समीर, राष्ट्रीय AQI के लिए केंद्रीय प्रदूषण नियंत्रण बोर्ड का ऐप है। प्रदूषक और अगले तीन दिन देखने के लिए ऐप में किसी शहर पर टैप करें, या चार्ट से चुनें।"
                  : "SAMEER is the Central Pollution Control Board's app for the National AQI. Tap any city in the app to see its pollutants and the next three days, or pick one from the chart."}
              </p>
            </div>

            <div className="sam-stats">
              <div>
                <span>{lang === "hi" ? "शहर ट्रैक किए" : "Cities tracked"}</span>
                <b className="num">{cities.length}</b>
                <small>{lang === "hi" ? "इस प्रीव्यू में" : "in this preview"}</small>
              </div>
              <div>
                <span>{lang === "hi" ? "सबसे प्रदूषित" : "Most polluted"}</span>
                <b>{max.name}</b>
                <small style={{ color: band(max.aqi).fg }}>
                  AQI {max.aqi} · {lang === "hi" ? band(max.aqi).hi : band(max.aqi).k}
                </small>
              </div>
              <div>
                <span>{lang === "hi" ? "दिल्ली की रैंक" : "Delhi ranks"}</span>
                <b className="num">#{rank}</b>
                <small>
                  of {cities.length} · AQI {live.city.aqi}
                </small>
              </div>
            </div>

            <div className="sheet">
              <h3>{lang === "hi" ? "अभी सबसे प्रदूषित शहर" : "Most polluted cities right now"}</h3>
              <p className="hint">{lang === "hi" ? "AQI के अनुसार शीर्ष 12 · दिल्ली हाइलाइट" : "Top 12 by AQI · Delhi highlighted"}</p>
              <div className="bars">
                {worst.slice(0, 12).map((c) => (
                  <button key={c.name} onClick={() => setPicked(c.name)}>
                    <span className={c.name === "Delhi" ? "dl" : ""}>{c.name}</span>
                    <i style={{ ["--c" as string]: band(c.aqi).hex, ["--w" as string]: `${(c.aqi / worst[0].aqi) * 100}%` }} />
                    <b>{c.aqi}</b>
                  </button>
                ))}
              </div>
            </div>

            <div className="get">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="6" y="2" width="12" height="20" rx="3" />
                <path d="M11 18h2" />
              </svg>
              <div className="gt">
                <b>{lang === "hi" ? "अपने फ़ोन पर समीर पाएं" : "Get SAMEER on your phone"}</b>
                <p>{lang === "hi" ? "CPCB की ओर से मुफ़्त। अपने शहर की हवा के अलर्ट पाएं।" : "Free from CPCB. Get alerts for your city's air."}</p>
              </div>
              <div className="stores">
                <StoreBadge kind="play" href={PLAY} />
                <StoreBadge kind="ios" href={IOS} />
              </div>
            </div>

            <p className="hint" style={{ marginTop: 14 }}>
              {lang === "hi"
                ? "इस प्रीव्यू में शहरों की रीडिंग डिज़ाइन के लिए नमूना मान हैं।"
                : "City readings in this preview are sample values for design purposes."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
