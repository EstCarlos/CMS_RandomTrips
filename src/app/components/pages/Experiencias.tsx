import { useState } from "react";
import { Plus, ArrowLeft, Edit2, Globe, Save, Trash2, Image, Upload, Clock } from "lucide-react";
import { StatusBadge } from "../ui/StatusBadge";
import { FilterBar } from "../ui/FilterBar";
import { FormField, Input, SelectField, BilingualField } from "../ui/FormField";
import { Btn } from "../ui/Modal";
import { EXPERIENCES, DESTINATIONS, findDestination } from "../../data/realData";

type Exp = Omit<typeof EXPERIENCES[0], "status"> & { status: "published" | "draft" | "archived" };

const tipoEmoji: Record<string, string> = {
  "Montaña": "⛰️", "Aventura": "🧗", "Acuática": "🤿", "Cultural": "🏛️",
  "Ecoturismo": "🌿", "Playa": "🏖️", "Naturaleza": "🌎",
};

const statusConf: Record<string, { variant: "success" | "neutral" | "warning"; label: string }> = {
  published: { variant: "success", label: "Publicado" },
  draft:     { variant: "neutral", label: "Borrador"  },
  archived:  { variant: "warning", label: "Archivado" },
};

/* ── Editor ───────────────────────────────────────────── */
function ExperienciaEditor({ exp, onBack }: { exp: Exp | null; onBack: () => void }) {
  const isNew = !exp;
  const [e, setE] = useState<Exp>(exp ?? {
    id: "new", destinationId: "", name: { es: "", en: "" },
    description: { es: "", en: "" }, type: "", duration: "", basePrice: 0, tourCount: 0, status: "draft" as const,
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", fontFamily: "Inter, sans-serif" }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#94A3B8", marginBottom: 8 }}>
          <button onClick={onBack} style={{ border: "none", background: "transparent", cursor: "pointer", color: "#94A3B8", display: "flex", alignItems: "center", gap: 4, fontSize: 12 }}>
            <ArrowLeft size={12} /> Experiencias
          </button>
          <span>/</span><span style={{ color: "#0F172A" }}>{isNew ? "Nueva experiencia" : e.name.es}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#0F172A", margin: 0, flex: 1 }}>{isNew ? "Nueva experiencia" : e.name.es}</h1>
          <StatusBadge variant={statusConf[e.status].variant} label={statusConf[e.status].label} />
          <div style={{ display: "flex", gap: 8 }}>
            <Btn variant="secondary" size="sm"><Save size={13} /> Guardar borrador</Btn>
            <Btn variant="primary" size="sm"><Globe size={13} /> Publicar</Btn>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 700 }}>
        <FormField label="Nombre de la experiencia" required>
          <BilingualField value={e.name} onChange={v => setE(p => ({...p, name: v}))} placeholder="Nombre de la experiencia..." />
        </FormField>
        <FormField label="Descripción">
          <BilingualField value={e.description} onChange={v => setE(p => ({...p, description: v}))} multiline rows={4} placeholder="Descripción detallada..." />
        </FormField>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <FormField label="Destino padre" required>
            <SelectField value={e.destinationId} onChange={v => setE(p => ({...p, destinationId: v}))}
              options={DESTINATIONS.map(d => ({ value: d.id, label: d.name.es }))} placeholder="Seleccionar destino..." />
          </FormField>
          <FormField label="Tipo" required>
            <SelectField value={e.type} onChange={v => setE(p => ({...p, type: v}))}
              options={Object.entries(tipoEmoji).map(([k, icon]) => ({ value: k, label: `${icon} ${k}` }))} placeholder="Seleccionar tipo..." />
          </FormField>
        </div>
        <FormField label="Duración estimada" helper="Ej: 4–5 horas, Full day">
          <div style={{ display: "flex", alignItems: "center", gap: 8, maxWidth: 200 }}>
            <Clock size={14} color="#94A3B8" style={{ flexShrink: 0 }} />
            <Input value={e.duration} onChange={v => setE(p => ({...p, duration: v}))} placeholder="4–5 horas" />
          </div>
        </FormField>

        {e.tourCount > 0 && (
          <div style={{ padding: "12px 16px", background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 8, fontSize: 13, color: "#006CFE" }}>
            Esta experiencia está incluida en <strong>{e.tourCount} tour{e.tourCount > 1 ? "s" : ""}</strong> del catálogo.
          </div>
        )}

        <FormField label="Estado">
          <SelectField value={e.status} onChange={v => setE(p => ({...p, status: v as Exp["status"]}))}
            options={[{ value: "published", label: "Publicado" }, { value: "draft", label: "Borrador" }, { value: "archived", label: "Archivado" }]} />
        </FormField>
      </div>

      <div style={{ position: "fixed", bottom: 0, left: 240, right: 0, background: "#FFFFFF", borderTop: "1px solid #E5E7EB", padding: "12px 28px", display: "flex", justifyContent: "space-between", zIndex: 50, boxShadow: "0 -4px 12px rgba(0,0,0,.04)" }}>
        <Btn variant="ghost" onClick={onBack}>Descartar</Btn>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn variant="secondary"><Save size={13} /> Guardar borrador</Btn>
          <Btn variant="primary"><Globe size={13} /> Publicar</Btn>
        </div>
      </div>
      <div style={{ height: 64 }} />
    </div>
  );
}

/* ── List ─────────────────────────────────────────────── */
export function Experiencias() {
  const [mode, setMode]       = useState<"list" | "editor">("list");
  const [editing, setEditing] = useState<Exp | null>(null);
  const [search, setSearch]   = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});

  if (mode === "editor") return <ExperienciaEditor exp={editing} onBack={() => setMode("list")} />;

  const filtered = EXPERIENCES.filter(e => {
    const q = search.toLowerCase();
    return (!q || e.name.es.toLowerCase().includes(q) || (findDestination(e.destinationId)?.name.es.toLowerCase() ?? "").includes(q))
      && (!filters.destino || e.destinationId === filters.destino)
      && (!filters.type    || e.type          === filters.type)
      && (!filters.status  || e.status         === filters.status);
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, fontFamily: "Inter, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <FilterBar
          filters={[
            { key: "destino", label: "Destino", type: "select", options: DESTINATIONS.map(d => ({ value: d.id, label: d.name.es })) },
            { key: "type",    label: "Tipo",    type: "select", options: Object.keys(tipoEmoji).map(t => ({ value: t, label: t })) },
            { key: "status",  label: "Estado",  type: "select", options: Object.entries(statusConf).map(([v, s]) => ({ value: v, label: s.label })) },
          ]}
          values={filters}
          onChange={(k, v) => setFilters(p => ({ ...p, [k]: v }))}
          onClear={() => { setFilters({}); setSearch(""); }}
          onSearch={setSearch}
          searchValue={search}
          searchPlaceholder="Buscar experiencia o destino..."
        />
        <button onClick={() => { setEditing(null); setMode("editor"); }}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 6, border: "none", background: "#006CFE", fontSize: 13, color: "#FFFFFF", cursor: "pointer", fontWeight: 500 }}>
          <Plus size={14} /> Crear experiencia
        </button>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✨</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#0F172A", marginBottom: 6 }}>Sin experiencias</div>
          <div style={{ fontSize: 13, color: "#94A3B8", marginBottom: 16 }}>Crea las experiencias que formarán parte de los tours.</div>
          <button onClick={() => { setEditing(null); setMode("editor"); }} style={{ padding: "8px 20px", borderRadius: 6, border: "none", background: "#006CFE", color: "#FFFFFF", fontSize: 13, cursor: "pointer" }}>Crear experiencia</button>
        </div>
      ) : (
        <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#F7F8FA", borderBottom: "1px solid #E5E7EB" }}>
                {["Experiencia", "Destino", "Tipo", "Duración", "Tours", "Estado", ""].map(h => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: h === "Tours" ? "center" : "left", fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((exp, i) => (
                <tr key={exp.id}
                  style={{ borderBottom: i < filtered.length - 1 ? "1px solid #F1F5F9" : "none", cursor: "pointer" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#F7F8FA")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  onClick={() => { setEditing(exp); setMode("editor"); }}
                >
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 6, background: "#F0FDF4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
                        {tipoEmoji[exp.type] || "✨"}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>{exp.name.es}</div>
                        <div style={{ fontSize: 11, color: "#94A3B8" }}>{exp.name.en}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "#475569" }}>{findDestination(exp.destinationId)?.name.es ?? ""}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ fontSize: 12, padding: "2px 8px", borderRadius: 20, background: "#F1F5F9", color: "#475569" }}>{exp.type}</span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "#475569" }}>
                      <Clock size={11} color="#94A3B8" /> {exp.duration}
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "center", fontWeight: 700, fontSize: 13, color: exp.tourCount > 0 ? "#0F172A" : "#CBD5E1" }}>{exp.tourCount}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <StatusBadge variant={statusConf[exp.status].variant} label={statusConf[exp.status].label} />
                  </td>
                  <td style={{ padding: "12px 16px" }} onClick={e => e.stopPropagation()}>
                    <button onClick={() => { setEditing(exp); setMode("editor"); }}
                      style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid #E5E7EB", background: "#FFFFFF", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Edit2 size={12} color="#475569" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
