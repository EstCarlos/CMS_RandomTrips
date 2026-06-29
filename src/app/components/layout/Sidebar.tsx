import { useState } from "react";
import {
  LayoutDashboard, Map, Sparkles, Package, Calendar, ClipboardList,
  MessageSquare, Users, Handshake, CreditCard, Image, HelpCircle,
  Star, FileText, Settings, UserCog, ScrollText, ChevronDown, LogOut, User
} from "lucide-react";

export type UserRole = "admin" | "staff" | "operator" | "partner";

export type Page =
  | "dashboard"
  | "destinos" | "experiencias" | "tours"
  | "disponibilidad" | "reservas" | "cotizaciones" | "clientes" | "operadores" | "pagos"
  | "galeria" | "faq" | "testimonios" | "paginas"
  | "configuracion" | "usuarios-cms" | "logs"
  | "mis-tours" | "mi-disponibilidad" | "mis-reservas" | "mi-perfil";

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  userRole: UserRole;
  userName: string;
}

interface NavItem {
  id: Page;
  label: string;
  icon: React.ReactNode;
}

interface NavGroup {
  label?: string;
  items: NavItem[];
}

const adminNav: NavGroup[] = [
  {
    items: [
      { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
    ]
  },
  {
    label: "CATÁLOGO",
    items: [
      { id: "destinos", label: "Destinos", icon: <Map size={16} /> },
      { id: "experiencias", label: "Experiencias", icon: <Sparkles size={16} /> },
      { id: "tours", label: "Tours / Paquetes", icon: <Package size={16} /> },
    ]
  },
  {
    label: "OPERACIÓN",
    items: [
      { id: "disponibilidad", label: "Disponibilidad", icon: <Calendar size={16} /> },
      { id: "reservas", label: "Reservas", icon: <ClipboardList size={16} /> },
      { id: "cotizaciones", label: "Cotizaciones", icon: <MessageSquare size={16} /> },
      { id: "clientes", label: "Clientes", icon: <Users size={16} /> },
      { id: "operadores", label: "Operadores", icon: <Handshake size={16} /> },
      { id: "pagos", label: "Pagos", icon: <CreditCard size={16} /> },
    ]
  },
  {
    label: "CONTENIDO",
    items: [
      { id: "galeria", label: "Galería", icon: <Image size={16} /> },
      { id: "faq", label: "FAQ", icon: <HelpCircle size={16} /> },
      { id: "testimonios", label: "Testimonios", icon: <Star size={16} /> },
      { id: "paginas", label: "Páginas", icon: <FileText size={16} /> },
    ]
  },
  {
    label: "SISTEMA",
    items: [
      { id: "configuracion", label: "Configuración", icon: <Settings size={16} /> },
      { id: "usuarios-cms", label: "Usuarios CMS", icon: <UserCog size={16} /> },
      { id: "logs", label: "Logs auditoría", icon: <ScrollText size={16} /> },
    ]
  },
];

const operatorNav: NavGroup[] = [
  {
    items: [
      { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
      { id: "mis-tours", label: "Mis Tours", icon: <Package size={16} /> },
      { id: "mi-disponibilidad", label: "Mi Disponibilidad", icon: <Calendar size={16} /> },
      { id: "mis-reservas", label: "Mis Reservas", icon: <ClipboardList size={16} /> },
      { id: "mi-perfil", label: "Mi Perfil", icon: <User size={16} /> },
    ]
  }
];

const partnerNav: NavGroup[] = [
  {
    label: "COTIZACIONES",
    items: [
      { id: "cotizaciones", label: "Cotizaciones", icon: <MessageSquare size={16} /> },
    ]
  },
  {
    label: "CATÁLOGO",
    items: [
      { id: "destinos",     label: "Destinos",     icon: <Map size={16} /> },
      { id: "experiencias", label: "Experiencias", icon: <Sparkles size={16} /> },
      { id: "tours",        label: "Tours",         icon: <Package size={16} /> },
    ]
  },
];

export function Sidebar({ currentPage, onNavigate, userRole, userName }: SidebarProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const nav = userRole === "operator" ? operatorNav : userRole === "partner" ? partnerNav : adminNav;

  return (
    <aside
      style={{
        width: 240,
        minWidth: 240,
        background: "#FFFFFF",
        borderRight: "1px solid #E5E7EB",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        fontFamily: "Inter, sans-serif",
        zIndex: 40,
      }}
    >
      {/* Logo */}
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #E5E7EB", height: 56, display: "flex", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 6,
            background: "#006CFE", display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <span style={{ color: "#fff", fontSize: 14, fontWeight: 700, lineHeight: 1 }}>RT</span>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", lineHeight: 1.2 }}>Random Trips</div>
            <div style={{ fontSize: 10, color: "#94A3B8", lineHeight: 1.2, textTransform: "uppercase", letterSpacing: "0.05em" }}>CMS Admin</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, overflowY: "auto", padding: "8px 12px" }}>
        {nav.map((group, gi) => (
          <div key={gi} style={{ marginBottom: 4 }}>
            {group.label && (
              <div style={{
                fontSize: 10, fontWeight: 600, color: "#94A3B8",
                padding: "10px 8px 4px",
                letterSpacing: "0.08em",
                textTransform: "uppercase"
              }}>
                {group.label}
              </div>
            )}
            {group.items.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: 6,
                    border: "none",
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? "#FFFFFF" : "#475569",
                    background: isActive ? "#006CFE" : "transparent",
                    textAlign: "left",
                    transition: "background 0.12s, color 0.12s",
                    marginBottom: 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "#F1F5F9";
                      e.currentTarget.style.color = "#0F172A";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "#475569";
                    }
                  }}
                >
                  <span style={{ opacity: isActive ? 1 : 0.75, flexShrink: 0 }}>{item.icon}</span>
                  {item.label}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User Footer */}
      <div style={{ padding: "8px 12px", borderTop: "1px solid #E5E7EB", position: "relative" }}>
        <button
          onClick={() => setUserMenuOpen(!userMenuOpen)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            width: "100%",
            padding: "8px 10px",
            borderRadius: 6,
            border: "none",
            cursor: "pointer",
            background: userMenuOpen ? "#F1F5F9" : "transparent",
            transition: "background 0.12s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#F1F5F9"; }}
          onMouseLeave={(e) => { if (!userMenuOpen) e.currentTarget.style.background = "transparent"; }}
        >
          <div style={{
            width: 28, height: 28, borderRadius: "50%",
            background: "#006CFE", display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>
              {userName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
            </span>
          </div>
          <div style={{ flex: 1, textAlign: "left" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#0F172A", lineHeight: 1.3 }}>{userName}</div>
            <div style={{ fontSize: 10, color: "#94A3B8", lineHeight: 1.3, textTransform: "capitalize" }}>{userRole}</div>
          </div>
          <ChevronDown size={14} color="#94A3B8" style={{ transform: userMenuOpen ? "rotate(180deg)" : "none", transition: "transform 0.12s" }} />
        </button>

        {userMenuOpen && (
          <div style={{
            position: "absolute",
            bottom: "calc(100% - 8px)",
            left: 12,
            right: 12,
            background: "#FFFFFF",
            border: "1px solid #E5E7EB",
            borderRadius: 8,
            boxShadow: "0 4px 16px rgba(0,0,0,.1)",
            overflow: "hidden",
            zIndex: 50,
          }}>
            <button
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
    </aside>
  );
}
