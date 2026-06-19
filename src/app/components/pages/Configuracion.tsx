import { useState } from "react";
import { RefreshCw, Save, ChevronDown, ChevronRight, Plus, Trash2, Eye, GripVertical } from "lucide-react";
import { FormField, Input, Textarea, BilingualField } from "../ui/FormField";
import { Btn } from "../ui/Modal";
import { StatusBadge } from "../ui/StatusBadge";
import { SITE_CONFIG, SERVICE_CATALOG } from "../../data/realData";

type ConfigTab = "monedas" | "contacto" | "servicios" | "categorias" | "emails";

const TABS: { id: ConfigTab; label: string; icon: string }[] = [
  { id: "monedas",    label: "Tasas de cambio",      icon: "💱" },
  { id: "contacto",   label: "Contacto y redes",     icon: "📞" },
  { id: "servicios",  label: "Catálogo de servicios", icon: "🗂️" },
  { id: "categorias", label: "Categorías",            icon: "🏷️" },
  { id: "emails",     label: "Plantillas de email",   icon: "📧" },
];

/* ── Tasas de cambio ──────────────────────────────────── */
// Real exchange rates from SiteConfig (USD/EUR stored as DOP multiplier inverse)
const usdDOP = (1 / SITE_CONFIG.exchangeRates.USD).toFixed(2); // ≈ 59.88
const eurDOP = (1 / SITE_CONFIG.exchangeRates.EUR).toFixed(2); // ≈ 64.52

const rateHistory = [
  { fecha: "16 Jun 2026 09:00", usd: usdDOP, eur: eurDOP, actor: "Alejandra Torres" },
  { fecha: "9 Jun 2026 10:15",  usd: "59.20", eur: "64.30", actor: "Carlos Reyes"   },
  { fecha: "2 Jun 2026 08:30",  usd: "58.90", eur: "63.90", actor: "Alejandra Torres" },
];

function TasasCambio() {
  const [usd, setUsd] = useState(usdDOP);
  const [eur, setEur] = useState(eurDOP);
  const [histOpen, setHistOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 3000); };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 560 }}>
      <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, padding: "20px" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>Moneda base</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "#F7F8FA", borderRadius: 6, border: "1px solid #E5E7EB" }}>
          <span style={{ fontSize: 20 }}>🇩🇴</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>DOP — Peso Dominicano</div>
            <div style={{ fontSize: 11, color: "#94A3B8" }}>Moneda base no editable</div>
          </div>
          <StatusBadge variant="success" label="Base" />
        </div>
      </div>

      <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, padding: "20px" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 16 }}>Tasas actuales</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { flag: "🇺🇸", code: "USD", name: "Dólar Estadounidense", value: usd, set: setUsd },
            { flag: "🇪🇺", code: "EUR", name: "Euro",                  value: eur, set: setEur },
          ].map(r => (
            <div key={r.code} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, width: 160 }}>
                <span style={{ fontSize: 18 }}>{r.flag}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>1 {r.code}</div>
                  <div style={{ fontSize: 11, color: "#94A3B8" }}>{r.name}</div>
                </div>
              </div>
              <span style={{ fontSize: 13, color: "#94A3B8" }}>=</span>
              <div style={{ display: "flex", alignItems: "center", gap: 6, border: "1px solid #E5E7EB", borderRadius: 6, overflow: "hidden" }}>
                <input value={r.value} onChange={e => r.set(e.target.value)} type="number" step="0.01"
                  style={{ width: 90, padding: "8px 12px", border: "none", outline: "none", fontSize: 14, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}
                />
                <span style={{ padding: "8px 12px", background: "#F7F8FA", borderLeft: "1px solid #E5E7EB", fontSize: 13, color: "#475569", fontWeight: 600 }}>DOP</span>
              </div>
              <div style={{ fontSize: 12, color: "#94A3B8" }}>USD {r.code === "USD" ? "" : `(1 ${r.code} = ${(Number(r.value) / Number(usd)).toFixed(4)} USD)`}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20 }}>
          {saved ? (
            <span style={{ fontSize: 12, color: "#16A34A", display: "flex", alignItems: "center", gap: 4 }}>✓ Tasas actualizadas</span>
          ) : (
            <span style={{ fontSize: 11, color: "#94A3B8" }}>Última actualización: {rateHistory[0].fecha} por {rateHistory[0].actor}</span>
          )}
          <button onClick={handleSave} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 6, border: "none", background: "#006CFE", fontSize: 13, color: "#FFFFFF", cursor: "pointer", fontWeight: 500 }}>
            <Save size={13} /> Guardar tasas
          </button>
        </div>
      </div>

      {/* Histórico */}
      <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, overflow: "hidden" }}>
        <button onClick={() => setHistOpen(!histOpen)} style={{ width: "100%", padding: "14px 16px", border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>Histórico de tasas</span>
          {histOpen ? <ChevronDown size={14} color="#94A3B8" /> : <ChevronRight size={14} color="#94A3B8" />}
        </button>
        {histOpen && (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#F7F8FA", borderTop: "1px solid #E5E7EB" }}>
                {["Fecha", "USD → DOP", "EUR → DOP", "Actualizado por"].map(h => (
                  <th key={h} style={{ padding: "8px 14px", textAlign: "left", fontSize: 10, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rateHistory.map((r, i) => (
                <tr key={i} style={{ borderTop: "1px solid #F1F5F9" }}>
                  <td style={{ padding: "10px 14px", fontSize: 12, color: "#94A3B8" }}>{r.fecha}</td>
                  <td style={{ padding: "10px 14px", fontSize: 13, fontWeight: 600 }}>{r.usd}</td>
                  <td style={{ padding: "10px 14px", fontSize: 13, fontWeight: 600 }}>{r.eur}</td>
                  <td style={{ padding: "10px 14px", fontSize: 12, color: "#475569" }}>{r.actor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* ── Contacto y redes ─────────────────────────────────── */
function ContactoRedes() {
  const [data, setData] = useState({
    direccion: SITE_CONFIG.defaultDeparturePoint.address,
    telefono: SITE_CONFIG.contact.whatsapp,
    whatsapp: SITE_CONFIG.contact.whatsapp,
    email: SITE_CONFIG.contact.email,
    instagram: (SITE_CONFIG.social.instagram ?? "").replace("@", ""),
    facebook: "randomtripsrd",
    tiktok: "randomtripsdo",
    youtube: "randomtrips",
  });

  return (
    <div style={{ maxWidth: 600, display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, padding: "20px" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 16 }}>Información de contacto</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <FormField label="Dirección física"><Textarea value={data.direccion} onChange={v => setData(p => ({...p, direccion: v}))} rows={2} /></FormField>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <FormField label="Teléfono principal"><Input value={data.telefono} onChange={v => setData(p => ({...p, telefono: v}))} /></FormField>
            <FormField label="WhatsApp Business"><Input value={data.whatsapp} onChange={v => setData(p => ({...p, whatsapp: v}))} /></FormField>
          </div>
          <FormField label="Email de contacto"><Input value={data.email} onChange={v => setData(p => ({...p, email: v}))} type="email" /></FormField>
        </div>
      </div>
      <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, padding: "20px" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 16 }}>Redes sociales</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            { icon: "📸", label: "Instagram", key: "instagram", prefix: "@" },
            { icon: "👤", label: "Facebook",  key: "facebook",  prefix: "fb.com/" },
            { icon: "🎵", label: "TikTok",    key: "tiktok",    prefix: "@" },
            { icon: "▶️", label: "YouTube",   key: "youtube",   prefix: "youtube.com/@" },
          ].map(f => (
            <FormField key={f.key} label={`${f.icon} ${f.label}`}>
              <div style={{ display: "flex", border: "1px solid #E5E7EB", borderRadius: 6, overflow: "hidden" }}>
                <span style={{ padding: "8px 10px", background: "#F7F8FA", borderRight: "1px solid #E5E7EB", fontSize: 11, color: "#94A3B8", whiteSpace: "nowrap" }}>{f.prefix}</span>
                <input value={(data as Record<string, string>)[f.key]} onChange={e => setData(p => ({...p, [f.key]: e.target.value}))}
                  style={{ flex: 1, padding: "8px 10px", border: "none", outline: "none", fontSize: 13 }} />
              </div>
            </FormField>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 6, border: "none", background: "#006CFE", fontSize: 13, color: "#FFFFFF", cursor: "pointer", fontWeight: 500 }}>
          <Save size={13} /> Guardar contacto
        </button>
      </div>
    </div>
  );
}

/* ── Servicios catalog ────────────────────────────────── */
const SERVICIOS_INIT = SERVICE_CATALOG.map(s => ({
  id: s.id, cat: s.category, icon: s.icon,
  nombreES: s.name.es, nombreEN: s.name.en,
  orden: s.order, activo: true,
}));

function CatalogoServicios() {
  const [items, setItems] = useState(SERVICIOS_INIT);
  const toggle = (id: string) => setItems(prev => prev.map(s => s.id === id ? {...s, activo: !s.activo} : s));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: 13, color: "#94A3B8" }}>{items.length} servicios en el catálogo</span>
        <Btn variant="primary" size="sm"><Plus size={13} /> Nuevo servicio</Btn>
      </div>
      <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F7F8FA", borderBottom: "1px solid #E5E7EB" }}>
              {["", "Icono", "Nombre ES", "Nombre EN", "Categoría", "Orden", "Estado", ""].map((h, hi) => (
                <th key={`svc-th-${hi}`} style={{ padding: "8px 14px", textAlign: "left", fontSize: 10, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((s, i) => (
              <tr key={s.id} style={{ borderBottom: i < items.length - 1 ? "1px solid #F1F5F9" : "none" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#F7F8FA")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <td style={{ padding: "10px 14px", width: 24 }}><GripVertical size={13} color="#CBD5E1" style={{ cursor: "grab" }} /></td>
                <td style={{ padding: "10px 14px", fontSize: 20 }}>{s.icon}</td>
                <td style={{ padding: "10px 14px", fontSize: 13, color: "#0F172A" }}>{s.nombreES}</td>
                <td style={{ padding: "10px 14px", fontSize: 12, color: "#94A3B8" }}>{s.nombreEN}</td>
                <td style={{ padding: "10px 14px" }}>
                  <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20, background: "#F1F5F9", color: "#475569" }}>{s.cat}</span>
                </td>
                <td style={{ padding: "10px 14px", textAlign: "center", fontSize: 13, fontWeight: 600, color: "#475569" }}>{s.orden}</td>
                <td style={{ padding: "10px 14px" }}>
                  <button onClick={() => toggle(s.id)} style={{ width: 38, height: 22, borderRadius: 11, background: s.activo ? "#16A34A" : "#CBD5E1", border: "none", cursor: "pointer", position: "relative", transition: "background 0.2s" }}>
                    <span style={{ position: "absolute", top: 3, left: s.activo ? 19 : 3, width: 16, height: 16, borderRadius: "50%", background: "#FFFFFF", transition: "left 0.2s" }} />
                  </button>
                </td>
                <td style={{ padding: "10px 14px" }}>
                  <button style={{ width: 27, height: 27, borderRadius: 6, border: "1px solid #E5E7EB", background: "#FFFFFF", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Trash2 size={11} color="#F13540" />
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

/* ── Categorías ───────────────────────────────────────── */
function Categorias() {
  const [tiposTour, setTiposTour]   = useState(["Fijo", "Customizable", "Privado por solicitud"]);
  const [tiposExp,  setTiposExp]    = useState(["Acuática", "Naturaleza", "Fauna marina", "Cultural", "Ecoturismo", "Aventura", "Playa", "Gastronómica"]);
  const [idiomas,   setIdiomas]     = useState(["ES", "EN", "FR", "DE", "PT", "IT", "RU"]);
  const [newTour, setNewTour]       = useState("");
  const [newExp,  setNewExp]        = useState("");
  const [newIdi,  setNewIdi]        = useState("");

  const ListEditor = ({ title, items, setItems, newVal, setNewVal }: { title: string; items: string[]; setItems: (v: string[]) => void; newVal: string; setNewVal: (v: string) => void }) => (
    <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, padding: "16px" }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 12 }}>{title}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
        {items.map(item => (
          <span key={item} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 20, background: "#F1F5F9", border: "1px solid #E5E7EB", fontSize: 12, color: "#0F172A" }}>
            {item}
            <button onClick={() => setItems(items.filter(i => i !== item))} style={{ border: "none", background: "transparent", cursor: "pointer", padding: 0 }}>
              <Trash2 size={10} color="#F13540" />
            </button>
          </span>
        ))}
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        <input value={newVal} onChange={e => setNewVal(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && newVal) { setItems([...items, newVal]); setNewVal(""); }}}
          placeholder="Nueva categoría..." style={{ flex: 1, padding: "6px 10px", border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 12, outline: "none" }} />
        <button onClick={() => { if (newVal) { setItems([...items, newVal]); setNewVal(""); }}}
          style={{ padding: "6px 12px", borderRadius: 6, border: "none", background: "#006CFE", color: "#FFFFFF", fontSize: 12, cursor: "pointer" }}>
          <Plus size={13} />
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 600 }}>
      <ListEditor title="Tipos de tour" items={tiposTour} setItems={setTiposTour} newVal={newTour} setNewVal={setNewTour} />
      <ListEditor title="Tipos de experiencia" items={tiposExp} setItems={setTiposExp} newVal={newExp} setNewVal={setNewExp} />
      <ListEditor title="Idiomas soportados" items={idiomas} setItems={setIdiomas} newVal={newIdi} setNewVal={setNewIdi} />
    </div>
  );
}

/* ── Email templates ──────────────────────────────────── */
const EMAIL_TEMPLATES = [
  { id: "E1", name: "Confirmación de reserva",     variables: ["{{cliente_nombre}}", "{{tour_nombre}}", "{{fecha_tour}}", "{{id_reserva}}", "{{link_voucher}}"] },
  { id: "E2", name: "Recordatorio de saldo (48h)", variables: ["{{cliente_nombre}}", "{{tour_nombre}}", "{{fecha_tour}}", "{{saldo}}", "{{link_pago}}"] },
  { id: "E3", name: "Recordatorio de saldo (7d)",  variables: ["{{cliente_nombre}}", "{{saldo}}", "{{link_pago}}"] },
  { id: "E4", name: "Cotización enviada",           variables: ["{{cliente_nombre}}", "{{tour_propuesto}}", "{{precio}}", "{{validez_dias}}", "{{link_aceptar}}"] },
  { id: "E5", name: "Recordatorio del tour (24h)", variables: ["{{cliente_nombre}}", "{{tour_nombre}}", "{{punto_encuentro}}", "{{hora_salida}}"] },
  { id: "E6", name: "Post-tour (reseña)",           variables: ["{{cliente_nombre}}", "{{tour_nombre}}", "{{link_resena}}"] },
];

function EmailTemplates() {
  const [activeTemplate, setActiveTemplate] = useState(EMAIL_TEMPLATES[0]);
  const [lang, setLang] = useState<"es" | "en">("es");
  const [bodyES, setBodyES] = useState(`Hola {{cliente_nombre}},\n\nTu reserva para el tour <strong>{{tour_nombre}}</strong> ha sido confirmada para el {{fecha_tour}}.\n\nID de reserva: {{id_reserva}}\n\nDescarga tu voucher aquí: {{link_voucher}}\n\n¡Te esperamos!\nEquipo Random Trips`);
  const [bodyEN, setBodyEN] = useState(`Hi {{cliente_nombre}},\n\nYour booking for the <strong>{{tour_nombre}}</strong> tour has been confirmed for {{fecha_tour}}.\n\nBooking ID: {{id_reserva}}\n\nDownload your voucher here: {{link_voucher}}\n\nSee you soon!\nRandom Trips Team`);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 16 }}>
      {/* Template list */}
      <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, overflow: "hidden" }}>
        {EMAIL_TEMPLATES.map((t, i) => (
          <button key={t.id} onClick={() => setActiveTemplate(t)} style={{
            display: "block", width: "100%", textAlign: "left", padding: "12px 14px",
            border: "none", borderBottom: i < EMAIL_TEMPLATES.length - 1 ? "1px solid #F1F5F9" : "none",
            background: activeTemplate.id === t.id ? "#EFF6FF" : "transparent",
            cursor: "pointer", fontSize: 13,
            fontWeight: activeTemplate.id === t.id ? 600 : 400,
            color: activeTemplate.id === t.id ? "#006CFE" : "#475569",
          }}>
            {t.name}
          </button>
        ))}
      </div>

      {/* Editor */}
      <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, padding: "20px", display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>{activeTemplate.name}</span>
          <div style={{ display: "flex", gap: 6 }}>
            {(["es", "en"] as const).map(l => (
              <button key={l} onClick={() => setLang(l)} style={{ padding: "5px 12px", borderRadius: 6, border: `1px solid ${lang === l ? "#006CFE" : "#E5E7EB"}`, background: lang === l ? "#EFF6FF" : "#FFFFFF", color: lang === l ? "#006CFE" : "#475569", fontSize: 12, cursor: "pointer", fontWeight: lang === l ? 600 : 400 }}>
                {l === "es" ? "🇩🇴 ES" : "🇺🇸 EN"}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Variables disponibles</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {activeTemplate.variables.map(v => (
              <span key={v} style={{ fontSize: 11, padding: "2px 7px", borderRadius: 4, background: "#F5F3FF", border: "1px solid #DDD6FE", color: "#7C3AED", fontFamily: "monospace" }}>{v}</span>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#0F172A", marginBottom: 6 }}>Cuerpo del email ({lang === "es" ? "Español" : "English"})</div>
          <textarea value={lang === "es" ? bodyES : bodyEN} onChange={e => lang === "es" ? setBodyES(e.target.value) : setBodyEN(e.target.value)}
            rows={10}
            style={{ width: "100%", padding: "10px 12px", border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 13, outline: "none", resize: "vertical", fontFamily: "monospace", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 12px", borderRadius: 6, border: "1px solid #E5E7EB", background: "#FFFFFF", fontSize: 13, color: "#475569", cursor: "pointer" }}>
            <Eye size={13} /> Vista previa
          </button>
          <button style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 6, border: "none", background: "#006CFE", fontSize: 13, color: "#FFFFFF", cursor: "pointer", fontWeight: 500 }}>
            <Save size={13} /> Guardar plantilla
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main ─────────────────────────────────────────────── */
export function Configuracion() {
  const [tab, setTab] = useState<ConfigTab>("monedas");

  return (
    <div style={{ display: "flex", gap: 24, fontFamily: "Inter, sans-serif" }}>
      {/* Sidebar tabs */}
      <div style={{ width: 220, flexShrink: 0 }}>
        <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, overflow: "hidden" }}>
          {TABS.map((t, i) => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              display: "flex", alignItems: "center", gap: 8, width: "100%",
              padding: "12px 14px", border: "none",
              borderBottom: i < TABS.length - 1 ? "1px solid #F1F5F9" : "none",
              background: tab === t.id ? "#EFF6FF" : "transparent",
              cursor: "pointer", fontSize: 13,
              fontWeight: tab === t.id ? 600 : 400,
              color: tab === t.id ? "#006CFE" : "#475569",
              textAlign: "left",
            }}>
              <span style={{ fontSize: 16 }}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1 }}>
        {tab === "monedas"    && <TasasCambio />}
        {tab === "contacto"   && <ContactoRedes />}
        {tab === "servicios"  && <CatalogoServicios />}
        {tab === "categorias" && <Categorias />}
        {tab === "emails"     && <EmailTemplates />}
      </div>
    </div>
  );
}
