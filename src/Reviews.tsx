import { useCallback, useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { MessageSquareQuote, PenLine } from "lucide-react";
import { useLanguage } from "./i18n";
import { agency } from "./config";
import { Button, Eyebrow, PageHero } from "./components";
import { SmartForm, StarRating } from "./Forms";
import type { Field } from "./Forms";

export type Review = {
  id: string;
  name: string;
  city?: string;
  trip?: string;
  travelDate?: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export const reviewCountries = [
  { value: "istanbul", label: { fr: "Turquie", en: "Turkey", ar: "تركيا" } },
  { value: "egypte", label: { fr: "Égypte", en: "Egypt", ar: "مصر" } },
  { value: "thailande", label: { fr: "Thaïlande", en: "Thailand", ar: "تايلاند" } },
  {
    value: "dubai",
    label: {
      fr: "Émirats arabes unis",
      en: "United Arab Emirates",
      ar: "الإمارات العربية المتحدة",
    },
  },
  { value: "bali", label: { fr: "Indonésie", en: "Indonesia", ar: "إندونيسيا" } },
  { value: "maldives", label: { fr: "Maldives", en: "Maldives", ar: "المالديف" } },
  { value: "mecque", label: { fr: "Arabie saoudite", en: "Saudi Arabia", ar: "السعودية" } },
  { value: "other", label: { fr: "Autre pays", en: "Other country", ar: "بلد آخر" } },
];

export function useReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const load = useCallback(async () => {
    try {
      const response = await fetch(agency.reviewsEndpoint, {
        headers: { Accept: "application/json" },
      });
      const data = await response.json();
      if (!response.ok || !Array.isArray(data.reviews)) throw Error();
      setReviews(data.reviews);
      setState("ready");
    } catch {
      setState("error");
    }
  }, []);
  useEffect(() => {
    load();
  }, [load]);
  return { reviews, state, reload: load };
}

const average = (reviews: Review[]) =>
  reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

function useTripLabel() {
  const { l } = useLanguage();
  return (value?: string) => {
    if (!value) return "";
    const country = reviewCountries.find((x) => x.value === value);
    if (country) return value === "other" ? "" : l(country.label);
    return value;
  };
}

export function ReviewCard({ review }: { review: Review }) {
  const tripLabel = useTripLabel();
  return (
    <article className="review-card">
      <header className="review-author">
        <span className="review-avatar" aria-hidden="true">
          {review.name.trim().charAt(0).toUpperCase()}
        </span>
        <div>
          <strong dir="auto">{review.name}</strong>
          {tripLabel(review.trip) && <span>{tripLabel(review.trip)}</span>}
          <StarRating value={review.rating} size={16} />
        </div>
        <MessageSquareQuote
          size={26}
          className="review-quote"
          aria-hidden="true"
        />
      </header>
      <p className="review-text" dir="auto">
        {review.comment}
      </p>
    </article>
  );
}

function Summary({ reviews }: { reviews: Review[] }) {
  const { t } = useLanguage();
  const avg = average(reviews);
  return (
    <div className="review-summary">
      <strong>{avg.toFixed(1)}</strong>
      <div>
        <StarRating value={avg} size={18} />
        <span>
          {reviews.length} {t(reviews.length > 1 ? "rvCountMany" : "rvCountOne")}
        </span>
      </div>
    </div>
  );
}

export function ReviewsSection() {
  const { t } = useLanguage();
  const { reviews, state } = useReviews();
  return (
    <section className="section reviews-section">
      <div className="container">
        <div className="section-heading">
          <div>
            <Eyebrow>{t("rvEyebrow")}</Eyebrow>
            <h2>{t("rvTitle")}</h2>
          </div>
          {reviews.length > 0 && <Summary reviews={reviews} />}
        </div>
        {reviews.length > 0 ? (
          <div className="review-grid">
            {reviews.slice(0, 3).map((r) => (
              <ReviewCard key={r.id} review={r} />
            ))}
          </div>
        ) : (
          state !== "loading" && (
            <div className="review-empty">
              <MessageSquareQuote size={36} aria-hidden="true" />
              <p>{t("rvEmpty")}</p>
            </div>
          )
        )}
        <div className="button-row reviews-actions">
          <Button to="/avis#laisser-un-avis" gold>
            {t("rvLeave")}
          </Button>
          {reviews.length > 3 && (
            <Button to="/avis" secondary>
              {t("rvSeeAll")}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}

export function ReviewsPage() {
  const { t } = useLanguage();
  const { reviews, state, reload } = useReviews();
  const [params] = useSearchParams();
  const location = useLocation();
  useEffect(() => {
    if (location.hash)
      document
        .getElementById(location.hash.slice(1))
        ?.scrollIntoView({ behavior: "smooth" });
  }, [location.hash]);
  const fields: Field[] = [
    {
      name: "rating",
      type: "rating",
      required: true,
      label: { fr: "Votre note", en: "Your rating", ar: "تقييمك" },
    },
    {
      name: "name",
      type: "text",
      required: true,
      maxLength: 60,
      minLength: 2,
      label: { fr: "Prénom (ou nom)", en: "First name (or name)", ar: "الاسم" },
    },
    {
      name: "trip",
      type: "select",
      label: {
        fr: "Voyage effectué",
        en: "Trip taken",
        ar: "الرحلة التي قمت بها",
      },
      options: reviewCountries,
    },
    {
      name: "comment",
      type: "textarea",
      required: true,
      minLength: 3,
      maxLength: 1000,
      label: { fr: "Votre avis", en: "Your review", ar: "رأيك في الرحلة" },
      placeholder: {
        fr: "Organisation, hôtels, accompagnement, ce que vous avez préféré…",
        en: "Organisation, hotels, support, what you liked most…",
        ar: "التنظيم، الفنادق، المواكبة، وما أعجبك أكثر…",
      },
    },
  ];
  async function submit(values: Record<string, string>) {
    let response: Response;
    try {
      response = await fetch(agency.reviewsEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, rating: Number(values.rating) }),
      });
    } catch {
      throw Error("rvNetworkError");
    }
    const result = await response.json().catch(() => null);
    if (response.status === 422) throw Error("rvInvalid");
    if (response.status === 429) throw Error("rvRateLimit");
    if (!response.ok || result?.success !== true) throw Error("rvServerError");
    await reload();
  }
  const trip = params.get("trip") || "";
  return (
    <>
      <PageHero
        title={t("rvHeroTitle")}
        subtitle={t("rvHeroText")}
        eyebrow={t("rvEyebrow")}
        img="couple"
      />
      <section className="section">
        <div className="container reviews-page">
          <div>
            <div className="section-heading">
              <div>
                <Eyebrow>{t("rvEyebrow")}</Eyebrow>
                <h2>{t("rvTitle")}</h2>
              </div>
              {reviews.length > 0 && <Summary reviews={reviews} />}
            </div>
            {reviews.length > 0 ? (
              <div className="review-list">
                {reviews.map((r) => (
                  <ReviewCard key={r.id} review={r} />
                ))}
              </div>
            ) : (
              <div className="review-empty">
                <MessageSquareQuote size={36} aria-hidden="true" />
                <p>
                  {state === "error"
                    ? t("rvLoadError")
                    : state === "ready"
                      ? t("rvEmpty")
                      : "…"}
                </p>
              </div>
            )}
          </div>
          <aside className="service-form-card review-form" id="laisser-un-avis">
            <Eyebrow>
              <PenLine size={14} aria-hidden="true" /> {t("rvLeave")}
            </Eyebrow>
            <h2>{t("rvFormTitle")}</h2>
            <p className="form-lead">{t("rvFormLead")}</p>
            <SmartForm
              id="review-form"
              subject={t("rvLeave")}
              fields={fields}
              withContact={false}
              initial={trip ? { trip } : {}}
              submitLabel={t("rvSubmit")}
              askConsent={false}
              onSubmit={submit}
              successTitle={t("rvThanksTitle")}
              successText={t("rvThanks")}
              footer={<p className="search-note">{t("rvModeration")}</p>}
            />
          </aside>
        </div>
      </section>
    </>
  );
}
