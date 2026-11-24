import catalogue from "./catalogue.json";
export const {
  trips,
  details,
  destinations,
  destinationDetails,
  services,
  values,
  steps,
} = catalogue;
export type Trip = (typeof trips)[number];
export type Destination = (typeof destinations)[number];
export const image = (name: string) => `/assets/${name}.webp`;
export const regions = [
  ["moyen-orient", "rgMoyenOrient"],
  ["afrique", "rgAfrique"],
  ["asie", "rgAsie"],
  ["europe", "rgEurope"],
];
export const tripTypes = [
  ["culture", "tyCulture"],
  ["aventure", "tyAventure"],
  ["detente", "tyDetente"],
  ["city-break", "tyCityBreak"],
  ["spirituel", "tySpirituel"],
];
export const nav = [
  ["/", "navHome"],
  ["/voyages", "navVoyages"],
  ["/destinations", "navDest"],
  ["/hotels", "navHotels"],
  ["/services", "navServices"],
  ["/a-propos", "navAbout"],
  ["/avis", "navReviews"],
  ["/contact", "navContact"],
];
export const destinationOptions = [
  ...destinations.map((d) => ({ slug: d.slug, name: d.name })),
  ...trips
    .filter((d) => !destinations.some((x) => x.slug === d.slug))
    .map((d) => ({ slug: d.slug, name: d.dest })),
];
export const origins = [
  {
    code: "casablanca",
    fr: "Casablanca",
    en: "Casablanca",
    ar: "الدار البيضاء",
  },
  { code: "rabat", fr: "Rabat", en: "Rabat", ar: "الرباط" },
  { code: "marrakech", fr: "Marrakech", en: "Marrakech", ar: "مراكش" },
  { code: "tanger", fr: "Tanger", en: "Tangier", ar: "طنجة" },
  { code: "agadir", fr: "Agadir", en: "Agadir", ar: "أكادير" },
];
