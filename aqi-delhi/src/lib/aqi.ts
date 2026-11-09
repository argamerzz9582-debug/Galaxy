export type Band = {
  k: string;
  hi: string;
  min: number;
  max: number;
  hex: string;
  bg: string;
  fg: string;
  impact: string;
};

export const SCALE: Band[] = [
  {
    k: "Good",
    hi: "अच्छा",
    min: 0,
    max: 50,
    hex: "#1f9a4a",
    bg: "#e6f5ec",
    fg: "#146b33",
    impact: "Minimal impact",
  },
  {
    k: "Satisfactory",
    hi: "संतोषजनक",
    min: 51,
    max: 100,
    hex: "#8cc63f",
    bg: "#eef7e0",
    fg: "#4a7417",
    impact: "Minor breathing discomfort to sensitive people",
  },
  {
    k: "Moderate",
    hi: "मध्यम",
    min: 101,
    max: 200,
    hex: "#e0a800",
    bg: "#fdf4d6",
    fg: "#8a6400",
    impact:
      "Breathing discomfort to people with lung disease such as asthma, and to people with heart disease, children and older adults",
  },
  {
    k: "Poor",
    hi: "खराब",
    min: 201,
    max: 300,
    hex: "#f08a24",
    bg: "#fde8d3",
    fg: "#9a4d05",
    impact: "Breathing discomfort to most people on prolonged exposure",
  },
  {
    k: "Very Poor",
    hi: "बहुत खराब",
    min: 301,
    max: 400,
    hex: "#d93a2b",
    bg: "#fbe0dd",
    fg: "#a32518",
    impact: "Respiratory illness on prolonged exposure",
  },
  {
    k: "Severe",
    hi: "गंभीर",
    min: 401,
    max: 500,
    hex: "#8e1b2e",
    bg: "#f3dde1",
    fg: "#8e1b2e",
    impact: "Affects healthy people and seriously impacts those with existing diseases",
  },
];

export const NOT_REPORTING = {
  k: "Not reporting",
  hi: "रिपोर्ट नहीं",
  hex: "#94a3b8",
  bg: "rgba(148,163,184,.18)",
  fg: "#64748b",
};

export const band = (aqi: number) => SCALE.find((b) => aqi <= b.max) || SCALE[5];
export const bandIndex = (aqi: number) => SCALE.indexOf(band(aqi));

/** Soft warning line under the big number, keyed to the band. */
export const quips = [
  "What fresh air today!",
  "Nice air — enjoy it!",
  "Sensitive? Go easy outside.",
  "Mask up outdoors!",
  "Stay in, run the purifier.",
  "Avoid going out today.",
];

export const ADVICE = [
  {
    impact: "Minimal impact.",
    gen: [
      "Air is clean. Outdoor exercise, school sports and open windows are all fine.",
      "A good day to walk or cycle instead of driving.",
    ],
    sen: ["No precautions needed."],
  },
  {
    impact: "Minor breathing discomfort for sensitive people.",
    gen: [
      "Outdoor activity is fine for almost everyone.",
      "Air out your home in the afternoon when dispersion is best.",
    ],
    sen: ["People with asthma should keep their reliever inhaler handy."],
  },
  {
    impact:
      "Breathing discomfort for people with lung or heart disease, children and older adults.",
    gen: [
      "Most people can carry on as usual, but cut back on long or intense outdoor workouts.",
      "Prefer the metro or carpooling to cut vehicle emissions.",
    ],
    sen: [
      "Do not burn leaves or garbage; report open burning on the Green Delhi app.",
      "Limit prolonged outdoor exertion, especially in the early morning and late evening.",
      "Children and older adults should take breaks during outdoor play.",
    ],
  },
  {
    impact: "Breathing discomfort for most people on prolonged exposure.",
    gen: [
      "Wear a well-fitted N95 mask outdoors.",
      "Move workouts indoors and keep windows closed in the morning and night.",
      "Run an air purifier in bedrooms if you have one.",
    ],
    sen: ["Avoid outdoor exertion entirely.", "Schools should shift sports and assemblies indoors."],
  },
  {
    impact: "Respiratory illness on prolonged exposure.",
    gen: [
      "Avoid outdoor activity. Wear an N95 if you must go out.",
      "Keep doors and windows shut; use purifiers.",
      "Work from home where possible.",
    ],
    sen: ["Stay indoors. Consult a doctor if symptoms worsen."],
  },
  {
    impact: "Affects healthy people; serious impact on those with existing diseases.",
    gen: [
      "Stay indoors and avoid all physical activity outside.",
      "Follow GRAP Stage III/IV orders on vehicles and construction.",
    ],
    sen: [
      "Stay indoors. Seek medical care promptly for chest tightness or breathlessness.",
      "Emergency: dial 102 / 108.",
    ],
  },
];

/** "09:00 IST · 9 Nov" — the reading's own hour, in Delhi time. */
export const stamp = (iso: string | null, withDate = false) => {
  if (!iso) return "—";
  const d = new Date(iso);
  const time = d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Kolkata",
  });
  const date = withDate
    ? " · " +
      d.toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "Asia/Kolkata" })
    : "";
  return `${time} IST${date}`;
};

/** "As of 09:00 IST on 9 November 2026" */
export const longStamp = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Kolkata",
  }) +
  " IST on " +
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });

export const isDelayed = (iso: string | null) =>
  !iso || Date.now() - +new Date(iso) > 2 * 60 * 60 * 1000;

/** Position of an AQI value on the 0–500 strip, as a percentage. */
export const scalePos = (aqi: number) => {
  const b = band(aqi);
  const t = (aqi - b.min) / (b.max - b.min + 1);
  return Math.min(99.4, Math.max(0.6, SCALE.indexOf(b) * (100 / 6) + (t * 100) / 6));
};

export const haversine = (
  a: { lat: number; lon: number },
  b: { lat: number; lon: number },
) => {
  const R = 6371;
  const rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad;
  const dLon = (b.lon - a.lon) * rad;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(h));
};

export const POLLUTANTS = ["PM2.5", "PM10", "NO₂", "SO₂", "CO", "O₃", "NH₃", "Pb"];
