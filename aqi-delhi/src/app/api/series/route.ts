import { NextRequest, NextResponse } from "next/server";
import { snapshot } from "@/data/snapshot";
import { normalise } from "@/lib/data";

export const dynamic = "force-dynamic";

const BASE = "https://aqi.delhi.gov.in/api/v1/aqi-analytics/public/live-aqi-at";

const ist = (ms: number) =>
  new Date(ms).toLocaleString("sv-SE", { timeZone: "Asia/Kolkata" }).replace(" ", "T");

/**
 * 24-hour history for one station, built by sampling the hourly public feed
 * once per hour (each upstream call is cached for an hour).
 */
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  const hours = Math.min(48, Math.max(2, Number(req.nextUrl.searchParams.get("hours")) || 24));
  const station = snapshot.stations.find((s) => s.slug === slug);

  const nowHour = Math.floor(Date.now() / 3_600_000) * 3_600_000;
  const slots = Array.from({ length: hours }, (_, i) => nowHour - (hours - 1 - i) * 3_600_000);

  const points = await Promise.all(
    slots.map(async (ms) => {
      try {
        const res = await fetch(`${BASE}?at=${encodeURIComponent(ist(ms))}`, {
          headers: { Accept: "application/json" },
          next: { revalidate: 3600 },
          signal: AbortSignal.timeout(5000),
        });
        if (!res.ok) return { time: new Date(ms).toISOString(), aqi: null };
        const json = await res.json();
        if (!json?.success) return { time: new Date(ms).toISOString(), aqi: null };
        if (station) {
          const live = normalise(json.data);
          const hit = live.stations.find((s) => s.id === station.id);
          return { time: new Date(ms).toISOString(), aqi: hit?.aqi ?? null };
        }
        return { time: new Date(ms).toISOString(), aqi: json.data?.delhi?.current_aqi ?? null };
      } catch {
        return { time: new Date(ms).toISOString(), aqi: null };
      }
    }),
  );

  return NextResponse.json(points.filter((p) => p.aqi != null), {
    headers: { "cache-control": "public, s-maxage=1800, stale-while-revalidate=3600" },
  });
}
