import { NextResponse } from "next/server";
import { weatherSnapshot } from "@/data/snapshot";

export const dynamic = "force-dynamic";

const BASE = "https://aqi.delhi.gov.in/api/v1/weather/public/current-conditions";

const ist = (ms: number) =>
  new Date(ms).toLocaleString("sv-SE", { timeZone: "Asia/Kolkata" }).replace(" ", "T");

const describe = (condition: string): [string, string] => {
  const c = (condition || "").toLowerCase();
  if (/thunder/.test(c)) return ["Thunderstorm", "आंधी-तूफ़ान"];
  if (/drizzle/.test(c)) return ["Drizzle", "बूंदाबांदी"];
  if (/rain|shower/.test(c)) return ["Rain", "बारिश"];
  if (/snow/.test(c)) return ["Snow", "बर्फ़"];
  if (/fog/.test(c)) return ["Fog", "कोहरा"];
  if (/mist/.test(c)) return ["Mist", "धुंध"];
  if (/haze/.test(c)) return ["Haze", "धुंध"];
  if (/smoke/.test(c)) return ["Smoke", "धुआँ"];
  if (/dust/.test(c)) return ["Dust", "धूल"];
  if (/overcast/.test(c)) return ["Overcast", "घने बादल"];
  if (/partly/.test(c)) return ["Partly cloudy", "आंशिक बादल"];
  if (/mainly clear/.test(c)) return ["Mainly clear", "ज़्यादातर साफ़"];
  if (/cloud/.test(c)) return ["Cloudy", "बादल"];
  if (/clear|sunny/.test(c)) return ["Clear sky", "साफ़ आसमान"];
  return [condition || "—", condition || "—"];
};

export async function GET() {
  const headers = { "cache-control": "public, s-maxage=900, stale-while-revalidate=1800" };
  try {
    const res = await fetch(`${BASE}?at=${encodeURIComponent(ist(Date.now() - 60_000))}`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(6500),
    });
    if (!res.ok) throw new Error(String(res.status));
    const json = await res.json();
    const p = json?.data?.point;
    if (!json?.success || p?.temperature_c == null) throw new Error("bad payload");
    return NextResponse.json(
      {
        temp: Math.round(Number(p.temperature_c)),
        hum: p.humidity_pct == null ? null : Math.round(Number(p.humidity_pct)),
        wind: p.wind_speed_kmh == null ? null : Number(p.wind_speed_kmh),
        vis: p.visibility_available && p.visibility_km != null ? Number(p.visibility_km) : null,
        sky: describe(String(p.condition || "")),
        station: String(p.source_station || "New Delhi-Safdarjung"),
      },
      { headers },
    );
  } catch {
    return NextResponse.json(weatherSnapshot, { headers: { "cache-control": "no-store" } });
  }
}
