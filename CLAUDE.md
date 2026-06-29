# Random Trips CMS
 
Panel de administración interno de Random Trips, agencia de tours en República Dominicana. Genera y gestiona destinos, experiencias, tours, disponibilidad, reservas, pagos y contenido del sitio público. Lo usa staff de Random Trips y operadores externos con vista limitada.
 
## Stack
 
- **Vite + React 18 + TypeScript** (SPA, no Next.js)
- **shadcn/ui + Radix** como base de componentes (47 componentes en `src/app/components/ui/`)
- **Tailwind CSS** (configurado pero el código usa principalmente inline styles — patrón heredado de Figma Make)
- **lucide-react** para iconos
- **recharts** para gráficos
- **sonner** para toasts
- **pnpm** como package manager
## Estructura del proyecto
 
```
src/
├── app/
│   ├── App.tsx                      # Root con estado de página, rol, editor
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx          # Nav lateral con rol admin/staff/operator
│   │   │   └── TopBar.tsx           # Header con título y breadcrumbs
│   │   ├── ui/
│   │   │   ├── DataTable.tsx        # Tabla reutilizable con sort/page/select
│   │   │   ├── FilterBar.tsx
│   │   │   ├── FormField.tsx        # FormField + BilingualField + Input + Textarea + SelectField
│   │   │   ├── KPICard.tsx
│   │   │   ├── Modal.tsx            # Modal + Btn (button con variants)
│   │   │   ├── StatusBadge.tsx
│   │   │   └── [shadcn primitives]  # accordion, dialog, button, etc.
│   │   └── pages/
│   │       ├── Dashboard.tsx
│   │       ├── TourEditor.tsx       # ⚠️ Pantalla más compleja del CMS (10 tabs)
│   │       ├── Tours.tsx, Destinos.tsx, Experiencias.tsx
│   │       ├── Disponibilidad.tsx   # Calendario maestro con drawer
│   │       ├── Reservas.tsx, ReservaDetalle.tsx, Cotizaciones.tsx
│   │       ├── Clientes.tsx, Operadores.tsx, Pagos.tsx
│   │       ├── Galeria.tsx, FAQ.tsx, Testimonios.tsx, Paginas.tsx
│   │       ├── Configuracion.tsx, UsuariosCMS.tsx, LogsAuditoria.tsx
│   │       ├── OperadorDashboard.tsx, MiPerfil.tsx
│   │       └── StubPage.tsx
│   └── data/
│       ├── types.ts                 # Interfaces y union types centrales (fuente de verdad del modelo)
│       └── realData.ts              # Tours/destinos REALES + dummy data para reservas/pagos
└── styles/
    └── theme.css                    # CSS vars (genéricas shadcn — paleta RT está hardcoded inline)
```
 
## Convenciones de código
 
### Naming (post refactor tarea 02)
 
- **Todos los identificadores en `camelCase`** — sin snake_case en nombres de variables o propiedades
- **Tipos e interfaces en `PascalCase`** — `Tour`, `Booking`, `PricingModel`, etc.
- **Valores de enum en `camelCase`** — `"singleDay"`, `"published"`, `"pendingPayment"`, etc.
- **IDs en `kebab-case`** — `"dest-samana"`, `"tour-playa-fronton"` (no cambian)
- **ISO codes y términos locales se preservan** — `DOP`, `USD`, `EUR`, `itbis`, `rnc`
- **Archivo central de tipos:** `src/app/data/types.ts` — importar desde ahí, **nunca** redefinir interfaces locales en páginas
### Bilingüe
 
- Todos los campos de contenido con variante de idioma se modelan como **objeto anidado** `{ es: string; en: string }`
  - Ejemplo: `title: { es: "Playa Frontón", en: "Frontón Beach" }` (NO `titleEs` + `titleEn`)
- El tipo primitivo es `Bilingual` (importar de `src/app/data/types.ts`)
- El componente `BilingualField` (en `FormField.tsx`) recibe `value: Bilingual` y `onChange: (v: Bilingual) => void`
- Si un campo solo tiene contenido en `es` por ahora, inicializar `en: ""` igualmente
### Estilos
 
- **Inline styles en todo el código de pantallas y componentes custom.** No usar Tailwind classes en pantallas.
- Los shadcn primitives (`src/app/components/ui/{button,dialog,...}.tsx`) sí usan Tailwind — no tocarlos.
- Paleta Random Trips (siempre hardcoded inline):
  - Primary acción: `#006CFE` (azul eléctrico)
  - Destructivo / acentos rojos: `#F13540` (rojo coral)
  - Warning / amarillo: `#FEDA40` (con texto oscuro)
  - Success: `#16A34A`
  - Neutros: `#0F172A` (text), `#475569`, `#94A3B8`, `#E5E7EB` (border), `#F7F8FA` (background)
- Border radius: 6-8px en componentes UI, 8px en cards
- Tipografía: `Inter, sans-serif` en el CMS
### Helpers en realData.ts
 
```ts
formatDOP(n)           // → "RD$ 3,500"
dopToUSD(n)            // → "58.45"
dopToEUR(n)            // → "54.25"
getTourPriceDisplay(t) // → "RD$ 3,500/p" | "Desde RD$ 35,806/p" | "RD$ 25,000 grupo"
findDestination(id)    // → Destination | undefined
findExperience(id)     // → Experience | undefined
findTour(id)           // → Tour | undefined
findService(id)        // → ServiceCatalogItem | undefined
findOperator(id)       // → Operator | undefined
getDestinationName(id, lang) // → string
```
 
## Modelo de datos — fuente de verdad
 
**El documento canónico es `docs/fase2_modelo_datos_v2.md`** — léelo antes de hacer cambios estructurales al modelo.
 
### Tipos centrales (`src/app/data/types.ts`)
 
**Enums:**
- `TourType`: `"singleDay"` | `"multiDay"` | `"privateRequest"`
- `TourStatus`: `"published"` | `"draft"` | `"archived"`
- `PricingModelType`: `"fixedPerPerson"` | `"tieredPerPax"` | `"fixedGroup"`
- `BookingStatus`: `"pendingPayment"` | `"depositPaid"` | `"fullyPaid"` | `"balanceOverdue"` | `"cancelled"` | `"completed"`
- `PaymentType`: `"deposit"` | `"balance"` | `"refund"`
- `QuoteStatus`: `"pending"` | `"sent"` | `"accepted"` | `"rejected"`
- `UserRole`: `"admin"` | `"staff"` | `"operator"`
- `AvailabilityStatus`: `"open"` | `"blocked"` | `"full"` | `"completed"`
**Interfaces (26 total):**
`Bilingual`, `Tier`, `PricingModel`, `SeoMeta`, `DayAlternative`, `Day`, `TourDetails`, `TourLogistics`, `IncludedService`, `Tour`, `Destination`, `Experience`, `ServiceCatalogItem`, `Availability`, `Booking`, `Payment`, `PaymentLink`, `Quote`, `Customer`, `Operator`, `CmsUser`, `MediaAsset`, `Testimonial`, `FAQ`, `Page`, `SiteConfig`, `AuditLog`
 
### Decisiones clave del modelo
 
1. **Tipos de tour:** `"singleDay"` | `"multiDay"` | `"privateRequest"`
2. **Pricing tiered** es por **pax exacto** (no por rangos), con concepto de `basePax`
3. **Depósito** = monto fijo no reembolsable (default RD$1,000/pax), no porcentaje
4. **Tours `multiDay`** tienen `itinerary: Day[]`. Cada Day puede ser `isSwappable`
5. **Swaps** usan curaduría implícita del staff (sin motor cross-día)
6. **Servicios incluidos por día** = texto libre `included: { es, en }`, no estructurado
7. **Cliente fuera del rango de pax** → bloqueo de reserva + invitación a cotización custom
8. **Moneda base:** DOP. USD y EUR derivadas de tasas en `SiteConfig.exchangeRates`
### Data en realData.ts
 
**Datos REALES del negocio (no inventar ni modificar nombres):**
- `DESTINATIONS` — 12 destinos: Samaná, Constanza, Jarabacoa, Bayahibe, Barahona, Santo Domingo, Puerto Plata, Río San Juan, Las Terrenas, Pedernales, Punta Cana, Santiago
- `EXPERIENCES` — experiencias reales asociadas 1:N a destinos
- `TOURS_DATA` — tours reales incluyendo TravelHood Plan 1 (multiDay con tieredPerPax)
- `SERVICE_CATALOG` — 16 servicios (transporte, alimentación, hospedaje, guía, seguridad, impuestos, extras, actividad)
- `SITE_CONFIG` — contacto, redes, tasas de cambio, punto de salida default, paymentInfo
- `PAGES_DATA` — páginas estáticas (Sobre nosotros, Políticas, etc.)
**Datos dummy (para visualización):**
- `AVAILABILITY`, `BOOKINGS`, `CUSTOMERS`, `PAYMENTS`, `PAYMENT_LINKS`, `TESTIMONIALS`
**Datos funcionales agregados en tareas 01-03:**
- `OPERATORS` — 4 entries (1 interno Random Trips, 3 externos)
- `MEDIA_ASSETS` — 18 entries placeholder con emoji/color
**Datos con mock local pendientes de migrar a realData.ts (tarea 04):**
- `Cotizaciones.tsx` → `mockCots` (debe migrar a `QUOTES`)
- `UsuariosCMS.tsx` → `mockUsers` (debe migrar a `CMS_USERS`)
- `LogsAuditoria.tsx` → `mockLogs` (debe migrar a `AUDIT_LOGS`)
- `FAQ.tsx` → `mockFAQ` (debe migrar a `FAQS`)
## TourEditor — referencia rápida de tabs
 
El TourEditor tiene 10 tabs. El tab "Itinerario" solo aparece cuando `tour.type === "multiDay"`:
 
| Tab | Componente | Estado |
|---|---|---|
| Información básica | `TabInfo` | ✅ Funcional |
| Pricing | `TabPricing` | ✅ 3 modos (fixedPerPerson, tieredPerPax, fixedGroup) con calculadora en vivo |
| Experiencias | `TabExperiencias` | ✅ Funcional |
| Destinos | `TabDestinos` | ✅ Funcional |
| Itinerario | `TabItinerario` | ✅ Timeline de días con swappeable toggle y alternativas |
| Servicios incluidos | `TabServicios` | ✅ Funcional |
| Detalles | `TabDetalles` | ✅ Funcional |
| Logística | `TabLogistica` | ✅ Con selector de operador + contact card |
| Galería | `TabGaleria` | ✅ Add/remove/reorder/set-primary desde MEDIA_ASSETS |
| SEO | `TabSEO` | ✅ BilingualField con char counters + Google preview + OG image picker |
 
## Roadmap actual
 
Estamos en **Frente 1 — Cerrar UI gaps del CMS**. Sub-bloques:
 
- [x] **01 — Tab Itinerario para tours multiDay** (`docs/tareas/01-itinerario-multidia.md`)
- [x] **02 — Refactor naming to English** — camelCase + bilingual objects `{ es, en }` + English enums (`docs/tareas/02-refactor-naming-to-english.md`)
- [x] **03 — Handlers vacíos del TourEditor** — SEO, galería, operador selector (`docs/tareas/03-empty-handlers.md`)
- [x] **04 — Data placeholder faltante** — Quotes, CMS Users, AuditLog, FAQ → centralizar en realData.ts (`docs/tareas/04-missing-placeholder-data.md`)
- [x] **05 — Auditoría de páginas stub** — revisar cada página, completar las incompletas
- [] **06 — Pasada de simplificación UX** — revisar flujos desde óptica del socio no-técnico
- [x] **07 — Calculadora de cotización** — desglose de costos variables + margen en el flujo de Cotizaciones (`docs/tareas/07-quote-calculator.md`)
Después de cerrar Frente 1 sigue **Fase 4 — Arquitectura backend** (AWS Serverless + DynamoDB + API contracts + PayPal + Cognito + costos).
 
## Qué NO tocar
 
- Los archivos shadcn en `src/app/components/ui/{button,dialog,...}.tsx` — no modificar
- `App.tsx` — no necesita refactor estructural, solo agregar tipos si es necesario
- No introducir React Router, Redux ni librerías de routing/state global (se decidirá en Fase 4)
- No migrar inline styles a Tailwind classes todavía — es un sub-bloque futuro
- No cambiar IDs existentes (`dest-samana`, `tour-playa-fronton`, etc.)
- No inventar destinos, experiencias o tours — los datos del catálogo son reales
## Commits
 
Un sub-bloque del roadmap = una rama feature + uno o varios commits semánticos:
 
```bash
git checkout -b feature/migrate-mock-data
# trabajar...
git add -A
git commit -m "feat(data): centralize Quotes, CMS Users, AuditLogs, FAQs in realData.ts"
git push -u origin feature/migrate-mock-data
```
 
Formato conventional commits (`feat:`, `fix:`, `refactor:`, `docs:`, `chore:`).
 
## Validación
 
Antes de pushear:
 
```bash
pnpm typecheck   # tsc --noEmit, debe pasar sin errores
pnpm build        # tsc + vite build, debe pasar
pnpm dev          # validar visualmente en localhost:5173
```
 
Validación visual mínima:
- Dashboard → KPIs renderizan
- Tours → listado con precios derivados
- Editar TravelHood → todos los tabs sin errores
- Editar Playa Frontón → fixedPerPerson funcional
- Role switcher (admin/staff/operator) → vistas diferenciadas
 