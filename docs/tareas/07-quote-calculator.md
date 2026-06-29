# Task 07 — Quote Calculator: variable cost breakdown in Cotizaciones

> Adds a cost calculator to the quote response flow. The partner can build up the quote price from a tour base price + variable cost lines (transport, entries, etc.) + an adjustable margin. The breakdown is saved permanently with the quote for historical reference.

Read `CLAUDE.md` before starting.

## Context

When the partner receives a quote request he needs to:
1. Check how many pax are requested
2. Call transport agencies → get a price for a bus of the right size
3. Add other variable costs (park entries, guides, etc.)
4. Apply Random Trips margin on top
5. Arrive at a final price per person to propose to the client

Today the only tool is a free-text "proposed price" field. This task adds a proper calculator that derives the price from real cost inputs and saves the breakdown.

## Data model changes

### Step 1 — Add types to types.ts

**File: `src/app/data/types.ts`**

Add these interfaces:

```ts
export type SplitMode = "perPax" | "fixed";

export interface CostLine {
  id: string;                    // nanoid or Date.now().toString()
  description: string;           // "Transporte (guagua 15p)", "Entrada Parque"
  amount: number;                // total cost of this line in DOP
  splitMode: SplitMode;          // "perPax" = divide by capacity, "fixed" = flat add
  minCapacity?: number;          // only for perPax: minimum bus/boat capacity
                                 // if minCapacity > pax, extra seats cost is shown as absorbed
}

export interface QuoteCalculation {
  baseTourId?: string;           // optional: tour from catalog used as base
  basePricePerPerson: number;    // base price per person (from tour or manual entry)
  costLines: CostLine[];         // variable cost lines added by partner
  marginPercent: number;         // Random Trips margin (%), partner-adjustable, no default
  pax: number;                   // snapshot of requested pax at calculation time
  totalCost: number;             // computed: base + all costLine contributions (before margin)
  totalWithMargin: number;       // computed: totalCost × (1 + marginPercent/100)
  pricePerPerson: number;        // computed: totalWithMargin / pax
  absorbedCost: number;          // computed: sum of costs absorbed due to minCapacity > pax
  calculatedAt: string;          // ISO timestamp of last calculation
}
```

Add `calculation?: QuoteCalculation` to the `Quote` interface.

### Step 2 — Add calculation to QUOTES in realData.ts

**File: `src/app/data/realData.ts`**

Add a `calculation` field to 2-3 existing quotes to show how it looks with real data. Add to `qt-002` (the sent quote for 8 people):

```ts
calculation: {
  baseTourId: undefined,
  basePricePerPerson: 12000,
  costLines: [
    {
      id: "cl-001",
      description: "Transporte (guagua 15p)",
      amount: 16000,
      splitMode: "perPax",
      minCapacity: 15,
    },
    {
      id: "cl-002",
      description: "Entradas Parque Nacional",
      amount: 4800,
      splitMode: "fixed",
    },
  ],
  marginPercent: 18,
  pax: 8,
  totalCost: 118400,      // (12000 × 8) + (16000/15 × 8) + 4800
  totalWithMargin: 139712, // totalCost × 1.18
  pricePerPerson: 17464,  // totalWithMargin / 8
  absorbedCost: 7467,     // (15-8)/15 × 16000
  calculatedAt: "2026-06-11T15:30:00Z",
},
```

Note: you don't need to compute these manually — the component will compute them. Just provide realistic input values and approximate computed values.

### Step 3 — Build the QuoteCalculator component

**File: `src/app/components/pages/Cotizaciones.tsx`**

Create a new component `QuoteCalculator` inside `Cotizaciones.tsx` (or as a sibling file if it gets too large — your call).

#### 3a. Props and state

```tsx
interface QuoteCalculatorProps {
  quote: Quote;                               // the quote being responded to
  onApply: (calc: QuoteCalculation) => void; // called when partner clicks "Usar este precio"
  onClose: () => void;
}

function QuoteCalculator({ quote, onApply, onClose }: QuoteCalculatorProps) {
  const [basePricePerPerson, setBasePricePerPerson] = useState(0);
  const [baseTourId, setBaseTourId] = useState<string | undefined>(undefined);
  const [costLines, setCostLines] = useState<CostLine[]>([]);
  const [marginPercent, setMarginPercent] = useState<number | "">("");
  // pax comes from quote.pax
}
```

#### 3b. Computed values (derive on every render, no useEffect needed)

```ts
const pax = quote.pax;

// For each costLine:
const computeLine = (line: CostLine) => {
  if (line.splitMode === "fixed") {
    return { contribution: line.amount, absorbed: 0, perPax: line.amount / pax };
  }
  const effectiveCapacity = Math.max(line.minCapacity ?? pax, pax);
  const costPerSeat = line.amount / effectiveCapacity;
  const contribution = costPerSeat * pax;
  const absorbed = line.amount - contribution;
  return { contribution, absorbed, perPax: costPerSeat };
};

const baseTotal = basePricePerPerson * pax;
const linesTotal = costLines.reduce((s, l) => s + computeLine(l).contribution, 0);
const totalCost = baseTotal + linesTotal;
const totalAbsorbed = costLines.reduce((s, l) => s + computeLine(l).absorbed, 0);
const margin = typeof marginPercent === "number" ? marginPercent : 0;
const totalWithMargin = totalCost * (1 + margin / 100);
const pricePerPerson = pax > 0 ? totalWithMargin / pax : 0;
```

#### 3c. Layout

The calculator renders as a panel (not a modal — render it inline below the quote detail, or as a wide drawer from the right). Use inline styles consistent with the project.

```
┌──────────────────────────────────────────────────────────┐
│ Calculadora de cotización                    [✕ Cerrar]  │
│ {quote.contact.name} · {quote.pax} personas              │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ PRECIO BASE                                              │
│ ┌────────────────────────────────────────────────────┐   │
│ │ Tour del catálogo (opcional):  [select tour ▾]     │   │
│ │ o precio base manual:          RD$ [________]  /p  │   │
│ │ Subtotal base: {pax} pax × RD${base} = RD${total} │   │
│ └────────────────────────────────────────────────────┘   │
│                                                          │
│ COSTOS VARIABLES                          [+ Agregar]    │
│ ┌────────────────────────────────────────────────────┐   │
│ │ [Descripción____________] [÷pax▾] RD$[_______]    │   │
│ │ Cap. mínima: [___]p  →  RD$X/p × {pax}p = RD$Y   │   │
│ │ ⚠️ Absorbe RD$Z por asientos vacíos     [✕]        │   │
│ └────────────────────────────────────────────────────┘   │
│ (repeat for each cost line)                              │
│                                                          │
│ MARGEN RANDOM TRIPS                                      │
│ Margen: [___]%    Sobre costo total: RD${totalCost}     │
│                                                          │
│ ══════════════════════════════════════════════════════   │
│ Costo total sin margen:        RD$ {totalCost}           │
│ Margen ({margin}%):          + RD$ {totalWithMargin - totalCost} │
│ ──────────────────────────────────────────────────────   │
│ PRECIO TOTAL:                  RD$ {totalWithMargin}     │
│ Por persona ({pax} pax):       RD$ {pricePerPerson}      │
│                                                          │
│ {totalAbsorbed > 0 && (                                  │
│   ⚠️ Costo absorbido (cap. mínima): RD$ {totalAbsorbed}  │
│ )}                                                       │
│                                                          │
│           [Cancelar]    [Usar este precio →]             │
└──────────────────────────────────────────────────────────┘
```

#### 3d. Tour base selector

When partner selects a tour from the dropdown, auto-fill `basePricePerPerson`:
```ts
const handleTourSelect = (tourId: string) => {
  setBaseTourId(tourId);
  const tour = findTour(tourId);
  if (!tour) return;
  const pm = tour.pricingModel;
  if (pm.type === "fixedPerPerson") setBasePricePerPerson(pm.pricePerPerson);
  if (pm.type === "tieredPerPax") {
    // Find closest tier to quote.pax
    const tier = pm.tiers.find(t => t.pax === pax)
      ?? pm.tiers.reduce((prev, curr) =>
        Math.abs(curr.pax - pax) < Math.abs(prev.pax - pax) ? curr : prev
      );
    setBasePricePerPerson(tier.pricePerPerson);
  }
  if (pm.type === "fixedGroup") setBasePricePerPerson(pm.totalPrice / pax);
};
```

The partner can always override the auto-filled price manually.

#### 3e. Adding and removing cost lines

```ts
const addLine = () => setCostLines(prev => [
  ...prev,
  { id: Date.now().toString(), description: "", amount: 0, splitMode: "perPax" }
]);

const updateLine = (id: string, patch: Partial<CostLine>) =>
  setCostLines(prev => prev.map(l => l.id === id ? { ...l, ...patch } : l));

const removeLine = (id: string) =>
  setCostLines(prev => prev.filter(l => l.id !== id));
```

#### 3f. The "Usar este precio" button

Builds the `QuoteCalculation` object and calls `onApply`:

```ts
const handleApply = () => {
  if (typeof marginPercent !== "number") return; // require margin to be set
  const calc: QuoteCalculation = {
    baseTourId,
    basePricePerPerson,
    costLines,
    marginPercent,
    pax,
    totalCost,
    totalWithMargin,
    pricePerPerson,
    absorbedCost: totalAbsorbed,
    calculatedAt: new Date().toISOString(),
  };
  onApply(calc);
};
```

Disable the button if: `basePricePerPerson === 0 || marginPercent === ""`.

#### 3g. Min capacity warning

For each perPax cost line where `minCapacity` is set and `minCapacity > pax`, show a warning:

```tsx
{line.splitMode === "perPax" && line.minCapacity && line.minCapacity > pax && (
  <div style={{
    fontSize: 11, color: "#92400E",
    background: "#FEF3C7", border: "1px solid #FDE68A",
    borderRadius: 4, padding: "4px 8px", marginTop: 4,
    display: "flex", alignItems: "center", gap: 4,
  }}>
    <AlertTriangle size={11} />
    Cap. mínima {line.minCapacity}p · Costo absorbido por RT:
    <strong> {formatDOP(computeLine(line).absorbed)}</strong>
  </div>
)}
```

### Step 4 — Wire the calculator into the quote detail flow

**File: `src/app/components/pages/Cotizaciones.tsx`**

In the quote detail view (drawer or expanded row), add:

```tsx
const [showCalculator, setShowCalculator] = useState(false);
const [localProposedPrice, setLocalProposedPrice] = useState(quote.proposedPrice ?? 0);
const [localCalculation, setLocalCalculation] = useState(quote.calculation);
```

Add a button to open the calculator next to the "Precio propuesto" field:

```tsx
<FormField label="Precio propuesto">
  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
    <input
      type="number"
      value={localProposedPrice}
      onChange={e => setLocalProposedPrice(Number(e.target.value))}
      style={{ flex: 1, /* existing input styles */ }}
    />
    <span style={{ fontSize: 12, color: "#475569" }}>DOP</span>
    <Btn variant="secondary" onClick={() => setShowCalculator(true)}>
      🧮 Calculadora
    </Btn>
  </div>
  {localCalculation && (
    <div style={{ fontSize: 11, color: "#64748B", marginTop: 4 }}>
      Calculado el {new Date(localCalculation.calculatedAt).toLocaleDateString("es-DO")}
      · {localCalculation.costLines.length} línea(s) de costo
      · Margen {localCalculation.marginPercent}%
    </div>
  )}
</FormField>
```

When calculator calls `onApply(calc)`:

```ts
const handleCalculatorApply = (calc: QuoteCalculation) => {
  setLocalProposedPrice(Math.round(calc.totalWithMargin));
  setLocalCalculation(calc);
  setShowCalculator(false);
};
```

The `localCalculation` gets saved with the quote when "Enviar cotización" is clicked:

```ts
// In the save/send handler:
const updatedQuote: Quote = {
  ...quote,
  status: "sent",
  proposedPrice: localProposedPrice,
  calculation: localCalculation ?? undefined,
  respondedAt: new Date().toISOString(),
};
// Update in local QUOTES state
```

### Step 5 — Show breakdown in quote detail (read-only mode for sent quotes)

When a quote already has `calculation` (status = "sent", "accepted", "rejected"), show a read-only breakdown summary in the detail view:

```tsx
{quote.calculation && (
  <div style={{ background: "#F7F8FA", borderRadius: 8, padding: 14, marginTop: 12 }}>
    <div style={{ fontSize: 12, fontWeight: 600, color: "#0F172A", marginBottom: 8 }}>
      Desglose del precio
    </div>
    <div style={{ fontSize: 12, color: "#475569", display: "flex", flexDirection: "column", gap: 4 }}>
      <div>Base: RD$ {quote.calculation.basePricePerPerson.toLocaleString()}/p × {quote.calculation.pax}p</div>
      {quote.calculation.costLines.map(l => (
        <div key={l.id}>
          {l.description}: {l.splitMode === "fixed" ? "fijo" : `÷${l.minCapacity ?? quote.calculation!.pax}p`}
          · RD$ {l.amount.toLocaleString()}
        </div>
      ))}
      <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: 4, marginTop: 4 }}>
        Margen RT: {quote.calculation.marginPercent}%
      </div>
      <div style={{ fontWeight: 600, color: "#0F172A" }}>
        Total: {formatDOP(quote.calculation.totalWithMargin)}
        · {formatDOP(quote.calculation.pricePerPerson)}/p
      </div>
      {quote.calculation.absorbedCost > 0 && (
        <div style={{ color: "#92400E", fontSize: 11 }}>
          ⚠️ Costo absorbido (cap. mínima): {formatDOP(quote.calculation.absorbedCost)}
        </div>
      )}
    </div>
  </div>
)}
```

---

## Validation

```bash
pnpm typecheck
pnpm build
```

Visual with `pnpm dev` — switch to Socio role:

- [ ] Open a pending quote → "Precio propuesto" field shows "🧮 Calculadora" button
- [ ] Click "Calculadora" → calculator panel opens
- [ ] Select a tour from dropdown → base price auto-fills from tour's pricingModel
- [ ] Clear tour selection → base price is editable manually
- [ ] Add a cost line "Transporte (guagua 15p)" · perPax · RD$16,000 · minCapacity 15 · pax 8
- [ ] Warning appears: "Cap. mínima 15p · Costo absorbido por RT: RD$ 7,467"
- [ ] Add a fixed cost line "Entrada Parque" · fixed · RD$4,800
- [ ] Set margin to 18%
- [ ] Summary updates live showing totalCost, margin amount, totalWithMargin, pricePerPerson
- [ ] Click "Usar este precio" → calculator closes, proposed price field updates to computed total
- [ ] Breakdown summary appears below the price field with date + line count + margin
- [ ] Click "Enviar cotización" → quote status changes to "sent"
- [ ] Re-open that quote → read-only breakdown shows all cost lines
- [ ] Admin role: same calculator available (not partner-only)
- [ ] `pnpm typecheck` passes

## Commit

```bash
git checkout -b feature/quote-calculator
git add -A
git commit -m "feat(cotizaciones): add variable cost calculator to quote response flow

- Add CostLine, QuoteCalculation types to types.ts
- Add calculation field to Quote interface
- Add example calculation to qt-002 in realData.ts
- Build QuoteCalculator component with:
  - Tour base price selector (auto-fills from pricingModel)
  - Variable cost lines (perPax with minCapacity, or fixed)
  - Min capacity warning showing absorbed cost
  - Adjustable margin % per quote
  - Live calculation of totalCost, margin, pricePerPerson
- Wire calculator into quote detail: 🧮 button → panel → apply to proposed price
- Save QuoteCalculation breakdown permanently with quote on send
- Show read-only breakdown for sent/accepted/rejected quotes"

git push -u origin feature/quote-calculator
```

## Notes for Claude Code

- **The calculator is inline, not a Modal.** Render it as a collapsible panel below the quote detail section. When `showCalculator` is true, it expands. This keeps the user in context without losing the quote details.
- **All computation is synchronous** — no API calls, no useEffect for calculations. Derive everything from state on each render.
- **The QUOTES array in realData is a const** — to simulate saving, use a local `useState` copy of QUOTES in Cotizaciones.tsx (it likely already does this). The `calculation` field gets added to the quote object in that local state.
- **Don't add nanoid or uuid library** — use `Date.now().toString()` for cost line IDs. Fine for local state.
- **The margin field starts empty** (no default). Partner must explicitly enter a margin before "Usar este precio" is enabled. This is intentional — margin is a business decision, not a default.
- **formatDOP is already in realData.ts** — import and use it for all monetary display.
- **Min capacity field** only appears when `splitMode === "perPax"`. Hide it when `splitMode === "fixed"`.
