import { useState } from "react";
import { Download, Send, XCircle, Eye, Link } from "lucide-react";
import { FilterBar } from "../ui/FilterBar";
import { StatusBadge } from "../ui/StatusBadge";
import { ReservaDetalle } from "./ReservaDetalle";
import {
  BOOKINGS, CUSTOMERS, TOURS_DATA, PAYMENT_LINKS,
  formatDOP, dopToUSD, dopToEUR,
  SITE_CONFIG, findDestination,
} from "../../data/realData";

/* ── Lookups ─────────────────────────────────────────────── */
const custMap = Object.fromEntries(CUSTOMERS.map(c => [c.id, c]));
const tourMap = Object.fromEntries(TOURS_DATA.map(t => [t.id, t]));

/* ── Status config ─────────────────────────────────────── */
const statusConf: Record<string, { variant: "success" | "warning" | "danger" | "info" | "neutral"; label: string }> = {
  fullyPaid:     { variant: "success", label: "Pagado"        },
  depositPaid:   { variant: "info",    label: "Depósito"      },
  balanceOverdue:{ variant: "danger",  label: "Saldo vencido" },
  cancelled:     { variant: "neutral", label: "Cancelado"     },
};

/* ── KPI bar ─────────────────────────────────────────────── */
function KPIBar() {
  const total        = BOOKINGS.length;
  const pagados      = BOOKINGS.filter(b => b.status === "fullyPaid").length;
  const depositos    = BOOKINGS.filter(b => b.status === "depositPaid").length;
  const vencidos     = BOOKINGS.filter(b => b.status === "balanceOverdue").length;
  const totalSaldo   = BOOKINGS.reduce((s, b) => s + b.outstandingBalance, 0);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, fontFamily: "Inter, sans-serif" }}>
      {[
        { label: "Total reservas",       value: total,     color: "#475569", bg: "#F1F5F9" },
        { label: "Pagado completo",      value: pagados,   color: "#16A34A", bg: "#F0FDF4" },
        { label: "Depósito pendiente",   value: depositos, color: "#006CFE", bg: "#EFF6FF" },
        { label: "Saldo vencido",        value: vencidos,  color: "#F13540", bg: "#FEF2F2" },
      ].map(k => (
        <div key={k.label} style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 12, color: "#475569" }}>{k.label}</span>
          <span style={{ fontSize: 22, fontWeight: 800, color: k.color, background: k.bg, padding: "2px 10px", borderRadius: 20, fontVariantNumeric: "tabular-nums" }}>{k.value}</span>
        </div>
      ))}
      {totalSaldo > 0 && (
        <div style={{ gridColumn: "1 / -1", padding: "10px 16px", background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 8, fontSize: 13, color: "#92400E", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>💰 Saldo total por cobrar: <strong>{formatDOP(totalSaldo)}</strong></span>
          <span style={{ fontSize: 12 }}>≈ ${dopToUSD(totalSaldo)} USD · €{dopToEUR(totalSaldo)} EUR</span>
        </div>
      )}
    </div>
  );
}

/* ── Build ReservaDetalle-compatible object ──────────────── */
function buildDetalleReserva(bkId: string) {
  const bk   = BOOKINGS.find(b => b.id === bkId)!;
  const cust = custMap[bk.customerId];
  const tour = tourMap[bk.tourId];
  const link = PAYMENT_LINKS.find(l => l.bookingId === bk.id);
  return {
    id: bk.id,
    cliente: cust.name,
    email: cust.email,
    telefono: cust.phone,
    pais: cust.country,
    tour: tour.title.es,
    destino: tour.destinationIds.map(id => findDestination(id)?.name.es ?? id).join(", "),
    fechaTour: bk.displayDate ?? "",
    fechaCreacion: "Jun 2026",
    pax: bk.totalPax,
    total: bk.totalPrice,
    pagado: bk.depositPaid,
    status: bk.status === "fullyPaid" ? "confirmed" : bk.status === "balanceOverdue" ? "pending" : "partial",
    operador: "Random Trips",
    notas: link ? `Link de pago: ${link.invoiceId} · Vence ${link.expiresAt} · Estado: ${link.status}` : "",
  };
}

/* ── Main ────────────────────────────────────────────────── */
export function Reservas() {
  const [search, setSearch]     = useState("");
  const [filters, setFilters]   = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [detalleId, setDetalleId] = useState<string | null>(null);

  if (detalleId) {
    const obj = buildDetalleReserva(detalleId);
    return <ReservaDetalle reserva={obj} onBack={() => setDetalleId(null)} />;
  }

  /* Filter */
  const filtered = BOOKINGS.filter(bk => {
    const cust = custMap[bk.customerId];
    const q    = search.toLowerCase();
    const mSearch = !q || bk.id.toLowerCase().includes(q) || cust.name.toLowerCase().includes(q) || cust.email.toLowerCase().includes(q);
    const mStatus = !filters.status || bk.status === filters.status;
    const mTour   = !filters.tour   || bk.tourId === filters.tour;
    return mSearch && mStatus && mTour;
  });

  const allChecked  = filtered.length > 0 && selected.size === filtered.length;
  const someChecked = selected.size > 0;
  const toggleAll   = () => allChecked ? setSelected(new Set()) : setSelected(new Set(filtered.map(b => b.id)));
  const toggleRow   = (id: string) => { const n = new Set(selected); n.has(id) ? n.delete(id) : n.add(id); setSelected(n); };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, fontFamily: "Inter, sans-serif" }}>
      <KPIBar />

      {/* Toolbar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <FilterBar
          filters={[
            { key: "status", label: "Estado", type: "select", options: Object.entries(statusConf).map(([v, s]) => ({ value: v, label: s.label })) },
            { key: "tour",   label: "Tour",   type: "select", options: TOURS_DATA.map(t => ({ value: t.id, label: t.title.es })) },
          ]}
          values={filters}
          onChange={(k, v) => setFilters(p => ({ ...p, [k]: v }))}
          onClear={() => { setFilters({}); setSearch(""); }}
          onSearch={setSearch}
          searchValue={search}
          searchPlaceholder="Buscar por ID, cliente o email..."
        />
        <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 6, border: "1px solid #E5E7EB", background: "#FFFFFF", fontSize: 13, color: "#475569", cursor: "pointer" }}>
          <Download size={14} /> Exportar
        </button>
      </div>

      {/* Bulk actions */}
      {someChecked && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 8, fontSize: 13 }}>
          <span style={{ fontWeight: 600, color: "#1D4ED8" }}>{selected.size} seleccionadas</span>
          <button style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 12px", borderRadius: 6, border: "1px solid #BFDBFE", background: "#FFFFFF", fontSize: 12, cursor: "pointer", color: "#475569" }}>
            <Send size={11} /> Enviar recordatorio
          </button>
          <button onClick={() => setSelected(new Set())} style={{ marginLeft: "auto", border: "none", background: "transparent", fontSize: 12, color: "#94A3B8", cursor: "pointer" }}>Deseleccionar</button>
        </div>
      )}

      {/* Table */}
      <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1000 }}>
            <thead>
              <tr style={{ background: "#F7F8FA", borderBottom: "1px solid #E5E7EB" }}>
                <th style={{ padding: "10px 16px", width: 40, textAlign: "center" }}>
                  <input type="checkbox" checked={allChecked} onChange={toggleAll} style={{ cursor: "pointer", accentColor: "#006CFE" }} />
                </th>
                {["ID", "Cliente", "Tour", "Fecha", "Pax", "Total (DOP)", "Pagado", "Saldo", "Estado", ""].map(h => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: ["Total (DOP)", "Pagado", "Saldo"].includes(h) ? "right" : "left", fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={11} style={{ padding: "48px", textAlign: "center", color: "#94A3B8", fontSize: 13 }}>Sin reservas</td></tr>
              ) : filtered.map((bk, i) => {
                const cust  = custMap[bk.customerId];
                const tour  = tourMap[bk.tourId];
                const st    = statusConf[bk.status];
                const isSel = selected.has(bk.id);
                const link  = PAYMENT_LINKS.find(l => l.bookingId === bk.id);

                return (
                  <tr key={bk.id}
                    onClick={() => setDetalleId(bk.id)}
                    style={{ borderBottom: i < filtered.length - 1 ? "1px solid #F1F5F9" : "none", background: isSel ? "#F0F7FF" : bk.status === "balanceOverdue" ? "#FFFBEB" : "#FFFFFF", cursor: "pointer", transition: "background 0.08s" }}
                    onMouseEnter={e => { if (!isSel) (e.currentTarget as HTMLElement).style.background = "#F7F8FA"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = isSel ? "#F0F7FF" : bk.status === "balanceOverdue" ? "#FFFBEB" : "#FFFFFF"; }}
                  >
                    <td style={{ padding: "12px 16px" }} onClick={e => e.stopPropagation()}>
                      <input type="checkbox" checked={isSel} onChange={() => toggleRow(bk.id)} style={{ cursor: "pointer", accentColor: "#006CFE" }} />
                    </td>
                    <td style={{ padding: "12px 14px", fontWeight: 700, color: "#006CFE", fontSize: 12, whiteSpace: "nowrap" }}>{bk.id}</td>
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: "#0F172A" }}>{cust.name}</div>
                      <div style={{ fontSize: 11, color: "#94A3B8" }}>{cust.email}</div>
                    </td>
                    <td style={{ padding: "12px 14px", fontSize: 12, color: "#475569", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{tour.title.es}</td>
                    <td style={{ padding: "12px 14px", fontSize: 12, color: "#475569", whiteSpace: "nowrap" }}>{bk.displayDate}</td>
                    <td style={{ padding: "12px 14px", textAlign: "center", fontWeight: 600 }}>{bk.totalPax}</td>
                    <td style={{ padding: "12px 14px", textAlign: "right", fontWeight: 700, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{formatDOP(bk.totalPrice)}</td>
                    <td style={{ padding: "12px 14px", textAlign: "right", fontWeight: 600, color: "#16A34A", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{formatDOP(bk.depositPaid)}</td>
                    <td style={{ padding: "12px 14px", textAlign: "right", fontWeight: 600, color: bk.outstandingBalance > 0 ? "#F13540" : "#94A3B8", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
                      {bk.outstandingBalance > 0 ? formatDOP(bk.outstandingBalance) : "—"}
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        <StatusBadge variant={st.variant} label={st.label} />
                        {link && (
                          <span style={{ fontSize: 10, color: link.status === "expired" ? "#F13540" : "#94A3B8" }}>
                            {link.status === "expired" ? "⚠️ Link vencido" : link.status === "sent" ? "📤 Link enviado" : "🕐 Sin link"}
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: "12px 14px" }} onClick={e => e.stopPropagation()}>
                      <div style={{ display: "flex", gap: 4 }}>
                        <button onClick={() => setDetalleId(bk.id)}
                          style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid #E5E7EB", background: "#FFFFFF", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Eye size={12} color="#475569" />
                        </button>
                        {bk.outstandingBalance > 0 && (
                          <button title="Generar link de pago"
                            style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid #BFDBFE", background: "#EFF6FF", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Link size={12} color="#006CFE" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div style={{ padding: "12px 20px", borderTop: "1px solid #E5E7EB", display: "flex", justifyContent: "space-between", fontSize: 12, color: "#475569" }}>
          <span>Mostrando {filtered.length} de {BOOKINGS.length} reservas</span>
          <span style={{ color: "#94A3B8" }}>WhatsApp atención: {SITE_CONFIG.contact.whatsapp}</span>
        </div>
      </div>
    </div>
  );
}
