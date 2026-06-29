import { useState } from "react";
import {
  ArrowLeft, Send, Clock, Mail, User, MapPin,
  Calendar, Users, DollarSign, MessageSquare, Check, X, Calculator,
} from "lucide-react";
import { StatusBadge } from "../ui/StatusBadge";
import { FilterBar } from "../ui/FilterBar";
import { FormField, Input, Textarea, SelectField } from "../ui/FormField";
import { Btn } from "../ui/Modal";
import { QuoteCalculator } from "./QuoteCalculator";
import type { Quote, QuoteCalculation } from "../../data/types";
import { QUOTES, findUser, formatDOP } from "../../data/realData";

/* ── Helpers ────────────────────────────────────────────── */
const hoursAgo = (iso?: string) =>
  iso ? Math.round((Date.now() - new Date(iso).getTime()) / 3600000) : null;

const fmtDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString("es-DO", { day: "numeric", month: "short", year: "numeric" }) : "—";

const STAFF = ["Alejandra Torres", "Carlos Reyes", "María Pérez"];

const TOURS_CATALOG = [
  "Isla Saona Full Day", "Cascadas El Limón", "Whale Watching Samaná",
  "Los Haitises Ecoturismo", "Santo Domingo City Tour", "Puerto Plata Adventure",
  "Jarabacoa Rafting", "Custom",
];

const STATUS_CONF = {
  pending:  { variant: "warning" as const, label: "Pendiente",  tab: "Pendientes" },
  sent:     { variant: "info"    as const, label: "Enviada",    tab: "Enviadas"   },
  accepted: { variant: "success" as const, label: "Aceptada",   tab: "Aceptadas"  },
  rejected: { variant: "danger"  as const, label: "Rechazada",  tab: "Rechazadas" },
};

/* ── Cotización Detalle ─────────────────────────────────── */
function CotizacionDetalle({ cot, onBack, onSave }: { cot: Quote; onBack: () => void; onSave: (q: Quote) => void }) {
  const [tourPropuesto, setTourPropuesto] = useState("");
  const [precio, setPrecio] = useState(cot.proposedPrice ? String(cot.proposedPrice) : "");
  const [moneda, setMoneda] = useState<string>(cot.currency ?? "USD");
  const [notas, setNotas] = useState("");
  const [validez, setValidez] = useState("7");
  const [sent, setSent] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [localCalculation, setLocalCalculation] = useState<QuoteCalculation | undefined>(cot.calculation);

  const isPending = cot.status === "pending";
  const pendingHours = hoursAgo(cot.createdAt);
  const assignedName = findUser(cot.assignedToUserId ?? "")?.name ?? "—";

  const handleCalculatorApply = (calc: QuoteCalculation) => {
    setPrecio(String(Math.round(calc.totalWithMargin)));
    setMoneda("DOP");
    setLocalCalculation(calc);
    setShowCalculator(false);
  };

  const handleSend = () => {
    const updated: Quote = {
      ...cot,
      status: "sent",
      proposedPrice: Number(precio),
      currency: moneda as Quote["currency"],
      calculation: localCalculation,
      respondedAt: new Date().toISOString(),
    };
    onSave(updated);
    setSent(true);
  };

  return (
    <div style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 4, border: "none", background: "transparent", cursor: "pointer", color: "#94A3B8", fontSize: 12, marginBottom: 8 }}>
          <ArrowLeft size={12} /> Cotizaciones
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div>
            <span style={{ fontSize: 22, fontWeight: 800, color: "#0F172A" }}>{cot.id}</span>
            <span style={{ fontSize: 12, color: "#94A3B8", marginLeft: 10 }}>Solicitada el {fmtDate(cot.createdAt)}</span>
          </div>
          <StatusBadge variant={STATUS_CONF[cot.status].variant} label={STATUS_CONF[cot.status].label} />
          {pendingHours !== null && isPending && (
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#F13540", background: "#FEF2F2", padding: "3px 8px", borderRadius: 20 }}>
              <Clock size={11} /> {pendingHours}h sin respuesta
            </div>
          )}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 20, alignItems: "start" }}>
        {/* LEFT */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Contacto */}
          <section style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB", display: "flex", alignItems: "center", gap: 6 }}>
              <User size={13} color="#94A3B8" />
              <span style={{ fontSize: 12, fontWeight: 700, color: "#0F172A", textTransform: "uppercase", letterSpacing: "0.06em" }}>Datos de contacto</span>
            </div>
            <div style={{ padding: "14px 16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {[
                { label: "Nombre",     value: cot.contact.name     },
                { label: "Email",      value: cot.contact.email     },
                { label: "Teléfono",   value: cot.contact.phone     },
                { label: "País",       value: cot.contact.country   },
                { label: "Asignado a", value: assignedName          },
              ].map(f => (
                <div key={f.label}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>{f.label}</div>
                  <div style={{ fontSize: 13, color: "#0F172A" }}>{f.value ?? "—"}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Solicitud */}
          <section style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB", display: "flex", alignItems: "center", gap: 6 }}>
              <MapPin size={13} color="#94A3B8" />
              <span style={{ fontSize: 12, fontWeight: 700, color: "#0F172A", textTransform: "uppercase", letterSpacing: "0.06em" }}>Detalles de la solicitud</span>
            </div>
            <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Destinos</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {cot.requestedDestinations.map(d => (
                      <span key={d} style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20, background: "#EFF6FF", color: "#1D4ED8" }}>{d}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Fechas</div>
                  <div style={{ fontSize: 13, color: "#0F172A" }}>{cot.requestedDates}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Pax / Presupuesto</div>
                  <div style={{ fontSize: 13, color: "#0F172A" }}>{cot.pax} personas</div>
                  <div style={{ fontSize: 12, color: "#94A3B8" }}>{cot.approximateBudget ? formatDOP(cot.approximateBudget) : "N/D"}</div>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Mensaje del cliente</div>
                <div style={{ padding: "12px 14px", background: "#F7F8FA", borderRadius: 6, fontSize: 13, color: "#475569", lineHeight: 1.6, fontStyle: "italic" }}>
                  "{cot.message}"
                </div>
              </div>
            </div>
          </section>

          {/* Comunicaciones previas */}
          {(cot.communications ?? []).length > 0 && (
            <section style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, overflow: "hidden" }}>
              <div style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB", display: "flex", alignItems: "center", gap: 6 }}>
                <MessageSquare size={13} color="#94A3B8" />
                <span style={{ fontSize: 12, fontWeight: 700, color: "#0F172A", textTransform: "uppercase", letterSpacing: "0.06em" }}>Comunicaciones previas</span>
              </div>
              <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
                {(cot.communications ?? []).map((c, i) => (
                  <div key={i} style={{ display: "flex", gap: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Mail size={12} color="#006CFE" />
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 2 }}>{c.date}</div>
                      <div style={{ fontSize: 13, color: "#0F172A" }}>{c.text}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Desglose del precio (read-only) */}
          {cot.calculation && (
            <section style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, overflow: "hidden" }}>
              <div style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB", display: "flex", alignItems: "center", gap: 6 }}>
                <DollarSign size={13} color="#94A3B8" />
                <span style={{ fontSize: 12, fontWeight: 700, color: "#0F172A", textTransform: "uppercase", letterSpacing: "0.06em" }}>Desglose del precio</span>
              </div>
              <div style={{ padding: "14px 16px", fontSize: 13, color: "#475569", display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Base: {formatDOP(cot.calculation.basePricePerPerson)}/p × {cot.calculation.pax}p</span>
                  <strong style={{ color: "#0F172A" }}>{formatDOP(cot.calculation.basePricePerPerson * cot.calculation.pax)}</strong>
                </div>
                {cot.calculation.costLines.map(l => (
                  <div key={l.id} style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <span>
                      {l.description || "Línea de costo"}
                      <span style={{ color: "#94A3B8" }}>
                        {" · "}{l.splitMode === "fixed" ? "fijo" : `÷${l.minCapacity ?? cot.calculation!.pax}p`}
                      </span>
                    </span>
                    <span style={{ color: "#0F172A", whiteSpace: "nowrap" }}>{formatDOP(l.amount)}</span>
                  </div>
                ))}
                <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: 6, marginTop: 2, display: "flex", justifyContent: "space-between" }}>
                  <span>Margen RT</span>
                  <strong style={{ color: "#0F172A" }}>{cot.calculation.marginPercent}%</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <strong style={{ color: "#0F172A", fontSize: 14 }}>Total</strong>
                  <span style={{ textAlign: "right" }}>
                    <strong style={{ color: "#0F172A", fontSize: 14 }}>{formatDOP(Math.round(cot.calculation.totalWithMargin))}</strong>
                    <span style={{ color: "#94A3B8", fontSize: 12 }}> · {formatDOP(Math.round(cot.calculation.pricePerPerson))}/p</span>
                  </span>
                </div>
                {cot.calculation.absorbedCost > 0 && (
                  <div style={{ color: "#92400E", fontSize: 11, background: "#FEF3C7", border: "1px solid #FDE68A", borderRadius: 4, padding: "5px 8px", marginTop: 2 }}>
                    ⚠️ Costo absorbido (cap. mínima): {formatDOP(Math.round(cot.calculation.absorbedCost))}
                  </div>
                )}
              </div>
            </section>
          )}
        </div>

        {/* RIGHT — Formulario de respuesta */}
        <div style={{ position: "sticky", top: 80 }}>
          <div style={{ background: "#FFFFFF", border: `2px solid ${isPending || cot.status === "sent" ? "#006CFE" : "#E5E7EB"}`, borderRadius: 8, overflow: "hidden" }}>
            <div style={{ padding: "14px 16px", background: isPending ? "#EFF6FF" : "#F7F8FA", borderBottom: "1px solid #E5E7EB" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>
                {cot.status === "accepted" ? "✓ Cotización aceptada" : cot.status === "rejected" ? "✗ Cotización rechazada" : "Formulario de respuesta"}
              </div>
              {isPending && <div style={{ fontSize: 11, color: "#006CFE", marginTop: 2 }}>Pendiente de respuesta</div>}
            </div>
            <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 14 }}>
              {sent ? (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#F0FDF4", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                    <Check size={22} color="#16A34A" />
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>Cotización enviada</div>
                  <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 4 }}>Email enviado a {cot.contact.email}</div>
                </div>
              ) : (
                <>
                  <FormField label="Tour propuesto">
                    <SelectField value={tourPropuesto} onChange={setTourPropuesto}
                      options={TOURS_CATALOG.map(t => ({ value: t, label: t }))}
                      placeholder="Seleccionar tour o Custom..."
                    />
                  </FormField>

                  <FormField label="Precio propuesto" required>
                    <div style={{ display: "flex", gap: 6 }}>
                      <select value={moneda} onChange={e => setMoneda(e.target.value)}
                        style={{ padding: "8px 10px", border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 13, outline: "none", flexShrink: 0 }}>
                        {["USD", "DOP", "EUR"].map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                      <input value={precio} onChange={e => setPrecio(e.target.value)}
                        placeholder="0.00" type="number"
                        style={{ flex: 1, padding: "8px 12px", border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 13, outline: "none", minWidth: 0 }}
                      />
                    </div>
                    <button
                      onClick={() => setShowCalculator(v => !v)}
                      style={{
                        marginTop: 8, width: "100%", padding: "8px 12px", borderRadius: 6,
                        border: `1px solid ${showCalculator ? "#006CFE" : "#BFDBFE"}`,
                        background: showCalculator ? "#006CFE" : "#EFF6FF",
                        color: showCalculator ? "#FFFFFF" : "#006CFE",
                        fontSize: 12, fontWeight: 600, cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                      }}
                    >
                      <Calculator size={13} /> {showCalculator ? "Ocultar calculadora" : "Abrir calculadora de costos"}
                    </button>
                    {localCalculation && (
                      <div style={{ fontSize: 11, color: "#64748B", marginTop: 6, lineHeight: 1.5 }}>
                        Calculado el {new Date(localCalculation.calculatedAt).toLocaleDateString("es-DO")}
                        {" · "}{localCalculation.costLines.length} línea(s) de costo
                        {" · "}Margen {localCalculation.marginPercent}%
                      </div>
                    )}
                  </FormField>

                  <FormField label="Notas para el cliente">
                    <textarea value={notas} onChange={e => setNotas(e.target.value)}
                      placeholder="Descripción de la propuesta, qué incluye, condiciones especiales..."
                      rows={5}
                      style={{ width: "100%", padding: "8px 12px", border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 13, outline: "none", resize: "vertical", fontFamily: "Inter, sans-serif", boxSizing: "border-box" }}
                    />
                  </FormField>

                  <FormField label="Validez de la cotización">
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <input value={validez} onChange={e => setValidez(e.target.value)}
                        type="number" style={{ width: 64, padding: "8px 12px", border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 13, outline: "none", textAlign: "center" }} />
                      <span style={{ fontSize: 13, color: "#475569" }}>días</span>
                    </div>
                  </FormField>

                  <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                    <button
                      onClick={handleSend}
                      disabled={!precio}
                      style={{
                        width: "100%", padding: "10px", borderRadius: 6, border: "none",
                        background: precio ? "#006CFE" : "#E5E7EB",
                        color: precio ? "#FFFFFF" : "#94A3B8",
                        fontSize: 13, fontWeight: 600, cursor: precio ? "pointer" : "not-allowed",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                      }}
                    >
                      <Send size={14} /> Enviar cotización
                    </button>
                    <div style={{ fontSize: 11, color: "#94A3B8", textAlign: "center" }}>
                      Se enviará email a <strong>{cot.contact.email}</strong> con la propuesta.
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Calculator panel (inline, full-width) */}
      {showCalculator && (
        <div style={{ marginTop: 20 }}>
          <QuoteCalculator
            quote={cot}
            onApply={handleCalculatorApply}
            onClose={() => setShowCalculator(false)}
          />
        </div>
      )}
    </div>
  );
}

/* ── Main list ──────────────────────────────────────────── */
export function Cotizaciones({ isPartnerView = false }: { isPartnerView?: boolean }) {
  const [activeTab, setActiveTab] = useState<"pending" | "sent" | "accepted" | "rejected">("pending");
  const [search, setSearch] = useState("");
  const [quotes, setQuotes] = useState<Quote[]>(QUOTES);
  const [detalle, setDetalle] = useState<Quote | null>(null);

  const handleSaveQuote = (updated: Quote) => {
    setQuotes(prev => prev.map(q => q.id === updated.id ? updated : q));
    setDetalle(updated);
  };

  if (detalle) return <CotizacionDetalle cot={detalle} onBack={() => setDetalle(null)} onSave={handleSaveQuote} />;

  const counts = {
    pending:  quotes.filter(c => c.status === "pending").length,
    sent:     quotes.filter(c => c.status === "sent").length,
    accepted: quotes.filter(c => c.status === "accepted").length,
    rejected: quotes.filter(c => c.status === "rejected").length,
  };

  const filtered = quotes.filter(c => {
    const q = search.toLowerCase();
    const mTab    = c.status === activeTab;
    const mSearch = !q || (c.contact.name ?? "").toLowerCase().includes(q) || (c.contact.email ?? "").toLowerCase().includes(q) || c.id.toLowerCase().includes(q);
    return mTab && mSearch;
  });

  const tabDef: { id: typeof activeTab; label: string }[] = [
    { id: "pending",  label: "Pendientes" },
    { id: "sent",     label: "Enviadas"   },
    { id: "accepted", label: "Aceptadas"  },
    { id: "rejected", label: "Rechazadas" },
  ];

  const pendingOver48 = quotes.filter(c => c.status === "pending" && (hoursAgo(c.createdAt) ?? 0) > 48);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, fontFamily: "Inter, sans-serif" }}>
      {/* Partner welcome banner */}
      {isPartnerView && (
        <div style={{
          background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 8,
          padding: "12px 16px",
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

      {/* Status tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid #E5E7EB", gap: 0 }}>
        {tabDef.map(t => {
          const count = counts[t.id];
          const isActive = activeTab === t.id;
          return (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              padding: "10px 18px", border: "none",
              borderBottom: `2px solid ${isActive ? "#006CFE" : "transparent"}`,
              background: "transparent", cursor: "pointer",
              fontSize: 13, fontWeight: isActive ? 600 : 400,
              color: isActive ? "#006CFE" : "#475569",
              display: "flex", alignItems: "center", gap: 6,
            }}>
              {t.label}
              {count > 0 && (
                <span style={{
                  minWidth: 18, height: 18, borderRadius: 9, padding: "0 5px",
                  background: t.id === "pending" ? "#F13540" : isActive ? "#006CFE" : "#E5E7EB",
                  color: t.id === "pending" || isActive ? "#FFFFFF" : "#475569",
                  fontSize: 10, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center",
                }}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Search bar */}
      <FilterBar
        filters={[]}
        values={{}}
        onChange={() => {}}
        onClear={() => setSearch("")}
        onSearch={setSearch}
        searchValue={search}
        searchPlaceholder="Buscar por ID, nombre o email..."
      />

      {/* Urgency banner for pending */}
      {activeTab === "pending" && pendingOver48.length > 0 && (
        <div style={{ padding: "10px 16px", background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: 8, fontSize: 13, color: "#B91C1C", display: "flex", alignItems: "center", gap: 8 }}>
          <Clock size={14} />
          <strong>{pendingOver48.length} cotizaciones</strong> llevan más de 48h sin respuesta.
        </div>
      )}

      {/* Empty state */}
      {filtered.length === 0 && (
        <div style={{
          textAlign: "center", padding: "48px 20px",
          background: "#F7F8FA", borderRadius: 8,
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

      {/* Table */}
      {filtered.length > 0 && (
      <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
            <thead>
              <tr style={{ background: "#F7F8FA", borderBottom: "1px solid #E5E7EB" }}>
                {["ID", "Contacto", "Destinos solicitados", "Fechas", "Pax", "Estado", "Asignado a", "Solicitud", ""].map(h => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: h === "Pax" ? "center" : "left", fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => {
                const hours = hoursAgo(c.createdAt);
                const assignedName = findUser(c.assignedToUserId ?? "")?.name ?? "—";
                return (
                  <tr key={c.id}
                    onClick={() => setDetalle(c)}
                    style={{ borderBottom: i < filtered.length - 1 ? "1px solid #F1F5F9" : "none", cursor: "pointer" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#F7F8FA")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    <td style={{ padding: "12px 14px", fontWeight: 700, color: "#006CFE", fontSize: 12 }}>{c.id}</td>
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: "#0F172A" }}>{c.contact.name}</div>
                      <div style={{ fontSize: 11, color: "#94A3B8" }}>{c.contact.email}</div>
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                        {c.requestedDestinations.map(d => (
                          <span key={d} style={{ fontSize: 10, padding: "1px 6px", borderRadius: 20, background: "#F1F5F9", color: "#475569" }}>{d}</span>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: "12px 14px", fontSize: 12, color: "#475569", whiteSpace: "nowrap" }}>{c.requestedDates}</td>
                    <td style={{ padding: "12px 14px", textAlign: "center" }}>
                      <span style={{ fontWeight: 700, fontSize: 13 }}>{c.pax}</span>
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        <StatusBadge variant={STATUS_CONF[c.status].variant} label={STATUS_CONF[c.status].label} />
                        {hours !== null && c.status === "pending" && (
                          <span style={{ fontSize: 10, color: hours > 48 ? "#F13540" : "#F59E0B", display: "flex", alignItems: "center", gap: 3 }}>
                            <Clock size={9} />{hours}h
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: "12px 14px", fontSize: 12, color: "#475569" }}>{assignedName.split(" ")[0]}</td>
                    <td style={{ padding: "12px 14px", fontSize: 12, color: "#94A3B8", whiteSpace: "nowrap" }}>{fmtDate(c.createdAt)}</td>
                    <td style={{ padding: "12px 14px" }} onClick={e => e.stopPropagation()}>
                      <button onClick={() => setDetalle(c)}
                        style={{ padding: "4px 10px", borderRadius: 6, border: "none", background: c.status === "pending" ? "#006CFE" : "#F1F5F9", color: c.status === "pending" ? "#FFFFFF" : "#475569", fontSize: 12, cursor: "pointer", fontWeight: 500 }}>
                        {c.status === "pending" ? "Responder" : "Ver"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      )}
    </div>
  );
}
