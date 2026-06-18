import { useState } from "react";
import { X, ChevronRight } from "lucide-react";

interface LogEntry {
  id: string;
  timestamp: string;
  actor: string;
  accion: string;
  entidad: string;
  idEntidad: string;
  before?: Record<string, string>;
  after?: Record<string, string>;
}

const mockLogs: LogEntry[] = [
  { id: "L-001", timestamp: "16 Jun 2026 09:14:32", actor: "Alejandra Torres", accion: "CREAR",       entidad: "Reserva",     idEntidad: "RT-2841", before: undefined, after: { status: "pending", pax: "4", total: "212400" } },
  { id: "L-002", timestamp: "16 Jun 2026 09:15:01", actor: "Sistema",          accion: "EMAIL",        entidad: "Reserva",     idEntidad: "RT-2841", before: undefined, after: { tipo: "Confirmación de reserva", destinatario: "sarah@email.com" } },
  { id: "L-003", timestamp: "16 Jun 2026 09:33:18", actor: "Alejandra Torres", accion: "ACTUALIZAR",   entidad: "Tour",        idEntidad: "T-001",   before: { precio: "3200" }, after: { precio: "3500" } },
  { id: "L-004", timestamp: "15 Jun 2026 16:45:11", actor: "Carlos Reyes",     accion: "ACTUALIZAR",   entidad: "Cotización",  idEntidad: "COT-445", before: { status: "pending" }, after: { status: "sent" } },
  { id: "L-005", timestamp: "15 Jun 2026 15:10:23", actor: "Pedro Rosario",    accion: "ACTUALIZAR",   entidad: "Disponibilidad", idEntidad: "T-001-2026-06-18", before: { paxLibres: "12" }, after: { paxLibres: "8" } },
  { id: "L-006", timestamp: "14 Jun 2026 11:22:45", actor: "Alejandra Torres", accion: "ELIMINAR",     entidad: "Testimonio",  idEntidad: "T-008",   before: { cliente: "Marc F.", rating: "2" }, after: undefined },
  { id: "L-007", timestamp: "14 Jun 2026 10:05:30", actor: "María Pérez",      accion: "CREAR",        entidad: "Testimonio",  idEntidad: "T-009",   before: undefined, after: { cliente: "Sofia G.", status: "draft" } },
  { id: "L-008", timestamp: "13 Jun 2026 17:58:12", actor: "Sistema",          accion: "EMAIL",        entidad: "Cotización",  idEntidad: "COT-447", before: undefined, after: { tipo: "Cotización enviada", destinatario: "lucia@email.es" } },
  { id: "L-009", timestamp: "13 Jun 2026 09:00:00", actor: "Carlos Reyes",     accion: "ACTUALIZAR",   entidad: "Tasa cambio", idEntidad: "USD",     before: { tasa: "59.20" }, after: { tasa: "59.50" } },
  { id: "L-010", timestamp: "12 Jun 2026 14:20:18", actor: "Alejandra Torres", accion: "CREAR",        entidad: "Usuario CMS", idEntidad: "U-008",   before: undefined, after: { email: "nuevo@partner.com", rol: "operador" } },
];

const ACCION_CONF: Record<string, { color: string; bg: string }> = {
  CREAR:      { color: "#15803D", bg: "#DCFCE7" },
  ACTUALIZAR: { color: "#1D4ED8", bg: "#DBEAFE" },
  ELIMINAR:   { color: "#B91C1C", bg: "#FEE2E2" },
  EMAIL:      { color: "#7C3AED", bg: "#EDE9FE" },
};

function DiffDrawer({ log, onClose }: { log: LogEntry; onClose: () => void }) {
  const hasChange = log.before || log.after;
  const keys = [...new Set([...Object.keys(log.before || {}), ...Object.keys(log.after || {})])];

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", justifyContent: "flex-end" }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(15,23,42,.3)" }} onClick={onClose} />
      <div style={{ position: "relative", width: 480, background: "#FFFFFF", boxShadow: "-8px 0 32px rgba(0,0,0,.12)", display: "flex", flexDirection: "column", fontFamily: "Inter, sans-serif" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #E5E7EB", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>Detalle de cambio</div>
            <div style={{ fontSize: 11, color: "#94A3B8" }}>{log.id} · {log.timestamp}</div>
          </div>
          <button onClick={onClose} style={{ border: "1px solid #E5E7EB", background: "#FFFFFF", borderRadius: 6, width: 28, height: 28, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={13} color="#94A3B8" />
          </button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20, fontSize: 12 }}>
            {[
              { label: "Actor", value: log.actor },
              { label: "Acción", value: log.accion },
              { label: "Entidad", value: log.entidad },
              { label: "ID", value: log.idEntidad },
            ].map(f => (
              <div key={f.label}>
                <div style={{ fontSize: 10, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>{f.label}</div>
                <div style={{ color: "#0F172A" }}>{f.value}</div>
              </div>
            ))}
          </div>

          {hasChange && keys.length > 0 ? (
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
                Diff de cambios
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, border: "1px solid #E5E7EB", borderRadius: 8, overflow: "hidden" }}>
                <div style={{ padding: "8px 12px", background: "#FEF2F2", borderRight: "1px solid #E5E7EB", fontSize: 11, fontWeight: 600, color: "#B91C1C" }}>ANTES</div>
                <div style={{ padding: "8px 12px", background: "#F0FDF4", fontSize: 11, fontWeight: 600, color: "#16A34A" }}>DESPUÉS</div>
                {keys.map(k => (
                  <>
                    <div key={`b-${k}`} style={{ padding: "8px 12px", borderTop: "1px solid #F1F5F9", borderRight: "1px solid #E5E7EB", background: log.before?.[k] ? "#FEF2F2" : "transparent" }}>
                      <div style={{ fontSize: 10, color: "#94A3B8", marginBottom: 2 }}>{k}</div>
                      <div style={{ fontSize: 12, color: "#B91C1C", fontFamily: "monospace" }}>{log.before?.[k] ?? "—"}</div>
                    </div>
                    <div key={`a-${k}`} style={{ padding: "8px 12px", borderTop: "1px solid #F1F5F9", background: log.after?.[k] ? "#F0FDF4" : "transparent" }}>
                      <div style={{ fontSize: 10, color: "#94A3B8", marginBottom: 2 }}>{k}</div>
                      <div style={{ fontSize: 12, color: "#16A34A", fontFamily: "monospace" }}>{log.after?.[k] ?? "—"}</div>
                    </div>
                  </>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ padding: "24px", textAlign: "center", color: "#94A3B8", fontSize: 13, background: "#F7F8FA", borderRadius: 8 }}>
              Sin diff registrado para esta acción
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function LogsAuditoria() {
  const [activeLog, setActiveLog] = useState<LogEntry | null>(null);
  const [filterActor, setFilterActor]   = useState("");
  const [filterAccion, setFilterAccion] = useState("");
  const [filterEntidad, setFilterEntidad] = useState("");

  const actors   = [...new Set(mockLogs.map(l => l.actor))];
  const acciones = [...new Set(mockLogs.map(l => l.accion))];
  const entidades= [...new Set(mockLogs.map(l => l.entidad))];

  const filtered = mockLogs.filter(l =>
    (!filterActor   || l.actor   === filterActor) &&
    (!filterAccion  || l.accion  === filterAccion) &&
    (!filterEntidad || l.entidad === filterEntidad)
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, fontFamily: "Inter, sans-serif" }}>
      {activeLog && <DiffDrawer log={activeLog} onClose={() => setActiveLog(null)} />}

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {[
          { label: "Actor",   val: filterActor,   set: setFilterActor,   opts: actors    },
          { label: "Acción",  val: filterAccion,  set: setFilterAccion,  opts: acciones  },
          { label: "Entidad", val: filterEntidad, set: setFilterEntidad, opts: entidades },
        ].map(f => (
          <select key={f.label} value={f.val} onChange={e => f.set(e.target.value)}
            style={{ padding: "6px 12px", border: `1px solid ${f.val ? "#006CFE" : "#E5E7EB"}`, borderRadius: 6, fontSize: 13, background: f.val ? "#EFF6FF" : "#FFFFFF", color: f.val ? "#006CFE" : "#475569", outline: "none", cursor: "pointer" }}>
            <option value="">{f.label}</option>
            {f.opts.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        ))}
        {(filterActor || filterAccion || filterEntidad) && (
          <button onClick={() => { setFilterActor(""); setFilterAccion(""); setFilterEntidad(""); }}
            style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #E5E7EB", background: "#FFFFFF", fontSize: 12, color: "#94A3B8", cursor: "pointer" }}>
            Limpiar
          </button>
        )}
        <span style={{ marginLeft: "auto", fontSize: 12, color: "#94A3B8", alignSelf: "center" }}>{filtered.length} entradas</span>
      </div>

      {/* Table */}
      <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F7F8FA", borderBottom: "1px solid #E5E7EB" }}>
              {["Timestamp", "Actor", "Acción", "Entidad", "ID Entidad", ""].map(h => (
                <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((log, i) => {
              const ac = ACCION_CONF[log.accion] || ACCION_CONF.ACTUALIZAR;
              return (
                <tr key={log.id}
                  onClick={() => setActiveLog(log)}
                  style={{ borderBottom: i < filtered.length - 1 ? "1px solid #F1F5F9" : "none", cursor: "pointer" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#F7F8FA")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={{ padding: "11px 14px", fontSize: 12, color: "#94A3B8", whiteSpace: "nowrap", fontFamily: "monospace" }}>{log.timestamp}</td>
                  <td style={{ padding: "11px 14px", fontSize: 13, fontWeight: 500, color: "#0F172A" }}>{log.actor}</td>
                  <td style={{ padding: "11px 14px" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: ac.bg, color: ac.color }}>{log.accion}</span>
                  </td>
                  <td style={{ padding: "11px 14px", fontSize: 13, color: "#475569" }}>{log.entidad}</td>
                  <td style={{ padding: "11px 14px", fontWeight: 600, color: "#006CFE", fontSize: 12 }}>{log.idEntidad}</td>
                  <td style={{ padding: "11px 14px" }}>
                    <ChevronRight size={14} color="#CBD5E1" />
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
