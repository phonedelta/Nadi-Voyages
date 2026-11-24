import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  ArrowRight,
  ArrowUp,
  Menu,
  X,
  ChevronDown,
  Compass,
  Plane,
  Hotel,
  Headphones,
  MapPin,
  HeartHandshake,
  Lightbulb,
  Route,
  Ticket,
  Sparkles,
  CalendarDays,
  Check,
  Phone,
} from "lucide-react";
import { useLanguage } from "./i18n";
import { WhatsAppIcon, WhatsAppLogo } from "./icons";
import {
  agency,
  socialLinks,
  telHref,
  validEmail,
  whatsappHref,
} from "./config";
import type { SocialKind } from "./config";
import { serviceLinks } from "./servicePages";
import {
  image,
  nav,
  trips,
  destinations,
  services,
  values,
  steps,
} from "./data";
import type { Trip, Destination } from "./data";
export function SocialIcon({
  kind,
  size = 18,
}: {
  kind: SocialKind;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="social-icon"
    >
      {kind === "facebook" && (
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      )}
      {kind === "instagram" && (
        <>
          <rect x="2" y="2" width="20" height="20" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <path d="M17.5 6.5h.01" />
        </>
      )}
      {kind === "tiktok" && (
        <path d="M14 3v12.5a4.5 4.5 0 1 1-4.5-4.5M14 3c0 3 2.2 5.2 5.5 5.5" />
      )}
    </svg>
  );
}
export function Icon({ name, size = 22 }: { name: string; size?: number }) {
  const icons: Record<string, typeof Compass> = {
    route: Route,
    ticket: Ticket,
    hotel: Hotel,
    headphones: Headphones,
    heartHandshake: HeartHandshake,
    idea: Lightbulb,
    compass: Compass,
    mapPin: MapPin,
    mapPinned: MapPin,
    sparkles: Sparkles,
    plane: Plane,
  };
  const I = icons[name] || Compass;
  return <I size={size} aria-hidden="true" />;
}
export function Flag({ lang }: { lang: "fr" | "ar" | "en" }) {
  return (
    <svg
      className="flag"
      viewBox={lang === "en" ? "0 0 60 30" : "0 0 30 20"}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {lang === "fr" && (
        <>
          <rect width="10" height="20" fill="#002395" />
          <rect x="10" width="10" height="20" fill="#fff" />
          <rect x="20" width="10" height="20" fill="#ED2939" />
        </>
      )}
      {lang === "ar" && (
        <>
          <rect width="30" height="20" fill="#C1272D" />
          <path
            d="M15 4.6 18.3 14.8 9.6 8.5H20.4L11.7 14.8Z"
            fill="none"
            stroke="#006233"
            strokeWidth="1.1"
            strokeLinejoin="round"
          />
        </>
      )}
      {lang === "en" && (
        <>
          <rect width="60" height="30" fill="#012169" />
          <path d="M0 0 60 30M60 0 0 30" stroke="#fff" strokeWidth="6" />
          <path d="M0 0 60 30M60 0 0 30" stroke="#C8102E" strokeWidth="2.4" />
          <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10" />
          <path d="M30 0v30M0 15h60" stroke="#C8102E" strokeWidth="6" />
        </>
      )}
    </svg>
  );
}
const languageNames = { fr: "Français", ar: "العربية", en: "English" };
export function Button({
  to,
  children,
  secondary = false,
  gold = false,
  className = "",
}: {
  to: string;
  children: ReactNode;
  secondary?: boolean;
  gold?: boolean;
  className?: string;
}) {
  return (
    <Link
      to={to}
      className={`button ${secondary ? "secondary" : gold ? "gold" : "primary"} ${className}`}
    >
      {children}
      <ArrowRight size={16} aria-hidden="true" className="direction-arrow" />
    </Link>
  );
}
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="eyebrow">
      <span />
      {children}
    </div>
  );
}
export function SectionHeading({
  eyebrow,
  title,
  to,
  action,
}: {
  eyebrow?: string;
  title: string;
  to?: string;
  action?: string;
}) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h2>{title}</h2>
      </div>
      {to && (
        <Button to={to} secondary>
          {action}
        </Button>
      )}
    </div>
  );
}
export function Header() {
  const { t, lang, setLang } = useLanguage();
  const [menu, setMenu] = useState(false);
  const [language, setLanguage] = useState(false);
  const location = useLocation();
  const menuButton = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const languageWrap = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setMenu(false);
    setLanguage(false);
  }, [location]);
  useEffect(() => {
    if (!menu) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.querySelector<HTMLAnchorElement>("nav a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(false);
        menuButton.current?.focus();
      }
      if (e.key === "Tab") {
        const all = panel.current?.querySelectorAll<HTMLElement>("a,button");
        if (!all?.length) return;
        const first = all[0],
          last = all[all.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [menu]);
  useEffect(() => {
    if (!language) return;
    const close = (e: MouseEvent) => {
      if (!languageWrap.current?.contains(e.target as Node)) setLanguage(false);
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLanguage(false);
    };
    document.addEventListener("click", close);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("click", close);
      document.removeEventListener("keydown", key);
    };
  }, [language]);
  return (
    <>
      <a href="#main" className="skip-link">
        {t("skip")}
      </a>
      <header className="header">
        <div className="header-inner">
          <Link to="/" className="brand" aria-label={t("brand")}>
            <img src="/assets/logo.svg" alt={t("brand")} />
          </Link>
          <nav className="desktop-nav" aria-label={t("fExplore")}>
            {nav.map(([to, key]) => (
              <NavLink to={to} key={to} end={to === "/"}>
                {t(key)}
              </NavLink>
            ))}
          </nav>
          <div className="header-actions">
            <div className="language" ref={languageWrap}>
              <button
                aria-label={t("language")}
                aria-expanded={language}
                aria-controls="language-options"
                onClick={() => setLanguage(!language)}
              >
                <Flag lang={lang} />
                {lang === "ar" ? "العربية" : lang.toUpperCase()}
                <ChevronDown size={12} />
              </button>
              {language && (
                <div id="language-options" className="language-menu">
                  {(["fr", "ar", "en"] as const).map((code) => (
                    <button
                      key={code}
                      lang={code}
                      onClick={() => {
                        setLang(code);
                        setLanguage(false);
                      }}
                      aria-pressed={code === lang}
                    >
                      <Flag lang={code} />
                      {languageNames[code]}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Button to="/reservation" className="header-cta">
              {t("planTrip")}
            </Button>
            <button
              className="menu-toggle"
              ref={menuButton}
              onClick={() => setMenu(!menu)}
              aria-label={t(menu ? "closeMenu" : "openMenu")}
              aria-expanded={menu}
              aria-controls="mobile-navigation"
            >
              <Menu size={25} />
            </button>
          </div>
        </div>
      </header>
      {menu && (
        <div
          ref={panel}
          className="mobile-menu"
          id="mobile-navigation"
          role="dialog"
          aria-modal="true"
          aria-label={t("openMenu")}
        >
          <div className="mobile-menu-top">
            <Link to="/" className="mobile-menu-brand" aria-label={t("brand")}>
              <img src="/assets/logo-white.svg" alt={t("brand")} />
            </Link>
            <button
              className="close-menu"
              onClick={() => {
                setMenu(false);
                menuButton.current?.focus();
              }}
              aria-label={t("closeMenu")}
            >
              <X size={22} />
            </button>
          </div>
          <nav className="mobile-menu-nav" aria-label={t("fExplore")}>
            {nav.map(([to, key], i) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                style={{ animationDelay: `${60 + i * 35}ms` }}
              >
                <span className="mobile-menu-num">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="mobile-menu-label">{t(key)}</span>
                <ArrowRight
                  size={18}
                  aria-hidden="true"
                  className="direction-arrow"
                />
              </NavLink>
            ))}
          </nav>
          <div className="mobile-menu-bottom">
            <div className="mobile-languages" role="group" aria-label={t("language")}>
              {(["fr", "ar", "en"] as const).map((code) => (
                <button
                  key={code}
                  lang={code}
                  onClick={() => setLang(code)}
                  aria-pressed={lang === code}
                >
                  <Flag lang={code} />
                  {code === "ar" ? "العربية" : code.toUpperCase()}
                </button>
              ))}
            </div>
            <Button to="/reservation" gold className="mobile-menu-cta">
              {t("planTrip")}
            </Button>
            <div className="mobile-menu-contact">
              <a
                className="whatsapp"
                href={whatsappHref()}
                target="_blank"
                rel="noreferrer"
              >
                <WhatsAppIcon size={18} />
                WhatsApp
              </a>
              <a href={telHref(agency.phones[0])}>
                <Phone size={17} aria-hidden="true" />
                {t("ctCallTitle")}
              </a>
            </div>
            <div className="mobile-menu-socials">
              {socialLinks().map((s) => (
                <a
                  key={s.kind}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  title={s.label}
                >
                  <SocialIcon kind={s.kind} size={17} />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export function WhatsAppFloat() {
  const { t } = useLanguage();
  return (
    <a
      className="whatsapp-float"
      href={whatsappHref()}
      target="_blank"
      rel="noreferrer"
      aria-label={t("ctWhatsapp")}
    >
      <span className="whatsapp-float-label">{t("ctWhatsapp")}</span>
      <span className="whatsapp-float-icon">
        <WhatsAppLogo size={32} />
      </span>
    </a>
  );
}
export function Footer() {
  const { t } = useLanguage();
  const link = (to: string) => nav.find(([path]) => path === to)!;
  const columns: [string, string[]][] = [
    ["fExplore", nav.slice(0, 4).map(([to]) => to)],
    ["fAgency", ["/a-propos", "/services", "/avis", "/contact"]],
  ];
  const socials = socialLinks();
  return (
    <footer className="footer">
      <div className="footer-mark" aria-hidden="true" />
      <div className="container footer-top">
        <div className="footer-brand">
          <Link to="/" aria-label={t("brand")}>
            <img src="/assets/logo-white.svg" alt={t("brand")} />
          </Link>
          <p>{t("footerTagline")}</p>
        </div>
        <div className="footer-actions">
          <a
            className="footer-pill whatsapp"
            href={whatsappHref()}
            target="_blank"
            rel="noreferrer"
          >
            <WhatsAppIcon size={16} />
            {t("ctWhatsapp")}
          </a>
          <a className="footer-pill" href={telHref(agency.phones[0])}>
            <Phone size={14} aria-hidden="true" />
            <span dir="ltr">{agency.phones[0]}</span>
          </a>
        </div>
      </div>
      <div className="container footer-grid">
        {columns.map(([title, links]) => (
          <nav className="footer-col" key={title} aria-label={t(title)}>
            <h3>{t(title)}</h3>
            {links.map((to) => (
              <Link to={to} key={to}>
                {t(link(to)[1])}
              </Link>
            ))}
          </nav>
        ))}
        <nav className="footer-col" aria-label={t("fInfo")}>
          <h3>{t("fInfo")}</h3>
          <Link to="/reservation">{t("navReservation")}</Link>
          <Link to="/conditions">{t("fTerms")}</Link>
          <Link to="/confidentialite">{t("fPrivacy")}</Link>
        </nav>
        <div className="footer-col footer-contact">
          <h3>{t("fContact")}</h3>
          {agency.phones.map((phone) => (
            <a key={phone} href={telHref(phone)}>
              <Phone size={14} aria-hidden="true" />
              <span dir="ltr">{phone}</span>
            </a>
          ))}
          <a href={whatsappHref()} target="_blank" rel="noreferrer">
            <WhatsAppIcon size={14} />
            WhatsApp
          </a>
          {validEmail(agency.email) && (
            <a href={`mailto:${agency.email}`}>{agency.email}</a>
          )}
          {agency.address && <p>{agency.address}</p>}
          {socials.length > 0 && (
            <>
              <h3 className="footer-follow">{t("fFollow")}</h3>
              <div className="footer-socials">
                <a
                  href={whatsappHref()}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="WhatsApp"
                  title="WhatsApp"
                >
                  <WhatsAppIcon size={16} />
                </a>
                {socials.map((s) => (
                  <a
                    href={s.href}
                    key={s.kind}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    title={s.label}
                  >
                    <SocialIcon kind={s.kind} size={15} />
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <div className="container footer-bottom">
        <p>
          © {new Date().getFullYear()} {t("brand")} — {t("rights")}
        </p>
        <div className="footer-bottom-end">
          <a
            className="footer-signature"
            href="https://thinkgroup.ma"
            target="_blank"
            rel="noopener"
          >
            {t("footerMade")} <strong>ThinkGroup</strong>
          </a>
          <button
            type="button"
            className="footer-top-button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label={t("fBackTop")}
            title={t("fBackTop")}
          >
            <ArrowUp size={14} aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  );
}
export function PageHero({
  title,
  subtitle,
  eyebrow,
  img = "istanbul2",
  parentTo,
  children,
}: {
  title: string;
  subtitle?: string;
  eyebrow: string;
  img?: string;
  parent?: string;
  parentTo?: string;
  children?: ReactNode;
}) {
  return (
    <section className={`page-hero ${parentTo ? "deep" : ""}`}>
      <img src={image(img)} alt="" className="cover" fetchPriority="high" />
      <div className="dark-scrim" />
      <div className="container page-hero-inner">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
        {children}
      </div>
    </section>
  );
}
export function TripCard({ trip, query = "" }: { trip: Trip; query?: string }) {
  const { t, l } = useLanguage();
  return (
    <Link
      className="trip-card"
      to={`/voyages/${trip.slug}${query ? "?" + query : ""}`}
    >
      <div className="trip-photo">
        <img
          src={image(trip.img)}
          alt={`${l(trip.dest)} — ${l(trip.country)}`}
          loading="lazy"
        />
      </div>
      <div className="trip-card-body">
        <h3>{l(trip.dest)}</h3>
        <p className="country">{l(trip.country)}</p>
        <div className="duration">
          <CalendarDays size={13} />
          {trip.days} {t("uJours")} / {trip.nights} {t("uNuits")}
        </div>
        <div className="card-bottom">
          <strong>{t("price")}</strong>
          <span className="circle-arrow">
            <ArrowRight size={16} className="direction-arrow" />
          </span>
        </div>
      </div>
    </Link>
  );
}
export function DestinationCard({ destination }: { destination: Destination }) {
  const { l } = useLanguage();
  return (
    <Link className="destination-card" to={`/destinations/${destination.slug}`}>
      <img
        src={image(destination.img)}
        alt={l(destination.name)}
        loading="lazy"
      />
      <div className="destination-scrim" />
      <div className="destination-caption">
        <div>
          <h3>{l(destination.name)}</h3>
          <p>{l(destination.country)}</p>
        </div>
        <span className="circle-arrow">
          <ArrowRight size={17} className="direction-arrow" />
        </span>
      </div>
    </Link>
  );
}
export function TripGrid({
  items = trips,
  query = "",
}: {
  items?: Trip[];
  query?: string;
}) {
  return (
    <div className="trip-grid">
      {items.map((trip) => (
        <TripCard key={trip.slug} trip={trip} query={query} />
      ))}
    </div>
  );
}
export function DestinationGrid({
  items = destinations,
  mosaic = false,
}: {
  items?: Destination[];
  mosaic?: boolean;
}) {
  return (
    <div className={`destination-grid ${mosaic ? "mosaic" : ""}`}>
      {items.map((d) => (
        <DestinationCard key={d.slug} destination={d} />
      ))}
    </div>
  );
}
export function Intro({ about = false }: { about?: boolean }) {
  const { t } = useLanguage();
  return (
    <section className="section">
      <div className="container intro-grid">
        <div className="intro-images">
          <img
            className="intro-main"
            src={image("home-intro")}
            alt=""
            loading="lazy"
          />
          <span className="intro-badge">{t("brand")}</span>
          <img
            className="intro-small"
            src={image("egypt")}
            alt=""
            loading="lazy"
          />
        </div>
        <div>
          <Eyebrow>{t(about ? "aHeroEyebrow" : "introEyebrow")}</Eyebrow>
          <h2>{t(about ? "aStoryTitle" : "introTitle")}</h2>
          <p>{t(about ? "aP1" : "introP1")}</p>
          <p>{t(about ? "aP2" : "introP2")}</p>
          {about ? (
            <p>{t("aP3")}</p>
          ) : (
            <Button to="/a-propos" secondary>
              {t("discoverAgency")}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
export function ServiceGrid() {
  const { t, l } = useLanguage();
  return (
    <div className="services-grid">
      {services.map((s) => (
        <Link to={serviceLinks[s.num]} className="service-card" key={s.num}>
          <div className="service-media">
            <img src={image(s.img)} alt="" loading="lazy" />
          </div>
          <div className="service-body">
            <span className="service-icon">
              <Icon name={s.icon} size={24} />
            </span>
            <h3>{l(s.title)}</h3>
            <p>{l(s.desc)}</p>
            <span className="service-more">
              {t(s.num === "06" ? "navContact" : "sDiscover")}
              <span className="service-arrow">
                <ArrowRight
                  size={16}
                  className="direction-arrow"
                  aria-hidden="true"
                />
              </span>
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
export function ValuesSection({ about = false }: { about?: boolean }) {
  const { t, l } = useLanguage();
  return (
    <section className="values-section">
      <div className="values-glow" aria-hidden="true" />
      <div className="container values-layout">
        <div className="values-intro">
          <Eyebrow>{t(about ? "aWayEyebrow" : "whyEyebrow")}</Eyebrow>
          <h2>{t(about ? "aWayTitle" : "whyTitle")}</h2>
          <p>{t(about ? "aWayText" : "whyLead")}</p>
          <div className="values-photo">
            <img src={image("intro2")} alt="" loading="lazy" />
            <a href={telHref(agency.phones[0])} className="values-call">
              <span className="values-call-icon">
                <Phone size={20} aria-hidden="true" />
              </span>
              <span>
                <small>{t("whyCall")}</small>
                <strong dir="ltr">{agency.phones[0]}</strong>
              </span>
            </a>
          </div>
        </div>
        <div className="values-grid">
          {values.map((v) => (
            <article className="value" key={v.icon}>
              <div className="value-top">
                <span className="value-icon">
                  <Icon name={v.icon} size={24} />
                </span>
              </div>
              <h3>{l(v.title)}</h3>
              <p>{l(v.desc)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
export function StepsSection() {
  const { t, l } = useLanguage();
  return (
    <section className="steps-section section">
      <div className="container">
        <div className="section-heading">
          <div>
            <Eyebrow>{t("howEyebrow")}</Eyebrow>
            <h2>{t("howTitle")}</h2>
          </div>
          <p>{t("howLead")}</p>
        </div>
        <div className="steps-grid">
          {steps.map((step, i) => (
            <div className="step" key={step.num}>
              <div className="step-top">
                <span>
                  <Icon name={["compass", "idea", "sparkles", "plane"][i]} />
                </span>
              </div>
              <h3>{l(step.title)}</h3>
              <p>{l(step.desc)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
export function FinalCTA() {
  const { t } = useLanguage();
  return (
    <section className="section final-cta">
      <div className="container">
        <h2>{t("finalTitle")}</h2>
        <p>{t("finalText")}</p>
        <div className="button-row">
          <Button to="/reservation">{t("finalPlan")}</Button>
          <Button to="/contact" secondary>
            {t("finalContact")}
          </Button>
        </div>
      </div>
    </section>
  );
}
export function Gallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const { t } = useLanguage();
  const dialog = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState(0);
  const opener = useRef<HTMLButtonElement | null>(null);
  return (
    <>
      <div className="gallery">
        {images.map((img, i) => (
          <button
            key={`${img}-${i}`}
            onClick={(e) => {
              opener.current = e.currentTarget;
              setActive(i);
              dialog.current?.showModal();
            }}
            aria-label={`${t("gallery")} — ${i + 1}`}
          >
            <img src={image(img)} alt={`${title} — ${i + 1}`} loading="lazy" />
            <span>
              <Check size={16} />
            </span>
          </button>
        ))}
      </div>
      <dialog
        className="photo-dialog"
        ref={dialog}
        onClose={() => opener.current?.focus()}
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
      >
        <button
          className="photo-close"
          onClick={() => dialog.current?.close()}
          aria-label={t("closeMenu")}
        >
          <X />
        </button>
        <img src={image(images[active])} alt={title} />
        <div>
          <button
            className="button secondary"
            disabled={active === 0}
            onClick={() => setActive(active - 1)}
          >
            {t("back")}
          </button>
          <span>
            {active + 1} / {images.length}
          </span>
          <button
            className="button secondary"
            disabled={active === images.length - 1}
            onClick={() => setActive(active + 1)}
            aria-label={t("gallery")}
          >
            <ArrowRight />
          </button>
        </div>
      </dialog>
    </>
  );
}
