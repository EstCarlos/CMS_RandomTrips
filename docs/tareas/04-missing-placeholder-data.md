# Task 04 — Migrate local mock data to realData.ts

> Four pages have their own local mock data instead of importing from `realData.ts`. This breaks the single-source-of-truth pattern used everywhere else. This task centralizes all data.

Read `CLAUDE.md` for project conventions before starting.

## Context

All pages should import their data from `src/app/data/realData.ts` using types from `src/app/data/types.ts`. Currently these 4 pages define data locally:

| Page | Local data | Target in realData.ts |
|---|---|---|
| `Cotizaciones.tsx` | `mockCots: Cotizacion[]` with local `interface Cotizacion` | `QUOTES: Quote[]` using existing `Quote` type |
| `UsuariosCMS.tsx` | `mockUsers: CmsUser[]` with local `interface CmsUser` | `CMS_USERS: CmsUser[]` using existing `CmsUser` type |
| `LogsAuditoria.tsx` | `mockLogs: LogEntry[]` with local `interface LogEntry` | `AUDIT_LOGS: AuditLog[]` using existing `AuditLog` type |
| `FAQ.tsx` | `mockFAQ: FAQCategory[]` with local interfaces | `FAQS: FaqCategory[]` — need to add `FaqCategory` to types.ts |

---

## Changes required

### Step 1 — Add FaqCategory to types.ts

**File: `src/app/data/types.ts`**

The existing `FAQ` interface is for individual items. Add a grouping interface:

```ts
export interface FaqCategory {
  id: string;
  name: string;
  icon: string;
  items: FAQ[];
}
```

Verify the existing `FAQ` interface has these fields (update if needed):
```ts
export interface FAQ {
  id: string;
  question: Bilingual;
  answer: Bilingual;
  category: string;
  order: number;
  status: "published" | "draft";
}
```

### Step 2 — Add all 4 data arrays to realData.ts

**File: `src/app/data/realData.ts`**

Import the new types and create the 4 arrays. Move the mock data from each page, adapting field names to match the centralized types.

#### 2a. QUOTES

Create `QUOTES: Quote[]` with 5-6 entries covering all statuses. Use realistic data consistent with Random Trips business (Dominican destinations, real-sounding contact info, DOP pricing):

```ts
export const QUOTES: Quote[] = [
  {
    id: "qt-001",
    contact: {
      name: "María González",
      email: "maria.gonzalez@gmail.com",
      phone: "+1 (305) 555-0142",
      country: "US",
    },
    requestedDestinations: ["Samaná", "Bahía de las Águilas"],
    requestedDates: "15-22 julio 2026",
    pax: 4,
    approximateBudget: 60000,
    message: "Somos una familia de 4 (2 adultos, 2 niños de 10 y 13 años). Nos gustaría un paquete que combine playa y naturaleza. Preferimos hospedaje tipo glamping o eco-lodge.",
    status: "pending",
    proposedPrice: null,
    currency: "DOP",
    paymentLinkId: null,
    assignedToUserId: null,
    staffNotes: "",
    createdAt: "2026-06-17T14:32:00Z",
    respondedAt: null,
  },
  {
    id: "qt-002",
    contact: {
      name: "James Mitchell",
      email: "j.mitchell@outlook.com",
      phone: "+44 7911 123456",
      country: "GB",
    },
    requestedDestinations: ["Constanza", "Jarabacoa", "Santiago"],
    requestedDates: "Agosto 2026, fechas flexibles",
    pax: 8,
    approximateBudget: null,
    message: "Group of friends looking for an adventure trip in the mountains. We're into hiking, rafting, and anything outdoors. Budget is flexible for the right experience.",
    status: "sent",
    proposedPrice: 180000,
    currency: "DOP",
    paymentLinkId: "pl-qt-002",
    assignedToUserId: "usr-carlos",
    staffNotes: "Propuesto paquete montaña 5 días. Esperando respuesta. Se les ofreció incluir Pico Duarte.",
    createdAt: "2026-06-10T09:15:00Z",
    respondedAt: "2026-06-11T16:40:00Z",
  },
  {
    id: "qt-003",
    contact: {
      name: "Laura Fernández",
      email: "laura.f@empresa.com.do",
      phone: "+1 (809) 555-0198",
      country: "DO",
    },
    requestedDestinations: ["Punta Cana", "Bayahibe"],
    requestedDates: "20-21 septiembre 2026",
    pax: 15,
    approximateBudget: 250000,
    message: "Estamos organizando un teambuilding para 15 personas de nuestra empresa. Necesitamos actividades en grupo, almuerzo incluido, y transporte desde Santo Domingo.",
    status: "accepted",
    proposedPrice: 225000,
    currency: "DOP",
    paymentLinkId: "pl-qt-003",
    assignedToUserId: "usr-carlos",
    staffNotes: "Confirmado. Booking creado: BK-007. Coordinar transporte con Caribe Adventures.",
    createdAt: "2026-06-05T11:00:00Z",
    respondedAt: "2026-06-06T10:20:00Z",
  },
  {
    id: "qt-004",
    contact: {
      name: "Sophie Dupont",
      email: "sophie.d@free.fr",
      phone: "+33 6 12 34 56 78",
      country: "FR",
    },
    requestedDestinations: ["Samaná"],
    requestedDates: "Diciembre 2026",
    pax: 2,
    approximateBudget: null,
    message: "Honeymoon trip. Looking for something romantic and exclusive — private beach, sunset, good food. 3-4 days ideally.",
    status: "rejected",
    proposedPrice: 95000,
    currency: "DOP",
    paymentLinkId: null,
    assignedToUserId: "usr-staff1",
    staffNotes: "Cotización enviada pero el presupuesto les pareció alto. Ofrecí opción más económica pero prefirieron otro proveedor.",
    createdAt: "2026-05-28T16:45:00Z",
    respondedAt: "2026-05-29T14:10:00Z",
  },
  {
    id: "qt-005",
    contact: {
      name: "Roberto Almánzar",
      email: "ralmanzar@hotmail.com",
      phone: "+1 (849) 555-0321",
      country: "DO",
    },
    requestedDestinations: ["Valle Nuevo", "Constanza"],
    requestedDates: "Primer fin de semana de agosto",
    pax: 6,
    approximateBudget: 30000,
    message: "Queremos ir de camping a Valle Nuevo. ¿Tienen paquete con equipo de camping incluido?",
    status: "pending",
    proposedPrice: null,
    currency: "DOP",
    paymentLinkId: null,
    assignedToUserId: null,
    staffNotes: "",
    createdAt: "2026-06-18T20:10:00Z",
    respondedAt: null,
  },
];
```

#### 2b. CMS_USERS

Create `CMS_USERS: CmsUser[]` with 4-5 entries covering all roles:

```ts
export const CMS_USERS: CmsUser[] = [
  {
    id: "usr-carlos",
    email: "carlos@randomtrips.co",
    name: "Carlos Soto",
    role: "admin",
    operatorId: null,
    permissions: [],
    lastLogin: "2026-06-19T08:30:00Z",
    status: "active",
  },
  {
    id: "usr-socio",
    email: "socio@randomtrips.co",
    name: "Socio Random Trips",
    role: "admin",
    operatorId: null,
    permissions: [],
    lastLogin: "2026-06-18T22:15:00Z",
    status: "active",
  },
  {
    id: "usr-staff1",
    email: "ana@randomtrips.co",
    name: "Ana Pérez",
    role: "staff",
    operatorId: null,
    permissions: [],
    lastLogin: "2026-06-17T14:00:00Z",
    status: "active",
  },
  {
    id: "usr-op-caribe",
    email: "ops@caribead.do",
    name: "Luis Reyes",
    role: "operator",
    operatorId: "op-caribe-adventures",
    permissions: [],
    lastLogin: "2026-06-15T10:45:00Z",
    status: "active",
  },
  {
    id: "usr-op-montana",
    email: "info@montanaverde.do",
    name: "Pedro Martínez",
    role: "operator",
    operatorId: "op-montaña-verde",
    permissions: [],
    lastLogin: null,
    status: "inactive",
  },
];
```

#### 2c. AUDIT_LOGS

Create `AUDIT_LOGS: AuditLog[]` with 8-10 entries showing realistic CMS actions:

```ts
export const AUDIT_LOGS: AuditLog[] = [
  {
    id: "log-001",
    timestamp: "2026-06-19T08:32:15Z",
    actorId: "usr-carlos",
    action: "update",
    entity: "tour",
    entityId: "tour-playa-fronton",
    before: { "pricingModel.pricePerPerson": 3200 },
    after: { "pricingModel.pricePerPerson": 3500 },
  },
  {
    id: "log-002",
    timestamp: "2026-06-19T07:45:00Z",
    actorId: "usr-carlos",
    action: "create",
    entity: "tour",
    entityId: "tour-travelhood-plan-1",
    before: null,
    after: { title: "TravelHood Plan 1", type: "multiDay" },
  },
  {
    id: "log-003",
    timestamp: "2026-06-18T22:10:00Z",
    actorId: "usr-socio",
    action: "update",
    entity: "availability",
    entityId: "tour-playa-fronton",
    before: { date: "2026-07-12", status: "open" },
    after: { date: "2026-07-12", status: "blocked" },
  },
  {
    id: "log-004",
    timestamp: "2026-06-18T16:30:00Z",
    actorId: "usr-staff1",
    action: "create",
    entity: "booking",
    entityId: "BK-003",
    before: null,
    after: { tourId: "tour-playa-fronton", totalPax: 3, status: "depositPaid" },
  },
  {
    id: "log-005",
    timestamp: "2026-06-18T14:20:00Z",
    actorId: "usr-carlos",
    action: "update",
    entity: "siteConfig",
    entityId: "exchangeRates",
    before: { USD: 0.0165, EUR: 0.0150 },
    after: { USD: 0.0167, EUR: 0.0155 },
  },
  {
    id: "log-006",
    timestamp: "2026-06-17T11:00:00Z",
    actorId: "usr-staff1",
    action: "update",
    entity: "quote",
    entityId: "qt-002",
    before: { status: "pending" },
    after: { status: "sent", proposedPrice: 180000 },
  },
  {
    id: "log-007",
    timestamp: "2026-06-16T09:15:00Z",
    actorId: "usr-op-caribe",
    action: "update",
    entity: "availability",
    entityId: "tour-bayahibe-isla-saona",
    before: { date: "2026-07-20", totalSeats: 15 },
    after: { date: "2026-07-20", totalSeats: 20 },
  },
  {
    id: "log-008",
    timestamp: "2026-06-15T18:45:00Z",
    actorId: "usr-carlos",
    action: "publish",
    entity: "tour",
    entityId: "tour-bahia-aguilas-premium",
    before: { status: "draft" },
    after: { status: "published" },
  },
];
```

#### 2d. FAQS

Move the existing mock from `FAQ.tsx` into `realData.ts` as `FAQS: FaqCategory[]`. Keep the same content — it's already well-written and uses Bilingual objects. Just make sure the item type matches the centralized `FAQ` interface (add `category` field if missing).

#### 2e. Helpers

Add lookup helpers:
```ts
export const findQuote  = (id: string) => QUOTES.find(q => q.id === id);
export const findUser   = (id: string) => CMS_USERS.find(u => u.id === id);
```

### Step 3 — Migrate pages to use centralized data

For each of the 4 pages, do the same pattern:

1. Remove the local `interface` and `const mock*` definitions
2. Add imports from `realData.ts` and `types.ts`
3. Replace all references to local data with the imported constants
4. If the local interface had extra fields not in the central type (e.g. computed/display fields), compute them inline or create a local enrichment similar to how `Clientes.tsx` does `enrichedCustomers`

#### 3a. Cotizaciones.tsx

- Remove `interface Cotizacion` and `const mockCots`
- Import `QUOTES, CMS_USERS, findUser` from realData and `Quote` from types
- Replace `mockCots` → `QUOTES` everywhere
- The local interface might have display fields like `pendingHours` — compute inline:
  ```ts
  const hoursAgo = (iso: string) => Math.round((Date.now() - new Date(iso).getTime()) / 3600000);
  ```
- Replace `c.assignedTo` (string name) with `findUser(c.assignedToUserId)?.name ?? "—"` 
- Check all field name mappings: the local interface uses Spanish or different field names vs the central `Quote` type. Map each one carefully.

#### 3b. UsuariosCMS.tsx

- Remove `interface CmsUser` and `const mockUsers`
- Import `CMS_USERS, OPERATORS, findOperator` from realData and `CmsUser` from types
- Replace `mockUsers` → `CMS_USERS`
- The `useState(mockUsers)` for the invite modal flow should become `useState(CMS_USERS)`
- For operator name display: `findOperator(u.operatorId)?.name ?? "—"`
- The invite modal can keep its local state but should push to the local `users` array with the correct `CmsUser` shape

#### 3c. LogsAuditoria.tsx

- Remove `interface LogEntry` and `const mockLogs`
- Import `AUDIT_LOGS, CMS_USERS, findUser` from realData and `AuditLog` from types
- Replace `mockLogs` → `AUDIT_LOGS`
- For actor display: `findUser(l.actorId)?.name ?? l.actorId`
- The diff drawer should work with `before`/`after` objects — verify it handles `null` values (for create actions where `before` is null)

#### 3d. FAQ.tsx

- Remove `interface FAQItem`, `interface FAQCategory`, `const mockFAQ`
- Import `FAQS` from realData and `FAQ, FaqCategory` from types
- Replace `mockFAQ` → `FAQS`
- The `useState(mockFAQ)` should become `useState(FAQS)` to preserve the inline editing behavior

### Step 4 — Verify types alignment

After migration, check that the `Quote` type in `types.ts` has all the fields used by `Cotizaciones.tsx`. The current `Quote` type was defined during the refactor but the page might use fields not yet in the type. Common gaps:

- `contact` should be an object `{ name, email, phone, country }` — verify
- `requestedDestinations` vs `requestedDestinationIds` — check naming in types.ts
- `createdAt` field — verify it exists in the type
- `respondedAt` field — verify it exists

If any fields are missing from the central type, ADD them to `types.ts` — do NOT create local extensions.

Similarly for `AuditLog`:
- `before` and `after` should be `Record<string, unknown> | null` — verify
- `actorId` vs `actor` — the type should use `actorId` (camelCase English)

---

## Validation

```bash
pnpm typecheck
pnpm build
```

Visual validation with `pnpm dev`:

- [ ] Cotizaciones page shows 5 quotes with correct statuses and tab counts
- [ ] Click a quote → detail view shows contact info, requested destinations, staff notes
- [ ] Quotes with `assignedToUserId` show the user's name (not the ID)
- [ ] UsuariosCMS page shows 5 users with correct roles and operator associations
- [ ] Invite modal works (adds to local state)
- [ ] LogsAuditoria shows 8 entries with actor names resolved
- [ ] Click a log entry → diff drawer shows before/after correctly
- [ ] Create actions (before=null) render gracefully in diff drawer
- [ ] FAQ page shows categories with items, inline editing still works
- [ ] Dashboard still renders (it may reference some of these arrays for KPI counts)

## Commit

```bash
git checkout -b feature/migrate-mock-data
git add -A
git commit -m "feat(data): centralize Quotes, CMS Users, AuditLogs, FAQs in realData.ts

- Add QUOTES (5 entries covering all statuses)
- Add CMS_USERS (5 entries: 2 admin, 1 staff, 2 operators)
- Add AUDIT_LOGS (8 entries with realistic CMS actions)
- Move FAQ mock data to FAQS in realData.ts
- Add FaqCategory interface to types.ts
- Migrate Cotizaciones, UsuariosCMS, LogsAuditoria, FAQ pages to import from realData
- Remove local interfaces and mock arrays from all 4 pages
- Add findQuote/findUser helpers"

git push -u origin feature/migrate-mock-data
```

## Notes for Claude Code

- **Field name alignment is the tricky part.** The local interfaces in each page may use slightly different field names than the central types. Map carefully — if a field is missing from the central type, add it there.
- **Don't change visual behavior.** The pages should look and work exactly the same after migration. The only change is where the data comes from.
- **The Quote `contact` field** is an object in `types.ts` but the page might have used flat fields like `contactName`, `contactEmail`. Check and adapt.
- **Preserve useState patterns.** Pages that use `useState(mockData)` for inline editing should use `useState(IMPORTED_DATA)` — the editing is local state, the initial data comes from realData.
- **Run typecheck after each page migration**, not just at the end. This catches field mismatches early.
