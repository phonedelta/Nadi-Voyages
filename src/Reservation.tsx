import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { LoaderCircle, CheckCircle2 } from "lucide-react";
import { WhatsAppIcon } from "./icons";
import { useLanguage, storage } from "./i18n";
import {
  agency,
  contactLinks,
  formConfigured,
  validEmail,
  validPhone,
} from "./config";
import { deliver } from "./Forms";
import { destinationOptions, image, origins, trips, services } from "./data";
import { criteriaFromParams, defaultCriteria, validateDates } from "./criteria";
import type { Criteria } from "./criteria";
import { PageHero, Eyebrow } from "./components";
import { DateFields, DestinationSelect, TravelerSelect } from "./Search";
type Enquiry = Criteria & {
  name: string;
  phone: string;
  email: string;
  message: string;
  consent: boolean;
  service: string;
};
const blank: Enquiry = {
  ...defaultCriteria,
  name: "",
  phone: "",
  email: "",
  message: "",
  consent: false,
  service: "",
};
export default function Reservation() {
  const { t, l, lang } = useLanguage();
  const [params] = useSearchParams();
  const [form, setForm] = useState<Enquiry>(() => {
    let saved = {};
    try {
      saved = JSON.parse(storage.get("nadi-enquiry", true) || "{}");
    } catch {
      /* No draft. */
    }
    return {
      ...blank,
      ...saved,
      ...criteriaFromParams(params),
      ...(params.has("service")
        ? { service: params.get("service") || "" }
        : {}),
    };
  });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "whatsapp"
  >("idle");
  useEffect(() => {
    storage.set("nadi-enquiry", JSON.stringify(form), true);
  }, [form]);
  const update = (name: string, value: string | boolean) => {
    setForm((f) => ({ ...f, [name]: value }));
    setError("");
    setFieldErrors((errors) => ({ ...errors, [name]: "" }));
  };
  const chosen = trips.find((trip) => trip.slug === form.trip);
  const service = services.find((s) => s.num === form.service);
  const origin = origins.find((o) => o.code === form.origin);
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (status === "sending") return;
    const errors: Record<string, string> = {};
    if (!form.name.trim()) errors.name = "requiredError";
    if (!validPhone(form.phone)) errors.phone = "phoneError";
    if (form.email && !validEmail(form.email)) errors.email = "emailError";
    if (!form.consent) errors.consent = "consentError";
    const dates = validateDates(form.startDate, form.endDate);
    if (dates) errors.endDate = dates;
    setFieldErrors(errors);
    if (Object.keys(errors).length) {
      setError("requiredError");
      return;
    }
    setStatus("sending");
    setError("");
    const label = (key: string, value?: string) =>
      value ? `• ${t(key)} : ${value}\n` : "";
    const dest = destinationOptions.find((d) => d.slug === form.destination);
    const text =
      `${t("brand")}\n${t("navReservation")}\n\n` +
      label("cName", form.name) +
      label("cPhone", form.phone) +
      label("cEmail", form.email) +
      label("requestSubject", chosen ? l(chosen.name) : "") +
      label("cDest", dest ? l(dest.name) : "") +
      label("fFrom", origin ? l(origin) : "") +
      label(form.type === "hotels" ? "fCheckin" : "fDepart", form.startDate) +
      label(form.type === "hotels" ? "fCheckout" : "fReturn", form.endDate) +
      label("cTravelers", form.travelers) +
      label("cMessage", form.message);
    try {
      const result = await deliver({ ...form, language: lang }, text);
      setStatus(result === "sent" ? "success" : "whatsapp");
      storage.remove("nadi-enquiry");
    } catch {
      setStatus("idle");
      setError("cSendError");
    }
  }
  const reset = () => {
    setForm({ ...blank });
    storage.remove("nadi-enquiry");
    setStatus("idle");
    setError("");
    setFieldErrors({});
  };
  const errorFor = (name: string) =>
    fieldErrors[name] ? (
      <span className="field-error" id={`error-${name}`}>
        {t(fieldErrors[name])}
      </span>
    ) : null;
  return (
    <>
      <PageHero
        title={t("cHeroTitle")}
        subtitle={t("cHeroText")}
        eyebrow={t("navReservation")}
        img="istanbul2"
      />
      <section className="section">
        <div className="container contact-layout">
          <aside className="contact-aside">
            <img src={image("intro1")} className="cover" alt="" />
            <div className="dark-scrim" />
            <div className="contact-aside-content">
              <Eyebrow>{t("cInfoTitle")}</Eyebrow>
              <h2>{t("cInfoTitle")}</h2>
              <div>
                {contactLinks().length ? (
                  contactLinks().map((link) => (
                    <a key={link.href} href={link.href} dir="ltr">
                      {link.label}
                    </a>
                  ))
                ) : (
                  <p>{t("cInfoSoon")}</p>
                )}
                {agency.address && <p>{agency.address}</p>}
              </div>
            </div>
          </aside>
          <div className="contact-content">
            {status === "success" || status === "whatsapp" ? (
              <div className="success-panel" role="status">
                {status === "whatsapp" ? (
                  <WhatsAppIcon size={40} />
                ) : (
                  <CheckCircle2 size={40} />
                )}
                <h2>{t(status === "whatsapp" ? "waTitle" : "cSuccessTitle")}</h2>
                <p>{t(status === "whatsapp" ? "waText" : "cSuccess")}</p>
                <button className="button primary" onClick={reset}>
                  {t("cNewReq")}
                </button>
              </div>
            ) : (
              <>
                <Eyebrow>{t("planTrip")}</Eyebrow>
                <h2>{t("cFormTitle")}</h2>
                {chosen && (
                  <div className="request-summary">
                    <strong>
                      {t("requestSubject")} : {l(chosen.name)}
                    </strong>
                    <p>
                      {chosen.days} {t("uJours")} / {chosen.nights}{" "}
                      {t("uNuits")} · {t("price")}
                    </p>
                  </div>
                )}
                {service && (
                  <div className="request-summary">{l(service.title)}</div>
                )}
                {origin && (
                  <p className="request-summary">
                    {t("fFrom")} : {l(origin)} · {t("fClass")} :{" "}
                    {t(form.cabin === "business" ? "business" : "economy")}
                  </p>
                )}
                <form onSubmit={submit} noValidate className="contact-form">
                  <div className="form-grid">
                    <label>
                      {t("cName")} *
                      <input
                        name="name"
                        autoComplete="name"
                        value={form.name}
                        onChange={(e) => update("name", e.target.value)}
                        aria-invalid={Boolean(fieldErrors.name)}
                        aria-describedby={
                          fieldErrors.name ? "error-name" : undefined
                        }
                        required
                      />
                      {errorFor("name")}
                    </label>
                    <label>
                      {t("cPhone")} *
                      <input
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        value={form.phone}
                        onChange={(e) => update("phone", e.target.value)}
                        aria-invalid={Boolean(fieldErrors.phone)}
                        aria-describedby={
                          fieldErrors.phone ? "error-phone" : undefined
                        }
                        required
                      />
                      {errorFor("phone")}
                    </label>
                    <label>
                      {t("cEmail")}
                      <input
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={form.email}
                        onChange={(e) => update("email", e.target.value)}
                        aria-invalid={Boolean(fieldErrors.email)}
                        aria-describedby={
                          fieldErrors.email ? "error-email" : undefined
                        }
                      />
                      {errorFor("email")}
                    </label>
                    <label>
                      {t("cDest")}
                      <DestinationSelect
                        value={form.destination}
                        onChange={(value) => update("destination", value)}
                      />
                    </label>
                    <label>
                      {t("cType")}
                      <select
                        name="type"
                        value={form.type}
                        onChange={(e) => update("type", e.target.value)}
                      >
                        {[
                          ["voyages", "cReqTrip"],
                          ["custom", "cReqCustom"],
                          ["hotels", "cReqHotel"],
                          ["flights", "cReqFlight"],
                          ["other", "cReqOther"],
                        ].map(([type, key]) => (
                          <option key={type} value={type}>
                            {t(key)}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      {t("cTravelers")}
                      <TravelerSelect
                        value={form.travelers}
                        onChange={(value) => update("travelers", value)}
                      />
                    </label>
                    <DateFields
                      data={form}
                      update={update}
                      hotel={form.type === "hotels"}
                    />
                    {fieldErrors.endDate && (
                      <p className="field-error" role="alert">
                        {t(fieldErrors.endDate)}
                      </p>
                    )}
                    <label className="full-width">
                      {t("cMessage")}
                      <textarea
                        name="message"
                        rows={5}
                        value={form.message}
                        onChange={(e) => update("message", e.target.value)}
                      />
                    </label>
                  </div>
                  <label className="consent">
                    <input
                      type="checkbox"
                      name="consent"
                      checked={form.consent}
                      onChange={(e) => update("consent", e.target.checked)}
                    />
                    <span>
                      {t("consent")}{" "}
                      <Link to="/confidentialite">{t("fPrivacy")}</Link>
                    </span>
                  </label>
                  {errorFor("consent")}

                  {error && (
                    <p className="form-error" role="alert">
                      {t(error)}
                    </p>
                  )}
                  <div className="button-row">
                    <button
                      type="submit"
                      className="button primary"
                      disabled={status === "sending"}
                    >
                      {status === "sending" && (
                        <LoaderCircle className="spinner" size={18} />
                      )}{" "}
                      {t(status === "sending" ? "cSending" : "cSend")}
                    </button>
                    <button
                      type="button"
                      className="button secondary"
                      onClick={reset}
                      disabled={status === "sending"}
                    >
                      {t("vReset")}
                    </button>
                  </div>
                  {!formConfigured && (
                    <p className="search-note">{t("waNote")}</p>
                  )}
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
