import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://aqi-delhi.vercel.app"),
  title: {
    default: "Delhi AQI Today: Live Air Quality & Health Advisory",
    template: "%s | Delhi AQI",
  },
  description:
    "Check Delhi's live Air Quality Index, station-wise readings, lead pollutant, GRAP stage and health advisory. An unofficial, non-commercial mirror of the Department of Environment, Government of NCT of Delhi portal.",
  applicationName: "Delhi AQI",
  keywords: ["Delhi AQI", "air quality index", "PM2.5", "GRAP", "CPCB", "DPCC"],
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.svg" },
  openGraph: {
    type: "website",
    siteName: "Delhi AQI",
    locale: "en_IN",
    images: [{ url: "/hero-delhi.jpg", width: 1536, height: 864, alt: "Delhi skyline at sunrise" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#efeee8",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN">
      <body>{children}</body>
    </html>
  );
}
