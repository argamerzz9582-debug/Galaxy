"use client";

import { useEffect, useRef, useState } from "react";
import { t } from "@/lib/i18n";
import { useLang } from "./lang-context";

export type Weather = {
  temp: number;
  hum: number | null;
  wind: number | null;
  vis: number | null;
  sky: [string, string];
  station: string;
};

const LEAVES = (seed: number) => {
  let p = seed;
  const rnd = () => (p = (p * 9301 + 49297) % 233280) / 233280;
  return Array.from({ length: 5 }, () => ({
    left: `${18 + rnd() * 78}%`,
    "--d": `${6 + rnd() * 5}s`,
    "--dl": `${-rnd() * 9}s`,
    "--dx": `${-30 + rnd() * 60}px`,
  }));
};

export default function WeatherCard({ initial }: { initial: Weather }) {
  const lang = useLang();
  const [w, setW] = useState(initial);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch("/api/weather")
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (alive && j?.temp != null) setW(j);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const sky = lang === "hi" ? w.sky[1] : w.sky[0];
  const fog = /fog|mist|haze/i.test(sky);

  return (
    <div className="wx">
      <div className="wx-top">
        <div>
          <small>{t(lang, "weatherIn")}</small>
          <b>{w.station.replace("New Delhi-", "")}</b>
        </div>
        <span style={{ fontSize: 11, color: "#5d6f78" }}>IMD</span>
      </div>

      <div className="wx-temp">
        <span className="t num">{w.temp}°C</span>
        <div>
          <div className="sky">{sky}</div>
          <div style={{ fontSize: 11.5, color: "#5d6f78" }}>{w.station}</div>
        </div>
        <svg className="wx-art" viewBox="0 0 100 100" aria-hidden="true" style={{ marginLeft: "auto" }}>
          <defs>
            <linearGradient id="sun" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#f6c86a" />
              <stop offset="1" stopColor="#e8a24b" />
            </linearGradient>
          </defs>
          <circle cx="52" cy="42" r="17" fill="url(#sun)" opacity={fog ? 0.65 : 0.95} />
          {[58, 68, 78].map((y, i) => (
            <path
              key={y}
              d={`M6 ${y} h${68 - i * 8} a${9 - i} ${9 - i} 0 0 0 ${-(9 - i) * 2} 0 h${-(68 - i * 8)} a${9 - i} ${9 - i} 0 0 0 ${(9 - i) * 2} 0z`}
              fill="#ffffff"
              opacity={0.22 + i * 0.12}
            />
          ))}
        </svg>
      </div>

      <div className="wx-facts">
        <div>
          <span>{t(lang, "hum")}</span>
          <b className="num">{w.hum == null ? "—" : `${w.hum}%`}</b>
        </div>
        <div>
          <span>{t(lang, "wind")}</span>
          <b className="num">{w.wind == null ? "—" : `${w.wind} km/h`}</b>
        </div>
        <div>
          <span>{t(lang, "vis")}</span>
          <b className="num">{w.vis == null ? "—" : `${w.vis} km`}</b>
        </div>
        <button
          className="btn"
          style={{ marginLeft: "auto", padding: "6px 12px", fontSize: 12 }}
          onClick={() => {
            setBusy(true);
            fetch("/api/weather", { cache: "no-store" })
              .then((r) => (r.ok ? r.json() : null))
              .then((j) => j?.temp != null && setW(j))
              .finally(() => setBusy(false));
          }}
          disabled={busy}
        >
          {busy ? "…" : t(lang, "refresh")}
        </button>
      </div>
    </div>
  );
}

export function Leadership({
  people,
  title,
}: {
  people: Array<{ img: string; alt: string; role: string; name: string; dept: string; fallback: string }>;
  title: string;
}) {
  const lang = useLang();
  const [active, setActive] = useState(-1);
  const [pop, setPop] = useState(false);
  const root = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setPop(true)),
      { threshold: 0.35 },
    );
    if (root.current) io.observe(root.current);
    return () => io.disconnect();
  }, []);

  return (
    <section className="leadband" aria-labelledby="leadH" ref={root}>
      <div className="wrap gutter" style={{ paddingTop: 34, paddingBottom: 38 }}>
        <h2 className="kicker" id="leadH">
          {title}
        </h2>
        <div className="leaders">
          {people.map((p, i) => (
            <Leader key={p.name} p={p} lang={lang} active={active === i} pop={pop} onToggle={() => setActive(active === i ? -1 : i)} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Leader({
  p,
  lang,
  active,
  pop,
  onToggle,
}: {
  p: { img: string; alt: string; role: string; name: string; dept: string; fallback: string };
  lang: "en" | "hi";
  active: boolean;
  pop: boolean;
  onToggle: () => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState(false);
  const leaves = useRef(LEAVES(p.name.length * 97 + 7)).current;

  const move = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    setTilt(true);
    el.style.setProperty("--ry", `${((x - 0.5) * 10).toFixed(2)}deg`);
    el.style.setProperty("--rx", `${((0.5 - y) * 8).toFixed(2)}deg`);
    el.style.setProperty("--mx", `${x * 100}%`);
    el.style.setProperty("--my", `${y * 100}%`);
  };
  const leave = () => {
    const el = ref.current;
    if (!el) return;
    setTilt(false);
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <div
      ref={ref}
      className={["leader", active && "active", tilt && "tilting", pop && "pop"].filter(Boolean).join(" ")}
      tabIndex={0}
      role="button"
      aria-pressed={active}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle();
        }
      }}
      onPointerMove={move}
      onPointerLeave={leave}
    >
      <span className="glare" />
      <span className="shine" />
      <div className="phr">
        <div className="ph">
          <span className="imz">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.img} alt={p.alt} loading="lazy" />
          </span>
        </div>
      </div>
      <div className="tx">
        <span className="role">{p.role}</span>
        <span className="nm">{p.name}</span>
        <span className="dept">{p.dept}</span>
      </div>
      {leaves.map((s, i) => (
        <i key={i} className="lf" style={s as React.CSSProperties} />
      ))}
    </div>
  );
}
