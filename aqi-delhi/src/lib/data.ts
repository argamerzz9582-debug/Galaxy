import { snapshot, weatherSnapshot, type Live, type Station } from "@/data/snapshot";

const BASE = "https://aqi.delhi.gov.in/api/v1/aqi-analytics/public";
const AQI_EP = `${BASE}/live-aqi-at`;
const WEATHER_EP = `${BASE}/weather/current-conditions`;

/** The upstream expects the `at` instant in IST without an offset suffix. */
const istParam = (ms: number) =>
  new Date(ms).toLocaleString("sv-SE", { timeZone: "Asia/Kolkata" }).replace(" ", "T");

const prettyPollutant = (p?: string | null) => {
  if (!p) return null;
  const map: Record<string, string> = {
    OZONE: "O₃",
    O3: "O₃",
    NO2: "NO₂",
    SO2: "SO₂",
    NH3: "NH₃",
  };
  return map[p.toUpperCase()] || p;
};

type Raw = {
  delhi: Record<string, unknown>;
  last_updated: string;
  reporting_stations_count: number;
  total_stations_count: number;
  legend_counts: Record<string, number>;
  stations: Array<Record<string, unknown>>;
};

const slugify = (name: string) =>
  name.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const ZONES = Object.fromEntries(snapshot.stations.map((s) => [s.name.toLowerCase(), s.zone]));

export function normalise(raw: Raw): Live {
  const counts: Record<string, number> = {};
  for (const s of raw.stations) {
    const k = slugify(String(s.station_name));
    counts[k] = (counts[k] || 0) + 1;
  }
  const stations: Station[] = raw.stations.map((s) => {
    const name = String(s.station_name);
    const base = slugify(name);
    const report = s.is_reporting !== false && s.aqi_value != null;
    return {
      id: String(s.station_id),
      name,
      lat: Number(s.latitude),
      lon: Number(s.longitude),
      aqi: s.aqi_value == null ? null : Math.round(Number(s.aqi_value)),
      prom: prettyPollutant(s.predominant_pollutant as string | null),
      time: (s.last_reading_time as string | null) ?? null,
      reporting: report,
      zone: ZONES[name.toLowerCase()] ?? null,
      slug:
        counts[base] > 1
          ? `${base}-${String(s.station_id).replace(/[^a-z0-9]/gi, "").slice(0, 6).toLowerCase()}`
          : base,
    };
  });

  const d = raw.delhi as {
    current_aqi: number;
    category: string;
    reporting_stations: number;
    vs_yesterday_diff: number | null;
    vs_yesterday_status: string | null;
    lead_sub_index_param: string | null;
    lead_sub_index_station_count: number;
    grap_stage: string;
    grap_headroom: number | null;
  };

  return {
    city: { aqi: Math.round(d.current_aqi), time: raw.last_updated },
    summary: {
      current_aqi: Math.round(d.current_aqi),
      category: d.category,
      reporting: raw.reporting_stations_count,
      total: raw.total_stations_count,
      vs_yesterday_diff: d.vs_yesterday_diff,
      vs_yesterday_status: d.vs_yesterday_status,
      lead: prettyPollutant(d.lead_sub_index_param),
      lead_sub_index_station_count: d.lead_sub_index_station_count,
      grap_stage: d.grap_stage,
      grap_headroom: d.grap_headroom,
      legend: raw.legend_counts,
    },
    stations,
    stale: false,
  };
}

async function callApi(at: number, revalidate: number): Promise<Live | null> {
  try {
    const res = await fetch(`${AQI_EP}?at=${encodeURIComponent(istParam(at))}`, {
      headers: { Accept: "application/json" },
      next: { revalidate },
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (!json?.success || !json.data?.delhi) return null;
    return normalise(json.data as Raw);
  } catch {
    return null;
  }
}

/** City + station reading for right now, falling back to the bundled snapshot. */
export async function getLive(): Promise<Live> {
  const live = await callApi(Date.now() - 60_000, 120);
  return live ?? snapshot;
}

export async function getWeather() {
  try {
    const res = await fetch(
      `${WEATHER_EP}?at=${encodeURIComponent(istParam(Date.now() - 60_000))}`,
      { headers: { Accept: "application/json" }, next: { revalidate: 900 } },
    );
    if (!res.ok) return weatherSnapshot;
    const json = await res.json();
    const p = json?.data?.point;
    if (!json?.success || p?.temperature_c == null) return weatherSnapshot;
    const condition = String(p.condition || "");
    const t = condition.toLowerCase();
    const sky: [string, string] = /fog/.test(t)
      ? ["Fog", "कोहरा"]
      : /mist/.test(t)
        ? ["Mist", "धुंध"]
        : /haze/.test(t)
          ? ["Haze", "धुंध"]
          : /smoke/.test(t)
            ? ["Smoke", "धुआँ"]
            : /dust/.test(t)
              ? ["Dust", "धूल"]
              : /thunder/.test(t)
                ? ["Thunderstorm", "आंधी-तूफ़ान"]
                : /drizzle/.test(t)
                  ? ["Drizzle", "बूंदाबांदी"]
                  : /rain|shower/.test(t)
                    ? ["Rain", "बारिश"]
                    : /overcast/.test(t)
                      ? ["Overcast", "घने बादल"]
                      : /partly/.test(t)
                        ? ["Partly cloudy", "आंशिक बादल"]
                        : /cloud/.test(t)
                          ? ["Cloudy", "बादल"]
                          : ["Clear sky", "साफ़ आसमान"];
    return {
      temp: Math.round(Number(p.temperature_c)),
      hum: p.humidity_pct == null ? null : Math.round(Number(p.humidity_pct)),
      wind: p.wind_speed_kmh == null ? null : Number(p.wind_speed_kmh),
      vis: p.visibility_available && p.visibility_km != null ? Number(p.visibility_km) : null,
      sky,
      station: String(p.source_station || "New Delhi-Safdarjung"),
    };
  } catch {
    return weatherSnapshot;
  }
}

/* ---------- 24-hour city series ---------- */

const seriesMemo = new Map<string, { at: number; promise: Promise<Array<{ time: string; aqi: number | null }>> }>();

export function hourlySeries(hours = 24) {
  const nowHour = Math.floor(Date.now() / 3_600_000) * 3_600_000;
  const key = String(nowHour);
  const hit = seriesMemo.get(key);
  if (hit && Date.now() - hit.at < 10 * 60_000) return hit.promise;

  const promise = (async () => {
    const slots = Array.from({ length: hours }, (_, i) => nowHour - (hours - 1 - i) * 3_600_000);
    const results = await Promise.all(
      slots.map(async (t) => {
        const live = await callApi(t, 3_600);
        return { time: new Date(t).toISOString(), aqi: live ? live.city.aqi : null };
      }),
    );
    return results;
  })();

  seriesMemo.set(key, { at: Date.now(), promise });
  return promise;
}

export function stationBySlug(live: Live, slug: string) {
  return live.stations.find((s) => s.slug === slug) ?? null;
}

export function nearby(live: Live, station: Station, count = 5) {
  return live.stations
    .filter((s) => s.id !== station.id && Number.isFinite(s.lat))
    .map((s) => ({
      ...s,
      d: Math.sqrt(
        ((s.lat - station.lat) * 111.32) ** 2 +
          ((s.lon - station.lon) * 111.32 * Math.cos((station.lat * Math.PI) / 180)) ** 2,
      ),
    }))
    .sort((a, b) => a.d - b.d)
    .slice(0, count);
}

export type { Live, Station };
