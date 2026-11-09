"use client";

import Link from "next/link";
import { SCALE, band, grapLabel, quips, stamp } from "@/lib/aqi";
import { href, t } from "@/lib/i18n";
import type { Live } from "@/data/snapshot";
import { useLang } from "../lang-context";
import { Pol } from "../ui";
import HeroCard from "../hero-card";
import WeatherCard, { Leadership, type Weather } from "../weather";

const TIPS = [
  {
    key: "pledge",
    en: "Vayu Sankalp",
    hi: "वायु संकल्प",
    url: "https://greendelhi.nic.in/green-pledge",
    d: '<path d="M12 21s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.6-7 10-7 10z"/><path d="M12 9v6M9.5 12.5 12 15l2.5-2.5"/>',
  },
  {
    key: "idea",
    en: "Jan Sujhav",
    hi: "जन सुझाव",
    url: "https://greendelhi.nic.in/jan-sujhaav",
    d: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/>',
  },
  {
    key: "hands",
    en: "Jan Sahyog",
    hi: "जन सहयोग",
    url: "https://greendelhi.nic.in/jan-sujhaav",
    d: '<circle cx="8" cy="7" r="3"/><circle cx="16.5" cy="8" r="2.5"/><path d="M2 20c0-3.3 2.7-6 6-6s6 2.7 6 6M14 14.3c.8-.2 1.6-.3 2.5-.3 3 0 5.5 2.4 5.5 5.5"/>',
  },
  {
    key: "patch",
    en: "Brown Patch",
    hi: "ब्राउन पैच",
    url: "https://greendelhi.nic.in/brown-batch",
    d: '<path d="M12 21s-6-5.4-6-11a6 6 0 0 1 12 0c0 5.6-6 11-6 11z"/><path d="M9.5 10.5h5M12 8v5"/>',
  },
];

export default function Home({
  live,
  weather,
}: {
  live: Live;
  weather: Weather;
}) {
  const lang = useLang();
  const b = band(live.city.aqi);
  const s = live.summary;
  const worst = live.stations
    .filter((x) => x.aqi != null)
    .sort((a, c) => (c.aqi ?? 0) - (a.aqi ?? 0))
    .slice(0, 5);

  return (
    <>
      <section className="hero">
        <div className="hero-img">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/hero-delhi.jpg" alt="" />
        </div>
        <div className="wrap gutter hero-in">
          <div>
            <span className="eyebrow">{t(lang, "eyebrow")}</span>
            <h1>
              {lang === "hi" ? (
                <>
                  अपनी हवा को <em>जानें।</em>
                  <br />
                  अपने स्वास्थ्य की रक्षा करें।
                </>
              ) : (
                <>
                  Know your Air.
                  <br />
                  <em>Protect your Health.</em>
                </>
              )}
            </h1>
            <p className="tag2">{t(lang, "tag2")}</p>
          </div>
          <HeroCard initial={live} />
        </div>
      </section>

      <section className="block">
        <div className="wrap gutter">
          <div className="grid2">
            <div>
              <h2 className="kicker">{lang === "hi" ? "दिल्ली में अभी" : "Right now in Delhi"}</h2>
              <div className="sheet">
                <p style={{ fontSize: 15.5, color: "var(--ink-2)", marginBottom: 16 }}>
                  {lang === "hi" ? (
                    <>
                      {new Date(live.city.time).toLocaleDateString("hi-IN", { day: "numeric", month: "long", timeZone: "Asia/Kolkata" })} को{" "}
                      {stamp(live.city.time)} बजे दिल्ली का AQI भारत के राष्ट्रीय AQI पैमाने पर{" "}
                      <b style={{ color: b.fg }}>{live.city.aqi}</b> ({b.hi}) है।
                    </>
                  ) : (
                    <>
                      As of {stamp(live.city.time, true)}, Delhi&apos;s AQI is{" "}
                      <b style={{ color: b.fg }}>{live.city.aqi}</b> ({b.k}) on India&apos;s National AQI scale.
                      {s.vs_yesterday_diff != null && (
                        <>
                          {" "}
                          The AQI is {Math.abs(s.vs_yesterday_diff)} points{" "}
                          {s.vs_yesterday_diff > 0 ? "higher" : "lower"} than at the same hour yesterday.
                        </>
                      )}
                    </>
                  )}
                </p>

                <div className="bars" style={{ marginBottom: 18 }}>
                  {worst.map((x, i) => {
                    const wb = band(x.aqi ?? 0);
                    return (
                      <Link key={x.id} href={href(lang, `stations/${x.slug}`)}>
                        <span>
                          {i + 1}. {x.name}
                        </span>
                        <i style={{ ["--c" as string]: wb.hex, ["--w" as string]: `${((x.aqi ?? 0) / 500) * 100}%` }} />
                        <b style={{ color: wb.fg }}>{x.aqi}</b>
                      </Link>
                    );
                  })}
                </div>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <Link className="btn solid" href={href(lang, "stations")}>
                    {t(lang, "stH")}
                  </Link>
                  <Link className="btn" href={href(lang, "live")}>
                    {t(lang, "liveH")}
                  </Link>
                </div>
              </div>
            </div>

            <div>
              <h2 className="kicker">{lang === "hi" ? "मौसम" : "Weather"}</h2>
              <WeatherCard initial={weather} />
              <div className="sheet" style={{ marginTop: 16 }}>
                <h3 style={{ fontSize: 16 }}>{lang === "hi" ? "आज की सलाह" : "Advice today"}</h3>
                <p style={{ margin: "0 0 8px", fontWeight: 600, color: b.fg }}>{quips[SCALE.indexOf(b)]}</p>
                <p style={{ margin: 0, fontSize: 13.5, color: "var(--ink-2)" }}>
                  {lang === "hi"
                    ? "बाहर जाना ज़रूरी हो तो N95 पहनें और खिड़कियां बंद रखें।"
                    : "Wear an N95 if you must go out, and keep windows shut in the morning and evening."}
                </p>
                <Link className="more" href={href(lang, "health")} style={{ display: "inline-block", marginTop: 10 }}>
                  {t(lang, "fullAdvisory")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="block tight" style={{ paddingTop: 0 }}>
        <div className="wrap gutter">
          <h2 className="kicker">{lang === "hi" ? "दिल्ली का AQI — सारांश" : "Delhi AQI at a glance"}</h2>
          <div className="grid3">
            <div className="sheet">
              <span className="hint" style={{ margin: 0 }}>{t(lang, "stationsReporting")}</span>
              <b className="num" style={{ fontFamily: "var(--serif)", fontSize: 30 }}>
                {s.reporting} / {s.total}
              </b>
              <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--ink-3)" }}>
                {s.total - s.reporting} {lang === "hi" ? "स्टेशन रिपोर्ट नहीं कर रहे" : "stations not reporting"}
              </p>
            </div>
            <div className="sheet">
              <span className="hint" style={{ margin: 0 }}>{t(lang, "leadPollutant")}</span>
              <b style={{ fontFamily: "var(--serif)", fontSize: 30 }}>
                <Pol n={s.lead} />
              </b>
              <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--ink-3)" }}>
                {s.lead_sub_index_station_count} {lang === "hi" ? "स्टेशनों पर सबसे ऊंचा उप-सूचकांक" : "stations with the highest sub-index"}
              </p>
            </div>
            <div className="sheet">
              <span className="hint" style={{ margin: 0 }}>GRAP</span>
              <b style={{ fontFamily: "var(--serif)", fontSize: 24 }}>{grapLabel(s.grap_stage, lang)}</b>
              <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--ink-3)" }}>
                <a href="https://caqm.nic.in/" target="_blank" rel="noopener">
                  {t(lang, "caqm")} ↗
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      <Leadership
        title={t(lang, "leadK")}
        people={[
          {
            img: "/leaders/lg.jpg",
            alt: "Shri Taranjit Singh Sandhu",
            role: lang === "hi" ? "मा. उपराज्यपाल" : "Hon'ble Lieutenant Governor",
            name: lang === "hi" ? "श्री तरनजीत सिंह संधू" : "Shri Taranjit Singh Sandhu",
            dept: lang === "hi" ? "दिल्ली के उपराज्यपाल" : "Lieutenant Governor of Delhi",
            fallback: "",
          },
          {
            img: "/leaders/cm.jpg",
            alt: "Smt. Rekha Gupta",
            role: lang === "hi" ? "मा. मुख्यमंत्री" : "Hon'ble Chief Minister",
            name: lang === "hi" ? "श्रीमती रेखा गुप्ता" : "Smt. Rekha Gupta",
            dept: lang === "hi" ? "राष्ट्रीय राजधानी क्षेत्र दिल्ली सरकार" : "Government of NCT of Delhi",
            fallback: "",
          },
          {
            img: "/leaders/minister.jpg",
            alt: "Sardar Manjinder Singh Sirsa",
            role: lang === "hi" ? "मा. मंत्री" : "Hon'ble Minister",
            name: lang === "hi" ? "सरदार मनजिंदर सिंह सिरसा" : "Sardar Manjinder Singh Sirsa",
            dept: lang === "hi" ? "पर्यावरण, वन एवं वन्यजीव" : "Environment, Forest & Wildlife",
            fallback: "",
          },
        ]}
      />

      <section className="gdband" aria-labelledby="gdH">
        <div className="wrap gutter">
          <h2 className="kicker" id="gdH">
            {t(lang, "gdK")}
          </h2>
          <div className="gd-track">
            {TIPS.map((tip) => (
              <a key={tip.key} href={tip.url} target="_blank" rel="noopener">
                <i>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    dangerouslySetInnerHTML={{ __html: tip.d }}
                  />
                </i>
                {lang === "hi" ? tip.hi : tip.en}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="block">
        <div className="wrap gutter">
          <h2 className="kicker">{t(lang, "sameerLong")}</h2>
          <div className="grid2">
            <div className="sheet">
              <h3>{lang === "hi" ? "देश भर के शहरों का AQI" : "Air quality across India, city by city"}</h3>
              <p className="hint">
                {lang === "hi"
                  ? "CPCB का समीर ऐप राष्ट्रीय AQI दिखाता है। किसी भी शहर पर टैप करके उसके प्रदूषक और अगले तीन दिन देखें।"
                  : "SAMEER is the Central Pollution Control Board's app for the National AQI. Tap any city in the app to see its pollutants and the next three days."}
              </p>
              <Link className="btn solid" href={href(lang, "sameer")}>
                {t(lang, "sameer")}
              </Link>
            </div>
            <div className="sheet">
              <h3>{lang === "hi" ? "अक्सर पूछे जाने वाले सवाल" : "Frequently asked questions"}</h3>
              <p className="hint">
                {lang === "hi"
                  ? "PM2.5 क्या है, AQI कैसे निकाला जाता है, GRAP चरण का क्या मतलब है — सब एक जगह।"
                  : "What PM2.5 means, how the AQI is worked out, what the GRAP stage means — all in one place."}
              </p>
              <Link className="btn" href={href(lang, "faq")}>
                {t(lang, "faq")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
