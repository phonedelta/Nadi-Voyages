import { Phone } from "lucide-react";
import { WhatsAppIcon } from "./icons";
import { useLanguage } from "./i18n";
import {
  agency,
  formConfigured,
  socialLinks,
  telHref,
  validPhone,
  whatsappHref,
} from "./config";
import { destinationOptions } from "./data";
import { SocialIcon } from "./components";
import { SmartForm, contactFields } from "./Forms";
import type { Field } from "./Forms";

const subjectField: Field = {
  name: "subject",
  type: "select",
  required: true,
  full: true,
  label: { fr: "Type de demande", en: "Type of request", ar: "نوع الطلب" },
  options: [
    {
      value: "info",
      label: {
        fr: "Demande d’information",
        en: "General information",
        ar: "طلب معلومات",
      },
    },
    {
      value: "support",
      label: {
        fr: "Accompagnement / préparation du voyage",
        en: "Travel support / preparation",
        ar: "مواكبة / التحضير للسفر",
      },
    },
    {
      value: "booking",
      label: {
        fr: "Suivi d’une réservation",
        en: "Follow-up on a booking",
        ar: "متابعة حجز",
      },
    },
    {
      value: "visa",
      label: {
        fr: "Visa & documents de voyage",
        en: "Visa & travel documents",
        ar: "التأشيرة ووثائق السفر",
      },
    },
    {
      value: "complaint",
      label: { fr: "Réclamation", en: "Complaint", ar: "شكاية" },
    },
    {
      value: "other",
      label: { fr: "Autre", en: "Other", ar: "موضوع آخر" },
    },
  ],
};
const messageField: Field = {
  name: "message",
  type: "textarea",
  required: true,
  minLength: 10,
  label: { fr: "Message", en: "Message", ar: "الرسالة" },
  placeholder: {
    fr: "Parlez-nous de votre projet de voyage…",
    en: "Tell us about your travel plans…",
    ar: "حدثونا عن مشروع رحلتكم…",
  },
};

const destinationField: Field = {
  name: "destination",
  type: "select",
  label: { fr: "Destination", en: "Destination", ar: "الوجهة" },
  placeholder: {
    fr: "Sélectionner une destination",
    en: "Select a destination",
    ar: "اختر وجهة",
  },
  options: [
    ...destinationOptions.map((d) => ({ value: d.slug, label: d.name })),
    {
      value: "other",
      label: {
        fr: "Autre / pas encore décidé",
        en: "Other / not decided yet",
        ar: "وجهة أخرى / لم أقرر بعد",
      },
    },
  ],
};
const [nameField, phoneField, emailField] = contactFields;
const placeholders: Record<string, Field["placeholder"]> = {
  name: { fr: "Votre nom", en: "Your name", ar: "اسمكم" },
  email: { fr: "vous@exemple.com", en: "you@example.com", ar: "you@example.com" },
};
const formFields: Field[] = [
  { ...nameField, placeholder: placeholders.name },
  phoneField,
  { ...emailField, placeholder: placeholders.email, ltr: true },
  destinationField,
  subjectField,
  messageField,
];
const steps = [
  ["ctStep1Title", "ctStep1Text"],
  ["ctStep2Title", "ctStep2Text"],
  ["ctStep3Title", "ctStep3Text"],
];

export default function Contact() {
  const { t, l } = useLanguage();
  const socials = socialLinks();
  const phone = agency.phones.find(validPhone);
  return (
    <>
      <section className="contact-hero">
        <div className="contact-hero-text">
          <p className="contact-kicker">{t("navContact")}</p>
          <h1>
            {t("ctHeroLine1")} <em>{t("ctHeroLine2")}</em>
          </h1>
          <p>{t("ctHeroText")}</p>
        </div>
        <div className="contact-hero-media">
          <img
            src="/assets/contact-travel.jpg"
            alt={l({
              fr: "Téléphone rétro, globe et carnet de voyage dans un riad marocain",
              en: "Vintage telephone, globe and travel journal in a Moroccan riad",
              ar: "هاتف كلاسيكي وكرة أرضية ودفتر رحلات في رياض مغربي",
            })}
            fetchPriority="high"
          />
        </div>
      </section>
      <section className="section contact-main">
        <div className="container contact-layout-v2">
          <div className="contact-intro">
            <h2>
              {t("ctIntroLine1")} <em>{t("ctIntroLine2")}</em>
            </h2>
            <p>{t("ctIntroText")}</p>
            <p className="contact-kicker">{t("ctHowTitle")}</p>
            <ol className="contact-steps">
              {steps.map(([title, text], i) => (
                <li key={title}>
                  <span className="step-num">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{t(title)}</h3>
                    <p>{t(text)}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="contact-direct">
              {validPhone(agency.whatsapp) && (
                <a href={whatsappHref()} target="_blank" rel="noreferrer">
                  <WhatsAppIcon size={18} />
                  WhatsApp
                </a>
              )}
              {phone && (
                <a href={telHref(phone)}>
                  <Phone size={16} aria-hidden="true" />
                  <span dir="ltr">{phone}</span>
                </a>
              )}
            </div>
            {socials.length > 0 && (
              <div className="contact-social-row">
                {socials.map((s) => (
                  <a
                    key={s.kind}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    title={s.label}
                  >
                    <SocialIcon kind={s.kind} size={18} />
                  </a>
                ))}
              </div>
            )}
          </div>
          <div className="contact-form-card">
            <h2>{t("ctFormCardTitle")}</h2>
            <SmartForm
              id="contact-form"
              subject={t("ctFormTitle")}
              fields={formFields}
              withContact={false}
              submitLabel={t("ctSendRequest")}
              initial={{ subject: "support" }}
              footer={
                <>
                  <p className="required-note">* {t("ctRequired")}</p>
                  {!formConfigured && (
                    <p className="search-note">{t("waNote")}</p>
                  )}
                </>
              }
            />
          </div>
        </div>
      </section>
    </>
  );
}
