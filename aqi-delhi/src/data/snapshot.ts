// Snapshot of the public CPCB/DPCC feed (Delhi AQI portal, 09:00 IST 9 Nov 2026),
// used only when the upstream API is unreachable so the site still renders.

export type Station = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  aqi: number | null;
  prom: string | null;
  time: string | null;
  reporting: boolean;
  zone: string | null;
  slug: string;
};

export type Summary = {
  current_aqi: number;
  category: string;
  reporting: number;
  total: number;
  vs_yesterday_diff: number | null;
  vs_yesterday_status: string | null;
  lead: string | null;
  lead_sub_index_station_count: number;
  grap_stage: string;
  grap_headroom: number | null;
  legend: Record<string, number>;
};

export type Live = {
  city: { aqi: number; time: string };
  summary: Summary;
  stations: Station[];
  stale: boolean;
};

const T = "2026-11-09T03:30:00.000Z";

// [id, name, lat, lon, aqi, prominent pollutant, last reading, reporting, district]
type Row = [string, string, number, number, number | null, string | null, string | null, 0 | 1, string | null];

const rows: Row[] = [
  ["ad1c25c1-7e9a-5702-8034-b51ffd147f7c", "DTU", 28.7500499, 77.1112615, 439, "PM2.5", T, 1, "North"],
  ["f121d81f-bacd-5fc0-9d39-4979d821750f", "Burari Crossing", 28.7256504, 77.2011573, 435, "PM2.5", T, 1, "North"],
  ["47ffb06d-927f-55eb-9780-020aa208537f", "Vivek Vihar", 28.672342, 77.31526, 428, "PM2.5", T, 1, "Shahdara"],
  ["2b9fff3b-13aa-5584-96c2-f3a147054e7a", "Sonia Vihar", 28.710508, 77.249485, 425, "PM2.5", T, 1, "Central"],
  ["09b4f666-2eb8-57b8-b7c0-634b4e5c40bc", "Mundka", 28.684678, 77.076574, 424, "PM2.5", T, 1, "North West"],
  ["597db989-4850-574e-9481-57b5b6bbe164", "Bawana", 28.7762, 77.051074, 423, "PM2.5", T, 1, "North"],
  ["7b89affa-3317-5e5e-85d8-9c2880434a9b", "North Campus", 28.689924, 77.214261, 423, "PM2.5", T, 1, null],
  ["be11093e-ec7d-5c9b-9d43-12f71f2869c0", "Jahangirpuri", 28.73282, 77.170633, 420, "PM2.5", T, 1, "North"],
  ["14e0594e-f2f9-579d-ab5d-b62573ceaf33", "Rohini", 28.732528, 77.11992, 419, "PM2.5", T, 1, "North"],
  ["807a7ee2-2af4-5da3-93de-6645cdd0d8f6", "Patparganj", 28.623763, 77.287209, 417, "PM2.5", T, 1, "East"],
  ["568e276e-c181-58ea-9ef3-88dfd6fa6707", "Chandni Chowk", 28.656756, 77.227234, 412, "PM2.5", T, 1, "Central"],
  ["d11fbd33-6124-5a6f-a368-a26908f996c2", "ITO", 28.628624, 77.24106, 412, "PM2.5", T, 1, "Central"],
  ["4857841c-ac00-54ef-ac3e-0c7513917c96", "Punjabi Bagh", 28.674045, 77.131023, 412, "PM2.5", T, 1, "West"],
  ["3e5c4ba2-fbce-5a87-b184-8d669c7c8606", "NIH Narela", 28.858447, 77.095248, 406, "PM2.5", T, 1, null],
  ["ea94cb59-f4c2-5bfd-bf1e-e85d711aca75", "CRRI Mathura Road", 28.5512005, 77.2735737, 396, "PM2.5", T, 1, null],
  ["ec7e9907-8ce0-5db6-ad58-a6445e424f2d", "Aya Nagar", 28.4706914, 77.1099364, 394, "PM2.5", T, 1, "South"],
  ["4d2b6d55-f6f5-5c37-888b-071bd7343791", "Pusa", 28.636818, 77.173597, 391, "PM2.5", T, 1, "West"],
  ["d186f08b-d005-547f-a74d-1214d628c879", "Burari", 28.769667, 77.206805, 382, "PM2.5", T, 1, null],
  ["8bf21c1e-b95e-57b9-9c94-1e5d91eccc95", "Karala", 28.7313303, 77.0402585, 381, "PM2.5", T, 1, null],
  ["a37b2d60-84c9-5637-9f06-c6ef1546ec1d", "Alipur", 28.815329, 77.15301, 379, "PM2.5", T, 1, "North"],
  ["7397f6a0-4b90-5b04-ba6d-7e9db78996b2", "Nangloi", 28.6835525, 77.0742812, 378, "PM2.5", T, 1, null],
  ["608adf44-d487-5cc3-b757-0f8ffd9324e9", "Ghoga", 28.818435, 77.057932, 377, "PM2.5", T, 1, null],
  ["897bcfba-f643-58ee-a32b-8a2dd9504449", "Talkatora Garden", 28.62181, 77.1944633, 377, "PM2.5", T, 1, null],
  ["6923f041-9906-54d4-a295-62249267ffc3", "Major Dhyan Chand National Stadium", 28.611281, 77.237738, 375, "PM2.5", T, 1, null],
  ["20e3d72d-6ce6-58cf-b051-1fce1f26208d", "Mandir Marg", 28.636429, 77.201067, 374, "PM2.5", T, 1, "New Delhi"],
  ["51c8200e-a7e3-5f69-a094-6c3d2d3c22a5", "Narela", 28.822836, 77.101981, 374, "PM2.5", T, 1, "North"],
  ["d2fbe2ea-9e8c-560d-9b95-0fd38fe693d5", "Lodhi Road", 28.588333, 77.221667, 370, "PM2.5", T, 1, "New Delhi"],
  ["eb147733-781a-5f82-9393-12b5ce648159", "Jharoda Kalan", 28.645274, 76.956375, 366, "PM2.5", T, 1, null],
  ["b0cfcac0-d97c-5664-96c3-63025e25c210", "Dr. Karni Singh Shooting Range", 28.498571, 77.26484, 364, "PM2.5", T, 1, null],
  ["e902b2db-e7ab-53c4-9aab-d2d7f298c991", "Wazirpur", 28.699793, 77.165453, 362, "PM2.5", T, 1, "North West"],
  ["40d3c5dd-8423-5b68-b57d-fce789999ca6", "Badarpur", 28.513305, 77.32634, 360, "PM2.5", T, 1, null],
  ["56dcc1d2-5af2-56b8-80a9-868fb98a2119", "IHBAS", 28.6811736, 77.3025234, 360, "PM2.5", T, 1, null],
  ["d6f68bba-a7e4-5603-ae21-761f810ff394", "Okhla Phase-2", 28.530785, 77.271255, 355, "PM2.5", T, 1, "South East"],
  ["8f167873-4635-51a9-b685-a5f2beca6cfc", "JNU", 28.540721, 77.168544, 351, "PM2.5", T, 1, null],
  ["e8ed0e66-336a-57e5-bb79-c8b73c5db3bf", "Chhawla", 28.553573, 76.993845, 345, "PM2.5", T, 1, null],
  ["600ea09d-31b4-59d8-801d-c13e7c8d61cf", "Ghummanhera", 28.534762, 76.91609, 343, "PM2.5", T, 1, null],
  ["4d09172f-62d9-5670-94e2-bed45e72e5c2", "Najafgarh", 28.570173, 76.933762, 342, "PM2.5", T, 1, "South West"],
  ["507cf282-dfb2-59b8-8f0a-d3eb86e32f84", "Sirifort", 28.5504249, 77.2159377, 336, "PM2.5", T, 1, null],
  ["34fd2c70-6964-523a-ae49-d8126b90be7d", "Shadipur", 28.6514781, 77.1473105, 335, "PM2.5", T, 1, "West"],
  ["aa90f918-4835-58f2-8adf-fe1a1c2cd646", "Vasundhara Enclave", 28.603699, 77.321644, 333, "PM2.5", T, 1, null],
  ["bf9766a7-4107-5c49-a853-ce34e90f76df", "Ashok Vihar", 28.695381, 77.181665, 332, "PM2.5", T, 1, "North West"],
  ["e88861ed-28ca-5ca7-8678-877c591d3cbb", "IMD Lodhi Road", 28.595528, 77.225749, 332, "PM2.5", T, 1, null],
  ["34d5f808-b87c-5ab0-b2e3-fbbc634ec47b", "Anand Vihar", 28.647622, 77.315809, 327, "PM2.5", T, 1, "Shahdara"],
  ["d32a6162-da5a-5a5c-b55c-71958ab05d2b", "Tikri Kalan", 28.67518, 76.980506, 316, "PM2.5", T, 1, null],
  ["b789dcae-b82b-53df-bf0e-64411b8282ef", "IGI Airport (T3)", 28.5627763, 77.1180053, 311, "PM2.5", T, 1, null],
  ["aa1e5916-7db2-5bee-b8e1-c3e898e060a5", "Maidan Garhi", 28.475672, 77.213538, 298, "PM2.5", T, 1, null],
  ["63745b70-e7d0-5f79-bc78-16f1d20775f5", "Cantonment Area", 28.594169, 77.1251, 288, "PM10", T, 1, null],
  ["15273178-f856-5815-a805-c251f1df5631", "Sri Aurobindo Marg", 28.531346, 77.190156, 286, "PM2.5", T, 1, "South"],
  ["d6fc674c-36a6-53f7-8806-81394f9383e7", "IGNOU_Maidan Garhi", 28.493624, 77.201159, 263, "PM10", T, 1, null],

  ["44abed83-ba08-52b7-8705-3dcc97b358fa", "Jawaharlal Nehru Stadium", 28.58028, 77.233829, null, null, T, 0, null],
  ["393ee2c6-c8a7-54d5-8e6c-f52be2ac1583", "NSIT Dwarka", 28.60909, 77.0325413, null, null, null, 0, "South West"],
  ["ba60d7b8-ac1d-5c0c-979b-39ac6227e747", "Uttam Nagar", 28.6375265, 77.0571176, null, null, T, 0, null],
  ["0e1703d1-e55f-5e77-9ddb-04e6b5a2191c", "Ghoga", 28.818435, 77.057932, null, null, null, 0, null],
  ["8cf01d6f-bb9b-51c0-baa7-e8c81dfa98e8", "Karala", 28.7313303, 77.0402585, null, null, null, 0, null],
  ["d11ac46b-f132-5563-bbde-a31d9b826490", "Narela", 28.858447, 77.095248, null, null, null, 0, "North"],
  ["9e9498db-67a2-5e8d-a49a-7ec8d394492c", "Nangloi", 28.6835525, 77.0742812, null, null, null, 0, null],
  ["4dcb60fd-91b1-541a-a8f9-9e25c569d5b5", "Maidan Garhi", 28.475672, 77.213538, null, null, null, 0, null],
  ["79489b10-b253-57fa-bd7c-fe7092823739", "Tikri Kalan", 28.67518, 76.980506, null, null, null, 0, null],
  ["0d1b2629-f44c-5fa1-8e65-8f3d2740e5cf", "Ghummanhera", 28.534762, 76.91609, null, null, null, 0, null],
  ["f4f51faf-c4be-5265-83ba-7fe7c9becf7f", "Chhawla", 28.553573, 76.993845, null, null, null, 0, null],
  ["67d63dc2-e22a-5fc0-bf19-73004f472530", "Uttam Nagar", 28.6375265, 77.0571176, null, null, null, 0, null],
  ["89d94e53-eccd-58b0-9f8b-ee5d3b003818", "NIH Narela", 28.858447, 77.095248, null, null, null, 0, null],
  ["11c2ac24-f9c5-57fe-aad7-27db1046ef51", "Nehru Nagar", 28.56789, 77.250515, null, null, T, 0, "South East"],
  ["d21a82e8-2f7d-5d0e-99be-3368a7c08730", "R K Puram", 28.563262, 77.186937, null, null, T, 0, null],
  ["94b5a712-3ac6-5650-9621-75fe461b88eb", "Commonwealth Sports Complex", 28.615828, 77.271992, null, null, T, 0, null],
  ["5bfc215a-9391-53ea-bf52-65c6abaea8de", "Dwarka-Sector 8", 28.5710274, 77.0719006, null, null, T, 0, null],
  ["15257c96-8768-59f8-bf2a-4762d9aa6687", "IIT Delhi", 28.54246, 77.191651, null, null, T, 0, null],
  ["bdd3307c-82a9-5680-8070-f1b42c0b86c2", "Pusa", 28.63611, 77.173332, null, null, T, 0, "West"],
  ["e2de02f4-6cb0-5294-8149-a9a12a46559c", "NSUT Jaffarpur", 28.594004, 76.909423, null, null, T, 0, null],
  ["0afe895b-a562-5b4d-be8b-bf4ead4da0a0", "Burari", 28.769667, 77.206805, null, null, null, 0, null],
  ["f1c2a439-e3e0-5127-9e39-ad71d9491857", "Badarpur", 28.513305, 77.32634, null, null, null, 0, null],
];

const slugify = (name: string) =>
  name.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const count: Record<string, number> = {};
for (const r of rows) count[slugify(r[1])] = (count[slugify(r[1])] || 0) + 1;

const stations: Station[] = rows.map((r) => {
  const base = slugify(r[1]);
  return {
    id: r[0],
    name: r[1],
    lat: r[2],
    lon: r[3],
    aqi: r[4],
    prom: r[5],
    time: r[6],
    reporting: r[7] === 1,
    zone: r[8],
    slug: count[base] > 1 ? `${base}-${r[0].replace(/[^a-z0-9]/gi, "").slice(0, 6).toLowerCase()}` : base,
  };
});

export const snapshot: Live = {
  city: { aqi: 370, time: "2026-11-09T03:30:00.000Z" },
  summary: {
    current_aqi: 370,
    category: "Very Poor",
    reporting: 49,
    total: 71,
    vs_yesterday_diff: -12,
    vs_yesterday_status: "improved",
    lead: "PM2.5",
    lead_sub_index_station_count: 47,
    grap_stage: "Stage II (Very Poor)",
    grap_headroom: null,
    legend: {
      Good: 0,
      Satisfactory: 0,
      Moderate: 0,
      Poor: 4,
      "Very Poor": 31,
      Severe: 14,
      "Not reporting": 22,
    },
  },
  stations,
  stale: true,
};

export const weatherSnapshot = {
  temp: 18,
  hum: 98,
  wind: 0,
  vis: null as number | null,
  sky: ["Fog", "कोहरा"] as [string, string],
  station: "New Delhi-Safdarjung",
};
