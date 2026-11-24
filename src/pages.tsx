import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Clock,
  Compass,
  MessageSquareQuote,
  Plane,
} from "lucide-react";
import { Link } from "react-router-dom";
import { ReviewsSection } from "./Reviews";
import { serviceLinks } from "./servicePages";
import { useLanguage } from "./i18n";
import {
  destinations,
  destinationDetails,
  details,
  image,
  regions,
  services,
  trips,
  tripTypes,
} from "./data";
import {
  Button,
  DestinationGrid,
  Eyebrow,
  FinalCTA,
  Gallery,
  Intro,
  PageHero,
  SectionHeading,
  ServiceGrid,
  StepsSection,
  TripGrid,
  ValuesSection,
} from "./components";
import {
  DateFields,
  SearchModule,
  TravelerSelect,
  restoredCriteria,
} from "./Search";
import {
  criteriaFromParams,
  paramsFromCriteria,
  validateDates,
} from "./criteria";
import type { Criteria } from "./criteria";
const heroSlides = [
  {
    img: "home-hero",
    flip: true,
    place: { fr: "La Mecque", en: "Makkah", ar: "مكة المكرمة" },
  },
  {
    img: "istanbul",
    flip: false,
    place: { fr: "Istanbul", en: "Istanbul", ar: "إسطنبول" },
  },
  {
    img: "dubai",
    flip: false,
    place: { fr: "Dubaï", en: "Dubai", ar: "دبي" },
  },
  {
    img: "bali2",
    flip: false,
    place: { fr: "Bali", en: "Bali", ar: "بالي" },
  },
];
const SLIDE_MS = 6500;
function HeroSlideshow() {
  const { t, l } = useLanguage();
  const [[active, previous], setSlides] = useState<[number, number]>([0, -1]);
  const show = (next: number) =>
    setSlides(([current]) => (next === current ? [current, -1] : [next, current]));
  useEffect(() => {
    heroSlides.slice(1).forEach((slide) => {
      const preload = new Image();
      preload.src = image(slide.img);
    });
  }, []);
  useEffect(() => {
    const still = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (still?.matches) return;
    const timer = window.setTimeout(
      () => show((active + 1) % heroSlides.length),
      SLIDE_MS,
    );
    return () => window.clearTimeout(timer);
  }, [active, previous]);
  return (
    <section className="home-hero">
      <div className="hero-slides" aria-hidden="true">
        {heroSlides.map((slide, i) => (
          <img
            key={slide.img}
            className={`cover hero-slide ${slide.flip ? "flip" : ""} ${i === active ? "active" : i === previous ? "prev" : ""}`}
            src={image(slide.img)}
            alt=""
            fetchPriority={i === 0 ? "high" : "low"}
            decoding="async"
          />
        ))}
      </div>
      <div className="home-scrim" />
      <svg
        className="flight-path"
        viewBox="0 0 1440 850"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M250 130 Q710 -70 1400 225"
          fill="none"
          stroke="var(--gold)"
          strokeWidth="1.4"
          strokeDasharray="6 10"
          opacity=".55"
        />
      </svg>
      <span className="hero-plane-track" aria-hidden="true">
        <Plane className="hero-plane" size={30} />
      </span>
      <div className="container home-hero-inner hero-reveal">
        <Eyebrow>{t("brand")}</Eyebrow>
        <h1>
          {t("heroT1")}
          <br />
          <em>{t("heroGold")}</em> {t("heroT2")}
        </h1>
        <p>{t("heroText")}</p>
        <div className="button-row">
          <Button to="/voyages">{t("discoverTrips")}</Button>
          <Button to="/services/voyages-sur-mesure" secondary>
            {t("createTrip")}
          </Button>
        </div>
        <div className="hero-trust">
          <span />
          {t("heroTrust")}
        </div>
      </div>
      <div className="hero-controls">
        <div className="hero-place" key={active} aria-live="polite">
          <span>{t("heroNow")}</span>
          <strong>{l(heroSlides[active].place)}</strong>
        </div>
        <div className="hero-dots">
          {heroSlides.map((slide, i) => (
            <button
              key={slide.img}
              type="button"
              className={i === active ? "active" : ""}
              aria-label={l(slide.place)}
              aria-current={i === active}
              onClick={() => show(i)}
            >
              <span style={{ animationDuration: `${SLIDE_MS}ms` }} />
            </button>
          ))}
        </div>
      </div>
      <a href="#home-search" className="hero-scroll" aria-label={t("heroScroll")}>
        <ChevronDown size={22} />
      </a>
    </section>
  );
}
export function Home() {
  const { t } = useLanguage();
  return (
    <>
      <HeroSlideshow />
      <div className="container search-overlap" id="home-search">
        <SearchModule />
      </div>
      <section className="section featured-section">
        <div className="container">
          <SectionHeading
            eyebrow={t("featEyebrow")}
            title={t("featTitle")}
            to="/voyages"
            action={t("seeAllTrips")}
          />
          <TripGrid items={trips.slice(0, 4)} />
        </div>
      </section>
      <Intro />
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow={t("destEyebrow")}
            title={t("destTitle")}
            to="/destinations"
            action={t("exploreDest")}
          />
          <DestinationGrid mosaic />
        </div>
      </section>
      <section className="section white-section">
        <div className="container">
          <SectionHeading
            eyebrow={t("servEyebrow")}
            title={t("servTitle")}
            to="/services"
            action={t("servLearn")}
          />
          <ServiceGrid />
        </div>
      </section>
      <ValuesSection />
      <section className="custom-section">
        <div className="custom-gradient" />
        <div className="container">
          <Eyebrow>{t("customEyebrow")}</Eyebrow>
          <h2>{t("customTitle")}</h2>
          <p>{t("customText")}</p>
          <Button to="/services/voyages-sur-mesure" gold>
            {t("customCta")}
          </Button>
        </div>
      </section>
      <StepsSection />
      <ReviewsSection />
      <FinalCTA />
    </>
  );
}
export function Voyages() {
  const { t } = useLanguage();
  const [params, setParams] = useSearchParams();
  const region = params.get("region") || "";
  const type = params.get("filterType") || "";
  const sort = params.get("sort") || "";
  const destination = params.get("destination") || "";
  const update = (name: string, value: string) => {
    const next = new URLSearchParams(params);
    value ? next.set(name, value) : next.delete(name);
    setParams(next, { replace: true });
  };
  const filtered = trips
    .filter(
      (trip) =>
        (!region || region === trip.region) &&
        (!type || type === trip.type) &&
        (!destination || destination === trip.slug),
    )
    .sort((a, b) =>
      sort === "asc" ? a.days - b.days : sort === "desc" ? b.days - a.days : 0,
    );
  const reset = () => {
    const next = new URLSearchParams(params);
    ["region", "filterType", "sort", "destination"].forEach((k) =>
      next.delete(k),
    );
    setParams(next, { replace: true });
  };
  return (
    <>
      <PageHero
        title={t("vHeroTitle")}
        subtitle={t("vHeroSub")}
        eyebrow={t("vHeroEyebrow")}
        img="voyages-hero"
      />
      <section className="section listing">
        <div className="container">
          <div className="filters">
            <Filter
              label={t("vFilterRegion")}
              value={region}
              onChange={(v) => update("region", v)}
              options={regions}
            />
            <Filter
              label={t("vFilterType")}
              value={type}
              onChange={(v) => update("filterType", v)}
              options={tripTypes}
            />
            <label>
              {t("vSort")}
              <select
                name="sort"
                value={sort}
                onChange={(e) => update("sort", e.target.value)}
              >
                <option value="">{t("vSortFeatured")}</option>
                <option value="asc">{t("vSortDurAsc")}</option>
                <option value="desc">{t("vSortDurDesc")}</option>
              </select>
            </label>
          </div>
          <div className="results-bar" aria-live="polite">
            <p>
              {filtered.length} {t("vResults")}
            </p>
            {(region || type || destination || sort) && (
              <button className="text-button" onClick={reset}>
                {t("vReset")}
              </button>
            )}
          </div>
          {filtered.length ? (
            <TripGrid items={filtered} query={params.toString()} />
          ) : (
            <div className="empty-state">
              <Compass size={36} />
              <h2>{t("vNoResults")}</h2>
              <button className="button primary" onClick={reset}>
                {t("vReset")}
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
function Filter({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[][];
}) {
  const { t } = useLanguage();
  return (
    <div className="filter-group">
      <span className="filter-label">{label}</span>
      <div className="filter-buttons" role="group" aria-label={label}>
        {[["", "vAll"], ...options].map(([id, key]) => (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={value === id ? "selected" : ""}
            aria-pressed={value === id}
          >
            {t(key)}
          </button>
        ))}
      </div>
    </div>
  );
}
export function Destinations() {
  const { t, l } = useLanguage();
  const [params, setParams] = useSearchParams();
  const region = params.get("region") || "";
  const query = params.get("q") || "";
  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    value ? next.set(key, value) : next.delete(key);
    setParams(next, { replace: true });
  };
  const filtered = destinations.filter(
    (d) =>
      (!region || region === d.region) &&
      l(d.name).toLocaleLowerCase().includes(query.toLocaleLowerCase()),
  );
  return (
    <>
      <PageHero
        title={t("dHeroTitle")}
        subtitle={t("dHeroSub")}
        eyebrow={t("dHeroEyebrow")}
        img="bali2"
      />
      <section className="section">
        <div className="container">
          <div className="destination-filters">
            <label className="destination-search">
              <span className="sr-only">{t("dSearchPh")}</span>
              <input
                name="q"
                placeholder={t("dSearchPh")}
                value={query}
                onChange={(e) => update("q", e.target.value)}
              />
            </label>
            <Filter
              label={t("vFilterRegion")}
              value={region}
              onChange={(v) => update("region", v)}
              options={regions}
            />
          </div>
          <p className="results-bar" aria-live="polite">
            {filtered.length} {t("navDest")}
          </p>
          {filtered.length ? (
            <DestinationGrid items={filtered} />
          ) : (
            <div className="empty-state">
              <h2>{t("noDest")}</h2>
              <button className="button primary" onClick={() => setParams({})}>
                {t("vReset")}
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
export function TripDetail() {
  const { slug } = useParams();
  const { t, l, list } = useLanguage();
  const trip = trips.find((x) => x.slug === slug);
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [criteria, setCriteria] = useState<Criteria>(() => ({
    ...restoredCriteria(),
    ...criteriaFromParams(params),
    destination: slug || "",
    trip: slug || "",
    type: "voyages",
  }));
  const [error, setError] = useState("");
  if (!trip || !slug || !(slug in details)) return <NotFound />;
  const content = details[slug as keyof typeof details];
  const update = (name: keyof Criteria, value: string) => {
    setCriteria((c) => ({ ...c, [name]: value }));
    setError("");
  };
  const request = (e: FormEvent) => {
    e.preventDefault();
    const issue = validateDates(criteria.startDate, criteria.endDate);
    if (issue) {
      setError(issue);
      return;
    }
    navigate(`/reservation?${paramsFromCriteria(criteria)}`);
  };
  return (
    <>
      <PageHero
        title={l(trip.name)}
        eyebrow={l(trip.country)}
        img={trip.img}
        parent={t("navVoyages")}
        parentTo="/voyages"
      >
        <div className="hero-meta">
          <span>
            <Clock size={18} />
            {trip.days} {t("uJours")} / {trip.nights} {t("uNuits")}
          </span>
          <span>
            {l(trip.dest)} · {l(trip.country)}
          </span>
        </div>
      </PageHero>
      <section className="section trip-detail-section">
        <div className="container">
          <Gallery images={[trip.img, ...trip.gallery]} title={l(trip.dest)} />
          <div className="detail-layout">
            <div className="detail-main">
              <div className="detail-block">
                <h2>{t("tdExperience")}</h2>
                <p>{l(content.long)}</p>
                <p className="proposal-notice">{t("proposal")}</p>
              </div>
              <div className="detail-block">
                <h2>{t("tdGlance")}</h2>
                <dl className="glance-grid">
                  {[
                    [
                      t("tdDuration"),
                      `${trip.days} ${t("uJours")} / ${trip.nights} ${t("uNuits")}`,
                    ],
                    [t("tdDestination"), l(trip.dest)],
                    [t("tdDeparture"), t("originConfirm")],
                    [t("tdAccommodation"), t("glanceAccom")],
                    [
                      t("tdStyle"),
                      t(
                        tripTypes.find((x) => x[0] === trip.type)?.[1] ||
                          "glanceStyle",
                      ),
                    ],
                  ].map(([key, value]) => (
                    <div key={key}>
                      <dt>{key}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div className="detail-block">
                <h2>{t("tdProgram")}</h2>
                <div className="itinerary">
                  {content.days.map((day, i) => (
                    <article className="itinerary-day" key={i}>
                      <span>
                        {t("tdDay")} {i + 1}
                      </span>
                      <h3>{l(day.t)}</h3>
                      <p>{l(day.d)}</p>
                    </article>
                  ))}
                </div>
              </div>
              <div className="inclusions detail-block">
                <div>
                  <h3>{t("serviceHint")}</h3>
                  <ul>
                    {list("incDefault").map((item) => (
                      <li key={item}>
                        <Check size={17} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3>{t("excludedHint")}</h3>
                  <ul>
                    {list("excDefault").map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <aside className="booking-panel">
              <Eyebrow>{t("price")}</Eyebrow>
              <h2>{t("tdInterested")}</h2>
              <form onSubmit={request} noValidate>
                <DateFields data={criteria} update={update} />
                <label>
                  {t("fTravelers")}
                  <TravelerSelect
                    value={criteria.travelers}
                    onChange={(value) => update("travelers", value)}
                  />
                </label>
                {error && (
                  <p className="form-error" role="alert">
                    {t(error)}
                  </p>
                )}
                <button type="submit" className="button primary">
                  {t("tdReserve")}
                  <ArrowRight size={17} />
                </button>
                <Button
                  to={`/reservation?${paramsFromCriteria(criteria)}`}
                  secondary
                >
                  {t("tdAdvisor")}
                </Button>
                <p className="search-note">{t("tdNoteAvail")}</p>
              </form>
              <Link to={`/avis?trip=${slug}#laisser-un-avis`} className="trip-review-link">
                <MessageSquareQuote size={18} aria-hidden="true" />
                {t("rvTripLink")}
              </Link>
            </aside>
          </div>
        </div>
      </section>
      <section className="section related-section">
        <div className="container">
          <SectionHeading title={t("tdAlsoLike")} />
          <TripGrid items={trips.filter((x) => x.slug !== slug).slice(0, 3)} />
        </div>
      </section>
    </>
  );
}
export function DestinationDetail() {
  const { slug } = useParams();
  const { t, l } = useLanguage();
  const destination = destinations.find((d) => d.slug === slug);
  if (!destination || !slug || !(slug in destinationDetails))
    return <NotFound />;
  const content = destinationDetails[slug as keyof typeof destinationDetails];
  const associated = trips.filter((trip) => trip.slug === slug);
  return (
    <>
      <PageHero
        title={l(destination.name)}
        eyebrow={l(destination.country)}
        img={destination.img}
        parent={t("navDest")}
        parentTo="/destinations"
      />
      <section className="section destination-story">
        <div className="container">
          <p className="destination-intro">{l(content.intro)}</p>
          <div className="destination-panels">
            <article>
              <h3>{t("ddWhy")}</h3>
              <p>{l(content.why)}</p>
            </article>
            <article>
              <h3>{t("ddWhen")}</h3>
              <p>{l(content.when)}</p>
            </article>
          </div>
          <SectionHeading title={t("ddSee")} />
          <div className="places-grid">
            {content.see.map((place) => (
              <article key={place.t.fr}>
                <img src={image(place.img)} alt={l(place.t)} loading="lazy" />
                <h3>{l(place.t)}</h3>
              </article>
            ))}
          </div>
          <div className="destination-associated">
            <SectionHeading title={t("ddTrips")} />
            {associated.length ? (
              associated.map((trip) => (
                <article className="destination-trip" key={trip.slug}>
                  <img
                    src={image(trip.img)}
                    alt={l(trip.dest)}
                    loading="lazy"
                  />
                  <div>
                    <Eyebrow>{l(trip.country)}</Eyebrow>
                    <h2>{l(trip.name)}</h2>
                    <p>{l(trip.summary)}</p>
                    <div className="duration">
                      {trip.days} {t("uJours")} / {trip.nights} {t("uNuits")} ·{" "}
                      {t("price")}
                    </div>
                    <Button to={`/voyages/${trip.slug}`}>
                      {t("tdReserve")}
                    </Button>
                  </div>
                </article>
              ))
            ) : (
              <div className="destination-no-trip">
                <p>{t("ddNoTrips")}</p>
                <Button to={`/services/voyages-sur-mesure?destination=${slug}`}>
                  {t("createTrip")}
                </Button>
              </div>
            )}
          </div>
          <div className="destination-legal-info">
            <h3>{t("ddInfo")}</h3>
            <p>{t("ddInfoNote")}</p>
          </div>
        </div>
      </section>
    </>
  );
}
export function Hotels() {
  const { t, l } = useLanguage();
  return (
    <>
      <PageHero
        title={t("hHeroTitle")}
        subtitle={t("hHeroSub")}
        eyebrow={t("hHeroEyebrow")}
        img="hotel"
      />
      <div className="container search-overlap">
        <SearchModule fixedType="hotels" />
      </div>
      <section className="section">
        <div className="container">
          <SectionHeading
            title={t("hPopular")}
            to="/destinations"
            action={t("exploreDest")}
          />
          <DestinationGrid />
        </div>
      </section>
      <section className="section white-section">
        <div className="container">
          <SectionHeading title={t("hSelected")} />
          <div className="stay-grid">
            {["dubai", "bali", "istanbul"].map((slug) => {
              const dest = destinations.find((d) => d.slug === slug)!;
              return (
                <article className="stay-card" key={slug}>
                  <img
                    src={image(dest.img)}
                    alt={l(dest.name)}
                    loading="lazy"
                  />
                  <div>
                    <h3>{l(dest.name)}</h3>
                    <p>{t("proposal")}</p>
                    <Button
                      to={`/services/hotels-sejours?destination=${slug}`}
                      secondary
                    >
                      {t("hInquiry")}
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container hotel-support">
          <div>
            <Eyebrow>{t("navHotels")}</Eyebrow>
            <h2>{t("hWhy")}</h2>
            <p>{t("hWhyLead")}</p>
            <Button to="/services/hotels-sejours">{t("hInquiry")}</Button>
          </div>
          <div>
            {[1, 2, 3].map((i) => (
              <div className="support-item" key={i}>
                <h3>{t(`hWhy${i}t`)}</h3>
                <p>{t(`hWhy${i}d`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
export function Services() {
  const { t, l, lang } = useLanguage();
  return (
    <>
      <PageHero
        title={t("sHeroTitle")}
        subtitle={t("sHeroIntro")}
        eyebrow={t("sHeroEyebrow")}
        img="plane"
      />
      <section className="section">
        <div className="container service-rows">
          {services.map((service) => (
            <article className="service-row" key={service.num}>
              <img src={image(service.img)} alt="" loading="lazy" />
              <div>
                <h2>{l(service.title)}</h2>
                <p>{l(service.desc)}</p>
                <ul>
                  {service.benefits[lang].map((benefit) => (
                    <li key={benefit}>
                      <Check size={16} />
                      {benefit}
                    </li>
                  ))}
                </ul>
                <Button to={serviceLinks[service.num]}>
                  {t(service.num === "06" ? "navContact" : "sCta")}
                </Button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
export function About() {
  const { t } = useLanguage();
  return (
    <>
      <PageHero
        title={t("aHeroTitle")}
        eyebrow={t("aHeroEyebrow")}
        img="intro1"
      />
      <Intro about />
      <ValuesSection about />
      <section className="section final-cta">
        <div className="container">
          <h2>{t("aWayCtaText")}</h2>
          <Button to="/reservation">{t("planTrip")}</Button>
        </div>
      </section>
    </>
  );
}
export function Legal({ privacy = false }: { privacy?: boolean }) {
  const { t } = useLanguage();
  return (
    <section className="section legal-page">
      <div className="container prose">
        <Eyebrow>{t("brand")}</Eyebrow>
        <h1>{t(privacy ? "privacyTitle" : "legalTitle")}</h1>
        <p>{t(privacy ? "privacyBody" : "conditionsBody")}</p>
        <div className="form-notice">{t("legalPending")}</div>
        <Button to="/" secondary>
          {t("legalBack")}
        </Button>
      </div>
    </section>
  );
}
export function NotFound() {
  const { t } = useLanguage();
  return (
    <section className="section not-found">
      <div className="container">
        <Compass size={64} />
        <Eyebrow>404</Eyebrow>
        <h1>{t("notFoundTitle")}</h1>
        <p>{t("notFoundText")}</p>
        <Button to="/">{t("notFoundCta")}</Button>
      </div>
    </section>
  );
}
