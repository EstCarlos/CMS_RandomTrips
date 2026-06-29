import { useState } from "react";
import { Plus, Trash2, AlertTriangle, X, Calculator } from "lucide-react";
import { Btn } from "../ui/Modal";
import type { Quote, CostLine, QuoteCalculation } from "../../data/types";
import { TOURS_DATA, findTour, formatDOP } from "../../data/realData";

interface QuoteCalculatorProps {
  quote: Quote;
  onApply: (calc: QuoteCalculation) => void;
  onClose: () => void;
}

const LABEL: React.CSSProperties = {
  fontSize: 11, fontWeight: 600, color: "#94A3B8",
  textTransform: "uppercase", letterSpacing: "0.06em",
};

const inputBase: React.CSSProperties = {
  padding: "8px 12px", border: "1px solid #E5E7EB", borderRadius: 6,
  fontSize: 13, outline: "none", fontFamily: "Inter, sans-serif", boxSizing: "border-box",
};

export function QuoteCalculator({ quote, onApply, onClose }: QuoteCalculatorProps) {
  const pax = quote.pax;

  const [basePricePerPerson, setBasePricePerPerson] = useState<number>(quote.calculation?.basePricePerPerson ?? 0);
  const [baseTourId, setBaseTourId] = useState<string | undefined>(quote.calculation?.baseTourId);
  const [costLines, setCostLines] = useState<CostLine[]>(quote.calculation?.costLines ?? []);
  const [marginPercent, setMarginPercent] = useState<number | "">(quote.calculation?.marginPercent ?? "");

  /* ── Computed values (derived on every render) ─────────── */
  const computeLine = (line: CostLine) => {
    if (line.splitMode === "fixed") {
      return { contribution: line.amount, absorbed: 0, perPax: pax > 0 ? line.amount / pax : 0 };
    }
    const effectiveCapacity = Math.max(line.minCapacity ?? pax, pax);
    const costPerSeat = effectiveCapacity > 0 ? line.amount / effectiveCapacity : 0;
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
  const marginAmount = totalWithMargin - totalCost;

  /* ── Tour base selector ────────────────────────────────── */
  const handleTourSelect = (tourId: string) => {
    if (!tourId) { setBaseTourId(undefined); return; }
    setBaseTourId(tourId);
    const tour = findTour(tourId);
    if (!tour) return;
    const pm = tour.pricingModel;
    if (pm.type === "fixedPerPerson" && pm.pricePerPerson != null) {
      setBasePricePerPerson(pm.pricePerPerson);
    }
    if (pm.type === "tieredPerPax" && pm.tiers && pm.tiers.length > 0) {
      const tier = pm.tiers.find(t => t.pax === pax)
        ?? pm.tiers.reduce((prev, curr) =>
          Math.abs(curr.pax - pax) < Math.abs(prev.pax - pax) ? curr : prev
        );
      setBasePricePerPerson(tier.pricePerPerson);
    }
    if (pm.type === "fixedGroup" && pm.totalPrice != null && pax > 0) {
      setBasePricePerPerson(Math.round(pm.totalPrice / pax));
    }
  };

  /* ── Cost line CRUD ────────────────────────────────────── */
  const addLine = () => setCostLines(prev => [
    ...prev,
    { id: Date.now().toString(), description: "", amount: 0, splitMode: "perPax" },
  ]);

  const updateLine = (id: string, patch: Partial<CostLine>) =>
    setCostLines(prev => prev.map(l => l.id === id ? { ...l, ...patch } : l));

  const removeLine = (id: string) =>
    setCostLines(prev => prev.filter(l => l.id !== id));

  /* ── Apply ─────────────────────────────────────────────── */
  const canApply = basePricePerPerson > 0 && typeof marginPercent === "number";

  const handleApply = () => {
    if (typeof marginPercent !== "number") return;
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

  return (
    <div style={{
      background: "#FFFFFF", border: "2px solid #006CFE", borderRadius: 10,
      overflow: "hidden", fontFamily: "Inter, sans-serif",
    }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 18px", background: "#EFF6FF", borderBottom: "1px solid #BFDBFE",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Calculator size={16} color="#006CFE" />
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>Calculadora de cotización</div>
            <div style={{ fontSize: 12, color: "#475569" }}>
              {quote.contact.name ?? "—"} · {pax} {pax === 1 ? "persona" : "personas"}
            </div>
          </div>
        </div>
        <button onClick={onClose} style={{
          display: "flex", alignItems: "center", gap: 4,
          border: "1px solid #BFDBFE", background: "#FFFFFF", borderRadius: 6,
          padding: "5px 10px", cursor: "pointer", fontSize: 12, color: "#475569",
        }}>
          <X size={13} /> Cerrar
        </button>
      </div>

      <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 20 }}>
        {/* ── PRECIO BASE ─────────────────────────────────── */}
        <section>
          <div style={{ ...LABEL, marginBottom: 8 }}>Precio base</div>
          <div style={{ background: "#F7F8FA", borderRadius: 8, padding: 14, display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, color: "#475569", display: "block", marginBottom: 4 }}>
                  Tour del catálogo (opcional)
                </label>
                <select
                  value={baseTourId ?? ""}
                  onChange={e => handleTourSelect(e.target.value)}
                  style={{ ...inputBase, width: "100%" }}
                >
                  <option value="">— Sin tour base —</option>
                  {TOURS_DATA.map(t => (
                    <option key={t.id} value={t.id}>{t.title.es}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, color: "#475569", display: "block", marginBottom: 4 }}>
                  Precio base manual (RD$ /persona)
                </label>
                <input
                  type="number"
                  value={basePricePerPerson || ""}
                  onChange={e => { setBasePricePerPerson(Number(e.target.value)); setBaseTourId(undefined); }}
                  placeholder="0"
                  style={{ ...inputBase, width: "100%" }}
                />
              </div>
            </div>
            <div style={{ fontSize: 12, color: "#475569", display: "flex", justifyContent: "space-between", borderTop: "1px solid #E5E7EB", paddingTop: 10 }}>
              <span>Subtotal base: {pax} pax × {formatDOP(basePricePerPerson)}</span>
              <strong style={{ color: "#0F172A" }}>{formatDOP(baseTotal)}</strong>
            </div>
          </div>
        </section>

        {/* ── COSTOS VARIABLES ────────────────────────────── */}
        <section>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <div style={LABEL}>Costos variables</div>
            <Btn variant="secondary" size="sm" onClick={addLine}>
              <Plus size={13} /> Agregar
            </Btn>
          </div>

          {costLines.length === 0 ? (
            <div style={{
              textAlign: "center", padding: "18px", background: "#F7F8FA",
              borderRadius: 8, fontSize: 12, color: "#94A3B8",
            }}>
              Sin costos variables. Agrega transporte, entradas, guías, etc.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {costLines.map(line => {
                const c = computeLine(line);
                const showAbsorbed = line.splitMode === "perPax" && line.minCapacity != null && line.minCapacity > pax;
                return (
                  <div key={line.id} style={{
                    border: "1px solid #E5E7EB", borderRadius: 8, padding: 12,
                    display: "flex", flexDirection: "column", gap: 8,
                  }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                      <input
                        value={line.description}
                        onChange={e => updateLine(line.id, { description: e.target.value })}
                        placeholder="Descripción (ej. Transporte guagua 15p)"
                        style={{ ...inputBase, flex: 1 }}
                      />
                      <select
                        value={line.splitMode}
                        onChange={e => updateLine(line.id, { splitMode: e.target.value as CostLine["splitMode"] })}
                        style={{ ...inputBase, width: 120, flexShrink: 0 }}
                      >
                        <option value="perPax">÷ por pax</option>
                        <option value="fixed">Fijo</option>
                      </select>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                        <span style={{ fontSize: 12, color: "#94A3B8" }}>RD$</span>
                        <input
                          type="number"
                          value={line.amount || ""}
                          onChange={e => updateLine(line.id, { amount: Number(e.target.value) })}
                          placeholder="0"
                          style={{ ...inputBase, width: 110 }}
                        />
                      </div>
                      <button
                        onClick={() => removeLine(line.id)}
                        title="Eliminar línea"
                        style={{
                          width: 34, height: 34, flexShrink: 0, borderRadius: 6,
                          border: "1px solid #E5E7EB", background: "#FFFFFF", cursor: "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}
                      >
                        <Trash2 size={14} color="#F13540" />
                      </button>
                    </div>

                    {/* perPax: min capacity + breakdown */}
                    {line.splitMode === "perPax" && (
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 12, color: "#475569" }}>Cap. mínima:</span>
                          <input
                            type="number"
                            value={line.minCapacity ?? ""}
                            onChange={e => updateLine(line.id, { minCapacity: e.target.value === "" ? undefined : Number(e.target.value) })}
                            placeholder={String(pax)}
                            style={{ ...inputBase, width: 64, textAlign: "center", padding: "5px 8px" }}
                          />
                          <span style={{ fontSize: 12, color: "#475569" }}>p</span>
                        </div>
                        <span style={{ fontSize: 12, color: "#94A3B8" }}>
                          → {formatDOP(Math.round(c.perPax))}/p × {pax}p = <strong style={{ color: "#0F172A" }}>{formatDOP(Math.round(c.contribution))}</strong>
                        </span>
                      </div>
                    )}
                    {line.splitMode === "fixed" && (
                      <span style={{ fontSize: 12, color: "#94A3B8" }}>
                        → Costo fijo total: <strong style={{ color: "#0F172A" }}>{formatDOP(line.amount)}</strong>
                      </span>
                    )}

                    {/* Min capacity warning */}
                    {showAbsorbed && (
                      <div style={{
                        fontSize: 11, color: "#92400E",
                        background: "#FEF3C7", border: "1px solid #FDE68A",
                        borderRadius: 4, padding: "4px 8px",
                        display: "flex", alignItems: "center", gap: 4,
                      }}>
                        <AlertTriangle size={11} />
                        Cap. mínima {line.minCapacity}p · Costo absorbido por RT:
                        <strong>&nbsp;{formatDOP(Math.round(c.absorbed))}</strong>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ── MARGEN ──────────────────────────────────────── */}
        <section>
          <div style={{ ...LABEL, marginBottom: 8 }}>Margen Random Trips</div>
          <div style={{ background: "#F7F8FA", borderRadius: 8, padding: 14, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12, color: "#475569" }}>Margen:</span>
              <input
                type="number"
                value={marginPercent}
                onChange={e => setMarginPercent(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="—"
                style={{ ...inputBase, width: 72, textAlign: "center" }}
              />
              <span style={{ fontSize: 13, color: "#475569" }}>%</span>
            </div>
            <span style={{ fontSize: 12, color: "#94A3B8" }}>
              Sobre costo total: <strong style={{ color: "#0F172A" }}>{formatDOP(Math.round(totalCost))}</strong>
            </span>
          </div>
        </section>

        {/* ── TOTALS ──────────────────────────────────────── */}
        <section style={{ background: "#0F172A", borderRadius: 10, padding: 16, color: "#FFFFFF" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#CBD5E1", marginBottom: 6 }}>
            <span>Costo total sin margen</span>
            <span>{formatDOP(Math.round(totalCost))}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#CBD5E1", marginBottom: 10 }}>
            <span>Margen ({margin}%)</span>
            <span>+ {formatDOP(Math.round(marginAmount))}</span>
          </div>
          <div style={{ borderTop: "1px solid #334155", paddingTop: 10, display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
            <span style={{ fontSize: 14, fontWeight: 700 }}>Precio total</span>
            <span style={{ fontSize: 20, fontWeight: 800 }}>{formatDOP(Math.round(totalWithMargin))}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#94A3B8" }}>
            <span>Por persona ({pax} pax)</span>
            <span style={{ fontWeight: 600, color: "#FFFFFF" }}>{formatDOP(Math.round(pricePerPerson))}/p</span>
          </div>

          {totalAbsorbed > 0 && (
            <div style={{
              marginTop: 12, fontSize: 12,
              background: "rgba(254,243,199,.12)", border: "1px solid #92400E",
              borderRadius: 6, padding: "6px 10px", color: "#FDE68A",
              display: "flex", alignItems: "center", gap: 6,
            }}>
              <AlertTriangle size={12} />
              Costo absorbido (cap. mínima): <strong>{formatDOP(Math.round(totalAbsorbed))}</strong>
            </div>
          )}
        </section>

        {/* ── Actions ─────────────────────────────────────── */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <Btn variant="secondary" onClick={onClose}>Cancelar</Btn>
          <Btn variant="primary" onClick={handleApply} disabled={!canApply}>
            Usar este precio →
          </Btn>
        </div>
        {!canApply && (
          <div style={{ fontSize: 11, color: "#94A3B8", textAlign: "right", marginTop: -12 }}>
            Define un precio base y un margen para continuar.
          </div>
        )}
      </div>
    </div>
  );
}
