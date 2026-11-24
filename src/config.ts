const env = import.meta.env;
export const agency = {
  name: "Agence de voyage ABDESALAM NADI",
  phones: ["+212 6 61 53 72 11", "+212 6 03 12 68 88"],
  whatsapp: env.VITE_AGENCY_WHATSAPP || "+212 6 61 53 72 11",
  email: env.VITE_AGENCY_EMAIL || "",
  address: env.VITE_AGENCY_ADDRESS || "",
  instagram:
    env.VITE_AGENCY_INSTAGRAM || "https://www.instagram.com/avabdesalamnadi/",
  facebook:
    env.VITE_AGENCY_FACEBOOK ||
    "https://www.facebook.com/profile.php?id=61596174522199",
  tiktok: env.VITE_AGENCY_TIKTOK || "https://www.tiktok.com/@avabdesalamnadi",
  formEndpoint: env.VITE_FORM_ENDPOINT || "",
  reviewsEndpoint: env.VITE_REVIEWS_ENDPOINT || "/api/reviews.php",
};
export const telHref = (phone: string) => `tel:${phone.replace(/[^+\d]/g, "")}`;
export const whatsappHref = (text = "") =>
  `https://wa.me/${agency.whatsapp.replace(/\D/g, "")}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
export const validPhone = (value: string) =>
  /^\+?[\d\s().-]+$/.test(value) &&
  value.replace(/\D/g, "").length >= 8 &&
  value.replace(/\D/g, "").length <= 15;
export const validEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
export const validUrl = (value: string) => {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
};
export const formConfigured = Boolean(
  agency.formEndpoint &&
  ((agency.formEndpoint.startsWith("/") &&
    !agency.formEndpoint.startsWith("//")) ||
    validUrl(agency.formEndpoint)),
);
export type SocialKind = "facebook" | "instagram" | "tiktok";
export const socialLinks = () =>
  (
    [
      { kind: "facebook", label: "Facebook", href: agency.facebook },
      { kind: "instagram", label: "Instagram", href: agency.instagram },
      { kind: "tiktok", label: "TikTok", href: agency.tiktok },
    ] as { kind: SocialKind; label: string; href: string }[]
  ).filter((s) => validUrl(s.href));
export const contactLinks = () => [
  ...agency.phones
    .filter(validPhone)
    .map((phone) => ({ kind: "phone", label: phone, href: telHref(phone) })),
  ...(validPhone(agency.whatsapp)
    ? [{ kind: "whatsapp", label: "WhatsApp", href: whatsappHref() }]
    : []),
  ...(validEmail(agency.email)
    ? [{ kind: "email", label: agency.email, href: `mailto:${agency.email}` }]
    : []),
];
