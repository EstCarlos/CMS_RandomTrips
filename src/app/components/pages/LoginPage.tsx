import { useState } from "react";
import { UserRole } from "../layout/Sidebar";

interface LoginCredential {
  email: string;
  password: string;
  role: UserRole;
  name: string;
  roleLabel: string;
}

const CREDENTIALS: LoginCredential[] = [
  { email: "alejandra@randomtrips.com", password: "admin2024",  role: "admin",    name: "Alejandra Torres",  roleLabel: "Administradora" },
  { email: "maria@randomtrips.com",     password: "staff2024",  role: "staff",    name: "María González",    roleLabel: "Staff"          },
  { email: "carlos@randomtrips.com",    password: "op2024",     role: "operator", name: "Carlos Domínguez",  roleLabel: "Operador"       },
  { email: "randy@randomtrips.com",     password: "socio2024",  role: "partner",  name: "Randy García",      roleLabel: "Socio"          },
];

interface LoginPageProps {
  onLogin: (role: UserRole, name: string) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      const match = CREDENTIALS.find(
        c => c.email.toLowerCase() === email.trim().toLowerCase() && c.password === password
      );

      if (match) {
        onLogin(match.role, match.name);
      } else {
        setError("Correo o contraseña incorrectos.");
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0F172A 0%, #1E3A5F 50%, #0F172A 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Inter, sans-serif",
      padding: 24,
    }}>
      {/* Decorative background dots */}
      <div style={{
        position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none",
      }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{
            position: "absolute",
            borderRadius: "50%",
            background: "rgba(0, 108, 254, 0.06)",
            width: [320, 200, 280, 160, 240, 180][i],
            height: [320, 200, 280, 160, 240, 180][i],
            top:  [`-80px`, `60%`, `20%`, `75%`, `-40px`, `40%`][i],
            left: [`-80px`, `-60px`, `75%`, `70%`, `65%`, `55%`][i],
          }} />
        ))}
      </div>

      <div style={{ width: "100%", maxWidth: 420, position: "relative" }}>
        {/* Card */}
        <div style={{
          background: "#FFFFFF",
          borderRadius: 16,
          padding: "40px 40px 36px",
          boxShadow: "0 24px 64px rgba(0,0,0,.35)",
        }}>
          {/* Logo / Brand */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{
              width: 52, height: 52,
              background: "#006CFE",
              borderRadius: 12,
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 14px",
              boxShadow: "0 4px 16px rgba(0,108,254,.35)",
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="white" />
                <circle cx="12" cy="9" r="2.5" fill="#006CFE" />
              </svg>
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "0 0 4px" }}>
              Random Trips
            </h1>
            <p style={{ fontSize: 13, color: "#94A3B8", margin: 0 }}>
              Panel de administración
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Email */}
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 6 }}>
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(""); }}
                placeholder="usuario@randomtrips.com"
                autoComplete="email"
                required
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: `1px solid ${error ? "#F13540" : "#E5E7EB"}`,
                  borderRadius: 8,
                  fontSize: 14,
                  color: "#0F172A",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.15s",
                  fontFamily: "Inter, sans-serif",
                }}
                onFocus={e => { if (!error) e.currentTarget.style.borderColor = "#006CFE"; }}
                onBlur={e  => { if (!error) e.currentTarget.style.borderColor = "#E5E7EB"; }}
              />
            </div>

            {/* Password */}
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 6 }}>
                Contraseña
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(""); }}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  style={{
                    width: "100%",
                    padding: "10px 40px 10px 12px",
                    border: `1px solid ${error ? "#F13540" : "#E5E7EB"}`,
                    borderRadius: 8,
                    fontSize: 14,
                    color: "#0F172A",
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border-color 0.15s",
                    fontFamily: "Inter, sans-serif",
                  }}
                  onFocus={e => { if (!error) e.currentTarget.style.borderColor = "#006CFE"; }}
                  onBlur={e  => { if (!error) e.currentTarget.style.borderColor = "#E5E7EB"; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  style={{
                    position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                    background: "transparent", border: "none", cursor: "pointer",
                    color: "#94A3B8", padding: 4,
                  }}
                >
                  {showPass ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                background: "#FEF2F2", border: "1px solid #FECACA",
                borderRadius: 8, padding: "10px 14px",
                fontSize: 13, color: "#DC2626",
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "11px 16px",
                background: loading ? "#93C5FD" : "#006CFE",
                color: "#FFFFFF",
                border: "none",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                transition: "background 0.15s",
                fontFamily: "Inter, sans-serif",
                marginTop: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "#0057D0"; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = "#006CFE"; }}
            >
              {loading ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"
                    style={{ animation: "spin 0.8s linear infinite" }}>
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Verificando...
                </>
              ) : "Iniciar sesión"}
            </button>
          </form>

        </div>

        {/* Footer */}
        <p style={{ textAlign: "center", fontSize: 11, color: "rgba(255,255,255,.35)", marginTop: 20 }}>
          © 2025 Random Trips · República Dominicana
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
