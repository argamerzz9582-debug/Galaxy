// Sample city readings for the SAMEER preview (design values, as on the reference site).
export type City = { name: string; state: string; aqi: number; prom: string; tr: number };

const raw: Array<[string, string, number, string]> = [
  ["Delhi", "Delhi", 370, "PM2.5"],
  ["Ghaziabad", "Uttar Pradesh", 224, "PM10"],
  ["Faridabad", "Haryana", 228, "PM10"],
  ["Noida", "Uttar Pradesh", 189, "PM2.5"],
  ["Gurugram", "Haryana", 137, "PM2.5"],
  ["Patna", "Bihar", 182, "PM2.5"],
  ["Kanpur", "Uttar Pradesh", 171, "PM2.5"],
  ["Lucknow", "Uttar Pradesh", 162, "PM10"],
  ["Varanasi", "Uttar Pradesh", 158, "PM10"],
  ["Amritsar", "Punjab", 156, "PM2.5"],
  ["Ludhiana", "Punjab", 149, "PM10"],
  ["Agra", "Uttar Pradesh", 148, "PM10"],
  ["Jaipur", "Rajasthan", 121, "PM10"],
  ["Chandigarh", "Chandigarh", 118, "PM10"],
  ["Ahmedabad", "Gujarat", 112, "PM10"],
  ["Bhopal", "Madhya Pradesh", 104, "PM10"],
  ["Indore", "Madhya Pradesh", 98, "PM10"],
  ["Kolkata", "West Bengal", 96, "PM2.5"],
  ["Dehradun", "Uttarakhand", 92, "PM10"],
  ["Mumbai", "Maharashtra", 88, "PM10"],
  ["Guwahati", "Assam", 82, "PM2.5"],
  ["Pune", "Maharashtra", 79, "PM10"],
  ["Hyderabad", "Telangana", 72, "PM10"],
  ["Visakhapatnam", "Andhra Pradesh", 69, "PM10"],
  ["Chennai", "Tamil Nadu", 64, "PM10"],
  ["Bengaluru", "Karnataka", 58, "PM10"],
  ["Thiruvananthapuram", "Kerala", 41, "PM10"],
  ["Shillong", "Meghalaya", 34, "PM10"],
  ["Aizawl", "Mizoram", 21, "PM10"],
  ["Madikeri", "Karnataka", 18, "PM10"],
];

export const CITIES: City[] = raw.map(([name, state, aqi, prom], i) => ({
  name,
  state,
  aqi,
  prom,
  tr: ((i * 37) % 7) - 3,
}));
