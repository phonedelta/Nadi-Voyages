import { useParams, useSearchParams } from "react-router-dom";
import { ChevronDown, Phone } from "lucide-react";
import { useLanguage } from "./i18n";
import { agency, telHref } from "./config";
import { image, trips } from "./data";
import { activities, servicePages } from "./servicePages";
import { SmartForm } from "./Forms";
import {
  Eyebrow,
  Icon,
  PageHero,
  SectionHeading,
  TripGrid,
} from "./components";
import { NotFound } from "./pages";

export default function ServicePage() {
  const { slug } = useParams();
  const [params] = useSearchParams();
  const { t, l } = useLanguage();
  const page = servicePages.find((s) => s.slug === slug);
  if (!page) return <NotFound />;
  const initial = Object.fromEntries(
    ["trip", "destination"]
      .filter((k) => params.get(k))
      .map((k) => {
        const value = params.get(k)!;
        const trip = trips.find((x) => x.slug === value);
        return [k, k === "destination" && trip ? l(trip.dest) : value];
      }),
  );
  return (
    <>
      <PageHero
        title={l(page.heroTitle)}
        subtitle={l(page.heroSub)}
        eyebrow={t("navServices")}
        parent={t("navServices")}
        parentTo="/services"
        img={page.img}
      >
        <div className="button-row">
          <a href="#reservation" className="button gold">
            {l(page.formTitle)}
            <ChevronDown size={16} aria-hidden="true" />
          </a>
        </div>
      </PageHero>
      <section className="section">
        <div className="container service-intro">
          <div>
            <Eyebrow>{l(page.heroTitle)}</Eyebrow>
            <h2>{l(page.introTitle)}</h2>
            <p>{l(page.intro)}</p>
          </div>
          <div className="service-highlights">
            {page.highlights.map((h) => (
              <article key={h.title.fr}>
                <Icon name={h.icon} />
                <h3>{l(h.title)}</h3>
                <p>{l(h.desc)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      {page.extra === "trips" && (
        <section className="section white-section">
          <div className="container">
            <SectionHeading
              eyebrow={t("vHeroEyebrow")}
              title={t("spTripsTitle")}
            />
            <TripGrid items={trips} />
          </div>
        </section>
      )}
      {page.extra === "activities" && (
        <section className="section white-section">
          <div className="container">
            <SectionHeading
              eyebrow={t("spActEyebrow")}
              title={t("spActTitle")}
            />
            <div className="activity-grid">
              {activities.map((a) => (
                <article key={a.title.fr}>
                  <img src={image(a.img)} alt="" loading="lazy" />
                  <div>
                    <span>{l(a.place)}</span>
                    <h3>{l(a.title)}</h3>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
      <section className="section service-booking" id="reservation">
        <div className="container service-booking-layout">
          <div className="service-form-card">
            <Eyebrow>{t("spBooking")}</Eyebrow>
            <h2>{l(page.formTitle)}</h2>
            <p className="form-lead">{l(page.formLead)}</p>
            <SmartForm
              key={page.slug}
              id={`form-${page.slug}`}
              subject={l(page.formTitle)}
              fields={page.fields}
              initial={initial}
              submitLabel={l(page.submit)}
            />
          </div>
          <aside className="service-aside">
            <div className="service-call">
              <h3>{t("spCallTitle")}</h3>
              <p>{t("spCallText")}</p>
              {agency.phones.map((phone) => (
                <a key={phone} href={telHref(phone)} dir="ltr">
                  <Phone size={17} aria-hidden="true" />
                  {phone}
                </a>
              ))}
            </div>
            <div className="faq">
              <h3>{t("spFaq")}</h3>
              {page.faq.map((item) => (
                <details key={item.q.fr}>
                  <summary>{l(item.q)}</summary>
                  <p>{l(item.a)}</p>
                </details>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
