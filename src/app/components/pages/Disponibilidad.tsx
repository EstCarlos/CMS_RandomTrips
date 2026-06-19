import { useState } from "react";
import { ChevronLeft, ChevronRight, X, Lock, Unlock, Users, Calendar, SlidersHorizontal } from "lucide-react";
import { TOURS_DATA, AVAILABILITY, formatDOP } from "../../data/realData";

/* ── Types ────────────────────────────────────────────── */
type SlotStatus = "available" | "almost-full" | "full" | "blocked";

interface DaySlot {
  tourId: string;
  tourName: string;
  color: string;
  paxLibres: number;
  paxTotal: number;
  status: SlotStatus;
  horasSalida: string;
  precio: string;
}

/* ── Derive from real data ────────────────────────────── */
const TOUR_COLORS: Record<string, string> = {
  "tour-pico-diego-salto-jima": "#006CFE",
  "tour-balneario-la-plaza":    "#16A34A",
  "tour-playa-fronton":         "#F59E0B",
};

function makeSlot(av: typeof AVAILABILITY[0]): DaySlot {
  const t = TOURS_DATA.find(x => x.id === av.tour_id)!;
  const pct = av.cupos_reservados / av.cupos_totales;
  const status: SlotStatus = av.estado === "completado" ? "full"
    : av.cupos_libres === 0 ? "full"
    : pct > 0.8 ? "almost-full"
    : "available";
  return {
    tourId: av.tour_id, tourName: t.titulo_es,
    color: TOUR_COLORS[av.tour_id] || "#006CFE",
    paxLibres: av.cupos_libres, paxTotal: av.cupos_totales,
    status, horasSalida: t.logistica.hora_salida,
    precio: t.pricing,
  };
}

// Build SLOTS map from real availability
const SLOTS: Record<string, DaySlot[]> = {};
AVAILABILITY.forEach(av => {
  const key = av.fecha; // "2025-07-19" or "2025-06-21"
  if (!SLOTS[key]) SLOTS[key] = [];
  SLOTS[key].push(makeSlot(av));
});

/* ── Helpers ──────────────────────────────────────────── */
const MONTH_NAMES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const DAY_NAMES   = ["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"];

function dateKey(y: number, m: number, d: number) {
  return `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
}
function daysInMonth(y: number, m: number) { return new Date(y, m+1, 0).getDate(); }
function firstDOW(y: number, m: number) { return (new Date(y, m, 1).getDay() + 6) % 7; }

const statusColors: Record<SlotStatus | "completado", { dot: string; bg: string }> = {
  available:    { dot: "#16A34A", bg: "#F0FDF4" },
  "almost-full":{ dot: "#F59E0B", bg: "#FFFBEB" },
  full:         { dot: "#F13540", bg: "#FEF2F2" },
  blocked:      { dot: "#94A3B8", bg: "#F1F5F9" },
  completado:   { dot: "#7C3AED", bg: "#F5F3FF" },
};

/* ── Day Drawer ───────────────────────────────────────── */
function DayDrawer({ dateStr, slot, onClose }: { dateStr: string; slot: DaySlot | null; onClose: () => void }) {
  const [cupos, setCupos] = useState(slot?.paxLibres ?? 0);
  const [blocked, setBlocked] = useState(slot?.status === "blocked");

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", justifyContent: "flex-end" }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(15,23,42,.3)" }} onClick={onClose} />
      <div style={{ position: "relative", width: 360, background: "#FFFFFF", boxShadow: "-8px 0 32px rgba(0,0,0,.12)", display: "flex", flexDirection: "column", fontFamily: "Inter, sans-serif" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>Editar fecha</div>
            <div style={{ fontSize: 12, color: "#94A3B8" }}>{dateStr}</div>
          </div>
          <button onClick={onClose} style={{ border: "1px solid #E5E7EB", background: "#FFFFFF", borderRadius: 6, width: 28, height: 28, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={14} color="#94A3B8" />
          </button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
          {slot && (
            <div style={{ marginBottom: 16, padding: "10px 14px", background: "#F7F8FA", borderRadius: 6, borderLeft: `3px solid ${slot.color}` }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#0F172A", marginBottom: 2 }}>{slot.tourName}</div>
              <div style={{ fontSize: 11, color: "#94A3B8" }}>Salida: {slot.horasSalida} · {slot.precio}</div>
            </div>
          )}

          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#0F172A", marginBottom: 8 }}>Estado de la fecha</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setBlocked(false)} style={{ flex: 1, padding: "10px", borderRadius: 6, border: `2px solid ${!blocked ? "#16A34A" : "#E5E7EB"}`, background: !blocked ? "#F0FDF4" : "#FFFFFF", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <Unlock size={16} color={!blocked ? "#16A34A" : "#94A3B8"} />
                <span style={{ fontSize: 12, fontWeight: 500, color: !blocked ? "#16A34A" : "#94A3B8" }}>Disponible</span>
              </button>
              <button onClick={() => setBlocked(true)} style={{ flex: 1, padding: "10px", borderRadius: 6, border: `2px solid ${blocked ? "#F13540" : "#E5E7EB"}`, background: blocked ? "#FEF2F2" : "#FFFFFF", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <Lock size={16} color={blocked ? "#F13540" : "#94A3B8"} />
                <span style={{ fontSize: 12, fontWeight: 500, color: blocked ? "#F13540" : "#94A3B8" }}>Bloqueado</span>
              </button>
            </div>
          </div>

          {!blocked && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#0F172A", marginBottom: 8 }}>Cupos disponibles</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <button onClick={() => setCupos(p => Math.max(0, p-1))} style={{ width: 32, height: 32, borderRadius: 6, border: "1px solid #E5E7EB", background: "#FFFFFF", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                <span style={{ fontSize: 22, fontWeight: 700, color: "#006CFE", width: 40, textAlign: "center" }}>{cupos}</span>
                <button onClick={() => setCupos(p => p+1)} style={{ width: 32, height: 32, borderRadius: 6, border: "1px solid #E5E7EB", background: "#FFFFFF", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                <span style={{ fontSize: 12, color: "#94A3B8" }}>de {slot?.paxTotal ?? 40}</span>
              </div>
              <div style={{ height: 6, borderRadius: 3, background: "#F1F5F9", marginTop: 8, overflow: "hidden" }}>
                <div style={{ height: "100%", borderRadius: 3, background: "#006CFE", width: `${((slot?.paxTotal ?? 40) - cupos) / (slot?.paxTotal ?? 40) * 100}%`, transition: "width 0.2s" }} />
              </div>
            </div>
          )}

          {!blocked && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#0F172A", marginBottom: 8 }}>Precio override (opcional)</div>
              <div style={{ display: "flex", border: "1px solid #E5E7EB", borderRadius: 6, overflow: "hidden" }}>
                <span style={{ padding: "8px 10px", background: "#F7F8FA", fontSize: 12, color: "#94A3B8", borderRight: "1px solid #E5E7EB" }}>RD$</span>
                <input placeholder={`${slot?.precio ?? "Precio estándar"} (dejar vacío = precio del tour)`} style={{ flex: 1, padding: "8px 10px", border: "none", outline: "none", fontSize: 12 }} />
              </div>
            </div>
          )}

          <button style={{ width: "100%", padding: "10px", borderRadius: 6, border: "none", background: "#006CFE", color: "#FFFFFF", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Master Calendar ──────────────────────────────────── */
function MasterCalendar({ year, month, onYearMonth, onSelectTour }: {
  year: number; month: number;
  onYearMonth: (y: number, m: number) => void;
  onSelectTour: (id: string) => void;
}) {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [filterTour, setFilterTour]   = useState("");

  const days      = daysInMonth(year, month);
  const startDOW  = firstDOW(year, month);
  const prevMonth = () => month === 0 ? onYearMonth(year-1, 11) : onYearMonth(year, month-1);
  const nextMonth = () => month === 11 ? onYearMonth(year+1, 0) : onYearMonth(year, month+1);

  const getDaySlots = (day: number) => {
    const slots = SLOTS[dateKey(year, month, day)] ?? [];
    return filterTour ? slots.filter(s => s.tourId === filterTour) : slots;
  };

  const selectedSlots = selectedDay ? (SLOTS[selectedDay] ?? []) : [];

  return (
    <div style={{ display: "flex", gap: 16, fontFamily: "Inter, sans-serif" }}>
      {/* Sidebar */}
      <div style={{ width: 220, flexShrink: 0, display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, padding: "14px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
            <SlidersHorizontal size={13} color="#94A3B8" />
            <span style={{ fontSize: 12, fontWeight: 600, color: "#0F172A" }}>Filtros</span>
          </div>
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Tour</div>
            <select value={filterTour} onChange={e => setFilterTour(e.target.value)}
              style={{ width: "100%", padding: "6px 8px", border: "1px solid #E5E7EB", borderRadius: 5, fontSize: 12, outline: "none" }}>
              <option value="">Todos</option>
              {TOURS_DATA.map(t => <option key={t.id} value={t.id}>{t.titulo_es.split(" ").slice(0,3).join(" ")}...</option>)}
            </select>
          </div>
          {filterTour && <button onClick={() => setFilterTour("")} style={{ fontSize: 11, color: "#94A3B8", border: "none", background: "transparent", cursor: "pointer" }}>Limpiar filtros</button>}
        </div>

        <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, padding: "14px 16px" }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Tours</div>
          {TOURS_DATA.map(t => (
            <button key={t.id} onClick={() => onSelectTour(t.id)}
              style={{ display: "flex", alignItems: "center", gap: 6, width: "100%", marginBottom: 6, padding: "4px 6px", borderRadius: 5, border: "none", background: "transparent", cursor: "pointer", textAlign: "left" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#F7F8FA")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <div style={{ width: 10, height: 10, borderRadius: 2, background: TOUR_COLORS[t.id] || "#006CFE", flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: "#475569" }}>{t.titulo_es.split(" ").slice(0,2).join(" ")}</span>
            </button>
          ))}
        </div>

        <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, padding: "14px 16px" }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Cupos</div>
          {([
            { label: "Disponible",   color: "#16A34A" },
            { label: "Casi lleno",  color: "#F59E0B" },
            { label: "Sin cupo",    color: "#F13540" },
            { label: "Bloqueado",   color: "#94A3B8" },
          ]).map(l => (
            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: l.color }} />
              <span style={{ fontSize: 11, color: "#475569" }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Calendar + detail */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, padding: "20px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <button onClick={prevMonth} style={{ width: 32, height: 32, borderRadius: 6, border: "1px solid #E5E7EB", background: "#FFFFFF", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ChevronLeft size={14} />
            </button>
            <span style={{ fontSize: 16, fontWeight: 700, color: "#0F172A" }}>{MONTH_NAMES[month]} {year}</span>
            <button onClick={nextMonth} style={{ width: 32, height: 32, borderRadius: 6, border: "1px solid #E5E7EB", background: "#FFFFFF", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ChevronRight size={14} />
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, marginBottom: 4 }}>
            {DAY_NAMES.map(d => (
              <div key={d} style={{ textAlign: "center", fontSize: 10, fontWeight: 600, color: "#94A3B8", padding: "4px 0", textTransform: "uppercase", letterSpacing: "0.04em" }}>{d}</div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
            {[...Array(startDOW)].map((_, i) => <div key={`e${i}`} />)}
            {[...Array(days)].map((_, i) => {
              const day = i + 1;
              const dk = dateKey(year, month, day);
              const slots = getDaySlots(day);
              const isSelected = selectedDay === dk;
              const today = new Date();
              const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

              return (
                <div key={day} onClick={() => setSelectedDay(isSelected ? null : dk)}
                  style={{ minHeight: 72, padding: "5px", borderRadius: 6, cursor: "pointer", border: `1.5px solid ${isSelected ? "#006CFE" : "transparent"}`, background: isSelected ? "#EFF6FF" : "transparent", transition: "background 0.1s" }}
                  onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "#F7F8FA"; }}
                  onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  <div style={{ fontSize: 12, fontWeight: isToday ? 700 : 400, color: isToday ? "#FFFFFF" : "#0F172A", background: isToday ? "#006CFE" : "transparent", width: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 3 }}>
                    {day}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    {slots.slice(0, 2).map(s => (
                      <div key={s.tourId} style={{ padding: "1px 4px", borderRadius: 3, background: statusColors[s.status].bg, borderLeft: `2px solid ${s.color}`, fontSize: 9, color: "#0F172A", display: "flex", alignItems: "center", justifyContent: "space-between", overflow: "hidden" }}>
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.tourName.split(" ").slice(0,2).join(" ")}</span>
                        <span style={{ flexShrink: 0, color: "#94A3B8", fontSize: 8 }}>{s.paxLibres}/{s.paxTotal}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Day detail */}
        {selectedDay && selectedSlots.length > 0 && (
          <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, padding: "16px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: "#0F172A", margin: 0 }}>
                {new Date(selectedDay + "T12:00:00").toLocaleDateString("es-DO", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </h3>
              <button onClick={() => setSelectedDay(null)} style={{ border: "none", background: "transparent", cursor: "pointer" }}>
                <X size={14} color="#94A3B8" />
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
              {selectedSlots.map(s => {
                const pct = ((s.paxTotal - s.paxLibres) / s.paxTotal) * 100;
                const sc  = statusColors[s.status];
                return (
                  <div key={s.tourId} style={{ border: `1px solid ${sc.bg}`, borderLeft: `3px solid ${s.color}`, borderRadius: "0 6px 6px 0", padding: "12px 14px" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>{s.tourName}</div>
                    <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 8 }}>Salida: {s.horasSalida} · {s.precio}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
                      <span style={{ color: "#475569" }}>Cupos libres</span>
                      <span style={{ fontWeight: 700, color: s.paxLibres < 5 ? "#F13540" : s.paxLibres < 10 ? "#F59E0B" : "#16A34A" }}>{s.paxLibres} / {s.paxTotal}</span>
                    </div>
                    <div style={{ height: 4, borderRadius: 2, background: "#F1F5F9", overflow: "hidden", marginBottom: 8 }}>
                      <div style={{ height: "100%", borderRadius: 2, width: `${pct}%`, background: pct >= 100 ? "#F13540" : pct > 80 ? "#F59E0B" : s.color }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 20, background: sc.bg, color: s.status === "almost-full" ? "#92400E" : s.status === "full" ? "#B91C1C" : "#15803D", fontWeight: 600 }}>
                        {s.status === "almost-full" ? "Casi lleno" : s.status === "full" ? "Sin cupo" : "Disponible"}
                      </span>
                      <button onClick={() => onSelectTour(s.tourId)} style={{ fontSize: 11, color: "#006CFE", border: "none", background: "transparent", cursor: "pointer" }}>
                        Ver por tour →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: 8 }}>
          <button style={{ padding: "8px 14px", borderRadius: 6, border: "1px solid #E5E7EB", background: "#FFFFFF", fontSize: 13, color: "#475569", cursor: "pointer" }}>📅 Abrir mes completo</button>
          <button style={{ padding: "8px 14px", borderRadius: 6, border: "1px solid #E5E7EB", background: "#FFFFFF", fontSize: 13, color: "#475569", cursor: "pointer" }}>📆 Cerrar fines de semana</button>
          <button style={{ padding: "8px 14px", borderRadius: 6, border: "1px solid #E5E7EB", background: "#FFFFFF", fontSize: 13, color: "#F13540", cursor: "pointer" }}>🔒 Bloquear rango</button>
        </div>
      </div>
    </div>
  );
}

/* ── Per-tour Calendar ────────────────────────────────── */
function TourCalendar({ tourId, year, month, onYearMonth, onBack }: {
  tourId: string; year: number; month: number;
  onYearMonth: (y: number, m: number) => void; onBack: () => void;
}) {
  const [drawerDay, setDrawerDay] = useState<string | null>(null);
  const tour  = TOURS_DATA.find(t => t.id === tourId)!;
  const av    = AVAILABILITY.find(a => a.tour_id === tourId);
  const color = TOUR_COLORS[tourId] || "#006CFE";
  const days  = daysInMonth(year, month);
  const startDOW = firstDOW(year, month);
  const prevMonth = () => month === 0 ? onYearMonth(year-1, 11) : onYearMonth(year, month-1);
  const nextMonth = () => month === 11 ? onYearMonth(year+1, 0) : onYearMonth(year, month+1);
  const getSlot = (day: number) => (SLOTS[dateKey(year, month, day)] ?? []).find(s => s.tourId === tourId) ?? null;
  const drawerSlot = drawerDay ? getSlot(parseInt(drawerDay.split("-")[2])) : null;

  return (
    <div style={{ fontFamily: "Inter, sans-serif" }}>
      <div style={{ marginBottom: 20, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 4, border: "none", background: "transparent", cursor: "pointer", color: "#94A3B8", fontSize: 12, marginBottom: 6 }}>
            <ChevronLeft size={12} /> Calendario maestro
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: color }} />
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0F172A", margin: 0 }}>{tour.titulo_es}</h2>
          </div>
          <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 3 }}>
            Capacidad: {tour.capacidad_max} pax · {tour.pricing} · Salida: {tour.logistica.hora_salida}
          </div>
          {av && (
            <div style={{ marginTop: 6, display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 20, background: "#EFF6FF", border: "1px solid #BFDBFE", fontSize: 12, color: "#006CFE" }}>
              Fecha abierta: {av.fecha_display} — {av.cupos_libres} plazas libres de {av.cupos_totales}
            </div>
          )}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={{ padding: "7px 12px", borderRadius: 6, border: "1px solid #E5E7EB", background: "#FFFFFF", fontSize: 12, color: "#475569", cursor: "pointer" }}>📅 Abrir mes</button>
          <button style={{ padding: "7px 14px", borderRadius: 6, border: "none", background: "#006CFE", fontSize: 12, color: "#FFFFFF", cursor: "pointer" }}>+ Abrir fechas en bulk</button>
        </div>
      </div>

      <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, padding: "20px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <button onClick={prevMonth} style={{ width: 32, height: 32, borderRadius: 6, border: "1px solid #E5E7EB", background: "#FFFFFF", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><ChevronLeft size={14} /></button>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#0F172A" }}>{MONTH_NAMES[month]} {year}</span>
          <button onClick={nextMonth} style={{ width: 32, height: 32, borderRadius: 6, border: "1px solid #E5E7EB", background: "#FFFFFF", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><ChevronRight size={14} /></button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 4 }}>
          {DAY_NAMES.map(d => <div key={d} style={{ textAlign: "center", fontSize: 10, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.04em" }}>{d}</div>)}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
          {[...Array(startDOW)].map((_, i) => <div key={`e${i}`} />)}
          {[...Array(days)].map((_, i) => {
            const day = i + 1;
            const dk  = dateKey(year, month, day);
            const slot = getSlot(day);
            const today = new Date();
            const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

            return (
              <button key={day} onClick={() => setDrawerDay(dk)}
                style={{ padding: "8px 6px", borderRadius: 6, cursor: "pointer", border: `1.5px solid ${slot ? statusColors[slot.status].dot + "44" : "#E5E7EB"}`, background: slot ? statusColors[slot.status].bg : "#F7F8FA", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, minHeight: 64, transition: "opacity 0.1s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "0.8"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
              >
                <span style={{ fontSize: 12, fontWeight: isToday ? 700 : 400, color: isToday ? "#006CFE" : "#0F172A" }}>{day}</span>
                {slot ? (
                  <>
                    <span style={{ fontSize: 11, fontWeight: 700, color: slot.paxLibres === 0 ? "#F13540" : slot.paxLibres < 8 ? "#F59E0B" : "#16A34A" }}>{slot.paxLibres}/{slot.paxTotal}</span>
                    <span style={{ fontSize: 9, color: "#94A3B8" }}>libres</span>
                  </>
                ) : <span style={{ fontSize: 9, color: "#CBD5E1" }}>—</span>}
              </button>
            );
          })}
        </div>

        <div style={{ marginTop: 16, borderTop: "1px solid #F1F5F9", paddingTop: 12, display: "flex", gap: 16, flexWrap: "wrap" }}>
          {[{ label: "Disponible", color: "#16A34A" }, { label: "Casi lleno", color: "#F59E0B" }, { label: "Sin cupo", color: "#F13540" }, { label: "Completado", color: "#7C3AED" }, { label: "Sin fecha abierta", color: "#E5E7EB" }].map(l => (
            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: l.color }} />
              <span style={{ fontSize: 11, color: "#475569" }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {drawerDay && (
        <DayDrawer
          dateStr={new Date(drawerDay + "T12:00:00").toLocaleDateString("es-DO", { weekday: "long", day: "numeric", month: "long" })}
          slot={drawerSlot}
          onClose={() => setDrawerDay(null)}
        />
      )}
    </div>
  );
}

/* ── Main export ──────────────────────────────────────── */
export function Disponibilidad() {
  const [view, setView]               = useState<"master" | "tour">("master");
  const [selectedTour, setSelectedTour] = useState(TOURS_DATA[0].id);
  const today = new Date();
  const [year, setYear]   = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  return (
    <div style={{ fontFamily: "Inter, sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 0, border: "1px solid #E5E7EB", borderRadius: 6, overflow: "hidden" }}>
          <button onClick={() => setView("master")} style={{ padding: "6px 14px", border: "none", background: view === "master" ? "#006CFE" : "#FFFFFF", color: view === "master" ? "#FFFFFF" : "#475569", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
            <Calendar size={13} /> Calendario maestro
          </button>
          <button onClick={() => setView("tour")} style={{ padding: "6px 14px", border: "none", borderLeft: "1px solid #E5E7EB", background: view === "tour" ? "#006CFE" : "#FFFFFF", color: view === "tour" ? "#FFFFFF" : "#475569", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
            <Users size={13} /> Por tour
          </button>
        </div>
        {view === "tour" && (
          <select value={selectedTour} onChange={e => setSelectedTour(e.target.value)}
            style={{ padding: "6px 12px", border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 13, outline: "none" }}>
            {TOURS_DATA.map(t => <option key={t.id} value={t.id}>{t.titulo_es}</option>)}
          </select>
        )}
      </div>

      {view === "master" ? (
        <MasterCalendar year={year} month={month} onYearMonth={(y, m) => { setYear(y); setMonth(m); }} onSelectTour={id => { setSelectedTour(id); setView("tour"); }} />
      ) : (
        <TourCalendar tourId={selectedTour} year={year} month={month} onYearMonth={(y, m) => { setYear(y); setMonth(m); }} onBack={() => setView("master")} />
      )}
    </div>
  );
}
