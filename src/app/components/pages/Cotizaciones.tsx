import { useState } from "react";
import {
  ArrowLeft, Send, Clock, Mail, User, MapPin,
  Calendar, Users, DollarSign, MessageSquare, Check, X,
} from "lucide-react";
import { StatusBadge } from "../ui/StatusBadge";
import { FilterBar } from "../ui/FilterBar";
import { FormField, Input, Textarea, SelectField } from "../ui/FormField";
import { Btn } from "../ui/Modal";

/* ── Types & mock data ──────────────────────────────────── */
interface Cotizacion {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  pais: string;
  idioma: string;
  destinos: string[];
  fechaInicio: string;
  fechaFin: string;
  pax: number;
  presupuesto: string;
  mensaje: string;
  status: "pending" | "sent" | "accepted" | "rejected";
  asignado: string;
  fechaSolicitud: string;
  horasPendiente: number | null;
  comunicaciones: { fecha: string; tipo: string; texto: string }[];
}

const STAFF = ["Alejandra Torres", "Carlos Reyes", "María Pérez"];

const mockCots: Cotizacion[] = [
  {
    id: "COT-448", nombre: "Thomas Berg", email: "thomas@email.de", telefono: "+49 170 1234567",
    pais: "🇩🇪 Alemania", idioma: "DE", destinos: ["Samaná", "La Romana"],
    fechaInicio: "5 Jul 2026", fechaFin: "12 Jul 2026", pax: 8, presupuesto: "$3,000–5,000",
    mensaje: "Buscamos un tour privado para grupo familiar. Preferimos actividades en la naturaleza, sin multitudes. Somos 8 personas, 3 niños.",
    status: "pending", asignado: "Alejandra Torres", fechaSolicitud: "14 Jun 2026",
    horasPendiente: 52, comunicaciones: [],
  },
  {
    id: "COT-447", nombre: "Lucia Moreno", email: "lucia@email.es", telefono: "+34 611 987 654",
    pais: "🇪🇸 España", idioma: "ES", destinos: ["Samaná"],
    fechaInicio: "30 Jun 2026", fechaFin: "3 Jul 2026", pax: 4, presupuesto: "$1,500–2,500",
    mensaje: "Nos interesa hacer el whale watching y las cascadas El Limón. ¿Pueden combinarlos en un paquete?",
    status: "sent", asignado: "Carlos Reyes", fechaSolicitud: "15 Jun 2026",
    horasPendiente: null, comunicaciones: [
      { fecha: "15 Jun 2026 14:30", tipo: "email", texto: "Cotización COT-447 enviada con propuesta de 2 días en Samaná." },
    ],
  },
  {
    id: "COT-446", nombre: "David Kim", email: "david@email.kr", telefono: "+82 10 1234 5678",
    pais: "🇰🇷 Corea", idioma: "EN", destinos: ["Los Haitises"],
    fechaInicio: "5 Jul 2026", fechaFin: "5 Jul 2026", pax: 2, presupuesto: "$500–800",
    mensaje: "We are looking for a private eco-tour to Los Haitises with an English-speaking guide.",
    status: "pending", asignado: "Alejandra Torres", fechaSolicitud: "13 Jun 2026",
    horasPendiente: 70, comunicaciones: [],
  },
  {
    id: "COT-445", nombre: "Rachel Green", email: "rachel@email.com", telefono: "+1 917 555 0180",
    pais: "🇺🇸 USA", idioma: "EN", destinos: ["La Romana", "Samaná"],
    fechaInicio: "28 Jun 2026", fechaFin: "5 Jul 2026", pax: 6, presupuesto: "$4,000+",
    mensaje: "Honeymoon + family reunion combo trip. Looking for luxury options.",
    status: "accepted", asignado: "Alejandra Torres", fechaSolicitud: "12 Jun 2026",
    horasPendiente: null, comunicaciones: [
      { fecha: "13 Jun 2026 10:00", tipo: "email", texto: "Cotización enviada con paquete premium 7 días." },
      { fecha: "14 Jun 2026 16:45", tipo: "email", texto: "Cliente aceptó y realizó depósito del 25%." },
    ],
  },
  {
    id: "COT-444", nombre: "Pierre Moreau", email: "pierre@email.fr", telefono: "+33 6 11 22 33 44",
    pais: "🇫🇷 Francia", idioma: "FR", destinos: ["Santo Domingo"],
    fechaInicio: "20 Jun 2026", fechaFin: "20 Jun 2026", pax: 3, presupuesto: "< $500",
    mensaje: "Tour cultural de Santo Domingo. Guía en francés si es posible.",
    status: "rejected", asignado: "Carlos Reyes", fechaSolicitud: "11 Jun 2026",
    horasPendiente: null, comunicaciones: [
      { fecha: "12 Jun 2026 09:00", tipo: "email", texto: "Cotización enviada. Sin guía en francés disponible." },
      { fecha: "13 Jun 2026 11:15", tipo: "email", texto: "Cliente rechazó por falta de guía en francés." },
    ],
  },
  {
    id: "COT-443", nombre: "Isabella Costa", email: "isabella@email.br", telefono: "+55 11 91234 5678",
    pais: "🇧🇷 Brasil", idioma: "PT", destinos: ["Puerto Plata"],
    fechaInicio: "15 Jul 2026", fechaFin: "17 Jul 2026", pax: 5, presupuesto: "$2,000–3,000",
    mensaje: "Grupo de amigas. Queremos aventura y playa. Presupuesto flexible.",
    status: "pending", asignado: "María Pérez", fechaSolicitud: "16 Jun 2026",
    horasPendiente: 8, comunicaciones: [],
  },
];

const STATUS_CONF = {
  pending:  { variant: "warning" as const, label: "Pendiente",  tab: "Pendientes" },
  sent:     { variant: "info"    as const, label: "Enviada",    tab: "Enviadas"   },
  accepted: { variant: "success" as const, label: "Aceptada",   tab: "Aceptadas"  },
  rejected: { variant: "danger"  as const, label: "Rechazada",  tab: "Rechazadas" },
};

const TOURS_CATALOG = [
  "Isla Saona Full Day", "Cascadas El Limón", "Whale Watching Samaná",
  "Los Haitises Ecoturismo", "Santo Domingo City Tour", "Puerto Plata Adventure",
  "Jarabacoa Rafting", "Custom",
];

/* ── Cotización Detalle ─────────────────────────────────── */
function CotizacionDetalle({ cot, onBack }: { cot: Cotizacion; onBack: () => void }) {
  const [tourPropuesto, setTourPropuesto] = useState("");
  const [precio, setPrecio] = useState("");
  const [moneda, setMoneda] = useState("USD");
  const [notas, setNotas] = useState("");
  const [validez, setValidez] = useState("7");
  const [sent, setSent] = useState(false);

  const isPending = cot.status === "pending";

  return (
    <div style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 4, border: "none", background: "transparent", cursor: "pointer", color: "#94A3B8", fontSize: 12, marginBottom: 8 }}>
          <ArrowLeft size={12} /> Cotizaciones
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div>
            <span style={{ fontSize: 22, fontWeight: 800, color: "#0F172A" }}>{cot.id}</span>
            <span style={{ fontSize: 12, color: "#94A3B8", marginLeft: 10 }}>Solicitada el {cot.fechaSolicitud}</span>
          </div>
          <StatusBadge variant={STATUS_CONF[cot.status].variant} label={STATUS_CONF[cot.status].label} />
          {cot.horasPendiente && (
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#F13540", background: "#FEF2F2", padding: "3px 8px", borderRadius: 20 }}>
              <Clock size={11} /> {cot.horasPendiente}h sin respuesta
            </div>
          )}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 20, alignItems: "start" }}>
        {/* LEFT */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Contacto */}
          <section style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB", display: "flex", alignItems: "center", gap: 6 }}>
              <User size={13} color="#94A3B8" />
              <span style={{ fontSize: 12, fontWeight: 700, color: "#0F172A", textTransform: "uppercase", letterSpacing: "0.06em" }}>Datos de contacto</span>
            </div>
            <div style={{ padding: "14px 16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {[
                { label: "Nombre",   value: cot.nombre    },
                { label: "Email",    value: cot.email     },
                { label: "Teléfono", value: cot.telefono  },
                { label: "País",     value: cot.pais      },
                { label: "Idioma",   value: cot.idioma    },
                { label: "Asignado a", value: cot.asignado },
              ].map(f => (
                <div key={f.label}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>{f.label}</div>
                  <div style={{ fontSize: 13, color: "#0F172A" }}>{f.value}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Solicitud */}
          <section style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB", display: "flex", alignItems: "center", gap: 6 }}>
              <MapPin size={13} color="#94A3B8" />
              <span style={{ fontSize: 12, fontWeight: 700, color: "#0F172A", textTransform: "uppercase", letterSpacing: "0.06em" }}>Detalles de la solicitud</span>
            </div>
            <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Destinos</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {cot.destinos.map(d => (
                      <span key={d} style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20, background: "#EFF6FF", color: "#1D4ED8" }}>{d}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Fechas</div>
                  <div style={{ fontSize: 13, color: "#0F172A" }}>{cot.fechaInicio}</div>
                  {cot.fechaFin !== cot.fechaInicio && <div style={{ fontSize: 12, color: "#94A3B8" }}>hasta {cot.fechaFin}</div>}
                </div>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Pax / Presupuesto</div>
                  <div style={{ fontSize: 13, color: "#0F172A" }}>{cot.pax} personas</div>
                  <div style={{ fontSize: 12, color: "#94A3B8" }}>{cot.presupuesto}</div>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Mensaje del cliente</div>
                <div style={{ padding: "12px 14px", background: "#F7F8FA", borderRadius: 6, fontSize: 13, color: "#475569", lineHeight: 1.6, fontStyle: "italic" }}>
                  "{cot.mensaje}"
                </div>
              </div>
            </div>
          </section>

          {/* Comunicaciones previas */}
          {cot.comunicaciones.length > 0 && (
            <section style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, overflow: "hidden" }}>
              <div style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB", display: "flex", alignItems: "center", gap: 6 }}>
                <MessageSquare size={13} color="#94A3B8" />
                <span style={{ fontSize: 12, fontWeight: 700, color: "#0F172A", textTransform: "uppercase", letterSpacing: "0.06em" }}>Comunicaciones previas</span>
              </div>
              <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
                {cot.comunicaciones.map((c, i) => (
                  <div key={i} style={{ display: "flex", gap: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Mail size={12} color="#006CFE" />
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 2 }}>{c.fecha}</div>
                      <div style={{ fontSize: 13, color: "#0F172A" }}>{c.texto}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* RIGHT — Formulario de respuesta */}
        <div style={{ position: "sticky", top: 80 }}>
          <div style={{ background: "#FFFFFF", border: `2px solid ${isPending || cot.status === "sent" ? "#006CFE" : "#E5E7EB"}`, borderRadius: 8, overflow: "hidden" }}>
            <div style={{ padding: "14px 16px", background: isPending ? "#EFF6FF" : "#F7F8FA", borderBottom: "1px solid #E5E7EB" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>
                {cot.status === "accepted" ? "✓ Cotización aceptada" : cot.status === "rejected" ? "✗ Cotización rechazada" : "Formulario de respuesta"}
              </div>
              {isPending && <div style={{ fontSize: 11, color: "#006CFE", marginTop: 2 }}>Pendiente de respuesta</div>}
            </div>
            <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 14 }}>
              {sent ? (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#F0FDF4", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                    <Check size={22} color="#16A34A" />
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>Cotización enviada</div>
                  <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 4 }}>Email enviado a {cot.email}</div>
                </div>
              ) : (
                <>
                  <FormField label="Tour propuesto">
                    <SelectField value={tourPropuesto} onChange={setTourPropuesto}
                      options={TOURS_CATALOG.map(t => ({ value: t, label: t }))}
                      placeholder="Seleccionar tour o Custom..."
                    />
                  </FormField>

                  <FormField label="Precio propuesto" required>
                    <div style={{ display: "flex", gap: 6 }}>
                      <select value={moneda} onChange={e => setMoneda(e.target.value)}
                        style={{ padding: "8px 10px", border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 13, outline: "none", flexShrink: 0 }}>
                        {["USD", "DOP", "EUR"].map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                      <input value={precio} onChange={e => setPrecio(e.target.value)}
                        placeholder="0.00" type="number"
                        style={{ flex: 1, padding: "8px 12px", border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 13, outline: "none" }}
                      />
                    </div>
                  </FormField>

                  <FormField label="Notas para el cliente">
                    <textarea value={notas} onChange={e => setNotas(e.target.value)}
                      placeholder="Descripción de la propuesta, qué incluye, condiciones especiales..."
                      rows={5}
                      style={{ width: "100%", padding: "8px 12px", border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 13, outline: "none", resize: "vertical", fontFamily: "Inter, sans-serif", boxSizing: "border-box" }}
                    />
                  </FormField>

                  <FormField label="Validez de la cotización">
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <input value={validez} onChange={e => setValidez(e.target.value)}
                        type="number" style={{ width: 64, padding: "8px 12px", border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 13, outline: "none", textAlign: "center" }} />
                      <span style={{ fontSize: 13, color: "#475569" }}>días</span>
                    </div>
                  </FormField>

                  <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                    <button
                      onClick={() => setSent(true)}
                      disabled={!precio}
                      style={{
                        width: "100%", padding: "10px", borderRadius: 6, border: "none",
                        background: precio ? "#006CFE" : "#E5E7EB",
                        color: precio ? "#FFFFFF" : "#94A3B8",
                        fontSize: 13, fontWeight: 600, cursor: precio ? "pointer" : "not-allowed",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                      }}
                    >
                      <Send size={14} /> Enviar cotización + link de pago
                    </button>
                    <div style={{ fontSize: 11, color: "#94A3B8", textAlign: "center" }}>
                      Se enviará email a <strong>{cot.email}</strong> con la propuesta y un link de depósito del 25%.
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main list ──────────────────────────────────────────── */
export function Cotizaciones() {
  const [activeTab, setActiveTab] = useState<"pending" | "sent" | "accepted" | "rejected">("pending");
  const [search, setSearch] = useState("");
  const [detalle, setDetalle] = useState<Cotizacion | null>(null);

  if (detalle) return <CotizacionDetalle cot={detalle} onBack={() => setDetalle(null)} />;

  const counts = {
    pending:  mockCots.filter(c => c.status === "pending").length,
    sent:     mockCots.filter(c => c.status === "sent").length,
    accepted: mockCots.filter(c => c.status === "accepted").length,
    rejected: mockCots.filter(c => c.status === "rejected").length,
  };

  const filtered = mockCots.filter(c => {
    const q = search.toLowerCase();
    const mTab    = c.status === activeTab;
    const mSearch = !q || c.nombre.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.id.toLowerCase().includes(q);
    return mTab && mSearch;
  });

  const tabDef: { id: typeof activeTab; label: string }[] = [
    { id: "pending",  label: "Pendientes" },
    { id: "sent",     label: "Enviadas"   },
    { id: "accepted", label: "Aceptadas"  },
    { id: "rejected", label: "Rechazadas" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, fontFamily: "Inter, sans-serif" }}>
      {/* Status tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid #E5E7EB", gap: 0 }}>
        {tabDef.map(t => {
          const count = counts[t.id];
          const isActive = activeTab === t.id;
          return (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              padding: "10px 18px", border: "none",
              borderBottom: `2px solid ${isActive ? "#006CFE" : "transparent"}`,
              background: "transparent", cursor: "pointer",
              fontSize: 13, fontWeight: isActive ? 600 : 400,
              color: isActive ? "#006CFE" : "#475569",
              display: "flex", alignItems: "center", gap: 6,
            }}>
              {t.label}
              {count > 0 && (
                <span style={{
                  minWidth: 18, height: 18, borderRadius: 9, padding: "0 5px",
                  background: t.id === "pending" ? "#F13540" : isActive ? "#006CFE" : "#E5E7EB",
                  color: t.id === "pending" || isActive ? "#FFFFFF" : "#475569",
                  fontSize: 10, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center",
                }}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Search bar */}
      <FilterBar
        filters={[]}
        values={{}}
        onChange={() => {}}
        onClear={() => setSearch("")}
        onSearch={setSearch}
        searchValue={search}
        searchPlaceholder="Buscar por ID, nombre o email..."
      />

      {/* Urgency banner for pending */}
      {activeTab === "pending" && mockCots.filter(c => c.status === "pending" && (c.horasPendiente ?? 0) > 48).length > 0 && (
        <div style={{ padding: "10px 16px", background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: 8, fontSize: 13, color: "#B91C1C", display: "flex", alignItems: "center", gap: 8 }}>
          <Clock size={14} />
          <strong>{mockCots.filter(c => c.status === "pending" && (c.horasPendiente ?? 0) > 48).length} cotizaciones</strong> llevan más de 48h sin respuesta.
        </div>
      )}

      {/* Table */}
      <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
            <thead>
              <tr style={{ background: "#F7F8FA", borderBottom: "1px solid #E5E7EB" }}>
                {["ID", "Contacto", "Destinos solicitados", "Fechas", "Pax", "Estado", "Asignado a", "Solicitud", ""].map(h => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: h === "Pax" ? "center" : "left", fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9} style={{ padding: "48px", textAlign: "center", color: "#94A3B8", fontSize: 13 }}>Sin cotizaciones en esta categoría</td></tr>
              ) : filtered.map((c, i) => (
                <tr key={c.id}
                  onClick={() => setDetalle(c)}
                  style={{ borderBottom: i < filtered.length - 1 ? "1px solid #F1F5F9" : "none", cursor: "pointer" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#F7F8FA")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={{ padding: "12px 14px", fontWeight: 700, color: "#006CFE", fontSize: 12 }}>{c.id}</td>
                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "#0F172A" }}>{c.nombre}</div>
                    <div style={{ fontSize: 11, color: "#94A3B8" }}>{c.email}</div>
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {c.destinos.map(d => (
                        <span key={d} style={{ fontSize: 10, padding: "1px 6px", borderRadius: 20, background: "#F1F5F9", color: "#475569" }}>{d}</span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: "12px 14px", fontSize: 12, color: "#475569", whiteSpace: "nowrap" }}>
                    {c.fechaInicio}{c.fechaFin !== c.fechaInicio ? ` → ${c.fechaFin}` : ""}
                  </td>
                  <td style={{ padding: "12px 14px", textAlign: "center" }}>
                    <span style={{ fontWeight: 700, fontSize: 13 }}>{c.pax}</span>
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                      <StatusBadge variant={STATUS_CONF[c.status].variant} label={STATUS_CONF[c.status].label} />
                      {c.horasPendiente && (
                        <span style={{ fontSize: 10, color: (c.horasPendiente ?? 0) > 48 ? "#F13540" : "#F59E0B", display: "flex", alignItems: "center", gap: 3 }}>
                          <Clock size={9} />{c.horasPendiente}h
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: "12px 14px", fontSize: 12, color: "#475569" }}>{c.asignado.split(" ")[0]}</td>
                  <td style={{ padding: "12px 14px", fontSize: 12, color: "#94A3B8", whiteSpace: "nowrap" }}>{c.fechaSolicitud}</td>
                  <td style={{ padding: "12px 14px" }} onClick={e => e.stopPropagation()}>
                    <button onClick={() => setDetalle(c)}
                      style={{ padding: "4px 10px", borderRadius: 6, border: "none", background: c.status === "pending" ? "#006CFE" : "#F1F5F9", color: c.status === "pending" ? "#FFFFFF" : "#475569", fontSize: 12, cursor: "pointer", fontWeight: 500 }}>
                      {c.status === "pending" ? "Responder" : "Ver"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
