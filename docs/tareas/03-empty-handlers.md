# Task 03 — Fix empty handlers in TourEditor (SEO, Gallery, Operator)

> Three tabs in TourEditor have decorative-only UI with no real onChange handlers or missing functionality. This task wires them up properly.

Read `CLAUDE.md` for project conventions before starting.

## Context

The TourEditor has 10 tabs. Most work correctly. Three have gaps:

1. **TabSEO** — BilingualFields for meta title and description use `onChange={() => {}}` (no-ops). The slug field works. Need to add a proper `seoMeta` field to Tour and wire up handlers.
2. **TabGaleria** — Buttons "Agregar de biblioteca" and "Subir nueva" are visual only. Component doesn't receive `onChange` prop. Need: ability to add/remove gallery items, mark one as primary, reorder.
3. **TabLogistica** — The Operator field shows `tour.operatorId` as plain text. Need: a `<select>` dropdown that lists available operators. This requires creating an `OPERATORS` constant in `realData.ts` first.

---

## Changes required

### 1. Add `seoMeta` to Tour type and data

**File: `src/app/data/types.ts`**

Add interface:
```ts
export interface SeoMeta {
  title: Bilingual;
  description: Bilingual;
  ogImageId?: string;
}
```

Add to `Tour` interface:
```ts
seoMeta?: SeoMeta;
```

**File: `src/app/data/realData.ts`**

Add `seoMeta` to each tour in `TOURS_DATA`. Auto-derive from existing fields:

```ts
seoMeta: {
  title: {
    es: `${tour.title.es} | Random Trips`,
    en: `${tour.title.en} | Random Trips`,
  },
  description: tour.description,
},
```

### 2. Wire up TabSEO

**File: `src/app/components/pages/TourEditor.tsx`**

Replace the current TabSEO implementation. Changes:

- Meta title BilingualField: read from `tour.seoMeta?.title`, write with `onChange("seoMeta", { ...seoMeta, title: v })`
- Meta description BilingualField: read from `tour.seoMeta?.description`, write with `onChange("seoMeta", { ...seoMeta, description: v })`
- Add a character counter below each BilingualField showing current length vs recommended (title: 50-60, description: 150-160)
- Slug field already works — keep as is
- Google preview: read from `tour.seoMeta?.title.es` and `tour.seoMeta?.description.es`
- OG Image: show current OG image from `MEDIA_ASSETS` if `tour.seoMeta.ogImageId` exists, with a button to pick from gallery. If no gallery items, show placeholder.

### 3. Add OPERATORS to realData.ts

**File: `src/app/data/realData.ts`**

Create `OPERATORS` array with 3-4 entries:

```ts
import type { Operator } from "./types";

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
    assignedTourIds: ["tour-playa-fronton", "tour-pico-diego-ocampo", "tour-travelhood-plan-1"],
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
    id: "op-montaña-verde",
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
```

Export it and also add a helper:
```ts
export const findOperator = (id: string) => OPERATORS.find(o => o.id === id);
```

### 4. Wire up Operator selector in TabLogistica

**File: `src/app/components/pages/TourEditor.tsx`**

Replace the plain text operator display with a `<select>`:

```tsx
<FormField label="Operador asignado">
  <select
    value={tour.operatorId}
    onChange={e => onChange("operatorId", e.target.value)}
    style={{
      width: "100%", padding: "9px 12px",
      border: "1px solid #E5E7EB", borderRadius: 6,
      fontSize: 13, color: "#0F172A",
      background: "#FFFFFF", outline: "none",
      cursor: "pointer", boxSizing: "border-box",
    }}
  >
    {OPERATORS.filter(o => o.status === "active").map(o => (
      <option key={o.id} value={o.id}>
        {o.name} {o.type === "external" ? "(externo)" : "(interno)"}
      </option>
    ))}
  </select>
</FormField>
```

Import `OPERATORS` from realData at the top of TourEditor.

Also show operator contact info below the select as a read-only info card:

```tsx
{selectedOperator && (
  <div style={{ padding: "10px 14px", background: "#F7F8FA", borderRadius: 6, border: "1px solid #E5E7EB", fontSize: 12, color: "#475569" }}>
    <div style={{ fontWeight: 600, marginBottom: 4 }}>{selectedOperator.name}</div>
    <div>{selectedOperator.contact.email} · {selectedOperator.contact.phone}</div>
  </div>
)}
```

### 5. Wire up TabGaleria with add/remove/reorder

**File: `src/app/components/pages/TourEditor.tsx`**

Change `TabGaleria` to receive `onChange`:

```tsx
function TabGaleria({ tour, onChange }: { tour: Tour; onChange: (k: keyof Tour, v: unknown) => void }) {
```

And update the call site:
```tsx
{activeTab === "galeria" && <TabGaleria tour={tour} onChange={onChange} />}
```

Add these interactions:

**a) "Agregar de biblioteca" button** — opens a simple modal listing all `MEDIA_ASSETS` not already in `tour.galleryIds`. Click on an asset adds its id to `tour.galleryIds`:

```tsx
const addToGallery = (assetId: string) => {
  if (!tour.galleryIds.includes(assetId)) {
    onChange("galleryIds", [...tour.galleryIds, assetId]);
  }
};
```

Use a simple state-driven inline panel (not a full Modal component) that toggles open below the buttons. Show available assets as a grid of clickable thumbnails. Filter out already-added ones.

**b) Remove from gallery** — add an X button overlay on each image in the grid:

```tsx
const removeFromGallery = (assetId: string) => {
  onChange("galleryIds", tour.galleryIds.filter(id => id !== assetId));
};
```

**c) Mark as primary** — click on any image (not the X) makes it the first in the array (index 0 = primary):

```tsx
const setPrimary = (assetId: string) => {
  const filtered = tour.galleryIds.filter(id => id !== assetId);
  onChange("galleryIds", [assetId, ...filtered]);
};
```

**d) "Subir nueva"** — for now, show a toast/alert "La subida de archivos estará disponible cuando se conecte el backend (Fase 4)". Don't implement actual upload.

**e) Reorder** — add move up/down arrows (ChevronUp/ChevronDown) on each image, similar to how TabItinerario does day reordering:

```tsx
const moveGalleryItem = (idx: number, direction: "up" | "down") => {
  const arr = [...tour.galleryIds];
  const targetIdx = direction === "up" ? idx - 1 : idx + 1;
  if (targetIdx < 0 || targetIdx >= arr.length) return;
  [arr[idx], arr[targetIdx]] = [arr[targetIdx], arr[idx]];
  onChange("galleryIds", arr);
};
```

### 6. Add more MEDIA_ASSETS to realData.ts

Currently `MEDIA_ASSETS` may have very few entries. Add at least 8-10 placeholder assets so the gallery picker has content to show. Follow existing pattern:

```ts
{
  id: "media-fronton-1",
  type: "photo" as const,
  url: null,
  thumbUrl: null,
  alt: { es: "Playa Frontón desde el mar", en: "Frontón Beach from the sea" },
  association: "tour" as const,
  associatedTo: "tour-playa-fronton",
  emoji: "🏖️",
  color: "#DBEAFE",
},
```

Add variety: beach shots, mountain shots, food, group photos, boats, sunsets. Use descriptive `alt` texts. Mix associations (some to tours, some to destinations, some "global").

---

## Validation

After all changes:

```bash
pnpm typecheck
pnpm build
```

Then visual validation with `pnpm dev`:

- [ ] Edit TravelHood → Tab SEO → change meta title ES → verify Google preview updates live
- [ ] Verify character counter shows length
- [ ] Tab SEO → slug field still editable
- [ ] Tab Logística → Operator dropdown shows 3 active operators (not the inactive one)
- [ ] Select "Caribe Adventures" → contact info card updates below
- [ ] Tab Galería → "Agregar de biblioteca" opens picker panel with available assets
- [ ] Click an asset → it appears in the gallery grid
- [ ] Click X on an asset → it's removed
- [ ] Click on a non-primary image → it moves to position 0 with "PRINCIPAL" badge
- [ ] "Subir nueva" → shows message about Fase 4
- [ ] Move arrows work (up/down reorder)

## Commit

```bash
git checkout -b feature/empty-handlers-fix
git add -A
git commit -m "feat(tour-editor): wire up SEO, gallery, and operator handlers

- Add SeoMeta interface and seoMeta field to Tour
- TabSEO: BilingualFields now read/write seoMeta with char counters
- Add OPERATORS array with 4 entries (1 internal, 3 external)
- TabLogistica: operator field is now a <select> with contact info card
- TabGaleria: add/remove/reorder/set-primary functionality
- Add 8-10 placeholder MEDIA_ASSETS for gallery picker
- Upload deferred to Fase 4 (shows info message)"

git push -u origin feature/empty-handlers-fix
```
