import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Compass, Hotel, Plane, Search as SearchIcon } from "lucide-react";
import { storage, useLanguage } from "./i18n";
import { destinationOptions, origins } from "./data";
import {
  criteriaFromParams,
  defaultCriteria,
  paramsFromCriteria,
  today,
  validateDates,
} from "./criteria";
import type { Criteria } from "./criteria";
export function restoredCriteria(): Criteria {
  try {
    return {
      ...defaultCriteria,
      ...JSON.parse(storage.get("nadi-search", true) || "{}"),
    };
  } catch {
    return { ...defaultCriteria };
  }
}
export function DestinationSelect({
  value,
  onChange,
  required = false,
  name = "destination",
}: {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  name?: string;
}) {
  const { t, l } = useLanguage();
  return (
    <select
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
    >
      <option value="">{t("selectDestination")}</option>
      {destinationOptions.map((d) => (
        <option key={d.slug} value={d.slug}>
          {l(d.name)}
        </option>
      ))}
    </select>
  );
}
export function TravelerSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const { t } = useLanguage();
  return (
    <select
      name="travelers"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {Array.from({ length: 8 }, (_, i) => (
        <option value={String(i + 1)} key={i}>
          {i === 0
            ? t("travelerOne")
            : t("travelerMany").replace("{count}", String(i + 1))}
        </option>
      ))}
    </select>
  );
}
export function DateFields({
  data,
  update,
  hotel = false,
}: {
  data: Criteria;
  update: (name: keyof Criteria, value: string) => void;
  hotel?: boolean;
}) {
  const { t } = useLanguage();
  return (
    <>
      <label>
        {t(hotel ? "fCheckin" : "fDepart")}
        <input
          type="date"
          name="startDate"
          min={today()}
          value={data.startDate}
          onChange={(e) => update("startDate", e.target.value)}
        />
      </label>
      <label>
        {t(hotel ? "fCheckout" : "fReturn")}
        <input
          type="date"
          name="endDate"
          min={data.startDate || today()}
          value={data.endDate}
          onChange={(e) => update("endDate", e.target.value)}
        />
      </label>
    </>
  );
}
export function SearchModule({ fixedType }: { fixedType?: string }) {
  const { t, l } = useLanguage();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [criteria, setCriteria] = useState<Criteria>(() => ({
    ...restoredCriteria(),
    ...criteriaFromParams(params),
    ...(fixedType ? { type: fixedType } : {}),
  }));
  const [error, setError] = useState("");
  useEffect(() => {
    storage.set("nadi-search", JSON.stringify(criteria), true);
  }, [criteria]);
  const update = (name: keyof Criteria, value: string) => {
    setCriteria((c) => ({ ...c, [name]: value, trip: "" }));
    setError("");
  };
  function submit(e: FormEvent) {
    e.preventDefault();
    const issue = validateDates(criteria.startDate, criteria.endDate);
    if (issue) {
      setError(issue);
      return;
    }
    if (
      !criteria.destination ||
      (criteria.type === "flights" && !criteria.origin)
    ) {
      setError("requiredError");
      return;
    }
    const query = paramsFromCriteria(criteria);
    navigate(
      criteria.type === "voyages" ? `/voyages?${query}` : `/reservation?${query}`,
    );
  }
  return (
    <div className={`search-module ${fixedType ? "fixed-search" : ""}`}>
      {!fixedType && (
        <div
          className="search-tabs"
          role="tablist"
          aria-label={t("searchType")}
        >
          {[
            ["voyages", "tabVoyages", Compass],
            ["hotels", "tabHotels", Hotel],
            ["flights", "tabFlights", Plane],
          ].map(([type, key, I]) => {
            const TabIcon = I as typeof Compass;
            return (
              <button
                key={String(type)}
                type="button"
                role="tab"
                id={`tab-${type}`}
                aria-selected={criteria.type === type}
                aria-controls="search-panel"
                onClick={() => update("type", type as string)}
                onKeyDown={(e) => {
                  if (["ArrowLeft", "ArrowRight"].includes(e.key)) {
                    const tabs = ["voyages", "hotels", "flights"];
                    const next =
                      (tabs.indexOf(criteria.type) +
                        (e.key === "ArrowRight" ? 1 : 2)) %
                      3;
                    update("type", tabs[next]);
                    document.getElementById(`tab-${tabs[next]}`)?.focus();
                  }
                }}
              >
                <TabIcon size={17} />
                {t(key as string)}
              </button>
            );
          })}
        </div>
      )}
      <form
        id="search-panel"
        role={fixedType ? undefined : "tabpanel"}
        aria-labelledby={fixedType ? undefined : `tab-${criteria.type}`}
        className="search-form"
        onSubmit={submit}
        noValidate
      >
        <div
          className={`search-fields ${criteria.type === "flights" ? "flight-fields" : ""}`}
        >
          {criteria.type === "flights" && (
            <label>
              {t("fFrom")}
              <select
                name="origin"
                value={criteria.origin}
                onChange={(e) => update("origin", e.target.value)}
              >
                <option value="">{t("selectOrigin")}</option>
                {origins.map((o) => (
                  <option key={o.code} value={o.code}>
                    {l(o)}
                  </option>
                ))}
              </select>
            </label>
          )}
          <label>
            {t("fDestination")}
            <DestinationSelect
              value={criteria.destination}
              onChange={(value) => update("destination", value)}
              required
            />
          </label>
          <DateFields
            data={criteria}
            update={update}
            hotel={criteria.type === "hotels"}
          />
          <label>
            {t("fTravelers")}
            <TravelerSelect
              value={criteria.travelers}
              onChange={(value) => update("travelers", value)}
            />
          </label>
          {criteria.type === "flights" && (
            <label>
              {t("fClass")}
              <select
                name="cabin"
                value={criteria.cabin}
                onChange={(e) => update("cabin", e.target.value)}
              >
                <option value="economy">{t("economy")}</option>
                <option value="business">{t("business")}</option>
              </select>
            </label>
          )}
          <button className="button gold" type="submit">
            <SearchIcon size={17} />
            {t(
              criteria.type === "voyages"
                ? "searchV"
                : criteria.type === "hotels"
                  ? "searchH"
                  : "searchF",
            )}
          </button>
        </div>
        {error && (
          <p className="form-error" role="alert">
            {t(error)}
          </p>
        )}
        <p className="search-note">{t("dateHint")}</p>
      </form>
    </div>
  );
}
