import { useState } from "react";
import {
  ArrowLeft, Eye, Copy, Save, Globe, ChevronDown,
  Plus, Trash2, GripVertical, X, Upload, Image,
  ChevronUp, Check, Search, MapPin, Clock, AlertTriangle,
} from "lucide-react";
import { FormField, Input, Textarea, SelectField, BilingualField } from "../ui/FormField";
import { StatusBadge } from "../ui/StatusBadge";
import { Btn } from "../ui/Modal";
import { TOURS_DATA, SERVICE_CATALOG, DESTINATIONS, EXPERIENCES, MEDIA_ASSETS, SITE_CONFIG, formatDOP, dopToUSD, dopToEUR } from "../../data/realData";

/* ── Type derived from real data ──────────────────────── */
type RealTour = typeof TOURS_DATA[0];

const tabs = [
  { id: "info",         label: "Información básica" },
  { id: "pricing",      label: "Pricing"            },
  { id: "experiencias", label: "Experiencias"        },
  { id: "destinos",     label: "Destinos"            },
  { id: "servicios",    label: "Servicios incluidos" },
  { id: "detalles",     label: "Detalles"            },
  { id: "logistica",    label: "Logística"           },
  { id: "galeria",      label: "Galería"             },
  { id: "seo",          label: "SEO"                 },
];

/* ── Chip multi-select ────────────────────────────────── */
function ChipSelect({ options, value, onChange }: { options: string[]; value: string[]; onChange: (v: string[]) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 6 }}>
        {value.map(v => (
          <span key={v} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 8px", borderRadius: 20, background: "#EFF6FF", border: "1px solid #BFDBFE", fontSize: 12, color: "#1D4ED8" }}>
            {v}
            <button onClick={() => onChange(value.filter(x => x !== v))} style={{ border: "none", background: "transparent", cursor: "pointer", padding: 0, display: "flex" }}>
              <X size={11} color="#94A3B8" />
            </button>
          </span>
        ))}
        <button onClick={() => setOpen(!open)} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 8px", borderRadius: 20, border: "1px dashed #CBD5E1", background: "transparent", fontSize: 12, color: "#94A3B8", cursor: "pointer" }}>
          <Plus size={11} /> Agregar
        </button>
      </div>
      {open && (
        <div style={{ border: "1px solid #E5E7EB", borderRadius: 6, overflow: "hidden", background: "#FFFFFF", boxShadow: "0 4px 12px rgba(0,0,0,.08)", maxHeight: 180, overflowY: "auto" }}>
          {options.filter(o => !value.includes(o)).map(o => (
            <button key={o} onClick={() => { onChange([...value, o]); setOpen(false); }}
              style={{ display: "block", width: "100%", textAlign: "left", padding: "8px 12px", border: "none", background: "transparent", fontSize: 13, color: "#0F172A", cursor: "pointer" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#F7F8FA")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Tab: Info ────────────────────────────────────────── */
function TabInfo({ tour, onChange }: { tour: RealTour; onChange: (k: string, v: unknown) => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ gridColumn: "1 / -1" }}>
        <FormField label="Título del tour" required>
          <BilingualField valueES={tour.titulo_es} valueEN={tour.titulo_en} onChangeES={v => onChange("titulo_es", v)} onChangeEN={v => onChange("titulo_en", v)} placeholder="Nombre del tour..." />
        </FormField>
      </div>
      <FormField label="Descripción corta" required>
        <BilingualField valueES={tour.descripcion_es} onChangeES={v => onChange("descripcion_es", v)} multiline rows={3} placeholder="Descripción breve para cards y listados..." />
      </FormField>
      <FormField label="Slug (URL)" helper="Generado del título en ES">
        <Input value={tour.slug} onChange={v => onChange("slug", v)} placeholder="pico-diego-de-ocampo" />
      </FormField>
      <div>
        <label style={{ fontSize: 12, fontWeight: 600, color: "#0F172A", display: "block", marginBottom: 8 }}>Tipo de tour <span style={{ color: "#F13540" }}>*</span></label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {[
            { id: "fijo",         icon: "🎯", title: "Fijo",         desc: "Precio cerrado, sin opciones" },
            { id: "customizable", icon: "🔀", title: "Customizable", desc: "Itinerario con días swappeables" },
            { id: "privado",      icon: "📩", title: "Privado",      desc: "Solo formulario de contacto" },
          ].map(t => {
            const active = tour.tipo === t.id;
            return (
              <button key={t.id} onClick={() => onChange("tipo", t.id)} style={{ padding: "14px 16px", borderRadius: 8, textAlign: "left", cursor: "pointer", border: `2px solid ${active ? "#006CFE" : "#E5E7EB"}`, background: active ? "#EFF6FF" : "#FFFFFF" }}>
                <div style={{ fontSize: 20, marginBottom: 6 }}>{t.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: active ? "#006CFE" : "#0F172A" }}>{t.title}</div>
                <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>{t.desc}</div>
              </button>
            );
          })}
        </div>
      </div>
      <FormField label="Categorías">
        <ChipSelect options={["Naturaleza & Aventura", "Playa & Río", "Senderismo", "Cultural", "Ecoturismo", "Gastronómica"]} value={tour.categorias} onChange={v => onChange("categorias", v)} />
      </FormField>
      <FormField label="Tags">
        <ChipSelect options={["amanecer", "montaña", "río", "turquesa", "aventura", "chaleco", "familia", "grupos"]} value={tour.tags} onChange={v => onChange("tags", v)} />
      </FormField>
    </div>
  );
}

/* ── Tab: Pricing ─────────────────────────────────────── */
function TabPricing({ tour, onChange }: { tour: RealTour; onChange: (k: string, v: unknown) => void }) {
  const [calcPax, setCalcPax] = useState(4);
  const pp = tour.pricing_model.price_per_person;
  const totalDOP = pp * calcPax;
  const depositTotal = SITE_CONFIG.payment_info.deposito_fijo_default * calcPax;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Fixed per person */}
      <div style={{ background: "#F7F8FA", borderRadius: 8, padding: "16px" }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#0F172A", marginBottom: 12 }}>Precio por persona (DOP)</div>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
          <FormField label="">
            <div style={{ display: "flex", border: "1px solid #E5E7EB", borderRadius: 6, overflow: "hidden" }}>
              <span style={{ padding: "8px 10px", background: "#F7F8FA", borderRight: "1px solid #E5E7EB", fontSize: 13, color: "#475569", fontWeight: 600 }}>RD$</span>
              <input type="number" value={pp}
                onChange={e => onChange("pricing_model", { ...tour.pricing_model, price_per_person: Number(e.target.value) })}
                style={{ flex: 1, padding: "8px 12px", border: "none", outline: "none", fontSize: 16, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}
              />
            </div>
          </FormField>
          <div style={{ padding: "8px 14px", background: "#F0FDF4", borderRadius: 6, border: "1px solid #86EFAC", fontSize: 13, color: "#15803D" }}>
            ≈ ${dopToUSD(pp)} USD · €{dopToEUR(pp)} EUR
          </div>
        </div>
      </div>

      {/* Depósito fijo */}
      <div style={{ background: "#FFFBEB", borderRadius: 8, padding: "16px", border: "1px solid #FDE68A" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#92400E", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
          <AlertTriangle size={13} /> Depósito de apartado (monto fijo)
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 6 }}>
          <div style={{ display: "flex", border: "1px solid #FDE68A", borderRadius: 6, overflow: "hidden" }}>
            <span style={{ padding: "8px 10px", background: "#FFFBEB", borderRight: "1px solid #FDE68A", fontSize: 13, color: "#92400E", fontWeight: 600 }}>RD$</span>
            <input type="number" value={SITE_CONFIG.payment_info.deposito_fijo_default}
              style={{ flex: 1, padding: "8px 12px", border: "none", outline: "none", fontSize: 14, fontWeight: 700, width: 80, fontVariantNumeric: "tabular-nums", background: "#FFFBEB" }} readOnly />
            <span style={{ padding: "8px 10px", background: "#FFFBEB", borderLeft: "1px solid #FDE68A", fontSize: 13, color: "#92400E" }}>p/p</span>
          </div>
          <span style={{ fontSize: 12, color: "#92400E" }}>{SITE_CONFIG.payment_info.nota_deposito}</span>
        </div>
        <div style={{ fontSize: 11, color: "#A16207" }}>
          Banco: <strong>{SITE_CONFIG.payment_info.banco}</strong> · Titular: <strong>{SITE_CONFIG.payment_info.titular}</strong> · Cta: {SITE_CONFIG.payment_info.numero_cuenta}
        </div>
      </div>

      {/* Calculadora en vivo */}
      <div style={{ background: "#EFF6FF", borderRadius: 8, padding: "16px", border: "1px solid #BFDBFE" }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#1D4ED8", marginBottom: 12 }}>Vista previa de precio</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <span style={{ fontSize: 13, color: "#475569" }}>Para</span>
          <button onClick={() => setCalcPax(p => Math.max(1, p - 1))} style={{ width: 26, height: 26, borderRadius: 6, border: "1px solid #BFDBFE", background: "#FFFFFF", cursor: "pointer", fontSize: 16 }}>−</button>
          <span style={{ width: 32, textAlign: "center", fontSize: 18, fontWeight: 800, color: "#006CFE" }}>{calcPax}</span>
          <button onClick={() => setCalcPax(p => p + 1)} style={{ width: 26, height: 26, borderRadius: 6, border: "1px solid #BFDBFE", background: "#FFFFFF", cursor: "pointer", fontSize: 16 }}>+</button>
          <span style={{ fontSize: 13, color: "#475569" }}>personas</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 10 }}>
          {[
            { label: "DOP", value: formatDOP(totalDOP) },
            { label: "USD", value: `$${dopToUSD(totalDOP)}` },
            { label: "EUR", value: `€${dopToEUR(totalDOP)}` },
          ].map(c => (
            <div key={c.label} style={{ background: "#FFFFFF", borderRadius: 6, padding: "10px 14px", textAlign: "center", border: "1px solid #BFDBFE" }}>
              <div style={{ fontSize: 10, color: "#94A3B8", marginBottom: 2 }}>{c.label}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#006CFE", fontVariantNumeric: "tabular-nums" }}>{c.value}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 12, color: "#475569", textAlign: "center" }}>
          Depósito: <strong>{formatDOP(depositTotal)}</strong> ({calcPax} × RD$1,000) — no reembolsable
        </div>
      </div>
    </div>
  );
}

/* ── Tab: Experiencias ────────────────────────────────── */
function TabExperiencias({ tour, onChange }: { tour: RealTour; onChange: (k: string, v: unknown) => void }) {
  const [search, setSearch] = useState("");
  const selected = tour.experiencias_ids;
  const allExp = EXPERIENCES.map(e => ({ id: e.id, label: e.nombre_es, sub: e.destinoPadre, tipo: e.tipo }));
  const filtered = allExp.filter(e => e.label.toLowerCase().includes(search.toLowerCase()) && !selected.includes(e.id));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center", border: "1px solid #E5E7EB", borderRadius: 6, padding: "6px 12px", background: "#FFFFFF" }}>
        <Search size={14} color="#94A3B8" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar experiencia del catálogo..." style={{ border: "none", outline: "none", fontSize: 13, flex: 1 }} />
      </div>
      {search && filtered.length > 0 && (
        <div style={{ border: "1px solid #E5E7EB", borderRadius: 6, overflow: "hidden", background: "#FFFFFF" }}>
          {filtered.map(e => (
            <button key={e.id} onClick={() => { onChange("experiencias_ids", [...selected, e.id]); setSearch(""); }}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "10px 14px", border: "none", background: "transparent", cursor: "pointer", fontSize: 13, textAlign: "left" }}
              onMouseEnter={f => (f.currentTarget.style.background = "#F7F8FA")}
              onMouseLeave={f => (f.currentTarget.style.background = "transparent")}
            >
              <div><div style={{ fontWeight: 500 }}>{e.label}</div><div style={{ fontSize: 11, color: "#94A3B8" }}>{e.sub} · {e.tipo}</div></div>
              <Plus size={13} color="#006CFE" />
            </button>
          ))}
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {selected.map((expId, i) => {
          const exp = EXPERIENCES.find(e => e.id === expId);
          if (!exp) return null;
          return (
            <div key={expId} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 6 }}>
              <GripVertical size={14} color="#CBD5E1" />
              <span style={{ width: 24, height: 24, borderRadius: "50%", background: "#EFF6FF", color: "#006CFE", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>{exp.nombre_es}</div>
                <div style={{ fontSize: 11, color: "#94A3B8" }}>{exp.destinoPadre} · {exp.tipo} · {exp.duracion}</div>
              </div>
              <button onClick={() => onChange("experiencias_ids", selected.filter(s => s !== expId))} style={{ border: "none", background: "transparent", cursor: "pointer" }}>
                <X size={14} color="#94A3B8" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Tab: Destinos ────────────────────────────────────── */
function TabDestinos({ tour, onChange }: { tour: RealTour; onChange: (k: string, v: unknown) => void }) {
  const selected = tour.destinos_ids;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
        {DESTINATIONS.map(d => {
          const isSel = selected.includes(d.id);
          return (
            <button key={d.id}
              onClick={() => onChange("destinos_ids", isSel ? selected.filter(s => s !== d.id) : [...selected, d.id])}
              style={{ padding: "14px", borderRadius: 8, border: `2px solid ${isSel ? "#006CFE" : "#E5E7EB"}`, background: isSel ? "#EFF6FF" : "#FFFFFF", cursor: "pointer", textAlign: "left", display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ width: 36, height: 36, borderRadius: 6, background: d.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{d.emoji}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: isSel ? "#006CFE" : "#0F172A" }}>{d.nombre_es}</div>
                <div style={{ fontSize: 11, color: "#94A3B8" }}>{d.lat}°, {d.lng}°</div>
              </div>
              {isSel && <Check size={16} color="#006CFE" style={{ marginLeft: "auto" }} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Tab: Servicios ───────────────────────────────────── */
function TabServicios({ tour, onChange }: { tour: RealTour; onChange: (k: string, v: unknown) => void }) {
  const toggle = (svcId: string) => {
    const next = tour.included_services.map(s =>
      s.service_id === svcId ? { ...s, included: !s.included } : s
    );
    onChange("included_services", next);
  };

  const getIncluded = (svcId: string) => tour.included_services.find(s => s.service_id === svcId)?.included ?? false;
  const getNote     = (svcId: string) => tour.included_services.find(s => s.service_id === svcId)?.custom_note ?? "";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F7F8FA", borderBottom: "1px solid #E5E7EB" }}>
              {["", "Servicio", "Categoría", "¿Incluido?", "Nota personalizada"].map(h => (
                <th key={h} style={{ padding: "8px 14px", textAlign: "left", fontSize: 10, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SERVICE_CATALOG.map((svc, i) => {
              const included = getIncluded(svc.id);
              return (
                <tr key={svc.id} style={{ borderBottom: i < SERVICE_CATALOG.length - 1 ? "1px solid #F1F5F9" : "none", background: included ? "#F0FDF4" : "transparent" }}>
                  <td style={{ padding: "10px 14px", fontSize: 20 }}>{svc.icono}</td>
                  <td style={{ padding: "10px 14px" }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "#0F172A" }}>{svc.nombre_es}</div>
                    <div style={{ fontSize: 11, color: "#94A3B8" }}>{svc.nombre_en}</div>
                  </td>
                  <td style={{ padding: "10px 14px" }}>
                    <span style={{ fontSize: 11, padding: "2px 7px", borderRadius: 20, background: "#F1F5F9", color: "#475569" }}>{svc.categoria}</span>
                  </td>
                  <td style={{ padding: "10px 14px" }}>
                    <button onClick={() => toggle(svc.id)} style={{ width: 38, height: 22, borderRadius: 11, background: included ? "#16A34A" : "#CBD5E1", border: "none", cursor: "pointer", position: "relative", transition: "background 0.2s" }}>
                      <span style={{ position: "absolute", top: 3, left: included ? 19 : 3, width: 16, height: 16, borderRadius: "50%", background: "#FFFFFF", transition: "left 0.2s" }} />
                    </button>
                  </td>
                  <td style={{ padding: "10px 14px" }}>
                    <input value={getNote(svc.id)}
                      onChange={e => onChange("included_services", tour.included_services.map(s => s.service_id === svc.id ? { ...s, custom_note: e.target.value } : s))}
                      placeholder="Nota opcional..."
                      style={{ width: "100%", padding: "5px 8px", border: "1px solid #E5E7EB", borderRadius: 5, fontSize: 12, outline: "none" }}
                    />
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

/* ── Tab: Detalles ────────────────────────────────────── */
function TabDetalles({ tour, onChange }: { tour: RealTour; onChange: (k: string, v: unknown) => void }) {
  const d = tour.details;
  const upd = (k: string, v: unknown) => onChange("details", { ...d, [k]: v });
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, maxWidth: 700 }}>
      <FormField label="Duración"><Input value={d.duracion} onChange={v => upd("duracion", v)} /></FormField>
      <FormField label="Cuándo reservar"><Input value={d.cuando_reservar} onChange={v => upd("cuando_reservar", v)} /></FormField>
      <FormField label="Dificultad">
        <SelectField value={d.dificultad} onChange={v => upd("dificultad", v)} options={[{ value: "Baja", label: "Baja" }, { value: "Moderada", label: "Moderada" }, { value: "Moderada-Alta", label: "Moderada-Alta" }, { value: "Alta", label: "Alta" }]} />
      </FormField>
      <FormField label="Tipo de bono">
        <SelectField value={d.tipo_bono} onChange={v => upd("tipo_bono", v)} options={[{ value: "electrónico", label: "Electrónico" }, { value: "físico", label: "Físico" }]} />
      </FormField>
      <div style={{ gridColumn: "1 / -1" }}>
        <FormField label="Accesibilidad"><Input value={d.accesibilidad} onChange={v => upd("accesibilidad", v)} /></FormField>
      </div>
      <FormField label="Mascotas">
        <div style={{ display: "flex", alignItems: "center", gap: 8, paddingTop: 6 }}>
          <button onClick={() => upd("mascotas_permitidas", !d.mascotas_permitidas)} style={{ width: 38, height: 22, borderRadius: 11, background: d.mascotas_permitidas ? "#006CFE" : "#CBD5E1", border: "none", cursor: "pointer", position: "relative", transition: "background 0.2s" }}>
            <span style={{ position: "absolute", top: 3, left: d.mascotas_permitidas ? 19 : 3, width: 16, height: 16, borderRadius: "50%", background: "#FFFFFF", transition: "left 0.2s" }} />
          </button>
          <span style={{ fontSize: 13, color: "#475569" }}>{d.mascotas_permitidas ? "Permitidas" : "No permitidas"}</span>
        </div>
      </FormField>
      <div style={{ gridColumn: "1 / -1" }}>
        <FormField label="Nota de sostenibilidad"><Textarea value={d.sostenibilidad_nota} onChange={v => upd("sostenibilidad_nota", v)} rows={2} /></FormField>
      </div>
    </div>
  );
}

/* ── Tab: Logística ───────────────────────────────────── */
function TabLogistica({ tour, onChange }: { tour: RealTour; onChange: (k: string, v: unknown) => void }) {
  const l = tour.logistica;
  const upd = (k: string, v: string) => onChange("logistica", { ...l, [k]: v });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 600 }}>
      <div style={{ padding: "12px 14px", background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 8, fontSize: 12, color: "#1D4ED8", display: "flex", gap: 8 }}>
        <MapPin size={14} style={{ flexShrink: 0, marginTop: 1 }} />
        <div>Punto de salida predeterminado del sistema: <strong>{SITE_CONFIG.punto_salida_default.nombre}</strong> — {SITE_CONFIG.punto_salida_default.direccion}</div>
      </div>
      <FormField label="Punto de salida (este tour)" required>
        <Textarea value={l.punto_salida} onChange={v => upd("punto_salida", v)} rows={2} placeholder={SITE_CONFIG.punto_salida_default.direccion} />
      </FormField>
      <FormField label="Hora de salida" required helper="Ej: 2:30 A.M (puntual)">
        <div style={{ display: "flex", alignItems: "center", gap: 8, maxWidth: 220 }}>
          <Clock size={14} color="#94A3B8" style={{ flexShrink: 0 }} />
          <Input value={l.hora_salida} onChange={v => upd("hora_salida", v)} placeholder="5:30 A.M (puntual)" />
        </div>
      </FormField>
      <FormField label="Link de Google Maps">
        <Input value={l.maps} onChange={v => upd("maps", v)} placeholder="https://maps.google.com/..." />
      </FormField>
      {tour.grupo_whatsapp_url !== undefined && (
        <FormField label="Link de grupo WhatsApp (opcional)">
          <Input value={tour.grupo_whatsapp_url || ""} onChange={v => onChange("grupo_whatsapp_url", v || null)} placeholder="https://chat.whatsapp.com/..." />
        </FormField>
      )}
      <FormField label="Operador asignado">
        <div style={{ padding: "10px 12px", border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 13, color: "#0F172A", background: "#F7F8FA" }}>
          {tour.operador_nombre}
        </div>
      </FormField>
    </div>
  );
}

/* ── Tab: Galería ─────────────────────────────────────── */
function TabGaleria({ tour }: { tour: RealTour }) {
  const assets = MEDIA_ASSETS.filter(a => tour.galeria_ids.includes(a.id));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 8 }}>
        <Btn variant="secondary" size="sm"><Image size={13} /> Agregar de biblioteca</Btn>
        <Btn variant="primary" size="sm"><Upload size={13} /> Subir nueva</Btn>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {assets.map((a, i) => (
          <div key={a.id} style={{ position: "relative", borderRadius: 8, overflow: "hidden", border: i === 0 ? "2px solid #006CFE" : "1px solid #E5E7EB", aspectRatio: "16/9", background: a.color }}>
            {a.url ? (
              <img src={a.url} alt={a.altES} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <span style={{ fontSize: 32 }}>{a.emoji}</span>
                <span style={{ fontSize: 10, color: "#475569", textAlign: "center", padding: "0 8px" }}>{a.altES}</span>
              </div>
            )}
            {i === 0 && (
              <div style={{ position: "absolute", top: 6, left: 6, background: "#006CFE", color: "#FFFFFF", fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4 }}>PRINCIPAL</div>
            )}
            <button style={{ position: "absolute", top: 6, right: 6, width: 22, height: 22, borderRadius: 4, border: "none", background: "rgba(255,255,255,.9)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Trash2 size={11} color="#F13540" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Tab: SEO ─────────────────────────────────────────── */
function TabSEO({ tour, onChange }: { tour: RealTour; onChange: (k: string, v: unknown) => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <FormField label="Meta título" helper="50–60 caracteres recomendado">
        <BilingualField valueES={`${tour.titulo_es} | Random Trips República Dominicana`} valueEN={`${tour.titulo_en} | Random Trips Dominican Republic`} placeholder="Título SEO..." />
      </FormField>
      <FormField label="Meta descripción" helper="150–160 caracteres">
        <BilingualField valueES={tour.descripcion_es} valueEN={tour.descripcion_en} multiline rows={3} placeholder="Descripción para buscadores..." />
      </FormField>
      <FormField label="Slug visible">
        <div style={{ display: "flex", border: "1px solid #E5E7EB", borderRadius: 6, overflow: "hidden" }}>
          <span style={{ padding: "8px 12px", background: "#F7F8FA", fontSize: 12, color: "#94A3B8", borderRight: "1px solid #E5E7EB", whiteSpace: "nowrap" }}>randomtrips.co/tours/</span>
          <input value={tour.slug} onChange={e => onChange("slug", e.target.value)} style={{ flex: 1, padding: "8px 12px", border: "none", outline: "none", fontSize: 13 }} />
        </div>
      </FormField>
      <div style={{ background: "#F7F8FA", borderRadius: 8, padding: "14px 16px" }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Vista previa en Google</div>
        <div style={{ fontSize: 12, color: "#94A3B8" }}>randomtrips.co › tours › {tour.slug}</div>
        <div style={{ fontSize: 16, color: "#1a0dab" }}>{tour.titulo_es} | Random Trips</div>
        <div style={{ fontSize: 13, color: "#545454", lineHeight: 1.5 }}>{tour.descripcion_es}</div>
      </div>
    </div>
  );
}

/* ── Main TourEditor ──────────────────────────────────── */
export function TourEditor({ onBack, tourId }: { onBack: () => void; tourId?: string }) {
  const initial = TOURS_DATA.find(t => t.id === tourId) ?? TOURS_DATA[0];
  const [tour, setTour] = useState(initial);
  const [activeTab, setActiveTab] = useState("info");
  const [editingTitle, setEditingTitle] = useState(false);
  const [savedAgo, setSavedAgo] = useState<string | null>("Guardado hace 2 min");

  const onChange = (k: string, v: unknown) => {
    setTour(prev => ({ ...prev, [k]: v }));
    setSavedAgo(null);
    setTimeout(() => setSavedAgo("Cambios guardados"), 1200);
  };

  const statusConf: Record<string, { variant: "success" | "neutral" | "warning"; label: string }> = {
    publicado: { variant: "success", label: "Publicado" },
    borrador:  { variant: "neutral", label: "Borrador"  },
    archivado: { variant: "warning", label: "Archivado" },
  };
  const st = statusConf[tour.estado] ?? statusConf.borrador;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "calc(100vh - 56px)", fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#94A3B8", marginBottom: 8 }}>
          <button onClick={onBack} style={{ border: "none", background: "transparent", cursor: "pointer", color: "#94A3B8", display: "flex", alignItems: "center", gap: 4, fontSize: 12 }}>
            <ArrowLeft size={12} /> Catálogo
          </button>
          <span>/</span><span>Tours</span><span>/</span>
          <span style={{ color: "#0F172A" }}>{tour.titulo_es}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          {editingTitle ? (
            <input autoFocus value={tour.titulo_es} onChange={e => onChange("titulo_es", e.target.value)} onBlur={() => setEditingTitle(false)} onKeyDown={e => e.key === "Enter" && setEditingTitle(false)}
              style={{ fontSize: 20, fontWeight: 700, color: "#0F172A", border: "none", borderBottom: "2px solid #006CFE", outline: "none", background: "transparent", flex: 1, minWidth: 200 }}
            />
          ) : (
            <h1 onClick={() => setEditingTitle(true)} style={{ fontSize: 20, fontWeight: 700, color: "#0F172A", margin: 0, cursor: "text", flex: 1 }} title="Clic para editar">{tour.titulo_es}</h1>
          )}
          <StatusBadge variant={st.variant} label={st.label} />
          <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
            <Btn variant="ghost" size="sm"><Eye size={13} /> Vista previa</Btn>
            <Btn variant="ghost" size="sm"><Copy size={13} /> Duplicar</Btn>
            <Btn variant="secondary" size="sm"><Save size={13} /> Guardar borrador</Btn>
            <Btn variant="primary" size="sm"><Globe size={13} /> Publicar</Btn>
          </div>
        </div>
      </div>

      {/* Tab navigation */}
      <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #E5E7EB", marginBottom: 24, overflowX: "auto" }}>
        {tabs.map((t, i) => {
          const isActive = activeTab === t.id;
          return (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ padding: "8px 16px", border: "none", borderBottom: `2px solid ${isActive ? "#006CFE" : "transparent"}`, background: "transparent", fontSize: 13, fontWeight: isActive ? 600 : 400, color: isActive ? "#006CFE" : "#475569", cursor: "pointer", whiteSpace: "nowrap" }}>
              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 18, height: 18, borderRadius: "50%", background: isActive ? "#006CFE" : "#E5E7EB", color: isActive ? "#FFFFFF" : "#94A3B8", fontSize: 10, fontWeight: 700, marginRight: 6 }}>{i + 1}</span>
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, paddingBottom: 80 }}>
        {activeTab === "info"         && <TabInfo tour={tour} onChange={onChange} />}
        {activeTab === "pricing"      && <TabPricing tour={tour} onChange={onChange} />}
        {activeTab === "experiencias" && <TabExperiencias tour={tour} onChange={onChange} />}
        {activeTab === "destinos"     && <TabDestinos tour={tour} onChange={onChange} />}
        {activeTab === "servicios"    && <TabServicios tour={tour} onChange={onChange} />}
        {activeTab === "detalles"     && <TabDetalles tour={tour} onChange={onChange} />}
        {activeTab === "logistica"    && <TabLogistica tour={tour} onChange={onChange} />}
        {activeTab === "galeria"      && <TabGaleria tour={tour} />}
        {activeTab === "seo"          && <TabSEO tour={tour} onChange={onChange} />}
      </div>

      {/* Fixed footer */}
      <div style={{ position: "fixed", bottom: 0, left: 240, right: 0, background: "#FFFFFF", borderTop: "1px solid #E5E7EB", padding: "12px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 50, boxShadow: "0 -4px 12px rgba(0,0,0,.04)" }}>
        <Btn variant="ghost" onClick={onBack}>Descartar cambios</Btn>
        {savedAgo && <span style={{ fontSize: 12, color: "#94A3B8", display: "flex", alignItems: "center", gap: 5 }}><Check size={12} color="#16A34A" /> {savedAgo}</span>}
        <div style={{ display: "flex", gap: 8 }}>
          <Btn variant="secondary"><Save size={13} /> Guardar borrador</Btn>
          <Btn variant="primary"><Globe size={13} /> Publicar</Btn>
        </div>
      </div>
    </div>
  );
}
