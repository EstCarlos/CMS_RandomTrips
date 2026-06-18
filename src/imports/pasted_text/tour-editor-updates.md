En el componente TourEditor del proyecto y en src/app/data/realData.ts,
aplica los siguientes cambios. Todo el código existente se mantiene
salvo lo que aquí se especifica. Mantén el estilo de inline styles 
del proyecto, paleta #006CFE para activo y #F13540 para destructivo. 
NO uses Tailwind classes.

═══════════════════════════════════════════════════════
1. RENOMBRAR EL TIPO "customizable" A "multi_dia"
═══════════════════════════════════════════════════════

En TabInfo, en el selector de "Tipo de tour", reemplaza la opción 
"customizable" por "multi_dia". El selector queda:

- 🎯 Fijo — "Tour de 1 día, precio cerrado"
- 🗓️ Multi-día — "Paquete de varios días, con o sin opciones por día"  
- 📩 Privado — "Solo formulario de cotización"

═══════════════════════════════════════════════════════
2. AGREGAR TAB "ITINERARIO"
═══════════════════════════════════════════════════════

Agrega un nuevo tab "Itinerario" entre "Destinos" y "Servicios 
incluidos". Solo se muestra cuando tour.tipo === "multi_dia". 
Si tour.tipo es "fijo" o "privado", oculta el tab de la barra 
de navegación.

ESTRUCTURA: timeline vertical de cards por día. Cada card 
representa un objeto Day y tiene:

- Drag handle (GripVertical de lucide-react) en el extremo izquierdo
- Badge circular azul (#006CFE) con el número del día
- BilingualField para "Título del día" (title_es / title_en)
  Placeholder: "Día 1 — Santo Domingo"
- BilingualField multiline (3 rows) para "Descripción" 
  (description_es / description_en)
- Multi-select de destinos visitados ese día (destinos_ids[], 
  usa el mismo patrón de TabDestinos pero compacto)
- Multi-select de experiencias visitadas ese día (experiencias_ids[], 
  usa el mismo patrón de TabExperiencias pero compacto)
- BilingualField multiline (4 rows) para "Incluye (texto libre)" 
  (incluye_text_es / incluye_text_en)
  Placeholder: "Transporte · Guía + Excursión · Entradas · Impuestos"
  Helper text: "Lista los servicios separados por · o como bullets. 
  Este texto se muestra tal cual en la web pública."
- Toggle "Cliente puede cambiar este día" (is_swappable)

Cuando is_swappable está en ON, debajo del toggle aparece la sección 
"Alternativas permitidas":

  Lista de alternativas como rows compactas. Cada row:
  [foto/emoji del destino] Nombre experiencia · Destino padre
                                                Delta: + RD$ ___ /p
                                                [Eliminar]
  
  Botón "+ Agregar alternativa" debajo, que abre un selector de 
  experiencias del catálogo (filtrando por destinos compatibles 
  según la curaduría que define el staff).

Cuando is_swappable está OFF, mostrar texto gris pequeño debajo del 
toggle: "Día fijo — el cliente no podrá modificar este día."

AL FINAL DEL TIMELINE:
- Botón ghost "+ Agregar día" con icono Plus
- Texto contador a la derecha: "Itinerario de N días"

═══════════════════════════════════════════════════════
3. ACTUALIZAR TAB PRICING CON 3 MODOS
═══════════════════════════════════════════════════════

Agrega un selector de modo arriba del tab Pricing (3 radio cards 
horizontales):

- 💰 Por persona — precio fijo por persona
- 📊 Tiered por pax — precio varía según cantidad exacta de personas
- 👥 Grupo cerrado — precio total fijo independiente del pax

La UI debajo del selector cambia según el modo:

──── Modo "fixed_per_person" (Por persona) ────
Mantén la UI actual: input de precio por persona DOP + calculadora 
en vivo + bloque de depósito fijo amarillo.

──── Modo "tiered_per_pax" (Tiered por pax) ────
- Input destacado "Pax base" (numérico) con helper "Cantidad de 
  personas sobre la cual se calcula el precio principal mostrado"
- Tabla editable con 2 columnas: "Pax" (numérico) y "Precio por 
  persona (DOP)" más calculadora inline de USD/EUR
- Fila resaltada en azul cuando pax === base_pax con badge "PRINCIPAL"
- Botón "+ Agregar tier" para añadir filas
- Cada fila con botón eliminar (excepto la del pax base)
- Validación: los pax deben ser únicos, ordenar automáticamente 
  ascendente, no permitir gaps grandes (si saltas de 8 a 12 sin 
  9-11, mostrar warning sutil)
- Inputs "Pax mínimo" y "Pax máximo" derivados automáticamente del 
  rango de tiers (no editables, solo display)
- Toggle "Incluye ITBIS 18%" (itbis_incluido: boolean)
- Bloque amarillo informativo: "Para grupos fuera del rango 
  {min_pax}-{max_pax}, el cliente verá un mensaje invitándolo a 
  solicitar cotización personalizada."

──── Modo "fixed_group" (Grupo cerrado) ────
- Input "Precio total del grupo (DOP)" + conversión USD/EUR
- Input "Pax máximo del grupo"
- Calculadora en vivo mostrando precio per cápita derivado

El bloque de depósito fijo amarillo (RD$1,000 p/p no reembolsable) 
se mantiene visible en TODOS los modos.

═══════════════════════════════════════════════════════
4. AGREGAR TOUR DE TRAVELHOOD A realData.ts
═══════════════════════════════════════════════════════

Agrega un nuevo tour al array TOURS_DATA con esta estructura, sin 
remover los tours existentes:

{
  id: "tour-travelhood-plan-1",
  slug: "travelhood-plan-1-rd-7-dias",
  titulo_es: "TravelHood Plan 1 — República Dominicana 7 días",
  titulo_en: "TravelHood Plan 1 — Dominican Republic 7 days",
  descripcion_es: "Recorrido completo por RD: Santo Domingo, Puerto 
   Plata, Río San Juan, Frontón, Las Terrenas y Sur Profundo + Bahía 
   de las Águilas. Donde lo inesperado se vuelve inolvidable.",
  descripcion_en: "Full DR experience: Santo Domingo, Puerto Plata, 
   Río San Juan, Frontón, Las Terrenas and Sur Profundo + Bahía de 
   las Águilas.",
  tipo: "multi_dia" as const,
  destinos_ids: ["dest-santo-domingo", "dest-puerto-plata", 
   "dest-rio-san-juan", "dest-samana", "dest-las-terrenas", 
   "dest-barahona", "dest-pedernales"],
  experiencias_ids: [], // se llenan desde itinerary
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
      { pax: 12, price_per_person: 35806 }
    ],
    min_pax: 6,
    max_pax: 12,
    itbis_incluido: true
  },
  itinerary: [
    {
      day_number: 1,
      title_es: "Día 1 — Santo Domingo",
      title_en: "Day 1 — Santo Domingo",
      description_es: "City Tour Zona Colonial",
      description_en: "Colonial Zone City Tour",
      destinos_ids: ["dest-santo-domingo"],
      experiencias_ids: [],
      incluye_text_es: "Transporte · Guía + Excursión · Entradas 
       (acceso a los destinos) · Impuestos",
      incluye_text_en: "Transport · Guide + Excursion · Admission · 
       Taxes",
      is_swappable: false,
      alternatives: []
    },
    {
      day_number: 2,
      title_es: "Día 2 — Puerto Plata",
      title_en: "Day 2 — Puerto Plata",
      description_es: "Charcos de Damajagua, Zipline y City Tour en 
       la ciudad más instagrameable.",
      description_en: "Damajagua waterfalls, zipline and city tour.",
      destinos_ids: ["dest-puerto-plata"],
      experiencias_ids: [],
      incluye_text_es: "Transporte · Guía + Excursión · Almuerzo · 
       Acceso a lockers · Ziplines · Guía City Tour Puerto Plata",
      incluye_text_en: "Transport · Guide + Excursion · Lunch · 
       Lockers · Ziplines · City Tour Guide",
      is_swappable: false,
      alternatives: []
    },
    {
      day_number: 3,
      title_es: "Día 3 — Río San Juan",
      title_en: "Day 3 — Río San Juan",
      description_es: "Calle Beler, recorrido en bote, Playa Grande, 
       Playa Los Minos, Laguna Gri-Gri.",
      description_en: "Beler street, boat tour, Playa Grande, Playa 
       Los Minos, Gri-Gri Lagoon.",
      destinos_ids: ["dest-rio-san-juan"],
      experiencias_ids: [],
      incluye_text_es: "Transporte · Guía local · Excursión Laguna 
       Gri Gri · Transporte marítimo",
      incluye_text_en: "Transport · Local guide · Gri Gri Lagoon 
       excursion · Maritime transport",
      is_swappable: false,
      alternatives: []
    },
    {
      day_number: 4,
      title_es: "Día 4 — Frontón",
      title_en: "Day 4 — Frontón",
      description_es: "Las casitas de colores, Playa Las Galeras, 
       Playa Madama, Cueva Taína, Playa Frontón, Playa Bonita.",
      description_en: "Colored houses, Las Galeras Beach, Madama 
       Beach, Taino Cave, Frontón Beach, Bonita Beach.",
      destinos_ids: ["dest-samana"],
      experiencias_ids: ["exp-playa-fronton", "exp-playa-madama", 
       "exp-playa-las-galeras"],
      incluye_text_es: "Transporte · Excursión · Transporte marítimo",
      incluye_text_en: "Transport · Excursion · Maritime transport",
      is_swappable: true,
      alternatives: [
        // El socio define las alternativas reales después
      ]
    },
    {
      day_number: 5,
      title_es: "Día 5 — Las Terrenas",
      title_en: "Day 5 — Las Terrenas",
      description_es: "Playa Las Terrenas, Playa Bonita y Salto de 
       Socoa.",
      description_en: "Las Terrenas Beach, Bonita Beach and Socoa 
       Waterfall.",
      destinos_ids: ["dest-las-terrenas"],
      experiencias_ids: [],
      incluye_text_es: "Transporte · Acceso a Salto de Socoa",
      incluye_text_en: "Transport · Salto de Socoa access",
      is_swappable: true,
      alternatives: []
    },
    {
      day_number: 6,
      title_es: "Día 6-7 — Sur Profundo + Bahía de las Águilas",
      title_en: "Day 6-7 — Sur Profundo + Bahía de las Águilas",
      description_es: "Playa y Río San Rafael, Patos de Barahona, 
       Mirador San Rafael, Pozos de Romeo / Playita del Amor, Bahía 
       de las Águilas.",
      description_en: "San Rafael Beach and River, Barahona Patos, 
       San Rafael viewpoint, Romeo Wells / Love Beach, Bahía de las 
       Águilas.",
      destinos_ids: ["dest-barahona", "dest-pedernales"],
      experiencias_ids: [],
      incluye_text_es: "Transporte · Transporte marítimo · Hospedaje 
       Glamping · Desayuno (día 2) · Impuestos Medio Ambiente",
      incluye_text_en: "Transport · Maritime transport · Glamping 
       accommodation · Breakfast (day 2) · Environmental taxes",
      is_swappable: false,
      alternatives: []
    }
  ],
  capacidad_max: 12,
  deposito_monto_fijo: 5000,
  included_services: [],
  details: {
    duracion: "7 días / 6 noches",
    idiomas: ["Español", "Inglés"],
    cuando_reservar: "Reservar con anticipación; salida programada 
     8-14 de marzo",
    tipo_bono: "electrónico",
    accesibilidad: "Requiere movilidad; varias caminatas y trayectos 
     en bote",
    mascotas_permitidas: false,
    edad_minima: null,
    dificultad: "Moderada",
    sostenibilidad_nota: "Usa protector solar Reef safe y respeta el 
     entorno natural."
  },
  galeria_ids: [],
  operador_id: "op-randomtrips",
  operador_nombre: "Random Trips",
  estado: "publicado" as const,
  logistica: {
    punto_salida: "Bon Plaza Paraíso, Av. Winston Churchill, Santo 
     Domingo",
    hora_salida: "Variable según itinerario del día",
    maps: "https://share.google/ic18n9Gy6v6j9NLjL"
  },
  grupo_whatsapp_url: null,
  categorias: ["Multi-destino", "Naturaleza & Aventura", "Cultural"],
  tags: ["7 días", "multi-destino", "agencias", "internacional"],
  pricing: "Desde RD$ 35,806/p",
  reservasActivas: 0,
  ultimaActualizacion: "Hoy",
  rating: null,
  totalReservas: 0,
  emoji: "🗺️",
  heroBg: "#DBEAFE"
}

Si los destinos "dest-santo-domingo", "dest-puerto-plata", 
"dest-rio-san-juan", "dest-las-terrenas", "dest-pedernales" no 
existen en DESTINATIONS, créalos como placeholders mínimos siguiendo 
el patrón de los existentes (id, slug, nombre_es, nombre_en, 
descripcion breve, lat/lng, status: "published", emoji, color).

═══════════════════════════════════════════════════════
5. AGREGAR SERVICIOS NUEVOS AL CATÁLOGO
═══════════════════════════════════════════════════════

Agrega estos servicios al array SERVICE_CATALOG (mantén los 
existentes):

{ id: "svc-lockers",            nombre_es: "Acceso a lockers",         nombre_en: "Lockers access",          icono: "🔐", categoria: "extras",       orden: 11 },
{ id: "svc-zipline",            nombre_es: "Ziplines",                  nombre_en: "Ziplines",                 icono: "🎢", categoria: "actividad",    orden: 12 },
{ id: "svc-transporte-mar",     nombre_es: "Transporte marítimo",       nombre_en: "Maritime transport",       icono: "⛵", categoria: "transporte",   orden: 13 },
{ id: "svc-glamping",           nombre_es: "Hospedaje glamping",        nombre_en: "Glamping accommodation",   icono: "⛺", categoria: "hospedaje",    orden: 14 },
{ id: "svc-desayuno",           nombre_es: "Desayuno",                  nombre_en: "Breakfast",                icono: "🍳", categoria: "alimentacion", orden: 15 },
{ id: "svc-impuestos-amb",      nombre_es: "Impuestos medio ambiente",  nombre_en: "Environmental taxes",      icono: "🌿", categoria: "impuestos",    orden: 16 },

═══════════════════════════════════════════════════════
6. UX: MENSAJE PARA PAX FUERA DE RANGO
═══════════════════════════════════════════════════════

En la calculadora en vivo del tab Pricing (modo tiered_per_pax), si 
el usuario pone una cantidad de personas FUERA del rango definido 
[min_pax, max_pax], reemplaza la card de total por un mensaje:

- Fondo amarillo claro #FFFBEB con borde #FDE68A
- Icono AlertTriangle
- Título: "Fuera del rango de capacidad"
- Texto: "Este paquete está disponible de {min_pax} a {max_pax} 
  personas. Para grupos diferentes, el cliente verá un mensaje 
  invitándolo a solicitar cotización personalizada."
- Mini-CTA visual (no funcional) "Ver mensaje al cliente →"

═══════════════════════════════════════════════════════

NO toques otros tabs, otras pantallas, ni componentes fuera de 
TourEditor / realData.ts / SERVICE_CATALOG / DESTINATIONS.