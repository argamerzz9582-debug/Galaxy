"use client";

import Link from "next/link";
import { band } from "@/lib/aqi";
import { href, t } from "@/lib/i18n";
import type { Live } from "@/data/snapshot";
import { useLang } from "../lang-context";

export default function Faq({ live }: { live: Live }) {
  const lang = useLang();
  const s = live.summary;
  const b = band(live.city.aqi);
  const top = [...live.stations]
    .filter((x) => x.aqi != null)
    .sort((a, c) => (c.aqi ?? 0) - (a.aqi ?? 0))
    .slice(0, 3);

  const asOf =
    lang === "hi"
      ? `${new Date(live.city.time).toLocaleDateString("hi-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" })} को ${new Date(live.city.time).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Kolkata" })} IST`
      : `${new Date(live.city.time).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Kolkata" })} IST on ${new Date(live.city.time).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" })}`;

  const items: Array<{ q: string; a: React.ReactNode; link?: [string, string] }> =
    lang === "hi"
      ? [
          {
            q: "दिल्ली का AQI अभी क्या है, और इस श्रेणी का क्या मतलब है?",
            a: (
              <>
                {asOf} दिल्ली का AQI भारत के राष्ट्रीय AQI पैमाने पर <b>{live.city.aqi}</b> ({b.hi}) है। {s.total} में से{" "}
                {s.reporting} स्टेशन रिपोर्ट कर रहे हैं
                {s.lead ? `, और ${s.lead_sub_index_station_count} स्टेशनों पर ${s.lead} मुख्य प्रदूषक है` : ""}।
                {s.vs_yesterday_diff != null && <> यह कल इसी समय से {Math.abs(s.vs_yesterday_diff)} अंक {s.vs_yesterday_diff > 0 ? "ज़्यादा" : "कम"} है।</>}{" "}
                &ldquo;{b.hi}&rdquo; का मतलब: लंबे संपर्क से सांस की बीमारी।
              </>
            ),
            link: ["", "होम पर लाइव AQI →"],
          },
          {
            q: "अभी सबसे ज़्यादा AQI किन स्टेशनों पर है?",
            a: (
              <>
                {asOf} सबसे ज़्यादा AQI {top.map((x) => `${x.name} (${x.aqi})`).join(", ")} पर है। हर स्टेशन स्टेशन पेज पर
                सूचीबद्ध है।
              </>
            ),
            link: ["stations", "सभी निगरानी स्टेशन →"],
          },
          {
            q: "आज की तुलना कल से कैसे करें?",
            a: (
              <>
                दिल्ली का AQI कल इसी समय से {s.vs_yesterday_diff == null ? "—" : Math.abs(s.vs_yesterday_diff)} अंक{" "}
                {(s.vs_yesterday_diff ?? 0) > 0 ? "ज़्यादा (खराब)" : "कम (बेहतर)"} है। हर स्टेशन की पिछली रीडिंग से तुलना के लिए
                स्टेशन पेज पर &ldquo;पिछली रीडिंग से तुलना&rdquo; चुनें।
              </>
            ),
          },
          {
            q: "PM2.5 और PM10 क्या हैं?",
            a: (
              <>
                2.5 और 10 माइक्रोमीटर से छोटे कण PM2.5 और PM10 कहलाते हैं। PM10 में सड़क और निर्माण की धूल आती है; PM2.5
                मुख्यतः दहन से — वाहन, उद्योग, कूड़ा और पराली जलाना — और फेफड़ों की गहराई तक पहुंचता है। दोनों माइक्रोग्राम प्रति
                घन मीटर (µg/m³) में मापे जाते हैं।
              </>
            ),
          },
          {
            q: "भारत का AQI कैसे निकाला जाता है, और US AQI से कैसे अलग है?",
            a: (
              <>
                हर स्टेशन आठ प्रदूषक (PM2.5, PM10, NO₂, SO₂, CO, O₃, NH₃ और Pb) मापता है। हर सांद्रता का उप-सूचकांक बनता है,
                और स्टेशन का AQI सबसे ऊंचा उप-सूचकांक होता है, बशर्ते कम से कम तीन प्रदूषक — जिनमें PM2.5 या PM10 हो — उपलब्ध हों।
                इस साइट पर दिल्ली का AQI रिपोर्ट कर रहे स्टेशनों का औसत है। US AQI के ब्रेकपॉइंट अलग हैं, इसलिए दोनों संख्याओं की
                सीधी तुलना नहीं की जा सकती।
              </>
            ),
            link: ["about", "AQI के बारे में →"],
          },
          {
            q: "रीडिंग कितनी बार अपडेट होती हैं?",
            a: (
              <>
                स्टेशन हर घंटे रिपोर्ट करते हैं। यह साइट हर कुछ मिनट में नई रीडिंग जांचती है और बताती है कि मान किस घंटे का है।
                पिछले 2 घंटे में रीडिंग न आने पर स्टेशन पुराने मान के बजाय &ldquo;रिपोर्ट नहीं&rdquo; दिखाया जाता है।
              </>
            ),
          },
          {
            q: "स्टेशनों के आंकड़े अलग क्यों होते हैं?",
            a: (
              <>
                हर स्टेशन अपने आसपास की हवा मापता है। व्यस्त चौराहे, औद्योगिक इलाके, निर्माण, कूड़ा जलाना और खुली धूल भरी ज़मीन
                स्थानीय रीडिंग बढ़ाते हैं, जबकि हरे-भरे या आवासीय इलाकों में अक्सर कम होती है। हवा, तापमान और दिन का समय भी
                प्रदूषण के जमाव को बदलते हैं।
              </>
            ),
          },
          {
            q: "GRAP का कौन सा चरण लागू है?",
            a: (
              <>
                लाइव फ़ीड के अनुसार GRAP की स्थिति है: {s.grap_stage}। ग्रेडेड रिस्पॉन्स एक्शन प्लान (GRAP) के चरण वायु गुणवत्ता
                प्रबंधन आयोग (CAQM) लागू करता है: चरण I (AQI 201–300), चरण II (301–400), चरण III (401–450) और चरण IV (450 से
                ऊपर)। लागू प्रतिबंधों के लिए नवीनतम CAQM आदेश देखें।
              </>
            ),
            link: ["https://caqm.nic.in/", "CAQM आदेश ↗"],
          },
        ]
      : [
          {
            q: "What is Delhi's AQI now, and what does the category mean?",
            a: (
              <>
                As of {asOf}, Delhi&apos;s AQI is <b>{live.city.aqi}</b> ({b.k}) on India&apos;s National AQI scale.{" "}
                {s.reporting} of {s.total} stations are reporting
                {s.lead ? `, and ${s.lead} is the lead pollutant at ${s.lead_sub_index_station_count} of them` : ""}.
                {s.vs_yesterday_diff != null && <> The AQI is {Math.abs(s.vs_yesterday_diff)} points {s.vs_yesterday_diff > 0 ? "higher" : "lower"} than at the same hour yesterday.</>}{" "}
                &ldquo;{b.k}&rdquo; means: {b.impact}.
              </>
            ),
            link: ["", "Live AQI on the home page →"],
          },
          {
            q: "Which stations are highest right now?",
            a: (
              <>
                At {asOf}, the highest AQI is at {top.map((x) => `${x.name} (${x.aqi})`).join(", ")}. Every station is listed
                on the stations page.
              </>
            ),
            link: ["stations", "All monitoring stations →"],
          },
          {
            q: "How does today compare with yesterday?",
            a: (
              <>
                Delhi&apos;s AQI is {s.vs_yesterday_diff == null ? "unavailable" : Math.abs(s.vs_yesterday_diff)} points{" "}
                {(s.vs_yesterday_diff ?? 0) > 0 ? "higher (worse)" : "lower (better)"} than at the same hour yesterday. To
                compare each station with an earlier reading, use &ldquo;Compare with earlier&rdquo; on the stations page.
              </>
            ),
          },
          {
            q: "What are PM2.5 and PM10?",
            a: (
              <>
                PM2.5 and PM10 are particles in the air smaller than 2.5 and 10 micrometres across. PM10 includes road and
                construction dust; PM2.5 comes mostly from combustion, such as vehicles, industry and the burning of waste and
                crop residue, and can reach deep into the lungs. Both are measured in micrograms per cubic metre (µg/m³).
              </>
            ),
          },
          {
            q: "How is India's AQI calculated, and how does it differ from the US AQI?",
            a: (
              <>
                Each station measures up to eight pollutants (PM2.5, PM10, NO₂, SO₂, CO, O₃, NH₃ and Pb). Each concentration is
                converted to a sub-index, and the station&apos;s AQI is the highest sub-index, provided at least three
                pollutants, including PM2.5 or PM10, are available. Delhi&apos;s AQI on this site is the average of the
                reporting stations. The US AQI uses different breakpoints, so the two numbers cannot be compared directly.
              </>
            ),
            link: ["about", "About the AQI →"],
          },
          {
            q: "How often are readings updated?",
            a: (
              <>
                Stations report every hour. This site checks for a new reading every few minutes and shows the hour each value
                is for. A station with no reading in the last 2 hours is shown as not reporting rather than with an old value.
              </>
            ),
          },
          {
            q: "Why do stations differ?",
            a: (
              <>
                Each station measures the air around it. Traffic junctions, industrial areas, construction, waste burning and
                open dusty land raise local readings, while green or residential areas are often lower. Wind, temperature and
                the time of day also change how pollution builds up across the city.
              </>
            ),
          },
          {
            q: "What GRAP stage is in force?",
            a: (
              <>
                According to the live feed, the GRAP status is: {s.grap_stage}. Stages of the Graded Response Action Plan (GRAP)
                are invoked by the Commission for Air Quality Management (CAQM): Stage I (AQI 201–300), Stage II (301–400),
                Stage III (401–450) and Stage IV (above 450). See the latest CAQM order for the restrictions in force.
              </>
            ),
            link: ["https://caqm.nic.in/", "CAQM orders ↗"],
          },
        ];

  return (
    <section>
      <div className="wrap gutter view faq">
        <h1>{lang === "hi" ? "दिल्ली की वायु गुणवत्ता: अक्सर पूछे जाने वाले सवाल" : "Delhi air quality: frequently asked questions"}</h1>
        <p className="lede">
          {lang === "hi"
            ? "लाइव आंकड़ों वाले जवाब हर घंटे की नई रीडिंग के साथ बदलते हैं।"
            : "Answers that quote live figures update with each hourly reading."}
        </p>

        <div style={{ maxWidth: 880 }}>
          {items.map((it) => (
            <div key={it.q} style={{ borderBottom: "1px solid var(--line)", padding: "2px 0" }}>
              <h2 style={{ fontSize: "clamp(18px,2vw,22px)", margin: "20px 0 8px" }}>{it.q}</h2>
              <p style={{ fontSize: 15.5, color: "var(--ink-2)", marginBottom: 10 }}>{it.a}</p>
              {it.link &&
                (it.link[0].startsWith("http") ? (
                  <a className="more" href={it.link[0]} target="_blank" rel="noopener" style={{ display: "inline-block", marginBottom: 16 }}>
                    {it.link[1]}
                  </a>
                ) : (
                  <Link className="more" href={href(lang, it.link[0])} style={{ display: "inline-block", marginBottom: 16 }}>
                    {it.link[1]}
                  </Link>
                ))}
            </div>
          ))}
        </div>

        <p className="src-note">
          {lang === "hi"
            ? "स्रोत: CPCB/DPCC निगरानी स्टेशन (लाइव AQI), CPCB राष्ट्रीय वायु गुणवत्ता सूचकांक (श्रेणियां और स्वास्थ्य प्रभाव), CAQM (GRAP)। स्वास्थ्य संबंधी जानकारी सामान्य मार्गदर्शन है, चिकित्सकीय सलाह नहीं।"
            : "Sources: CPCB/DPCC monitoring stations (live AQI), CPCB National Air Quality Index (categories and health impacts), CAQM (GRAP). Health information is general guidance, not medical advice."}
        </p>

        <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
          <Link className="btn solid" href={href(lang, "stations")}>
            {t(lang, "stH")}
          </Link>
          <Link className="btn" href={href(lang, "health")}>
            {t(lang, "hH")}
          </Link>
        </div>
      </div>
    </section>
  );
}
