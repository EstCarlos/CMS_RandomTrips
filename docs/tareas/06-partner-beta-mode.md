# Task 06 — UX Simplification: Beta mode for non-technical partner

> This task prepares the CMS for the first real user: Carlos's business partner. The goal is to hide everything he doesn't need yet and make the 3 core workflows feel obvious without documentation.
>
> **This is NOT a visual redesign.** No colors, no layouts, no component rewrites. Only: hide unused sections, simplify navigation, and add small UX helpers on the 3 active workflows.

Read `CLAUDE.md` before starting.

## Context

The business partner will use the CMS for:
1. **Cotizaciones** — receive quote requests, review details, respond with a proposed price, update status
2. **Catálogo** — create/edit Tours, Destinations, and Experiences
3. Nothing else for now

Everything else (Reservas, Pagos, Clientes, Disponibilidad, Galería, Testimonios, Páginas, Configuración, LogsAuditoria, UsuariosCMS) should be hidden from his view.

Payment links are OUT OF SCOPE for this phase — remove any "Generar link de pago" buttons or CTAs visible in the Cotizaciones flow.

---

## Changes required

### 1. Add a new role: `"partner"`

**File: `src/app/data/types.ts`**

Add `"partner"` to `UserRole`:
```ts
export type UserRole = "admin" | "staff" | "operator" | "partner";
```

### 2. Add partner role to the demo role switcher

**File: `src/app/App.tsx`**

The bottom-right role switcher currently cycles through `admin → staff → operator`. Add `partner` to the cycle:

```ts
const ROLES: UserRole[] = ["admin", "staff", "operator", "partner"];
```

Add a label for each role in the switcher button:
```ts
const ROLE_LABELS: Record<UserRole, string> = {
  admin:    "Admin",
  staff:    "Staff",
  operator: "Operador",
  partner:  "Socio",
};
```

Partner default page on load: `"cotizaciones"`.

### 3. Define partner navigation in Sidebar.tsx

**File: `src/app/components/layout/Sidebar.tsx`**

Add a `partner` nav case. Partner sees ONLY:

```
COTIZACIONES
📋  Cotizaciones

CATÁLOGO
🗺️  Destinos
✨  Experiencias
🎒  Tours
```

No other groups or items. Implement by adding a `partner` key to the existing nav groups structure, following the same pattern as `operator`.

### 4. Partner routing in App.tsx

In `renderPage()`, add a partner guard before the existing role checks:

```ts
if (role === "partner") {
  const allowed = ["cotizaciones", "destinos", "experiencias", "tours"];
  const safePage = allowed.includes(currentPage) ? currentPage : "cotizaciones";
  switch (safePage) {
    case "cotizaciones":   return <Cotizaciones isPartnerView />;
    case "destinos":       return <Destinos />;
    case "experiencias":   return <Experiencias />;
    case "tours":          return <Tours />;
    default:               return <Cotizaciones isPartnerView />;
  }
}
```

Also ensure that when the role changes TO partner (via the role switcher), `currentPage` resets to `"cotizaciones"`:
```ts
const handleRoleSwitch = () => {
  const next = nextRole(); // however the cycle works currently
  setRole(next);
  if (next === "partner") setCurrentPage("cotizaciones");
};
```

### 5. Remove payment link CTAs from Cotizaciones.tsx

**File: `src/app/components/pages/Cotizaciones.tsx`**

Search for and remove all buttons/UI elements related to payment links. Look for:
- Buttons with text: "Generar link", "Enviar link", "Link de pago", "Payment link"
- Any display of `quote.paymentLinkId` in the detail view
- Any step in the respond form that references payment links

Keep the `paymentLinkId` field in the `Quote` data model — just don't show it in the UI.

The respond flow should be:
1. View quote details (contact, destinations, dates, pax, message, budget)
2. Staff fills: proposed price + currency + staff notes
3. Click "Enviar cotización" → status → `"sent"`, price saved in local state
4. Done — no payment link step

### 6. Add `isPartnerView` prop to Cotizaciones

**File: `src/app/components/pages/Cotizaciones.tsx`**

```tsx
export function Cotizaciones({ isPartnerView = false }: { isPartnerView?: boolean }) {
```

**Welcome banner** — show only when `isPartnerView === true`, at the top before FilterBar:

```tsx
{isPartnerView && (
  <div style={{
    background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 8,
    padding: "12px 16px", marginBottom: 16,
    display: "flex", alignItems: "flex-start", gap: 10,
  }}>
    <span style={{ fontSize: 20 }}>👋</span>
    <div>
      <div style={{ fontSize: 13, fontWeight: 600, color: "#1E40AF", marginBottom: 2 }}>
        Bienvenido al CMS de Random Trips
      </div>
      <div style={{ fontSize: 12, color: "#3B82F6", lineHeight: 1.5 }}>
        Aquí recibirás las solicitudes de cotización de los clientes.
        Revisa cada una, completa el precio propuesto y envía tu respuesta.
      </div>
    </div>
  </div>
)}
```

**Empty state** — when the filtered list has 0 items, show instead of an empty table:

```tsx
{filteredQuotes.length === 0 && (
  <div style={{
    textAlign: "center", padding: "48px 20px",
    background: "#F7F8FA", borderRadius: 8, marginTop: 8,
  }}>
    <div style={{ fontSize: 40, marginBottom: 8 }}>📭</div>
    <div style={{ fontSize: 14, fontWeight: 600, color: "#0F172A", marginBottom: 4 }}>
      No hay cotizaciones pendientes
    </div>
    <div style={{ fontSize: 13, color: "#64748B" }}>
      Cuando un cliente solicite una cotización, aparecerá aquí.
    </div>
  </div>
)}
```

### 7. Add `isPartnerView` prop to TourEditor tabs indicator

**File: `src/app/components/pages/TourEditor.tsx`**

Add optional prop:
```tsx
// TourEditor component signature:
export function TourEditor({ tourId, isPartnerView = false }: { tourId: string; isPartnerView?: boolean }) {
```

In the tab bar render, add a small blue dot on the 3 most important tabs when `isPartnerView` is true:

```tsx
const IMPORTANT_TABS = ["info", "pricing", "itinerario"];

// In the tab button render:
<button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ /* existing styles */ }}>
  {tab.label}
  {isPartnerView && IMPORTANT_TABS.includes(tab.id) && (
    <span style={{
      width: 6, height: 6, borderRadius: "50%",
      background: activeTab === tab.id ? "#FFFFFF" : "#006CFE",
      display: "inline-block", marginLeft: 5, verticalAlign: "middle",
    }} />
  )}
</button>
```

Pass `isPartnerView` when rendering TourEditor from Tours.tsx:
```tsx
// In Tours.tsx, when opening the editor:
<TourEditor tourId={selectedTourId} isPartnerView={role === "partner"} />
// If role is not accessible from Tours.tsx, pass it as prop from App.tsx
```

Check how TourEditor is currently launched (from App.tsx or from Tours.tsx) and pass the prop accordingly.

---

## What NOT to change

- Do NOT redesign any page layout or change colors/spacing
- Do NOT hide tabs inside TourEditor (all 10 tabs stay, just add the dot indicator)
- Do NOT add routing libraries — keep the `currentPage` state pattern
- Do NOT add new features or pages
- The `paymentLinkId` field stays in `Quote` type and `QUOTES` data — only hide UI buttons
- Admin, staff, and operator views must remain completely unchanged

---

## Validation

```bash
pnpm typecheck
pnpm build
```

Visual with `pnpm dev` — switch to "Socio" role:

- [ ] Role switcher cycles: Admin → Staff → Operador → **Socio** → Admin
- [ ] Switching to Socio redirects to Cotizaciones automatically
- [ ] Sidebar shows ONLY: Cotizaciones / Destinos / Experiencias / Tours
- [ ] Typing a different page ID in state goes back to Cotizaciones
- [ ] Welcome banner visible on Cotizaciones as Socio, NOT visible as Admin
- [ ] Empty state shows when no quotes match current filter
- [ ] No payment link button anywhere in the quote flow as Socio
- [ ] Open a pending quote → fill proposed price → "Enviar cotización" → status changes to "sent"
- [ ] Navigate to Tours as Socio → click edit → TourEditor opens with blue dots on tabs 1, 2, and Itinerario (if multiDay)
- [ ] Switch back to Admin → full sidebar restored, no welcome banner, no dots in TourEditor
- [ ] `pnpm typecheck` passes — check exhaustive switches on UserRole

## Commit

```bash
git checkout -b feature/partner-beta-mode
git add -A
git commit -m "feat(ux): add partner role with simplified beta view for business partner

- Add 'partner' to UserRole type
- Partner nav: Cotizaciones + Catálogo (Destinos, Experiencias, Tours) only
- Partner default landing page: Cotizaciones
- Switching to partner role auto-navigates to Cotizaciones
- Cotizaciones: welcome banner + empty state (partner view only)
- Cotizaciones: remove payment link CTAs from quote flow
- TourEditor: blue dot indicator on important tabs in partner view
- Role switcher label: Admin / Staff / Operador / Socio
- Admin, staff, operator views unchanged"

git push -u origin feature/partner-beta-mode
```

## Notes for Claude Code

- **TypeScript exhaustive checks** — after adding `"partner"` to `UserRole`, any `Record<UserRole, ...>` or exhaustive switch will need the new case. Run typecheck after step 1 to see all places that need updating.
- **TourEditor launch point** — check whether TourEditor is rendered from App.tsx directly or from Tours.tsx. The `isPartnerView` prop needs to flow from wherever `role` is known (likely App.tsx) down to TourEditor. If Tours.tsx doesn't receive `role`, add it as a prop.
- **Payment link search** — grep for "link" in Cotizaciones.tsx to find all instances before deleting.
- **Don't create a new `StubPage`** for restricted access in partner mode — just silently redirect to cotizaciones. The partner won't know other sections exist.
- **Keep it simple** — this is a temporary beta mode. Fase 4 will replace this with real Cognito auth and server-side role enforcement. The prop drilling and role switcher are intentionally lightweight.
