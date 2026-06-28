# Tarea 01 — Tab Itinerario para tours multi_dia

> Pega esta tarea completa en Claude Code para arrancar la sesión.

## Contexto

El CMS soporta 3 tipos de tour: `fijo`, `multi_dia`, `privado_solicitud`. Hoy el `TourEditor` tiene el selector de tipo, pero el tipo `multi_dia` (paquetes de varios días con itinerario, opcionalmente con días que el cliente puede cambiar por alternativas) no tiene UI. Esta tarea agrega ese tab.

Lee primero `docs/fase2_modelo_datos_v2.md` secciones **§ 4 (Day)** y **§ 11 caso 3 (TravelHood)** para entender el modelo. Después aplica los cambios en orden.

## Cambios requeridos

### 1. Renombrar tipo `customizable` → `multi_dia`

**Archivo:** `src/app/components/pages/TourEditor.tsx`

En `TabInfo`, el selector de "Tipo de tour" tiene 3 radio cards. Cambia el id, ícono y descripción del intermedio:

```diff
- { id: "customizable", icon: "🔀", title: "Customizable", desc: "Itinerario con días swappeables" },
+ { id: "multi_dia",    icon: "🗓️", title: "Multi-día",   desc: "Paquete de varios días, con o sin opciones por día" },
```

Buscar todas las referencias a `customizable` en el código del proyecto y reemplazarlas por `multi_dia` (probablemente solo está en TourEditor pero verificar con grep).

### 2. Crear los destinos faltantes en `realData.ts`

**Archivo:** `src/app/data/realData.ts`

Agregar al array `DESTINATIONS` (sin remover los existentes) estos 5 destinos placeholders. Sigue el patrón visual de los existentes (emoji + color + lat/lng aproximados):

```ts
{
  id: "dest-santo-domingo", slug: "santo-domingo",
  nombre_es: "Santo Domingo", nombre_en: "Santo Domingo",
  descripcion_es: "Capital histórica de RD: Zona Colonial, Faro a Colón, Los Tres Ojos y patrimonio mundial UNESCO.",
  descripcion_en: "Historic capital of the DR: Colonial Zone, Columbus Lighthouse, Los Tres Ojos and UNESCO heritage.",
  lat: "18.4861", lng: "-69.9312",
  numExperiencias: 0, numTours: 1,
  status: "published" as const,
  emoji: "🏛️", color: "#FEF3C7",
},
{
  id: "dest-puerto-plata", slug: "puerto-plata",
  nombre_es: "Puerto Plata", nombre_en: "Puerto Plata",
  descripcion_es: "Costa norte con Charcos de Damajagua, zipline y la ciudad más instagrameable de RD.",
  descripcion_en: "North coast with Damajagua waterfalls, zipline and the most instagrammable city in the DR.",
  lat: "19.7934", lng: "-70.6884",
  numExperiencias: 0, numTours: 1,
  status: "published" as const,
  emoji: "📸", color: "#E0E7FF",
},
{
  id: "dest-rio-san-juan", slug: "rio-san-juan",
  nombre_es: "Río San Juan", nombre_en: "Río San Juan",
  descripcion_es: "Pueblo costero del noreste con Laguna Gri-Gri, manglares, Playa Grande y la Cara del Indio.",
  descripcion_en: "Northeast coastal town with Gri-Gri Lagoon, mangroves, Playa Grande and the Indian Face.",
  lat: "19.6275", lng: "-69.9128",
  numExperiencias: 0, numTours: 1,
  status: "published" as const,
  emoji: "🛶", color: "#CCFBF1",
},
{
  id: "dest-las-terrenas", slug: "las-terrenas",
  nombre_es: "Las Terrenas", nombre_en: "Las Terrenas",
  descripcion_es: "Pueblo costero bohemio en la península de Samaná con Playa Bonita y el Salto de Socoa.",
  descripcion_en: "Bohemian coastal town in the Samaná peninsula with Bonita Beach and Socoa Waterfall.",
  lat: "19.3092", lng: "-69.5417",
  numExperiencias: 0, numTours: 1,
  status: "published" as const,
  emoji: "🌅", color: "#FFE4E6",
},
{
  id: "dest-pedernales", slug: "pedernales",
  nombre_es: "Pedernales", nombre_en: "Pedernales",
  descripcion_es: "Sur profundo con Bahía de las Águilas, una de las playas más vírgenes del Caribe.",
  descripcion_en: "Deep south with Bahía de las Águilas, one of the most pristine beaches in the Caribbean.",
  lat: "17.9939", lng: "-71.7456",
  numExperiencias: 0, numTours: 1,
  status: "published" as const,
  emoji: "🦅", color: "#DBEAFE",
},
```

### 3. Agregar servicios nuevos al catálogo

**Archivo:** `src/app/data/realData.ts`

Agregar al final del array `SERVICE_CATALOG`:

```ts
{ id: "svc-lockers",        nombre_es: "Acceso a lockers",        nombre_en: "Lockers access",        icono: "🔐", categoria: "extras",       orden: 11 },
{ id: "svc-zipline",        nombre_es: "Ziplines",                 nombre_en: "Ziplines",              icono: "🎢", categoria: "actividad",    orden: 12 },
{ id: "svc-transporte-mar", nombre_es: "Transporte marítimo",      nombre_en: "Maritime transport",    icono: "⛵", categoria: "transporte",   orden: 13 },
{ id: "svc-glamping",       nombre_es: "Hospedaje glamping",       nombre_en: "Glamping accommodation",icono: "⛺", categoria: "hospedaje",    orden: 14 },
{ id: "svc-desayuno",       nombre_es: "Desayuno",                 nombre_en: "Breakfast",             icono: "🍳", categoria: "alimentacion", orden: 15 },
{ id: "svc-impuestos-amb",  nombre_es: "Impuestos medio ambiente", nombre_en: "Environmental taxes",   icono: "🌿", categoria: "impuestos",    orden: 16 },
```

### 4. Agregar el tour TravelHood al array `TOURS_DATA`

**Archivo:** `src/app/data/realData.ts`

Agregar este tour al final del array `TOURS_DATA`. Es el primer tour `multi_dia` del catálogo y sirve de referencia visual para validar el nuevo tab:

```ts
{
  id: "tour-travelhood-plan-1",
  slug: "travelhood-plan-1-rd-7-dias",
  titulo_es: "TravelHood Plan 1 — República Dominicana 7 días",
  titulo_en: "TravelHood Plan 1 — Dominican Republic 7 days",
  descripcion_es: "Recorrido completo por RD: Santo Domingo, Puerto Plata, Río San Juan, Frontón, Las Terrenas y Sur Profundo + Bahía de las Águilas. Donde lo inesperado se vuelve inolvidable.",
  descripcion_en: "Full DR experience: Santo Domingo, Puerto Plata, Río San Juan, Frontón, Las Terrenas and Sur Profundo + Bahía de las Águilas.",
  tipo: "multi_dia" as const,
  destinos_ids: ["dest-santo-domingo", "dest-puerto-plata", "dest-rio-san-juan", "dest-samana", "dest-las-terrenas", "dest-barahona", "dest-pedernales"],
  destinos_nombres: ["Santo Domingo", "Puerto Plata", "Río San Juan", "Samaná", "Las Terrenas", "Barahona", "Pedernales"],
  experiencias_ids: ["exp-playa-fronton", "exp-playa-madama", "exp-playa-las-galeras"],
  pricing_model: {
    type: "tiered_per_pax",
    base_pax: 10,
    base_price_per_person: 40344,
    currency: "DOP",
    itbis_incluido: true,
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
  },
  itinerary: [
    {
      day_number: 1,
      title_es: "Día 1 — Santo Domingo",
      title_en: "Day 1 — Santo Domingo",
      description_es: "City Tour Zona Colonial: Faro a Colón, Parque Los Tres Ojos, Catedral Primada, Fortaleza Ozama, Museo de las Casas Reales y Ciudad Nueva.",
      description_en: "Colonial Zone City Tour: Columbus Lighthouse, Los Tres Ojos, Primada Cathedral, Ozama Fortress, Casas Reales Museum and Ciudad Nueva.",
      destinos_ids: ["dest-santo-domingo"],
      experiencias_ids: [],
      incluye_text_es: "Transporte · Guía + Excursión · Entradas (acceso a los destinos) · Impuestos",
      incluye_text_en: "Transport · Guide + Excursion · Admission · Taxes",
      is_swappable: false,
      alternatives: [],
    },
    {
      day_number: 2,
      title_es: "Día 2 — Puerto Plata",
      title_en: "Day 2 — Puerto Plata",
      description_es: "Tour Charcos de Damajagua y Zipline. City Tour en la ciudad más instagrameable.",
      description_en: "Damajagua waterfalls and zipline. City tour in the most instagrammable town.",
      destinos_ids: ["dest-puerto-plata"],
      experiencias_ids: [],
      incluye_text_es: "Transporte · Guía + Excursión · Almuerzo · Acceso a lockers · Ziplines · Guía City Tour Puerto Plata",
      incluye_text_en: "Transport · Guide + Excursion · Lunch · Lockers · Ziplines · City Tour Guide",
      is_swappable: false,
      alternatives: [],
    },
    {
      day_number: 3,
      title_es: "Día 3 — Río San Juan",
      title_en: "Day 3 — Río San Juan",
      description_es: "Parador fotográfico, Calle Beler, recorrido en bote, Playa Grande, Playa Los Minos (atardecer), Tour Laguna Gri-Gri.",
      description_en: "Photo viewpoint, Beler Street, boat tour, Playa Grande, Playa Los Minos (sunset), Gri-Gri Lagoon Tour.",
      destinos_ids: ["dest-rio-san-juan"],
      experiencias_ids: [],
      incluye_text_es: "Transporte · Guía local · Excursión Laguna Gri Gri · Transporte marítimo",
      incluye_text_en: "Transport · Local guide · Gri Gri Lagoon excursion · Maritime transport",
      is_swappable: false,
      alternatives: [],
    },
    {
      day_number: 4,
      title_es: "Día 4 — Frontón",
      title_en: "Day 4 — Frontón",
      description_es: "Las casitas de colores, Playa Las Galeras, Playa Madama, Cueva Taína, Playa Frontón, Playa Bonita.",
      description_en: "Colored houses, Las Galeras Beach, Madama Beach, Taino Cave, Frontón Beach, Bonita Beach.",
      destinos_ids: ["dest-samana"],
      experiencias_ids: ["exp-playa-fronton", "exp-playa-madama", "exp-playa-las-galeras"],
      incluye_text_es: "Transporte · Excursión · Transporte marítimo",
      incluye_text_en: "Transport · Excursion · Maritime transport",
      is_swappable: true,
      alternatives: [],
    },
    {
      day_number: 5,
      title_es: "Día 5 — Las Terrenas",
      title_en: "Day 5 — Las Terrenas",
      description_es: "Playa Las Terrenas, Playa Bonita y Salto de Socoa.",
      description_en: "Las Terrenas Beach, Bonita Beach and Socoa Waterfall.",
      destinos_ids: ["dest-las-terrenas"],
      experiencias_ids: [],
      incluye_text_es: "Transporte · Acceso a Salto de Socoa",
      incluye_text_en: "Transport · Salto de Socoa access",
      is_swappable: true,
      alternatives: [],
    },
    {
      day_number: 6,
      title_es: "Día 6-7 — Sur Profundo + Bahía de las Águilas",
      title_en: "Day 6-7 — Sur Profundo + Bahía de las Águilas",
      description_es: "Día 1: Playa y Río San Rafael, Patos de Barahona, Mirador San Rafael, Arroyo Salado, Pozos de Romeo. Día 2: Playita del Amor, Bahía de las Águilas.",
      description_en: "Day 1: San Rafael Beach and River, Barahona Patos, San Rafael viewpoint, Salty Stream, Romeo Wells. Day 2: Love Beach, Bahía de las Águilas.",
      destinos_ids: ["dest-barahona", "dest-pedernales"],
      experiencias_ids: [],
      incluye_text_es: "Transporte · Transporte marítimo · Hospedaje Glamping · Desayuno (día 2) · Impuestos Medio Ambiente",
      incluye_text_en: "Transport · Maritime transport · Glamping accommodation · Breakfast (day 2) · Environmental taxes",
      is_swappable: false,
      alternatives: [],
    },
  ],
  capacidad_max: 12,
  deposito_monto_fijo: 5000,
  deposito_porcentaje: null,
  included_services: [],
  details: {
    duracion: "7 días / 6 noches",
    idiomas: ["Español", "Inglés"],
    cuando_reservar: "Reservar con anticipación. Salida programada: 8-14 de marzo.",
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
  rating: null,
  totalReservas: 0,
  emoji: "🗺️",
  heroBg: "#DBEAFE",
}
```

### 5. Agregar el tab "Itinerario" al TourEditor

**Archivo:** `src/app/components/pages/TourEditor.tsx`

#### 5.1 Agregar el tab a la lista

En el array `tabs` arriba del componente, insertar entre "destinos" y "servicios":

```ts
const tabs = [
  { id: "info",         label: "Información básica" },
  { id: "pricing",      label: "Pricing"            },
  { id: "experiencias", label: "Experiencias"        },
  { id: "destinos",     label: "Destinos"            },
  { id: "itinerario",   label: "Itinerario"          },  // ← NUEVO
  { id: "servicios",    label: "Servicios incluidos" },
  { id: "detalles",     label: "Detalles"            },
  { id: "logistica",    label: "Logística"           },
  { id: "galeria",      label: "Galería"             },
  { id: "seo",          label: "SEO"                 },
];
```

#### 5.2 Filtrar tabs según el tipo de tour

Dentro del componente `TourEditor`, antes del render, derivar la lista visible:

```tsx
const visibleTabs = tabs.filter(t => {
  if (t.id === "itinerario") return tour.tipo === "multi_dia";
  return true;
});
```

Y usar `visibleTabs` en lugar de `tabs` en el `.map()` de la barra de tabs.

#### 5.3 Crear `TabItinerario`

Agregar este componente nuevo. Sigue el mismo patrón visual de `TabExperiencias` (cards blancas con border, gap entre items, inline styles, paleta `#006CFE` para activo).

```tsx
/* ── Tab: Itinerario ──────────────────────────────────── */
function TabItinerario({ tour, onChange }: { tour: RealTour; onChange: (k: string, v: unknown) => void }) {
  type DayItem = NonNullable<RealTour["itinerary"]>[0];
  const itinerary: DayItem[] = (tour as any).itinerary ?? [];

  const updateDay = (idx: number, patch: Partial<DayItem>) => {
    const next = itinerary.map((d, i) => i === idx ? { ...d, ...patch } : d);
    onChange("itinerary", next);
  };

  const removeDay = (idx: number) => {
    const next = itinerary
      .filter((_, i) => i !== idx)
      .map((d, i) => ({ ...d, day_number: i + 1 }));
    onChange("itinerary", next);
  };

  const addDay = () => {
    const n = itinerary.length + 1;
    const newDay: DayItem = {
      day_number: n,
      title_es: `Día ${n}`,
      title_en: `Day ${n}`,
      description_es: "",
      description_en: "",
      destinos_ids: [],
      experiencias_ids: [],
      incluye_text_es: "",
      incluye_text_en: "",
      is_swappable: false,
      alternatives: [],
    };
    onChange("itinerary", [...itinerary, newDay]);
  };

  if (itinerary.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px 20px", background: "#F7F8FA", borderRadius: 8 }}>
        <div style={{ fontSize: 36, marginBottom: 8 }}>🗓️</div>
        <div style={{ fontSize: 14, color: "#475569", marginBottom: 12 }}>Aún no hay días en el itinerario</div>
        <Btn variant="primary" onClick={addDay}><Plus size={13} /> Agregar primer día</Btn>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {itinerary.map((day, idx) => (
        <DayCard
          key={`day-${idx}`}
          day={day}
          index={idx}
          onUpdate={patch => updateDay(idx, patch)}
          onRemove={() => removeDay(idx)}
        />
      ))}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
        <Btn variant="secondary" onClick={addDay}><Plus size={13} /> Agregar día</Btn>
        <span style={{ fontSize: 12, color: "#94A3B8" }}>Itinerario de {itinerary.length} día{itinerary.length === 1 ? "" : "s"}</span>
      </div>
    </div>
  );
}

/* ── DayCard helper ───────────────────────────────────── */
function DayCard({ day, index, onUpdate, onRemove }: {
  day: any; index: number;
  onUpdate: (patch: any) => void;
  onRemove: () => void;
}) {
  const updateAlt = (altIdx: number, patch: any) => {
    const next = day.alternatives.map((a: any, i: number) => i === altIdx ? { ...a, ...patch } : a);
    onUpdate({ alternatives: next });
  };
  const removeAlt = (altIdx: number) => {
    onUpdate({ alternatives: day.alternatives.filter((_: any, i: number) => i !== altIdx) });
  };
  const addAlt = () => {
    const firstAvail = EXPERIENCES.find(e => e.id !== day.default_experience_id && !day.alternatives.some((a: any) => a.experience_id === e.id));
    if (!firstAvail) return;
    onUpdate({ alternatives: [...day.alternatives, { experience_id: firstAvail.id, price_delta_per_person: 0 }] });
  };

  return (
    <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, padding: 16 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <GripVertical size={14} color="#CBD5E1" />
        <span style={{ width: 28, height: 28, borderRadius: "50%", background: "#EFF6FF", color: "#006CFE", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {day.day_number}
        </span>
        <div style={{ flex: 1, fontSize: 14, fontWeight: 600, color: "#0F172A" }}>Día {day.day_number}</div>
        <button onClick={onRemove} style={{ border: "none", background: "transparent", cursor: "pointer" }}>
          <Trash2 size={14} color="#94A3B8" />
        </button>
      </div>

      {/* Body */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <FormField label="Título del día">
          <BilingualField
            valueES={day.title_es}
            valueEN={day.title_en}
            onChangeES={v => onUpdate({ title_es: v })}
            onChangeEN={v => onUpdate({ title_en: v })}
            placeholder="Día 1 — Santo Domingo"
          />
        </FormField>

        <FormField label="Descripción del día">
          <BilingualField
            valueES={day.description_es}
            valueEN={day.description_en}
            onChangeES={v => onUpdate({ description_es: v })}
            onChangeEN={v => onUpdate({ description_en: v })}
            multiline
            rows={3}
            placeholder="Qué se vive este día..."
          />
        </FormField>

        <FormField label="Destinos visitados">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {DESTINATIONS.map(d => {
              const isSel = day.destinos_ids.includes(d.id);
              return (
                <button key={d.id}
                  onClick={() => onUpdate({ destinos_ids: isSel ? day.destinos_ids.filter((x: string) => x !== d.id) : [...day.destinos_ids, d.id] })}
                  style={{ padding: "4px 10px", borderRadius: 16, border: `1px solid ${isSel ? "#006CFE" : "#E5E7EB"}`, background: isSel ? "#EFF6FF" : "#FFFFFF", fontSize: 12, color: isSel ? "#006CFE" : "#475569", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <span>{d.emoji}</span> {d.nombre_es}
                </button>
              );
            })}
          </div>
        </FormField>

        <FormField label="Incluye (texto libre)" helper="Lista los servicios separados por · o saltos de línea. Se muestra tal cual en la web pública.">
          <BilingualField
            valueES={day.incluye_text_es}
            valueEN={day.incluye_text_en}
            onChangeES={v => onUpdate({ incluye_text_es: v })}
            onChangeEN={v => onUpdate({ incluye_text_en: v })}
            multiline
            rows={2}
            placeholder="Transporte · Guía + Excursión · Entradas · Impuestos"
          />
        </FormField>

        {/* Toggle is_swappable */}
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#0F172A", display: "block", marginBottom: 6 }}>
            ¿Cliente puede cambiar este día?
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={() => onUpdate({ is_swappable: !day.is_swappable })}
              style={{ width: 38, height: 22, borderRadius: 11, background: day.is_swappable ? "#006CFE" : "#CBD5E1", border: "none", cursor: "pointer", position: "relative", transition: "background 0.2s" }}>
              <span style={{ position: "absolute", top: 3, left: day.is_swappable ? 19 : 3, width: 16, height: 16, borderRadius: "50%", background: "#FFFFFF", transition: "left 0.2s" }} />
            </button>
            <span style={{ fontSize: 12, color: "#475569" }}>
              {day.is_swappable ? "Sí — el cliente puede elegir entre las alternativas listadas abajo" : "No — día fijo dentro del itinerario"}
            </span>
          </div>
        </div>

        {/* Alternativas */}
        {day.is_swappable && (
          <div style={{ background: "#F7F8FA", borderRadius: 6, padding: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#0F172A", marginBottom: 8 }}>Alternativas permitidas</div>
            {day.alternatives.length === 0 && (
              <div style={{ fontSize: 12, color: "#94A3B8", padding: "8px 0", textAlign: "center" }}>
                Sin alternativas aún. El día se mostrará swappeable pero no habrá opciones para el cliente.
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {day.alternatives.map((alt: any, ai: number) => {
                const exp = EXPERIENCES.find(e => e.id === alt.experience_id);
                return (
                  <div key={`alt-${ai}`} style={{ display: "flex", alignItems: "center", gap: 10, padding: 10, background: "#FFFFFF", borderRadius: 6, border: "1px solid #E5E7EB" }}>
                    <select value={alt.experience_id}
                      onChange={e => updateAlt(ai, { experience_id: e.target.value })}
                      style={{ flex: 1, padding: "4px 8px", border: "1px solid #E5E7EB", borderRadius: 4, fontSize: 12 }}>
                      {EXPERIENCES.map(e => (
                        <option key={e.id} value={e.id}>{e.nombre_es} ({e.destinoPadre})</option>
                      ))}
                    </select>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#475569" }}>
                      <span>Delta:</span>
                      <span>RD$</span>
                      <input type="number" value={alt.price_delta_per_person}
                        onChange={e => updateAlt(ai, { price_delta_per_person: Number(e.target.value) })}
                        style={{ width: 70, padding: "4px 6px", border: "1px solid #E5E7EB", borderRadius: 4, fontSize: 12, fontVariantNumeric: "tabular-nums" }} />
                      <span>/p</span>
                    </div>
                    <button onClick={() => removeAlt(ai)} style={{ border: "none", background: "transparent", cursor: "pointer" }}>
                      <X size={13} color="#94A3B8" />
                    </button>
                  </div>
                );
              })}
            </div>
            <button onClick={addAlt}
              style={{ marginTop: 10, display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 16, border: "1px dashed #CBD5E1", background: "transparent", fontSize: 12, color: "#475569", cursor: "pointer" }}>
              <Plus size={11} /> Agregar alternativa
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
```

#### 5.4 Registrar el tab en el render

En el bloque condicional `{activeTab === ...}` del cuerpo del editor, agregar:

```tsx
{activeTab === "itinerario" && <TabItinerario tour={tour} onChange={onChange} />}
```

## Criterios de aceptación

- [ ] El selector de tipo muestra "Multi-día" en lugar de "Customizable"
- [ ] El tab "Itinerario" aparece solo cuando `tour.tipo === "multi_dia"`
- [ ] Cargando el tour TravelHood (`tour-travelhood-plan-1`), el tab muestra los 6 días con sus títulos, descripciones, destinos visitados e incluye_text
- [ ] El día 4 y día 5 tienen el toggle "swappeable" en ON; los demás en OFF
- [ ] Se puede agregar un nuevo día con "+ Agregar día"
- [ ] Se puede eliminar un día y los `day_number` se reordenan
- [ ] Al activar `is_swappable` en un día, se muestra la sección de alternativas con "+ Agregar alternativa"
- [ ] Al desactivar `is_swappable`, las alternativas quedan ocultas pero no se pierden
- [ ] Se puede editar el price_delta de una alternativa
- [ ] El proyecto compila sin errores TypeScript: `pnpm build` debe pasar

## Validación visual

```bash
pnpm dev
# 1. Ir a Tours → editar "TravelHood Plan 1"
# 2. Confirmar que "Itinerario" aparece en la barra de tabs
# 3. Click en "Itinerario" → ver 6 días renderizados
# 4. Click en "Información básica" → cambiar tipo a "Fijo"
# 5. Confirmar que el tab "Itinerario" desaparece de la barra
# 6. Volver a "Multi-día" → tab reaparece
# 7. Click en día 4 (swappeable) → confirmar sección de alternativas vacía con CTA
# 8. Agregar 2 alternativas, asignar deltas distintos, eliminar una
```

## Commit sugerido

```bash
git add -A
git commit -m "feat(tour-editor): agrega tab Itinerario para tours multi_dia

- Renombra tipo customizable → multi_dia en TabInfo
- Agrega destinos placeholders: Santo Domingo, Puerto Plata, Río San Juan, Las Terrenas, Pedernales
- Expande SERVICE_CATALOG con lockers, zipline, transporte_mar, glamping, desayuno, impuestos_amb
- Crea tour TravelHood Plan 1 con itinerario de 6 días y pricing tiered_per_pax
- Implementa TabItinerario con DayCard, swap toggle y editor de alternativas
- Tab Itinerario se oculta cuando tipo !== multi_dia

Refs: docs/fase2_modelo_datos_v2.md §4 y §11"

git push -u origin feature/itinerario-multidia
```

## Notas para Claude Code

- Mantén inline styles, no introduzcas Tailwind classes en TourEditor
- No toques los componentes shadcn de `src/app/components/ui/`
- Si encuentras errores de tipo al agregar `itinerary` al tour, ajusta el tipo `RealTour` o usa `any` puntualmente — refactor de tipos viene en sub-bloque posterior
- Cuando termines, avisa al usuario para que valide visualmente antes de pushear
