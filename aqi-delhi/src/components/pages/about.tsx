"use client";

import { useState } from "react";
import { ADVICE, POLLUTANTS, SCALE, band, scalePos } from "@/lib/aqi";
import { t } from "@/lib/i18n";
import type { Live } from "@/data/snapshot";
import { useLang } from "../lang-context";

export default function About({ live }: { live: Live }) {
  const lang = useLang();
  const b = band(live.city.aqi);
  const [tab, setTab] = useState(0);
  const pos = scalePos(live.city.aqi);

  return (
    <section>
      <div className="wrap gutter view prose">
        <h1>{lang === "hi" ? "वायु गुणवत्ता सूचकांक (AQI) के बारे में" : "About Air Quality Index (AQI)"}</h1>

        <p>
          {lang === "hi"
            ? "वायु गुणवत्ता सूचकांक (AQI) एक मानकीकृत संकेतक है, जिसका उपयोग परिवेशी वायु की गुणवत्ता और मानव स्वास्थ्य पर उसके संभावित प्रभाव की जानकारी देने के लिए किया जाता है। यह जटिल वायु-गुणवत्ता आंकड़ों को एक सरल संख्यात्मक पैमाने में बदलता है, जिससे नागरिक वायु प्रदूषण के स्तर को समझकर उचित सावधानी बरत सकें।"
            : "The Air Quality Index (AQI) is a standardized indicator used to communicate the quality of ambient air and its potential impact on human health. It converts complex air-quality data into a simple numerical scale that helps citizens understand the level of air pollution and take appropriate precautions."}
        </p>
        <p>
          {lang === "hi"
            ? "दिल्ली AQI वेबसाइट नागरिकों को पूरी दिल्ली की नवीनतम उपलब्ध वायु-गुणवत्ता जानकारी उपलब्ध कराती है, जिसमें निगरानी स्टेशन-वार AQI रीडिंग, प्रदूषक स्तर और स्वास्थ्य सलाह शामिल हैं।"
            : "The Delhi AQI website provides citizens with access to the latest available air-quality information across Delhi, including monitoring station-wise AQI readings, pollutant levels and health advisories."}
        </p>

        <h3>{lang === "hi" ? "AQI पैमाना कैसे काम करता है" : "How the AQI Scale Works"}</h3>
        <p>
          {lang === "hi"
            ? "AQI की गणना विभिन्न वायु प्रदूषकों की सांद्रता के आधार पर की जाती है, जिनमें PM2.5, PM10, नाइट्रोजन डाइऑक्साइड (NO₂), सल्फर डाइऑक्साइड (SO₂), कार्बन मोनोऑक्साइड (CO), ओज़ोन (O₃), अमोनिया (NH₃) और सीसा (Pb) शामिल हैं।"
            : "The AQI is calculated based on the concentrations of various air pollutants, including PM2.5, PM10, nitrogen dioxide (NO₂), sulphur dioxide (SO₂), carbon monoxide (CO), ozone (O₃), ammonia (NH₃) and lead (Pb)."}
        </p>

        <div className="polchips">
          {POLLUTANTS.map((p) => {
            const m = /^PM(2\.5|10)$/.exec(p);
            return (
              <span key={p}>
                {m ? (
                  <>
                    PM<sub>{m[1]}</sub>
                  </>
                ) : (
                  p
                )}
              </span>
            );
          })}
        </div>

        <p>
          {lang === "hi"
            ? "समग्र AQI निर्धारित पद्धति के अनुसार तय किया जाता है, जिसमें उपलब्ध प्रदूषक उप-सूचकांकों और सबसे अधिक उप-सूचकांक मान वाले प्रदूषक को ध्यान में रखा जाता है।"
            : "The overall AQI is determined in accordance with the prescribed methodology, considering the available pollutant sub-indices and the pollutant with the highest sub-index value."}
        </p>

        <h2>{lang === "hi" ? "दिल्ली का AQI इस साइट पर कैसे निकाला जाता है" : "How Delhi's AQI on this site is worked out"}</h2>
        <p>
          {lang === "hi" ? (
            <>
              हर स्टेशन का AQI भारत के राष्ट्रीय AQI पैमाने (0 से 500) पर होता है: स्टेशन के प्रदूषकों में सबसे ऊंचा
              उप-सूचकांक, बशर्ते कम से कम तीन प्रदूषकों (जिनमें PM2.5 या PM10 हो) के आंकड़े हों।{" "}
              <b>&ldquo;दिल्ली AQI&rdquo; उस घंटे रिपोर्ट कर रहे सभी स्टेशनों के AQI का औसत है।</b> जिन स्टेशनों से पिछले 2
              घंटे में रीडिंग नहीं आई, वे औसत में शामिल नहीं होते और &ldquo;रिपोर्ट नहीं&rdquo; दिखाए जाते हैं। मुख्य
              प्रदूषक वह है जो सबसे ज़्यादा स्टेशनों पर सबसे ऊंचा उप-सूचकांक देता है।
            </>
          ) : (
            <>
              Each station&apos;s AQI is on India&apos;s National AQI scale (0 to 500): the highest sub-index among
              its pollutants, provided readings for at least three pollutants — including PM2.5 or PM10 — are
              available. <b>&ldquo;Delhi AQI&rdquo; is the average of every station reporting in that hour.</b>{" "}
              Stations with no reading in the last 2 hours are left out of the average and shown as
              &ldquo;Not reporting&rdquo;. The prominent pollutant is the one returning the highest sub-index at
              the most stations.
            </>
          )}
        </p>

        <h2>{lang === "hi" ? "आंकड़े कहां से आते हैं" : "Where the data comes from"}</h2>
        <p>
          {lang === "hi" ? (
            <>
              AQI और प्रदूषक की जानकारी केंद्रीय प्रदूषण नियंत्रण बोर्ड (
              <a href="https://cpcb.nic.in/" target="_blank" rel="noopener">
                CPCB
              </a>
              ) और दिल्ली प्रदूषण नियंत्रण समिति (
              <a href="https://www.dpcc.delhigovt.nic.in/" target="_blank" rel="noopener">
                DPCC
              </a>
              ) के सतत परिवेशी वायु गुणवत्ता निगरानी स्टेशनों (CAAQMS) से आती है। GRAP के चरण वायु गुणवत्ता
              प्रबंधन आयोग (
              <a href="https://caqm.nic.in/" target="_blank" rel="noopener">
                CAQM
              </a>
              ) लागू करता है। मौसम भारत मौसम विज्ञान विभाग (
              <a href="https://mausam.imd.gov.in/" target="_blank" rel="noopener">
                IMD
              </a>
              ) के सफ़दरजंग स्टेशन से आता है।
            </>
          ) : (
            <>
              AQI and pollutant information comes from the Continuous Ambient Air Quality Monitoring Stations
              (CAAQMS) of the Central Pollution Control Board (
              <a href="https://cpcb.nic.in/" target="_blank" rel="noopener">
                CPCB
              </a>
              ) and the Delhi Pollution Control Committee (
              <a href="https://www.dpcc.delhigovt.nic.in/" target="_blank" rel="noopener">
                DPCC
              </a>
              ). GRAP stages are invoked by the Commission for Air Quality Management (
              <a href="https://caqm.nic.in/" target="_blank" rel="noopener">
                CAQM
              </a>
              ). Weather comes from the India Meteorological Department (
              <a href="https://mausam.imd.gov.in/" target="_blank" rel="noopener">
                IMD
              </a>
              ) station at Safdarjung.
            </>
          )}
        </p>

        <h2>{lang === "hi" ? "अपडेट और समय" : "Updates and timestamps"}</h2>
        <p>
          {lang === "hi"
            ? "स्टेशन हर घंटे रीडिंग भेजते हैं। हर मान के साथ लिखा होता है कि वह किस घंटे (IST) की रीडिंग है; यह उस समय से अलग है जब साइट ने आखिरी बार जांच की। 2 घंटे से पुरानी रीडिंग को “डेटा में देरी” के रूप में दिखाया जाता है, लाइव के रूप में नहीं। ये रीयल-टाइम आंकड़े अनंतिम हैं और बाद में CPCB की गुणवत्ता जांच के बाद बदल सकते हैं।"
            : "Stations report every hour. Each value is labelled with the hour (IST) it is for, which is different from the time the site last checked. A reading older than 2 hours is shown as “data delayed” rather than live. These are real-time figures and are provisional — they can change after CPCB quality checks."}
        </p>

        <h2>{lang === "hi" ? "भारत का AQI बनाम US AQI" : "India's AQI and the US AQI"}</h2>
        <p>
          {lang === "hi"
            ? "कई निजी ऐप US AQI दिखाते हैं, जिसके ब्रेकपॉइंट और श्रेणियां अलग हैं। इसलिए एक ही हवा के लिए दोनों पैमानों की संख्या अलग होती है और उनकी सीधी तुलना नहीं की जा सकती। इस साइट के सभी मान भारत के राष्ट्रीय AQI पर हैं।"
            : "Many private apps show the US AQI, which uses different breakpoints and categories. The same air therefore gets a different number on each scale, so the two cannot be compared directly. Every value on this site is on India's National AQI."}
        </p>

        <h2>{lang === "hi" ? "AQI श्रेणी चार्ट" : "AQI Range Chart"}</h2>
        <p>
          {lang === "hi"
            ? "राष्ट्रीय AQI श्रेणियां, उनके रंग कोड और संभावित स्वास्थ्य प्रभाव"
            : "National AQI categories with their colour code and likely health impact"}
        </p>

        <div className="tabs" role="tablist" aria-label={lang === "hi" ? "प्रदूषक" : "Pollutants"}>
          {SCALE.map((x, i) => (
            <button key={x.k} role="tab" aria-selected={i === tab} style={{ ["--c" as string]: x.hex }} onClick={() => setTab(i)}>
              <i />
              {lang === "hi" ? x.hi : x.k} <small>{x.min}–{x.max}</small>
            </button>
          ))}
        </div>

        <div className="range-chart" style={{ marginBottom: 18 }}>
          <div className="range-bar">
            {SCALE.map((x) => (
              <div key={x.k} style={{ background: x.hex, flex: x.max - x.min + 1 }} />
            ))}
          </div>
          <div style={{ position: "relative", height: 26, marginTop: 4 }}>
            <span
              style={{
                position: "absolute",
                left: `${pos}%`,
                transform: "translateX(-50%)",
                fontSize: 11,
                fontWeight: 700,
                color: b.fg,
                whiteSpace: "nowrap",
              }}
            >
              ▲ {live.city.aqi} {lang === "hi" ? b.hi : b.k}
            </span>
          </div>
        </div>

        <div className="tablewrap">
          <table>
            <thead>
              <tr>
                <th scope="col">{lang === "hi" ? "AQI सीमा" : "AQI range"}</th>
                <th scope="col">{lang === "hi" ? "श्रेणी" : "Category"}</th>
                <th scope="col">{lang === "hi" ? "रंग" : "Colour"}</th>
                <th scope="col">{lang === "hi" ? "संभावित स्वास्थ्य प्रभाव" : "Possible health impact"}</th>
              </tr>
            </thead>
            <tbody>
              {SCALE.map((x, i) => (
                <tr key={x.k}>
                  <td className="num">
                    {x.min}–{x.max}
                  </td>
                  <td>
                    <b>{lang === "hi" ? x.hi : x.k}</b>
                  </td>
                  <td>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13 }}>
                      <em style={{ width: 10, height: 10, borderRadius: 999, background: x.hex, fontStyle: "normal" }} />
                      {lang === "hi" ? ["गहरा हरा", "हल्का हरा", "पीला", "नारंगी", "लाल", "मैरून"][i] : ["Dark green", "Light green", "Yellow", "Orange", "Red", "Maroon"][i]}
                    </span>
                  </td>
                  <td style={{ fontSize: 13.5 }}>{ADVICE[i].impact.replace(/\.$/, "")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="src-note">{t(lang, "healthNote")}</p>
      </div>
    </section>
  );
}
