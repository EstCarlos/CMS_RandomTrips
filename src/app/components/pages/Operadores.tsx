import { useState } from "react";
import { Plus, ArrowLeft, Star, Package, Calendar, TrendingUp, Users, Edit2, Trash2, X } from "lucide-react";
import { StatusBadge } from "../ui/StatusBadge";
import { FilterBar } from "../ui/FilterBar";
import { FormField, Input, SelectField, Textarea } from "../ui/FormField";
import { Btn } from "../ui/Modal";
import type { Operator } from "../../data/types";
import { OPERATORS, TOURS_DATA, BOOKINGS, formatDOP, CMS_USERS } from "../../data/realData";

/* ── Enriched operator (central type + computed display fields) ── */
interface EnrichedOperator extends Operator {
  numTours: number;
  activeBookings: number;
  monthlyRevenue: number;
  monthlyBookings: number;
  assignedTourNames: string[];
  zone: string;
  commission: string;
  // TODO: replace with real values when reviews/commission module is built
  rating: number;
  notes: string;
}

const enrichedOperators: EnrichedOperator[] = OPERATORS.map(op => {
  const opBookings = BOOKINGS.filter(b => b.operatorId === op.id);
  const opTours    = TOURS_DATA.filter(t => t.operatorId === op.id);
  return {
    ...op,
    numTours:          opTours.length,
    activeBookings:    opBookings.filter(b => b.status !== "cancelled" && b.status !== "completed").length,
    monthlyRevenue:    opBookings.reduce((s, b) => s + b.depositPaid, 0),
    monthlyBookings:   opBookings.length,
    assignedTourNames: opTours.map(t => t.title.es),
    zone:              op.type === "internal" ? "Nacional" : "Por definir",
    commission:        op.type === "internal" ? "N/A" : "Por definir",
    rating:            4.8,
    notes:             "",
  };
});

const TOURS_CATALOG = TOURS_DATA.map(t => ({ id: t.id, name: t.title.es }));

const STATUS_CONF: Record<string, { variant: "success" | "warning" | "danger" | "neutral" | "info"; label: string }> = {
  active:   { variant: "success", label: "Activo"       },
  seasonal: { variant: "info",    label: "Temporada"    },
  review:   { variant: "warning", label: "En revisión"  },
  inactive: { variant: "neutral", label: "Inactivo"     },
};

/* ── Editor ─────────────────────────────────────────────── */
type OpTab = "info" | "tours" | "usuarios" | "stats";

function OperadorEditor({ op, onBack }: { op: EnrichedOperator | null; onBack: () => void }) {
  const isNew = !op;
  const [tab, setTab] = useState<OpTab>("info");
  const [o, setO] = useState<EnrichedOperator>(op ?? {
    id: "new", name: "", type: "external", contact: {}, assignedTourIds: [], status: "active",
    numTours: 0, activeBookings: 0, monthlyRevenue: 0, monthlyBookings: 0,
    assignedTourNames: [], zone: "", commission: "Por definir", rating: 0, notes: "",
  });

  const toggleTour = (tourId: string) => {
    setO(prev => ({
      ...prev,
      assignedTourIds: prev.assignedTourIds.includes(tourId)
        ? prev.assignedTourIds.filter(x => x !== tourId)
        : [...prev.assignedTourIds, tourId],
    }));
  };

  const TABS: { id: OpTab; label: string }[] = [
    { id: "info",     label: "Información general" },
    { id: "tours",    label: "Tours asignados"     },
    { id: "usuarios", label: "Usuarios CMS"        },
    { id: "stats",    label: "Estadísticas"        },
  ];

  const opCmsUsers = CMS_USERS.filter(u => u.operatorId === op?.id);

  return (
    <div style={{ fontFamily: "Inter, sans-serif" }}>
      <div style={{ marginBottom: 20 }}>
        <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 4, border: "none", background: "transparent", cursor: "pointer", color: "#94A3B8", fontSize: 12, marginBottom: 8 }}>
          <ArrowLeft size={12} /> Operadores
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#0F172A", margin: 0, flex: 1 }}>
            {isNew ? "Nuevo operador" : o.name}
          </h1>
          {!isNew && <StatusBadge variant={STATUS_CONF[o.status].variant} label={STATUS_CONF[o.status].label} />}
          <div style={{ display: "flex", gap: 8 }}>
            <Btn variant="secondary" size="sm">Cancelar</Btn>
            <Btn variant="primary" size="sm">Guardar cambios</Btn>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", borderBottom: "1px solid #E5E7EB", marginBottom: 24, gap: 0 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "8px 16px", border: "none",
            borderBottom: `2px solid ${tab === t.id ? "#006CFE" : "transparent"}`,
            background: "transparent", fontSize: 13, fontWeight: tab === t.id ? 600 : 400,
            color: tab === t.id ? "#006CFE" : "#475569", cursor: "pointer",
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab: Info */}
      {tab === "info" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, maxWidth: 700 }}>
          <div style={{ gridColumn: "1 / -1" }}>
            <FormField label="Nombre del operador" required>
              <Input value={o.name} onChange={v => setO(p => ({ ...p, name: v }))} placeholder="Caribe Tours" />
            </FormField>
          </div>
          <FormField label="Tipo">
            <div style={{ display: "flex", gap: 8 }}>
              {(["internal", "external"] as const).map(t => (
                <button key={t} onClick={() => setO(p => ({ ...p, type: t }))} style={{
                  flex: 1, padding: "8px 12px", borderRadius: 6, cursor: "pointer",
                  border: `2px solid ${o.type === t ? "#006CFE" : "#E5E7EB"}`,
                  background: o.type === t ? "#EFF6FF" : "#FFFFFF",
                  color: o.type === t ? "#006CFE" : "#475569",
                  fontSize: 13, fontWeight: o.type === t ? 600 : 400,
                }}>
                  {t === "internal" ? "🏠 Interno" : "🤝 Externo"}
                </button>
              ))}
            </div>
          </FormField>
          <FormField label="Comisión (%)">
            <Input value={o.commission} onChange={v => setO(p => ({ ...p, commission: v }))} placeholder="15%" />
          </FormField>
          <FormField label="Persona de contacto" required>
            <Input value={o.contact?.name ?? ""} onChange={v => setO(p => ({ ...p, contact: { ...p.contact, name: v } }))} placeholder="Pedro Rosario" />
          </FormField>
          <FormField label="Email">
            <Input value={o.contact?.email ?? ""} onChange={v => setO(p => ({ ...p, contact: { ...p.contact, email: v } }))} type="email" placeholder="pedro@operador.com" />
          </FormField>
          <FormField label="Teléfono">
            <Input value={o.contact?.phone ?? ""} onChange={v => setO(p => ({ ...p, contact: { ...p.contact, phone: v } }))} placeholder="+1 809 555 0000" />
          </FormField>
          <div style={{ gridColumn: "1 / -1" }}>
            <FormField label="Zona de operación">
              <Input value={o.zone} onChange={v => setO(p => ({ ...p, zone: v }))} placeholder="La Romana / Bayahibe" />
            </FormField>
          </div>
          <FormField label="Estado">
            <SelectField value={o.status} onChange={v => setO(p => ({ ...p, status: v as EnrichedOperator["status"] }))}
              options={Object.entries(STATUS_CONF).map(([v, s]) => ({ value: v, label: s.label }))}
            />
          </FormField>
          <div style={{ gridColumn: "1 / -1" }}>
            <FormField label="Notas internas">
              <Textarea value={o.notes} onChange={v => setO(p => ({ ...p, notes: v }))} rows={3} placeholder="Notas sobre el operador..." />
            </FormField>
          </div>
        </div>
      )}

      {/* Tab: Tours asignados */}
      {tab === "tours" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 13, color: "#475569" }}>
            Selecciona los tours del catálogo que gestiona este operador.
          </div>
          {o.assignedTourIds.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {o.assignedTourIds.map(tid => {
                const name = TOURS_CATALOG.find(t => t.id === tid)?.name ?? tid;
                return (
                  <span key={tid} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 20, background: "#EFF6FF", border: "1px solid #BFDBFE", fontSize: 12, color: "#1D4ED8" }}>
                    {name}
                    <button onClick={() => toggleTour(tid)} style={{ border: "none", background: "transparent", cursor: "pointer", padding: 0, display: "flex" }}>
                      <X size={11} color="#94A3B8" />
                    </button>
                  </span>
                );
              })}
            </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
            {TOURS_CATALOG.map(t => {
              const sel = o.assignedTourIds.includes(t.id);
              return (
                <button key={t.id} onClick={() => toggleTour(t.id)} style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "12px 14px",
                  borderRadius: 8, border: `1.5px solid ${sel ? "#006CFE" : "#E5E7EB"}`,
                  background: sel ? "#EFF6FF" : "#FFFFFF", cursor: "pointer", textAlign: "left",
                }}>
                  <div style={{ width: 20, height: 20, borderRadius: 4, border: `2px solid ${sel ? "#006CFE" : "#CBD5E1"}`, background: sel ? "#006CFE" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {sel && <span style={{ color: "#FFFFFF", fontSize: 12, fontWeight: 700 }}>✓</span>}
                  </div>
                  <span style={{ fontSize: 13, color: sel ? "#006CFE" : "#0F172A", fontWeight: sel ? 600 : 400 }}>{t.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: Usuarios CMS */}
      {tab === "usuarios" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 13, color: "#475569" }}>Cuentas de acceso al CMS con rol "Operador" vinculadas a {o.name}.</div>
            <Btn variant="primary" size="sm"><Plus size={13} /> Invitar usuario</Btn>
          </div>
          <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#F7F8FA", borderBottom: "1px solid #E5E7EB" }}>
                  {["Nombre", "Email", "Último acceso", "Rol", ""].map(h => (
                    <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {opCmsUsers.length === 0 ? (
                  <tr><td colSpan={5} style={{ padding: "24px", textAlign: "center", color: "#94A3B8", fontSize: 13 }}>Sin usuarios CMS vinculados</td></tr>
                ) : opCmsUsers.map(u => (
                  <tr key={u.id}>
                    <td style={{ padding: "12px 14px", fontWeight: 500, fontSize: 13, color: "#0F172A" }}>{u.name}</td>
                    <td style={{ padding: "12px 14px", fontSize: 13, color: "#475569" }}>{u.email}</td>
                    <td style={{ padding: "12px 14px", fontSize: 12, color: "#94A3B8" }}>{u.lastLogin ?? "—"}</td>
                    <td style={{ padding: "12px 14px" }}><StatusBadge variant="neutral" label="Operador" /></td>
                    <td style={{ padding: "12px 14px" }}>
                      <button style={{ fontSize: 12, color: "#F13540", border: "none", background: "transparent", cursor: "pointer" }}>Revocar acceso</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Estadísticas */}
      {tab === "stats" && !isNew && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            {[
              { label: "Reservas este mes",  value: o.monthlyBookings,                               icon: <Calendar size={16} color="#006CFE" />, bg: "#EFF6FF" },
              { label: "Ingresos generados", value: o.monthlyRevenue > 0 ? formatDOP(o.monthlyRevenue) : "—", icon: <TrendingUp size={16} color="#16A34A" />, bg: "#F0FDF4" },
              { label: "Tours activos",      value: o.numTours,                                      icon: <Package size={16} color="#9333EA" />, bg: "#F5F3FF" },
              { label: "Rating promedio",    value: `⭐ ${o.rating}`,                               icon: <Star size={16} color="#F59E0B" />,    bg: "#FFFBEB" },
            ].map(k => (
              <div key={k.label} style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, padding: "16px 18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 4 }}>{k.label}</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: "#0F172A" }}>{k.value}</div>
                  </div>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: k.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {k.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, padding: "16px 20px" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A", marginBottom: 12 }}>Tours asignados</div>
            {o.assignedTourNames.length === 0
              ? <div style={{ fontSize: 12, color: "#94A3B8" }}>Sin tours asignados</div>
              : o.assignedTourNames.map(t => (
                  <div key={t} style={{ fontSize: 12, color: "#475569", padding: "6px 0", borderBottom: "1px solid #F1F5F9" }}>{t}</div>
                ))
            }
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ position: "fixed", bottom: 0, left: 240, right: 0, background: "#FFFFFF", borderTop: "1px solid #E5E7EB", padding: "12px 28px", display: "flex", justifyContent: "space-between", zIndex: 50, boxShadow: "0 -4px 12px rgba(0,0,0,.04)" }}>
        <Btn variant="ghost" onClick={onBack}>Descartar</Btn>
        <Btn variant="primary">Guardar cambios</Btn>
      </div>
      <div style={{ height: 64 }} />
    </div>
  );
}

/* ── Main list ──────────────────────────────────────────── */
export function Operadores() {
  const [search, setSearch]   = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [editor, setEditor]   = useState<{ open: boolean; op: EnrichedOperator | null }>({ open: false, op: null });

  if (editor.open) return <OperadorEditor op={editor.op} onBack={() => setEditor({ open: false, op: null })} />;

  const filtered = enrichedOperators.filter(o => {
    const q = search.toLowerCase();
    const mSearch = !q || o.name.toLowerCase().includes(q) || o.zone.toLowerCase().includes(q);
    const mStatus = !filters.status || o.status === filters.status;
    const mType   = !filters.type   || o.type   === filters.type;
    return mSearch && mStatus && mType;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, fontFamily: "Inter, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <FilterBar
          filters={[
            { key: "type",   label: "Tipo",   type: "select", options: [{ value: "internal", label: "Interno" }, { value: "external", label: "Externo" }] },
            { key: "status", label: "Estado", type: "select", options: Object.entries(STATUS_CONF).map(([v, s]) => ({ value: v, label: s.label })) },
          ]}
          values={filters}
          onChange={(k, v) => setFilters(p => ({ ...p, [k]: v }))}
          onClear={() => { setFilters({}); setSearch(""); }}
          onSearch={setSearch}
          searchValue={search}
          searchPlaceholder="Buscar operador o zona..."
        />
        <button onClick={() => setEditor({ open: true, op: null })}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 6, border: "none", background: "#006CFE", fontSize: 13, color: "#FFFFFF", cursor: "pointer", fontWeight: 500 }}>
          <Plus size={14} /> Agregar operador
        </button>
      </div>

      <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F7F8FA", borderBottom: "1px solid #E5E7EB" }}>
              {["Operador", "Tipo", "Zona", "Tours", "Reservas activas", "Rating", "Comisión", "Estado", ""].map(h => (
                <th key={h} style={{ padding: "10px 14px", textAlign: ["Tours", "Reservas activas"].includes(h) ? "center" : "left", fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((op, i) => (
              <tr key={op.id}
                style={{ borderBottom: i < filtered.length - 1 ? "1px solid #F1F5F9" : "none", cursor: "pointer" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#F7F8FA")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                onClick={() => setEditor({ open: true, op })}
              >
                <td style={{ padding: "12px 14px" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>{op.name}</div>
                  <div style={{ fontSize: 11, color: "#94A3B8" }}>{op.contact?.name ?? "—"} · {op.contact?.email ?? "—"}</div>
                </td>
                <td style={{ padding: "12px 14px" }}>
                  <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20, background: op.type === "internal" ? "#F0FDF4" : "#F5F3FF", color: op.type === "internal" ? "#15803D" : "#7C3AED" }}>
                    {op.type === "internal" ? "🏠 Interno" : "🤝 Externo"}
                  </span>
                </td>
                <td style={{ padding: "12px 14px", fontSize: 12, color: "#475569" }}>{op.zone}</td>
                <td style={{ padding: "12px 14px", textAlign: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, justifyContent: "center" }}>
                    <Package size={12} color="#94A3B8" /><span style={{ fontWeight: 700 }}>{op.numTours}</span>
                  </div>
                </td>
                <td style={{ padding: "12px 14px", textAlign: "center" }}>
                  {op.activeBookings > 0
                    ? <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: "50%", background: "#EFF6FF", color: "#006CFE", fontSize: 12, fontWeight: 700 }}>{op.activeBookings}</span>
                    : <span style={{ color: "#CBD5E1" }}>—</span>}
                </td>
                <td style={{ padding: "12px 14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Star size={13} fill="#FEDA40" color="#FEDA40" />
                    <span style={{ fontWeight: 700, fontSize: 13 }}>{op.rating}</span>
                  </div>
                </td>
                <td style={{ padding: "12px 14px", fontSize: 13, color: "#475569" }}>{op.commission}</td>
                <td style={{ padding: "12px 14px" }}>
                  <StatusBadge variant={STATUS_CONF[op.status].variant} label={STATUS_CONF[op.status].label} />
                </td>
                <td style={{ padding: "12px 14px" }} onClick={e => e.stopPropagation()}>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button onClick={() => setEditor({ open: true, op })}
                      style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid #E5E7EB", background: "#FFFFFF", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Edit2 size={12} color="#475569" />
                    </button>
                    <button style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid #FEE2E2", background: "#FEF2F2", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Trash2 size={12} color="#F13540" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
