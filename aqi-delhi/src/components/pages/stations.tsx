"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { SCALE, band, stamp } from "@/lib/aqi";
import { href, t } from "@/lib/i18n";
import type { Live } from "@/data/snapshot";
import { useLang } from "../lang-context";
import { Chip, Pol, RefreshIcon } from "../ui";

type Filter = "All" | "Good" | "Satisfactory" | "Moderate" | "Poor" | "Very Poor" | "Severe" | "Not reporting";

const HOURS: Array<[string, number]> = [
  ["compare1", 1],
  ["compare3", 3],
  ["compare6", 6],
  ["compare12", 12],
  ["compare24", 24],
];

export default function Stations({ initial }: { initial: Live }) {
  const lang = useLang();
  const [live, setLive] = useState(initial);
  const [filter, setFilter] = useState<Filter>("All");
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [then, setThen] = useState<Record<string, number> | null>(null);
  const [thenLabel, setThenLabel] = useState("");
  const [hours, setHours] = useState("0");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "none">("idle");

  const s = live.summary;

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: live.stations.length };
    for (const b of [...SCALE.map((x) => x.k), "Not reporting"]) c[b] = 0;
    for (const st of live.stations) {
      const key = st.aqi == null ? "Not reporting" : band(st.aqi).k;
      c[key] = (c[key] ?? 0) + 1;
    }
    return c;
  }, [live.stations]);

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return live.stations
      .filter((st) => {
        const key = st.aqi == null ? "Not reporting" : band(st.aqi).k;
        if (filter !== "All" && key !== filter) return false;
        if (!needle) return true;
        return (
          st.name.toLowerCase().includes(needle) || (st.zone ?? "").toLowerCase().includes(needle)
        );
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [live.stations, filter, q]);

  const worst = useMemo(
    () =>
      live.stations
        .filter((x) => x.aqi != null)
        .sort((a, b) => (b.aqi ?? 0) - (a.aqi ?? 0))
        .slice(0, 5),
    [live.stations],
  );

  const refresh = async () => {
    setBusy(true);
    try {
      const r = await fetch("/api/live", { cache: "no-store" });
      if (r.ok) {
        const j = (await r.json()) as Live;
        if (j?.city?.aqi != null) setLive(j);
      }
    } catch {
      /* ignore */
    } finally {
      setBusy(false);
    }
  };

  // "Compare with earlier": fetch the reading for N hours ago.
  useEffect(() => {
    const h = Number(hours);
    if (!h) {
      setThen(null);
      setStatus("idle");
      return;
    }
    const ctrl = new AbortController();
    setStatus("loading");
    const at = new Date(Date.now() - h * 3_600_000).toISOString();
    fetch(`/api/live?at=${encodeURIComponent(at)}`, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((j: Live | null) => {
        if (!j?.stations) {
          setStatus("none");
          setThen(null);
          return;
        }
        setThen(Object.fromEntries(j.stations.map((x) => [x.id, x.aqi ?? -1])));
        setThenLabel(j.city.time);
        setStatus("ok");
      })
      .catch((e) => e.name !== "AbortError" && setStatus("none"));
    return () => ctrl.abort();
  }, [hours]);

  const summary = useMemo(() => {
    if (!then) return null;
    let worse = 0;
    let better = 0;
    let same = 0;
    for (const st of live.stations) {
      const was = then[st.id];
      if (st.aqi == null || was == null || was < 0) continue;
      if (st.aqi > was) worse++;
      else if (st.aqi < was) better++;
      else same++;
    }
    return { worse, better, same };
  }, [then, live.stations]);

  return (
    <section>
      <div className="wrap gutter view">
        <h1>{t(lang, "stH")}</h1>
        <p className="lede">{t(lang, "stP")}</p>

        {live.stale && (
          <div className="banner">
            Showing the last saved reading because the live feed could not be reached.
          </div>
        )}

        <div className="sheet" style={{ padding: 0, overflow: "hidden", marginBottom: 22 }}>
          <div className="tablewrap" style={{ border: 0, borderRadius: 0 }}>
            <table>
              <caption style={{ padding: "16px 16px 10px" }}>
                <b style={{ fontSize: 15, color: "var(--ink)" }}>{t(lang, "worstH")}</b>
                {" · "}
                <span style={{ fontWeight: 400 }}>{stamp(live.city.time)}</span>
              </caption>
              <thead>
                <tr>
                  <th scope="col">{lang === "hi" ? "स्टेशन" : "Station"}</th>
                  <th scope="col">AQI</th>
                  <th scope="col">{t(lang, "category")}</th>
                  <th scope="col">{lang === "hi" ? "मुख्य प्रदूषक" : "Lead pollutant"}</th>
                  <th scope="col">{lang === "hi" ? "अपडेट" : "Updated"}</th>
                </tr>
              </thead>
              <tbody>
                {worst.map((x) => {
                  const wb = band(x.aqi ?? 0);
                  return (
                    <tr key={x.id}>
                      <td>
                        <Link href={href(lang, `stations/${x.slug}`)}>
                          <b>{x.name}</b>
                        </Link>{" "}
                        {x.zone && <span className="zone">{x.zone}</span>}
                      </td>
                      <td>
                        <b className="num" style={{ color: wb.fg }}>
                          {x.aqi}
                        </b>
                      </td>
                      <td>
                        <Chip band={wb} label={lang === "hi" ? wb.hi : wb.k} />
                      </td>
                      <td>{x.prom ? <Pol n={x.prom} /> : "—"}</td>
                      <td className="num" style={{ fontSize: 13, color: "var(--ink-3)", whiteSpace: "nowrap" }}>
                        {stamp(x.time)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="tbl-foot">
            <span>
              {live.stations.length} {lang === "hi" ? "स्टेशन" : "stations"} ·{" "}
              {s.reporting} {lang === "hi" ? "रिपोर्ट कर रहे" : "reporting"}
            </span>
            <button className="btn" onClick={refresh} disabled={busy} style={{ padding: "5px 12px", fontSize: 12 }}>
              <RefreshIcon />
              {busy ? t(lang, "refreshing") : t(lang, "refresh")}
            </button>
          </div>
        </div>

        <div className="compare">
          <label htmlFor="cmp">{t(lang, "compare")}</label>
          <select id="cmp" value={hours} onChange={(e) => setHours(e.target.value)}>
            <option value="0">{t(lang, "compareNow")}</option>
            {HOURS.map(([key, h]) => (
              <option key={h} value={String(h)}>
                {t(lang, key as Parameters<typeof t>[1])}
              </option>
            ))}
          </select>
          {status === "loading" && <span className="res">…</span>}
          {status === "ok" && summary && (
            <span className="res">
              {lang === "hi" ? "उस समय से" : "vs"} {stamp(thenLabel)} →{" "}
              <span className="worse">
                ▲ {summary.worse} {t(lang, "compareWorse")}
              </span>{" "}
              ·{" "}
              <span className="better">
                ▼ {summary.better} {t(lang, "compareBetter")}
              </span>
              {summary.same > 0 && (
                <>
                  {" · ● "}
                  {summary.same} {t(lang, "compareSame")}
                </>
              )}
            </span>
          )}
          {status === "none" && <span className="res">{t(lang, "compareNone")}</span>}
        </div>

        <div className="filters" role="group" aria-label={t(lang, "stH")}>
          <button aria-pressed={filter === "All"} onClick={() => setFilter("All")}>
            {t(lang, "all")} <em>({counts.All})</em>
          </button>
          {SCALE.map((b) => (
            <button
              key={b.k}
              aria-pressed={filter === b.k}
              onClick={() => setFilter(b.k as Filter)}
              style={{ ["--c" as string]: b.hex }}
            >
              <i style={{ background: b.hex }} />
              {lang === "hi" ? b.hi : b.k} <em>({counts[b.k] ?? 0})</em>
            </button>
          ))}
          <button
            aria-pressed={filter === "Not reporting"}
            onClick={() => setFilter("Not reporting")}
            style={{ ["--c" as string]: "#94a3b8" }}
          >
            <i style={{ background: "#94a3b8" }} />
            {t(lang, "notReporting")} <em>({counts["Not reporting"] ?? 0})</em>
          </button>
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t(lang, "searchSt")}
            aria-label={t(lang, "searchSt")}
            autoComplete="off"
            style={{
              flex: "1 1 260px",
              maxWidth: 360,
              padding: "10px 14px",
              borderRadius: 999,
              border: "1px solid var(--line)",
              background: "var(--card)",
              font: "inherit",
              fontSize: 14,
            }}
          />
          <span style={{ alignSelf: "center", fontSize: 13, color: "var(--ink-3)" }}>
            {shown.length} / {live.stations.length}
          </span>
        </div>

        <div className="stations">
          {shown.map((x) => {
            const b = x.aqi == null ? null : band(x.aqi);
            const was = then?.[x.id];
            const pos = b ? Math.min(99, Math.max(1, (x.aqi! / 500) * 100)) : null;
            return (
              <Link
                key={x.id}
                className="st"
                href={href(lang, `stations/${x.slug}`)}
                style={{ ["--c" as string]: b?.hex ?? "#94a3b8" }}
              >
                <div className="row">
                  <div>
                    <b>{x.name}</b>
                    {x.zone && (
                      <>
                        <br />
                        <small>{x.zone}</small>
                      </>
                    )}
                  </div>
                  {b && <Chip band={b} label={lang === "hi" ? b.hi : b.k} />}
                </div>

                <div className="v num" style={{ color: b ? b.fg : "var(--ink-3)" }}>
                  {x.aqi ?? "—"}
                </div>

                <div className={`st-scale${x.aqi == null ? " off" : ""}`}>
                  <div className="st-bar">
                    {SCALE.map((c) => (
                      <i key={c.k} style={{ background: c.hex }}>
                        <span className="st-tip">
                          <em style={{ background: c.hex }} />
                          {lang === "hi" ? c.hi : c.k} · {c.min}–{c.max}
                        </span>
                      </i>
                    ))}
                  </div>
                  {was != null && was >= 0 && (
                    <span className="st-knob then" style={{ left: `${Math.min(99, Math.max(1, (was / 500) * 100))}%` }} title="Earlier" />
                  )}
                  {pos != null && <span className="st-knob" style={{ left: `${pos}%`, borderColor: b!.hex }} />}
                </div>

                <small style={{ color: "var(--ink-3)" }}>
                  {x.aqi != null ? (
                    <>
                      {lang === "hi" ? "मुख्य" : "Prominent"} {x.prom ? <Pol n={x.prom} /> : "—"}
                      {x.time && <> · {stamp(x.time)}</>}
                    </>
                  ) : (
                    <>{lang === "hi" ? "पिछले 2 घंटे में कोई रीडिंग नहीं" : "No reading in the last 2 hours"}</>
                  )}
                </small>
              </Link>
            );
          })}
          {!shown.length && (
            <p className="st-empty">
              {lang === "hi"
                ? `“${q}” से कोई स्टेशन नहीं मिला। रोहिणी या आईटीओ जैसा इलाका खोजें।`
                : `No station matches “${q}”. Try another name or district, like Dwarka or Shahdara.`}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
