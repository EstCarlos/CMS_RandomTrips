import { useState } from "react";
import { Plus, Edit2, Trash2, Star, X, Globe, Save } from "lucide-react";
import { StatusBadge } from "../ui/StatusBadge";
import { FormField, Input, SelectField, BilingualField } from "../ui/FormField";
import { Btn } from "../ui/Modal";
import { TESTIMONIALS, TOURS_DATA } from "../../data/realData";

type Testimonio = typeof TESTIMONIALS[0];

const TOUR_OPTIONS = TOURS_DATA.map(t => ({ value: t.id, label: t.titulo_es }));

/* ── Star rating ──────────────────────────────────────── */
function StarRating({ rating, onChange }: { rating: number; onChange?: (r: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1,2,3,4,5].map(s => (
        <button key={s}
          onClick={() => onChange?.(s)}
          onMouseEnter={() => onChange && setHover(s)}
          onMouseLeave={() => onChange && setHover(0)}
          style={{ border: "none", background: "transparent", cursor: onChange ? "pointer" : "default", padding: 1 }}
        >
          <Star size={16} fill={(hover || rating) >= s ? "#FEDA40" : "none"} color={(hover || rating) >= s ? "#FEDA40" : "#CBD5E1"} />
        </button>
      ))}
    </div>
  );
}

/* ── Editor Drawer ────────────────────────────────────── */
function TestimonioEditor({ item, onSave, onClose }: {
  item: Testimonio | null;
  onSave: (t: Testimonio) => void;
  onClose: () => void;
}) {
  const isNew = !item;
  const [t, setT] = useState<Testimonio>(item ?? {
    id: `tst-${Date.now()}`,
    cliente_nombre: "", tour_id: "", tour_nombre: "",
    contenido_es: "", contenido_en: "",
    rating: 5, fecha: "Jun 2026", aprobado: false, orden: 99,
  });

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", justifyContent: "flex-end" }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(15,23,42,.3)" }} onClick={onClose} />
      <div style={{ position: "relative", width: 500, background: "#FFFFFF", boxShadow: "-8px 0 32px rgba(0,0,0,.12)", display: "flex", flexDirection: "column", fontFamily: "Inter, sans-serif" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #E5E7EB", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>{isNew ? "Nuevo testimonio" : "Editar testimonio"}</span>
          <button onClick={onClose} style={{ border: "1px solid #E5E7EB", background: "#FFFFFF", borderRadius: 6, width: 28, height: 28, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={13} color="#94A3B8" />
          </button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <FormField label="Nombre del cliente" required>
              <Input value={t.cliente_nombre} onChange={v => setT(p => ({...p, cliente_nombre: v}))} placeholder="Ana Belén R." />
            </FormField>
            <FormField label="Fecha">
              <Input value={t.fecha} onChange={v => setT(p => ({...p, fecha: v}))} placeholder="Jul 2025" />
            </FormField>
          </div>
          <FormField label="Tour asociado">
            <SelectField value={t.tour_id}
              onChange={v => { const tour = TOURS_DATA.find(x => x.id === v); setT(p => ({...p, tour_id: v, tour_nombre: tour?.titulo_es || ""})); }}
              options={TOUR_OPTIONS}
              placeholder="Seleccionar tour (opcional)..."
            />
          </FormField>
          <FormField label="Rating">
            <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 4 }}>
              <StarRating rating={t.rating} onChange={r => setT(p => ({...p, rating: r}))} />
              <span style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>{t.rating}/5</span>
            </div>
          </FormField>
          <FormField label="Contenido del testimonio" required>
            <BilingualField
              valueES={t.contenido_es} valueEN={t.contenido_en}
              onChangeES={v => setT(p => ({...p, contenido_es: v}))}
              onChangeEN={v => setT(p => ({...p, contenido_en: v}))}
              multiline rows={5}
              placeholder="El agua de La Plaza es de otro mundo..."
            />
          </FormField>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <FormField label="Estado">
              <div style={{ display: "flex", gap: 6 }}>
                {([true, false] as const).map(s => (
                  <button key={String(s)} onClick={() => setT(p => ({...p, aprobado: s}))} style={{ flex: 1, padding: "6px", borderRadius: 6, border: `1.5px solid ${t.aprobado === s ? "#006CFE" : "#E5E7EB"}`, background: t.aprobado === s ? "#EFF6FF" : "#FFFFFF", cursor: "pointer", fontSize: 12, fontWeight: t.aprobado === s ? 600 : 400, color: t.aprobado === s ? "#006CFE" : "#475569" }}>
                    {s ? "✓ Aprobado" : "⬜ Borrador"}
                  </button>
                ))}
              </div>
            </FormField>
            <FormField label="Orden de display">
              <Input value={String(t.orden)} onChange={v => setT(p => ({...p, orden: Number(v)}))} type="number" placeholder="1" />
            </FormField>
          </div>
        </div>
        <div style={{ padding: "14px 20px", borderTop: "1px solid #E5E7EB", display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <Btn variant="secondary" onClick={onClose}>Cancelar</Btn>
          <Btn variant="primary" onClick={() => { onSave(t); onClose(); }}>Guardar testimonio</Btn>
        </div>
      </div>
    </div>
  );
}

/* ── Main ────────────────────────────────────────────── */
export function Testimonios() {
  const [items, setItems]     = useState<Testimonio[]>(TESTIMONIALS);
  const [editing, setEditing] = useState<Testimonio | null | "new">(null);

  const handleSave = (t: Testimonio) => {
    setItems(prev => prev.some(i => i.id === t.id) ? prev.map(i => i.id === t.id ? t : i) : [...prev, t]);
  };

  const aprobados = items.filter(t => t.aprobado).length;
  const borradores = items.filter(t => !t.aprobado).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, fontFamily: "Inter, sans-serif" }}>
      {editing !== null && (
        <TestimonioEditor item={editing === "new" ? null : editing} onSave={handleSave} onClose={() => setEditing(null)} />
      )}

      {/* Summary */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 16, fontSize: 13 }}>
          <span style={{ color: "#16A34A", fontWeight: 600 }}>✓ {aprobados} aprobados</span>
          {borradores > 0 && <span style={{ color: "#94A3B8" }}>{borradores} borradores</span>}
          <span style={{ color: "#94A3B8" }}>·</span>
          <span style={{ color: "#475569" }}>Promedio: <strong>⭐ {(items.filter(t => t.aprobado).reduce((s, t) => s + t.rating, 0) / (aprobados || 1)).toFixed(1)}</strong></span>
        </div>
        <button onClick={() => setEditing("new")}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 6, border: "none", background: "#006CFE", fontSize: 13, color: "#FFFFFF", cursor: "pointer", fontWeight: 500 }}>
          <Plus size={14} /> Nuevo testimonio
        </button>
      </div>

      {/* Table */}
      <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F7F8FA", borderBottom: "1px solid #E5E7EB" }}>
              {["Cliente", "Tour", "Rating", "Testimonio (ES)", "Estado", "Fecha", "Ord.", ""].map(h => (
                <th key={h} style={{ padding: "10px 14px", textAlign: h === "Rating" || h === "Ord." ? "center" : "left", fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.sort((a, b) => a.orden - b.orden).map((t, i) => (
              <tr key={t.id}
                style={{ borderBottom: i < items.length - 1 ? "1px solid #F1F5F9" : "none" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#F7F8FA")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <td style={{ padding: "12px 14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#475569", flexShrink: 0 }}>
                      {t.cliente_nombre.split(" ").map(n => n[0]).join("").slice(0,2)}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>{t.cliente_nombre}</span>
                  </div>
                </td>
                <td style={{ padding: "12px 14px", fontSize: 12, color: "#475569", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {t.tour_nombre.split(" ").slice(0, 3).join(" ")}…
                </td>
                <td style={{ padding: "12px 14px", textAlign: "center" }}>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <StarRating rating={t.rating} />
                  </div>
                </td>
                <td style={{ padding: "12px 14px", fontSize: 12, color: "#475569", maxWidth: 280, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontStyle: "italic" }}>
                  "{t.contenido_es}"
                </td>
                <td style={{ padding: "12px 14px" }}>
                  <StatusBadge variant={t.aprobado ? "success" : "neutral"} label={t.aprobado ? "Aprobado" : "Borrador"} />
                </td>
                <td style={{ padding: "12px 14px", fontSize: 12, color: "#94A3B8" }}>{t.fecha}</td>
                <td style={{ padding: "12px 14px", textAlign: "center", fontSize: 13, fontWeight: 600, color: "#475569" }}>{t.orden}</td>
                <td style={{ padding: "12px 14px" }}>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button onClick={() => setEditing(t)}
                      style={{ width: 27, height: 27, borderRadius: 6, border: "1px solid #E5E7EB", background: "#FFFFFF", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Edit2 size={11} color="#475569" />
                    </button>
                    <button onClick={() => setItems(prev => prev.filter(x => x.id !== t.id))}
                      style={{ width: 27, height: 27, borderRadius: 6, border: "1px solid #FEE2E2", background: "#FEF2F2", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Trash2 size={11} color="#F13540" />
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
