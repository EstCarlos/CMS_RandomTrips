import { useState } from "react";
import { Plus, Edit2, Copy, Archive, Image, ChevronDown } from "lucide-react";
import { FilterBar } from "../ui/FilterBar";
import { StatusBadge } from "../ui/StatusBadge";
import { TOURS_DATA, findDestination, getTourPriceDisplay } from "../../data/realData";

type TourRow = typeof TOURS_DATA[0];

const statusConfig: Record<string, { variant: "success" | "neutral" | "warning" | "info"; label: string }> = {
  published: { variant: "success", label: "Publicado" },
  draft:     { variant: "neutral", label: "Borrador"  },
  archived:  { variant: "warning", label: "Archivado" },
};

const tipoConfig: Record<string, { label: string; color: string; bg: string }> = {
  singleDay:      { label: "🎯 Fijo",      color: "#1D4ED8", bg: "#EFF6FF" },
  multiDay:       { label: "🗓️ Multi-día", color: "#7C3AED", bg: "#F5F3FF" },
  privateRequest: { label: "📩 Privado",   color: "#92400E", bg: "#FFFBEB" },
};

export function Tours({ onEditTour }: { onEditTour?: (id: string) => void }) {
  const [search, setSearch]     = useState("");
  const [filters, setFilters]   = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkOpen, setBulkOpen] = useState(false);

  const filtered = TOURS_DATA.filter(t => {
    const q = search.toLowerCase();
    const destNames = t.destinationIds.map(id => findDestination(id)?.name.es ?? id).join(" ");
    const mSearch = !q || t.title.es.toLowerCase().includes(q) || t.id.toLowerCase().includes(q) || destNames.toLowerCase().includes(q);
    const mTipo   = !filters.type   || t.type   === filters.type;
    const mStatus = !filters.status || t.status === filters.status;
    return mSearch && mTipo && mStatus;
  });

  const allChecked  = filtered.length > 0 && selected.size === filtered.length;
  const someChecked = selected.size > 0;
  const toggleAll   = () => allChecked ? setSelected(new Set()) : setSelected(new Set(filtered.map(t => t.id)));
  const toggleRow   = (id: string) => { const n = new Set(selected); n.has(id) ? n.delete(id) : n.add(id); setSelected(n); };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, fontFamily: "Inter, sans-serif" }}>

      {/* Toolbar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <FilterBar
          filters={[
            { key: "type", label: "Tipo", type: "select", options: [
              { value: "singleDay", label: "🎯 Fijo" }, { value: "multiDay", label: "🗓️ Multi-día" }, { value: "privateRequest", label: "📩 Privado" },
            ]},
            { key: "status", label: "Estado", type: "select", options:
              Object.entries(statusConfig).map(([v, s]) => ({ value: v, label: s.label }))
            },
          ]}
          values={filters}
          onChange={(k, v) => setFilters(prev => ({ ...prev, [k]: v }))}
          onClear={() => { setFilters({}); setSearch(""); }}
          onSearch={setSearch}
          searchValue={search}
          searchPlaceholder="Buscar tours..."
        />
        <button onClick={() => onEditTour?.("new")}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 6, border: "none", background: "#006CFE", fontSize: 13, color: "#FFFFFF", cursor: "pointer", fontWeight: 500 }}>
          <Plus size={14} /> Crear tour
        </button>
      </div>

      {/* Bulk actions */}
      {someChecked && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 8, fontSize: 13 }}>
          <span style={{ fontWeight: 600, color: "#1D4ED8" }}>{selected.size} seleccionados</span>
          <button style={{ padding: "4px 12px", borderRadius: 6, border: "1px solid #BFDBFE", background: "#FFFFFF", fontSize: 12, cursor: "pointer", color: "#16A34A" }}>✓ Publicar</button>
          <button style={{ padding: "4px 12px", borderRadius: 6, border: "1px solid #BFDBFE", background: "#FFFFFF", fontSize: 12, cursor: "pointer", color: "#92400E" }}>⏸ Archivar</button>
          <button onClick={() => setSelected(new Set())} style={{ marginLeft: "auto", border: "none", background: "transparent", fontSize: 12, color: "#94A3B8", cursor: "pointer" }}>Cancelar</button>
        </div>
      )}

      {/* Table */}
      <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
            <thead>
              <tr style={{ background: "#F7F8FA", borderBottom: "1px solid #E5E7EB" }}>
                <th style={{ padding: "10px 16px", width: 40, textAlign: "center" }}>
                  <input type="checkbox" checked={allChecked} onChange={toggleAll} style={{ cursor: "pointer", accentColor: "#006CFE" }} />
                </th>
                <th style={{ padding: "10px 12px", width: 56 }} />
                {["Tour", "Tipo", "Precio base", "Destinos", "Capacidad", "Reservas activas", "Estado", "Última actualización", ""].map(h => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={10} style={{ padding: "64px", textAlign: "center" }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>🎒</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#0F172A", marginBottom: 6 }}>Sin tours</div>
                  <div style={{ fontSize: 13, color: "#94A3B8" }}>No hay tours que coincidan con los filtros.</div>
                </td></tr>
              ) : filtered.map((t, i) => {
                const isSel = selected.has(t.id);
                const tipo = tipoConfig[t.type];
                const st   = statusConfig[t.status];
                return (
                  <tr key={t.id}
                    style={{ borderBottom: i < filtered.length - 1 ? "1px solid #F1F5F9" : "none", background: isSel ? "#F0F7FF" : "#FFFFFF", transition: "background 0.08s", cursor: "pointer" }}
                    onClick={() => onEditTour?.(t.id)}
                    onMouseEnter={e => { if (!isSel) (e.currentTarget as HTMLElement).style.background = "#F7F8FA"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = isSel ? "#F0F7FF" : "#FFFFFF"; }}
                  >
                    <td style={{ padding: "12px 16px", textAlign: "center" }} onClick={e => e.stopPropagation()}>
                      <input type="checkbox" checked={isSel} onChange={() => toggleRow(t.id)} style={{ cursor: "pointer", accentColor: "#006CFE" }} />
                    </td>
                    {/* Thumbnail */}
                    <td style={{ padding: "10px 12px" }} onClick={e => e.stopPropagation()}>
                      <div style={{ width: 40, height: 40, borderRadius: 6, background: t.heroBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, border: "1px solid #E5E7EB" }}>
                        {t.emoji}
                      </div>
                    </td>
                    {/* Nombre */}
                    <td style={{ padding: "12px 14px", maxWidth: 240 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.title.es}</div>
                      <div style={{ fontSize: 11, color: "#94A3B8" }}>{t.id}</div>
                    </td>
                    {/* Tipo */}
                    <td style={{ padding: "12px 14px" }}>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 20, background: tipo.bg, color: tipo.color, whiteSpace: "nowrap" }}>{tipo.label}</span>
                    </td>
                    {/* Precio */}
                    <td style={{ padding: "12px 14px", fontWeight: 700, color: "#006CFE", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
                      {getTourPriceDisplay(t)}
                    </td>
                    {/* Destinos */}
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                        {t.destinationIds.map(id => {
                          const name = findDestination(id)?.name.es ?? id;
                          return <span key={id} style={{ fontSize: 10, padding: "1px 6px", borderRadius: 20, background: "#F1F5F9", color: "#475569" }}>{name}</span>;
                        })}
                      </div>
                    </td>
                    {/* Capacidad */}
                    <td style={{ padding: "12px 14px", fontSize: 13, color: "#475569", textAlign: "center" }}>
                      {t.maxCapacity} pax
                    </td>
                    {/* Reservas activas */}
                    <td style={{ padding: "12px 14px", textAlign: "center" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: "50%", background: "#EFF6FF", color: "#006CFE", fontSize: 12, fontWeight: 700 }}>
                        {t.activeBookings}
                      </span>
                    </td>
                    {/* Estado */}
                    <td style={{ padding: "12px 14px" }}>
                      <StatusBadge variant={st.variant} label={st.label} />
                    </td>
                    {/* Última actualización */}
                    <td style={{ padding: "12px 14px", fontSize: 12, color: "#94A3B8", whiteSpace: "nowrap" }}>{t.lastUpdated}</td>
                    {/* Actions */}
                    <td style={{ padding: "12px 16px" }} onClick={e => e.stopPropagation()}>
                      <div style={{ display: "flex", gap: 4 }}>
                        <button onClick={() => onEditTour?.(t.id)}
                          style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid #E5E7EB", background: "#FFFFFF", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Edit2 size={12} color="#475569" />
                        </button>
                        <button style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid #E5E7EB", background: "#FFFFFF", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Copy size={12} color="#475569" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* Footer */}
        <div style={{ padding: "12px 20px", borderTop: "1px solid #E5E7EB", display: "flex", justifyContent: "space-between", fontSize: 12, color: "#475569" }}>
          <span>{filtered.length} de {TOURS_DATA.length} tours</span>
        </div>
      </div>
    </div>
  );
}
