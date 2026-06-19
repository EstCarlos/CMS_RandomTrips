import { useState } from "react";
import { Plus, Mail, Phone, Edit2, Globe, MessageSquare, CreditCard, FileText } from "lucide-react";
import { StatusBadge } from "../ui/StatusBadge";
import { FilterBar } from "../ui/FilterBar";
import { CUSTOMERS, BOOKINGS, TOURS_DATA, SITE_CONFIG, formatDOP } from "../../data/realData";

/* ── Lookups & derived ────────────────────────────────── */
const tourMap = Object.fromEntries(TOURS_DATA.map(t => [t.id, t]));

const enrichedCustomers = CUSTOMERS.map(c => {
  const bks      = BOOKINGS.filter(b => b.customerId === c.id);
  const valorTotal = bks.reduce((s, b) => s + b.depositPaid, 0);
  const lastBk   = bks.at(-1);
  return { ...c, totalReservas: bks.length, valorTotal, bks, ultimaActividad: lastBk ? "Jun 2026" : "—" };
});

/* ── Detalle ───────────────────────────────────────────── */
type Tab = "reservas" | "pagos" | "comunicaciones" | "notas";

function ClienteDetalle({ cliente, onBack }: { cliente: typeof enrichedCustomers[0]; onBack: () => void }) {
  const [tab, setTab] = useState<Tab>("reservas");
  const [notas, setNotas] = useState("");

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "reservas",       label: "Reservas",       icon: <Globe size={13} /> },
    { id: "pagos",          label: "Pagos",          icon: <CreditCard size={13} /> },
    { id: "comunicaciones", label: "Comunicaciones", icon: <MessageSquare size={13} /> },
    { id: "notas",          label: "Notas internas", icon: <FileText size={13} /> },
  ];

  const statusConf: Record<string, { variant: "success" | "info" | "danger"; label: string }> = {
    fullyPaid:     { variant: "success", label: "Pagado" },
    depositPaid:   { variant: "info",    label: "Depósito" },
    balanceOverdue:{ variant: "danger",  label: "Vencido" },
  };

  return (
    <div style={{ fontFamily: "Inter, sans-serif" }}>
      <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 4, border: "none", background: "transparent", cursor: "pointer", color: "#94A3B8", fontSize: 12, marginBottom: 16 }}>
        ← Clientes
      </button>

      <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, padding: "20px 24px", marginBottom: 20, display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: "#006CFE", flexShrink: 0 }}>
          {cliente.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>{cliente.name}</div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: 12, color: "#475569" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Mail size={11} /> {cliente.email}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Phone size={11} /> {cliente.phone}</span>
            <span>{cliente.country}</span>
            <span>Idioma: {cliente.preferredLanguage}</span>
            <span>Moneda: {cliente.preferredCurrency}</span>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, textAlign: "center" }}>
          {[
            { label: "Reservas",     value: String(cliente.totalReservas) },
            { label: "Cobrado",      value: formatDOP(cliente.valorTotal) },
            { label: "Última activ.", value: cliente.ultimaActividad },
          ].map(k => (
            <div key={k.label}>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#006CFE" }}>{k.value}</div>
              <div style={{ fontSize: 10, color: "#94A3B8" }}>{k.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid #E5E7EB", marginBottom: 20 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "8px 18px", border: "none", borderBottom: `2px solid ${tab === t.id ? "#006CFE" : "transparent"}`, background: "transparent", cursor: "pointer", fontSize: 13, fontWeight: tab === t.id ? 600 : 400, color: tab === t.id ? "#006CFE" : "#475569", display: "flex", alignItems: "center", gap: 6 }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {tab === "reservas" && (
        <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, overflow: "hidden" }}>
          {cliente.bks.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#94A3B8" }}>Sin reservas aún</div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#F7F8FA", borderBottom: "1px solid #E5E7EB" }}>
                  {["ID", "Tour", "Fecha", "Pax", "Total", "Pagado", "Saldo", "Estado"].map(h => (
                    <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 10, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cliente.bks.map((bk, i) => {
                  const t  = tourMap[bk.tourId];
                  const st = statusConf[bk.status];
                  return (
                    <tr key={bk.id} style={{ borderBottom: i < cliente.bks.length - 1 ? "1px solid #F1F5F9" : "none" }}>
                      <td style={{ padding: "12px 14px", fontWeight: 700, color: "#006CFE", fontSize: 12 }}>{bk.id}</td>
                      <td style={{ padding: "12px 14px", fontSize: 13 }}>{t.title.es}</td>
                      <td style={{ padding: "12px 14px", fontSize: 12, color: "#475569" }}>{bk.displayDate}</td>
                      <td style={{ padding: "12px 14px", fontSize: 13, textAlign: "center" }}>{bk.totalPax}</td>
                      <td style={{ padding: "12px 14px", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{formatDOP(bk.totalPrice)}</td>
                      <td style={{ padding: "12px 14px", fontWeight: 600, color: "#16A34A", fontVariantNumeric: "tabular-nums" }}>{formatDOP(bk.depositPaid)}</td>
                      <td style={{ padding: "12px 14px", fontWeight: 600, color: bk.outstandingBalance > 0 ? "#F13540" : "#94A3B8", fontVariantNumeric: "tabular-nums" }}>{bk.outstandingBalance > 0 ? formatDOP(bk.outstandingBalance) : "—"}</td>
                      <td style={{ padding: "12px 14px" }}><StatusBadge variant={st.variant} label={st.label} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === "pagos" && (
        <div style={{ padding: "20px", background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, color: "#94A3B8", fontSize: 13, textAlign: "center" }}>
          Ver tab Pagos para el historial de transacciones de este cliente.
        </div>
      )}

      {tab === "comunicaciones" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { text: "Email de confirmación de reserva enviado", fecha: "Jun 2026" },
            { text: `Recordatorio de saldo por WhatsApp (${SITE_CONFIG.contact.whatsapp})`, fecha: "Jun 2026" },
          ].map((e, i) => (
            <div key={i} style={{ display: "flex", gap: 12, padding: "12px 16px", background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Mail size={14} color="#006CFE" />
              </div>
              <div>
                <div style={{ fontSize: 13, color: "#0F172A" }}>{e.text}</div>
                <div style={{ fontSize: 11, color: "#94A3B8" }}>{e.fecha}</div>
              </div>
              <StatusBadge variant="success" label="Entregado" />
            </div>
          ))}
        </div>
      )}

      {tab === "notas" && (
        <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, padding: "16px" }}>
          <textarea value={notas} onChange={e => setNotas(e.target.value)} rows={6}
            placeholder="Añade notas sobre preferencias, acuerdos especiales, historial..."
            style={{ width: "100%", padding: "10px 12px", border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 13, outline: "none", resize: "vertical", fontFamily: "Inter, sans-serif", boxSizing: "border-box" }}
          />
        </div>
      )}
    </div>
  );
}

/* ── List ─────────────────────────────────────────────── */
export function Clientes() {
  const [search, setSearch]   = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [detalle, setDetalle] = useState<typeof enrichedCustomers[0] | null>(null);

  if (detalle) return <ClienteDetalle cliente={detalle} onBack={() => setDetalle(null)} />;

  const filtered = enrichedCustomers.filter(c => {
    const q = search.toLowerCase();
    const mSearch = !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
    const mIdioma = !filters.idioma || c.preferredLanguage === filters.idioma;
    return mSearch && mIdioma;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, fontFamily: "Inter, sans-serif" }}>
      {/* Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        {[
          { label: "Total clientes",    value: CUSTOMERS.length },
          { label: "Dominicanos",       value: CUSTOMERS.filter(c => c.country.includes("DO")).length },
          { label: "Internacionales",   value: CUSTOMERS.filter(c => !c.country.includes("DO")).length },
          { label: "Con saldo pendiente", value: BOOKINGS.filter(b => b.outstandingBalance > 0).length },
        ].map(k => (
          <div key={k.label} style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "#475569" }}>{k.label}</span>
            <span style={{ fontSize: 20, fontWeight: 800, color: "#0F172A" }}>{k.value}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <FilterBar
          filters={[
            { key: "idioma", label: "Idioma", type: "select", options: [{ value: "ES", label: "ES" }, { value: "EN", label: "EN" }, { value: "FR", label: "FR" }] },
          ]}
          values={filters}
          onChange={(k, v) => setFilters(p => ({ ...p, [k]: v }))}
          onClear={() => { setFilters({}); setSearch(""); }}
          onSearch={setSearch}
          searchValue={search}
          searchPlaceholder="Buscar clientes..."
        />
        <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 6, border: "none", background: "#006CFE", fontSize: 13, color: "#FFFFFF", cursor: "pointer", fontWeight: 500 }}>
          <Plus size={14} /> Nuevo cliente
        </button>
      </div>

      <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F7F8FA", borderBottom: "1px solid #E5E7EB" }}>
              {["Cliente", "Email", "País / Idioma", "Moneda", "Reservas", "Cobrado", "Saldo pendiente", ""].map(h => (
                <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={8} style={{ padding: "48px", textAlign: "center", color: "#94A3B8", fontSize: 13 }}>Sin clientes registrados</td></tr>
            ) : filtered.map((c, i) => {
              const saldo = c.bks.reduce((s, b) => s + b.outstandingBalance, 0);
              return (
                <tr key={c.id}
                  onClick={() => setDetalle(c)}
                  style={{ borderBottom: i < filtered.length - 1 ? "1px solid #F1F5F9" : "none", cursor: "pointer" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#F7F8FA")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "#006CFE", flexShrink: 0 }}>
                        {c.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>{c.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 14px", fontSize: 12, color: "#475569" }}>{c.email}</td>
                  <td style={{ padding: "12px 14px", fontSize: 13, color: "#475569" }}>{c.country} · {c.preferredLanguage}</td>
                  <td style={{ padding: "12px 14px", fontSize: 12, color: "#475569" }}>{c.preferredCurrency}</td>
                  <td style={{ padding: "12px 14px", textAlign: "center", fontWeight: 700, fontSize: 13 }}>{c.totalReservas}</td>
                  <td style={{ padding: "12px 14px", fontWeight: 700, color: "#16A34A", fontVariantNumeric: "tabular-nums" }}>{formatDOP(c.valorTotal)}</td>
                  <td style={{ padding: "12px 14px", fontWeight: 600, color: saldo > 0 ? "#F13540" : "#94A3B8", fontVariantNumeric: "tabular-nums" }}>
                    {saldo > 0 ? formatDOP(saldo) : "—"}
                  </td>
                  <td style={{ padding: "12px 14px" }} onClick={e => e.stopPropagation()}>
                    <button onClick={() => setDetalle(c)} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid #E5E7EB", background: "#FFFFFF", fontSize: 12, cursor: "pointer", color: "#475569" }}>Ver</button>
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
