/* ─────────────────────────────────────────────────────────
   RANDOM TRIPS — Data real de producción
   Fuente: figma-make-data.json (entidades del CMS)
   Moneda base: DOP. Tasas de conversión en SiteConfig.
───────────────────────────────────────────────────────── */

/* ── SiteConfig ──────────────────────────────────────── */
export const SITE_CONFIG = {
  contacto: {
    whatsapp: "+1 (849) 589-2057",           // principal (formularios / reservas)
    whatsapp_secundario: "+1 (809) 601-6082", // flyers de Instagram
    email: "info@randomtrips.co",
  },
  redes: {
    instagram: "@randomtrips.co",
  },
  tasas_cambio: {
    base: "DOP",
    USD: 0.0167,
    EUR: 0.0155,
  },
  builder_margin_multiplier: 1.35,
  punto_salida_default: {
    nombre: "Bon Plaza Paraíso",
    direccion: "Av. Winston Churchill, Santo Domingo",
    maps: "https://share.google/ic18n9Gy6v6j9NLjL",
  },
  payment_info: {
    banco: "Banreservas",
    titular: "RANDOM TRIPS S.R.L.",
    tipo_cuenta: "Cuenta corriente",
    numero_cuenta: "9609086703",
    rnc: "133540118",
    deposito_fijo_default: 1000,
    nota_deposito: "Este monto de apartado no es reembolsable.",
  },
};

/* ── ServiceCatalog ──────────────────────────────────── */
export const SERVICE_CATALOG = [
  { id: "svc-transporte", nombre_es: "Transporte ida y vuelta en bus", nombre_en: "Round-trip bus transport",  icono: "🚌", categoria: "transporte",  orden: 1 },
  { id: "svc-cafe-agua",  nombre_es: "Café y agua",                    nombre_en: "Coffee and water",         icono: "☕", categoria: "alimentacion", orden: 2 },
  { id: "svc-almuerzo",   nombre_es: "Almuerzo típico",                nombre_en: "Typical lunch",            icono: "🍽️", categoria: "alimentacion", orden: 3 },
  { id: "svc-staff",      nombre_es: "Asistencia del staff",           nombre_en: "Staff assistance",         icono: "👥", categoria: "guia",         orden: 4 },
  { id: "svc-guia",       nombre_es: "Guías experimentados",           nombre_en: "Experienced guides",       icono: "🧭", categoria: "guia",         orden: 5 },
  { id: "svc-entradas",   nombre_es: "Entradas / accesos",             nombre_en: "Entry / access fees",      icono: "🎟️", categoria: "impuestos",    orden: 6 },
  { id: "svc-chaleco",    nombre_es: "Chalecos salvavidas",            nombre_en: "Life vests",               icono: "🦺", categoria: "seguridad",    orden: 7 },
  { id: "svc-fotos",      nombre_es: "Fotografías y videos",           nombre_en: "Photos and videos",        icono: "📷", categoria: "extras",        orden: 8 },
  { id: "svc-snacks",       nombre_es: "Snacks",                         nombre_en: "Snacks",                  icono: "🍪", categoria: "alimentacion", orden: 10 },
  { id: "svc-lockers",      nombre_es: "Acceso a lockers",               nombre_en: "Lockers access",           icono: "🔐", categoria: "extras",       orden: 11 },
  { id: "svc-zipline",      nombre_es: "Ziplines",                        nombre_en: "Ziplines",                 icono: "🎢", categoria: "actividad",    orden: 12 },
  { id: "svc-transporte-mar", nombre_es: "Transporte marítimo",          nombre_en: "Maritime transport",       icono: "⛵", categoria: "transporte",   orden: 13 },
  { id: "svc-glamping",     nombre_es: "Hospedaje glamping",              nombre_en: "Glamping accommodation",   icono: "⛺", categoria: "hospedaje",    orden: 14 },
  { id: "svc-desayuno",     nombre_es: "Desayuno",                        nombre_en: "Breakfast",                icono: "🍳", categoria: "alimentacion", orden: 15 },
  { id: "svc-impuestos-amb",nombre_es: "Impuestos medio ambiente",        nombre_en: "Environmental taxes",      icono: "🌿", categoria: "impuestos",    orden: 16 },
];

/* ── Destinations ────────────────────────────────────── */
export const DESTINATIONS = [
  {
    id: "dest-santiago",
    slug: "santiago",
    nombre_es: "Santiago",
    nombre_en: "Santiago",
    descripcion_es: "Corazón del Cibao y puerta a la Cordillera Septentrional, hogar del Pico Diego de Ocampo.",
    descripcion_en: "Heart of the Cibao and gateway to the Cordillera Septentrional, home of Pico Diego de Ocampo.",
    lat: "19.4517",
    lng: "-70.6970",
    numExperiencias: 1,
    numTours: 1,
    status: "published" as const,
    emoji: "⛰️",
    color: "#D1FAE5",
  },
  {
    id: "dest-bonao",
    slug: "bonao",
    nombre_es: "Bonao",
    nombre_en: "Bonao",
    descripcion_es: "Municipio de Monseñor Nouel, conocido por sus saltos y naturaleza exuberante.",
    descripcion_en: "Town in Monseñor Nouel province, known for its waterfalls and lush nature.",
    lat: "18.9367",
    lng: "-70.4083",
    numExperiencias: 1,
    numTours: 1,
    status: "published" as const,
    emoji: "💧",
    color: "#DBEAFE",
  },
  {
    id: "dest-barahona",
    slug: "barahona",
    nombre_es: "Barahona",
    nombre_en: "Barahona",
    descripcion_es: "Región sur de aguas cristalinas, ríos turquesa y paisajes vírgenes.",
    descripcion_en: "Southern region of crystal-clear waters, turquoise rivers and pristine landscapes.",
    lat: "18.2085",
    lng: "-71.1008",
    numExperiencias: 1,
    numTours: 1,
    status: "published" as const,
    emoji: "🏞️",
    color: "#A5F3FC",
  },
  /* ── Destinos para TravelHood Plan 1 ── */
  {
    id: "dest-santo-domingo",
    slug: "santo-domingo",
    nombre_es: "Santo Domingo",
    nombre_en: "Santo Domingo",
    descripcion_es: "La primera ciudad del Nuevo Mundo, con la Zona Colonial declarada Patrimonio UNESCO.",
    descripcion_en: "The first city of the New World, with the Colonial Zone declared a UNESCO Heritage Site.",
    lat: "18.4861",
    lng: "-69.9312",
    numExperiencias: 0,
    numTours: 1,
    status: "published" as const,
    emoji: "🏛️",
    color: "#FED7AA",
  },
  {
    id: "dest-puerto-plata",
    slug: "puerto-plata",
    nombre_es: "Puerto Plata",
    nombre_en: "Puerto Plata",
    descripcion_es: "Costa norte con el teleférico del Pico Isabel, los Charcos de Damajagua y la Fortaleza San Felipe.",
    descripcion_en: "North coast with the Isabel de Torres cable car, Damajagua waterfalls and Fort San Felipe.",
    lat: "19.7931",
    lng: "-70.6817",
    numExperiencias: 0,
    numTours: 1,
    status: "published" as const,
    emoji: "🚡",
    color: "#C7D2FE",
  },
  {
    id: "dest-rio-san-juan",
    slug: "rio-san-juan",
    nombre_es: "Río San Juan",
    nombre_en: "Río San Juan",
    descripcion_es: "Ciudad costera del norte con la Laguna Gri-Gri, Playa Grande y sus manglares.",
    descripcion_en: "Northern coastal town with Gri-Gri Lagoon, Playa Grande and mangroves.",
    lat: "19.6346",
    lng: "-70.1484",
    numExperiencias: 0,
    numTours: 1,
    status: "published" as const,
    emoji: "🛶",
    color: "#A7F3D0",
  },
  {
    id: "dest-las-terrenas",
    slug: "las-terrenas",
    nombre_es: "Las Terrenas",
    nombre_en: "Las Terrenas",
    descripcion_es: "Cosmopolita villa costera en la península de Samaná con Playa Bonita y el Salto de Socoa.",
    descripcion_en: "Cosmopolitan coastal village in the Samaná peninsula with Playa Bonita and Socoa Waterfall.",
    lat: "19.3167",
    lng: "-69.5333",
    numExperiencias: 0,
    numTours: 1,
    status: "published" as const,
    emoji: "🌅",
    color: "#FDE68A",
  },
  {
    id: "dest-pedernales",
    slug: "pedernales",
    nombre_es: "Pedernales",
    nombre_en: "Pedernales",
    descripcion_es: "Sur profundo de República Dominicana, hogar de la mítica Bahía de las Águilas.",
    descripcion_en: "Deep south of the Dominican Republic, home of the mythical Bahía de las Águilas.",
    lat: "17.9975",
    lng: "-71.7384",
    numExperiencias: 0,
    numTours: 1,
    status: "published" as const,
    emoji: "🦅",
    color: "#FCA5A5",
  },
  /* ── Samaná (original, mantenido) ── */
  {
    id: "dest-samana",
    slug: "samana",
    nombre_es: "Samaná",
    nombre_en: "Samaná",
    descripcion_es: "Península del noreste famosa por sus playas vírgenes, cocoteros y aguas turquesa, hogar de Playa Frontón.",
    descripcion_en: "Northeastern peninsula famous for its pristine beaches, palm trees and turquoise waters, home of Playa Frontón.",
    lat: "19.2056",
    lng: "-69.3367",
    numExperiencias: 6,
    numTours: 1,
    status: "published" as const,
    emoji: "🌴",
    color: "#FEF9C3",
  },
];

/* ── Experiences ─────────────────────────────────────── */
export const EXPERIENCES = [
  {
    id: "exp-pico-diego",
    destination_id: "dest-santiago",
    destinoPadre: "Santiago",
    nombre_es: "Pico Diego de Ocampo",
    nombre_en: "Pico Diego de Ocampo",
    descripcion_es: "Senderismo hasta el monumento natural de la Cordillera Septentrional para ver el amanecer.",
    descripcion_en: "Hike to the Cordillera Septentrional natural monument to watch the sunrise.",
    tipo: "Montaña",
    duracion: "4–5 horas",
    precio_base: 950,
    numTours: 1,
    status: "published" as const,
  },
  {
    id: "exp-salto-jima",
    destination_id: "dest-bonao",
    destinoPadre: "Bonao",
    nombre_es: "Salto de Jima",
    nombre_en: "Salto de Jima",
    descripcion_es: "Cascada y balneario natural en Bonao para refrescarse tras el senderismo.",
    descripcion_en: "Waterfall and natural pool in Bonao to cool off after the hike.",
    tipo: "Aventura",
    duracion: "2–3 horas",
    precio_base: 850,
    numTours: 1,
    status: "published" as const,
  },
  {
    id: "exp-playa-las-galeras",
    destination_id: "dest-samana",
    destinoPadre: "Samaná",
    nombre_es: "Playa Las Galeras",
    nombre_en: "Las Galeras Beach",
    descripcion_es: "Punto de partida costero hacia las playas escondidas de Samaná.",
    descripcion_en: "Coastal starting point toward Samaná's hidden beaches.",
    tipo: "Playa",
    duracion: "45 min",
    precio_base: 600,
    numTours: 1,
    status: "published" as const,
  },
  {
    id: "exp-cueva-elefante",
    destination_id: "dest-samana",
    destinoPadre: "Samaná",
    nombre_es: "Vista: La Cueva del Elefante",
    nombre_en: "Viewpoint: The Elephant Cave",
    descripcion_es: "Mirador hacia la imponente formación rocosa conocida como La Cueva del Elefante.",
    descripcion_en: "Viewpoint over the striking rock formation known as The Elephant Cave.",
    tipo: "Naturaleza",
    duracion: "30 min",
    precio_base: 0,
    numTours: 1,
    status: "published" as const,
  },
  {
    id: "exp-piscina-natural",
    destination_id: "dest-samana",
    destinoPadre: "Samaná",
    nombre_es: "Piscina Natural",
    nombre_en: "Natural Pool",
    descripcion_es: "Piscina natural de aguas calmadas y cristalinas para nadar y relajarse.",
    descripcion_en: "Calm, crystal-clear natural pool to swim and relax.",
    tipo: "Playa",
    duracion: "1 hora",
    precio_base: 700,
    numTours: 1,
    status: "published" as const,
  },
  {
    id: "exp-playa-madama",
    destination_id: "dest-samana",
    destinoPadre: "Samaná",
    nombre_es: "Playa Madama",
    nombre_en: "Madama Beach",
    descripcion_es: "Pequeña playa resguardada entre acantilados y vegetación.",
    descripcion_en: "Small sheltered beach tucked between cliffs and greenery.",
    tipo: "Playa",
    duracion: "1 hora",
    precio_base: 700,
    numTours: 1,
    status: "published" as const,
  },
  {
    id: "exp-playa-aserradero",
    destination_id: "dest-samana",
    destinoPadre: "Samaná",
    nombre_es: "Playa del Aserradero",
    nombre_en: "Aserradero Beach",
    descripcion_es: "Playa tranquila de arena clara en el trayecto hacia Frontón.",
    descripcion_en: "Quiet light-sand beach along the way to Frontón.",
    tipo: "Playa",
    duracion: "45 min",
    precio_base: 600,
    numTours: 1,
    status: "published" as const,
  },
  {
    id: "exp-playa-fronton",
    destination_id: "dest-samana",
    destinoPadre: "Samaná",
    nombre_es: "Playa Frontón",
    nombre_en: "Frontón Beach",
    descripcion_es: "Uno de los tesoros más imponentes de RD: acantilados, cocoteros y aguas turquesa.",
    descripcion_en: "One of the DR's most striking treasures: cliffs, palm trees and turquoise waters.",
    tipo: "Playa",
    duracion: "2 horas",
    precio_base: 1200,
    numTours: 1,
    status: "published" as const,
  },
  {
    id: "exp-balneario-la-plaza",
    destination_id: "dest-barahona",
    destinoPadre: "Barahona",
    nombre_es: "Balneario La Plaza",
    nombre_en: "Balneario La Plaza",
    descripcion_es: "El río más cristalino de RD: agua turquesa, charcos y trayecto guiado con chaleco.",
    descripcion_en: "The most crystal-clear river in the DR: turquoise water, pools and a guided route with life vests.",
    tipo: "Aventura",
    duracion: "4–5 horas",
    precio_base: 2200,
    numTours: 1,
    status: "published" as const,
  },
];

/* ── MediaAssets ─────────────────────────────────────── */
export const MEDIA_ASSETS = [
  {
    id: "media-pico-1",
    nombre: "pico-diego-amanecer.jpg",
    tipo: "foto" as const,
    asociacion: "tour" as const,
    asociadoA: "Pico Diego de Ocampo + Salto de Jima",
    url: "https://lh6.googleusercontent.com/5J4UpaCBBGrnvdMF64IJtvE6HifElCRfnrbIkwiaVz-VXHVKlrh4gGJT-l69Pyk0JTE8YCe103tItnI=w1200-h630-p",
    altES: "Amanecer en el Pico Diego de Ocampo",
    altEN: "Sunrise at Pico Diego de Ocampo",
    dimensiones: "1200×630",
    peso: "~280 KB",
    subido: "Jun 2026",
    color: "#D1FAE5",
    emoji: "⛰️",
  },
  {
    id: "media-pico-2",
    nombre: "pico-diego-panoramica.jpg",
    tipo: "foto" as const,
    asociacion: "tour" as const,
    asociadoA: "Pico Diego de Ocampo + Salto de Jima",
    url: "",
    altES: "Vista panorámica del Pico Diego de Ocampo",
    altEN: "Panoramic view of Pico Diego de Ocampo",
    dimensiones: "—",
    peso: "—",
    subido: "Jun 2026",
    color: "#BBF7D0",
    emoji: "🌄",
  },
  {
    id: "media-jima-1",
    nombre: "salto-de-jima-bonao.jpg",
    tipo: "foto" as const,
    asociacion: "tour" as const,
    asociadoA: "Pico Diego de Ocampo + Salto de Jima",
    url: "",
    altES: "Salto de Jima, Bonao",
    altEN: "Salto de Jima, Bonao",
    dimensiones: "—",
    peso: "—",
    subido: "Jun 2026",
    color: "#BFDBFE",
    emoji: "💦",
  },
  {
    id: "media-plaza-1",
    nombre: "balneario-la-plaza-turquesa.jpg",
    tipo: "foto" as const,
    asociacion: "tour" as const,
    asociadoA: "Balneario La Plaza",
    url: "https://lh3.googleusercontent.com/z1sLSG2iMSioQ4wGvTucuPkGmtIRUrPZV9-vWQlxDXAAEtRbdyd8INtROPw061qfIx4mpVMbygVe9nc=w1200-h630-p",
    altES: "Aguas turquesa del Balneario La Plaza",
    altEN: "Turquoise waters of Balneario La Plaza",
    dimensiones: "1200×630",
    peso: "~310 KB",
    subido: "Jun 2026",
    color: "#A5F3FC",
    emoji: "🏞️",
  },
  {
    id: "media-fronton-1",
    nombre: "playa-fronton-acantilado.jpg",
    tipo: "foto" as const,
    asociacion: "tour" as const,
    asociadoA: "Playa Frontón",
    url: "",
    altES: "Playa Frontón con acantilado y bote en la orilla",
    altEN: "Frontón Beach with cliff and boat on the shore",
    dimensiones: "—",
    peso: "—",
    subido: "Abr 2026",
    color: "#FEF9C3",
    emoji: "🌴",
  },
  {
    id: "media-fronton-2",
    nombre: "samana-cocoteros-turquesa.jpg",
    tipo: "foto" as const,
    asociacion: "tour" as const,
    asociadoA: "Playa Frontón",
    url: "",
    altES: "Cocoteros y aguas turquesa de Samaná",
    altEN: "Palm trees and turquoise waters of Samaná",
    dimensiones: "—",
    peso: "—",
    subido: "Abr 2026",
    color: "#A5F3FC",
    emoji: "🏝️",
  },
  {
    id: "media-fronton-flyer",
    nombre: "fronton-flyer.jpg",
    tipo: "foto" as const,
    asociacion: "tour" as const,
    asociadoA: "Playa Frontón",
    url: "",
    altES: "Flyer Playa Frontón Samaná",
    altEN: "Playa Frontón Samaná flyer",
    dimensiones: "—",
    peso: "—",
    subido: "Abr 2026",
    color: "#FDE68A",
    emoji: "📋",
  },
  {
    id: "media-plaza-2",
    nombre: "balneario-la-plaza-charcos.jpg",
    tipo: "foto" as const,
    asociacion: "tour" as const,
    asociadoA: "Balneario La Plaza",
    url: "",
    altES: "Charcos cristalinos en la ruta de La Plaza",
    altEN: "Crystal-clear pools along the La Plaza route",
    dimensiones: "—",
    peso: "—",
    subido: "Jun 2026",
    color: "#7DD3FC",
    emoji: "🌊",
  },
];

/* ── Tours ───────────────────────────────────────────── */
export const TOURS_DATA = [
  {
    id: "tour-pico-diego-salto-jima",
    slug: "pico-diego-de-ocampo-salto-de-jima",
    titulo_es: "Pico Diego de Ocampo + Salto de Jima",
    titulo_en: "Pico Diego de Ocampo + Salto de Jima",
    descripcion_es: "Aventura, senderismo y un amanecer indescriptible. El tesoro oculto de la Cordillera Septentrional.",
    tipo: "fijo" as const,
    itinerary: [],
    destinos_ids: ["dest-santiago", "dest-bonao"],
    destinos_nombres: ["Santiago", "Bonao"],
    experiencias_ids: ["exp-pico-diego", "exp-salto-jima"],
    pricing_model: {
      type: "fixed_per_person",
      price_per_person: 1900,
      currency: "DOP",
    },
    capacidad_max: 40,
    deposito_monto_fijo: 1000,
    deposito_porcentaje: 53,
    included_services: [
      { service_id: "svc-transporte", included: true,  custom_note: "" },
      { service_id: "svc-cafe-agua",  included: true,  custom_note: "" },
      { service_id: "svc-staff",      included: true,  custom_note: "" },
      { service_id: "svc-entradas",   included: true,  custom_note: "Entrada al Salto de Jima" },
      { service_id: "svc-fotos",      included: true,  custom_note: "" },
      { service_id: "svc-almuerzo",   included: false, custom_note: "" },
      { service_id: "svc-chaleco",    included: false, custom_note: "" },
      { service_id: "svc-guia",       included: false, custom_note: "" },
    ],
    details: {
      duracion: "Full Day (1 día)",
      idiomas: ["Español"],
      cuando_reservar: "Reservar hasta el 10 de Julio · Pago total el 13 de Julio",
      tipo_bono: "electrónico",
      accesibilidad: "No apto para movilidad reducida (sendero de montaña)",
      mascotas_permitidas: false,
      edad_minima: null,
      dificultad: "Moderada-Alta",
      sostenibilidad_nota: "Usa protector solar Reef safe y respeta el entorno natural.",
    },
    galeria_ids: ["media-pico-1", "media-pico-2", "media-jima-1"],
    operador_id: "op-randomtrips",
    operador_nombre: "Random Trips",
    estado: "publicado" as const,
    logistica: {
      punto_salida: "Bon Plaza Paraíso, Av. Winston Churchill, Santo Domingo",
      hora_salida: "2:30 A.M (puntual)",
      maps: "https://share.google/ic18n9Gy6v6j9NLjL",
    },
    grupo_whatsapp_url: "https://chat.whatsapp.com/LBP6kOvni3t2ubzKnlkZEv?mode=gi_t",
    // UI helpers
    categorias: ["Naturaleza & Aventura", "Senderismo"],
    tags: ["amanecer", "montaña", "senderismo", "aventura"],
    pricing: "RD$ 1,900/p",
    reservasActivas: 17,
    ultimaActualizacion: "Hoy 09:14",
    rating: 4.9,
    totalReservas: 23,
    emoji: "⛰️",
    heroBg: "#D1FAE5",
  },
  {
    id: "tour-travelhood-plan-1",
    slug: "travelhood-plan-1-rd-7-dias",
    titulo_es: "TravelHood Plan 1 — República Dominicana 7 días",
    titulo_en: "TravelHood Plan 1 — Dominican Republic 7 days",
    descripcion_es: "Recorrido completo por RD: Santo Domingo, Puerto Plata, Río San Juan, Frontón, Las Terrenas y Sur Profundo + Bahía de las Águilas. Donde lo inesperado se vuelve inolvidable.",
    tipo: "multi_dia" as const,
    destinos_ids: ["dest-santo-domingo", "dest-puerto-plata", "dest-rio-san-juan", "dest-samana", "dest-las-terrenas", "dest-barahona", "dest-pedernales"],
    destinos_nombres: ["Santo Domingo", "Puerto Plata", "Río San Juan", "Samaná", "Las Terrenas", "Barahona", "Pedernales"],
    experiencias_ids: [],
    pricing_model: {
      type: "tiered_per_pax",
      base_pax: 10,
      base_price_per_person: 40344,
      currency: "DOP",
      tiers: [
        { pax: 6,  price_per_person: 51612 },
        { pax: 7,  price_per_person: 46113 },
        { pax: 8,  price_per_person: 43611 },
        { pax: 9,  price_per_person: 41796 },
        { pax: 11, price_per_person: 37868 },
        { pax: 12, price_per_person: 35806 },
      ],
      min_pax: 6,
      max_pax: 12,
      itbis_incluido: true,
    },
    itinerary: [
      { id: "d1", day_number: 1, title_es: "Día 1 — Santo Domingo", title_en: "Day 1 — Santo Domingo", description_es: "City Tour Zona Colonial", description_en: "Colonial Zone City Tour", destinos_ids: ["dest-santo-domingo"], experiencias_ids: [], incluye_text_es: "Transporte · Guía + Excursión · Entradas (acceso a los destinos) · Impuestos", incluye_text_en: "Transport · Guide + Excursion · Admission · Taxes", is_swappable: false, alternatives: [] },
      { id: "d2", day_number: 2, title_es: "Día 2 — Puerto Plata", title_en: "Day 2 — Puerto Plata", description_es: "Charcos de Damajagua, Zipline y City Tour en la ciudad más instagrameable.", description_en: "Damajagua waterfalls, zipline and city tour.", destinos_ids: ["dest-puerto-plata"], experiencias_ids: [], incluye_text_es: "Transporte · Guía + Excursión · Almuerzo · Acceso a lockers · Ziplines · Guía City Tour Puerto Plata", incluye_text_en: "Transport · Guide + Excursion · Lunch · Lockers · Ziplines · City Tour Guide", is_swappable: false, alternatives: [] },
      { id: "d3", day_number: 3, title_es: "Día 3 — Río San Juan", title_en: "Day 3 — Río San Juan", description_es: "Calle Beler, recorrido en bote, Playa Grande, Playa Los Minos, Laguna Gri-Gri.", description_en: "Beler street, boat tour, Playa Grande, Playa Los Minos, Gri-Gri Lagoon.", destinos_ids: ["dest-rio-san-juan"], experiencias_ids: [], incluye_text_es: "Transporte · Guía local · Excursión Laguna Gri Gri · Transporte marítimo", incluye_text_en: "Transport · Local guide · Gri Gri Lagoon excursion · Maritime transport", is_swappable: false, alternatives: [] },
      { id: "d4", day_number: 4, title_es: "Día 4 — Frontón", title_en: "Day 4 — Frontón", description_es: "Las casitas de colores, Playa Las Galeras, Playa Madama, Cueva Taína, Playa Frontón, Playa Bonita.", description_en: "Colored houses, Las Galeras Beach, Madama Beach, Taino Cave, Frontón Beach, Bonita Beach.", destinos_ids: ["dest-samana"], experiencias_ids: ["exp-playa-fronton", "exp-playa-madama", "exp-playa-las-galeras"], incluye_text_es: "Transporte · Excursión · Transporte marítimo", incluye_text_en: "Transport · Excursion · Maritime transport", is_swappable: true, alternatives: [] },
      { id: "d5", day_number: 5, title_es: "Día 5 — Las Terrenas", title_en: "Day 5 — Las Terrenas", description_es: "Playa Las Terrenas, Playa Bonita y Salto de Socoa.", description_en: "Las Terrenas Beach, Bonita Beach and Socoa Waterfall.", destinos_ids: ["dest-las-terrenas"], experiencias_ids: [], incluye_text_es: "Transporte · Acceso a Salto de Socoa", incluye_text_en: "Transport · Salto de Socoa access", is_swappable: true, alternatives: [] },
      { id: "d6", day_number: 6, title_es: "Día 6-7 — Sur Profundo + Bahía de las Águilas", title_en: "Day 6-7 — Sur Profundo + Bahía de las Águilas", description_es: "Playa y Río San Rafael, Patos de Barahona, Mirador San Rafael, Pozos de Romeo / Playita del Amor, Bahía de las Águilas.", description_en: "San Rafael Beach and River, Barahona Patos, San Rafael viewpoint, Romeo Wells / Love Beach, Bahía de las Águilas.", destinos_ids: ["dest-barahona", "dest-pedernales"], experiencias_ids: [], incluye_text_es: "Transporte · Transporte marítimo · Hospedaje Glamping · Desayuno (día 2) · Impuestos Medio Ambiente", incluye_text_en: "Transport · Maritime transport · Glamping accommodation · Breakfast (day 2) · Environmental taxes", is_swappable: false, alternatives: [] },
    ],
    capacidad_max: 12,
    deposito_monto_fijo: 5000,
    deposito_porcentaje: 12,
    included_services: [],
    details: {
      duracion: "7 días / 6 noches",
      idiomas: ["Español", "Inglés"],
      cuando_reservar: "Reservar con anticipación; salida programada 8-14 de marzo",
      tipo_bono: "electrónico",
      accesibilidad: "Requiere movilidad; varias caminatas y trayectos en bote",
      mascotas_permitidas: false,
      edad_minima: null,
      dificultad: "Moderada",
      sostenibilidad_nota: "Usa protector solar Reef safe y respeta el entorno natural.",
    },
    galeria_ids: [],
    operador_id: "op-randomtrips",
    operador_nombre: "Random Trips",
    estado: "publicado" as const,
    logistica: {
      punto_salida: "Bon Plaza Paraíso, Av. Winston Churchill, Santo Domingo",
      hora_salida: "Variable según itinerario del día",
      maps: "https://share.google/ic18n9Gy6v6j9NLjL",
    },
    grupo_whatsapp_url: null,
    categorias: ["Multi-destino", "Naturaleza & Aventura", "Cultural"],
    tags: ["7 días", "multi-destino", "agencias", "internacional"],
    pricing: "Desde RD$ 35,806/p",
    reservasActivas: 0,
    ultimaActualizacion: "Hoy",
    rating: 0,
    totalReservas: 0,
    emoji: "🗺️",
    heroBg: "#DBEAFE",
  },
  {
    id: "tour-playa-fronton",
    slug: "playa-fronton-samana",
    titulo_es: "Playa Frontón",
    titulo_en: "Frontón Beach",
    descripcion_es: "Un full day por las playas escondidas de la península: acantilados, cocoteros, piscinas naturales y aguas turquesa.",
    tipo: "fijo" as const,
    itinerary: [],
    destinos_ids: ["dest-samana"],
    destinos_nombres: ["Samaná"],
    experiencias_ids: ["exp-playa-las-galeras", "exp-cueva-elefante", "exp-piscina-natural", "exp-playa-madama", "exp-playa-aserradero", "exp-playa-fronton"],
    pricing_model: {
      type: "fixed_per_person",
      price_per_person: 3500,
      currency: "DOP",
    },
    capacidad_max: 40,
    deposito_monto_fijo: 1000,
    deposito_porcentaje: 29,
    included_services: [
      { service_id: "svc-transporte", included: true,  custom_note: "" },
      { service_id: "svc-snacks",     included: true,  custom_note: "" },
      { service_id: "svc-almuerzo",   included: true,  custom_note: "Almuerzo típico en la playa" },
      { service_id: "svc-guia",       included: true,  custom_note: "Guía local" },
      { service_id: "svc-staff",      included: true,  custom_note: "" },
      { service_id: "svc-chaleco",    included: true,  custom_note: "" },
      { service_id: "svc-fotos",      included: true,  custom_note: "" },
      { service_id: "svc-cafe-agua",  included: false, custom_note: "" },
      { service_id: "svc-entradas",   included: false, custom_note: "" },
    ],
    details: {
      duracion: "Full Day (1 día)",
      idiomas: ["Español"],
      cuando_reservar: "Cupos limitados; reserva con RD$1,000 p/p",
      tipo_bono: "electrónico",
      accesibilidad: "Incluye traslado en bote y caminata entre playas; uso de chaleco salvavidas",
      mascotas_permitidas: false,
      edad_minima: null,
      dificultad: "Moderada",
      sostenibilidad_nota: "Usa protector solar Reef safe y respeta las playas y su entorno.",
    },
    galeria_ids: ["media-fronton-1", "media-fronton-2", "media-fronton-flyer"],
    operador_id: "op-randomtrips",
    operador_nombre: "Random Trips",
    estado: "publicado" as const,
    logistica: {
      punto_salida: "Bon Plaza Paraíso, Av. Winston Churchill, Santo Domingo",
      hora_salida: "5:00 A.M (puntual)",
      maps: "https://share.google/ic18n9Gy6v6j9NLjL",
    },
    grupo_whatsapp_url: null,
    categorias: ["Playa & Snorkel", "Naturaleza & Aventura"],
    tags: ["playa", "samaná", "bote", "acantilados", "turquesa"],
    pricing: "RD$ 3,500/p",
    reservasActivas: 0,
    ultimaActualizacion: "19 Abr 2026",
    rating: 5.0,
    totalReservas: 40,
    emoji: "🌴",
    heroBg: "#FEF9C3",
  },
  {
    id: "tour-balneario-la-plaza",
    slug: "balneario-la-plaza-barahona",
    titulo_es: "Balneario La Plaza",
    titulo_en: "Balneario La Plaza",
    descripcion_es: "El río más cristalino de República Dominicana. Agua turquesa, naturaleza y aventura en un solo lugar.",
    tipo: "fijo" as const,
    itinerary: [],
    destinos_ids: ["dest-barahona"],
    destinos_nombres: ["Barahona"],
    experiencias_ids: ["exp-balneario-la-plaza"],
    pricing_model: {
      type: "fixed_per_person",
      price_per_person: 3200,
      currency: "DOP",
    },
    capacidad_max: 40,
    deposito_monto_fijo: 1000,
    deposito_porcentaje: 31,
    included_services: [
      { service_id: "svc-transporte", included: true,  custom_note: "" },
      { service_id: "svc-cafe-agua",  included: true,  custom_note: "" },
      { service_id: "svc-almuerzo",   included: true,  custom_note: "Almuerzo típico" },
      { service_id: "svc-chaleco",    included: true,  custom_note: "" },
      { service_id: "svc-guia",       included: true,  custom_note: "" },
      { service_id: "svc-staff",      included: true,  custom_note: "" },
      { service_id: "svc-fotos",      included: true,  custom_note: "" },
      { service_id: "svc-entradas",   included: false, custom_note: "" },
    ],
    details: {
      duracion: "Full Day (1 día)",
      idiomas: ["Español"],
      cuando_reservar: "Reservar hasta el 10 de Junio · Pago total el 16 de Junio",
      tipo_bono: "electrónico",
      accesibilidad: "Requiere caminar y nadar; uso obligatorio de chaleco salvavidas",
      mascotas_permitidas: false,
      edad_minima: null,
      dificultad: "Moderada",
      sostenibilidad_nota: "Usa protector solar Reef safe y cuida el río y su entorno.",
    },
    galeria_ids: ["media-plaza-1", "media-plaza-2"],
    operador_id: "op-randomtrips",
    operador_nombre: "Random Trips",
    estado: "publicado" as const,
    logistica: {
      punto_salida: "Bon Plaza Paraíso, Av. Winston Churchill, Santo Domingo",
      hora_salida: "5:30 A.M (puntual)",
      maps: "https://share.google/ic18n9Gy6v6j9NLjL",
    },
    grupo_whatsapp_url: null,
    // UI helpers
    categorias: ["Naturaleza & Aventura", "Playa & Río"],
    tags: ["turquesa", "río", "barahona", "aventura", "chaleco"],
    pricing: "RD$ 3,200/p",
    reservasActivas: 9,
    ultimaActualizacion: "Hoy 08:45",
    rating: 4.8,
    totalReservas: 31,
    emoji: "🏞️",
    heroBg: "#A5F3FC",
  },
];

/* ── Availability (fechas corregidas a 2026) ─────────── */
export const AVAILABILITY = [
  {
    tour_id: "tour-pico-diego-salto-jima",
    tour_nombre: "Pico Diego de Ocampo + Salto de Jima",
    fecha: "2026-07-19",
    fecha_display: "19 Jul 2026",
    cupos_totales: 40,
    cupos_reservados: 4,   // 4 reservas detalladas en BOOKINGS
    cupos_libres: 36,
    estado: "abierto" as const,
    precio_override: null,
  },
  {
    tour_id: "tour-playa-fronton",
    tour_nombre: "Playa Frontón",
    fecha: "2026-04-18",
    fecha_display: "18 Abr 2026",
    cupos_totales: 40,
    cupos_reservados: 40,
    cupos_libres: 0,
    estado: "completado" as const,
    precio_override: null,
  },
  {
    tour_id: "tour-balneario-la-plaza",
    tour_nombre: "Balneario La Plaza",
    fecha: "2026-06-21",
    fecha_display: "21 Jun 2026",
    cupos_totales: 40,
    cupos_reservados: 3,   // 3 reservas detalladas en BOOKINGS
    cupos_libres: 37,
    estado: "abierto" as const,
    precio_override: null,
  },
];

/* ── Pages (políticas) ───────────────────────────────── */
export const PAGES_DATA = [
  {
    id: "page-politicas-cancelacion",
    slug: "politicas-de-cancelacion",
    titulo_es: "Políticas de Cancelación",
    titulo_en: "Cancellation Policies",
    status: "published" as const,
    contenido_es: `Si no puede asistir tras reservar o pagar el viaje completo:

1. Buscar un reemplazo notificando con 3 días de anticipación.
2. No se permiten cambios el mismo día.
3. Si solo reservó y no tiene reemplazo, el monto no es transferible ni reembolsable.
4. Si pagó completo y notificó antes de la fecha límite sin reemplazo, pierde la reserva y se reembolsa la diferencia.
5. Si pagó completo y notifica después de la fecha límite sin reemplazo, pierde todo el pago.
6. Si reservó más de un lugar y una persona no asiste, debe reemplazarse; su reserva no es transferible al monto restante.
7. Si vence la fecha límite sin completar el pago, su lugar se libera.
8. Hay lista de espera para ayudar con cambios.
9. Por fuerza mayor (clima/situación) que obligue a suspender, si no puede asistir a la nueva fecha ni le interesa otro viaje, se reembolsa completo.`,
    contenido_en: `If you cannot attend after booking or paying in full:

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
  {
    id: "page-normas-tour",
    slug: "normas-del-tour",
    titulo_es: "Normas del Tour",
    titulo_en: "Tour Rules",
    status: "published" as const,
    contenido_es: `• No se permite el uso de vapes ni cigarrillos dentro de la guagua.
• La guagua no realiza paradas adicionales: salida y llegada solo en el punto de encuentro.
• Las bebidas alcohólicas deben consumirse con precaución.
• La música será de agrado general, evitando contenido obsceno.
• Se exige respeto al personal, guías y demás clientes durante todo el recorrido y en los grupos de WhatsApp.
• Cualquier incumplimiento puede resultar en cancelación de la participación sin remuneración.`,
    contenido_en: `• Vapes and cigarettes are not allowed inside the bus.
• The bus makes no additional stops: departure and arrival only at the meeting point.
• Alcoholic beverages must be consumed responsibly.
• Music will be generally agreeable, avoiding explicit content.
• Respect for staff, guides and other clients is required throughout the trip and in WhatsApp groups.
• Any breach may result in cancellation of participation without refund.`,
  },
  {
    id: "page-proceso-inscripcion",
    slug: "proceso-de-inscripcion",
    titulo_es: "Proceso de Inscripción",
    titulo_en: "Registration Process",
    status: "published" as const,
    contenido_es: `1. Revisa toda la información del tour.
2. Llena el formulario con tus datos reales (si viajan 2+ personas, cada quien el suyo).
3. Realiza tu reserva; en el comprobante indica nombre completo + tour, y envía la captura por WhatsApp al +1 (849) 589-2057.
4. Una semana antes te agregamos al grupo de WhatsApp con los detalles finales.`,
    contenido_en: `1. Review all tour information.
2. Fill out the form with your real data (if 2+ people travel, each fills their own).
3. Make your reservation; on the receipt write your full name + tour, and send the screenshot via WhatsApp to +1 (849) 589-2057.
4. One week before, we'll add you to the WhatsApp group with final details.`,
  },
];

/* ── Customers ───────────────────────────────────────── */
export const CUSTOMERS = [
  { id: "cust-001", nombre: "Ana Belén Reyes",  email: "anabelen.reyes@gmail.com",  telefono: "+1 (809) 555-0142", pais: "🇩🇴 DO", idioma: "ES", moneda: "DOP" },
  { id: "cust-002", nombre: "Carlos Medina",    email: "carlos.medina@outlook.com", telefono: "+1 (829) 555-0198", pais: "🇩🇴 DO", idioma: "ES", moneda: "DOP" },
  { id: "cust-003", nombre: "Sofía Restrepo",   email: "sofia.restrepo@gmail.com",  telefono: "+57 310 555 7721",  pais: "🇨🇴 CO", idioma: "ES", moneda: "USD" },
  { id: "cust-004", nombre: "James Whitfield",  email: "j.whitfield@gmail.com",     telefono: "+1 (646) 555-3390", pais: "🇺🇸 US", idioma: "EN", moneda: "USD" },
  { id: "cust-005", nombre: "Marie Dubois",     email: "marie.dubois@orange.fr",    telefono: "+33 6 12 55 87 04", pais: "🇫🇷 FR", idioma: "EN", moneda: "EUR" },
  { id: "cust-006", nombre: "Lucía Fernández",  email: "lucia.fdez@gmail.com",      telefono: "+34 612 55 33 18", pais: "🇪🇸 ES", idioma: "ES", moneda: "EUR" },
  { id: "cust-007", nombre: "Pedro Jiménez",    email: "pedrojimenez.rd@gmail.com", telefono: "+1 (849) 555-7765", pais: "🇩🇴 DO", idioma: "ES", moneda: "DOP" },
];

/* ── Bookings ─────────────────────────────────────────── */
export type BookingStatus = "pagado_completo" | "deposito_pagado" | "saldo_vencido" | "cancelado";

export const BOOKINGS = [
  { id: "bk-2026-001", customer_id: "cust-001", tour_id: "tour-balneario-la-plaza",    fecha: "2026-06-21", fecha_display: "21 Jun 2026", pax_total: 2, precio_total: 6400, deposito_pagado: 6400, saldo_pendiente: 0,    estado: "pagado_completo" as BookingStatus },
  { id: "bk-2026-002", customer_id: "cust-003", tour_id: "tour-balneario-la-plaza",    fecha: "2026-06-21", fecha_display: "21 Jun 2026", pax_total: 1, precio_total: 3200, deposito_pagado: 1000, saldo_pendiente: 2200, estado: "deposito_pagado" as BookingStatus },
  { id: "bk-2026-003", customer_id: "cust-004", tour_id: "tour-balneario-la-plaza",    fecha: "2026-06-21", fecha_display: "21 Jun 2026", pax_total: 1, precio_total: 3200, deposito_pagado: 1000, saldo_pendiente: 2200, estado: "saldo_vencido"   as BookingStatus },
  { id: "bk-2026-004", customer_id: "cust-002", tour_id: "tour-pico-diego-salto-jima", fecha: "2026-07-19", fecha_display: "19 Jul 2026", pax_total: 2, precio_total: 3800, deposito_pagado: 2000, saldo_pendiente: 1800, estado: "deposito_pagado" as BookingStatus },
  { id: "bk-2026-005", customer_id: "cust-005", tour_id: "tour-pico-diego-salto-jima", fecha: "2026-07-19", fecha_display: "19 Jul 2026", pax_total: 1, precio_total: 1900, deposito_pagado: 1000, saldo_pendiente: 900,  estado: "deposito_pagado" as BookingStatus },
  { id: "bk-2026-006", customer_id: "cust-006", tour_id: "tour-pico-diego-salto-jima", fecha: "2026-07-19", fecha_display: "19 Jul 2026", pax_total: 1, precio_total: 1900, deposito_pagado: 1900, saldo_pendiente: 0,    estado: "pagado_completo" as BookingStatus },
  { id: "bk-2026-007", customer_id: "cust-007", tour_id: "tour-pico-diego-salto-jima", fecha: "2026-07-19", fecha_display: "19 Jul 2026", pax_total: 1, precio_total: 1900, deposito_pagado: 1000, saldo_pendiente: 900,  estado: "deposito_pagado" as BookingStatus },
];

/* ── Payments (transacciones confirmadas) ────────────── */
export const PAYMENTS = [
  { booking_id: "bk-2026-001", tipo: "deposito", monto: 2000, moneda: "DOP", paypal_txn_id: "PAYID-MOCK-001A", estado: "completado", fecha: "05 Jun 2026" },
  { booking_id: "bk-2026-001", tipo: "saldo",    monto: 4400, moneda: "DOP", paypal_txn_id: "PAYID-MOCK-001B", estado: "completado", fecha: "14 Jun 2026" },
  { booking_id: "bk-2026-002", tipo: "deposito", monto: 1000, moneda: "DOP", paypal_txn_id: "PAYID-MOCK-002A", estado: "completado", fecha: "08 Jun 2026" },
  { booking_id: "bk-2026-003", tipo: "deposito", monto: 1000, moneda: "DOP", paypal_txn_id: "PAYID-MOCK-003A", estado: "completado", fecha: "07 Jun 2026" },
  { booking_id: "bk-2026-004", tipo: "deposito", monto: 2000, moneda: "DOP", paypal_txn_id: "PAYID-MOCK-004A", estado: "completado", fecha: "30 Jun 2026" },
  { booking_id: "bk-2026-005", tipo: "deposito", monto: 1000, moneda: "DOP", paypal_txn_id: "PAYID-MOCK-005A", estado: "completado", fecha: "01 Jul 2026" },
  { booking_id: "bk-2026-006", tipo: "deposito", monto: 1000, moneda: "DOP", paypal_txn_id: "PAYID-MOCK-006A", estado: "completado", fecha: "28 Jun 2026" },
  { booking_id: "bk-2026-006", tipo: "saldo",    monto: 900,  moneda: "DOP", paypal_txn_id: "PAYID-MOCK-006B", estado: "completado", fecha: "05 Jul 2026" },
  { booking_id: "bk-2026-007", tipo: "deposito", monto: 1000, moneda: "DOP", paypal_txn_id: "PAYID-MOCK-007A", estado: "completado", fecha: "02 Jul 2026" },
];

/* ── PaymentLinks ────────────────────────────────────── */
export type LinkStatus = "enviado" | "vencido" | "pendiente" | "pagado";

export const PAYMENT_LINKS = [
  { booking_id: "bk-2026-002", monto: 2200, moneda: "DOP", invoice_id: "INV-MOCK-002", expira: "16 Jun 2026", estado: "enviado"  as LinkStatus, recordatorios: ["12 Jun 2026", "15 Jun 2026"] },
  { booking_id: "bk-2026-003", monto: 2200, moneda: "DOP", invoice_id: "INV-MOCK-003", expira: "16 Jun 2026", estado: "vencido"  as LinkStatus, recordatorios: ["12 Jun 2026", "15 Jun 2026", "16 Jun 2026"] },
  { booking_id: "bk-2026-004", monto: 1800, moneda: "DOP", invoice_id: "INV-MOCK-004", expira: "13 Jul 2026", estado: "enviado"  as LinkStatus, recordatorios: [] },
  { booking_id: "bk-2026-005", monto: 900,  moneda: "DOP", invoice_id: "INV-MOCK-005", expira: "13 Jul 2026", estado: "enviado"  as LinkStatus, recordatorios: [] },
  { booking_id: "bk-2026-007", monto: 900,  moneda: "DOP", invoice_id: "INV-MOCK-007", expira: "13 Jul 2026", estado: "pendiente" as LinkStatus, recordatorios: [] },
];

/* ── Testimonials ────────────────────────────────────── */
export const TESTIMONIALS = [
  {
    id: "tst-001",
    cliente_nombre: "Ana Belén R.",
    tour_id: "tour-balneario-la-plaza",
    tour_nombre: "Balneario La Plaza",
    contenido_es: "El agua de La Plaza es de otro mundo, increíblemente cristalina. El staff súper pendiente de todos y el almuerzo típico estuvo buenísimo. Repito sin pensarlo.",
    contenido_en: "The water at La Plaza is out of this world, incredibly clear. The staff looked after everyone and the typical lunch was delicious. I'd do it again in a heartbeat.",
    rating: 5, fecha: "17 Ago 2025", aprobado: true, orden: 1,
  },
  {
    id: "tst-002",
    cliente_nombre: "James W.",
    tour_id: "tour-balneario-la-plaza",
    tour_nombre: "Balneario La Plaza",
    contenido_es: "Una joya escondida del sur. Los chalecos y los guías nos dieron mucha tranquilidad en el trayecto por el río. Organización de 10.",
    contenido_en: "A hidden gem in the south. The life vests and guides gave us real peace of mind along the river. Top-notch organization.",
    rating: 5, fecha: "21 Sep 2025", aprobado: true, orden: 2,
  },
  {
    id: "tst-003",
    cliente_nombre: "Sofía R.",
    tour_id: "tour-pico-diego-salto-jima",
    tour_nombre: "Pico Diego de Ocampo + Salto de Jima",
    contenido_es: "Madrugamos muchísimo pero el amanecer desde el Pico Diego valió cada minuto. El Salto de Jima fue el cierre perfecto. Experiencia inolvidable.",
    contenido_en: "We woke up super early but the sunrise from Pico Diego was worth every minute. Salto de Jima was the perfect closer. An unforgettable experience.",
    rating: 5, fecha: "20 Jul 2025", aprobado: true, orden: 3,
  },
  {
    id: "tst-004",
    cliente_nombre: "Marie D.",
    tour_id: "tour-pico-diego-salto-jima",
    tour_nombre: "Pico Diego de Ocampo + Salto de Jima",
    contenido_es: "El senderismo es exigente pero la vista lo compensa todo. El grupo y el staff hicieron el ambiente muy ameno. Muy recomendable.",
    contenido_en: "The hike is demanding but the view makes up for everything. The group and staff made it a really friendly atmosphere. Highly recommended.",
    rating: 5, fecha: "20 Jul 2025", aprobado: true, orden: 4,
  },
  {
    id: "tst-005",
    cliente_nombre: "Pedro J.",
    tour_id: "tour-balneario-la-plaza",
    tour_nombre: "Balneario La Plaza",
    contenido_es: "Buen viaje en general, el balneario espectacular. La salida muy temprano se siente, pero llegar a un río tan limpio lo vale.",
    contenido_en: "Great trip overall, the spot is spectacular. The early departure is felt, but reaching such a clean river makes it worth it.",
    rating: 4, fecha: "22 Jun 2025", aprobado: true, orden: 5,
  },
  {
    id: "tst-006",
    cliente_nombre: "Lucía F.",
    tour_id: "tour-pico-diego-salto-jima",
    tour_nombre: "Pico Diego de Ocampo + Salto de Jima",
    contenido_es: "Random Trips cuida los detalles: café temprano, fotos durante todo el recorrido y guías atentos. Una manera distinta de conocer RD.",
    contenido_en: "Random Trips takes care of the details: early coffee, photos throughout and attentive guides. A different way to discover the DR.",
    rating: 5, fecha: "21 Jul 2025", aprobado: true, orden: 6,
  },
  {
    id: "tst-009",
    cliente_nombre: "Daniela P.",
    tour_id: "tour-playa-fronton",
    tour_nombre: "Playa Frontón",
    contenido_es: "Playa Frontón es de otro nivel. Ver tantas playas en un solo día, con el bote y los guías, fue una experiencia increíble. Las fotos quedaron espectaculares.",
    contenido_en: "Playa Frontón is on another level. Seeing so many beaches in a single day, with the boat and the guides, was an incredible experience. The photos came out spectacular.",
    rating: 5, fecha: "19 Abr 2026", aprobado: true, orden: 9,
  },
  {
    id: "tst-010",
    cliente_nombre: "Miguel A.",
    tour_id: "tour-playa-fronton",
    tour_nombre: "Playa Frontón",
    contenido_es: "La piscina natural y Playa Madama fueron mis favoritas. Todo muy bien organizado y el almuerzo en la playa, un manjar. Repetiría sin dudarlo.",
    contenido_en: "The natural pool and Madama Beach were my favorites. Everything was well organized and the lunch on the beach was a treat. I'd repeat without hesitation.",
    rating: 5, fecha: "20 Abr 2026", aprobado: true, orden: 10,
  },
];

/* ── Helpers ─────────────────────────────────────────── */
export function formatDOP(amount: number): string {
  return `RD$ ${amount.toLocaleString("es-DO")}`;
}

export function dopToUSD(amount: number): number {
  return Math.round(amount * SITE_CONFIG.tasas_cambio.USD);
}

export function dopToEUR(amount: number): number {
  return Math.round(amount * SITE_CONFIG.tasas_cambio.EUR);
}

/* ── Derived aggregates (computed once) ──────────────── */
export const TOTAL_COBRADO      = BOOKINGS.reduce((s, b) => s + b.deposito_pagado, 0);
export const TOTAL_SALDO        = BOOKINGS.reduce((s, b) => s + b.saldo_pendiente, 0);
export const BOOKINGS_ACTIVAS   = BOOKINGS.filter(b => b.estado !== "cancelado").length;
export const SALDOS_VENCIDOS    = PAYMENT_LINKS.filter(l => l.estado === "vencido");
export const SALDOS_POR_VENCER  = PAYMENT_LINKS.filter(l => l.estado === "enviado");
