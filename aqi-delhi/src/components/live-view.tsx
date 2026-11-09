"use client";

import { useEffect, useMemo, useState } from "react";
import { SCALE, band } from "@/lib/aqi";
import { href, t } from "@/lib/i18n";
import type { Live } from "@/data/snapshot";
import { useLang } from "./lang-context";
import { Chip, Pol } from "./ui";

type Props = { initial: Live };

const LEGEND: Array<{ k: string; hex: string; hi: string }> = [
  ...SCALE.map((s) => ({ k: s.k, hex: s.hex, hi: s.hi })),
  { k: "Not reporting", hex: "#94a3b8", hi: "रिपोर्ट नहीं" },
];

export default function LiveView({ initial }: Props) {
  const lang = useLang();
  const [live, setLive] = useState(initial);
  const [sort, setSort] = useState<"aqi" | "name">("aqi");
  const [dir, setDir] = useState<1 | -1>(-1);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const id = setInterval(() => {
      fetch("/api/live")
        .then((r) => (r.ok ? r.json() : null))
        .then((j) => j?.city?.aqi != null && setLive(j))
        .catch(() => {});
    }, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  const s = live.summary;
  const b = band(live.city.aqi);

  const counts = useMemo(
    () => LEGEND.map((l) => s.legend?.[l.k] ?? 0),
    [s.legend],
  );
  const maxCount = Math.max(1, ...counts);

  const worst = useMemo(
    () => live.stations.filter((x) => x.aqi != null).sort((a, b2) => (b2.aqi ?? 0) - (a.aqi ?? 0)).slice(0, 5),
    [live.stations],
  );

  const rows = useMemo(() => {
    const copy = [...live.stations];
    copy.sort((a, b2) => {
      if (sort === "name") return a.name.localeCompare(b2.name) * dir;
      return ((a.aqi ?? -1) - (b2.aqi ?? -1)) * dir;
    });
    return copy;
  }, [live.stations, sort, dir]);

  const copyTable = () => {
    const text =
      "Station\tAQI\tCategory\tProminent\n" +
      rows.map((x) => `${x.name}\t${x.aqi ?? ""}\t${x.aqi == null ? "Not reporting" : band(x.aqi).k}\t${x.prom ?? ""}`).join("\n");
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(
        () => setToast(t(lang, "copied")),
        () => setToast("Copy blocked here. Select the table to copy it."),
      );
    } else {
      setToast("Copy blocked here. Select the table to copy it.");
    }
    setTimeout(() => setToast(""), 2600);
  };

  const toggle = (col: "aqi" | "name") => {
    if (sort === col) setDir((d) => (d === 1 ? -1 : 1));
    else {
      setSort(col);
      setDir(col === "aqi" ? -1 : 1);
    }
  };

  const facts: Array<[string, React.ReactNode, React.ReactNode, string | null]> = [
    [lang === "hi" ? "दिल्ली AQI" : "Delhi AQI", live.city.aqi, lang === "hi" ? b.hi : b.k, b.hex],
    [
      t(lang, "stationsReporting"),
      `${s.reporting} / ${s.total}`,
      lang === "hi" ? `${s.total - s.reporting} रिपोर्ट नहीं कर रहे` : `${s.total - s.reporting} not reporting`,
      null,
    ],
    [
      t(lang, "vsYesterday"),
      s.vs_yesterday_diff == null ? "—" : `${s.vs_yesterday_diff > 0 ? "+" : ""}${s.vs_yesterday_diff}`,
      s.vs_yesterday_status === "worsened"
        ? t(lang, "worsened")
        : s.vs_yesterday_status === "improved"
          ? t(lang, "improved")
          : t(lang, "same"),
      s.vs_yesterday_diff != null && s.vs_yesterday_diff > 0 ? SCALE[3].hex : s.vs_yesterday_diff != null && s.vs_yesterday_diff < 0 ? SCALE[0].hex : null,
    ],
    [
      t(lang, "leadPollutant"),
      <Pol key="p" n={s.lead} />,
      lang === "hi" ? `${s.lead_sub_index_station_count} स्टेशनों पर` : `at ${s.lead_sub_index_station_count} stations`,
      null,
    ],
    [
      "GRAP",
      s.grap_stage === "No stage in force" ? (lang === "hi" ? "लागू नहीं" : "None") : s.grap_stage,
      s.grap_headroom != null && s.grap_headroom > 0
        ? lang === "hi"
          ? `चरण I से ${s.grap_headroom} अंक दूर`
          : `${s.grap_headroom} points to Stage I`
        : "",
      null,
    ],
  ];

  return (
    <section>
      <div className="wrap gutter view">
        <h1>{t(lang, "liveH")}</h1>
        <p className="lede">
          {t(lang, "liveP")}{" "}
          {lang === "hi" ? "रीडिंग" : "Readings for"} {new Date(live.city.time).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Kolkata" })} IST
          {" · "}
          {new Date(live.city.time).toLocaleDateString(lang === "hi" ? "hi-IN" : "en-IN", { day: "numeric", month: "short", timeZone: "Asia/Kolkata" })}.
        </p>

        <div className="pollutants">
          {facts.map(([label, value, sub, color]) => (
            <div className="pol" key={String(label)} style={{ ["--c" as string]: color ?? "var(--line)" }}>
              <span>{label}</span>
              <b style={color === b.hex ? { color: "var(--ink)" } : undefined}>{value}</b>
              <small>{sub}</small>
            </div>
          ))}
        </div>

        <div className="grid2">
          <div className="sheet">
            <h3>{t(lang, "byCategory")}</h3>
            <p className="hint">{t(lang, "byCategoryHint")}</p>
            <div className="bars">
              {LEGEND.map((l, i) => (
                <a key={l.k} href={href(lang, "stations")}>
                  <span>{lang === "hi" ? l.hi : l.k}</span>
                  <i style={{ ["--c" as string]: l.hex, ["--w" as string]: `${(counts[i] / maxCount) * 100}%` }} />
                  <b>{counts[i]}</b>
                </a>
              ))}
            </div>
          </div>

          <div className="sheet">
            <h3>{t(lang, "worstH")}</h3>
            <p className="hint">{t(lang, "worstP")}</p>
            <div>
              {worst.map((x, i) => {
                const wb = band(x.aqi ?? 0);
                return (
                  <a
                    key={x.id}
                    className="st"
                    href={href(lang, `stations/${x.slug}`)}
                    style={{ ["--c" as string]: wb.hex, width: "100%", marginBottom: 8, padding: "12px 14px", display: "block" }}
                  >
                    <div className="row">
                      <div>
                        <b>
                          {i + 1}. {x.name}
                        </b>
                        <br />
                        <small>{x.zone ? x.zone : <Pol n={x.prom} />}</small>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <b className="num" style={{ fontSize: 20, color: wb.hex }}>
                          {x.aqi}
                        </b>
                        <br />
                        <Chip band={wb} label={lang === "hi" ? wb.hi : wb.k} />
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="sheet" style={{ marginTop: 20, padding: 0, overflow: "hidden" }}>
          <div className="tablewrap" style={{ border: 0, borderRadius: 0 }}>
            <table>
              <caption style={{ padding: "16px 16px 10px" }}>
                <b style={{ fontSize: 15, color: "var(--ink)" }}>{t(lang, "stH")}</b>
              </caption>
              <thead>
                <tr>
                  <th scope="col">
                    <button className="sort" onClick={() => toggle("name")}>
                      {lang === "hi" ? "स्टेशन ↕" : "Station ↕"}
                    </button>
                  </th>
                  <th scope="col">
                    <button className="sort" onClick={() => toggle("aqi")}>
                      AQI ↕
                    </button>
                  </th>
                  <th scope="col">{t(lang, "category")}</th>
                  <th scope="col">{lang === "hi" ? "मुख्य" : "Prominent"}</th>
                  <th scope="col">{t(lang, "lastReading")}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((x) => {
                  const rb = x.aqi == null ? null : band(x.aqi);
                  return (
                    <tr key={x.id}>
                      <td>
                        <a href={href(lang, `stations/${x.slug}`)}>
                          <b>{x.name}</b>
                        </a>{" "}
                        {x.zone && <span className="zone">{x.zone}</span>}
                      </td>
                      <td>
                        <b className="num" style={{ color: rb ? rb.fg : "var(--ink-3)" }}>
                          {x.aqi ?? "—"}
                        </b>
                      </td>
                      <td>{rb ? <Chip band={rb} label={lang === "hi" ? rb.hi : rb.k} /> : <span style={{ color: "var(--ink-3)", fontSize: 13 }}>{t(lang, "notReporting")}</span>}</td>
                      <td>{x.prom ? <Pol n={x.prom} /> : "—"}</td>
                      <td className="num" style={{ fontSize: 13, color: "var(--ink-3)", whiteSpace: "nowrap" }}>
                        {x.time
                          ? new Date(x.time).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Kolkata" }) + " IST"
                          : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="tbl-foot">
            <span>
              {live.stations.length} {lang === "hi" ? "स्टेशन" : "stations"}
            </span>
            <button className="btn" onClick={copyTable} style={{ padding: "5px 12px", fontSize: 12 }}>
              {t(lang, "copy")}
            </button>
          </div>
        </div>
      </div>
      {toast && <div className="toast">{toast}</div>}
    </section>
  );
}
