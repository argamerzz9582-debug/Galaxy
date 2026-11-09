import type { MetadataRoute } from "next";
import { snapshot } from "@/data/snapshot";

const BASE = "https://aqi-delhi.vercel.app";
const PAGES = ["", "live", "stations", "health", "about", "faq", "sameer"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];
  for (const p of PAGES) {
    for (const lang of ["", "/hi"] as const) {
      const url = `${BASE}${lang}/${p}`.replace(/\/+$/, "") || BASE;
      entries.push({
        url,
        lastModified: now,
        changeFrequency: "hourly",
        priority: p === "" ? 1 : 0.8,
        alternates: { languages: { en: `${BASE}/${p}`, hi: `${BASE}/hi/${p}` } },
      });
    }
  }
  for (const s of snapshot.stations) {
    entries.push({
      url: `${BASE}/stations/${s.slug}`,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 0.6,
    });
  }
  return entries;
}
