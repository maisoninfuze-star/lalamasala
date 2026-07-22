import type { LocationSeed } from "@/lib/types";

/*
  Real Lala Masala locations (addresses & phones from the brand).
  Hours are seed placeholders — the brief notes published hours are not
  permanently correct, so every field here is editable from the admin
  dashboard once the database is live.
*/

// Standard weekly hours used as a starting point (11:00–21:00, closed Monday).
const defaultHours = [
  { day: 0, open: "12:00", close: "21:00" }, // Sun
  { day: 1, open: null, close: null, closed: true }, // Mon
  { day: 2, open: "11:00", close: "21:00" },
  { day: 3, open: "11:00", close: "21:00" },
  { day: 4, open: "11:00", close: "21:00" },
  { day: 5, open: "11:00", close: "22:00" },
  { day: 6, open: "11:00", close: "22:00" },
];

export const LOCATIONS: LocationSeed[] = [
  {
    slug: "montreal",
    name: "Montreal",
    addressLine1: "3689 Boul. Saint-Jean",
    city: "Dollard-des-Ormeaux",
    province: "QC",
    postalCode: "H9G 1T2",
    phone: "438-500-5082",
    mapsUrl:
      "https://maps.google.com/?q=3689+Boul.+Saint-Jean+Dollard-des-Ormeaux+QC+H9G+1T2",
    timezone: "America/Toronto",
    taxRatePercent: 14.975, // GST 5% + QST 9.975%
    prepTimeMinutes: 20,
    payAtPickupEnabled: true,
    hours: defaultHours,
  },
  {
    slug: "kingston",
    name: "Kingston",
    addressLine1: "43 Hickson Avenue",
    city: "Kingston",
    province: "ON",
    postalCode: "K7K 2N7",
    phone: "613-548-3334",
    mapsUrl: "https://maps.google.com/?q=43+Hickson+Avenue+Kingston+ON+K7K+2N7",
    timezone: "America/Toronto",
    taxRatePercent: 13.0, // ON HST
    prepTimeMinutes: 20,
    payAtPickupEnabled: true,
    hours: defaultHours,
  },
  {
    slug: "belleville",
    name: "Belleville",
    addressLine1: "110 North Front Street",
    addressLine2: "Unit A004",
    city: "Belleville",
    province: "ON",
    postalCode: "K8P 0A6",
    phone: "613-779-0331",
    mapsUrl:
      "https://maps.google.com/?q=110+North+Front+Street+Belleville+ON+K8P+0A6",
    timezone: "America/Toronto",
    taxRatePercent: 13.0, // ON HST
    prepTimeMinutes: 20,
    payAtPickupEnabled: false,
    hours: defaultHours,
  },
];

export function getLocation(slug: string) {
  return LOCATIONS.find((l) => l.slug === slug);
}

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Whether a location is open at a given Date (in its local timezone approx). */
export function isOpenNow(loc: LocationSeed, now = new Date()): boolean {
  const day = now.getDay();
  const today = loc.hours.find((h) => h.day === day);
  if (!today || today.closed || !today.open || !today.close) return false;
  const [oh, om] = today.open.split(":").map(Number);
  const [ch, cm] = today.close.split(":").map(Number);
  const mins = now.getHours() * 60 + now.getMinutes();
  return mins >= oh * 60 + om && mins <= ch * 60 + cm;
}

export function todayHoursLabel(loc: LocationSeed, now = new Date()): string {
  const today = loc.hours.find((h) => h.day === now.getDay());
  if (!today || today.closed || !today.open || !today.close) return "Closed today";
  return `${DAY_LABELS[today.day]} ${today.open}–${today.close}`;
}
