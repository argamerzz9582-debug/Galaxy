export function Seal({ className = "seal" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <circle cx="32" cy="32" r="30" fill="#f4f1e6" stroke="#c59546" strokeWidth="2" />
      <circle cx="32" cy="32" r="23.5" fill="none" stroke="#2f7a4a" strokeWidth="1" opacity=".55" />
      <path
        d="M32 12c7.4 6.2 10.6 12.7 10.6 20.4 0 7.6-4.7 12.6-10.6 19.6-5.9-7-10.6-12-10.6-19.6C21.4 24.7 24.6 18.2 32 12Z"
        fill="#2f7a4a"
        opacity=".92"
      />
      <path d="M32 56V27" stroke="#f4f1e6" strokeWidth="2" strokeLinecap="round" />
      <path d="M32 38c-4-1.6-6.2-4.4-6.6-8.2 4.2.6 6.4 3 6.6 8.2Z" fill="#f4f1e6" opacity=".85" />
      <path d="M32 34c3.6-1.4 5.6-3.9 6-7.4-3.8.5-5.8 2.7-6 7.4Z" fill="#f4f1e6" opacity=".85" />
      <circle cx="32" cy="32" r="30" fill="none" stroke="#9a5237" strokeWidth=".8" opacity=".5" />
    </svg>
  );
}

export function Chip({
  band,
  label,
}: {
  band: { hex: string; bg: string; fg: string };
  label: string;
}) {
  return (
    <span
      className="chip"
      style={
        {
          "--c": band.hex,
          "--cb": band.bg,
          "--cf": band.fg,
        } as React.CSSProperties
      }
    >
      {label}
    </span>
  );
}

/** Renders PM2.5 / PM10 with a proper subscript. */
export function Pol({ n }: { n?: string | null }) {
  if (!n) return <>—</>;
  const m = /^PM(2\.5|10)$/.exec(n);
  if (!m) return <>{n}</>;
  return (
    <>
      PM<sub>{m[1]}</sub>
    </>
  );
}

export function Spinner({ label }: { label: string }) {
  return (
    <span className="loading" role="status">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path d="M21 12a9 9 0 1 1-6.2-8.6" />
      </svg>
      <small>{label}</small>
    </span>
  );
}

export function StoreBadge({ kind, href }: { kind: "play" | "ios"; href: string }) {
  const play =
    "M3.6 2.3 13.4 12l-9.8 9.7c-.4-.2-.6-.6-.6-1.1V3.4c0-.5.2-.9.6-1.1zm11 10.9 2.6 2.6-11.6 6.6 9-9.2zm3.9-3.2 2.7 1.5c.8.5.8 1.6 0 2.1l-2.7 1.5-2.9-2.6 2.9-2.5zM5.6 1.6l11.6 6.6-2.6 2.6-9-9.2z";
  const apple =
    "M16.4 12.6c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.4-.9-1.7 0-3.3 1-4.2 2.6-1.8 3.1-.5 7.7 1.3 10.2.9 1.2 1.9 2.6 3.2 2.6 1.3-.1 1.8-.8 3.3-.8 1.6 0 2 .8 3.4.8 1.4 0 2.3-1.3 3.1-2.5 1-1.4 1.4-2.8 1.4-2.9-.1 0-2.7-1-2.7-4.1zM13.9 5c.7-.9 1.2-2 1.1-3.2-1 0-2.3.7-3 1.6-.7.8-1.2 2-1.1 3.1 1.1.1 2.3-.6 3-1.5z";
  const isPlay = kind === "play";
  return (
    <a className="store" href={href} target="_blank" rel="noopener">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d={isPlay ? play : apple} />
      </svg>
      <span>
        <small>{isPlay ? "GET IT ON" : "Download on the"}</small>
        <b>{isPlay ? "Google Play" : "App Store"}</b>
      </span>
    </a>
  );
}

export function RefreshIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M20 11a8 8 0 1 0-2.3 5.7" />
      <path d="M20 5v6h-6" />
    </svg>
  );
}

export function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8h.01M11 12h1v4h1" />
    </svg>
  );
}
