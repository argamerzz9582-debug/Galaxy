import { notFound } from "next/navigation";
import Header from "./header";
import Footer from "./footer";
import { LangProvider } from "./lang-context";
import Home from "./pages/home";
import LiveView from "./live-view";
import Stations from "./pages/stations";
import StationPage from "./pages/station";
import Health from "./pages/health";
import About from "./pages/about";
import Sameer from "./pages/sameer";
import Faq from "./pages/faq";
import { getLive, getWeather } from "@/lib/data";
import type { Lang } from "@/lib/i18n";

export type View = "home" | "live" | "stations" | "station" | "health" | "about" | "faq" | "sameer";

export default async function PageView({
  lang,
  view,
  slug,
}: {
  lang: Lang;
  view: View;
  slug?: string;
}) {
  const live = await getLive();

  if (view === "station") {
    const station = live.stations.find((s) => s.slug === slug);
    if (!station) notFound();
    return (
      <LangProvider lang={lang}>
        <Header />
        <main id="main">
          <StationPage live={live} station={station} />
        </main>
        <Footer />
      </LangProvider>
    );
  }

  const weather = view === "home" ? await getWeather() : null;

  let body: React.ReactNode;
  switch (view) {
    case "home":
      body = <Home live={live} weather={weather!} />;
      break;
    case "live":
      body = <LiveView initial={live} />;
      break;
    case "stations":
      body = <Stations initial={live} />;
      break;
    case "health":
      body = <Health live={live} />;
      break;
    case "about":
      body = <About live={live} />;
      break;
    case "faq":
      body = <Faq live={live} />;
      break;
    case "sameer":
      body = <Sameer live={live} />;
      break;
    default:
      notFound();
  }

  return (
    <LangProvider lang={lang}>
      <Header />
      <main id="main">{body}</main>
      <Footer />
    </LangProvider>
  );
}
