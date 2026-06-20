import { useState } from "react";
import {
  ArrowLeft, Eye, Copy, Save, Globe,
  Plus, Trash2, GripVertical, X, Upload, Image,
  ChevronUp, ChevronDown, Check, Search, MapPin, Clock, AlertTriangle,
} from "lucide-react";
import { FormField, Input, Textarea, SelectField, BilingualField } from "../ui/FormField";
import { StatusBadge } from "../ui/StatusBadge";
import { Btn } from "../ui/Modal";
import type { Tour, Day, DayAlternative, TourType, PricingModelType, Tier } from "../../data/types";
import {
  TOURS_DATA, SERVICE_CATALOG, DESTINATIONS, EXPERIENCES,
  MEDIA_ASSETS, SITE_CONFIG, OPERATORS, formatDOP, dopToUSD, dopToEUR,
  findDestination,
} from "../../data/realData";

/* ── All tabs (Itinerario only for multiDay) ─────────── */
const ALL_TABS = [
  { id: "info",         label: "Información básica", forTipo: null       },
  { id: "pricing",      label: "Pricing",             forTipo: null       },
  { id: "experiencias", label: "Experiencias",         forTipo: null       },
  { id: "destinos",     label: "Destinos",             forTipo: null       },
  { id: "itinerario",   label: "Itinerario",           forTipo: "multiDay" },
  { id: "servicios",    label: "Servicios incluidos",  forTipo: null       },
  { id: "detalles",     label: "Detalles",             forTipo: null       },
  { id: "logistica",    label: "Logística",            forTipo: null       },
  { id: "galeria",      label: "Galería",              forTipo: null       },
  { id: "seo",          label: "SEO",                  forTipo: null       },
] as const;

/* ── Small shared chip select ─────────────────────────── */
function ChipSelect({ options, value, onChange }: { options: string[]; value: string[]; onChange: (v: string[]) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 5 }}>
        {value.map(v => (
          <span key={v} style={{ display: "inline-flex", alignItems: "center", gap: 3, padding: "2px 8px", borderRadius: 20, background: "#EFF6FF", border: "1px solid #BFDBFE", fontSize: 12, color: "#1D4ED8" }}>
            {v}
            <button onClick={() => onChange(value.filter(x => x !== v))} style={{ border: "none", background: "transparent", cursor: "pointer", padding: 0, display: "flex" }}>
              <X size={10} color="#94A3B8" />
            </button>
          </span>
        ))}
        <button onClick={() => setOpen(!open)} style={{ display: "inline-flex", alignItems: "center", gap: 3, padding: "2px 8px", borderRadius: 20, border: "1px dashed #CBD5E1", background: "transparent", fontSize: 12, color: "#94A3B8", cursor: "pointer" }}>
          <Plus size={10} /> Agregar
        </button>
      </div>
      {open && (
        <div style={{ border: "1px solid #E5E7EB", borderRadius: 6, overflow: "hidden", background: "#FFFFFF", boxShadow: "0 4px 12px rgba(0,0,0,.08)", maxHeight: 160, overflowY: "auto" }}>
          {options.filter(o => !value.includes(o)).map(o => (
            <button key={o} onClick={() => { onChange([...value, o]); setOpen(false); }}
              style={{ display: "block", width: "100%", textAlign: "left", padding: "7px 12px", border: "none", background: "transparent", fontSize: 13, color: "#0F172A", cursor: "pointer" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#F7F8FA")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   TAB 1 — Información básica
══════════════════════════════════════════════════════════ */
function TabInfo({ tour, onChange }: { tour: Tour; onChange: (k: keyof Tour, v: unknown) => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <FormField label="Título del tour" required>
        <BilingualField value={tour.title} onChange={v => onChange("title", v)} placeholder="Nombre del tour..." />
      </FormField>
      <FormField label="Descripción corta" required>
        <BilingualField value={tour.description} onChange={v => onChange("description", v)} multiline rows={3} placeholder="Resumen breve..." />
      </FormField>
      <FormField label="Slug (URL)" helper="Se genera automáticamente del título ES">
        <Input value={tour.slug} onChange={v => onChange("slug", v)} placeholder="nombre-del-tour" />
      </FormField>

      {/* Tipo de tour */}
      <div>
        <label style={{ fontSize: 12, fontWeight: 600, color: "#0F172A", display: "block", marginBottom: 8 }}>
          Tipo de tour <span style={{ color: "#F13540" }}>*</span>
        </label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {([
            { id: "singleDay"      as TourType, icon: "🎯", title: "Fijo",      desc: "Tour de 1 día, precio cerrado" },
            { id: "multiDay"       as TourType, icon: "🗓️", title: "Multi-día", desc: "Paquete de varios días, con o sin opciones por día" },
            { id: "privateRequest" as TourType, icon: "📩", title: "Privado",   desc: "Solo formulario de cotización" },
          ]).map(t => {
            const active = tour.type === t.id;
            return (
              <button key={t.id} onClick={() => onChange("type", t.id)}
                style={{ padding: "14px 16px", borderRadius: 8, textAlign: "left", cursor: "pointer", border: `2px solid ${active ? "#006CFE" : "#E5E7EB"}`, background: active ? "#EFF6FF" : "#FFFFFF", transition: "all 0.12s" }}>
                <div style={{ fontSize: 20, marginBottom: 6 }}>{t.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: active ? "#006CFE" : "#0F172A" }}>{t.title}</div>
                <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>{t.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      <FormField label="Categorías">
        <ChipSelect options={["Naturaleza & Aventura", "Playa & Snorkel", "Senderismo", "Cultural", "Ecoturismo", "Multi-destino", "Gastronómica"]} value={tour.categories} onChange={v => onChange("categories", v)} />
      </FormField>
      <FormField label="Tags">
        <ChipSelect options={["amanecer", "montaña", "río", "turquesa", "aventura", "familia", "7 días", "multi-destino", "grupos"]} value={tour.tags} onChange={v => onChange("tags", v)} />
      </FormField>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   TAB 2 — Pricing  (3 modos)
══════════════════════════════════════════════════════════ */
function TabPricing({ tour, onChange }: { tour: Tour; onChange: (k: keyof Tour, v: unknown) => void }) {
  const pm = tour.pricingModel;
  const mode = pm.type;
  const setMode = (m: PricingModelType) => onChange("pricingModel", { ...pm, type: m });
  const [calcPax, setCalcPax] = useState(pm.basePax ?? 4);

  /* ── tiered helpers ── */
  const tiers: Tier[]  = pm.tiers ?? [];
  const basePax        = pm.basePax ?? 10;
  const minPax         = tiers.length > 0 ? Math.min(...tiers.map(t => t.pax)) : 0;
  const maxPax         = tiers.length > 0 ? Math.max(...tiers.map(t => t.pax)) : 0;
  const outOfRange     = calcPax < minPax || calcPax > maxPax;

  const getPricedTier = (pax: number): number | null => {
    const t = tiers.find(t => t.pax === pax);
    return t ? t.pricePerPerson : null;
  };
  const tieredPPP = getPricedTier(calcPax);
  const tieredTotal = tieredPPP ? tieredPPP * calcPax : null;

  const updateTier = (idx: number, field: keyof Tier, val: number) => {
    const next = tiers.map((t, i) => i === idx ? { ...t, [field]: val } : t);
    onChange("pricingModel", { ...pm, tiers: next.sort((a, b) => a.pax - b.pax) });
  };
  const addTier = () => {
    const next = [...tiers, { pax: maxPax + 1, pricePerPerson: 0 }].sort((a, b) => a.pax - b.pax);
    onChange("pricingModel", { ...pm, tiers: next });
  };
  const removeTier = (idx: number) => {
    onChange("pricingModel", { ...pm, tiers: tiers.filter((_, i) => i !== idx) });
  };

  /* ── fixedGroup helpers ── */
  const groupTotal = pm.totalPrice ?? 0;
  const groupMax   = pm.maxPaxGroup ?? 0;
  const perCapita  = groupMax > 0 ? Math.round(groupTotal / groupMax) : 0;

  /* ── fixedPerPerson ── */
  const ppp = pm.pricePerPerson ?? 0;
  const totalFijo = ppp * calcPax;
  const depositTotal = tour.depositFixedAmount * calcPax;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Mode selector */}
      <div>
        <label style={{ fontSize: 12, fontWeight: 600, color: "#0F172A", display: "block", marginBottom: 10 }}>Modo de precio</label>
        <div style={{ display: "flex", gap: 8 }}>
          {([
            { id: "fixedPerPerson" as PricingModelType, icon: "💰", label: "Por persona"     },
            { id: "tieredPerPax"   as PricingModelType, icon: "📊", label: "Tiered por pax"  },
            { id: "fixedGroup"     as PricingModelType, icon: "👥", label: "Grupo cerrado"   },
          ]).map(m => (
            <button key={m.id} onClick={() => setMode(m.id)} style={{
              flex: 1, padding: "10px 8px", borderRadius: 8, cursor: "pointer",
              border: `2px solid ${mode === m.id ? "#006CFE" : "#E5E7EB"}`,
              background: mode === m.id ? "#EFF6FF" : "#FFFFFF",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
            }}>
              <span style={{ fontSize: 18 }}>{m.icon}</span>
              <span style={{ fontSize: 12, fontWeight: mode === m.id ? 700 : 400, color: mode === m.id ? "#006CFE" : "#475569" }}>{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── fixedPerPerson ── */}
      {mode === "fixedPerPerson" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <FormField label="Precio por persona (DOP)" required>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ display: "flex", border: "1px solid #E5E7EB", borderRadius: 6, overflow: "hidden" }}>
                <span style={{ padding: "8px 10px", background: "#F7F8FA", borderRight: "1px solid #E5E7EB", fontSize: 13, color: "#475569", fontWeight: 600 }}>RD$</span>
                <input type="number" value={ppp}
                  onChange={e => onChange("pricingModel", { ...pm, pricePerPerson: Number(e.target.value) })}
                  style={{ width: 100, padding: "8px 12px", border: "none", outline: "none", fontSize: 15, fontWeight: 700 }}
                />
              </div>
              <div style={{ padding: "8px 12px", background: "#F0FDF4", borderRadius: 6, border: "1px solid #86EFAC", fontSize: 12, color: "#15803D" }}>
                ≈ ${dopToUSD(ppp)} USD · €{dopToEUR(ppp)} EUR
              </div>
            </div>
          </FormField>

          {/* Live calculator */}
          <PaxCalculator calcPax={calcPax} setCalcPax={setCalcPax} total={totalFijo} deposit={depositTotal} />
        </div>
      )}

      {/* ── tieredPerPax ── */}
      {mode === "tieredPerPax" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 12, alignItems: "end" }}>
            <FormField label="Pax base" helper="Cantidad sobre la que se muestra el precio principal">
              <input type="number" value={basePax}
                onChange={e => onChange("pricingModel", { ...pm, basePax: Number(e.target.value) })}
                style={{ width: "100%", padding: "8px 12px", border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 14, fontWeight: 700, outline: "none", textAlign: "center", boxSizing: "border-box" }}
              />
            </FormField>
            <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#94A3B8", paddingBottom: 8, alignItems: "center" }}>
              <span>Rango: <strong style={{ color: "#0F172A" }}>{minPax} – {maxPax} pax</strong> (derivado de los tiers)</span>
              <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", color: "#475569" }}>
                <input type="checkbox" checked={pm.itbisIncluded ?? false}
                  onChange={e => onChange("pricingModel", { ...pm, itbisIncluded: e.target.checked })}
                  style={{ width: 15, height: 15, accentColor: "#006CFE", cursor: "pointer" }}
                />
                Incluye ITBIS 18%
              </label>
            </div>
          </div>

          {/* Tiers table */}
          <div style={{ border: "1px solid #E5E7EB", borderRadius: 8, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "80px 1fr 100px auto", borderBottom: "1px solid #E5E7EB", background: "#F7F8FA" }}>
              {["Pax", "Precio / persona (RD$)", "USD", ""].map((h, hi) => (
                <div key={hi} style={{ padding: "8px 12px", fontSize: 10, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</div>
              ))}
            </div>
            {tiers.map((t, i) => {
              const isBase = t.pax === basePax;
              return (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "80px 1fr 100px auto", borderBottom: i < tiers.length - 1 ? "1px solid #F1F5F9" : "none", background: isBase ? "#EFF6FF" : "transparent", alignItems: "center" }}>
                  <div style={{ padding: "4px 12px", display: "flex", alignItems: "center", gap: 5 }}>
                    <input type="number" value={t.pax}
                      onChange={e => updateTier(i, "pax", Number(e.target.value))}
                      style={{ width: "100%", padding: "6px 8px", border: "1px solid #E5E7EB", borderRadius: 5, fontSize: 13, outline: "none", textAlign: "center", fontWeight: isBase ? 700 : 400, background: isBase ? "#EFF6FF" : "#FFFFFF" }}
                    />
                    {isBase && <span style={{ fontSize: 9, fontWeight: 700, color: "#006CFE", background: "#BFDBFE", padding: "1px 4px", borderRadius: 3, whiteSpace: "nowrap" }}>BASE</span>}
                  </div>
                  <div style={{ padding: "4px 12px" }}>
                    <input type="number" value={t.pricePerPerson}
                      onChange={e => updateTier(i, "pricePerPerson", Number(e.target.value))}
                      style={{ width: "100%", padding: "6px 8px", border: "1px solid #E5E7EB", borderRadius: 5, fontSize: 13, outline: "none", fontVariantNumeric: "tabular-nums", fontWeight: isBase ? 700 : 400, background: isBase ? "#EFF6FF" : "#FFFFFF", boxSizing: "border-box" }}
                    />
                  </div>
                  <div style={{ padding: "4px 12px", fontSize: 12, color: "#94A3B8" }}>≈ ${dopToUSD(t.pricePerPerson)}</div>
                  <div style={{ padding: "4px 12px" }}>
                    {t.pax !== basePax && (
                      <button onClick={() => removeTier(i)} style={{ width: 24, height: 24, borderRadius: 5, border: "1px solid #FEE2E2", background: "#FEF2F2", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Trash2 size={11} color="#F13540" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <button onClick={addTier} style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 6, border: "1px dashed #CBD5E1", background: "transparent", fontSize: 12, color: "#94A3B8", cursor: "pointer", width: "fit-content" }}>
            <Plus size={12} /> Agregar tier
          </button>

          {/* Out-of-range info */}
          <div style={{ padding: "12px 14px", background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 8, fontSize: 12, color: "#92400E", display: "flex", gap: 8 }}>
            <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>Para grupos fuera del rango <strong>{minPax}–{maxPax} pax</strong>, el cliente verá un mensaje invitándolo a solicitar cotización personalizada.</span>
          </div>

          {/* Tiered calculator */}
          <div style={{ background: "#EFF6FF", borderRadius: 8, padding: "16px", border: "1px solid #BFDBFE" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#1D4ED8", marginBottom: 12 }}>Vista previa de precio</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <span style={{ fontSize: 13, color: "#475569" }}>Para</span>
              <button onClick={() => setCalcPax(p => Math.max(1, p - 1))} style={{ width: 26, height: 26, borderRadius: 6, border: "1px solid #BFDBFE", background: "#FFFFFF", cursor: "pointer", fontSize: 16 }}>−</button>
              <span style={{ width: 32, textAlign: "center", fontSize: 18, fontWeight: 800, color: "#006CFE" }}>{calcPax}</span>
              <button onClick={() => setCalcPax(p => p + 1)} style={{ width: 26, height: 26, borderRadius: 6, border: "1px solid #BFDBFE", background: "#FFFFFF", cursor: "pointer", fontSize: 16 }}>+</button>
              <span style={{ fontSize: 13, color: "#475569" }}>personas</span>
            </div>

            {outOfRange ? (
              <div style={{ padding: "14px 16px", background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 8 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <AlertTriangle size={15} color="#F59E0B" style={{ flexShrink: 0, marginTop: 1 }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#92400E", marginBottom: 3 }}>Fuera del rango de capacidad</div>
                    <div style={{ fontSize: 12, color: "#92400E", lineHeight: 1.5 }}>Este paquete está disponible de <strong>{minPax}</strong> a <strong>{maxPax}</strong> personas. Para grupos diferentes, el cliente verá un mensaje invitándolo a solicitar cotización personalizada.</div>
                    <button style={{ marginTop: 8, fontSize: 11, color: "#006CFE", border: "none", background: "transparent", cursor: "pointer", padding: 0 }}>Ver mensaje al cliente →</button>
                  </div>
                </div>
              </div>
            ) : tieredPPP ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                {[
                  { label: "DOP", value: formatDOP(tieredTotal!) },
                  { label: "USD", value: `$${dopToUSD(tieredTotal!)}` },
                  { label: "EUR", value: `€${dopToEUR(tieredTotal!)}` },
                ].map(c => (
                  <div key={c.label} style={{ background: "#FFFFFF", borderRadius: 6, padding: "10px 14px", textAlign: "center", border: "1px solid #BFDBFE" }}>
                    <div style={{ fontSize: 10, color: "#94A3B8", marginBottom: 2 }}>{c.label}</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: "#006CFE", fontVariantNumeric: "tabular-nums" }}>{c.value}</div>
                    <div style={{ fontSize: 10, color: "#94A3B8" }}>{formatDOP(tieredPPP)}/p</div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: 12, color: "#94A3B8", textAlign: "center", padding: "10px 0" }}>
                Sin tier definido para {calcPax} pax. Agrega un tier con ese valor exacto.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── fixedGroup ── */}
      {mode === "fixedGroup" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <FormField label="Precio total del grupo (DOP)" required>
              <div style={{ display: "flex", border: "1px solid #E5E7EB", borderRadius: 6, overflow: "hidden" }}>
                <span style={{ padding: "8px 10px", background: "#F7F8FA", borderRight: "1px solid #E5E7EB", fontSize: 13, color: "#475569", fontWeight: 600 }}>RD$</span>
                <input type="number" value={groupTotal}
                  onChange={e => onChange("pricingModel", { ...pm, totalPrice: Number(e.target.value) })}
                  style={{ flex: 1, padding: "8px 12px", border: "none", outline: "none", fontSize: 14, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}
                />
              </div>
            </FormField>
            <FormField label="Pax máximo del grupo">
              <input type="number" value={groupMax}
                onChange={e => onChange("pricingModel", { ...pm, maxPaxGroup: Number(e.target.value) })}
                style={{ width: "100%", padding: "8px 12px", border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 14, fontWeight: 700, outline: "none", boxSizing: "border-box" }}
              />
            </FormField>
          </div>
          {perCapita > 0 && (
            <div style={{ padding: "12px 16px", background: "#F0FDF4", borderRadius: 8, border: "1px solid #86EFAC", fontSize: 13, color: "#15803D" }}>
              Precio por persona (grupo completo): <strong style={{ fontSize: 16 }}>{formatDOP(perCapita)}</strong> ≈ ${dopToUSD(perCapita)} USD · €{dopToEUR(perCapita)} EUR
            </div>
          )}
          <PaxCalculator calcPax={groupMax} setCalcPax={() => {}} total={groupTotal} deposit={tour.depositFixedAmount * groupMax} readOnly />
        </div>
      )}

      {/* Depósito fijo — always visible */}
      <div style={{ background: "#FFFBEB", borderRadius: 8, padding: "14px 16px", border: "1px solid #FDE68A" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#92400E", marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
          <AlertTriangle size={13} /> Depósito de apartado (monto fijo)
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 6 }}>
          <div style={{ display: "flex", border: "1px solid #FDE68A", borderRadius: 6, overflow: "hidden" }}>
            <span style={{ padding: "7px 10px", background: "#FFFBEB", borderRight: "1px solid #FDE68A", fontSize: 13, color: "#92400E", fontWeight: 600 }}>RD$</span>
            <input type="number" value={tour.depositFixedAmount}
              onChange={e => onChange("depositFixedAmount", Number(e.target.value))}
              style={{ width: 80, padding: "7px 10px", border: "none", outline: "none", fontSize: 14, fontWeight: 700, background: "#FFFBEB", fontVariantNumeric: "tabular-nums" }}
            />
            <span style={{ padding: "7px 10px", background: "#FFFBEB", borderLeft: "1px solid #FDE68A", fontSize: 13, color: "#92400E" }}>p/p</span>
          </div>
          <span style={{ fontSize: 12, color: "#92400E" }}>{SITE_CONFIG.paymentInfo.depositNote}</span>
        </div>
        <div style={{ fontSize: 11, color: "#A16207" }}>
          Banco: <strong>{SITE_CONFIG.paymentInfo.bank}</strong> · {SITE_CONFIG.paymentInfo.accountHolder} · Cta: {SITE_CONFIG.paymentInfo.accountNumber}
        </div>
      </div>
    </div>
  );
}

/* Live calculator helper */
function PaxCalculator({ calcPax, setCalcPax, total, deposit, readOnly = false }: {
  calcPax: number; setCalcPax: (n: number) => void;
  total: number; deposit: number; readOnly?: boolean;
}) {
  return (
    <div style={{ background: "#EFF6FF", borderRadius: 8, padding: "14px 16px", border: "1px solid #BFDBFE" }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: "#1D4ED8", marginBottom: 10 }}>Vista previa de precio</div>
      {!readOnly && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <span style={{ fontSize: 13, color: "#475569" }}>Para</span>
          <button onClick={() => setCalcPax(Math.max(1, calcPax - 1))} style={{ width: 26, height: 26, borderRadius: 6, border: "1px solid #BFDBFE", background: "#FFFFFF", cursor: "pointer", fontSize: 16 }}>−</button>
          <span style={{ width: 32, textAlign: "center", fontSize: 18, fontWeight: 800, color: "#006CFE" }}>{calcPax}</span>
          <button onClick={() => setCalcPax(calcPax + 1)} style={{ width: 26, height: 26, borderRadius: 6, border: "1px solid #BFDBFE", background: "#FFFFFF", cursor: "pointer", fontSize: 16 }}>+</button>
          <span style={{ fontSize: 13, color: "#475569" }}>personas</span>
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
        {[
          { label: "DOP", value: formatDOP(total) },
          { label: "USD", value: `$${dopToUSD(total)}` },
          { label: "EUR", value: `€${dopToEUR(total)}` },
        ].map(c => (
          <div key={c.label} style={{ background: "#FFFFFF", borderRadius: 6, padding: "10px 14px", textAlign: "center", border: "1px solid #BFDBFE" }}>
            <div style={{ fontSize: 10, color: "#94A3B8", marginBottom: 2 }}>{c.label}</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#006CFE", fontVariantNumeric: "tabular-nums" }}>{c.value}</div>
            <div style={{ fontSize: 10, color: "#94A3B8" }}>Depósito: {c.label === "DOP" ? formatDOP(deposit) : c.label === "USD" ? `$${dopToUSD(deposit)}` : `€${dopToEUR(deposit)}`}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   TAB 3 — Experiencias
══════════════════════════════════════════════════════════ */
function TabExperiencias({ tour, onChange }: { tour: Tour; onChange: (k: keyof Tour, v: unknown) => void }) {
  const [search, setSearch] = useState("");
  const selected = tour.experienceIds;
  const allExp = EXPERIENCES.map(e => ({
    id: e.id,
    label: e.name.es,
    sub: findDestination(e.destinationId)?.name.es ?? "",
    type: e.type,
  }));
  const filtered = allExp.filter(e => e.label.toLowerCase().includes(search.toLowerCase()) && !selected.includes(e.id));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center", border: "1px solid #E5E7EB", borderRadius: 6, padding: "6px 12px", background: "#FFFFFF" }}>
        <Search size={14} color="#94A3B8" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar experiencia del catálogo..."
          style={{ border: "none", outline: "none", fontSize: 13, flex: 1 }} />
      </div>
      {search && filtered.length > 0 && (
        <div style={{ border: "1px solid #E5E7EB", borderRadius: 6, overflow: "hidden", background: "#FFFFFF" }}>
          {filtered.map(e => (
            <button key={e.id} onClick={() => { onChange("experienceIds", [...selected, e.id]); setSearch(""); }}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "9px 14px", border: "none", background: "transparent", cursor: "pointer", fontSize: 13, textAlign: "left" }}
              onMouseEnter={f => (f.currentTarget.style.background = "#F7F8FA")}
              onMouseLeave={f => (f.currentTarget.style.background = "transparent")}
            >
              <div><div style={{ fontWeight: 500 }}>{e.label}</div><div style={{ fontSize: 11, color: "#94A3B8" }}>{e.sub} · {e.type}</div></div>
              <Plus size={13} color="#006CFE" />
            </button>
          ))}
        </div>
      )}
      {selected.length === 0 ? (
        <div style={{ padding: "24px", textAlign: "center", color: "#94A3B8", fontSize: 13, background: "#F7F8FA", borderRadius: 8 }}>Sin experiencias asignadas. Usa el buscador de arriba.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {selected.map((expId, i) => {
            const exp = EXPERIENCES.find(e => e.id === expId);
            if (!exp) return null;
            return (
              <div key={expId} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 6 }}>
                <GripVertical size={14} color="#CBD5E1" />
                <span style={{ width: 22, height: 22, borderRadius: "50%", background: "#EFF6FF", color: "#006CFE", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{exp.name.es}</div>
                  <div style={{ fontSize: 11, color: "#94A3B8" }}>{findDestination(exp.destinationId)?.name.es ?? ""} · {exp.type} · {exp.duration}</div>
                </div>
                <button onClick={() => onChange("experienceIds", selected.filter(s => s !== expId))} style={{ border: "none", background: "transparent", cursor: "pointer" }}>
                  <X size={14} color="#94A3B8" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   TAB 4 — Destinos
══════════════════════════════════════════════════════════ */
function TabDestinos({ tour, onChange }: { tour: Tour; onChange: (k: keyof Tour, v: unknown) => void }) {
  const selected = tour.destinationIds;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
        {DESTINATIONS.map(d => {
          const isSel = selected.includes(d.id);
          return (
            <button key={d.id}
              onClick={() => onChange("destinationIds", isSel ? selected.filter(s => s !== d.id) : [...selected, d.id])}
              style={{ padding: "12px 14px", borderRadius: 8, border: `2px solid ${isSel ? "#006CFE" : "#E5E7EB"}`, background: isSel ? "#EFF6FF" : "#FFFFFF", cursor: "pointer", textAlign: "left", display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ width: 32, height: 32, borderRadius: 6, background: d.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{d.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: isSel ? "#006CFE" : "#0F172A" }}>{d.name.es}</div>
                <div style={{ fontSize: 10, color: "#94A3B8" }}>{d.lat}°, {d.lng}°</div>
              </div>
              {isSel && <Check size={16} color="#006CFE" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   TAB 5 — Itinerario (multiDay only)
══════════════════════════════════════════════════════════ */
function TabItinerario({ tour, onChange }: { tour: Tour; onChange: (k: keyof Tour, v: unknown) => void }) {
  const days = tour.itinerary;

  if (tour.type !== "multiDay") {
    return (
      <div style={{ textAlign: "center", padding: "60px 0", color: "#94A3B8" }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>🗓️</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#475569", marginBottom: 4 }}>El itinerario solo aplica para tours <strong>Multi-día</strong></div>
        <div style={{ fontSize: 12 }}>Cambia el tipo en la pestaña "Información básica"</div>
      </div>
    );
  }

  const updateDay = (dayId: string, updates: Partial<Day>) => {
    onChange("itinerary", days.map(d => d.id === dayId ? { ...d, ...updates } : d));
  };

  const moveDay = (idx: number, dir: -1 | 1) => {
    const j = idx + dir;
    if (j < 0 || j >= days.length) return;
    const next = [...days];
    [next[idx], next[j]] = [next[j], next[idx]];
    onChange("itinerary", next.map((d, i) => ({ ...d, dayNumber: i + 1 })));
  };

  const removeDay = (dayId: string) => {
    onChange("itinerary", days.filter(d => d.id !== dayId).map((d, i) => ({ ...d, dayNumber: i + 1 })));
  };

  const addDay = () => {
    const newDay: Day = {
      id: `d${Date.now()}`,
      dayNumber: days.length + 1,
      title: { es: "", en: "" },
      description: { es: "", en: "" },
      destinationIds: [],
      experienceIds: [],
      included: { es: "", en: "" },
      isSwappable: false,
      alternatives: [],
    };
    onChange("itinerary", [...days, newDay]);
  };

  const addAlternative = (dayId: string) => {
    updateDay(dayId, {
      alternatives: [...(days.find(d => d.id === dayId)?.alternatives ?? []), { experienceId: "", priceDelta: 0 }],
    });
  };

  const removeAlternative = (dayId: string, altIdx: number) => {
    const d = days.find(x => x.id === dayId)!;
    updateDay(dayId, { alternatives: d.alternatives.filter((_, i) => i !== altIdx) });
  };

  const updateAlternative = (dayId: string, altIdx: number, field: keyof DayAlternative, val: string | number) => {
    const d = days.find(x => x.id === dayId)!;
    updateDay(dayId, { alternatives: d.alternatives.map((a, i) => i === altIdx ? { ...a, [field]: val } : a) });
  };

  const destLabel = (id: string) => DESTINATIONS.find(d => d.id === id)?.name.es ?? id;
  const destEmoji = (id: string) => DESTINATIONS.find(d => d.id === id)?.emoji ?? "📍";
  const expLabel  = (id: string) => EXPERIENCES.find(e => e.id === id)?.name.es ?? id;
  const expSub    = (id: string) => {
    const e = EXPERIENCES.find(x => x.id === id);
    return e ? `${findDestination(e.destinationId)?.name.es ?? ""} · ${e.type}` : "";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, fontFamily: "Inter, sans-serif" }}>
      {days.map((day, idx) => (
        <div key={day.id} style={{ border: "1px solid #E5E7EB", borderRadius: 8, overflow: "hidden", background: "#FFFFFF" }}>
          {/* Day header */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "#F7F8FA", borderBottom: "1px solid #E5E7EB" }}>
            <GripVertical size={16} color="#CBD5E1" style={{ cursor: "grab" }} />
            <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#006CFE", color: "#FFFFFF", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {day.dayNumber}
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#0F172A", flex: 1 }}>
              {day.title.es || `Día ${day.dayNumber}`}
            </span>
            <div style={{ display: "flex", gap: 4 }}>
              <button onClick={() => moveDay(idx, -1)} disabled={idx === 0}
                style={{ width: 24, height: 24, border: "1px solid #E5E7EB", borderRadius: 4, background: "#FFFFFF", cursor: idx === 0 ? "not-allowed" : "pointer", opacity: idx === 0 ? 0.4 : 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ChevronUp size={12} />
              </button>
              <button onClick={() => moveDay(idx, 1)} disabled={idx === days.length - 1}
                style={{ width: 24, height: 24, border: "1px solid #E5E7EB", borderRadius: 4, background: "#FFFFFF", cursor: idx === days.length - 1 ? "not-allowed" : "pointer", opacity: idx === days.length - 1 ? 0.4 : 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ChevronDown size={12} />
              </button>
              <button onClick={() => removeDay(day.id)}
                style={{ width: 24, height: 24, border: "1px solid #FEE2E2", borderRadius: 4, background: "#FEF2F2", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Trash2 size={11} color="#F13540" />
              </button>
            </div>
          </div>

          {/* Day body */}
          <div style={{ padding: "14px", display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Título */}
            <FormField label="Título del día">
              <BilingualField
                value={day.title}
                onChange={v => updateDay(day.id, { title: v })}
                placeholder="Día 1 — Santo Domingo"
              />
            </FormField>

            {/* Descripción */}
            <FormField label="Descripción">
              <BilingualField
                value={day.description}
                onChange={v => updateDay(day.id, { description: v })}
                multiline rows={3} placeholder="Breve descripción de las actividades del día..."
              />
            </FormField>

            {/* Destinos del día */}
            <FormField label="Destinos visitados este día">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {DESTINATIONS.map(d => {
                  const sel = day.destinationIds.includes(d.id);
                  return (
                    <button key={d.id} onClick={() => updateDay(day.id, { destinationIds: sel ? day.destinationIds.filter(x => x !== d.id) : [...day.destinationIds, d.id] })}
                      style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 8px", borderRadius: 20, border: `1px solid ${sel ? "#006CFE" : "#E5E7EB"}`, background: sel ? "#EFF6FF" : "#FFFFFF", cursor: "pointer", fontSize: 12, color: sel ? "#006CFE" : "#475569" }}>
                      <span>{d.emoji}</span> {d.name.es}
                      {sel && <Check size={10} color="#006CFE" />}
                    </button>
                  );
                })}
              </div>
            </FormField>

            {/* Experiencias del día */}
            <FormField label="Experiencias visitadas este día">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {EXPERIENCES.filter(e => day.destinationIds.length === 0 || day.destinationIds.includes(e.destinationId)).map(e => {
                  const sel = day.experienceIds.includes(e.id);
                  return (
                    <button key={e.id} onClick={() => updateDay(day.id, { experienceIds: sel ? day.experienceIds.filter(x => x !== e.id) : [...day.experienceIds, e.id] })}
                      style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 8px", borderRadius: 20, border: `1px solid ${sel ? "#006CFE" : "#E5E7EB"}`, background: sel ? "#EFF6FF" : "#FFFFFF", cursor: "pointer", fontSize: 11, color: sel ? "#006CFE" : "#475569" }}>
                      {e.name.es}
                      {sel && <Check size={9} color="#006CFE" />}
                    </button>
                  );
                })}
              </div>
            </FormField>

            {/* Incluye texto libre */}
            <FormField label="Incluye (texto libre)" helper="Lista los servicios separados por · o como bullets. Este texto se muestra tal cual en la web pública.">
              <BilingualField
                value={day.included}
                onChange={v => updateDay(day.id, { included: v })}
                multiline rows={4}
                placeholder="Transporte · Guía + Excursión · Entradas · Impuestos"
              />
            </FormField>

            {/* Toggle isSwappable */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button onClick={() => updateDay(day.id, { isSwappable: !day.isSwappable })}
                  style={{ width: 38, height: 22, borderRadius: 11, background: day.isSwappable ? "#006CFE" : "#CBD5E1", border: "none", cursor: "pointer", position: "relative", transition: "background 0.2s" }}>
                  <span style={{ position: "absolute", top: 3, left: day.isSwappable ? 19 : 3, width: 16, height: 16, borderRadius: "50%", background: "#FFFFFF", transition: "left 0.2s" }} />
                </button>
                <span style={{ fontSize: 13, fontWeight: 500, color: "#0F172A" }}>Cliente puede cambiar este día</span>
              </div>

              {day.isSwappable ? (
                <div style={{ marginTop: 12, background: "#F7F8FA", borderRadius: 6, padding: "12px" }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Alternativas permitidas</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {day.alternatives.map((alt, ai) => {
                      const exp = EXPERIENCES.find(e => e.id === alt.experienceId);
                      return (
                        <div key={ai} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 6 }}>
                          <div style={{ width: 28, height: 28, borderRadius: 6, background: "#F0FDF4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>
                            {destEmoji(exp?.destinationId ?? "")}
                          </div>
                          <select value={alt.experienceId}
                            onChange={e => updateAlternative(day.id, ai, "experienceId", e.target.value)}
                            style={{ flex: 1, padding: "5px 8px", border: "1px solid #E5E7EB", borderRadius: 5, fontSize: 12, outline: "none" }}>
                            <option value="">Seleccionar experiencia...</option>
                            {EXPERIENCES.map(e => <option key={e.id} value={e.id}>{e.name.es} — {findDestination(e.destinationId)?.name.es ?? ""}</option>)}
                          </select>
                          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <span style={{ fontSize: 11, color: "#94A3B8" }}>Delta:</span>
                            <input type="number" value={alt.priceDelta}
                              onChange={e => updateAlternative(day.id, ai, "priceDelta", Number(e.target.value))}
                              style={{ width: 80, padding: "5px 8px", border: "1px solid #E5E7EB", borderRadius: 5, fontSize: 12, outline: "none", textAlign: "right" }}
                              placeholder="0"
                            />
                            <span style={{ fontSize: 11, color: "#94A3B8" }}>RD$/p</span>
                          </div>
                          <button onClick={() => removeAlternative(day.id, ai)} style={{ border: "none", background: "transparent", cursor: "pointer", padding: 2 }}>
                            <X size={13} color="#F13540" />
                          </button>
                        </div>
                      );
                    })}
                    <button onClick={() => addAlternative(day.id)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 6, border: "1px dashed #CBD5E1", background: "transparent", fontSize: 12, color: "#94A3B8", cursor: "pointer", width: "fit-content" }}>
                      <Plus size={11} /> Agregar alternativa
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ marginTop: 6, fontSize: 11, color: "#94A3B8" }}>Día fijo — el cliente no podrá modificar este día.</div>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Footer */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={addDay} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 16px", borderRadius: 8, border: "2px dashed #CBD5E1", background: "transparent", fontSize: 13, color: "#94A3B8", cursor: "pointer" }}>
          <Plus size={14} /> Agregar día
        </button>
        <span style={{ fontSize: 12, color: "#94A3B8" }}>Itinerario de <strong style={{ color: "#0F172A" }}>{days.length}</strong> días</span>
      </div>

    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   TAB 6 — Servicios incluidos
══════════════════════════════════════════════════════════ */
function TabServicios({ tour, onChange }: { tour: Tour; onChange: (k: keyof Tour, v: unknown) => void }) {
  const [filterCat, setFilterCat] = useState("");
  const svcMap = Object.fromEntries(tour.includedServices.map(s => [s.serviceId, s]));

  const toggle = (svcId: string) => {
    const existing = svcMap[svcId];
    const updated = existing
      ? tour.includedServices.map(s => s.serviceId === svcId ? { ...s, included: !s.included } : s)
      : [...tour.includedServices, { serviceId: svcId, included: true, customNote: "" }];
    onChange("includedServices", updated);
  };

  const isIncluded = (id: string) => svcMap[id]?.included ?? false;
  const getNote    = (id: string) => svcMap[id]?.customNote ?? "";
  const setNote    = (id: string, val: string) => {
    const updated = svcMap[id]
      ? tour.includedServices.map(s => s.serviceId === id ? { ...s, customNote: val } : s)
      : [...tour.includedServices, { serviceId: id, included: false, customNote: val }];
    onChange("includedServices", updated);
  };

  const cats = [...new Set(SERVICE_CATALOG.map(s => s.category))];
  const filtered = SERVICE_CATALOG.filter(s => !filterCat || s.category === filterCat);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        <button onClick={() => setFilterCat("")} style={{ padding: "4px 10px", borderRadius: 20, border: `1px solid ${!filterCat ? "#006CFE" : "#E5E7EB"}`, background: !filterCat ? "#EFF6FF" : "#FFFFFF", color: !filterCat ? "#006CFE" : "#475569", fontSize: 11, cursor: "pointer" }}>Todos</button>
        {cats.map(c => (
          <button key={c} onClick={() => setFilterCat(filterCat === c ? "" : c)} style={{ padding: "4px 10px", borderRadius: 20, border: `1px solid ${filterCat === c ? "#006CFE" : "#E5E7EB"}`, background: filterCat === c ? "#EFF6FF" : "#FFFFFF", color: filterCat === c ? "#006CFE" : "#475569", fontSize: 11, cursor: "pointer" }}>{c}</button>
        ))}
      </div>
      <div style={{ border: "1px solid #E5E7EB", borderRadius: 8, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F7F8FA" }}>
              {["", "Servicio", "Categoría", "¿Incluido?", "Nota"].map((h, hi) => (
                <th key={hi} style={{ padding: "8px 14px", textAlign: "left", fontSize: 10, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid #E5E7EB" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((svc, i) => {
              const inc = isIncluded(svc.id);
              return (
                <tr key={svc.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid #F1F5F9" : "none", background: inc ? "#F0FDF4" : "transparent" }}>
                  <td style={{ padding: "10px 14px", fontSize: 18 }}>{svc.icon}</td>
                  <td style={{ padding: "10px 14px" }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{svc.name.es}</div>
                    <div style={{ fontSize: 11, color: "#94A3B8" }}>{svc.name.en}</div>
                  </td>
                  <td style={{ padding: "10px 14px" }}><span style={{ fontSize: 11, padding: "2px 7px", borderRadius: 20, background: "#F1F5F9", color: "#475569" }}>{svc.category}</span></td>
                  <td style={{ padding: "10px 14px" }}>
                    <button onClick={() => toggle(svc.id)} style={{ width: 38, height: 22, borderRadius: 11, background: inc ? "#16A34A" : "#CBD5E1", border: "none", cursor: "pointer", position: "relative", transition: "background 0.2s" }}>
                      <span style={{ position: "absolute", top: 3, left: inc ? 19 : 3, width: 16, height: 16, borderRadius: "50%", background: "#FFFFFF", transition: "left 0.2s" }} />
                    </button>
                  </td>
                  <td style={{ padding: "10px 14px" }}>
                    <input value={getNote(svc.id)} onChange={e => setNote(svc.id, e.target.value)} placeholder="Nota opcional..."
                      style={{ width: "100%", padding: "5px 8px", border: "1px solid #E5E7EB", borderRadius: 5, fontSize: 12, outline: "none" }} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   TAB 7 — Detalles
══════════════════════════════════════════════════════════ */
function TabDetalles({ tour, onChange }: { tour: Tour; onChange: (k: keyof Tour, v: unknown) => void }) {
  const d = tour.details;
  const upd = (k: string, v: unknown) => onChange("details", { ...d, [k]: v });
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, maxWidth: 700 }}>
      <FormField label="Duración"><Input value={d.duration} onChange={v => upd("duration", v)} /></FormField>
      <FormField label="Cuándo reservar"><Input value={d.bookingWindow} onChange={v => upd("bookingWindow", v)} /></FormField>
      <FormField label="Dificultad">
        <SelectField value={d.difficulty} onChange={v => upd("difficulty", v)} options={[
          { value: "easy",           label: "Baja"          },
          { value: "moderate",       label: "Moderada"      },
          { value: "moderateToHigh", label: "Moderada-Alta" },
          { value: "high",           label: "Alta"          },
        ]} />
      </FormField>
      <FormField label="Tipo de bono">
        <SelectField value={d.voucherType} onChange={v => upd("voucherType", v)} options={[
          { value: "electronic", label: "Electrónico" },
          { value: "physical",   label: "Físico"      },
        ]} />
      </FormField>
      <div style={{ gridColumn: "1 / -1" }}>
        <FormField label="Accesibilidad"><Input value={d.accessibility} onChange={v => upd("accessibility", v)} /></FormField>
      </div>
      <FormField label="Mascotas">
        <div style={{ display: "flex", alignItems: "center", gap: 8, paddingTop: 6 }}>
          <button onClick={() => upd("petsAllowed", !d.petsAllowed)} style={{ width: 38, height: 22, borderRadius: 11, background: d.petsAllowed ? "#006CFE" : "#CBD5E1", border: "none", cursor: "pointer", position: "relative", transition: "background 0.2s" }}>
            <span style={{ position: "absolute", top: 3, left: d.petsAllowed ? 19 : 3, width: 16, height: 16, borderRadius: "50%", background: "#FFFFFF", transition: "left 0.2s" }} />
          </button>
          <span style={{ fontSize: 13, color: "#475569" }}>{d.petsAllowed ? "Permitidas" : "No permitidas"}</span>
        </div>
      </FormField>
      <div style={{ gridColumn: "1 / -1" }}>
        <FormField label="Nota de sostenibilidad"><Textarea value={d.sustainabilityNote} onChange={v => upd("sustainabilityNote", v)} rows={2} /></FormField>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   TAB 8 — Logística
══════════════════════════════════════════════════════════ */
function TabLogistica({ tour, onChange }: { tour: Tour; onChange: (k: keyof Tour, v: unknown) => void }) {
  const l = tour.logistics;
  const upd = (k: string, v: string) => onChange("logistics", { ...l, [k]: v });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 600 }}>
      <div style={{ padding: "10px 14px", background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 8, fontSize: 12, color: "#1D4ED8", display: "flex", gap: 6 }}>
        <MapPin size={14} style={{ flexShrink: 0, marginTop: 1 }} />
        <span>Punto de salida predeterminado: <strong>{SITE_CONFIG.defaultDeparturePoint.name}</strong> — {SITE_CONFIG.defaultDeparturePoint.address}</span>
      </div>
      <FormField label="Punto de salida (este tour)" required>
        <Textarea value={l.departurePoint} onChange={v => upd("departurePoint", v)} rows={2} />
      </FormField>
      <FormField label="Hora de salida" required helper="Ej: 5:00 A.M (puntual)">
        <div style={{ display: "flex", alignItems: "center", gap: 8, maxWidth: 220 }}>
          <Clock size={14} color="#94A3B8" style={{ flexShrink: 0 }} />
          <Input value={l.departureTime} onChange={v => upd("departureTime", v)} placeholder="5:00 A.M (puntual)" />
        </div>
      </FormField>
      <FormField label="Link de Google Maps">
        <Input value={l.mapsUrl} onChange={v => upd("mapsUrl", v)} />
      </FormField>
      <FormField label="Link grupo WhatsApp (opcional)">
        <Input value={tour.whatsappGroupUrl ?? ""} onChange={v => onChange("whatsappGroupUrl", v || null)} placeholder="https://chat.whatsapp.com/..." />
      </FormField>
      <FormField label="Operador asignado">
        <select
          value={tour.operatorId}
          onChange={e => onChange("operatorId", e.target.value)}
          style={{ width: "100%", padding: "9px 12px", border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 13, color: "#0F172A", background: "#FFFFFF", outline: "none", cursor: "pointer", boxSizing: "border-box" }}
        >
          {OPERATORS.filter(o => o.status === "active").map(o => (
            <option key={o.id} value={o.id}>
              {o.name} {o.type === "external" ? "(externo)" : "(interno)"}
            </option>
          ))}
        </select>
      </FormField>
      {(() => {
        const op = OPERATORS.find(o => o.id === tour.operatorId);
        if (!op) return null;
        return (
          <div style={{ padding: "10px 14px", background: "#F7F8FA", borderRadius: 6, border: "1px solid #E5E7EB", fontSize: 12, color: "#475569" }}>
            <div style={{ fontWeight: 600, color: "#0F172A", marginBottom: 4 }}>{op.name}</div>
            {op.contact?.email && <div>{op.contact.email} · {op.contact.phone}</div>}
            {op.contact?.whatsapp && <div style={{ marginTop: 2, color: "#16A34A" }}>WhatsApp: {op.contact.whatsapp}</div>}
          </div>
        );
      })()}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   TAB 9 — Galería
══════════════════════════════════════════════════════════ */
function TabGaleria({ tour, onChange }: { tour: Tour; onChange: (k: keyof Tour, v: unknown) => void }) {
  const [pickerOpen, setPickerOpen] = useState(false);

  const assets = MEDIA_ASSETS.filter(a => tour.galleryIds.includes(a.id))
    .sort((a, b) => tour.galleryIds.indexOf(a.id) - tour.galleryIds.indexOf(b.id));

  const available = MEDIA_ASSETS.filter(a => !tour.galleryIds.includes(a.id));

  const addToGallery = (assetId: string) => {
    if (!tour.galleryIds.includes(assetId)) {
      onChange("galleryIds", [...tour.galleryIds, assetId]);
    }
    setPickerOpen(false);
  };

  const removeFromGallery = (assetId: string) => {
    onChange("galleryIds", tour.galleryIds.filter(id => id !== assetId));
  };

  const setPrimary = (assetId: string) => {
    onChange("galleryIds", [assetId, ...tour.galleryIds.filter(id => id !== assetId)]);
  };

  const moveGalleryItem = (idx: number, direction: "up" | "down") => {
    const arr = [...tour.galleryIds];
    const target = direction === "up" ? idx - 1 : idx + 1;
    if (target < 0 || target >= arr.length) return;
    [arr[idx], arr[target]] = [arr[target], arr[idx]];
    onChange("galleryIds", arr);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Action buttons */}
      <div style={{ display: "flex", gap: 8 }}>
        <Btn variant="secondary" size="sm" onClick={() => setPickerOpen(p => !p)}>
          <Image size={13} /> Agregar de biblioteca
        </Btn>
        <Btn variant="primary" size="sm" onClick={() => alert("La subida de archivos estará disponible cuando se conecte el backend (Fase 4).")}>
          <Upload size={13} /> Subir nueva
        </Btn>
      </div>

      {/* Inline picker panel */}
      {pickerOpen && (
        <div style={{ border: "1px solid #E5E7EB", borderRadius: 8, padding: 14, background: "#F7F8FA" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#0F172A", marginBottom: 10 }}>
            Selecciona un asset de la biblioteca
          </div>
          {available.length === 0 ? (
            <div style={{ fontSize: 12, color: "#94A3B8" }}>Todos los assets ya están en la galería.</div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
              {available.map(a => (
                <button
                  key={a.id}
                  onClick={() => addToGallery(a.id)}
                  title={a.alt?.es}
                  style={{ border: "1px solid #E5E7EB", borderRadius: 6, background: a.color ?? "#F1F5F9", aspectRatio: "16/9", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, padding: 6 }}
                >
                  <span style={{ fontSize: 24 }}>{a.emoji}</span>
                  <span style={{ fontSize: 9, color: "#475569", textAlign: "center", lineHeight: 1.3 }}>{a.alt?.es}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Gallery grid */}
      {assets.length === 0 ? (
        <div style={{ border: "2px dashed #CBD5E1", borderRadius: 8, padding: "40px", textAlign: "center", background: "#F7F8FA" }}>
          <Upload size={28} color="#CBD5E1" style={{ margin: "0 auto 10px" }} />
          <div style={{ fontSize: 13, color: "#475569" }}>Usa "Agregar de biblioteca" para añadir imágenes a la galería</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {assets.map((a, i) => (
            <div key={a.id} style={{ position: "relative", borderRadius: 8, overflow: "hidden", border: i === 0 ? "2px solid #006CFE" : "1px solid #E5E7EB", aspectRatio: "16/9", background: a.color ?? "#F1F5F9" }}>
              {/* Image content — click to set as primary */}
              <div
                onClick={() => i !== 0 && setPrimary(a.id)}
                style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, cursor: i !== 0 ? "pointer" : "default" }}
              >
                {a.url ? (
                  <img src={a.url} alt={a.alt?.es} style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }} />
                ) : (
                  <>
                    <span style={{ fontSize: 28 }}>{a.emoji}</span>
                    <span style={{ fontSize: 9, color: "#475569", textAlign: "center", padding: "0 8px" }}>{a.alt?.es}</span>
                  </>
                )}
              </div>

              {/* Primary badge */}
              {i === 0 && (
                <div style={{ position: "absolute", top: 6, left: 6, background: "#006CFE", color: "#FFFFFF", fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4, pointerEvents: "none" }}>
                  PRINCIPAL
                </div>
              )}

              {/* Remove button */}
              <button
                onClick={() => removeFromGallery(a.id)}
                style={{ position: "absolute", top: 5, right: 5, width: 20, height: 20, borderRadius: "50%", border: "none", background: "#F13540", color: "#FFF", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}
              >
                <X size={11} />
              </button>

              {/* Reorder arrows */}
              <div style={{ position: "absolute", bottom: 5, right: 5, display: "flex", flexDirection: "column", gap: 2 }}>
                <button
                  onClick={() => moveGalleryItem(i, "up")}
                  disabled={i === 0}
                  style={{ width: 18, height: 18, borderRadius: 4, border: "none", background: i === 0 ? "#E5E7EB" : "#FFFFFF", cursor: i === 0 ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}
                >
                  <ChevronUp size={11} color={i === 0 ? "#CBD5E1" : "#475569"} />
                </button>
                <button
                  onClick={() => moveGalleryItem(i, "down")}
                  disabled={i === assets.length - 1}
                  style={{ width: 18, height: 18, borderRadius: 4, border: "none", background: i === assets.length - 1 ? "#E5E7EB" : "#FFFFFF", cursor: i === assets.length - 1 ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}
                >
                  <ChevronDown size={11} color={i === assets.length - 1 ? "#CBD5E1" : "#475569"} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div style={{ fontSize: 11, color: "#94A3B8" }}>
        Haz clic en una imagen no-principal para convertirla en imagen principal de la galería.
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   TAB 10 — SEO
══════════════════════════════════════════════════════════ */
function TabSEO({ tour, onChange }: { tour: Tour; onChange: (k: keyof Tour, v: unknown) => void }) {
  const seoMeta = tour.seoMeta ?? {
    title: { es: `${tour.title.es} | Random Trips`, en: `${tour.title.en} | Random Trips` },
    description: tour.description,
  };
  const ogAsset = seoMeta.ogImageId ? MEDIA_ASSETS.find(a => a.id === seoMeta.ogImageId) : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Meta título */}
      <FormField label="Meta título" helper="50–60 caracteres recomendados">
        <BilingualField
          value={seoMeta.title}
          onChange={v => onChange("seoMeta", { ...seoMeta, title: v })}
          placeholder="Título SEO..."
        />
        <div style={{ display: "flex", gap: 20, marginTop: 5, fontSize: 11 }}>
          {(["es", "en"] as const).map(lang => {
            const len = seoMeta.title[lang].length;
            const color = len === 0 ? "#94A3B8" : (len >= 50 && len <= 60) ? "#16A34A" : "#F59E0B";
            return <span key={lang} style={{ color }}>{lang.toUpperCase()}: {len} / 60</span>;
          })}
        </div>
      </FormField>

      {/* Meta descripción */}
      <FormField label="Meta descripción" helper="150–160 caracteres recomendados">
        <BilingualField
          value={seoMeta.description}
          onChange={v => onChange("seoMeta", { ...seoMeta, description: v })}
          multiline rows={3}
          placeholder="Descripción SEO..."
        />
        <div style={{ display: "flex", gap: 20, marginTop: 5, fontSize: 11 }}>
          {(["es", "en"] as const).map(lang => {
            const len = seoMeta.description[lang].length;
            const color = len === 0 ? "#94A3B8" : (len >= 150 && len <= 160) ? "#16A34A" : "#F59E0B";
            return <span key={lang} style={{ color }}>{lang.toUpperCase()}: {len} / 160</span>;
          })}
        </div>
      </FormField>

      {/* Slug */}
      <FormField label="Slug visible">
        <div style={{ display: "flex", border: "1px solid #E5E7EB", borderRadius: 6, overflow: "hidden" }}>
          <span style={{ padding: "8px 12px", background: "#F7F8FA", fontSize: 12, color: "#94A3B8", borderRight: "1px solid #E5E7EB", whiteSpace: "nowrap" }}>randomtrips.co/tours/</span>
          <input value={tour.slug} onChange={e => onChange("slug", e.target.value)} style={{ flex: 1, padding: "8px 12px", border: "none", outline: "none", fontSize: 13 }} />
        </div>
      </FormField>

      {/* Google preview */}
      <div style={{ background: "#F7F8FA", borderRadius: 8, padding: "14px 16px" }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Vista previa en Google</div>
        <div style={{ fontSize: 12, color: "#94A3B8" }}>randomtrips.co › tours › {tour.slug}</div>
        <div style={{ fontSize: 16, color: "#1a0dab" }}>{seoMeta.title.es || `${tour.title.es} | Random Trips`}</div>
        <div style={{ fontSize: 13, color: "#545454", lineHeight: 1.5 }}>{seoMeta.description.es || tour.description.es}</div>
      </div>

      {/* OG Image */}
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#0F172A", marginBottom: 8 }}>Imagen OG (Open Graph)</div>
        {ogAsset ? (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 120, height: 68, borderRadius: 6, background: ogAsset.color ?? "#F1F5F9", border: "1px solid #E5E7EB", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>
              {ogAsset.url ? <img src={ogAsset.url} alt={ogAsset.alt?.es} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : ogAsset.emoji}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#0F172A", marginBottom: 4 }}>{ogAsset.alt?.es}</div>
              <button onClick={() => onChange("seoMeta", { ...seoMeta, ogImageId: undefined })}
                style={{ fontSize: 11, color: "#F13540", border: "none", background: "transparent", cursor: "pointer", padding: 0 }}>
                Eliminar
              </button>
            </div>
          </div>
        ) : (
          <div style={{ border: "2px dashed #CBD5E1", borderRadius: 8, padding: "16px", textAlign: "center", background: "#F7F8FA" }}>
            <Image size={22} color="#CBD5E1" style={{ margin: "0 auto 8px" }} />
            <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 10 }}>Sin imagen OG asignada</div>
            {tour.galleryIds.length > 0 ? (
              <div>
                <div style={{ fontSize: 11, color: "#475569", marginBottom: 8 }}>Selecciona una imagen de la galería del tour:</div>
                <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" }}>
                  {MEDIA_ASSETS.filter(a => tour.galleryIds.includes(a.id)).map(a => (
                    <button key={a.id} onClick={() => onChange("seoMeta", { ...seoMeta, ogImageId: a.id })}
                      title={a.alt?.es}
                      style={{ width: 60, height: 34, borderRadius: 4, background: a.color ?? "#F1F5F9", border: "1px solid #E5E7EB", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {a.emoji}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <span style={{ fontSize: 12, color: "#94A3B8" }}>Agrega imágenes en la pestaña Galería primero</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN TourEditor
══════════════════════════════════════════════════════════ */
export function TourEditor({ onBack, tourId }: { onBack: () => void; tourId?: string }) {
  const source  = TOURS_DATA.find(t => t.id === tourId) ?? TOURS_DATA[0];
  const [tour, setTour] = useState<Tour>({ ...source });
  const [activeTab, setActiveTab] = useState("info");
  const [editingTitle, setEditingTitle] = useState(false);
  const [savedAgo, setSavedAgo] = useState<string | null>("Guardado hace 2 min");

  const onChange = (k: keyof Tour, v: unknown) => {
    setTour(prev => ({ ...prev, [k]: v } as Tour));
    setSavedAgo(null);
    setTimeout(() => setSavedAgo("Cambios guardados"), 1200);
  };

  /* Visible tabs: filter out itinerario when not multiDay */
  const visibleTabs = ALL_TABS.filter(t => !t.forTipo || tour.type === t.forTipo);

  /* If current active tab is now hidden, reset */
  if (!visibleTabs.find(t => t.id === activeTab)) {
    setTimeout(() => setActiveTab("info"), 0);
  }

  const statusConf: Record<string, { variant: "success" | "neutral" | "warning"; label: string }> = {
    published: { variant: "success", label: "Publicado" },
    draft:     { variant: "neutral", label: "Borrador"  },
    archived:  { variant: "warning", label: "Archivado" },
  };
  const st = statusConf[tour.status] ?? statusConf.draft;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "calc(100vh - 56px)", fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#94A3B8", marginBottom: 8 }}>
          <button onClick={onBack} style={{ border: "none", background: "transparent", cursor: "pointer", color: "#94A3B8", display: "flex", alignItems: "center", gap: 4, fontSize: 12 }}>
            <ArrowLeft size={12} /> Catálogo
          </button>
          <span>/</span><span>Tours</span><span>/</span>
          <span style={{ color: "#0F172A" }}>{tour.title.es}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          {editingTitle ? (
            <input autoFocus value={tour.title.es} onChange={e => onChange("title", { ...tour.title, es: e.target.value })}
              onBlur={() => setEditingTitle(false)} onKeyDown={e => e.key === "Enter" && setEditingTitle(false)}
              style={{ fontSize: 20, fontWeight: 700, color: "#0F172A", border: "none", borderBottom: "2px solid #006CFE", outline: "none", background: "transparent", flex: 1, minWidth: 200 }}
            />
          ) : (
            <h1 onClick={() => setEditingTitle(true)} style={{ fontSize: 20, fontWeight: 700, color: "#0F172A", margin: 0, cursor: "text", flex: 1 }} title="Clic para editar">{tour.title.es}</h1>
          )}
          <StatusBadge variant={st.variant} label={st.label} />
          {tour.type === "multiDay" && (
            <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20, background: "#DBEAFE", color: "#1D4ED8", fontWeight: 600 }}>🗓️ Multi-día</span>
          )}
          <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
            <Btn variant="ghost" size="sm"><Eye size={13} /> Vista previa</Btn>
            <Btn variant="ghost" size="sm"><Copy size={13} /> Duplicar</Btn>
            <Btn variant="secondary" size="sm"><Save size={13} /> Guardar borrador</Btn>
            <Btn variant="primary" size="sm"><Globe size={13} /> Publicar</Btn>
          </div>
        </div>
      </div>

      {/* Tab navigation */}
      <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #E5E7EB", marginBottom: 24, overflowX: "auto" }}>
        {visibleTabs.map((t, i) => {
          const isActive = activeTab === t.id;
          return (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              style={{ padding: "8px 16px", border: "none", borderBottom: `2px solid ${isActive ? "#006CFE" : "transparent"}`, background: "transparent", fontSize: 13, fontWeight: isActive ? 600 : 400, color: isActive ? "#006CFE" : "#475569", cursor: "pointer", whiteSpace: "nowrap" }}>
              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 18, height: 18, borderRadius: "50%", background: isActive ? "#006CFE" : "#E5E7EB", color: isActive ? "#FFFFFF" : "#94A3B8", fontSize: 10, fontWeight: 700, marginRight: 6 }}>{i + 1}</span>
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, paddingBottom: 80 }}>
        {activeTab === "info"         && <TabInfo         tour={tour} onChange={onChange} />}
        {activeTab === "pricing"      && <TabPricing      tour={tour} onChange={onChange} />}
        {activeTab === "experiencias" && <TabExperiencias tour={tour} onChange={onChange} />}
        {activeTab === "destinos"     && <TabDestinos     tour={tour} onChange={onChange} />}
        {activeTab === "itinerario"   && <TabItinerario   tour={tour} onChange={onChange} />}
        {activeTab === "servicios"    && <TabServicios    tour={tour} onChange={onChange} />}
        {activeTab === "detalles"     && <TabDetalles     tour={tour} onChange={onChange} />}
        {activeTab === "logistica"    && <TabLogistica    tour={tour} onChange={onChange} />}
        {activeTab === "galeria"      && <TabGaleria      tour={tour} onChange={onChange} />}
        {activeTab === "seo"          && <TabSEO          tour={tour} onChange={onChange} />}
      </div>

      {/* Fixed footer */}
      <div style={{ position: "fixed", bottom: 0, left: 240, right: 0, background: "#FFFFFF", borderTop: "1px solid #E5E7EB", padding: "12px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 50, boxShadow: "0 -4px 12px rgba(0,0,0,.04)" }}>
        <Btn variant="ghost" onClick={onBack}>Descartar cambios</Btn>
        {savedAgo && <span style={{ fontSize: 12, color: "#94A3B8", display: "flex", alignItems: "center", gap: 5 }}><Check size={12} color="#16A34A" /> {savedAgo}</span>}
        <div style={{ display: "flex", gap: 8 }}>
          <Btn variant="secondary"><Save size={13} /> Guardar borrador</Btn>
          <Btn variant="primary"><Globe size={13} /> Publicar</Btn>
        </div>
      </div>
    </div>
  );
}
