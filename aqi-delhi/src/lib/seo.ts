import type { Metadata } from "next";
import type { Lang } from "./i18n";
import type { View } from "@/components/page-view";

type Entry = { title: string; description: string };

const EN: Record<Exclude<View, "station">, Entry> = {
  home: {
    title: "Delhi AQI Today: Live Air Quality & Health Advisory",
    description:
      "Check Delhi's live Air Quality Index, station-wise readings, lead pollutant, GRAP stage and health advisory.",
  },
  live: {
    title: "Live Air Quality Data for Delhi",
    description:
      "Delhi's live AQI, reporting stations, lead pollutant, GRAP stage and the most polluted monitoring stations right now, from CPCB's official readings, updated hourly.",
  },
  stations: {
    title: "Monitoring Stations: Station-wise Delhi AQI",
    description:
      "Live AQI at every Continuous Ambient Air Quality Monitoring Station (CAAQMS) in Delhi. Filter by category, search your area and compare with earlier readings.",
  },
  health: {
    title: "AQI Health Advisory: Precautions at Every Level",
    description:
      "What each AQI category means for your health, with precautions for everyone and for children, older adults and people with heart or lung disease.",
  },
  about: {
    title: "How Delhi's AQI Is Calculated",
    description:
      "How India's National Air Quality Index works, how Delhi's AQI is worked out from its stations, where the data comes from, how often it updates and how it differs from the US AQI.",
  },
  faq: {
    title: "Delhi Air Quality: Frequently Asked Questions",
    description:
      "Answers to common questions about Delhi's air: today's AQI, the worst stations, PM2.5 and PM10, how the AQI is calculated, update times and the GRAP stage.",
  },
  sameer: {
    title: "SAMEER App: AQI of Other Indian Cities",
    description:
      "Compare Delhi's air quality with other Indian cities, and get SAMEER, the Central Pollution Control Board's app for the National AQI.",
  },
};

const HI: Record<Exclude<View, "station">, Entry> = {
  home: {
    title: "दिल्ली AQI आज: लाइव वायु गुणवत्ता और स्वास्थ्य सलाह",
    description:
      "दिल्ली का लाइव वायु गुणवत्ता सूचकांक, स्टेशन-वार रीडिंग, मुख्य प्रदूषक, GRAP चरण और स्वास्थ्य सलाह देखें।",
  },
  live: {
    title: "दिल्ली का लाइव वायु गुणवत्ता डेटा",
    description: "दिल्ली का लाइव AQI, रिपोर्ट कर रहे स्टेशन, मुख्य प्रदूषक, GRAP चरण और अभी सबसे प्रदूषित स्टेशन।",
  },
  stations: {
    title: "दिल्ली में स्टेशन-वार AQI: लाइव निगरानी स्टेशन",
    description: "दिल्ली के हर निगरानी स्टेशन का लाइव AQI। श्रेणी के अनुसार छांटें और पिछली रीडिंग से तुलना करें।",
  },
  health: {
    title: "AQI स्वास्थ्य सलाह: हर स्तर पर सावधानियां",
    description: "हर AQI श्रेणी का स्वास्थ्य पर क्या असर होता है, और सभी तथा संवेदनशील लोगों के लिए सावधानियां।",
  },
  about: {
    title: "दिल्ली का AQI कैसे निकाला जाता है",
    description: "राष्ट्रीय वायु गुणवत्ता सूचकांक कैसे काम करता है और दिल्ली का AQI स्टेशनों से कैसे निकाला जाता है।",
  },
  faq: {
    title: "दिल्ली की वायु गुणवत्ता: अक्सर पूछे जाने वाले सवाल",
    description: "दिल्ली की हवा के आम सवालों के जवाब: आज का AQI, सबसे प्रदूषित स्टेशन, PM2.5 और GRAP चरण।",
  },
  sameer: {
    title: "समीर ऐप: अन्य भारतीय शहरों का AQI",
    description: "दिल्ली की वायु गुणवत्ता की तुलना अन्य भारतीय शहरों से करें, और CPCB का समीर ऐप पाएं।",
  },
};

const path = (lang: Lang, view: Exclude<View, "station">) => {
  const p = view === "home" ? "" : view;
  const base = lang === "hi" ? "/hi" : "";
  return `${base}/${p}`.replace(/\/+$/, "") || "/";
};

export function metaFor(lang: Lang, view: Exclude<View, "station">): Metadata {
  const e = (lang === "hi" ? HI : EN)[view];
  const url = path(lang, view);
  const other = path(lang === "hi" ? "en" : "hi", view);
  return {
    title: e.title,
    description: e.description,
    alternates: {
      canonical: url,
      languages: { en: path("en", view), hi: path("hi", view), "x-default": path("en", view) },
    },
    openGraph: {
      title: e.title,
      description: e.description,
      url: other,
      locale: lang === "hi" ? "hi_IN" : "en_IN",
      alternateLocale: lang === "hi" ? "en_IN" : "hi_IN",
    },
  };
}

export function stationMeta(lang: Lang, name: string, slug: string): Metadata {
  const title =
    lang === "hi"
      ? `${name} AQI आज: लाइव वायु गुणवत्ता`
      : `${name} AQI Today: Live Air Quality`;
  const description =
    lang === "hi"
      ? `दिल्ली के ${name} निगरानी स्टेशन का लाइव वायु गुणवत्ता सूचकांक, श्रेणी, मुख्य प्रदूषक, पास के स्टेशन और स्वास्थ्य सलाह।`
      : `Live Air Quality Index at the ${name} monitoring station in Delhi, with its category, prominent pollutant, last reading time, nearby stations and health advice.`;
  const base = lang === "hi" ? "/hi" : "";
  return {
    title,
    description,
    alternates: {
      canonical: `${base}/stations/${slug}`,
      languages: {
        en: `/stations/${slug}`,
        hi: `/hi/stations/${slug}`,
        "x-default": `/stations/${slug}`,
      },
    },
  };
}
