import type { Field, L } from "./Forms";
import { numberOptions } from "./Forms";
import { trips } from "./data";

export type ServicePage = {
  slug: string;
  num: string;
  img: string;
  icon: string;
  heroTitle: L;
  heroSub: L;
  introTitle: L;
  intro: L;
  highlights: { icon: string; title: L; desc: L }[];
  formTitle: L;
  formLead: L;
  submit: L;
  fields: Field[];
  faq: { q: L; a: L }[];
  extra?: "trips" | "activities";
};

const adults = (max = 9): Field => ({
  name: "adults",
  type: "select",
  label: { fr: "Adultes", en: "Adults", ar: "البالغون" },
  options: numberOptions(1, max),
  defaultValue: "2",
});
const children = (max = 6): Field => ({
  name: "children",
  type: "select",
  label: {
    fr: "Enfants (2–11 ans)",
    en: "Children (2–11)",
    ar: "الأطفال (2–11 سنة)",
  },
  options: numberOptions(0, max),
  defaultValue: "0",
});
const message = (placeholder: L): Field => ({
  name: "message",
  type: "textarea",
  label: {
    fr: "Précisions",
    en: "Additional details",
    ar: "تفاصيل إضافية",
  },
  placeholder,
});
const opt = (value: string, fr: string, en: string, ar: string) => ({
  value,
  label: { fr, en, ar },
});

export const servicePages: ServicePage[] = [
  {
    slug: "voyages-organises",
    num: "01",
    img: "egypt2",
    icon: "route",
    heroTitle: {
      fr: "Voyages organisés",
      en: "Organised trips",
      ar: "رحلات منظّمة",
    },
    heroSub: {
      fr: "Choisissez un programme, nous nous occupons du reste : vols, hôtels, transferts et visites.",
      en: "Pick a programme and we handle the rest: flights, hotels, transfers and visits.",
      ar: "اختر البرنامج ونحن نتكفّل بالباقي: الطيران والفنادق والتنقّلات والزيارات.",
    },
    introTitle: {
      fr: "Partez l’esprit léger, tout est prévu",
      en: "Travel light, everything is arranged",
      ar: "سافر براحة بال فكل شيء مُعدّ مسبقاً",
    },
    intro: {
      fr: "Nos voyages organisés réunissent dans un seul programme le transport, l’hébergement, les transferts et les principales visites. Vous connaissez à l’avance le déroulement de chaque journée et vous profitez de la destination sans perdre de temps en logistique.",
      en: "Our organised trips bring transport, accommodation, transfers and key visits together in one programme. You know each day in advance and enjoy the destination without wasting time on logistics.",
      ar: "تجمع رحلاتنا المنظّمة في برنامج واحد الطيران والإقامة والتنقّلات وأهم الزيارات. تعرف مسبقاً تفاصيل كل يوم، وتستمتع بالوجهة دون أن تضيّع وقتك في التنظيم.",
    },
    highlights: [
      {
        icon: "plane",
        title: { fr: "Vols inclus", en: "Flights included", ar: "تذاكر الطيران" },
        desc: {
          fr: "Départs depuis les principales villes du Maroc.",
          en: "Departures from Morocco’s main cities.",
          ar: "انطلاق من أهم المدن المغربية.",
        },
      },
      {
        icon: "hotel",
        title: { fr: "Hôtels sélectionnés", en: "Selected hotels", ar: "فنادق مختارة" },
        desc: {
          fr: "Bien situés et vérifiés par notre équipe.",
          en: "Well located and checked by our team.",
          ar: "في مواقع جيدة وتمت مراجعتها من فريقنا.",
        },
      },
      {
        icon: "mapPin",
        title: { fr: "Visites guidées", en: "Guided visits", ar: "زيارات بمرافقة مرشد" },
        desc: {
          fr: "Les incontournables avec un guide local.",
          en: "The must-sees with a local guide.",
          ar: "أهم المعالم مع مرشد محلي.",
        },
      },
      {
        icon: "headphones",
        title: { fr: "Assistance", en: "Assistance", ar: "مواكبة مستمرة" },
        desc: {
          fr: "Un conseiller joignable avant et pendant le voyage.",
          en: "An advisor reachable before and during the trip.",
          ar: "مستشار متاح قبل السفر وأثناءه.",
        },
      },
    ],
    formTitle: {
      fr: "Réserver un voyage organisé",
      en: "Book an organised trip",
      ar: "احجز رحلة منظّمة",
    },
    formLead: {
      fr: "Choisissez votre programme et vos dates : un conseiller vous confirme la disponibilité et le tarif.",
      en: "Choose your programme and dates: an advisor confirms availability and price.",
      ar: "اختر البرنامج والموعد، وسيؤكد لك المستشار التوفّر والسعر.",
    },
    submit: {
      fr: "Envoyer ma réservation",
      en: "Send my booking",
      ar: "أرسل طلب الحجز",
    },
    fields: [
      {
        name: "trip",
        type: "select",
        required: true,
        full: true,
        label: { fr: "Programme", en: "Programme", ar: "البرنامج" },
        options: trips.map((trip) => ({
          value: trip.slug,
          label: {
            fr: `${trip.name.fr} — ${trip.days} j`,
            en: `${trip.name.en} — ${trip.days} d`,
            ar: `${trip.name.ar} — ${trip.days} أيام`,
          },
        })),
      },
      {
        name: "departDate",
        type: "date",
        required: true,
        label: { fr: "Date de départ souhaitée", en: "Preferred departure", ar: "تاريخ السفر المرغوب" },
      },
      {
        name: "origin",
        type: "select",
        label: { fr: "Ville de départ", en: "Departure city", ar: "مدينة الانطلاق" },
        options: [
          opt("casablanca", "Casablanca", "Casablanca", "الدار البيضاء"),
          opt("rabat", "Rabat", "Rabat", "الرباط"),
          opt("marrakech", "Marrakech", "Marrakech", "مراكش"),
          opt("tanger", "Tanger", "Tangier", "طنجة"),
          opt("fes", "Fès", "Fez", "فاس"),
          opt("agadir", "Agadir", "Agadir", "أكادير"),
        ],
      },
      adults(),
      children(),
      {
        name: "room",
        type: "select",
        label: { fr: "Chambre", en: "Room", ar: "نوع الغرفة" },
        options: [
          opt("double", "Double", "Double", "مزدوجة"),
          opt("single", "Individuelle", "Single", "فردية"),
          opt("triple", "Triple", "Triple", "ثلاثية"),
          opt("family", "Familiale", "Family", "عائلية"),
        ],
        defaultValue: "double",
      },
      message({
        fr: "Régime alimentaire, occasion spéciale, besoins particuliers…",
        en: "Dietary needs, special occasion, particular requirements…",
        ar: "نظام غذائي، مناسبة خاصة، احتياجات معيّنة…",
      }),
    ],
    faq: [
      {
        q: { fr: "Le prix est-il fixe ?", en: "Is the price fixed?", ar: "هل السعر ثابت؟" },
        a: {
          fr: "Le tarif dépend de la date, du nombre de voyageurs et du type de chambre. Il vous est communiqué par écrit avant toute confirmation.",
          en: "The price depends on the date, number of travellers and room type. It is sent to you in writing before any confirmation.",
          ar: "يتغيّر السعر حسب التاريخ وعدد المسافرين ونوع الغرفة، ونرسله إليك كتابياً قبل أي تأكيد.",
        },
      },
      {
        q: { fr: "Puis-je modifier le programme ?", en: "Can I change the programme?", ar: "هل يمكن تعديل البرنامج؟" },
        a: {
          fr: "Oui. Ajout de nuits, changement d’hôtel ou d’excursion : le conseiller adapte le programme à vos envies.",
          en: "Yes. Extra nights, another hotel or excursion: the advisor adapts the programme to you.",
          ar: "نعم، يمكن إضافة ليالٍ أو تغيير الفندق أو الجولات، ويكيّف المستشار البرنامج حسب رغبتك.",
        },
      },
      {
        q: { fr: "Et pour le visa ?", en: "What about visas?", ar: "ماذا عن التأشيرة؟" },
        a: {
          fr: "Nous vous indiquons les documents nécessaires selon la destination et vous accompagnons dans la constitution du dossier.",
          en: "We tell you which documents are needed for the destination and help you prepare the file.",
          ar: "نوضح لك الوثائق المطلوبة حسب الوجهة ونرافقك في تجهيز الملف.",
        },
      },
    ],
    extra: "trips",
  },
  {
    slug: "billetterie-aerienne",
    num: "02",
    img: "plane",
    icon: "ticket",
    heroTitle: {
      fr: "Billetterie aérienne",
      en: "Flight tickets",
      ar: "حجز تذاكر الطيران",
    },
    heroSub: {
      fr: "Réservez votre billet d’avion au meilleur tarif disponible, sur toutes les compagnies.",
      en: "Book your plane ticket at the best available fare, on all airlines.",
      ar: "احجز تذكرة طيرانك بأفضل سعر متاح، على مختلف شركات الطيران.",
    },
    introTitle: {
      fr: "Votre billet sans perdre de temps",
      en: "Your ticket without the hassle",
      ar: "تذكرتك بسهولة ودون عناء",
    },
    intro: {
      fr: "Indiquez votre trajet, vos dates et le nombre de passagers. Nous comparons les compagnies régulières et low-cost, nous vous proposons les meilleures options d’horaires et de prix, puis nous émettons votre billet électronique après votre validation.",
      en: "Tell us your route, dates and number of passengers. We compare scheduled and low-cost airlines, suggest the best schedules and fares, then issue your e-ticket once you approve.",
      ar: "أخبرنا بمسارك وتواريخ السفر وعدد المسافرين. نقارن بين الشركات النظامية والاقتصادية، ونقترح عليك أفضل المواعيد والأسعار، ثم نصدر تذكرتك الإلكترونية بعد موافقتك.",
    },
    highlights: [
      {
        icon: "plane",
        title: { fr: "Toutes compagnies", en: "All airlines", ar: "جميع الشركات" },
        desc: {
          fr: "Royal Air Maroc, Turkish Airlines, Emirates, Air Arabia et bien d’autres.",
          en: "Royal Air Maroc, Turkish Airlines, Emirates, Air Arabia and many more.",
          ar: "الخطوط الملكية المغربية، التركية، الإماراتية، العربية للطيران وغيرها.",
        },
      },
      {
        icon: "ticket",
        title: { fr: "Meilleur tarif", en: "Best fare", ar: "أفضل سعر" },
        desc: {
          fr: "Comparaison des prix et des conditions de bagages.",
          en: "Fares and baggage conditions compared.",
          ar: "مقارنة الأسعار وشروط الأمتعة.",
        },
      },
      {
        icon: "sparkles",
        title: { fr: "Billet électronique", en: "E-ticket", ar: "تذكرة إلكترونية" },
        desc: {
          fr: "Envoyé par WhatsApp ou email dès l’émission.",
          en: "Sent by WhatsApp or email once issued.",
          ar: "تصلك عبر واتساب أو البريد فور إصدارها.",
        },
      },
      {
        icon: "headphones",
        title: { fr: "Modifications", en: "Changes", ar: "التعديل والإلغاء" },
        desc: {
          fr: "Aide pour changement de date ou annulation.",
          en: "Help with date changes or cancellations.",
          ar: "مساعدة في تغيير الموعد أو الإلغاء.",
        },
      },
    ],
    formTitle: {
      fr: "Réserver mon billet d’avion",
      en: "Book my flight",
      ar: "احجز تذكرة الطيران",
    },
    formLead: {
      fr: "Remplissez votre itinéraire : nous vous envoyons les meilleures options de vol.",
      en: "Fill in your itinerary: we send you the best flight options.",
      ar: "املأ تفاصيل رحلتك، وسنرسل لك أفضل خيارات الطيران.",
    },
    submit: {
      fr: "Demander mon billet",
      en: "Request my ticket",
      ar: "اطلب التذكرة",
    },
    fields: [
      {
        name: "tripKind",
        type: "radio",
        label: { fr: "Type de trajet", en: "Trip type", ar: "نوع الرحلة" },
        options: [
          opt("roundtrip", "Aller-retour", "Round trip", "ذهاب وإياب"),
          opt("oneway", "Aller simple", "One way", "ذهاب فقط"),
          opt("multi", "Multi-destinations", "Multi-city", "وجهات متعددة"),
        ],
        defaultValue: "roundtrip",
      },
      {
        name: "from",
        type: "text",
        required: true,
        label: { fr: "Départ de", en: "From", ar: "من" },
        placeholder: { fr: "Casablanca (CMN)", en: "Casablanca (CMN)", ar: "الدار البيضاء (CMN)" },
      },
      {
        name: "to",
        type: "text",
        required: true,
        label: { fr: "Destination", en: "To", ar: "إلى" },
        placeholder: { fr: "Istanbul (IST)", en: "Istanbul (IST)", ar: "إسطنبول (IST)" },
      },
      {
        name: "departDate",
        type: "date",
        required: true,
        label: { fr: "Date aller", en: "Departure date", ar: "تاريخ الذهاب" },
      },
      {
        name: "returnDate",
        type: "date",
        required: true,
        after: "departDate",
        label: { fr: "Date retour", en: "Return date", ar: "تاريخ العودة" },
        showIf: (v) => v.tripKind !== "oneway",
      },
      adults(),
      children(),
      {
        name: "infants",
        type: "select",
        label: { fr: "Bébés (-2 ans)", en: "Infants (under 2)", ar: "الرضّع (أقل من سنتين)" },
        options: numberOptions(0, 4),
        defaultValue: "0",
      },
      {
        name: "cabin",
        type: "select",
        label: { fr: "Classe", en: "Cabin", ar: "الدرجة" },
        options: [
          opt("economy", "Économique", "Economy", "اقتصادية"),
          opt("premium", "Premium économique", "Premium economy", "اقتصادية ممتازة"),
          opt("business", "Affaires", "Business", "رجال الأعمال"),
          opt("first", "Première", "First", "الأولى"),
        ],
        defaultValue: "economy",
      },
      {
        name: "flexible",
        type: "checks",
        label: { fr: "Options", en: "Options", ar: "خيارات" },
        options: [
          opt("flex", "Dates flexibles (± 3 jours)", "Flexible dates (± 3 days)", "تواريخ مرنة (± 3 أيام)"),
          opt("direct", "Vol direct de préférence", "Direct flight preferred", "رحلة مباشرة إن أمكن"),
          opt("bag", "Bagage en soute", "Checked baggage", "أمتعة مسجّلة"),
        ],
      },
      message({
        fr: "Compagnie préférée, autres étapes pour un multi-destinations…",
        en: "Preferred airline, other legs for a multi-city trip…",
        ar: "شركة طيران مفضلة، أو باقي المحطات في حال تعدد الوجهات…",
      }),
    ],
    faq: [
      {
        q: { fr: "Quels documents faut-il ?", en: "Which documents are required?", ar: "ما الوثائق المطلوبة؟" },
        a: {
          fr: "Le nom exact tel qu’il figure sur le passeport de chaque passager. Le passeport doit généralement être valide 6 mois après le retour.",
          en: "Each passenger’s exact name as shown on the passport. Passports usually need to be valid for 6 months after return.",
          ar: "الاسم الكامل لكل مسافر كما هو في جواز السفر. وغالباً يجب أن يكون الجواز صالحاً 6 أشهر بعد العودة.",
        },
      },
      {
        q: { fr: "Quand le prix est-il garanti ?", en: "When is the price guaranteed?", ar: "متى يكون السعر مضموناً؟" },
        a: {
          fr: "Les tarifs aériens changent en continu. Le prix est garanti au moment de l’émission du billet, après votre accord.",
          en: "Airfares change constantly. The price is guaranteed when the ticket is issued, after your approval.",
          ar: "أسعار الطيران تتغيّر باستمرار، ويُضمن السعر عند إصدار التذكرة بعد موافقتك.",
        },
      },
      {
        q: { fr: "Comment je reçois mon billet ?", en: "How do I receive my ticket?", ar: "كيف أتسلّم تذكرتي؟" },
        a: {
          fr: "Vous recevez votre billet électronique par WhatsApp ou par email. Il suffit de le présenter avec votre passeport à l’aéroport.",
          en: "You receive your e-ticket by WhatsApp or email. Simply show it with your passport at the airport.",
          ar: "تصلك التذكرة الإلكترونية عبر واتساب أو البريد، ويكفي تقديمها مع جواز السفر في المطار.",
        },
      },
    ],
  },
  {
    slug: "hotels-sejours",
    num: "03",
    img: "resort",
    icon: "hotel",
    heroTitle: {
      fr: "Hôtels & séjours",
      en: "Hotels & stays",
      ar: "الفنادق والإقامات",
    },
    heroSub: {
      fr: "Réservez l’hôtel, le riad ou l’appartement qui correspond à votre voyage et à votre budget.",
      en: "Book the hotel, riad or apartment that suits your trip and budget.",
      ar: "احجز الفندق أو الرياض أو الشقة التي تناسب رحلتك وميزانيتك.",
    },
    introTitle: {
      fr: "Le bon hébergement au bon endroit",
      en: "The right place to stay in the right spot",
      ar: "الإقامة المناسبة في المكان المناسب",
    },
    intro: {
      fr: "Au Maroc comme à l’étranger, nous réservons votre hébergement selon vos critères : emplacement, catégorie, formule repas et budget. Nous vérifions les conditions d’annulation et vous envoyons votre confirmation de réservation.",
      en: "In Morocco and abroad, we book your accommodation to your criteria: location, category, meal plan and budget. We check the cancellation terms and send you your booking confirmation.",
      ar: "داخل المغرب وخارجه، نحجز إقامتك وفق معاييرك: الموقع والتصنيف ونوع الوجبات والميزانية. نتحقق من شروط الإلغاء ونرسل لك تأكيد الحجز.",
    },
    highlights: [
      {
        icon: "hotel",
        title: { fr: "Hôtels 3 à 5★", en: "3 to 5★ hotels", ar: "فنادق من 3 إلى 5 نجوم" },
        desc: {
          fr: "Mais aussi riads, resorts et appartements.",
          en: "As well as riads, resorts and apartments.",
          ar: "إضافة إلى الرياضات والمنتجعات والشقق.",
        },
      },
      {
        icon: "mapPin",
        title: { fr: "Emplacement étudié", en: "Well-chosen location", ar: "موقع مدروس" },
        desc: {
          fr: "Proche des sites que vous voulez visiter.",
          en: "Close to the places you want to visit.",
          ar: "قريب من الأماكن التي تودّ زيارتها.",
        },
      },
      {
        icon: "sparkles",
        title: { fr: "Formules au choix", en: "Meal plans", ar: "وجبات حسب اختيارك" },
        desc: {
          fr: "Petit-déjeuner, demi-pension ou tout inclus.",
          en: "Breakfast, half board or all inclusive.",
          ar: "فطور، نصف إقامة أو شامل كلياً.",
        },
      },
      {
        icon: "headphones",
        title: { fr: "Confirmation écrite", en: "Written confirmation", ar: "تأكيد مكتوب" },
        desc: {
          fr: "Bon d’échange envoyé avant votre arrivée.",
          en: "Voucher sent before your arrival.",
          ar: "قسيمة الحجز تصلك قبل وصولك.",
        },
      },
    ],
    formTitle: {
      fr: "Réserver mon hébergement",
      en: "Book my accommodation",
      ar: "احجز إقامتي",
    },
    formLead: {
      fr: "Indiquez votre destination et vos dates : nous vous proposons une sélection d’hôtels disponibles.",
      en: "Tell us your destination and dates: we propose a selection of available hotels.",
      ar: "حدّد وجهتك وتواريخ إقامتك، وسنقترح عليك مجموعة من الفنادق المتاحة.",
    },
    submit: {
      fr: "Demander mon hôtel",
      en: "Request my hotel",
      ar: "اطلب الحجز",
    },
    fields: [
      {
        name: "destination",
        type: "text",
        required: true,
        full: true,
        label: { fr: "Ville / destination", en: "City / destination", ar: "المدينة / الوجهة" },
        placeholder: { fr: "Marrakech, Istanbul, Dubaï…", en: "Marrakech, Istanbul, Dubai…", ar: "مراكش، إسطنبول، دبي…" },
      },
      {
        name: "checkIn",
        type: "date",
        required: true,
        label: { fr: "Arrivée", en: "Check-in", ar: "تاريخ الوصول" },
      },
      {
        name: "checkOut",
        type: "date",
        required: true,
        after: "checkIn",
        label: { fr: "Départ", en: "Check-out", ar: "تاريخ المغادرة" },
      },
      {
        name: "rooms",
        type: "select",
        label: { fr: "Chambres", en: "Rooms", ar: "عدد الغرف" },
        options: numberOptions(1, 6),
        defaultValue: "1",
      },
      adults(12),
      children(),
      {
        name: "category",
        type: "select",
        label: { fr: "Type d’hébergement", en: "Accommodation type", ar: "نوع الإقامة" },
        options: [
          opt("3", "Hôtel 3★", "3★ hotel", "فندق 3 نجوم"),
          opt("4", "Hôtel 4★", "4★ hotel", "فندق 4 نجوم"),
          opt("5", "Hôtel 5★", "5★ hotel", "فندق 5 نجوم"),
          opt("riad", "Riad / maison d’hôtes", "Riad / guesthouse", "رياض / دار ضيافة"),
          opt("resort", "Resort / club", "Resort / club", "منتجع"),
          opt("apartment", "Appartement", "Apartment", "شقة"),
        ],
      },
      {
        name: "board",
        type: "select",
        label: { fr: "Formule repas", en: "Meal plan", ar: "الوجبات" },
        options: [
          opt("room", "Logement seul", "Room only", "إقامة فقط"),
          opt("bb", "Petit-déjeuner", "Bed & breakfast", "مع الفطور"),
          opt("hb", "Demi-pension", "Half board", "نصف إقامة"),
          opt("fb", "Pension complète", "Full board", "إقامة كاملة"),
          opt("ai", "Tout inclus", "All inclusive", "شامل كلياً"),
        ],
      },
      {
        name: "budget",
        type: "text",
        label: { fr: "Budget par nuit (MAD)", en: "Budget per night (MAD)", ar: "الميزانية لليلة (درهم)" },
      },
      message({
        fr: "Vue mer, piscine, proximité du centre, lit bébé…",
        en: "Sea view, pool, close to the centre, baby cot…",
        ar: "إطلالة على البحر، مسبح، قرب وسط المدينة، سرير للرضيع…",
      }),
    ],
    faq: [
      {
        q: { fr: "Faut-il payer à l’avance ?", en: "Do I pay in advance?", ar: "هل يجب الدفع مسبقاً؟" },
        a: {
          fr: "Les conditions de paiement dépendent de l’hôtel et du tarif choisi. Elles vous sont précisées avant la confirmation.",
          en: "Payment terms depend on the hotel and rate. They are explained before confirmation.",
          ar: "تختلف شروط الدفع حسب الفندق والسعر المختار، ونوضحها لك قبل التأكيد.",
        },
      },
      {
        q: { fr: "Puis-je annuler ?", en: "Can I cancel?", ar: "هل يمكنني الإلغاء؟" },
        a: {
          fr: "Nous privilégions les tarifs annulables lorsque c’est possible et vous indiquons toujours la date limite d’annulation gratuite.",
          en: "We favour refundable rates where possible and always tell you the free-cancellation deadline.",
          ar: "نفضّل الأسعار القابلة للإلغاء متى أمكن، ونخبرك دائماً بآخر أجل للإلغاء المجاني.",
        },
      },
      {
        q: { fr: "Réservez-vous au Maroc ?", en: "Do you book in Morocco?", ar: "هل تحجزون داخل المغرب؟" },
        a: {
          fr: "Oui : Marrakech, Agadir, Tanger, Fès, Chefchaouen, Dakhla et toutes les grandes villes.",
          en: "Yes: Marrakech, Agadir, Tangier, Fez, Chefchaouen, Dakhla and all major cities.",
          ar: "نعم: مراكش، أكادير، طنجة، فاس، شفشاون، الداخلة وجميع المدن الكبرى.",
        },
      },
    ],
  },
  {
    slug: "voyages-sur-mesure",
    num: "04",
    img: "maldives",
    icon: "sparkles",
    heroTitle: {
      fr: "Voyages sur mesure",
      en: "Tailor-made trips",
      ar: "رحلات حسب الطلب",
    },
    heroSub: {
      fr: "Lune de miel, voyage en famille, entre amis ou en groupe : un itinéraire créé uniquement pour vous.",
      en: "Honeymoon, family, friends or group travel: an itinerary created just for you.",
      ar: "شهر عسل، رحلة عائلية، مع الأصدقاء أو ضمن مجموعة: برنامج مصمّم لك وحدك.",
    },
    introTitle: {
      fr: "Votre idée notre savoir-faire",
      en: "Your idea our know-how",
      ar: "فكرتك وخبرتنا",
    },
    intro: {
      fr: "Racontez-nous le voyage dont vous rêvez : destinations, durée, rythme, centres d’intérêt et budget. Nous construisons un itinéraire détaillé jour par jour, que nous ajustons avec vous jusqu’à ce qu’il soit parfait.",
      en: "Tell us about the trip you dream of: destinations, length, pace, interests and budget. We build a detailed day-by-day itinerary and fine-tune it with you until it’s just right.",
      ar: "حدّثنا عن الرحلة التي تحلم بها: الوجهات والمدة والإيقاع والاهتمامات والميزانية. نُعدّ برنامجاً مفصلاً يوماً بيوم، ونعدّله معك حتى يصبح كما تريد تماماً.",
    },
    highlights: [
      {
        icon: "idea",
        title: { fr: "100 % personnalisé", en: "100% personalised", ar: "مخصّص بالكامل" },
        desc: {
          fr: "Aucun programme standard : tout part de vous.",
          en: "No standard package: everything starts with you.",
          ar: "لا برامج جاهزة، كل شيء ينطلق منك.",
        },
      },
      {
        icon: "route",
        title: { fr: "Itinéraire détaillé", en: "Detailed itinerary", ar: "برنامج مفصّل" },
        desc: {
          fr: "Jour par jour, avec hôtels et activités.",
          en: "Day by day, with hotels and activities.",
          ar: "يوماً بيوم مع الفنادق والأنشطة.",
        },
      },
      {
        icon: "heartHandshake",
        title: { fr: "Pour chaque occasion", en: "For every occasion", ar: "لكل مناسبة" },
        desc: {
          fr: "Lune de miel, anniversaire, famille, groupe.",
          en: "Honeymoon, anniversary, family, group.",
          ar: "شهر العسل، ذكرى، عائلة، مجموعات.",
        },
      },
      {
        icon: "compass",
        title: { fr: "Ajustable", en: "Adjustable", ar: "قابل للتعديل" },
        desc: {
          fr: "Nous modifions la proposition jusqu’à votre accord.",
          en: "We revise the proposal until you’re happy.",
          ar: "نعدّل الاقتراح حتى يحظى بموافقتك.",
        },
      },
    ],
    formTitle: {
      fr: "Créer mon voyage sur mesure",
      en: "Create my tailor-made trip",
      ar: "صمّم رحلتي",
    },
    formLead: {
      fr: "Plus vous nous en dites, plus notre première proposition sera juste.",
      en: "The more you tell us, the more accurate our first proposal will be.",
      ar: "كلما شاركتنا تفاصيل أكثر، كان اقتراحنا الأول أدق.",
    },
    submit: {
      fr: "Recevoir ma proposition",
      en: "Get my proposal",
      ar: "أرسل لي اقتراحاً",
    },
    fields: [
      {
        name: "destination",
        type: "text",
        required: true,
        full: true,
        label: { fr: "Destination(s) souhaitée(s)", en: "Desired destination(s)", ar: "الوجهة أو الوجهات" },
        placeholder: { fr: "Ex. : Turquie puis Dubaï", en: "e.g. Turkey then Dubai", ar: "مثال: تركيا ثم دبي" },
      },
      {
        name: "occasion",
        type: "select",
        label: { fr: "Type de voyage", en: "Kind of trip", ar: "نوع الرحلة" },
        options: [
          opt("couple", "En couple", "Couple", "زوجان"),
          opt("honeymoon", "Lune de miel", "Honeymoon", "شهر العسل"),
          opt("family", "En famille", "Family", "عائلية"),
          opt("friends", "Entre amis", "Friends", "مع الأصدقاء"),
          opt("group", "Groupe / association", "Group / association", "مجموعة / جمعية"),
          opt("solo", "Seul(e)", "Solo", "فردية"),
        ],
      },
      {
        name: "departDate",
        type: "date",
        label: { fr: "Départ envisagé", en: "Planned departure", ar: "موعد السفر المتوقّع" },
      },
      {
        name: "duration",
        type: "select",
        label: { fr: "Durée", en: "Length", ar: "المدة" },
        options: [
          opt("3-5", "3 à 5 jours", "3–5 days", "من 3 إلى 5 أيام"),
          opt("6-8", "6 à 8 jours", "6–8 days", "من 6 إلى 8 أيام"),
          opt("9-12", "9 à 12 jours", "9–12 days", "من 9 إلى 12 يوماً"),
          opt("13+", "Plus de 12 jours", "More than 12 days", "أكثر من 12 يوماً"),
        ],
      },
      adults(20),
      children(),
      {
        name: "budget",
        type: "select",
        label: { fr: "Budget par personne", en: "Budget per person", ar: "الميزانية للشخص" },
        options: [
          opt("lt10", "Moins de 10 000 MAD", "Under 10,000 MAD", "أقل من 10.000 درهم"),
          opt("10-20", "10 000 – 20 000 MAD", "10,000 – 20,000 MAD", "10.000 – 20.000 درهم"),
          opt("20-35", "20 000 – 35 000 MAD", "20,000 – 35,000 MAD", "20.000 – 35.000 درهم"),
          opt("gt35", "Plus de 35 000 MAD", "Over 35,000 MAD", "أكثر من 35.000 درهم"),
        ],
      },
      {
        name: "level",
        type: "select",
        label: { fr: "Niveau de confort", en: "Comfort level", ar: "مستوى الراحة" },
        options: [
          opt("std", "Confort", "Comfort", "مريح"),
          opt("sup", "Supérieur", "Superior", "ممتاز"),
          opt("lux", "Luxe", "Luxury", "فاخر"),
        ],
      },
      {
        name: "interests",
        type: "checks",
        label: { fr: "Vos envies", en: "Your interests", ar: "اهتماماتك" },
        options: [
          opt("culture", "Culture & histoire", "Culture & history", "ثقافة وتاريخ"),
          opt("beach", "Plage & détente", "Beach & relaxation", "شاطئ واسترخاء"),
          opt("nature", "Nature & aventure", "Nature & adventure", "طبيعة ومغامرة"),
          opt("shopping", "Shopping", "Shopping", "تسوّق"),
          opt("food", "Gastronomie", "Food", "مطبخ محلي"),
          opt("religious", "Spirituel", "Spiritual", "روحاني"),
          opt("kids", "Activités enfants", "Kids’ activities", "أنشطة للأطفال"),
        ],
      },
      message({
        fr: "Décrivez votre voyage idéal…",
        en: "Describe your ideal trip…",
        ar: "صف لنا رحلتك المثالية…",
      }),
    ],
    faq: [
      {
        q: { fr: "Comment se passe la suite ?", en: "What happens next?", ar: "ما هي الخطوات التالية؟" },
        a: {
          fr: "Un conseiller vous recontacte pour préciser votre projet, puis vous envoie une proposition écrite avec l’itinéraire et le tarif.",
          en: "An advisor contacts you to refine your project, then sends a written proposal with the itinerary and price.",
          ar: "يتواصل معك مستشار لتدقيق تفاصيل مشروعك، ثم يرسل لك اقتراحاً مكتوباً يتضمن البرنامج والسعر.",
        },
      },
      {
        q: { fr: "La proposition m’engage-t-elle ?", en: "Am I committed by the proposal?", ar: "هل الاقتراح ملزم؟" },
        a: {
          fr: "Non. La proposition est gratuite et sans engagement ; vous ne réservez qu’après validation.",
          en: "No. The proposal is free and non-binding; you only book once you approve it.",
          ar: "لا، الاقتراح مجاني وغير ملزم، ولا يتم الحجز إلا بعد موافقتك.",
        },
      },
      {
        q: { fr: "Organisez-vous des voyages de groupe ?", en: "Do you organise group trips?", ar: "هل تنظّمون رحلات جماعية؟" },
        a: {
          fr: "Oui : familles nombreuses, associations, entreprises ou amis. Indiquez le nombre de participants dans le formulaire.",
          en: "Yes: large families, associations, companies or friends. Enter the number of participants in the form.",
          ar: "نعم: عائلات كبيرة، جمعيات، شركات أو أصدقاء. حدّد عدد المشاركين في النموذج.",
        },
      },
    ],
  },
  {
    slug: "transferts-activites",
    num: "05",
    img: "desert",
    icon: "mapPin",
    heroTitle: {
      fr: "Transferts & activités",
      en: "Transfers & activities",
      ar: "التنقّلات والأنشطة",
    },
    heroSub: {
      fr: "Transferts aéroport, excursions, visites guidées et expériences locales réservés à l’avance.",
      en: "Airport transfers, excursions, guided tours and local experiences booked in advance.",
      ar: "التنقل من وإلى المطار، الجولات، الزيارات المرشدة والتجارب المحلية بحجز مسبق.",
    },
    introTitle: {
      fr: "Arrivez sereinement vivez pleinement",
      en: "Arrive calmly live fully",
      ar: "وصول مريح وتجارب لا تُنسى",
    },
    intro: {
      fr: "Un chauffeur qui vous attend à l’aéroport, une excursion dans le désert, une croisière sur le Bosphore ou un safari à Dubaï : complétez votre voyage avec des services réservés à l’avance, à prix connu.",
      en: "A driver waiting at the airport, a desert excursion, a Bosphorus cruise or a Dubai safari: complete your trip with services booked in advance at a known price.",
      ar: "سائق ينتظرك في المطار، جولة في الصحراء، رحلة بحرية في البوسفور أو سفاري في دبي: أكمل رحلتك بخدمات محجوزة مسبقاً وبسعر واضح.",
    },
    highlights: [
      {
        icon: "plane",
        title: { fr: "Transferts aéroport", en: "Airport transfers", ar: "النقل من وإلى المطار" },
        desc: {
          fr: "Accueil à l’arrivée, suivi de votre vol.",
          en: "Meet & greet, flight tracking.",
          ar: "استقبال عند الوصول ومتابعة رحلتك.",
        },
      },
      {
        icon: "route",
        title: { fr: "Chauffeur privé", en: "Private driver", ar: "سائق خاص" },
        desc: {
          fr: "À la demi-journée ou à la journée.",
          en: "Half-day or full-day.",
          ar: "لنصف يوم أو ليوم كامل.",
        },
      },
      {
        icon: "compass",
        title: { fr: "Excursions", en: "Excursions", ar: "جولات سياحية" },
        desc: {
          fr: "Visites guidées et sorties à la journée.",
          en: "Guided tours and day trips.",
          ar: "زيارات بمرشد ورحلات ليوم واحد.",
        },
      },
      {
        icon: "sparkles",
        title: { fr: "Expériences", en: "Experiences", ar: "تجارب مميزة" },
        desc: {
          fr: "Croisières, safaris, ateliers, spectacles.",
          en: "Cruises, safaris, workshops, shows.",
          ar: "رحلات بحرية، سفاري، ورشات، عروض.",
        },
      },
    ],
    formTitle: {
      fr: "Réserver un transfert ou une activité",
      en: "Book a transfer or activity",
      ar: "احجز تنقّلاً أو نشاطاً",
    },
    formLead: {
      fr: "Choisissez le service, la ville et la date : nous confirmons le prix et l’horaire.",
      en: "Choose the service, city and date: we confirm the price and time.",
      ar: "اختر الخدمة والمدينة والتاريخ، وسنؤكد لك السعر والموعد.",
    },
    submit: {
      fr: "Réserver ce service",
      en: "Book this service",
      ar: "احجز الخدمة",
    },
    fields: [
      {
        name: "serviceType",
        type: "radio",
        required: true,
        label: { fr: "Service souhaité", en: "Service", ar: "الخدمة المطلوبة" },
        options: [
          opt("transfer", "Transfert aéroport", "Airport transfer", "نقل من/إلى المطار"),
          opt("driver", "Chauffeur privé", "Private driver", "سائق خاص"),
          opt("excursion", "Excursion / visite", "Excursion / tour", "جولة / زيارة"),
          opt("activity", "Activité / expérience", "Activity / experience", "نشاط / تجربة"),
        ],
        defaultValue: "transfer",
      },
      {
        name: "city",
        type: "text",
        required: true,
        label: { fr: "Ville", en: "City", ar: "المدينة" },
        placeholder: { fr: "Istanbul, Dubaï, Marrakech…", en: "Istanbul, Dubai, Marrakech…", ar: "إسطنبول، دبي، مراكش…" },
      },
      {
        name: "date",
        type: "date",
        required: true,
        label: { fr: "Date", en: "Date", ar: "التاريخ" },
      },
      {
        name: "time",
        type: "time",
        label: { fr: "Heure", en: "Time", ar: "الساعة" },
      },
      {
        name: "passengers",
        type: "select",
        label: { fr: "Personnes", en: "People", ar: "عدد الأشخاص" },
        options: numberOptions(1, 20),
        defaultValue: "2",
      },
      {
        name: "flight",
        type: "text",
        label: { fr: "N° de vol", en: "Flight number", ar: "رقم الرحلة" },
        placeholder: { fr: "AT 800", en: "AT 800", ar: "AT 800" },
        ltr: true,
        showIf: (v) => v.serviceType === "transfer",
      },
      {
        name: "pickup",
        type: "text",
        label: { fr: "Lieu de prise en charge", en: "Pick-up point", ar: "مكان الانطلاق" },
        placeholder: { fr: "Aéroport, hôtel…", en: "Airport, hotel…", ar: "المطار، الفندق…" },
        showIf: (v) => v.serviceType === "transfer" || v.serviceType === "driver",
      },
      {
        name: "dropoff",
        type: "text",
        label: { fr: "Destination", en: "Drop-off point", ar: "مكان الوصول" },
        showIf: (v) => v.serviceType === "transfer" || v.serviceType === "driver",
      },
      {
        name: "activity",
        type: "text",
        required: true,
        full: true,
        label: { fr: "Activité souhaitée", en: "Desired activity", ar: "النشاط المطلوب" },
        placeholder: { fr: "Ex. : croisière Bosphore, safari désert…", en: "e.g. Bosphorus cruise, desert safari…", ar: "مثال: رحلة البوسفور، سفاري الصحراء…" },
        showIf: (v) => v.serviceType === "excursion" || v.serviceType === "activity",
      },
      message({
        fr: "Bagages volumineux, siège enfant, langue du guide…",
        en: "Large luggage, child seat, guide language…",
        ar: "أمتعة كبيرة، مقعد طفل، لغة المرشد…",
      }),
    ],
    faq: [
      {
        q: { fr: "Et si mon vol est en retard ?", en: "What if my flight is late?", ar: "ماذا لو تأخّرت رحلتي؟" },
        a: {
          fr: "Avec votre numéro de vol, le chauffeur adapte l’heure de prise en charge à l’arrivée réelle.",
          en: "With your flight number, the driver adjusts pick-up to the actual arrival time.",
          ar: "برقم رحلتك، يعدّل السائق موعد الاستقبال حسب وقت الوصول الفعلي.",
        },
      },
      {
        q: { fr: "Les activités sont-elles privées ?", en: "Are activities private?", ar: "هل الأنشطة خاصة؟" },
        a: {
          fr: "Selon l’activité, nous proposons des formules partagées ou privées. Précisez votre préférence dans le formulaire.",
          en: "Depending on the activity, we offer shared or private options. State your preference in the form.",
          ar: "حسب النشاط، نوفر صيغاً جماعية أو خاصة. حدّد اختيارك في النموذج.",
        },
      },
      {
        q: { fr: "Puis-je réserver sans voyage organisé ?", en: "Can I book without a package?", ar: "هل يمكن الحجز دون رحلة منظّمة؟" },
        a: {
          fr: "Oui, ces services peuvent être réservés seuls, même si vous avez acheté votre vol ailleurs.",
          en: "Yes, these services can be booked on their own, even if you bought your flight elsewhere.",
          ar: "نعم، يمكن حجز هذه الخدمات بشكل مستقل حتى لو اشتريت تذكرتك من جهة أخرى.",
        },
      },
    ],
    extra: "activities",
  },
];

export const activities = [
  {
    img: "desert",
    title: { fr: "Nuit dans le désert", en: "Night in the desert", ar: "ليلة في الصحراء" },
    place: { fr: "Merzouga · Agafay", en: "Merzouga · Agafay", ar: "مرزوكة · أكفاي" },
  },
  {
    img: "istanbul2",
    title: { fr: "Croisière sur le Bosphore", en: "Bosphorus cruise", ar: "رحلة بحرية في البوسفور" },
    place: { fr: "Istanbul", en: "Istanbul", ar: "إسطنبول" },
  },
  {
    img: "dubai2",
    title: { fr: "Safari dans le désert", en: "Desert safari", ar: "سفاري الصحراء" },
    place: { fr: "Dubaï", en: "Dubai", ar: "دبي" },
  },
  {
    img: "bali",
    title: { fr: "Temples & rizières", en: "Temples & rice terraces", ar: "المعابد وحقول الأرز" },
    place: { fr: "Bali", en: "Bali", ar: "بالي" },
  },
  {
    img: "market",
    title: { fr: "Visite des souks", en: "Souk tour", ar: "جولة في الأسواق" },
    place: { fr: "Marrakech", en: "Marrakech", ar: "مراكش" },
  },
  {
    img: "egypt",
    title: { fr: "Pyramides de Gizeh", en: "Giza pyramids", ar: "أهرامات الجيزة" },
    place: { fr: "Le Caire", en: "Cairo", ar: "القاهرة" },
  },
];

export const serviceLinks: Record<string, string> = {
  ...Object.fromEntries(servicePages.map((s) => [s.num, `/services/${s.slug}`])),
  "06": "/contact",
};
