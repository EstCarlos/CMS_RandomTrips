import { useState } from "react";
import { Plus, ChevronDown, ChevronRight, Edit2, Trash2, X, GripVertical } from "lucide-react";
import { StatusBadge } from "../ui/StatusBadge";
import { BilingualField, FormField } from "../ui/FormField";
import { Btn } from "../ui/Modal";
import type { FAQ, FaqCategory, Bilingual } from "../../data/types";
import { FAQS } from "../../data/realData";

/* ── Inline editor (drawer) ─────────────────────────────── */
function FAQEditor({ item, onSave, onClose }: { item: FAQ | null; onSave: (i: FAQ) => void; onClose: () => void }) {
  const isNew = !item;
  const [question, setQuestion] = useState<Bilingual>(item?.question ?? { es: "", en: "" });
  const [answer, setAnswer]     = useState<Bilingual>(item?.answer   ?? { es: "", en: "" });
  const [status, setStatus]     = useState<"published" | "draft">(item?.status ?? "draft");

  const save = () => {
    onSave({ id: item?.id || `F-${Date.now()}`, question, answer, status, order: item?.order ?? 99, category: item?.category ?? "" });
    onClose();
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", justifyContent: "flex-end" }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(15,23,42,.3)" }} onClick={onClose} />
      <div style={{ position: "relative", width: 480, background: "#FFFFFF", boxShadow: "-8px 0 32px rgba(0,0,0,.12)", display: "flex", flexDirection: "column", fontFamily: "Inter, sans-serif" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #E5E7EB", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>{isNew ? "Nueva pregunta" : "Editar pregunta"}</span>
          <button onClick={onClose} style={{ border: "1px solid #E5E7EB", background: "#FFFFFF", borderRadius: 6, width: 28, height: 28, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={13} color="#94A3B8" />
          </button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: 16 }}>
          <FormField label="Pregunta" required>
            <BilingualField value={question} onChange={setQuestion} placeholder="¿Cómo puedo...?" />
          </FormField>
          <FormField label="Respuesta" required>
            <BilingualField value={answer} onChange={setAnswer} multiline rows={6} placeholder="La respuesta detallada..." />
          </FormField>
          <FormField label="Estado">
            <div style={{ display: "flex", gap: 8 }}>
              {(["published", "draft"] as const).map(s => (
                <button key={s} onClick={() => setStatus(s)} style={{
                  flex: 1, padding: "7px", borderRadius: 6, border: `1.5px solid ${status === s ? "#006CFE" : "#E5E7EB"}`,
                  background: status === s ? "#EFF6FF" : "#FFFFFF", cursor: "pointer",
                  fontSize: 12, fontWeight: status === s ? 600 : 400, color: status === s ? "#006CFE" : "#475569",
                }}>
                  {s === "published" ? "✓ Publicado" : "⬜ Borrador"}
                </button>
              ))}
            </div>
          </FormField>
        </div>
        <div style={{ padding: "14px 20px", borderTop: "1px solid #E5E7EB", display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <Btn variant="secondary" onClick={onClose}>Cancelar</Btn>
          <Btn variant="primary" onClick={save}>Guardar pregunta</Btn>
        </div>
      </div>
    </div>
  );
}

/* ── Main ───────────────────────────────────────────────── */
export function FAQ() {
  const [categories, setCategories] = useState<FaqCategory[]>(FAQS);
  const [openCats, setOpenCats]     = useState<Set<string>>(new Set(["C-1"]));
  const [editing, setEditing]       = useState<{ catId: string; item: FAQ | null } | null>(null);

  const toggleCat = (id: string) => { const n = new Set(openCats); n.has(id) ? n.delete(id) : n.add(id); setOpenCats(n); };

  const handleSave = (catId: string, item: FAQ) => {
    const saved = { ...item, category: catId };
    setCategories(cats => cats.map(c => c.id !== catId ? c : {
      ...c,
      items: saved.id && c.items.some(i => i.id === saved.id)
        ? c.items.map(i => i.id === saved.id ? saved : i)
        : [...c.items, saved],
    }));
  };

  const deleteItem = (catId: string, itemId: string) => {
    setCategories(cats => cats.map(c => c.id !== catId ? c : { ...c, items: c.items.filter(i => i.id !== itemId) }));
  };

  const totalPreguntas = categories.reduce((s, c) => s + c.items.length, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, fontFamily: "Inter, sans-serif" }}>
      {editing && (
        <FAQEditor
          item={editing.item}
          onSave={item => handleSave(editing.catId, item)}
          onClose={() => setEditing(null)}
        />
      )}

      {/* Header stats */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 13, color: "#94A3B8" }}>{totalPreguntas} preguntas en {categories.length} categorías</span>
        <button
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 6, border: "none", background: "#006CFE", fontSize: 13, color: "#FFFFFF", cursor: "pointer", fontWeight: 500 }}>
          <Plus size={14} /> Nueva categoría
        </button>
      </div>

      {/* Categories */}
      {categories.map(cat => {
        const isOpen = openCats.has(cat.id);
        return (
          <div key={cat.id} style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, overflow: "hidden" }}>
            {/* Category header */}
            <div
              onClick={() => toggleCat(cat.id)}
              style={{
                padding: "14px 16px", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 10,
                background: isOpen ? "#F7F8FA" : "#FFFFFF",
                borderBottom: isOpen ? "1px solid #E5E7EB" : "none",
                userSelect: "none",
              }}
            >
              {isOpen ? <ChevronDown size={16} color="#94A3B8" /> : <ChevronRight size={16} color="#94A3B8" />}
              <span style={{ fontSize: 18 }}>{cat.icon}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", flex: 1 }}>{cat.name}</span>
              <span style={{ fontSize: 12, color: "#94A3B8", background: "#F1F5F9", padding: "2px 8px", borderRadius: 20 }}>
                {cat.items.length} preguntas
              </span>
            </div>

            {/* Items table */}
            {isOpen && (
              <>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#FAFAFA" }}>
                      {["", "Pregunta ES", "Pregunta EN", "Estado", ""].map((h, hi) => (
                        <th key={`faq-th-${hi}`} style={{ padding: "8px 14px", textAlign: "left", fontSize: 10, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid #F1F5F9" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {cat.items.map((item, i) => (
                      <tr key={item.id}
                        style={{ borderBottom: i < cat.items.length - 1 ? "1px solid #F1F5F9" : "none" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "#F7F8FA")}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                      >
                        <td style={{ padding: "11px 14px", width: 24 }}>
                          <GripVertical size={14} color="#CBD5E1" style={{ cursor: "grab" }} />
                        </td>
                        <td style={{ padding: "11px 14px", fontSize: 13, color: "#0F172A", maxWidth: 260 }}>
                          <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.question.es}</div>
                        </td>
                        <td style={{ padding: "11px 14px", fontSize: 12, color: "#94A3B8", maxWidth: 200 }}>
                          <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.question.en}</div>
                        </td>
                        <td style={{ padding: "11px 14px" }}>
                          <StatusBadge variant={item.status === "published" ? "success" : "neutral"} label={item.status === "published" ? "Publicado" : "Borrador"} />
                        </td>
                        <td style={{ padding: "11px 14px" }}>
                          <div style={{ display: "flex", gap: 4 }}>
                            <button onClick={() => setEditing({ catId: cat.id, item })}
                              style={{ width: 27, height: 27, borderRadius: 6, border: "1px solid #E5E7EB", background: "#FFFFFF", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <Edit2 size={11} color="#475569" />
                            </button>
                            <button onClick={() => deleteItem(cat.id, item.id)}
                              style={{ width: 27, height: 27, borderRadius: 6, border: "1px solid #FEE2E2", background: "#FEF2F2", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <Trash2 size={11} color="#F13540" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ padding: "10px 16px", borderTop: "1px solid #F1F5F9" }}>
                  <button onClick={() => { setEditing({ catId: cat.id, item: null }); setOpenCats(prev => new Set([...prev, cat.id])); }}
                    style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 6, border: "1px dashed #CBD5E1", background: "transparent", fontSize: 12, color: "#94A3B8", cursor: "pointer" }}>
                    <Plus size={12} /> Agregar pregunta a esta categoría
                  </button>
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
