# Task 05 — Stub page audit & local interface cleanup

> Audit every page for (a) leftover local interfaces that duplicate central types, and (b) pages with mock data not yet connected to realData.ts. Fix each one.

Read `CLAUDE.md` before starting.

## What was found

Two categories of issues detected:

### Category A — Local interfaces that duplicate types.ts (must fix)

| File | Local type | Should use |
|---|---|---|
| `Operadores.tsx` | `interface Operador` + `mockOperadores[]` | `Operator` from types.ts + `OPERATORS` from realData |
| `ReservaDetalle.tsx` | `interface Reserva` | `Booking` + `Customer` + `Payment` from types.ts |

### Category B — Local type aliases (acceptable, no action needed)

These are thin aliases or `Omit` wrappers that don't duplicate logic — leave them:

| File | Local type | Why OK |
|---|---|---|
| `Destinos.tsx` | `type Destino = Omit<...>` | Thin alias, no duplication |
| `Experiencias.tsx` | `type Exp = Omit<...>` | Same |
| `Galeria.tsx` | `type Asset = typeof MEDIA_ASSETS[0]` | Inferred type alias |
| `Testimonios.tsx` | `type Testimonio = typeof TESTIMONIALS[0]` | Inferred type alias |
| `Paginas.tsx` | `type Page = typeof PAGES_DATA[0]` | Re-exports from import |
| `Disponibilidad.tsx` | `type SlotStatus` + `interface DaySlot` | UI-only types for calendar rendering, no model duplication |

### Category C — Dashboard not yet consuming QUOTES/CMS_USERS/AUDIT_LOGS

Dashboard's KPI bar shows Bookings, Revenue, Payment Links. After tarea 04 added QUOTES and CMS_USERS, Dashboard could show a "Pending quotes" KPI. Minor enhancement.

---

## Changes required

### Fix 1 — Operadores.tsx: replace mock with OPERATORS from realData

**File: `src/app/components/pages/Operadores.tsx`**

The local `interface Operador` has extra display-only fields (`zone`, `commission`, `numTours`, `activeBookings`, `rating`, `monthlyRevenue`, `monthlyBookings`, `assignedTours` as string array of names) that don't exist in the central `Operator` type. Strategy:

1. Remove `interface Operador` and `const mockOperadores`
2. Import `Operator` from types and `OPERATORS, TOURS_DATA, BOOKINGS, findOperator` from realData
3. Compute display fields at runtime from real data:

```ts
const enrichedOperators = OPERATORS.map(op => {
  const opBookings = BOOKINGS.filter(b => b.operatorId === op.id);
  const opTours    = TOURS_DATA.filter(t => t.operatorId === op.id);
  return {
    ...op,
    numTours:       opTours.length,
    activeBookings: opBookings.filter(b => b.status !== "cancelled" && b.status !== "completed").length,
    monthlyRevenue: opBookings.reduce((s, b) => s + b.depositPaid, 0),
    monthlyBookings: opBookings.length,
    assignedTourNames: opTours.map(t => t.title.es),
    // Fields that don't exist in real data yet — use sensible defaults:
    zone:       op.type === "internal" ? "Nacional" : "Por definir",
    commission: op.type === "internal" ? "N/A" : "Por definir",
    rating:     4.8, // placeholder until reviews system is built
  };
});
```

4. The `TOURS_CATALOG` local array (list of tour names for assignment) should be replaced with:
```ts
const TOURS_CATALOG = TOURS_DATA.map(t => ({ id: t.id, name: t.title.es }));
```

5. The status field in `Operator` is `"active" | "inactive"`. The page uses additional statuses `"seasonal"` and `"review"` — add these to the `Operator` type in types.ts:
```ts
// In types.ts, update:
export type OperatorStatus = "active" | "inactive" | "seasonal" | "review";
// And update Operator.status field type accordingly
```

6. Update all JSX references to use the enriched fields.

**Acceptance:** Page renders the 4 real operators (Random Trips, Caribe Adventures, Montaña Verde, Sur Profundo Eco) instead of the 5 mock operators.

---

### Fix 2 — ReservaDetalle.tsx: connect to real Booking + Customer data

**File: `src/app/components/pages/ReservaDetalle.tsx`**

The component receives a `Reserva` prop (local interface) from `Reservas.tsx`. The fix requires changes in both files.

**2a. Update Reservas.tsx to pass real Booking data:**

Currently `Reservas.tsx` builds a `Reserva` object in `buildDetalleReserva()` to pass to `ReservaDetalle`. Instead, pass the real `Booking` object (and optionally `Customer`) directly:

```ts
// In Reservas.tsx — when user clicks a row:
// Instead of: onDetail(buildDetalleReserva(booking))
// Do: onDetail(booking, findCustomer(booking.customerId))
```

Update the `onDetail` callback type accordingly.

**2b. Update ReservaDetalle.tsx to receive Booking + Customer:**

Replace `interface Reserva` with:
```ts
import type { Booking, Customer, Payment, PaymentLink } from "../../data/types";
import { PAYMENTS, PAYMENT_LINKS, CUSTOMERS, TOURS_DATA, OPERATORS,
         findTour, findOperator } from "../../data/realData";
```

Change the props:
```ts
interface Props {
  booking: Booking;
  customer?: Customer;
  onBack: () => void;
}
```

Derive all displayed fields from real data:
```ts
const tour     = findTour(booking.tourId);
const operator = findOperator(booking.operatorId);
const payments = PAYMENTS.filter(p => p.bookingId === booking.id);
const links    = PAYMENT_LINKS.filter(l => l.bookingId === booking.id);
```

Display fields mapping:
- `r.customerName` → `customer?.name ?? booking.customerId`
- `r.email`        → `customer?.email ?? "—"`
- `r.phone`        → `customer?.phone ?? "—"`
- `r.country`      → `customer?.country ?? "—"`
- `r.tour`         → `tour?.title.es ?? booking.tourId`
- `r.destination`  → `tour?.destinationIds.map(id => getDestinationName(id)).join(", ") ?? "—"`
- `r.tourDate`     → `booking.date`
- `r.creationDate` → `booking.createdAt ?? "—"`
- `r.pax`          → `booking.totalPax`
- `r.total`        → `booking.totalPrice`
- `r.paid`         → `booking.depositPaid`
- `r.status`       → `booking.status`
- `r.operator`     → `operator?.name ?? booking.operatorId`
- `r.notes`        → `booking.internalNotes ?? ""`

The `statusConf` mapping needs to align with `BookingStatus` values:
```ts
const statusConf: Record<BookingStatus, { variant: ...; label: string }> = {
  pendingPayment: { variant: "warning", label: "Pendiente pago" },
  depositPaid:    { variant: "info",    label: "Depósito pagado" },
  fullyPaid:      { variant: "success", label: "Pago completo" },
  balanceOverdue: { variant: "danger",  label: "Saldo vencido" },
  cancelled:      { variant: "danger",  label: "Cancelada" },
  completed:      { variant: "neutral", label: "Finalizada" },
};
```

**2c. Update Reservas.tsx buildDetalleReserva:**

Remove the `buildDetalleReserva` function entirely. Pass `booking` object directly to `ReservaDetalle`. Update `App.tsx` if it manages the `selectedReserva` state — the type changes from `Reserva` (local) to `Booking`.

---

### Fix 3 — Dashboard: add Pending Quotes KPI

**File: `src/app/components/pages/Dashboard.tsx`**

Add one new KPI card after the existing 4, consuming the new `QUOTES` array:

```ts
import { QUOTES, CMS_USERS } from "../../data/realData";

const pendingQuotes = QUOTES.filter(q => q.status === "pending").length;
```

Add a KPI card:
```tsx
<KPICard
  icon={<MessageSquare size={18} />}
  label="Cotizaciones pendientes"
  value={String(pendingQuotes)}
  delta={pendingQuotes > 0 ? `${pendingQuotes} requieren respuesta` : "Al día"}
  deltaPositive={pendingQuotes === 0}
  color="#F13540"
/>
```

Also update the "Alertas" panel to include:
- Quote alerts: quotes pending for more than 48h (use `hoursAgo` helper pattern from Cotizaciones.tsx)

---

## Validation

```bash
pnpm typecheck
pnpm build
```

Visual with `pnpm dev`:

- [ ] Operadores page shows 4 operators from OPERATORS (Random Trips, Caribe Adventures, Montaña Verde, Sur Profundo Eco)
- [ ] Click on an operator → detail view shows computed fields (numTours, activeBookings, etc.)
- [ ] Operator status badge renders correctly for "active", "inactive", and any new statuses
- [ ] Reservas list → click a row → ReservaDetalle opens with real Booking data
- [ ] ReservaDetalle shows customer name, tour name, destination (derived from IDs)
- [ ] Payment history in ReservaDetalle shows real PAYMENTS filtered by bookingId
- [ ] Payment links in ReservaDetalle shows real PAYMENT_LINKS filtered by bookingId
- [ ] Dashboard shows 5 KPI cards including "Cotizaciones pendientes" with count from QUOTES
- [ ] Dashboard alerts panel shows overdue quote alerts if any
- [ ] `pnpm typecheck` passes with no errors

## Commit

```bash
git checkout -b feature/stub-page-audit
git add -A
git commit -m "feat(pages): connect Operadores and ReservaDetalle to real data; add quotes KPI to Dashboard

- Operadores.tsx: replace mockOperadores with enriched OPERATORS from realData
- ReservaDetalle.tsx: replace local Reserva interface with Booking + Customer types
- Reservas.tsx: pass Booking directly instead of buildDetalleReserva transform
- Dashboard.tsx: add pending quotes KPI card and alert using QUOTES
- types.ts: expand OperatorStatus to include 'seasonal' and 'review'"

git push -u origin feature/stub-page-audit
```

## Notes for Claude Code

- **Check App.tsx** — it manages `selectedReserva` state. When ReservaDetalle changes its prop type from `Reserva` to `Booking`, App.tsx needs to update that state type too. Run typecheck after this change to catch cascading errors.
- **The `buildDetalleReserva` function** in Reservas.tsx can be deleted entirely — it was only there to adapt Booking → Reserva. Once ReservaDetalle accepts Booking directly, the adapter is gone.
- **Operator enrichment** — `rating` and `commission` don't exist in real data yet. Use placeholder values clearly marked with a `// TODO: replace when reviews/commission module is built` comment.
- **Don't change the visual design** of any page — only the data source changes.
- **Run typecheck after each file change**, not just at the end. The Reserva→Booking change will cause cascading TypeScript errors in Reservas.tsx and App.tsx that need to be fixed before continuing.
