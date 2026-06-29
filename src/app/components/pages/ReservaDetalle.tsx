import { useState } from "react";
import {
  ArrowLeft, Link, XCircle, RefreshCw, CheckCircle2,
  Mail, User, Package, CreditCard, MessageSquare, Clock,
  Check, AlertCircle, Send,
} from "lucide-react";
import { StatusBadge } from "../ui/StatusBadge";
import { Btn } from "../ui/Modal";
import type { Booking, Customer, BookingStatus, PaymentType, PaymentStatus, PaymentLinkStatus } from "../../data/types";
import { PAYMENTS, PAYMENT_LINKS, findTour, findOperator, findDestination, formatDOP } from "../../data/realData";

/* ── Status configs ─────────────────────────────────────── */
const statusConf: Record<BookingStatus, { variant: "success" | "warning" | "danger" | "neutral" | "info"; label: string }> = {
  pendingPayment: { variant: "warning", label: "Pendiente pago" },
  depositPaid:    { variant: "info",    label: "Depósito pagado" },
  fullyPaid:      { variant: "success", label: "Pago completo"  },
  balanceOverdue: { variant: "danger",  label: "Saldo vencido"  },
  cancelled:      { variant: "danger",  label: "Cancelada"      },
  completed:      { variant: "neutral", label: "Finalizada"     },
};

const paymentTypeLabel: Record<PaymentType, string> = {
  deposit: "Depósito",
  balance: "Saldo",
  refund:  "Reembolso",
};

const paymentStatusConf: Record<PaymentStatus, { variant: "success" | "warning" | "danger" | "info" | "neutral"; label: string }> = {
  paid:     { variant: "success", label: "Confirmado"   },
  pending:  { variant: "warning", label: "Pendiente"    },
  failed:   { variant: "danger",  label: "Fallido"      },
  refunded: { variant: "info",    label: "Reembolsado"  },
};

const linkStatusConf: Record<PaymentLinkStatus, { variant: "success" | "warning" | "danger" | "info" | "neutral"; label: string }> = {
  paid:    { variant: "success", label: "Pagado"    },
  pending: { variant: "warning", label: "Pendiente" },
  sent:    { variant: "info",    label: "Enviado"   },
  expired: { variant: "danger",  label: "Vencido"   },
};

/* ── Props ──────────────────────────────────────────────── */
interface Props {
  booking: Booking;
  customer?: Customer;
  onBack: () => void;
}

export function ReservaDetalle({ booking, customer, onBack }: Props) {
  /* Derived fields */
  const tour       = findTour(booking.tourId);
  const operator   = findOperator(booking.operatorId ?? "");
  const payments   = PAYMENTS.filter(p => p.bookingId === booking.id);
  const links      = PAYMENT_LINKS.filter(l => l.bookingId === booking.id);

  const customerName  = customer?.name    ?? booking.customerId;
  const email         = customer?.email   ?? "—";
  const phone         = customer?.phone   ?? "—";
  const country       = customer?.country ?? "—";
  const tourName      = tour?.title.es    ?? booking.tourId;
  const destination   = tour?.destinationIds.map(id => findDestination(id)?.name.es ?? id).join(", ") ?? "—";
  const tourDate      = booking.displayDate ?? booking.date;
  const operatorName  = operator?.name    ?? booking.operatorId ?? "—";

  const total      = booking.totalPrice;
  const paid       = booking.depositPaid;
  const saldo      = booking.outstandingBalance;
  const pctPagado  = total > 0 ? (paid / total) * 100 : 0;

  const st = statusConf[booking.status];

  const [nota, setNota] = useState(booking.internalNotes ?? "");
  const [notaLog] = useState([
    { date: "12 Jun 2026 09:14", author: "Alejandra Torres", text: "Reserva creada desde web pública." },
    { date: "12 Jun 2026 11:32", author: "Alejandra Torres", text: "Depósito recibido." },
  ]);
  const [emailLog] = useState([
    { date: "12 Jun 2026 09:15", type: "Confirmación de reserva",     status: "entregado" },
    { date: "12 Jun 2026 11:33", type: "Confirmación de depósito",     status: "entregado" },
    { date: "15 Jun 2026 08:00", type: "Recordatorio de saldo (auto)", status: "pendiente" },
  ]);

  return (
    <div style={{ fontFamily: "Inter, sans-serif", display: "flex", flexDirection: "column", gap: 0 }}>
      {/* ── Page header ── */}
      <div style={{ marginBottom: 20 }}>
        <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 4, border: "none", background: "transparent", cursor: "pointer", color: "#94A3B8", fontSize: 12, marginBottom: 8 }}>
          <ArrowLeft size={12} /> Reservas
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div>
            <span style={{ fontSize: 24, fontWeight: 800, color: "#0F172A", fontVariantNumeric: "tabular-nums" }}>{booking.id}</span>
            <span style={{ fontSize: 12, color: "#94A3B8", marginLeft: 10 }}>Fecha: {tourDate}</span>
          </div>
          <StatusBadge variant={st.variant} label={st.label} />
          <div style={{ display: "flex", gap: 8, marginLeft: "auto", flexWrap: "wrap" }}>
            <Btn variant="primary" size="sm"><Link size={13} /> Generar link de pago saldo</Btn>
            <Btn variant="secondary" size="sm"><Mail size={13} /> Enviar email manual</Btn>
            <Btn variant="secondary" size="sm"><CheckCircle2 size={13} /> Marcar finalizada</Btn>
            <Btn variant="secondary" size="sm"><RefreshCw size={13} /> Reembolsar</Btn>
            <Btn variant="danger" size="sm"><XCircle size={13} /> Cancelar</Btn>
          </div>
        </div>
      </div>

      {/* ── Two-column body ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, alignItems: "start" }}>

        {/* LEFT col */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Cliente */}
          <section style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB", display: "flex", alignItems: "center", gap: 6 }}>
              <User size={13} color="#94A3B8" />
              <span style={{ fontSize: 12, fontWeight: 700, color: "#0F172A", textTransform: "uppercase", letterSpacing: "0.06em" }}>Cliente</span>
            </div>
            <div style={{ padding: "14px 16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {[
                  { label: "Nombre",    value: customerName },
                  { label: "Email",     value: email        },
                  { label: "Teléfono", value: phone        },
                  { label: "País",      value: country      },
                ].map(f => (
                  <div key={f.label}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>{f.label}</div>
                    <div style={{ fontSize: 13, color: "#0F172A" }}>{f.value}</div>
                  </div>
                ))}
              </div>
              <button style={{ marginTop: 12, fontSize: 12, color: "#006CFE", border: "none", background: "transparent", cursor: "pointer", padding: 0 }}>
                Ver perfil completo →
              </button>
            </div>
          </section>

          {/* Tour */}
          <section style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB", display: "flex", alignItems: "center", gap: 6 }}>
              <Package size={13} color="#94A3B8" />
              <span style={{ fontSize: 12, fontWeight: 700, color: "#0F172A", textTransform: "uppercase", letterSpacing: "0.06em" }}>Tour reservado</span>
            </div>
            <div style={{ padding: "14px 16px" }}>
              <div style={{ display: "flex", gap: 14 }}>
                <div style={{ width: 60, height: 60, borderRadius: 6, background: tour?.heroBg ?? "linear-gradient(135deg, #BAE6FD, #7DD3FC)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: 24 }}>{tour?.emoji ?? "🏖️"}</span>
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>{tourName}</div>
                  <div style={{ fontSize: 12, color: "#475569" }}>{destination}</div>
                  <div style={{ display: "flex", gap: 12, marginTop: 6, fontSize: 12, color: "#94A3B8" }}>
                    <span>📅 {tourDate}</span>
                    <span>👥 {booking.totalPax} pax</span>
                    <span>🏢 {operatorName}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Pagos */}
          <section style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB", display: "flex", alignItems: "center", gap: 6 }}>
              <CreditCard size={13} color="#94A3B8" />
              <span style={{ fontSize: 12, fontWeight: 700, color: "#0F172A", textTransform: "uppercase", letterSpacing: "0.06em" }}>Pagos</span>
            </div>
            <div style={{ padding: "16px 16px" }}>
              {/* Payment timeline */}
              <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 20 }}>
                {/* Step 1: Depósito */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#16A34A", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Check size={14} color="#FFFFFF" />
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#16A34A", textAlign: "center" }}>Depósito</div>
                  <div style={{ fontSize: 10, color: "#94A3B8" }}>{formatDOP(paid)}</div>
                </div>
                {/* Connector */}
                <div style={{ flex: 1, height: 2, background: saldo === 0 ? "#16A34A" : "#E5E7EB", marginBottom: 32 }} />
                {/* Step 2: Saldo */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: saldo === 0 ? "#16A34A" : "#F1F5F9",
                    border: saldo > 0 ? "2px dashed #CBD5E1" : "none",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {saldo === 0 ? <Check size={14} color="#FFFFFF" /> : <AlertCircle size={14} color="#94A3B8" />}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: saldo > 0 ? "#92400E" : "#16A34A", textAlign: "center" }}>Saldo</div>
                  <div style={{ fontSize: 10, color: saldo > 0 ? "#F59E0B" : "#94A3B8" }}>{formatDOP(saldo)}</div>
                  <div style={{ fontSize: 10, color: "#94A3B8" }}>{saldo > 0 ? "Pendiente" : "Pagado"}</div>
                </div>
                {/* Connector */}
                <div style={{ flex: 1, height: 2, background: "#E5E7EB", marginBottom: 32 }} />
                {/* Step 3: Finalizado */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#F1F5F9", border: "2px dashed #CBD5E1", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <CheckCircle2 size={14} color="#CBD5E1" />
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#94A3B8", textAlign: "center" }}>Finalizado</div>
                  <div style={{ fontSize: 10, color: "#94A3B8" }}>Tras el tour</div>
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#475569", marginBottom: 4 }}>
                  <span>Pagado: {formatDOP(paid)}</span>
                  <span>Total: {formatDOP(total)}</span>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: "#F1F5F9", overflow: "hidden" }}>
                  <div style={{ height: "100%", borderRadius: 3, background: "#16A34A", width: `${pctPagado}%` }} />
                </div>
              </div>

              {/* Transactions table */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Transacciones</div>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: "#F7F8FA" }}>
                      {["Fecha", "Concepto", "Método", "Monto", "Estado"].map(h => (
                        <th key={h} style={{ padding: "6px 10px", textAlign: "left", fontSize: 10, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {payments.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ padding: "12px 10px", color: "#94A3B8", textAlign: "center" }}>Sin transacciones registradas</td>
                      </tr>
                    ) : payments.map((p, i) => {
                      const ps = paymentStatusConf[p.status];
                      return (
                        <tr key={i} style={{ borderTop: "1px solid #F1F5F9" }}>
                          <td style={{ padding: "8px 10px", color: "#475569" }}>{p.date}</td>
                          <td style={{ padding: "8px 10px", color: "#0F172A" }}>{paymentTypeLabel[p.type]}</td>
                          <td style={{ padding: "8px 10px", color: "#475569" }}>{p.paypalTxnId ? `PayPal · ${p.paypalTxnId}` : "—"}</td>
                          <td style={{ padding: "8px 10px", fontWeight: 700, color: p.type === "refund" ? "#F13540" : "#16A34A" }}>{formatDOP(p.amount)}</td>
                          <td style={{ padding: "8px 10px" }}><StatusBadge variant={ps.variant} label={ps.label} /></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Payment links */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Links de pago generados</div>
                {links.length === 0 ? (
                  <div style={{ fontSize: 12, color: "#94A3B8" }}>Sin links generados</div>
                ) : links.map((l, i) => {
                  const ls = linkStatusConf[l.status];
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 6, fontSize: 12, marginBottom: 6 }}>
                      <Link size={12} color="#92400E" />
                      <span style={{ fontWeight: 600, color: "#92400E" }}>{l.invoiceId ?? "—"}</span>
                      <span style={{ color: "#475569" }}>{formatDOP(l.amount)}</span>
                      <span style={{ color: "#94A3B8" }}>Expira {l.expiresAt}</span>
                      <StatusBadge variant={ls.variant} label={ls.label} />
                      <button style={{ marginLeft: "auto", fontSize: 11, color: "#006CFE", border: "none", background: "transparent", cursor: "pointer" }}>Copiar link</button>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Comunicaciones */}
          <section style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <MessageSquare size={13} color="#94A3B8" />
                <span style={{ fontSize: 12, fontWeight: 700, color: "#0F172A", textTransform: "uppercase", letterSpacing: "0.06em" }}>Comunicaciones</span>
              </div>
              <button style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 6, border: "1px solid #E5E7EB", background: "#FFFFFF", fontSize: 12, color: "#475569", cursor: "pointer" }}>
                <Send size={11} /> Enviar email manual
              </button>
            </div>
            <div style={{ padding: "14px 16px" }}>
              {emailLog.map((e, i) => (
                <div key={i} style={{ display: "flex", gap: 10, paddingBottom: 12, borderBottom: i < emailLog.length - 1 ? "1px solid #F1F5F9" : "none", marginBottom: i < emailLog.length - 1 ? 12 : 0 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: e.status === "entregado" ? "#F0FDF4" : "#FFFBEB",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <Mail size={12} color={e.status === "entregado" ? "#16A34A" : "#F59E0B"} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "#0F172A" }}>{e.type}</div>
                    <div style={{ fontSize: 11, color: "#94A3B8", display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                      <Clock size={10} /> {e.date}
                      <span style={{ color: e.status === "entregado" ? "#16A34A" : "#F59E0B", fontWeight: 600 }}>
                        · {e.status === "entregado" ? "✓ Entregado" : "⏱ Pendiente"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT col — sticky */}
        <div style={{ position: "sticky", top: 80, display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Resumen */}
          <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, padding: "16px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#0F172A", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 14 }}>Resumen</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { label: "Total",   val: formatDOP(total),  bold: true  },
                { label: "Pagado",  val: formatDOP(paid),   color: "#16A34A" },
                { label: "Saldo",   val: formatDOP(saldo),  color: saldo > 0 ? "#F13540" : "#475569" },
              ].map(row => (
                <div key={row.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span style={{ color: "#475569" }}>{row.label}</span>
                  <span style={{ fontWeight: row.bold ? 800 : 600, color: row.color || "#0F172A", fontVariantNumeric: "tabular-nums" }}>{row.val}</span>
                </div>
              ))}
            </div>
            <div style={{ height: 1, background: "#E5E7EB", margin: "12px 0" }} />
            {saldo > 0 ? (
              <div style={{ padding: "10px 12px", background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 6, fontSize: 12, color: "#92400E" }}>
                <div style={{ fontWeight: 600, marginBottom: 2 }}>Próxima acción</div>
                Enviar link de pago de saldo pendiente ({formatDOP(saldo)})
              </div>
            ) : (
              <div style={{ padding: "10px 12px", background: "#F0FDF4", border: "1px solid #86EFAC", borderRadius: 6, fontSize: 12, color: "#15803D" }}>
                <div style={{ fontWeight: 600, marginBottom: 2 }}>✓ Pagado completo</div>
                Nada pendiente. Marcar como finalizada tras el tour.
              </div>
            )}
            {saldo > 0 && (
              <button style={{ width: "100%", marginTop: 10, padding: "8px", borderRadius: 6, border: "none", background: "#006CFE", color: "#FFFFFF", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <Link size={13} /> Generar link de pago
              </button>
            )}
          </div>

          {/* Notas internas */}
          <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, padding: "16px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#0F172A", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Notas internas</div>
            <textarea
              value={nota}
              onChange={e => setNota(e.target.value)}
              rows={5}
              style={{ width: "100%", padding: "8px 10px", border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 12, outline: "none", resize: "vertical", fontFamily: "Inter, sans-serif", color: "#0F172A", boxSizing: "border-box" }}
            />
            <div style={{ marginTop: 8 }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Log de cambios</div>
              {notaLog.map((entry, i) => (
                <div key={i} style={{ fontSize: 11, color: "#475569", marginBottom: 5, paddingLeft: 8, borderLeft: "2px solid #E5E7EB" }}>
                  <span style={{ color: "#94A3B8" }}>{entry.date}</span> — <strong>{entry.author}</strong>
                  <div style={{ color: "#475569" }}>{entry.text}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Operador */}
          <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, padding: "16px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#0F172A", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Operador asignado</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 6, background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 16 }}>🤝</span>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>{operatorName}</div>
                <div style={{ fontSize: 11, color: "#94A3B8" }}>Contactar antes del tour</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
