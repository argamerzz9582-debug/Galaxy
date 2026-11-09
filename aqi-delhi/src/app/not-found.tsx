import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { LangProvider } from "@/components/lang-context";

export const metadata = { title: "Page Not Found" };

export default function NotFound() {
  return (
    <LangProvider lang="en">
      <Header />
      <main id="main">
        <div className="wrap gutter view" style={{ minHeight: "46vh" }}>
          <p
            style={{
              fontSize: 12,
              letterSpacing: ".18em",
              textTransform: "uppercase",
              color: "var(--ink-3)",
              fontWeight: 700,
              margin: "30px 0 6px",
            }}
          >
            Delhi Air Quality
          </p>
          <h1 style={{ fontSize: "clamp(56px,12vw,110px)", lineHeight: 1, margin: "0 0 10px" }}>404</h1>
          <h2 style={{ marginBottom: 10 }}>Page Not Found</h2>
          <p className="lede">
            Sorry, the page you&apos;re looking for does not exist or may have been moved.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link className="btn solid" href="/">
              Back to Home
            </Link>
            <Link className="btn" href="/stations">
              AQI by station
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </LangProvider>
  );
}
