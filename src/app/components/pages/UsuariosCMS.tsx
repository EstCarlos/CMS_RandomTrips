import { useState } from "react";
import { Plus, X, Edit2, Trash2, ShieldCheck } from "lucide-react";
import { StatusBadge } from "../ui/StatusBadge";
import { FormField, Input, SelectField } from "../ui/FormField";
import { Btn } from "../ui/Modal";

interface CmsUser {
  id: string;
  nombre: string;
  email: string;
  rol: "admin" | "staff" | "operador";
  operadorAsociado: string;
  ultimoLogin: string;
  status: "active" | "invited" | "inactive";
}

const mockUsers: CmsUser[] = [
  { id: "U-001", nombre: "Alejandra Torres",  email: "ale@randomtrips.do",    rol: "admin",    operadorAsociado: "—",                ultimoLogin: "Hoy 09:14",       status: "active"   },
  { id: "U-002", nombre: "Carlos Reyes",       email: "carlos@randomtrips.do", rol: "staff",    operadorAsociado: "—",                ultimoLogin: "Hoy 08:45",       status: "active"   },
  { id: "U-003", nombre: "María Pérez",        email: "maria@randomtrips.do",  rol: "staff",    operadorAsociado: "—",                ultimoLogin: "Ayer 17:22",      status: "active"   },
  { id: "U-004", nombre: "Pedro Rosario",      email: "pedro@caribetours.com", rol: "operador", operadorAsociado: "Caribe Tours",     ultimoLogin: "15 Jun 2026",     status: "active"   },
  { id: "U-005", nombre: "María Santos",       email: "maria@aventurard.com",  rol: "operador", operadorAsociado: "Aventura RD",      ultimoLogin: "14 Jun 2026",     status: "active"   },
  { id: "U-006", nombre: "Luis Fernández",     email: "luis@colonialtours.do", rol: "operador", operadorAsociado: "Colonial Tours",   ultimoLogin: "10 Jun 2026",     status: "active"   },
  { id: "U-007", nombre: "Ana Jiménez",        email: "ana@whalesamana.com",   rol: "operador", operadorAsociado: "Samaná Whale Tours", ultimoLogin: "8 Jun 2026",    status: "active"   },
  { id: "U-008", nombre: "Nuevo Colaborador",  email: "nuevo@partner.com",     rol: "operador", operadorAsociado: "PC Excursiones",   ultimoLogin: "—",               status: "invited"  },
];

const OPERADORES = ["Caribe Tours", "Aventura RD", "Colonial Tours", "Samaná Whale Tours", "Eco Caribe", "Norte Tours", "PC Excursiones", "Montaña RD"];

const ROL_CONF = {
  admin:    { variant: "primary" as const, label: "Admin",    icon: "👑" },
  staff:    { variant: "info"    as const, label: "Staff",    icon: "💼" },
  operador: { variant: "neutral" as const, label: "Operador", icon: "🤝" },
};

function InviteModal({ onClose }: { onClose: () => void }) {
  const [rol, setRol] = useState("staff");
  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [op, setOp] = useState("");

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(15,23,42,.4)" }} />
      <div style={{ position: "relative", width: 480, background: "#FFFFFF", borderRadius: 8, boxShadow: "0 20px 60px rgba(0,0,0,.15)", fontFamily: "Inter, sans-serif", overflow: "hidden" }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #E5E7EB", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <ShieldCheck size={16} color="#006CFE" />
            <span style={{ fontSize: 15, fontWeight: 700, color: "#0F172A" }}>Invitar usuario al CMS</span>
          </div>
          <button onClick={onClose} style={{ border: "1px solid #E5E7EB", background: "#FFFFFF", borderRadius: 6, width: 28, height: 28, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={13} color="#94A3B8" />
          </button>
        </div>
        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <FormField label="Nombre completo" required><Input value={nombre} onChange={setNombre} placeholder="Pedro Rosario" /></FormField>
            <FormField label="Email" required><Input value={email} onChange={setEmail} type="email" placeholder="usuario@email.com" /></FormField>
          </div>
          <FormField label="Rol de acceso" required>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              {(["admin", "staff", "operador"] as const).map(r => (
                <button key={r} onClick={() => setRol(r)} style={{
                  padding: "10px 8px", borderRadius: 6, border: `2px solid ${rol === r ? "#006CFE" : "#E5E7EB"}`,
                  background: rol === r ? "#EFF6FF" : "#FFFFFF", cursor: "pointer", textAlign: "center",
                }}>
                  <div style={{ fontSize: 18, marginBottom: 4 }}>{ROL_CONF[r].icon}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: rol === r ? "#006CFE" : "#475569" }}>{ROL_CONF[r].label}</div>
                  <div style={{ fontSize: 10, color: "#94A3B8", marginTop: 2 }}>
                    {r === "admin" ? "Acceso total" : r === "staff" ? "Sin configuración" : "Solo sus tours"}
                  </div>
                </button>
              ))}
            </div>
          </FormField>
          {rol === "operador" && (
            <FormField label="Operador asociado" required>
              <SelectField value={op} onChange={setOp} options={OPERADORES.map(o => ({ value: o, label: o }))} placeholder="Seleccionar operador..." />
            </FormField>
          )}
          <div style={{ padding: "10px 12px", background: "#EFF6FF", borderRadius: 6, fontSize: 12, color: "#1D4ED8" }}>
            Se enviará un email de invitación con instrucciones para crear su contraseña.
          </div>
        </div>
        <div style={{ padding: "14px 20px", borderTop: "1px solid #E5E7EB", display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <Btn variant="secondary" onClick={onClose}>Cancelar</Btn>
          <Btn variant="primary" onClick={onClose}>Enviar invitación</Btn>
        </div>
      </div>
    </div>
  );
}

export function UsuariosCMS() {
  const [users, setUsers] = useState(mockUsers);
  const [showInvite, setShowInvite] = useState(false);
  const [filterRol, setFilterRol] = useState("");

  const filtered = users.filter(u => !filterRol || u.rol === filterRol);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, fontFamily: "Inter, sans-serif" }}>
      {showInvite && <InviteModal onClose={() => setShowInvite(false)} />}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", gap: 6 }}>
          {[{ v: "", l: "Todos" }, { v: "admin", l: "👑 Admin" }, { v: "staff", l: "💼 Staff" }, { v: "operador", l: "🤝 Operadores" }].map(f => (
            <button key={f.v} onClick={() => setFilterRol(f.v)} style={{ padding: "5px 12px", borderRadius: 20, border: `1px solid ${filterRol === f.v ? "#006CFE" : "#E5E7EB"}`, background: filterRol === f.v ? "#EFF6FF" : "#FFFFFF", color: filterRol === f.v ? "#006CFE" : "#475569", fontSize: 12, cursor: "pointer" }}>
              {f.l}
            </button>
          ))}
        </div>
        <button onClick={() => setShowInvite(true)}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 6, border: "none", background: "#006CFE", fontSize: 13, color: "#FFFFFF", cursor: "pointer", fontWeight: 500 }}>
          <Plus size={14} /> Invitar usuario
        </button>
      </div>

      <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F7F8FA", borderBottom: "1px solid #E5E7EB" }}>
              {["Usuario", "Email", "Rol", "Operador asociado", "Último login", "Estado", ""].map(h => (
                <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((u, i) => (
              <tr key={u.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid #F1F5F9" : "none" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#F7F8FA")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <td style={{ padding: "12px 14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: u.rol === "admin" ? "#EFF6FF" : u.rol === "staff" ? "#F0F9FF" : "#F5F3FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>
                      {ROL_CONF[u.rol].icon}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>{u.nombre}</span>
                  </div>
                </td>
                <td style={{ padding: "12px 14px", fontSize: 12, color: "#475569" }}>{u.email}</td>
                <td style={{ padding: "12px 14px" }}>
                  <StatusBadge variant={ROL_CONF[u.rol].variant} label={ROL_CONF[u.rol].label} />
                </td>
                <td style={{ padding: "12px 14px", fontSize: 13, color: "#475569" }}>{u.operadorAsociado}</td>
                <td style={{ padding: "12px 14px", fontSize: 12, color: "#94A3B8" }}>{u.ultimoLogin}</td>
                <td style={{ padding: "12px 14px" }}>
                  <StatusBadge
                    variant={u.status === "active" ? "success" : u.status === "invited" ? "warning" : "neutral"}
                    label={u.status === "active" ? "Activo" : u.status === "invited" ? "Invitado" : "Inactivo"}
                  />
                </td>
                <td style={{ padding: "12px 14px" }}>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button style={{ width: 27, height: 27, borderRadius: 6, border: "1px solid #E5E7EB", background: "#FFFFFF", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Edit2 size={11} color="#475569" />
                    </button>
                    {u.rol !== "admin" && (
                      <button onClick={() => setUsers(prev => prev.filter(x => x.id !== u.id))} style={{ width: 27, height: 27, borderRadius: 6, border: "1px solid #FEE2E2", background: "#FEF2F2", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Trash2 size={11} color="#F13540" />
                      </button>
                    )}
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
