import { NextRequest, NextResponse } from "next/server";
import { snapshot, type Live } from "@/data/snapshot";
import { normalise } from "@/lib/data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const BASE = "https://aqi.delhi.gov.in/api/v1/aqi-analytics/public/live-aqi-at";

/** Upstream wants the instant in IST with no offset, e.g. 2026-11-09T09:45:00 */
const ist = (ms: number) =>
  new Date(ms).toLocaleString("sv-SE", { timeZone: "Asia/Kolkata" }).replace(" ", "T");

export async function GET(req: NextRequest) {
  const at = req.nextUrl.searchParams.get("at");
  const when = at ? Math.min(Date.parse(at), Date.now() - 60_000) : Date.now() - 60_000;
  const target = Number.isFinite(when) ? when : Date.now() - 60_000;

  const headers = { "cache-control": "public, s-maxage=90, stale-while-revalidate=240" };

  try {
    const res = await fetch(`${BASE}?at=${encodeURIComponent(ist(target))}`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(6500),
    });
    if (!res.ok) throw new Error(String(res.status));
    const json = await res.json();
    if (!json?.success || !json.data?.delhi) throw new Error("bad payload");
    const live: Live = normalise(json.data);
    return NextResponse.json(live, { headers });
  } catch {
    // Upstream unreachable: serve the bundled snapshot (only meaningful for "now").
    const body: Live = at ? { ...snapshot, stations: snapshot.stations } : snapshot;
    return NextResponse.json(body, { headers: { "cache-control": "no-store" } });
  }
}
