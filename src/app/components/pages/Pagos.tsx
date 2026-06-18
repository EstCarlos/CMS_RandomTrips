import { useState } from "react";
import { Link, Send, Copy, X, Plus, Download, RefreshCw } from "lucide-react";
import { StatusBadge } from "../ui/StatusBadge";
import { Btn } from "../ui/Modal";
import { FormField, Input, SelectField, Textarea } from "../ui/FormField";
import {
  BOOKINGS, CUSTOMERS, TOURS_DATA, PAYMENTS, PAYMENT_LINKS,
  TOTAL_COBRADO, TOTAL_SALDO, formatDOP, dopToUSD,
} from "../../data/realData";

/* ── Lookups ─────────────────────────────────────────── */
const custMap = Object.fromEntries(CUSTOMERS.map(c => [c.id, c]));
const tourMap = Object.fromEntries(TOURS_DATA.map(t => [t.id, t]));
const bkMap   = Object.fromEntries(BOOKINGS.map(b => [b.id, b]));

type PagoTab = "saldos" | "links" | "transacciones" | "reembolsos";

const LINK_STATUS: Record<string, { variant: "success" | "neutral" | "danger" | "warning"; label: string }> = {
  enviado:   { variant: "warning", label: "Enviado"   },
  vencido:   { variant: "danger",  label: "Vencido"   },
  pendiente: { variant: "neutral", label: "Pendiente" },
  pagado:    { variant: "success", label: "Pagado"    },
};

const TX_TIPO_COLOR: Record<string, string> = {
  deposito: "#006CFE",
  saldo:    "#16A34A",
  reembolso: "#F13540",
};

/* ── Reembolso Modal ─────────────────────────────────── */
function ReembolsoModal({ onClose }: { onClose: () => void }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(15,23,42,.4)" }} />
      <div style={{ position: "relative", width: 480, background: "#FFFFFF", borderRadius: 8, boxShadow: "0 20px 60px rgba(0,0,0,.15)", fontFamily: "Inter, sans-serif", overflow: "hidden" }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #E5E7EB", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#0F172A" }}>Registrar reembolso manual</span>
          <button onClick={onClose} style={{ border: "1px solid #E5E7EB", background: "#FFFFFF", borderRadius: 6, width: 28, height: 28, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={13} color="#94A3B8" />
          </button>
        </div>
        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 14 }}>
          <FormField label="Reserva" required>
            <SelectField value="" options={BOOKINGS.map(b => ({ value: b.id, label: `${b.id} · ${custMap[b.customer_id].nombre}` }))} placeholder="Seleccionar reserva..." />
          </FormField>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <FormField label="Monto (DOP)" required><Input placeholder="2200" /></FormField>
            <FormField label="Moneda"><SelectField value="DOP" options={[{value:"DOP",label:"DOP"},{value:"USD",label:"USD"},{value:"EUR",label:"EUR"}]} /></FormField>
          </div>
          <FormField label="Motivo" required>
            <SelectField value="" options={[
              {value:"cancelacion", label:"Cancelación cliente"},
              {value:"operador",    label:"Tour cancelado por operador"},
              {value:"fuerza_mayor",label:"Fuerza mayor"},
              {value:"otro",        label:"Otro"},
            ]} placeholder="Seleccionar motivo..." />
          </FormField>
          <FormField label="Notas"><Textarea rows={3} placeholder="Detalles adicionales..." /></FormField>
        </div>
        <div style={{ padding: "14px 20px", borderTop: "1px solid #E5E7EB", display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <Btn variant="secondary" onClick={onClose}>Cancelar</Btn>
          <Btn variant="danger" onClick={onClose}>Registrar reembolso</Btn>
        </div>
      </div>
    </div>
  );
}

/* ── Main ────────────────────────────────────────────── */
export function Pagos() {
  const [tab, setTab]                   = useState<PagoTab>("saldos");
  const [selected, setSelected]         = useState<Set<string>>(new Set());
  const [showReembolso, setShowReembolso] = useState(false);

  const saldosPendientes = BOOKINGS.filter(b => b.saldo_pendiente > 0).map(b => {
    const cust = custMap[b.customer_id];
    const tour = tourMap[b.tour_id];
    const link = PAYMENT_LINKS.find(l => l.booking_id === b.id);
    return { bk: b, cust, tour, link };
  });

  const totalPendiente = saldosPendientes.reduce((s, x) => s + x.bk.saldo_pendiente, 0);

  const TABS: { id: PagoTab; label: string; count?: number }[] = [
    { id: "saldos",        label: "Saldos pendientes", count: saldosPendientes.length },
    { id: "links",         label: "Links generados",   count: PAYMENT_LINKS.length },
    { id: "transacciones", label: "Transacciones",     count: PAYMENTS.length },
    { id: "reembolsos",    label: "Reembolsos" },
  ];

  const allSel = saldosPendientes.length > 0 && selected.size === saldosPendientes.length;
  const toggleAll = () => allSel ? setSelected(new Set()) : setSelected(new Set(saldosPendientes.map(x => x.bk.id)));
  const toggleSel = (id: string) => { const n = new Set(selected); n.has(id) ? n.delete(id) : n.add(id); setSelected(n); };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, fontFamily: "Inter, sans-serif" }}>
      {showReembolso && <ReembolsoModal onClose={() => setShowReembolso(false)} />}

      {/* Summary strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        {[
          { label: "Total cobrado",       value: formatDOP(TOTAL_COBRADO),    color: "#16A34A", bg: "#F0FDF4" },
          { label: "Saldo por cobrar",    value: formatDOP(TOTAL_SALDO),      color: "#F13540", bg: "#FEF2F2" },
          { label: "Transacciones",       value: PAYMENTS.length,             color: "#006CFE", bg: "#EFF6FF" },
          { label: "Links vencidos",      value: PAYMENT_LINKS.filter(l => l.estado === "vencido").length, color: "#F59E0B", bg: "#FFFBEB" },
        ].map(k => (
          <div key={k.label} style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "#475569" }}>{k.label}</span>
            <span style={{ fontSize: typeof k.value === "string" && k.value.length > 8 ? 14 : 20, fontWeight: 800, color: k.color, background: k.bg, padding: "2px 10px", borderRadius: 20, fontVariantNumeric: "tabular-nums" }}>{k.value}</span>
          </div>
        ))}
      </div>

      {/* Sub-tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid #E5E7EB", gap: 0 }}>
        {TABS.map(t => {
          const isActive = tab === t.id;
          return (
            <button key={t.id} onClick={() => { setTab(t.id); setSelected(new Set()); }} style={{ padding: "9px 18px", border: "none", borderBottom: `2px solid ${isActive ? "#006CFE" : "transparent"}`, background: "transparent", cursor: "pointer", fontSize: 13, fontWeight: isActive ? 600 : 400, color: isActive ? "#006CFE" : "#475569", display: "flex", alignItems: "center", gap: 6 }}>
              {t.label}
              {t.count !== undefined && t.count > 0 && (
                <span style={{ minWidth: 18, height: 18, borderRadius: 9, padding: "0 5px", background: isActive ? "#006CFE" : "#E5E7EB", color: isActive ? "#FFFFFF" : "#475569", fontSize: 10, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{t.count}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Saldos pendientes ── */}
      {tab === "saldos" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {selected.size > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 8 }}>
              <span style={{ fontWeight: 600, color: "#1D4ED8", fontSize: 13 }}>{selected.size} seleccionados</span>
              <button style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 12px", borderRadius: 6, border: "none", background: "#006CFE", fontSize: 12, color: "#FFFFFF", cursor: "pointer" }}>
                <Send size={12} /> Enviar recordatorios masivos
              </button>
              <button onClick={() => setSelected(new Set())} style={{ marginLeft: "auto", border: "none", background: "transparent", fontSize: 12, color: "#94A3B8", cursor: "pointer" }}>Cancelar</button>
            </div>
          )}
          <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#F7F8FA", borderBottom: "1px solid #E5E7EB" }}>
                  <th style={{ padding: "10px 16px", width: 40 }}>
                    <input type="checkbox" checked={allSel} onChange={toggleAll} style={{ cursor: "pointer", accentColor: "#006CFE" }} />
                  </th>
                  {["Reserva", "Cliente", "Tour", "Fecha", "Saldo DOP", "USD equiv.", "Link / Estado", "Recordatorios", ""].map(h => (
                    <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {saldosPendientes.map(({ bk, cust, tour, link }, i) => {
                  const isSel = selected.has(bk.id);
                  const isVencido = bk.estado === "saldo_vencido";
                  return (
                    <tr key={bk.id}
                      style={{ borderBottom: i < saldosPendientes.length - 1 ? "1px solid #F1F5F9" : "none", background: isSel ? "#F0F7FF" : isVencido ? "#FFF7ED" : "transparent" }}
                      onMouseEnter={e => { if (!isSel) (e.currentTarget as HTMLElement).style.background = "#F7F8FA"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = isSel ? "#F0F7FF" : isVencido ? "#FFF7ED" : "transparent"; }}
                    >
                      <td style={{ padding: "12px 16px" }}>
                        <input type="checkbox" checked={isSel} onChange={() => toggleSel(bk.id)} style={{ cursor: "pointer", accentColor: "#006CFE" }} />
                      </td>
                      <td style={{ padding: "12px 14px", fontWeight: 700, color: "#006CFE", fontSize: 12 }}>{bk.id}</td>
                      <td style={{ padding: "12px 14px", fontSize: 13, color: "#0F172A" }}>{cust.nombre}</td>
                      <td style={{ padding: "12px 14px", fontSize: 12, color: "#475569", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{tour.titulo_es}</td>
                      <td style={{ padding: "12px 14px", fontSize: 12, color: "#475569" }}>{bk.fecha_display}</td>
                      <td style={{ padding: "12px 14px", fontWeight: 700, color: isVencido ? "#F13540" : "#0F172A", fontVariantNumeric: "tabular-nums" }}>{formatDOP(bk.saldo_pendiente)}</td>
                      <td style={{ padding: "12px 14px", fontSize: 12, color: "#94A3B8" }}>≈ ${dopToUSD(bk.saldo_pendiente)}</td>
                      <td style={{ padding: "12px 14px" }}>
                        {link ? (
                          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <span style={{ fontSize: 11, fontFamily: "monospace", color: "#475569" }}>{link.invoice_id}</span>
                            <StatusBadge variant={LINK_STATUS[link.estado].variant} label={LINK_STATUS[link.estado].label} />
                            <span style={{ fontSize: 10, color: "#94A3B8" }}>Vence {link.expira}</span>
                          </div>
                        ) : <span style={{ fontSize: 12, color: "#94A3B8" }}>Sin link</span>}
                      </td>
                      <td style={{ padding: "12px 14px", fontSize: 11, color: "#94A3B8" }}>
                        {link?.recordatorios.length ? link.recordatorios.join(", ") : "Ninguno"}
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <div style={{ display: "flex", gap: 5 }}>
                          <button style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 6, border: "none", background: "#006CFE", fontSize: 11, color: "#FFFFFF", cursor: "pointer" }}>
                            <Link size={11} /> Generar link
                          </button>
                          <button style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 8px", borderRadius: 6, border: "1px solid #E5E7EB", background: "#FFFFFF", fontSize: 11, color: "#475569", cursor: "pointer" }}>
                            <Send size={11} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={{ fontSize: 12, color: "#475569", textAlign: "right" }}>
            Total pendiente: <strong style={{ color: "#F13540" }}>{formatDOP(totalPendiente)}</strong> · ≈ ${dopToUSD(totalPendiente)} USD
          </div>
        </div>
      )}

      {/* ── Links generados ── */}
      {tab === "links" && (
        <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#F7F8FA", borderBottom: "1px solid #E5E7EB" }}>
                {["Invoice ID", "Reserva", "Cliente", "Monto", "Estado", "Expira", "Recordatorios", ""].map(h => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PAYMENT_LINKS.map((l, i) => {
                const bk   = bkMap[l.booking_id];
                const cust = custMap[bk.customer_id];
                return (
                  <tr key={l.invoice_id} style={{ borderBottom: i < PAYMENT_LINKS.length - 1 ? "1px solid #F1F5F9" : "none" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#F7F8FA")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    <td style={{ padding: "12px 14px", fontWeight: 700, color: "#006CFE", fontSize: 12, fontFamily: "monospace" }}>{l.invoice_id}</td>
                    <td style={{ padding: "12px 14px", fontSize: 12, color: "#475569" }}>{l.booking_id}</td>
                    <td style={{ padding: "12px 14px", fontSize: 13, color: "#0F172A" }}>{cust.nombre}</td>
                    <td style={{ padding: "12px 14px", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{formatDOP(l.monto)}</td>
                    <td style={{ padding: "12px 14px" }}><StatusBadge variant={LINK_STATUS[l.estado].variant} label={LINK_STATUS[l.estado].label} /></td>
                    <td style={{ padding: "12px 14px", fontSize: 12, color: l.estado === "vencido" ? "#F13540" : "#94A3B8" }}>{l.expira}</td>
                    <td style={{ padding: "12px 14px", fontSize: 11, color: "#94A3B8" }}>{l.recordatorios.length > 0 ? l.recordatorios.join(", ") : "—"}</td>
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ display: "flex", gap: 4 }}>
                        <button title="Copiar link" style={{ width: 27, height: 27, borderRadius: 6, border: "1px solid #E5E7EB", background: "#FFFFFF", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Copy size={11} color="#475569" />
                        </button>
                        {l.estado !== "pagado" && (
                          <button title="Reenviar" style={{ width: 27, height: 27, borderRadius: 6, border: "1px solid #E5E7EB", background: "#FFFFFF", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Send size={11} color="#475569" />
                          </button>
                        )}
                        {l.estado === "vencido" && (
                          <button title="Regenerar" style={{ width: 27, height: 27, borderRadius: 6, border: "1px solid #BFDBFE", background: "#EFF6FF", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <RefreshCw size={11} color="#006CFE" />
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
      )}

      {/* ── Transacciones ── */}
      {tab === "transacciones" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 6, border: "1px solid #E5E7EB", background: "#FFFFFF", fontSize: 13, color: "#475569", cursor: "pointer" }}>
              <Download size={13} /> Exportar CSV
            </button>
          </div>
          <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#F7F8FA", borderBottom: "1px solid #E5E7EB" }}>
                  {["PayPal ID", "Reserva", "Cliente", "Tipo", "Monto (DOP)", "Estado", "Fecha"].map(h => (
                    <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PAYMENTS.map((p, i) => {
                  const bk   = bkMap[p.booking_id];
                  const cust = bk ? custMap[bk.customer_id] : null;
                  const color = TX_TIPO_COLOR[p.tipo] || "#475569";
                  return (
                    <tr key={p.paypal_txn_id} style={{ borderBottom: i < PAYMENTS.length - 1 ? "1px solid #F1F5F9" : "none" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "#F7F8FA")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      <td style={{ padding: "12px 14px", fontSize: 11, color: "#94A3B8", fontFamily: "monospace" }}>{p.paypal_txn_id}</td>
                      <td style={{ padding: "12px 14px", fontWeight: 600, color: "#006CFE", fontSize: 12 }}>{p.booking_id}</td>
                      <td style={{ padding: "12px 14px", fontSize: 13, color: "#0F172A" }}>{cust?.nombre ?? "—"}</td>
                      <td style={{ padding: "12px 14px" }}>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: color + "18", color, textTransform: "capitalize" }}>{p.tipo}</span>
                      </td>
                      <td style={{ padding: "12px 14px", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{formatDOP(p.monto)}</td>
                      <td style={{ padding: "12px 14px" }}>
                        <StatusBadge variant="success" label="Completado" />
                      </td>
                      <td style={{ padding: "12px 14px", fontSize: 12, color: "#94A3B8" }}>{p.fecha}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Reembolsos ── */}
      {tab === "reembolsos" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button onClick={() => setShowReembolso(true)}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 6, border: "none", background: "#006CFE", fontSize: 13, color: "#FFFFFF", cursor: "pointer", fontWeight: 500 }}>
              <Plus size={13} /> Registrar reembolso manual
            </button>
          </div>
          <div style={{ textAlign: "center", padding: "60px 0", background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8 }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>✅</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#0F172A", marginBottom: 6 }}>Sin reembolsos registrados</div>
            <div style={{ fontSize: 13, color: "#94A3B8" }}>No se han procesado reembolsos hasta la fecha.</div>
          </div>
        </div>
      )}
    </div>
  );
}
