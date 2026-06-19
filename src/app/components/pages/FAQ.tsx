import { useState } from "react";
import { Plus, ChevronDown, ChevronRight, Edit2, Trash2, X, Check, GripVertical } from "lucide-react";
import { StatusBadge } from "../ui/StatusBadge";
import { BilingualField, FormField } from "../ui/FormField";
import { Btn } from "../ui/Modal";

/* ── Types & mock ───────────────────────────────────────── */
interface FAQItem {
  id: string;
  preguntaES: string;
  preguntaEN: string;
  respuestaES: string;
  respuestaEN: string;
  status: "published" | "draft";
  orden: number;
}
interface FAQCategory {
  id: string;
  nombre: string;
  icon: string;
  items: FAQItem[];
}

const mockFAQ: FAQCategory[] = [
  {
    id: "C-1", nombre: "Reservas y pagos", icon: "💳",
    items: [
      { id: "F-001", preguntaES: "¿Cómo puedo reservar un tour?", preguntaEN: "How can I book a tour?", respuestaES: "Puedes reservar directamente en nuestra web, por WhatsApp o enviando un formulario de cotización. Aceptamos tarjeta de crédito, PayPal y transferencia bancaria.", respuestaEN: "You can book directly on our website, via WhatsApp or by submitting a quote form. We accept credit cards, PayPal and bank transfer.", status: "published", orden: 1 },
      { id: "F-002", preguntaES: "¿Qué depósito se requiere?", preguntaEN: "What deposit is required?", respuestaES: "Para confirmar la reserva se requiere un depósito del 25% del total. El saldo restante se paga 48h antes del tour.", respuestaEN: "A 25% deposit of the total is required to confirm the reservation. The remaining balance is paid 48h before the tour.", status: "published", orden: 2 },
      { id: "F-003", preguntaES: "¿Cuál es su política de cancelación?", preguntaEN: "What is your cancellation policy?", respuestaES: "Cancelaciones con más de 72h de antelación: reembolso completo. Entre 48-72h: 50%. Menos de 48h: sin reembolso.", respuestaEN: "Cancellations more than 72h in advance: full refund. Between 48-72h: 50%. Less than 48h: no refund.", status: "published", orden: 3 },
    ],
  },
  {
    id: "C-2", nombre: "Sobre los tours", icon: "🎒",
    items: [
      { id: "F-004", preguntaES: "¿Qué debo llevar al tour?", preguntaEN: "What should I bring to the tour?", respuestaES: "Ropa cómoda, protector solar biodegradable, traje de baño, toalla, identificación y efectivo para propinas y souvenirs.", respuestaEN: "Comfortable clothing, biodegradable sunscreen, swimsuit, towel, ID and cash for tips and souvenirs.", status: "published", orden: 1 },
      { id: "F-005", preguntaES: "¿Los guías hablan inglés?", preguntaEN: "Do the guides speak English?", respuestaES: "Sí, todos nuestros guías son bilingües (español/inglés). Consulta disponibilidad de guías en francés, alemán y portugués.", respuestaEN: "Yes, all our guides are bilingual (Spanish/English). Check availability of guides in French, German and Portuguese.", status: "published", orden: 2 },
      { id: "F-006", preguntaES: "¿Los tours incluyen traslado?", preguntaEN: "Do tours include transfer?", respuestaES: "La mayoría de nuestros tours incluyen pickup y dropoff en hoteles del área. Consulta el detalle de cada tour para confirmarlo.", respuestaEN: "Most of our tours include pickup and dropoff at hotels in the area. Check each tour's details to confirm.", status: "draft", orden: 3 },
    ],
  },
  {
    id: "C-3", nombre: "Grupos y empresas", icon: "👥",
    items: [
      { id: "F-007", preguntaES: "¿Hacen tours privados para grupos?", preguntaEN: "Do you offer private group tours?", respuestaES: "Sí, organizamos tours privados para grupos desde 2 hasta 50 personas. Solicita una cotización personalizada.", respuestaEN: "Yes, we organize private tours for groups from 2 to 50 people. Request a personalized quote.", status: "published", orden: 1 },
    ],
  },
];

/* ── Inline editor (drawer) ─────────────────────────────── */
function FAQEditor({ item, onSave, onClose }: { item: FAQItem | null; onSave: (i: FAQItem) => void; onClose: () => void }) {
  const isNew = !item;
  const [pregES, setPregES] = useState(item?.preguntaES || "");
  const [pregEN, setPregEN] = useState(item?.preguntaEN || "");
  const [respES, setRespES] = useState(item?.respuestaES || "");
  const [respEN, setRespEN] = useState(item?.respuestaEN || "");
  const [status, setStatus] = useState<"published" | "draft">(item?.status || "draft");

  const save = () => {
    onSave({ id: item?.id || `F-${Date.now()}`, preguntaES: pregES, preguntaEN: pregEN, respuestaES: respES, respuestaEN: respEN, status, orden: item?.orden || 99 });
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
            <BilingualField value={{ es: pregES, en: pregEN }} onChange={v => { setPregES(v.es); setPregEN(v.en); }} placeholder="¿Cómo puedo...?" />
          </FormField>
          <FormField label="Respuesta" required>
            <BilingualField value={{ es: respES, en: respEN }} onChange={v => { setRespES(v.es); setRespEN(v.en); }} multiline rows={6} placeholder="La respuesta detallada..." />
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
  const [categories, setCategories] = useState(mockFAQ);
  const [openCats, setOpenCats]     = useState<Set<string>>(new Set(["C-1"]));
  const [editing, setEditing]       = useState<{ catId: string; item: FAQItem | null } | null>(null);

  const toggleCat = (id: string) => { const n = new Set(openCats); n.has(id) ? n.delete(id) : n.add(id); setOpenCats(n); };

  const handleSave = (catId: string, item: FAQItem) => {
    setCategories(cats => cats.map(c => c.id !== catId ? c : {
      ...c,
      items: item.id && c.items.some(i => i.id === item.id)
        ? c.items.map(i => i.id === item.id ? item : i)
        : [...c.items, item],
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
              <span style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", flex: 1 }}>{cat.nombre}</span>
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
                          <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.preguntaES}</div>
                        </td>
                        <td style={{ padding: "11px 14px", fontSize: 12, color: "#94A3B8", maxWidth: 200 }}>
                          <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.preguntaEN}</div>
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
