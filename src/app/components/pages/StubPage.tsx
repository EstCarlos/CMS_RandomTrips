import { Construction } from "lucide-react";

interface StubPageProps {
  title: string;
  description?: string;
  icon?: string;
}

export function StubPage({ title, description, icon = "🚧" }: StubPageProps) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: 400,
      gap: 16,
      fontFamily: "Inter, sans-serif",
    }}>
      <div style={{
        width: 64, height: 64, borderRadius: 16,
        background: "#F1F5F9",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 28,
      }}>
        {icon}
      </div>
      <div style={{ textAlign: "center" }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: "#0F172A", margin: "0 0 8px" }}>{title}</h2>
        <p style={{ fontSize: 13, color: "#94A3B8", margin: 0, maxWidth: 400 }}>
          {description || "Esta sección está en desarrollo. Pronto estará disponible con todas sus funcionalidades."}
        </p>
      </div>
      <div style={{
        display: "flex", alignItems: "center", gap: 6,
        padding: "6px 14px", borderRadius: 20,
        background: "#FFFBEB",
        border: "1px solid #FDE68A",
        fontSize: 12, color: "#92400E", fontWeight: 500,
      }}>
        <Construction size={12} />
        En desarrollo
      </div>
    </div>
  );
}
