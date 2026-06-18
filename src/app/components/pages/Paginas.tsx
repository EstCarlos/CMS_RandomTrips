import { useState } from "react";
import { Edit2, Globe, Save, ArrowLeft, Check } from "lucide-react";
import { StatusBadge } from "../ui/StatusBadge";
import { FormField, Input, BilingualField } from "../ui/FormField";
import { Btn } from "../ui/Modal";
import { PAGES_DATA } from "../../data/realData";

type Page = typeof PAGES_DATA[0];

/* ── Editor ───────────────────────────────────────────── */
function PaginaEditor({ page, onBack }: { page: Page; onBack: () => void }) {
  const [p, setP] = useState(page);
  const [tab, setTab] = useState<"es" | "en">("es");
  const [saved, setSaved] = useState(false);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 3000); };

  return (
    <div style={{ display: "flex", flexDirection: "column", fontFamily: "Inter, sans-serif" }}>
      <div style={{ marginBottom: 20 }}>
        <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 4, border: "none", background: "transparent", cursor: "pointer", color: "#94A3B8", fontSize: 12, marginBottom: 8 }}>
          <ArrowLeft size={12} /> Páginas
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#0F172A", margin: 0, flex: 1 }}>{p.titulo_es}</h1>
          <StatusBadge variant="success" label="Publicado" />
          <div style={{ display: "flex", gap: 8 }}>
            <Btn variant="secondary" size="sm"><Save size={13} /> Guardar borrador</Btn>
            <Btn variant="primary" size="sm"><Globe size={13} /> Publicar</Btn>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 760 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <FormField label="Título ES"><Input value={p.titulo_es} onChange={v => setP(prev => ({...prev, titulo_es: v}))} /></FormField>
          <FormField label="Título EN"><Input value={p.titulo_en} onChange={v => setP(prev => ({...prev, titulo_en: v}))} /></FormField>
        </div>
        <FormField label="Slug (URL)" helper="Ruta en la web pública">
          <div style={{ display: "flex", border: "1px solid #E5E7EB", borderRadius: 6, overflow: "hidden" }}>
            <span style={{ padding: "8px 12px", background: "#F7F8FA", fontSize: 12, color: "#94A3B8", borderRight: "1px solid #E5E7EB", whiteSpace: "nowrap" }}>randomtrips.co/</span>
            <input value={p.slug} onChange={e => setP(prev => ({...prev, slug: e.target.value}))} style={{ flex: 1, padding: "8px 12px", border: "none", outline: "none", fontSize: 13 }} />
          </div>
        </FormField>

        {/* Language toggle */}
        <div>
          <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
            {(["es", "en"] as const).map(l => (
              <button key={l} onClick={() => setTab(l)} style={{ padding: "5px 12px", borderRadius: 6, border: `1px solid ${tab === l ? "#006CFE" : "#E5E7EB"}`, background: tab === l ? "#EFF6FF" : "#FFFFFF", color: tab === l ? "#006CFE" : "#475569", fontSize: 12, cursor: "pointer", fontWeight: tab === l ? 600 : 400 }}>
                {l === "es" ? "🇩🇴 Español" : "🇺🇸 English"}
              </button>
            ))}
          </div>
          <FormField label={`Contenido ${tab.toUpperCase()}`} required>
            <textarea
              value={tab === "es" ? p.contenido_es : p.contenido_en}
              onChange={e => setP(prev => tab === "es" ? {...prev, contenido_es: e.target.value} : {...prev, contenido_en: e.target.value})}
              rows={14}
              style={{ width: "100%", padding: "12px", border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 13, outline: "none", resize: "vertical", fontFamily: "Inter, sans-serif", boxSizing: "border-box", lineHeight: 1.7 }}
            />
          </FormField>
        </div>
      </div>

      <div style={{ position: "fixed", bottom: 0, left: 240, right: 0, background: "#FFFFFF", borderTop: "1px solid #E5E7EB", padding: "12px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 50, boxShadow: "0 -4px 12px rgba(0,0,0,.04)" }}>
        <Btn variant="ghost" onClick={onBack}>Descartar</Btn>
        {saved && <span style={{ fontSize: 12, color: "#16A34A", display: "flex", alignItems: "center", gap: 5 }}><Check size={12} /> Guardado</span>}
        <div style={{ display: "flex", gap: 8 }}>
          <Btn variant="secondary" onClick={handleSave}><Save size={13} /> Guardar borrador</Btn>
          <Btn variant="primary" onClick={handleSave}><Globe size={13} /> Publicar</Btn>
        </div>
      </div>
      <div style={{ height: 64 }} />
    </div>
  );
}

/* ── Main list ────────────────────────────────────────── */
export function Paginas() {
  const [editing, setEditing] = useState<Page | null>(null);

  if (editing) return <PaginaEditor page={editing} onBack={() => setEditing(null)} />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, fontFamily: "Inter, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 13, color: "#94A3B8" }}>{PAGES_DATA.length} páginas</span>
        <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 6, border: "none", background: "#006CFE", fontSize: 13, color: "#FFFFFF", cursor: "pointer", fontWeight: 500 }}>
          + Nueva página
        </button>
      </div>

      <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F7F8FA", borderBottom: "1px solid #E5E7EB" }}>
              {["Página", "Slug", "Estado", ""].map(h => (
                <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PAGES_DATA.map((page, i) => (
              <tr key={page.id}
                style={{ borderBottom: i < PAGES_DATA.length - 1 ? "1px solid #F1F5F9" : "none", cursor: "pointer" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#F7F8FA")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                onClick={() => setEditing(page)}
              >
                <td style={{ padding: "14px 16px" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>{page.titulo_es}</div>
                  <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>{page.titulo_en}</div>
                </td>
                <td style={{ padding: "14px 16px", fontSize: 12, color: "#94A3B8", fontFamily: "monospace" }}>/{page.slug}</td>
                <td style={{ padding: "14px 16px" }}>
                  <StatusBadge variant="success" label="Publicado" />
                </td>
                <td style={{ padding: "14px 16px" }} onClick={e => e.stopPropagation()}>
                  <button onClick={() => setEditing(page)}
                    style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid #E5E7EB", background: "#FFFFFF", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Edit2 size={12} color="#475569" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
