import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { LanguageProvider, useLanguage } from "./i18n";
import { nav } from "./data";
import { Footer, Header, WhatsAppFloat } from "./components";
import Contact from "./Contact";
import Reservation from "./Reservation";
import ServicePage from "./ServicePage";
import { ReviewsPage } from "./Reviews";
import {
  About,
  DestinationDetail,
  Destinations,
  Home,
  Hotels,
  Legal,
  NotFound,
  Services,
  TripDetail,
  Voyages,
} from "./pages";
import "./styles.css";
function NavigationEffects() {
  const location = useLocation();
  const { t, lang } = useLanguage();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    document.getElementById("main")?.focus({ preventScroll: true });
  }, [location.pathname]);
  useEffect(() => {
    const key = nav.find(([path]) => path === location.pathname)?.[1];
    document.title = `${key ? t(key) + " | " : ""}${t("brand")}`;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", `${t("brand")}. ${t("footerTagline")}`);
  }, [location.pathname, lang, t]);
  return null;
}
function TripRoute() {
  const location = useLocation();
  return <TripDetail key={location.pathname} />;
}
function ReservationRoute() {
  const location = useLocation();
  return <Reservation key={location.search} />;
}
function App() {
  return (
    <>
      <NavigationEffects />
      <Header />
      <main id="main" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/voyages" element={<Voyages />} />
          <Route path="/voyages/:slug" element={<TripRoute />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/destinations/:slug" element={<DestinationDetail />} />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/services" element={<Services />} />
          <Route path="/a-propos" element={<About />} />
          <Route path="/services/:slug" element={<ServicePage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/reservation" element={<ReservationRoute />} />
          <Route path="/avis" element={<ReviewsPage />} />
          <Route path="/conditions" element={<Legal />} />
          <Route path="/confidentialite" element={<Legal privacy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <LanguageProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </LanguageProvider>
  </React.StrictMode>,
);
