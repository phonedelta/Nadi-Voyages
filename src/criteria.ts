export type Criteria = {
  destination: string;
  startDate: string;
  endDate: string;
  travelers: string;
  origin: string;
  cabin: string;
  type: string;
  trip: string;
};
export const defaultCriteria: Criteria = {
  destination: "",
  startDate: "",
  endDate: "",
  travelers: "2",
  origin: "",
  cabin: "economy",
  type: "voyages",
  trip: "",
};
export function today() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Casablanca",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((p) => p.type === type)?.value;
  return `${get("year")}-${get("month")}-${get("day")}`;
}
export function validateDates(start: string, end: string) {
  if (start && start < today()) return "pastError";
  if (end && (!start || end < start)) return "dateError";
  return "";
}
export function criteriaFromParams(params: URLSearchParams): Partial<Criteria> {
  const keys = Object.keys(defaultCriteria) as (keyof Criteria)[];
  return Object.fromEntries(
    keys.filter((k) => params.has(k)).map((k) => [k, params.get(k) || ""]),
  );
}
export const paramsFromCriteria = (data: Criteria) =>
  new URLSearchParams(
    Object.entries(data).filter(([, value]) => Boolean(value)),
  ).toString();
