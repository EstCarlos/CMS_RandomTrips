# Task 02 — Refactor: naming to English (camelCase + bilingual objects)

> Pega esta tarea completa en Claude Code. Es un refactor grande pero 95% mecánico. Se ejecuta en sub-pasos con commit después de cada uno para mantener trazabilidad y permitir rollback.

## Context

Hoy el código mezcla español/inglés y snake_case/camelCase. Decisiones consolidadas:

1. **camelCase puro** para todos los identificadores (variables, properties, functions, enum values)
2. **Bilingual fields as nested objects**: `title: { es, en }` en vez de `title_es` / `title_en`
3. **Enum string literals también en inglés y camelCase**: `"fijo"` → `"singleDay"`, `"publicado"` → `"published"`, etc.

Conventions:
- Field names: `camelCase` (ej: `pricingModel`, `includedServices`)
- Type/Interface names: `PascalCase` (ej: `Tour`, `BookingStatus`)
- Enum string values: `camelCase` (ej: `"singleDay"`, `"pendingPayment"`)
- IDs (slugs): `kebab-case` se mantiene (ej: `dest-samana`, `tour-travelhood-plan-1`)
- ISO codes y términos técnicos locales se mantienen (`DOP`, `USD`, `EUR`, `ES`, `EN`, `itbis`, `rnc`)
- Content inside `{ es, en }` objects no se cambia (es contenido real del negocio)

---

## Complete field mapping

### Bilingual fields (refactor to nested object)

| Today | Tomorrow |
|---|---|
| `titulo_es`, `titulo_en` | `title: { es, en }` |
| `descripcion_es`, `descripcion_en` | `description: { es, en }` |
| `descripcion_corta_es`, `descripcion_corta_en` | `shortDescription: { es, en }` |
| `nombre_es`, `nombre_en` | `name: { es, en }` |
| `incluye_text_es`, `incluye_text_en` | `included: { es, en }` |
| `pregunta_es`, `pregunta_en` | `question: { es, en }` |
| `respuesta_es`, `respuesta_en` | `answer: { es, en }` |
| `contenido_es`, `contenido_en` | `content: { es, en }` |
| `alt_es`, `alt_en` | `alt: { es, en }` |

### Snake_case / Spanish fields → camelCase / English

**Top-level Tour fields:**

| Today | Tomorrow |
|---|---|
| `tipo` | `type` |
| `estado` | `status` |
| `destinos_ids` | `destinationIds` |
| `destinos_nombres` | (eliminar — derivar de `destinationIds` con lookup) |
| `experiencias_ids` | `experienceIds` |
| `pricing_model` | `pricingModel` |
| `capacidad_max` | `maxCapacity` |
| `deposito_monto_fijo` | `depositFixedAmount` |
| `deposito_porcentaje` | `depositPercentage` |
| `included_services` | `includedServices` |
| `galeria_ids` | `galleryIds` |
| `operador_id` | `operatorId` |
| `operador_nombre` | (eliminar — derivar de `operatorId` con lookup) |
| `logistica` | `logistics` |
| `grupo_whatsapp_url` | `whatsappGroupUrl` |
| `categorias` | `categories` |
| `pricing` (display string) | (eliminar — derivar de `pricingModel`) |
| `reservasActivas` | `activeBookings` |
| `totalReservas` | `totalBookings` |
| `ultimaActualizacion` | `lastUpdated` |
| `heroBg` | `heroBg` ✓ (sin cambio) |

**Tour.logistics nested:**

| Today | Tomorrow |
|---|---|
| `punto_salida` | `departurePoint` |
| `hora_salida` | `departureTime` |
| `maps` | `mapsUrl` |

**Tour.details nested:**

| Today | Tomorrow |
|---|---|
| `duracion` | `duration` |
| `idiomas` | `languages` |
| `cuando_reservar` | `bookingWindow` |
| `tipo_bono` | `voucherType` |
| `accesibilidad` | `accessibility` |
| `mascotas_permitidas` | `petsAllowed` |
| `edad_minima` | `minAge` |
| `dificultad` | `difficulty` |
| `sostenibilidad_nota` | `sustainabilityNote` |

**PricingModel nested fields:**

| Today | Tomorrow |
|---|---|
| `base_pax` | `basePax` |
| `base_price_per_person` | `basePricePerPerson` |
| `itbis_incluido` | `itbisIncluded` |
| `min_pax` | `minPax` |
| `max_pax` | `maxPax` |
| `price_per_person` | `pricePerPerson` |
| `total_price` | `totalPrice` |
| `currency` | `currency` ✓ |
| `tiers` | `tiers` ✓ |
| Tier: `{ pax, price_per_person }` | Tier: `{ pax, pricePerPerson }` |

**Day fields:**

| Today | Tomorrow |
|---|---|
| `day_number` | `dayNumber` |
| `destinos_ids` | `destinationIds` |
| `experiencias_ids` | `experienceIds` |
| `is_swappable` | `isSwappable` |
| `alternatives` | `alternatives` ✓ |

**DayAlternative:**

| Today | Tomorrow |
|---|---|
| `experiencia_id` | `experienceId` |
| `delta_dop` | `priceDelta` |

**Destination fields:**

| Today | Tomorrow |
|---|---|
| `numExperiencias` | `experienceCount` |
| `numTours` | `tourCount` |

**Experience fields:**

| Today | Tomorrow |
|---|---|
| `destination_id` | `destinationId` |
| `destinoPadre` | (eliminar — derivar de `destinationId` con lookup) |
| `tipo` | `type` |
| `duracion` | `duration` |

**ServiceCatalog item:**

| Today | Tomorrow |
|---|---|
| `nombre_es`, `nombre_en` | `name: { es, en }` |
| `icono` | `icon` |
| `categoria` | `category` |
| `orden` | `order` |

**IncludedService entry (in Tour.includedServices[]):**

| Today | Tomorrow |
|---|---|
| `service_id` | `serviceId` |
| `included` | `included` ✓ |
| `custom_note` | `customNote` |

**Availability:**

| Today | Tomorrow |
|---|---|
| `tour_id` | `tourId` |
| `fecha` | `date` |
| `cupos_totales` | `totalSeats` |
| `cupos_reservados` | `reservedSeats` |
| `cupos_libres` | `availableSeats` |
| `estado` | `status` |
| `precio_override` | `priceOverride` |

**Booking:**

| Today | Tomorrow |
|---|---|
| `customer_id` | `customerId` |
| `tour_id` | `tourId` |
| `fecha` | `date` |
| `pax_total` | `totalPax` |
| `pax_detalle` | `paxBreakdown` |
| `precio_total` | `totalPrice` |
| `moneda` | `currency` |
| `deposito_pagado` | `depositPaid` |
| `saldo_pendiente` | `outstandingBalance` |
| `estado` | `status` |
| `operador_id` | `operatorId` |
| `itinerary_config` | `itineraryConfig` |
| `notas_internas` | `internalNotes` |

**Payment:**

| Today | Tomorrow |
|---|---|
| `booking_id` | `bookingId` |
| `tipo` | `type` |
| `monto` | `amount` |
| `moneda` | `currency` |
| `paypal_txn_id` | `paypalTxnId` |
| `estado` | `status` |
| `fecha` | `date` |

**PaymentLink:**

| Today | Tomorrow |
|---|---|
| `booking_id` | `bookingId` |
| `monto` | `amount` |
| `moneda` | `currency` |
| `paypal_invoice_id` | `paypalInvoiceId` |
| `expira_en` | `expiresAt` |
| `estado` | `status` |
| `recordatorios` | `reminders` |

**Quote:**

| Today | Tomorrow |
|---|---|
| `contacto` | `contact` |
| `destinos_solicitados` | `requestedDestinationIds` |
| `fechas_solicitadas` | `requestedDates` |
| `pax` | `pax` ✓ |
| `presupuesto_aproximado` | `approximateBudget` |
| `mensaje` | `message` |
| `estado` | `status` |
| `precio_propuesto` | `proposedPrice` |
| `moneda` | `currency` |
| `link_pago_id` | `paymentLinkId` |
| `asignado_a` | `assignedToUserId` |
| `notas_staff` | `staffNotes` |
| `responded_at` | `respondedAt` |

**Customer:**

| Today | Tomorrow |
|---|---|
| `nombre` | `name` |
| `telefono` | `phone` |
| `pais` | `country` |
| `idioma_preferido` | `preferredLanguage` |
| `moneda_preferida` | `preferredCurrency` |
| `paypal_customer_id` | `paypalCustomerId` |

**Operator:**

| Today | Tomorrow |
|---|---|
| `tipo` | `type` |
| `nombre` | `name` |
| `contacto` | `contact` |
| `tours_asignados_ids` | `assignedTourIds` |
| `estado` | `status` |

**User (CMS):**

| Today | Tomorrow |
|---|---|
| `nombre` | `name` |
| `rol` | `role` |
| `operator_id` | `operatorId` |
| `permisos` | `permissions` |
| `ultimo_login` | `lastLogin` |
| `estado` | `status` |

**SiteConfig:**

| Today | Tomorrow |
|---|---|
| `contacto` | `contact` |
| `whatsapp_secundario` | `whatsappSecondary` |
| `redes` | `social` |
| `tasas_cambio` | `exchangeRates` |
| `actualizado_en` | `updatedAt` |
| `actualizado_por` | `updatedBy` |
| `punto_salida_default` | `defaultDeparturePoint` |
| `direccion` | `address` |
| `payment_info` | `paymentInfo` |
| `banco` | `bank` |
| `titular` | `accountHolder` |
| `tipo_cuenta` | `accountType` |
| `numero_cuenta` | `accountNumber` |
| `rnc` | `rnc` ✓ (local term) |
| `deposito_fijo_default` | `defaultFixedDeposit` |
| `nota_deposito` | `depositNote` |
| `builder_margin_multiplier` | (eliminar — ya no aplica con itinerary model) |

**MediaAsset:**

| Today | Tomorrow |
|---|---|
| `tipo` | `type` |
| `url`, `thumb_url` | `url`, `thumbUrl` |
| `asociacion` | `association` |
| `asociado_a` | `associatedTo` |
| `dimensiones` | `dimensions` |
| `peso` | `size` |

**Testimonial:**

| Today | Tomorrow |
|---|---|
| `cliente_nombre` | `customerName` |
| `tour_id` | `tourId` |
| `foto_url` | `photoUrl` |
| `fecha` | `date` |
| `aprobado` | `approved` |
| `orden` | `order` |

**FAQ:**

| Today | Tomorrow |
|---|---|
| `categoria` | `category` |
| `orden` | `order` |
| `estado` | `status` |

**Page:**

| Today | Tomorrow |
|---|---|
| `estado` | `status` |
| `seo_meta` | `seoMeta` |

**AuditLog:**

| Today | Tomorrow |
|---|---|
| `actor_id` | `actorId` |
| `accion` | `action` |
| `entidad` | `entity` |
| `entidad_id` | `entityId` |
| `antes` | `before` |
| `despues` | `after` |
| `user_agent` | `userAgent` |

---

## Enum value mapping

### Tour `type`
| Today | Tomorrow |
|---|---|
| `"fijo"` | `"singleDay"` |
| `"multi_dia"` | `"multiDay"` |
| `"privado"` | `"privateRequest"` |

### Tour `status`
| Today | Tomorrow |
|---|---|
| `"publicado"` | `"published"` |
| `"borrador"` | `"draft"` |
| `"archivado"` | `"archived"` |

### PricingModel `type`
| Today | Tomorrow |
|---|---|
| `"fixed_per_person"` | `"fixedPerPerson"` |
| `"tiered_per_pax"` | `"tieredPerPax"` |
| `"fixed_group"` | `"fixedGroup"` |

### Booking `status`
| Today | Tomorrow |
|---|---|
| `"pendiente_pago"` | `"pendingPayment"` |
| `"deposito_pagado"` | `"depositPaid"` |
| `"pagado_completo"` | `"fullyPaid"` |
| `"saldo_vencido"` | `"balanceOverdue"` |
| `"cancelada"` | `"cancelled"` |
| `"finalizada"` | `"completed"` |

### Payment `type`
| Today | Tomorrow |
|---|---|
| `"deposito"` | `"deposit"` |
| `"saldo"` | `"balance"` |
| `"reembolso"` | `"refund"` |

### PaymentLink `status`
| Today | Tomorrow |
|---|---|
| `"pendiente"` | `"pending"` |
| `"enviado"` | `"sent"` |
| `"pagado"` | `"paid"` |
| `"vencido"` | `"expired"` |

### Quote `status`
| Today | Tomorrow |
|---|---|
| `"pendiente"` | `"pending"` |
| `"enviada"` | `"sent"` |
| `"aceptada"` | `"accepted"` |
| `"rechazada"` | `"rejected"` |

### Operator `type`
| Today | Tomorrow |
|---|---|
| `"interno"` | `"internal"` |
| `"externo"` | `"external"` |

### User `role`
| Today | Tomorrow |
|---|---|
| `"admin"`, `"staff"` | ✓ sin cambio |
| `"operador"` | `"operator"` |

### Availability `status`
| Today | Tomorrow |
|---|---|
| `"abierto"` | `"open"` |
| `"bloqueado"` | `"blocked"` |
| `"completado"` | `"full"` |
| `"completado_finalizado"` | `"completed"` |

### Details `voucherType`
| Today | Tomorrow |
|---|---|
| `"electrónico"` | `"electronic"` |
| `"físico"` | `"physical"` |

### Details `difficulty`
| Today | Tomorrow |
|---|---|
| `"Baja"` | `"easy"` |
| `"Moderada"` | `"moderate"` |
| `"Moderada-Alta"` | `"moderateToHigh"` |
| `"Alta"` | `"high"` |

### ServiceCatalog `category`
| Today | Tomorrow |
|---|---|
| `"transporte"` | `"transportation"` |
| `"alimentacion"` | `"food"` |
| `"hospedaje"` | `"accommodation"` |
| `"guia"` | `"guide"` |
| `"seguridad"` | `"safety"` |
| `"impuestos"` | `"taxes"` |
| `"extras"` | `"extras"` ✓ |
| `"actividad"` | `"activity"` |

### MediaAsset `association`
| Today | Tomorrow |
|---|---|
| `"destino"` | `"destination"` |
| `"experiencia"` | `"experience"` |
| `"tour"` | `"tour"` ✓ |
| `"global"` | `"global"` ✓ |

### MediaAsset `type`
| Today | Tomorrow |
|---|---|
| `"foto"` | `"photo"` |
| `"video"` | `"video"` ✓ |

### Customer `preferredLanguage` / FAQ language codes
| Today | Tomorrow |
|---|---|
| `"ES"` | `"es"` (lowercase) |
| `"EN"` | `"en"` (lowercase) |

> Razón: dentro del modelo bilingüe usamos `{ es, en }` con keys lowercase. Consistencia.

---

## What does NOT change

1. **Content inside bilingual values** — los strings reales (ej: "Día 1 — Santo Domingo") quedan tal cual
2. **Existing IDs** — `dest-samana`, `exp-playa-fronton`, `tour-travelhood-plan-1`, `svc-transporte`, `op-randomtrips` siguen igual
3. **ISO codes** — `DOP`, `USD`, `EUR` (currencies)
4. **Local technical terms** — `itbis`, `rnc` (Dominican-specific)
5. **Real business strings** — "Bon Plaza Paraíso", "Banreservas", número de cuenta, RNC, números de teléfono, URLs — son datos del negocio, no se traducen
6. **shadcn UI primitives** en `src/app/components/ui/{accordion,dialog,button,...}.tsx` — no tocar
7. **CSS class names** y design tokens en `theme.css` — siguen igual
8. **Comments** en código — pueden quedarse en español, no es prioridad

---

## Execution plan — 6 sub-steps with commits

> Important: ejecutar en este orden. Después de cada sub-paso, correr `pnpm typecheck` y `pnpm build`. Si pasa, commit y siguiente. Si falla, arreglar antes de continuar.

### Sub-step 1 — Update CLAUDE.md and create types file

**Goal:** documentar la nueva convención antes de tocar código, y crear un archivo central de tipos.

1.1. Update `CLAUDE.md` section "Convenciones de código":
- Reemplazar la sección de naming. Nueva regla:
  - `camelCase` para todos los identifiers
  - `PascalCase` para Types/Interfaces
  - Bilingüe como objeto `{ es, en }`, NO sufijos
  - Enum string values en `camelCase`
  - IDs siguen siendo `kebab-case`
- Mencionar que el documento canónico del modelo es `docs/fase2_modelo_datos_v2.md` (próximamente v3 en inglés)

1.2. Crear `src/app/data/types.ts` con todas las interfaces y type unions del proyecto, derivadas del mapping de arriba:

```ts
// Bilingual primitive
export interface Bilingual {
  es: string;
  en: string;
}

// Enums
export type TourType   = "singleDay" | "multiDay" | "privateRequest";
export type TourStatus = "published" | "draft" | "archived";
export type PricingModelType = "fixedPerPerson" | "tieredPerPax" | "fixedGroup";
export type BookingStatus = "pendingPayment" | "depositPaid" | "fullyPaid" | "balanceOverdue" | "cancelled" | "completed";
export type PaymentType = "deposit" | "balance" | "refund";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type PaymentLinkStatus = "pending" | "sent" | "paid" | "expired";
export type QuoteStatus = "pending" | "sent" | "accepted" | "rejected";
export type OperatorType = "internal" | "external";
export type UserRole = "admin" | "staff" | "operator";
export type AvailabilityStatus = "open" | "blocked" | "full" | "completed";
export type VoucherType = "electronic" | "physical";
export type Difficulty = "easy" | "moderate" | "moderateToHigh" | "high";
export type ServiceCategory = "transportation" | "food" | "accommodation" | "guide" | "safety" | "taxes" | "extras" | "activity";
export type MediaAssetType = "photo" | "video";
export type MediaAssetAssociation = "destination" | "experience" | "tour" | "global";
export type Currency = "DOP" | "USD" | "EUR";
export type LanguageCode = "es" | "en";

// Core entities — definir Tour, Day, DayAlternative, Destination, Experience,
// ServiceCatalog, Availability, Booking, Payment, PaymentLink, Quote,
// Customer, Operator, User, MediaAsset, Testimonial, FAQ, Page, SiteConfig,
// AuditLog (usar el mapping de arriba para los campos)
```

Llena todas las interfaces con el mapping completo de campos. Mover los `interface` actuales de TourEditor.tsx a este archivo.

**Commit:**
```
chore(types): add central types file and update CLAUDE.md naming conventions
```

### Sub-step 2 — Refactor `realData.ts`

Esta es la fuente de datos. Refactorizarla primero asegura que TypeScript después detecte todos los usos en componentes.

2.1. Importar tipos desde `./types`:
```ts
import type { Tour, Destination, Experience, ServiceCatalogItem, ... } from "./types";
```

2.2. Aplicar a TODAS las constantes (DESTINATIONS, EXPERIENCES, SERVICE_CATALOG, TOURS_DATA, AVAILABILITY, BOOKINGS, CUSTOMERS, PAYMENTS, PAYMENT_LINKS, TESTIMONIALS, FAQS, PAGES_DATA, SITE_CONFIG, MEDIA_ASSETS, USERS_CMS, AUDIT_LOG si existe):

- Renombrar las keys según el mapping de arriba
- Consolidar `*_es` / `*_en` en objetos `{ es, en }`
- Cambiar enum string values
- Eliminar campos derivables (`destinos_nombres`, `destinoPadre`, `operador_nombre`, `pricing` display string) — se computan en runtime con helper functions

2.3. Agregar helper functions al final del archivo (o nuevo archivo `helpers.ts`):

```ts
export const findDestination = (id: string) => DESTINATIONS.find(d => d.id === id);
export const findExperience  = (id: string) => EXPERIENCES.find(e => e.id === id);
export const findOperator    = (id: string) => OPERATORS.find(o => o.id === id);
export const findTour        = (id: string) => TOURS_DATA.find(t => t.id === id);
export const findService     = (id: string) => SERVICE_CATALOG.find(s => s.id === id);

// For display
export const getDestinationName = (id: string, lang: LanguageCode = "es") =>
  findDestination(id)?.name[lang] ?? id;

export const getTourPriceDisplay = (tour: Tour): string => {
  const pm = tour.pricingModel;
  if (!pm) return "—";
  if (pm.type === "fixedPerPerson") return `RD$ ${pm.pricePerPerson.toLocaleString()}/p`;
  if (pm.type === "tieredPerPax")   return `Desde RD$ ${Math.min(...pm.tiers.map(t => t.pricePerPerson)).toLocaleString()}/p`;
  if (pm.type === "fixedGroup")     return `RD$ ${pm.totalPrice.toLocaleString()} grupo`;
  return "—";
};
```

2.4. Validar:
```bash
pnpm typecheck
```

**Esperar errores en componentes que aún usan los nombres viejos.** Eso es esperado — se arreglan en los siguientes sub-pasos. Hacer commit ahora con typecheck FAILING en componentes pero realData.ts y types.ts ya OK.

**Commit:**
```
refactor(data): rename realData fields to camelCase + bilingual objects + English enums

BREAKING: campos snake_case y bilingüe con sufijo eliminados. Componentes que
consumen estos datos deben actualizarse (próximos commits).
```

### Sub-step 3 — Refactor `BilingualField` component

`BilingualField` está en `src/app/components/ui/FormField.tsx`. Cambiar su API para que reciba un objeto `Bilingual` en vez de dos strings.

3.1. Cambiar signature:

```tsx
// BEFORE:
interface BilingualFieldProps {
  valueES: string;
  valueEN: string;
  onChangeES: (v: string) => void;
  onChangeEN: (v: string) => void;
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
}

// AFTER:
import type { Bilingual } from "@/app/data/types";
interface BilingualFieldProps {
  value: Bilingual;
  onChange: (v: Bilingual) => void;
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
  placeholderEn?: string;
}
```

3.2. Internamente el componente sigue mostrando tabs ES/EN, pero ahora maneja un único objeto:

```tsx
const setEs = (v: string) => onChange({ ...value, es: v });
const setEn = (v: string) => onChange({ ...value, en: v });

// En el input ES:  value={value.es}  onChange={e => setEs(e.target.value)}
// En el input EN:  value={value.en}  onChange={e => setEn(e.target.value)}
```

3.3. Verificar que el componente maneja `value` undefined gracefully (puede llegar undefined si el padre no inicializó):

```tsx
const safe: Bilingual = value ?? { es: "", en: "" };
```

**Commit:**
```
refactor(ui): BilingualField receives a Bilingual object instead of two strings
```

### Sub-step 4 — Refactor `TourEditor.tsx`

Es el archivo más complejo. Reemplazar TODAS las referencias a campos viejos por nuevos.

4.1. Quitar las `interface` locales que ahora vienen de `types.ts`. Importar:

```tsx
import type { Tour, Day, DayAlternative, TourType, TourStatus, PricingModelType } from "@/app/data/types";
import { DESTINATIONS, EXPERIENCES, SERVICE_CATALOG, findExperience, findDestination } from "@/app/data/realData";
```

4.2. Reemplazos por mapping (find & replace controlado):

- `tour.tipo` → `tour.type`
- `tour.estado` → `tour.status`
- `tour.titulo_es` → `tour.title.es`
- `tour.titulo_en` → `tour.title.en`
- (igual para `descripcion`, `nombre`, etc.)
- `tour.destinos_ids` → `tour.destinationIds`
- `tour.experiencias_ids` → `tour.experienceIds`
- `tour.pricing_model` → `tour.pricingModel`
- `pricingModel.base_pax` → `pricingModel.basePax`
- (etc. según el mapping completo)
- `day.is_swappable` → `day.isSwappable`
- `day.day_number` → `day.dayNumber`
- `day.title_es` → `day.title.es`
- `alt.experiencia_id` → `alt.experienceId`
- `alt.delta_dop` → `alt.priceDelta`
- Valores enum: `"fijo"` → `"singleDay"`, `"multi_dia"` → `"multiDay"`, etc.

4.3. Actualizar uso de `BilingualField`:

```tsx
// BEFORE:
<BilingualField
  valueES={day.title_es}
  valueEN={day.title_en}
  onChangeES={v => updateDay(day.id, { title_es: v })}
  onChangeEN={v => updateDay(day.id, { title_en: v })}
/>

// AFTER:
<BilingualField
  value={day.title}
  onChange={v => updateDay(day.id, { title: v })}
/>
```

4.4. Reemplazar lookups derivados que se eliminaron:

```tsx
// BEFORE: alt usaba exp.destinoPadre
const exp = EXPERIENCES.find(e => e.id === alt.experiencia_id);
// destinoPadre se eliminó — derivar:
const parentDest = exp ? findDestination(exp.destinationId) : null;
const parentDestName = parentDest?.name.es ?? "";
```

4.5. Validar:
```bash
pnpm typecheck
```

Iterar hasta que TourEditor.tsx no tenga errores.

**Commit:**
```
refactor(tour-editor): migrate to camelCase fields, bilingual objects, English enums
```

### Sub-step 5 — Refactor remaining pages

Aplicar los mismos reemplazos en todas las otras pantallas. En orden de complejidad:

1. **Dashboard.tsx** — usa `pricing`, `reservasActivas`, `totalReservas`, status badges con valores en español
2. **Tours.tsx** — listado con filtros por tipo/estado, columnas con `pricing`, `operadorNombre`
3. **Disponibilidad.tsx** — usa `cupos_totales`, `cupos_reservados`, `estado` de availability
4. **Reservas.tsx** + **ReservaDetalle.tsx** — usa muchos campos de Booking, Payment, Customer
5. **Cotizaciones.tsx** — usa campos de Quote
6. **Clientes.tsx** — usa campos de Customer
7. **Operadores.tsx** — usa campos de Operator
8. **Pagos.tsx** — usa Payment, PaymentLink
9. **Destinos.tsx, Experiencias.tsx** — usan Destination, Experience
10. **Galeria.tsx, FAQ.tsx, Testimonios.tsx, Paginas.tsx** — usan MediaAsset, FAQ, Testimonial, Page
11. **Configuracion.tsx** — usa SiteConfig (muchos campos)
12. **UsuariosCMS.tsx, LogsAuditoria.tsx** — usan User, AuditLog
13. **OperadorDashboard.tsx, MiPerfil.tsx** — vistas del operador

En cada archivo:
- Reemplazar campos según mapping
- Actualizar valores enum (especialmente en `StatusBadge` mappings y switch statements)
- Si usa `BilingualField`, actualizar uso
- Si renderiza nombres derivados, usar helpers (`findDestination(id).name.es`)

Hacer **un commit por página** o agrupando 2-3 páginas relacionadas. Mensaje sugerido:

```
refactor(pages): migrate <PageName> to new naming convention
```

Después de cada commit:
```bash
pnpm typecheck && pnpm build
```

### Sub-step 6 — Final cleanup and validation

6.1. Buscar referencias residuales con grep:

```bash
# Strings en español que NO deberían quedar como identifiers/values
grep -rn "titulo_\|descripcion_\|nombre_es\|nombre_en\|incluye_text\|is_swappable\|destinos_ids\|experiencias_ids\|day_number\|delta_dop\|experiencia_id\|pricing_model\|pricing_model\|capacidad_max\|deposito_monto\|grupo_whatsapp\|categorias\|operador_id\|operador_nombre\|reservasActivas\|totalReservas\|ultimaActualizacion\|cupos_\|saldo_pendiente\|deposito_pagado" src/ --include="*.ts" --include="*.tsx"

# Enum values en español que tampoco deberían quedar
grep -rn '"fijo"\|"multi_dia"\|"privado"\|"publicado"\|"borrador"\|"archivado"\|"pendiente_pago"\|"deposito_pagado"\|"saldo_vencido"\|"cancelada"\|"finalizada"\|"abierto"\|"bloqueado"\|"completado"' src/ --include="*.ts" --include="*.tsx"
```

Cualquier match debe analizarse: si es un identifier residual, renombrar; si es texto de UI mostrado al usuario en español, dejarlo (es UI copy, no naming convention).

6.2. Build final estricto:
```bash
pnpm typecheck
pnpm build
```

Ambos deben pasar sin errores ni warnings de tipos.

6.3. Validación visual con `pnpm dev`:

- [ ] Dashboard renderiza KPIs correctamente
- [ ] Tours listado muestra los tours con precio derivado
- [ ] Editar TravelHood: confirmar que itinerario, pricing tiered, detalles, logística se muestran sin errores
- [ ] Editar tour Playa Frontón: confirmar fixedPerPerson
- [ ] Reservas listado y detalle renderizan bien
- [ ] Disponibilidad calendar muestra fechas con status correctos
- [ ] Role switcher (admin/staff/operator) funciona
- [ ] Configuración muestra paymentInfo, exchangeRates, defaultDeparturePoint

**Commit final:**
```
refactor: complete naming migration to English camelCase + bilingual objects

Closes naming convention migration (task 02).
- All fields in camelCase
- Bilingual content as { es, en } nested objects
- Enum values in English camelCase
- Local terms preserved (itbis, rnc, ISO codes)
- Derived fields (destinoPadre, operadorNombre, pricing display) replaced by helpers
```

---

## Acceptance criteria

- [ ] `pnpm typecheck` pasa sin errores
- [ ] `pnpm build` pasa sin errores ni warnings de tipo
- [ ] No quedan campos `*_es` / `*_en` con sufijo (excepto si son IDs como `lang_es`)
- [ ] No quedan campos snake_case (excepto IDs con kebab-case)
- [ ] Todos los valores enum están en inglés camelCase
- [ ] `src/app/data/types.ts` existe y centraliza todos los tipos del modelo
- [ ] `BilingualField` recibe `value: Bilingual` y `onChange: (v: Bilingual) => void`
- [ ] `pnpm dev` levanta y todas las pantallas renderizan sin errors en consola
- [ ] Cargar TravelHood en TourEditor muestra todos los tabs correctamente
- [ ] Filtros y badges de status muestran labels correctos en la UI (los strings que ve el usuario pueden seguir en español, eso es UI copy y se maneja con i18n más adelante)

---

## Notes for Claude Code

- **Ejecutar sub-pasos en orden estricto.** No empezar el sub-paso 4 si el 3 no compila.
- **Hacer commits frecuentes** dentro de cada sub-paso si toca muchos archivos. Atómico = un cambio temático por commit.
- **Si encuentras un campo no listado en el mapping**, aplicar la regla general: snake_case → camelCase, español → inglés, sufijo bilingüe → objeto anidado. Si tienes duda sobre el nombre en inglés, agregar comentario `// TODO: confirmar naming` y avisar al usuario al final.
- **Mantener inline styles** y la paleta hardcoded. Este refactor es solo de naming, no de styling.
- **No introducir librerías nuevas**. El refactor es puro renombrado + reestructurado de objetos bilingüe.
- **Si un componente UI muestra strings en español al usuario** (ej: label "Estado: Publicado"), eso es UI copy y se queda en español por ahora. El refactor es del modelo de datos y de los identificadores en código.
- **Al terminar**, listar qué archivos se tocaron y avisar al usuario para que pruebe visualmente antes de mergear.
