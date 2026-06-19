import { ClipboardList, DollarSign, AlertCircle, CalendarDays, AlertTriangle, CheckCircle2, Clock, ChevronRight, XCircle } from "lucide-react";
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { KPICard } from "../ui/KPICard";
import { StatusBadge } from "../ui/StatusBadge";
import {
  TOURS_DATA, AVAILABILITY, BOOKINGS, CUSTOMERS, PAYMENTS,
  PAYMENT_LINKS, TOTAL_COBRADO, TOTAL_SALDO, BOOKINGS_ACTIVAS,
  SALDOS_VENCIDOS, SALDOS_POR_VENCER, formatDOP,
} from "../../data/realData";

/* ── Derived lookups ────────────────────────────────────── */
const custMap  = Object.fromEntries(CUSTOMERS.map(c => [c.id, c]));
const tourMap  = Object.fromEntries(TOURS_DATA.map(t => [t.id, t]));

/* ── Trend data (últimos 6 meses, culminando en los datos reales de junio) ── */
const trendData = [
  { mes: "Ene", reservas: 8,  ingresos: 1520000 },
  { mes: "Feb", reservas: 11, ingresos: 2090000 },
  { mes: "Mar", reservas: 14, ingresos: 2660000 },
  { mes: "Abr", reservas: 40, ingresos: 140000  }, // Playa Frontón — edición completa (40/40 pax · RD$3,500)
  { mes: "May", reservas: 16, ingresos: 3040000 },
  { mes: "Jun", reservas: BOOKINGS_ACTIVAS, ingresos: TOTAL_COBRADO },
];

/* ── Alerts derived from real payment data ──────────────── */
const PICO_AV  = AVAILABILITY[0];
const PLAZA_AV = AVAILABILITY[1];

type AlertItem = { type: "danger" | "warning" | "info"; icon: React.ReactNode; title: string; text: string };

const alerts: AlertItem[] = [];

// Saldo vencido
SALDOS_VENCIDOS.forEach(link => {
  const bk   = BOOKINGS.find(b => b.id === link.booking_id)!;
  const cust = custMap[bk.customer_id];
  const tour = tourMap[bk.tour_id];
  alerts.push({
    type: "danger",
    icon: <XCircle size={14} />,
    title: `Saldo vencido — ${bk.id}`,
    text:  `${cust.nombre} · ${tour.titulo_es} · ${formatDOP(link.monto)} · Link ${link.invoice_id} venció el ${link.expira}`,
  });
});

// Saldos pendientes con recordatorio enviado
SALDOS_POR_VENCER.forEach(link => {
  const bk   = BOOKINGS.find(b => b.id === link.booking_id)!;
  const cust = custMap[bk.customer_id];
  const tour = tourMap[bk.tour_id];
  alerts.push({
    type: "warning",
    icon: <Clock size={14} />,
    title: `Saldo pendiente — ${bk.id}`,
    text:  `${cust.nombre} · ${tour.titulo_es} · ${formatDOP(link.monto)} · Vence ${link.expira}${link.recordatorios.length ? " · Último rec. " + link.recordatorios.at(-1) : ""}`,
  });
});

// Cupos info
alerts.push({
  type: "info",
  icon: <CheckCircle2 size={14} />,
  title: "Cupos disponibles",
  text: `${PLAZA_AV.tour_nombre}: ${PLAZA_AV.cupos_libres} libres el ${PLAZA_AV.fecha_display} · ${PICO_AV.tour_nombre}: ${PICO_AV.cupos_libres} libres el ${PICO_AV.fecha_display}`,
});

const alertStyles = {
  danger:  { bg: "#FEF2F2", border: "#FCA5A5", color: "#B91C1C" },
  warning: { bg: "#FFFBEB", border: "#FDE68A", color: "#92400E" },
  info:    { bg: "#F0FDF4", border: "#86EFAC", color: "#15803D" },
};

/* ── Recent reservations (last 5 bookings) ──────────────── */
const recentReservations = BOOKINGS.slice().reverse().slice(0, 5).map(bk => {
  const cust = custMap[bk.customer_id];
  const tour = tourMap[bk.tour_id];
  return { bk, cust, tour };
});

const statusConf: Record<string, { variant: "success" | "warning" | "danger" | "info"; label: string }> = {
  pagado_completo: { variant: "success", label: "Pagado"       },
  deposito_pagado: { variant: "info",    label: "Depósito"     },
  saldo_vencido:   { variant: "danger",  label: "Saldo vencido"},
};

/* ── Weekly upcoming ────────────────────────────────────── */
const weekDays = ["Lun 15", "Mar 16", "Mié 17", "Jue 18", "Vie 19", "Sáb 20", "Dom 21"];
const weekTours: Record<string, string[]> = {
  "Dom 21": [PLAZA_AV.tour_nombre.split(" ").slice(0, 2).join(" ")],
};

/* ── Chart tooltip ──────────────────────────────────────── */
function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 6, padding: "8px 12px", fontSize: 12, fontFamily: "Inter" }}>
      <div style={{ fontWeight: 600, color: "#0F172A", marginBottom: 4 }}>{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ color: "#475569" }}>
          {p.name === "reservas" ? `Reservas: ${p.value}` : `Cobrado: ${formatDOP(p.value)}`}
        </div>
      ))}
    </div>
  );
}

/* ── Component ──────────────────────────────────────────── */
export function Dashboard({ onNavigate }: { onNavigate?: (page: string) => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, fontFamily: "Inter, sans-serif" }}>

      {/* Row 1: KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        <KPICard
          label="Reservas activas"
          value={String(BOOKINGS_ACTIVAS)}
          delta={0}
          deltaLabel="7 reservas registradas"
          icon={<ClipboardList size={18} color="#006CFE" />}
          iconBg="#EFF6FF"
        />
        <KPICard
          label="Ingresos cobrados (DOP)"
          value={TOTAL_COBRADO.toLocaleString("es-DO")}
          prefix="RD$ "
          delta={0}
          deltaLabel="suma depósitos + saldos"
          icon={<DollarSign size={18} color="#16A34A" />}
          iconBg="#F0FDF4"
        />
        <KPICard
          label="Saldo por cobrar (DOP)"
          value={TOTAL_SALDO.toLocaleString("es-DO")}
          prefix="RD$ "
          delta={0}
          deltaLabel={`${SALDOS_VENCIDOS.length} vencido · ${SALDOS_POR_VENCER.length} pendiente`}
          icon={<AlertTriangle size={18} color="#F59E0B" />}
          iconBg="#FFFBEB"
        />
        <KPICard
          label="Próximos tours"
          value="2"
          delta={0}
          deltaLabel="fechas abiertas"
          icon={<CalendarDays size={18} color="#9333EA" />}
          iconBg="#F5F3FF"
        />
      </div>

      {/* Row 2: Chart + Alerts */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
        {/* Trend chart */}
        <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, padding: "20px 24px", boxShadow: "0 1px 3px rgba(0,0,0,.05)" }}>
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "#0F172A", margin: "0 0 2px" }}>Reservas e ingresos — últimos 6 meses</h3>
            <p style={{ fontSize: 12, color: "#94A3B8", margin: 0 }}>Barras: reservas (eje izq.) · Línea: ingresos DOP cobrados (eje der.)</p>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <ComposedChart data={trendData} margin={{ top: 4, right: 16, left: -10, bottom: 0 }}>
              <CartesianGrid   key="grid"         strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis           key="xaxis"        dataKey="mes" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis           key="yaxis-left"   yAxisId="left"  tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} width={28} />
              <YAxis           key="yaxis-right"  yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} width={64}
                               tickFormatter={v => v === 0 ? "0" : `${(v / 1000).toFixed(0)}k`} />
              <Tooltip         key="tooltip"      content={<ChartTooltip />} />
              <Bar             key="bar-reservas" yAxisId="left"  dataKey="reservas" fill="#EFF6FF" radius={[3,3,0,0]} maxBarSize={32} />
              <Line            key="line-ingresos" yAxisId="right" type="monotone" dataKey="ingresos" stroke="#006CFE" strokeWidth={2.5} dot={{ r: 3, fill: "#006CFE" }} activeDot={{ r: 5 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Alerts */}
        <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,.05)", display: "flex", flexDirection: "column", gap: 8, overflowY: "auto" }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: "#0F172A", margin: "0 0 4px" }}>Alertas</h3>
          {alerts.map((a, i) => {
            const s = alertStyles[a.type];
            return (
              <div key={`dashboard-alert-${i}`} style={{ padding: "10px 12px", background: s.bg, border: `1px solid ${s.border}`, borderRadius: 6, display: "flex", gap: 8 }}>
                <span style={{ color: s.color, flexShrink: 0, marginTop: 1 }}>{a.icon}</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: s.color, marginBottom: 2 }}>{a.title}</div>
                  <div style={{ fontSize: 11, color: "#475569", lineHeight: 1.4 }}>{a.text}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Row 3: Últimas reservas */}
      <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,.05)", overflow: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", borderBottom: "1px solid #E5E7EB" }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: "#0F172A", margin: 0 }}>Últimas reservas</h3>
          <button onClick={() => onNavigate?.("reservas")} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#006CFE", border: "none", background: "transparent", cursor: "pointer", fontWeight: 500 }}>
            Ver todas <ChevronRight size={12} />
          </button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F7F8FA" }}>
              {["ID", "Cliente", "Tour", "Fecha", "Pax", "Total", "Pagado", "Saldo", "Estado"].map(h => (
                <th key={h} style={{ padding: "8px 14px", textAlign: h === "Pax" ? "center" : "left", fontSize: 10, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid #E5E7EB", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentReservations.map(({ bk, cust, tour }, i) => {
              const st = statusConf[bk.estado];
              return (
                <tr key={bk.id} style={{ borderBottom: i < recentReservations.length - 1 ? "1px solid #F1F5F9" : "none" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#F7F8FA")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={{ padding: "11px 14px", fontWeight: 700, color: "#006CFE", fontSize: 12, whiteSpace: "nowrap" }}>{bk.id}</td>
                  <td style={{ padding: "11px 14px" }}>
                    <div style={{ fontSize: 13, color: "#0F172A", fontWeight: 500, whiteSpace: "nowrap" }}>{cust.nombre}</div>
                    <div style={{ fontSize: 10, color: "#94A3B8" }}>{cust.pais}</div>
                  </td>
                  <td style={{ padding: "11px 14px", fontSize: 12, color: "#475569", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{tour.titulo_es}</td>
                  <td style={{ padding: "11px 14px", fontSize: 12, color: "#475569", whiteSpace: "nowrap" }}>{bk.fecha_display}</td>
                  <td style={{ padding: "11px 14px", fontSize: 13, textAlign: "center" }}>{bk.pax_total}</td>
                  <td style={{ padding: "11px 14px", fontSize: 12, fontWeight: 700, color: "#0F172A", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{formatDOP(bk.precio_total)}</td>
                  <td style={{ padding: "11px 14px", fontSize: 12, fontWeight: 600, color: "#16A34A", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{formatDOP(bk.deposito_pagado)}</td>
                  <td style={{ padding: "11px 14px", fontSize: 12, fontWeight: 600, color: bk.saldo_pendiente > 0 ? "#F13540" : "#94A3B8", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
                    {bk.saldo_pendiente > 0 ? formatDOP(bk.saldo_pendiente) : "—"}
                  </td>
                  <td style={{ padding: "11px 14px" }}>
                    <StatusBadge variant={st.variant} label={st.label} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Row 4: Weekly calendar + Tour occupancy */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Weekly calendar */}
        <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, padding: "20px 24px", boxShadow: "0 1px 3px rgba(0,0,0,.05)" }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: "#0F172A", margin: "0 0 16px" }}>Próximos tours — semana del 15 al 21 Jun</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
            {weekDays.map(date => {
              const tours = weekTours[date] ?? [];
              return (
                <div key={`week-${date}`} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <div style={{ fontSize: 10, fontWeight: 600, textAlign: "center", color: "#94A3B8", padding: "3px 0", borderBottom: "2px solid transparent" }}>
                    {date}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 2, minHeight: 72 }}>
                    {tours.length === 0 ? (
                      <div style={{ fontSize: 10, color: "#E5E7EB", textAlign: "center", paddingTop: 8 }}>—</div>
                    ) : tours.map((t, ti) => (
                      <div key={`${date}-t${ti}`} style={{ padding: "3px 5px", borderRadius: 4, background: "#F0FDF4", borderLeft: "2px solid #16A34A", fontSize: 9, color: "#0F172A", lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {t}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 12, padding: "10px 12px", background: "#F0FDF4", borderRadius: 6, fontSize: 12, color: "#15803D" }}>
            <strong>21 Jun 2026</strong> — {PLAZA_AV.tour_nombre} · {PLAZA_AV.cupos_reservados} inscriptos · {PLAZA_AV.cupos_libres} plazas libres
          </div>
          <div style={{ marginTop: 6, padding: "10px 12px", background: "#EFF6FF", borderRadius: 6, fontSize: 12, color: "#1D4ED8" }}>
            <strong>19 Jul 2026</strong> — {PICO_AV.tour_nombre} · {PICO_AV.cupos_reservados} inscriptos · {PICO_AV.cupos_libres} plazas libres
          </div>
        </div>

        {/* Ocupación + saldos */}
        <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, padding: "20px 24px", boxShadow: "0 1px 3px rgba(0,0,0,.05)" }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: "#0F172A", margin: "0 0 4px" }}>Estado de saldos por tour</h3>
          <p style={{ fontSize: 12, color: "#94A3B8", margin: "0 0 20px" }}>Cobrado vs. total reservado</p>

          {TOURS_DATA.map(t => {
            const bks    = BOOKINGS.filter(b => b.tour_id === t.id);
            const cobrado = bks.reduce((s, b) => s + b.deposito_pagado, 0);
            const total   = bks.reduce((s, b) => s + b.precio_total, 0);
            const saldo   = bks.reduce((s, b) => s + b.saldo_pendiente, 0);
            const vencidos= PAYMENT_LINKS.filter(l => l.estado === "vencido" && bks.some(b => b.id === l.booking_id));
            const pct = total > 0 ? (cobrado / total) * 100 : 0;

            return (
              <div key={t.id} style={{ marginBottom: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}>
                  <div>
                    <div style={{ fontWeight: 700, color: "#0F172A" }}>{t.titulo_es}</div>
                    <div style={{ color: "#94A3B8", fontSize: 11 }}>
                      {AVAILABILITY.find(a => a.tour_id === t.id)?.fecha_display} · {bks.length} reservas · {t.pricing}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 700, color: "#16A34A" }}>{formatDOP(cobrado)}</div>
                    <div style={{ fontSize: 11, color: saldo > 0 ? "#F13540" : "#94A3B8" }}>
                      {saldo > 0 ? `Pendiente: ${formatDOP(saldo)}` : "Sin saldo pendiente"}
                    </div>
                  </div>
                </div>
                <div style={{ height: 8, borderRadius: 4, background: "#F1F5F9", overflow: "hidden" }}>
                  <div style={{ height: "100%", borderRadius: 4, width: `${pct}%`, background: "#006CFE", transition: "width 0.4s" }} />
                </div>
                {vencidos.length > 0 && (
                  <div style={{ marginTop: 4, fontSize: 11, color: "#F13540", display: "flex", alignItems: "center", gap: 4 }}>
                    ⚠️ {vencidos.length} link{vencidos.length > 1 ? "s" : ""} de pago vencido{vencidos.length > 1 ? "s" : ""}
                  </div>
                )}
              </div>
            );
          })}

          {/* Testimonios publicados */}
          <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: 14, marginTop: 4 }}>
            <div style={{ fontSize: 12, color: "#475569" }}>
              <span style={{ fontWeight: 700, color: "#16A34A" }}>6</span> testimonios aprobados publicados ✓
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
