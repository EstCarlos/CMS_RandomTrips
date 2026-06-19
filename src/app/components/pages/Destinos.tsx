import { useState } from "react";
import { Plus, ArrowLeft, Edit2, Globe, Save, Trash2, MapPin, Image, Upload } from "lucide-react";
import { StatusBadge } from "../ui/StatusBadge";
import { FilterBar } from "../ui/FilterBar";
import { FormField, Input, Textarea, SelectField, BilingualField } from "../ui/FormField";
import { Btn } from "../ui/Modal";
import { DESTINATIONS } from "../../data/realData";

type Destino = Omit<typeof DESTINATIONS[0], "status"> & { status: "published" | "draft" | "archived" };

const statusConf: Record<string, { variant: "success" | "neutral" | "warning"; label: string }> = {
  published: { variant: "success", label: "Publicado" },
  draft:     { variant: "neutral", label: "Borrador"  },
  archived:  { variant: "warning", label: "Archivado" },
};

/* ── Editor ───────────────────────────────────────────── */
function DestinoEditor({ destino, onBack }: { destino: Destino | null; onBack: () => void }) {
  const isNew = !destino;
  const [d, setD] = useState<Destino>(destino ?? {
    id: "new", name: { es: "", en: "" }, slug: "", description: { es: "", en: "" },
    lat: "", lng: "", experienceCount: 0, tourCount: 0, status: "draft" as const, emoji: "📍", color: "#F1F5F9",
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", fontFamily: "Inter, sans-serif" }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#94A3B8", marginBottom: 8 }}>
          <button onClick={onBack} style={{ border: "none", background: "transparent", cursor: "pointer", color: "#94A3B8", display: "flex", alignItems: "center", gap: 4, fontSize: 12 }}>
            <ArrowLeft size={12} /> Destinos
          </button>
          <span>/</span>
          <span style={{ color: "#0F172A" }}>{isNew ? "Nuevo destino" : d.name.es}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#0F172A", margin: 0, flex: 1 }}>
            {isNew ? "Nuevo destino" : d.name.es}
          </h1>
          <StatusBadge variant={statusConf[d.status].variant} label={statusConf[d.status].label} />
          <div style={{ display: "flex", gap: 8 }}>
            <Btn variant="secondary" size="sm"><Save size={13} /> Guardar borrador</Btn>
            <Btn variant="primary" size="sm"><Globe size={13} /> Publicar</Btn>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <FormField label="Nombre del destino" required>
          <BilingualField value={d.name} onChange={v => setD(p => ({...p, name: v}))} placeholder="Nombre del destino..." />
        </FormField>
        <FormField label="Descripción">
          <BilingualField value={d.description} onChange={v => setD(p => ({...p, description: v}))} multiline rows={4} placeholder="Descripción del destino para la web..." />
        </FormField>
        <FormField label="Slug (URL)">
          <Input value={d.slug} onChange={v => setD(p => ({...p, slug: v}))} placeholder="santiago" />
        </FormField>

        {/* Geo */}
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#0F172A", display: "block", marginBottom: 8 }}>
            <MapPin size={13} style={{ verticalAlign: "middle", marginRight: 4 }} /> Ubicación geográfica
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <FormField label="Latitud"><Input value={d.lat} onChange={v => setD(p => ({...p, lat: v}))} placeholder="19.4517" /></FormField>
            <FormField label="Longitud"><Input value={d.lng} onChange={v => setD(p => ({...p, lng: v}))} placeholder="-70.6970" /></FormField>
          </div>
          <div style={{ height: 180, borderRadius: 8, border: "1px solid #E5E7EB", background: `linear-gradient(135deg, ${d.color} 0%, ${d.color}99 100%)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#0369A1", gap: 8 }}>
            <span style={{ fontSize: 36 }}>{d.emoji}</span>
            <span style={{ fontSize: 13, fontWeight: 500 }}>{d.lat && d.lng ? `${d.lat}°, ${d.lng}°` : "Introduce coordenadas para ver el mapa"}</span>
            <span style={{ fontSize: 11, opacity: 0.7 }}>Mapa interactivo (Mapbox/Google)</span>
          </div>
        </div>

        <FormField label="Estado">
          <SelectField value={d.status} onChange={v => setD(p => ({...p, status: v as typeof d.status}))}
            options={[
              { value: "published", label: "Publicado — visible en la web" },
              { value: "draft",     label: "Borrador — solo visible en CMS" },
              { value: "archived",  label: "Archivado" },
            ]}
          />
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
export function Destinos() {
  const [mode, setMode]       = useState<"list" | "editor">("list");
  const [editing, setEditing] = useState<Destino | null>(null);
  const [search, setSearch]   = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});

  if (mode === "editor") return <DestinoEditor destino={editing} onBack={() => setMode("list")} />;

  const filtered = DESTINATIONS.filter(d => {
    const q = search.toLowerCase();
    return (!q || d.name.es.toLowerCase().includes(q) || d.slug.toLowerCase().includes(q))
      && (!filters.status || d.status === filters.status);
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, fontFamily: "Inter, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <FilterBar
          filters={[{ key: "status", label: "Estado", type: "select", options: Object.entries(statusConf).map(([v, s]) => ({ value: v, label: s.label })) }]}
          values={filters}
          onChange={(k, v) => setFilters(p => ({ ...p, [k]: v }))}
          onClear={() => { setFilters({}); setSearch(""); }}
          onSearch={setSearch}
          searchValue={search}
          searchPlaceholder="Buscar destino..."
        />
        <button onClick={() => { setEditing(null); setMode("editor"); }}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 6, border: "none", background: "#006CFE", fontSize: 13, color: "#FFFFFF", cursor: "pointer", fontWeight: 500 }}>
          <Plus size={14} /> Crear destino
        </button>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🗺️</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#0F172A", marginBottom: 6 }}>Sin destinos</div>
          <div style={{ fontSize: 13, color: "#94A3B8", marginBottom: 16 }}>Crea el primer destino del catálogo.</div>
          <button onClick={() => { setEditing(null); setMode("editor"); }} style={{ padding: "8px 20px", borderRadius: 6, border: "none", background: "#006CFE", color: "#FFFFFF", fontSize: 13, cursor: "pointer" }}>Crear destino</button>
        </div>
      ) : (
        <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#F7F8FA", borderBottom: "1px solid #E5E7EB" }}>
                {["Destino", "Slug", "Coordenadas", "Experiencias", "Tours", "Estado", ""].map(h => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: ["Experiencias", "Tours"].includes(h) ? "center" : "left", fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((d, i) => (
                <tr key={d.id}
                  style={{ borderBottom: i < filtered.length - 1 ? "1px solid #F1F5F9" : "none", cursor: "pointer" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#F7F8FA")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  onClick={() => { setEditing(d); setMode("editor"); }}
                >
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 6, background: d.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{d.emoji}</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>{d.name.es}</div>
                        <div style={{ fontSize: 11, color: "#94A3B8" }}>{d.name.en}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: "#94A3B8", fontFamily: "monospace" }}>{d.slug}</td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: "#475569" }}>{d.lat}°, {d.lng}°</td>
                  <td style={{ padding: "12px 16px", textAlign: "center", fontWeight: 700, fontSize: 14 }}>{d.experienceCount}</td>
                  <td style={{ padding: "12px 16px", textAlign: "center", fontWeight: 700, fontSize: 14 }}>{d.tourCount}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <StatusBadge variant={statusConf[d.status].variant} label={statusConf[d.status].label} />
                  </td>
                  <td style={{ padding: "12px 16px" }} onClick={e => e.stopPropagation()}>
                    <button onClick={() => { setEditing(d); setMode("editor"); }}
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
