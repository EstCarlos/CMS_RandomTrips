/* ─────────────────────────────────────────────────────────
   RANDOM TRIPS — Data real de producción
   Fuente: figma-make-data.json (entidades del CMS)
   Moneda base: DOP. Tasas de conversión en SiteConfig.
───────────────────────────────────────────────────────── */
import type {
  SiteConfig, ServiceCatalogItem, Destination, Experience,
  MediaAsset, Tour, Availability, Page, Customer, Booking,
  Payment, PaymentLink, Testimonial, BookingStatus, PaymentLinkStatus,
  LanguageCode, Operator,
} from "./types";

/* ── SiteConfig ──────────────────────────────────────── */
export const SITE_CONFIG: SiteConfig = {
  contact: {
    whatsapp: "+1 (849) 589-2057",           // principal (formularios / reservas)
    whatsappSecondary: "+1 (809) 601-6082",  // flyers de Instagram
    email: "info@randomtrips.co",
  },
  social: {
    instagram: "@randomtrips.co",
  },
  exchangeRates: {
    base: "DOP",
    USD: 0.0167,
    EUR: 0.0155,
  },
  defaultDeparturePoint: {
    name: "Bon Plaza Paraíso",
    address: "Av. Winston Churchill, Santo Domingo",
    mapsUrl: "https://share.google/ic18n9Gy6v6j9NLjL",
  },
  paymentInfo: {
    bank: "Banreservas",
    accountHolder: "RANDOM TRIPS S.R.L.",
    accountType: "Cuenta corriente",
    accountNumber: "9609086703",
    rnc: "133540118",
    defaultFixedDeposit: 1000,
    depositNote: "Este monto de apartado no es reembolsable.",
  },
};

/* ── ServiceCatalog ──────────────────────────────────── */
export const SERVICE_CATALOG: ServiceCatalogItem[] = [
  { id: "svc-transporte",     name: { es: "Transporte ida y vuelta en bus", en: "Round-trip bus transport"      }, icon: "🚌", category: "transportation",  order: 1  },
  { id: "svc-cafe-agua",      name: { es: "Café y agua",                    en: "Coffee and water"              }, icon: "☕", category: "food",            order: 2  },
  { id: "svc-almuerzo",       name: { es: "Almuerzo típico",                en: "Typical lunch"                 }, icon: "🍽️", category: "food",            order: 3  },
  { id: "svc-staff",          name: { es: "Asistencia del staff",           en: "Staff assistance"              }, icon: "👥", category: "guide",           order: 4  },
  { id: "svc-guia",           name: { es: "Guías experimentados",           en: "Experienced guides"            }, icon: "🧭", category: "guide",           order: 5  },
  { id: "svc-entradas",       name: { es: "Entradas / accesos",             en: "Entry / access fees"           }, icon: "🎟️", category: "taxes",           order: 6  },
  { id: "svc-chaleco",        name: { es: "Chalecos salvavidas",            en: "Life vests"                    }, icon: "🦺", category: "safety",          order: 7  },
  { id: "svc-fotos",          name: { es: "Fotografías y videos",           en: "Photos and videos"             }, icon: "📷", category: "extras",          order: 8  },
  { id: "svc-snacks",         name: { es: "Snacks",                         en: "Snacks"                        }, icon: "🍪", category: "food",            order: 10 },
  { id: "svc-lockers",        name: { es: "Acceso a lockers",               en: "Lockers access"                }, icon: "🔐", category: "extras",          order: 11 },
  { id: "svc-zipline",        name: { es: "Ziplines",                        en: "Ziplines"                      }, icon: "🎢", category: "activity",        order: 12 },
  { id: "svc-transporte-mar", name: { es: "Transporte marítimo",            en: "Maritime transport"            }, icon: "⛵", category: "transportation",  order: 13 },
  { id: "svc-glamping",       name: { es: "Hospedaje glamping",              en: "Glamping accommodation"        }, icon: "⛺", category: "accommodation",   order: 14 },
  { id: "svc-desayuno",       name: { es: "Desayuno",                        en: "Breakfast"                     }, icon: "🍳", category: "food",            order: 15 },
  { id: "svc-impuestos-amb",  name: { es: "Impuestos medio ambiente",        en: "Environmental taxes"           }, icon: "🌿", category: "taxes",           order: 16 },
];

/* ── Destinations ────────────────────────────────────── */
export const DESTINATIONS: Destination[] = [
  {
    id: "dest-santiago",
    slug: "santiago",
    name: { es: "Santiago", en: "Santiago" },
    description: { es: "Corazón del Cibao y puerta a la Cordillera Septentrional, hogar del Pico Diego de Ocampo.", en: "Heart of the Cibao and gateway to the Cordillera Septentrional, home of Pico Diego de Ocampo." },
    lat: "19.4517",
    lng: "-70.6970",
    experienceCount: 1,
    tourCount: 1,
    status: "published",
    emoji: "⛰️",
    color: "#D1FAE5",
  },
  {
    id: "dest-bonao",
    slug: "bonao",
    name: { es: "Bonao", en: "Bonao" },
    description: { es: "Municipio de Monseñor Nouel, conocido por sus saltos y naturaleza exuberante.", en: "Town in Monseñor Nouel province, known for its waterfalls and lush nature." },
    lat: "18.9367",
    lng: "-70.4083",
    experienceCount: 1,
    tourCount: 1,
    status: "published",
    emoji: "💧",
    color: "#DBEAFE",
  },
  {
    id: "dest-barahona",
    slug: "barahona",
    name: { es: "Barahona", en: "Barahona" },
    description: { es: "Región sur de aguas cristalinas, ríos turquesa y paisajes vírgenes.", en: "Southern region of crystal-clear waters, turquoise rivers and pristine landscapes." },
    lat: "18.2085",
    lng: "-71.1008",
    experienceCount: 1,
    tourCount: 1,
    status: "published",
    emoji: "🏞️",
    color: "#A5F3FC",
  },
  /* ── Destinos para TravelHood Plan 1 ── */
  {
    id: "dest-santo-domingo",
    slug: "santo-domingo",
    name: { es: "Santo Domingo", en: "Santo Domingo" },
    description: { es: "La primera ciudad del Nuevo Mundo, con la Zona Colonial declarada Patrimonio UNESCO.", en: "The first city of the New World, with the Colonial Zone declared a UNESCO Heritage Site." },
    lat: "18.4861",
    lng: "-69.9312",
    experienceCount: 0,
    tourCount: 1,
    status: "published",
    emoji: "🏛️",
    color: "#FED7AA",
  },
  {
    id: "dest-puerto-plata",
    slug: "puerto-plata",
    name: { es: "Puerto Plata", en: "Puerto Plata" },
    description: { es: "Costa norte con el teleférico del Pico Isabel, los Charcos de Damajagua y la Fortaleza San Felipe.", en: "North coast with the Isabel de Torres cable car, Damajagua waterfalls and Fort San Felipe." },
    lat: "19.7931",
    lng: "-70.6817",
    experienceCount: 0,
    tourCount: 1,
    status: "published",
    emoji: "🚡",
    color: "#C7D2FE",
  },
  {
    id: "dest-rio-san-juan",
    slug: "rio-san-juan",
    name: { es: "Río San Juan", en: "Río San Juan" },
    description: { es: "Ciudad costera del norte con la Laguna Gri-Gri, Playa Grande y sus manglares.", en: "Northern coastal town with Gri-Gri Lagoon, Playa Grande and mangroves." },
    lat: "19.6346",
    lng: "-70.1484",
    experienceCount: 0,
    tourCount: 1,
    status: "published",
    emoji: "🛶",
    color: "#A7F3D0",
  },
  {
    id: "dest-las-terrenas",
    slug: "las-terrenas",
    name: { es: "Las Terrenas", en: "Las Terrenas" },
    description: { es: "Cosmopolita villa costera en la península de Samaná con Playa Bonita y el Salto de Socoa.", en: "Cosmopolitan coastal village in the Samaná peninsula with Playa Bonita and Socoa Waterfall." },
    lat: "19.3167",
    lng: "-69.5333",
    experienceCount: 0,
    tourCount: 1,
    status: "published",
    emoji: "🌅",
    color: "#FDE68A",
  },
  {
    id: "dest-pedernales",
    slug: "pedernales",
    name: { es: "Pedernales", en: "Pedernales" },
    description: { es: "Sur profundo de República Dominicana, hogar de la mítica Bahía de las Águilas.", en: "Deep south of the Dominican Republic, home of the mythical Bahía de las Águilas." },
    lat: "17.9975",
    lng: "-71.7384",
    experienceCount: 0,
    tourCount: 1,
    status: "published",
    emoji: "🦅",
    color: "#FCA5A5",
  },
  /* ── Samaná (original, mantenido) ── */
  {
    id: "dest-samana",
    slug: "samana",
    name: { es: "Samaná", en: "Samaná" },
    description: { es: "Península del noreste famosa por sus playas vírgenes, cocoteros y aguas turquesa, hogar de Playa Frontón.", en: "Northeastern peninsula famous for its pristine beaches, palm trees and turquoise waters, home of Playa Frontón." },
    lat: "19.2056",
    lng: "-69.3367",
    experienceCount: 6,
    tourCount: 1,
    status: "published",
    emoji: "🌴",
    color: "#FEF9C3",
  },
];

/* ── Experiences ─────────────────────────────────────── */
export const EXPERIENCES: Experience[] = [
  {
    id: "exp-pico-diego",
    destinationId: "dest-santiago",
    name: { es: "Pico Diego de Ocampo", en: "Pico Diego de Ocampo" },
    description: { es: "Senderismo hasta el monumento natural de la Cordillera Septentrional para ver el amanecer.", en: "Hike to the Cordillera Septentrional natural monument to watch the sunrise." },
    type: "Montaña",
    duration: "4–5 horas",
    basePrice: 950,
    tourCount: 1,
    status: "published",
  },
  {
    id: "exp-salto-jima",
    destinationId: "dest-bonao",
    name: { es: "Salto de Jima", en: "Salto de Jima" },
    description: { es: "Cascada y balneario natural en Bonao para refrescarse tras el senderismo.", en: "Waterfall and natural pool in Bonao to cool off after the hike." },
    type: "Aventura",
    duration: "2–3 horas",
    basePrice: 850,
    tourCount: 1,
    status: "published",
  },
  {
    id: "exp-playa-las-galeras",
    destinationId: "dest-samana",
    name: { es: "Playa Las Galeras", en: "Las Galeras Beach" },
    description: { es: "Punto de partida costero hacia las playas escondidas de Samaná.", en: "Coastal starting point toward Samaná's hidden beaches." },
    type: "Playa",
    duration: "45 min",
    basePrice: 600,
    tourCount: 1,
    status: "published",
  },
  {
    id: "exp-cueva-elefante",
    destinationId: "dest-samana",
    name: { es: "Vista: La Cueva del Elefante", en: "Viewpoint: The Elephant Cave" },
    description: { es: "Mirador hacia la imponente formación rocosa conocida como La Cueva del Elefante.", en: "Viewpoint over the striking rock formation known as The Elephant Cave." },
    type: "Naturaleza",
    duration: "30 min",
    basePrice: 0,
    tourCount: 1,
    status: "published",
  },
  {
    id: "exp-piscina-natural",
    destinationId: "dest-samana",
    name: { es: "Piscina Natural", en: "Natural Pool" },
    description: { es: "Piscina natural de aguas calmadas y cristalinas para nadar y relajarse.", en: "Calm, crystal-clear natural pool to swim and relax." },
    type: "Playa",
    duration: "1 hora",
    basePrice: 700,
    tourCount: 1,
    status: "published",
  },
  {
    id: "exp-playa-madama",
    destinationId: "dest-samana",
    name: { es: "Playa Madama", en: "Madama Beach" },
    description: { es: "Pequeña playa resguardada entre acantilados y vegetación.", en: "Small sheltered beach tucked between cliffs and greenery." },
    type: "Playa",
    duration: "1 hora",
    basePrice: 700,
    tourCount: 1,
    status: "published",
  },
  {
    id: "exp-playa-aserradero",
    destinationId: "dest-samana",
    name: { es: "Playa del Aserradero", en: "Aserradero Beach" },
    description: { es: "Playa tranquila de arena clara en el trayecto hacia Frontón.", en: "Quiet light-sand beach along the way to Frontón." },
    type: "Playa",
    duration: "45 min",
    basePrice: 600,
    tourCount: 1,
    status: "published",
  },
  {
    id: "exp-playa-fronton",
    destinationId: "dest-samana",
    name: { es: "Playa Frontón", en: "Frontón Beach" },
    description: { es: "Uno de los tesoros más imponentes de RD: acantilados, cocoteros y aguas turquesa.", en: "One of the DR's most striking treasures: cliffs, palm trees and turquoise waters." },
    type: "Playa",
    duration: "2 horas",
    basePrice: 1200,
    tourCount: 1,
    status: "published",
  },
  {
    id: "exp-balneario-la-plaza",
    destinationId: "dest-barahona",
    name: { es: "Balneario La Plaza", en: "Balneario La Plaza" },
    description: { es: "El río más cristalino de RD: agua turquesa, charcos y trayecto guiado con chaleco.", en: "The most crystal-clear river in the DR: turquoise water, pools and a guided route with life vests." },
    type: "Aventura",
    duration: "4–5 horas",
    basePrice: 2200,
    tourCount: 1,
    status: "published",
  },
];

/* ── MediaAssets ─────────────────────────────────────── */
export const MEDIA_ASSETS: MediaAsset[] = [
  {
    id: "media-pico-1",
    name: "pico-diego-amanecer.jpg",
    type: "photo",
    association: "tour",
    associatedTo: "Pico Diego de Ocampo + Salto de Jima",
    url: "https://lh6.googleusercontent.com/5J4UpaCBBGrnvdMF64IJtvE6HifElCRfnrbIkwiaVz-VXHVKlrh4gGJT-l69Pyk0JTE8YCe103tItnI=w1200-h630-p",
    alt: { es: "Amanecer en el Pico Diego de Ocampo", en: "Sunrise at Pico Diego de Ocampo" },
    dimensions: "1200×630",
    size: "~280 KB",
    uploadedAt: "Jun 2026",
    color: "#D1FAE5",
    emoji: "⛰️",
  },
  {
    id: "media-pico-2",
    name: "pico-diego-panoramica.jpg",
    type: "photo",
    association: "tour",
    associatedTo: "Pico Diego de Ocampo + Salto de Jima",
    url: "",
    alt: { es: "Vista panorámica del Pico Diego de Ocampo", en: "Panoramic view of Pico Diego de Ocampo" },
    dimensions: "—",
    size: "—",
    uploadedAt: "Jun 2026",
    color: "#BBF7D0",
    emoji: "🌄",
  },
  {
    id: "media-jima-1",
    name: "salto-jima-bonao.jpg",
    type: "photo",
    association: "tour",
    associatedTo: "Pico Diego de Ocampo + Salto de Jima",
    url: "",
    alt: { es: "Salto de Jima en Bonao", en: "Salto de Jima in Bonao" },
    dimensions: "—",
    size: "—",
    uploadedAt: "Jun 2026",
    color: "#DBEAFE",
    emoji: "💧",
  },
  {
    id: "media-plaza-1",
    name: "balneario-la-plaza-barahona.jpg",
    type: "photo",
    association: "tour",
    associatedTo: "Balneario La Plaza",
    url: "https://lh3.googleusercontent.com/pw/AP1GczPN7aD5XjMFBLXf5-eoAtl8vxYAiJNfwMVfbZ2zT9oLSWfDrwJDxCuIIDmUzS9SkMFMfm5o6rZPiQjXOXlQBf5uOJZ5U-d9SjnIAqJUJDcENL0NWUA=w1200-h630-p",
    alt: { es: "Aguas cristalinas del Balneario La Plaza en Barahona", en: "Crystal-clear waters of Balneario La Plaza in Barahona" },
    dimensions: "1200×630",
    size: "~310 KB",
    uploadedAt: "Jun 2026",
    color: "#A5F3FC",
    emoji: "🏞️",
  },
  {
    id: "media-fronton-1",
    name: "playa-fronton-samana.jpg",
    type: "photo",
    association: "tour",
    associatedTo: "Playa Frontón",
    url: "",
    alt: { es: "Playa Frontón con sus acantilados en Samaná", en: "Playa Frontón with its cliffs in Samaná" },
    dimensions: "—",
    size: "—",
    uploadedAt: "Abr 2026",
    color: "#FEF9C3",
    emoji: "🌴",
  },
  {
    id: "media-fronton-2",
    name: "samana-cocoteros-turquesa.jpg",
    type: "photo",
    association: "tour",
    associatedTo: "Playa Frontón",
    url: "",
    alt: { es: "Cocoteros y aguas turquesa de Samaná", en: "Palm trees and turquoise waters of Samaná" },
    dimensions: "—",
    size: "—",
    uploadedAt: "Abr 2026",
    color: "#A5F3FC",
    emoji: "🏝️",
  },
  {
    id: "media-fronton-flyer",
    name: "fronton-flyer.jpg",
    type: "photo",
    association: "tour",
    associatedTo: "Playa Frontón",
    url: "",
    alt: { es: "Flyer Playa Frontón Samaná", en: "Playa Frontón Samaná flyer" },
    dimensions: "—",
    size: "—",
    uploadedAt: "Abr 2026",
    color: "#FDE68A",
    emoji: "📋",
  },
  {
    id: "media-plaza-2",
    name: "balneario-la-plaza-charcos.jpg",
    type: "photo",
    association: "tour",
    associatedTo: "Balneario La Plaza",
    url: "",
    alt: { es: "Charcos cristalinos en la ruta de La Plaza", en: "Crystal-clear pools along the La Plaza route" },
    dimensions: "—",
    size: "—",
    uploadedAt: "Jun 2026",
    color: "#7DD3FC",
    emoji: "🌊",
  },
  {
    id: "media-samana-sunrise",
    name: "samana-amanecer-peninsula.jpg",
    type: "photo",
    association: "destination",
    associatedTo: "dest-samana",
    url: "",
    alt: { es: "Amanecer en la Península de Samaná", en: "Sunrise over Samaná Peninsula" },
    dimensions: "—",
    size: "—",
    uploadedAt: "May 2026",
    color: "#FEF9C3",
    emoji: "🌅",
  },
  {
    id: "media-barahona-rio",
    name: "barahona-rio-turquesa.jpg",
    type: "photo",
    association: "destination",
    associatedTo: "dest-barahona",
    url: "",
    alt: { es: "Río turquesa en Barahona", en: "Turquoise river in Barahona" },
    dimensions: "—",
    size: "—",
    uploadedAt: "Jun 2026",
    color: "#A5F3FC",
    emoji: "🌊",
  },
  {
    id: "media-grupo-tour-1",
    name: "random-trips-grupo-aventura.jpg",
    type: "photo",
    association: "global",
    associatedTo: "global",
    url: "",
    alt: { es: "Grupo disfrutando tour de aventura", en: "Group enjoying adventure tour" },
    dimensions: "—",
    size: "—",
    uploadedAt: "Jun 2026",
    color: "#D1FAE5",
    emoji: "👥",
  },
  {
    id: "media-almuerzo-playa",
    name: "almuerzo-tipico-playa.jpg",
    type: "photo",
    association: "global",
    associatedTo: "global",
    url: "",
    alt: { es: "Almuerzo típico dominicano en la playa", en: "Traditional Dominican lunch on the beach" },
    dimensions: "—",
    size: "—",
    uploadedAt: "May 2026",
    color: "#FED7AA",
    emoji: "🍽️",
  },
  {
    id: "media-bote-fronton",
    name: "bote-ruta-fronton.jpg",
    type: "photo",
    association: "tour",
    associatedTo: "tour-playa-fronton",
    url: "",
    alt: { es: "Bote en ruta a Playa Frontón", en: "Boat en route to Playa Frontón" },
    dimensions: "—",
    size: "—",
    uploadedAt: "Abr 2026",
    color: "#DBEAFE",
    emoji: "⛵",
  },
  {
    id: "media-pico-group",
    name: "pico-diego-grupo-cumbre.jpg",
    type: "photo",
    association: "tour",
    associatedTo: "tour-pico-diego-salto-jima",
    url: "",
    alt: { es: "Grupo en la cima del Pico Diego de Ocampo", en: "Group at the summit of Pico Diego de Ocampo" },
    dimensions: "—",
    size: "—",
    uploadedAt: "Jul 2026",
    color: "#BBF7D0",
    emoji: "🏆",
  },
  {
    id: "media-piscina-natural",
    name: "piscina-natural-samana.jpg",
    type: "photo",
    association: "tour",
    associatedTo: "tour-playa-fronton",
    url: "",
    alt: { es: "Piscina natural en aguas cristalinas de Samaná", en: "Natural pool in crystal-clear Samaná waters" },
    dimensions: "—",
    size: "—",
    uploadedAt: "Abr 2026",
    color: "#A7F3D0",
    emoji: "🏊",
  },
  {
    id: "media-travelhood-sd",
    name: "santo-domingo-zona-colonial.jpg",
    type: "photo",
    association: "destination",
    associatedTo: "dest-santo-domingo",
    url: "",
    alt: { es: "Zona Colonial de Santo Domingo", en: "Colonial Zone of Santo Domingo" },
    dimensions: "—",
    size: "—",
    uploadedAt: "Mar 2026",
    color: "#FED7AA",
    emoji: "🏛️",
  },
  {
    id: "media-bahia-aguilas",
    name: "bahia-aguilas-pedernales.jpg",
    type: "photo",
    association: "destination",
    associatedTo: "dest-pedernales",
    url: "",
    alt: { es: "Bahía de las Águilas en Pedernales", en: "Bahía de las Águilas in Pedernales" },
    dimensions: "—",
    size: "—",
    uploadedAt: "Mar 2026",
    color: "#FCA5A5",
    emoji: "🦅",
  },
  {
    id: "media-plaza-chaleco",
    name: "balneario-plaza-chaleco-guia.jpg",
    type: "photo",
    association: "tour",
    associatedTo: "tour-balneario-la-plaza",
    url: "",
    alt: { es: "Guías con chaleco salvavidas en Balneario La Plaza", en: "Guides with life vests at Balneario La Plaza" },
    dimensions: "—",
    size: "—",
    uploadedAt: "Jun 2026",
    color: "#7DD3FC",
    emoji: "🦺",
  },
];

/* ── Tours ───────────────────────────────────────────── */
export const TOURS_DATA: Tour[] = [
  {
    id: "tour-pico-diego-salto-jima",
    slug: "pico-diego-de-ocampo-salto-de-jima",
    title: { es: "Pico Diego de Ocampo + Salto de Jima", en: "Pico Diego de Ocampo + Salto de Jima" },
    description: { es: "Aventura, senderismo y un amanecer indescriptible. El tesoro oculto de la Cordillera Septentrional.", en: "" },
    type: "singleDay",
    itinerary: [],
    destinationIds: ["dest-santiago", "dest-bonao"],
    experienceIds: ["exp-pico-diego", "exp-salto-jima"],
    pricingModel: {
      type: "fixedPerPerson",
      pricePerPerson: 1900,
      currency: "DOP",
    },
    maxCapacity: 40,
    depositFixedAmount: 1000,
    depositPercentage: 53,
    includedServices: [
      { serviceId: "svc-transporte", included: true,  customNote: "" },
      { serviceId: "svc-cafe-agua",  included: true,  customNote: "" },
      { serviceId: "svc-staff",      included: true,  customNote: "" },
      { serviceId: "svc-entradas",   included: true,  customNote: "Entrada al Salto de Jima" },
      { serviceId: "svc-fotos",      included: true,  customNote: "" },
      { serviceId: "svc-almuerzo",   included: false, customNote: "" },
      { serviceId: "svc-chaleco",    included: false, customNote: "" },
      { serviceId: "svc-guia",       included: false, customNote: "" },
    ],
    details: {
      duration: "Full Day (1 día)",
      languages: ["Español"],
      bookingWindow: "Reservar hasta el 10 de Julio · Pago total el 13 de Julio",
      voucherType: "electronic",
      accessibility: "No apto para movilidad reducida (sendero de montaña)",
      petsAllowed: false,
      minAge: null,
      difficulty: "moderateToHigh",
      sustainabilityNote: "Usa protector solar Reef safe y respeta el entorno natural.",
    },
    galleryIds: ["media-pico-1", "media-pico-2", "media-jima-1"],
    operatorId: "op-randomtrips",
    seoMeta: {
      title: { es: "Pico Diego de Ocampo + Salto de Jima | Random Trips", en: "Pico Diego de Ocampo + Salto de Jima | Random Trips" },
      description: { es: "Aventura, senderismo y un amanecer indescriptible. El tesoro oculto de la Cordillera Septentrional.", en: "" },
    },
    status: "published",
    logistics: {
      departurePoint: "Bon Plaza Paraíso, Av. Winston Churchill, Santo Domingo",
      departureTime: "2:30 A.M (puntual)",
      mapsUrl: "https://share.google/ic18n9Gy6v6j9NLjL",
    },
    whatsappGroupUrl: "https://chat.whatsapp.com/LBP6kOvni3t2ubzKnlkZEv?mode=gi_t",
    categories: ["Naturaleza & Aventura", "Senderismo"],
    tags: ["amanecer", "montaña", "senderismo", "aventura"],
    activeBookings: 17,
    lastUpdated: "Hoy 09:14",
    rating: 4.9,
    totalBookings: 23,
    emoji: "⛰️",
    heroBg: "#D1FAE5",
  },
  {
    id: "tour-travelhood-plan-1",
    slug: "travelhood-plan-1-rd-7-dias",
    title: { es: "TravelHood Plan 1 — República Dominicana 7 días", en: "TravelHood Plan 1 — Dominican Republic 7 days" },
    description: { es: "Recorrido completo por RD: Santo Domingo, Puerto Plata, Río San Juan, Frontón, Las Terrenas y Sur Profundo + Bahía de las Águilas. Donde lo inesperado se vuelve inolvidable.", en: "" },
    type: "multiDay",
    destinationIds: ["dest-santo-domingo", "dest-puerto-plata", "dest-rio-san-juan", "dest-samana", "dest-las-terrenas", "dest-barahona", "dest-pedernales"],
    experienceIds: [],
    pricingModel: {
      type: "tieredPerPax",
      basePax: 10,
      basePricePerPerson: 40344,
      currency: "DOP",
      tiers: [
        { pax: 6,  pricePerPerson: 51612 },
        { pax: 7,  pricePerPerson: 46113 },
        { pax: 8,  pricePerPerson: 43611 },
        { pax: 9,  pricePerPerson: 41796 },
        { pax: 11, pricePerPerson: 37868 },
        { pax: 12, pricePerPerson: 35806 },
      ],
      minPax: 6,
      maxPax: 12,
      itbisIncluded: true,
    },
    itinerary: [
      {
        id: "d1", dayNumber: 1,
        title: { es: "Día 1 — Santo Domingo", en: "Day 1 — Santo Domingo" },
        description: { es: "City Tour Zona Colonial", en: "Colonial Zone City Tour" },
        destinationIds: ["dest-santo-domingo"], experienceIds: [],
        included: { es: "Transporte · Guía + Excursión · Entradas (acceso a los destinos) · Impuestos", en: "Transport · Guide + Excursion · Admission · Taxes" },
        isSwappable: false, alternatives: [],
      },
      {
        id: "d2", dayNumber: 2,
        title: { es: "Día 2 — Puerto Plata", en: "Day 2 — Puerto Plata" },
        description: { es: "Charcos de Damajagua, Zipline y City Tour en la ciudad más instagrameable.", en: "Damajagua waterfalls, zipline and city tour." },
        destinationIds: ["dest-puerto-plata"], experienceIds: [],
        included: { es: "Transporte · Guía + Excursión · Almuerzo · Acceso a lockers · Ziplines · Guía City Tour Puerto Plata", en: "Transport · Guide + Excursion · Lunch · Lockers · Ziplines · City Tour Guide" },
        isSwappable: false, alternatives: [],
      },
      {
        id: "d3", dayNumber: 3,
        title: { es: "Día 3 — Río San Juan", en: "Day 3 — Río San Juan" },
        description: { es: "Calle Beler, recorrido en bote, Playa Grande, Playa Los Minos, Laguna Gri-Gri.", en: "Beler street, boat tour, Playa Grande, Playa Los Minos, Gri-Gri Lagoon." },
        destinationIds: ["dest-rio-san-juan"], experienceIds: [],
        included: { es: "Transporte · Guía local · Excursión Laguna Gri Gri · Transporte marítimo", en: "Transport · Local guide · Gri Gri Lagoon excursion · Maritime transport" },
        isSwappable: false, alternatives: [],
      },
      {
        id: "d4", dayNumber: 4,
        title: { es: "Día 4 — Frontón", en: "Day 4 — Frontón" },
        description: { es: "Las casitas de colores, Playa Las Galeras, Playa Madama, Cueva Taína, Playa Frontón, Playa Bonita.", en: "Colored houses, Las Galeras Beach, Madama Beach, Taino Cave, Frontón Beach, Bonita Beach." },
        destinationIds: ["dest-samana"], experienceIds: ["exp-playa-fronton", "exp-playa-madama", "exp-playa-las-galeras"],
        included: { es: "Transporte · Excursión · Transporte marítimo", en: "Transport · Excursion · Maritime transport" },
        isSwappable: true, alternatives: [],
      },
      {
        id: "d5", dayNumber: 5,
        title: { es: "Día 5 — Las Terrenas", en: "Day 5 — Las Terrenas" },
        description: { es: "Playa Las Terrenas, Playa Bonita y Salto de Socoa.", en: "Las Terrenas Beach, Bonita Beach and Socoa Waterfall." },
        destinationIds: ["dest-las-terrenas"], experienceIds: [],
        included: { es: "Transporte · Acceso a Salto de Socoa", en: "Transport · Salto de Socoa access" },
        isSwappable: true, alternatives: [],
      },
      {
        id: "d6", dayNumber: 6,
        title: { es: "Día 6-7 — Sur Profundo + Bahía de las Águilas", en: "Day 6-7 — Sur Profundo + Bahía de las Águilas" },
        description: { es: "Playa y Río San Rafael, Patos de Barahona, Mirador San Rafael, Pozos de Romeo / Playita del Amor, Bahía de las Águilas.", en: "San Rafael Beach and River, Barahona Patos, San Rafael viewpoint, Romeo Wells / Love Beach, Bahía de las Águilas." },
        destinationIds: ["dest-barahona", "dest-pedernales"], experienceIds: [],
        included: { es: "Transporte · Transporte marítimo · Hospedaje Glamping · Desayuno (día 2) · Impuestos Medio Ambiente", en: "Transport · Maritime transport · Glamping accommodation · Breakfast (day 2) · Environmental taxes" },
        isSwappable: false, alternatives: [],
      },
    ],
    maxCapacity: 12,
    depositFixedAmount: 5000,
    depositPercentage: 12,
    includedServices: [],
    details: {
      duration: "7 días / 6 noches",
      languages: ["Español", "Inglés"],
      bookingWindow: "Reservar con anticipación; salida programada 8-14 de marzo",
      voucherType: "electronic",
      accessibility: "Requiere movilidad; varias caminatas y trayectos en bote",
      petsAllowed: false,
      minAge: null,
      difficulty: "moderate",
      sustainabilityNote: "Usa protector solar Reef safe y respeta el entorno natural.",
    },
    galleryIds: [],
    operatorId: "op-randomtrips",
    seoMeta: {
      title: { es: "TravelHood Plan 1 — República Dominicana 7 días | Random Trips", en: "TravelHood Plan 1 — Dominican Republic 7 days | Random Trips" },
      description: { es: "Recorrido completo por RD: Santo Domingo, Puerto Plata, Río San Juan, Frontón, Las Terrenas y Sur Profundo + Bahía de las Águilas.", en: "" },
    },
    status: "published",
    logistics: {
      departurePoint: "Bon Plaza Paraíso, Av. Winston Churchill, Santo Domingo",
      departureTime: "Variable según itinerario del día",
      mapsUrl: "https://share.google/ic18n9Gy6v6j9NLjL",
    },
    whatsappGroupUrl: null,
    categories: ["Multi-destino", "Naturaleza & Aventura", "Cultural"],
    tags: ["7 días", "multi-destino", "agencias", "internacional"],
    activeBookings: 0,
    lastUpdated: "Hoy",
    rating: 0,
    totalBookings: 0,
    emoji: "🗺️",
    heroBg: "#DBEAFE",
  },
  {
    id: "tour-playa-fronton",
    slug: "playa-fronton-samana",
    title: { es: "Playa Frontón", en: "Frontón Beach" },
    description: { es: "Un full day por las playas escondidas de la península: acantilados, cocoteros, piscinas naturales y aguas turquesa.", en: "" },
    type: "singleDay",
    itinerary: [],
    destinationIds: ["dest-samana"],
    experienceIds: ["exp-playa-las-galeras", "exp-cueva-elefante", "exp-piscina-natural", "exp-playa-madama", "exp-playa-aserradero", "exp-playa-fronton"],
    pricingModel: {
      type: "fixedPerPerson",
      pricePerPerson: 3500,
      currency: "DOP",
    },
    maxCapacity: 40,
    depositFixedAmount: 1000,
    depositPercentage: 29,
    includedServices: [
      { serviceId: "svc-transporte", included: true,  customNote: "" },
      { serviceId: "svc-snacks",     included: true,  customNote: "" },
      { serviceId: "svc-almuerzo",   included: true,  customNote: "Almuerzo típico en la playa" },
      { serviceId: "svc-guia",       included: true,  customNote: "Guía local" },
      { serviceId: "svc-staff",      included: true,  customNote: "" },
      { serviceId: "svc-chaleco",    included: true,  customNote: "" },
      { serviceId: "svc-fotos",      included: true,  customNote: "" },
      { serviceId: "svc-cafe-agua",  included: false, customNote: "" },
      { serviceId: "svc-entradas",   included: false, customNote: "" },
    ],
    details: {
      duration: "Full Day (1 día)",
      languages: ["Español"],
      bookingWindow: "Cupos limitados; reserva con RD$1,000 p/p",
      voucherType: "electronic",
      accessibility: "Incluye traslado en bote y caminata entre playas; uso de chaleco salvavidas",
      petsAllowed: false,
      minAge: null,
      difficulty: "moderate",
      sustainabilityNote: "Usa protector solar Reef safe y respeta las playas y su entorno.",
    },
    galleryIds: ["media-fronton-1", "media-fronton-2", "media-fronton-flyer"],
    operatorId: "op-randomtrips",
    seoMeta: {
      title: { es: "Playa Frontón Samaná | Random Trips", en: "Frontón Beach Samaná | Random Trips" },
      description: { es: "Un full day por las playas escondidas de la península: acantilados, cocoteros, piscinas naturales y aguas turquesa.", en: "" },
    },
    status: "published",
    logistics: {
      departurePoint: "Bon Plaza Paraíso, Av. Winston Churchill, Santo Domingo",
      departureTime: "5:00 A.M (puntual)",
      mapsUrl: "https://share.google/ic18n9Gy6v6j9NLjL",
    },
    whatsappGroupUrl: null,
    categories: ["Playa & Snorkel", "Naturaleza & Aventura"],
    tags: ["playa", "samaná", "bote", "acantilados", "turquesa"],
    activeBookings: 0,
    lastUpdated: "19 Abr 2026",
    rating: 5.0,
    totalBookings: 40,
    emoji: "🌴",
    heroBg: "#FEF9C3",
  },
  {
    id: "tour-balneario-la-plaza",
    slug: "balneario-la-plaza-barahona",
    title: { es: "Balneario La Plaza", en: "Balneario La Plaza" },
    description: { es: "El río más cristalino de República Dominicana. Agua turquesa, naturaleza y aventura en un solo lugar.", en: "" },
    type: "singleDay",
    itinerary: [],
    destinationIds: ["dest-barahona"],
    experienceIds: ["exp-balneario-la-plaza"],
    pricingModel: {
      type: "fixedPerPerson",
      pricePerPerson: 3200,
      currency: "DOP",
    },
    maxCapacity: 40,
    depositFixedAmount: 1000,
    depositPercentage: 31,
    includedServices: [
      { serviceId: "svc-transporte", included: true,  customNote: "" },
      { serviceId: "svc-cafe-agua",  included: true,  customNote: "" },
      { serviceId: "svc-almuerzo",   included: true,  customNote: "Almuerzo típico" },
      { serviceId: "svc-chaleco",    included: true,  customNote: "" },
      { serviceId: "svc-guia",       included: true,  customNote: "" },
      { serviceId: "svc-staff",      included: true,  customNote: "" },
      { serviceId: "svc-fotos",      included: true,  customNote: "" },
      { serviceId: "svc-entradas",   included: false, customNote: "" },
    ],
    details: {
      duration: "Full Day (1 día)",
      languages: ["Español"],
      bookingWindow: "Reservar hasta el 10 de Junio · Pago total el 16 de Junio",
      voucherType: "electronic",
      accessibility: "Requiere caminar y nadar; uso obligatorio de chaleco salvavidas",
      petsAllowed: false,
      minAge: null,
      difficulty: "moderate",
      sustainabilityNote: "Usa protector solar Reef safe y cuida el río y su entorno.",
    },
    galleryIds: ["media-plaza-1", "media-plaza-2"],
    operatorId: "op-randomtrips",
    seoMeta: {
      title: { es: "Balneario La Plaza Barahona | Random Trips", en: "Balneario La Plaza Barahona | Random Trips" },
      description: { es: "El río más cristalino de República Dominicana. Agua turquesa, naturaleza y aventura en un solo lugar.", en: "" },
    },
    status: "published",
    logistics: {
      departurePoint: "Bon Plaza Paraíso, Av. Winston Churchill, Santo Domingo",
      departureTime: "5:30 A.M (puntual)",
      mapsUrl: "https://share.google/ic18n9Gy6v6j9NLjL",
    },
    whatsappGroupUrl: null,
    categories: ["Naturaleza & Aventura", "Playa & Río"],
    tags: ["turquesa", "río", "barahona", "aventura", "chaleco"],
    activeBookings: 9,
    lastUpdated: "Hoy 08:45",
    rating: 4.8,
    totalBookings: 31,
    emoji: "🏞️",
    heroBg: "#A5F3FC",
  },
];

/* ── Availability (fechas corregidas a 2026) ─────────── */
export const AVAILABILITY: Availability[] = [
  {
    tourId: "tour-pico-diego-salto-jima",
    tourName: "Pico Diego de Ocampo + Salto de Jima",
    date: "2026-07-19",
    displayDate: "19 Jul 2026",
    totalSeats: 40,
    reservedSeats: 4,   // 4 reservas detalladas en BOOKINGS
    availableSeats: 36,
    status: "open",
    priceOverride: null,
  },
  {
    tourId: "tour-playa-fronton",
    tourName: "Playa Frontón",
    date: "2026-04-18",
    displayDate: "18 Abr 2026",
    totalSeats: 40,
    reservedSeats: 40,
    availableSeats: 0,
    status: "full",
    priceOverride: null,
  },
  {
    tourId: "tour-balneario-la-plaza",
    tourName: "Balneario La Plaza",
    date: "2026-06-21",
    displayDate: "21 Jun 2026",
    totalSeats: 40,
    reservedSeats: 3,   // 3 reservas detalladas en BOOKINGS
    availableSeats: 37,
    status: "open",
    priceOverride: null,
  },
];

/* ── Pages (políticas) ───────────────────────────────── */
export const PAGES_DATA: Page[] = [
  {
    id: "page-politicas-cancelacion",
    slug: "politicas-de-cancelacion",
    title: { es: "Políticas de Cancelación", en: "Cancellation Policies" },
    status: "published",
    content: {
      es: `Si no puede asistir tras reservar o pagar el viaje completo:

1. Buscar un reemplazo notificando con 3 días de anticipación.
2. No se permiten cambios el mismo día.
3. Si solo reservó y no tiene reemplazo, el monto no es transferible ni reembolsable.
4. Si pagó completo y notificó antes de la fecha límite sin reemplazo, pierde la reserva y se reembolsa la diferencia.
5. Si pagó completo y notifica después de la fecha límite sin reemplazo, pierde todo el pago.
6. Si reservó más de un lugar y una persona no asiste, debe reemplazarse; su reserva no es transferible al monto restante.
7. Si vence la fecha límite sin completar el pago, su lugar se libera.
8. Hay lista de espera para ayudar con cambios.
9. Por fuerza mayor (clima/situación) que obligue a suspender, si no puede asistir a la nueva fecha ni le interesa otro viaje, se reembolsa completo.`,
      en: `If you cannot attend after booking or paying in full:

1. Find a replacement, notifying 3 days in advance.
2. No same-day changes allowed.
3. If you only paid the deposit and have no replacement, the amount is non-transferable and non-refundable.
4. If you paid in full and notified before the deadline without a replacement, you lose the deposit and the difference is refunded.
5. If you paid in full and notify after the deadline without a replacement, you lose the full payment.
6. If you booked more than one spot and someone can't attend, they must be replaced; their deposit is not transferable to the remaining balance.
7. If the payment deadline passes without full payment, your spot is released.
8. A waitlist is available to help with changes.
9. For force majeure (weather/situational) requiring suspension, if you can't attend the new date and aren't interested in another trip, a full refund is issued.`,
    },
  },
  {
    id: "page-normas-tour",
    slug: "normas-del-tour",
    title: { es: "Normas del Tour", en: "Tour Rules" },
    status: "published",
    content: {
      es: `• No se permite el uso de vapes ni cigarrillos dentro de la guagua.
• La guagua no realiza paradas adicionales: salida y llegada solo en el punto de encuentro.
• Las bebidas alcohólicas deben consumirse con precaución.
• La música será de agrado general, evitando contenido obsceno.
• Se exige respeto al personal, guías y demás clientes durante todo el recorrido y en los grupos de WhatsApp.
• Cualquier incumplimiento puede resultar en cancelación de la participación sin remuneración.`,
      en: `• Vapes and cigarettes are not allowed inside the bus.
• The bus makes no additional stops: departure and arrival only at the meeting point.
• Alcoholic beverages must be consumed responsibly.
• Music will be generally agreeable, avoiding explicit content.
• Respect for staff, guides and other clients is required throughout the trip and in WhatsApp groups.
• Any breach may result in cancellation of participation without refund.`,
    },
  },
  {
    id: "page-proceso-inscripcion",
    slug: "proceso-de-inscripcion",
    title: { es: "Proceso de Inscripción", en: "Registration Process" },
    status: "published",
    content: {
      es: `1. Revisa toda la información del tour.
2. Llena el formulario con tus datos reales (si viajan 2+ personas, cada quien el suyo).
3. Realiza tu reserva; en el comprobante indica nombre completo + tour, y envía la captura por WhatsApp al +1 (849) 589-2057.
4. Una semana antes te agregamos al grupo de WhatsApp con los detalles finales.`,
      en: `1. Review all tour information.
2. Fill out the form with your real data (if 2+ people travel, each fills their own).
3. Make your reservation; on the receipt write your full name + tour, and send the screenshot via WhatsApp to +1 (849) 589-2057.
4. One week before, we'll add you to the WhatsApp group with final details.`,
    },
  },
];

/* ── Customers ───────────────────────────────────────── */
export const CUSTOMERS: Customer[] = [
  { id: "cust-001", name: "Ana Belén Reyes",  email: "anabelen.reyes@gmail.com",  phone: "+1 (809) 555-0142", country: "🇩🇴 DO", preferredLanguage: "es", preferredCurrency: "DOP" },
  { id: "cust-002", name: "Carlos Medina",    email: "carlos.medina@outlook.com", phone: "+1 (829) 555-0198", country: "🇩🇴 DO", preferredLanguage: "es", preferredCurrency: "DOP" },
  { id: "cust-003", name: "Sofía Restrepo",   email: "sofia.restrepo@gmail.com",  phone: "+57 310 555 7721",  country: "🇨🇴 CO", preferredLanguage: "es", preferredCurrency: "USD" },
  { id: "cust-004", name: "James Whitfield",  email: "j.whitfield@gmail.com",     phone: "+1 (646) 555-3390", country: "🇺🇸 US", preferredLanguage: "en", preferredCurrency: "USD" },
  { id: "cust-005", name: "Marie Dubois",     email: "marie.dubois@orange.fr",    phone: "+33 6 12 55 87 04", country: "🇫🇷 FR", preferredLanguage: "en", preferredCurrency: "EUR" },
  { id: "cust-006", name: "Lucía Fernández",  email: "lucia.fdez@gmail.com",      phone: "+34 612 55 33 18", country: "🇪🇸 ES", preferredLanguage: "es", preferredCurrency: "EUR" },
  { id: "cust-007", name: "Pedro Jiménez",    email: "pedrojimenez.rd@gmail.com", phone: "+1 (849) 555-7765", country: "🇩🇴 DO", preferredLanguage: "es", preferredCurrency: "DOP" },
];

/* ── Bookings ─────────────────────────────────────────── */
export const BOOKINGS: Booking[] = [
  { id: "bk-2026-001", customerId: "cust-001", tourId: "tour-balneario-la-plaza",    date: "2026-06-21", displayDate: "21 Jun 2026", totalPax: 2, totalPrice: 6400, depositPaid: 6400, outstandingBalance: 0,    status: "fullyPaid"      },
  { id: "bk-2026-002", customerId: "cust-003", tourId: "tour-balneario-la-plaza",    date: "2026-06-21", displayDate: "21 Jun 2026", totalPax: 1, totalPrice: 3200, depositPaid: 1000, outstandingBalance: 2200, status: "depositPaid"    },
  { id: "bk-2026-003", customerId: "cust-004", tourId: "tour-balneario-la-plaza",    date: "2026-06-21", displayDate: "21 Jun 2026", totalPax: 1, totalPrice: 3200, depositPaid: 1000, outstandingBalance: 2200, status: "balanceOverdue" },
  { id: "bk-2026-004", customerId: "cust-002", tourId: "tour-pico-diego-salto-jima", date: "2026-07-19", displayDate: "19 Jul 2026", totalPax: 2, totalPrice: 3800, depositPaid: 2000, outstandingBalance: 1800, status: "depositPaid"    },
  { id: "bk-2026-005", customerId: "cust-005", tourId: "tour-pico-diego-salto-jima", date: "2026-07-19", displayDate: "19 Jul 2026", totalPax: 1, totalPrice: 1900, depositPaid: 1000, outstandingBalance: 900,  status: "depositPaid"    },
  { id: "bk-2026-006", customerId: "cust-006", tourId: "tour-pico-diego-salto-jima", date: "2026-07-19", displayDate: "19 Jul 2026", totalPax: 1, totalPrice: 1900, depositPaid: 1900, outstandingBalance: 0,    status: "fullyPaid"      },
  { id: "bk-2026-007", customerId: "cust-007", tourId: "tour-pico-diego-salto-jima", date: "2026-07-19", displayDate: "19 Jul 2026", totalPax: 1, totalPrice: 1900, depositPaid: 1000, outstandingBalance: 900,  status: "depositPaid"    },
];

/* ── Payments (transacciones confirmadas) ────────────── */
export const PAYMENTS: Payment[] = [
  { bookingId: "bk-2026-001", type: "deposit", amount: 2000, currency: "DOP", paypalTxnId: "PAYID-MOCK-001A", status: "paid", date: "05 Jun 2026" },
  { bookingId: "bk-2026-001", type: "balance", amount: 4400, currency: "DOP", paypalTxnId: "PAYID-MOCK-001B", status: "paid", date: "14 Jun 2026" },
  { bookingId: "bk-2026-002", type: "deposit", amount: 1000, currency: "DOP", paypalTxnId: "PAYID-MOCK-002A", status: "paid", date: "08 Jun 2026" },
  { bookingId: "bk-2026-003", type: "deposit", amount: 1000, currency: "DOP", paypalTxnId: "PAYID-MOCK-003A", status: "paid", date: "07 Jun 2026" },
  { bookingId: "bk-2026-004", type: "deposit", amount: 2000, currency: "DOP", paypalTxnId: "PAYID-MOCK-004A", status: "paid", date: "30 Jun 2026" },
  { bookingId: "bk-2026-005", type: "deposit", amount: 1000, currency: "DOP", paypalTxnId: "PAYID-MOCK-005A", status: "paid", date: "01 Jul 2026" },
  { bookingId: "bk-2026-006", type: "deposit", amount: 1000, currency: "DOP", paypalTxnId: "PAYID-MOCK-006A", status: "paid", date: "28 Jun 2026" },
  { bookingId: "bk-2026-006", type: "balance", amount: 900,  currency: "DOP", paypalTxnId: "PAYID-MOCK-006B", status: "paid", date: "05 Jul 2026" },
  { bookingId: "bk-2026-007", type: "deposit", amount: 1000, currency: "DOP", paypalTxnId: "PAYID-MOCK-007A", status: "paid", date: "02 Jul 2026" },
];

/* ── PaymentLinks ────────────────────────────────────── */
export const PAYMENT_LINKS: PaymentLink[] = [
  { bookingId: "bk-2026-002", amount: 2200, currency: "DOP", invoiceId: "INV-MOCK-002", expiresAt: "16 Jun 2026", status: "sent",    reminders: ["12 Jun 2026", "15 Jun 2026"] },
  { bookingId: "bk-2026-003", amount: 2200, currency: "DOP", invoiceId: "INV-MOCK-003", expiresAt: "16 Jun 2026", status: "expired", reminders: ["12 Jun 2026", "15 Jun 2026", "16 Jun 2026"] },
  { bookingId: "bk-2026-004", amount: 1800, currency: "DOP", invoiceId: "INV-MOCK-004", expiresAt: "13 Jul 2026", status: "sent",    reminders: [] },
  { bookingId: "bk-2026-005", amount: 900,  currency: "DOP", invoiceId: "INV-MOCK-005", expiresAt: "13 Jul 2026", status: "sent",    reminders: [] },
  { bookingId: "bk-2026-007", amount: 900,  currency: "DOP", invoiceId: "INV-MOCK-007", expiresAt: "13 Jul 2026", status: "pending", reminders: [] },
];

/* ── Testimonials ────────────────────────────────────── */
export const TESTIMONIALS = [
  {
    id: "tst-001",
    customerName: "Ana Belén R.",
    tourId: "tour-balneario-la-plaza",
    tourName: "Balneario La Plaza",
    content: { es: "El agua de La Plaza es de otro mundo, increíblemente cristalina. El staff súper pendiente de todos y el almuerzo típico estuvo buenísimo. Repito sin pensarlo.", en: "The water at La Plaza is out of this world, incredibly clear. The staff looked after everyone and the typical lunch was delicious. I'd do it again in a heartbeat." },
    rating: 5, date: "17 Ago 2025", approved: true, order: 1,
  },
  {
    id: "tst-002",
    customerName: "James W.",
    tourId: "tour-balneario-la-plaza",
    tourName: "Balneario La Plaza",
    content: { es: "Una joya escondida del sur. Los chalecos y los guías nos dieron mucha tranquilidad en el trayecto por el río. Organización de 10.", en: "A hidden gem in the south. The life vests and guides gave us real peace of mind along the river. Top-notch organization." },
    rating: 5, date: "21 Sep 2025", approved: true, order: 2,
  },
  {
    id: "tst-003",
    customerName: "Sofía R.",
    tourId: "tour-pico-diego-salto-jima",
    tourName: "Pico Diego de Ocampo + Salto de Jima",
    content: { es: "Madrugamos muchísimo pero el amanecer desde el Pico Diego valió cada minuto. El Salto de Jima fue el cierre perfecto. Experiencia inolvidable.", en: "We woke up super early but the sunrise from Pico Diego was worth every minute. Salto de Jima was the perfect closer. An unforgettable experience." },
    rating: 5, date: "20 Jul 2025", approved: true, order: 3,
  },
  {
    id: "tst-004",
    customerName: "Marie D.",
    tourId: "tour-pico-diego-salto-jima",
    tourName: "Pico Diego de Ocampo + Salto de Jima",
    content: { es: "El senderismo es exigente pero la vista lo compensa todo. El grupo y el staff hicieron el ambiente muy ameno. Muy recomendable.", en: "The hike is demanding but the view makes up for everything. The group and staff made it a really friendly atmosphere. Highly recommended." },
    rating: 5, date: "20 Jul 2025", approved: true, order: 4,
  },
  {
    id: "tst-005",
    customerName: "Pedro J.",
    tourId: "tour-balneario-la-plaza",
    tourName: "Balneario La Plaza",
    content: { es: "Buen viaje en general, el balneario espectacular. La salida muy temprano se siente, pero llegar a un río tan limpio lo vale.", en: "Great trip overall, the spot is spectacular. The early departure is felt, but reaching such a clean river makes it worth it." },
    rating: 4, date: "22 Jun 2025", approved: true, order: 5,
  },
  {
    id: "tst-006",
    customerName: "Lucía F.",
    tourId: "tour-pico-diego-salto-jima",
    tourName: "Pico Diego de Ocampo + Salto de Jima",
    content: { es: "Random Trips cuida los detalles: café temprano, fotos durante todo el recorrido y guías atentos. Una manera distinta de conocer RD.", en: "Random Trips takes care of the details: early coffee, photos throughout and attentive guides. A different way to discover the DR." },
    rating: 5, date: "21 Jul 2025", approved: true, order: 6,
  },
  {
    id: "tst-009",
    customerName: "Daniela P.",
    tourId: "tour-playa-fronton",
    tourName: "Playa Frontón",
    content: { es: "Playa Frontón es de otro nivel. Ver tantas playas en un solo día, con el bote y los guías, fue una experiencia increíble. Las fotos quedaron espectaculares.", en: "Playa Frontón is on another level. Seeing so many beaches in a single day, with the boat and the guides, was an incredible experience. The photos came out spectacular." },
    rating: 5, date: "19 Abr 2026", approved: true, order: 9,
  },
  {
    id: "tst-010",
    customerName: "Miguel A.",
    tourId: "tour-playa-fronton",
    tourName: "Playa Frontón",
    content: { es: "La piscina natural y Playa Madama fueron mis favoritas. Todo muy bien organizado y el almuerzo en la playa, un manjar. Repetiría sin dudarlo.", en: "The natural pool and Madama Beach were my favorites. Everything was well organized and the lunch on the beach was a treat. I'd repeat without hesitation." },
    rating: 5, date: "20 Abr 2026", approved: true, order: 10,
  },
];

/* ── Operators ───────────────────────────────────────── */
export const OPERATORS: Operator[] = [
  {
    id: "op-randomtrips",
    type: "internal",
    name: "Random Trips",
    contact: {
      email: "info@randomtrips.co",
      phone: "+1 (849) 589-2057",
      whatsapp: "+1 (849) 589-2057",
    },
    assignedTourIds: ["tour-playa-fronton", "tour-pico-diego-salto-jima", "tour-travelhood-plan-1"],
    status: "active",
  },
  {
    id: "op-caribe-adventures",
    type: "external",
    name: "Caribe Adventures",
    contact: {
      email: "ops@caribead.do",
      phone: "+1 (809) 555-0102",
      whatsapp: "+1 (809) 555-0102",
    },
    assignedTourIds: ["tour-bayahibe-isla-saona"],
    status: "active",
  },
  {
    id: "op-montana-verde",
    type: "external",
    name: "Montaña Verde Tours",
    contact: {
      email: "info@montanaverde.do",
      phone: "+1 (829) 555-0203",
      whatsapp: "+1 (829) 555-0203",
    },
    assignedTourIds: ["tour-camping-valle-dios"],
    status: "active",
  },
  {
    id: "op-sur-profundo",
    type: "external",
    name: "Sur Profundo Eco",
    contact: {
      email: "reservas@surprofundo.do",
      phone: "+1 (809) 555-0304",
      whatsapp: null,
    },
    assignedTourIds: ["tour-bahia-aguilas-premium"],
    status: "inactive",
  },
];

/* ── Helpers ─────────────────────────────────────────── */
export function formatDOP(amount: number): string {
  return `RD$ ${amount.toLocaleString("es-DO")}`;
}

export function dopToUSD(amount: number): number {
  return Math.round(amount * SITE_CONFIG.exchangeRates.USD);
}

export function dopToEUR(amount: number): number {
  return Math.round(amount * SITE_CONFIG.exchangeRates.EUR);
}

export const findDestination = (id: string) => DESTINATIONS.find(d => d.id === id);
export const findExperience  = (id: string) => EXPERIENCES.find(e => e.id === id);
export const findTour        = (id: string) => TOURS_DATA.find(t => t.id === id);
export const findService     = (id: string) => SERVICE_CATALOG.find(s => s.id === id);
export const findOperator    = (id: string) => OPERATORS.find(o => o.id === id);

export const getDestinationName = (id: string, lang: LanguageCode = "es"): string =>
  findDestination(id)?.name[lang] ?? id;

export const getTourPriceDisplay = (tour: Tour): string => {
  const pm = tour.pricingModel;
  if (pm.type === "fixedPerPerson" && pm.pricePerPerson != null)
    return `RD$ ${pm.pricePerPerson.toLocaleString()}/p`;
  if (pm.type === "tieredPerPax" && pm.tiers?.length)
    return `Desde RD$ ${Math.min(...pm.tiers.map(t => t.pricePerPerson)).toLocaleString()}/p`;
  if (pm.type === "fixedGroup" && pm.totalPrice != null)
    return `RD$ ${pm.totalPrice.toLocaleString()} grupo`;
  return "—";
};

/* ── Derived aggregates (computed once) ──────────────── */
export const TOTAL_COBRADO     = BOOKINGS.reduce((s, b) => s + b.depositPaid, 0);
export const TOTAL_SALDO       = BOOKINGS.reduce((s, b) => s + b.outstandingBalance, 0);
export const BOOKINGS_ACTIVAS  = BOOKINGS.filter(b => b.status !== "cancelled").length;
export const SALDOS_VENCIDOS   = PAYMENT_LINKS.filter(l => l.status === "expired");
export const SALDOS_POR_VENCER = PAYMENT_LINKS.filter(l => l.status === "sent");

/* ── Re-exports for components that still use old symbol names ── */
// These aliases keep backward-compatibility during the migration; remove in sub-step 5.
export type { BookingStatus, PaymentLinkStatus };
