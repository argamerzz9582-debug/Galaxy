"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ADVICE, SCALE, band, bandIndex, haversine, isDelayed, stamp } from "@/lib/aqi";
import { href, t } from "@/lib/i18n";
import type { Live, Station } from "@/data/snapshot";
import { useLang } from "../lang-context";
import { Chip, Pol } from "../ui";

export default function StationPage({
  live,
  station,
}: {
  live: Live;
  station: Station;
}) {
  const lang = useLang();
  const [series, setSeries] = useState<Array<{ time: string; aqi: number | null }> | null>(null);

  useEffect(() => {
    let alive = true;
    fetch(`/api/series?slug=${encodeURIComponent(station.slug)}&hours=24`)
      .then((r) => (r.ok ? r.json() : []))
      .then((j) => alive && setSeries(Array.isArray(j) ? j : []))
      .catch(() => alive && setSeries([]));
    return () => {
      alive = false;
    };
  }, [station.slug]);

  const reported = station.aqi != null;
  const b = reported ? band(station.aqi!) : null;
  const idx = reported ? bandIndex(station.aqi!) : null;
  const delayed = reported && isDelayed(station.time);
  const near = live.stations
    .filter((x) => x.id !== station.id && Number.isFinite(x.lat))
    .map((x) => ({ ...x, d: haversine(station, x) }))
    .sort((a, x) => a.d - x.d)
    .slice(0, 5);

  const vsAvg = reported && live.city.aqi ? station.aqi! - live.city.aqi : null;

  const lede = reported
    ? lang === "hi"
      ? `${station.name} निगरानी स्टेशन पर AQI ${station.aqi} (${b!.hi}) है${station.prom ? `, और मुख्य प्रदूषक ${station.prom} है` : ""}।${
          vsAvg != null
            ? ` यह दिल्ली के औसत ${live.city.aqi} से ${vsAvg === 0 ? "बराबर" : `${Math.abs(vsAvg)} अंक ${vsAvg > 0 ? "ज़्यादा" : "कम"}`} है।`
            : ""
        }`
      : `The AQI at the ${station.name} monitoring station is ${station.aqi} (${b!.k})${station.prom ? `, with ${station.prom} as the prominent pollutant` : ""}.${
          vsAvg != null
            ? ` That is ${vsAvg === 0 ? "the same as Delhi's average" : `${Math.abs(vsAvg)} points ${vsAvg > 0 ? "above" : "below"} Delhi's average`} of ${live.city.aqi}.`
            : ""
        }`
    : lang === "hi"
      ? `${station.name} निगरानी स्टेशन से पिछले 2 घंटे में कोई रीडिंग नहीं मिली है।`
      : `The ${station.name} monitoring station has not reported a reading in the last 2 hours.`;

  const status = delayed ? t(lang, "delayed") : reported ? t(lang, "live") : t(lang, "notReporting");

  return (
    <section>
      <div className="wrap gutter view">
        <nav className="crumbs" aria-label={lang === "hi" ? "ब्रेडक्रम्ब" : "Breadcrumb"}>
          <ol>
            <li>
              <Link href={href(lang)}>{t(lang, "home")}</Link>
            </li>
            <li>
              <Link href={href(lang, "stations")}>{t(lang, "stH")}</Link>
            </li>
            <li aria-current="page">{station.name}</li>
          </ol>
        </nav>

        <h1>{lang === "hi" ? `${station.name} AQI आज` : `${station.name} AQI today`}</h1>
        <p className="lede">
          {station.time && (
            <>
              {lang === "hi" ? stamp(station.time, true) + " तक: " : "As of " + stamp(station.time, true) + ": "}
            </>
          )}
          {lede}
        </p>

        <div className="st-hero">
          <span className="big num" style={{ color: b ? b.fg : "var(--ink-3)" }}>
            {reported ? station.aqi : "—"}
          </span>
          {b && <Chip band={b} label={lang === "hi" ? b.hi : b.k} />}
          {delayed && <span className="delayed">{t(lang, "delayed")}</span>}
        </div>

        <div className="grid2">
          <div className="sheet">
            <h2 style={{ fontSize: 17, margin: "0 0 12px" }}>{t(lang, "stationDetails")}</h2>
            <dl className="facts">
              <dt>{t(lang, "status")}</dt>
              <dd>{status}</dd>
              <dt>{t(lang, "lastReading")}</dt>
              <dd className="num">{station.time ? stamp(station.time, true) : "—"}</dd>
              <dt>{t(lang, "prominent")}</dt>
              <dd>{station.prom ? <Pol n={station.prom} /> : "—"}</dd>
              {station.zone && (
                <>
                  <dt>{t(lang, "district")}</dt>
                  <dd>{station.zone} district</dd>
                </>
              )}
              {Number.isFinite(station.lat) && (
                <>
                  <dt>{t(lang, "coords")}</dt>
                  <dd>
                    <a
                      href={`https://www.openstreetmap.org/?mlat=${station.lat}&mlon=${station.lon}#map=15/${station.lat}/${station.lon}`}
                      target="_blank"
                      rel="noopener"
                      className="num"
                    >
                      {station.lat.toFixed(4)}° N, {station.lon.toFixed(4)}° E
                    </a>
                  </dd>
                </>
              )}
              <dt>{t(lang, "stationType")}</dt>
              <dd>{t(lang, "caaqms")}</dd>
              <dt>{t(lang, "dataSource")}</dt>
              <dd>CPCB / DPCC</dd>
            </dl>
          </div>

          <div className="sheet">
            <h2 style={{ fontSize: 17, margin: "0 0 6px" }}>{t(lang, "nearby")}</h2>
            <ul className="near">
              {near.map((x) => (
                <li key={x.id}>
                  <span>
                    <Link href={href(lang, `stations/${x.slug}`)}>{x.name}</Link>{" "}
                    <small style={{ color: "var(--ink-3)" }}>
                      {x.d.toFixed(1)} {lang === "hi" ? "किमी" : "km"}
                    </small>
                  </span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                    <b className="num">{x.aqi ?? "—"}</b>
                    {x.aqi != null ? <Chip band={band(x.aqi)} label={lang === "hi" ? band(x.aqi).hi : band(x.aqi).k} /> : <small style={{ color: "var(--ink-3)" }}>{t(lang, "notReporting")}</small>}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid2" style={{ marginTop: 20 }}>
          <div className="sheet">
            <div className="tablewrap" style={{ border: 0 }}>
              <table>
                <caption>
                  {lang === "hi"
                    ? `${station.name}: पिछले 24 घंटे का AQI`
                    : `${station.name}: AQI over the last 24 hours`}
                </caption>
                <thead>
                  <tr>
                    <th scope="col">{t(lang, "hour")}</th>
                    <th scope="col">AQI</th>
                    <th scope="col">{t(lang, "category")}</th>
                  </tr>
                </thead>
                <tbody>
                  {series == null && (
                    <tr>
                      <td colSpan={3}>…</td>
                    </tr>
                  )}
                  {series?.length === 0 && (
                    <tr>
                      <td colSpan={3}>{t(lang, "noRecorded")}</td>
                    </tr>
                  )}
                  {series
                    ?.slice()
                    .reverse()
                    .map((p) => {
                      const pb = band(p.aqi ?? 0);
                      return (
                        <tr key={p.time}>
                          <td className="num">{stamp(p.time, true)}</td>
                          <td className="num">
                            <b>{p.aqi}</b>
                          </td>
                          <td>
                            <Chip band={pb} label={lang === "hi" ? pb.hi : pb.k} />
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="sheet advisory" style={{ ["--c" as string]: b?.hex ?? "#94a3b8" }}>
            <h2 style={{ fontSize: 17, margin: "0 0 6px" }}>{t(lang, "healthAdvice")}</h2>
            {reported && idx != null ? (
              <>
                <ul style={{ margin: "0 0 12px" }}>
                  {ADVICE[idx].gen.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
                <p style={{ margin: "0 0 6px", fontWeight: 600 }}>{t(lang, "sensitive")}</p>
                <ul>
                  {ADVICE[idx].sen.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </>
            ) : (
              <p>{t(lang, "noReading")}</p>
            )}
            <Link className="more" href={href(lang, "health")}>
              {t(lang, "fullAdvisory")}
            </Link>
          </div>
        </div>

        <p className="src-note">
          {lang === "hi"
            ? "स्टेशन हर घंटे रीडिंग भेजते हैं; 2 घंटे से पुरानी रीडिंग को “डेटा में देरी” दिखाया जाता है।"
            : "Stations report every hour; a reading older than 2 hours is shown as delayed rather than live."}
        </p>

        <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
          <Link className="btn solid" href={href(lang, "stations")}>
            {t(lang, "seeAll")}
          </Link>
          <Link className="btn" href={href(lang, "live")}>
            {t(lang, "liveH")}
          </Link>
        </div>
      </div>
    </section>
  );
}

export const SCALE_LEN = SCALE.length;
