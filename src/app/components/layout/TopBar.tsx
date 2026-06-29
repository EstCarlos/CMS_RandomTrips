import { useState } from "react";
import { Search, Bell, ChevronDown, Check, LogOut, User, Settings } from "lucide-react";

interface Notification {
  id: string;
  text: string;
  time: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  { id: "1", text: "Nueva reserva #RT-2841 recibida", time: "hace 5 min", read: false },
  { id: "2", text: "Pago confirmado para Tour Saona Island", time: "hace 22 min", read: false },
  { id: "3", text: "Cotización #COT-445 pendiente de respuesta", time: "hace 1 h", read: false },
  { id: "4", text: "Operador Caribe Tours actualizó disponibilidad", time: "hace 3 h", read: true },
  { id: "5", text: "5 nuevas reseñas recibidas este fin de semana", time: "hace 1 d", read: true },
];

interface TopBarProps {
  title: string;
  breadcrumbs?: string[];
  actions?: React.ReactNode;
  userName: string;
  userRole: string;
  onLogout?: () => void;
}

export function TopBar({ title, breadcrumbs, actions, userName, userRole, onLogout }: TopBarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [searchFocused, setSearchFocused] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <header style={{
      height: 56,
      background: "#FFFFFF",
      borderBottom: "1px solid #E5E7EB",
      display: "flex",
      alignItems: "center",
      paddingLeft: 24,
      paddingRight: 24,
      gap: 16,
      fontFamily: "Inter, sans-serif",
      position: "sticky",
      top: 0,
      zIndex: 30,
    }}>
      {/* Page title / breadcrumb */}
      <div style={{ flex: 1 }}>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 1 }}>
            {breadcrumbs.map((crumb, i) => (
              <span key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {i > 0 && <span style={{ color: "#CBD5E1", fontSize: 12 }}>/</span>}
                <span style={{ fontSize: 11, color: "#94A3B8" }}>{crumb}</span>
              </span>
            ))}
          </div>
        )}
        <h1 style={{ fontSize: 15, fontWeight: 600, color: "#0F172A", margin: 0, lineHeight: 1.3 }}>{title}</h1>
      </div>

      {/* Page actions slot */}
      {actions && <div style={{ display: "flex", alignItems: "center", gap: 8 }}>{actions}</div>}

      {/* Global search */}
      <div style={{ position: "relative" }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "6px 12px",
          background: searchFocused ? "#FFFFFF" : "#F7F8FA",
          border: `1px solid ${searchFocused ? "#006CFE" : "#E5E7EB"}`,
          borderRadius: 6,
          width: 220,
          transition: "border-color 0.12s, background 0.12s",
        }}>
          <Search size={14} color="#94A3B8" />
          <input
            placeholder="Buscar... (⌘K)"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            style={{
              border: "none",
              background: "transparent",
              outline: "none",
              fontSize: 13,
              color: "#0F172A",
              width: "100%",
            }}
          />
        </div>
      </div>

      {/* Notifications */}
      <div style={{ position: "relative" }}>
        <button
          onClick={() => { setShowNotifications(!showNotifications); setShowUserMenu(false); }}
          style={{
            width: 36, height: 36, borderRadius: 8,
            border: "1px solid #E5E7EB",
            background: showNotifications ? "#F1F5F9" : "#FFFFFF",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
            position: "relative",
          }}
        >
          <Bell size={16} color="#475569" />
          {unreadCount > 0 && (
            <span style={{
              position: "absolute", top: 6, right: 6,
              width: 8, height: 8, borderRadius: "50%",
              background: "#F13540",
              border: "2px solid #FFFFFF",
            }} />
          )}
        </button>

        {showNotifications && (
          <div style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            width: 340,
            background: "#FFFFFF",
            border: "1px solid #E5E7EB",
            borderRadius: 8,
            boxShadow: "0 8px 24px rgba(0,0,0,.1)",
            zIndex: 100,
          }}>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "12px 16px",
              borderBottom: "1px solid #E5E7EB",
            }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>
                Notificaciones {unreadCount > 0 && <span style={{ color: "#006CFE" }}>({unreadCount})</span>}
              </span>
              {unreadCount > 0 && (
                <button onClick={markAllRead} style={{
                  fontSize: 12, color: "#006CFE", border: "none", background: "transparent",
                  cursor: "pointer", padding: 0,
                }}>
                  Marcar todas leídas
                </button>
              )}
            </div>
            <div style={{ maxHeight: 320, overflowY: "auto" }}>
              {notifications.map(n => (
                <div key={n.id} style={{
                  display: "flex", gap: 10, padding: "10px 16px",
                  borderBottom: "1px solid #F1F5F9",
                  background: n.read ? "transparent" : "#F0F7FF",
                }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: n.read ? "transparent" : "#006CFE",
                    marginTop: 5, flexShrink: 0,
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, color: "#0F172A", lineHeight: 1.4 }}>{n.text}</div>
                    <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>{n.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* User menu */}
      <div style={{ position: "relative" }}>
        <button
          onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifications(false); }}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "4px 8px 4px 4px",
            borderRadius: 8,
            border: "1px solid #E5E7EB",
            background: showUserMenu ? "#F1F5F9" : "#FFFFFF",
            cursor: "pointer",
          }}
        >
          <div style={{
            width: 28, height: 28, borderRadius: "50%",
            background: "#006CFE", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>
              {userName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
            </span>
          </div>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#0F172A", lineHeight: 1.2 }}>{userName}</div>
            <div style={{ fontSize: 10, color: "#94A3B8", textTransform: "capitalize" }}>{userRole}</div>
          </div>
          <ChevronDown size={13} color="#94A3B8" />
        </button>

        {showUserMenu && (
          <div style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            width: 180,
            background: "#FFFFFF",
            border: "1px solid #E5E7EB",
            borderRadius: 8,
            boxShadow: "0 8px 24px rgba(0,0,0,.1)",
            overflow: "hidden",
            zIndex: 100,
          }}>
            {[
              { icon: <User size={14} />, label: "Mi perfil" },
              { icon: <Settings size={14} />, label: "Configuración" },
            ].map((item) => (
              <button key={item.label} style={{
                display: "flex", alignItems: "center", gap: 8,
                width: "100%", padding: "10px 14px",
                border: "none", background: "transparent",
                cursor: "pointer", fontSize: 13, color: "#475569",
                textAlign: "left",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#F7F8FA"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
            <div style={{ borderTop: "1px solid #E5E7EB" }} />
            <button
              onClick={() => { setShowUserMenu(false); onLogout?.(); }}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                width: "100%", padding: "10px 14px",
                border: "none", background: "transparent",
                cursor: "pointer", fontSize: 13, color: "#F13540",
                textAlign: "left",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#FEF2F2"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              <LogOut size={14} />
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
