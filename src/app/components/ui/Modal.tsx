import { X } from "lucide-react";
import { useEffect } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  footer?: React.ReactNode;
}

const sizeMap = { sm: 400, md: 560, lg: 760 };

export function Modal({ open, onClose, title, children, size = "md", footer }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24,
      }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div style={{
        position: "absolute", inset: 0,
        background: "rgba(15, 23, 42, 0.4)",
        backdropFilter: "blur(2px)",
      }} />

      {/* Dialog */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: sizeMap[size],
          background: "#FFFFFF",
          borderRadius: 8,
          boxShadow: "0 20px 60px rgba(0,0,0,.15)",
          display: "flex",
          flexDirection: "column",
          maxHeight: "90vh",
          fontFamily: "Inter, sans-serif",
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 20px",
          borderBottom: "1px solid #E5E7EB",
          flexShrink: 0,
        }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: "#0F172A", margin: 0 }}>{title}</h2>
          <button
            onClick={onClose}
            style={{
              width: 28, height: 28, borderRadius: 6,
              border: "1px solid #E5E7EB", background: "#FFFFFF",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <X size={14} color="#94A3B8" />
          </button>
        </div>

        {/* Body */}
        <div style={{ overflowY: "auto", padding: "20px", flex: 1 }}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div style={{
            padding: "14px 20px",
            borderTop: "1px solid #E5E7EB",
            display: "flex", justifyContent: "flex-end", gap: 8,
            flexShrink: 0,
          }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export function Btn({
  children,
  variant = "primary",
  size = "md",
  onClick,
  disabled,
  type = "button",
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md";
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  const styles: Record<string, React.CSSProperties> = {
    primary: { background: "#006CFE", color: "#FFFFFF", border: "1px solid #006CFE" },
    secondary: { background: "#FFFFFF", color: "#475569", border: "1px solid #E5E7EB" },
    danger: { background: "#F13540", color: "#FFFFFF", border: "1px solid #F13540" },
    ghost: { background: "transparent", color: "#475569", border: "1px solid transparent" },
  };
  const pad = size === "sm" ? "6px 12px" : "8px 16px";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: pad,
        borderRadius: 6,
        fontSize: size === "sm" ? 12 : 13,
        fontWeight: 500,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        fontFamily: "Inter, sans-serif",
        display: "inline-flex", alignItems: "center", gap: 6,
        transition: "opacity 0.1s",
        ...styles[variant],
      }}
    >
      {children}
    </button>
  );
}
