import { useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, LoaderCircle, Star } from "lucide-react";
import { WhatsAppIcon } from "./icons";
import { useLanguage } from "./i18n";
import {
  agency,
  formConfigured,
  validEmail,
  validPhone,
  whatsappHref,
} from "./config";
import { today } from "./criteria";

export type L = { fr: string; en: string; ar: string };
export type Values = Record<string, string>;
export type Field = {
  name: string;
  label: L;
  type:
    | "text"
    | "tel"
    | "email"
    | "date"
    | "time"
    | "month"
    | "select"
    | "textarea"
    | "radio"
    | "checks"
    | "rating";
  required?: boolean;
  options?: { value: string; label: L }[];
  placeholder?: L;
  full?: boolean;
  showIf?: (values: Values) => boolean;
  after?: string;
  minLength?: number;
  maxLength?: number;
  defaultValue?: string;
  ltr?: boolean;
};

export const contactFields: Field[] = [
  {
    name: "name",
    type: "text",
    required: true,
    label: { fr: "Nom & prénom", en: "Full name", ar: "الاسم الكامل" },
    maxLength: 80,
  },
  {
    name: "phone",
    type: "tel",
    required: true,
    label: { fr: "Téléphone", en: "Phone", ar: "رقم الهاتف" },
    placeholder: { fr: "+212 6…", en: "+212 6…", ar: "+212 6…" },
  },
  {
    name: "email",
    type: "email",
    label: { fr: "Email", en: "Email", ar: "البريد الإلكتروني" },
  },
];

export const numberOptions = (from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, i) => {
    const v = String(from + i);
    return { value: v, label: { fr: v, en: v, ar: v } };
  });

/** Sends a request to the configured endpoint, or prepares a WhatsApp message to the agency. */
export async function deliver(
  payload: Record<string, unknown>,
  text: string,
): Promise<"sent" | "whatsapp"> {
  if (!formConfigured) {
    const url = whatsappHref(text);
    const opened = window.open(url, "_blank", "noopener");
    if (!opened) window.location.href = url;
    return "whatsapp";
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(agency.formEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, source: "nadi-website" }),
      signal: controller.signal,
    });
    const result = await response.json();
    if (!response.ok || result.success !== true)
      throw Error("Reception not confirmed");
    return "sent";
  } finally {
    clearTimeout(timeout);
  }
}

export function StarRating({
  value,
  onChange,
  size = 26,
  label,
}: {
  value: number;
  onChange?: (v: number) => void;
  size?: number;
  label?: string;
}) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  if (!onChange)
    return (
      <span className="stars" role="img" aria-label={`${value} / 5`}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Star
            key={n}
            size={size}
            className={n <= Math.round(value) ? "on" : ""}
            aria-hidden="true"
          />
        ))}
      </span>
    );
  return (
    <span
      className="stars input"
      role="radiogroup"
      aria-label={label}
      onMouseLeave={() => setHover(0)}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          type="button"
          key={n}
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} / 5`}
          onMouseEnter={() => setHover(n)}
          onClick={() => onChange(n)}
        >
          <Star size={size} className={n <= shown ? "on" : ""} />
        </button>
      ))}
    </span>
  );
}

export function SmartForm({
  id,
  subject,
  fields,
  withContact = true,
  initial = {},
  submitLabel,
  consentLabel,
  askConsent = true,
  onSubmit,
  successTitle,
  successText,
  footer,
}: {
  id: string;
  subject: string;
  fields: Field[];
  withContact?: boolean;
  initial?: Values;
  submitLabel: string;
  consentLabel?: ReactNode;
  askConsent?: boolean;
  onSubmit?: (values: Values) => Promise<void>;
  successTitle?: string;
  successText?: string;
  footer?: ReactNode;
}) {
  const { t, l, lang } = useLanguage();
  const all = withContact ? [...fields, ...contactFields] : fields;
  const blank = () =>
    Object.fromEntries(
      all.map((f) => [f.name, initial[f.name] ?? f.defaultValue ?? ""]),
    ) as Values;
  const [values, setValues] = useState<Values>(blank);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [status, setStatus] = useState<
    "idle" | "sending" | "sent" | "whatsapp"
  >("idle");
  const visible = all.filter((f) => !f.showIf || f.showIf(values));
  const update = (name: string, value: string) => {
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((e) => ({ ...e, [name]: "" }));
    setError("");
  };
  const display = (f: Field) => {
    const raw = values[f.name];
    if (!raw) return "";
    if (f.type === "rating") return `${"★".repeat(+raw)} (${raw}/5)`;
    if (f.options)
      return raw
        .split("|")
        .map((v) => {
          const o = f.options!.find((x) => x.value === v);
          return o ? l(o.label) : v;
        })
        .join(", ");
    return raw;
  };
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (status === "sending") return;
    const found: Record<string, string> = {};
    for (const f of visible) {
      const v = (values[f.name] || "").trim();
      if (f.required && !v) found[f.name] = "requiredError";
      else if (v && f.type === "tel" && !validPhone(v))
        found[f.name] = "phoneError";
      else if (v && f.type === "email" && !validEmail(v))
        found[f.name] = "emailError";
      else if (v && f.type === "date" && v < today())
        found[f.name] = "pastError";
      else if (v && f.after && values[f.after] && v < values[f.after])
        found[f.name] = "dateError";
      else if (v && f.minLength && v.length < f.minLength)
        found[f.name] = "lengthError";
    }
    if (askConsent && !consent) found.consent = "consentError";
    setErrors(found);
    const keys = Object.keys(found);
    if (keys.length) {
      setError(
        keys.some((k) => found[k] === "requiredError")
          ? "requiredError"
          : found[keys[0]],
      );
      document
        .querySelector(`#${id} [name="${keys[0]}"], #${id} .stars.input`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    const data = Object.fromEntries(
      visible.map((f) => [f.name, (values[f.name] || "").trim()]),
    );
    setStatus("sending");
    try {
      if (onSubmit) {
        await onSubmit(data);
        setStatus("sent");
        return;
      }
      const lines = visible
        .filter((f) => display(f))
        .map((f) => `• ${l(f.label)} : ${display(f)}`);
      const text = `${t("brand")}\n${subject}\n\n${lines.join("\n")}`;
      const result = await deliver(
        { form: id, subject, ...data, consent: true, language: lang },
        text,
      );
      setStatus(result);
    } catch (failure) {
      setStatus("idle");
      const key = failure instanceof Error ? failure.message : "";
      setError(key && t(key) !== key ? key : "cSendError");
    }
  }
  const reset = () => {
    setValues(blank());
    setConsent(false);
    setErrors({});
    setError("");
    setStatus("idle");
  };
  if (status === "sent" || status === "whatsapp")
    return (
      <div className="success-panel" role="status">
        {status === "whatsapp" ? (
          <WhatsAppIcon size={40} />
        ) : (
          <CheckCircle2 size={40} />
        )}
        <h2>
          {status === "whatsapp"
            ? t("waTitle")
            : successTitle || t("cSuccessTitle")}
        </h2>
        <p>
          {status === "whatsapp" ? t("waText") : successText || t("cSuccess")}
        </p>
        <button className="button primary" onClick={reset}>
          {t("cNewReq")}
        </button>
      </div>
    );
  const errorFor = (name: string) =>
    errors[name] ? (
      <span className="field-error" id={`${id}-error-${name}`}>
        {t(errors[name])}
      </span>
    ) : null;
  const aria = (name: string) => ({
    "aria-invalid": Boolean(errors[name]),
    "aria-describedby": errors[name] ? `${id}-error-${name}` : undefined,
  });
  return (
    <form onSubmit={submit} noValidate className="smart-form" id={id}>
      <div className="form-grid">
        {visible.map((f) => {
          const label = (
            <>
              {l(f.label)}
              {f.required ? " *" : ""}
            </>
          );
          const common = {
            name: f.name,
            value: values[f.name] || "",
            ...aria(f.name),
          };
          const wide =
            f.full ||
            f.type === "textarea" ||
            f.type === "radio" ||
            f.type === "checks" ||
            f.type === "rating";
          if (f.type === "radio" || f.type === "checks") {
            const chosen = (values[f.name] || "").split("|").filter(Boolean);
            return (
              <fieldset
                key={f.name}
                className="choice-group full-width"
                {...aria(f.name)}
              >
                <legend>{label}</legend>
                <div>
                  {f.options!.map((o) => {
                    const on = chosen.includes(o.value);
                    return (
                      <label key={o.value} className={on ? "chip on" : "chip"}>
                        <input
                          type={f.type === "radio" ? "radio" : "checkbox"}
                          name={f.name}
                          value={o.value}
                          checked={on}
                          onChange={() =>
                            update(
                              f.name,
                              f.type === "radio"
                                ? o.value
                                : (on
                                    ? chosen.filter((x) => x !== o.value)
                                    : [...chosen, o.value]
                                  ).join("|"),
                            )
                          }
                        />
                        {l(o.label)}
                      </label>
                    );
                  })}
                </div>
                {errorFor(f.name)}
              </fieldset>
            );
          }
          if (f.type === "rating")
            return (
              <div key={f.name} className="full-width rating-field">
                <span className="rating-label">{label}</span>
                <StarRating
                  value={+values[f.name] || 0}
                  onChange={(n) => update(f.name, String(n))}
                  label={l(f.label)}
                  size={30}
                />
                {errorFor(f.name)}
              </div>
            );
          return (
            <label key={f.name} className={wide ? "full-width" : ""}>
              {label}
              {f.type === "select" ? (
                <select
                  {...common}
                  onChange={(e) => update(f.name, e.target.value)}
                >
                  {!f.defaultValue && (
                    <option value="">
                      {f.placeholder ? l(f.placeholder) : "—"}
                    </option>
                  )}
                  {f.options!.map((o) => (
                    <option key={o.value} value={o.value}>
                      {l(o.label)}
                    </option>
                  ))}
                </select>
              ) : f.type === "textarea" ? (
                <textarea
                  {...common}
                  rows={5}
                  maxLength={f.maxLength || 1500}
                  placeholder={f.placeholder ? l(f.placeholder) : undefined}
                  onChange={(e) => update(f.name, e.target.value)}
                />
              ) : (
                <input
                  {...common}
                  type={f.type}
                  dir={f.ltr || f.type === "tel" ? "ltr" : undefined}
                  maxLength={f.maxLength || 120}
                  min={
                    f.type === "date"
                      ? (f.after && values[f.after]) || today()
                      : undefined
                  }
                  max={f.type === "month" ? today().slice(0, 7) : undefined}
                  autoComplete={
                    f.type === "tel"
                      ? "tel"
                      : f.type === "email"
                        ? "email"
                        : f.name === "name"
                          ? "name"
                          : undefined
                  }
                  placeholder={f.placeholder ? l(f.placeholder) : undefined}
                  onChange={(e) => update(f.name, e.target.value)}
                />
              )}
              {errorFor(f.name)}
            </label>
          );
        })}
      </div>
      {askConsent && (
      <label className="consent">
        <input
          type="checkbox"
          name="consent"
          checked={consent}
          onChange={(e) => {
            setConsent(e.target.checked);
            setErrors((x) => ({ ...x, consent: "" }));
          }}
        />
        <span>
          {consentLabel || (
            <>
              {t("consent")} <Link to="/confidentialite">{t("fPrivacy")}</Link>
            </>
          )}
        </span>
      </label>
      )}
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
          )}
          {status === "sending" ? t("cSending") : submitLabel}
        </button>
      </div>
      {footer ||
        (!onSubmit && !formConfigured && (
          <p className="search-note">{t("waNote")}</p>
        ))}
    </form>
  );
}
