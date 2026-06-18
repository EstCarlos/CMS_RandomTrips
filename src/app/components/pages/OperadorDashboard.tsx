import { ClipboardList, Package, CalendarDays, AlertCircle, Bell, Check } from "lucide-react";
import { KPICard } from "../ui/KPICard";
import { StatusBadge } from "../ui/StatusBadge";

const proximasSalidas = [
  { fecha: "18 Jun", tour: "Isla Saona Full Day",   pax: 22, capacidad: 30, estado: "confirmed" as const },
  { fecha: "20 Jun", tour: "Isla Saona Full Day",   pax: 28, capacidad: 30, estado: "confirmed" as const },
  { fecha: "21 Jun", tour: "Laguna Bavaro Snorkel", pax: 12, capacidad: 20, estado: "confirmed" as const },
  { fecha: "25 Jun", tour: "Isla Saona Full Day",   pax: 8,  capacidad: 30, estado: "confirmed" as const },
  { fecha: "27 Jun", tour: "Laguna Bavaro Snorkel", pax: 0,  capacidad: 20, estado: "confirmed" as const },
];

const alertasOperador = [
  { tipo: "nueva-reserva" as const, texto: "Nueva reserva RT-2841 recibida para Isla Saona 18 Jun (4 pax)", hora: "hace 5 min" },
  { tipo: "cupo" as const,          texto: "Isla Saona 20 Jun casi llena — solo 2 plazas disponibles",       hora: "hace 1 h"  },
  { tipo: "recordatorio" as const,  texto: "Confirmar logística con Random Trips para salida del 18 Jun",    hora: "hace 3 h"  },
];

export function OperadorDashboard() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, fontFamily: "Inter, sans-serif" }}>
      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        <KPICard label="Reservas próximas" value="18" delta={5} deltaLabel="próximas 7 días"
          icon={<CalendarDays size={18} color="#006CFE" />} iconBg="#EFF6FF" />
        <KPICard label="Reservas este mes" value="34" delta={12}
          icon={<ClipboardList size={18} color="#16A34A" />} iconBg="#F0FDF4" />
        <KPICard label="Tours activos" value="2" delta={0} deltaLabel="asignados"
          icon={<Package size={18} color="#9333EA" />} iconBg="#F5F3FF" />
      </div>

      {/* Alertas */}
      <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, padding: "16px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
          <Bell size={14} color="#006CFE" />
          <span style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>Alertas</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {alertasOperador.map((a, i) => {
            const iconMap = { "nueva-reserva": <Check size={13} color="#16A34A" />, cupo: <AlertCircle size={13} color="#F59E0B" />, recordatorio: <Bell size={13} color="#006CFE" /> };
            const bgMap   = { "nueva-reserva": "#F0FDF4", cupo: "#FFFBEB", recordatorio: "#EFF6FF" };
            return (
              <div key={i} style={{ display: "flex", gap: 10, padding: "10px 12px", borderRadius: 6, background: bgMap[a.tipo], alignItems: "flex-start" }}>
                <span style={{ flexShrink: 0, marginTop: 1 }}>{iconMap[a.tipo]}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: "#0F172A" }}>{a.texto}</div>
                  <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>{a.hora}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Próximas salidas */}
      <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid #E5E7EB" }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>Próximas salidas</span>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F7F8FA" }}>
              {["Fecha", "Tour", "Pax / Capacidad", "Ocupación", "Estado"].map(h => (
                <th key={h} style={{ padding: "8px 16px", textAlign: "left", fontSize: 10, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid #E5E7EB" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {proximasSalidas.map((s, i) => {
              const pct = (s.pax / s.capacidad) * 100;
              return (
                <tr key={i} style={{ borderBottom: i < proximasSalidas.length - 1 ? "1px solid #F1F5F9" : "none" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#F7F8FA")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={{ padding: "12px 16px", fontWeight: 700, color: "#0F172A", whiteSpace: "nowrap" }}>{s.fecha}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "#0F172A" }}>{s.tour}</td>
                  <td style={{ padding: "12px 16px", fontWeight: 600, fontSize: 13 }}>{s.pax} / {s.capacidad} pax</td>
                  <td style={{ padding: "12px 16px", width: 180 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ flex: 1, height: 6, borderRadius: 3, background: "#F1F5F9", overflow: "hidden" }}>
                        <div style={{ height: "100%", borderRadius: 3, width: `${pct}%`, background: pct >= 90 ? "#F13540" : pct >= 60 ? "#F59E0B" : "#006CFE", transition: "width 0.3s" }} />
                      </div>
                      <span style={{ fontSize: 11, color: "#94A3B8", width: 32, textAlign: "right" }}>{Math.round(pct)}%</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <StatusBadge variant="success" label="Confirmada" />
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
