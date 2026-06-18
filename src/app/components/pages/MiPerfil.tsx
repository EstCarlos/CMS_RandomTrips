import { useState } from "react";
import { Save, Eye, EyeOff } from "lucide-react";
import { FormField, Input } from "../ui/FormField";

export function MiPerfil() {
  const [form, setForm] = useState({
    nombre: "Carlos Domínguez", email: "carlos@caribetours.com",
    telefono: "+1 809 555 1000", whatsapp: "+1 809 555 1001",
    empresa: "Caribe Tours", zona: "La Romana / Bayahibe",
  });
  const [pass, setPass]       = useState({ actual: "", nueva: "", confirmar: "" });
  const [showPass, setShowPass] = useState(false);
  const [saved, setSaved]      = useState(false);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 3000); };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, fontFamily: "Inter, sans-serif", maxWidth: 800 }}>
      {/* Datos de contacto */}
      <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, padding: "20px", display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: "#006CFE" }}>
            CD
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>{form.nombre}</div>
            <div style={{ fontSize: 12, color: "#94A3B8" }}>Operador externo · Caribe Tours</div>
          </div>
        </div>

        <FormField label="Nombre completo"><Input value={form.nombre} onChange={v => setForm(p => ({...p, nombre: v}))} /></FormField>
        <FormField label="Email" helper="No editable — contacta a Random Trips para cambiarlo">
          <Input value={form.email} disabled />
        </FormField>
        <FormField label="Teléfono"><Input value={form.telefono} onChange={v => setForm(p => ({...p, telefono: v}))} /></FormField>
        <FormField label="WhatsApp"><Input value={form.whatsapp} onChange={v => setForm(p => ({...p, whatsapp: v}))} /></FormField>
        <FormField label="Empresa"><Input value={form.empresa} disabled /></FormField>
        <FormField label="Zona de operación"><Input value={form.zona} disabled /></FormField>

        <button onClick={handleSave} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 6, border: "none", background: "#006CFE", color: "#FFFFFF", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          {saved ? "✓ Guardado" : <><Save size={13} /> Guardar cambios</>}
        </button>
      </div>

      {/* Cambiar contraseña */}
      <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, padding: "20px", display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>Cambiar contraseña</div>

        {[
          { label: "Contraseña actual", key: "actual" },
          { label: "Nueva contraseña",  key: "nueva"  },
          { label: "Confirmar nueva",   key: "confirmar" },
        ].map(f => (
          <FormField key={f.key} label={f.label}>
            <div style={{ position: "relative" }}>
              <input type={showPass ? "text" : "password"} value={(pass as Record<string, string>)[f.key]}
                onChange={e => setPass(p => ({...p, [f.key]: e.target.value}))}
                style={{ width: "100%", padding: "8px 36px 8px 12px", border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 13, outline: "none", fontFamily: "Inter, sans-serif", boxSizing: "border-box" }}
              />
              <button onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", border: "none", background: "transparent", cursor: "pointer" }}>
                {showPass ? <EyeOff size={14} color="#94A3B8" /> : <Eye size={14} color="#94A3B8" />}
              </button>
            </div>
          </FormField>
        ))}

        {pass.nueva && pass.confirmar && pass.nueva !== pass.confirmar && (
          <div style={{ fontSize: 12, color: "#F13540" }}>Las contraseñas no coinciden</div>
        )}

        <button
          disabled={!pass.actual || !pass.nueva || pass.nueva !== pass.confirmar}
          style={{ padding: "9px 16px", borderRadius: 6, border: "none", background: (pass.actual && pass.nueva && pass.nueva === pass.confirmar) ? "#006CFE" : "#E5E7EB", color: (pass.actual && pass.nueva && pass.nueva === pass.confirmar) ? "#FFFFFF" : "#94A3B8", fontSize: 13, fontWeight: 600, cursor: (pass.actual && pass.nueva && pass.nueva === pass.confirmar) ? "pointer" : "not-allowed" }}>
          Actualizar contraseña
        </button>

        <div style={{ padding: "12px 14px", background: "#F7F8FA", borderRadius: 6, fontSize: 12, color: "#475569", marginTop: 4 }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Requisitos de contraseña</div>
          <ul style={{ margin: 0, paddingLeft: 16 }}>
            <li>Mínimo 8 caracteres</li>
            <li>Al menos una letra mayúscula</li>
            <li>Al menos un número</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
