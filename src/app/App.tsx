import { useState } from "react";
import { Toaster } from "sonner";
import { Sidebar, Page, UserRole } from "./components/layout/Sidebar";
import { TopBar } from "./components/layout/TopBar";

/* ── Pages: Catálogo ─── */
import { Dashboard } from "./components/pages/Dashboard";
import { Tours } from "./components/pages/Tours";
import { TourEditor } from "./components/pages/TourEditor";
import { Destinos } from "./components/pages/Destinos";
import { Experiencias } from "./components/pages/Experiencias";

/* ── Pages: Operación ─── */
import { Disponibilidad } from "./components/pages/Disponibilidad";
import { Reservas } from "./components/pages/Reservas";
import { Cotizaciones } from "./components/pages/Cotizaciones";
import { Clientes } from "./components/pages/Clientes";
import { Operadores } from "./components/pages/Operadores";
import { Pagos } from "./components/pages/Pagos";

/* ── Pages: Contenido ─── */
import { Galeria } from "./components/pages/Galeria";
import { FAQ } from "./components/pages/FAQ";
import { Testimonios } from "./components/pages/Testimonios";

/* ── Pages: Sistema ─── */
import { Configuracion } from "./components/pages/Configuracion";
import { UsuariosCMS } from "./components/pages/UsuariosCMS";
import { LogsAuditoria } from "./components/pages/LogsAuditoria";

/* ── Pages: Operador ─── */
import { OperadorDashboard } from "./components/pages/OperadorDashboard";
import { MiPerfil } from "./components/pages/MiPerfil";

/* ── Pages: Contenido ─── */
import { Paginas } from "./components/pages/Paginas";

/* ── Stub ─── */
import { StubPage } from "./components/pages/StubPage";

/* ── Page metadata ─────────────────────────────────────── */
const PAGE_META: Record<string, { title: string; breadcrumbs?: string[] }> = {
  dashboard:           { title: "Dashboard" },
  destinos:            { title: "Destinos",             breadcrumbs: ["Catálogo"] },
  experiencias:        { title: "Experiencias",          breadcrumbs: ["Catálogo"] },
  tours:               { title: "Tours / Paquetes",      breadcrumbs: ["Catálogo"] },
  "tour-editor":       { title: "Editor de Tour",        breadcrumbs: ["Catálogo", "Tours"] },
  disponibilidad:      { title: "Disponibilidad",        breadcrumbs: ["Operación"] },
  reservas:            { title: "Reservas",              breadcrumbs: ["Operación"] },
  cotizaciones:        { title: "Cotizaciones",          breadcrumbs: ["Operación"] },
  clientes:            { title: "Clientes",              breadcrumbs: ["Operación"] },
  operadores:          { title: "Operadores",            breadcrumbs: ["Operación"] },
  pagos:               { title: "Pagos",                 breadcrumbs: ["Operación"] },
  galeria:             { title: "Galería de medios",     breadcrumbs: ["Contenido"] },
  faq:                 { title: "FAQ",                   breadcrumbs: ["Contenido"] },
  testimonios:         { title: "Testimonios",           breadcrumbs: ["Contenido"] },
  paginas:             { title: "Páginas",               breadcrumbs: ["Contenido"] },
  configuracion:       { title: "Configuración",         breadcrumbs: ["Sistema"]   },
  "usuarios-cms":      { title: "Usuarios CMS",          breadcrumbs: ["Sistema"]   },
  logs:                { title: "Logs de auditoría",     breadcrumbs: ["Sistema"]   },
  "mis-tours":         { title: "Mis Tours" },
  "mi-disponibilidad": { title: "Mi Disponibilidad" },
  "mis-reservas":      { title: "Mis Reservas" },
  "mi-perfil":         { title: "Mi Perfil" },
};

/* ── Role switcher (demo only) ─────────────────────────── */
function RoleSwitcher({ role, onSwitch }: { role: UserRole; onSwitch: (r: UserRole) => void }) {
  return (
    <div style={{
      position: "fixed", bottom: 16, right: 16, zIndex: 300,
      background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8,
      padding: "8px 12px", boxShadow: "0 4px 16px rgba(0,0,0,.1)",
      fontFamily: "Inter, sans-serif",
    }}>
      <div style={{ fontSize: 9, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginBottom: 4 }}>
        Vista demo
      </div>
      <div style={{ display: "flex", gap: 4 }}>
        {(["admin", "staff", "operator"] as UserRole[]).map(r => (
          <button key={r} onClick={() => onSwitch(r)} style={{
            padding: "4px 8px", borderRadius: 4, border: "none",
            background: role === r ? "#006CFE" : "#F1F5F9",
            color: role === r ? "#FFFFFF" : "#475569",
            fontSize: 11, fontWeight: role === r ? 600 : 400,
            cursor: "pointer", textTransform: "capitalize",
          }}>
            {r}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Page renderer ─────────────────────────────────────── */
function PageContent({
  page, userRole, onNavigate, onEditTour,
}: {
  page: string;
  userRole: UserRole;
  onNavigate: (p: Page) => void;
  onEditTour: (id: string) => void;
}) {
  /* Operator-specific overrides */
  if (userRole === "operator") {
    switch (page) {
      case "dashboard": return <OperadorDashboard />;
      case "mis-tours":
      case "tours":
        return <Tours onEditTour={onEditTour} />;
      case "mi-disponibilidad":
      case "disponibilidad":
        return <Disponibilidad />;
      case "mis-reservas":
      case "reservas":
        return <Reservas />;
      case "mi-perfil":
        return <MiPerfil />;
      default:
        return <StubPage title="Acceso restringido" icon="🔒" description="No tienes permisos para acceder a esta sección. Contacta a Random Trips si crees que es un error." />;
    }
  }

  /* Admin / Staff */
  switch (page) {
    case "dashboard":      return <Dashboard onNavigate={onNavigate} />;
    case "destinos":       return <Destinos />;
    case "experiencias":   return <Experiencias />;
    case "tours":          return <Tours onEditTour={onEditTour} />;
    case "disponibilidad": return <Disponibilidad />;
    case "reservas":       return <Reservas />;
    case "cotizaciones":   return <Cotizaciones />;
    case "clientes":       return <Clientes />;
    case "operadores":     return <Operadores />;
    case "pagos":          return <Pagos />;
    case "galeria":        return <Galeria />;
    case "faq":            return <FAQ />;
    case "testimonios":    return <Testimonios />;
    case "paginas":        return <Paginas />;
    case "configuracion":  return <Configuracion />;
    case "usuarios-cms":   return <UsuariosCMS />;
    case "logs":           return <LogsAuditoria />;
    case "mi-perfil":      return <MiPerfil />;
    default:               return null;
  }
}

/* ── App ───────────────────────────────────────────────── */
export default function App() {
  const [currentPage, setCurrentPage]   = useState<string>("dashboard");
  const [userRole, setUserRole]         = useState<UserRole>("admin");
  const [editingTourId, setEditingTourId] = useState<string | null>(null);

  const isEditorOpen = currentPage === "tour-editor";
  const meta = PAGE_META[currentPage] ?? { title: currentPage };

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    setEditingTourId(null);
  };

  const handleEditTour = (id: string) => {
    setEditingTourId(id);
    setCurrentPage("tour-editor");
  };

  const handleRoleSwitch = (role: UserRole) => {
    setUserRole(role);
    setCurrentPage("dashboard");
    setEditingTourId(null);
  };

  return (
    <div style={{ background: "#F7F8FA", minHeight: "100vh", fontFamily: "Inter, sans-serif" }}>
      <Toaster position="top-right" richColors />

      <Sidebar
        currentPage={isEditorOpen ? "tours" : currentPage as Page}
        onNavigate={handleNavigate}
        userRole={userRole}
        userName={userRole === "operator" ? "Carlos Domínguez" : "Alejandra Torres"}
      />

      <div style={{ marginLeft: 240, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {!isEditorOpen && (
          <TopBar
            title={meta.title}
            breadcrumbs={meta.breadcrumbs}
            userName={userRole === "operator" ? "Carlos Domínguez" : "Alejandra Torres"}
            userRole={userRole === "admin" ? "Administrador" : userRole === "staff" ? "Staff" : "Operador"}
          />
        )}

        <main style={{ flex: 1, padding: isEditorOpen ? "20px 28px 0" : "24px 28px", maxWidth: 1440 }}>
          {isEditorOpen ? (
            <TourEditor onBack={() => { setCurrentPage("tours"); setEditingTourId(null); }} tourId={editingTourId ?? undefined} />
          ) : (
            <PageContent
              page={currentPage}
              userRole={userRole}
              onNavigate={handleNavigate}
              onEditTour={handleEditTour}
            />
          )}
        </main>
      </div>

      <RoleSwitcher role={userRole} onSwitch={handleRoleSwitch} />
    </div>
  );
}
