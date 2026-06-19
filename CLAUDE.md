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
│   │       ├── TourEditor.tsx       # ⚠️ Pantalla más compleja del CMS
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
│       └── realData.ts              # Tours/destinos REALES + dummy data para reservas/cotizaciones
└── styles/
    └── theme.css                    # CSS vars (genéricas shadcn — paleta RT está hardcoded inline)
```

## Convenciones de código

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
- Tipografía: `Inter, sans-serif` en el CMS (la paleta de marcas full solo aplica en la web pública)

### Naming
- Componentes en `PascalCase`. Archivos `.tsx` con mismo nombre del componente exportado
- Tabs internas en TourEditor exportan como `TabInfo`, `TabPricing`, etc.
- **Todos los identificadores en `camelCase`** — sin snake_case en nombres de variables o propiedades
- **Tipos e interfaces en `PascalCase`** — `Tour`, `Booking`, `PricingModel`, etc.
- **Valores de enum en `camelCase`** — `"singleDay"`, `"published"`, `"pendingPayment"`, etc.
- **IDs en `kebab-case`** — `"dest-samana"`, `"tour-playa-fronton"` (no cambian)
- **ISO codes y términos locales se preservan** — `DOP`, `USD`, `EUR`, `itbis`, `rnc`
- Funciones helper en `realData.ts`: `formatDOP`, `dopToUSD`, `dopToEUR`, `getTourPriceDisplay`, `findDestination`, `findExperience`
- **Archivo central de tipos:** `src/app/data/types.ts` — importar desde ahí, nunca redefinir interfaces locales

### Bilingüe
- Todos los campos de contenido con variante de idioma se modelan como **objeto anidado** `{ es: string; en: string }`
  - Ejemplo: `title: { es: "Playa Frontón", en: "Playa Frontón" }` (NO `titulo_es` + `titulo_en`)
- El tipo primitivo es `Bilingual` (importar de `src/app/data/types.ts`)
- El componente `BilingualField` (en `FormField.tsx`) recibe `value: Bilingual` y `onChange: (v: Bilingual) => void`
- Si un campo solo tiene contenido en `es` por ahora, inicializar `en: ""` igualmente

### Data placeholders
- Los datos en `realData.ts` para `DESTINATIONS`, `EXPERIENCES`, `TOURS_DATA`, `SITE_CONFIG`, `PAGES_DATA` son **REALES** del negocio. No inventar destinos ni cambiar nombres
- Los datos de `BOOKINGS`, `CUSTOMERS`, `PAYMENTS`, `PAYMENT_LINKS`, `TESTIMONIALS` son **dummy** para visualización
- Al agregar entidades nuevas, mantener el mismo patrón

## Decisiones del modelo de datos

**El documento canónico es `docs/fase2_modelo_datos_v2.md`** — léelo antes de hacer cambios estructurales al modelo. Resumen de decisiones clave:

1. Tipos de tour: `fijo` | `multi_dia` | `privado_solicitud` (NO `customizable`)
2. Pricing tiered es por **pax exacto** (no por rangos), con concepto de `base_pax`
3. Depósito = **monto fijo no reembolsable** (default RD$1,000/pax), no porcentaje
4. Tours `multi_dia` tienen `itinerary[]` con `Day[]`. Cada Day puede ser `is_swappable`
5. Swaps usan **curaduría implícita** (sin motor cross-día)
6. Servicios incluidos por día se modelan como **texto libre** (`incluye_text_es/en`)
7. Cliente fuera del rango de pax → bloqueo + invitación a cotización custom
8. Moneda base: DOP. USD y EUR derivadas de tasas en SiteConfig

## Roadmap actual

Estamos en **Frente 1 — Cerrar UI gaps del CMS**. Sub-bloques:

- [ ] **01 — Tab Itinerario para tours multi_dia** (en `docs/tareas/01-itinerario-multidia.md`)
- [ ] **02 — Pricing modes completos** (tiered_per_pax + fixed_group UI)
- [ ] **03 — Handlers vacíos del TourEditor** (SEO real, galería con upload, selector de operador)
- [ ] **04 — Data placeholder faltante** (Quotes, Operators externos, Users CMS, AuditLog)
- [ ] **05 — Auditoría de páginas stub** (Configuración, FAQ, Páginas, UsuariosCMS)
- [ ] **06 — Pasada de simplificación UX** (revisar flujos desde óptica del socio no-técnico)

Después de cerrar Frente 1 sigue **Fase 4 — Arquitectura backend** (AWS Serverless + DynamoDB).

## Qué NO tocar

- Los archivos en `src/app/components/ui/{button,dialog,...}.tsx` (shadcn primitives)
- `App.tsx` no necesita refactor estructural — solo agregar tipos si es necesario
- No introducir React Router, Redux ni librerías de routing/state global (lo decidiremos en Fase 4)
- No migrar inline styles a Tailwind classes todavía — eso es un sub-bloque futuro

## Commits

Un sub-bloque del roadmap = una rama feature + uno o varios commits semánticos. Patrón:

```bash
git checkout -b feature/itinerario-multidia
# trabajar...
git add -A
git commit -m "feat(tour-editor): agrega tab Itinerario para tours multi_dia"
# más commits si aplica
git push -u origin feature/itinerario-multidia
```

Mensaje de commit en español, formato conventional commits (`feat:`, `fix:`, `refactor:`, `docs:`, `chore:`).

## Validación visual

Antes de pushear un cambio, validar visualmente:

```bash
pnpm dev
# Navegar a localhost:5173
# - Ir a Tours → editar un tour
# - Validar el tab agregado/modificado
# - Probar con tour de cada tipo (fijo, multi_dia, privado_solicitud)
# - Probar role switcher en esquina inferior derecha (admin/staff/operator)
```
